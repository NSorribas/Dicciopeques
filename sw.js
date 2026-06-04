// DiccioPeques — Service Worker
// Estrategia: Cache-first para assets, Network-first para datos de Supabase

const CACHE_NAME = 'dicciopeques-v3';
const STATIC_CACHE = 'dicciopeques-static-v3';
const DATA_CACHE = 'dicciopeques-data-v3';

// Assets estáticos para cachear al instalar (paths relativos para GitHub Pages)
const STATIC_ASSETS = [
  './',
  './index.html',
  './admin.html',
  './assets/style.css',
  './assets/admin.css',
  './assets/app.js',
  './assets/admin.js',
  './assets/favicon.svg',
  './assets/icons/icon-192x192.png',
  './assets/icons/icon-512x512.png',
  './assets/data/diccionario.json',
  './manifest.json'
];

// Dominios de datos dinámicos (Supabase)
const DATA_ORIGINS = [
  'https://leivaafvepovjrkzntxr.supabase.co'
];

// Instalación: pre-cache de assets estáticos
self.addEventListener('install', (event) => {
  console.log('[SW] Instalando service worker...');
  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) => {
      console.log('[SW] Pre-cacheando assets estáticos');
      return cache.addAll(STATIC_ASSETS);
    }).then(() => {
      return self.skipWaiting();
    })
  );
});

// Activación: limpiar caches viejas
self.addEventListener('activate', (event) => {
  console.log('[SW] Activando service worker...');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== STATIC_CACHE && name !== DATA_CACHE)
          .map((name) => {
            console.log('[SW] Eliminando cache vieja:', name);
            return caches.delete(name);
          })
      );
    }).then(() => {
      return self.clients.claim();
    })
  );
});

// Fetch: estrategia según tipo de recurso
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Solo manejar requests GET
  if (request.method !== 'GET') return;

  // Ignorar requests de extensiones del navegador
  if (url.protocol === 'chrome-extension:') return;

  // Supabase: Network-first con fallback a cache
  if (DATA_ORIGINS.some((origin) => url.origin === new URL(origin).origin)) {
    event.respondWith(networkFirstWithFallback(request));
    return;
  }

  // Assets estáticos: Cache-first, luego network
  event.respondWith(cacheFirst(request));
});

// Cache-first para assets estáticos
async function cacheFirst(request) {
  const cached = await caches.match(request);
  if (cached) {
    // Actualizar cache en background (stale-while-revalidate)
    updateCacheInBackground(request);
    return cached;
  }

  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(STATIC_CACHE);
      cache.put(request, response.clone());
    }
    return response;
  } catch (error) {
    // Si es navegación y estamos offline, devolver index.html cacheado
    if (request.mode === 'navigate') {
      const fallback = await caches.match('./index.html');
      if (fallback) return fallback;
    }
    return new Response('Offline', { status: 503, statusText: 'Sin conexión' });
  }
}

// Network-first para datos de Supabase
async function networkFirstWithFallback(request) {
  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(DATA_CACHE);
      cache.put(request, response.clone());
    }
    return response;
  } catch (error) {
    // Si no hay red, usar cache de datos
    const cached = await caches.match(request);
    if (cached) return cached;

    // Si es una consulta de palabras y no hay cache, no hay mucho que hacer
    // La app ya tiene su propio fallback a diccionario.json
    return new Response(JSON.stringify({ error: 'Sin conexión' }), {
      status: 503,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

// Actualizar cache en background (stale-while-revalidate)
async function updateCacheInBackground(request) {
  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(STATIC_CACHE);
      cache.put(request, response.clone());
    }
  } catch (error) {
    // Silently fail — ya tenemos la versión cacheada
  }
}

// ============================================
// Notificaciones Push
// ============================================

self.addEventListener('push', (event) => {
  console.log('[SW] Push recibido');

  let data = {
    title: 'DiccioPeques',
    body: '¡Descubrí la palabra del día!',
    icon: './assets/icons/icon-192x192.png',
    badge: './assets/icons/icon-192x192.png',
    url: './index.html'
  };

  if (event.data) {
    try {
      const parsed = event.data.json();
      data = { ...data, ...parsed };
    } catch (e) {
      data.body = event.data.text() || data.body;
    }
  }

  const options = {
    body: data.body,
    icon: data.icon,
    badge: data.badge,
    vibrate: [100, 50, 100],
    data: {
      url: data.url
    },
    actions: [
      { action: 'open', title: 'Ver palabra' },
      { action: 'close', title: 'Cerrar' }
    ]
  };

  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});

// Manejar click en notificación
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  if (event.action === 'close') return;

  const urlToOpen = event.notification.data?.url || './index.html';

  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      // Si ya hay una ventana abierta, enfocarla
      for (const client of clientList) {
        if (client.url.includes('index.html') && 'focus' in client) {
          return client.focus();
        }
      }
      // Si no, abrir nueva ventana
      return self.clients.openWindow(urlToOpen);
    })
  );
});

// Escuchar mensajes desde la app
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }

  if (event.data && event.data.type === 'CLEAR_CACHE') {
    caches.keys().then((names) => {
      Promise.all(names.map((name) => caches.delete(name)));
    });
  }
});
