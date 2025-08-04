import React from 'react';
import UnsplashImage from './UnsplashImage';
import UnsplashImageGallery from './UnsplashImageGallery';

const SostenibilidadBlogPost: React.FC = () => {
  return (
    <article className="max-w-4xl mx-auto px-4 py-8">
      <header className="mb-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">
          🌊 Sostenibilidad Marítima 2024: Navegando Hacia un Futuro Verde
        </h1>
        <p className="text-gray-600 italic">
          Publicado: 25 de Enero, 2024 | Actualizado: 25 de Enero, 2024
        </p>
      </header>

      {/* Imagen principal del artículo */}
      <div className="mb-8">
        <UnsplashImage
          searchQuery="sustainable sailing boat ocean"
          width={1200}
          height={600}
          alt="Navegación sostenible en el océano"
          className="rounded-lg shadow-lg"
        />
      </div>

      <div className="prose prose-lg max-w-none">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          🎯 ¿Por qué la Sostenibilidad Marítima es el Futuro?
        </h2>

        <p className="text-xl text-gray-600 mb-6">
          <strong>Imagina esto:</strong> Navegando por aguas cristalinas, propulsado por energía solar y eólica, 
          mientras contribuyes a la conservación de nuestros océanos. La navegación sostenible no es solo una tendencia, 
          es una <strong>necesidad urgente</strong> para preservar nuestros mares.
        </p>

        <p className="mb-6">
          En esta guía <strong>completa</strong>, te revelo las <strong>mejores prácticas de navegación sostenible</strong>, 
          tecnologías emergentes y cómo convertir tu pasión por el mar en una fuerza positiva para el planeta.
        </p>

        <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-8">
          <h3 className="text-lg font-semibold text-blue-800 mb-2">
            📊 Lo que Descubrirás en Esta Guía
          </h3>
          <ul className="text-blue-700 space-y-1">
            <li>✅ <strong>Tecnologías de navegación verde</strong> paso a paso</li>
            <li>✅ <strong>Equipamiento sostenible</strong> con reviews reales</li>
            <li>✅ <strong>Prácticas de conservación marina</strong></li>
            <li>✅ <strong>Iniciativas globales</strong> de protección oceánica</li>
            <li>✅ <strong>Ofertas exclusivas</strong> en equipamiento eco-friendly</li>
          </ul>
        </div>

        <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-8">
          <h3 className="text-lg font-semibold text-red-800 mb-2">
            🚨 ADVERTENCIA: Nuestros Océanos Necesitan Ayuda
          </h3>
          <p className="text-red-700 mb-2">
            Antes de continuar, necesitas saber algo <strong>CRÍTICO</strong>:
          </p>
          <blockquote className="text-red-800 italic">
            <strong>"El 80% de la contaminación marina proviene de actividades terrestres y el 8% de la navegación recreativa"</strong>
          </blockquote>
          <p className="text-red-700">
            ¿Sabías que cada año se vierten 8 millones de toneladas de plástico al océano? Como navegantes, 
            tenemos la responsabilidad de ser parte de la solución.
          </p>
        </div>

        <h2 className="text-3xl font-bold text-gray-800 mb-6">
          🌱 Tecnologías de Navegación Sostenible
        </h2>

        {/* Energía Solar */}
        <div className="bg-white border border-gray-200 rounded-lg p-6 mb-8 shadow-sm">
          <h3 className="text-2xl font-semibold text-gray-800 mb-4">
            🥇 Energía Solar: El Poder del Sol
          </h3>
          
          <div className="grid md:grid-cols-2 gap-6 items-center">
            <div>
              <p className="text-gray-600 mb-4">
                <strong>¿Por qué es REVOLUCIONARIA?</strong>
              </p>
              <ul className="text-gray-600 space-y-2 mb-4">
                <li>• Reducción del 90% en emisiones de CO2</li>
                <li>• Autonomía energética completa</li>
                <li>• Bajo mantenimiento y alta durabilidad</li>
              </ul>
            </div>
            
            <div>
              <UnsplashImage
                searchQuery="solar panels boat sailing"
                width={400}
                height={300}
                alt="Paneles solares en embarcación"
                className="rounded-lg"
              />
            </div>
          </div>
        </div>

        {/* Energía Eólica */}
        <div className="bg-white border border-gray-200 rounded-lg p-6 mb-8 shadow-sm">
          <h3 className="text-2xl font-semibold text-gray-800 mb-4">
            🥈 Energía Eólica: Vientos de Cambio
          </h3>
          
          <div className="grid md:grid-cols-2 gap-6 items-center">
            <div>
              <p className="text-gray-600 mb-4">
                <strong>¿Por qué es INNOVADORA?</strong>
              </p>
              <ul className="text-gray-600 space-y-2 mb-4">
                <li>• Turbinas de viento integradas</li>
                <li>• Generación de energía mientras navegas</li>
                <li>• Diseño aerodinámico avanzado</li>
              </ul>
            </div>
            
            <div>
              <UnsplashImage
                searchQuery="wind turbine boat sailing"
                width={400}
                height={300}
                alt="Turbina eólica en embarcación"
                className="rounded-lg"
              />
            </div>
          </div>
        </div>

        {/* Propulsión Eléctrica */}
        <div className="bg-white border border-gray-200 rounded-lg p-6 mb-8 shadow-sm">
          <h3 className="text-2xl font-semibold text-gray-800 mb-4">
            🥉 Propulsión Eléctrica: El Futuro es Eléctrico
          </h3>
          
          <div className="grid md:grid-cols-2 gap-6 items-center">
            <div>
              <p className="text-gray-600 mb-4">
                <strong>¿Por qué es TRANSFORMADORA?</strong>
              </p>
              <ul className="text-gray-600 space-y-2 mb-4">
                <li>• Cero emisiones directas</li>
                <li>• Operación silenciosa</li>
                <li>• Eficiencia energética superior</li>
              </ul>
            </div>
            
            <div>
              <UnsplashImage
                searchQuery="electric boat motor sustainable"
                width={400}
                height={300}
                alt="Propulsión eléctrica en embarcación"
                className="rounded-lg"
              />
            </div>
          </div>
        </div>

        {/* Galería de equipamiento sostenible */}
        <div className="mb-8">
          <h3 className="text-2xl font-semibold text-gray-800 mb-4">
            🛠️ Equipamiento Sostenible Recomendado
          </h3>
          <UnsplashImageGallery
            searchQuery="sustainable marine equipment solar wind"
            count={6}
            title="Equipamiento sostenible para navegación"
            className="mb-8"
          />
        </div>

        {/* Prácticas de conservación */}
        <div className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-lg p-6 mb-8">
          <h3 className="text-2xl font-semibold text-gray-800 mb-4">
            🌊 Prácticas de Conservación Marina
          </h3>
          
          <div className="grid md:grid-cols-3 gap-4">
            <div className="text-center">
              <UnsplashImage
                searchQuery="marine conservation coral reef"
                width={300}
                height={200}
                alt="Conservación marina"
                className="rounded-lg mb-2"
              />
              <p className="text-sm text-gray-600">Protección de ecosistemas marinos</p>
            </div>
            
            <div className="text-center">
              <UnsplashImage
                searchQuery="ocean cleanup plastic waste"
                width={300}
                height={200}
                alt="Limpieza del océano"
                className="rounded-lg mb-2"
              />
              <p className="text-sm text-gray-600">Limpieza activa del océano</p>
            </div>
            
            <div className="text-center">
              <UnsplashImage
                searchQuery="sustainable fishing practices"
                width={300}
                height={200}
                alt="Pesca sostenible"
                className="rounded-lg mb-2"
              />
              <p className="text-sm text-gray-600">Prácticas de pesca responsable</p>
            </div>
          </div>
        </div>

        {/* Galería de iniciativas globales */}
        <div className="mb-8">
          <h3 className="text-2xl font-semibold text-gray-800 mb-4">
            🌍 Iniciativas Globales de Protección
          </h3>
          <UnsplashImageGallery
            searchQuery="ocean protection marine life conservation"
            count={4}
            title="Iniciativas globales de protección marina"
            className="mb-8"
          />
        </div>

        {/* Inversión en sostenibilidad */}
        <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-lg p-6 mb-8">
          <h3 className="text-2xl font-semibold text-gray-800 mb-4">
            💰 Inversión en Sostenibilidad
          </h3>
          
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <h4 className="text-lg font-semibold text-gray-800 mb-2">Costos Iniciales</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Sistema solar: €5,000-15,000</li>
                <li>• Propulsión eléctrica: €20,000-50,000</li>
                <li>• Equipamiento eco: €3,000-8,000</li>
              </ul>
            </div>
            
            <div className="text-center">
              <h4 className="text-lg font-semibold text-gray-800 mb-2">Ahorros Anuales</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Combustible: €2,000-5,000</li>
                <li>• Mantenimiento: €500-1,500</li>
                <li>• Impuestos verdes: €200-800</li>
              </ul>
            </div>
            
            <div className="text-center">
              <h4 className="text-lg font-semibold text-gray-800 mb-2">ROI Estimado</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Período de recuperación: 5-8 años</li>
                <li>• Ahorro total: €50,000-100,000</li>
                <li>• Impacto ambiental: Incalculable</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Navegantes destacados */}
        <div className="mb-8">
          <h3 className="text-2xl font-semibold text-gray-800 mb-4">
            🏆 Navegantes Sostenibles Destacados
          </h3>
          <UnsplashImageGallery
            searchQuery="sustainable sailors ocean activists"
            count={3}
            title="Navegantes comprometidos con la sostenibilidad"
            className="mb-8"
          />
        </div>

        {/* Tendencias 2024 */}
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-lg p-6 mb-8">
          <h3 className="text-2xl font-semibold text-gray-800 mb-4">
            📈 Tendencias 2024
          </h3>
          
          <div className="grid md:grid-cols-3 gap-4">
            <div className="text-center">
              <UnsplashImage
                searchQuery="hydrogen fuel cell boat"
                width={300}
                height={200}
                alt="Hidrógeno verde"
                className="rounded-lg mb-2"
              />
              <p className="text-sm text-gray-600">Hidrógeno Verde - Cero emisiones</p>
            </div>
            
            <div className="text-center">
              <UnsplashImage
                searchQuery="AI navigation boat technology"
                width={300}
                height={200}
                alt="IA en navegación"
                className="rounded-lg mb-2"
              />
              <p className="text-sm text-gray-600">IA en Navegación - Optimización</p>
            </div>
            
            <div className="text-center">
              <UnsplashImage
                searchQuery="biodegradable marine materials"
                width={300}
                height={200}
                alt="Materiales biodegradables"
                className="rounded-lg mb-2"
              />
              <p className="text-sm text-gray-600">Materiales Biodegradables</p>
            </div>
          </div>
        </div>

        {/* Plan de acción */}
        <div className="bg-white border border-gray-200 rounded-lg p-6 mb-8 shadow-sm">
          <h3 className="text-2xl font-semibold text-gray-800 mb-4">
            🎯 Plan de Acción Personal
          </h3>
          
          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <h4 className="text-lg font-semibold text-gray-800 mb-3">Fase 1: Evaluación (Mes 1)</h4>
              <ul className="text-gray-600 space-y-2">
                <li>• [ ] Auditoría energética</li>
                <li>• [ ] Análisis de residuos</li>
                <li>• [ ] Identificación de mejoras</li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold text-gray-800 mb-3">Fase 2: Implementación (Mes 2-6)</h4>
              <ul className="text-gray-600 space-y-2">
                <li>• [ ] Instalación solar</li>
                <li>• [ ] Cambio a LED</li>
                <li>• [ ] Sistema de reciclaje</li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold text-gray-800 mb-3">Fase 3: Optimización (Mes 7-12)</h4>
              <ul className="text-gray-600 space-y-2">
                <li>• [ ] Monitoreo de eficiencia</li>
                <li>• [ ] Ajustes de rutina</li>
                <li>• [ ] Compartir experiencias</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Historias de éxito */}
        <div className="mb-8">
          <h3 className="text-2xl font-semibold text-gray-800 mb-4">
            🌟 Historias de Éxito
          </h3>
          <UnsplashImageGallery
            searchQuery="sustainable marina port green"
            count={3}
            title="Puertos y marinas comprometidos con la sostenibilidad"
            className="mb-8"
          />
        </div>

        {/* El futuro de la navegación */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-6 mb-8">
          <h3 className="text-2xl font-semibold text-gray-800 mb-4">
            🔮 El Futuro de la Navegación
          </h3>
          
          <div className="grid md:grid-cols-3 gap-4">
            <div className="text-center">
              <h4 className="text-lg font-semibold text-gray-800 mb-2">2030: Navegación 100% Verde</h4>
              <p className="text-sm text-gray-600">
                Propulsión eléctrica dominante, energías renovables integradas, materiales biodegradables
              </p>
            </div>
            
            <div className="text-center">
              <h4 className="text-lg font-semibold text-gray-800 mb-2">2040: Océanos Limpios</h4>
              <p className="text-sm text-gray-600">
                Plástico eliminado, biodiversidad recuperada, navegación sostenible universal
              </p>
            </div>
            
            <div className="text-center">
              <h4 className="text-lg font-semibold text-gray-800 mb-2">2050: Armonía Total</h4>
              <p className="text-sm text-gray-600">
                Humanos y océanos en equilibrio, tecnología al servicio del planeta
              </p>
            </div>
          </div>
        </div>

        {/* Call to action con imagen de fondo */}
        <div className="relative rounded-lg overflow-hidden mb-8">
          <UnsplashImage
            searchQuery="clean ocean sustainable future"
            width={800}
            height={400}
            alt="Futuro sostenible del océano"
            className="w-full"
            showAttribution={false}
          />
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="text-center text-white">
              <h3 className="text-2xl font-bold mb-4">
                ¿Estás Listo para Ser Parte del Cambio?
              </h3>
              <p className="text-lg mb-6">
                Únete a la revolución de la navegación sostenible
              </p>
              <button className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors">
                Comenzar Mi Viaje Sostenible
              </button>
            </div>
          </div>
        </div>

        {/* Conclusión */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-8">
          <h3 className="text-2xl font-semibold text-gray-800 mb-4">
            🎉 Conclusión: Tu Viaje Hacia la Sostenibilidad
          </h3>
          <p className="text-gray-700 mb-4">
            La navegación sostenible no es solo una opción, es <strong>nuestra responsabilidad</strong>. 
            Cada decisión que tomamos a bordo tiene un impacto en nuestros océanos.
          </p>
          <blockquote className="text-green-800 italic border-l-4 border-green-400 pl-4">
            <strong>"El océano es el corazón azul de nuestro planeta. Cuidémoslo como si nuestra vida dependiera de ello, porque así es."</strong> - Sylvia Earle
          </blockquote>
        </div>

        {/* Próximos pasos */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">
            🚀 Próximos pasos:
          </h3>
          <ol className="text-gray-700 space-y-2">
            <li>1. Evalúa tu huella ambiental actual</li>
            <li>2. Identifica 3 mejoras inmediatas</li>
            <li>3. Únete a una iniciativa local</li>
            <li>4. Comparte tu compromiso con otros navegantes</li>
          </ol>
          <p className="text-lg font-semibold text-blue-800 mt-4">
            ¡Juntos podemos navegar hacia un futuro más verde y sostenible! 🌊🌱
          </p>
        </div>
      </div>
    </article>
  );
};

export default SostenibilidadBlogPost; 