import React from 'react';
import UnsplashImage from './UnsplashImage';
import UnsplashImageGallery from './UnsplashImageGallery';

const MascotasBlogPost: React.FC = () => {
  return (
    <article className="max-w-4xl mx-auto px-4 py-8">
      <header className="mb-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">
          🐕 Mascotas en Casa: Guía Completa para una Vida Feliz en 2025
        </h1>
        <p className="text-gray-600 italic">
          Publicado: 25 de Enero, 2025 | Actualizado: 25 de Enero, 2025
        </p>
      </header>

      {/* Imagen principal del artículo */}
      <div className="mb-8">
        <UnsplashImage
          searchQuery="happy pets family home dogs cats"
          width={1200}
          height={600}
          alt="Mascotas felices en familia en casa"
          className="rounded-lg shadow-lg"
          key={`mascotas-${Date.now()}`}
        />
      </div>

      <div className="prose prose-lg max-w-none">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          🎯 ¿Por qué las Mascotas Hacen Nuestras Vidas Mejores?
        </h2>

        <p className="text-xl text-gray-600 mb-6">
          <strong>Imagina esto:</strong> Llegas a casa después de un día estresante y tu perro te recibe con 
          la cola moviéndose, tu gato ronronea en tu regazo, y de repente todo el estrés desaparece. 
          Las mascotas no son solo compañeros, son <strong>terapeutas peludos</strong> que transforman nuestros hogares.
        </p>

        <p className="mb-6">
          En esta guía <strong>completa</strong>, te revelo los <strong>beneficios científicamente probados</strong> de tener mascotas, 
          cómo elegir la perfecta para tu familia y convertir tu casa en un paraíso para animales.
        </p>

        <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-8">
          <h3 className="text-lg font-semibold text-blue-800 mb-2">
            📊 Lo que Descubrirás en Esta Guía
          </h3>
          <ul className="text-blue-700 space-y-1">
            <li>✅ <strong>Beneficios para la salud</strong> científicamente probados</li>
            <li>✅ <strong>Guía de selección</strong> de mascotas por personalidad</li>
            <li>✅ <strong>Cuidados esenciales</strong> para cada tipo de mascota</li>
            <li>✅ <strong>Productos recomendados</strong> con reviews reales</li>
            <li>✅ <strong>Consejos de entrenamiento</strong> paso a paso</li>
          </ul>
        </div>

        <div className="bg-green-50 border-l-4 border-green-400 p-4 mb-8">
          <h3 className="text-lg font-semibold text-green-800 mb-2">
            🧬 CIENCIA: Las Mascotas Mejoran Nuestra Salud
          </h3>
          <p className="text-green-700 mb-2">
            Los estudios científicos han demostrado que las mascotas:
          </p>
          <ul className="text-green-700 space-y-1">
            <li>• Reducen el estrés y la ansiedad en un 30%</li>
            <li>• Bajan la presión arterial y el colesterol</li>
            <li>• Aumentan la producción de oxitocina (hormona del amor)</li>
            <li>• Mejoran la función inmunológica</li>
            <li>• Prolongan la esperanza de vida</li>
          </ul>
        </div>

        <h2 className="text-3xl font-bold text-gray-800 mb-6">
          🐾 Tipos de Mascotas y Sus Personalidades
        </h2>

        {/* Perros */}
        <div className="bg-white border border-gray-200 rounded-lg p-6 mb-8 shadow-sm">
          <h3 className="text-2xl font-semibold text-gray-800 mb-4">
            🥇 Perros: El Mejor Amigo del Hombre
          </h3>
          
          <div className="grid md:grid-cols-2 gap-6 items-center">
            <div>
              <p className="text-gray-600 mb-4">
                <strong>¿Por qué son PERFECTOS?</strong>
              </p>
              <ul className="text-gray-600 space-y-2 mb-4">
                <li>• Lealtad incondicional</li>
                <li>• Excelentes para familias con niños</li>
                <li>• Fácil entrenamiento</li>
                <li>• Gran variedad de tamaños</li>
              </ul>
            </div>
            
            <div>
              <UnsplashImage
                searchQuery="happy dog family home"
                width={400}
                height={300}
                alt="Perro feliz en familia en casa"
                className="rounded-lg"
              />
            </div>
          </div>
        </div>

        {/* Gatos */}
        <div className="bg-white border border-gray-200 rounded-lg p-6 mb-8 shadow-sm">
          <h3 className="text-2xl font-semibold text-gray-800 mb-4">
            🥈 Gatos: Independientes y Elegantes
          </h3>
          
          <div className="grid md:grid-cols-2 gap-6 items-center">
            <div>
              <p className="text-gray-600 mb-4">
                <strong>¿Por qué son IDEALES?</strong>
              </p>
              <ul className="text-gray-600 space-y-2 mb-4">
                <li>• Bajo mantenimiento</li>
                <li>• Perfectos para apartamentos</li>
                <li>• Limpieza natural</li>
                <li>• Personalidades únicas</li>
              </ul>
            </div>
            
            <div>
              <UnsplashImage
                searchQuery="cat home cozy pet"
                width={400}
                height={300}
                alt="Gato en casa acogedora"
                className="rounded-lg"
              />
            </div>
          </div>
        </div>

        {/* Aves */}
        <div className="bg-white border border-gray-200 rounded-lg p-6 mb-8 shadow-sm">
          <h3 className="text-2xl font-semibold text-gray-800 mb-4">
            🥉 Aves: Color y Música en Casa
          </h3>
          
          <div className="grid md:grid-cols-2 gap-6 items-center">
            <div>
              <p className="text-gray-600 mb-4">
                <strong>¿Por qué son ENCANTADORAS?</strong>
              </p>
              <ul className="text-gray-600 space-y-2 mb-4">
                <li>• Hermosos colores</li>
                <li>• Canto melodioso</li>
                <li>• Fácil cuidado</li>
                <li>• Vida larga</li>
              </ul>
            </div>
            
            <div>
              <UnsplashImage
                searchQuery="colorful bird pet home"
                width={400}
                height={300}
                alt="Ave colorida en casa"
                className="rounded-lg"
              />
            </div>
          </div>
        </div>

        {/* Galería de mascotas */}
        <div className="mb-8">
          <h3 className="text-2xl font-semibold text-gray-800 mb-4">
            🖼️ Galería de Mascotas Felices
          </h3>
          <UnsplashImageGallery
            searchQuery="happy pets home family dogs cats"
            count={6}
            title="Mascotas felices en casa"
            className="mb-8"
          />
        </div>

        {/* Beneficios para niños */}
        <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-lg p-6 mb-8">
          <h3 className="text-2xl font-semibold text-gray-800 mb-4">
            👶 Mascotas y Niños: Beneficios Incalculables
          </h3>
          
          <div className="grid md:grid-cols-3 gap-4">
            <div className="text-center">
              <UnsplashImage
                searchQuery="child dog playing together"
                width={300}
                height={200}
                alt="Niño jugando con perro"
                className="rounded-lg mb-2"
              />
              <p className="text-sm text-gray-600">Desarrollo emocional</p>
            </div>
            
            <div className="text-center">
              <UnsplashImage
                searchQuery="child cat reading book"
                width={300}
                height={200}
                alt="Niño leyendo con gato"
                className="rounded-lg mb-2"
              />
              <p className="text-sm text-gray-600">Responsabilidad</p>
            </div>
            
            <div className="text-center">
              <UnsplashImage
                searchQuery="family pets outdoor activity"
                width={300}
                height={200}
                alt="Familia con mascotas al aire libre"
                className="rounded-lg mb-2"
              />
              <p className="text-sm text-gray-600">Actividad física</p>
            </div>
          </div>
        </div>

        {/* Productos recomendados */}
        <div className="mb-8">
          <h3 className="text-2xl font-semibold text-gray-800 mb-4">
            🛍️ Productos Esenciales Recomendados
          </h3>
          <UnsplashImageGallery
            searchQuery="pet products toys food accessories"
            count={4}
            title="Productos esenciales para mascotas"
            className="mb-8"
          />
        </div>

        {/* Consejos de cuidado */}
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-lg p-6 mb-8">
          <h3 className="text-2xl font-semibold text-gray-800 mb-4">
            💡 Consejos de Cuidado Diario
          </h3>
          
          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <h4 className="text-lg font-semibold text-gray-800 mb-3">Alimentación</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Horarios regulares</li>
                <li>• Agua fresca siempre</li>
                <li>• Dieta balanceada</li>
                <li>• Evitar comida humana</li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold text-gray-800 mb-3">Ejercicio</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Paseos diarios (perros)</li>
                <li>• Juegos interactivos</li>
                <li>• Estimulación mental</li>
                <li>• Socialización</li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold text-gray-800 mb-3">Salud</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Vacunas al día</li>
                <li>• Revisiones veterinarias</li>
                <li>• Control de parásitos</li>
                <li>• Cuidado dental</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Call to action */}
        <div className="relative rounded-lg overflow-hidden mb-8">
          <UnsplashImage
            searchQuery="happy family pets home love"
            width={800}
            height={400}
            alt="Familia feliz con mascotas en casa"
            className="w-full"
            showAttribution={false}
          />
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="text-center text-white">
              <h3 className="text-2xl font-bold mb-4">
                ¿Estás Listo para Agregar Amor a tu Hogar?
              </h3>
              <p className="text-lg mb-6">
                Descubre la mascota perfecta para tu familia
              </p>
              <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors">
                Encontrar Mi Mascota Ideal
              </button>
            </div>
          </div>
        </div>

        {/* Conclusión */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
          <h3 className="text-2xl font-semibold text-gray-800 mb-4">
            🎉 Conclusión: El Amor de las Mascotas
          </h3>
          <p className="text-gray-700 mb-4">
            Las mascotas no solo llenan nuestros hogares de alegría, sino que también 
            mejoran nuestra salud física y mental de maneras que la ciencia apenas está descubriendo.
          </p>
          <blockquote className="text-blue-800 italic border-l-4 border-blue-400 pl-4">
            <strong>"Los perros no son toda nuestra vida, pero hacen que nuestra vida sea completa."</strong> - Roger Caras
          </blockquote>
        </div>

        {/* Próximos pasos */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">
            🚀 Próximos pasos:
          </h3>
          <ol className="text-gray-700 space-y-2">
            <li>1. Evalúa tu estilo de vida y espacio</li>
            <li>2. Investiga diferentes tipos de mascotas</li>
            <li>3. Visita refugios y criadores responsables</li>
            <li>4. Prepara tu hogar para la llegada</li>
          </ol>
          <p className="text-lg font-semibold text-green-800 mt-4">
            ¡Tu nueva mascota te está esperando para llenar tu vida de amor y alegría! 🐾❤️
          </p>
        </div>
      </div>
    </article>
  );
};

export default MascotasBlogPost;
