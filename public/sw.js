const CACHE_NAME = 'boattrip-planner-v1.5';
const STATIC_CACHE = 'static-v1.5';
const DYNAMIC_CACHE = 'dynamic-v1.5';

// Resources to cache immediately
const STATIC_RESOURCES = [
  '/',
  '/index.html',
  '/apple-touch-icon.png',
  '/favicon.ico',
  '/favicon-96x96.png',
  '/web-app-manifest-192x192.png',
  '/web-app-manifest-512x512.png'
];

// Install event - cache static resources
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then((cache) => {
        console.log('Caching static resources');
        return cache.addAll(STATIC_RESOURCES);
      })
      .then(() => self.skipWaiting())
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
              console.log('Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => self.clients.claim())
  );
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }

  // Skip development server requests
  if (url.hostname === 'localhost' || url.port) {
    return;
  }

  // Handle API requests (don't cache)
  if (url.pathname.startsWith('/api/')) {
    return;
  }

  // Handle static assets with proper headers
  if (url.pathname.match(/\.(js|css|png|jpg|jpeg|gif|svg|ico|woff|woff2|ttf|eot)$/)) {
    event.respondWith(
      caches.match(request)
        .then((response) => {
          if (response) {
            return response;
          }
          return fetch(request, {
            headers: {
              'Accept': request.headers.get('Accept') || '*/*',
              'Accept-Encoding': 'gzip, deflate, br'
            }
          })
            .then((fetchResponse) => {
              // Cache successful responses
              if (fetchResponse.status === 200) {
                const responseClone = fetchResponse.clone();
                caches.open(DYNAMIC_CACHE)
                  .then((cache) => {
                    cache.put(request, responseClone);
                  });
              }
              return fetchResponse;
            })
            .catch((error) => {
              console.error('Fetch failed for:', request.url, error);
              return new Response('Network error', { status: 503 });
            });
        })
    );
    return;
  }

  // Handle HTML pages
  if (request.headers.get('accept')?.includes('text/html')) {
    event.respondWith(
      fetch(request, {
        headers: {
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
          'Accept-Encoding': 'gzip, deflate, br'
        }
      })
        .then((response) => {
          // Cache successful responses
          if (response.status === 200) {
            const responseClone = response.clone();
            caches.open(DYNAMIC_CACHE)
              .then((cache) => {
                cache.put(request, responseClone);
              });
          }
          return response;
        })
        .catch(() => {
          // Fallback to cached version
          return caches.match(request)
            .then((response) => {
              if (response) {
                return response;
              }
              // Fallback to index.html for SPA routing
              return caches.match('/index.html');
            });
        })
    );
    return;
  }

  // Default strategy for other requests
  event.respondWith(
    caches.match(request)
      .then((response) => {
        return response || fetch(request, {
          headers: {
            'Accept': request.headers.get('Accept') || '*/*',
            'Accept-Encoding': 'gzip, deflate, br'
          }
        });
      })
  );
});

// Background sync for offline functionality
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-sync') {
    event.waitUntil(doBackgroundSync());
  }
});

async function doBackgroundSync() {
  try {
    // Handle any pending background tasks
    console.log('Background sync completed');
  } catch (error) {
    console.error('Background sync failed:', error);
  }
} 