// public/sw-config.js
// ⚡ Configuración del Service Worker para PWA

const SW_CONFIG = {
  CACHE_VERSION: 'v2.0.0',
  CACHE_STRATEGIES: {
    STATIC: 'cache-first',
    DYNAMIC: 'network-first',
    API: 'stale-while-revalidate'
  },
  
  // Recursos críticos para cache inmediato
  CRITICAL_RESOURCES: [
    '/',
    '/index.html',
    '/assets/style.css',
    '/alex5.svg',
    '/favicon.ico'
  ],
  
  // Recursos de terceros para cache
  THIRD_PARTY_RESOURCES: [
    'https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap',
    'https://www.googletagmanager.com/gtag/js'
  ],
  
  // Estrategias de cache por tipo de recurso
  CACHE_RULES: {
    '/assets/': 'cache-first',
    '/api/': 'stale-while-revalidate',
    '/blog/': 'network-first',
    'https://images.unsplash.com/': 'cache-first'
  },
  
  // Configuración de offline
  OFFLINE_CONFIG: {
    ENABLE_OFFLINE: true,
    OFFLINE_PAGE: '/offline.html',
    SYNC_QUEUE: 'offline-actions'
  },
  
  // Configuración de push notifications
  PUSH_CONFIG: {
    ENABLE_PUSH: true,
    VAPID_PUBLIC_KEY: 'your-vapid-public-key-here'
  }
};

// Exportar para uso en el Service Worker
if (typeof module !== 'undefined' && module.exports) {
  module.exports = SW_CONFIG;
} else {
  window.SW_CONFIG = SW_CONFIG;
}
