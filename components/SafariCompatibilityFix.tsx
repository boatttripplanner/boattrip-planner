import React, { useEffect, useState } from 'react';

interface SafariCompatibilityFixProps {
  children: React.ReactNode;
}

const SafariCompatibilityFix: React.FC<SafariCompatibilityFixProps> = ({ children }) => {
  const [isSafari, setIsSafari] = useState(false);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Detectar Safari
    const safariDetected = /Safari/.test(navigator.userAgent) && !/Chrome/.test(navigator.userAgent);
    setIsSafari(safariDetected);

    if (safariDetected) {
      console.log('Safari detectado - aplicando fixes de compatibilidad');
      
      // Safari-specific fixes
      applySafariFixes();
    }

    // Marcar como listo después de un breve delay
    const timer = setTimeout(() => {
      setIsReady(true);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  const applySafariFixes = () => {
    // Fix 1: Prevenir zoom en inputs
    const style = document.createElement('style');
    style.textContent = `
      input, textarea, select {
        font-size: 16px !important;
        -webkit-appearance: none;
        border-radius: 0;
      }
      
      /* Prevenir zoom en Safari */
      @media screen and (-webkit-min-device-pixel-ratio: 0) {
        select,
        textarea,
        input {
          font-size: 16px !important;
        }
      }
      
      /* Fix para flexbox en Safari */
      .flex {
        display: -webkit-box;
        display: -webkit-flex;
        display: -ms-flexbox;
        display: flex;
      }
      
      /* Fix para grid en Safari */
      .grid {
        display: -webkit-grid;
        display: grid;
      }
      
      /* Prevenir scroll horizontal en Safari */
      body {
        overflow-x: hidden;
        -webkit-overflow-scrolling: touch;
      }
      
      /* Fix para animaciones en Safari */
      * {
        -webkit-transform: translateZ(0);
        transform: translateZ(0);
      }
    `;
    document.head.appendChild(style);

    // Fix 2: Prevenir comportamientos problemáticos
    document.addEventListener('touchstart', (e) => {
      // Prevenir zoom en doble tap
      if (e.touches.length > 1) {
        e.preventDefault();
      }
    }, { passive: false });

    // Fix 3: Optimizar scroll
    document.addEventListener('scroll', () => {
      // Forzar repaint para mejor rendimiento
      document.body.style.transform = 'translateZ(0)';
    }, { passive: true });

    // Fix 4: Prevenir problemas con localStorage
    try {
      localStorage.setItem('safari-test', 'test');
      localStorage.removeItem('safari-test');
    } catch (error) {
      console.warn('localStorage no disponible en Safari');
    }
  };

  // Mostrar loading mientras se aplican los fixes
  if (!isReady) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-100 via-slate-50 to-blue-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-blue-50 to-teal-100 rounded-full flex items-center justify-center shadow-lg">
            <img 
              src="/apple-touch-icon.png" 
              alt="BoatTrip Planner Logo" 
              className="w-10 h-10"
            />
          </div>
          <h1 className="text-2xl font-bold text-slate-800 mb-2">
            Optimizando para Safari
          </h1>
          <p className="text-slate-600">
            Aplicando configuraciones específicas...
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default SafariCompatibilityFix; 