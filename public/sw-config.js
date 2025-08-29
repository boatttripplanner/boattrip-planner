// Service Worker Configuration
// Configuración para prevenir errores de red y mejorar la estabilidad

window.SW_CONFIG = {
  // Versión del Service Worker
  version: '1.2.1',
  
  // Configuración de cache
  cache: {
    static: 'static-v1.2.1',
    dynamic: 'dynamic-v1.2.1'
  },
  
  // Configuración de red
  network: {
    timeout: 5000, // 5 segundos
    retryAttempts: 3,
    fallbackStrategy: 'cache-first'
  },
  
  // Recursos críticos que siempre deben estar en cache
  criticalAssets: [
    '/',
    '/index.html',
    '/favicon.svg',
    '/favicon.ico',
    '/favicon-96x96.png'
  ],
  
  // Configuración de desarrollo
  development: {
    enableLogging: true,
    skipWaiting: false,
    updateViaCache: 'none'
  }
};

// Función para registrar el Service Worker de forma segura
window.registerServiceWorkerSafely = async () => {
  if ('serviceWorker' in navigator) {
    try {
      const registration = await navigator.serviceWorker.register('/sw.js', {
        updateViaCache: 'none'
      });
      
      console.log('Service Worker registrado exitosamente:', registration);
      
      // Manejar actualizaciones
      registration.addEventListener('updatefound', () => {
        const newWorker = registration.installing;
        if (newWorker) {
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              console.log('Nueva versión del Service Worker disponible');
            }
          });
        }
      });
      
      return registration;
    } catch (error) {
      console.error('Error al registrar Service Worker:', error);
      return null;
    }
  }
  return null;
};
