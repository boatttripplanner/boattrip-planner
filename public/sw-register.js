// public/sw-register.js
// Script para registrar el Service Worker con funcionalidades avanzadas

class ServiceWorkerManager {
  constructor() {
    this.swRegistration = null;
    this.isSupported = 'serviceWorker' in navigator;
    this.swPath = '/sw.js';
    this.updateFound = false;
  }

  async register() {
    if (!this.isSupported) {
      console.log('Service Worker no soportado en este navegador');
      return null;
    }

    try {
      // Registrar el Service Worker
      this.swRegistration = await navigator.serviceWorker.register(this.swPath, {
        scope: '/',
        updateViaCache: 'none'
      });

      console.log('Service Worker registrado exitosamente:', this.swRegistration);

      // Escuchar actualizaciones
      this.setupUpdateListener();
      
      // Configurar periodic sync si está disponible
      this.setupPeriodicSync();
      
      // Configurar background sync
      this.setupBackgroundSync();

      return this.swRegistration;
    } catch (error) {
      console.error('Error registrando Service Worker:', error);
      return null;
    }
  }

  setupUpdateListener() {
    if (!this.swRegistration) return;

    // Detectar cuando hay una nueva versión disponible
    this.swRegistration.addEventListener('updatefound', () => {
      console.log('Nueva versión del Service Worker disponible');
      this.updateFound = true;
      
      const newWorker = this.swRegistration.installing;
      
      newWorker.addEventListener('statechange', () => {
        if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
          // Nueva versión instalada, mostrar notificación al usuario
          this.showUpdateNotification();
        }
      });
    });

    // Detectar cuando el Service Worker toma control
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      console.log('Service Worker tomó control de la página');
      this.updateFound = false;
      
      // Recargar la página para usar la nueva versión
      if (this.updateFound) {
        window.location.reload();
      }
    });
  }

  setupPeriodicSync() {
    if (!this.swRegistration || !('periodicSync' in this.swRegistration)) {
      console.log('Periodic Sync no soportado');
      return;
    }

    // Solicitar permisos para periodic sync
    this.requestPeriodicSyncPermission();
  }

  async requestPeriodicSyncPermission() {
    try {
      const status = await navigator.permissions.query({
        name: 'periodic-background-sync'
      });

      if (status.state === 'granted') {
        // Registrar tareas de sincronización periódica
        await this.registerPeriodicSync();
      } else if (status.state === 'prompt') {
        // El usuario puede otorgar permisos más tarde
        console.log('Permisos de periodic sync pendientes');
      }
    } catch (error) {
      console.log('Periodic sync no disponible:', error);
    }
  }

  async registerPeriodicSync() {
    try {
      await this.swRegistration.periodicSync.register('weather-sync', {
        minInterval: 24 * 60 * 60 * 1000 // 24 horas
      });
      
      await this.swRegistration.periodicSync.register('data-sync', {
        minInterval: 6 * 60 * 60 * 1000 // 6 horas
      });

      console.log('Periodic sync registrado exitosamente');
    } catch (error) {
      console.error('Error registrando periodic sync:', error);
    }
  }

  setupBackgroundSync() {
    if (!this.swRegistration || !('sync' in this.swRegistration)) {
      console.log('Background Sync no soportado');
      return;
    }

    // Registrar tipos de sincronización
    this.registerBackgroundSyncTypes();
  }

  async registerBackgroundSyncTypes() {
    try {
      // Registrar sincronización de formularios
      await this.swRegistration.sync.register('form-sync');
      
      // Registrar sincronización de datos meteorológicos
      await this.swRegistration.sync.register('weather-sync');
      
      // Registrar sincronización general
      await this.swRegistration.sync.register('background-sync');

      console.log('Background sync registrado exitosamente');
    } catch (error) {
      console.error('Error registrando background sync:', error);
    }
  }

  showUpdateNotification() {
    // Crear notificación de actualización
    if ('Notification' in window && Notification.permission === 'granted') {
      const notification = new Notification('BoatTrip Planner Actualizado', {
        body: 'Hay una nueva versión disponible. Recarga la página para actualizar.',
        icon: '/web-app-manifest-192x192.png',
        tag: 'update-notification',
        requireInteraction: true,
        actions: [
          {
            action: 'reload',
            title: 'Recargar'
          },
          {
            action: 'dismiss',
            title: 'Más tarde'
          }
        ]
      });

      notification.addEventListener('click', (event) => {
        if (event.action === 'reload') {
          window.location.reload();
        }
        notification.close();
      });
    }

    // Mostrar banner de actualización en la UI
    this.showUpdateBanner();
  }

  showUpdateBanner() {
    // Crear banner de actualización
    const banner = document.createElement('div');
    banner.id = 'update-banner';
    banner.className = 'fixed top-0 left-0 right-0 bg-blue-600 text-white p-3 text-center z-50';
    banner.innerHTML = `
      <div class="flex items-center justify-center space-x-4">
        <span>🔄 Nueva versión disponible</span>
        <button onclick="window.location.reload()" class="bg-white text-blue-600 px-4 py-1 rounded text-sm font-medium hover:bg-gray-100">
          Actualizar
        </button>
        <button onclick="this.parentElement.parentElement.remove()" class="text-white hover:text-gray-200">
          ✕
        </button>
      </div>
    `;

    document.body.appendChild(banner);
  }

  async unregister() {
    if (this.swRegistration) {
      await this.swRegistration.unregister();
      console.log('Service Worker desregistrado');
    }
  }

  getRegistration() {
    return this.swRegistration;
  }

  isUpdateAvailable() {
    return this.updateFound;
  }
}

// Instancia global del manager
window.swManager = new ServiceWorkerManager();

// Registrar automáticamente cuando se carga la página
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    window.swManager.register();
  });
} else {
  window.swManager.register();
}

// Exportar para uso en otros módulos
if (typeof module !== 'undefined' && module.exports) {
  module.exports = ServiceWorkerManager;
} 