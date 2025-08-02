import React, { useState, useEffect } from 'react';
import { SparklesIcon, ArrowDownIcon, PhoneIcon } from './icons';

interface AppInstallTabProps {
  onShowBanner: () => void;
  onTabClose?: () => void;
}

const AppInstallTab: React.FC<AppInstallTabProps> = ({ onShowBanner, onTabClose }) => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstalling, setIsInstalling] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Función para verificar si la app está instalada
    const checkIfAppInstalled = () => {
      return window.matchMedia('(display-mode: standalone)').matches || 
             (window.navigator as any).standalone === true ||
             localStorage.getItem('appInstalled') === 'true';
    };

    // Verificar si la app ya está instalada
    const isAppInstalled = checkIfAppInstalled();
    
    // Si la app está instalada, ocultar la pestaña
    if (isAppInstalled) {
      setIsVisible(false);
      return;
    }
    
    // Verificar si el usuario cerró el banner
    const hasUserClosedBanner = localStorage.getItem('appInstallBannerClosed') === 'true';
    
    // Solo mostrar la pestaña si no está instalada y cerró el banner
    // Y solo en tablet y desktop (no en móvil)
    if (!isAppInstalled && hasUserClosedBanner) {
      // Verificar si no es móvil (screen width >= 640px)
      const isNotMobile = window.innerWidth >= 640;
      setIsVisible(isNotMobile);
    }

    // Escuchar el evento beforeinstallprompt
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    // Escuchar el evento appinstalled
    const handleAppInstalled = () => {
      console.log('App instalada - ocultando pestaña');
      setIsVisible(false);
      localStorage.setItem('appInstalled', 'true');
      // Limpiar el estado de banner cerrado
      localStorage.removeItem('appInstallBannerClosed');
      // Notificar que la pestaña se cerró
      onTabClose?.();
    };

    // Escuchar cambios en el display-mode
    const handleDisplayModeChange = (e: MediaQueryListEvent) => {
      if (e.matches) {
        console.log('Display mode cambiado a standalone - ocultando pestaña');
        setIsVisible(false);
        localStorage.setItem('appInstalled', 'true');
        localStorage.removeItem('appInstallBannerClosed');
        onTabClose?.();
      }
    };

    const mediaQuery = window.matchMedia('(display-mode: standalone)');
    mediaQuery.addEventListener('change', handleDisplayModeChange);
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      mediaQuery.removeEventListener('change', handleDisplayModeChange);
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, [onTabClose]);

  const handleClick = async () => {
    // Si tenemos el prompt de instalación disponible, usarlo directamente
    if (deferredPrompt) {
      try {
        setIsInstalling(true);
        console.log('🚀 Iniciando instalación PWA desde pestaña...');
        
        // Mostrar el prompt de instalación
        await deferredPrompt.prompt();
        
        // Esperar la respuesta del usuario
        const { outcome } = await deferredPrompt.userChoice;
        
        if (outcome === 'accepted') {
          // La app se instaló exitosamente
          console.log('✅ App instalada exitosamente desde pestaña');
          setIsVisible(false);
          // Notificar que la pestaña se cerró
          onTabClose?.();
        } else {
          // El usuario canceló la instalación, mostrar el banner
          console.log('❌ Usuario canceló la instalación desde pestaña');
          localStorage.removeItem('appInstallBannerClosed');
          onShowBanner();
          setIsVisible(false);
        }
        
        // Limpiar el prompt
        setDeferredPrompt(null);
      } catch (error) {
        console.error('❌ Error al instalar la app desde pestaña:', error);
        // En caso de error, mostrar instrucciones manuales
        alert('Para instalar la app, busca el botón "Instalar" en la barra de direcciones de tu navegador o en el menú de tres puntos.');
        setIsVisible(false);
      } finally {
        setIsInstalling(false);
      }
    } else {
      // Si no hay prompt disponible, mostrar instrucciones
      console.log('ℹ️ No hay prompt de instalación disponible en pestaña');
      alert('Para instalar la app:\n\n1. Busca el botón "Instalar" en la barra de direcciones\n2. O ve al menú de tres puntos → "Instalar aplicación"\n3. O añade esta página a tu pantalla de inicio');
      setIsVisible(false);
    }
  };

  if (!isVisible) return null;

  return (
    <>
      {/* Versión tablet - Pestaña lateral derecha */}
      <div className="fixed top-1/2 right-4 transform -translate-y-1/2 z-40 hidden sm:block lg:hidden">
        <button
          onClick={handleClick}
          disabled={isInstalling}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className="group relative bg-gradient-to-br from-ocean-500 to-sea-500 text-white p-4 rounded-2xl shadow-2xl hover:shadow-3xl transform transition-all duration-300 hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden border border-white/20"
          title="Instalar la aplicación"
          aria-label="Instalar la aplicación"
        >
          {/* Efecto de brillo en hover */}
          <div className={`absolute inset-0 bg-gradient-to-br from-transparent via-white/20 to-transparent transition-transform duration-700 ${
            isHovered ? 'translate-x-full translate-y-full' : '-translate-x-full -translate-y-full'
          }`}></div>
          
          {/* Contenido */}
          <div className="relative flex flex-col items-center space-y-2">
            {isInstalling ? (
              <>
                <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                <span className="text-xs font-medium text-center">Instalando...</span>
              </>
            ) : (
              <>
                <div className="relative">
                  <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                    <PhoneIcon className="w-4 h-4 text-white" />
                  </div>
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                    <SparklesIcon className="w-2 h-2 text-white" />
                  </div>
                </div>
                <span className="text-xs font-semibold text-center">Instalar</span>
                <ArrowDownIcon className="w-4 h-4" />
              </>
            )}
          </div>
        </button>
      </div>

      {/* Versión desktop - Pestaña inferior izquierda flotante */}
      <div className="fixed bottom-6 left-6 z-40 hidden lg:block">
        <button
          onClick={handleClick}
          disabled={isInstalling}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className="group relative bg-gradient-to-br from-ocean-500 via-ocean-400 to-sea-500 text-white p-5 rounded-2xl shadow-2xl hover:shadow-3xl transform transition-all duration-300 hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden border border-white/20"
          title="Instalar la aplicación"
          aria-label="Instalar la aplicación"
        >
          {/* Efecto de brillo en hover */}
          <div className={`absolute inset-0 bg-gradient-to-br from-transparent via-white/20 to-transparent transition-transform duration-700 ${
            isHovered ? 'translate-x-full translate-y-full' : '-translate-x-full -translate-y-full'
          }`}></div>
          
          {/* Contenido */}
          <div className="relative flex flex-col items-center space-y-3">
            {isInstalling ? (
              <>
                <div className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                <span className="text-sm font-medium text-center">Instalando...</span>
              </>
            ) : (
              <>
                <div className="relative">
                  <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                    <PhoneIcon className="w-6 h-6 text-white" />
                  </div>
                  <div className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                    <SparklesIcon className="w-2.5 h-2.5 text-white" />
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-sm font-bold">Instalar App</div>
                  <div className="text-xs text-white/80">Mejor experiencia</div>
                </div>
                <ArrowDownIcon className="w-5 h-5" />
              </>
            )}
          </div>
        </button>
      </div>
    </>
  );
};

  export default AppInstallTab; 