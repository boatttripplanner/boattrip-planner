// components/GoogleAnalyticsConsent.tsx
// 🍪 Componente de consentimiento GDPR para Google Analytics

import React, { useState, useEffect } from 'react';

interface ConsentPreferences {
  analytics: boolean;
  marketing: boolean;
  necessary: boolean;
}

const GoogleAnalyticsConsent: React.FC = () => {
  const [showBanner, setShowBanner] = useState(false);
  const [preferences, setPreferences] = useState<ConsentPreferences>({
    analytics: false,
    marketing: false,
    necessary: true
  });

  useEffect(() => {
    // Verificar si ya se ha dado consentimiento
    const storedConsent = localStorage.getItem('cookieConsent');
    if (!storedConsent) {
      setShowBanner(true);
    } else {
      const parsedConsent = JSON.parse(storedConsent);
      setPreferences(parsedConsent);
      updateAnalyticsConsent(parsedConsent.analytics);
    }
  }, []);

  const updateAnalyticsConsent = (analyticsEnabled: boolean) => {
    if (typeof window !== 'undefined' && (window as any).gtag) {
      if (analyticsEnabled) {
        // Habilitar analytics
        (window as any).gtag('consent', 'update', {
          analytics_storage: 'granted',
          ad_storage: 'granted',
          ad_user_data: 'granted',
          ad_personalization: 'granted'
        });
        console.log('✅ Google Analytics habilitado');
      } else {
        // Deshabilitar analytics
        (window as any).gtag('consent', 'update', {
          analytics_storage: 'denied',
          ad_storage: 'denied',
          ad_user_data: 'denied',
          ad_personalization: 'denied'
        });
        console.log('❌ Google Analytics deshabilitado');
      }
    }
  };

  const handleAcceptAll = () => {
    const newPreferences = {
      analytics: true,
      marketing: true,
      necessary: true
    };
    
    setPreferences(newPreferences);
    localStorage.setItem('cookieConsent', JSON.stringify(newPreferences));
    updateAnalyticsConsent(true);
    setShowBanner(false);
  };

  const handleAcceptSelected = () => {
    localStorage.setItem('cookieConsent', JSON.stringify(preferences));
    updateAnalyticsConsent(preferences.analytics);
    setShowBanner(false);
  };

  const handleDecline = () => {
    const newPreferences = {
      analytics: false,
      marketing: false,
      necessary: true
    };
    
    setPreferences(newPreferences);
    localStorage.setItem('cookieConsent', JSON.stringify(newPreferences));
    updateAnalyticsConsent(false);
    setShowBanner(false);
  };

  const handlePreferenceChange = (key: keyof ConsentPreferences) => {
    setPreferences(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  if (!showBanner) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              🍪 Configuración de Cookies
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Utilizamos cookies para mejorar tu experiencia, analizar el tráfico del sitio y personalizar el contenido. 
              Puedes elegir qué tipos de cookies aceptar.
            </p>
            
            {/* Preferencias de cookies */}
            <div className="space-y-3 mb-4">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-sm font-medium text-gray-700">Cookies necesarias</span>
                  <p className="text-xs text-gray-500">Siempre activas para el funcionamiento del sitio</p>
                </div>
                <input
                  type="checkbox"
                  checked={preferences.necessary}
                  disabled
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-sm font-medium text-gray-700">Cookies analíticas</span>
                  <p className="text-xs text-gray-500">Nos ayudan a entender cómo usas el sitio</p>
                </div>
                <input
                  type="checkbox"
                  checked={preferences.analytics}
                  onChange={() => handlePreferenceChange('analytics')}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-sm font-medium text-gray-700">Cookies de marketing</span>
                  <p className="text-xs text-gray-500">Para mostrar contenido personalizado</p>
                </div>
                <input
                  type="checkbox"
                  checked={preferences.marketing}
                  onChange={() => handlePreferenceChange('marketing')}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-2">
            <button
              onClick={handleDecline}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
            >
              Rechazar todo
            </button>
            <button
              onClick={handleAcceptSelected}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Aceptar seleccionadas
            </button>
            <button
              onClick={handleAcceptAll}
              className="px-4 py-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              Aceptar todas
            </button>
          </div>
        </div>
        
        <div className="mt-4 text-xs text-gray-500">
          <p>
            Al hacer clic en "Aceptar", consientes el uso de cookies según tus preferencias. 
            Puedes cambiar estas preferencias en cualquier momento desde la configuración del sitio.
          </p>
        </div>
      </div>
    </div>
  );
};

export default GoogleAnalyticsConsent;
