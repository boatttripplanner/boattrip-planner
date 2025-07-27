// src/components/BlogIndexPage.tsx
import React, { useState, useMemo, useEffect } from 'react';
import { BlogIndexPageProps } from '../../types';
import { allBlogPosts } from '../blogData';
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

// Función para obtener imagen destacada basada en el slug
const getFeaturedImage = (slug: string): string => {
  // Para desarrollo, usamos imágenes de placeholder atractivas
  const imageMap: { [key: string]: string } = {
    'bienvenida-al-blog': 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&h=300&fit=crop&crop=center',
    'consejos-vencer-mareo-barco': 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400&h=300&fit=crop&crop=center',
    'con-patron-o-sin-patron-claves-elegir-aventura-barco': 'https://images.unsplash.com/photo-1569263979104-865ab5c6b6c8?w=400&h=300&fit=crop&crop=center',
    'navegacion-sostenible-protege-mar-mientras-disfrutas': 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop&crop=center',
    'que-es-un-catamaran-ventajas-desventajas-aventura-nautica': 'https://images.unsplash.com/photo-1544551763-77ef2d0cfc6c?w=400&h=300&fit=crop&crop=center',
    'alquiler-barcos-por-horas-explora-mar-a-tu-ritmo': 'https://images.unsplash.com/photo-1569263979104-865ab5c6b6c8?w=400&h=300&fit=crop&crop=center',
    'navegar-en-familia-crea-recuerdos-inolvidables': 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop&crop=center',
    'el-diario-de-abordo-captura-cada-momento-aventura-marina': 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&h=300&fit=crop&crop=center',
    'mejores-destinos-aventura-barco-espana': 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400&h=300&fit=crop&crop=center',
    'mejor-aliado-alquilar-barco-nuestra-experiencia': 'https://images.unsplash.com/photo-1569263979104-865ab5c6b6c8?w=400&h=300&fit=crop&crop=center',
    'guia-completa-viajar-barco-mascotas': 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop&crop=center',
    'si-llueve-viaje-barco-planes-alternativos-dia-brillante': 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&h=300&fit=crop&crop=center',
    'guia-pesca-desde-barco-principiantes': 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400&h=300&fit=crop&crop=center',
    'cala-macarella-macarelleta-menorca-paraiso-escondido': 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop&crop=center',
    'alquilar-velero-experiencia-pura-navegar-a-vela': 'https://images.unsplash.com/photo-1544551763-77ef2d0cfc6c?w=400&h=300&fit=crop&crop=center',
    'alquilar-barco-a-motor-velocidad-confort': 'https://images.unsplash.com/photo-1569263979104-865ab5c6b6c8?w=400&h=300&fit=crop&crop=center',
    'posidonia-oceanica-tesoro-submarino-proteger-navegar': 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop&crop=center',
    'rumbovivo-escuela-nautica-patrones-exigentes': 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&h=300&fit=crop&crop=center',
    'banderas-de-cortesia-simbolo-respeto-puerto': 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400&h=300&fit=crop&crop=center',
    'navegar-en-ibiza-descubre-isla-magica': 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop&crop=center',
    'gps-nautico-navegador-indispensable': 'https://images.unsplash.com/photo-1569263979104-865ab5c6b6c8?w=400&h=300&fit=crop&crop=center',
    'el-paddle-surf-sup-explora-mar-ritmo-fortalece-cuerpo': 'https://images.unsplash.com/photo-1544551763-77ef2d0cfc6c?w=400&h=300&fit=crop&crop=center',
    'navegar-costa-brava-explora-encanto-mediterraneo': 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop&crop=center',
    'como-planificar-viaje-nautico-con-ia-boattrip-planner': 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&h=300&fit=crop&crop=center',
    'patente-de-navegacion-primer-paso-capitan': 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400&h=300&fit=crop&crop=center',
    'patron-de-navegacion-basica-pnb-siguiente-nivel': 'https://images.unsplash.com/photo-1569263979104-865ab5c6b6c8?w=400&h=300&fit=crop&crop=center',
    'fuera-pajaros-protege-tu-barco-visitantes-alados': 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop&crop=center',
    'el-ancla-tu-fiel-guardian-en-cada-fondeo': 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&h=300&fit=crop&crop=center',
    'el-traje-de-neopreno-tu-aliado-indispensable': 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400&h=300&fit=crop&crop=center',
    'como-elegir-mejor-chaleco-salvavidas': 'https://images.unsplash.com/photo-1569263979104-865ab5c6b6c8?w=400&h=300&fit=crop&crop=center',
    'cressi-rondinella-aletas-snorkel-review': 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop&crop=center',
    'gadgets-nauticos-siglo-xxi': 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&h=300&fit=crop&crop=center',
    'samboat-review-plataforma-alquiler-barcos': 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400&h=300&fit=crop&crop=center',
    'mejores-destinos-windsurf-kitesurf-espana': 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop&crop=center',
    'menorca-en-barco-paraiso-calas-turquesas': 'https://images.unsplash.com/photo-1544551763-77ef2d0cfc6c?w=400&h=300&fit=crop&crop=center',
    'mejores-libros-navegacion': 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&h=300&fit=crop&crop=center',
    'review-garmin-echomap-uhd-mejor-plotter-sonda': 'https://images.unsplash.com/photo-1569263979104-865ab5c6b6c8?w=400&h=300&fit=crop&crop=center',
  };
  
  return imageMap[slug] || 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&h=300&fit=crop&crop=center';
};

// Función para obtener categorías de artículos
const getArticleCategory = (tags: string[]): string => {
  const categoryMap: { [key: string]: string } = {
    'destinos': 'Destinos',
    'destino': 'Destinos',
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

const BlogIndexPage: React.FC<BlogIndexPageProps> = ({ onNavigateToPost, onNavigateHome }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [darkMode, setDarkMode] = useState(false);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('');
  const [selectedReadingTime, setSelectedReadingTime] = useState<string>('');
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const [showSearchSuggestions, setShowSearchSuggestions] = useState(false);
  const [activeTab, setActiveTab] = useState<'all' | 'favorites' | 'featured'>('all');
  const [favorites, setFavorites] = useState<string[]>([]);

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
  
  const tagOptions = useMemo(() => {
    const options = [{ value: '', label: 'Ver todas las etiquetas' }];
    allTags.forEach(tag => {
        const capitalizedTag = tag.charAt(0).toUpperCase() + tag.slice(1);
        options.push({ value: tag, label: capitalizedTag });
    });
    return options;
  }, [allTags]);

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
  
  const handleTagClick = (tag: string | null) => {
    setActiveTag(tag);
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
    setCurrentPage(1);
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
      <div className="mb-8">
        <h3 className={`text-xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-slate-800'}`}>
          Explora por Categorías
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
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
                className={`p-4 rounded-lg border-2 transition-all duration-200 hover:scale-105 ${
                  selectedCategory === category.name
                    ? `${darkMode ? 'border-teal-400 bg-teal-400/10' : 'border-teal-500 bg-teal-50'}`
                    : `${darkMode ? 'border-slate-600 hover:border-teal-400' : 'border-slate-200 hover:border-teal-300'}`
                }`}
              >
                <div className="text-2xl mb-2">{category.icon}</div>
                <div className={`font-semibold text-sm ${darkMode ? 'text-white' : 'text-slate-800'}`}>
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
    <div className={`w-full max-w-5xl mx-auto transition-colors duration-300 ${darkMode ? 'dark' : ''}`}>
      <div className={`${darkMode ? 'bg-slate-800 text-white' : 'bg-white'} p-6 md:p-8 rounded-lg shadow-xl transition-colors duration-300`}>
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6 pb-4 border-b border-slate-200 dark:border-slate-600">
          <h1 className={`text-3xl sm:text-4xl font-bold ${darkMode ? 'text-white' : 'text-slate-800'} mb-4 sm:mb-0`}>
            Blog de Aventuras Náuticas
          </h1>
          <div className="flex gap-2">
            <Button 
              onClick={toggleDarkMode} 
              variant="secondary" 
              size="sm" 
              className="w-auto"
            >
              {darkMode ? '☀️' : '🌙'}
            </Button>
            <Button onClick={onNavigateHome} variant="secondary" size="sm" className="w-auto">
              Ir al Planificador
            </Button>
          </div>
        </div>

        {/* Pestañas */}
        <div className="flex border-b border-slate-200 dark:border-slate-600 mb-6">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-4 py-2 font-medium transition-colors duration-200 ${
              activeTab === 'all'
                ? `${darkMode ? 'text-teal-400 border-b-2 border-teal-400' : 'text-teal-600 border-b-2 border-teal-600'}`
                : `${darkMode ? 'text-slate-300 hover:text-white' : 'text-slate-500 hover:text-slate-700'}`
            }`}
          >
            Todos los Artículos ({sortedBlogPosts.length})
          </button>
          <button
            onClick={() => setActiveTab('featured')}
            className={`px-4 py-2 font-medium transition-colors duration-200 ${
              activeTab === 'featured'
                ? `${darkMode ? 'text-teal-400 border-b-2 border-teal-400' : 'text-teal-600 border-b-2 border-teal-600'}`
                : `${darkMode ? 'text-slate-300 hover:text-white' : 'text-slate-500 hover:text-slate-700'}`
            }`}
          >
            ⭐ Destacados ({getFeaturedPosts().length})
          </button>
          <button
            onClick={() => setActiveTab('favorites')}
            className={`px-4 py-2 font-medium transition-colors duration-200 ${
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
        <div className="mb-6">
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
                      Historial:
                    </div>
                    {searchHistory.map((historyItem, index) => (
                      <button
                        key={index}
                        onClick={() => handleSearch(historyItem)}
                        className={`w-full text-left px-3 py-2 rounded hover:bg-teal-50 hover:text-teal-700 transition-colors ${darkMode ? 'text-slate-200 hover:bg-slate-600' : 'text-slate-700'}`}
                      >
                        🔍 {historyItem}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Filtros básicos */}
        <div className="mb-6 flex flex-col md:flex-row gap-4">
          <div className="flex-grow">
            <SelectField
              label="Filtrar por Etiqueta"
              id="tag-filter-select"
              value={activeTag || ''}
              onChange={(e) => handleTagClick(e.target.value || null)}
              options={tagOptions}
            />
          </div>
          <div className="flex-shrink-0">
            <Button
              onClick={toggleAdvancedFilters}
              variant="secondary"
              size="sm"
              className="w-full md:w-auto"
            >
              {showAdvancedFilters ? 'Ocultar' : 'Mostrar'} Filtros Avanzados
            </Button>
          </div>
        </div>

        {/* Filtros avanzados */}
        {showAdvancedFilters && (
          <div className={`mb-6 p-4 rounded-lg ${darkMode ? 'bg-slate-700' : 'bg-slate-50'}`}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
              >
                Limpiar Filtros
              </Button>
            </div>
          </div>
        )}
        
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {currentPostsToDisplay.map((post) => {
                const readingTime = calculateReadingTime(post.content);
                const featuredImage = getFeaturedImage(post.frontmatter.slug);
                const category = post.frontmatter.tags ? getArticleCategory(post.frontmatter.tags) : 'General';
                const difficulty = post.frontmatter.tags ? getDifficultyLevel(post.frontmatter.tags, post.content) : 'Intermedio';
                const isPostFavorite = favorites.includes(post.frontmatter.slug);
                
                return (
                  <article key={post.frontmatter.slug} className={`group ${darkMode ? 'bg-slate-700 hover:bg-slate-600' : 'bg-white'} rounded-lg shadow-md hover:shadow-lg transition-all duration-300 flex flex-col overflow-hidden`}>
                    {/* Imagen destacada */}
                    <div className="relative h-48 overflow-hidden">
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
                      <div className="absolute top-3 right-3 bg-black bg-opacity-70 text-white px-2 py-1 rounded text-xs font-medium">
                        ⏱️ {readingTime} min
                      </div>
                      {/* Badge de categoría */}
                      <div className="absolute top-3 left-3 bg-teal-600 text-white px-2 py-1 rounded text-xs font-medium">
                        {category}
                      </div>
                      {/* Badge de dificultad */}
                      <div className={`absolute bottom-3 left-3 px-2 py-1 rounded text-xs font-medium ${
                        difficulty === 'Principiante' ? 'bg-green-600 text-white' :
                        difficulty === 'Intermedio' ? 'bg-yellow-600 text-white' :
                        'bg-red-600 text-white'
                      }`}>
                        {difficulty}
                      </div>
                      {/* Indicador de favorito */}
                      {isPostFavorite && (
                        <div className="absolute bottom-3 right-3 bg-red-500 text-white px-2 py-1 rounded text-xs font-medium">
                          ❤️
                        </div>
                      )}
                    </div>
                    
                    <div className="p-6 flex flex-col flex-grow">
                      <h3 className={`text-xl font-semibold ${darkMode ? 'text-white group-hover:text-teal-400' : 'text-slate-800 group-hover:text-teal-700'} transition-colors mb-2`}>
                        <button
                          onClick={() => onNavigateToPost(post.frontmatter.slug)}
                          className="text-left focus:outline-none focus:underline"
                        >
                          {post.frontmatter.title}
                        </button>
                      </h3>
                      <p className={`text-sm ${darkMode ? 'text-slate-300' : 'text-slate-500'} mb-3`}>
                        {formatDate(post.frontmatter.date)}
                      </p>
                      <p className={`${darkMode ? 'text-slate-200' : 'text-slate-700'} leading-relaxed mb-4 flex-grow`}>
                        {post.frontmatter.summary}
                      </p>
                      
                      {/* Etiquetas */}
                      {post.frontmatter.tags && post.frontmatter.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-4">
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
                        className="mt-auto self-start"
                      >
                        Leer Más &rarr;
                      </Button>
                    </div>
                  </article>
                );
              })}
            </div>

            {totalPages > 1 && (
              <div className={`mt-10 pt-6 border-t ${darkMode ? 'border-slate-600' : 'border-slate-200'} flex flex-wrap justify-center items-center gap-2`}>
                <Button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  variant="secondary"
                  size="sm"
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