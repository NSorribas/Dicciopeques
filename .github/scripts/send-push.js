/**
 * DiccioPeques — Enviar notificación push con la palabra del día
 * Ejecutado por GitHub Actions todos los días a las 8 AM (Argentina)
 */

const webpush = require('web-push');
const https = require('https');

// Configurar VAPID
webpush.setVapidDetails(
  process.env.VAPID_SUBJECT,
  process.env.VAPID_PUBLIC_KEY,
  process.env.VAPID_PRIVATE_KEY
);

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;

/**
 * Fetch helper para Supabase REST API
 */
function supabaseFetch(path) {
  return new Promise((resolve, reject) => {
    const url = new URL(`${SUPABASE_URL}/rest/v1${path}`);
    const options = {
      hostname: url.hostname,
      path: url.pathname + url.search,
      method: 'GET',
      headers: {
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json'
      }
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          reject(new Error(`Error parsing response: ${data}`));
        }
      });
    });

    req.on('error', reject);
    req.end();
  });
}

/**
 * Obtener la palabra del día (mismo algoritmo que la app)
 */
function getPalabraDelDia(palabras) {
  const hoy = new Date();
  // Usar UTC para consistencia con el cron de GitHub Actions
  const indice = (hoy.getUTCFullYear() * 366 + hoy.getUTCMonth() * 31 + hoy.getUTCDate()) % palabras.length;
  return palabras[indice];
}

/**
 * Enviar push a una suscripción
 */
async function sendPush(subscription, payload) {
  try {
    await webpush.sendNotification(subscription, JSON.stringify(payload));
    return { success: true };
  } catch (error) {
    // Si la suscripción expiró o fue revocada, marcar para limpiar
    const statusCode = error.statusCode || 0;
    if (statusCode === 410 || statusCode === 404) {
      console.log(`[PUSH] Suscripción expirada: ${subscription.endpoint.substring(0, 60)}...`);
      return { success: false, expired: true, endpoint: subscription.endpoint };
    }
    console.error(`[PUSH] Error enviando: ${error.message}`);
    return { success: false, expired: false };
  }
}

/**
 * Eliminar suscripción expirada de Supabase
 */
function deleteExpiredSubscription(endpoint) {
  return new Promise((resolve, reject) => {
    const url = new URL(`${SUPABASE_URL}/rest/v1/push_subscriptions?endpoint=eq.${encodeURIComponent(endpoint)}`);
    const options = {
      hostname: url.hostname,
      path: url.pathname + url.search,
      method: 'DELETE',
      headers: {
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=minimal'
      }
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve());
    });
    req.on('error', reject);
    req.end();
  });
}

/**
 * Función principal
 */
async function main() {
  console.log('=== DiccioPeques — Notificación Push ===');
  console.log(`Fecha: ${new Date().toISOString()}`);

  // Verificar si hay mensaje personalizado (desde el admin)
  const customTitle = process.env.CUSTOM_TITLE || '';
  const customBody = process.env.CUSTOM_BODY || '';

  let payload;

  if (customTitle || customBody) {
    // Mensaje personalizado desde el panel de admin
    payload = {
      title: customTitle || 'DiccioPeques',
      body: customBody || 'Notificación de prueba',
      icon: './assets/icons/icon-192x192.png',
      badge: './assets/icons/icon-192x192.png',
      url: './index.html'
    };
    console.log(`[MODO] Mensaje personalizado`);
    console.log(`  Título: ${payload.title}`);
    console.log(`  Cuerpo: ${payload.body}`);
  } else {
    // Palabra del día automática
    console.log('[1/3] Obteniendo palabras...');
    const palabras = await supabaseFetch('/palabras?select=palabra,categoria,definiciones(numero,texto)&definiciones.order=numero.asc&order=palabra.asc');

    if (!palabras || palabras.length === 0) {
      console.log('No hay palabras en la base de datos. Saliendo.');
      return;
    }

    const palabraDelDia = getPalabraDelDia(palabras);
    const primeraDef = palabraDelDia.definiciones && palabraDelDia.definiciones.length > 0
      ? palabraDelDia.definiciones[0].texto
      : '';

    payload = {
      title: '📖 Palabra del día',
      body: `${palabraDelDia.palabra} (${palabraDelDia.categoria}): ${primeraDef.substring(0, 100)}${primeraDef.length > 100 ? '...' : ''}`,
      icon: './assets/icons/icon-192x192.png',
      badge: './assets/icons/icon-192x192.png',
      url: './index.html'
    };

    console.log(`[MODO] Palabra del día: ${palabraDelDia.palabra}`);
  }

  // Obtener suscripciones y enviar
  console.log('Obteniendo suscripciones...');
  const subscriptions = await supabaseFetch('/push_subscriptions?select=endpoint,p256dh,auth');

  if (!subscriptions || subscriptions.length === 0) {
    console.log('No hay suscripciones push. Saliendo.');
    return;
  }

  console.log(`Enviando a ${subscriptions.length} suscripción(es)...`);

  let successCount = 0;
  let expiredCount = 0;

  for (const sub of subscriptions) {
    const pushSubscription = {
      endpoint: sub.endpoint,
      keys: {
        p256dh: sub.p256dh,
        auth: sub.auth
      }
    };

    const result = await sendPush(pushSubscription, payload);

    if (result.success) {
      successCount++;
    } else if (result.expired) {
      await deleteExpiredSubscription(result.endpoint);
      expiredCount++;
    }
  }

  console.log(`\n=== Resultado ===`);
  console.log(`Enviados: ${successCount}`);
  console.log(`Expirados (eliminados): ${expiredCount}`);
  console.log(`Fallidos: ${subscriptions.length - successCount - expiredCount}`);
}

main().catch(err => {
  console.error('Error fatal:', err);
  process.exit(1);
});
