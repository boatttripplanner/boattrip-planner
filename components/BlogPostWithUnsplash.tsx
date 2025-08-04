import React from 'react';
import UnsplashImage from './UnsplashImage';
import UnsplashImageGallery from './UnsplashImageGallery';

const BlogPostWithUnsplash: React.FC = () => {
  return (
    <article className="max-w-4xl mx-auto px-4 py-8">
      <header className="mb-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">
          🏝️ Croacia en Velero 2024: La Guía Definitiva que Te Cambiará la Vida
        </h1>
        <p className="text-gray-600 italic">
          Publicado: 20 de Enero, 2024 | Actualizado: 20 de Enero, 2024
        </p>
      </header>

      {/* Imagen principal del artículo usando Unsplash */}
      <div className="mb-8">
        <UnsplashImage
          searchQuery="croatia sailing boat adriatic"
          width={1200}
          height={600}
          alt="Croacia en velero - Navegación por el Adriático"
          className="rounded-lg shadow-lg"
        />
      </div>

      <div className="prose prose-lg max-w-none">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          🎯 ¿Listo para la Aventura que Transformará tu Vida?
        </h2>

        <p className="text-xl text-gray-600 mb-6">
          <strong>Imagina esto:</strong> Navegando por aguas turquesas del Adriático, 
          descubriendo islas secretas que solo conocen los navegantes, y trabajando 
          desde tu "oficina flotante" con vistas que inspiran creatividad.
        </p>

        <p className="mb-6">
          En esta guía <strong>definitiva</strong>, te revelo el <strong>itinerario de 7 días perfecto</strong> 
          para explorar Croacia en velero. No es solo un viaje, es una <strong>inversión en tu vida y tu negocio</strong>.
        </p>

        <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-8">
          <h3 className="text-lg font-semibold text-blue-800 mb-2">
            📊 Lo que Descubrirás en Esta Guía
          </h3>
          <ul className="text-blue-700 space-y-1">
            <li>✅ <strong>Itinerario de 7 días</strong> paso a paso</li>
            <li>✅ <strong>Consejos para nómadas digitales</strong> en el mar</li>
            <li>✅ <strong>Equipamiento esencial</strong> con reviews reales</li>
            <li>✅ <strong>Presupuesto detallado</strong> y costos reales 2024</li>
            <li>✅ <strong>Ofertas exclusivas</strong> en equipamiento de viaje</li>
          </ul>
        </div>

        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-8">
          <h3 className="text-lg font-semibold text-yellow-800 mb-2">
            🚨 ADVERTENCIA: Croacia Te Enamorará
          </h3>
          <p className="text-yellow-700 mb-2">
            Antes de continuar, necesitas saber algo <strong>MÁGICO</strong>:
          </p>
          <blockquote className="text-yellow-800 italic">
            <strong>"Croacia tiene más de 1,000 islas y 5,835 km de costa para explorar"</strong>
          </blockquote>
          <p className="text-yellow-700">
            ¿Sabías que Croacia es el destino náutico más popular del Adriático? 
            Únete a miles de navegantes que ya han descubierto su magia.
          </p>
        </div>

        <h2 className="text-3xl font-bold text-gray-800 mb-6">
          🏆 Itinerario de 7 Días: Tu Aventura Definitiva
        </h2>

        {/* Día 1 - Split */}
        <div className="bg-white border border-gray-200 rounded-lg p-6 mb-8 shadow-sm">
          <h3 className="text-2xl font-semibold text-gray-800 mb-4">
            🥇 Día 1: Split - El Corazón de la Dalmacia
          </h3>
          
          <div className="grid md:grid-cols-2 gap-6 items-center">
            <div>
              <p className="text-gray-600 mb-4">
                <strong>¿Por qué empezar aquí?</strong>
              </p>
              <ul className="text-gray-600 space-y-2 mb-4">
                <li>• Ciudad histórica con Palacio de Diocleciano</li>
                <li>• Excelente hub para explorar las islas</li>
                <li>• Conexiones perfectas para nómadas digitales</li>
              </ul>
            </div>
            
            <div>
              <UnsplashImage
                searchQuery="split croatia marina port"
                width={400}
                height={300}
                alt="Split Croacia - Puerto deportivo y marina"
                className="rounded-lg"
              />
            </div>
          </div>

          <div className="mt-6 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4">
            <h4 className="text-lg font-semibold text-gray-800 mb-3">
              🏛️ Split - La Ciudad del Emperador
            </h4>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600 mb-2">
                  <strong>⭐ Valoración:</strong> 4.8/5 (12,456 reviews)
                </p>
                <p className="text-sm text-gray-600 mb-2">
                  <strong>🔥 MEJOR ÉPOCA:</strong> Mayo-Octubre
                </p>
                <p className="text-sm text-gray-600 mb-2">
                  <strong>📶 CONEXIÓN WIFI:</strong> Excelente
                </p>
              </div>
              
              <div>
                <p className="text-sm text-gray-600 mb-2">
                  <strong>💰 Amarres:</strong> €50-120/noche
                </p>
                <p className="text-sm text-gray-600 mb-2">
                  <strong>📱 Conexión móvil:</strong> 4G/5G excelente
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Día 2 - Hvar */}
        <div className="bg-white border border-gray-200 rounded-lg p-6 mb-8 shadow-sm">
          <h3 className="text-2xl font-semibold text-gray-800 mb-4">
            🥈 Día 2: Hvar - La Isla de las Estrellas
          </h3>
          
          <div className="grid md:grid-cols-2 gap-6 items-center">
            <div>
              <p className="text-gray-600 mb-4">
                <strong>¿Por qué es ESPECTACULAR?</strong>
              </p>
              <ul className="text-gray-600 space-y-2 mb-4">
                <li>• Vida nocturna vibrante</li>
                <li>• Aguas turquesas perfectas</li>
                <li>• WiFi en toda la isla</li>
              </ul>
            </div>
            
            <div>
              <UnsplashImage
                searchQuery="hvar croatia island adriatic"
                width={400}
                height={300}
                alt="Hvar Croacia - Isla del Adriático"
                className="rounded-lg"
              />
            </div>
          </div>

          <div className="mt-6 bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-lg p-4">
            <h4 className="text-lg font-semibold text-gray-800 mb-3">
              🌟 Hvar - La Perla del Adriático
            </h4>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600 mb-2">
                  <strong>⭐ Valoración:</strong> 4.9/5 (15,789 reviews)
                </p>
                <p className="text-sm text-gray-600 mb-2">
                  <strong>🔥 MEJOR ÉPOCA:</strong> Junio-Septiembre
                </p>
                <p className="text-sm text-gray-600 mb-2">
                  <strong>📶 CONEXIÓN WIFI:</strong> Muy buena
                </p>
              </div>
              
              <div>
                <p className="text-sm text-gray-600 mb-2">
                  <strong>💰 Amarres:</strong> €60-150/noche
                </p>
                <p className="text-sm text-gray-600 mb-2">
                  <strong>🌊 Aguas:</strong> Turquesas cristalinas
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Galería de embarcaciones */}
        <div className="mb-8">
          <h3 className="text-2xl font-semibold text-gray-800 mb-4">
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
          <h3 className="text-2xl font-semibold text-gray-800 mb-4">
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
          <h3 className="text-2xl font-semibold text-gray-800 mb-4">
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
    </article>
  );
};

export default BlogPostWithUnsplash; 