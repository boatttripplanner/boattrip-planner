// Service Worker Manager - Versión simplificada
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

      // Configurar listeners de actualización
      this.setupUpdateListener();
      
      // Configurar listener de cambio de control
      this.setupControllerChangeListener();

      return this.swRegistration;
    } catch (error) {
      console.error('Error registrando Service Worker:', error);
      return null;
    }
  }

  setupUpdateListener() {
    if (!this.swRegistration) return;

    this.swRegistration.addEventListener('updatefound', () => {
      console.log('Nueva versión del Service Worker disponible');
      
      const newWorker = this.swRegistration.installing;
      
      if (newWorker) {
        newWorker.addEventListener('statechange', () => {
          if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
            console.log('Nueva versión instalada');
            this.updateFound = true;
            this.showUpdateNotification();
          }
        });
      }
    });
  }

  setupControllerChangeListener() {
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      console.log('Service Worker tomó control de la página');
    });
  }

  showUpdateNotification() {
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