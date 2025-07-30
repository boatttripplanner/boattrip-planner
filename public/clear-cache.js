// Utility script to clear service worker caches
// Run this in the browser console if you experience caching issues

async function clearAllCaches() {
  try {
    // Clear all caches
    const cacheNames = await caches.keys();
    await Promise.all(
      cacheNames.map(cacheName => caches.delete(cacheName))
    );
    console.log('All caches cleared successfully');
    
    // Unregister service worker
    if ('serviceWorker' in navigator) {
      const registrations = await navigator.serviceWorker.getRegistrations();
      await Promise.all(
        registrations.map(registration => registration.unregister())
      );
      console.log('Service workers unregistered');
    }
    
    // Reload the page
    window.location.reload();
  } catch (error) {
    console.error('Error clearing caches:', error);
  }
}

// Auto-clear caches in development
if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
  clearAllCaches();
}

// Make function available globally
window.clearAllCaches = clearAllCaches; 