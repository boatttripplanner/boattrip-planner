import React, { useState, useEffect } from 'react';
import { XIcon, SparklesIcon, PhoneIcon } from './icons';

interface AppInstallBannerProps {
  onClose: () => void;
}

const AppInstallBanner: React.FC<AppInstallBannerProps> = ({ onClose }) => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstalling, setIsInstalling] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [showSafariOptions, setShowSafariOptions] = useState(false);

  // Función para detectar Safari y macOS/iOS
  const isSafari = () => {
    return navigator.userAgent.includes('Safari') && !navigator.userAgent.includes('Chrome');
  };

  const isMacOSOrIOS = () => {
    return /Mac|iPad|iPhone|iPod/.test(navigator.userAgent);
  };

  const isSafariOrApple = () => {
    return isSafari() && isMacOSOrIOS();
  };

  useEffect(() => {
    // Verificar si ya está instalado
    const isAlreadyInstalled = window.matchMedia('(display-mode: standalone)').matches ||
                              (window.navigator as any).standalone === true ||
                              localStorage.getItem('appInstalled') === 'true';
    
    if (isAlreadyInstalled) {
      console.log('🚫 App ya instalada, no mostrar banner');
      return;
    }

    // Verificar si el usuario ya cerró el banner
    const hasUserClosedBanner = localStorage.getItem('appInstallBannerClosed') === 'true';
    if (hasUserClosedBanner) {
      console.log('🚫 Usuario cerró el banner anteriormente');
      return;
    }

    // Escuchar el evento beforeinstallprompt
    const handleBeforeInstallPrompt = (e: Event) => {
      console.log('🎯 beforeinstallprompt event fired');
      e.preventDefault();
      setDeferredPrompt(e);
    };

    // Escuchar el evento appinstalled
    const handleAppInstalled = () => {
      console.log('✅ App instalada exitosamente');
      localStorage.setItem('appInstalled', 'true');
      localStorage.removeItem('appInstallBannerClosed');
      onClose(); // Cerrar el banner inmediatamente
    };

    // Verificar si el navegador soporta PWA
    const isPWAInstallable = 'serviceWorker' in navigator && 'PushManager' in window;
    console.log('🔍 PWA installable:', isPWAInstallable);

    // Verificar si el Service Worker está registrado
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.getRegistration().then(registration => {
        console.log('🔧 Service Worker registrado:', !!registration);
      });
    }

    if (isPWAInstallable) {
      window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.addEventListener('appinstalled', handleAppInstalled);
    } else {
      console.log('⚠️ Navegador no soporta PWA installation');
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, [onClose]);

  const handleInstallClick = async () => {
    console.log('🚀 Intentando instalar PWA...');
    console.log('📱 deferredPrompt disponible:', !!deferredPrompt);
    
    if (deferredPrompt) {
      try {
        setIsInstalling(true);
        console.log('🚀 Iniciando instalación PWA con prompt nativo...');
        
        // Mostrar el prompt de instalación nativo
        await deferredPrompt.prompt();
        
        // Esperar la respuesta del usuario
        const { outcome } = await deferredPrompt.userChoice;
        
        if (outcome === 'accepted') {
          console.log('✅ Usuario aceptó instalar la app');
          localStorage.setItem('appInstalled', 'true');
          localStorage.removeItem('appInstallBannerClosed');
          // El banner se ocultará automáticamente cuando se dispare el evento 'appinstalled'
        } else {
          console.log('❌ Usuario canceló la instalación');
        }
        
        // Limpiar el prompt
        setDeferredPrompt(null);
      } catch (error) {
        console.error('❌ Error al instalar la app:', error);
        showManualInstallInstructions();
      } finally {
        setIsInstalling(false);
      }
    } else {
      // Si no hay prompt nativo disponible, mostrar instrucciones
      console.log('ℹ️ No hay prompt de instalación disponible');
      showManualInstallInstructions();
    }
  };

  const showManualInstallInstructions = () => {
    const isChrome = /Chrome/.test(navigator.userAgent);
    const isEdge = /Edg/.test(navigator.userAgent);
    const isFirefox = /Firefox/.test(navigator.userAgent);
    
    // Para Safari y macOS/iOS, mostrar opciones directas en lugar de instrucciones
    if (isSafariOrApple()) {
      setShowSafariOptions(true);
      return;
    }
    
    let instructions = '';
    
    if (isChrome || isEdge) {
      instructions = 'Para instalar la app:\n\n1. Busca el botón "Instalar" en la barra de direcciones\n2. O ve al menú de tres puntos (⋮) → "Instalar aplicación"\n3. O presiona Ctrl+Shift+I y busca el icono de instalación';
    } else if (isFirefox) {
      instructions = 'Para instalar la app:\n\n1. Busca el icono de instalación en la barra de direcciones\n2. O ve al menú de tres líneas (☰) → "Instalar aplicación"\n3. O presiona F12 y busca el icono de instalación';
    } else {
      instructions = 'Para instalar la app:\n\n1. Busca el botón "Instalar" en la barra de direcciones\n2. O ve al menú del navegador → "Instalar aplicación"\n3. O añade esta página a tu pantalla de inicio';
    }
    
    alert(instructions);
  };

  const handleSafariInstall = () => {
    // Para Safari, intentar abrir el menú de compartir
    if (navigator.share) {
      navigator.share({
        title: 'BoatTrip Planner',
        text: 'Instala BoatTrip Planner para una mejor experiencia',
        url: window.location.href
      }).catch(() => {
        // Si falla, mostrar instrucciones básicas
        alert('Para instalar la app:\n\n1. Toca el botón de compartir (📤)\n2. Selecciona "Añadir a pantalla de inicio"\n3. Confirma la instalación');
      });
    } else {
      // Fallback para navegadores que no soportan Web Share API
      alert('Para instalar la app:\n\n1. Toca el botón de compartir (📤)\n2. Selecciona "Añadir a pantalla de inicio"\n3. Confirma la instalación');
    }
    setShowSafariOptions(false);
  };

  const handleSafariCancel = () => {
    setShowSafariOptions(false);
  };

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      localStorage.setItem('appInstallBannerClosed', 'true');
      onClose();
    }, 300);
  };

  return (
    <>
      <div className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-out ${
        isClosing ? 'transform -translate-y-full opacity-0' : 'transform translate-y-0 opacity-100'
      }`}>
        {/* Banner principal */}
        <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white shadow-2xl border-b border-slate-700/50 backdrop-blur-sm relative">
          {/* Efecto de brillo superior */}
          <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-blue-400/50 to-transparent"></div>
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between py-3 sm:py-4">
              {/* Lado izquierdo - Logo y texto */}
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
                
                {/* Texto informativo */}
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
                
                {/* X pequeña para cerrar */}
                <button
                  onClick={handleClose}
                  className="p-1.5 sm:p-2 text-slate-300 hover:text-white hover:bg-slate-700/70 rounded-full transition-all duration-200 hover:scale-110 border border-slate-600/30 hover:border-slate-500/50"
                  aria-label="Cerrar banner"
                >
                  <XIcon className="w-3 h-3 sm:w-4 sm:h-4" />
                </button>
              </div>
            </div>
          </div>
          
          {/* Indicador de progreso sutil */}
          <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-blue-400/30 to-transparent"></div>
        </div>
      </div>

      {/* Modal de opciones para Safari/macOS/iOS */}
      {showSafariOptions && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full mx-4 overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-4 text-white">
              <h3 className="text-lg font-bold">Instalar BoatTrip Planner</h3>
              <p className="text-blue-100 text-sm mt-1">Para macOS, iOS y Safari</p>
            </div>
            
            {/* Contenido */}
            <div className="px-6 py-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                  <PhoneIcon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-gray-700 font-medium">¿Quieres instalar la app?</p>
                  <p className="text-gray-500 text-sm">Acceso offline y mejor experiencia</p>
                </div>
              </div>
              
              <div className="space-y-3">
                <button
                  onClick={handleSafariInstall}
                  className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-200 hover:scale-105 hover:shadow-lg"
                >
                  Sí, instalar app
                </button>
                
                <button
                  onClick={handleSafariCancel}
                  className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-3 px-4 rounded-xl transition-all duration-200 hover:scale-105"
                >
                  No, gracias
                </button>
              </div>
              
              <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                <p className="text-blue-800 text-xs">
                  💡 <strong>Consejo:</strong> En Safari, toca el botón de compartir (📤) y selecciona "Añadir a pantalla de inicio"
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AppInstallBanner; 