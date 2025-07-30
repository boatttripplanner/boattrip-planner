const CACHE_NAME = 'boattrip-planner-v2.0';
const STATIC_CACHE = 'static-v2.0';
const DYNAMIC_CACHE = 'dynamic-v2.0';
const DATA_CACHE = 'data-v2.0';
const API_CACHE = 'api-v2.0';

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

// Critical data to cache for offline functionality
const CRITICAL_DATA = [
  '/data/boatModels.ts',
  '/data/ports.ts',
  '/constants.ts'
];

// API endpoints to cache for offline use
const API_ENDPOINTS = [
  '/api/weather',
  '/api/ports',
  '/api/boats',
  '/api/recommendations'
];

// Install event - cache static resources and critical data
self.addEventListener('install', (event) => {
  event.waitUntil(
    Promise.all([
      // Cache static resources
      caches.open(STATIC_CACHE).then((cache) => {
        console.log('Caching static resources');
        return cache.addAll(STATIC_RESOURCES);
      }),
      // Cache critical data
      caches.open(DATA_CACHE).then((cache) => {
        console.log('Caching critical data');
        return cache.addAll(CRITICAL_DATA);
      })
    ]).then(() => self.skipWaiting())
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (![STATIC_CACHE, DYNAMIC_CACHE, DATA_CACHE, API_CACHE].includes(cacheName)) {
              console.log('Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => self.clients.claim())
  );
});

// Background sync for offline functionality
let syncInProgress = false;

self.addEventListener('sync', (event) => {
  console.log('Background sync triggered:', event.tag);
  
  // Prevent multiple simultaneous sync operations
  if (syncInProgress) {
    console.log('Sync already in progress, skipping:', event.tag);
    return;
  }
  
  if (event.tag === 'background-sync') {
    syncInProgress = true;
    event.waitUntil(
      doBackgroundSync().finally(() => {
        syncInProgress = false;
      })
    );
  } else if (event.tag === 'weather-sync') {
    event.waitUntil(syncWeatherData());
  } else if (event.tag === 'form-sync') {
    event.waitUntil(syncOfflineForms());
  }
});

// Push notification event
self.addEventListener('push', (event) => {
  console.log('Push notification received:', event);
  
  const options = {
    body: event.data ? event.data.text() : 'Nueva actualización disponible',
    icon: '/web-app-manifest-192x192.png',
    badge: '/web-app-manifest-96x96.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {
        action: 'explore',
        title: 'Ver detalles',
        icon: '/web-app-manifest-192x192.png'
      },
      {
        action: 'close',
        title: 'Cerrar',
        icon: '/web-app-manifest-192x192.png'
      }
    ]
  };

  event.waitUntil(
    self.registration.showNotification('BoatTrip Planner', options)
  );
});

// Notification click event
self.addEventListener('notificationclick', (event) => {
  console.log('Notification clicked:', event);
  
  event.notification.close();

  if (event.action === 'explore') {
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});

// Fetch event - intelligent caching strategy
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

  // Handle API requests with intelligent caching
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(handleApiRequest(request));
    return;
  }

  // Handle data files with aggressive caching
  if (url.pathname.includes('/data/') || url.pathname.includes('/constants')) {
    event.respondWith(handleDataRequest(request));
    return;
  }

  // Handle static assets with proper headers
  if (url.pathname.match(/\.(js|css|png|jpg|jpeg|gif|svg|ico|woff|woff2|ttf|eot)$/)) {
    event.respondWith(handleStaticAsset(request));
    return;
  }

  // Handle HTML pages
  if (request.headers.get('accept')?.includes('text/html')) {
    event.respondWith(handleHtmlRequest(request));
    return;
  }

  // Default strategy for other requests
  event.respondWith(handleDefaultRequest(request));
});

// API request handler with intelligent caching
async function handleApiRequest(request) {
  const cache = await caches.open(API_CACHE);
  
  try {
    // Try network first
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      // Cache successful responses
      const responseClone = networkResponse.clone();
      cache.put(request, responseClone);
      return networkResponse;
    }
  } catch (error) {
    console.log('Network failed for API request:', request.url);
  }

  // Fallback to cache
  const cachedResponse = await cache.match(request);
  if (cachedResponse) {
    return cachedResponse;
  }

  // Return offline response for API requests
  return new Response(JSON.stringify({
    offline: true,
    message: 'No hay conexión a internet. Usando datos en caché.',
    timestamp: Date.now()
  }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  });
}

// Data request handler with aggressive caching
async function handleDataRequest(request) {
  const cache = await caches.open(DATA_CACHE);
  
  // Check cache first for data files
  const cachedResponse = await cache.match(request);
  if (cachedResponse) {
    // Update cache in background
    fetch(request).then(response => {
      if (response.ok) {
        cache.put(request, response);
      }
    }).catch(() => {
      // Ignore background update errors
    });
    
    return cachedResponse;
  }

  // If not in cache, try network
  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      const responseClone = networkResponse.clone();
      cache.put(request, responseClone);
      return networkResponse;
    }
  } catch (error) {
    console.log('Network failed for data request:', request.url);
  }

  // Return error response
  return new Response('Data not available offline', { status: 404 });
}

// Static asset handler
async function handleStaticAsset(request) {
  const cache = await caches.open(DYNAMIC_CACHE);
  
  // Check cache first
  const cachedResponse = await cache.match(request);
  if (cachedResponse) {
    return cachedResponse;
  }

  // Try network
  try {
    const networkResponse = await fetch(request, {
      headers: {
        'Accept': request.headers.get('Accept') || '*/*',
        'Accept-Encoding': 'gzip, deflate, br'
      }
    });
    
    if (networkResponse.ok) {
      const responseClone = networkResponse.clone();
      cache.put(request, responseClone);
      return networkResponse;
    }
  } catch (error) {
    console.log('Network failed for static asset:', request.url);
  }

  return new Response('Asset not available offline', { status: 404 });
}

// HTML request handler
async function handleHtmlRequest(request) {
  const cache = await caches.open(DYNAMIC_CACHE);
  
  try {
    const networkResponse = await fetch(request, {
      headers: {
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Encoding': 'gzip, deflate, br'
      }
    });
    
    if (networkResponse.ok) {
      const responseClone = networkResponse.clone();
      cache.put(request, responseClone);
      return networkResponse;
    }
  } catch (error) {
    console.log('Network failed for HTML request:', request.url);
  }

  // Fallback to cached version
  const cachedResponse = await cache.match(request);
  if (cachedResponse) {
    return cachedResponse;
  }

  // Fallback to index.html for SPA routing
  return cache.match('/index.html');
}

// Default request handler
async function handleDefaultRequest(request) {
  const cache = await caches.open(DYNAMIC_CACHE);
  
  const cachedResponse = await cache.match(request);
  if (cachedResponse) {
    return cachedResponse;
  }

  try {
    const networkResponse = await fetch(request, {
      headers: {
        'Accept': request.headers.get('Accept') || '*/*',
        'Accept-Encoding': 'gzip, deflate, br'
      }
    });
    
    if (networkResponse.ok) {
      const responseClone = networkResponse.clone();
      cache.put(request, responseClone);
    }
    
    return networkResponse;
  } catch (error) {
    console.log('Network failed for request:', request.url);
    return new Response('Resource not available offline', { status: 404 });
  }
}

// Background sync functions
async function doBackgroundSync() {
  try {
    console.log('Starting background sync...');
    
    // Sync offline forms
    await syncOfflineForms();
    
    // Sync weather data
    await syncWeatherData();
    
    // Sync user preferences
    await syncUserPreferences();
    
    console.log('Background sync completed successfully');
  } catch (error) {
    console.error('Background sync failed:', error);
  }
}

async function syncOfflineForms() {
  try {
    // Check if we're in development mode (localhost)
    const isDevelopment = self.location.hostname === 'localhost' || self.location.hostname === '127.0.0.1';
    
    if (isDevelopment) {
      console.log('Skipping offline forms sync in development mode');
      return;
    }
    
    const offlineForms = await getOfflineForms();
    
    for (const form of offlineForms) {
      try {
        const response = await fetch('/api/trip-plan', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(form.data)
        });
        
        if (response.ok) {
          await removeOfflineForm(form.id);
          console.log('Synced offline form:', form.id);
        }
      } catch (error) {
        console.log('Failed to sync form:', form.id, error);
      }
    }
  } catch (error) {
    console.log('Offline forms sync failed (expected in development):', error.message);
  }
}

async function syncWeatherData() {
  try {
    // Check if we're in development mode (localhost)
    const isDevelopment = self.location.hostname === 'localhost' || self.location.hostname === '127.0.0.1';
    
    if (isDevelopment) {
      console.log('Skipping weather data sync in development mode');
      return;
    }
    
    const cache = await caches.open(API_CACHE);
    const weatherRequests = [
      '/api/weather/current',
      '/api/weather/forecast'
    ];
    
    for (const url of weatherRequests) {
      try {
        const response = await fetch(url);
        if (response.ok) {
          await cache.put(url, response.clone());
        }
      } catch (error) {
        console.log('Failed to sync weather data for:', url);
      }
    }
  } catch (error) {
    console.log('Weather data sync failed (expected in development):', error.message);
  }
}

async function syncUserPreferences() {
  try {
    // Sync user preferences from IndexedDB to server
    const preferences = await getUserPreferences();
    if (preferences) {
      // Check if we're in development mode (localhost)
      const isDevelopment = self.location.hostname === 'localhost' || self.location.hostname === '127.0.0.1';
      
      if (!isDevelopment) {
        // Only attempt to sync in production
        await fetch('/api/preferences', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(preferences)
        });
      } else {
        console.log('Skipping user preferences sync in development mode');
      }
    }
  } catch (error) {
    console.log('User preferences sync failed (expected in development):', error.message);
  }
}

// Helper functions for offline data management
async function getOfflineForms() {
  // This would typically use IndexedDB
  // For now, return empty array
  return [];
}

async function removeOfflineForm(formId) {
  // This would typically use IndexedDB
  console.log('Removing offline form:', formId);
}

async function getUserPreferences() {
  // This would typically use IndexedDB
  return null;
}

// Periodic background sync for weather updates
self.addEventListener('periodicsync', (event) => {
  if (event.tag === 'weather-update') {
    event.waitUntil(syncWeatherData());
  }
});

// Message handling for communication with main thread
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  if (event.data && event.data.type === 'CACHE_DATA') {
    cacheData(event.data.url, event.data.data);
  }
});

async function cacheData(url, data) {
  const cache = await caches.open(DATA_CACHE);
  const response = new Response(JSON.stringify(data), {
    headers: { 'Content-Type': 'application/json' }
  });
  await cache.put(url, response);
} 