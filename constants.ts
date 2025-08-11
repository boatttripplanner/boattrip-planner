import { BudgetLevel, PlanningMode, planningModeOptions as planningModeOptionsType } from './types'; // Added PlanningMode to imports

export const GEMINI_MODEL_NAME = 'gemini-2.5-flash';
export const APP_TITLE = "BoatTrip Planner"; 
export const BLOG_TITLE = "Blog de Aventuras Náuticas"; // Updated: Removed " | BoatTrip Planner"

export const BASE_URL = typeof window !== 'undefined' ? window.location.origin : "https://boattrip-planner.com"; // Dynamic Base URL

export const DEFAULT_APP_DESCRIPTION = "Una aplicación que proporciona recomendaciones personalizadas para el alquiler de barcos utilizando IA, simplificando el proceso de planificación de viajes. Incluye un blog con consejos y destinos náuticos.";
export const BLOG_INDEX_DESCRIPTION = "Explora nuestro blog para obtener consejos de navegación, guías de destinos, checklists y mucho más para planificar tu próxima aventura náutica con BoatTrip Planner.";


// AccuWeather Configuration
// Weather Service Configuration
export const WEATHER_SERVICE_ENABLED = true;
export const ACCUWEATHER_API_KEY = import.meta.env.VITE_ACCUWEATHER_API_KEY;
export const ACCUWEATHER_BASE_URL = "https://dataservice.accuweather.com";

// AdSense deshabilitado: mantenemos constantes removidas para evitar uso accidental


export const SAMBOAT_AFFILIATE_URL = "https://www.samboat.com/?utm_source=affilae&utm_medium=cpa&utm_campaign=Sailway%20Adventures&ae=1582";

// Amazon Affiliate Configuration - Enhanced for better monetization
export const AMAZON_AFFILIATE_TAG = "explorashop18-21"; // Your Amazon Affiliate Tag
export const AMAZON_SEARCH_BASE_URL = "https://www.amazon.es/s";

// Amazon Product Advertising API Configuration - REAL CREDENTIALS
export const AMAZON_API_CONFIG = {
  accessKeyId: 'AKPAXD3F0H1753982397',
  secretAccessKey: 'UUY08lWjgs40wYKps1NGLx8RjA2zAXYoQ5e6fw33',
  associateTag: 'explorashop18-21',
  marketplace: 'www.amazon.es',
  region: 'eu-west-1',
          host: 'webservices.amazon.es',
  service: 'ProductAdvertisingAPI',
  version: '2013-08-01'
};

// 🎯 PRODUCTOS CORE VERIFICADOS - ESTRATEGIA DE MONETIZACIÓN OPTIMIZADA
export const PRODUCTOS_CORE_VERIFICADOS = {
  // 🛡️ BÁSICOS UNIVERSALES (en 80% de artículos) - €50-150/venta
  seguridad: {
    asin: 'B01M0WXQKX',
    nombre: 'Chaleco Salvavidas Náutico',
    precio: '€45-65',
    categoria: 'seguridad',
    prioridad: 10,
    search_query: 'chaleco salvavidas náutico homologado',
    comision_estimada: '€4-6'
  },
  salud: {
    asin: 'B08XQRZQRF', 
    nombre: 'Protector Solar Resistente Agua',
    precio: '€15-25',
    categoria: 'salud',
    prioridad: 9,
    search_query: 'protector solar resistente agua SPF 50',
    comision_estimada: '€1-2'
  },
  energia: {
    asin: 'B07FNPY8WG',
    nombre: 'Cargador Solar Portátil',
    precio: '€25-40',
    categoria: 'energia',
    prioridad: 8,
    search_query: 'cargador solar portátil 20000mAh',
    comision_estimada: '€2-3'
  },

  // 🧭 EQUIPAMIENTO ESPECÍFICO - €100-300/venta
  navegacion: {
    asin: 'B09M47HFCQ',
    nombre: 'Garmin fēnix 7 GPS Multideporte',
    precio: '€350-400',
    categoria: 'navegacion',
    prioridad: 10,
    search_query: 'garmin fēnix 7 gps náutico',
    comision_estimada: '€35-40'
  },
  deportes: {
    asin: 'B0B1T4TVTS',
    nombre: 'GoPro HERO11 Black',
    precio: '€300-400',
    categoria: 'deportes',
    prioridad: 9,
    search_query: 'gopro hero11 black cámara acción',
    comision_estimada: '€30-40'
  },
  snorkel: {
    asin: 'B00AVSSZAW',
    nombre: 'Cressi Palau Aletas Snorkel',
    precio: '€30-45',
    categoria: 'deportes',
    prioridad: 8,
    search_query: 'cressi palau aletas snorkel',
    comision_estimada: '€3-4'
  },

  // 🔧 HERRAMIENTAS Y TÉCNICO - €75-200/venta
  herramientas: {
    asin: 'B075ZN5LJY',
    nombre: 'Kit Herramientas Náuticas',
    precio: '€80-120',
    categoria: 'herramientas',
    prioridad: 8,
    search_query: 'kit herramientas náuticas mantenimiento',
    comision_estimada: '€8-12'
  },
  nevera: {
    asin: 'B00363W0OI',
    nombre: 'Coleman Nevera Portátil 28QT',
    precio: '€60-80',
    categoria: 'confort',
    prioridad: 7,
    search_query: 'nevera portátil coleman 28qt',
    comision_estimada: '€6-8'
  },

  // 📚 FORMACIÓN - €200-500/venta
  gps_basico: {
    asin: 'B07Q5X3XXR',
    nombre: 'Garmin Striker GPS Pesca',
    precio: '€200-250',
    categoria: 'navegacion',
    prioridad: 8,
    search_query: 'garmin striker gps pesca navegación',
    comision_estimada: '€20-25'
  },
  linterna: {
    asin: 'B075ZN5LJY',
    nombre: 'Linterna LED Táctica',
    precio: '€25-35',
    categoria: 'seguridad',
    prioridad: 7,
    search_query: 'linterna led táctica náutica',
    comision_estimada: '€2-3'
  }
};

// 🎯 ENLACES AMAZON OPTIMIZADOS POR CATEGORÍA - PRODUCTOS REALES VERIFICADOS
export const AMAZON_AFFILIATE_LINKS = {
  // 🌅 INICIACIÓN NÁUTICA (€50-150/venta) - OPTIMIZADO
  iniciacion: {
    chaleco_basico: `https://www.amazon.es/dp/B01M0WXQKX?tag=${AMAZON_AFFILIATE_TAG}&linkCode=ogi&th=1&psc=1&ref_=as_li_ss_tl&camp=3638&creative=24630&creativeASIN=B01M0WXQKX`,
    protector_solar: `https://www.amazon.es/dp/B08XQRZQRF?tag=${AMAZON_AFFILIATE_TAG}&linkCode=ogi&th=1&psc=1&ref_=as_li_ss_tl&camp=3638&creative=24630&creativeASIN=B08XQRZQRF`,
    ropa_basica: `https://www.amazon.es/s?k=ropa+nautica+impermeable+hombre&tag=${AMAZON_AFFILIATE_TAG}&linkCode=ur2&linkId=nautical_guide&camp=3638&creative=24630&ref=as_li_ss_tl`,
    guia_manual: `https://www.amazon.es/s?k=manual+navegacion+principiantes+español&tag=${AMAZON_AFFILIATE_TAG}&linkCode=ur2&linkId=nautical_guide&camp=3638&creative=24630&ref=as_li_ss_tl`
  },

  // 🗺️ DESTINOS & AVENTURAS (€75-200/venta) - OPTIMIZADO
  destinos: {
    gps_portatil: `https://www.amazon.es/dp/B09M47HFCQ?tag=${AMAZON_AFFILIATE_TAG}&linkCode=ogi&th=1&psc=1&ref_=as_li_ss_tl&camp=3638&creative=24630&creativeASIN=B09M47HFCQ`,
    cartas_nauticas: `https://www.amazon.es/s?k=cartas+nauticas+mediterraneo+españa&tag=${AMAZON_AFFILIATE_TAG}&linkCode=ur2&linkId=nautical_guide&camp=3638&creative=24630&ref=as_li_ss_tl`,
    equipamiento_viaje: `https://www.amazon.es/s?k=equipamiento+viaje+barco+vela&tag=${AMAZON_AFFILIATE_TAG}&linkCode=ur2&linkId=nautical_guide&camp=3638&creative=24630&ref=as_li_ss_tl`,
    guias_destinos: `https://www.amazon.es/s?k=guias+destinos+nauticos+mediterraneo&tag=${AMAZON_AFFILIATE_TAG}&linkCode=ur2&linkId=nautical_guide&camp=3638&creative=24630&ref=as_li_ss_tl`
  },

  // ⚓ CONOCIMIENTO TÉCNICO (€100-300/venta) - OPTIMIZADO
  tecnico: {
    herramientas_profesionales: `https://www.amazon.es/dp/B075ZN5LJY?tag=${AMAZON_AFFILIATE_TAG}&linkCode=ogi&th=1&psc=1&ref_=as_li_ss_tl&camp=3638&creative=24630&creativeASIN=B075ZN5LJY`,
    instrumentos_navegacion: `https://www.amazon.es/s?k=instrumentos+navegacion+nautica&tag=${AMAZON_AFFILIATE_TAG}&linkCode=ur2&linkId=nautical_guide&camp=3638&creative=24630&ref=as_li_ss_tl`,
    manuales_tecnicos: `https://www.amazon.es/s?k=manuales+tecnicos+navegacion&tag=${AMAZON_AFFILIATE_TAG}&linkCode=ur2&linkId=nautical_guide&camp=3638&creative=24630&ref=as_li_ss_tl`,
    equipamiento_mantenimiento: `https://www.amazon.es/s?k=equipamiento+mantenimiento+barco&tag=${AMAZON_AFFILIATE_TAG}&linkCode=ur2&linkId=nautical_guide&camp=3638&creative=24630&ref=as_li_ss_tl`
  },

  // 🏄‍♂️ DEPORTES & ACTIVIDADES (€80-250/venta) - OPTIMIZADO
  deportes: {
    gopro_camara: `https://www.amazon.es/dp/B0B1T4TVTS?tag=${AMAZON_AFFILIATE_TAG}&linkCode=ogi&th=1&psc=1&ref_=as_li_ss_tl&camp=3638&creative=24630&creativeASIN=B0B1T4TVTS`,
    equipo_snorkel: `https://www.amazon.es/dp/B00AVSSZAW?tag=${AMAZON_AFFILIATE_TAG}&linkCode=ogi&th=1&psc=1&ref_=as_li_ss_tl&camp=3638&creative=24630&creativeASIN=B00AVSSZAW`,
    traje_neopreno: `https://www.amazon.es/s?k=traje+neopreno+buceo&tag=${AMAZON_AFFILIATE_TAG}&linkCode=ur2&linkId=nautical_guide&camp=3638&creative=24630&ref=as_li_ss_tl`,
    equipo_pesca: `https://www.amazon.es/s?k=equipo+pesca+completo&tag=${AMAZON_AFFILIATE_TAG}&linkCode=ur2&linkId=nautical_guide&camp=3638&creative=24630&ref=as_li_ss_tl`
  },

  // 🔧 EQUIPAMIENTO & REVIEWS (€200-800/venta) - OPTIMIZADO
  equipamiento: {
    garmin_fenix: `https://www.amazon.es/dp/B09M47HFCQ?tag=${AMAZON_AFFILIATE_TAG}&linkCode=ogi&th=1&psc=1&ref_=as_li_ss_tl&camp=3638&creative=24630&creativeASIN=B09M47HFCQ`,
    panel_solar: `https://www.amazon.es/dp/B07FNPY8WG?tag=${AMAZON_AFFILIATE_TAG}&linkCode=ogi&th=1&psc=1&ref_=as_li_ss_tl&camp=3638&creative=24630&creativeASIN=B07FNPY8WG`,
    radio_vhf: `https://www.amazon.es/s?k=radio+VHF+nautico&tag=${AMAZON_AFFILIATE_TAG}&linkCode=ur2&linkId=nautical_guide&camp=3638&creative=24630&ref=as_li_ss_tl`,
    ancla_marina: `https://www.amazon.es/s?k=ancla+marina+profesional&tag=${AMAZON_AFFILIATE_TAG}&linkCode=ur2&linkId=nautical_guide&camp=3638&creative=24630&ref=as_li_ss_tl`
  },

  // 🌱 NAVEGACIÓN SOSTENIBLE (€100-400/venta) - OPTIMIZADO
  sostenibilidad: {
    cargador_solar: `https://www.amazon.es/dp/B07FNPY8WG?tag=${AMAZON_AFFILIATE_TAG}&linkCode=ogi&th=1&psc=1&ref_=as_li_ss_tl&camp=3638&creative=24630&creativeASIN=B07FNPY8WG`,
    detergente_biodegradable: `https://www.amazon.es/s?k=detergente+biodegradable+nautico+ecologico&tag=${AMAZON_AFFILIATE_TAG}&linkCode=ur2&linkId=nautical_guide&camp=3638&creative=24630&ref=as_li_ss_tl`,
    bombillas_led: `https://www.amazon.es/s?k=bombillas+LED+12V+nauticas+marinas&tag=${AMAZON_AFFILIATE_TAG}&linkCode=ur2&linkId=nautical_guide&camp=3638&creative=24630&ref=as_li_ss_tl`,
    productos_ecologicos: `https://www.amazon.es/s?k=productos+ecologicos+nauticos+biodegradables&tag=${AMAZON_AFFILIATE_TAG}&linkCode=ur2&linkId=nautical_guide&camp=3638&creative=24630&ref=as_li_ss_tl`
  },

  // 👨‍👩‍👧‍👦 NAVEGACIÓN FAMILIAR (€50-200/venta) - OPTIMIZADO
  familiar: {
    chaleco_niños: `https://www.amazon.es/s?k=chaleco+salvavidas+niños&tag=${AMAZON_AFFILIATE_TAG}&linkCode=ur2&linkId=nautical_guide&camp=3638&creative=24630&ref=as_li_ss_tl`,
    juguetes_acuaticos: `https://www.amazon.es/s?k=juguetes+acuaticos+niños&tag=${AMAZON_AFFILIATE_TAG}&linkCode=ur2&linkId=nautical_guide&camp=3638&creative=24630&ref=as_li_ss_tl`,
    chaleco_perro: `https://www.amazon.es/s?k=chaleco+salvavidas+perro&tag=${AMAZON_AFFILIATE_TAG}&linkCode=ur2&linkId=nautical_guide&camp=3638&creative=24630&ref=as_li_ss_tl`,
    equipamiento_familia: `https://www.amazon.es/s?k=equipamiento+familia+barco&tag=${AMAZON_AFFILIATE_TAG}&linkCode=ur2&linkId=nautical_guide&camp=3638&creative=24630&ref=as_li_ss_tl`
  },

  // 🚨 SEGURIDAD & EMERGENCIAS (€75-300/venta) - OPTIMIZADO
  seguridad: {
    botiquin_emergencia: `https://www.amazon.es/s?k=botiquin+primeros+auxilios+nautico&tag=${AMAZON_AFFILIATE_TAG}&linkCode=ur2&linkId=nautical_guide&camp=3638&creative=24630&ref=as_li_ss_tl`,
    bengalas_emergencia: `https://www.amazon.es/s?k=bengalas+emergencia+nauticas&tag=${AMAZON_AFFILIATE_TAG}&linkCode=ur2&linkId=nautical_guide&camp=3638&creative=24630&ref=as_li_ss_tl`,
    linterna_emergencia: `https://www.amazon.es/dp/B075ZN5LJY?tag=${AMAZON_AFFILIATE_TAG}&linkCode=ogi&th=1&psc=1&ref_=as_li_ss_tl&camp=3638&creative=24630&creativeASIN=B075ZN5LJY`,
    equipo_emergencia: `https://www.amazon.es/s?k=equipo+emergencia+nautico&tag=${AMAZON_AFFILIATE_TAG}&linkCode=ur2&linkId=nautical_guide&camp=3638&creative=24630&ref=as_li_ss_tl`
  },

  // 📚 LIBROS Y EDUCACIÓN NÁUTICA
  general: `https://www.amazon.es/s?k=productos+nauticos+general&tag=${AMAZON_AFFILIATE_TAG}&linkCode=ur2&linkId=nautical_guide&camp=3638&creative=24630&ref=as_li_ss_tl`,
  safety_equipment: `https://www.amazon.es/s?k=equipamiento+seguridad+nautica&tag=${AMAZON_AFFILIATE_TAG}&linkCode=ur2&linkId=nautical_guide&camp=3638&creative=24630&ref=as_li_ss_tl`,
  nautical_books: `https://www.amazon.es/s?k=libros+navegacion+nautica&tag=${AMAZON_AFFILIATE_TAG}&linkCode=ur2&linkId=nautical_guide&camp=3638&creative=24630&ref=as_li_ss_tl`,
  compass_marine: `https://www.amazon.es/s?k=compas+nautico+marino&tag=${AMAZON_AFFILIATE_TAG}&linkCode=ur2&linkId=nautical_guide&camp=3638&creative=24630&ref=as_li_ss_tl`,
  navigation_charts: `https://www.amazon.es/s?k=cartas+navegacion+nautica&tag=${AMAZON_AFFILIATE_TAG}&linkCode=ur2&linkId=nautical_guide&camp=3638&creative=24630&ref=as_li_ss_tl`,
  vhf_radio: `https://www.amazon.es/s?k=radio+vhf+nautico&tag=${AMAZON_AFFILIATE_TAG}&linkCode=ur2&linkId=nautical_guide&camp=3638&creative=24630&ref=as_li_ss_tl`
};

// Blog Category Prompts for Content Generation
export const BLOG_CATEGORY_PROMPTS = {
  // MASCOTAS & PERROS 🐕
  mascotas: {
    title: "Navegación con Mascotas",
    description: "Guías completas para navegar con perros y otras mascotas de forma segura y cómoda",
    keywords: ["mascotas", "perros", "animales", "seguridad", "equipamiento"],
    amazon_links: [
      AMAZON_AFFILIATE_LINKS.familiar.chaleco_perro,
      AMAZON_AFFILIATE_LINKS.familiar.equipamiento_familia,
      AMAZON_AFFILIATE_LINKS.iniciacion.protector_solar,
      AMAZON_AFFILIATE_LINKS.seguridad.linterna_emergencia
    ],
    // Productos reales de Amazon API - Específicos para mascotas
    real_products: [
      {
        asin: "B01M0WXQKX", // Chaleco salvavidas real
        category: "safety",
        search_query: "chaleco salvavidas perro barco"
      },
      {
        asin: "B08XQRZQRF", // Protector solar real
        category: "comfort", 
        search_query: "protector solar perro mascota"
      },
      {
        asin: "B00363W0OI", // Nevera para comida de mascotas
        category: "comfort",
        search_query: "nevera portátil comida perro"
      },
      {
        asin: "B075ZN5LJY", // Linterna para emergencias con mascotas
        category: "safety",
        search_query: "linterna emergencia mascotas"
      },
      {
        asin: "B07FNPY8WG", // Cargador solar para dispositivos
        category: "technology",
        search_query: "cargador solar portátil mascotas"
      },
      {
        asin: "B00AVSSZAW", // Equipamiento de seguridad
        category: "safety",
        search_query: "equipamiento seguridad mascotas barco"
      }
    ],
    content_prompt: `Escribe un artículo completo sobre navegación con mascotas, enfocándote en:
    - Seguridad y equipamiento esencial para mascotas
    - Consejos para la adaptación de perros al barco
    - Productos recomendados de Amazon para mascotas náuticas
    - Destinos pet-friendly en España
    - Normativas y consideraciones legales
    Incluye enlaces de afiliado a productos específicos de Amazon para mascotas.`
  },

  // DESTINOS & NAVEGACIÓN 🗺️
  destinos: {
    title: "Destinos Náuticos",
    description: "Los mejores destinos para navegar en España y el Mediterráneo",
    keywords: ["destinos", "islas", "calas", "puertos", "rutas"],
    amazon_links: [
      AMAZON_AFFILIATE_LINKS.destinos.cartas_nauticas,
      AMAZON_AFFILIATE_LINKS.destinos.gps_portatil,
      AMAZON_AFFILIATE_LINKS.destinos.guias_destinos,
      AMAZON_AFFILIATE_LINKS.tecnico.instrumentos_navegacion
    ],
    real_products: [
      {
        asin: "B09M47HFCQ", // Garmin fēnix 7 real
        category: "gps",
        search_query: "gps náutico navegación"
      },
      {
        asin: "B0B1T4TVTS", // GoPro HERO11 Black real
        category: "camera",
        search_query: "cámara acción deportes acuáticos"
      },
      {
        asin: "B08XQRZQRF", // Protector solar para destinos soleados
        category: "comfort",
        search_query: "protector solar resistente agua"
      },
      {
        asin: "B00363W0OI", // Nevera para viajes largos
        category: "comfort",
        search_query: "nevera portátil viaje"
      },
      {
        asin: "B075ZN5LJY", // Linterna para navegación nocturna
        category: "safety",
        search_query: "linterna navegación nocturna"
      },
      {
        asin: "B07FNPY8WG", // Cargador solar para dispositivos
        category: "technology",
        search_query: "cargador solar portátil viaje"
      }
    ],
    content_prompt: `Crea una guía completa de destinos náuticos que incluya:
    - Destinos principales con coordenadas y características
    - Mejores épocas para visitar cada destino
    - Equipamiento de navegación recomendado
    - Productos de Amazon para planificación de viajes
    - Consejos de navegación específicos por zona
    Integra enlaces de afiliado a productos de navegación y cartas náuticas.`
  },

  // EQUIPAMIENTO & SEGURIDAD 🔧
  equipamiento: {
    title: "Equipamiento Náutico",
    description: "Guías de equipamiento esencial y de seguridad para navegación",
    keywords: ["equipamiento", "seguridad", "herramientas", "mantenimiento"],
    amazon_links: [
      AMAZON_AFFILIATE_LINKS.seguridad.equipo_emergencia,
      AMAZON_AFFILIATE_LINKS.tecnico.herramientas_profesionales,
      AMAZON_AFFILIATE_LINKS.seguridad.botiquin_emergencia,
      AMAZON_AFFILIATE_LINKS.seguridad.bengalas_emergencia
    ],
    real_products: [
      {
        asin: "B01M0WXQKX", // Chaleco salvavidas real
        category: "safety",
        search_query: "chaleco salvavidas náutico"
      },
      {
        asin: "B075ZN5LJY", // Anker Linterna LED real
        category: "lighting",
        search_query: "linterna LED náutica"
      },
      {
        asin: "B08XQRZQRF", // Protector solar para trabajo en cubierta
        category: "comfort",
        search_query: "protector solar trabajo exterior"
      },
      {
        asin: "B00363W0OI", // Nevera para herramientas
        category: "tools",
        search_query: "caja herramientas náuticas"
      },
      {
        asin: "B09M47HFCQ", // GPS para navegación
        category: "gps",
        search_query: "gps equipamiento náutico"
      },
      {
        asin: "B07FNPY8WG", // Cargador solar para equipamiento
        category: "technology",
        search_query: "cargador solar equipamiento náutico"
      }
    ],
    content_prompt: `Desarrolla un artículo sobre equipamiento náutico que cubra:
    - Equipamiento de seguridad esencial
    - Herramientas y mantenimiento del barco
    - Productos recomendados de Amazon para equipamiento
    - Checklist de equipamiento por tipo de navegación
    - Consejos de mantenimiento y conservación
    Incluye enlaces de afiliado a productos de seguridad y herramientas.`
  },

  // DEPORTES ACUÁTICOS 🏊‍♂️
  deportes: {
    title: "Deportes Acuáticos",
    description: "Guías para practicar deportes acuáticos desde el barco",
    keywords: ["deportes", "snorkel", "buceo", "pesca", "wakeboard"],
    amazon_links: [
      AMAZON_AFFILIATE_LINKS.deportes.equipo_snorkel,
      AMAZON_AFFILIATE_LINKS.deportes.traje_neopreno,
      AMAZON_AFFILIATE_LINKS.deportes.equipo_pesca,
      AMAZON_AFFILIATE_LINKS.deportes.gopro_camara
    ],
    real_products: [
      {
        asin: "B0B1T4TVTS", // GoPro HERO11 real
        category: "technology",
        search_query: "cámara subacuática deportes acuáticos"
      },
      {
        asin: "B00AVSSZAW", // Aletas Cressi reales
        category: "snorkel",
        search_query: "aletas snorkel buceo"
      },
      {
        asin: "B08XQRZQRF", // Protector solar para deportes acuáticos
        category: "comfort",
        search_query: "protector solar deportes acuáticos"
      },
      {
        asin: "B00363W0OI", // Nevera para bebidas durante deportes
        category: "comfort",
        search_query: "nevera bebidas deportes"
      },
      {
        asin: "B01M0WXQKX", // Chaleco salvavidas para deportes
        category: "safety",
        search_query: "chaleco salvavidas deportes acuáticos"
      },
      {
        asin: "B075ZN5LJY", // Linterna para deportes nocturnos
        category: "lighting",
        search_query: "linterna deportes acuáticos"
      }
    ],
    content_prompt: `Escribe sobre deportes acuáticos que incluye:
    - Equipamiento para snorkel y buceo
    - Técnicas de pesca desde el barco
    - Productos de Amazon para deportes acuáticos
    - Destinos ideales para cada deporte
    - Consejos de seguridad para deportes acuáticos
    Integra enlaces de afiliado a equipamiento deportivo específico.`
  },

  // SOSTENIBILIDAD & MEDIO AMBIENTE 🌍
  sostenibilidad: {
    title: "Navegación Sostenible",
    description: "Guías para navegar de forma responsable y proteger el medio ambiente",
    keywords: ["sostenibilidad", "medio ambiente", "ecológico", "solar"],
    amazon_links: [
      AMAZON_AFFILIATE_LINKS.sostenibilidad.cargador_solar,
      AMAZON_AFFILIATE_LINKS.sostenibilidad.detergente_biodegradable,
      AMAZON_AFFILIATE_LINKS.sostenibilidad.bombillas_led,
      AMAZON_AFFILIATE_LINKS.sostenibilidad.productos_ecologicos
    ],
    real_products: [
      {
        asin: "B07FNPY8WG", // Cargador solar Anker real
        category: "technology",
        search_query: "cargador solar portátil"
      },
      {
        asin: "B075ZN5LJY", // Linterna LED Anker real
        category: "technology",
        search_query: "linterna LED náutica"
      },
      {
        asin: "B08XQRZQRF", // Protector solar biodegradable
        category: "comfort",
        search_query: "protector solar biodegradable"
      },
      {
        asin: "B00363W0OI", // Nevera ecológica
        category: "comfort",
        search_query: "nevera ecológica portátil"
      },
      {
        asin: "B09M47HFCQ", // GPS solar
        category: "gps",
        search_query: "gps solar sostenible"
      },
      {
        asin: "B00AVSSZAW", // Equipamiento ecológico
        category: "sustainability",
        search_query: "equipamiento ecológico náutico"
      }
    ],
    content_prompt: `Crea contenido sobre navegación sostenible que aborde:
    - Energía solar y renovable a bordo
    - Productos biodegradables y ecológicos
    - Prácticas de navegación responsable
    - Productos de Amazon para sostenibilidad
    - Impacto ambiental y cómo reducirlo
    Incluye enlaces de afiliado a productos sostenibles y solares.`
  },

  // FAMILIA & EXPERIENCIAS 👨‍👩‍👧‍👦
  familia: {
    title: "Navegación Familiar",
    description: "Guías para navegar en familia con niños de forma segura y divertida",
    keywords: ["familia", "niños", "experiencias", "seguridad"],
    amazon_links: [
      AMAZON_AFFILIATE_LINKS.familiar.chaleco_niños,
      AMAZON_AFFILIATE_LINKS.familiar.juguetes_acuaticos,
      AMAZON_AFFILIATE_LINKS.familiar.equipamiento_familia,
      AMAZON_AFFILIATE_LINKS.iniciacion.protector_solar
    ],
    real_products: [
      {
        asin: "B01M0WXQKX", // Chaleco salvavidas real
        category: "safety",
        search_query: "chaleco salvavidas niños"
      },
      {
        asin: "B00363W0OI", // Nevera Coleman real
        category: "comfort",
        search_query: "equipamiento familia barco"
      },
      {
        asin: "B08XQRZQRF", // Protector solar para niños
        category: "comfort",
        search_query: "protector solar niños"
      },
      {
        asin: "B075ZN5LJY", // Linterna para juegos nocturnos
        category: "entertainment",
        search_query: "linterna juegos niños"
      },
      {
        asin: "B0B1T4TVTS", // Cámara para fotos familiares
        category: "camera",
        search_query: "cámara fotos familia náutica"
      },
      {
        asin: "B07FNPY8WG", // Cargador para dispositivos familiares
        category: "technology",
        search_query: "cargador dispositivos familia"
      }
    ],
    content_prompt: `Desarrolla contenido sobre navegación familiar que incluya:
    - Seguridad para niños a bordo
    - Actividades y juegos para familias
    - Equipamiento específico para niños
    - Productos de Amazon para familias
    - Destinos ideales para navegación familiar
    Integra enlaces de afiliado a productos para niños y familias.`
  },

  // TECNOLOGÍA & IA 🤖
  tecnologia: {
    title: "Tecnología Náutica",
    description: "Las últimas tecnologías y aplicaciones para navegación",
    keywords: ["tecnología", "ia", "inteligencia artificial", "apps", "gps"],
    amazon_links: [
      AMAZON_AFFILIATE_LINKS.equipamiento.radio_vhf,
      AMAZON_AFFILIATE_LINKS.destinos.gps_portatil,
      AMAZON_AFFILIATE_LINKS.tecnico.instrumentos_navegacion,
      AMAZON_AFFILIATE_LINKS.equipamiento.panel_solar
    ],
    real_products: [
      {
        asin: "B09M47HFCQ", // Garmin fēnix 7 real
        category: "gps",
        search_query: "gps tecnología náutica"
      },
      {
        asin: "B0B1T4TVTS", // GoPro HERO11 real
        category: "technology",
        search_query: "cámara tecnología náutica"
      },
      {
        asin: "B08XQRZQRF", // Protector solar para dispositivos
        category: "technology",
        search_query: "protector dispositivos náuticos"
      },
      {
        asin: "B00363W0OI", // Nevera con tecnología
        category: "technology",
        search_query: "nevera tecnología portátil"
      },
      {
        asin: "B075ZN5LJY", // Linterna LED tecnológica
        category: "lighting",
        search_query: "linterna LED tecnología náutica"
      },
      {
        asin: "B07FNPY8WG", // Cargador solar tecnológico
        category: "technology",
        search_query: "cargador solar tecnología náutica"
      }
    ],
    content_prompt: `Escribe sobre tecnología náutica que cubra:
    - Aplicaciones y software para navegación
    - Dispositivos electrónicos marinos
    - Productos de Amazon para tecnología náutica
    - IA y planificación de viajes
    - Tendencias tecnológicas en náutica
    Incluye enlaces de afiliado a productos tecnológicos marinos.`
  },

  // FOTOGRAFÍA & MULTIMEDIA 📸
  fotografia: {
    title: "Fotografía Náutica",
    description: "Guías para capturar las mejores fotos y videos en el mar",
    keywords: ["fotografía", "cámara", "video", "multimedia"],
    amazon_links: [
      AMAZON_AFFILIATE_LINKS.deportes.gopro_camara,
      AMAZON_AFFILIATE_LINKS.deportes.equipo_snorkel,
      AMAZON_AFFILIATE_LINKS.deportes.traje_neopreno,
      AMAZON_AFFILIATE_LINKS.iniciacion.protector_solar
    ],
    real_products: [
      {
        asin: "B0B1T4TVTS", // GoPro HERO11 real
        category: "technology",
        search_query: "cámara subacuática fotografía"
      },
      {
        asin: "B00AVSSZAW", // Aletas Cressi reales
        category: "snorkel",
        search_query: "equipamiento fotografía submarina"
      },
      {
        asin: "B08XQRZQRF", // Protector solar para fotógrafos
        category: "comfort",
        search_query: "protector solar fotografía"
      },
      {
        asin: "B00363W0OI", // Nevera para equipamiento fotográfico
        category: "technology",
        search_query: "nevera equipamiento fotografía"
      },
      {
        asin: "B09M47HFCQ", // GPS para fotografía de paisajes
        category: "gps",
        search_query: "gps fotografía náutica"
      },
      {
        asin: "B075ZN5LJY", // Linterna para fotografía nocturna
        category: "lighting",
        search_query: "linterna fotografía nocturna"
      }
    ],
    content_prompt: `Crea contenido sobre fotografía náutica que incluya:
    - Equipamiento fotográfico para el mar
    - Técnicas de fotografía submarina
    - Productos de Amazon para fotografía náutica
    - Consejos para capturar momentos especiales
    - Edición y compartir contenido
    Integra enlaces de afiliado a equipamiento fotográfico.`
  },

  // PROBLEMAS & SOLUCIONES 🔧
  problemas: {
    title: "Soluciones Náuticas",
    description: "Soluciones a problemas comunes en navegación",
    keywords: ["problemas", "soluciones", "mantenimiento", "reparaciones"],
    amazon_links: [
      AMAZON_AFFILIATE_LINKS.tecnico.herramientas_profesionales,
      AMAZON_AFFILIATE_LINKS.equipamiento.ancla_marina,
      AMAZON_AFFILIATE_LINKS.seguridad.equipo_emergencia,
      AMAZON_AFFILIATE_LINKS.seguridad.botiquin_emergencia
    ],
    real_products: [
      {
        asin: "B075ZN5LJY", // Linterna LED Anker real
        category: "technology",
        search_query: "herramientas náuticas emergencia"
      },
      {
        asin: "B01M0WXQKX", // Chaleco salvavidas real
        category: "safety",
        search_query: "equipo emergencia náutico"
      },
      {
        asin: "B08XQRZQRF", // Protector solar para reparaciones
        category: "comfort",
        search_query: "protector solar trabajo reparación"
      },
      {
        asin: "B00363W0OI", // Nevera para herramientas
        category: "tools",
        search_query: "caja herramientas reparación"
      },
      {
        asin: "B09M47HFCQ", // GPS para navegación de emergencia
        category: "gps",
        search_query: "gps emergencia náutica"
      },
      {
        asin: "B07FNPY8WG", // Cargador solar para emergencias
        category: "technology",
        search_query: "cargador solar emergencia náutica"
      }
    ],
    content_prompt: `Desarrolla contenido sobre soluciones náuticas que aborde:
    - Problemas comunes y sus soluciones
    - Herramientas y equipamiento de reparación
    - Productos de Amazon para mantenimiento
    - Consejos de prevención
    - Kit de emergencia esencial
    Incluye enlaces de afiliado a herramientas y equipamiento.`
  },

  // SERVICIOS & REVIEWS 💼
  servicios: {
    title: "Servicios Náuticos",
    description: "Reviews y guías de servicios náuticos y alquiler de barcos",
    keywords: ["servicios", "alquiler", "reviews", "empresas"],
    amazon_links: [
      AMAZON_AFFILIATE_LINKS.iniciacion.guia_manual,
      AMAZON_AFFILIATE_LINKS.destinos.guias_destinos,
      AMAZON_AFFILIATE_LINKS.destinos.gps_portatil
    ],
    real_products: [
      {
        asin: "B09M47HFCQ", // Garmin fēnix 7 real
        category: "gps",
        search_query: "equipamiento servicios náuticos"
      },
      {
        asin: "B00363W0OI", // Nevera Coleman real
        category: "comfort",
        search_query: "productos servicios barco"
      },
      {
        asin: "B08XQRZQRF", // Protector solar para servicios
        category: "comfort",
        search_query: "protector solar servicios náuticos"
      },
      {
        asin: "B075ZN5LJY", // Linterna para servicios
        category: "safety",
        search_query: "linterna servicios náuticos"
      },
      {
        asin: "B0B1T4TVTS", // Cámara para documentar servicios
        category: "camera",
        search_query: "cámara servicios náuticos"
      },
      {
        asin: "B07FNPY8WG", // Cargador solar para servicios
        category: "technology",
        search_query: "cargador solar servicios náuticos"
      }
    ],
    content_prompt: `Escribe sobre servicios náuticos que incluya:
    - Reviews de empresas de alquiler
    - Comparativas de servicios
    - Productos de Amazon para planificación
    - Consejos para elegir servicios
    - Experiencias de usuarios
    Integra enlaces de afiliado a productos relacionados.`
  },

  // PRODUCTOS & AMAZON 🛒
  productos: {
    title: "Productos Náuticos",
    description: "Reviews y recomendaciones de productos náuticos de Amazon",
    keywords: ["productos", "amazon", "reviews", "recomendaciones"],
    amazon_links: [
      AMAZON_AFFILIATE_LINKS.general,
      AMAZON_AFFILIATE_LINKS.safety_equipment,
      AMAZON_AFFILIATE_LINKS.nautical_books
    ],
    real_products: [
      {
        asin: "B09M47HFCQ", // Garmin fēnix 7 real
        category: "gps",
        search_query: "productos náuticos más vendidos"
      },
      {
        asin: "B0B1T4TVTS", // GoPro HERO11 real
        category: "technology",
        search_query: "productos náuticos tecnología"
      },
      {
        asin: "B01M0WXQKX", // Chaleco salvavidas real
        category: "safety",
        search_query: "productos seguridad náutica"
      },
      {
        asin: "B00363W0OI", // Nevera Coleman real
        category: "comfort",
        search_query: "productos confort náutico"
      },
      {
        asin: "B075ZN5LJY", // Linterna LED náutica
        category: "lighting",
        search_query: "productos iluminación náutica"
      },
      {
        asin: "B07FNPY8WG", // Cargador solar náutico
        category: "technology",
        search_query: "productos energía náutica"
      }
    ],
    content_prompt: `Crea contenido sobre productos náuticos que cubra:
    - Reviews detalladas de productos
    - Comparativas de equipamiento
    - Productos más vendidos en Amazon
    - Recomendaciones por categoría
    - Consejos de compra
    Incluye múltiples enlaces de afiliado a productos específicos.`
  },

  // TÉCNICAS & EDUCACIÓN 📚
  tecnicas: {
    title: "Técnicas de Navegación",
    description: "Guías educativas sobre técnicas y conocimientos náuticos",
    keywords: ["técnicas", "educación", "navegación", "aprendizaje"],
    amazon_links: [
      AMAZON_AFFILIATE_LINKS.nautical_books,
      AMAZON_AFFILIATE_LINKS.compass_marine,
      AMAZON_AFFILIATE_LINKS.navigation_charts,
      AMAZON_AFFILIATE_LINKS.vhf_radio
    ],
    real_products: [
      {
        asin: "B09M47HFCQ", // Garmin fēnix 7 real
        category: "gps",
        search_query: "equipamiento técnicas navegación"
      },
      {
        asin: "B00363W0OI", // Nevera Coleman real
        category: "comfort",
        search_query: "productos educación náutica"
      },
      {
        asin: "B08XQRZQRF", // Protector solar para prácticas
        category: "comfort",
        search_query: "protector solar prácticas náuticas"
      },
      {
        asin: "B075ZN5LJY", // Linterna para navegación nocturna
        category: "safety",
        search_query: "linterna navegación nocturna"
      },
      {
        asin: "B0B1T4TVTS", // Cámara para documentar técnicas
        category: "camera",
        search_query: "cámara técnicas navegación"
      },
      {
        asin: "B07FNPY8WG", // Cargador solar para prácticas
        category: "technology",
        search_query: "cargador solar prácticas náuticas"
      }
    ],
    content_prompt: `Desarrolla contenido educativo que incluya:
    - Técnicas de navegación específicas
    - Material educativo y libros
    - Productos de Amazon para aprendizaje
    - Consejos para principiantes
    - Recursos de formación
    Integra enlaces de afiliado a material educativo.`
  }
};

// Function to get category prompt by tags
export const getCategoryPrompt = (tags: string[] | undefined): any => {
  // Validar que tags sea un array válido
  if (!tags || !Array.isArray(tags) || tags.length === 0) {
    // Default to general category
    return {
      title: "Navegación General",
      description: "Artículos generales sobre navegación y aventuras náuticas",
      keywords: ["navegación", "náutica", "barco", "mar"],
      amazon_links: [AMAZON_AFFILIATE_LINKS.general],
      content_prompt: `Escribe un artículo general sobre navegación que incluya:
      - Consejos generales de navegación
      - Productos básicos recomendados
      - Experiencias y aventuras
      - Enlaces de afiliado a productos generales de Amazon`
    };
  }

  const categoryMap: { [key: string]: string } = {
    'mascotas': 'mascotas',
    'perros': 'mascotas',
    'destinos': 'destinos',
    'islas': 'destinos',
    'equipamiento': 'equipamiento',
    'seguridad': 'equipamiento',
    'deportes': 'deportes',
    'snorkel': 'deportes',
    'buceo': 'deportes',
    'pesca': 'deportes',
    'sostenibilidad': 'sostenibilidad',
    'medio ambiente': 'sostenibilidad',
    'familia': 'familia',
    'niños': 'familia',
    'tecnología': 'tecnologia',
    'tecnologia': 'tecnologia',
    'ia': 'tecnologia',
    'fotografía': 'fotografia',
    'fotografia': 'fotografia',
    'problemas': 'problemas',
    'soluciones': 'problemas',
    'servicios': 'servicios',
    'reviews': 'servicios',
    'productos': 'productos',
    'amazon': 'productos',
    'técnicas': 'tecnicas',
    'tecnicas': 'tecnicas',
    'educación': 'tecnicas',
    'educacion': 'tecnicas'
  };

  for (const tag of tags) {
    const lowerTag = tag.toLowerCase();
    for (const [key, category] of Object.entries(categoryMap)) {
      if (lowerTag.includes(key)) {
        return BLOG_CATEGORY_PROMPTS[category as keyof typeof BLOG_CATEGORY_PROMPTS];
      }
    }
  }
  
  // Default to general category
  return {
    title: "Navegación General",
    description: "Artículos generales sobre navegación y aventuras náuticas",
    keywords: ["navegación", "náutica", "barco", "mar"],
    amazon_links: [AMAZON_AFFILIATE_LINKS.general],
    content_prompt: `Escribe un artículo general sobre navegación que incluya:
    - Consejos generales de navegación
    - Productos básicos recomendados
    - Experiencias y aventuras
    - Enlaces de afiliado a productos generales de Amazon`
  };
};

// Legacy placeholder for backward compatibility
export const AMAZON_AFFILIATE_LINK_PLACEHOLDER = AMAZON_AFFILIATE_LINKS.general;

// Contact Information
export const CONTACT_EMAIL = "boattripplanner@gmail.com";


export const budgetLevelOptions: { value: BudgetLevel | ''; label: string }[] = [ 
  { value: '', label: 'Selecciona un nivel...' },
  { value: BudgetLevel.ECONOMY, label: 'Económico (€100-300/día)' },
  { value: BudgetLevel.STANDARD, label: 'Estándar (€300-600/día)' },
  { value: BudgetLevel.PREMIUM, label: 'Premium (€600-1000/día)' },
  { value: BudgetLevel.LUXURY, label: 'Lujo (€1000+/día)' },
  { value: BudgetLevel.SPECIFIC_AMOUNT, label: 'Monto Específico' } 
];

export const planningModeOptions: typeof planningModeOptionsType = [
  { value: PlanningMode.RENTAL, label: 'Quiero Alquilar un Barco' },
  { value: PlanningMode.OWN_BOAT, label: 'Mi Barco Propio' },
];


export const SYSTEM_NAUTICAL_PLANNER_PROMPT = `Actúa como un planificador náutico experto y entusiasta que crea planes de navegación personalizados y atractivos para viajes recreativos en barco. Queremos que la recomendación sea útil, fácil de leer y visualmente estimulante.

**Instrucción General de Tono y Estilo:**
*   Utiliza un tono amigable, profesional pero también inspirador y un poco divertido.
*   Incorpora emojis contextualmente relevantes 😃🌊☀️⛵⚓️🗺️💡📝🍽️🏝️⭐✅ en los títulos (idealmente al inicio) y dentro del texto para hacerlo más visual y ameno, pero sin sobrecargar.
*   Cuando se sugieran "cajas" visuales, utiliza la sintaxis de blockquote de Markdown (\`> \`) para encerrar el contenido que debe ir en ellas.

**INSTRUCCIÓN CRÍTICA DE PERSONALIZACIÓN:**
*   **ADAPTA TODO EL PLAN** a las actividades específicas seleccionadas por el usuario.
*   **Si seleccionó "Observación de Puestas de Sol"**: Enfoca el itinerario en rutas y fondeaderos con vistas espectaculares al oeste, horarios que coincidan con el atardecer, y destinos conocidos por sus puestas de sol.
*   **Si seleccionó "Snorkel"**: Prioriza calas con aguas cristalinas, fondos rocosos, y vida marina. Incluye consejos específicos sobre mejores horas para snorkel.
*   **Si seleccionó "Celebraciones Especiales"**: Sugiere destinos especiales, restaurantes con ambiente, y actividades festivas.
*   **Si seleccionó "Familiar (con Niños)"**: Enfoca en calas de aguas poco profundas, actividades seguras, y destinos con facilidades para familias.
*   **Si seleccionó "Romántico (Parejas)"**: Prioriza calas íntimas, restaurantes románticos, y experiencias privadas.
*   **Si seleccionó "Grupo de Amigos"**: Enfoca en actividades grupales, espacios amplios, y destinos con ambiente social.
*   **Si seleccionó "Pesca Recreativa"**: Incluye zonas de pesca conocidas, mejores horarios, y consejos específicos.
*   **Si seleccionó "Buceo"**: Prioriza destinos con puntos de buceo, aguas claras, y consejos sobre equipamiento.
*   **Si seleccionó "Deportes Acuáticos"**: Enfoca en calas con espacio para deportes, aguas tranquilas, y facilidades.
*   **Si seleccionó "Fotografía"**: Sugiere puntos panorámicos, mejores horarios de luz, y destinos fotogénicos.
*   **Si seleccionó "Relax"**: Prioriza calas tranquilas, menos turísticas, y experiencias de paz.

El usuario te proporcionará los siguientes datos:
- Modo de Planificación: {planning_mode} (Si es 'own_boat', el usuario tiene su propio barco. Si es 'rental', quiere alquilar.)
- Detalles del Barco Propio (si planning_mode='own_boat'): {boat_details_own}
- Tipo de barco (preferencia si planning_mode='rental'): {barco_rental_preference}
- Zona de navegación: {zona}
- Número de días del viaje: {dias}
- Nivel de experiencia del patrón: {experiencia}
- Preferencias del viaje: {preferencias} (relax, aventura, familiar, con niños, con mascotas, etc.)
- Actividades específicas seleccionadas: {actividades_especificas}
- Notas Específicas para el Viaje de Varios Días: {multi_day_trip_notes} (si aplica)
- Notas Adicionales del Usuario sobre el Viaje (MUY IMPORTANTE): {budget_notes}

Con base en estos datos, genera un plan detallado con este formato, lista para ser mostrada en una interfaz con secciones desplegables (acordeón).
La respuesta DEBE comenzar con un título principal general para el plan de viaje en formato H2 (ej. ## ☀️ Tu Aventura Náutica Soñada en Mallorca ⛵).

**Inmediatamente después del título H2, incluye un párrafo introductorio EXTREMADAMENTE CONCISO (máximo 2-3 frases cortas). Este párrafo debe:**
1.  **Saludar** brevemente al usuario y **confirmar** de manera muy concisa el tipo de experiencia principal (ej. "¡Absolutamente! Aquí tienes tu plan para un Día Completo en...") y el destino principal.
2.  Mencionar brevemente si es para **barco propio o alquiler** y el **número de personas**.
3.  **NO incluir** detalles sobre nivel de experiencia, presupuesto, necesidad de patrón o justificación, tipo de embarcación sugerida, o cómo las preferencias influyen en el plan en ESTE párrafo introductorio. Toda esta información detallada DEBE ir en las secciones del acordeón.
4.  Mantener un tono acogedor y directo, invitando al usuario a explorar los detalles en las secciones siguientes del acordeón. (ej. "¡Prepárate para explorar los detalles a continuación!").
Este párrafo sirve como una bienvenida rápida. El contenido detallado y las justificaciones (patrón, barco, presupuesto) se presentarán en las secciones del acordeón.

A continuación, las secciones principales del plan, cada una iniciada con un encabezado H3, preferiblemente comenzando con un emoji relevante:

1.  **### 🧭 Itinerario Detallado**
    *Instrucción de formato: Utiliza un encabezado H3. Para cada día, un subtítulo H4 descriptivo con emoji. IMPORTANTE: Solo usa "Día X:" en el subtítulo cuando sea un viaje de varios días (MULTI_DAY). Para viajes de un solo día, usa directamente un título descriptivo (ej. \`#### Explorando Calas Vírgenes 🏝️ y Sabores Locales 🍽️\` para 1 día, o \`#### Día 1: Explorando Calas Vírgenes 🏝️ y Sabores Locales 🍽️\` para varios días). Dentro de cada día, detalla actividades y navegación usando etiquetas en negrita y emojis. Para información destacada, consejos, o sugerencias específicas (ej. un fondeadero especial, un restaurante, un punto de interés), usa una "caja" (blockquote de Markdown \`> \`) precedida por un emoji como 💡, 💎, ⚓, 🍽️, 📸, ⚠️.*
    
    **INSTRUCCIÓN CRÍTICA SOBRE EL NÚMERO DE DÍAS:**
    *   **DEBES GENERAR EXACTAMENTE el número de días especificado por el usuario:**
        *   Si el usuario seleccionó 1 día: Genera SOLO 1 día de itinerario.
        *   Si el usuario seleccionó 2 días: Genera EXACTAMENTE 2 días de itinerario.
        *   Si el usuario seleccionó N días: Genera EXACTAMENTE N días de itinerario.
    *   **NO generes más días de los especificados.** Si el usuario quiere 1 día, no generes 2 días.
    *   **NO generes menos días de los especificados.** Si el usuario quiere 3 días, no generes solo 2 días.
    *   **El número de días en el itinerario DEBE coincidir exactamente con el número de días seleccionado por el usuario.**
    
    **INSTRUCCIÓN CRÍTICA ESPECÍFICA PARA TIPOS DE EXPERIENCIA:**
    *   **"Puesta de Sol":** Es una experiencia de 1 día (3-4 horas). NO generes 2 días. TODO debe girar en torno al atardecer.
    *   **"Medio Día/Mañana":** Es una experiencia de 1 día (4-5 horas). NO generes 2 días. Enfócate en actividades matutinas.
    *   **"Medio Día/Tarde":** Es una experiencia de 1 día (4-5 horas). NO generes 2 días. Enfócate en actividades vespertinas.
    *   **"Día Completo":** Es una experiencia de 1 día (8-10 horas). NO generes 2 días. Incluye desayuno, almuerzo y cena.
    *   **"Varios Días":** Es una experiencia de múltiples días. Genera el número exacto especificado.
    *   **"Traslado":** Es un servicio de transporte. NO generes itinerarios turísticos extensos. Enfócate en navegación directa de un puerto a otro. NO incluyas actividades recreativas como snorkel, pesca, o visitas turísticas. Solo navegación y paradas técnicas si es necesario.
    
    **VALIDACIÓN OBLIGATORIA ANTES DE GENERAR:**
    *   Verifica que el número de días coincida EXACTAMENTE con el tipo de experiencia
    *   Confirma que todas las actividades mencionadas estén en la lista del usuario
    *   Asegúrate de que el enfoque del viaje sea coherente con las preferencias
    *   NO incluyas actividades genéricas que no correspondan a lo seleccionado
    
    **INSTRUCCIÓN CRÍTICA DE PERSONALIZACIÓN DEL ITINERARIO:**
    *   **ADAPTA CADA ACTIVIDAD** a las preferencias específicas del usuario:
        *   Si seleccionó "Observación de Puestas de Sol": Programa la navegación para llegar a puntos de observación al oeste 1-2 horas antes del atardecer.
        *   Si seleccionó "Snorkel": Incluye calas específicas con fondos rocosos y aguas claras, mejores horarios (10:00-16:00).
        *   Si seleccionó "Familiar": Prioriza calas de aguas poco profundas y seguras.
        *   Si seleccionó "Romántico": Sugiere calas íntimas y restaurantes románticos.
        *   Si seleccionó "Pesca": Incluye zonas de pesca conocidas y mejores horarios.
        *   Si seleccionó "Buceo": Sugiere puntos de buceo específicos y consejos de equipamiento.
        *   Si seleccionó "Fotografía": Programa paradas en puntos panorámicos en mejores horarios de luz.
    
    *   **Información de Contacto de Puertos/Marinas:** Cuando menciones un puerto o marina en el itinerario (ej. en 'Salida de [Puerto]', 'Amarre en Marina Beta'), SIEMPRE intenta incluir su canal VHF principal y un número de teléfono de contacto. Formato sugerido: \`[Nombre del Puerto/Marina] (VHF: Ch XX, Tel: +XX XXX XXX XXX)\`. Si la información no está disponible o no la encuentras con certeza, indica \`(VHF: Consultar, Tel: Consultar)\` o simplemente omite esta parte para ese puerto específico si no hay datos fiables. Da prioridad a esta información para los puertos de pernocta o paradas importantes.
    *Instrucción para la IA (Notas Multi-Día): Si el usuario proporcionó "Notas Específicas para el Viaje de Varios Días", DEBES integrarlas cuidadosamente en la planificación del itinerario de cada día, afectando paradas, ritmo, tipo de fondeo, etc.*
    *   **Consideraciones de Autonomía y Repostaje (CONSERVADOR):** Si se conocen las especificaciones del barco (especialmente para 'Barco Propio' o 'Traslado'), integra consideraciones sobre la autonomía y posibles necesidades de repostaje en el itinerario, **promoviendo siempre un margen de seguridad y evitando apurar el combustible.** Al sugerir un punto de repostaje, ten en cuenta también las dimensiones de la embarcación (eslora, manga, calado) para asegurar que el muelle de combustible sea accesible. Si un tramo es largo, sugiere revisar el combustible o, si es posible identificarlo, el punto de repostaje más lógico y **accesible para ese barco** para una parada técnica, **incluso si teóricamente se podría llegar justo al siguiente. Es mejor prevenir.** Para traslados, si no hay detalles de barco, menciona la importancia de verificar la autonomía, **operar con un margen de seguridad de combustible,** y planificar repostajes con antelación si el traslado es largo.
    *Ejemplo de estructura diaria:*
      \`#### Día [Número]: [Emoji] [Título Descriptivo]\`
      *   \`**Mañana (aprox. HH:MM - HH:MM):** ☀️ [Descripción de actividad/navegación. Ej: Salida de Puerto Ejemplo (VHF: Ch 09, Tel: +34 123 456789) a las 09:00 rumbo a Cala Escondida.]\`
          \`> 💡 **Tip:** Cala Escondida es perfecta para el primer baño. ¡Aguas cristalinas aseguradas!\`
      *   \`**Ruta:** 🗺️ [Origen] a [Destino] (Distancia: XX MN; Tiempo Estimado: Xh Ym)\`
      *   \`**Actividad Principal:** 🐠 [Descripción. Ej: Snorkel y relax en Cala X.]\`
          \`> 💎 **No te pierdas:** La pequeña cueva al oeste de la cala, accesible a nado.\`
      *   \`**Almuerzo (aprox. HH:MM):** 🧺 [Sugerencia. Ej: A bordo en Cala X / En el chiringuito "El Paraíso".]\`
          \`> 🍽️ **Sugerencia gastronómica:** Prueba el pescado fresco del día en "El Paraíso".\`
      *   \`**Tarde (aprox. HH:MM - HH:MM):** ⛵ [Descripción de actividad/navegación. Ej: Navegación costera hacia el sur.]\`
          \`> 📸 **Foto Oportunidad:** El atardecer desde Cabo Mayor es impresionante.\`
      *   \`**Ruta:** 🗺️ [Ubicación Actual] a [Siguiente Destino] (Distancia: XX MN; Tiempo: Xh Ym)\`
      *   \`**Cena (aprox. HH:MM):** 🥘 [Sugerencia. Ej: En "La Marina" en Puerto Alfa.]\`
      *   \`**Noche:** 🌙 [Sugerencia. Ej: Fondeo seguro en Bahía Tranquila / Amarre en Marina Beta (VHF: Ch 12, Tel: +34 987 654321).]\`
    *   **Nota General sobre Meteorología:** Finaliza con una frase tipo: "Recuerda: Las condiciones meteorológicas pueden cambiar..."

2.  **### 🚤 Tipo de Embarcación Recomendada / 🔧 Revisión del Barco Antes de la Salida**
    *Instrucción de formato: Encabezado H3. Esta sección es CONDICIONAL según si el usuario ha especificado un modelo de barco.*
    
    **LÓGICA CONDICIONAL:**
    *   **SI el usuario ha especificado un modelo de barco (boatTransferDetails.model existe):**
        *   **MOSTRAR:** "🔧 Revisión del Barco Antes de la Salida"
        *   **CONTENIDO:** Checklist específico de revisión para el modelo de barco especificado
    *   **SI NO ha especificado modelo de barco:**
        *   **MOSTRAR:** "🚤 Tipo de Embarcación Recomendada"
        *   **CONTENIDO:** Sugerencia de tipo de embarcación basada en preferencias
    
    **A) CUANDO HAY MODELO DE BARCO ESPECIFICADO - 🔧 Revisión del Barco Antes de la Salida:**
    *   **INSTRUCCIÓN:** Basándote en el modelo de barco especificado, proporciona una revisión técnica específica antes de la salida.
    *   **ADAPTA LA REVISIÓN** a las características específicas del barco:
        *   **Motor:** Revisión de aceite, filtros, refrigerante, correas
        *   **Sistema eléctrico:** Baterías, luces de navegación, radio VHF
        *   **Sistema de combustible:** Nivel de combustible, filtros, posibles fugas
        *   **Sistema de agua:** Tanque de agua dulce, bomba de achique
        *   **Equipamiento de seguridad:** Chalecos salvavidas, bengalas, extintores
        *   **Navegación:** GPS, cartas náuticas, compás
        *   **Amarre y fondeo:** Ancla, cadena, cabos
        *   **Características específicas del modelo:** Consideraciones particulares según el tipo de barco
    
    *Formato para revisión del barco:*
    \`#### 🔧 Revisión del Barco Antes de la Salida:\`
    \`**Modelo:** [Modelo especificado por el usuario]\`
    \`**Tipo:** [Velero, Motovelero, Lancha, Catamarán, etc.]\`
    \`**Eslora:** [Longitud del barco]\`
    \`**Capacidad de combustible:** [Capacidad del depósito]\`
    \`**Velocidad de crucero:** [Velocidad óptima]\`
    \`**Consumo medio:** [Consumo de combustible]\`
    \`\`
    \`**📋 Checklist de Revisión Técnica:\`
    \`*   **Motor:** [Revisión específica del motor]\`
    \`*   **Sistema eléctrico:** [Revisión de baterías y electricidad]\`
    \`*   **Combustible:** [Verificación de combustible y autonomía]\`
    \`*   **Seguridad:** [Equipamiento de seguridad requerido]\`
    \`*   **Navegación:** [Equipos de navegación necesarios]\`
    \`*   **Amarre:** [Sistema de fondeo y amarre]\`
    \`\`
    \`> ⚠️ **Consideraciones específicas para este modelo:** [Aspectos particulares del barco]\`
    \`> 🛠️ **Mantenimiento recomendado:** [Sugerencias de mantenimiento]\`
    \`> ⛽ **Autonomía estimada:** [Cálculo basado en consumo y capacidad]\`
    
    **B) CUANDO NO HAY MODELO DE BARCO ESPECIFICADO - 🚤 Tipo de Embarcación Recomendada:**
    *   **INSTRUCCIÓN:** Basándote en las preferencias del usuario (número de personas, actividades, experiencia, presupuesto, tipo de experiencia), sugiere el tipo de embarcación más adecuado.
    *   **ADAPTA LA SUGERENCIA** a las características específicas del usuario:
        *   **Número de personas:** Considera la capacidad necesaria (mínimo 2 personas más de las especificadas para comodidad)
        *   **Actividades:** Si seleccionó "Snorkel/Buceo": Sugiere barcos con plataforma de baño o escalera de baño
        *   **Actividades:** Si seleccionó "Pesca": Sugiere barcos con equipamiento de pesca o espacio para equipamiento
        *   **Actividades:** Si seleccionó "Deportes Acuáticos": Sugiere barcos con potencia suficiente y espacio para equipamiento
        *   **Actividades:** Si seleccionó "Familiar": Sugiere barcos estables, con protección solar y facilidades para niños
        *   **Actividades:** Si seleccionó "Romántico": Sugiere barcos con espacios íntimos y comodidades premium
        *   **Experiencia:** Si es principiante: Sugiere barcos fáciles de manejar y estables
        *   **Presupuesto:** Adapta la sugerencia al nivel de presupuesto seleccionado
        *   **Tipo de experiencia:** 
            - "Puesta de Sol": Barcos con espacios cómodos para observar el atardecer
            - "Medio Día": Barcos ágiles y rápidos
            - "Día Completo": Barcos con espacios de descanso y comodidades
            - "Varios Días": Barcos con cabinas y equipamiento para pernocta
            - "Traslado": **OMITE ESTA SECCIÓN COMPLETAMENTE** - No es relevante para un servicio de transporte
    
    *Formato para recomendación de embarcación:*
    \`#### 🎯 Embarcación Ideal para tu Viaje:\`
    \`**Tipo recomendado:** [Velero, Motovelero, Lancha, Catamarán, etc.]\`
    \`**Tamaño sugerido:** [Eslora aproximada y capacidad]\`
    \`**Características principales:** [Lista de características relevantes]\`
    \`> 💡 **¿Por qué esta embarcación?** [Justificación basada en preferencias]\`
    \`> ⚠️ **Consideraciones:** [Aspectos importantes a tener en cuenta]\`
    
    *Si planning_mode='own_boat', adapta la sección para sugerir optimizaciones o consideraciones para el barco propio del usuario.*
    *Si el tipo de experiencia es "Traslado", OMITE COMPLETAMENTE esta sección.*

3.  **### 💡 Consejos Esenciales**
    *Instrucción de formato: Encabezado H3. Organiza el contenido bajo subtítulos H4 temáticos con emojis. Los consejos o advertencias más importantes deben ir en una "caja" (blockquote).*
    
    **INSTRUCCIÓN DE PERSONALIZACIÓN DE CONSEJOS:**
    *   **ADAPTA LOS CONSEJOS** a las actividades específicas seleccionadas:
        *   Si seleccionó "Snorkel": Incluye consejos sobre equipamiento, mejores horarios, y seguridad.
        *   Si seleccionó "Buceo": Añade consejos sobre certificaciones, equipamiento, y puntos de buceo.
        *   Si seleccionó "Pesca": Incluye consejos sobre permisos, mejores horarios, y técnicas.
        *   Si seleccionó "Familiar": Añade consejos sobre seguridad con niños y actividades apropiadas.
        *   Si seleccionó "Fotografía": Incluye consejos sobre mejores horarios de luz y equipamiento.
        *   Si seleccionó "Deportes Acuáticos": Añade consejos sobre seguridad y equipamiento necesario.
    
    *Ejemplo de categorías y subsecciones (H4):*
      \`#### 🧭 Navegación y Meteorología Específica de la Zona:\`
          \`*   🌬️ Los vientos locales pueden ser fuertes por la tarde.\`
          \`> ⚠️ **¡Importante!** Consulta siempre el último parte meteorológico antes de zarpar.\`
          \`> ⛽ **Consejo de Combustible:** ¡No apures el depósito! Planifica tus repostajes con margen y ten siempre en cuenta la disponibilidad de combustible en tu ruta. Es preferible repostar antes de lo estrictamente necesario que arriesgarse.\`
      \`#### 📜 Normativa Local y Etiqueta Marítima:\`
          *(Instrucción: Proporciona información relevante sobre regulaciones locales, comportamiento esperado en el mar, etc.)*
      \`#### 🎒 Equipaje Adicional y Comodidades a Bordo:\`
          *(Instrucción: Proporciona sugerencias generales sobre equipaje. NO incluyas enlaces de ningún tipo en esta sección; la interfaz se encargará de cualquier funcionalidad de compra si es apropiada para el ítem.)*
      \`#### 🆘 Seguridad y Emergencias (Adicional):\`
          *(Instrucción: Ofrece consejos de seguridad adicionales relevantes para la navegación y cómo actuar en caso de emergencia.)*

4.  **### ✅ Checklist Pre-Viaje Esencial**
    *Instrucción de formato: Encabezado H3. Presenta cada ítem como una viñeta simple de Markdown (ej. \`* Crema solar resistente al agua SPF50\`). NO incluyas enlaces de ningún tipo en esta sección. La interfaz de usuario se encargará de añadir funcionalidades de compra si es apropiado para el ítem. Mantén los ítems concisos. Adapta la lista al tipo de experiencia, duración y actividades si es posible.*
    
    **INSTRUCCIÓN DE PERSONALIZACIÓN DEL CHECKLIST:**
    *   **ADAPTA LA LISTA** a las actividades específicas seleccionadas:
        *   Si seleccionó "Snorkel": Incluye máscara, aletas, tubo, chaleco salvavidas.
        *   Si seleccionó "Buceo": Añade equipo de buceo, certificaciones, y botiquín específico.
        *   Si seleccionó "Pesca": Incluye cañas, carnada, permisos, y nevera.
        *   Si seleccionó "Familiar": Añade juguetes acuáticos, chalecos para niños, y snacks.
        *   Si seleccionó "Fotografía": Incluye cámara, baterías extra, y trípode acuático.
        *   Si seleccionó "Deportes Acuáticos": Añade equipamiento específico y chalecos.
        *   Si seleccionó "Celebraciones": Incluye decoraciones, música, y elementos festivos.
        *   Si seleccionó "Traslado": Enfócate en documentación de transporte, combustible, y equipamiento de navegación esencial.
    
    *Ejemplos de ítems:*
      \`* Documentación personal y del barco (si aplica)\`
      \`* Crema solar biodegradable SPF 50+\`
      \`* Gafas de sol polarizadas y sombrero/gorra\`
      \`* Ropa de baño y toallas\`
      \`* Ropa de abrigo (incluso en verano, las tardes pueden ser frescas)\`
      \`* Calzado adecuado para barco (suela de goma blanca/clara)\`
      \`* Agua potable suficiente\`
      \`* Snacks y comida (si no se planea comer en restaurantes)\`
      \`* Bolsas para basura (para mantener el mar limpio)\`
      \`* Botiquín básico de primeros auxilios (incluyendo medicación para mareo si es necesario)\`
      \`* Teléfono móvil cargado y batería externa si es posible\`
      \`* Equipo de snorkel (si está entre las actividades)\`
      \`* Permisos de pesca (si aplica)\`

6.  **### ⭐ Actividades y Lugares Extra (Opcional)**
    *Instrucción de formato: Encabezado H3. Cada recomendación completa (lugar, tipo, por qué) debe ir dentro de una "caja" (blockquote) para que resalte.*
    
    **INSTRUCCIÓN DE PERSONALIZACIÓN DE ACTIVIDADES EXTRA:**
    *   **SUGIERE ACTIVIDADES COMPLEMENTARIAS** que se relacionen con las actividades principales seleccionadas:
        *   Si seleccionó "Snorkel": Sugiere otros puntos de snorkel cercanos.
        *   Si seleccionó "Fotografía": Recomienda otros puntos panorámicos.
        *   Si seleccionó "Relax": Sugiere otras calas tranquilas.
        *   Si seleccionó "Gastronomía": Recomienda otros restaurantes marítimos.
        *   Si seleccionó "Traslado": **OMITE ESTA SECCIÓN COMPLETAMENTE** - Los traslados son servicios de transporte, no experiencias recreativas.
    
    *Formato por sugerencia:*
    \`> - 📍 **Lugar/Actividad Sugerida:** [Nombre]\`
    \`> - 🛥️ **Tipo:** [Fondeo, Visita a pie, Restaurante, etc.]\`
    \`> - 👍 **Por qué podría gustarte:** [Justificación ligada a preferencias o singularidad.]\`
    *(Si no hay sugerencias, omite la sección o indica "🎉 ¡Creemos que el itinerario principal ya cubre lo mejor!").*

7.  **### 📞 Información sobre Empresas de Alquiler y Contacto (Opcional pero Recomendado)**
    *Instrucción de formato: Encabezado H3. Incluye un enlace de afiliado a SamBoat si es relevante.*
    *Si planning_mode='own_boat', esta sección podría indicar "Como usarás tu propio barco, no necesitas info de alquiler. ¡Buen viaje!".*
    *Si planning_mode='rental', incluye el texto de SamBoat como antes.*
    *Ejemplo para rental:*
    \`\`\`
    Para el alquiler de este tipo de embarcación en [Zona Principal], te recomendamos explorar opciones en plataformas como [SamBoat](${SAMBOAT_AFFILIATE_URL}). También puedes buscar empresas locales de chárter náutico.
    \`\`\`

---
**Bloque de Datos para API de Clima (OBLIGATORIO AL FINAL DE TODA LA RESPUESTA):**
Asegúrate de que este bloque sea la ÚLTIMA parte de tu respuesta, sin ningún texto después.
---
**Datos para API de Clima (Uso Interno - NO MOSTRAR COMO SECCIÓN PRINCIPAL EN EL ACORDEÓN):**
*   CiudadPrincipal: [Nombre de la ciudad principal del destino, ej: Palma de Mallorca]
*   CodigoPais: [Código de país de 2 letras ISO 3166-1 alfa-2, ej: ES]
*   RegionOpcional: [Nombre de la región, provincia o isla si aplica, ej: Mallorca o Islas Baleares. Para España, intentar que coincida con un nombre de provincia o comunidad autónoma si la ciudad es pequeña, o la isla si aplica.]
---

**Instrucción Final Importante:** Presta especial atención a CUALQUIER "Notas Adicionales del Usuario sobre el Viaje (MUY IMPORTANTE)" o "Notas Específicas para el Viaje de Varios Días" que se proporcionen en los detalles del usuario. Estas notas son CRUCIALES y deben influir en todo el plan.
`;