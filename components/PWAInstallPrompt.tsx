// components/PWAInstallPrompt.tsx
// Componente para mostrar el prompt de instalación de la PWA

import React, { useState, useEffect } from 'react';
import { 
  DownloadIcon, 
  XMarkIcon,
  DevicePhoneMobileIcon,
  ComputerDesktopIcon
} from './icons';

interface PWAInstallPromptProps {
  className?: string;
}

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

const PWAInstallPrompt: React.FC<PWAInstallPromptProps> = ({ className = '' }) => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isInstalling, setIsInstalling] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    // Verificar si ya está instalado
    const checkIfInstalled = () => {
      if (window.matchMedia('(display-mode: standalone)').matches ||
          (window.navigator as any).standalone === true) {
        setIsInstalled(true);
        return true;
      }
      return false;
    };

    // Verificar si ya se descartó el prompt
    const dismissed = localStorage.getItem('pwa-install-dismissed');
    if (dismissed) {
      const dismissTime = parseInt(dismissed);
      const now = Date.now();
      const oneDay = 24 * 60 * 60 * 1000;
      
      if (now - dismissTime < oneDay) {
        setIsDismissed(true);
        return;
      } else {
        localStorage.removeItem('pwa-install-dismissed');
      }
    }

    // Si ya está instalado, no mostrar el prompt
    if (checkIfInstalled()) {
      return;
    }

    // Escuchar el evento beforeinstallprompt
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setIsVisible(true);
    };

    // Escuchar el evento appinstalled
    const handleAppInstalled = () => {
      setIsInstalled(true);
      setIsVisible(false);
      setDeferredPrompt(null);
      
      // Mostrar mensaje de éxito
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification('BoatTrip Planner Instalado', {
          body: '¡La aplicación se ha instalado correctamente! Ahora puedes acceder desde tu pantalla de inicio.',
          icon: '/web-app-manifest-192x192.png'
        });
      }
    };

    // Escuchar cambios en el modo de visualización
    const handleDisplayModeChange = () => {
      if (checkIfInstalled()) {
        setIsVisible(false);
        setDeferredPrompt(null);
      }
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);
    window.matchMedia('(display-mode: standalone)').addEventListener('change', handleDisplayModeChange);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
      window.matchMedia('(display-mode: standalone)').removeEventListener('change', handleDisplayModeChange);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    setIsInstalling(true);
    
    try {
      // Mostrar el prompt de instalación
      await deferredPrompt.prompt();
      
      // Esperar la respuesta del usuario
      const { outcome } = await deferredPrompt.userChoice;
      
      if (outcome === 'accepted') {
        console.log('Usuario aceptó la instalación');
        setIsInstalled(true);
        setIsVisible(false);
      } else {
        console.log('Usuario rechazó la instalación');
        handleDismiss();
      }
    } catch (error) {
      console.error('Error durante la instalación:', error);
    } finally {
      setIsInstalling(false);
      setDeferredPrompt(null);
    }
  };

  const handleDismiss = () => {
    setIsVisible(false);
    setIsDismissed(true);
    localStorage.setItem('pwa-install-dismissed', Date.now().toString());
  };

  const handleRemindLater = () => {
    setIsVisible(false);
    // Mostrar de nuevo en 1 hora
    setTimeout(() => {
      if (!isInstalled && !isDismissed) {
        setIsVisible(true);
      }
    }, 60 * 60 * 1000);
  };

  // No mostrar si ya está instalado, descartado o no hay prompt
  if (isInstalled || isDismissed || !isVisible || !deferredPrompt) {
    return null;
  }

  return (
    <div className={`pwa-install-prompt fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-80 z-50 ${className}`}>
      <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-4">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-teal-500 to-teal-600 rounded-lg flex items-center justify-center">
              <DownloadIcon className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-900">
                Instalar BoatTrip Planner
              </h3>
              <p className="text-xs text-gray-600">
                Acceso rápido desde tu pantalla de inicio
              </p>
            </div>
          </div>
          
          <button
            onClick={handleDismiss}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            title="Cerrar"
          >
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>

        {/* Características */}
        <div className="mb-4 space-y-2">
          <div className="flex items-center space-x-2 text-xs text-gray-600">
            <DevicePhoneMobileIcon className="w-4 h-4" />
            <span>Funciona offline</span>
          </div>
          <div className="flex items-center space-x-2 text-xs text-gray-600">
            <ComputerDesktopIcon className="w-4 h-4" />
            <span>Acceso rápido</span>
          </div>
          <div className="flex items-center space-x-2 text-xs text-gray-600">
            <DownloadIcon className="w-4 h-4" />
            <span>Sincronización automática</span>
          </div>
        </div>

        {/* Botones */}
        <div className="flex space-x-2">
          <button
            onClick={handleInstall}
            disabled={isInstalling}
            className="flex-1 bg-teal-600 text-white text-sm font-medium py-2 px-4 rounded-md hover:bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isInstalling ? (
              <div className="flex items-center justify-center space-x-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span>Instalando...</span>
              </div>
            ) : (
              'Instalar'
            )}
          </button>
          
          <button
            onClick={handleRemindLater}
            className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 transition-colors"
          >
            Más tarde
          </button>
        </div>

        {/* Información adicional */}
        <div className="mt-3 pt-3 border-t border-gray-100">
          <p className="text-xs text-gray-500">
            La aplicación se instalará en tu dispositivo y funcionará sin conexión a internet.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PWAInstallPrompt;

// Hook personalizado para gestionar la PWA
export function usePWA() {
  const [isInstallable, setIsInstallable] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);

  useEffect(() => {
    const checkInstallable = () => {
      // Verificar si ya está instalado
      if (window.matchMedia && window.matchMedia('(display-mode: standalone)').matches) {
        setIsInstalled(true);
        return;
      }

      if (window.navigator.standalone === true) {
        setIsInstalled(true);
        return;
      }

      // Verificar si es instalable
      const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
      const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
      
      if (!isStandalone && !isIOS) {
        setIsInstallable(true);
      }
    };

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setIsInstallable(true);
    };

    const handleAppInstalled = () => {
      setIsInstalled(true);
      setIsInstallable(false);
      setDeferredPrompt(null);
    };

    checkInstallable();

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const install = async () => {
    if (!deferredPrompt) return false;

    try {
      await deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      
      if (outcome === 'accepted') {
        setIsInstalled(true);
        setIsInstallable(false);
        setDeferredPrompt(null);
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Error installing PWA:', error);
      return false;
    }
  };

  return {
    isInstallable,
    isInstalled,
    install
  };
} 