import React, { useState, useEffect } from 'react';
import { Button } from './Button';
import { LoadingSpinner } from './LoadingSpinner';
import { ErrorMessage } from './ErrorMessage';
import { 
  BellIcon, 
  BellOffIcon, 
  CheckCircleIcon, 
  XIcon,
  SettingsIcon,
  AlertTriangleIcon
} from './icons';

interface PushSubscription {
  endpoint: string;
  keys: {
    p256dh: string;
    auth: string;
  };
}

interface NotificationSettings {
  weather: boolean;
  trips: boolean;
  maintenance: boolean;
  updates: boolean;
  marketing: boolean;
}

interface PushNotificationsProps {
  onSubscriptionChange?: (subscription: PushSubscription | null) => void;
  onSettingsChange?: (settings: NotificationSettings) => void;
  showSettings?: boolean;
  className?: string;
}

export default function PushNotifications({
  onSubscriptionChange,
  onSettingsChange,
  showSettings = true,
  className = ''
}: PushNotificationsProps) {
  const [subscription, setSubscription] = useState<PushSubscription | null>(null);
  const [isSupported, setIsSupported] = useState(false);
  const [permission, setPermission] = useState<NotificationPermission>('default');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [settings, setSettings] = useState<NotificationSettings>({
    weather: true,
    trips: true,
    maintenance: true,
    updates: true,
    marketing: false
  });

  useEffect(() => {
    checkSupport();
    checkPermission();
    getCurrentSubscription();
  }, []);

  const checkSupport = () => {
    const supported = 'serviceWorker' in navigator && 'PushManager' in window;
    setIsSupported(supported);
    
    if (!supported) {
      setError('Las notificaciones push no están soportadas en este navegador');
    }
  };

  const checkPermission = () => {
    if ('Notification' in window) {
      setPermission(Notification.permission);
    }
  };

  const getCurrentSubscription = async () => {
    if (!isSupported) return;

    try {
      const registration = await navigator.serviceWorker.ready;
      const existingSubscription = await registration.pushManager.getSubscription();
      
      if (existingSubscription) {
        setSubscription(existingSubscription);
        onSubscriptionChange?.(existingSubscription);
      }
    } catch (error) {
      console.error('Error getting current subscription:', error);
    }
  };

  const requestPermission = async (): Promise<boolean> => {
    if (!isSupported) return false;

    try {
      const result = await Notification.requestPermission();
      setPermission(result);
      return result === 'granted';
    } catch (error) {
      console.error('Error requesting permission:', error);
      setError('Error al solicitar permisos de notificación');
      return false;
    }
  };

  const subscribeToPush = async () => {
    if (!isSupported) return;

    setIsLoading(true);
    setError(null);

    try {
      // Solicitar permisos si no están concedidos
      if (permission !== 'granted') {
        const granted = await requestPermission();
        if (!granted) {
          setError('Se requieren permisos para activar las notificaciones');
          setIsLoading(false);
          return;
        }
      }

      // Registrar service worker
      const registration = await navigator.serviceWorker.register('/sw.js');
      await navigator.serviceWorker.ready;

      // Crear suscripción
      const newSubscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(getVapidPublicKey())
      });

      // Enviar suscripción al servidor
      await sendSubscriptionToServer(newSubscription);

      setSubscription(newSubscription);
      onSubscriptionChange?.(newSubscription);

      console.log('Suscripción a notificaciones push creada exitosamente');
    } catch (error) {
      console.error('Error subscribing to push:', error);
      setError('Error al suscribirse a las notificaciones push');
    } finally {
      setIsLoading(false);
    }
  };

  const unsubscribeFromPush = async () => {
    if (!subscription) return;

    setIsLoading(true);
    setError(null);

    try {
      // Cancelar suscripción
      await subscription.unsubscribe();

      // Notificar al servidor
      await removeSubscriptionFromServer(subscription);

      setSubscription(null);
      onSubscriptionChange?.(null);

      console.log('Suscripción a notificaciones push cancelada');
    } catch (error) {
      console.error('Error unsubscribing from push:', error);
      setError('Error al cancelar la suscripción');
    } finally {
      setIsLoading(false);
    }
  };

  const sendSubscriptionToServer = async (subscription: PushSubscription) => {
    try {
      const response = await fetch('/api/v1/push/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          subscription: {
            endpoint: subscription.endpoint,
            keys: {
              p256dh: btoa(String.fromCharCode.apply(null, 
                new Uint8Array(subscription.getKey('p256dh')!))),
              auth: btoa(String.fromCharCode.apply(null, 
                new Uint8Array(subscription.getKey('auth')!)))
            }
          },
          settings
        })
      });

      if (!response.ok) {
        throw new Error('Error al enviar suscripción al servidor');
      }
    } catch (error) {
      console.error('Error sending subscription to server:', error);
      throw error;
    }
  };

  const removeSubscriptionFromServer = async (subscription: PushSubscription) => {
    try {
      const response = await fetch('/api/v1/push/unsubscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          endpoint: subscription.endpoint
        })
      });

      if (!response.ok) {
        throw new Error('Error al eliminar suscripción del servidor');
      }
    } catch (error) {
      console.error('Error removing subscription from server:', error);
      throw error;
    }
  };

  const updateSettings = async (newSettings: NotificationSettings) => {
    setSettings(newSettings);
    onSettingsChange?.(newSettings);

    if (subscription) {
      try {
        await fetch('/api/v1/push/settings', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            endpoint: subscription.endpoint,
            settings: newSettings
          })
        });
      } catch (error) {
        console.error('Error updating notification settings:', error);
      }
    }
  };

  const getVapidPublicKey = (): string => {
    // Esta clave debe coincidir con la del servidor
    return process.env.REACT_APP_VAPID_PUBLIC_KEY || 'BEl62iUYgUivxIkv69yViEuiBIa1HxrFqXhx3LFwvz2CJaIb0MttMwkTgzVWlYTbIq12z_ZYZVt0VpsLjo3UrHjI';
  };

  const urlBase64ToUint8Array = (base64String: string): Uint8Array => {
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
  };

  const getPermissionText = () => {
    switch (permission) {
      case 'granted':
        return 'Permitidas';
      case 'denied':
        return 'Denegadas';
      default:
        return 'No solicitadas';
    }
  };

  const getPermissionColor = () => {
    switch (permission) {
      case 'granted':
        return 'text-green-600';
      case 'denied':
        return 'text-red-600';
      default:
        return 'text-yellow-600';
    }
  };

  if (!isSupported) {
    return (
      <div className={`bg-yellow-50 border border-yellow-200 rounded-lg p-4 ${className}`}>
        <div className="flex items-center">
          <AlertTriangleIcon className="w-5 h-5 text-yellow-600 mr-2" />
          <div>
            <h3 className="text-sm font-medium text-yellow-800">
              Notificaciones no soportadas
            </h3>
            <p className="text-sm text-yellow-700">
              Tu navegador no soporta notificaciones push
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Estado actual */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
              subscription ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-600'
            }`}>
              {subscription ? <BellIcon className="w-5 h-5" /> : <BellOffIcon className="w-5 h-5" />}
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-900">
                Notificaciones Push
              </h3>
              <p className="text-sm text-gray-600">
                Estado: {subscription ? 'Activas' : 'Inactivas'} • Permisos: 
                <span className={`ml-1 font-medium ${getPermissionColor()}`}>
                  {getPermissionText()}
                </span>
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {showSettings && (
              <Button
                onClick={() => setShowSettingsModal(true)}
                variant="outline"
                size="sm"
              >
                <SettingsIcon className="w-4 h-4 mr-1" />
                Configurar
              </Button>
            )}

            {subscription ? (
              <Button
                onClick={unsubscribeFromPush}
                disabled={isLoading}
                variant="outline"
                size="sm"
                className="text-red-600 hover:text-red-700"
              >
                {isLoading ? (
                  <LoadingSpinner size="sm" />
                ) : (
                  <>
                    <BellOffIcon className="w-4 h-4 mr-1" />
                    Desactivar
                  </>
                )}
              </Button>
            ) : (
              <Button
                onClick={subscribeToPush}
                disabled={isLoading || permission === 'denied'}
                size="sm"
                className="bg-blue-600 hover:bg-blue-700"
              >
                {isLoading ? (
                  <LoadingSpinner size="sm" />
                ) : (
                  <>
                    <BellIcon className="w-4 h-4 mr-1" />
                    Activar
                  </>
                )}
              </Button>
            )}
          </div>
        </div>

        {error && (
          <div className="mt-3">
            <ErrorMessage message={error} />
          </div>
        )}
      </div>

      {/* Modal de configuración */}
      {showSettingsModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Configurar Notificaciones
              </h3>
              <Button
                onClick={() => setShowSettingsModal(false)}
                variant="outline"
                size="sm"
              >
                <XIcon className="w-4 h-4" />
              </Button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={settings.weather}
                    onChange={(e) => updateSettings({ ...settings, weather: e.target.checked })}
                    className="mr-3"
                  />
                  <div>
                    <div className="text-sm font-medium text-gray-900">
                      Alertas meteorológicas
                    </div>
                    <div className="text-xs text-gray-600">
                      Notificaciones sobre cambios en el clima
                    </div>
                  </div>
                </label>
              </div>

              <div>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={settings.trips}
                    onChange={(e) => updateSettings({ ...settings, trips: e.target.checked })}
                    className="mr-3"
                  />
                  <div>
                    <div className="text-sm font-medium text-gray-900">
                      Recordatorios de viajes
                    </div>
                    <div className="text-xs text-gray-600">
                      Notificaciones sobre próximos viajes
                    </div>
                  </div>
                </label>
              </div>

              <div>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={settings.maintenance}
                    onChange={(e) => updateSettings({ ...settings, maintenance: e.target.checked })}
                    className="mr-3"
                  />
                  <div>
                    <div className="text-sm font-medium text-gray-900">
                      Mantenimiento de barcos
                    </div>
                    <div className="text-xs text-gray-600">
                      Recordatorios de mantenimiento programado
                    </div>
                  </div>
                </label>
              </div>

              <div>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={settings.updates}
                    onChange={(e) => updateSettings({ ...settings, updates: e.target.checked })}
                    className="mr-3"
                  />
                  <div>
                    <div className="text-sm font-medium text-gray-900">
                      Actualizaciones del sistema
                    </div>
                    <div className="text-xs text-gray-600">
                      Notificaciones sobre nuevas funcionalidades
                    </div>
                  </div>
                </label>
              </div>

              <div>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={settings.marketing}
                    onChange={(e) => updateSettings({ ...settings, marketing: e.target.checked })}
                    className="mr-3"
                  />
                  <div>
                    <div className="text-sm font-medium text-gray-900">
                      Ofertas y promociones
                    </div>
                    <div className="text-xs text-gray-600">
                      Notificaciones comerciales (opcional)
                    </div>
                  </div>
                </label>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <Button
                onClick={() => setShowSettingsModal(false)}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Guardar Configuración
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 