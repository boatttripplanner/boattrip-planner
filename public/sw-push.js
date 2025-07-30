// Service Worker para Notificaciones Push de BoatTrip Planner
// Manejo de notificaciones push y sincronización en segundo plano

const CACHE_NAME = 'boattrip-push-v1.0';
const PUSH_CACHE = 'boattrip-push-cache-v1.0';

// Evento de instalación
self.addEventListener('install', (event) => {
  console.log('Push Service Worker: Instalando...');
  
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('Push Service Worker: Cache abierto');
      return cache.addAll([
        '/',
        '/index.html',
        '/manifest.json'
      ]);
    })
  );
  
  self.skipWaiting();
});

// Evento de activación
self.addEventListener('activate', (event) => {
  console.log('Push Service Worker: Activando...');
  
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME && cacheName !== PUSH_CACHE) {
            console.log('Push Service Worker: Eliminando cache antiguo:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  
  self.clients.claim();
});

// Evento de mensaje push
self.addEventListener('push', (event) => {
  console.log('Push Service Worker: Mensaje push recibido');
  
  let notificationData = {
    title: 'BoatTrip Planner',
    body: 'Nueva notificación',
    icon: '/favicon-96x96.png',
    badge: '/favicon-32x32.png',
    data: {},
    actions: [],
    tag: 'boattrip-notification',
    requireInteraction: false,
    silent: false
  };

  // Procesar datos del mensaje push
  if (event.data) {
    try {
      const pushData = event.data.json();
      notificationData = {
        ...notificationData,
        ...pushData
      };
    } catch (error) {
      console.error('Error parsing push data:', error);
    }
  }

  // Mostrar notificación
  event.waitUntil(
    self.registration.showNotification(notificationData.title, {
      body: notificationData.body,
      icon: notificationData.icon,
      badge: notificationData.badge,
      data: notificationData.data,
      actions: notificationData.actions,
      tag: notificationData.tag,
      requireInteraction: notificationData.requireInteraction,
      silent: notificationData.silent,
      vibrate: [200, 100, 200],
      sound: notificationData.silent ? null : 'default'
    }).then(() => {
      // Guardar notificación en cache
      return caches.open(PUSH_CACHE).then((cache) => {
        const notificationRecord = {
          id: Date.now().toString(),
          title: notificationData.title,
          body: notificationData.body,
          data: notificationData.data,
          timestamp: new Date().toISOString(),
          read: false
        };
        
        return cache.put(
          `notification-${notificationRecord.id}`,
          new Response(JSON.stringify(notificationRecord))
        );
      });
    })
  );
});

// Evento de clic en notificación
self.addEventListener('notificationclick', (event) => {
  console.log('Push Service Worker: Notificación clickeada');
  
  event.notification.close();

  const notificationData = event.notification.data;
  const action = event.action;

  // Manejar acciones específicas
  if (action === 'view') {
    // Abrir la aplicación en una pestaña específica
    event.waitUntil(
      clients.openWindow('/?tab=notifications')
    );
  } else if (action === 'dismiss') {
    // Marcar como leída
    event.waitUntil(
      markNotificationAsRead(notificationData.id)
    );
  } else {
    // Acción por defecto: abrir la aplicación
    event.waitUntil(
      clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
        // Si ya hay una ventana abierta, enfocarla
        for (const client of clientList) {
          if (client.url.includes(self.location.origin) && 'focus' in client) {
            return client.focus();
          }
        }
        
        // Si no hay ventana abierta, abrir una nueva
        if (clients.openWindow) {
          return clients.openWindow('/');
        }
      })
    );
  }
});

// Evento de cierre de notificación
self.addEventListener('notificationclose', (event) => {
  console.log('Push Service Worker: Notificación cerrada');
  
  const notificationData = event.notification.data;
  
  // Marcar como leída si se cierra sin interacción
  if (notificationData && notificationData.id) {
    event.waitUntil(
      markNotificationAsRead(notificationData.id)
    );
  }
});

// Evento de sincronización en segundo plano
self.addEventListener('sync', (event) => {
  console.log('Push Service Worker: Sincronización en segundo plano:', event.tag);
  
  if (event.tag === 'background-sync') {
    event.waitUntil(
      performBackgroundSync()
    );
  } else if (event.tag === 'push-sync') {
    event.waitUntil(
      syncPushNotifications()
    );
  }
});

// Evento de mensaje desde la aplicación
self.addEventListener('message', (event) => {
  console.log('Push Service Worker: Mensaje recibido:', event.data);
  
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  } else if (event.data && event.data.type === 'GET_NOTIFICATIONS') {
    event.waitUntil(
      getStoredNotifications().then((notifications) => {
        event.ports[0].postMessage({ notifications });
      })
    );
  } else if (event.data && event.data.type === 'MARK_AS_READ') {
    event.waitUntil(
      markNotificationAsRead(event.data.notificationId).then(() => {
        event.ports[0].postMessage({ success: true });
      })
    );
  }
});

// Función para sincronización en segundo plano
async function performBackgroundSync() {
  try {
    console.log('Push Service Worker: Ejecutando sincronización en segundo plano');
    
    // Sincronizar datos offline
    const response = await fetch('/api/sync/background', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        timestamp: new Date().toISOString(),
        type: 'background-sync'
      })
    });

    if (!response.ok) {
      throw new Error('Error en sincronización en segundo plano');
    }

    const result = await response.json();
    console.log('Push Service Worker: Sincronización completada:', result);
    
    return result;
  } catch (error) {
    console.error('Push Service Worker: Error en sincronización:', error);
    throw error;
  }
}

// Función para sincronizar notificaciones push
async function syncPushNotifications() {
  try {
    console.log('Push Service Worker: Sincronizando notificaciones push');
    
    // Obtener notificaciones no leídas
    const notifications = await getStoredNotifications();
    const unreadNotifications = notifications.filter(n => !n.read);
    
    if (unreadNotifications.length === 0) {
      return { synced: 0 };
    }

    // Enviar al servidor
    const response = await fetch('/api/push/sync', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        notifications: unreadNotifications,
        timestamp: new Date().toISOString()
      })
    });

    if (!response.ok) {
      throw new Error('Error sincronizando notificaciones');
    }

    const result = await response.json();
    console.log('Push Service Worker: Notificaciones sincronizadas:', result);
    
    return result;
  } catch (error) {
    console.error('Push Service Worker: Error sincronizando notificaciones:', error);
    throw error;
  }
}

// Función para obtener notificaciones almacenadas
async function getStoredNotifications() {
  try {
    const cache = await caches.open(PUSH_CACHE);
    const keys = await cache.keys();
    const notificationKeys = keys.filter(key => key.url.includes('notification-'));
    
    const notifications = [];
    
    for (const key of notificationKeys) {
      const response = await cache.match(key);
      if (response) {
        const notification = await response.json();
        notifications.push(notification);
      }
    }
    
    // Ordenar por timestamp (más recientes primero)
    return notifications.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  } catch (error) {
    console.error('Push Service Worker: Error obteniendo notificaciones:', error);
    return [];
  }
}

// Función para marcar notificación como leída
async function markNotificationAsRead(notificationId) {
  try {
    const cache = await caches.open(PUSH_CACHE);
    const key = `notification-${notificationId}`;
    const response = await cache.match(key);
    
    if (response) {
      const notification = await response.json();
      notification.read = true;
      notification.readAt = new Date().toISOString();
      
      await cache.put(key, new Response(JSON.stringify(notification)));
      console.log('Push Service Worker: Notificación marcada como leída:', notificationId);
    }
  } catch (error) {
    console.error('Push Service Worker: Error marcando notificación como leída:', error);
  }
}

// Función para limpiar notificaciones antiguas
async function cleanupOldNotifications() {
  try {
    const cache = await caches.open(PUSH_CACHE);
    const keys = await cache.keys();
    const notificationKeys = keys.filter(key => key.url.includes('notification-'));
    
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - 30); // 30 días
    
    for (const key of notificationKeys) {
      const response = await cache.match(key);
      if (response) {
        const notification = await response.json();
        const notificationDate = new Date(notification.timestamp);
        
        if (notificationDate < cutoffDate) {
          await cache.delete(key);
          console.log('Push Service Worker: Notificación antigua eliminada:', notification.id);
        }
      }
    }
  } catch (error) {
    console.error('Push Service Worker: Error limpiando notificaciones antiguas:', error);
  }
}

// Limpiar notificaciones antiguas cada día
setInterval(cleanupOldNotifications, 24 * 60 * 60 * 1000);

// Función para registrar el service worker
async function registerPushServiceWorker() {
  if ('serviceWorker' in navigator && 'PushManager' in window) {
    try {
      const registration = await navigator.serviceWorker.register('/sw-push.js');
      console.log('Push Service Worker registrado:', registration);
      return registration;
    } catch (error) {
      console.error('Error registrando Push Service Worker:', error);
      throw error;
    }
  } else {
    throw new Error('Push notifications no soportadas');
  }
}

// Función para suscribirse a notificaciones push
async function subscribeToPushNotifications(applicationServerKey) {
  try {
    const registration = await navigator.serviceWorker.ready;
    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: applicationServerKey
    });
    
    console.log('Suscrito a notificaciones push:', subscription);
    return subscription;
  } catch (error) {
    console.error('Error suscribiéndose a notificaciones push:', error);
    throw error;
  }
}

// Función para cancelar suscripción
async function unsubscribeFromPushNotifications() {
  try {
    const registration = await navigator.serviceWorker.ready;
    const subscription = await registration.pushManager.getSubscription();
    
    if (subscription) {
      await subscription.unsubscribe();
      console.log('Suscripción a notificaciones push cancelada');
    }
  } catch (error) {
    console.error('Error cancelando suscripción:', error);
    throw error;
  }
}

// Exportar funciones para uso en la aplicación principal
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    registerPushServiceWorker,
    subscribeToPushNotifications,
    unsubscribeFromPushNotifications
  };
} 