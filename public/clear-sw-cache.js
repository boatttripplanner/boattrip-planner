// Script para limpiar el cache del Service Worker
// Útil para resolver problemas de cache y errores de red

window.clearServiceWorkerCache = async () => {
  if ('serviceWorker' in navigator) {
    try {
      // Obtener todas las registraciones del Service Worker
      const registrations = await navigator.serviceWorker.getRegistrations();
      
      // Desregistrar todos los Service Workers
      for (const registration of registrations) {
        await registration.unregister();
        console.log('Service Worker desregistrado:', registration);
      }
      
      // Limpiar todos los caches
      const cacheNames = await caches.keys();
      for (const cacheName of cacheNames) {
        await caches.delete(cacheName);
        console.log('Cache eliminado:', cacheName);
      }
      
      // Recargar la página para aplicar cambios
      window.location.reload();
      
    } catch (error) {
      console.error('Error al limpiar cache:', error);
    }
  } else {
    console.log('Service Worker no soportado en este navegador');
  }
};

// Función para verificar el estado del Service Worker
window.checkServiceWorkerStatus = () => {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.getRegistrations().then(registrations => {
      console.log('Service Workers registrados:', registrations.length);
      registrations.forEach((registration, index) => {
        console.log(`SW ${index}:`, {
          active: registration.active,
          installing: registration.installing,
          waiting: registration.waiting,
          scope: registration.scope
        });
      });
    });
  }
};

// Función para forzar la actualización del Service Worker
window.forceServiceWorkerUpdate = async () => {
  if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
    try {
      // Enviar mensaje para forzar actualización
      navigator.serviceWorker.controller.postMessage({
        type: 'SKIP_WAITING'
      });
      
      // Recargar la página
      window.location.reload();
    } catch (error) {
      console.error('Error al forzar actualización:', error);
    }
  }
};

// Auto-ejecutar verificación en consola
console.log('🔧 Service Worker Cache Manager cargado');
console.log('Comandos disponibles:');
console.log('- clearServiceWorkerCache() - Limpiar cache y recargar');
console.log('- checkServiceWorkerStatus() - Verificar estado');
console.log('- forceServiceWorkerUpdate() - Forzar actualización');
