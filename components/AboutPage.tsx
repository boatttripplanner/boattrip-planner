import React from 'react';

const AboutPage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Sobre BoatTrip Planner</h1>
        
        <div className="prose prose-lg max-w-none">
          <p className="text-lg text-gray-700 mb-6">
            BoatTrip Planner es tu compañero perfecto para planificar viajes en barco de manera inteligente y personalizada.
          </p>
          
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Nuestra Misión</h2>
          <p className="text-gray-700 mb-6">
            Facilitar la planificación de viajes náuticos mediante tecnología avanzada y recomendaciones personalizadas,
            haciendo que cada aventura en el mar sea inolvidable.
          </p>
          
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Características Principales</h2>
          <ul className="list-disc list-inside text-gray-700 mb-6 space-y-2">
            <li>Planificación inteligente con IA</li>
            <li>Recomendaciones personalizadas</li>
            <li>Integración con servicios meteorológicos</li>
            <li>Marketplace de servicios náuticos</li>
            <li>Aplicación PWA completa</li>
          </ul>
          
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Tecnología</h2>
          <p className="text-gray-700 mb-6">
            Desarrollada con las últimas tecnologías web, incluyendo React, TypeScript, y servicios de IA avanzados
            para ofrecer la mejor experiencia de usuario posible.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
