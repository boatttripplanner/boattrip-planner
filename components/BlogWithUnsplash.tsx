import React from 'react';
import UnsplashImage from './UnsplashImage';
import UnsplashImageGallery from './UnsplashImageGallery';

const BlogWithUnsplash: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">
        🏝️ Croacia en Velero 2024: La Guía Definitiva
      </h1>

      {/* Imagen principal del artículo */}
      <div className="mb-8">
        <UnsplashImage
          category="destinations"
          width={1200}
          height={600}
          alt="Croacia en velero - Destinos mediterráneos"
          className="rounded-lg shadow-lg"
        />
      </div>

      <div className="prose prose-lg max-w-none">
        <p className="text-xl text-gray-600 mb-6">
          Imagina esto: Navegando por aguas turquesas del Adriático, descubriendo islas secretas 
          que solo conocen los navegantes, y trabajando desde tu "oficina flotante" con vistas que inspiran creatividad.
        </p>

        <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">
          🏆 Itinerario de 7 Días: Tu Aventura Definitiva
        </h2>

        {/* Día 1 - Split */}
        <div className="bg-white border border-gray-200 rounded-lg p-6 mb-8 shadow-sm">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">
            🥇 Día 1: Split - El Corazón de la Dalmacia
          </h3>
          
          <div className="grid md:grid-cols-2 gap-6 items-center">
            <div>
              <p className="text-gray-600 mb-4">
                Ciudad histórica con Palacio de Diocleciano, excelente hub para explorar las islas 
                y conexiones perfectas para nómadas digitales.
              </p>
              
              <div className="space-y-2 text-sm text-gray-600">
                <p><strong>⭐ Valoración:</strong> 4.8/5 (12,456 reviews)</p>
                <p><strong>🔥 Mejor época:</strong> Mayo-Octubre</p>
                <p><strong>💰 Amarres:</strong> €50-120/noche</p>
                <p><strong>📶 WiFi:</strong> Excelente en cafés</p>
              </div>
            </div>
            
            <div>
              <UnsplashImage
                searchQuery="split croatia marina"
                width={400}
                height={300}
                alt="Split Croacia - Puerto deportivo"
                className="rounded-lg"
              />
            </div>
          </div>
        </div>

        {/* Día 2 - Hvar */}
        <div className="bg-white border border-gray-200 rounded-lg p-6 mb-8 shadow-sm">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">
            🥈 Día 2: Hvar - La Isla de las Estrellas
          </h3>
          
          <div className="grid md:grid-cols-2 gap-6 items-center">
            <div>
              <p className="text-gray-600 mb-4">
                Vida nocturna vibrante, aguas turquesas perfectas y WiFi en toda la isla. 
                La perla del Adriático que no te puedes perder.
              </p>
              
              <div className="space-y-2 text-sm text-gray-600">
                <p><strong>⭐ Valoración:</strong> 4.9/5 (15,789 reviews)</p>
                <p><strong>🔥 Mejor época:</strong> Junio-Septiembre</p>
                <p><strong>💰 Amarres:</strong> €60-150/noche</p>
                <p><strong>📶 WiFi:</strong> Muy buena cobertura</p>
              </div>
            </div>
            
            <div>
              <UnsplashImage
                searchQuery="hvar croatia island"
                width={400}
                height={300}
                alt="Hvar Croacia - Isla del Adriático"
                className="rounded-lg"
              />
            </div>
          </div>
        </div>

        {/* Galería de imágenes de barcos */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">
            🚢 Tipos de Embarcaciones para tu Aventura
          </h3>
          <UnsplashImageGallery
            category="boats"
            count={6}
            title="Embarcaciones para explorar Croacia"
            className="mb-8"
          />
        </div>

        {/* Galería de atardeceres */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">
            🌅 Atardeceres Mágicos del Adriático
          </h3>
          <UnsplashImageGallery
            category="sunset"
            count={4}
            title="Los mejores atardeceres para navegantes"
            className="mb-8"
          />
        </div>

        {/* Sección de puertos */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-6 mb-8">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">
            ⚓ Puertos y Marinas Recomendados
          </h3>
          
          <div className="grid md:grid-cols-3 gap-4">
            <div className="text-center">
              <UnsplashImage
                category="ports"
                width={300}
                height={200}
                alt="Marina moderna"
                className="rounded-lg mb-2"
              />
              <p className="text-sm text-gray-600">Marinas modernas con todas las facilidades</p>
            </div>
            
            <div className="text-center">
              <UnsplashImage
                searchQuery="croatia marina dock"
                width={300}
                height={200}
                alt="Puerto deportivo"
                className="rounded-lg mb-2"
              />
              <p className="text-sm text-gray-600">Puertos deportivos bien equipados</p>
            </div>
            
            <div className="text-center">
              <UnsplashImage
                searchQuery="sailing crew boat"
                width={300}
                height={200}
                alt="Tripulación navegando"
                className="rounded-lg mb-2"
              />
              <p className="text-sm text-gray-600">Experiencias de navegación únicas</p>
            </div>
          </div>
        </div>

        {/* Call to action con imagen de fondo */}
        <div className="relative rounded-lg overflow-hidden mb-8">
          <UnsplashImage
            category="sailing"
            width={800}
            height={400}
            alt="Navegación en el Adriático"
            className="w-full"
            showAttribution={false}
          />
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="text-center text-white">
              <h3 className="text-2xl font-bold mb-4">
                ¿Listo para tu Aventura en Croacia?
              </h3>
              <p className="text-lg mb-6">
                Descubre las mejores rutas y consejos para navegantes
              </p>
              <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors">
                Planificar Mi Viaje
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogWithUnsplash; 