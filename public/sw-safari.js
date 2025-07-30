// public/sw-safari.js
// Safari-specific Service Worker registration with enhanced compatibility

class SafariServiceWorkerManager {
  constructor() {
    this.swRegistration = null;
    this.isSupported = 'serviceWorker' in navigator;
    this.swPath = '/sw-safari-safe.js'; // Usar versión simplificada
    this.isSafari = /Safari/.test(navigator.userAgent) && !/Chrome/.test(navigator.userAgent);
  }

  async register() {
    if (!this.isSupported) {
      console.log('Service Worker no soportado en este navegador');
      return null;
    }

    // Safari-specific checks
    if (this.isSafari) {
      console.log('Detectado Safari - aplicando configuraciones específicas');
    }

    try {
      // Safari-specific registration options - MÍNIMAS
      const registrationOptions = {
        scope: '/',
        updateViaCache: 'all' // Siempre usar 'all' en Safari
      };

      // Registrar el Service Worker simplificado
      this.swRegistration = await navigator.serviceWorker.register(this.swPath, registrationOptions);

      console.log('Service Worker registrado exitosamente en Safari:', this.swRegistration);

      // Safari-specific event listeners - SIMPLIFICADOS
      this.setupSafariEventListeners();
      
      return this.swRegistration;
    } catch (error) {
      console.error('Error registrando Service Worker en Safari:', error);
      
      // Safari fallback - intentar sin Service Worker
      if (this.isSafari) {
        console.log('Safari: Deshabilitando Service Worker por compatibilidad');
        return null;
      }
      
      return null;
    }
  }

  setupSafariEventListeners() {
    if (!this.swRegistration) return;

    // Safari-specific update detection - SIMPLIFICADO
    this.swRegistration.addEventListener('updatefound', () => {
      console.log('Nueva versión del Service Worker disponible en Safari');
      
      const newWorker = this.swRegistration.installing;
      
      if (newWorker) {
        newWorker.addEventListener('statechange', () => {
          if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
            console.log('Nueva versión instalada en Safari');
            // NO mostrar notificación automática en Safari
          }
        });
      }
    });

    // Safari-specific controller change handling - SIMPLIFICADO
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      console.log('Service Worker tomó control en Safari');
      
      // NO hacer reload automático en Safari - puede causar colgados
    });
  }

  async unregister() {
    if (this.swRegistration) {
      await this.swRegistration.unregister();
      console.log('Service Worker desregistrado de Safari');
    }
  }

  getRegistration() {
    return this.swRegistration;
  }

  isSafariBrowser() {
    return this.isSafari;
  }
}

// Instancia global del manager de Safari
window.safariSwManager = new SafariServiceWorkerManager();

// Registrar automáticamente cuando se carga la página - CON RETRASO
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    // Retrasar el registro para evitar conflictos con la carga inicial
    setTimeout(() => {
      window.safariSwManager.register();
    }, 2000);
  });
} else {
  // Retrasar el registro si la página ya está cargada
  setTimeout(() => {
    window.safariSwManager.register();
  }, 2000);
}

// Exportar para uso en otros módulos
if (typeof module !== 'undefined' && module.exports) {
  module.exports = SafariServiceWorkerManager;
} 