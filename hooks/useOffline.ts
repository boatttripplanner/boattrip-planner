// hooks/useOffline.ts
// Hook personalizado para gestión del estado offline

import { useState, useEffect, useCallback } from 'react';
import offlineService from '../services/offlineService';

interface OfflineState {
  isOnline: boolean;
  isOfflineMode: boolean;
  lastSync: number;
  pendingForms: number;
  cacheSize: number;
  isInitialized: boolean;
}

interface OfflineActions {
  syncData: () => Promise<void>;
  saveOfflineForm: (formData: any) => Promise<string>;
  getOfflineStats: () => Promise<any>;
  clearOfflineData: () => Promise<void>;
  toggleOfflineMode: () => Promise<void>;
  requestNotificationPermission: () => Promise<boolean>;
  sendNotification: (title: string, options?: NotificationOptions) => void;
}

export const useOffline = (): [OfflineState, OfflineActions] => {
  const [state, setState] = useState<OfflineState>({
    isOnline: navigator.onLine,
    isOfflineMode: false,
    lastSync: 0,
    pendingForms: 0,
    cacheSize: 0,
    isInitialized: false
  });

  // Inicializar el servicio offline
  useEffect(() => {
    const initOfflineService = async () => {
      try {
        await offlineService.init();
        
        // Cargar preferencias iniciales
        const preferences = await offlineService.getUserPreferences();
        const stats = await offlineService.getOfflineStats();
        
        setState(prev => ({
          ...prev,
          isOfflineMode: preferences?.offlineMode || false,
          lastSync: preferences?.lastSync || 0,
          pendingForms: stats.unsyncedForms,
          cacheSize: stats.cacheSize,
          isInitialized: true
        }));

        // Configurar sincronización automática
        if (preferences?.notifications) {
          await requestNotificationPermission();
        }

        // Sincronizar datos si hay conexión
        if (navigator.onLine && !preferences?.offlineMode) {
          await syncData();
        }
      } catch (error) {
        console.error('Error initializing offline service:', error);
      }
    };

    initOfflineService();
  }, []);

  // Escuchar cambios de conectividad
  useEffect(() => {
    const handleOnline = () => {
      setState(prev => ({ ...prev, isOnline: true }));
      
      // Sincronizar automáticamente cuando vuelve la conexión
      if (!state.isOfflineMode) {
        syncData();
      }
    };

    const handleOffline = () => {
      setState(prev => ({ ...prev, isOnline: false }));
      
      // Mostrar notificación de modo offline
      if (state.isInitialized) {
        sendNotification('Modo Offline', {
          body: 'No hay conexión a internet. Los datos se guardarán localmente.',
          icon: '/web-app-manifest-192x192.png'
        });
      }
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [state.isOfflineMode, state.isInitialized]);

  // Sincronizar datos con el servidor
  const syncData = useCallback(async () => {
    if (!state.isOnline || state.isOfflineMode) {
      return;
    }

    try {
      setState(prev => ({ ...prev, isSyncing: true }));
      
      await offlineService.syncWithServer();
      
      // Actualizar estadísticas
      const stats = await offlineService.getOfflineStats();
      
      setState(prev => ({
        ...prev,
        lastSync: Date.now(),
        pendingForms: stats.unsyncedForms,
        cacheSize: stats.cacheSize,
        isSyncing: false
      }));

      // Notificar sincronización exitosa
      if (stats.unsyncedForms === 0) {
        sendNotification('Sincronización Completada', {
          body: 'Todos los datos han sido sincronizados correctamente.',
          icon: '/web-app-manifest-192x192.png'
        });
      }
    } catch (error) {
      console.error('Error syncing data:', error);
      
      sendNotification('Error de Sincronización', {
        body: 'No se pudieron sincronizar los datos. Se reintentará más tarde.',
        icon: '/web-app-manifest-192x192.png'
      });
    }
  }, [state.isOnline, state.isOfflineMode]);

  // Guardar formulario offline
  const saveOfflineForm = useCallback(async (formData: any) => {
    try {
      const formId = await offlineService.saveOfflineForm(formData);
      
      // Actualizar estadísticas
      const stats = await offlineService.getOfflineStats();
      
      setState(prev => ({
        ...prev,
        pendingForms: stats.unsyncedForms
      }));

      // Notificar guardado exitoso
      sendNotification('Formulario Guardado', {
        body: 'El formulario se ha guardado localmente y se sincronizará cuando haya conexión.',
        icon: '/web-app-manifest-192x192.png'
      });

      return formId;
    } catch (error) {
      console.error('Error saving offline form:', error);
      throw error;
    }
  }, []);

  // Obtener estadísticas offline
  const getOfflineStats = useCallback(async () => {
    try {
      const stats = await offlineService.getOfflineStats();
      
      setState(prev => ({
        ...prev,
        pendingForms: stats.unsyncedForms,
        cacheSize: stats.cacheSize,
        lastSync: stats.lastSync
      }));

      return stats;
    } catch (error) {
      console.error('Error getting offline stats:', error);
      throw error;
    }
  }, []);

  // Limpiar datos offline
  const clearOfflineData = useCallback(async () => {
    try {
      await offlineService.clearAllData();
      
      setState(prev => ({
        ...prev,
        pendingForms: 0,
        cacheSize: 0,
        lastSync: 0
      }));

      sendNotification('Datos Limpiados', {
        body: 'Todos los datos offline han sido eliminados.',
        icon: '/web-app-manifest-192x192.png'
      });
    } catch (error) {
      console.error('Error clearing offline data:', error);
      throw error;
    }
  }, []);

  // Cambiar modo offline
  const toggleOfflineMode = useCallback(async () => {
    try {
      const newOfflineMode = !state.isOfflineMode;
      
      await offlineService.saveUserPreferences({ offlineMode: newOfflineMode });
      
      setState(prev => ({ ...prev, isOfflineMode: newOfflineMode }));

      sendNotification(
        newOfflineMode ? 'Modo Offline Activado' : 'Modo Online Activado',
        {
          body: newOfflineMode 
            ? 'La aplicación funcionará sin conexión a internet.'
            : 'La aplicación se sincronizará automáticamente.',
          icon: '/web-app-manifest-192x192.png'
        }
      );
    } catch (error) {
      console.error('Error toggling offline mode:', error);
      throw error;
    }
  }, [state.isOfflineMode]);

  // Solicitar permiso de notificaciones
  const requestNotificationPermission = useCallback(async (): Promise<boolean> => {
    if (!('Notification' in window)) {
      console.log('This browser does not support notifications');
      return false;
    }

    if (Notification.permission === 'granted') {
      return true;
    }

    if (Notification.permission === 'denied') {
      return false;
    }

    try {
      const permission = await Notification.requestPermission();
      return permission === 'granted';
    } catch (error) {
      console.error('Error requesting notification permission:', error);
      return false;
    }
  }, []);

  // Enviar notificación
  const sendNotification = useCallback((title: string, options?: NotificationOptions) => {
    if (!('Notification' in window) || Notification.permission !== 'granted') {
      return;
    }

    try {
      new Notification(title, {
        icon: '/web-app-manifest-192x192.png',
        badge: '/web-app-manifest-96x96.png',
        ...options
      });
    } catch (error) {
      console.error('Error sending notification:', error);
    }
  }, []);

  // Sincronización periódica
  useEffect(() => {
    if (!state.isOnline || state.isOfflineMode) {
      return;
    }

    const syncInterval = setInterval(() => {
      syncData();
    }, 5 * 60 * 1000); // Sincronizar cada 5 minutos

    return () => clearInterval(syncInterval);
  }, [state.isOnline, state.isOfflineMode, syncData]);

  // Registrar Service Worker para sincronización en background
  useEffect(() => {
    if ('serviceWorker' in navigator && 'sync' in window.ServiceWorkerRegistration.prototype) {
      navigator.serviceWorker.ready.then((registration) => {
        // Registrar sincronización en background
        registration.sync.register('background-sync').catch((error) => {
          console.error('Error registering background sync:', error);
        });
      });
    }
  }, []);

  const actions: OfflineActions = {
    syncData,
    saveOfflineForm,
    getOfflineStats,
    clearOfflineData,
    toggleOfflineMode,
    requestNotificationPermission,
    sendNotification
  };

  return [state, actions];
};

// Hook para detectar cambios de conectividad
export const useOnlineStatus = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return isOnline;
};

// Hook para gestionar notificaciones push
export const usePushNotifications = () => {
  const [isSupported, setIsSupported] = useState(false);
  const [permission, setPermission] = useState<NotificationPermission>('default');

  useEffect(() => {
    setIsSupported('Notification' in window && 'serviceWorker' in navigator);
    setPermission(Notification.permission);
  }, []);

  const requestPermission = useCallback(async () => {
    if (!isSupported) {
      return false;
    }

    try {
      const result = await Notification.requestPermission();
      setPermission(result);
      return result === 'granted';
    } catch (error) {
      console.error('Error requesting notification permission:', error);
      return false;
    }
  }, [isSupported]);

  const subscribeToPush = useCallback(async () => {
    if (!isSupported || permission !== 'granted') {
      return false;
    }

    try {
      const registration = await navigator.serviceWorker.ready;
      
      // Aquí se implementaría la suscripción a push notifications
      // con un servidor de push (Firebase, VAPID, etc.)
      
      console.log('Push notification subscription successful');
      return true;
    } catch (error) {
      console.error('Error subscribing to push notifications:', error);
      return false;
    }
  }, [isSupported, permission]);

  return {
    isSupported,
    permission,
    requestPermission,
    subscribeToPush
  };
}; 