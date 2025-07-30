// config/pwa.ts
// Configuración centralizada para funcionalidades PWA

export const PWA_CONFIG = {
  // Configuración del Service Worker
  serviceWorker: {
    path: '/sw.js',
    scope: '/',
    updateViaCache: 'none' as RequestCache,
    skipWaiting: true,
    clientsClaim: true
  },

  // Configuración de cache
  cache: {
    static: {
      name: 'static-v2.0',
      maxAge: 365 * 24 * 60 * 60 * 1000, // 1 año
      maxEntries: 100
    },
    dynamic: {
      name: 'dynamic-v2.0',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 1 semana
      maxEntries: 50
    },
    data: {
      name: 'data-v2.0',
      maxAge: 24 * 60 * 60 * 1000, // 1 día
      maxEntries: 200
    },
    api: {
      name: 'api-v2.0',
      maxAge: 60 * 60 * 1000, // 1 hora
      maxEntries: 100
    }
  },

  // Configuración de sincronización
  sync: {
    background: {
      tag: 'background-sync',
      minDelay: 1000, // 1 segundo
      maxDelay: 60 * 1000 // 1 minuto
    },
    periodic: {
      weather: {
        tag: 'weather-sync',
        minInterval: 24 * 60 * 60 * 1000 // 24 horas
      },
      data: {
        tag: 'data-sync',
        minInterval: 6 * 60 * 60 * 1000 // 6 horas
      }
    }
  },

  // Configuración de notificaciones
  notifications: {
    default: {
      icon: '/web-app-manifest-192x192.png',
      badge: '/web-app-manifest-192x192.png',
      tag: 'boattrip-notification',
      requireInteraction: false,
      silent: false
    },
    types: {
      update: {
        title: 'BoatTrip Planner Actualizado',
        body: 'Hay una nueva versión disponible',
        tag: 'update-notification',
        requireInteraction: true
      },
      offline: {
        title: 'Modo Offline',
        body: 'La aplicación funciona sin conexión',
        tag: 'offline-notification'
      },
      sync: {
        title: 'Sincronización Completada',
        body: 'Los datos se han sincronizado correctamente',
        tag: 'sync-notification'
      }
    }
  },

  // Configuración de instalación
  install: {
    prompt: {
      delay: 3000, // 3 segundos
      showOnMobile: true,
      showOnDesktop: true,
      dismissDuration: 24 * 60 * 60 * 1000 // 1 día
    },
    features: [
      'Funciona offline',
      'Acceso rápido',
      'Sincronización automática',
      'Notificaciones push'
    ]
  },

  // Configuración de IndexedDB
  indexedDB: {
    name: 'BoatTripOfflineDB',
    version: 1,
    stores: {
      offlineForms: {
        keyPath: 'id',
        indexes: [
          { name: 'timestamp', keyPath: 'timestamp' },
          { name: 'synced', keyPath: 'synced' }
        ]
      },
      userPreferences: {
        keyPath: 'id',
        indexes: [
          { name: 'category', keyPath: 'category' }
        ]
      },
      weatherCache: {
        keyPath: 'location',
        indexes: [
          { name: 'timestamp', keyPath: 'timestamp' },
          { name: 'expires', keyPath: 'expires' }
        ]
      },
      boatData: {
        keyPath: 'id',
        indexes: [
          { name: 'type', keyPath: 'type' },
          { name: 'location', keyPath: 'location' }
        ]
      },
      tripHistory: {
        keyPath: 'id',
        indexes: [
          { name: 'timestamp', keyPath: 'timestamp' },
          { name: 'status', keyPath: 'status' }
        ]
      }
    }
  },

  // Configuración de estrategias de cache
  strategies: {
    networkFirst: {
      cacheName: 'api-v2.0',
      networkTimeoutSeconds: 3,
      maxEntries: 100
    },
    cacheFirst: {
      cacheName: 'static-v2.0',
      maxEntries: 100
    },
    staleWhileRevalidate: {
      cacheName: 'dynamic-v2.0',
      maxEntries: 50
    },
    cacheOnly: {
      cacheName: 'static-v2.0'
    }
  },

  // Configuración de recursos críticos
  criticalResources: [
    '/',
    '/index.html',
    '/apple-touch-icon.png',
    '/favicon.ico',
    '/web-app-manifest-192x192.png',
    '/web-app-manifest-512x512.png'
  ],

  // Configuración de datos críticos
  criticalData: [
    '/data/boatModels.ts',
    '/data/ports.ts',
    '/constants.ts'
  ],

  // Configuración de endpoints de API
  apiEndpoints: [
    '/api/weather',
    '/api/ports',
    '/api/boats',
    '/api/recommendations'
  ],

  // Configuración de limpieza automática
  cleanup: {
    interval: 24 * 60 * 60 * 1000, // 1 día
    maxAge: {
      static: 365 * 24 * 60 * 60 * 1000, // 1 año
      dynamic: 7 * 24 * 60 * 60 * 1000, // 1 semana
      data: 24 * 60 * 60 * 1000, // 1 día
      api: 60 * 60 * 1000 // 1 hora
    }
  }
};

// Tipos para la configuración
export interface PWACacheConfig {
  name: string;
  maxAge: number;
  maxEntries: number;
}

export interface PWASyncConfig {
  background: {
    tag: string;
    minDelay: number;
    maxDelay: number;
  };
  periodic: {
    weather: {
      tag: string;
      minInterval: number;
    };
    data: {
      tag: string;
      minInterval: number;
    };
  };
}

export interface PWANotificationConfig {
  default: {
    icon: string;
    badge: string;
    tag: string;
    requireInteraction: boolean;
    silent: boolean;
  };
  types: {
    update: {
      title: string;
      body: string;
      tag: string;
      requireInteraction: boolean;
    };
    offline: {
      title: string;
      body: string;
      tag: string;
    };
    sync: {
      title: string;
      body: string;
      tag: string;
    };
  };
}

export default PWA_CONFIG; 