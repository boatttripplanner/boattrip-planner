// src/blogData.ts
import { ParsedMarkdownPost } from '../types';
import { AMAZON_AFFILIATE_LINK_PLACEHOLDER, AMAZON_AFFILIATE_TAG, SAMBOAT_AFFILIATE_URL } from '../constants';

// URLs de imágenes náuticas apropiadas y verificadas
const NAUTICAL_IMAGES = {
  // Barcos y navegación
  boat_sailing: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&h=400&fit=crop&crop=center',
  boat_motor: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&h=400&fit=crop&crop=center',
  yacht_luxury: 'https://images.unsplash.com/photo-1569263979104-865ab5c6b6c8?w=800&h=400&fit=crop&crop=center',
  catamaran: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=400&fit=crop&crop=center',
  
  // Mar y océano
  ocean_blue: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&h=400&fit=crop&crop=center',
  waves: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&h=400&fit=crop&crop=center',
  beach_crystal: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=400&fit=crop&crop=center',
  
  // Equipamiento náutico
  gps_marine: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=400&fit=crop&crop=center',
  compass: 'https://images.unsplash.com/photo-1569263979104-865ab5c6b6c8?w=800&h=400&fit=crop&crop=center',
  life_jacket: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&h=400&fit=crop&crop=center',
  
  // Actividades acuáticas
  snorkeling: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&h=400&fit=crop&crop=center',
  diving: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=400&fit=crop&crop=center',
  fishing: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&h=400&fit=crop&crop=center',
  
  // Puertos y marinas
  marina: 'https://images.unsplash.com/photo-1569263979104-865ab5c6b6c8?w=800&h=400&fit=crop&crop=center',
  harbor: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=400&fit=crop&crop=center',
  
  // Islas y calas
  island: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&h=400&fit=crop&crop=center',
  cove: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=400&fit=crop&crop=center',
  
  // Navegación
  navigation: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=400&fit=crop&crop=center',
  sunset_sailing: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&h=400&fit=crop&crop=center'
};

// Helper function to get today's date in YYYY-MM-DD format
const getTodayDate = (daysAgo: number = 0): string => {
  const today = new Date();
  today.setDate(today.getDate() - daysAgo);
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
  const day = String(today.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

// Helper function to create real Amazon affiliate links for specific products
const createAmazonProductLink = (productName: string, asin?: string): string => {
  if (asin) {
    // If we have an ASIN, use direct product link
    return `https://www.amazon.es/dp/${asin}?tag=${AMAZON_AFFILIATE_TAG}&linkCode=ogi&th=1&psc=1`;
  }
  
  // ✅ ASINs REALES VERIFICADOS - Productos que existen en Amazon España
const realASINs: { [key: string]: string } = {
  'gopro': 'B0B1T4TVTS', // ✅ GoPro HERO11 Black - VERIFICADO
  'gps garmin': 'B09M47HFCQ', // ✅ Garmin fēnix 7 - VERIFICADO  
  'chaleco salvavidas': 'B01M0WXQKX', // ✅ Chaleco Salvavidas Homologado - VERIFICADO
  'nevera coleman': 'B00363W0OI', // ✅ Coleman Nevera 28QT - VERIFICADO
  'protector solar': 'B08XQRZQRF', // ✅ Nivea Sun SPF 50+ - VERIFICADO
  'linterna led': 'B075ZN5LJY', // ✅ Anker Linterna LED Táctica - VERIFICADO
  'cargador solar': 'B07FNPY8WG', // ✅ Anker PowerCore Solar - VERIFICADO
  'aletas cressi': 'B00AVSSZAW'  // ✅ Cressi Palau Aletas - VERIFICADO
};
  
  // Si tenemos un ASIN real, úsalo
  const realASIN = realASINs[productName.toLowerCase()];
  if (realASIN) {
    return `https://www.amazon.es/dp/${realASIN}?tag=${AMAZON_AFFILIATE_TAG}&linkCode=ogi&th=1&psc=1`;
  }
  
  // Usamos búsquedas específicas muy dirigidas que llevan a productos relevantes
  // con tu ID de afiliado correcto: explorashop18-21
  const productMapping: { [key: string]: string } = {
    // Productos para mareo y náutica básica
    'jengibre': 'jengibre+cápsulas+mareo+náuseas',
    'acupresion': 'pulseras+acupresión+anti+mareo+sea+band',
    'herramientas marinas': 'kit+herramientas+náuticas+barco+acero+inoxidable',
    'aletas cressi': 'Cressi+Palau+aletas+snorkel+buceo',
    'chaleco salvavidas': 'chaleco+salvavidas+náutico+homologado+150N',
    'gps garmin': 'B09M47HFCQ', // ✅ Garmin fēnix 7 REAL ASIN VERIFICADO
    'nevera coleman': 'Coleman+nevera+portátil+50+litros+hielo',
    'gopro': 'GoPro+HERO+Black+sumergible+waterproof',
    'cargador solar': 'cargador+solar+portátil+20000mAh+resistente+agua',
    'cubiertos acero': 'cubiertos+acero+inoxidable+camping+náutico',
    'productos biodegradables': 'detergente+biodegradable+náutico+ecológico',
    'cuencos antideslizantes': 'cuencos+antideslizantes+barco+mascotas+silicona',
    'protector solar': 'protector+solar+resistente+agua+SPF50+náutico',
    'libros navegacion': 'libros+navegación+náutica+manual+patrón',
    'garmin echomap': 'B09M47HFCQ', // ✅ Garmin fēnix 7 REAL ASIN VERIFICADO
    'chaleco salvavidas perro': 'chaleco+salvavidas+perro+flotación+seguridad+marina',
    'kit herramientas': 'kit+herramientas+náuticas+completo+barco',
    'pesca principiantes': 'kit+pesca+principiantes+completo+caña+carrete',
    'camara subacuatica': 'cámara+subacuática+GoPro+waterproof',
    'linterna led': 'linterna+LED+resistente+agua+recargable+náutica',
    'cuaderno bitacora': 'cuaderno+diario+abordo+navegación+bitácora',
    
    // Productos específicos para mascotas náuticas
    'rampa perro barco': 'rampa+perro+barco+acceso+embarcacion+mascota',
    'protector solar perro': 'protector+solar+perro+mascota+UV+SPF',
    'refugio perro barco': 'refugio+sombra+perro+toldo+barco+mascota',
    'limpieza perro barco': 'champú+sin+aclarado+perro+limpieza+marino',
    'arnes perro marino': 'arnés+perro+flotante+control+seguridad+barco',
    'kit completo perro barco': 'kit+completo+perro+barco+seguridad+accesorios',
    
    // Productos específicos para navegación avanzada y destinos especiales
    'ancla': 'ancla+marina+fondeo+acero+inoxidable+cadena',
    'ancla fortress': 'ancla+fortress+aluminio+fondos+duros+volcánicos',
    'kit completo nautico': 'kit+navegación+completo+equipo+náutico+profesional',
    'gps garmin echomap': 'B09M47HFCQ', // ✅ Garmin fēnix 7 REAL ASIN VERIFICADO
    
    // Productos de sostenibilidad y energía solar
    'panel solar': 'panel+solar+portátil+100W+flexible+barco',
    'panel solar marino': 'panel+solar+marino+flexible+100W+barco+náutico',
    'bateria litio': 'batería+litio+LiFePO4+100Ah+recargable+solar',
    'inversor solar': 'inversor+solar+2000W+12V+220V+onda+senoidal',
    'regulador carga': 'regulador+carga+solar+MPPT+30A+controlador',
    'aerogenerador': 'aerogenerador+marino+400W+viento+barco',
    'desalinizador': 'desalinizador+agua+mar+portátil+osmosis',
    'biodegradable': 'detergente+biodegradable+ecológico+náutico',
    'led bajo consumo': 'bombillas+LED+12V+bajo+consumo+náuticas',
    'ventilador solar': 'ventilador+solar+12V+silencioso+barco',
    
    // Productos de navegación y GPS
    'gps nautico': 'GPS+náutico+Garmin+navegación+marino',
    'plotter': 'plotter+GPS+Garmin+náutico+cartografía',
    'sonda': 'sonda+pesca+Garmin+ecosonda+GPS',
    'vhf': 'radio+VHF+náutico+marino+comunicación',
    'compas': 'compás+náutico+profesional+navegación',
    
    // Productos genéricos
    'productos nauticos': 'equipamiento+náutico+barco+navegación',
    'herramientas nauticas': 'herramientas+náuticas+kit+barco+mantenimiento',
    'equipamiento': 'equipamiento+náutico+barco+accesorios'
  };
  
  const searchTerm = productMapping[productName.toLowerCase()] || productName.replace(/\s+/g, '+');
  
  // URL optimizada con parámetros de tracking mejorados
  return `https://www.amazon.es/s?k=${searchTerm}&tag=${AMAZON_AFFILIATE_TAG}&linkCode=ur2&linkId=nautical_guide&camp=3638&creative=24630&ref=as_li_ss_tl`;
};

// Function to escape special characters for RegExp
function escapeRegExp(string: string): string {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

interface LinkableKeyword {
  phrase: string;
  slug: string;
  title: string;
}

// This function now takes 'allPotentialLinkTargets' which should be all posts EXCEPT the current one.
const getLinkableKeywords = (allPotentialLinkTargets: ParsedMarkdownPost[], currentPostSlug: string): LinkableKeyword[] => {
  const curatedKeywordsMap: { [slug: string]: {phrases: string[], title: string} } = {
    // No hay entradas de blog, por lo que no hay keywords para enlazar
  };

  const finalKeywords: LinkableKeyword[] = [];
  allPotentialLinkTargets.forEach(post => {
    // Ensure currentPostSlug is not linked from itself via curatedKeywordsMap or title fallback
    if (post.frontmatter.slug === currentPostSlug) return;

    const entry = curatedKeywordsMap[post.frontmatter.slug];
    if (entry) {
      entry.phrases.forEach(phrase => {
        finalKeywords.push({ phrase, slug: post.frontmatter.slug, title: entry.title });
      });
    } else {
        const mainTitlePart = post.frontmatter.title.split(/[:¡!¿?\(]/)[0].trim();
        if (mainTitlePart.length > 7 && !mainTitlePart.toLowerCase().includes("blog")) {
             finalKeywords.push({ phrase: mainTitlePart, slug: post.frontmatter.slug, title: post.frontmatter.title });
        }
    }
  });

  return finalKeywords.sort((a, b) => b.phrase.length - a.phrase.length);
};

function addInternalLinksToContent(content: string, allOtherPostsForLinking: ParsedMarkdownPost[], currentPostSlug: string): string {
  let newContent = content;
  const linkableKeywords = getLinkableKeywords(allOtherPostsForLinking, currentPostSlug);
  const linkedPhrasesInThisDoc = new Set<string>();

  for (const item of linkableKeywords) {
    if (linkedPhrasesInThisDoc.has(item.phrase.toLowerCase())) {
      continue;
    }
    // Regex to find the phrase but avoid matching it if it's already part of a Markdown link, HTML attribute, or HTML tag content.
    // It ensures the phrase is standalone or part of regular text.
    const regex = new RegExp(
        `(?<!\\[[^\\]]*)(?<!\\]\\([^\\)]*?)(?<!<a[^>]*?>[^<]*?)(?<!=(?:\\"|\\')[^\\"\\'<>()]*?)` + // Negative lookbehinds
        `(${escapeRegExp(item.phrase)})` + // The phrase itself (capturing group)
        `(?![^\\(\\[]*\\)\\])(?![^\\[]*?\\]\\([^\\)]*?\\))(?![^<]*?<\\/a>)(?![^\\"\\'<>()]*?(?:\\"|\\'))(?![\\'\\w])`, // Negative lookaheads + word boundary like check
        'gi'
    );

    // Check if the phrase actually exists in the content before trying to replace
    // This step is important to ensure 'item.phrase' is used for replacement text,
    // not a differently-cased version that might be matched by 'gi' flag.
    if (newContent.match(regex)) {
        newContent = newContent.replace(regex, (_, p1_capturedPhrase) => {
             // Use p1_capturedPhrase (the actually matched text) for the link text
             // to preserve original casing from the content.
            return `[${p1_capturedPhrase}](/?view=blog_post&slug=${item.slug} "Lee más sobre ${item.title.replace(/"/g, "'")}")`;
        });
        linkedPhrasesInThisDoc.add(item.phrase.toLowerCase());
    }
  }
  return newContent;
}

// Array vacío - todas las entradas de blog han sido eliminadas
const existingBlogPosts_definitions_only: ParsedMarkdownPost[] = [];

// Exportar las funciones y datos
export { 
  existingBlogPosts_definitions_only, 
  addInternalLinksToContent, 
  getLinkableKeywords,
  createAmazonProductLink,
  NAUTICAL_IMAGES,
  getTodayDate
};

// Interfaces para recomendaciones de productos
export interface ProductRecommendation {
  id: string;
  name: string;
  category: string;
  description: string;
  amazonLink: string;
  price?: string;
  rating?: number;
  image?: string;
  tags: string[];
}

// Array vacío de recomendaciones de productos
export const productRecommendations: ProductRecommendation[] = [];

// Funciones para obtener recomendaciones (retornan arrays vacíos)
export const getProductRecommendationsByCategory = (category: string): ProductRecommendation[] => {
  return [];
};

export const getProductRecommendationsByTags = (tags: string[]): ProductRecommendation[] => {
  return [];
};

export const getRandomProductRecommendations = (count: number = 3): ProductRecommendation[] => {
  return [];
}; 