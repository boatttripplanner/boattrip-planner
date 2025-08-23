import React, { useState } from 'react';
import InteractiveChecklist from './InteractiveChecklist';
import { ChecklistIcon, ShieldCheckIcon, AnchorIcon, MapIcon, CogIcon, AlertTriangleIcon } from './icons';

interface ChecklistData {
  id: string;
  type: 'safety' | 'equipment' | 'destination' | 'maintenance' | 'emergency';
  title: string;
  description: string;
  items: any[];
}

const ChecklistShowcase: React.FC = () => {
  const [selectedChecklist, setSelectedChecklist] = useState<string>('safety');

  // Checklist de Seguridad Náutica
  const safetyChecklist: ChecklistData = {
    id: 'safety',
    type: 'safety',
    title: 'Checklist de Seguridad Náutica',
    description: 'Verifica que tienes todo el equipamiento de seguridad esencial antes de zarpar',
    items: [
      {
        id: 'safety-1',
        title: 'Chalecos Salvavidas',
        description: 'Chalecos salvavidas homologados CE para todos los tripulantes',
        category: 'safety',
        isEssential: true,
        isCompleted: false,
        tips: [
          'Verifica que el tamaño sea el correcto para cada persona',
          'Comprueba que las cintas estén en buen estado',
          'Asegúrate de que floten correctamente'
        ],
        amazonProducts: [
          {
            name: 'Chaleco Salvavidas Náutico CE 150N',
            price: '€45.99',
            rating: 4.6,
            reviewCount: 127,
            imageUrl: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=100&h=100&fit=crop&crop=center',
            affiliateUrl: 'https://www.amazon.es/s?k=chaleco+salvavidas+nautico+ce+150n&tag=explorashop18-21&linkCode=ur2&linkId=nautical_safety_chaleco&camp=3638&creative=24630&ref=as_li_ss_tl&utm_source=boattrip-planner&utm_medium=affiliate&utm_campaign=nautical_safety&utm_content=chaleco_salvavidas',
            category: 'safety'
          }
        ]
      },
      {
        id: 'safety-2',
        title: 'Radio VHF Portátil',
        description: 'Radio VHF portátil con GPS integrado para comunicaciones de emergencia',
        category: 'communication',
        isEssential: true,
        isCompleted: false,
        tips: [
          'Verifica que la batería esté completamente cargada',
          'Comprueba que el canal 16 esté configurado',
          'Testea la funcionalidad GPS'
        ],
        amazonProducts: [
          {
            name: 'Standard Horizon HX890 VHF Portátil',
            price: '€199.00',
            rating: 4.7,
            reviewCount: 89,
            imageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=100&h=100&fit=crop&crop=center',
            affiliateUrl: 'https://www.amazon.es/s?k=standard+horizon+hx890+vhf+portatil&tag=explorashop18-21&linkCode=ur2&linkId=nautical_safety_vhf&camp=3638&creative=24630&ref=as_li_ss_tl&utm_source=boattrip-planner&utm_medium=affiliate&utm_campaign=nautical_safety&utm_content=vhf_portatil',
            category: 'communication'
          }
        ]
      },
      {
        id: 'safety-3',
        title: 'Botiquín de Primeros Auxilios',
        description: 'Botiquín completo con material para emergencias médicas a bordo',
        category: 'emergency',
        isEssential: true,
        isCompleted: false,
        tips: [
          'Verifica fechas de caducidad de medicamentos',
          'Asegúrate de que esté en lugar accesible',
          'Incluye guía de primeros auxilios'
        ],
        amazonProducts: [
          {
            name: 'Botiquín Náutico Completo 100 Piezas',
            price: '€29.99',
            rating: 4.5,
            reviewCount: 156,
            imageUrl: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=100&h=100&fit=crop&crop=center',
            affiliateUrl: 'https://www.amazon.es/s?k=botiquin+nautico+completo+100+piezas&tag=explorashop18-21&linkCode=ur2&linkId=nautical_safety_botiquin&camp=3638&creative=24630&ref=as_li_ss_tl&utm_source=boattrip-planner&utm_medium=affiliate&utm_campaign=nautical_safety&utm_content=botiquin_nautico',
            category: 'emergency'
          }
        ]
      },
      {
        id: 'safety-4',
        title: 'Linterna de Emergencia',
        description: 'Linterna potente y resistente al agua para emergencias nocturnas',
        category: 'emergency',
        isEssential: true,
        isCompleted: false,
        tips: [
          'Verifica que las pilas estén cargadas',
          'Comprueba la resistencia al agua',
          'Testea la intensidad de la luz'
        ],
        amazonProducts: [
          {
            name: 'Linterna LED Náutica 1000 Lumens',
            price: '€24.99',
            rating: 4.4,
            reviewCount: 203,
            imageUrl: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=100&h=100&fit=crop&crop=center',
            affiliateUrl: 'https://www.amazon.es/s?k=linterna+led+nautica+1000+lumens&tag=explorashop18-21&linkCode=ur2&linkId=nautical_safety_linterna&camp=3638&creative=24630&ref=as_li_ss_tl&utm_source=boattrip-planner&utm_medium=affiliate&utm_campaign=nautical_safety&utm_content=linterna_emergencia',
            category: 'emergency'
          }
        ]
      }
    ]
  };

  // Checklist de Equipamiento Esencial
  const equipmentChecklist: ChecklistData = {
    id: 'equipment',
    type: 'equipment',
    title: 'Checklist de Equipamiento Esencial',
    description: 'Todo el equipamiento básico que necesitas para una navegación segura y cómoda',
    items: [
      {
        id: 'equipment-1',
        title: 'GPS Náutico',
        description: 'GPS portátil o reloj con navegación marítima y mapas incluidos',
        category: 'navigation',
        isEssential: true,
        isCompleted: false,
        tips: [
          'Verifica que los mapas estén actualizados',
          'Comprueba la duración de la batería',
          'Testea la precisión del GPS'
        ],
        amazonProducts: [
          {
            name: 'Garmin fēnix 7 GPS Multideporte',
            price: '€389.00',
            rating: 4.8,
            reviewCount: 342,
            imageUrl: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=100&h=100&fit=crop&crop=center',
            affiliateUrl: 'https://www.amazon.es/s?k=garmin+fenix+7+gps+multideporte&tag=explorashop18-21&linkCode=ur2&linkId=nautical_equipment_gps&camp=3638&creative=24630&ref=as_li_ss_tl&utm_source=boattrip-planner&utm_medium=affiliate&utm_campaign=nautical_equipment&utm_content=gps_navegacion',
            category: 'navigation'
          }
        ]
      },
      {
        id: 'equipment-2',
        title: 'Ancla de Fondeo',
        description: 'Ancla de calidad para fondear de forma segura en diferentes tipos de fondo',
        category: 'navigation',
        isEssential: true,
        isCompleted: false,
        tips: [
          'Verifica el peso adecuado para tu barco',
          'Comprueba el estado de la cadena',
          'Asegúrate de que el cepo esté en buen estado'
        ],
        amazonProducts: [
          {
            name: 'Lewmar Delta Anchor 8kg',
            price: '€189.00',
            rating: 4.6,
            reviewCount: 78,
            imageUrl: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=100&h=100&fit=crop&crop=center',
            affiliateUrl: 'https://www.amazon.es/s?k=lewmar+delta+anchor+8kg&tag=explorashop18-21&linkCode=ur2&linkId=nautical_equipment_ancla&camp=3638&creative=24630&ref=as_li_ss_tl&utm_source=boattrip-planner&utm_medium=affiliate&utm_campaign=nautical_equipment&utm_content=ancla_fondeo',
            category: 'navigation'
          }
        ]
      },
      {
        id: 'equipment-3',
        title: 'Protector Solar Resistente al Agua',
        description: 'Protector solar de alta protección SPF50+ resistente al agua y sudor',
        category: 'comfort',
        isEssential: false,
        isCompleted: false,
        tips: [
          'Aplica cada 2 horas o después de nadar',
          'Usa SPF50+ para máxima protección',
          'Elige fórmula resistente al agua'
        ],
        amazonProducts: [
          {
            name: 'Protector Solar SPF50+ Resistente Agua',
            price: '€18.99',
            rating: 4.7,
            reviewCount: 445,
            imageUrl: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=100&h=100&fit=crop&crop=center',
            affiliateUrl: 'https://www.amazon.es/s?k=protector+solar+spf50+resistente+agua+nautico&tag=explorashop18-21&linkCode=ur2&linkId=nautical_equipment_protector&camp=3638&creative=24630&ref=as_li_ss_tl&utm_source=boattrip-planner&utm_medium=affiliate&utm_campaign=nautical_equipment&utm_content=protector_solar',
            category: 'comfort'
          }
        ]
      },
      {
        id: 'equipment-4',
        title: 'Gafas de Sol Polarizadas',
        description: 'Gafas de sol polarizadas para reducir el reflejo del agua y mejorar la visibilidad',
        category: 'comfort',
        isEssential: false,
        isCompleted: false,
        tips: [
          'Elige lentes polarizadas para reducir reflejos',
          'Verifica la protección UV400',
          'Asegúrate de que se ajusten bien'
        ],
        amazonProducts: [
          {
            name: 'Gafas Sol Polarizadas Náuticas UV400',
            price: '€34.99',
            rating: 4.5,
            reviewCount: 289,
            imageUrl: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=100&h=100&fit=crop&crop=center',
            affiliateUrl: 'https://www.amazon.es/s?k=gafas+sol+polarizadas+nauticas+uv400&tag=explorashop18-21&linkCode=ur2&linkId=nautical_equipment_gafas&camp=3638&creative=24630&ref=as_li_ss_tl&utm_source=boattrip-planner&utm_medium=affiliate&utm_campaign=nautical_equipment&utm_content=gafas_sol',
            category: 'comfort'
          }
        ]
      }
    ]
  };

  // Checklist de Destino
  const destinationChecklist: ChecklistData = {
    id: 'destination',
    type: 'destination',
    title: 'Checklist de Preparación del Destino',
    description: 'Prepara tu viaje náutico con toda la información y equipamiento necesario',
    items: [
      {
        id: 'destination-1',
        title: 'Guías Náuticas del Destino',
        description: 'Guías y cartas náuticas actualizadas de la zona que vas a navegar',
        category: 'navigation',
        isEssential: true,
        isCompleted: false,
        tips: [
          'Verifica que las cartas estén actualizadas',
          'Incluye información de puertos y marinas',
          'Revisa las regulaciones locales'
        ],
        amazonProducts: [
          {
            name: 'Guía Náutica Mediterráneo 2024',
            price: '€24.99',
            rating: 4.6,
            reviewCount: 67,
            imageUrl: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=100&h=100&fit=crop&crop=center',
            affiliateUrl: 'https://www.amazon.es/s?k=guia+nautica+mediterraneo+2024&tag=explorashop18-21&linkCode=ur2&linkId=nautical_destination_guia&camp=3638&creative=24630&ref=as_li_ss_tl&utm_source=boattrip-planner&utm_medium=affiliate&utm_campaign=nautical_destination&utm_content=guia_nautica',
            category: 'navigation'
          }
        ]
      },
      {
        id: 'destination-2',
        title: 'Equipo de Snorkel',
        description: 'Equipo completo de snorkel para explorar la vida marina del destino',
        category: 'comfort',
        isEssential: false,
        isCompleted: false,
        tips: [
          'Verifica que la máscara se ajuste bien',
          'Comprueba el estado de las aletas',
          'Limpia el snorkel antes de usar'
        ],
        amazonProducts: [
          {
            name: 'Equipo Snorkel Completo Profesional',
            price: '€39.99',
            rating: 4.4,
            reviewCount: 178,
            imageUrl: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=100&h=100&fit=crop&crop=center',
            affiliateUrl: 'https://www.amazon.es/s?k=equipo+snorkel+completo+profesional+nautico&tag=explorashop18-21&linkCode=ur2&linkId=nautical_destination_snorkel&camp=3638&creative=24630&ref=as_li_ss_tl&utm_source=boattrip-planner&utm_medium=affiliate&utm_campaign=nautical_destination&utm_content=equipo_snorkel',
            category: 'comfort'
          }
        ]
      },
      {
        id: 'destination-3',
        title: 'Cámara de Acción',
        description: 'Cámara resistente al agua para documentar tu aventura náutica',
        category: 'comfort',
        isEssential: false,
        isCompleted: false,
        tips: [
          'Verifica la resistencia al agua',
          'Lleva baterías de repuesto',
          'Usa tarjetas de memoria de alta velocidad'
        ],
        amazonProducts: [
          {
            name: 'GoPro HERO11 Black 5.3K',
            price: '€349.99',
            rating: 4.8,
            reviewCount: 567,
            imageUrl: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=100&h=100&fit=crop&crop=center',
            affiliateUrl: 'https://www.amazon.es/s?k=gopro+hero11+black+5.3k&tag=explorashop18-21&linkCode=ur2&linkId=nautical_destination_gopro&camp=3638&creative=24630&ref=as_li_ss_tl&utm_source=boattrip-planner&utm_medium=affiliate&utm_campaign=nautical_destination&utm_content=camara_accion',
            category: 'comfort'
          }
        ]
      }
    ]
  };

  const checklists = {
    safety: safetyChecklist,
    equipment: equipmentChecklist,
    destination: destinationChecklist
  };

  const handleComplete = (completedItems: string[]) => {
    console.log('Items completados:', completedItems);
    // Aquí podrías enviar analytics o guardar en localStorage
  };

  const handleShare = (checklistData: any) => {
    console.log('Compartiendo checklist:', checklistData);
    // Aquí podrías implementar analytics de sharing
  };

  const handleDownload = () => {
    console.log('Descargando checklist');
    // Aquí podrías implementar analytics de descarga
  };

  const getChecklistIcon = (type: string) => {
    switch (type) {
      case 'safety': return <ShieldCheckIcon className="w-6 h-6" />;
      case 'equipment': return <AnchorIcon className="w-6 h-6" />;
      case 'destination': return <MapIcon className="w-6 h-6" />;
      case 'maintenance': return <CogIcon className="w-6 h-6" />;
      case 'emergency': return <AlertTriangleIcon className="w-6 h-6" />;
      default: return <ChecklistIcon className="w-6 h-6" />;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          🚢 Checklists Interactivos Náuticos
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Organiza tu aventura náutica con nuestros checklists interactivos. 
          Cada item incluye productos Amazon recomendados y consejos expertos.
        </p>
      </div>

      {/* Checklist Selector */}
      <div className="flex justify-center mb-8">
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-2">
          {Object.entries(checklists).map(([key, checklist]) => (
            <button
              key={key}
              onClick={() => setSelectedChecklist(key)}
              className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-all ${
                selectedChecklist === key
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              {getChecklistIcon(checklist.type)}
              <span>{checklist.title.split(' ')[0]}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Selected Checklist */}
      <div className="mb-8">
        <InteractiveChecklist
          checklistType={checklists[selectedChecklist].type}
          title={checklists[selectedChecklist].title}
          description={checklists[selectedChecklist].description}
          items={checklists[selectedChecklist].items}
          onComplete={handleComplete}
          onShare={handleShare}
          onDownload={handleDownload}
        />
      </div>

      {/* Benefits Section */}
      <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl p-8 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          ¿Por qué usar nuestros Checklists Interactivos?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-4xl mb-3">✅</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Productos Verificados</h3>
            <p className="text-gray-600">Cada recomendación incluye productos Amazon reales y verificados</p>
          </div>
          <div className="text-center">
            <div className="text-4xl mb-3">💡</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Consejos Expertos</h3>
            <p className="text-gray-600">Tips prácticos de navegantes experimentados</p>
          </div>
          <div className="text-center">
            <div className="text-4xl mb-3">📱</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Totalmente Interactivo</h3>
            <p className="text-gray-600">Marca, comparte y descarga tu progreso</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChecklistShowcase;
