// services/pushNotificationService.ts
// Servicio avanzado para notificaciones push

interface PushSubscription {
  endpoint: string;
  keys: {
    p256dh: string;
    auth: string;
  };
}

interface NotificationPayload {
  title: string;
  body: string;
  icon?: string;
  badge?: string;
  tag?: string;
  data?: any;
  actions?: NotificationAction[];
  requireInteraction?: boolean;
  silent?: boolean;
}

interface NotificationAction {
  action: string;
  title: string;
  icon?: string;
}

class PushNotificationService {
  private swRegistration: ServiceWorkerRegistration | null = null;
  private subscription: PushSubscription | null = null;
  private readonly VAPID_PUBLIC_KEY = 'BEl62iUYgUivxIkv69yViEuiBIa1HxJZJ1aF4g0h4JwFfJSWUPJWfyG0fBMjWicn6-yy0PJRkg5oDLu1J64kX0E';

  async init(): Promise<boolean> {
    try {
      // Obtener registro del Service Worker
      this.swRegistration = await navigator.serviceWorker.ready;
      
      // Verificar si las notificaciones están soportadas
      if (!('Notification' in window)) {
        console.log('Este navegador no soporta notificaciones');
        return false;
      }

      // Verificar si ya hay una suscripción
      this.subscription = await this.swRegistration.pushManager.getSubscription();
      
      return true;
    } catch (error) {
      console.error('Error inicializando Push Notification Service:', error);
      return false;
    }
  }

  async requestPermission(): Promise<NotificationPermission> {
    if (!('Notification' in window)) {
      return 'denied';
    }

    const permission = await Notification.requestPermission();
    
    if (permission === 'granted') {
      await this.subscribe();
    }
    
    return permission;
  }

  async subscribe(): Promise<PushSubscription | null> {
    if (!this.swRegistration) {
      console.error('Service Worker no registrado');
      return null;
    }

    try {
      // Convertir VAPID key
      const vapidPublicKey = this.urlBase64ToUint8Array(this.VAPID_PUBLIC_KEY);
      
      // Suscribirse a push notifications
      this.subscription = await this.swRegistration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: vapidPublicKey
      });

      // Guardar suscripción en el servidor
      await this.saveSubscription(this.subscription);
      
      console.log('Suscripción a push notifications exitosa');
      return this.subscription;
    } catch (error) {
      console.error('Error suscribiéndose a push notifications:', error);
      return null;
    }
  }

  async unsubscribe(): Promise<boolean> {
    if (!this.subscription) {
      return false;
    }

    try {
      await this.subscription.unsubscribe();
      this.subscription = null;
      
      // Eliminar suscripción del servidor
      await this.removeSubscription();
      
      console.log('Desuscripción de push notifications exitosa');
      return true;
    } catch (error) {
      console.error('Error desuscribiéndose de push notifications:', error);
      return false;
    }
  }

  async sendNotification(payload: NotificationPayload): Promise<boolean> {
    if (!this.swRegistration) {
      return false;
    }

    try {
      await this.swRegistration.showNotification(payload.title, {
        body: payload.body,
        icon: payload.icon || '/web-app-manifest-192x192.png',
        badge: payload.badge || '/web-app-manifest-192x192.png',
        tag: payload.tag || 'boattrip-notification',
        data: payload.data || {},
        actions: payload.actions || [],
        requireInteraction: payload.requireInteraction || false,
        silent: payload.silent || false
      });
      
      return true;
    } catch (error) {
      console.error('Error enviando notificación:', error);
      return false;
    }
  }

  async sendServerNotification(payload: NotificationPayload): Promise<boolean> {
    if (!this.subscription) {
      console.error('No hay suscripción activa');
      return false;
    }

    try {
      const response = await fetch('/api/push-notifications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          subscription: this.subscription,
          payload
        })
      });

      return response.ok;
    } catch (error) {
      console.error('Error enviando notificación al servidor:', error);
      return false;
    }
  }

  getSubscription(): PushSubscription | null {
    return this.subscription;
  }

  isSubscribed(): boolean {
    return this.subscription !== null;
  }

  getPermission(): NotificationPermission {
    return Notification.permission;
  }

  private urlBase64ToUint8Array(base64String: string): Uint8Array {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
      .replace(/-/g, '+')
      .replace(/_/g, '/');

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  }

  private async saveSubscription(subscription: PushSubscription): Promise<void> {
    try {
      await fetch('/api/push-subscriptions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(subscription)
      });
    } catch (error) {
      console.error('Error guardando suscripción:', error);
    }
  }

  private async removeSubscription(): Promise<void> {
    try {
      await fetch('/api/push-subscriptions', {
        method: 'DELETE'
      });
    } catch (error) {
      console.error('Error eliminando suscripción:', error);
    }
  }
}

// Instancia singleton
const pushNotificationService = new PushNotificationService();
export default pushNotificationService; 