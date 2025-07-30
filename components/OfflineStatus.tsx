// components/OfflineStatus.tsx
// Componente para mostrar el estado offline y gestionar sincronización

import React, { useState } from 'react';
import { useOffline } from '../hooks/useOffline';
import { 
  WifiIcon, 
  WifiOffIcon, 
  CloudArrowUpIcon,
  CloudArrowDownIcon,
  CogIcon,
  TrashIcon,
  BellIcon,
  BellSlashIcon
} from './icons';

interface OfflineStatusProps {
  className?: string;
  showDetails?: boolean;
}

const OfflineStatus: React.FC<OfflineStatusProps> = ({ 
  className = '', 
  showDetails = false 
}) => {
  const [state, actions] = useOffline();
  const [isExpanded, setIsExpanded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSync = async () => {
    setIsLoading(true);
    try {
      await actions.syncData();
    } catch (error) {
      console.error('Sync failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleOfflineMode = async () => {
    setIsLoading(true);
    try {
      await actions.toggleOfflineMode();
    } catch (error) {
      console.error('Toggle offline mode failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearData = async () => {
    if (window.confirm('¿Estás seguro de que quieres eliminar todos los datos offline? Esta acción no se puede deshacer.')) {
      setIsLoading(true);
      try {
        await actions.clearOfflineData();
      } catch (error) {
        console.error('Clear data failed:', error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleNotificationPermission = async () => {
    setIsLoading(true);
    try {
      await actions.requestNotificationPermission();
    } catch (error) {
      console.error('Notification permission failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatLastSync = (timestamp: number) => {
    if (timestamp === 0) return 'Nunca';
    
    const now = Date.now();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (days > 0) return `Hace ${days} día${days > 1 ? 's' : ''}`;
    if (hours > 0) return `Hace ${hours} hora${hours > 1 ? 's' : ''}`;
    if (minutes > 0) return `Hace ${minutes} minuto${minutes > 1 ? 's' : ''}`;
    return 'Ahora mismo';
  };

  const getStatusColor = () => {
    if (state.isOfflineMode) return 'text-orange-600';
    if (!state.isOnline) return 'text-red-600';
    return 'text-green-600';
  };

  const getStatusText = () => {
    if (state.isOfflineMode) return 'Modo Offline';
    if (!state.isOnline) return 'Sin Conexión';
    return 'En Línea';
  };

  const getStatusIcon = () => {
    if (state.isOfflineMode) return <WifiOffIcon className="w-4 h-4" />;
    if (!state.isOnline) return <WifiOffIcon className="w-4 h-4" />;
    return <WifiIcon className="w-4 h-4" />;
  };

  if (!state.isInitialized) {
    return null;
  }

  return (
    <div className={`offline-status ${className}`}>
      {/* Barra de estado principal */}
      <div className="flex items-center justify-between p-2 bg-white border border-gray-200 rounded-lg shadow-sm max-w-xs">
        <div className="flex items-center space-x-2">
          <div className={`flex items-center space-x-1 ${getStatusColor()}`}>
            {getStatusIcon()}
            <span className="text-xs font-medium">{getStatusText()}</span>
          </div>
          
          {state.pendingForms > 0 && (
            <div className="flex items-center space-x-1 text-orange-600">
              <CloudArrowUpIcon className="w-3 h-3" />
              <span className="text-xs">
                {state.pendingForms}
              </span>
            </div>
          )}
        </div>

        <div className="flex items-center space-x-1">
          {/* Botón de sincronización */}
          <button
            onClick={handleSync}
            disabled={isLoading || !state.isOnline || state.isOfflineMode}
            className="p-1 text-gray-600 hover:text-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            title="Sincronizar datos"
          >
            <CloudArrowDownIcon className="w-3 h-3" />
          </button>

          {/* Botón de modo offline */}
          <button
            onClick={handleToggleOfflineMode}
            disabled={isLoading}
            className={`p-1 transition-colors ${
              state.isOfflineMode 
                ? 'text-orange-600 hover:text-orange-700' 
                : 'text-gray-600 hover:text-gray-700'
            } disabled:opacity-50 disabled:cursor-not-allowed`}
            title={state.isOfflineMode ? 'Desactivar modo offline' : 'Activar modo offline'}
          >
            <CogIcon className="w-3 h-3" />
          </button>

          {/* Botón de notificaciones */}
          <button
            onClick={handleNotificationPermission}
            disabled={isLoading}
            className="p-1 text-gray-600 hover:text-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            title="Configurar notificaciones"
          >
            {('Notification' in window && Notification.permission === 'granted') ? (
              <BellIcon className="w-3 h-3" />
            ) : (
              <BellSlashIcon className="w-3 h-3" />
            )}
          </button>

          {/* Botón de expandir detalles */}
          {showDetails && (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-1 text-gray-600 hover:text-gray-700 transition-colors"
              title="Ver detalles"
            >
              <svg 
                className={`w-3 h-3 transform transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Panel de detalles expandido */}
      {isExpanded && showDetails && (
        <div className="mt-3 p-4 bg-gray-50 border border-gray-200 rounded-lg">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Estadísticas */}
            <div className="space-y-3">
              <h4 className="text-sm font-medium text-gray-900">Estadísticas Offline</h4>
              
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Última sincronización:</span>
                  <span className="font-medium">{formatLastSync(state.lastSync)}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Formularios pendientes:</span>
                  <span className="font-medium">{state.pendingForms}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Elementos en caché:</span>
                  <span className="font-medium">{state.cacheSize}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Estado de conexión:</span>
                  <span className={`font-medium ${state.isOnline ? 'text-green-600' : 'text-red-600'}`}>
                    {state.isOnline ? 'Conectado' : 'Desconectado'}
                  </span>
                </div>
              </div>
            </div>

            {/* Acciones */}
            <div className="space-y-3">
              <h4 className="text-sm font-medium text-gray-900">Acciones</h4>
              
              <div className="space-y-2">
                <button
                  onClick={handleSync}
                  disabled={isLoading || !state.isOnline || state.isOfflineMode}
                  className="w-full flex items-center justify-center space-x-2 px-3 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <CloudArrowDownIcon className="w-4 h-4" />
                  <span>Sincronizar Ahora</span>
                </button>

                <button
                  onClick={handleToggleOfflineMode}
                  disabled={isLoading}
                  className={`w-full flex items-center justify-center space-x-2 px-3 py-2 text-sm rounded-md transition-colors ${
                    state.isOfflineMode
                      ? 'bg-orange-600 text-white hover:bg-orange-700'
                      : 'bg-gray-600 text-white hover:bg-gray-700'
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  <CogIcon className="w-4 h-4" />
                  <span>
                    {state.isOfflineMode ? 'Desactivar Modo Offline' : 'Activar Modo Offline'}
                  </span>
                </button>

                <button
                  onClick={handleNotificationPermission}
                  disabled={isLoading}
                  className="w-full flex items-center justify-center space-x-2 px-3 py-2 text-sm bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <BellIcon className="w-4 h-4" />
                  <span>Configurar Notificaciones</span>
                </button>

                <button
                  onClick={handleClearData}
                  disabled={isLoading}
                  className="w-full flex items-center justify-center space-x-2 px-3 py-2 text-sm bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <TrashIcon className="w-4 h-4" />
                  <span>Limpiar Datos Offline</span>
                </button>
              </div>
            </div>
          </div>

          {/* Información adicional */}
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="text-xs text-gray-500 space-y-1">
              <p>
                <strong>Modo Offline:</strong> Permite usar la aplicación sin conexión a internet. 
                Los datos se guardan localmente y se sincronizan cuando hay conexión.
              </p>
              <p>
                <strong>Sincronización:</strong> Los datos se sincronizan automáticamente cada 5 minutos 
                cuando hay conexión a internet.
              </p>
              <p>
                <strong>Notificaciones:</strong> Recibe alertas sobre el estado de sincronización 
                y actualizaciones importantes.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Indicador de carga */}
      {isLoading && (
        <div className="mt-2 flex items-center justify-center">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
          <span className="ml-2 text-sm text-gray-600">Procesando...</span>
        </div>
      )}
    </div>
  );
};

export default OfflineStatus; 