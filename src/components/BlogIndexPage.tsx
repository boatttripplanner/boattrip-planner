// src/components/BlogIndexPage.tsx
import React, { useState, useMemo, useEffect } from 'react';
import { BlogIndexPageProps } from '../../types';
import { existingBlogPosts_definitions_only as allBlogPosts } from '../blogData';
import { Button } from '../../components/Button';
import { InputField, SelectField } from '../../components/FormControls';


const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

// Función para calcular tiempo de lectura (aproximadamente 200 palabras por minuto)
const calculateReadingTime = (content: string): number => {
  const wordsPerMinute = 200;
  const wordCount = content.split(/\s+/).length;
  const readingTime = Math.ceil(wordCount / wordsPerMinute);
  return Math.max(1, readingTime); // Mínimo 1 minuto
};

// Función para validar que una imagen sea temáticamente marítima
const validateMaritimeImage = (imageUrl: string): boolean => {
  // Lista de palabras clave que indican contenido marítimo
  const maritimeKeywords = [
    'boat', 'sail', 'yacht', 'sailing', 'marine', 'ocean', 'sea', 'nautical',
    'harbor', 'port', 'dock', 'marina', 'anchor', 'compass', 'navigation',
    'fishing', 'diving', 'snorkel', 'underwater', 'coral', 'reef', 'island',
    'coast', 'beach', 'wave', 'tide', 'lighthouse', 'buoy', 'mooring',
    'catamaran', 'velero', 'barco', 'mar', 'océano', 'puerto', 'muelle',
    'ancla', 'brújula', 'navegación', 'pesca', 'buceo', 'isla', 'costa',
    'playa', 'ola', 'faro', 'boya', 'amarre'
  ];
  
  // Verificar si la URL contiene palabras clave marítimas
  const lowerUrl = imageUrl.toLowerCase();
  return maritimeKeywords.some(keyword => lowerUrl.includes(keyword));
};

// Función para obtener imagen destacada basada en el slug y tags
const getFeaturedImage = (slug: string, tags?: string[]): string => {
  // Mapeo específico de imágenes temáticas y de alta calidad
  const specificImageMap: { [key: string]: string } = {
    // MASCOTAS & PERROS 🐕
    'los-7-productos-esenciales-navegar-perro-seguro': 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=400&h=300&fit=crop&crop=center', // Golden Retriever en barco
    'guia-completa-viajar-barco-mascotas': 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=400&h=300&fit=crop&crop=center', // Perro con chaleco salvavidas
    
    // REVIEWS Y COMPARATIVAS 📊
    'mejores-gps-marinos-2024-comparativa-completa': 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=400&h=300&fit=crop&crop=center', // GPS marino en cockpit de velero
    
    // SOSTENIBILIDAD Y ECO-FRIENDLY 🌱
    'navegacion-sostenible-guia-completa-barco-ecologico': 'https://images.unsplash.com/photo-1544551763-77ef2d0cfc6c?w=400&h=300&fit=crop&crop=center', // Velero con paneles solares navegando
    
    // FAMILIA Y NIÑOS 👨‍👩‍👧‍👦
    'navegar-en-familia-guia-completa-aventuras-nauticas': 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=400&h=300&fit=crop&crop=center', // Familia en velero con velas desplegadas
    
    // PRODUCTOS Y REVIEWS 🛒
    'mejores-ctas-productos-nauticos-2024': 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=400&h=300&fit=crop&crop=center', // Barco moderno con equipamiento visible
    
    // DESTINOS ESPECÍFICOS 🗺️
    'islas-columbretes-paraiso-secreto-mediterraneo-navegantes': 'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=400&h=300&fit=crop&crop=center', // Velero navegando hacia islas volcánicas
    'cala-macarella-macarelleta-menorca-paraiso-escondido': 'https://images.unsplash.com/photo-1558618666-8647a1e1e4f8?w=400&h=300&fit=crop&crop=center', // Barco anclado en cala turquesa
    'navegar-en-ibiza-descubre-isla-magica': 'https://images.unsplash.com/photo-1515552726023-7125c8d07fb3?w=400&h=300&fit=crop&crop=center', // Ibiza sunset sailing - MANTENER (tiene barco)
    'navegar-costa-brava-explora-encanto-mediterraneo': 'https://images.unsplash.com/photo-1544551763-77ef2d0cfc6c?w=400&h=300&fit=crop&crop=center', // Velero navegando por Costa Brava
    'menorca-en-barco-paraiso-calas-turquesas': 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=300&fit=crop&crop=center', // Catamarán en aguas turquesas de Menorca
    'mejores-destinos-aventura-barco-espana': 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=400&h=300&fit=crop&crop=center', // Velero en costa española
    
    // TIPOS DE BARCOS ⛵
    'que-es-un-catamaran-ventajas-desventajas-aventura-nautica': 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=300&fit=crop&crop=center', // Catamarán navegando - MUY CLARO
    'alquilar-velero-experiencia-pura-navegar-a-vela': 'https://images.unsplash.com/photo-1544551763-77ef2d0cfc6c?w=400&h=300&fit=crop&crop=center', // Velero clásico - MANTENER (perfecto)
    'alquilar-barco-a-motor-velocidad-confort': 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=400&h=300&fit=crop&crop=center', // Yate a motor moderno - MANTENER (perfecto)
    
    // ACTIVIDADES ESPECÍFICAS 🎣
    'guia-pesca-desde-barco-principiantes': 'https://images.unsplash.com/photo-1498654077810-12c21d4d6dc3?w=400&h=300&fit=crop&crop=center', // Pescando desde barco - MANTENER (perfecto)
    'el-paddle-surf-sup-explora-mar-ritmo-fortalece-cuerpo': 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400&h=300&fit=crop&crop=center', // SUP desde barco como base
    'mejores-destinos-windsurf-kitesurf-espana': 'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=400&h=300&fit=crop&crop=center', // Barco en zona de windsurf
    'deportes-acuaticos-barco-guia-completa': 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=300&fit=crop&crop=center', // Barco con deportes acuáticos
    
    // EQUIPAMIENTO & TECH 📱
    'gps-nautico-navegador-indispensable': 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=400&h=300&fit=crop&crop=center', // GPS en panel de barco moderno
    'review-garmin-echomap-uhd-mejor-plotter-sonda': 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=400&h=300&fit=crop&crop=center', // Panel electrónico en barco
    'gadgets-nauticos-siglo-xxi': 'https://images.unsplash.com/photo-1544551763-77ef2d0cfc6c?w=400&h=300&fit=crop&crop=center', // Barco moderno con tecnología
    'como-elegir-mejor-chaleco-salvavidas': 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=400&h=300&fit=crop&crop=center', // Personas con chalecos en barco
    'el-traje-de-neopreno-tu-aliado-indispensable': 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=300&fit=crop&crop=center', // Buceador desde barco - MANTENER
    'cressi-rondinella-aletas-snorkel-review': 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=400&h=300&fit=crop&crop=center', // Snorkel desde velero
    
    // FAMILIA & EXPERIENCIAS 👨‍👩‍👧‍👦
    'navegar-en-familia-crea-recuerdos-inolvidables': 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=400&h=300&fit=crop&crop=center', // Familia navegando en velero
    'con-patron-o-sin-patron-claves-elegir-aventura-barco': 'https://images.unsplash.com/photo-1515552726023-7125c8d07fb3?w=400&h=300&fit=crop&crop=center', // Capitán al timón - MANTENER (perfecto)
    'alquiler-barcos-por-horas-explora-mar-a-tu-ritmo': 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=300&fit=crop&crop=center', // Barco alquilado navegando
    
    // SOSTENIBILIDAD & MEDIO AMBIENTE 🌍
    'navegacion-sostenible-protege-mar-mientras-disfrutas': 'https://images.unsplash.com/photo-1544551763-77ef2d0cfc6c?w=400&h=300&fit=crop&crop=center', // Velero eco-friendly navegando
    'posidonia-oceanica-tesoro-submarino-proteger-navegar': 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=300&fit=crop&crop=center', // Barco sobre aguas cristalinas protegidas
    
    // TÉCNICAS & EDUCACIÓN 📚
    'mejores-libros-navegacion': 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=400&h=300&fit=crop&crop=center', // Cartas náuticas en barco moderno
    'patente-de-navegacion-primer-paso-capitan': 'https://images.unsplash.com/photo-1515552726023-7125c8d07fb3?w=400&h=300&fit=crop&crop=center', // Capitán aprendiendo - MANTENER (perfecto)
    'patron-de-navegacion-basica-pnb-siguiente-nivel': 'https://images.unsplash.com/photo-1544551763-77ef2d0cfc6c?w=400&h=300&fit=crop&crop=center', // Navegación avanzada en velero
    'el-diario-de-abordo-captura-cada-momento-aventura-marina': 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=400&h=300&fit=crop&crop=center', // Escribiendo diario en velero
    'rumbovivo-escuela-nautica-patrones-exigentes': 'https://images.unsplash.com/photo-1515552726023-7125c8d07fb3?w=400&h=300&fit=crop&crop=center', // Escuela náutica - MANTENER (perfecto)
    
    // PROBLEMAS & SOLUCIONES 🔧
    'consejos-vencer-mareo-barco': 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=300&fit=crop&crop=center', // Persona tranquila en barco
    'si-llueve-viaje-barco-planes-alternativos-dia-brillante': 'https://images.unsplash.com/photo-1544551763-77ef2d0cfc6c?w=400&h=300&fit=crop&crop=center', // Barco bajo la lluvia
    'fuera-pajaros-protege-tu-barco-visitantes-alados': 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=400&h=300&fit=crop&crop=center', // Mantenimiento de barco - MANTENER
    'el-ancla-tu-fiel-guardian-en-cada-fondeo': 'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=400&h=300&fit=crop&crop=center', // Barco anclado - ancla visible
    'guia-supervivencia-mar-tecnicas-basicas': 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=400&h=300&fit=crop&crop=center', // Seguridad marítima en velero
    
    // SERVICIOS & REVIEWS 💼
    'samboat-review-plataforma-alquiler-barcos': 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=300&fit=crop&crop=center', // Plataforma de alquiler - barco visible
    'mejor-aliado-alquilar-barco-nuestra-experiencia': 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=400&h=300&fit=crop&crop=center', // Alquiler de lujo - MANTENER (perfecto)
    
    // PRODUCTOS & AMAZON 🛒
    'productos-reales-amazon-nautica-2024': 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=400&h=300&fit=crop&crop=center', // Productos en barco moderno
    'top-10-productos-nauticos-mas-vendidos-amazon': 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=400&h=300&fit=crop&crop=center', // Equipamiento en barco - MANTENER (perfecto)
    'equipamiento-nautico-esencial-aventura-mar': 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=400&h=300&fit=crop&crop=center', // Equipamiento esencial en velero
    
    // TECH & PLANIFICACIÓN 🤖
    'como-planificar-viaje-nautico-con-ia-boattrip-planner': 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=400&h=300&fit=crop&crop=center', // Planificación con IA en barco moderno
    'banderas-de-cortesia-simbolo-respeto-puerto': 'https://images.unsplash.com/photo-1515552726023-7125c8d07fb3?w=400&h=300&fit=crop&crop=center', // Banderas marítimas - MANTENER (perfecto)
    
    // BIENVENIDA 👋
    'bienvenida-al-blog': 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=400&h=300&fit=crop&crop=center', // Bienvenida con velero navegando
  };
  
  // Si existe imagen específica, la validamos y usamos
  if (specificImageMap[slug]) {
    const imageUrl = specificImageMap[slug];
    if (validateMaritimeImage(imageUrl)) {
      return imageUrl;
    }
    // Si no es válida, usamos imagen por defecto
    console.warn(`Imagen no marítima detectada para slug: ${slug}, usando imagen por defecto`);
  }
  
  // Sistema de fallback basado en tags
  if (tags && tags.length > 0) {
    const tagImageMap: { [key: string]: string } = {
      // Mascotas
      'mascotas': 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=400&h=300&fit=crop&crop=center',
      'perros': 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=400&h=300&fit=crop&crop=center',
      
      // Destinos
      'destinos': 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&h=300&fit=crop&crop=center',
      'columbretes': 'https://images.unsplash.com/photo-1439066615861-d1af74d74000?w=400&h=300&fit=crop&crop=center',
      'islas': 'https://images.unsplash.com/photo-1439066615861-d1af74d74000?w=400&h=300&fit=crop&crop=center',
      'reserva natural': 'https://images.unsplash.com/photo-1439066615861-d1af74d74000?w=400&h=300&fit=crop&crop=center',
      'baleares': 'https://images.unsplash.com/photo-1548919973-5cef591cdbc9?w=400&h=300&fit=crop&crop=center',
      'menorca': 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&h=300&fit=crop&crop=center',
      'ibiza': 'https://images.unsplash.com/photo-1515552726023-7125c8d07fb3?w=400&h=300&fit=crop&crop=center',
      'castellón': 'https://images.unsplash.com/photo-1439066615861-d1af74d74000?w=400&h=300&fit=crop&crop=center',
      
      // Equipamiento
      'equipamiento': 'https://images.unsplash.com/photo-1551818255-e6e10975bc17?w=400&h=300&fit=crop&crop=center',
      'seguridad': 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400&h=300&fit=crop&crop=center',
      'gps': 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=400&h=300&fit=crop&crop=center',
      
      // Actividades - REEMPLAZADA LA IMAGEN PROBLEMÁTICA
      'pesca': 'https://images.unsplash.com/photo-1498654077810-12c21d4d6dc3?w=400&h=300&fit=crop&crop=center',
      'snorkel': 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&h=300&fit=crop&crop=center',
      'deportes': 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=300&fit=crop&crop=center', // REEMPLAZADA: Barco con deportes acuáticos
      
      // Sostenibilidad
      'sostenibilidad': 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&h=300&fit=crop&crop=center',
      'medio ambiente': 'https://images.unsplash.com/photo-1548919973-5cef591cdbc9?w=400&h=300&fit=crop&crop=center',
      
      // Familia
      'familia': 'https://images.unsplash.com/photo-1548919973-5cef591cdbc9?w=400&h=300&fit=crop&crop=center',
      'niños': 'https://images.unsplash.com/photo-1548919973-5cef591cdbc9?w=400&h=300&fit=crop&crop=center',
      
      // Amazon/Productos
      'amazon': 'https://images.unsplash.com/photo-1551818255-e6e10975bc17?w=400&h=300&fit=crop&crop=center',
      'productos': 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=400&h=300&fit=crop&crop=center',
      'reviews': 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400&h=300&fit=crop&crop=center',
    };
    
    // Buscar la primera tag que coincida y validar la imagen
    for (const tag of tags) {
      const lowerTag = tag.toLowerCase();
      for (const [key, imageUrl] of Object.entries(tagImageMap)) {
        if (lowerTag.includes(key)) {
          if (validateMaritimeImage(imageUrl)) {
            return imageUrl;
          }
          // Si no es válida, continuar buscando
          console.warn(`Imagen no marítima detectada para tag: ${tag}, continuando búsqueda`);
        }
      }
    }
  }
  
  // Imagen por defecto - vista aérea del mar
  return 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop&crop=center';
};

// Función para obtener categorías de artículos
const getArticleCategory = (tags: string[]): string => {
  const categoryMap: { [key: string]: string } = {
    'destinos': 'Destinos',
    'destino': 'Destinos',
    'croacia': 'Destinos',
    'baleares': 'Destinos',
    'menorca': 'Destinos',
    'ibiza': 'Destinos',
    'costa brava': 'Destinos',
    'galicia': 'Destinos',
    'canarias': 'Destinos',
    'españa': 'Destinos',
    'técnicas': 'Técnicas de Navegación',
    'navegación': 'Técnicas de Navegación',
    'navegacion': 'Técnicas de Navegación',
    'maniobras': 'Técnicas de Navegación',
    'fondeo': 'Técnicas de Navegación',
    'equipamiento': 'Equipamiento',
    'equipo': 'Equipamiento',
    'gadgets': 'Equipamiento',
    'gps': 'Equipamiento',
    'plotter': 'Equipamiento',
    'seguridad': 'Seguridad',
    'emergencias': 'Seguridad',
    'supervivencia': 'Seguridad',
    'chaleco': 'Seguridad',
    'ancla': 'Seguridad',
    'reviews': 'Reviews',
    'review': 'Reviews',
    'opinión': 'Reviews',
    'opinion': 'Reviews',
    'consejos': 'Consejos',
    'consejo': 'Consejos',
    'familia': 'Familia',
    'niños': 'Familia',
    'ninos': 'Familia',
    'aventura': 'Aventura',
    'sostenibilidad': 'Sostenibilidad',
    'sostenible': 'Sostenibilidad',
    'ecología': 'Sostenibilidad',
    'ecologia': 'Sostenibilidad',
    'medio ambiente': 'Sostenibilidad',
    'posidonia': 'Sostenibilidad',
    'licencias': 'Licencias y Certificaciones',
    'titulaciones': 'Licencias y Certificaciones',
    'patente': 'Licencias y Certificaciones',
    'pnb': 'Licencias y Certificaciones',
    'formación': 'Licencias y Certificaciones',
    'formacion': 'Licencias y Certificaciones',
    'mascotas': 'Mascotas',
    'perros': 'Mascotas',
    'deportes': 'Deportes Acuáticos',
    'deporte': 'Deportes Acuáticos',
    'wakeboard': 'Deportes Acuáticos',
    'paddle surf': 'Deportes Acuáticos',
    'snorkel': 'Deportes Acuáticos',
    'buceo': 'Deportes Acuáticos',
    'pesca': 'Deportes Acuáticos',
    'tecnología': 'Tecnología',
    'tecnologia': 'Tecnología',
    'ia': 'Tecnología',
    'inteligencia artificial': 'Tecnología',
    'bienvenida': 'General',
    'comunidad': 'General',
    'planificación': 'General',
    'planificacion': 'General'
  };

  for (const tag of tags) {
    const lowerTag = tag.toLowerCase();
    for (const [key, category] of Object.entries(categoryMap)) {
      if (lowerTag.includes(key)) {
        return category;
      }
    }
  }
  return 'General';
};

// Función para obtener nivel de dificultad
const getDifficultyLevel = (tags: string[], content: string): string => {
  const beginnerKeywords = ['principiantes', 'básico', 'iniciación', 'primeros pasos', 'guía completa'];
  const advancedKeywords = ['avanzado', 'experto', 'profesional', 'técnico', 'especializado'];
  
  const allText = `${tags.join(' ')} ${content}`.toLowerCase();
  
  if (advancedKeywords.some(keyword => allText.includes(keyword))) {
    return 'Avanzado';
  } else if (beginnerKeywords.some(keyword => allText.includes(keyword))) {
    return 'Principiante';
  }
  return 'Intermedio';
};

// Artículos destacados (seleccionados manualmente)
const getFeaturedPosts = () => {
  const featuredSlugs = [
    'bienvenida-al-blog',
    'mejores-destinos-aventura-barco-espana',
    'con-patron-o-sin-patron-claves-elegir-aventura-barco',
    'como-planificar-viaje-nautico-con-ia-boattrip-planner'
  ];
  
  return sortedBlogPosts.filter(post => featuredSlugs.includes(post.frontmatter.slug));
};

// Sort posts: welcome post first, then by date descending
const sortedBlogPosts = [...allBlogPosts].sort((a, b) => {
  if (a.frontmatter.slug === 'bienvenida-al-blog') return -1;
  if (b.frontmatter.slug === 'bienvenida-al-blog') return 1;
  return new Date(b.frontmatter.date).getTime() - new Date(a.frontmatter.date).getTime();
});

const POSTS_PER_PAGE = 8; // Display 8 posts per page for a cleaner grid layout

const BlogIndexPage: React.FC<BlogIndexPageProps> = ({ onNavigateToPost, onNavigateHome, showAppInstallBanner = false }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [darkMode, setDarkMode] = useState(false);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('');
  const [selectedReadingTime, setSelectedReadingTime] = useState<string>('');
  const [selectedMaritimeTheme, setSelectedMaritimeTheme] = useState<string>('');
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const [showSearchSuggestions, setShowSearchSuggestions] = useState(false);
  const [activeTab, setActiveTab] = useState<'all' | 'favorites' | 'featured'>('all');
  const [favorites, setFavorites] = useState<string[]>([]);
  const [maritimeFilters, setMaritimeFilters] = useState({
    onlyWithBoats: false,
    onlyDestinations: false,
    onlyEquipment: false,
    onlySafety: false
  });

  // Leer parámetros de URL al cargar el componente
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const categoryParam = params.get('category');
    if (categoryParam) {
      setSelectedCategory(categoryParam);
    }
  }, []);

  // Toggle dark mode
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  // Toggle advanced filters
  const toggleAdvancedFilters = () => {
    setShowAdvancedFilters(!showAdvancedFilters);
  };

  // Cargar favoritos al iniciar
  useEffect(() => {
    const savedFavorites = localStorage.getItem('blogFavorites');
    if (savedFavorites) {
      try {
        setFavorites(JSON.parse(savedFavorites));
      } catch (e) {
        console.warn('Error loading favorites:', e);
      }
    }
  }, []);

  // Agregar búsqueda al historial
  const addToSearchHistory = (query: string) => {
    if (query.trim() && !searchHistory.includes(query.trim())) {
      const newHistory = [query.trim(), ...searchHistory.slice(0, 4)]; // Mantener solo 5 elementos
      setSearchHistory(newHistory);
      localStorage.setItem('blogSearchHistory', JSON.stringify(newHistory));
    }
  };

  // Cargar historial de búsqueda al iniciar
  useEffect(() => {
    const savedHistory = localStorage.getItem('blogSearchHistory');
    if (savedHistory) {
      try {
        setSearchHistory(JSON.parse(savedHistory));
      } catch (e) {
        console.warn('Error loading search history:', e);
      }
    }
  }, []);

  const allTags = useMemo(() => {
    const tagsSet = new Set<string>();
    sortedBlogPosts.forEach(post => {
      post.frontmatter.tags?.forEach(tag => tagsSet.add(tag));
    });
    return Array.from(tagsSet).sort();
  }, []);
  


  // Opciones para filtros avanzados
  const categoryOptions = useMemo(() => {
    const categories = new Set<string>();
    sortedBlogPosts.forEach(post => {
      if (post.frontmatter.tags) {
        categories.add(getArticleCategory(post.frontmatter.tags));
      }
    });
    return [
      { value: '', label: 'Todas las categorías' },
      ...Array.from(categories).sort().map(cat => ({ value: cat, label: cat }))
    ];
  }, []);

  const difficultyOptions = [
    { value: '', label: 'Todos los niveles' },
    { value: 'Principiante', label: 'Principiante' },
    { value: 'Intermedio', label: 'Intermedio' },
    { value: 'Avanzado', label: 'Avanzado' }
  ];

  const readingTimeOptions = [
    { value: '', label: 'Cualquier duración' },
    { value: '1-3', label: '1-3 minutos' },
    { value: '4-7', label: '4-7 minutos' },
    { value: '8-15', label: '8-15 minutos' },
    { value: '15+', label: 'Más de 15 minutos' }
  ];

  // Sugerencias de búsqueda
  const searchSuggestions = useMemo(() => {
    if (!searchQuery.trim()) return [];
    
    const suggestions = new Set<string>();
    const query = searchQuery.toLowerCase();
    
    // Buscar en títulos
    sortedBlogPosts.forEach(post => {
      if (post.frontmatter.title.toLowerCase().includes(query)) {
        suggestions.add(post.frontmatter.title);
      }
    });
    
    // Buscar en etiquetas
    allTags.forEach(tag => {
      if (tag.toLowerCase().includes(query)) {
        suggestions.add(tag);
      }
    });
    
    // Buscar en historial
    searchHistory.forEach(historyItem => {
      if (historyItem.toLowerCase().includes(query)) {
        suggestions.add(historyItem);
      }
    });
    
    return Array.from(suggestions).slice(0, 5);
  }, [searchQuery, searchHistory, allTags]);

  // Obtener posts según la pestaña activa
  const getPostsForActiveTab = () => {
    if (activeTab === 'favorites') {
      return sortedBlogPosts.filter(post => favorites.includes(post.frontmatter.slug));
    } else if (activeTab === 'featured') {
      return getFeaturedPosts();
    }
    return sortedBlogPosts;
  };

  const filteredPosts = useMemo(() => {
    let posts = getPostsForActiveTab();
    
    // Filtro por etiqueta
    if (activeTag) {
        posts = posts.filter(post => post.frontmatter.tags?.includes(activeTag));
    }

    // Filtro por categoría
    if (selectedCategory) {
        posts = posts.filter(post => {
            if (!post.frontmatter.tags) return false;
            return getArticleCategory(post.frontmatter.tags) === selectedCategory;
        });
    }

    // Filtro por dificultad
    if (selectedDifficulty) {
        posts = posts.filter(post => {
            if (!post.frontmatter.tags) return false;
            return getDifficultyLevel(post.frontmatter.tags, post.content) === selectedDifficulty;
        });
    }

    // Filtro por tiempo de lectura
    if (selectedReadingTime) {
        posts = posts.filter(post => {
            const readingTime = calculateReadingTime(post.content);
            switch (selectedReadingTime) {
                case '1-3':
                    return readingTime >= 1 && readingTime <= 3;
                case '4-7':
                    return readingTime >= 4 && readingTime <= 7;
                case '8-15':
                    return readingTime >= 8 && readingTime <= 15;
                case '15+':
                    return readingTime > 15;
                default:
                    return true;
            }
        });
    }

    // Búsqueda por texto
    if (searchQuery.trim()) {
      const lowerQuery = searchQuery.toLowerCase();
      posts = posts.filter(post =>
        post.frontmatter.title.toLowerCase().includes(lowerQuery) ||
        post.frontmatter.summary.toLowerCase().includes(lowerQuery) ||
        post.content.toLowerCase().includes(lowerQuery) || // Búsqueda en contenido
        (post.frontmatter.tags && post.frontmatter.tags.some(tag => tag.toLowerCase().includes(lowerQuery))) ||
        (post.frontmatter.author && post.frontmatter.author.toLowerCase().includes(lowerQuery))
      );
    }
    return posts;
  }, [searchQuery, activeTag, selectedCategory, selectedDifficulty, selectedReadingTime, activeTab, favorites]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, activeTag, selectedCategory, selectedDifficulty, selectedReadingTime, activeTab]);

  // Unified pagination logic for all filtered posts
  const totalPages = Math.ceil(filteredPosts.length / POSTS_PER_PAGE);
  const startIndex = (currentPage - 1) * POSTS_PER_PAGE;
  const endIndex = startIndex + POSTS_PER_PAGE;
  const currentPostsToDisplay = filteredPosts.slice(startIndex, endIndex);

  const handlePageChange = (pageNumber: number) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };
  


  const handleSearch = (query: string) => {
    setSearchQuery(query);
    addToSearchHistory(query);
    setShowSearchSuggestions(false);
  };

  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    setShowSearchSuggestions(value.trim().length > 0);
  };

  const clearAllFilters = () => {
    setSearchQuery('');
    setActiveTag(null);
    setSelectedCategory('');
    setSelectedDifficulty('');
    setSelectedReadingTime('');
    setSelectedMaritimeTheme('');
    setCurrentPage(1);
    setMaritimeFilters({
      onlyWithBoats: false,
      onlyDestinations: false,
      onlyEquipment: false,
      onlySafety: false
    });
  };

  const renderPageNumbers = () => {
    if (totalPages <= 1) return null;
    const pageNumbers = [];
    const maxPagesToShow = 5; 
    let startPage, endPage;

    if (totalPages <= maxPagesToShow) {
      startPage = 1;
      endPage = totalPages;
    } else {
      if (currentPage <= Math.ceil(maxPagesToShow / 2)) {
        startPage = 1;
        endPage = maxPagesToShow;
      } else if (currentPage + Math.floor(maxPagesToShow / 2) >= totalPages) {
        startPage = totalPages - maxPagesToShow + 1;
        endPage = totalPages;
      } else {
        startPage = currentPage - Math.floor(maxPagesToShow / 2);
        endPage = currentPage + Math.floor(maxPagesToShow / 2);
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(
        <Button
          key={i}
          onClick={() => handlePageChange(i)}
          variant={i === currentPage ? 'primary' : 'secondary'}
          size="sm"
          className={`mx-1 ${i === currentPage ? 'font-bold' : ''}`}
          aria-current={i === currentPage ? 'page' : undefined}
          aria-label={`Ir a la página ${i}`}
        >
          {i}
        </Button>
      );
    }
    
    if (totalPages > maxPagesToShow) {
        if (startPage > 1) {
            pageNumbers.unshift(<span key="start-ellipsis" className="mx-1 p-2">...</span>);
            pageNumbers.unshift(
                <Button key={1} onClick={() => handlePageChange(1)} variant="secondary" size="sm" className="mx-1" aria-label="Ir a la página 1">1</Button>
            );
        }
        if (endPage < totalPages) {
            pageNumbers.push(<span key="end-ellipsis" className="mx-1 p-2">...</span>);
            pageNumbers.push(
                <Button key={totalPages} onClick={() => handlePageChange(totalPages)} variant="secondary" size="sm" className="mx-1" aria-label={`Ir a la página ${totalPages}`}>{totalPages}</Button>
            );
        }
    }

    return pageNumbers;
  };

  // Componente para mostrar categorías principales
  const CategorySection = () => {
    const categories = [
      { name: 'Destinos', icon: '🗺️', key: 'destinos' },
      { name: 'Técnicas de Navegación', icon: '⚓', key: 'técnicas' },
      { name: 'Equipamiento', icon: '🛥️', key: 'equipamiento' },
      { name: 'Seguridad', icon: '🛟', key: 'seguridad' },
      { name: 'Reviews', icon: '⭐', key: 'reviews' },
      { name: 'Consejos', icon: '💡', key: 'consejos' },
      { name: 'Familia', icon: '👨‍👩‍👧‍👦', key: 'familia' },
      { name: 'Deportes Acuáticos', icon: '🏄‍♂️', key: 'deportes' },
      { name: 'Tecnología', icon: '📱', key: 'tecnología' },
      { name: 'Sostenibilidad', icon: '🌍', key: 'sostenibilidad' },
      { name: 'Licencias y Certificaciones', icon: '🎓', key: 'licencias' },
      { name: 'Mascotas', icon: '🐕', key: 'mascotas' }
    ];

    return (
      <div className="mb-6 sm:mb-8">
        <h3 className={`text-lg sm:text-xl font-bold mb-3 sm:mb-4 ${darkMode ? 'text-white' : 'text-slate-800'}`}>
          Explora por Categorías
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
          {categories.map((category) => {
            const categoryPosts = sortedBlogPosts.filter(post => 
              getArticleCategory(post.frontmatter.tags || []) === category.name
            );
            
            return (
              <button
                key={category.key}
                onClick={() => {
                  setSelectedCategory(category.name);
                  setActiveTab('all');
                  setCurrentPage(1);
                }}
                className={`p-3 sm:p-4 rounded-lg border-2 transition-all duration-200 hover:scale-105 ${
                  selectedCategory === category.name
                    ? `${darkMode ? 'border-teal-400 bg-teal-400/10' : 'border-teal-500 bg-teal-50'}`
                    : `${darkMode ? 'border-slate-600 hover:border-teal-400' : 'border-slate-200 hover:border-teal-300'}`
                }`}
              >
                <div className="text-xl sm:text-2xl mb-1 sm:mb-2">{category.icon}</div>
                <div className={`font-semibold text-xs sm:text-sm ${darkMode ? 'text-white' : 'text-slate-800'}`}>
                  {category.name}
                </div>
                <div className={`text-xs ${darkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                  {categoryPosts.length} artículos
                </div>
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  return (
            <div className={`w-full max-w-5xl mx-auto transition-all duration-300 ease-out ${darkMode ? 'dark' : ''} ${showAppInstallBanner ? 'pt-4 sm:pt-6' : ''}`}>
      <div className={`${darkMode ? 'bg-slate-800 text-white' : 'bg-white'} p-4 sm:p-6 md:p-8 rounded-lg shadow-xl transition-colors duration-300`}>
        <div className="flex flex-col sm:flex-row justify-between items-center mb-4 sm:mb-6 pb-3 sm:pb-4 border-b border-slate-200 dark:border-slate-600">
          <h1 className={`text-2xl sm:text-3xl md:text-4xl font-bold ${darkMode ? 'text-white' : 'text-slate-800'} mb-3 sm:mb-0 text-center sm:text-left`}>
            Blog de Aventuras Náuticas
          </h1>
          <div className="flex gap-2">
            <Button 
              onClick={toggleDarkMode} 
              variant="secondary" 
              size="sm" 
              className="w-auto px-3 py-2"
            >
              {darkMode ? '☀️' : '🌙'}
            </Button>
            <Button onClick={onNavigateHome} variant="secondary" size="sm" className="w-auto px-3 py-2">
              Ir al Planificador
            </Button>
          </div>
        </div>

        {/* Pestañas - Mejoradas para móvil */}
        <div className="flex flex-wrap border-b border-slate-200 dark:border-slate-600 mb-4 sm:mb-6">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-3 sm:px-4 py-2 text-sm sm:text-base font-medium transition-colors duration-200 ${
              activeTab === 'all'
                ? `${darkMode ? 'text-teal-400 border-b-2 border-teal-400' : 'text-teal-600 border-b-2 border-teal-600'}`
                : `${darkMode ? 'text-slate-300 hover:text-white' : 'text-slate-500 hover:text-slate-700'}`
            }`}
          >
            Todos ({sortedBlogPosts.length})
          </button>
          <button
            onClick={() => setActiveTab('featured')}
            className={`px-3 sm:px-4 py-2 text-sm sm:text-base font-medium transition-colors duration-200 ${
              activeTab === 'featured'
                ? `${darkMode ? 'text-teal-400 border-b-2 border-teal-400' : 'text-teal-600 border-b-2 border-teal-600'}`
                : `${darkMode ? 'text-slate-300 hover:text-white' : 'text-slate-500 hover:text-slate-700'}`
            }`}
          >
            ⭐ Destacados ({getFeaturedPosts().length})
          </button>
          <button
            onClick={() => setActiveTab('favorites')}
            className={`px-3 sm:px-4 py-2 text-sm sm:text-base font-medium transition-colors duration-200 ${
              activeTab === 'favorites'
                ? `${darkMode ? 'text-teal-400 border-b-2 border-teal-400' : 'text-teal-600 border-b-2 border-teal-600'}`
                : `${darkMode ? 'text-slate-300 hover:text-white' : 'text-slate-500 hover:text-slate-700'}`
            }`}
          >
            ❤️ Favoritos ({favorites.length})
          </button>
        </div>

        {/* Categorías principales (solo en la pestaña "Todos") */}
        {activeTab === 'all' && !searchQuery && !activeTag && !selectedCategory && !selectedDifficulty && !selectedReadingTime && (
          <>
            <CategorySection />
          </>
        )}

        {/* Búsqueda principal */}
        <div className="mb-4 sm:mb-6">
          <div className="relative">
            <InputField
              label="Buscar en el blog..."
              id="blog-search"
              type="text"
              placeholder="Escribe palabras clave, títulos, contenido..."
              value={searchQuery}
              onChange={handleSearchInputChange}
              onFocus={() => setShowSearchSuggestions(searchQuery.trim().length > 0)}
            />
            
            {/* Sugerencias de búsqueda */}
            {showSearchSuggestions && (searchSuggestions.length > 0 || searchHistory.length > 0) && (
              <div className={`absolute top-full left-0 right-0 z-50 mt-1 rounded-lg shadow-lg border ${darkMode ? 'bg-slate-700 border-slate-600' : 'bg-white border-slate-200'}`}>
                {searchSuggestions.length > 0 && (
                  <div className="p-2">
                    <div className={`text-xs font-semibold mb-2 ${darkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                      Sugerencias:
                    </div>
                    {searchSuggestions.map((suggestion, index) => (
                      <button
                        key={index}
                        onClick={() => handleSearch(suggestion)}
                        className={`w-full text-left px-3 py-2 rounded hover:bg-teal-50 hover:text-teal-700 transition-colors ${darkMode ? 'text-slate-200 hover:bg-slate-600' : 'text-slate-700'}`}
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                )}
                {searchHistory.length > 0 && (
                  <div className="p-2 border-t border-slate-200 dark:border-slate-600">
                    <div className={`text-xs font-semibold mb-2 ${darkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                      Búsquedas recientes:
                    </div>
                    {searchHistory.map((query, index) => (
                      <button
                        key={index}
                        onClick={() => handleSearch(query)}
                        className={`w-full text-left px-3 py-2 rounded hover:bg-teal-50 hover:text-teal-700 transition-colors ${darkMode ? 'text-slate-200 hover:bg-slate-600' : 'text-slate-700'}`}
                      >
                        {query}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Filtros avanzados */}
        <div className="mb-4 sm:mb-6">
          <button
            onClick={toggleAdvancedFilters}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              darkMode 
                ? 'bg-slate-700 hover:bg-slate-600 text-slate-200' 
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
            }`}
          >
            <span>🔍</span>
            Filtros Avanzados
            <span className={`transform transition-transform ${showAdvancedFilters ? 'rotate-180' : ''}`}>
              ▼
            </span>
          </button>
          
          {showAdvancedFilters && (
            <div className={`mt-3 p-4 rounded-lg ${darkMode ? 'bg-slate-700' : 'bg-slate-50'}`}>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                <SelectField
                  label="Categoría"
                  id="category-filter"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  options={categoryOptions}
                />
                <SelectField
                  label="Nivel de Dificultad"
                  id="difficulty-filter"
                  value={selectedDifficulty}
                  onChange={(e) => setSelectedDifficulty(e.target.value)}
                  options={difficultyOptions}
                />
                <SelectField
                  label="Tiempo de Lectura"
                  id="reading-time-filter"
                  value={selectedReadingTime}
                  onChange={(e) => setSelectedReadingTime(e.target.value)}
                  options={readingTimeOptions}
                />
              </div>
              <div className="mt-4 flex justify-end">
                <Button
                  onClick={clearAllFilters}
                  variant="secondary"
                  size="sm"
                  className="px-3 py-2"
                >
                  Limpiar Filtros
                </Button>
              </div>
            </div>
          )}
        </div>
        
        <div className="mb-6">
          <p className={`text-sm ${darkMode ? 'text-slate-300' : 'text-slate-600'}`}>
            Mostrando {currentPostsToDisplay.length} de {filteredPosts.length} artículos.
            {filteredPosts.length !== getPostsForActiveTab().length && (
              <span className="ml-2">
                <button
                  onClick={clearAllFilters}
                  className="text-teal-600 hover:text-teal-700 underline"
                >
                  Ver todos los artículos
                </button>
              </span>
            )}
          </p>
        </div>

        {filteredPosts.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 md:gap-8">
              {currentPostsToDisplay.map((post) => {
                const readingTime = calculateReadingTime(post.content);
                const featuredImage = getFeaturedImage(post.frontmatter.slug, post.frontmatter.tags);
                const category = post.frontmatter.tags ? getArticleCategory(post.frontmatter.tags) : 'General';
                const difficulty = post.frontmatter.tags ? getDifficultyLevel(post.frontmatter.tags, post.content) : 'Intermedio';
                const isPostFavorite = favorites.includes(post.frontmatter.slug);
                
                return (
                  <article key={post.frontmatter.slug} className={`group ${darkMode ? 'bg-slate-700 hover:bg-slate-600' : 'bg-white'} rounded-lg shadow-md hover:shadow-lg transition-all duration-300 flex flex-col overflow-hidden`}>
                    {/* Imagen destacada */}
                    <div className="relative h-40 sm:h-48 overflow-hidden">
                      <img 
                        src={featuredImage} 
                        alt={post.frontmatter.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&h=300&fit=crop&crop=center';
                        }}
                      />
                      {/* Overlay con tiempo de lectura */}
                      <div className="absolute top-2 sm:top-3 right-2 sm:right-3 bg-black bg-opacity-70 text-white px-2 py-1 rounded text-xs font-medium">
                        ⏱️ {readingTime} min
                      </div>
                      {/* Badge de categoría */}
                      <div className="absolute top-2 sm:top-3 left-2 sm:left-3 bg-teal-600 text-white px-2 py-1 rounded text-xs font-medium">
                        {category}
                      </div>
                      {/* Badge de dificultad */}
                      <div className={`absolute bottom-2 sm:bottom-3 left-2 sm:left-3 px-2 py-1 rounded text-xs font-medium ${
                        difficulty === 'Principiante' ? 'bg-green-600 text-white' :
                        difficulty === 'Intermedio' ? 'bg-yellow-600 text-white' :
                        'bg-red-600 text-white'
                      }`}>
                        {difficulty}
                      </div>
                      {/* Indicador de favorito */}
                      {isPostFavorite && (
                        <div className="absolute bottom-2 sm:bottom-3 right-2 sm:right-3 bg-red-500 text-white px-2 py-1 rounded text-xs font-medium">
                          ❤️
                        </div>
                      )}
                    </div>
                    
                    <div className="p-4 sm:p-6 flex flex-col flex-grow">
                      <h3 className={`text-lg sm:text-xl font-semibold ${darkMode ? 'text-white group-hover:text-teal-400' : 'text-slate-800 group-hover:text-teal-700'} transition-colors mb-2`}>
                        <button
                          onClick={() => onNavigateToPost(post.frontmatter.slug)}
                          className="text-left focus:outline-none focus:underline"
                        >
                          {post.frontmatter.title}
                        </button>
                      </h3>
                      <p className={`text-xs sm:text-sm ${darkMode ? 'text-slate-300' : 'text-slate-500'} mb-2 sm:mb-3`}>
                        {formatDate(post.frontmatter.date)}
                      </p>
                      <p className={`${darkMode ? 'text-slate-200' : 'text-slate-700'} leading-relaxed mb-3 sm:mb-4 flex-grow text-sm sm:text-base`}>
                        {post.frontmatter.summary}
                      </p>
                      
                      {/* Etiquetas */}
                      {post.frontmatter.tags && post.frontmatter.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 sm:gap-2 mb-3 sm:mb-4">
                          {post.frontmatter.tags.slice(0, 3).map((tag) => (
                            <span 
                              key={tag}
                              className={`text-xs px-2 py-1 rounded-full ${darkMode ? 'bg-teal-600 text-white' : 'bg-teal-100 text-teal-800'}`}
                            >
                              {tag}
                            </span>
                          ))}
                          {post.frontmatter.tags.length > 3 && (
                            <span className={`text-xs px-2 py-1 rounded-full ${darkMode ? 'bg-slate-600 text-slate-300' : 'bg-slate-100 text-slate-600'}`}>
                              +{post.frontmatter.tags.length - 3}
                            </span>
                          )}
                        </div>
                      )}
                      
                      <Button
                        onClick={() => onNavigateToPost(post.frontmatter.slug)}
                        variant="primary"
                        size="sm"
                        className="mt-auto self-start px-3 py-2"
                      >
                        Leer Más &rarr;
                      </Button>
                    </div>
                  </article>
                );
              })}
            </div>

            {totalPages > 1 && (
              <div className={`mt-8 sm:mt-10 pt-4 sm:pt-6 border-t ${darkMode ? 'border-slate-600' : 'border-slate-200'} flex flex-wrap justify-center items-center gap-2`}>
                <Button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  variant="secondary"
                  size="sm"
                  className="px-3 py-2 text-sm"
                  aria-label="Página anterior"
                >
                  &larr; Anterior
                </Button>
                {renderPageNumbers()}
                <Button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  variant="secondary"
                  size="sm"
                  className="px-3 py-2 text-sm"
                  aria-label="Página siguiente"
                >
                  Siguiente &rarr;
                </Button>
              </div>
            )}
          </>
        ) : (
          <p className={`${darkMode ? 'text-slate-300' : 'text-slate-600'} text-center py-8`}>
            {activeTab === 'favorites' 
              ? 'No tienes artículos favoritos guardados. ¡Marca algunos artículos como favoritos para verlos aquí!'
              : activeTab === 'featured'
              ? 'No hay artículos destacados disponibles.'
              : 'No se encontraron artículos con tus criterios de búsqueda.'
            }
            {activeTab === 'all' && (
              <button
                onClick={clearAllFilters}
                className="ml-2 text-teal-600 hover:text-teal-700 underline"
              >
                Limpiar filtros
              </button>
            )}
          </p>
        )}
      </div>
    </div>
  );
};

export default BlogIndexPage;
