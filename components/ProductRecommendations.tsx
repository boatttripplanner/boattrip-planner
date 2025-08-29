// components/ProductRecommendations.tsx
import React, { useState, useEffect } from 'react';
import { getCategoryPrompt, PRODUCTOS_CORE_VERIFICADOS } from '../constants';
import { getImageByProduct } from '../src/blogData';
import { AmazonCTAButton } from './AmazonCTAButton';
import { searchRealAmazonProducts, getRealTrendingProducts, AmazonRealProduct } from '../services/amazonRealApi';

interface ProductRecommendationsProps {
  tags: string[];
  title?: string;
  showTitle?: boolean;
  maxProducts?: number;
  useRealAPI?: boolean;
  content?: string; // Nuevo: contenido del artículo para análisis
  postTitle?: string; // Nuevo: título del artículo
}

const ProductRecommendations: React.FC<ProductRecommendationsProps> = ({
  tags,
  title = "🛒 Productos Recomendados",
  showTitle = true,
  maxProducts = 4,
  useRealAPI = true,
  content = "",
  postTitle = ""
}) => {
  const [realProducts, setRealProducts] = useState<AmazonRealProduct[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const categoryPrompt = getCategoryPrompt(tags);
  const amazonLinks = categoryPrompt.amazon_links || [];
  const realProductsConfig = categoryPrompt.real_products || [];

  // Función para determinar categoría basada en keywords
  const determineCategoryFromKeywords = (keywords: string[]): string => {
    const keywordString = keywords.join(' ').toLowerCase();
    
    if (keywordString.includes('seguridad') || keywordString.includes('chaleco') || keywordString.includes('emergencia')) {
      return 'safety';
    }
    if (keywordString.includes('gps') || keywordString.includes('navegación') || keywordString.includes('garmin')) {
      return 'gps';
    }
    if (keywordString.includes('snorkel') || keywordString.includes('buceo') || keywordString.includes('deportes')) {
      return 'snorkel';
    }
    if (keywordString.includes('cámara') || keywordString.includes('gopro') || keywordString.includes('fotografía')) {
      return 'camera';
    }
    if (keywordString.includes('solar') || keywordString.includes('sostenible') || keywordString.includes('ecológico')) {
      return 'technology';
    }
    if (keywordString.includes('nevera') || keywordString.includes('confort') || keywordString.includes('protector')) {
      return 'comfort';
    }
    
    return 'nautical'; // Categoría por defecto
  };

  // Función para analizar el contenido y extraer palabras clave específicas
  const analyzeContent = (content: string, postTitle: string): string[] => {
    const fullText = `${postTitle} ${content}`.toLowerCase();
    const keywords: string[] = [];
    
    // Palabras clave específicas basadas en el contenido con pesos
    const specificKeywords = {
      // Equipamiento de seguridad (alta prioridad)
      'chaleco': ['chaleco salvavidas', 'seguridad náutica', 'equipamiento seguridad'],
      'gps': ['gps náutico', 'navegación', 'cartas náuticas', 'compás'],
      'radio': ['radio vhf', 'comunicación marítima', 'emergencias'],
      'ancla': ['ancla marina', 'sistema fondeo', 'equipamiento fondeo'],
      'compás': ['compás náutico', 'navegación tradicional', 'instrumentos navegación'],
      
      // Deportes acuáticos (alta prioridad)
      'snorkel': ['equipo snorkel', 'aletas', 'máscara snorkel', 'tubo respirador'],
      'buceo': ['equipo buceo', 'botella buceo', 'traje neopreno', 'regulador'],
      'pesca': ['equipo pesca', 'caña pesca', 'señuelos', 'carnada'],
      'wakeboard': ['wakeboard', 'deportes acuáticos', 'equipamiento deportivo'],
      
      // Tecnología (alta prioridad)
      'cámara': ['cámara subacuática', 'gopro', 'fotografía náutica', 'carcasa impermeable'],
      'solar': ['panel solar', 'cargador solar', 'energía renovable', 'sostenibilidad'],
      'led': ['iluminación led', 'bombillas led', 'linterna led'],
      'garmin': ['garmin', 'gps garmin', 'tecnología náutica'],
      
      // Confort y estilo de vida (media prioridad)
      'nevera': ['nevera portátil', 'conservación alimentos', 'enfriador'],
      'protector': ['protector solar', 'crema solar', 'protección uv'],
      'ropa': ['ropa náutica', 'ropa técnica', 'impermeables'],
      'sombrero': ['sombrero náutico', 'gorra náutica', 'protección solar'],
      
      // Mascotas (alta prioridad si se menciona)
      'perro': ['chaleco perro', 'rampa perro', 'equipamiento mascotas'],
      'mascota': ['equipamiento mascotas', 'seguridad mascotas'],
      'animal': ['equipamiento mascotas', 'seguridad mascotas'],
      
      // Familia (media prioridad)
      'niños': ['chaleco niños', 'juguetes acuáticos', 'equipamiento familia'],
      'familia': ['equipamiento familia', 'seguridad niños'],
      'hijo': ['equipamiento familia', 'seguridad niños'],
      
      // Destinos específicos (media prioridad)
      'mediterráneo': ['equipamiento mediterráneo', 'destinos mediterráneos'],
      'baleares': ['equipamiento baleares', 'destinos baleares'],
      'canarias': ['equipamiento canarias', 'destinos canarias'],
      'mallorca': ['equipamiento baleares', 'destinos baleares'],
      'menorca': ['equipamiento baleares', 'destinos baleares'],
      'ibiza': ['equipamiento baleares', 'destinos baleares'],
      'formentera': ['equipamiento baleares', 'destinos baleares'],
      
      // Actividades específicas (alta prioridad)
      'fondeo': ['ancla', 'sistema fondeo', 'equipamiento fondeo'],
      'navegación': ['equipamiento navegación', 'instrumentos navegación'],
      'mantenimiento': ['herramientas náuticas', 'equipamiento mantenimiento'],
      'reparación': ['herramientas náuticas', 'equipamiento mantenimiento'],
      'limpieza': ['productos limpieza', 'detergente biodegradable'],
      
      // Sostenibilidad (alta prioridad)
      'sostenible': ['productos sostenibles', 'energía renovable', 'biodegradable'],
      'ecológico': ['productos ecológicos', 'sostenibilidad', 'biodegradable'],
      'biodegradable': ['detergente biodegradable', 'productos ecológicos'],
      
      // Emergencias (alta prioridad)
      'emergencia': ['equipo emergencia', 'linterna emergencia', 'botiquín'],
      'seguridad': ['equipamiento seguridad', 'chaleco salvavidas', 'radio vhf'],
      'rescate': ['equipo emergencia', 'chaleco salvavidas', 'radio vhf']
    };

    // Buscar palabras clave en el contenido con conteo de frecuencia
    const keywordFrequency: { [key: string]: number } = {};
    
    Object.entries(specificKeywords).forEach(([key, relatedTerms]) => {
      const regex = new RegExp(key, 'gi');
      const matches = fullText.match(regex);
      if (matches) {
        keywordFrequency[key] = matches.length;
        keywords.push(...relatedTerms);
      }
    });

    // Buscar términos específicos mencionados en el contenido
    const mentionedTerms = [
      'garmin', 'gopro', 'cressi', 'anker', 'coleman', 'nivea',
      'gps', 'vhf', 'snorkel', 'buceo', 'pesca', 'solar', 'led',
      'chaleco', 'ancla', 'compás', 'cartas', 'radio', 'cámara',
      'garmin fēnix', 'hero11', 'palau', 'powercore', 'nevera',
      'protector solar', 'linterna', 'herramientas'
    ];

    mentionedTerms.forEach(term => {
      const regex = new RegExp(term, 'gi');
      const matches = fullText.match(regex);
      if (matches) {
        keywordFrequency[term] = (keywordFrequency[term] || 0) + matches.length;
        keywords.push(term);
      }
    });

    // Ordenar keywords por frecuencia de aparición
    const sortedKeywords = Object.entries(keywordFrequency)
      .sort(([,a], [,b]) => b - a)
      .map(([key]) => key);

    // Combinar keywords únicos con prioridad por frecuencia
    const uniqueKeywords = [...new Set([...sortedKeywords, ...keywords])];
    
    return uniqueKeywords.slice(0, 10); // Limitar a 10 keywords más relevantes
  };

  // Cargar productos reales de Amazon API
  useEffect(() => {
    if (!useRealAPI || !realProductsConfig.length) return;

    const loadRealProducts = async () => {
      try {
        setLoading(true);
        setError(null);

        console.log('🔄 Cargando productos reales de Amazon...');

        // Analizar contenido para obtener palabras clave relevantes
        const contentKeywords = analyzeContent(content, postTitle);
        console.log('🔍 Keywords extraídas:', contentKeywords);
        
        // Determinar categoría basada en keywords
        const category = determineCategoryFromKeywords(contentKeywords);
        console.log('📂 Categoría determinada:', category);
        
        // Usar el sistema mejorado de productos reales
        const realProducts = await searchRealAmazonProducts({
          query: contentKeywords.join(' '), 
          category: category, 
          maxResults: 8 // Buscar más productos para asegurar 4 únicos
        });
        
        console.log('📦 Productos reales obtenidos:', realProducts.products.length);
        
        // Eliminar duplicados y limitar exactamente a 4 productos
        const uniqueProducts = realProducts.products
          .filter((product, index, self) => 
            index === self.findIndex(p => p.asin === product.asin)
          )
          .slice(0, 4); // Forzar exactamente 4 productos
        
        console.log('✅ Productos únicos finales:', uniqueProducts.length);
        
        setRealProducts(uniqueProducts);
      } catch (error) {
        console.error('❌ Error cargando productos reales:', error);
        setError('No se pudieron cargar los productos recomendados');
        
        // Fallback a productos trending
        try {
          console.log('🔄 Intentando fallback con productos trending...');
          const trendingProducts = await getRealTrendingProducts('nautical');
          setRealProducts(trendingProducts.slice(0, 4)); // Exactamente 4 productos
        } catch (fallbackError) {
          console.error('❌ Error en fallback:', fallbackError);
          setRealProducts([]);
        }
      } finally {
        setLoading(false);
      }
    };

    loadRealProducts();
  }, [tags, maxProducts, useRealAPI, realProductsConfig, content, postTitle]);

  // Funciones helper para productos por ASIN
  const getProductNameByASIN = (asin: string): string => {
    const productNames: { [key: string]: string } = {
      'B09M47HFCQ': 'Garmin fēnix 7 - Reloj GPS multideporte',
      'B0B1T4TVTS': 'GoPro HERO11 Black - Cámara de acción',
      'B01M0WXQKX': 'Chaleco Salvavidas Náutico Homologado',
      'B00363W0OI': 'Coleman Nevera Portátil 28QT',
      'B08XQRZQRF': 'Nivea Sun Protector Solar SPF 50+',
      'B075ZN5LJY': 'Anker Linterna LED Táctica',
      'B07FNPY8WG': 'Anker PowerCore Solar Cargador Portátil',
      'B00AVSSZAW': 'Cressi Palau Aletas de Snorkel'
    };
    return productNames[asin] || 'Producto Náutico Recomendado';
  };

  const getProductPriceByASIN = (asin: string): string => {
    const productPrices: { [key: string]: string } = {
      'B09M47HFCQ': '372.26',
      'B0B1T4TVTS': '399.99',
      'B01M0WXQKX': '45.99',
      'B00363W0OI': '89.99',
      'B08XQRZQRF': '15.99',
      'B075ZN5LJY': '29.99',
      'B07FNPY8WG': '79.99',
      'B00AVSSZAW': '34.99'
    };
    return productPrices[asin] || '29.99';
  };

  const getProductFeaturesByASIN = (asin: string): string[] => {
    const productFeatures: { [key: string]: string[] } = {
      'B09M47HFCQ': [
        'GPS multideporte con pantalla táctil',
        'Resistente al agua hasta 10 ATM',
        'Batería hasta 18 días en modo smartwatch',
        'Mapas TopoActive de todo el mundo'
      ],
      'B0B1T4TVTS': [
        'Resolución 5.3K con estabilización',
        'Resistente al agua hasta 10m',
        'Pantalla táctil de 2.27"',
        'Modo TimeWarp 3.0'
      ],
      'B01M0WXQKX': [
        'Homologado CE 150N',
        'Material resistente y duradero',
        'Ajuste cómodo y seguro',
        'Colores visibles en el mar'
      ],
      'B00363W0OI': [
        'Capacidad 28QT (26.5L)',
        'Aislamiento térmico superior',
        'Tapa con cierre hermético',
        'Asa portátil resistente'
      ]
    };
    return productFeatures[asin] || ['Producto de alta calidad', 'Diseño náutico profesional'];
  };

  const getProductDescriptionByASIN = (asin: string): string => {
    const productDescriptions: { [key: string]: string } = {
      'B09M47HFCQ': 'Reloj GPS multideporte Garmin fēnix 7 con pantalla táctil y funciones superiores para navegación y actividades náuticas.',
      'B0B1T4TVTS': 'Cámara de acción GoPro HERO11 Black con estabilización avanzada, perfecta para capturar aventuras náuticas.',
      'B01M0WXQKX': 'Chaleco salvavidas náutico homologado CE 150N, esencial para la seguridad en navegación.',
      'B00363W0OI': 'Nevera portátil Coleman con excelente aislamiento térmico, ideal para mantener alimentos frescos en el barco.',
      'B08XQRZQRF': 'Protector solar resistente al agua SPF 50+, protección superior para actividades náuticas.',
      'B075ZN5LJY': 'Linterna LED táctica Anker con múltiples modos de iluminación, perfecta para emergencias náuticas.',
      'B07FNPY8WG': 'Cargador solar portátil Anker con capacidad de 20000mAh, energía renovable para el barco.',
      'B00AVSSZAW': 'Aletas de snorkel Cressi Palau de alta calidad, ideales para explorar el mundo submarino.'
    };
    return productDescriptions[asin] || 'Producto náutico de alta calidad recomendado para navegantes.';
  };

  // Productos recomendados con nombres descriptivos (fallback)
  const getProductName = (link: string, index: number): string => {
    // Validación para evitar errores si link es undefined o null
    if (!link || typeof link !== 'string') {
      return 'Producto Náutico Recomendado';
    }
    const productNames = [
      'Equipamiento de Seguridad Náutica',
      'Productos para Deportes Acuáticos', 
      'Equipamiento de Navegación',
      'Productos Sostenibles para el Mar',
      'Equipamiento para Mascotas',
      'Productos para Familias',
      'Tecnología Náutica',
      'Fotografía Submarina'
    ];
    
    // Intentar determinar el nombre basado en la URL
    if (link.includes('chaleco+salvavidas')) {
      return link.includes('perro') ? 'Chaleco Salvavidas para Mascotas' : 'Chaleco Salvavidas Náutico';
    }
    if (link.includes('panel+solar')) return 'Panel Solar Marino';
    if (link.includes('gps+nautico')) return 'GPS Náutico';
    if (link.includes('equipo+buceo')) return 'Equipo de Buceo Completo';
    if (link.includes('aletas+snorkel')) return 'Aletas y Equipo de Snorkel';
    if (link.includes('camera+subacuatica')) return 'Cámara Subacuática';
    if (link.includes('detergente+biodegradable')) return 'Detergente Biodegradable';
    if (link.includes('bombillas+LED')) return 'Iluminación LED Náutica';
    if (link.includes('herramientas+nauticas')) return 'Kit de Herramientas Náuticas';
    if (link.includes('ancla+marina')) return 'Sistema de Anclaje Marino';
    if (link.includes('radio+VHF')) return 'Radio VHF Náutico';
    if (link.includes('compas+nautico')) return 'Compás Náutico Profesional';
    if (link.includes('cartas+nauticas')) return 'Cartas Náuticas de España';
    if (link.includes('equipo+pesca')) return 'Equipo de Pesca Completo';
    if (link.includes('traje+neopreno')) return 'Traje de Neopreno';
    if (link.includes('juguetes+acuaticos')) return 'Juguetes Acuáticos para Niños';
    if (link.includes('cargador+solar')) return 'Cargador Solar Portátil';
    if (link.includes('nevera+portatil')) return 'Nevera Portátil';
    if (link.includes('ropa+nautica')) return 'Ropa Náutica';
    if (link.includes('libros+navegacion')) return 'Libros de Navegación';
    
    return productNames[index] || 'Producto Náutico Recomendado';
  };

  const getProductDescription = (link: string): string => {
    // Validación para evitar errores si link es undefined o null
    if (!link || typeof link !== 'string') {
      return 'Producto recomendado para navegantes';
    }
    if (link.includes('chaleco+salvavidas')) {
      return link.includes('perro') ? 'Seguridad para tu mascota en el mar' : 'Seguridad esencial para navegación';
    }
    if (link.includes('panel+solar')) return 'Energía limpia y renovable para tu barco';
    if (link.includes('gps+nautico')) return 'Navegación precisa y segura';
    if (link.includes('equipo+buceo')) return 'Explora el mundo submarino';
    if (link.includes('aletas+snorkel')) return 'Disfruta del snorkel con equipamiento profesional';
    if (link.includes('camera+subacuatica')) return 'Captura momentos únicos bajo el agua';
    if (link.includes('detergente+biodegradable')) return 'Limpieza responsable del medio ambiente';
    if (link.includes('bombillas+LED')) return 'Iluminación eficiente y duradera';
    if (link.includes('herramientas+nauticas')) return 'Mantenimiento profesional de tu embarcación';
    if (link.includes('ancla+marina')) return 'Fondeo seguro en cualquier condición';
    if (link.includes('radio+VHF')) return 'Comunicación marítima esencial';
    if (link.includes('compas+nautico')) return 'Navegación tradicional y confiable';
    if (link.includes('cartas+nauticas')) return 'Planificación de rutas náuticas';
    if (link.includes('equipo+pesca')) return 'Pesca deportiva desde el barco';
    if (link.includes('traje+neopreno')) return 'Protección térmica para actividades acuáticas';
    if (link.includes('juguetes+acuaticos')) return 'Diversión segura para los más pequeños';
    if (link.includes('cargador+solar')) return 'Carga tus dispositivos con energía solar';
    if (link.includes('nevera+portatil')) return 'Conserva alimentos y bebidas frescos';
    if (link.includes('ropa+nautica')) return 'Ropa técnica para navegación';
    if (link.includes('libros+navegacion')) return 'Aprende técnicas de navegación';
    
    return 'Producto recomendado para navegantes';
  };

  const getProductVariant = (link: string): 'primary' | 'secondary' | 'premium' | 'urgent' | 'bestseller' => {
    // Validación para evitar errores si link es undefined o null
    if (!link || typeof link !== 'string') {
      return 'primary';
    }
    // Productos premium
    if (link.includes('gps+nautico') || link.includes('panel+solar') || link.includes('camera+subacuatica')) {
      return 'premium';
    }
    // Productos urgentes (seguridad)
    if (link.includes('chaleco+salvavidas') || link.includes('radio+VHF') || link.includes('ancla+marina')) {
      return 'urgent';
    }
    // Productos más vendidos
    if (link.includes('aletas+snorkel') || link.includes('detergente+biodegradable') || link.includes('bombillas+LED')) {
      return 'bestseller';
    }
    // Productos secundarios
    if (link.includes('ropa+nautica') || link.includes('libros+navegacion') || link.includes('juguetes+acuaticos')) {
      return 'secondary';
    }
    // Productos primarios por defecto
    return 'primary';
  };

  const getProductPrice = (link: string): string | undefined => {
    // Validación para evitar errores si link es undefined o null
    if (!link || typeof link !== 'string') {
      return undefined;
    }
    // Precios estimados basados en el tipo de producto
    if (link.includes('chaleco+salvavidas')) return '€25-45';
    if (link.includes('panel+solar')) return '€150-300';
    if (link.includes('gps+nautico')) return '€200-500';
    if (link.includes('equipo+buceo')) return '€100-250';
    if (link.includes('aletas+snorkel')) return '€30-80';
    if (link.includes('camera+subacuatica')) return '€200-400';
    if (link.includes('detergente+biodegradable')) return '€15-25';
    if (link.includes('bombillas+LED')) return '€20-50';
    if (link.includes('herramientas+nauticas')) return '€50-120';
    if (link.includes('ancla+marina')) return '€80-200';
    if (link.includes('radio+VHF')) return '€100-300';
    if (link.includes('compas+nautico')) return '€40-100';
    if (link.includes('cartas+nauticas')) return '€25-60';
    if (link.includes('equipo+pesca')) return '€80-200';
    if (link.includes('traje+neopreno')) return '€60-150';
    if (link.includes('juguetes+acuaticos')) return '€20-50';
    if (link.includes('cargador+solar')) return '€40-100';
    if (link.includes('nevera+portatil')) return '€60-150';
    if (link.includes('ropa+nautica')) return '€30-80';
    if (link.includes('libros+navegacion')) return '€15-40';
    
    return undefined;
  };

  const getProductBadge = (link: string): string | undefined => {
    // Validación para evitar errores si link es undefined o null
    if (!link || typeof link !== 'string') {
      return undefined;
    }
    if (link.includes('chaleco+salvavidas') || link.includes('radio+VHF')) return 'SEGURIDAD';
    if (link.includes('panel+solar') || link.includes('detergente+biodegradable')) return 'ECO';
    if (link.includes('gps+nautico') || link.includes('camera+subacuatica')) return 'TECH';
    if (link.includes('aletas+snorkel') || link.includes('equipo+buceo')) return 'DEPORTE';
    if (link.includes('ancla+marina') || link.includes('herramientas+nauticas')) return 'PRO';
    if (link.includes('juguetes+acuaticos') || link.includes('ropa+nautica')) return 'FAMILIA';
    
    return undefined;
  };

  // Mostrar productos reales si están disponibles
  if (useRealAPI && realProducts.length > 0) {
    return (
      <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-slate-800 dark:via-slate-700 dark:to-slate-900 rounded-3xl p-8 border border-blue-200/50 dark:border-slate-600/50 shadow-2xl">
        {showTitle && (
          <div className="mb-8 text-center">
            <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">
              {title}
            </h3>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Productos reales de Amazon recomendados para este artículo:
            </p>
          </div>
        )}
        
        {loading && (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent"></div>
            <span className="ml-4 text-lg text-slate-600 dark:text-slate-300">Cargando productos reales de Amazon...</span>
          </div>
        )}
        
        {error && (
          <div className="text-red-600 text-center py-8 bg-red-50 dark:bg-red-900/20 rounded-xl">
            <div className="text-2xl mb-2">⚠️</div>
            {error}
          </div>
        )}
        
        {!loading && !error && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {realProducts.slice(0, 4).map((product, index) => (
              <div key={product.asin} className="group bg-white dark:bg-slate-800 rounded-2xl p-6 border border-gray-200/50 dark:border-slate-700/50 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h4 className="font-bold text-gray-900 dark:text-white text-lg mb-2 leading-tight">
                      {product.title}
                    </h4>
                    <p className="text-gray-600 dark:text-gray-300 text-sm mb-3 leading-relaxed">
                      {product.description}
                    </p>
                    <div className="flex items-center gap-3 mb-3">
                      <div className="flex items-center bg-yellow-50 dark:bg-yellow-900/20 px-3 py-1 rounded-full">
                        <span className="text-yellow-500 text-lg">★</span>
                        <span className="text-sm text-gray-700 dark:text-gray-300 ml-1 font-medium">
                          {product.rating} ({product.reviewCount})
                        </span>
                      </div>
                      {product.prime && (
                        <span className="text-xs bg-blue-100 text-blue-800 px-3 py-1 rounded-full font-medium">Prime</span>
                      )}
                    </div>
                  </div>
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-gradient-to-r from-green-500 to-emerald-500 text-white ml-3 shadow-lg">
                    REAL
                  </span>
                </div>
                
                {/* Imagen del producto mejorada */}
                <div className="mb-4 relative overflow-hidden rounded-xl">
                  <img 
                    src={product.imageUrl} 
                    alt={product.title}
                    className="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
                
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-bold text-gray-900 dark:text-white">
                      €{product.price}
                    </span>
                    <span className="text-sm text-green-600 dark:text-green-400 font-medium">
                      {product.availability}
                    </span>
                  </div>
                  {product.prime && (
                    <div className="flex items-center gap-1 text-blue-600 dark:text-blue-400">
                      <span className="text-lg">🚚</span>
                      <span className="text-sm font-medium">Envío gratis</span>
                    </div>
                  )}
                </div>
                
                <AmazonCTAButton
                  href={product.affiliateUrl}
                  variant="premium"
                  price={`€${product.price}`}
                  badge="REAL"
                  className="w-full text-lg py-4 rounded-xl font-semibold"
                >
                  🛒 Ver en Amazon
                </AmazonCTAButton>
              </div>
            ))}
          </div>
        )}
        
        <div className="mt-8 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-slate-700 dark:to-slate-800 rounded-2xl border border-blue-200/50 dark:border-slate-600/50">
          <div className="flex items-center justify-center gap-3 mb-2">
            <span className="text-2xl">✅</span>
            <span className="text-lg font-semibold text-gray-900 dark:text-white">Productos reales de Amazon España</span>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-300 text-center">
            Precios y disponibilidad actualizados en tiempo real. Enlaces de afiliado que nos ayudan a mantener el blog.
          </p>
        </div>
      </div>
    );
  }

  // Fallback a productos con enlaces de búsqueda
  if (!amazonLinks.length) {
    return null;
  }

  const displayLinks = amazonLinks.slice(0, 4); // Exactamente 4 productos

  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-800 dark:to-slate-900 rounded-2xl p-6 border border-blue-200 dark:border-slate-700 shadow-lg">
      {showTitle && (
        <div className="mb-6">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            {title}
          </h3>
          <p className="text-gray-600 dark:text-gray-300">
            Basándote en este artículo, te recomendamos estos productos de Amazon:
          </p>
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {displayLinks.map((link: string, index: number) => {
          const productName = getProductName(link, index);
          const productDescription = getProductDescription(link);
          const variant = getProductVariant(link);
          const price = getProductPrice(link);
          const badge = getProductBadge(link);
          const productImage = getImageByProduct(productName);
          
          return (
            <div key={index} className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-gray-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900 dark:text-white text-sm mb-1">
                    {productName}
                  </h4>
                  <p className="text-gray-600 dark:text-gray-300 text-xs mb-3">
                    {productDescription}
                  </p>
                </div>
                {badge && (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 ml-2">
                    {badge}
                  </span>
                )}
              </div>
              
              {/* Imagen del producto */}
              <div className="mb-3">
                <img 
                  src={productImage} 
                  alt={productName}
                  className="w-full h-32 object-cover rounded-lg"
                  loading="lazy"
                />
              </div>
              
              <AmazonCTAButton
                href={link}
                variant={variant}
                price={price}
                badge={badge}
                className="w-full"
              >
                Ver en Amazon
              </AmazonCTAButton>
            </div>
          );
        })}
      </div>
      
      <div className="mt-6 p-4 bg-blue-50 dark:bg-slate-800 rounded-lg border border-blue-200 dark:border-slate-700">
        <p className="text-sm text-gray-600 dark:text-gray-300 text-center">
          <span className="font-medium">💡 Los enlaces de Amazon son de afiliado.</span> Al comprar a través de estos enlaces, nos ayudas a mantener este blog sin coste adicional para ti.
        </p>
      </div>
    </div>
  );
};

export default ProductRecommendations; 