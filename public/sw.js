const CACHE_NAME = 'boattrip-planner-v1.0.2';

// Install event - minimal caching
self.addEventListener('install', (event) => {
  console.log('Service Worker installing...');
  self.skipWaiting();
});

// Fetch event - network first for everything
self.addEventListener('fetch', (event) => {
  // Always try network first, fallback to cache only if network fails
  event.respondWith(
    fetch(event.request)
      .catch(() => {
        // Only fallback to cache if network completely fails
        return caches.match(event.request);
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('Service Worker activating...');
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
    }).then(() => {
      // Take control immediately
      return self.clients.claim();
    })
  );
}); 