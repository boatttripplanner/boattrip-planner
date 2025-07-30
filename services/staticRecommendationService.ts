import { UserPreferences } from '../types';

// Tipos de barcos disponibles
const BOAT_TYPES = {
  SAILBOAT: 'velero',
  MOTORBOAT: 'lancha a motor',
  CATAMARAN: 'catamarán',
  YACHT: 'yate',
  FISHING_BOAT: 'barco de pesca',
  KAYAK: 'kayak',
  CANOE: 'canoa'
};

// Destinos populares
const POPULAR_DESTINATIONS = {
  BALEARES: {
    name: 'Islas Baleares',
    description: 'Archipiélago mediterráneo con aguas cristalinas',
    ports: ['Palma de Mallorca', 'Ibiza', 'Mahón', 'Ciutadella']
  },
  CANARIAS: {
    name: 'Islas Canarias',
    description: 'Islas atlánticas con clima subtropical',
    ports: ['Las Palmas', 'Santa Cruz de Tenerife', 'Puerto del Rosario']
  },
  COSTA_BRAVA: {
    name: 'Costa Brava',
    description: 'Costa catalana con calas espectaculares',
    ports: ['Barcelona', 'Girona', 'Palamós', 'Cadaqués']
  },
  COSTA_DEL_SOL: {
    name: 'Costa del Sol',
    description: 'Costa andaluza con playas doradas',
    ports: ['Málaga', 'Marbella', 'Estepona', 'Gibraltar']
  }
};

// Generar recomendación estática basada en preferencias
export const generateStaticRecommendation = (preferences: UserPreferences): string => {
  const {
    experienceLevel,
    routeType,
    crewSize,
    budgetLevel,
    planningMode,
    boatType,
    duration,
    preferredActivities
  } = preferences;

  // Determinar tipo de barco recomendado
  const recommendedBoat = getRecommendedBoat(experienceLevel, crewSize, budgetLevel, boatType);
  
  // Determinar destino recomendado
  const recommendedDestination = getRecommendedDestination(routeType, experienceLevel, budgetLevel);
  
  // Generar itinerario
  const itinerary = generateItinerary(recommendedDestination, duration, preferredActivities);
  
  // Generar consejos de seguridad
  const safetyTips = generateSafetyTips(experienceLevel, crewSize);
  
  // Generar estimación de costos
  const costEstimate = generateCostEstimate(budgetLevel, duration, crewSize, recommendedBoat);
  
  // Generar recomendaciones de equipamiento
  const equipmentRecommendations = generateEquipmentRecommendations(experienceLevel, duration, preferredActivities);

  return `
# 🚢 Plan de Viaje en Barco Personalizado

## 📍 **Destino Recomendado: ${recommendedDestination.name}**
${recommendedDestination.description}

## ⛵ **Barco Recomendado: ${recommendedBoat.name}**
${recommendedBoat.description}

## 🗺️ **Itinerario Sugerido (${duration} días)**

${itinerary}

## 👥 **Configuración de Tripulación**
- **Tamaño de tripulación:** ${crewSize} personas
- **Nivel de experiencia:** ${getExperienceLevelText(experienceLevel)}
- **Tipo de ruta:** ${getRouteTypeText(routeType)}

## 💰 **Estimación de Costos**
${costEstimate}

## 🛡️ **Consejos de Seguridad**
${safetyTips}

## 🎒 **Equipamiento Recomendado**
${equipmentRecommendations}

## 🌊 **Actividades Sugeridas**
${generateActivityRecommendations(preferredActivities, recommendedDestination)}

## 📞 **Información de Contacto de Emergencia**
- **Guardia Costera:** 112
- **Emergencias Marítimas:** 900 202 202
- **Meteorología:** AEMET

## 📋 **Checklist de Preparación**
${generatePreparationChecklist(experienceLevel, duration)}

---
*Esta recomendación está basada en tus preferencias y está diseñada para maximizar tu experiencia de navegación. Recuerda siempre verificar las condiciones meteorológicas antes de zarpar.*
  `.trim();
};

// Funciones auxiliares
function getRecommendedBoat(experienceLevel: string, crewSize: number, budgetLevel: string, preferredBoat?: string) {
  if (preferredBoat) {
    return {
      name: preferredBoat,
      description: `Barco seleccionado según tus preferencias. Ideal para tu nivel de experiencia (${experienceLevel}).`
    };
  }

  if (crewSize <= 2) {
    return {
      name: BOAT_TYPES.SAILBOAT,
      description: 'Velero de 6-8 metros, perfecto para parejas. Fácil de manejar y económico en combustible.'
    };
  } else if (crewSize <= 4) {
    return {
      name: BOAT_TYPES.CATAMARAN,
      description: 'Catamarán de 10-12 metros, estable y espacioso. Ideal para familias o grupos pequeños.'
    };
  } else {
    return {
      name: BOAT_TYPES.YACHT,
      description: 'Yate de 12-15 metros con todas las comodidades. Perfecto para grupos grandes.'
    };
  }
}

function getRecommendedDestination(routeType: string, experienceLevel: string, budgetLevel: string) {
  if (routeType === 'costa') {
    return POPULAR_DESTINATIONS.COSTA_BRAVA;
  } else if (routeType === 'islas') {
    return POPULAR_DESTINATIONS.BALEARES;
  } else if (routeType === 'oceano') {
    return POPULAR_DESTINATIONS.CANARIAS;
  } else {
    return POPULAR_DESTINATIONS.COSTA_DEL_SOL;
  }
}

function generateItinerary(destination: any, duration: number, activities: string[]) {
  const days = Math.min(duration, 7);
  let itinerary = '';

  for (let day = 1; day <= days; day++) {
    itinerary += `\n**Día ${day}:** `;
    
    if (day === 1) {
      itinerary += `Salida desde ${destination.ports[0]}. Navegación de familiarización y ajuste de velas.`;
    } else if (day === days) {
      itinerary += `Regreso a puerto. Limpieza y despedida.`;
    } else {
      const port = destination.ports[day % destination.ports.length];
      itinerary += `Navegación hacia ${port}. ${getActivityForDay(activities, day)}`;
    }
  }

  return itinerary;
}

function getActivityForDay(activities: string[], day: number) {
  const activityMap: { [key: string]: string[] } = {
    'pesca': ['Pesca deportiva en aguas profundas', 'Pesca desde el barco', 'Pesca en calas'],
    'buceo': ['Buceo en arrecifes', 'Snorkel en aguas cristalinas', 'Exploración submarina'],
    'natacion': ['Baño en calas vírgenes', 'Natación en aguas abiertas', 'Relajación en playas'],
    'navegacion': ['Navegación a vela', 'Práctica de maniobras', 'Navegación costera'],
    'turismo': ['Visita a pueblos costeros', 'Exploración de islas', 'Turismo cultural']
  };

  const availableActivities = activities.flatMap(activity => activityMap[activity] || []);
  return availableActivities[day % availableActivities.length] || 'Navegación relajada y disfrute del mar.';
}

function generateSafetyTips(experienceLevel: string, crewSize: number) {
  const tips = [
    '✅ Siempre verifica el pronóstico del tiempo antes de zarpar',
    '✅ Lleva chalecos salvavidas para todos los tripulantes',
    '✅ Ten un plan de emergencia y comunícalo a todos',
    '✅ Mantén el equipo de seguridad en buen estado',
    '✅ Conoce las reglas de navegación locales'
  ];

  if (experienceLevel === 'principiante') {
    tips.push('✅ Considera contratar un capitán experimentado para tu primer viaje');
    tips.push('✅ Navega solo en condiciones meteorológicas favorables');
  }

  if (crewSize > 4) {
    tips.push('✅ Asigna roles específicos a cada tripulante');
    tips.push('✅ Realiza simulacros de emergencia');
  }

  return tips.join('\n');
}

function generateCostEstimate(budgetLevel: string, duration: number, crewSize: number, boat: any) {
  const baseCosts = {
    'bajo': { daily: 150, fuel: 50, food: 30 },
    'medio': { daily: 300, fuel: 100, food: 60 },
    'alto': { daily: 600, fuel: 200, food: 120 }
  };

  const costs = baseCosts[budgetLevel as keyof typeof baseCosts] || baseCosts.medio;
  const totalDaily = costs.daily + costs.fuel + (costs.food * crewSize);
  const total = totalDaily * duration;

  return `
- **Alquiler del barco:** €${costs.daily * duration}
- **Combustible:** €${costs.fuel * duration}
- **Alimentación:** €${costs.food * crewSize * duration}
- **Equipamiento:** €${Math.round(total * 0.1)}
- **Seguros:** €${Math.round(total * 0.05)}
- **Otros gastos:** €${Math.round(total * 0.15)}

**Total estimado: €${total + Math.round(total * 0.3)}**
  `.trim();
}

function generateEquipmentRecommendations(experienceLevel: string, duration: number, activities: string[]) {
  const equipment = [
    '📱 GPS y cartas náuticas',
    '🛟 Chalecos salvavidas (uno por persona)',
    '🆘 Kit de primeros auxilios',
    '🔋 Baterías de repuesto',
    '💧 Agua potable (2L por persona por día)',
    '🍽️ Vajilla y utensilios de cocina'
  ];

  if (duration > 3) {
    equipment.push('🛏️ Ropa de cama y toallas');
    equipment.push('🧴 Productos de higiene personal');
  }

  if (activities.includes('pesca')) {
    equipment.push('🎣 Equipo de pesca');
    equipment.push('🧊 Hielo para conservar pescado');
  }

  if (activities.includes('buceo')) {
    equipment.push('🤿 Equipo de buceo y snorkel');
    equipment.push('📷 Cámara subacuática');
  }

  return equipment.join('\n');
}

function generateActivityRecommendations(activities: string[], destination: any) {
  const activityRecommendations = activities.map(activity => {
    switch (activity) {
      case 'pesca':
        return '🎣 **Pesca:** Aguas ricas en dorada, lubina y atún. Mejor época: primavera y otoño.';
      case 'buceo':
        return '🤿 **Buceo:** Arrecifes naturales y vida marina abundante. Visibilidad excelente.';
      case 'natacion':
        return '🏊 **Natación:** Calas vírgenes y playas de arena blanca. Aguas cristalinas y cálidas.';
      case 'navegacion':
        return '⛵ **Navegación:** Vientos favorables y condiciones ideales para navegación a vela.';
      case 'turismo':
        return '🏛️ **Turismo:** Pueblos pesqueros tradicionales y sitios históricos costeros.';
      default:
        return '🌊 **Relajación:** Disfruta del mar y la tranquilidad de la navegación.';
    }
  });

  return activityRecommendations.join('\n\n');
}

function generatePreparationChecklist(experienceLevel: string, duration: number) {
  const checklist = [
    '📋 Verificar documentación del barco y licencias',
    '🌤️ Consultar pronóstico meteorológico detallado',
    '⛽ Revisar niveles de combustible y agua',
    '🔧 Verificar funcionamiento del motor y sistemas',
    '📱 Cargar dispositivos electrónicos',
    '🧳 Preparar ropa adecuada para el clima'
  ];

  if (experienceLevel === 'principiante') {
    checklist.push('👨‍✈️ Confirmar reserva de capitán experimentado');
    checklist.push('📚 Revisar manual de navegación básica');
  }

  if (duration > 3) {
    checklist.push('🛒 Hacer compra de provisiones');
    checklist.push('💊 Verificar medicamentos personales');
  }

  return checklist.join('\n');
}

function getExperienceLevelText(level: string) {
  const levels = {
    'principiante': 'Principiante - Ideal para aprender',
    'intermedio': 'Intermedio - Experiencia moderada',
    'avanzado': 'Avanzado - Experiencia extensa',
    'experto': 'Experto - Navegación profesional'
  };
  return levels[level as keyof typeof levels] || level;
}

function getRouteTypeText(type: string) {
  const types = {
    'costa': 'Navegación costera - Segura y accesible',
    'islas': 'Navegación entre islas - Aventura moderada',
    'oceano': 'Navegación oceánica - Experiencia avanzada'
  };
  return types[type as keyof typeof types] || type;
} 