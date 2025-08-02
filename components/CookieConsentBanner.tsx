import React, { useState } from 'react';
import { Button } from './Button';
import { XIcon } from './icons/XIcon';
import { InfoIcon } from './icons/InfoIcon';
import ShieldCheckIcon from './icons/ShieldCheckIcon';

interface CookieConsentBannerProps {
  onAccept: () => void;
  onDecline: () => void;
  onShowPrivacyPolicy: () => void;
  onShowTermsOfService: () => void;
}

const CookieConsentBanner: React.FC<CookieConsentBannerProps> = ({
    onAccept,
    onDecline,
    onShowPrivacyPolicy,
    onShowTermsOfService
}) => {
  const [isVisible, setIsVisible] = useState(true);
  const [showDetails, setShowDetails] = useState(false);

  const handleAccept = () => {
    setIsVisible(false);
    setTimeout(() => onAccept(), 300); // Esperar a que termine la animación
  };

  const handleDecline = () => {
    setIsVisible(false);
    setTimeout(() => onDecline(), 300); // Esperar a que termine la animación
  };

  if (!isVisible) {
    return null;
  }

  return (
    <div className={`fixed bottom-0 left-0 right-0 z-50 no-print transition-all duration-300 ease-in-out ${
      isVisible ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'
    }`}>
      {/* Backdrop con blur */}
      <div className="absolute inset-0 bg-black/20 backdrop-blur-sm"></div>
      
      {/* Banner principal */}
      <div className="relative bg-gradient-to-r from-slate-800 via-slate-700 to-slate-800 border-t-2 border-ocean-500/50 shadow-2xl">
        {/* Patrón de fondo sutil */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.3'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}></div>
        </div>

        <div className="relative container mx-auto px-3 sm:px-4 py-3 sm:py-4">
          <div className="flex flex-col lg:flex-row items-start lg:items-center gap-3 sm:gap-4">
            
            {/* Icono y contenido principal */}
            <div className="flex items-start gap-2 sm:gap-3 flex-grow">
              <div className="flex-shrink-0 mt-0.5 sm:mt-1">
                <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-br from-ocean-500 to-sea-500 rounded-lg flex items-center justify-center shadow-lg">
                  <ShieldCheckIcon className="w-3 h-3 sm:w-5 sm:h-5 text-white" />
                </div>
              </div>
              
              <div className="flex-grow min-w-0">
                <div className="flex items-center gap-1 sm:gap-2 mb-1 sm:mb-2">
                  <h3 className="text-xs sm:text-sm font-bold text-white flex items-center gap-1 sm:gap-2">
                    <InfoIcon className="w-3 h-3 sm:w-4 sm:h-4 text-ocean-200" />
                    Configuración de Cookies
                  </h3>
                </div>
                
                <p className="text-xs text-white leading-relaxed mb-2 sm:mb-3 font-medium">
                  Utilizamos cookies para mejorar tu experiencia y, con tu permiso, para analítica y anuncios personalizados.
                </p>

                {/* Enlaces de política */}
                <div className="flex flex-wrap items-center gap-1 sm:gap-2 text-xs text-white mb-2 sm:mb-3">
                  <span className="font-medium">Consulta nuestra</span>
                  <button 
                    onClick={onShowPrivacyPolicy} 
                    className="text-ocean-200 hover:text-white underline decoration-dotted underline-offset-2 transition-colors focus:outline-none focus:ring-1 focus:ring-ocean-400 rounded-sm font-medium"
                  >
                    Política de Privacidad
                  </button>
                  <span className="font-medium">y</span>
                  <button 
                    onClick={onShowTermsOfService} 
                    className="text-ocean-200 hover:text-white underline decoration-dotted underline-offset-2 transition-colors focus:outline-none focus:ring-1 focus:ring-ocean-400 rounded-sm font-medium"
                  >
                    Términos
                  </button>
                </div>

                {/* Botón para mostrar más detalles */}
                <button
                  onClick={() => setShowDetails(!showDetails)}
                  className="text-xs text-ocean-200 hover:text-white underline decoration-dotted underline-offset-2 transition-colors focus:outline-none focus:ring-1 focus:ring-ocean-400 rounded-sm font-medium"
                >
                  {showDetails ? 'Ocultar detalles' : 'Ver detalles'}
                </button>
              </div>
            </div>

            {/* Botones de acción */}
            <div className="flex flex-col sm:flex-row gap-2 w-full lg:w-auto lg:flex-shrink-0">
              <Button
                onClick={handleAccept}
                variant="primary"
                size="sm"
                className="flex-shrink-0 w-full sm:w-auto px-4 sm:px-6 py-2 sm:py-2.5 bg-gradient-to-r from-ocean-500 to-sea-500 hover:from-ocean-600 hover:to-sea-600 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 text-xs sm:text-sm" 
                aria-label="Aceptar todas las cookies"
              >
                <ShieldCheckIcon className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                Aceptar Todas
              </Button>
              <Button
                onClick={handleDecline}
                variant="secondary"
                size="sm"
                className="flex-shrink-0 w-full sm:w-auto px-4 sm:px-6 py-2 sm:py-2.5 bg-slate-700 hover:bg-slate-600 text-white border border-slate-600 hover:border-slate-500 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 text-xs sm:text-sm"
                aria-label="Rechazar cookies no esenciales"
              >
                Solo Esenciales
              </Button>
            </div>
          </div>

          {/* Sección de detalles expandible */}
          {showDetails && (
            <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-slate-700 animate-fade-in">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2 sm:gap-4 text-xs">
                <div className="bg-slate-700/80 rounded-lg p-2 sm:p-3 border border-slate-600">
                  <h4 className="font-bold text-white mb-1 sm:mb-2 flex items-center gap-1 sm:gap-2">
                    <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-green-400 rounded-full"></div>
                    Cookies Esenciales
                  </h4>
                  <p className="text-white leading-relaxed font-medium text-xs">
                    Necesarias para el funcionamiento básico del sitio web.
                  </p>
                </div>
                
                <div className="bg-slate-700/80 rounded-lg p-2 sm:p-3 border border-slate-600">
                  <h4 className="font-bold text-white mb-1 sm:mb-2 flex items-center gap-1 sm:gap-2">
                    <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-blue-400 rounded-full"></div>
                    Cookies de Análisis
                  </h4>
                  <p className="text-white leading-relaxed font-medium text-xs">
                    Nos ayudan a mejorar el sitio web analizando cómo lo utilizas.
                  </p>
                </div>
                
                <div className="bg-slate-700/80 rounded-lg p-2 sm:p-3 border border-slate-600">
                  <h4 className="font-bold text-white mb-1 sm:mb-2 flex items-center gap-1 sm:gap-2">
                    <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-purple-400 rounded-full"></div>
                    Cookies de Marketing
                  </h4>
                  <p className="text-white leading-relaxed font-medium text-xs">
                    Utilizadas para mostrar anuncios relevantes y medir su efectividad.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CookieConsentBanner;