import React from 'react';

const HowItWorksPage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Cómo Funciona</h1>
        
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          <div className="text-center">
            <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-blue-600">1</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Planifica tu Viaje</h3>
            <p className="text-gray-600">
              Usa nuestro wizard inteligente para definir tu experiencia, ruta, tripulación y preferencias.
            </p>
          </div>
          
          <div className="text-center">
            <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-blue-600">2</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Recibe Recomendaciones</h3>
            <p className="text-gray-600">
              Nuestra IA analiza tus preferencias y te sugiere las mejores opciones personalizadas.
            </p>
          </div>
          
          <div className="text-center">
            <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-blue-600">3</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Reserva y Disfruta</h3>
            <p className="text-gray-600">
              Reserva servicios en nuestro marketplace y disfruta de tu aventura náutica perfecta.
            </p>
          </div>
        </div>
        
        <div className="bg-gray-50 rounded-lg p-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Características Avanzadas</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-medium text-gray-800 mb-2">IA Inteligente</h3>
              <p className="text-gray-600">
                Nuestro sistema de IA analiza condiciones meteorológicas, rutas óptimas y tus preferencias
                para ofrecerte las mejores recomendaciones.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-800 mb-2">Marketplace Integrado</h3>
              <p className="text-gray-600">
                Accede a una amplia red de servicios náuticos: alquiler de barcos, tripulación,
                provisiones y más.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-800 mb-2">PWA Completa</h3>
              <p className="text-gray-600">
                Instala la aplicación en tu dispositivo y disfruta de funcionalidad offline
                y notificaciones push.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-800 mb-2">Análisis en Tiempo Real</h3>
              <p className="text-gray-600">
                Monitorea el rendimiento de tu aplicación y obtén insights detallados
                sobre el uso y la experiencia del usuario.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HowItWorksPage;
