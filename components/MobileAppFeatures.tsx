import React, { useState, useEffect } from 'react';
import { useTenant } from '../contexts/TenantContext';
import { mobileService } from '../services/mobileService';
import {
  OfflineData,
  LocationService,
  PushNotificationService,
  MobileAnalytics,
  Coordinates,
  SyncStatus,
  PushNotification,
  DeviceInfo,
  NetworkStatus,
  BatteryStatus
} from '../types/mobile';

interface MobileAppFeaturesProps {
  showOfflineSync?: boolean;
  showLocationTracking?: boolean;
  showPushNotifications?: boolean;
  showAnalytics?: boolean;
  showDeviceInfo?: boolean;
  className?: string;
}

export default function MobileAppFeatures({
  showOfflineSync = true,
  showLocationTracking = true,
  showPushNotifications = true,
  showAnalytics = true,
  showDeviceInfo = true,
  className = ''
}: MobileAppFeaturesProps) {
  const { currentTenant, hasPermission } = useTenant();
  const [activeTab, setActiveTab] = useState<'sync' | 'location' | 'notifications' | 'analytics' | 'device'>('sync');
  const [offlineData, setOfflineData] = useState<OfflineData | null>(null);
  const [currentLocation, setCurrentLocation] = useState<Coordinates | null>(null);
  const [locationHistory, setLocationHistory] = useState<Coordinates[]>([]);
  const [pushNotifications, setPushNotifications] = useState<PushNotification[]>([]);
  const [analytics, setAnalytics] = useState<MobileAnalytics | null>(null);
  const [deviceInfo, setDeviceInfo] = useState<DeviceInfo | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [syncStatus, setSyncStatus] = useState<SyncStatus>(SyncStatus.IDLE);
  const [networkStatus, setNetworkStatus] = useState<NetworkStatus>('disconnected');
  const [batteryStatus, setBatteryStatus] = useState<BatteryStatus>('discharging');

  const canViewMobileFeatures = hasPermission('mobile', ['read']);
  const canManageMobileFeatures = hasPermission('mobile', ['create', 'update', 'delete']);

  useEffect(() => {
    if (canViewMobileFeatures) {
      loadMobileData();
    }
  }, [canViewMobileFeatures, activeTab]);

  const loadMobileData = async () => {
    setIsLoading(true);
    setError('');
    
    try {
      switch (activeTab) {
        case 'sync':
          const offlineData = await mobileService.getOfflineData();
          setOfflineData(offlineData);
          break;
        case 'location':
          const location = await mobileService.getCurrentLocation();
          const history = await mobileService.getLocationHistory();
          setCurrentLocation(location);
          setLocationHistory(history);
          break;
        case 'notifications':
          const notifications = await mobileService.getPushNotifications();
          setPushNotifications(notifications);
          break;
        case 'analytics':
          const analyticsData = await mobileService.getAnalytics();
          setAnalytics(analyticsData);
          break;
        case 'device':
          const device = await mobileService.getDeviceInfo();
          setDeviceInfo(device);
          break;
      }
    } catch (error) {
      setError('Error loading mobile data');
      console.error('Error loading mobile data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleManualSync = async () => {
    if (!canManageMobileFeatures) return;
    
    setIsLoading(true);
    try {
      await mobileService.syncData();
      await loadMobileData();
    } catch (error) {
      setError('Error syncing data');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearOfflineData = async () => {
    if (!canManageMobileFeatures) return;
    
    if (window.confirm('¿Estás seguro de que quieres limpiar todos los datos offline?')) {
      setIsLoading(true);
      try {
        await mobileService.clearOfflineData();
        await loadMobileData();
      } catch (error) {
        setError('Error clearing offline data');
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleMarkNotificationAsRead = async (notificationId: string) => {
    if (!canManageMobileFeatures) return;
    
    try {
      await mobileService.markNotificationAsRead(notificationId);
      await loadMobileData();
    } catch (error) {
      setError('Error marking notification as read');
    }
  };

  const getSyncStatusColor = (status: SyncStatus): string => {
    switch (status) {
      case SyncStatus.SUCCESS: return 'text-green-600 bg-green-100';
      case SyncStatus.ERROR: return 'text-red-600 bg-red-100';
      case SyncStatus.SYNCING: return 'text-blue-600 bg-blue-100';
      case SyncStatus.CONFLICT: return 'text-yellow-600 bg-yellow-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getSyncStatusText = (status: SyncStatus): string => {
    switch (status) {
      case SyncStatus.SUCCESS: return 'Sincronizado';
      case SyncStatus.ERROR: return 'Error';
      case SyncStatus.SYNCING: return 'Sincronizando...';
      case SyncStatus.CONFLICT: return 'Conflicto';
      default: return 'Inactivo';
    }
  };

  const getNetworkStatusColor = (status: NetworkStatus): string => {
    switch (status) {
      case 'wifi': return 'text-green-600 bg-green-100';
      case 'cellular': return 'text-blue-600 bg-blue-100';
      case 'connected': return 'text-green-600 bg-green-100';
      default: return 'text-red-600 bg-red-100';
    }
  };

  const getBatteryStatusColor = (status: BatteryStatus): string => {
    switch (status) {
      case 'charging': return 'text-green-600 bg-green-100';
      case 'full': return 'text-green-600 bg-green-100';
      case 'low': return 'text-red-600 bg-red-100';
      default: return 'text-yellow-600 bg-yellow-100';
    }
  };

  const formatDate = (date: Date): string => {
    return new Intl.DateTimeFormat('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const formatBytes = (bytes: number): string => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  if (!canViewMobileFeatures) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="text-center">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Funciones Móviles</h3>
          <p className="text-gray-600 mb-4">No tienes permisos para acceder a las funciones móviles.</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-lg shadow-md ${className}`}>
      {/* Header con tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8 px-6">
          {showOfflineSync && (
            <button
              onClick={() => setActiveTab('sync')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'sync'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Sincronización
            </button>
          )}
          {showLocationTracking && (
            <button
              onClick={() => setActiveTab('location')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'location'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Ubicación
            </button>
          )}
          {showPushNotifications && (
            <button
              onClick={() => setActiveTab('notifications')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'notifications'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Notificaciones
            </button>
          )}
          {showAnalytics && (
            <button
              onClick={() => setActiveTab('analytics')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'analytics'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Analíticas
            </button>
          )}
          {showDeviceInfo && (
            <button
              onClick={() => setActiveTab('device')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'device'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Dispositivo
            </button>
          )}
        </nav>
      </div>

      {/* Contenido de tabs */}
      <div className="p-6">
        {isLoading && (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-800">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Tab: Sincronización Offline */}
        {activeTab === 'sync' && showOfflineSync && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-900">Sincronización Offline</h3>
              <div className="flex space-x-2">
                <button
                  onClick={handleManualSync}
                  disabled={isLoading}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
                >
                  Sincronizar
                </button>
                <button
                  onClick={handleClearOfflineData}
                  disabled={isLoading}
                  className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 disabled:opacity-50"
                >
                  Limpiar Datos
                </button>
              </div>
            </div>

            {offlineData && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900">Estado</h4>
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getSyncStatusColor(offlineData.syncStatus)}`}>
                    {getSyncStatusText(offlineData.syncStatus)}
                  </span>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900">Última Sincronización</h4>
                  <p className="text-sm text-gray-600">{formatDate(offlineData.lastSync)}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900">Barcos Offline</h4>
                  <p className="text-2xl font-bold text-blue-600">{offlineData.boats.length}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900">Itinerarios Offline</h4>
                  <p className="text-2xl font-bold text-green-600">{offlineData.itineraries.length}</p>
                </div>
              </div>
            )}

            {offlineData?.pendingChanges.length > 0 && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <h4 className="font-medium text-yellow-900 mb-2">Cambios Pendientes</h4>
                <div className="space-y-2">
                  {offlineData.pendingChanges.map((change) => (
                    <div key={change.id} className="flex justify-between items-center text-sm">
                      <span className="text-yellow-800">
                        {change.type} - {change.entity}
                      </span>
                      <span className="text-yellow-600">
                        Reintentos: {change.retryCount}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Tab: Ubicación */}
        {activeTab === 'location' && showLocationTracking && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900">Seguimiento de Ubicación</h3>

            {currentLocation && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-3">Ubicación Actual</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Latitud:</span>
                      <span className="font-medium">{currentLocation.latitude.toFixed(6)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Longitud:</span>
                      <span className="font-medium">{currentLocation.longitude.toFixed(6)}</span>
                    </div>
                    {currentLocation.accuracy && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Precisión:</span>
                        <span className="font-medium">{currentLocation.accuracy.toFixed(1)}m</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-gray-600">Última actualización:</span>
                      <span className="font-medium">{formatDate(currentLocation.timestamp)}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-3">Historial de Ubicaciones</h4>
                  <p className="text-sm text-gray-600 mb-2">
                    {locationHistory.length} ubicaciones registradas
                  </p>
                  {locationHistory.slice(-5).map((location, index) => (
                    <div key={index} className="text-xs text-gray-500 border-b border-gray-200 py-1">
                      {location.latitude.toFixed(4)}, {location.longitude.toFixed(4)} - {formatDate(location.timestamp)}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {!currentLocation && (
              <div className="text-center py-8">
                <p className="text-gray-600">No hay datos de ubicación disponibles</p>
              </div>
            )}
          </div>
        )}

        {/* Tab: Notificaciones Push */}
        {activeTab === 'notifications' && showPushNotifications && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900">Notificaciones Push</h3>

            {pushNotifications.length > 0 ? (
              <div className="space-y-4">
                {pushNotifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`border rounded-lg p-4 ${notification.read ? 'bg-gray-50' : 'bg-blue-50'}`}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">{notification.title}</h4>
                        <p className="text-sm text-gray-600 mt-1">{notification.body}</p>
                        <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                          <span>{formatDate(notification.timestamp)}</span>
                          <span className={`px-2 py-1 rounded-full ${
                            notification.priority === 'high' ? 'bg-red-100 text-red-800' :
                            notification.priority === 'normal' ? 'bg-blue-100 text-blue-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {notification.priority}
                          </span>
                          {notification.read && <span className="text-green-600">Leída</span>}
                        </div>
                      </div>
                      {!notification.read && (
                        <button
                          onClick={() => handleMarkNotificationAsRead(notification.id)}
                          className="text-blue-600 hover:text-blue-800 text-sm"
                        >
                          Marcar como leída
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-600">No hay notificaciones disponibles</p>
              </div>
            )}
          </div>
        )}

        {/* Tab: Analíticas */}
        {activeTab === 'analytics' && showAnalytics && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900">Analíticas Móviles</h3>

            {analytics && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-3">Uso de la App</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Tiempo en app:</span>
                      <span className="font-medium">{Math.round(analytics.appUsage.timeInApp / 1000)}s</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Sesiones/día:</span>
                      <span className="font-medium">{analytics.appUsage.sessionsPerDay}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Vistas de pantalla:</span>
                      <span className="font-medium">{analytics.appUsage.screenViews.length}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-3">Rendimiento</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Tiempo de inicio:</span>
                      <span className="font-medium">{Math.round(analytics.performance.appLaunchTime)}ms</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Tiempo de carga:</span>
                      <span className="font-medium">{Math.round(analytics.performance.screenLoadTime)}ms</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Respuesta API:</span>
                      <span className="font-medium">{Math.round(analytics.performance.apiResponseTime)}ms</span>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-3">Errores</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Crashes:</span>
                      <span className="font-medium text-red-600">{analytics.errors.crashes.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Excepciones:</span>
                      <span className="font-medium text-orange-600">{analytics.errors.exceptions.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Errores de red:</span>
                      <span className="font-medium text-yellow-600">{analytics.errors.networkErrors.length}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {!analytics && (
              <div className="text-center py-8">
                <p className="text-gray-600">No hay datos de analíticas disponibles</p>
              </div>
            )}
          </div>
        )}

        {/* Tab: Información del Dispositivo */}
        {activeTab === 'device' && showDeviceInfo && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900">Información del Dispositivo</h3>

            {deviceInfo && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-3">Dispositivo</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Plataforma:</span>
                      <span className="font-medium capitalize">{deviceInfo.platform}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Versión:</span>
                      <span className="font-medium">{deviceInfo.version}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Modelo:</span>
                      <span className="font-medium">{deviceInfo.model}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Fabricante:</span>
                      <span className="font-medium">{deviceInfo.manufacturer}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Tamaño de pantalla:</span>
                      <span className="font-medium">{deviceInfo.screenSize}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-3">Estado del Sistema</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Red:</span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getNetworkStatusColor(deviceInfo.networkType)}`}>
                        {deviceInfo.networkType}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Batería:</span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getBatteryStatusColor(batteryStatus)}`}>
                        {batteryStatus}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Memoria:</span>
                      <span className="font-medium">{deviceInfo.memory}GB</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Almacenamiento:</span>
                      <span className="font-medium">{deviceInfo.storage > 0 ? formatBytes(deviceInfo.storage) : 'N/A'}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {!deviceInfo && (
              <div className="text-center py-8">
                <p className="text-gray-600">No hay información del dispositivo disponible</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
} 