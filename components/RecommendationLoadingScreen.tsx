import React, { useState, useEffect } from 'react';
import { LoadingSpinner } from './LoadingSpinner';

interface RecommendationLoadingScreenProps {
  onCancel?: () => void;
}

const RecommendationLoadingScreen: React.FC<RecommendationLoadingScreenProps> = ({ onCancel }) => {
  const [currentPhraseIndex, setCurrentPhraseIndex] = useState(0);

  const loadingPhrases = [
    "🌊 Analizando las mejores rutas náuticas...",
    "⛵ Calculando condiciones de navegación...",
    "🏝️ Buscando calas y fondeaderos ideales...",
    "🍽️ Seleccionando restaurantes y experiencias...",
    "📋 Preparando tu checklist personalizado...",
    "🌤️ Verificando condiciones meteorológicas...",
    "🎯 Adaptando el plan a tus preferencias...",
    "✨ Añadiendo toques especiales a tu aventura...",
    "📝 Finalizando los detalles de tu viaje...",
    "🚀 ¡Casi listo tu plan náutico perfecto!"
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPhraseIndex((prevIndex) => 
        prevIndex < loadingPhrases.length - 1 ? prevIndex + 1 : 0
      );
    }, 2000); // Cambiar frase cada 2 segundos

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-slate-50 to-blue-100 flex items-center justify-center py-4 sm:py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center">
          {/* Logo y título */}
          <div className="mb-6 sm:mb-8">
            <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 sm:mb-6 bg-gradient-to-br from-blue-50 to-teal-100 rounded-full flex items-center justify-center shadow-lg">
              <img 
                src="/apple-touch-icon.png" 
                alt="BoatTrip Planner Logo" 
                className="w-10 h-10 sm:w-12 sm:h-12"
              />
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-800 mb-3 sm:mb-4">
              Generando tu
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-teal-600">
                Plan Náutico
              </span>
            </h1>
            <p className="text-base sm:text-lg text-slate-600">
              Nuestra IA está creando una experiencia única para ti
            </p>
          </div>

          {/* Spinner y frase animada */}
          <div className="bg-white p-4 sm:p-6 md:p-8 rounded-xl sm:rounded-2xl shadow-xl sm:shadow-2xl max-w-2xl mx-auto">
            <div className="flex flex-col items-center space-y-4 sm:space-y-6">
              <LoadingSpinner size="md" />
              
              <div className="text-center">
                <p className="text-lg sm:text-xl font-semibold text-slate-800 mb-2">
                  {loadingPhrases[currentPhraseIndex]}
                </p>
                <div className="flex justify-center space-x-1">
                  {loadingPhrases.map((_, index) => (
                    <div
                      key={index}
                      className={`w-2 h-2 rounded-full transition-all duration-300 ${
                        index === currentPhraseIndex 
                          ? 'bg-teal-600 scale-125' 
                          : 'bg-slate-300'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Información adicional */}
          <div className="mt-6 sm:mt-8 text-center">
            <p className="text-slate-600 text-xs sm:text-sm mb-3 sm:mb-4 px-4">
              💡 Consejo: Mientras esperas, puedes revisar tus preferencias o explorar otras opciones
            </p>
            {onCancel && (
              <button
                onClick={onCancel}
                className="text-slate-500 hover:text-slate-700 text-xs sm:text-sm font-medium underline transition-colors px-2 py-1 rounded"
              >
                Cancelar generación
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecommendationLoadingScreen; 