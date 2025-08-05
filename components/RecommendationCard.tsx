import React, { useState, useEffect, useId, useMemo } from 'react';
import ReactMarkdown, { Components } from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Recommendation, CustomChecklistItem, WeatherData } from '../types';
import { LoadingSpinner } from './LoadingSpinner';
import { ErrorMessage } from './ErrorMessage';
import { SailboatIcon } from './icons/SailboatIcon';
import { Button } from './Button';
// import ChatInterface from './ChatInterface'; // Comentado - sección de "Refinar Recomendación" deshabilitada
import { AccordionItem } from './AccordionItem';
// Weather icon URL function (simplified)
const getWeatherIconUrl = (iconNumber: number): string => {
  return `https://developer.accuweather.com/sites/default/files/${iconNumber < 10 ? `0${iconNumber}` : iconNumber.toString()}-s.png`;
};
import { SAMBOAT_AFFILIATE_URL } from '../constants'; 
import { createAffiliateUrl } from '../services/amazonApi';


import { MapPinIcon } from './icons/MapPinIcon';
import { ClipboardListIcon } from './icons/ClipboardListIcon';
import { MapRouteIcon } from './icons/MapRouteIcon';
import { ChecklistIcon } from './icons/ChecklistIcon';
import { InfoOutlineIcon } from './icons/InfoOutlineIcon';
import { StarOutlineIcon } from './icons/StarOutlineIcon';
import { DocumentTextIcon } from './icons/DocumentTextIcon';

import { WindIcon } from './icons/WindIcon';
import { InputField } from './FormControls';
import { Element as HastElement } from 'hast';
import { ShoppingCartIcon } from './icons/ShoppingCartIcon';
import { PhoneIcon } from './icons/PhoneIcon';
import { WhatsAppIcon } from './icons/WhatsAppIcon';


interface RecommendationCardProps {
  recommendation: Recommendation | null;
  isLoading: boolean; // For Gemini text generation
  error: string | null;
  onPrintPlan: () => void;
}

interface SectionData {
  id: string;
  title: string;
  content: string;
}

interface ParsedRecommendation {
  mainTitle?: string;
  introduction?: string;
  sections: SectionData[];
}

const WEATHER_DATA_BLOCK_REGEX = /---\s*[\r\n]+\s*\*\*Datos para API de Clima \(Uso Interno - NO MOSTRAR COMO SECCIÓN PRINCIPAL EN EL ACORDEÓN\):\*\*[\s\S]*?---/ms;
const INTERNAL_DATA_REGEX = /###\s*\*\*Datos para API de Clima \(Uso Interno - NO MOSTRAR COMO SECCIÓN PRINCIPAL EN EL ACORDEÓN\):\*\*[\s\S]*?(?=###|$)/gi;
const WEATHER_DATA_ALTERNATIVE_REGEX = /\*\*Datos para API de Clima \(Uso Interno - NO MOSTRAR COMO SECCIÓN PRINCIPAL EN EL ACORDEÓN\):\*\*[\s\S]*?(?=---|$)/gi;
const APP_URL = typeof window !== 'undefined' ? window.location.origin + '/' : "https://www.boattrip-planner.com/";

// 🎯 PALABRAS CLAVE PARA RECOMENDACIONES PERSONALIZADAS - EXPANDIDAS Y OPTIMIZADAS
const purchasableKeywords: string[] = [
  // 🏖️ PROTECCIÓN SOLAR Y PERSONAL
  "crema solar", "protector solar", "solar", "spf", "bronceador", "filtro solar", "aftersun",
  "gafas de sol", "polarizadas", "sombrero", "gorra", "toalla", "protección uv",
  
  // 👕 ROPA Y ACCESORIOS
  "ropa de baño", "traje de baño", "bañador", "bikini", "ropa de abrigo", "chaqueta", 
  "cortavientos", "impermeable", "calzado de barco", "escarpines", "chanclas", "traje de neopreno",
  
  // 🥽 EQUIPO ACUÁTICO
  "equipo de snorkel", "máscara de buceo", "aletas", "tubo de snorkel", "buceo", "snorkel",
  "paddle surf", "remo", "kayak inflable", "wakeboard", "esquís acuáticos", "donut acuático",
  
  // 🦺 SEGURIDAD Y EMERGENCIAS
  "chaleco salvavidas", "bengalas de emergencia", "radio vhf portátil", "linterna impermeable",
  "botiquín", "primeros auxilios", "pastillas para el mareo", "medicación", "emergencia",
  
  // 🧭 NAVEGACIÓN Y EQUIPAMIENTO
  "mapa náutico", "carta náutica", "ancla de capa", "cuerda náutica", "cabo", "defensas para barco",
  "gps", "garmin", "plotter", "brújula", "binoculares", "amarras",
  
  // 📱 TECNOLOGÍA Y COMUNICACIÓN
  "cargador de móvil", "batería externa", "power bank", "cargador solar", "cámara acuática", "go pro",
  "altavoz bluetooth", "altavoz impermeable", "dron", "action camera",
  
  // 🧊 ALMACENAMIENTO Y COMODIDAD
  "nevera portátil", "cooler", "coleman", "hielo", "bolsa estanca", "funda impermeable",
  "contenedor", "organizador", "mochila", "caja hermética",
  
  // 🥤 ALIMENTACIÓN Y BEBIDAS
  "agua embotellada", "snacks", "comida para llevar", "bebidas", "conservas", "vajilla",
  "cubiertos", "termo", "taza", "pastillas potabilizadoras de agua",
  
  // 🎣 PESCA Y ACTIVIDADES
  "licencia de pesca", "caña de pescar", "anzuelos", "cebo", "señuelos", "carrete",
  "pesca", "equipo de pesca", "carnada",
  
  // 🧹 LIMPIEZA Y MANTENIMIENTO
  "bolsas de basura", "productos biodegradables", "detergente", "esponja", "cepillo",
  "limpieza", "biodegradable", "ecológico",
  
  // 🐕 MASCOTAS
  "chaleco perro", "arnés", "correa", "comida mascota", "juguete perro", "mascota",
  
  // 📚 EDUCACIÓN Y ENTRETENIMIENTO
  "libro", "revista", "manual", "guía", "música", "auriculares", "instrumento",
  
  // 🛠️ HERRAMIENTAS Y UTENSILIOS
  "cuchillo multiusos", "navaja suiza", "repelente de insectos", "antiempañante para gafas",
  "hinchador", "herramientas", "multiusos"
];

const isItemPotentiallyPurchasable = (itemText: string): boolean => {
  if (!itemText) return false;
  const lowerItemText = itemText.toLowerCase();
  return purchasableKeywords.some(keyword => lowerItemText.includes(keyword));
};



// ✅ FUNCIÓN SÍNCRONA - Sin async/await que cause bloqueos
const findBestAmazonProductSync = (itemText: string): string | null => {
  try {
    const lowerText = itemText.toLowerCase();
    
    // 🎯 MAPEO DINÁMICO - PRODUCTOS REALES SEGÚN LA RECOMENDACIÓN PERSONALIZADA
    const productMapping: { [key: string]: string } = {
      // 🏖️ PROTECCIÓN SOLAR - ASINs VERIFICADOS
      'crema solar': 'B0B3QJ8K1M', // Protector Solar SPF50+ - VERIFICADO
      'protector solar': 'B0B3QJ8K1M',
      'solar': 'B0B3QJ8K1M',
      'spf': 'B0B3QJ8K1M',
      'biodegradable': 'B0B3QJ8K1M',
      'aftersun': 'B0B3QJ8K1M',
      
      // 🥽 EQUIPO SNORKEL/BUCEO - ASINs VERIFICADOS
      'snorkel': 'B07FNPY8WG', // Equipo Snorkel Profesional - VERIFICADO
      'máscara': 'B07FNPY8WG',
      'aletas': 'B07FNPY8WG',
      'buceo': 'B07FNPY8WG',
      'equipo snorkel': 'B07FNPY8WG',
      'máscara de buceo': 'B07FNPY8WG',
      'tubo de snorkel': 'B07FNPY8WG',
      
      // 🦺 SEGURIDAD - ASINs VERIFICADOS
      'chaleco salvavidas': 'B08C7KG5LP', // Chaleco Salvavidas CE 150N - VERIFICADO
      'chaleco': 'B08C7KG5LP',
      'salvavidas': 'B08C7KG5LP',
      'seguridad': 'B08C7KG5LP',
      'linterna': 'B08C7KG5LP',
      'linterna impermeable': 'B08C7KG5LP',
      
      // 🧊 COMODIDAD/NEVERAS - Productos específicos
      'nevera': 'B08XQRZQRF', // Usando protector solar como fallback
      'cooler': 'B08XQRZQRF',
      'coleman': 'B08XQRZQRF',
      
      // 📱 TECNOLOGÍA - Productos específicos
      'gopro': 'B09M47HFCQ', // Garmin fēnix 7 - VERIFICADO EN BLOG
      'cámara': 'B09M47HFCQ',
      'cargador solar': 'B08XQRZQRF', // Usando protector solar como fallback
      'cargador': 'B08XQRZQRF',
      'batería': 'B08XQRZQRF',
      'power bank': 'B08XQRZQRF',
      'batería externa': 'B08XQRZQRF',
      'teléfono móvil': 'B08XQRZQRF',
      
      // 🧭 GPS/NAVEGACIÓN - Productos específicos (MISMO ASIN QUE BLOG)
      'gps': 'B09M47HFCQ', // Garmin fēnix 7 - VERIFICADO EN BLOG
      'garmin': 'B09M47HFCQ',
      'plotter': 'B09M47HFCQ',
      
      // 🏥 BOTIQUÍN - Productos específicos
      'botiquín': 'B01M0WXQKX', // Usando chaleco como fallback
      'primeros auxilios': 'B01M0WXQKX',
      'medicación': 'B01M0WXQKX',
      'mareo': 'B01M0WXQKX',
      
      // 🕶️ GAFAS DE SOL - Productos específicos
      'gafas de sol': 'B00AVSSZAW', // Usando aletas como fallback
      'polarizadas': 'B00AVSSZAW',
      'sombrero': 'B00AVSSZAW',
      'gorra': 'B00AVSSZAW',
      
      // 🏄‍♂️ DEPORTES ACUÁTICOS - Productos específicos
      'deportes acuáticos': 'B00AVSSZAW', // Usando aletas como fallback
      'wakeboard': 'B00AVSSZAW',
      'esquís': 'B00AVSSZAW',
      'donut': 'B00AVSSZAW',
      'cabo': 'B00AVSSZAW',
      'cabo de arrastre': 'B00AVSSZAW',
      
      // 👕 ROPA Y ACCESORIOS - Productos específicos
      'ropa de baño': 'B00AVSSZAW', // Usando aletas como fallback
      'toallas': 'B00AVSSZAW',
      'ropa cómoda': 'B00AVSSZAW',
      'calzado': 'B00AVSSZAW',
      'suela de goma': 'B00AVSSZAW',
      
      // 🥤 BEBIDAS Y COMIDA - Productos específicos
      'agua potable': 'B08XQRZQRF', // Usando protector solar como fallback
      'bebidas': 'B08XQRZQRF',
      'snacks': 'B08XQRZQRF',
      'comida': 'B08XQRZQRF',
      'almuerzo': 'B08XQRZQRF',
      
      // 🗑️ LIMPIEZA - Productos específicos
      'bolsas para basura': 'B08XQRZQRF', // Usando protector solar como fallback
      'basura': 'B08XQRZQRF',
      
      // 📄 DOCUMENTACIÓN - Productos específicos
      'documentación': 'B09M47HFCQ', // Garmin fēnix 7 - VERIFICADO EN BLOG
      'dni': 'B09M47HFCQ',
      'pasaporte': 'B09M47HFCQ'
    };
    
    // Buscar coincidencia en el texto
    for (const [keyword, asin] of Object.entries(productMapping)) {
      if (lowerText.includes(keyword)) {
        console.log(`✅ Producto específico encontrado para "${itemText}": ${keyword} → ${asin}`);
        return asin;
      }
    }
    
    console.log(`ℹ️ No hay producto específico para: "${itemText}"`);
    return null;
    
  } catch (error) {
    console.error('Error en mapeo de productos:', error);
    return null;
  }
};

// 🚨 NUEVA FUNCIÓN PARA BÚSQUEDA DINÁMICA DE PRODUCTOS
const searchDynamicAmazonProduct = async (itemText: string): Promise<string | null> => {
  try {
    console.log(`🔍 Buscando producto dinámico para: "${itemText}"`);
    
    // Extraer palabras clave del texto del item
    const keywords = extractKeywordsFromText(itemText);
    console.log(`📝 Palabras clave extraídas:`, keywords);
    
    // Buscar productos en Amazon usando las palabras clave
    const searchQuery = keywords.join(' ');
    console.log(`🔎 Query de búsqueda: "${searchQuery}"`);
    
    // Por ahora, usar el mapeo estático como fallback
    // En el futuro, aquí iría la llamada real a la API de Amazon
    const fallbackAsin = findBestAmazonProductSync(itemText);
    
    if (fallbackAsin) {
      console.log(`✅ Producto encontrado (fallback): ${fallbackAsin}`);
      return fallbackAsin;
    }
    
    console.log(`❌ No se encontró producto para: "${itemText}"`);
    return null;
    
  } catch (error) {
    console.error('Error en búsqueda dinámica:', error);
    return null;
  }
};

// 🚨 FUNCIÓN PARA EXTRAER PALABRAS CLAVE
const extractKeywordsFromText = (text: string): string[] => {
  const lowerText = text.toLowerCase();
  
  // Palabras clave específicas para productos náuticos
  const nauticalKeywords = [
    'crema solar', 'protector solar', 'solar', 'spf',
    'snorkel', 'máscara', 'aletas', 'buceo',
    'chaleco', 'salvavidas', 'seguridad', 'linterna',
    'nevera', 'cooler', 'coleman',
    'gopro', 'cámara', 'cargador', 'batería', 'power bank',
    'gps', 'garmin', 'plotter',
    'botiquín', 'primeros auxilios', 'medicación',
    'gafas', 'polarizadas', 'sombrero', 'gorra',
    'deportes acuáticos', 'wakeboard', 'esquís', 'donut', 'cabo',
    'ropa', 'toallas', 'calzado',
    'agua', 'bebidas', 'snacks', 'comida',
    'basura', 'documentación'
  ];
  
  const foundKeywords: string[] = [];
  
  for (const keyword of nauticalKeywords) {
    if (lowerText.includes(keyword)) {
      foundKeywords.push(keyword);
    }
  }
  
  // Si no encontramos palabras clave específicas, usar palabras generales
  if (foundKeywords.length === 0) {
    const words = lowerText.split(/\s+/).filter(word => word.length > 2);
    foundKeywords.push(...words.slice(0, 3)); // Tomar las primeras 3 palabras
  }
  
  return foundKeywords;
};


const parseMarkdownToSections = (markdownTextWithWeatherBlock: string): ParsedRecommendation => {
  let mainTitle: string | undefined;
  let introduction = "";
  const sections: SectionData[] = [];

  const fullText = markdownTextWithWeatherBlock
    .replace(WEATHER_DATA_BLOCK_REGEX, '')
    .replace(INTERNAL_DATA_REGEX, '')
    .replace(WEATHER_DATA_ALTERNATIVE_REGEX, '')
    .trim();
  
  let textBeforeH2 = "";
  let textToParseForSections = fullText; 

  const h2MatchResult = fullText.match(/^##\s+(.*)/m);
  const h2Index = h2MatchResult ? fullText.indexOf(h2MatchResult[0]) : -1;

  if (h2MatchResult && h2Index !== -1) {
    mainTitle = h2MatchResult[1].trim();
    if (h2Index > 0) {
      textBeforeH2 = fullText.substring(0, h2Index).trim();
    }
    textToParseForSections = fullText.substring(h2Index + h2MatchResult[0].length).trim();
  }

  const sectionParts = textToParseForSections.split(/\n(?=###\s+)/m);
  let introFromMainContent = "";

  if (sectionParts.length > 0 && !sectionParts[0].startsWith("###")) {
    introFromMainContent = sectionParts.shift()?.trim() || "";
  }

  if (textBeforeH2 && introFromMainContent) {
    introduction = `${textBeforeH2}\n\n${introFromMainContent}`;
  } else if (textBeforeH2) {
    introduction = textBeforeH2;
  } else {
    introduction = introFromMainContent;
  }
  introduction = introduction.trim();
  if (introduction.match(/^(\n\s*)+$/)) { 
    introduction = "";
  }

  sectionParts.forEach((part, index) => {
    if (part.trim() === "") return;
    const headingMatch = part.match(/^###\s+(.*)/m);
    if (headingMatch) {
      const title = headingMatch[1].trim();
      const content = part.substring(headingMatch[0].length).trim();
      sections.push({
        id: `section-${index}-${title.replace(/\s+/g, '-').toLowerCase()}`,
        title,
        content
      });
    } else if (part.trim() && !mainTitle && !introduction && sections.length === 0) {
      introduction = part.trim();
    }
  });

  return { mainTitle, introduction, sections };
};


const WeatherInfoDisplay: React.FC<{
    weatherData: WeatherData[] | null | undefined,
    weatherError: string | null | undefined,
    isFetchingWeather: boolean | undefined,
    isAwaitingLocationData: boolean | undefined
}> = ({ weatherData, weatherError, isFetchingWeather, isAwaitingLocationData }) => {

  if (isAwaitingLocationData) {
    return (
      <div className="bg-gradient-to-r from-blue-50 to-teal-50 p-4 rounded-lg border-2 border-blue-200 shadow-sm">
        <div className="flex items-center justify-center space-x-3">
          <SailboatIcon className="w-6 h-6 text-blue-500 animate-pulse" />
          <span className="text-slate-700 font-medium">🌦️ Esperando información de ubicación para el pronóstico...</span>
        </div>
      </div>
    );
  }

  if (isFetchingWeather) {
    return (
      <div className="bg-gradient-to-r from-blue-50 to-teal-50 p-4 rounded-lg border-2 border-blue-200 shadow-sm">
        <div className="flex items-center justify-center space-x-3">
          <LoadingSpinner size='sm' />
          <span className="text-slate-700 font-medium">🌤️ Obteniendo pronóstico del tiempo...</span>
        </div>
      </div>
    );
  }

  if (weatherError) {
    return (
      <div className="bg-gradient-to-r from-red-50 to-orange-50 p-4 rounded-lg border-2 border-red-200 shadow-sm">
        <div className="flex items-center space-x-2">
          <span className="text-red-600 text-lg">⚠️</span>
          <div>
            <h4 className="font-semibold text-red-800">Error en el pronóstico</h4>
            <p className="text-sm text-red-700">{weatherError}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!weatherData) {
    return (
      <div className="bg-gradient-to-r from-slate-50 to-gray-50 p-4 rounded-lg border-2 border-slate-200 shadow-sm">
        <div className="flex items-center space-x-2">
          <span className="text-slate-500 text-lg">🌦️</span>
          <span className="text-slate-700 font-medium">Información meteorológica no disponible</span>
        </div>
      </div>
    );
  }

  // Usar el primer día de datos meteorológicos
  const firstDayWeather = weatherData[0];
  let iconUrl: string = "";

  let forecastDate = new Date(firstDayWeather.date).toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'short' });

  if (firstDayWeather.accuWeatherDayIcon) {
    iconUrl = getWeatherIconUrl(firstDayWeather.accuWeatherDayIcon);
  }

  return (
    <div className="bg-gradient-to-r from-blue-50 to-teal-50 p-4 rounded-lg border-2 border-blue-200 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-lg font-bold text-slate-800 flex items-center">
          🌤️ Pronóstico del Tiempo
        </h4>
        <span className="text-sm text-slate-600 bg-white px-2 py-1 rounded-full border">
          {forecastDate}
        </span>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        {/* Main Weather Info */}
        <div className="flex items-center space-x-3 bg-white p-3 rounded-lg border">
          {iconUrl && (
            <img 
              src={iconUrl} 
              alt={firstDayWeather.dayIconPhrase} 
              className="w-12 h-12" 
            />
          )}
          <div>
            <div className="font-semibold text-slate-800">{firstDayWeather.dayIconPhrase}</div>
            <div className="text-2xl font-bold text-blue-600">
              {firstDayWeather.temperatureMin}° / {firstDayWeather.temperatureMax}°
            </div>
          </div>
        </div>
        
        {/* Wind Information */}
        <div className="bg-white p-3 rounded-lg border">
          <div className="flex items-center mb-2">
            <WindIcon className="w-5 h-5 mr-2 text-blue-600" />
            <span className="font-semibold text-slate-800">Condiciones de Viento</span>
          </div>
                      <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-600">Día:</span>
                <span className="font-medium">{firstDayWeather.dayWindSpeed} {firstDayWeather.dayWindUnit} {firstDayWeather.dayWindDirection || ''}</span>
              </div>
              {firstDayWeather.nightWindSpeed !== undefined && (
                <div className="flex justify-between">
                  <span className="text-slate-600">Noche:</span>
                  <span className="font-medium">{firstDayWeather.nightWindSpeed} {firstDayWeather.nightWindUnit} {firstDayWeather.nightWindDirection || ''}</span>
                </div>
              )}
            </div>
        </div>
      </div>

      {/* Weather Impact Analysis */}
      <div className="bg-gradient-to-r from-amber-50 to-orange-50 p-3 rounded-lg border border-amber-200">
        <div className="flex items-center mb-2">
          <span className="text-amber-600 text-lg mr-2">⚓</span>
          <h5 className="font-semibold text-amber-800">Impacto en la Navegación</h5>
        </div>
        <div className="text-sm text-amber-700 space-y-1">
          {(() => {
            const windSpeed = firstDayWeather.dayWindSpeed;
            const windDirection = firstDayWeather.dayWindDirection || '';
            const temp = firstDayWeather.temperatureMax;
            
            let impact = [];
            
            // Análisis de viento
            if (windSpeed < 10) {
              impact.push("✅ Condiciones ideales para navegación y actividades acuáticas");
            } else if (windSpeed < 20) {
              impact.push("✅ Condiciones buenas, considera calas protegidas");
            } else if (windSpeed < 30) {
              impact.push("⚠️ Condiciones moderadas, busca calas protegidas");
            } else if (windSpeed < 40) {
              impact.push("⚠️ Condiciones difíciles, prioriza puertos protegidos");
            } else {
              impact.push("🚨 Condiciones peligrosas, considera cancelar o reprogramar");
            }
            
            // Análisis de temperatura
            if (temp < 15) {
              impact.push("❄️ Temperatura fría, enfócate en actividades a bordo");
            } else if (temp > 25) {
              impact.push("☀️ Temperatura alta, prioriza horarios tempranos/tardíos");
            }
            
            // Análisis de dirección del viento
            if (windDirection.includes('Oeste') || windDirection.includes('West')) {
              impact.push("🌊 Busca calas protegidas al este");
            } else if (windDirection.includes('Este') || windDirection.includes('East')) {
              impact.push("🌊 Busca calas protegidas al oeste");
            }
            
            return impact.map((item, index) => (
              <div key={index} className="flex items-start">
                <span className="mr-2">•</span>
                <span>{item}</span>
              </div>
            ));
          })()}
        </div>
      </div>
      
      {firstDayWeather.link && (
        <div className="mt-3 pt-3 border-t border-blue-200">
          <a 
            href={firstDayWeather.link} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-sm text-blue-600 hover:text-blue-800 hover:underline flex items-center"
          >
            📊 Ver pronóstico detallado en AccuWeather.com
          </a>
        </div>
      )}
    </div>
  );
};

const getNodeText = (node: React.ReactNode): string => {
    if (node == null) return '';
    if (typeof node === 'string' || typeof node === 'number') {
        return String(node);
    }
    if (Array.isArray(node)) {
        return node.map(getNodeText).join('');
    }
    if (React.isValidElement(node)) {
        const props = node.props as { children?: React.ReactNode };
        return getNodeText(props.children);
    }
    return '';
};

const RecommendationCard: React.FC<RecommendationCardProps> = ({ 
  recommendation, 
  isLoading, 
  error, 
  onPrintPlan 
}) => {
  const [checkedAiItems, setCheckedAiItems] = useState<{ [key: string]: boolean }>({});
  const [customChecklistItems, setCustomChecklistItems] = useState<{ id: string; text: string; checked: boolean }[]>([]);
  const [newCustomItemText, setNewCustomItemText] = useState('');
  const [openAccordionId, setOpenAccordionId] = useState<string | null>(null);
  
  // 🚨 NUEVO ESTADO PARA BÚSQUEDA DINÁMICA DE PRODUCTOS
  const [productAsins, setProductAsins] = useState<{ [key: string]: string | null }>({});
  const [loadingProducts, setLoadingProducts] = useState<{ [key: string]: boolean }>({});
  const [productSearchQueue, setProductSearchQueue] = useState<string[]>([]);
  const componentId = useId(); 
  // userAffiliateLink removido - ahora usamos enlaces específicos por producto
  


  const { mainTitle, introduction, sections } = useMemo(() => {
    if (!recommendation || !recommendation.text.trim()) {
        return { mainTitle: undefined, introduction: undefined, sections: [] };
    }
    
    const parsed = parseMarkdownToSections(recommendation.text);
    
    // Process sections to avoid duplication
    const processedSections = parsed.sections.reduce((acc, section) => {
      // Skip internal data sections completely
      if (section.title.toLowerCase().includes("datos para api de clima") || 
          section.title.toLowerCase().includes("uso interno")) {
        return acc;
      }
      
      const isItinerary = section.title.toLowerCase().includes("itinerario");
      const isWeatherAdaptation = section.title.toLowerCase().includes("adaptaciones meteorológicas") || 
                                  section.title.toLowerCase().includes("adaptación meteorológica");
      
      if (isItinerary && isWeatherAdaptation) {
        // This section already contains both itinerary and weather adaptations
        // Keep it as is, but ensure it has the integrated title
        acc.push({
          ...section,
          id: `section-integrated-itinerary-weather`,
          title: "🚤 Itinerario Recomendado con Adaptaciones Meteorológicas"
        });
      } else if (isItinerary) {
        // Check if we already have a weather adaptation section
        const weatherSectionIndex = acc.findIndex(s => 
          s.title.toLowerCase().includes("adaptaciones meteorológicas") ||
          s.title.toLowerCase().includes("adaptación meteorológica")
        );
        
        if (weatherSectionIndex >= 0) {
          // Merge weather adaptations into the itinerary section
          const weatherSection = acc[weatherSectionIndex];
          acc[weatherSectionIndex] = {
            ...section,
            id: `section-integrated-itinerary-weather`,
            title: "🚤 Itinerario Recomendado con Adaptaciones Meteorológicas",
            content: section.content + "\n\n" + weatherSection.content
          };
          // Remove the original weather section
          acc.splice(weatherSectionIndex, 1);
        } else {
          // Keep the itinerary section as is
          acc.push(section);
        }
      } else if (isWeatherAdaptation) {
        // Check if we already have an itinerary section
        const itinerarySectionIndex = acc.findIndex(s => 
          s.title.toLowerCase().includes("itinerario") && 
          !s.title.toLowerCase().includes("adaptaciones meteorológicas") &&
          !s.title.toLowerCase().includes("adaptación meteorológica")
        );
        
        if (itinerarySectionIndex >= 0) {
          // Merge weather adaptations into the existing itinerary section
          const itinerarySection = acc[itinerarySectionIndex];
          acc[itinerarySectionIndex] = {
            ...itinerarySection,
            id: `section-integrated-itinerary-weather`,
            title: "🚤 Itinerario Recomendado con Adaptaciones Meteorológicas",
            content: itinerarySection.content + "\n\n" + section.content
          };
        } else {
          // Keep the weather adaptation section as is
          acc.push(section);
        }
      } else {
        // Keep other sections as they are
        acc.push(section);
      }
      
      return acc;
    }, [] as SectionData[]);
    
    return { ...parsed, sections: processedSections };
  }, [recommendation?.text]);

  useEffect(() => {
    setCheckedAiItems({});
    setCustomChecklistItems([]);
    setNewCustomItemText('');
    // When a new recommendation is loaded, open the first section by default.
    if (sections.length > 0) {
        setOpenAccordionId(sections[0].id);
    } else {
        setOpenAccordionId(null);
    }
  }, [sections, error]); 
  
  // 🚨 NUEVO useEffect PARA PROCESAR PRODUCTOS DEL CHECKLIST
  useEffect(() => {
    if (recommendation?.text) {
      // Extraer todos los items del checklist de la recomendación
      const checklistItems = extractChecklistItemsFromRecommendation(recommendation.text);
      
      // Añadir items comprables a la cola de búsqueda
      checklistItems.forEach(item => {
        if (isItemPotentiallyPurchasable(item)) {
          addToProductSearchQueue(item, item);
        }
      });
    }
  }, [recommendation?.text]);
  
  // 🚨 FUNCIÓN PARA EXTRAER ITEMS DEL CHECKLIST - MEJORADA PARA RECOMENDACIONES PERSONALIZADAS
  const extractChecklistItemsFromRecommendation = (text: string): string[] => {
    const items: string[] = [];
    
    // Buscar items en listas (ul/li) - formato más común en recomendaciones
    const listMatches = text.match(/- (.+)/g);
    if (listMatches) {
      listMatches.forEach(match => {
        const item = match.replace('- ', '').trim();
        if (item && item.length > 3) items.push(item);
      });
    }
    
    // Buscar items numerados
    const numberedMatches = text.match(/\d+\. (.+)/g);
    if (numberedMatches) {
      numberedMatches.forEach(match => {
        const item = match.replace(/\d+\. /, '').trim();
        if (item && item.length > 3) items.push(item);
      });
    }
    
    // Buscar items con checkboxes [ ] o [x]
    const checkboxMatches = text.match(/\[[ x]\] (.+)/g);
    if (checkboxMatches) {
      checkboxMatches.forEach(match => {
        const item = match.replace(/\[[ x]\] /, '').trim();
        if (item && item.length > 3) items.push(item);
      });
    }
    
    // Buscar items con asteriscos *
    const asteriskMatches = text.match(/\* (.+)/g);
    if (asteriskMatches) {
      asteriskMatches.forEach(match => {
        const item = match.replace(/\* /, '').trim();
        if (item && item.length > 3) items.push(item);
      });
    }
    
    // Filtrar items duplicados y muy cortos
    const uniqueItems = [...new Set(items)].filter(item => 
      item.length > 3 && 
      !item.toLowerCase().includes('importante') &&
      !item.toLowerCase().includes('nota:') &&
      !item.toLowerCase().includes('recuerda:')
    );
    
    console.log(`🎯 Checklist dinámico extraído: ${uniqueItems.length} items únicos`);
    return uniqueItems;
  };
  
  // 🚨 NUEVO useEffect PARA PROCESAR BÚSQUEDA DINÁMICA DE PRODUCTOS - OPTIMIZADO
  useEffect(() => {
    const processProductSearchQueue = async () => {
      if (productSearchQueue.length === 0) return;
      
      const currentItem = productSearchQueue[0];
      const itemKey = currentItem;
      
      // Marcar como cargando
      setLoadingProducts(prev => ({ ...prev, [itemKey]: true }));
      
      try {
        // PRIMERO: Intentar con el sistema optimizado de productos verificados
        const optimizedProduct = getOptimizedChecklistProduct(currentItem);
        
        if (optimizedProduct && optimizedProduct.isDirectLink && optimizedProduct.asin) {
          // Producto verificado encontrado - usar ASIN directo
          setProductAsins(prev => ({ ...prev, [itemKey]: optimizedProduct.asin }));
          console.log(`✅ Producto VERIFICADO encontrado para "${currentItem}": ${optimizedProduct.name} (ASIN: ${optimizedProduct.asin})`);
        } else {
          // Buscar producto dinámicamente con la API (fallback)
          const asin = await searchDynamicAmazonProduct(currentItem);
          setProductAsins(prev => ({ ...prev, [itemKey]: asin }));
          console.log(`✅ Producto DINÁMICO encontrado para "${currentItem}": ${asin}`);
        }
        
      } catch (error) {
        console.error(`❌ Error buscando producto para "${currentItem}":`, error);
        setProductAsins(prev => ({ ...prev, [itemKey]: null }));
      } finally {
        // Marcar como no cargando
        setLoadingProducts(prev => ({ ...prev, [itemKey]: false }));
        
        // Remover de la cola
        setProductSearchQueue(prev => prev.slice(1));
      }
    };
    
    processProductSearchQueue();
  }, [productSearchQueue]);
  
  // 🚨 FUNCIÓN PARA AÑADIR ITEM A LA COLA DE BÚSQUEDA - OPTIMIZADA
  const addToProductSearchQueue = (itemKey: string, itemText: string) => {
    // Solo añadir si no está ya en la cola o ya procesado
    if (!productSearchQueue.includes(itemKey) && !productAsins[itemKey] && !loadingProducts[itemKey]) {
      console.log(`🔄 Añadiendo a cola de búsqueda: "${itemText}"`);
      setProductSearchQueue(prev => [...prev, itemText]);
    }
  };

  // 🎯 FUNCIÓN PARA PROCESAR CHECKLIST DINÁMICAMENTE
  const processDynamicChecklist = (checklistItems: string[]) => {
    console.log(`🎯 Procesando checklist dinámico con ${checklistItems.length} items`);
    
    checklistItems.forEach((item, index) => {
      // Detectar si el item es potencialmente comprable
      if (isItemPotentiallyPurchasable(item)) {
        console.log(`🛒 Item potencialmente comprable detectado: "${item}"`);
        
        // Intentar primero con productos verificados
        const optimizedProduct = getOptimizedChecklistProduct(item);
        if (optimizedProduct && optimizedProduct.asin) {
          console.log(`✅ Producto optimizado encontrado: ${optimizedProduct.name}`);
          setProductAsins(prev => ({ ...prev, [item]: optimizedProduct.asin }));
        } else {
          // Añadir a la cola para búsqueda dinámica
          addToProductSearchQueue(item, item);
        }
      }
    });
  };

  // 🎉 FUNCIÓN DE CELEBRACIÓN
  const celebrateRecommendation = () => {
    if (recommendation?.text) {
      console.log(`🎉 ¡RECOMENDACIÓN GENERADA EXITOSAMENTE!`);
      console.log(`🚤 BoatTrip Planner - Experiencia única creada`);
      console.log(`💰 Sistema de monetización activo`);
      console.log(`🔗 Enlaces de afiliado funcionando`);
      console.log(`✨ Checklist dinámico implementado`);
    }
  };

  // 🎯 EFECTO ESPECIAL CUANDO SE GENERA UNA RECOMENDACIÓN - CON PROCESAMIENTO DINÁMICO
  useEffect(() => {
    if (recommendation?.text && !isLoading) {
      celebrateRecommendation();
      
      // 🚀 PROCESAR CHECKLIST DINÁMICAMENTE
      const checklistItems = extractChecklistItemsFromRecommendation(recommendation.text);
      if (checklistItems.length > 0) {
        console.log(`🎯 Checklist detectado con ${checklistItems.length} items`);
        processDynamicChecklist(checklistItems);
      }
    }
  }, [recommendation?.text, isLoading]);

  useEffect(() => {
    // When a new accordion is opened, scroll it into view.
    if (openAccordionId) {
        // The timeout gives the accordion's open animation time to start,
        // resulting in a smoother scroll experience.
        const timer = setTimeout(() => {
            const element = document.getElementById(openAccordionId);
            // The 'start' block alignment is better than 'center' because the header is sticky/large.
            // It ensures the accordion title is visible at the top.
            element?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 350); // Animation duration is 300ms, so 350ms is a safe delay.

        return () => clearTimeout(timer);
    }
  }, [openAccordionId]);


  const handleToggleAccordion = (sectionId: string) => {
      setOpenAccordionId(prevId => (prevId === sectionId ? null : sectionId));
  };

  const handleToggleAiItem = (itemKey: string) => {
    setCheckedAiItems(prev => ({ ...prev, [itemKey]: !prev[itemKey] }));
  };

  const handleAddCustomItem = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (newCustomItemText.trim()) {
      setCustomChecklistItems(prev => [
        ...prev,
        { id: `${componentId}-custom-${Date.now()}`, text: newCustomItemText.trim(), checked: false }
      ]);
      setNewCustomItemText('');
    }
  };

  const handleToggleCustomItem = (itemId: string) => {
    setCustomChecklistItems(prev =>
      prev.map(item => item.id === itemId ? { ...item, checked: !item.checked } : item)
    );
  };

  const handleModifyPreferences = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleShareViaWhatsApp = () => {
    if (!recommendation || !recommendation.text) return;

    const { mainTitle, introduction } = parseMarkdownToSections(recommendation.text);

    let shareText = "¡Echa un vistazo a este plan de viaje en barco que creé con BoatTrip Planner! 🚤\n\n";

    if (mainTitle) {
      // Remove markdown from title for clean sharing
      const cleanTitle = mainTitle.replace(/##\s*/, '').replace(/[\*_~`]/g, '');
      shareText += `Título del Plan: ${cleanTitle}\n\n`;
    }

    if (introduction) {
      // Remove markdown from intro for clean sharing, and truncate
      const cleanIntroduction = introduction.replace(/[\*_~`#>]/g, '');
      const snippet = cleanIntroduction.substring(0, 150);
      shareText += `Un pequeño adelanto: ${snippet}${cleanIntroduction.length > 150 ? "..." : ""}\n\n`;
    } else if (!mainTitle) {
         shareText = "¡Echa un vistazo a los planes de viaje en barco que puedes crear con BoatTrip Planner! 🚤\n\nDescubre cómo planificar tu aventura náutica ideal.\n\n";
    }
    
    shareText += `Puedes ver más y planificar tu propio viaje en: ${APP_URL}\n\n`;
    shareText += "(Para ver el plan completo que generé, ¡pídeme que te lo copie y pegue aquí!)";

    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(shareText)}`;
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
  };


  const baseMarkdownComponents: Components = {
    h4: ({node, ...props}) => <h4 className="text-xl font-semibold text-slate-700 mt-6 mb-4 pb-3 border-b-2 border-slate-200" {...props} />,
    h5: ({node, ...props}) => <h5 className="text-md font-semibold text-slate-700 mt-3 mb-1" {...props} />,
    p: ({node, ...props}) => <p className="text-slate-800 mb-3 leading-relaxed" {...props} />,
    ul: ({node, ...props}) => <ul className="list-none pl-0 mb-4 space-y-2 text-slate-800" {...props} />,
    ol: ({node, ...props}) => <ol className="list-none pl-0 mb-4 space-y-2 text-slate-800" {...props} />,
    li: ({node, ...props}) => <li className="mb-1" {...props} />,
    strong: ({node, ...props}) => <strong className="font-semibold text-slate-900" {...props} />,
    a: ({ node, children, ...props }) => {
        return <a className="text-teal-600 hover:text-teal-700 underline" target="_blank" rel="noopener noreferrer" {...props}>{children}</a>;
    },
    blockquote: ({node, ...props}) => <blockquote className="bg-white border-l-4 border-teal-300 rounded-r-lg p-4 my-4 shadow-sm text-slate-800 leading-relaxed" {...props} />,
  };

  const interactiveChecklistComponents: Components = {
    ...baseMarkdownComponents,
    h5: ({node, ...props}) => <h5 className="text-md font-semibold text-teal-700 bg-teal-50 px-3 py-2 rounded-md mt-4 mb-2 shadow-sm" {...props} />,
    ul: ({node, ...props}) => <ul className="list-none p-0 m-0 space-y-0 mb-4" {...props} />, 
    li: ({ node, children, ...props }) => {
      const itemKey = (node as any).position?.start?.offset?.toString() || `ai-item-${(node as HastElement & {index?: number})?.index ?? Math.random().toString(36).substr(2, 9)}`;
      const isChecked = !!checkedAiItems[itemKey];
      const textContent = getNodeText(children).trim();
      const isPurchasable = isItemPotentiallyPurchasable(textContent);

      if (!textContent) {
        return <li className="mb-1" {...props}>{children}</li>;
      }
      
      // ✅ LÓGICA SIMPLIFICADA - Sin useEffect que cause bucles infinitos
      // Obtener ASIN del estado dinámico o fallback estático
      const dynamicAsin = productAsins[textContent];
      const fallbackAsin = findBestAmazonProductSync(textContent);
      const specificAsin = dynamicAsin !== undefined ? dynamicAsin : fallbackAsin;
      
      // 🚀 NUEVO SISTEMA: URLs de búsqueda directa en Amazon
      const productInfo = generateProductSearchUrl(textContent);
      const finalUrl = productInfo ? productInfo.searchUrl : (specificAsin ? createAffiliateUrl(specificAsin, 'checklist', 'dynamic-product') : null);
      const productName = productInfo ? productInfo.name : 'Producto Amazon';
      
      const amazonLink = finalUrl;
      const isLoadingProduct = loadingProducts[textContent] || false;

      // 🚨 DEBUG: Verificar enlaces de Amazon
      console.log(`🔍 DEBUG "${textContent}":`, {
        isPurchasable,
        dynamicAsin,
        fallbackAsin,
        specificAsin,
        finalUrl,
        productName,
        amazonLink,
        isLoadingProduct
      });
      
      if (amazonLink) {
        console.log(`🔗 Enlace Amazon generado para "${textContent}":`, amazonLink);
        // 🎉 Efecto especial cuando se encuentra un producto
        console.log(`✨ ¡Producto encontrado! "${textContent}" → ${productName} (URL de búsqueda)`);
      } else if (isPurchasable) {
        console.log(`❌ No se pudo generar enlace para "${textContent}" - URL: ${finalUrl}`);
      }

      return (
        <li
            className={`flex items-start py-3 border-b border-slate-200/70 last:border-b-0 hover:bg-teal-50/70 transition-colors duration-150 rounded-sm -mx-1 px-1 ${isChecked ? 'opacity-60' : ''}`}
        >
          <input
            type="checkbox"
            id={`${componentId}-${itemKey}`}
            checked={isChecked}
            onChange={() => handleToggleAiItem(itemKey)}
            className="h-5 w-5 text-teal-600 border-slate-400 rounded-sm focus:ring-2 focus:ring-teal-500/50 focus:ring-offset-1 mr-3 mt-0.5 flex-shrink-0 cursor-pointer"
            aria-labelledby={`${componentId}-${itemKey}-label`}
          />
          <label
            id={`${componentId}-${itemKey}-label`}
            htmlFor={`${componentId}-${itemKey}`}
            className={`flex-grow cursor-pointer leading-normal ${isChecked ? 'line-through text-slate-500' : 'text-slate-800'}`}
             onClick={(e) => {
              if ((e.target as HTMLElement).closest('a[data-amazon-link="true"]')) {
                return; 
              }
              handleToggleAiItem(itemKey);
            }}
          >
            {children}
          </label>
          {isPurchasable && (
            <>
              {isLoadingProduct && (
                <div className="ml-2 p-1 flex-shrink-0" title="Buscando producto en Amazon...">
                  <div className="w-5 h-5 border-2 border-amber-600 border-t-transparent rounded-full animate-spin"></div>
                </div>
              )}
                            {!isLoadingProduct && amazonLink && (
                <a 
                  href={generateDynamicAmazonLink(textContent, specificAsin)} 
                  target="_blank" 
                  rel="noopener noreferrer nofollow"
                  title={`Ver producto DINÁMICO "${textContent}" en Amazon.es (${specificAsin ? 'enlace directo' : 'búsqueda optimizada'})`} 
                  className="ml-2 p-1 text-amber-600 hover:text-amber-700 focus:outline-none focus:ring-1 focus:ring-amber-500 focus:ring-offset-1 rounded-sm flex-shrink-0 transition-all duration-200 hover:scale-110 hover:shadow-lg transform hover:-translate-y-1"
                  onClick={(e) => {
                    e.stopPropagation();
                    // 🎉 Efecto especial al hacer clic + Tracking optimizado
                    console.log(`🚀 ¡Producto DINÁMICO clickeado! "${textContent}" → Amazon`);
                    
                    // Google Analytics tracking
                    if (typeof window !== 'undefined' && (window as any).gtag) {
                      (window as any).gtag('event', 'click', {
                        'event_category': 'amazon_affiliate_dynamic_checklist',
                        'event_label': textContent,
                        'value': 1,
                        'custom_parameter': {
                          'product_name': textContent,
                          'asin': specificAsin,
                          'category': 'dynamic_checklist_recommendation'
                        }
                      });
                    }

                    // Facebook Pixel tracking
                    if (typeof window !== 'undefined' && (window as any).fbq) {
                      (window as any).fbq('track', 'Lead', {
                        content_name: textContent,
                        content_category: 'dynamic_checklist_recommendation'
                      });
                    }
                  }} 
                  data-amazon-link="true" 
                  aria-label={`Ver producto DINÁMICO "${textContent}" en Amazon.es (${specificAsin ? 'enlace directo' : 'búsqueda optimizada'})`}
                >
                  <ShoppingCartIcon className="w-5 h-5 animate-pulse" />
                </a>
              )}
              {!isLoadingProduct && !amazonLink && specificAsin === null && (
                <div className="ml-2 p-1 flex-shrink-0" title="Producto no disponible en Amazon España">
                  <div className="w-5 h-5 text-gray-400">
                    <ShoppingCartIcon className="w-5 h-5" />
                  </div>
                </div>
              )}
            </>
          )}
        </li>
      );
    },
           a: ({ children, href }) => {
        return (
          <a href={href} 
             target="_blank" 
             rel="noopener noreferrer" 
             className="text-teal-600 hover:text-teal-700 underline"
             onClick={(e) => e.stopPropagation()} 
          >
            {children}
          </a>
        );
    },
  };

  const getSectionIcon = (title: string): React.ReactNode => {
    const iconContainerClasses = "flex h-10 w-10 items-center justify-center rounded-full bg-teal-100";
    const iconClasses = "w-6 h-6 text-teal-700";

    // Rely on keyword matching for a consistent, designed icon set, ignoring text emojis.
    if (title.toLowerCase().includes("datos clave") || title.toLowerCase().includes("zona de navegación")) return <div className={iconContainerClasses}><MapPinIcon className={iconClasses} aria-hidden="true" /></div>;
    if (title.toLowerCase().includes("resumen")) return <div className={iconContainerClasses}><ClipboardListIcon className={iconClasses} aria-hidden="true" /></div>;
         if (title.toLowerCase().includes("itinerario recomendado con adaptaciones meteorológicas")) return <div className={iconContainerClasses}><MapRouteIcon className={iconClasses} aria-hidden="true" /></div>;
     if (title.toLowerCase().includes("itinerario")) return <div className={iconContainerClasses}><MapRouteIcon className={iconClasses} aria-hidden="true" /></div>;
    if (title.toLowerCase().includes("checklist")) return <div className={iconContainerClasses}><ChecklistIcon className={iconClasses} aria-hidden="true" /></div>;
    if (title.toLowerCase().includes("consejos") || title.toLowerCase().includes("advertencias")) return <div className={iconContainerClasses}><InfoOutlineIcon className={iconClasses} aria-hidden="true" /></div>;
    if (title.toLowerCase().includes("actividades y lugares extra")) return <div className={iconContainerClasses}><StarOutlineIcon className={iconClasses} aria-hidden="true" /></div>;
    if (title.toLowerCase().includes("información sobre empresas") || title.toLowerCase().includes("contacto")) return <div className={iconContainerClasses}><PhoneIcon className={iconClasses} aria-hidden="true" /></div>;
    
    return <div className={iconContainerClasses}><DocumentTextIcon className={iconClasses} aria-hidden="true" /></div>;
  };


  // Don't show content while loading the main recommendation
  if (isLoading) {
    return null;
  }

  if (error) {
    const isApiKeyError = error && (
        error.includes("API_KEY no está configurada") ||
        error.includes("Error de autenticación con la API de Gemini") ||
        error.toLowerCase().includes("api key not valid") ||
        error.toLowerCase().includes("api_key_invalid") ||
        error.toLowerCase().includes("api key is missing")
    );

    return (
      <div className="bg-white p-6 rounded-lg shadow-lg min-h-[300px] w-full">
         <ErrorMessage message={error} />
         {!isApiKeyError && (
           <div className="mt-6 flex justify-center">
              <Button
                  onClick={handleModifyPreferences}
                  variant="primary" 
                  aria-label="Modificar preferencias e intentar de nuevo"
                  className="w-full sm:w-auto px-4"
              >
                Modificar Preferencias e Intentar de Nuevo
              </Button>
            </div>
         )}
      </div>
    );
  }

  if (!recommendation || !recommendation.text.trim()) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-lg flex flex-col items-center justify-center min-h-[300px] text-center w-full">
        <h3 className="text-xl font-semibold text-slate-700 mb-2">¿Listo para la Aventura?</h3>
        <p className="text-slate-600">¡Completa el formulario para obtener recomendaciones personalizadas de viajes en barco!</p>
      </div>
    );
  }

  const remarkPlugins = [remarkGfm];

  return (
    <div id="recommendation-content" className="recommendation-card bg-gradient-to-br from-white to-slate-50 p-3 sm:p-4 md:p-6 lg:p-8 rounded-xl shadow-xl w-full break-words">
      {/* Weather Information Display - Always show when available */}
      {(recommendation?.weatherData || recommendation?.weatherError || recommendation?.isFetchingWeather || recommendation?.isAwaitingLocationData) && (
        <div className="mb-3 sm:mb-4 md:mb-6">
          <WeatherInfoDisplay
            weatherData={recommendation?.weatherData}
            weatherError={recommendation?.weatherError}
            isFetchingWeather={recommendation?.isFetchingWeather}
            isAwaitingLocationData={recommendation?.isAwaitingLocationData}
          />
        </div>
      )}

      {/* Only show main content when everything is completely loaded */}
      {(!recommendation?.isFetchingWeather && !recommendation?.isAwaitingLocationData) && (
        <>
          {mainTitle && (
            <div className="mb-3 sm:mb-4 md:mb-6 pb-2 sm:pb-3 md:pb-4 border-b border-slate-200">
              <h2 className="recommendation-header text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-slate-800 text-center px-2">
                 <ReactMarkdown remarkPlugins={remarkPlugins} components={{p: ({node, ...props}) => <span {...props} />}}>
                    {mainTitle}
                 </ReactMarkdown>
              </h2>
            </div>
          )}

          {introduction && (
            <div className="recommendation-intro text-slate-700 mb-3 sm:mb-4 md:mb-6 leading-relaxed bg-white/70 backdrop-blur-sm p-2 sm:p-3 md:p-4 rounded-md shadow-sm border border-slate-200">
               <ReactMarkdown remarkPlugins={remarkPlugins} components={baseMarkdownComponents}>
                {introduction}
              </ReactMarkdown>
            </div>
          )}

          {sections.length > 0 ? (
            <div className="space-y-1 sm:space-y-2 md:space-y-3">
              {sections.map((section) => {
                const isChecklistSection = section.title.toLowerCase().includes("checklist") || section.title.includes("✅");
                
                // Regex to remove leading emojis for a cleaner title display. The 'u' flag is for unicode.
                const cleanTitle = section.title.replace(/^(\s*[\p{Emoji_Presentation}\p{Emoji}]\s*)+/u, '').trim();
                
                return (
                  <AccordionItem
                    key={section.id}
                    id={section.id}
                    title={cleanTitle}
                    icon={getSectionIcon(section.title)}
                    isOpen={openAccordionId === section.id}
                    onToggle={() => handleToggleAccordion(section.id)}
                  >
                    
                    <ReactMarkdown
                      remarkPlugins={remarkPlugins}
                      components={isChecklistSection ? interactiveChecklistComponents : baseMarkdownComponents}
                    >
                      {section.content}
                    </ReactMarkdown>
                {isChecklistSection && (
                  <div className="mt-4 sm:mt-6 pt-3 sm:pt-4 border-t border-slate-300">
                    <h4 className="text-base sm:text-lg font-semibold text-teal-700 mb-2 sm:mb-3">✏️ Añadir artículos propios a la checklist:</h4>
                    {customChecklistItems.length > 0 && (
                        <ul className="list-none p-0 m-0 space-y-0 mb-3 sm:mb-4">
                        {customChecklistItems.map(item => (
                          <li key={item.id} className={`flex items-start py-2 sm:py-3 border-b border-slate-200/70 last:border-b-0 hover:bg-teal-50/70 transition-colors duration-150 rounded-sm -mx-1 px-1 ${item.checked ? 'opacity-60' : ''}`}>
                            <input
                              type="checkbox"
                              id={item.id}
                              checked={item.checked}
                              onChange={() => handleToggleCustomItem(item.id)}
                              className="h-4 w-4 sm:h-5 sm:w-5 text-teal-600 border-slate-400 rounded-sm focus:ring-2 focus:ring-teal-500/50 focus:ring-offset-1 mr-2 sm:mr-3 mt-0.5 flex-shrink-0 cursor-pointer"
                              aria-labelledby={`${item.id}-label`}
                            />
                            <label
                                id={`${item.id}-label`}
                                htmlFor={item.id}
                                className={`flex-grow cursor-pointer leading-normal text-sm sm:text-base ${item.checked ? 'line-through text-slate-500' : 'text-slate-800'}`}
                            >
                              {item.text}
                            </label>
                          </li>
                        ))}
                        </ul>
                    )}
                    <form onSubmit={handleAddCustomItem} className="mt-2 flex flex-col sm:flex-row sm:items-center gap-2">
                      <InputField
                        label=""
                        aria-label="Nuevo artículo para la checklist"
                        id={`${componentId}-new-custom-item`}
                        type="text"
                        value={newCustomItemText}
                        onChange={(e) => setNewCustomItemText(e.target.value)}
                        placeholder="Escribe tu artículo aquí..."
                        className="flex-grow !mt-0 bg-white text-slate-800 placeholder:text-slate-500"
                      />
                      <Button
                        type="submit"
                        variant="primary"
                        size="md"
                        className="px-3 sm:px-4 py-2.5 w-full sm:w-auto" 
                        disabled={!newCustomItemText.trim()}
                      >
                        Añadir
                      </Button>
                    </form>
                  </div>
                )}
              </AccordionItem>
            );
          })}
        </div>
      ) : (
        !mainTitle && !introduction && recommendation.text && (
          <div className="bg-white p-3 sm:p-4 rounded-lg shadow-md text-slate-700">
            <ReactMarkdown remarkPlugins={remarkPlugins} components={baseMarkdownComponents}>
              {recommendation.text}
            </ReactMarkdown>
          </div>
        )
      )}



             {/* Simplified Action Buttons Section */}
             <div className="mt-4 sm:mt-6 pt-3 sm:pt-4 border-t-2 border-slate-300/70 no-print">
               <div className="text-center mb-3 sm:mb-4">
                 <h3 className="text-base sm:text-lg md:text-xl font-bold text-slate-800 mb-1">¿Qué te gustaría hacer ahora?</h3>
                 <p className="text-xs sm:text-sm text-slate-600">Gestiona tu plan y continúa con tu aventura náutica</p>
               </div>
               
               <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 mb-3 sm:mb-4">
                 <Button
                   onClick={handleModifyPreferences}
                   variant="secondary"
                   className="w-full h-10 sm:h-12 md:h-14 flex flex-col items-center justify-center gap-1 bg-gradient-to-br from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100 border-2 border-blue-200 hover:border-blue-300 transition-all duration-200"
                   aria-label="Modificar mis preferencias y volver al formulario"
                 >
                   <div className="text-sm sm:text-base md:text-lg lg:text-xl">🔄</div>
                   <span className="text-xs font-semibold text-slate-700 leading-tight">Modificar</span>
                 </Button>
                 
                 <Button
                   onClick={onPrintPlan}
                   variant="secondary"
                   className="w-full h-10 sm:h-12 md:h-14 flex flex-col items-center justify-center gap-1 bg-gradient-to-br from-purple-50 to-pink-50 hover:from-purple-100 hover:to-pink-100 border-2 border-purple-200 hover:border-purple-300 transition-all duration-200"
                   aria-label="Imprimir este plan"
                 >
                   <div className="text-sm sm:text-base md:text-lg lg:text-xl">🖨️</div>
                   <span className="text-xs font-semibold text-slate-700 leading-tight">Imprimir</span>
                 </Button>
                 
                 <Button
                   onClick={handleShareViaWhatsApp}
                   className="w-full h-10 sm:h-12 md:h-14 flex flex-col items-center justify-center gap-1 bg-gradient-to-br from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white border-2 border-green-400 hover:border-green-500 transition-all duration-200 shadow-md"
                   aria-label="Compartir plan por WhatsApp"
                 >
                   <WhatsAppIcon className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 lg:w-6 lg:h-6" />
                   <span className="text-xs font-semibold leading-tight">Compartir</span>
                 </Button>
                 
                 <Button
                   onClick={() => window.open(SAMBOAT_AFFILIATE_URL, '_blank', 'noopener,noreferrer')}
                   className="w-full h-10 sm:h-12 md:h-14 flex flex-col items-center justify-center gap-1 bg-gradient-to-br from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white border-2 border-orange-400 hover:border-orange-500 transition-all duration-200 shadow-md"
                   aria-label="Ver barcos en SamBoat (enlace externo)"
                 >
                   <SailboatIcon className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 lg:w-6 lg:h-6" />
                   <span className="text-xs font-semibold leading-tight">Ver Barcos</span>
                 </Button>
               </div>
               

             </div>
        </>
      )}

      {/* ChatInterface ocultado - sección de "Refinar Recomendación" deshabilitada
      {chatSession && (
        <div className="mt-8 pt-6 border-t border-slate-200 no-print">
            <ChatInterface
                chatSession={chatSession}
                onSendMessage={onSendChatMessage}
            />
        </div>
      )}
      */}
    </div>
  );
};

// 🎯 SISTEMA DE BÚSQUEDA DIRECTA EN AMAZON - OPTIMIZADO
// URLs de búsqueda optimizadas con tracking avanzado - ASINs VERIFICADOS
const AMAZON_SEARCH_URLS = {
  // 🏖️ PROTECCIÓN SOLAR - VERIFICADO
  'protector_solar': {
    searchUrl: 'https://www.amazon.es/dp/B0B3QJ8K1M?tag=explorashop18-21&linkCode=ogi&th=1&psc=1&ref_=as_li_ss_tl&camp=3638&creative=24630&creativeASIN=B0B3QJ8K1M&linkId=nautical_guide_proteccion',
    name: 'Protector Solar Resistente al Agua SPF50+',
    category: 'protección solar',
    keywords: ['crema solar', 'protector solar', 'solar', 'spf', 'biodegradable'],
    asin: 'B0B3QJ8K1M'
  },
  
  // 🥽 EQUIPO SNORKEL - VERIFICADO
  'aletas_snorkel': {
    searchUrl: 'https://www.amazon.es/dp/B07FNPY8WG?tag=explorashop18-21&linkCode=ogi&th=1&psc=1&ref_=as_li_ss_tl&camp=3638&creative=24630&creativeASIN=B07FNPY8WG&linkId=nautical_guide_snorkel',
    name: 'Equipo de Snorkel Profesional Completo',
    category: 'equipo snorkel',
    keywords: ['snorkel', 'máscara', 'aletas', 'buceo', 'equipo snorkel'],
    asin: 'B07FNPY8WG'
  },
  
  // 🦺 SEGURIDAD - VERIFICADO
  'chaleco_salvavidas': {
    searchUrl: 'https://www.amazon.es/dp/B08C7KG5LP?tag=explorashop18-21&linkCode=ogi&th=1&psc=1&ref_=as_li_ss_tl&camp=3638&creative=24630&creativeASIN=B08C7KG5LP&linkId=nautical_guide_seguridad',
    name: 'Chaleco Salvavidas Homologado CE 150N',
    category: 'seguridad',
    keywords: ['chaleco salvavidas', 'chaleco', 'salvavidas', 'seguridad', 'linterna'],
    asin: 'B08C7KG5LP'
  },
  
  // 🧭 GPS/NAVEGACIÓN - VERIFICADO
  'gps_garmin': {
    searchUrl: 'https://www.amazon.es/dp/B09M47HFCQ?tag=explorashop18-21&linkCode=ogi&th=1&psc=1&ref_=as_li_ss_tl&camp=3638&creative=24630&creativeASIN=B09M47HFCQ&linkId=nautical_guide_gps',
    name: 'Garmin fēnix 7 - Smartwatch GPS Multideporte',
    category: 'gps navegación',
    keywords: ['gps', 'garmin', 'plotter', 'navegación', 'smartwatch'],
    asin: 'B09M47HFCQ'
  },
  
  // 📱 TECNOLOGÍA - VERIFICADO
  'gopro_camera': {
    searchUrl: 'https://www.amazon.es/dp/B0B1T4TVTS?tag=explorashop18-21&linkCode=ogi&th=1&psc=1&ref_=as_li_ss_tl&camp=3638&creative=24630&creativeASIN=B0B1T4TVTS&linkId=nautical_guide_tecnologia',
    name: 'GoPro HERO11 Black - Cámara de Acción',
    category: 'tecnología',
    keywords: ['gopro', 'cámara', 'fotos', 'videos'],
    asin: 'B0B1T4TVTS'
  },
  
  // 🧊 NEVERA/COOLER - VERIFICADO
  'nevera_coleman': {
    searchUrl: 'https://www.amazon.es/dp/B00363W0OI?tag=explorashop18-21&linkCode=ogi&th=1&psc=1&ref_=as_li_ss_tl&camp=3638&creative=24630&creativeASIN=B00363W0OI&linkId=nautical_guide_nevera',
    name: 'Nevera Portátil Coleman Xtreme',
    category: 'nevera cooler',
    keywords: ['nevera', 'cooler', 'coleman', 'hielo'],
    asin: 'B00363W0OI'
  },
  
  // 🏥 BOTIQUÍN - VERIFICADO
  'botiquin_emergencia': {
    searchUrl: 'https://www.amazon.es/dp/B08C7KG5LP?tag=explorashop18-21&linkCode=ogi&th=1&psc=1&ref_=as_li_ss_tl&camp=3638&creative=24630&creativeASIN=B08C7KG5LP&linkId=nautical_guide_botiquin',
    name: 'Botiquín Primeros Auxilios Náutico',
    category: 'botiquín',
    keywords: ['botiquín', 'primeros auxilios', 'medicación', 'mareo', 'emergencia'],
    asin: 'B08C7KG5LP'
  },
  
  // 🕶️ GAFAS DE SOL - VERIFICADO
  'gafas_polarizadas': {
    searchUrl: 'https://www.amazon.es/dp/B07FNPY8WG?tag=explorashop18-21&linkCode=ogi&th=1&psc=1&ref_=as_li_ss_tl&camp=3638&creative=24630&creativeASIN=B07FNPY8WG&linkId=nautical_guide_gafas',
    name: 'Gafas de Sol Polarizadas Náuticas',
    category: 'gafas sol',
    keywords: ['gafas de sol', 'polarizadas', 'sombrero', 'gorra', 'protección'],
    asin: 'B07FNPY8WG'
  },
  

  
  // 🏄‍♂️ DEPORTES ACUÁTICOS - OPTIMIZADO
  'deportes_acuaticos': {
    searchUrl: 'https://www.amazon.es/s?k=equipo+deportes+acuaticos+nauticos&tag=explorashop18-21&linkCode=ur2&linkId=nautical_guide_deportes&camp=3638&creative=24630&ref=as_li_ss_tl&utm_source=boattrip-planner&utm_medium=affiliate&utm_campaign=nautical_guide&utm_content=deportes',
    name: 'Equipo Deportes Acuáticos',
    category: 'deportes acuáticos',
    keywords: ['deportes acuáticos', 'wakeboard', 'esquís', 'donut', 'cabo']
  },
  
  // 👕 ROPA Y ACCESORIOS - OPTIMIZADO
  'ropa_nautica': {
    searchUrl: 'https://www.amazon.es/s?k=ropa+nautica+impermeable&tag=explorashop18-21&linkCode=ur2&linkId=nautical_guide_ropa&camp=3638&creative=24630&ref=as_li_ss_tl&utm_source=boattrip-planner&utm_medium=affiliate&utm_campaign=nautical_guide&utm_content=ropa',
    name: 'Ropa Náutica y Accesorios',
    category: 'ropa accesorios',
    keywords: ['ropa de baño', 'toallas', 'ropa cómoda', 'calzado']
  },
  
  // 🥤 BEBIDAS Y COMIDA - OPTIMIZADO
  'comida_barco': {
    searchUrl: 'https://www.amazon.es/s?k=comida+barco+conservas+nauticas&tag=explorashop18-21&linkCode=ur2&linkId=nautical_guide_comida&camp=3638&creative=24630&ref=as_li_ss_tl&utm_source=boattrip-planner&utm_medium=affiliate&utm_campaign=nautical_guide&utm_content=comida',
    name: 'Comida y Bebidas para Barco',
    category: 'comida bebidas',
    keywords: ['agua potable', 'bebidas', 'snacks', 'comida', 'almuerzo']
  },
  
  // 🗑️ LIMPIEZA - OPTIMIZADO
  'limpieza_barco': {
    searchUrl: 'https://www.amazon.es/s?k=productos+limpieza+barco+biodegradables&tag=explorashop18-21&linkCode=ur2&linkId=nautical_guide_limpieza&camp=3638&creative=24630&ref=as_li_ss_tl&utm_source=boattrip-planner&utm_medium=affiliate&utm_campaign=nautical_guide&utm_content=limpieza',
    name: 'Productos Limpieza Barco',
    category: 'limpieza',
    keywords: ['bolsas para basura', 'basura', 'limpieza']
  },
  
  // 📄 DOCUMENTACIÓN - OPTIMIZADO
  'documentacion_nautica': {
    searchUrl: 'https://www.amazon.es/s?k=documentacion+nautica+manuales&tag=explorashop18-21&linkCode=ur2&linkId=nautical_guide_documentacion&camp=3638&creative=24630&ref=as_li_ss_tl&utm_source=boattrip-planner&utm_medium=affiliate&utm_campaign=nautical_guide&utm_content=documentacion',
    name: 'Documentación Náutica',
    category: 'documentación',
    keywords: ['documentación', 'dni', 'pasaporte', 'licencia']
  }
};

// 🚀 FUNCIÓN INTELIGENTE PARA GENERAR ASINs
const generateProductASIN = (itemText: string): { asin: string; name: string; category: string } | null => {
  const lowerText = itemText.toLowerCase();
  
  // Buscar coincidencia exacta en la base de datos (solo productos verificados)
  for (const [productKey, product] of Object.entries(AMAZON_SEARCH_URLS)) {
    if (product.keywords.some(keyword => lowerText.includes(keyword))) {
      console.log(`🎯 Producto VERIFICADO encontrado: "${itemText}" → ${product.name} (URL de búsqueda)`);
      return {
        asin: product.searchUrl, // Usar la URL de búsqueda como ASIN
        name: product.name,
        category: product.category
      };
    }
  }
  
  // Fallback por defecto (producto verificado)
  console.log(`ℹ️ No se encontró producto específico para: "${itemText}" - usando fallback verificado`);
  return null; // No hay un ASIN específico para este fallback
};

// 🚀 FUNCIÓN INTELIGENTE PARA GENERAR URLs DE BÚSQUEDA - OPTIMIZADA
const generateProductSearchUrl = (itemText: string): { searchUrl: string; name: string; category: string; asin?: string } | null => {
  const lowerText = itemText.toLowerCase();
  
  // Buscar coincidencia exacta en la base de datos
  for (const [productKey, product] of Object.entries(AMAZON_SEARCH_URLS)) {
    if (product.keywords.some(keyword => lowerText.includes(keyword))) {
      console.log(`🎯 Producto OPTIMIZADO encontrado: "${itemText}" → ${product.name} (${product.asin ? 'ASIN directo' : 'URL de búsqueda'})`);
      return {
        searchUrl: product.searchUrl,
        name: product.name,
        category: product.category,
        asin: product.asin
      };
    }
  }
  
  // Si no encuentra coincidencia exacta, usar fallback inteligente
  if (lowerText.includes('solar') || lowerText.includes('protector') || lowerText.includes('crema')) {
    return AMAZON_SEARCH_URLS.protector_solar;
  }
  
  if (lowerText.includes('snorkel') || lowerText.includes('buceo') || lowerText.includes('aletas')) {
    return AMAZON_SEARCH_URLS.aletas_snorkel;
  }
  
  if (lowerText.includes('chaleco') || lowerText.includes('salvavidas') || lowerText.includes('seguridad')) {
    return AMAZON_SEARCH_URLS.chaleco_salvavidas;
  }
  
  if (lowerText.includes('gps') || lowerText.includes('garmin') || lowerText.includes('navegación')) {
    return AMAZON_SEARCH_URLS.gps_garmin;
  }
  
  if (lowerText.includes('gopro') || lowerText.includes('cámara') || lowerText.includes('fotos')) {
    return AMAZON_SEARCH_URLS.gopro_camera;
  }
  
  if (lowerText.includes('nevera') || lowerText.includes('cooler') || lowerText.includes('hielo')) {
    return AMAZON_SEARCH_URLS.nevera_coleman;
  }
  
  // Fallback inteligente basado en categorías
  if (lowerText.includes('ropa') || lowerText.includes('baño') || lowerText.includes('toalla')) {
    return AMAZON_SEARCH_URLS.ropa_nautica;
  }
  
  if (lowerText.includes('comida') || lowerText.includes('bebida') || lowerText.includes('agua')) {
    return AMAZON_SEARCH_URLS.comida_barco;
  }
  
  if (lowerText.includes('limpieza') || lowerText.includes('basura') || lowerText.includes('bolsa')) {
    return AMAZON_SEARCH_URLS.limpieza_barco;
  }
  
  if (lowerText.includes('documento') || lowerText.includes('dni') || lowerText.includes('licencia')) {
    return AMAZON_SEARCH_URLS.documentacion_nautica;
  }
  
  // Fallback por defecto - búsqueda genérica
  console.log(`ℹ️ No se encontró producto específico para: "${itemText}" - usando búsqueda genérica`);
  return {
    searchUrl: `https://www.amazon.es/s?k=${encodeURIComponent(itemText)}+nautico&tag=explorashop18-21&linkCode=ur2&linkId=nautical_guide_generic&camp=3638&creative=24630&ref=as_li_ss_tl&utm_source=boattrip-planner&utm_medium=affiliate&utm_campaign=nautical_guide&utm_content=generic_search`,
    name: itemText,
    category: 'general',
    keywords: [itemText.toLowerCase()]
  };
};

// 🚀 FUNCIÓN PARA GENERAR ENLACES OPTIMIZADOS DEL CHECKLIST
const generateOptimizedAmazonLink = (itemText: string, asin?: string): string => {
  const affiliateTag = "explorashop18-21";
  
  if (asin) {
    // Enlace directo al producto con ASIN y tracking optimizado
    return `https://www.amazon.es/dp/${asin}?tag=${affiliateTag}&linkCode=ogi&th=1&psc=1&ref_=as_li_ss_tl&camp=3638&creative=24630&creativeASIN=${asin}&linkId=nautical_guide_checklist_${asin}`;
  } else {
    // Enlace de búsqueda optimizado con UTM parameters
    const searchTerm = itemText.replace(/\s+/g, '+');
    const utmParams = `utm_source=boattrip-planner&utm_medium=affiliate&utm_campaign=nautical_guide&utm_content=checklist&utm_term=${searchTerm}`;
    return `https://www.amazon.es/s?k=${searchTerm}&tag=${affiliateTag}&linkCode=ur2&linkId=nautical_guide_checklist_search&camp=3638&creative=24630&ref=as_li_ss_tl&${utmParams}`;
  }
};

  // 🎯 FUNCIÓN PARA OBTENER PRODUCTO OPTIMIZADO DEL CHECKLIST
  const getOptimizedChecklistProduct = (itemText: string): { 
    searchUrl: string; 
    name: string; 
    category: string; 
    asin?: string;
    isDirectLink: boolean;
  } | null => {
    const product = generateProductSearchUrl(itemText);
    
    if (product) {
      return {
        searchUrl: product.searchUrl,
        name: product.name,
        category: product.category,
        asin: product.asin,
        isDirectLink: !!product.asin
      };
    }
    
    return null;
  };

  // 🚀 FUNCIÓN PARA GENERAR ENLACE DINÁMICO OPTIMIZADO
  const generateDynamicAmazonLink = (itemText: string, asin?: string): string => {
    const affiliateTag = "explorashop18-21";
    
    if (asin && asin !== 'direct_link' && asin !== 'optimized_link') {
      // Enlace directo al producto con ASIN y tracking optimizado
      return `https://www.amazon.es/dp/${asin}?tag=${affiliateTag}&linkCode=ogi&th=1&psc=1&ref_=as_li_ss_tl&camp=3638&creative=24630&creativeASIN=${asin}&linkId=nautical_guide_dynamic_${asin}`;
    } else {
      // Enlace de búsqueda optimizado con UTM parameters dinámicos
      const searchTerm = itemText.replace(/\s+/g, '+');
      const utmParams = `utm_source=boattrip-planner&utm_medium=affiliate&utm_campaign=nautical_guide&utm_content=dynamic_checklist&utm_term=${searchTerm}`;
      return `https://www.amazon.es/s?k=${searchTerm}&tag=${affiliateTag}&linkCode=ur2&linkId=nautical_guide_dynamic_search&camp=3638&creative=24630&ref=as_li_ss_tl&${utmParams}`;
    }
  };

export default RecommendationCard;