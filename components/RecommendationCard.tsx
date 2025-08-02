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
import { createAffiliateUrl, searchAmazonProducts, checkProductAvailability } from '../services/amazonApi';

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

const purchasableKeywords: string[] = [
  "crema solar", "protector solar", "gafas de sol", "sombrero", "gorra", "toalla", 
  "ropa de baño", "traje de baño", "bañador", "bikini", "ropa de abrigo", "chaqueta", 
  "cortavientos", "calzado de barco", "escarpines", "chanclas", "agua embotellada", 
  "snacks", "comida para llevar", "bolsas de basura", "botiquín", "pastillas para el mareo", 
  "cargador de móvil", "batería externa", "power bank", "equipo de snorkel", "máscara de buceo", 
  "aletas", "tubo de snorkel", "licencia de pesca", "caña de pescar", "anzuelos", "cebo", 
  "nevera portátil", "cooler", "altavoz bluetooth", "altavoz impermeable", "libro", "revista", 
  "mapa náutico", "carta náutica", "chaleco salvavidas", "bengalas de emergencia", "radio vhf portátil", 
  "ancla de capa", "cuerda náutica", "cabo", "defensas para barco", "linterna impermeable", 
  "cuchillo multiusos", "navaja suiza", "pastillas potabilizadoras de agua", "repelente de insectos", 
  "productos biodegradables", "bolsa estanca", "funda impermeable", "cámara acuática", "go pro",
  "aletas de paddle surf", "remo", "hinchador", "kayak inflable", "donut acuático", "wakeboard",
  "antiempañante para gafas", "crema aftersun"
];

const isItemPotentiallyPurchasable = (itemText: string): boolean => {
  if (!itemText) return false;
  const lowerItemText = itemText.toLowerCase();
  return purchasableKeywords.some(keyword => lowerItemText.includes(keyword));
};

// Función para extraer palabras clave de producto del texto del item
const extractProductKeywords = (itemText: string): string[] => {
  if (!itemText) return [];
  
  const lowerText = itemText.toLowerCase();
  const keywords: string[] = [];
  
  // Extraer palabras clave específicas para búsqueda en Amazon
  const productPatterns = [
    // Patrones específicos náuticos
    /chaleco\s+salvavidas|salvavidas/gi,
    /gps\s+náutico|gps\s+marino|plotter/gi,
    /equipo\s+snorkel|máscara\s+buceo|aletas/gi,
    /crema\s+solar|protector\s+solar/gi,
    /go\s*pro|cámara\s+acuática/gi,
    /altavoz\s+bluetooth|altavoz\s+impermeable/gi,
    /nevera\s+portátil|cooler/gi,
    /linterna\s+impermeable|linterna\s+led/gi,
    /botiquín|primeros\s+auxilios/gi,
    /bengalas|bengala\s+emergencia/gi,
    /radio\s+vhf|vhf\s+portátil/gi,
    /ancla|fondeo/gi,
    /cuerda\s+náutica|cabo\s+marino/gi,
    /defensas\s+barco|defensas\s+náuticas/gi,
    /caña\s+pescar|equipo\s+pesca/gi,
    /pastillas\s+mareo|biodramina/gi,
    /cargador\s+solar|batería\s+externa|power\s+bank/gi
  ];
  
  productPatterns.forEach(pattern => {
    const matches = lowerText.match(pattern);
    if (matches) {
      keywords.push(...matches);
    }
  });
  
  // Si no encontramos patrones específicos, usar palabras del purchasableKeywords
  if (keywords.length === 0) {
    const foundKeywords = purchasableKeywords.filter(keyword => 
      lowerText.includes(keyword)
    );
    keywords.push(...foundKeywords);
  }
  
  return keywords;
};

// Función DINÁMICA para buscar y verificar productos en Amazon España
const findBestAmazonProduct = async (itemText: string): Promise<string | null> => {
  try {
    const keywords = extractProductKeywords(itemText);
    
    if (keywords.length === 0) {
      return null; // No es un producto comprable
    }
    
    // Intentar con cada palabra clave, empezando por la más específica
    for (const keyword of keywords) {
      try {
        // Buscar productos en Amazon España
        const searchResult = await searchAmazonProducts({
          query: keyword,
          category: 'nautical',
          rating: 4.0, // Solo productos bien valorados
          prime: false, // No requerimos Prime
          sortBy: 'rating' // Ordenar por valoración
        });
        
        if (searchResult.products && searchResult.products.length > 0) {
          // Verificar disponibilidad de los primeros productos
          const asins = searchResult.products.slice(0, 3).map(p => p.asin);
          const availability = await checkProductAvailability(asins);
          
          // Encontrar el primer producto disponible
          for (const product of searchResult.products.slice(0, 3)) {
            if (availability[product.asin] && product.rating >= 4.0) {
              console.log(`✅ Producto encontrado para "${itemText}": ${product.title} (${product.asin})`);
              return product.asin;
            }
          }
        }
      } catch (error) {
        console.warn(`⚠️ Error buscando "${keyword}":`, error);
        continue; // Intentar con la siguiente palabra clave
      }
    }
    
    // Si no encontramos nada, devolver null (no mostrar enlace)
    console.log(`❌ No se encontró producto disponible para: "${itemText}"`);
    return null;
    
  } catch (error) {
    console.error('Error en búsqueda dinámica de productos:', error);
    return null;
  }
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
  const [checkedAiItems, setCheckedAiItems] = useState<Record<string, boolean>>({});
  const [customChecklistItems, setCustomChecklistItems] = useState<CustomChecklistItem[]>([]);
  const [newCustomItemText, setNewCustomItemText] = useState('');
  const componentId = useId(); 
  // userAffiliateLink removido - ahora usamos enlaces específicos por producto
  const [openAccordionId, setOpenAccordionId] = useState<string | null>(null);
  
  // Estado para almacenar ASINs encontrados dinámicamente
  const [productAsins, setProductAsins] = useState<Record<string, string | null>>({});
  const [loadingProducts, setLoadingProducts] = useState<Record<string, boolean>>({});

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
      
      // Buscar producto dinámicamente si es comprable y no lo hemos buscado ya
      React.useEffect(() => {
        if (isPurchasable && !productAsins[itemKey] && !loadingProducts[itemKey]) {
          setLoadingProducts(prev => ({ ...prev, [itemKey]: true }));
          
          findBestAmazonProduct(textContent)
            .then(asin => {
              setProductAsins(prev => ({ ...prev, [itemKey]: asin }));
              setLoadingProducts(prev => ({ ...prev, [itemKey]: false }));
            })
            .catch(error => {
              console.error('Error finding product:', error);
              setProductAsins(prev => ({ ...prev, [itemKey]: null }));
              setLoadingProducts(prev => ({ ...prev, [itemKey]: false }));
            });
        }
      }, [isPurchasable, itemKey, textContent]);
      
      // Solo generar enlace si encontramos un ASIN válido
      const specificAsin = productAsins[itemKey];
      const amazonLink = specificAsin ? createAffiliateUrl(specificAsin, 'checklist', 'dynamic-product') : null;
      const isLoadingProduct = loadingProducts[itemKey] || false;

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
                  href={amazonLink} 
                  target="_blank"
                  rel="noopener noreferrer nofollow"
                  title={`Ver producto verificado "${textContent}" en Amazon.es (enlace directo)`} 
                  className="ml-2 p-1 text-amber-600 hover:text-amber-700 focus:outline-none focus:ring-1 focus:ring-amber-500 focus:ring-offset-1 rounded-sm flex-shrink-0"
                  onClick={(e) => e.stopPropagation()} 
                  data-amazon-link="true" 
                  aria-label={`Ver producto verificado "${textContent}" en Amazon.es (disponible ahora)`}
                >
                  <ShoppingCartIcon className="w-5 h-5" />
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
                 <h3 className="text-base sm:text-lg md:text-xl font-bold text-slate-800 mb-1">🚤 ¿Qué te gustaría hacer ahora?</h3>
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

export default RecommendationCard;