// Safari-Safe Service Worker - Versión simplificada
const CACHE_NAME = 'boattrip-planner-safari-v1.0';
const STATIC_CACHE = 'static-safari-v1.0';

// Recursos críticos mínimos
const STATIC_RESOURCES = [
  '/',
  '/index.html',
  '/apple-touch-icon.png',
  '/favicon.ico'
];

// Install event - Solo cache básico
self.addEventListener('install', (event) => {
  console.log('Safari Service Worker: Instalando...');
  
  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) => {
      console.log('Safari Service Worker: Cacheando recursos básicos');
      return cache.addAll(STATIC_RESOURCES);
    })
  );
});

// Activate event - Sin clients.claim()
self.addEventListener('activate', (event) => {
  console.log('Safari Service Worker: Activando...');
  
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== STATIC_CACHE) {
            console.log('Safari Service Worker: Eliminando cache viejo:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Fetch event - Estrategia mínima
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  if (request.method !== 'GET') {
    return;
  }

  if (url.hostname === 'localhost' || url.port) {
    return;
  }

  event.respondWith(
    fetch(request)
      .then((response) => {
        if (response.ok) {
          const responseClone = response.clone();
          caches.open(STATIC_CACHE).then((cache) => {
            cache.put(request, responseClone);
          });
        }
        return response;
      })
      .catch(() => {
        return caches.match(request).then((cachedResponse) => {
          if (cachedResponse) {
            return cachedResponse;
          }
          if (request.headers.get('accept')?.includes('text/html')) {
            return caches.match('/index.html');
          }
          return new Response('Not available offline', { status: 404 });
        });
      })
  );
});

console.log('Safari Service Worker: Cargado y listo'); 