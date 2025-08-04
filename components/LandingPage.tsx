import React from 'react';
import { MapRouteIcon } from './icons/MapRouteIcon';
import { ChecklistIcon } from './icons/ChecklistIcon';
import { StarOutlineIcon } from './icons/StarOutlineIcon';
import { Button } from './Button';


interface LandingPageProps {
  onStartPlanning: () => void;
  showAppInstallBanner?: boolean;
}

const LandingPage: React.FC<LandingPageProps> = ({ onStartPlanning, showAppInstallBanner = false }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-ocean-50 via-white to-sea-50 relative overflow-hidden transition-all duration-500 ease-in-out">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-ocean-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-sea-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-40 left-40 w-60 h-60 bg-sunset-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float" style={{ animationDelay: '4s' }}></div>
      </div>

      {/* Hero Section - Optimizado para móvil */}
      <div className="relative z-10">
        <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-6 sm:pb-8 md:pb-12 lg:pb-16 transition-all duration-300 ease-out ${
          showAppInstallBanner 
            ? 'pt-20 sm:pt-24 md:pt-28 lg:pt-32' 
            : 'pt-12 sm:pt-16 md:pt-20 lg:pt-24'
        }`}>
          <div className="text-center">
            {/* Enhanced Typography - Optimizado para móvil */}
            <div className="animate-slide-up" style={{ animationDelay: '0.2s' }}>
              <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl 2xl:text-7xl font-bold text-slate-800 mb-2 sm:mb-3 md:mb-4 lg:mb-6 leading-tight px-2">
                Planifica tu
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-ocean-600 via-sea-600 to-sunset-600 animate-pulse-slow">
                  Aventura Náutica
                </span>
              </h1>
            </div>
            
            <div className="animate-slide-up" style={{ animationDelay: '0.4s' }}>
              <p className="text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl text-slate-600 mb-3 sm:mb-4 md:mb-6 lg:mb-8 max-w-4xl mx-auto leading-relaxed px-3 sm:px-4">
                Genera itinerarios personalizados para viajes en barco con inteligencia artificial, 
                adaptados a tus preferencias y condiciones meteorológicas
              </p>
            </div>
            
            {/* Enhanced CTA Button - Optimizado para móvil */}
            <div className="animate-slide-up" style={{ animationDelay: '0.6s' }}>
              <Button
                onClick={onStartPlanning}
                variant="primary"
                className="text-sm sm:text-base md:text-lg px-4 sm:px-6 md:px-8 lg:px-10 py-2.5 sm:py-3 md:py-4 lg:py-5 bg-gradient-to-r from-ocean-500 to-sea-500 hover:from-ocean-600 hover:to-sea-600 shadow-strong hover:shadow-glow-strong transform hover:-translate-y-1 transition-all duration-300 rounded-xl font-semibold w-full sm:w-auto max-w-xs sm:max-w-sm md:max-w-none"
              >
                Comenzar a Planificar
              </Button>
            </div>

            {/* Trust Indicators - Optimizado para móvil */}
            <div className="mt-4 sm:mt-6 md:mt-8 lg:mt-12 animate-fade-in" style={{ animationDelay: '0.8s' }}>
              <div className="flex flex-col sm:flex-row flex-wrap justify-center gap-2 sm:gap-3 md:gap-4 lg:gap-6 xl:gap-8 text-xs sm:text-sm text-slate-500 px-3 sm:px-4">
                <div className="flex items-center justify-center gap-1.5 sm:gap-2">
                  <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-sea-500 rounded-full animate-pulse"></div>
                  <span>IA Avanzada</span>
                </div>
                <div className="flex items-center justify-center gap-1.5 sm:gap-2">
                  <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-ocean-500 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>
                  <span>Meteorología en Tiempo Real</span>
                </div>
                <div className="flex items-center justify-center gap-1.5 sm:gap-2">
                  <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-sunset-500 rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
                  <span>Respuesta Instantánea</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Features Section - Optimizado para móvil */}
      <div className="py-6 sm:py-8 md:py-12 lg:py-16 xl:py-20 bg-white/80 backdrop-blur-sm relative">
        <div className="absolute inset-0 bg-wave-pattern opacity-5"></div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-6 sm:mb-8 md:mb-12 lg:mb-16 animate-fade-in">
            <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl 2xl:text-5xl font-bold text-slate-800 mb-2 sm:mb-3 md:mb-4 lg:mb-6 px-3 sm:px-4">
              ¿Por qué elegir{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-ocean-600 to-sea-600">
                BoatTrip Planner?
              </span>
            </h2>
            <p className="text-sm sm:text-base md:text-lg lg:text-xl text-slate-600 max-w-3xl mx-auto px-3 sm:px-4">
              La herramienta más avanzada para planificar tus viajes en barco con tecnología de vanguardia
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4 md:gap-6 lg:gap-8">
            {/* Enhanced Feature 1 - Optimizado para móvil */}
            <div className="group text-center p-3 sm:p-4 md:p-6 lg:p-8 rounded-lg sm:rounded-xl md:rounded-2xl bg-gradient-to-br from-ocean-50 to-ocean-100 border border-ocean-200 hover:border-ocean-300 transition-all duration-300 hover:shadow-medium transform hover:-translate-y-2 animate-fade-in" style={{ animationDelay: '0.2s' }}>
              <div className="relative mb-2 sm:mb-3 md:mb-4 lg:mb-6">
                <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 lg:w-20 lg:h-20 bg-gradient-to-br from-ocean-500 to-ocean-600 rounded-lg sm:rounded-xl md:rounded-2xl flex items-center justify-center mx-auto shadow-medium group-hover:shadow-glow transition-all duration-300">
                  <MapRouteIcon className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8 lg:w-10 lg:h-10 text-white" />
                </div>
                <div className="absolute -inset-2 bg-gradient-to-r from-ocean-400 to-ocean-600 rounded-lg sm:rounded-xl md:rounded-2xl opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-300"></div>
              </div>
              <h3 className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold text-slate-800 mb-1.5 sm:mb-2 md:mb-3 lg:mb-4">
                Itinerarios Inteligentes
              </h3>
              <p className="text-xs sm:text-sm md:text-base text-slate-600 leading-relaxed">
                Genera rutas personalizadas basadas en tus preferencias, experiencia y destino elegido con IA avanzada
              </p>
            </div>

            {/* Enhanced Feature 2 - Optimizado para móvil */}
            <div className="group text-center p-3 sm:p-4 md:p-6 lg:p-8 rounded-lg sm:rounded-xl md:rounded-2xl bg-gradient-to-br from-sea-50 to-sea-100 border border-sea-200 hover:border-sea-300 transition-all duration-300 hover:shadow-medium transform hover:-translate-y-2 animate-fade-in" style={{ animationDelay: '0.4s' }}>
              <div className="relative mb-2 sm:mb-3 md:mb-4 lg:mb-6">
                <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 lg:w-20 lg:h-20 bg-gradient-to-br from-sea-500 to-sea-600 rounded-lg sm:rounded-xl md:rounded-2xl flex items-center justify-center mx-auto shadow-medium group-hover:shadow-glow transition-all duration-300">
                  <ChecklistIcon className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8 lg:w-10 lg:h-10 text-white" />
                </div>
                <div className="absolute -inset-2 bg-gradient-to-r from-sea-400 to-sea-600 rounded-lg sm:rounded-xl md:rounded-2xl opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-300"></div>
              </div>
              <h3 className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold text-slate-800 mb-1.5 sm:mb-2 md:mb-3 lg:mb-4">
                Checklist Completo
              </h3>
              <p className="text-xs sm:text-sm md:text-base text-slate-600 leading-relaxed">
                Listas de verificación personalizadas para no olvidar nada importante en tu viaje náutico
              </p>
            </div>

            {/* Enhanced Feature 3 - Optimizado para móvil */}
            <div className="group text-center p-3 sm:p-4 md:p-6 lg:p-8 rounded-lg sm:rounded-xl md:rounded-2xl bg-gradient-to-br from-sunset-50 to-sunset-100 border border-sunset-200 hover:border-sunset-300 transition-all duration-300 hover:shadow-medium transform hover:-translate-y-2 animate-fade-in" style={{ animationDelay: '0.6s' }}>
              <div className="relative mb-2 sm:mb-3 md:mb-4 lg:mb-6">
                <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 lg:w-20 lg:h-20 bg-gradient-to-br from-sunset-500 to-sunset-600 rounded-lg sm:rounded-xl md:rounded-2xl flex items-center justify-center mx-auto shadow-medium group-hover:shadow-glow transition-all duration-300">
                  <StarOutlineIcon className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8 lg:w-10 lg:h-10 text-white" />
                </div>
                <div className="absolute -inset-2 bg-gradient-to-r from-sunset-400 to-sunset-600 rounded-lg sm:rounded-xl md:rounded-2xl opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-300"></div>
              </div>
              <h3 className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold text-slate-800 mb-1.5 sm:mb-2 md:mb-3 lg:mb-4">
                Adaptación Meteorológica
              </h3>
              <p className="text-xs sm:text-sm md:text-base text-slate-600 leading-relaxed">
                Itinerarios que se adaptan automáticamente a las condiciones meteorológicas en tiempo real
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* How it works Section - Optimizado para móvil */}
      <div className="py-8 sm:py-12 md:py-16 lg:py-20 bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12 md:mb-16">
            <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl font-bold text-slate-800 mb-2 sm:mb-3 md:mb-4 px-4">
              ¿Cómo funciona?
            </h2>
            <p className="text-sm sm:text-base md:text-lg lg:text-xl text-slate-600 max-w-2xl mx-auto px-4">
              En solo 3 pasos tendrás tu plan de viaje perfecto
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
            <div className="text-center">
              <div className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-2 sm:mb-3 md:mb-4 text-white text-lg sm:text-xl md:text-2xl font-bold">
                1
              </div>
              <h3 className="text-sm sm:text-base md:text-lg lg:text-xl font-semibold text-slate-800 mb-1.5 sm:mb-2 md:mb-3">
                Completa el Formulario
              </h3>
              <p className="text-xs sm:text-sm md:text-base text-slate-600 px-2">
                Responde algunas preguntas sobre tu experiencia, preferencias y destino
              </p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 bg-teal-500 rounded-full flex items-center justify-center mx-auto mb-2 sm:mb-3 md:mb-4 text-white text-lg sm:text-xl md:text-2xl font-bold">
                2
              </div>
              <h3 className="text-sm sm:text-base md:text-lg lg:text-xl font-semibold text-slate-800 mb-1.5 sm:mb-2 md:mb-3">
                IA Genera tu Plan
              </h3>
              <p className="text-xs sm:text-sm md:text-base text-slate-600 px-2">
                Nuestra inteligencia artificial crea un itinerario personalizado para ti
              </p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-2 sm:mb-3 md:mb-4 text-white text-lg sm:text-xl md:text-2xl font-bold">
                3
              </div>
              <h3 className="text-sm sm:text-base md:text-lg lg:text-xl font-semibold text-slate-800 mb-1.5 sm:mb-2 md:mb-3">
                ¡Disfruta tu Viaje!
              </h3>
              <p className="text-xs sm:text-sm md:text-base text-slate-600 px-2">
                Imprime, comparte o guarda tu plan perfecto para la aventura
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section - Optimizado para móvil */}
      <div className="py-8 sm:py-12 md:py-16 lg:py-20 bg-gradient-to-r from-blue-600 to-teal-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl font-bold text-white mb-3 sm:mb-4 md:mb-6 px-4">
            ¿Listo para tu próxima aventura náutica?
          </h2>
          <p className="text-sm sm:text-base md:text-lg lg:text-xl text-blue-100 mb-4 sm:mb-6 md:mb-8 px-4">
            Únete a miles de navegantes que ya confían en BoatTrip Planner para planificar sus viajes
          </p>
          <Button
            onClick={onStartPlanning}
            variant="secondary"
            className="text-sm sm:text-base md:text-lg px-4 sm:px-6 md:px-8 py-2.5 sm:py-3 md:py-4 bg-white text-blue-600 hover:bg-blue-50 shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200 w-full sm:w-auto max-w-xs sm:max-w-sm md:max-w-none"
          >
            Comenzar Ahora - Es Gratis
          </Button>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;