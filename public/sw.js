// Service Worker para Boattrip-Planner
// Optimización de cache y rendimiento

const CACHE_NAME = 'boattrip-planner-v1.2.0';
const STATIC_CACHE = 'static-v1.2.0';
const DYNAMIC_CACHE = 'dynamic-v1.2.0';

// Recursos críticos para cache inmediato
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/favicon.svg',
  '/favicon.ico',
  '/favicon-96x96.png',
  '/site.webmanifest',
  '/browserconfig.xml',
  '/web-app-manifest-192x192.png',
  '/web-app-manifest-512x512.png'
];

// Recursos de terceros para cache
const THIRD_PARTY_ASSETS = [
  'https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap'
];

// Estrategia: Cache First para recursos estáticos
const cacheFirst = async (request) => {
  const cache = await caches.open(STATIC_CACHE);
  const cachedResponse = await cache.match(request);
  
  if (cachedResponse) {
    return cachedResponse;
  }
  
  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    // Fallback para recursos críticos
    if (request.url.includes('/assets/')) {
      return new Response('Resource not available', { status: 404 });
    }
    throw error;
  }
};

// Estrategia: Network First para datos dinámicos
const networkFirst = async (request) => {
  const cache = await caches.open(DYNAMIC_CACHE);
  
  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    const cachedResponse = await cache.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    throw error;
  }
};

// Estrategia: Stale While Revalidate para recursos no críticos
const staleWhileRevalidate = async (request) => {
  const cache = await caches.open(DYNAMIC_CACHE);
  const cachedResponse = await cache.match(request);
  
  const fetchPromise = fetch(request).then(networkResponse => {
    if (networkResponse.ok) {
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  }).catch(() => cachedResponse);
  
  return cachedResponse || fetchPromise;
};

// Instalación del Service Worker
self.addEventListener('install', (event) => {
  console.log('Service Worker installing...');
  
  event.waitUntil(
    Promise.all([
      // Cachear recursos estáticos (con manejo de errores)
      caches.open(STATIC_CACHE).then(cache => {
        console.log('Caching static assets...');
        return cache.addAll(STATIC_ASSETS).catch(error => {
          console.warn('Some static assets failed to cache:', error);
          return Promise.resolve();
        });
      }),
      
      // Cachear recursos de terceros (con manejo de errores)
      caches.open(DYNAMIC_CACHE).then(cache => {
        console.log('Caching third-party assets...');
        return cache.addAll(THIRD_PARTY_ASSETS).catch(error => {
          console.warn('Some third-party assets failed to cache:', error);
          return Promise.resolve();
        });
      })
    ])
  );
  
  // Activar inmediatamente
  self.skipWaiting();
});

// Activación del Service Worker
self.addEventListener('activate', (event) => {
  console.log('Service Worker activating...');
  
  event.waitUntil(
    Promise.all([
      // Limpiar caches antiguos
      caches.keys().then(cacheNames => {
        return Promise.all(
          cacheNames.map(cacheName => {
            if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
              console.log('Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      }),
      
      // Tomar control inmediatamente
      self.clients.claim()
    ])
  );
});

// Interceptar solicitudes
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);
  
  // Ignorar solicitudes no GET
  if (request.method !== 'GET') {
    return;
  }
  
  // Estrategias de cache según el tipo de recurso
  if (STATIC_ASSETS.includes(url.pathname) || 
      request.url.includes('/assets/') ||
      request.url.includes('/images/')) {
    // Cache First para recursos estáticos
    event.respondWith(cacheFirst(request));
  } else if (request.url.includes('/api/') || 
             request.url.includes('/blog/')) {
    // Network First para datos dinámicos
    event.respondWith(networkFirst(request));
  } else if (request.url.includes('fonts.googleapis.com') ||
             request.url.includes('images.unsplash.com')) {
    // Stale While Revalidate para recursos externos
    event.respondWith(staleWhileRevalidate(request));
  } else {
    // Estrategia por defecto
    event.respondWith(networkFirst(request));
  }
});

// Manejo de mensajes
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  if (event.data && event.data.type === 'GET_VERSION') {
    event.ports[0].postMessage({ version: CACHE_NAME });
  }
});

// Manejo de errores
self.addEventListener('error', (event) => {
  console.error('Service Worker error:', event.error);
});

// Manejo de rechazos de promesas no manejados
self.addEventListener('unhandledrejection', (event) => {
  console.error('Service Worker unhandled rejection:', event.reason);
});

// Optimización: Precachear recursos críticos en background
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-sync') {
    event.waitUntil(
      caches.open(DYNAMIC_CACHE).then(cache => {
        // Precachear recursos adicionales en background
        return cache.addAll([
          '/blog/',
          '/destinos/',
          '/productos/'
        ]);
      })
    );
  }
});

// Optimización: Manejo de push notifications
self.addEventListener('push', (event) => {
  if (event.data) {
    const data = event.data.json();
    const options = {
      body: data.body,
      icon: '/alex5.svg',
      badge: '/alex5.svg',
      vibrate: [100, 50, 100],
      data: {
        dateOfArrival: Date.now(),
        primaryKey: 1
      },
      actions: [
        {
          action: 'explore',
          title: 'Ver más',
          icon: '/alex5.svg'
        },
        {
          action: 'close',
          title: 'Cerrar',
          icon: '/alex5.svg'
        }
      ]
    };
    
    event.waitUntil(
      self.registration.showNotification(data.title, options)
    );
  }
});

// Optimización: Manejo de clicks en notifications
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  
  if (event.action === 'explore') {
    event.waitUntil(
      clients.openWindow('/')
    );
  }
}); 