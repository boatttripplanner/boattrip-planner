import React from 'react';
import { MapRouteIcon } from './icons/MapRouteIcon';
import { ChecklistIcon } from './icons/ChecklistIcon';
import { StarOutlineIcon } from './icons/StarOutlineIcon';
import { Button } from './Button';

interface LandingPageProps {
  onStartPlanning: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onStartPlanning }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-slate-50 to-blue-100">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-400/10 to-teal-400/10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
          <div className="text-center">
            <div className="flex justify-center mb-8">
              <div className="w-24 h-24 bg-gradient-to-br from-blue-150 to-teal-250 rounded-full flex items-center justify-center shadow-2xl">
                <img 
                  src="/apple-touch-icon.png" 
                  alt="BoatTrip Planner Logo" 
                  className="w-12 h-12"
                />
              </div>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold text-slate-800 mb-6">
              Planifica tu
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-teal-600">
                Aventura Náutica
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-slate-600 mb-8 max-w-3xl mx-auto leading-relaxed">
              Genera itinerarios personalizados para viajes en barco con inteligencia artificial, 
              adaptados a tus preferencias y condiciones meteorológicas
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Button
                onClick={onStartPlanning}
                variant="primary"
                className="text-lg px-8 py-4 shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200"
              >
                Comenzar a Planificar
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">
              ¿Por qué elegir BoatTrip Planner?
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              La herramienta más avanzada para planificar tus viajes en barco
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="text-center p-6 rounded-xl bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200">
              <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <MapRouteIcon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-slate-800 mb-3">
                Itinerarios Inteligentes
              </h3>
              <p className="text-slate-600">
                Genera rutas personalizadas basadas en tus preferencias, experiencia y destino elegido
              </p>
            </div>

            {/* Feature 2 */}
            <div className="text-center p-6 rounded-xl bg-gradient-to-br from-teal-50 to-teal-100 border border-teal-200">
              <div className="w-16 h-16 bg-teal-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <ChecklistIcon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-slate-800 mb-3">
                Checklist Completo
              </h3>
              <p className="text-slate-600">
                Listas de verificación personalizadas para no olvidar nada importante en tu viaje
              </p>
            </div>

            {/* Feature 3 */}
            <div className="text-center p-6 rounded-xl bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200">
              <div className="w-16 h-16 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <StarOutlineIcon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-slate-800 mb-3">
                Adaptación Meteorológica
              </h3>
              <p className="text-slate-600">
                Itinerarios que se adaptan automáticamente a las condiciones del tiempo
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* How it works Section */}
      <div className="py-20 bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">
              ¿Cómo funciona?
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              En solo 3 pasos tendrás tu plan de viaje perfecto
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-20 h-20 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4 text-white text-2xl font-bold">
                1
              </div>
              <h3 className="text-xl font-semibold text-slate-800 mb-3">
                Completa el Formulario
              </h3>
              <p className="text-slate-600">
                Responde algunas preguntas sobre tu experiencia, preferencias y destino
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-teal-500 rounded-full flex items-center justify-center mx-auto mb-4 text-white text-2xl font-bold">
                2
              </div>
              <h3 className="text-xl font-semibold text-slate-800 mb-3">
                IA Genera tu Plan
              </h3>
              <p className="text-slate-600">
                Nuestra inteligencia artificial crea un itinerario personalizado para ti
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-4 text-white text-2xl font-bold">
                3
              </div>
              <h3 className="text-xl font-semibold text-slate-800 mb-3">
                ¡Disfruta tu Viaje!
              </h3>
              <p className="text-slate-600">
                Imprime, comparte o guarda tu plan perfecto para la aventura
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-20 bg-gradient-to-r from-blue-600 to-teal-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            ¿Listo para tu próxima aventura náutica?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Únete a miles de navegantes que ya confían en BoatTrip Planner para planificar sus viajes
          </p>
          <Button
            onClick={onStartPlanning}
            variant="secondary"
            className="text-lg px-8 py-4 bg-white text-blue-600 hover:bg-blue-50 shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200"
          >
            Comenzar Ahora - Es Gratis
          </Button>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;