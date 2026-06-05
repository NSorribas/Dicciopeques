/**
 * DiccioPeques — Enviar notificación push con la palabra del día
 * Ejecutado por GitHub Actions todos los días a las 6:10 PM (Argentina)
 */

const webpush = require('web-push');
const https = require('https');

// Verificar que las variables de entorno existen
const VAPID_SUBJECT = process.env.VAPID_SUBJECT;
const VAPID_PUBLIC_KEY = process.env.VAPID_PUBLIC_KEY;
const VAPID_PRIVATE_KEY = process.env.VAPID_PRIVATE_KEY;
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;

if (!VAPID_SUBJECT || !VAPID_PUBLIC_KEY || !VAPID_PRIVATE_KEY) {
  console.error('Error: Faltan variables de entorno VAPID (VAPID_SUBJECT, VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY)');
  process.exit(1);
}

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.error('Error: Faltan variables de entorno de Supabase (SUPABASE_URL, SUPABASE_ANON_KEY)');
  process.exit(1);
}

// Configurar VAPID
webpush.setVapidDetails(VAPID_SUBJECT, VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY);

/**
 * Fetch helper para Supabase REST API
 * Retorna { data, error } para manejar errores limpiamente
 */
function supabaseFetch(path) {
  return new Promise((resolve, reject) => {
    const fullUrl = `${SUPABASE_URL}/rest/v1${path}`;
    const url = new URL(fullUrl);
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
        console.log(`[SUPABASE] GET ${path} → HTTP ${res.statusCode}`);
        try {
          const parsed = JSON.parse(data);

          // Supabase devuelve errores como { message, code, ... } o { msg, ... }
          if (parsed && typeof parsed === 'object' && !Array.isArray(parsed) && (parsed.message || parsed.msg || parsed.error)) {
            console.error(`[SUPABASE] Error en respuesta: ${JSON.stringify(parsed)}`);
            resolve({ data: null, error: parsed });
            return;
          }

          // Si es un array o un objeto válido, devolver como data
          resolve({ data: parsed, error: null });
        } catch (e) {
          console.error(`[SUPABASE] Error parseando respuesta: ${data.substring(0, 200)}`);
          reject(new Error(`Error parsing response: ${data.substring(0, 200)}`));
        }
      });
    });

    req.on('error', (err) => {
      console.error(`[SUPABASE] Error de red: ${err.message}`);
      reject(err);
    });
    req.end();
  });
}

/**
 * Obtener la palabra del día (mismo algoritmo que la app)
 */
function getPalabraDelDia(palabras) {
  const hoy = new Date();
  // Mismo algoritmo que la app (usa hora local de Argentina, UTC-3)
  // El cron corre a las 21:10 UTC = 18:10 Argentina, así que getUTCDate
  // coincide con la fecha argentina (todavía no cambió de día)
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
      res.on('end', () => {
        console.log(`[SUPABASE] DELETE expired → HTTP ${res.statusCode}`);
        resolve();
      });
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
      url: customTitle ? './index.html' : './index.html'
    };
    console.log(`[MODO] Mensaje personalizado`);
    console.log(`  Título: ${payload.title}`);
    console.log(`  Cuerpo: ${payload.body}`);
  } else {
    // Palabra del día automática
    console.log('[1/3] Obteniendo palabras...');
    const { data: palabras, error: errPalabras } = await supabaseFetch('/palabras?select=palabra,categoria,definiciones(numero,texto)&definiciones.order=numero.asc&order=palabra.asc');

    if (errPalabras) {
      console.error('Error obteniendo palabras:', JSON.stringify(errPalabras));
      process.exit(1);
    }

    if (!palabras || !Array.isArray(palabras) || palabras.length === 0) {
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
      url: `./index.html#${encodeURIComponent(palabraDelDia.palabra)}`
    };

    console.log(`[MODO] Palabra del día: ${palabraDelDia.palabra}`);
    console.log(`  URL: ${payload.url}`);
  }

  // Obtener suscripciones y enviar
  console.log('Obteniendo suscripciones...');
  const { data: subscriptions, error: errSubs } = await supabaseFetch('/push_subscriptions?select=endpoint,p256dh,auth');

  if (errSubs) {
    console.error('Error obteniendo suscripciones:', JSON.stringify(errSubs));
    process.exit(1);
  }

  if (!subscriptions || !Array.isArray(subscriptions) || subscriptions.length === 0) {
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
