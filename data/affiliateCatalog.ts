// data/affiliateCatalog.ts
// Catálogo curado de productos con enlaces de afiliado DIRECTOS (producto real)

import { AMAZON_AFFILIATE_TAG } from '../constants';

export interface AffiliateProduct {
  id: string;
  title: string;
  category: string; // e.g., 'seguridad', 'equipamiento', 'sostenibilidad'
  keywords: string[]; // palabras clave que harán match desde textos del checklist/blog
  affiliateUrl: string; // URL directa con afiliación ya incluida
  asin?: string; // ASIN del producto para tracking
  price?: string; // Precio aproximado para referencia
}

// Catálogo curado con URLs directas de Amazon con afiliación incluida
export const AFFILIATE_CATALOG: AffiliateProduct[] = [
  // 🦺 SEGURIDAD BÁSICA
  {
    id: 'chaleco-salvavidas-150n',
    title: 'Chaleco Salvavidas Homologado CE 150N',
    category: 'seguridad',
    keywords: ['chaleco', 'salvavidas', 'seguridad', 'chaleco salvavidas', 'salvavidas nautico', 'life jacket', 'chaleco salvavidas homologado'],
    affiliateUrl: `https://www.amazon.es/s?k=chaleco+salvavidas+nautico+homologado+150N&i=sporting&tag=${AMAZON_AFFILIATE_TAG}&ref=as_li_ss_tl&linkCode=ur2&linkId=chaleco_nautico&camp=3638&creative=24630`,
    asin: 'B08C7KG5LP',
    price: '€45-65'
  },
  {
    id: 'chaleco-salvavidas-ninos',
    title: 'Chaleco Salvavidas para Niños (50N)',
    category: 'seguridad',
    keywords: ['chaleco niños', 'chaleco infantil', 'salvavidas niños', 'chaleco salvavidas niños'],
    affiliateUrl: `https://www.amazon.es/s?k=chaleco+salvavidas+niños+50N+homologado&i=sporting&tag=${AMAZON_AFFILIATE_TAG}&ref=as_li_ss_tl&linkCode=ur2&linkId=chaleco_ninos&camp=3638&creative=24630`,
    price: '€25-40'
  },
  {
    id: 'linterna-led-emergencia',
    title: 'Linterna LED Táctica Impermeable',
    category: 'seguridad',
    keywords: ['linterna', 'emergencia', 'impermeable', 'torch', 'linterna led', 'linterna táctica'],
    affiliateUrl: `https://www.amazon.es/s?k=linterna+LED+tactica+impermeable+nautica&i=sporting&tag=${AMAZON_AFFILIATE_TAG}&ref=as_li_ss_tl&linkCode=ur2&linkId=linterna_nautica&camp=3638&creative=24630`,
    asin: 'B075ZN5LJY',
    price: '€20-35'
  },
  {
    id: 'radio-vhf-nautico',
    title: 'Radio VHF Náutico Portátil',
    category: 'seguridad',
    keywords: ['radio', 'vhf', 'comunicacion', 'radio nautico', 'vhf portatil', 'radio vhf'],
    affiliateUrl: `https://www.amazon.es/s?k=radio+VHF+nautico+portatil+homologada&i=electronics&tag=${AMAZON_AFFILIATE_TAG}&ref=as_li_ss_tl&linkCode=ur2&linkId=radio_vhf&camp=3638&creative=24630`,
    price: '€80-150'
  },
  {
    id: 'bengalas-emergencia-nauticas',
    title: 'Bengalas de Emergencia Náuticas',
    category: 'seguridad',
    keywords: ['bengalas', 'emergencia', 'señales', 'pirotecnia', 'seguridad maritima', 'señales emergencia'],
    affiliateUrl: `https://www.amazon.es/s?k=bengalas+emergencia+nauticas+maritimas+homologadas&i=sporting&tag=${AMAZON_AFFILIATE_TAG}&ref=as_li_ss_tl&linkCode=ur2&linkId=bengalas_nauticas&camp=3638&creative=24630`,
    price: '€15-30'
  },
  {
    id: 'botiquin-nautico',
    title: 'Botiquín Primeros Auxilios Náutico',
    category: 'seguridad',
    keywords: ['botiquín', 'primeros auxilios', 'emergencia', 'mareo', 'botiquin nautico'],
    affiliateUrl: `https://www.amazon.es/s?k=botiquin+primeros+auxilios+nautico+completo&tag=${AMAZON_AFFILIATE_TAG}&ref=as_li_ss_tl&linkCode=ur2&linkId=botiquin_nautico&camp=3638&creative=24630`,
    price: '€25-50'
  },

  // 🏖️ PROTECCIÓN SOLAR
  {
    id: 'protector-solar-spf50',
    title: 'Protector Solar Resistente al Agua SPF50+',
    category: 'sostenibilidad',
    keywords: ['protector solar', 'crema solar', 'spf', 'solar', 'biodegradable', 'protector agua', 'spf 50'],
    affiliateUrl: `https://www.amazon.es/s?k=protector+solar+resistente+agua+SPF50+biodegradable&i=beauty&tag=${AMAZON_AFFILIATE_TAG}&ref=as_li_ss_tl&linkCode=ur2&linkId=protector_solar&camp=3638&creative=24630`,
    asin: 'B0B3QJ8K1M',
    price: '€15-25'
  },
  {
    id: 'gafas-polarizadas-nauticas',
    title: 'Gafas de Sol Polarizadas Náuticas',
    category: 'equipamiento',
    keywords: ['gafas de sol', 'polarizadas', 'protección', 'gafas nauticas', 'gafas polarizadas'],
    affiliateUrl: `https://www.amazon.es/s?k=gafas+sol+polarizadas+nauticas+resistente+agua&i=sporting&tag=${AMAZON_AFFILIATE_TAG}&ref=as_li_ss_tl&linkCode=ur2&linkId=gafas_nauticas&camp=3638&creative=24630`,
    price: '€30-80'
  },
  {
    id: 'gorra-nautica',
    title: 'Gorra Náutica con Protección UV',
    category: 'equipamiento',
    keywords: ['gorra', 'sombrero', 'protección uv', 'gorra nautica', 'sombrero nautico'],
    affiliateUrl: `https://www.amazon.es/s?k=gorra+nautica+proteccion+UV+resistente+agua&i=sporting&tag=${AMAZON_AFFILIATE_TAG}&ref=as_li_ss_tl&linkCode=ur2&linkId=gorra_nautica&camp=3638&creative=24630`,
    price: '€15-30'
  },

  // 🥽 EQUIPO SNORKEL Y BUCEO
  {
    id: 'equipo-snorkel-completo',
    title: 'Equipo de Snorkel Completo Profesional',
    category: 'equipamiento',
    keywords: ['snorkel', 'máscara', 'aletas', 'buceo', 'equipo snorkel', 'mascara snorkel', 'tubo snorkel'],
    affiliateUrl: `https://www.amazon.es/s?k=equipo+snorkel+completo+mascara+aletas+tubo+profesional&i=sporting&tag=${AMAZON_AFFILIATE_TAG}&ref=as_li_ss_tl&linkCode=ur2&linkId=snorkel_completo&camp=3638&creative=24630`,
    asin: 'B07FNPY8WG',
    price: '€40-80'
  },
  {
    id: 'mascara-buceo-individual',
    title: 'Máscara de Buceo Individual de Calidad',
    category: 'equipamiento',
    keywords: ['máscara buceo', 'mascara buceo', 'máscara individual', 'mascara individual'],
    affiliateUrl: `https://www.amazon.es/s?k=mascara+buceo+individual+calidad+profesional&i=sporting&tag=${AMAZON_AFFILIATE_TAG}&ref=as_li_ss_tl&linkCode=ur2&linkId=mascara_buceo&camp=3638&creative=24630`,
    price: '€25-50'
  },
  {
    id: 'aletas-snorkel-calidad',
    title: 'Aletas de Snorkel de Calidad Profesional',
    category: 'equipamiento',
    keywords: ['aletas', 'aletas snorkel', 'aletas buceo', 'aletas calidad'],
    affiliateUrl: `https://www.amazon.es/s?k=aletas+snorkel+calidad+profesional+ajustables&i=sporting&tag=${AMAZON_AFFILIATE_TAG}&ref=as_li_ss_tl&linkCode=ur2&linkId=aletas_snorkel&camp=3638&creative=24630`,
    price: '€20-45'
  },

  // 🧭 NAVEGACIÓN Y GPS
  {
    id: 'garmin-gps-nautico',
    title: 'Garmin GPS Náutico con Sonda',
    category: 'equipamiento',
    keywords: ['garmin', 'gps', 'sonda', 'plotter', 'navegacion', 'gps nautico', 'plotter nautico'],
    affiliateUrl: `https://www.amazon.es/s?k=garmin+gps+nautico+sonda+plotter&i=electronics&tag=${AMAZON_AFFILIATE_TAG}&ref=as_li_ss_tl&linkCode=ur2&linkId=gps_garmin&camp=3638&creative=24630`,
    asin: 'B09M47HFCQ',
    price: '€200-500'
  },
  {
    id: 'compas-nautico-silva',
    title: 'Compás Náutico Silva Profesional',
    category: 'equipamiento',
    keywords: ['compas', 'compás', 'navegacion', 'brujula', 'silva', 'compas nautico', 'brujula nautica'],
    affiliateUrl: `https://www.amazon.es/s?k=compas+nautico+silva+profesional+homologado&i=sporting&tag=${AMAZON_AFFILIATE_TAG}&ref=as_li_ss_tl&linkCode=ur2&linkId=compas_nautico&camp=3638&creative=24630`,
    price: '€30-80'
  },
  {
    id: 'cartas-nauticas-mediterraneo',
    title: 'Cartas Náuticas del Mediterráneo',
    category: 'equipamiento',
    keywords: ['cartas', 'cartas nauticas', 'mapas', 'mediterraneo', 'cartas marinas'],
    affiliateUrl: `https://www.amazon.es/s?k=cartas+nauticas+mediterraneo+españa+actualizadas&i=books&tag=${AMAZON_AFFILIATE_TAG}&ref=as_li_ss_tl&linkCode=ur2&linkId=cartas_nauticas&camp=3638&creative=24630`,
    price: '€15-40'
  },

  // ⚓ EQUIPAMIENTO DE FONDEO
  {
    id: 'ancla-marina-profesional',
    title: 'Ancla Marina Galvanizada con Cadena',
    category: 'equipamiento',
    keywords: ['ancla', 'amarre', 'fondeo', 'cadena', 'ancla marina', 'ancla galvanizada'],
    affiliateUrl: `https://www.amazon.es/s?k=ancla+marina+galvanizada+cadena+profesional&i=sporting&tag=${AMAZON_AFFILIATE_TAG}&ref=as_li_ss_tl&linkCode=ur2&linkId=ancla_marina&camp=3638&creative=24630`,
    price: '€50-150'
  },
  {
    id: 'boya-fondeo',
    title: 'Boyas de Fondeo y Amarre',
    category: 'equipamiento',
    keywords: ['boya', 'boyas', 'fondeo', 'amarre', 'boya fondeo', 'boya amarre'],
    affiliateUrl: `https://www.amazon.es/s?k=boyas+fondeo+amarre+nauticas+profesionales&i=sporting&tag=${AMAZON_AFFILIATE_TAG}&ref=as_li_ss_tl&linkCode=ur2&linkId=boyas_fondeo&camp=3638&creative=24630`,
    price: '€20-60'
  },

  // 📱 TECNOLOGÍA Y COMUNICACIÓN
  {
    id: 'gopro-camera',
    title: 'GoPro HERO11 Black - Cámara de Acción',
    category: 'tecnología',
    keywords: ['gopro', 'cámara', 'fotos', 'videos', 'cámara de acción', 'gopro hero', 'camara accion'],
    affiliateUrl: `https://www.amazon.es/s?k=gopro+hero+11+black+camara+accion&i=electronics&tag=${AMAZON_AFFILIATE_TAG}&ref=as_li_ss_tl&linkCode=ur2&linkId=gopro_camera&camp=3638&creative=24630`,
    asin: 'B0B1T4TVTS',
    price: '€350-450'
  },
  {
    id: 'cargador-solar-nautico',
    title: 'Cargador Solar Portátil Náutico',
    category: 'sostenibilidad',
    keywords: ['cargador solar', 'solar', 'bateria', 'energia', 'portatil', 'cargador solar portatil'],
    affiliateUrl: `https://www.amazon.es/s?k=cargador+solar+portatil+nautico+resistente+agua+20000mah&i=electronics&tag=${AMAZON_AFFILIATE_TAG}&ref=as_li_ss_tl&linkCode=ur2&linkId=cargador_solar&camp=3638&creative=24630`,
    price: '€40-80'
  },
  {
    id: 'powerbank-nautico',
    title: 'Power Bank Náutico Resistente al Agua',
    category: 'tecnología',
    keywords: ['power bank', 'bateria externa', 'cargador portatil', 'powerbank', 'bateria externa nautica'],
    affiliateUrl: `https://www.amazon.es/s?k=power+bank+nautico+resistente+agua+20000mah&i=electronics&tag=${AMAZON_AFFILIATE_TAG}&ref=as_li_ss_tl&linkCode=ur2&linkId=powerbank_nautico&camp=3638&creative=24630`,
    price: '€30-70'
  },

  // 🧊 COMODIDAD Y ALMACENAMIENTO
  {
    id: 'nevera-portatil-coleman',
    title: 'Nevera Portátil Coleman 50L',
    category: 'comodidad',
    keywords: ['nevera', 'cooler', 'coleman', 'hielo', 'bebidas frías', 'nevera portatil', 'cooler portatil'],
    affiliateUrl: `https://www.amazon.es/s?k=nevera+portatil+coleman+50L+nautica&i=sporting&tag=${AMAZON_AFFILIATE_TAG}&ref=as_li_ss_tl&linkCode=ur2&linkId=nevera_coleman&camp=3638&creative=24630`,
    asin: 'B08XQRZQRF',
    price: '€80-120'
  },
  {
    id: 'bolsa-estanca-electronica',
    title: 'Bolsa Estanca para Electrónicos',
    category: 'seguridad',
    keywords: ['bolsa estanca', 'estanca', 'protección agua', 'bolsa impermeable', 'bolsa estanca electronica'],
    affiliateUrl: `https://www.amazon.es/s?k=bolsa+estanca+electronica+impermeable+nautica&i=sporting&tag=${AMAZON_AFFILIATE_TAG}&ref=as_li_ss_tl&linkCode=ur2&linkId=bolsa_estanca&camp=3638&creative=24630`,
    price: '€15-35'
  },

  // 🎣 PESCA RECREATIVA
  {
    id: 'caña-pesca-recreativa',
    title: 'Caña de Pesca Recreativa Náutica',
    category: 'pesca',
    keywords: ['caña', 'caña de pesca', 'pesca', 'pesca recreativa', 'caña pesca', 'equipo pesca'],
    affiliateUrl: `https://www.amazon.es/s?k=caña+pesca+recreativa+nautica+profesional&i=sporting&tag=${AMAZON_AFFILIATE_TAG}&ref=as_li_ss_tl&linkCode=ur2&linkId=caña_pesca&camp=3638&creative=24630`,
    price: '€40-100'
  },
  {
    id: 'equipo-pesca-basico',
    title: 'Equipo Básico de Pesca Recreativa',
    category: 'pesca',
    keywords: ['equipo pesca', 'equipo pesca basico', 'pesca basica', 'equipamiento pesca'],
    affiliateUrl: `https://www.amazon.es/s?k=equipo+pesca+basico+recreativa+nautica&i=sporting&tag=${AMAZON_AFFILIATE_TAG}&ref=as_li_ss_tl&linkCode=ur2&linkId=equipo_pesca&camp=3638&creative=24630`,
    price: '€25-60'
  },

  // 🧼 LIMPIEZA Y MANTENIMIENTO
  {
    id: 'detergente-biodegradable',
    title: 'Detergente Biodegradable para Barcos',
    category: 'sostenibilidad',
    keywords: ['detergente', 'limpieza', 'biodegradable', 'ecológico', 'productos limpieza barco', 'detergente biodegradable'],
    affiliateUrl: `https://www.amazon.es/s?k=detergente+biodegradable+nautico+ecologico+barco&i=sporting&tag=${AMAZON_AFFILIATE_TAG}&ref=as_li_ss_tl&linkCode=ur2&linkId=detergente_biodegradable&camp=3638&creative=24630`,
    price: '€15-30'
  },
  {
    id: 'kit-limpieza-nautico',
    title: 'Kit de Limpieza Náutico Completo',
    category: 'limpieza',
    keywords: ['kit limpieza', 'limpieza nautica', 'kit limpieza nautico', 'productos limpieza'],
    affiliateUrl: `https://www.amazon.es/s?k=kit+limpieza+nautico+completo+productos&i=sporting&tag=${AMAZON_AFFILIATE_TAG}&ref=as_li_ss_tl&linkCode=ur2&linkId=kit_limpieza&camp=3638&creative=24630`,
    price: '€30-70'
  },

  // 👨‍👩‍👧‍👦 FAMILIA Y MASCOTAS
  {
    id: 'chaleco-salvavidas-perro',
    title: 'Chaleco Salvavidas para Perros',
    category: 'mascotas',
    keywords: ['chaleco perro', 'chaleco mascota', 'salvavidas perro', 'chaleco salvavidas perro'],
    affiliateUrl: `https://www.amazon.es/s?k=chaleco+salvavidas+perro+mascota+nautico&i=sporting&tag=${AMAZON_AFFILIATE_TAG}&ref=as_li_ss_tl&linkCode=ur2&linkId=chaleco_perro&camp=3638&creative=24630`,
    price: '€20-40'
  },
  {
    id: 'juguetes-acuaticos-ninos',
    title: 'Juguetes Acuáticos para Niños',
    category: 'familia',
    keywords: ['juguetes', 'juguetes acuaticos', 'juguetes niños', 'juguetes agua', 'juguetes nauticos'],
    affiliateUrl: `https://www.amazon.es/s?k=juguetes+acuaticos+niños+nauticos+seguros&i=sporting&tag=${AMAZON_AFFILIATE_TAG}&ref=as_li_ss_tl&linkCode=ur2&linkId=juguetes_acuaticos&camp=3638&creative=24630`,
    price: '€15-40'
  },

  // 📚 EDUCACIÓN Y LIBROS
  {
    id: 'manual-navegacion-principiantes',
    title: 'Manual de Navegación para Principiantes',
    category: 'educación',
    keywords: ['manual', 'manual navegacion', 'principiantes', 'libro navegacion', 'manual principiantes'],
    affiliateUrl: `https://www.amazon.es/s?k=manual+navegacion+principiantes+español+nautica&i=books&tag=${AMAZON_AFFILIATE_TAG}&ref=as_li_ss_tl&linkCode=ur2&linkId=manual_navegacion&camp=3638&creative=24630`,
    price: '€20-40'
  },
  {
    id: 'guia-destinos-mediterraneo',
    title: 'Guía de Destinos Náuticos del Mediterráneo',
    category: 'educación',
    keywords: ['guia', 'destinos', 'mediterraneo', 'guia destinos', 'destinos nauticos'],
    affiliateUrl: `https://www.amazon.es/s?k=guia+destinos+nauticos+mediterraneo+españa&i=books&tag=${AMAZON_AFFILIATE_TAG}&ref=as_li_ss_tl&linkCode=ur2&linkId=guia_destinos&camp=3638&creative=24630`,
    price: '€25-50'
  },

  // 👕 ROPA Y ACCESORIOS
  {
    id: 'ropa-bano-toallas',
    title: 'Ropa de Baño y Toallas Náuticas',
    category: 'ropa accesorios',
    keywords: ['ropa baño', 'toallas', 'baño', 'ropa nautica', 'toallas nauticas', 'ropa de baño'],
    affiliateUrl: `https://www.amazon.es/s?k=ropa+baño+nautica+toallas+rapidas+secado&i=sporting&tag=${AMAZON_AFFILIATE_TAG}&ref=as_li_ss_tl&linkCode=ur2&linkId=ropa_baño&camp=3638&creative=24630`,
    price: '€20-60'
  },
  {
    id: 'ropa-abrigo-ligera',
    title: 'Ropa de Abrigo Ligera para Mar',
    category: 'ropa accesorios',
    keywords: ['ropa abrigo', 'abrigo ligero', 'chaqueta', 'sudadera', 'ropa mar', 'abrigo mar'],
    affiliateUrl: `https://www.amazon.es/s?k=ropa+abrigo+ligero+mar+nautica+impermeable&i=sporting&tag=${AMAZON_AFFILIATE_TAG}&ref=as_li_ss_tl&linkCode=ur2&linkId=ropa_abrigo&camp=3638&creative=24630`,
    price: '€30-80'
  },
  {
    id: 'calzado-blanco-barco',
    title: 'Calzado Blanco para Barco con Suela de Goma',
    category: 'ropa accesorios',
    keywords: ['calzado', 'zapatos', 'zapatillas', 'suela goma', 'calzado barco', 'zapatos blancos'],
    affiliateUrl: `https://www.amazon.es/s?k=calzado+blanco+barco+suela+goma+nautico&i=sporting&tag=${AMAZON_AFFILIATE_TAG}&ref=as_li_ss_tl&linkCode=ur2&linkId=calzado_barco&camp=3638&creative=24630`,
    price: '€25-70'
  },

  // 🍽️ COMIDA Y BEBIDAS
  {
    id: 'agua-bebidas-refrescantes',
    title: 'Agua y Bebidas Refrescantes para Barco',
    category: 'comida bebidas',
    keywords: ['agua', 'bebidas', 'refrescos', 'agua barco', 'bebidas barco', 'hidratacion'],
    affiliateUrl: `https://www.amazon.es/s?k=agua+botellas+barco+hidratacion+nautica&i=sporting&tag=${AMAZON_AFFILIATE_TAG}&ref=as_li_ss_tl&linkCode=ur2&linkId=agua_bebidas&camp=3638&creative=24630`,
    price: '€5-20'
  },
  {
    id: 'snacks-comida-picnic',
    title: 'Snacks y Comida para Picnic Náutico',
    category: 'comida bebidas',
    keywords: ['snacks', 'comida', 'picnic', 'snacks barco', 'comida barco', 'alimentos'],
    affiliateUrl: `https://www.amazon.es/s?k=snacks+picnic+barco+nautico+alimentos+portatiles&i=sporting&tag=${AMAZON_AFFILIATE_TAG}&ref=as_li_ss_tl&linkCode=ur2&linkId=snacks_picnic&camp=3638&creative=24630`,
    price: '€10-30'
  },

  // 🧹 LIMPIEZA Y MANTENIMIENTO
  {
    id: 'bolsas-basura-mar',
    title: 'Bolsas para Basura Resistentes para Mar',
    category: 'limpieza',
    keywords: ['bolsas', 'basura', 'bolsas basura', 'bolsas mar', 'basura mar', 'limpieza mar'],
    affiliateUrl: `https://www.amazon.es/s?k=bolsas+basura+resistentes+mar+nauticas+ecologicas&i=sporting&tag=${AMAZON_AFFILIATE_TAG}&ref=as_li_ss_tl&linkCode=ur2&linkId=bolsas_basura&camp=3638&creative=24630`,
    price: '€5-15'
  },

  // 📱 TECNOLOGÍA Y ELECTRÓNICOS
  {
    id: 'bateria-externa-movil',
    title: 'Batería Externa para Móvil Náutica',
    category: 'tecnología',
    keywords: ['bateria externa', 'power bank', 'móvil', 'telefono', 'cargador portatil', 'bateria movil'],
    affiliateUrl: `https://www.amazon.es/s?k=bateria+externa+movil+nautica+resistente+agua&i=electronics&tag=${AMAZON_AFFILIATE_TAG}&ref=as_li_ss_tl&linkCode=ur2&linkId=bateria_externa&camp=3638&creative=24630`,
    price: '€20-50'
  },
  {
    id: 'camara-fotografica-acuatica',
    title: 'Cámara Fotográfica Acuática Resistente al Agua',
    category: 'tecnología',
    keywords: ['cámara', 'camara', 'fotografica', 'acuatica', 'resistente agua', 'cámara agua'],
    affiliateUrl: `https://www.amazon.es/s?k=camara+fotografica+acuatica+resistente+agua+nautica&i=electronics&tag=${AMAZON_AFFILIATE_TAG}&ref=as_li_ss_tl&linkCode=ur2&linkId=camara_acuatica&camp=3638&creative=24630`,
    price: '€50-150'
  },

  // 📋 DOCUMENTACIÓN Y ORGANIZACIÓN
  {
    id: 'organizador-documentos',
    title: 'Organizador de Documentos Náutico',
    category: 'organización',
    keywords: ['documentos', 'dni', 'pasaporte', 'organizador', 'documentos nauticos', 'organizador documentos'],
    affiliateUrl: `https://www.amazon.es/s?k=organizador+documentos+nautico+impermeable+dni+pasaporte&i=sporting&tag=${AMAZON_AFFILIATE_TAG}&ref=as_li_ss_tl&linkCode=ur2&linkId=organizador_documentos&camp=3638&creative=24630`,
    price: '€15-35'
  }
];

export const findAffiliateProductByText = (text: string): { title: string; affiliateUrl: string } | null => {
  const lower = text.toLowerCase();
  
  // Buscar coincidencia exacta primero
  for (const p of AFFILIATE_CATALOG) {
    if (p.keywords.some(k => lower.includes(k.toLowerCase()))) {
      return { title: p.title, affiliateUrl: p.affiliateUrl };
    }
  }
  
  // Si no hay coincidencia exacta, buscar coincidencias parciales
  for (const p of AFFILIATE_CATALOG) {
    for (const keyword of p.keywords) {
      if (keyword.toLowerCase().includes(lower) || lower.includes(keyword.toLowerCase())) {
        return { title: p.title, affiliateUrl: p.affiliateUrl };
      }
    }
  }
  
  return null;
};

export const findAffiliateProductsByCategory = (category: string, limit: number = 5): Array<{ title: string; affiliateUrl: string }> => {
  const results = AFFILIATE_CATALOG
    .filter(p => p.category.toLowerCase() === category.toLowerCase())
    .slice(0, limit)
    .map(p => ({ title: p.title, affiliateUrl: p.affiliateUrl }));
  return results;
};

// Función para obtener productos por texto con información completa
export const findAffiliateProductByTextComplete = (text: string): AffiliateProduct | null => {
  const lower = text.toLowerCase();
  
  for (const p of AFFILIATE_CATALOG) {
    if (p.keywords.some(k => lower.includes(k.toLowerCase()))) {
      return p;
    }
  }
  
  return null;
};




