import React, { useState, useEffect } from 'react';
import { PhoneIcon, XIcon, SparklesIcon } from './icons';

interface AppInstallBannerProps {
  onClose?: () => void;
}

const AppInstallBanner: React.FC<AppInstallBannerProps> = ({ onClose }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [isInstalling, setIsInstalling] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  useEffect(() => {
    // Verificar si la app ya está instalada
    const isAppInstalled = window.matchMedia('(display-mode: standalone)').matches ||
                          (window.navigator as any).standalone === true;

    if (!isAppInstalled) {
      // Mostrar el banner después de un delay
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, []);

  useEffect(() => {
    // Escuchar el evento beforeinstallprompt
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) {
      console.log('No se puede instalar la app en este momento');
      return;
    }

    setIsInstalling(true);

    try {
      // Mostrar el prompt de instalación
      deferredPrompt.prompt();

      // Esperar la respuesta del usuario
      const { outcome } = await deferredPrompt.userChoice;

      if (outcome === 'accepted') {
        console.log('Usuario aceptó instalar la app');
        // Limpiar el prompt
        setDeferredPrompt(null);
        // Ocultar el banner
        handleClose();
      } else {
        console.log('Usuario rechazó instalar la app');
      }
    } catch (error) {
      console.error('Error durante la instalación:', error);
    } finally {
      setIsInstalling(false);
    }
  };

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsVisible(false);
      onClose?.();
    }, 300);
  };

  if (!isVisible) return null;

  return (
    <div className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-out ${
      isClosing ? 'transform -translate-y-full opacity-0' : 'transform translate-y-0 opacity-100'
    }`}>
      {/* Banner principal - Mejorado para móvil */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white shadow-2xl border-b border-slate-700/50 backdrop-blur-sm relative">
        {/* Efecto de brillo superior */}
        <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-blue-400/50 to-transparent"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-3 sm:py-4">
            {/* Lado izquierdo - Logo y texto - Mejorado para móvil */}
            <div className="flex items-center space-x-3 sm:space-x-4 flex-1 min-w-0">
              {/* Logo con efecto de brillo */}
              <div className="relative flex-shrink-0">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg relative overflow-hidden border border-blue-400/30">
                  <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent"></div>
                  <PhoneIcon className="w-5 h-5 sm:w-6 sm:h-6 text-white relative z-10" />
                </div>
                
                {/* Indicador de PWA */}
                <div className="absolute -top-1 -right-1 w-3 h-3 sm:w-4 sm:h-4 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg">
                  <SparklesIcon className="w-1.5 h-1.5 sm:w-2 sm:w-2 text-white" />
                </div>
              </div>
              
              {/* Texto informativo - Mejorado para móvil */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2 mb-0.5 sm:mb-1">
                  <h3 className="text-sm sm:text-base font-bold text-white truncate">
                    BoatTrip Planner
                  </h3>
                  <span className="px-2 py-0.5 bg-blue-500/20 border border-blue-400/30 rounded-full text-xs font-medium text-blue-300">
                    PWA
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-slate-300 leading-tight">
                  Instala la app para navegar sin conexión y mejor experiencia
                </p>
              </div>
            </div>
            
            {/* Lado derecho - Botón de instalación con X pequeña */}
            <div className="flex items-center space-x-2 sm:space-x-3">
              {/* Botón de instalación */}
              <button
                onClick={handleInstallClick}
                disabled={isInstalling}
                className="group relative px-3 py-2 sm:px-4 sm:py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold rounded-lg sm:rounded-xl border border-blue-400/30 transition-all duration-200 hover:scale-105 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden text-xs sm:text-sm"
              >
                {/* Efecto de brillo en hover */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-500"></div>
                
                <div className="relative flex items-center space-x-1.5 sm:space-x-2">
                  {isInstalling ? (
                    <>
                      <div className="w-3 h-3 sm:w-4 sm:h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      <span className="hidden sm:inline">Instalando...</span>
                      <span className="sm:hidden">...</span>
                    </>
                  ) : (
                    <>
                      <span className="hidden sm:inline">Instalar App</span>
                      <span className="sm:hidden">Instalar</span>
                    </>
                  )}
                </div>
              </button>
              
              {/* Botón de cerrar - Pequeño y discreto */}
              <button
                onClick={handleClose}
                className="p-1.5 sm:p-2 text-slate-400 hover:text-white hover:bg-slate-700/50 rounded-lg transition-all duration-200 group"
                aria-label="Cerrar banner"
              >
                                 <XIcon className="w-4 h-4 sm:w-5 sm:h-5 group-hover:scale-110 transition-transform duration-200" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppInstallBanner; 