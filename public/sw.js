const CACHE_NAME = 'boattrip-planner-v1.0.1'; // Updated version
const urlsToCache = [
  '/',
  '/index.html',
  '/favicon.ico',
  '/favicon.svg',
  '/apple-touch-icon.png',
  '/site.webmanifest'
];

// Install event - cache resources
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

// Fetch event - prioritize network over cache
self.addEventListener('fetch', (event) => {
  // Skip caching for HTML files and API calls
  if (event.request.url.includes('.html') || 
      event.request.url.includes('/api/') ||
      event.request.url.includes('?v=') ||
      event.request.url.includes('&v=')) {
    event.respondWith(
      fetch(event.request)
        .catch(() => {
          // Only fallback to cache if network fails
          return caches.match(event.request);
        })
    );
    return;
  }

  // For other resources, try network first, then cache
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // If successful, update cache
        if (response.status === 200) {
          const responseClone = response.clone();
          caches.open(CACHE_NAME)
            .then((cache) => {
              cache.put(event.request, responseClone);
            });
        }
        return response;
      })
      .catch(() => {
        // Fallback to cache if network fails
        return caches.match(event.request);
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Force update check on page load
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
}); 