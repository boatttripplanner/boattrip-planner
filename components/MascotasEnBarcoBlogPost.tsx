import React from 'react';
import UnsplashImage from './UnsplashImage';
import UnsplashImageGallery from './UnsplashImageGallery';

const MascotasEnBarcoBlogPost: React.FC = () => {
  return (
    <article className="max-w-4xl mx-auto px-4 py-8">
      <header className="mb-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">
          🐕 Navegando con tu Mejor Amigo: Guía Completa para un Viaje en Barco Inolvidable con tu Perro
        </h1>
        <p className="text-gray-600 italic">
          Publicado: 25 de Enero, 2025 | Actualizado: 25 de Enero, 2025
        </p>
        <p className="text-gray-600">
          Categoría: <span className="font-semibold text-blue-600">Mascotas</span> | 
          <a href="https://www.boattrip-planner.com" className="text-blue-600 hover:text-blue-800 ml-2">
            BoatTrip Planner
          </a>
        </p>
      </header>

      {/* Imagen principal del artículo */}
      <div className="mb-8">
        <UnsplashImage
          searchQuery="dog life jacket boat sailing happy"
          width={1200}
          height={600}
          alt="Perro feliz con chaleco salvavidas en la proa de un velero"
          className="rounded-lg shadow-lg"
          key={`mascotas-barco-${Date.now()}`}
        />
      </div>

      <div className="prose prose-lg max-w-none">
        <p className="text-xl text-gray-600 mb-6">
          ¿Quién dice que las aventuras en el mar son solo para humanos? Un viaje en barco puede ser una experiencia 
          fantástica para tu perro, siempre y cuando estés bien preparado. Con un poco de planificación, la brisa marina, 
          los nuevos olores y la libertad del océano pueden convertirse en su paraíso personal.
        </p>

        <p className="mb-6">
          Esta guía completa te dará las herramientas y los consejos esenciales para que tu viaje con tu perro sea seguro, 
          cómodo y divertido para toda la familia. Descubre cómo <strong>BoatTrip Planner</strong> puede ayudarte a 
          planificar la aventura perfecta en el mar.
        </p>

        <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-8">
          <h3 className="text-lg font-semibold text-blue-800 mb-2">
            📋 Lo que Descubrirás en Esta Guía
          </h3>
          <ul className="text-blue-700 space-y-1">
            <li>✅ <strong>Preparación antes de zarpar</strong> - Checklist esencial</li>
            <li>✅ <strong>Equipamiento de seguridad</strong> - Productos recomendados</li>
            <li>✅ <strong>Confort y bienestar</strong> - Consejos prácticos</li>
            <li>✅ <strong>Actividades y diversión</strong> - Juguetes y entretenimiento</li>
            <li>✅ <strong>Planificación con BoatTrip Planner</strong> - Tu viaje perfecto</li>
          </ul>
        </div>

        <h2 className="text-3xl font-bold text-gray-800 mb-6">
          1. Preparación Antes de Zarpar: El Primer Paso Hacia el Éxito
        </h2>

        <p className="mb-6">
          Antes de pisar la cubierta, hay algunas cosas vitales que debes considerar. Una preparación adecuada minimiza 
          los riesgos y asegura que tu mascota se sienta segura en el nuevo entorno.
        </p>

        <div className="bg-white border border-gray-200 rounded-lg p-6 mb-8 shadow-sm">
          <h3 className="text-2xl font-semibold text-gray-800 mb-4">
            🏥 Visita al Veterinario
          </h3>
          <p className="text-gray-600 mb-4">
            Haz una revisión rápida para asegurarte de que tu perro está en perfectas condiciones para viajar. 
            Pregunta por medicamentos contra el mareo si crees que pueden ser necesarios.
          </p>
          <div className="bg-yellow-50 border border-yellow-200 rounded p-4">
            <p className="text-yellow-800 text-sm">
              <strong>💡 Consejo:</strong> Lleva contigo el historial médico de tu perro y asegúrate de que 
              todas las vacunas estén al día, especialmente si planeas visitar puertos internacionales.
            </p>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6 mb-8 shadow-sm">
          <h3 className="text-2xl font-semibold text-gray-800 mb-4">
            🚢 Aclimatación al Barco
          </h3>
          <p className="text-gray-600 mb-4">
            Si es posible, lleva a tu perro al barco antes de zarpar. Permítele explorar, olfatear y familiarizarse 
            con los ruidos y el movimiento del muelle.
          </p>
          <div className="grid md:grid-cols-2 gap-6 items-center">
            <div>
              <p className="text-gray-600 mb-4">
                <strong>Pasos para la aclimatación:</strong>
              </p>
              <ul className="text-gray-600 space-y-2">
                <li>• Visitas cortas al muelle</li>
                <li>• Familiarización con el barco</li>
                <li>• Práctica con el chaleco salvavidas</li>
                <li>• Acostumbrarse a los sonidos del mar</li>
              </ul>
            </div>
            <div>
              <UnsplashImage
                searchQuery="dog boat dock marina training"
                width={400}
                height={300}
                alt="Perro siendo entrenado en el muelle del barco"
                className="rounded-lg"
              />
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6 mb-8 shadow-sm">
          <h3 className="text-2xl font-semibold text-gray-800 mb-4">
            🏷️ Identificación y Documentación
          </h3>
          <p className="text-gray-600 mb-4">
            Asegúrate de que tu perro lleva un collar con una placa de identificación clara y tu número de teléfono. 
            Un microchip es imprescindible para viajes en barco.
          </p>
          <div className="bg-red-50 border border-red-200 rounded p-4">
            <p className="text-red-800 text-sm">
              <strong>⚠️ Importante:</strong> Incluye información de contacto de emergencia y considera agregar 
              el nombre del barco y tu itinerario en la placa de identificación.
            </p>
          </div>
        </div>

        <h2 className="text-3xl font-bold text-gray-800 mb-6">
          2. Seguridad a Bordo: No es una Opción, es una Necesidad
        </h2>

        <p className="mb-6">
          La seguridad en el mar es la máxima prioridad. Por eso, no debes escatimar en el equipamiento que protege 
          a tu compañero peludo.
        </p>

        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-6 mb-8">
          <h3 className="text-2xl font-semibold text-gray-800 mb-4">
            🦺 Chaleco Salvavidas para Perros
          </h3>
          <p className="text-gray-600 mb-4">
            Un chaleco con asa de rescate es la pieza más importante. No solo lo mantiene a flote, sino que te permite 
            levantarlo del agua de forma segura en caso de que caiga.
          </p>
          
          <div className="bg-white rounded-lg p-4 mb-4">
            <h4 className="text-lg font-semibold text-gray-800 mb-3">
              🛒 Producto Recomendado: Chaleco Salvavidas de Alta Flotabilidad
            </h4>
            <p className="text-gray-600 mb-3">
              <strong>Características esenciales:</strong>
            </p>
            <ul className="text-gray-600 space-y-1 mb-4">
              <li>• Material resistente al agua salada</li>
              <li>• Asa de rescate robusta</li>
              <li>• Ajuste seguro y cómodo</li>
              <li>• Colores brillantes para visibilidad</li>
              <li>• Certificación de seguridad marina</li>
            </ul>
            <div className="text-center">
              <a 
                href="https://www.amazon.com/s?k=dog+life+jacket+marine+boat+sailing" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-block bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 px-6 rounded-lg transition-colors"
              >
                🛒 Ver Chalecos Salvavidas en Amazon
              </a>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6 mb-8 shadow-sm">
          <h3 className="text-2xl font-semibold text-gray-800 mb-4">
            🦮 Arnés y Correa Resistente
          </h3>
          <p className="text-gray-600 mb-4">
            Nunca permitas que tu perro esté suelto en la cubierta. Usa un arnés seguro y una correa para mantenerlo 
            controlado en todo momento, especialmente en puerto o al subir y bajar del barco.
          </p>
          <div className="grid md:grid-cols-2 gap-6 items-center">
            <div>
              <p className="text-gray-600 mb-4">
                <strong>Características del arnés ideal:</strong>
              </p>
              <ul className="text-gray-600 space-y-2">
                <li>• Material resistente al agua</li>
                <li>• Ajuste cómodo y seguro</li>
                <li>• Anillas de sujeción múltiples</li>
                <li>• Fácil de limpiar</li>
              </ul>
            </div>
            <div>
              <UnsplashImage
                searchQuery="dog harness boat safety equipment"
                width={400}
                height={300}
                alt="Perro con arnés de seguridad en barco"
                className="rounded-lg"
              />
            </div>
          </div>
        </div>

        <h2 className="text-3xl font-bold text-gray-800 mb-6">
          3. Confort y Bienestar: El Viaje es Tan Importante como el Destino
        </h2>

        <p className="mb-6">
          Un perro feliz es un compañero de viaje perfecto. Asegúrate de que su viaje sea cómodo y libre de estrés.
        </p>

        <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-6 mb-8">
          <h3 className="text-2xl font-semibold text-gray-800 mb-4">
            💧 Hidratación Constante
          </h3>
          <p className="text-gray-600 mb-4">
            El sol y el viento deshidratan rápidamente. Ten siempre a mano un cuenco con agua fresca y limpia.
          </p>
          
          <div className="bg-white rounded-lg p-4 mb-4">
            <h4 className="text-lg font-semibold text-gray-800 mb-3">
              🛒 Producto Recomendado: Bebederos Portátiles y Antiderrames
            </h4>
            <p className="text-gray-600 mb-3">
              <strong>Características del bebedero ideal:</strong>
            </p>
            <ul className="text-gray-600 space-y-1 mb-4">
              <li>• Diseño antiderrame para barcos</li>
              <li>• Fácil de limpiar y transportar</li>
              <li>• Capacidad adecuada para viajes largos</li>
              <li>• Material resistente al agua salada</li>
              <li>• Sistema de cierre hermético</li>
            </ul>
            <div className="text-center">
              <a 
                href="https://www.amazon.com/s?k=dog+water+bowl+travel+boat+spill+proof" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-block bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 px-6 rounded-lg transition-colors"
              >
                🛒 Ver Bebederos Portátiles en Amazon
              </a>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6 mb-8 shadow-sm">
          <h3 className="text-2xl font-semibold text-gray-800 mb-4">
            🌤️ Sombra y Refugio
          </h3>
          <p className="text-gray-600 mb-4">
            Asegúrate de que tu perro tenga un lugar sombreado y fresco donde pueda descansar, lejos del sol directo.
          </p>
          <div className="grid md:grid-cols-2 gap-6 items-center">
            <div>
              <p className="text-gray-600 mb-4">
                <strong>Opciones de refugio:</strong>
              </p>
              <ul className="text-gray-600 space-y-2">
                <li>• Toldo plegable para perros</li>
                <li>• Zona sombreada bajo la cubierta</li>
                <li>• Manta húmeda para refrescar</li>
                <li>• Ventilación adecuada</li>
              </ul>
            </div>
            <div>
              <UnsplashImage
                searchQuery="dog resting shade boat deck"
                width={400}
                height={300}
                alt="Perro descansando a la sombra en la cubierta del barco"
                className="rounded-lg"
              />
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6 mb-8 shadow-sm">
          <h3 className="text-2xl font-semibold text-gray-800 mb-4">
            🚽 Gestión del "Baño"
          </h3>
          <p className="text-gray-600 mb-4">
            Entrena a tu perro para que haga sus necesidades en un lugar específico del barco (como una zona con césped artificial). 
            O, si es posible, planea paradas frecuentes en tierra para sus paseos.
          </p>
          <div className="bg-yellow-50 border border-yellow-200 rounded p-4">
            <p className="text-yellow-800 text-sm">
              <strong>💡 Consejo:</strong> Considera usar pañales para perros o entrenar a tu mascota para usar 
              una zona específica del barco con material absorbente.
            </p>
          </div>
        </div>

        <h2 className="text-3xl font-bold text-gray-800 mb-6">
          4. Actividades y Diversión: Juguetes para un Amigo Aventurero
        </h2>

        <p className="mb-6">
          La diversión no se detiene al subir a bordo. Los juguetes adecuados pueden hacer que el viaje sea mucho 
          más entretenido para tu perro.
        </p>

        <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-lg p-6 mb-8">
          <h3 className="text-2xl font-semibold text-gray-800 mb-4">
            🧸 Juguetes Flotantes
          </h3>
          <p className="text-gray-600 mb-4">
            Invierte en juguetes que flotan y que sean de un color brillante para que los puedas encontrar fácilmente en el agua.
          </p>
          
          <div className="bg-white rounded-lg p-4 mb-4">
            <h4 className="text-lg font-semibold text-gray-800 mb-3">
              🛒 Producto Recomendado: Juguetes Flotantes para el Mar
            </h4>
            <p className="text-gray-600 mb-3">
              <strong>Características de los juguetes ideales:</strong>
            </p>
            <ul className="text-gray-600 space-y-1 mb-4">
              <li>• Material flotante duradero</li>
              <li>• Colores brillantes para visibilidad</li>
              <li>• Fácil de limpiar</li>
              <li>• Resistente al agua salada</li>
              <li>• Tamaño apropiado para tu perro</li>
            </ul>
            <div className="text-center">
              <a 
                href="https://www.amazon.com/s?k=dog+toys+floating+water+beach+boat" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-block bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 px-6 rounded-lg transition-colors"
              >
                🛒 Ver Juguetes Flotantes en Amazon
              </a>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6 mb-8 shadow-sm">
          <h3 className="text-2xl font-semibold text-gray-800 mb-4">
            🧠 Juegos de Olfato y Estimulación Mental
          </h3>
          <p className="text-gray-600 mb-4">
            Los juegos de olfato y los juguetes interactivos son excelentes para mantener su mente activa durante 
            los días de navegación.
          </p>
          <div className="grid md:grid-cols-2 gap-6 items-center">
            <div>
              <p className="text-gray-600 mb-4">
                <strong>Actividades recomendadas:</strong>
              </p>
              <ul className="text-gray-600 space-y-2">
                <li>• Búsqueda de premios escondidos</li>
                <li>• Juguetes de rompecabezas</li>
                <li>• Entrenamiento de comandos básicos</li>
                <li>• Juegos de seguimiento de olores</li>
              </ul>
            </div>
            <div>
              <UnsplashImage
                searchQuery="dog playing puzzle toy boat deck"
                width={400}
                height={300}
                alt="Perro jugando con juguete de rompecabezas en la cubierta"
                className="rounded-lg"
              />
            </div>
          </div>
        </div>

        {/* Galería de imágenes */}
        <div className="mb-8">
          <h3 className="text-2xl font-semibold text-gray-800 mb-4">
            🖼️ Galería: Aventuras en Barco con Mascotas
          </h3>
          <UnsplashImageGallery
            searchQuery="dogs boats sailing adventure pets marine"
            count={6}
            title="Perros disfrutando aventuras en barco"
            className="mb-8"
          />
        </div>

        {/* Planificación con BoatTrip Planner */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-6 mb-8">
          <h3 className="text-2xl font-semibold text-gray-800 mb-4">
            🚢 Planifica tu Aventura con BoatTrip Planner
          </h3>
          <p className="text-gray-600 mb-4">
            Una aventura para toda la familia. <strong>BoatTrip Planner</strong> te lo pone fácil para encontrar 
            el barco perfecto para tu viaje con mascotas.
          </p>
          
          <div className="bg-white rounded-lg p-6">
            <h4 className="text-xl font-semibold text-gray-800 mb-4">
              🌟 ¿Por qué elegir BoatTrip Planner?
            </h4>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <ul className="text-gray-600 space-y-2">
                  <li>• <strong>Barcos pet-friendly</strong> verificados</li>
                  <li>• <strong>Itinerarios personalizados</strong> para familias con mascotas</li>
                  <li>• <strong>Asesoramiento experto</strong> en viajes con animales</li>
                  <li>• <strong>Reservas seguras</strong> y confiables</li>
                </ul>
              </div>
              <div>
                <UnsplashImage
                  searchQuery="family dog boat sailing together"
                  width={400}
                  height={300}
                  alt="Familia con perro navegando juntos"
                  className="rounded-lg"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Call to action principal */}
        <div className="relative rounded-lg overflow-hidden mb-8">
          <UnsplashImage
            searchQuery="happy dog family boat sailing sunset"
            width={800}
            height={400}
            alt="Perro feliz con familia en barco al atardecer"
            className="w-full"
            showAttribution={false}
          />
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="text-center text-white">
              <h3 className="text-2xl font-bold mb-4">
                ¡No Esperes Más!
              </h3>
              <p className="text-lg mb-6">
                Haz clic aquí para encontrar el barco perfecto y planifica el mejor viaje con toda tu familia y tu perro con SamBoat.
              </p>
              <a 
                href="https://www.boattrip-planner.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
              >
                🚢 Planificar Mi Viaje con Mascotas
              </a>
            </div>
          </div>
        </div>

        {/* Conclusión */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
          <h3 className="text-2xl font-semibold text-gray-800 mb-4">
            🎉 Conclusión: Una Aventura para Toda la Familia
          </h3>
          <p className="text-gray-700 mb-4">
            Viajar con tu perro en barco no es solo un viaje; es una oportunidad para fortalecer el vínculo, 
            crear recuerdos únicos y enseñarle a amar el mar tanto como tú. Con la preparación y el equipo correctos, 
            el único problema que tendrás es que no querrá volver a tierra firme.
          </p>
          <blockquote className="text-blue-800 italic border-l-4 border-blue-400 pl-4">
            <strong>"Los perros no son toda nuestra vida, pero hacen que nuestra vida sea completa."</strong> - Roger Caras
          </blockquote>
        </div>

        {/* Próximos pasos */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">
            🚀 Próximos pasos para tu aventura:
          </h3>
          <ol className="text-gray-700 space-y-2">
            <li>1. Visita al veterinario y preparación médica</li>
            <li>2. Adquiere el equipamiento de seguridad esencial</li>
            <li>3. Entrena a tu perro para la vida en barco</li>
            <li>4. Planifica tu ruta con <a href="https://www.boattrip-planner.com" className="text-blue-600 hover:text-blue-800">BoatTrip Planner</a></li>
            <li>5. ¡Zarpa hacia la aventura de tu vida!</li>
          </ol>
          <p className="text-lg font-semibold text-green-800 mt-4">
            ¡Tu perro está listo para convertirse en el marinero más feliz del mar! 🐕⚓
          </p>
        </div>

        {/* Enlaces relacionados */}
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">
            🔗 Artículos Relacionados en BoatTrip Planner
          </h3>
          <ul className="text-gray-700 space-y-2">
            <li>
              <a href="https://www.boattrip-planner.com/blog/mascotas" className="text-blue-600 hover:text-blue-800">
                • Guía completa de mascotas en viajes marítimos
              </a>
            </li>
            <li>
              <a href="https://www.boattrip-planner.com/blog/seguridad" className="text-blue-600 hover:text-blue-800">
                • Seguridad en el mar: Todo lo que necesitas saber
              </a>
            </li>
            <li>
              <a href="https://www.boattrip-planner.com/blog/planificacion" className="text-blue-600 hover:text-blue-800">
                • Planificación de viajes en barco paso a paso
              </a>
            </li>
          </ul>
        </div>
      </div>
    </article>
  );
};

export default MascotasEnBarcoBlogPost;
