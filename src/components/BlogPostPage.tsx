// src/components/BlogPostPage.tsx
import React, { useMemo, useState, useEffect } from 'react';
import ReactMarkdown, { Components } from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { existingBlogPosts_definitions_only as allBlogPosts, NAUTICAL_IMAGES } from '../blogData';
// Importar componente de productos recomendados de Amazon
import RecommendedProducts from './RecommendedProducts';
import NotFoundPage from './NotFoundPage';
import { Button } from '../../components/Button';
import { WhatsAppIcon } from '../../components/icons/WhatsAppIcon';

// Definir tipos necesarios
interface ParsedMarkdownPost {
  frontmatter: {
    title: string;
    slug: string;
    category: string;
    featuredImage: string;
    excerpt: string;
    date: string;
    readTime: string;
    author: string;
    tags: string[];
  };
  content: string;
}

interface BlogPostPageProps {
  slug: string;
  onNavigateToBlogIndex: () => void;
  onNavigateHome: () => void;
  onNavigateToPost: (slug: string) => void;
  showAppInstallBanner?: boolean;
}

// Estilos CSS personalizados para mejorar la apariencia
const customStyles = `
  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(30px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  @keyframes slideInLeft {
    from {
      opacity: 0;
      transform: translateX(-30px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }
  
  @keyframes pulse {
    0%, 100% {
      opacity: 1;
    }
    50% {
      opacity: 0.5;
    }
  }
  
  .animate-fade-in-up {
    animation: fadeInUp 0.6s ease-out;
  }
  
  .animate-slide-in-left {
    animation: slideInLeft 0.6s ease-out;
  }
  
  .animate-pulse-slow {
    animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
  }
  
  .shadow-3xl {
    box-shadow: 0 35px 60px -12px rgba(0, 0, 0, 0.25);
  }
  
  .backdrop-blur-sm {
    backdrop-filter: blur(8px);
  }
  
  .text-shadow {
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }
  
  .gradient-text {
    background: linear-gradient(135deg, #06b6d4, #3b82f6);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
  
  .gradient-text-hero {
    background: linear-gradient(135deg, #ffffff, #e0f2fe, #ffffff);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    text-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
  }
  
  /* Estilos para botones de Amazon */
  .from-ocean-500 {
    --tw-gradient-from: #0ea5e9;
    --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to, rgba(14, 165, 233, 0));
  }
  
  .to-sea-600 {
    --tw-gradient-to: #0891b2;
  }
  
  .from-ocean-600 {
    --tw-gradient-from: #0284c7;
    --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to, rgba(2, 132, 199, 0));
  }
  
  .to-sea-700 {
    --tw-gradient-to: #0e7490;
  }
  
  .text-shadow-lg {
    text-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
  }
  
  /* Estilos para line-clamp */
  .line-clamp-3 {
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
  
  /* Estilos para scroll horizontal en móvil */
  .scrollbar-hide {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
  
  .scrollbar-hide::-webkit-scrollbar {
    display: none;
  }
  
  /* Mejorar scroll en móvil */
  @media (max-width: 768px) {
    .overflow-x-auto {
      -webkit-overflow-scrolling: touch;
      scroll-snap-type: x mandatory;
      scroll-behavior: smooth;
    }
    
    .overflow-x-auto > * {
      scroll-snap-align: start;
      min-width: 280px;
      flex-shrink: 0;
    }
  }
  
  /* Estilos para evitar solapamiento y problemas de layout */
  .blog-layout {
    position: relative;
    z-index: 1;
    width: 100%;
    
    /* Optimización móvil para mejor legibilidad */
    @media (max-width: 640px) {
      .main-content {
        font-size: 16px;
        line-height: 1.7;
        letter-spacing: 0.01em;
      }
      
      .main-content h1 {
        font-size: 1.75rem;
        line-height: 1.3;
        margin-bottom: 1rem;
      }
      
      .main-content h2 {
        font-size: 1.5rem;
        line-height: 1.4;
        margin-bottom: 0.75rem;
      }
      
      .main-content h3 {
        font-size: 1.25rem;
        line-height: 1.4;
        margin-bottom: 0.5rem;
      }
      
      .main-content p {
        margin-bottom: 1rem;
        text-align: justify;
      }
      
      .main-content ul, .main-content ol {
        margin-left: 1rem;
        margin-bottom: 1rem;
      }
      
      .main-content li {
        margin-bottom: 0.5rem;
      }
      
      .main-content blockquote {
        margin: 1rem 0;
        padding: 1rem;
        border-left: 4px solid #06b6d4;
        background: rgba(6, 182, 212, 0.1);
        border-radius: 0.5rem;
      }
      
      .main-content code {
        background: rgba(0, 0, 0, 0.1);
        padding: 0.25rem 0.5rem;
        border-radius: 0.25rem;
        font-size: 0.875em;
      }
      
      .main-content pre {
        overflow-x: auto;
        padding: 1rem;
        background: rgba(0, 0, 0, 0.05);
        border-radius: 0.5rem;
        margin: 1rem 0;
      }
    }
    max-width: 100%;
    overflow-x: hidden;
    margin-top: 2rem;
  }
  

  
  .main-content {
    width: 100%;
    max-width: 100%;
    overflow-x: hidden;
    word-wrap: break-word;
    overflow-wrap: break-word;
  }
  
  /* Fix para Safari y Chrome */
  @supports (-webkit-touch-callout: none) {
    .blog-layout {
      -webkit-overflow-scrolling: touch;
      overflow-scrolling: touch;
    }
    
    .table-of-contents {
      -webkit-overflow-scrolling: touch;
      overflow-scrolling: touch;
    }
  }
  
  /* Fix para problemas de grid en diferentes navegadores */
  .grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(0, 1fr));
    gap: 2rem;
  }
  
  @media (min-width: 1024px) {
    .grid {
      grid-template-columns: 1fr 3fr;
    }
  }
    top: 1rem;
    z-index: 10;
  }
  
  .main-content {
    position: relative;
    z-index: 5;
  }
  
  /* Asegurar que el contenido no se solape en móviles */
  @media (max-width: 1024px) {
    .table-of-contents {
      position: static;
      margin-bottom: 2rem;
    }
  }
`;

// Hook para manejar metadatos SEO dinámicos
const useSEO = (post: ParsedMarkdownPost | null) => {
  useEffect(() => {
    if (!post) return;

    // Actualizar título de la página
    document.title = `${post.frontmatter.title} | BoatTrip Planner Blog`;

    // Actualizar meta description
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', post.frontmatter.summary);
    } else {
      const newMetaDescription = document.createElement('meta');
      newMetaDescription.name = 'description';
      newMetaDescription.content = post.frontmatter.summary;
      document.head.appendChild(newMetaDescription);
    }

    // Actualizar Open Graph tags
    const updateOGTag = (property: string, content: string) => {
      let ogTag = document.querySelector(`meta[property="${property}"]`);
      if (ogTag) {
        ogTag.setAttribute('content', content);
      } else {
        ogTag = document.createElement('meta');
        ogTag.setAttribute('property', property);
        ogTag.setAttribute('content', content);
        document.head.appendChild(ogTag);
      }
    };

    const postUrl = `https://boattrip-planner.com/blog/${post.frontmatter.slug}`;
    
    updateOGTag('og:title', post.frontmatter.title);
    updateOGTag('og:description', post.frontmatter.summary);
    updateOGTag('og:url', postUrl);
    updateOGTag('og:type', 'article');
    updateOGTag('og:image', 'https://boattrip-planner.com/og-image.png');
    updateOGTag('og:site_name', 'BoatTrip Planner');

    // Actualizar Twitter Card tags
    const updateTwitterTag = (name: string, content: string) => {
      let twitterTag = document.querySelector(`meta[name="${name}"]`);
      if (twitterTag) {
        twitterTag.setAttribute('content', content);
      } else {
        twitterTag = document.createElement('meta');
        twitterTag.setAttribute('name', name);
        twitterTag.setAttribute('content', content);
        document.head.appendChild(twitterTag);
      }
    };

    updateTwitterTag('twitter:card', 'summary_large_image');
    updateTwitterTag('twitter:title', post.frontmatter.title);
    updateTwitterTag('twitter:description', post.frontmatter.summary);
    updateTwitterTag('twitter:url', postUrl);
    updateTwitterTag('twitter:image', 'https://boattrip-planner.com/og-image.png');

    // Actualizar canonical URL
    let canonicalLink = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
    if (canonicalLink) {
      canonicalLink.setAttribute('href', postUrl);
    } else {
      canonicalLink = document.createElement('link');
      canonicalLink.rel = 'canonical';
      canonicalLink.href = postUrl;
      document.head.appendChild(canonicalLink);
    }

    // Agregar structured data para el artículo
    const structuredData = {
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      "headline": post.frontmatter.title,
      "description": post.frontmatter.summary,
      "author": {
        "@type": "Person",
        "name": post.frontmatter.author || "BoatTrip Planner"
      },
      "datePublished": post.frontmatter.date,
      "dateModified": post.frontmatter.date,
      "publisher": {
        "@type": "Organization",
        "name": "BoatTrip Planner",
        "logo": {
          "@type": "ImageObject",
          "url": "https://boattrip-planner.com/apple-touch-icon.png"
        }
      },
      "mainEntityOfPage": {
        "@type": "WebPage",
        "@id": postUrl
      },
      "image": "https://boattrip-planner.com/og-image.png",
      "url": postUrl
    };

    // Remover structured data anterior si existe
    const existingStructuredData = document.querySelector('script[type="application/ld+json"]');
    if (existingStructuredData) {
      existingStructuredData.remove();
    }

    // Agregar nuevo structured data
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(structuredData);
    document.head.appendChild(script);

    // Cleanup function
    return () => {
      // Restaurar metadatos por defecto al desmontar
      document.title = 'BoatTrip Planner - Planificador de Viajes Náuticos con IA';
      const defaultMetaDescription = document.querySelector('meta[name="description"]');
      if (defaultMetaDescription) {
        defaultMetaDescription.setAttribute('content', 'BoatTrip Planner: Tu asistente de IA para planificar viajes en barco. Recomendaciones personalizadas, itinerarios náuticos y consejos expertos para alquiler de barcos.');
      }
    };
  }, [post]);
};

const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

// Función para calcular tiempo de lectura
const calculateReadingTime = (content: string): number => {
  const wordsPerMinute = 200;
  const wordCount = content.split(/\s+/).length;
  const readingTime = Math.ceil(wordCount / wordsPerMinute);
  return Math.max(1, readingTime);
};

const getNodeTextContent = (node: React.ReactNode): string => {
    if (node == null) return '';
    if (typeof node === 'string') return String(node);
    if (typeof node === 'number') return String(node);
    if (Array.isArray(node)) return node.map(getNodeTextContent).join('');
    if (React.isValidElement(node)) {
        const props = node.props as { children?: React.ReactNode };
        return getNodeTextContent(props.children);
    }
    return '';
};

// Componente para valoraciones
const RatingStars: React.FC<{ 
  rating: number; 
  onRate?: (rating: number) => void; 
  interactive?: boolean;
  size?: 'sm' | 'md' | 'lg';
}> = ({ rating, onRate, interactive = false, size = 'md' }) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  };

  return (
    <div className="flex items-center justify-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          onClick={() => interactive && onRate && onRate(star)}
          disabled={!interactive}
          className={`${interactive ? 'cursor-pointer hover:scale-110' : 'cursor-default'} transition-transform duration-200 flex items-center justify-center`}
        >
          <span className={`${sizeClasses[size]} ${star <= rating ? 'text-yellow-400' : 'text-gray-300'} flex items-center justify-center`}>
            ★
          </span>
        </button>
      ))}
    </div>
  );
};



// Componente para tabla de contenidos


// Componente para navegación entre artículos
const ArticleNavigation: React.FC<{
  currentSlug: string;
  allPosts: ParsedMarkdownPost[];
  onNavigate: (slug: string) => void;
  darkMode: boolean;
}> = ({ currentSlug, allPosts, onNavigate, darkMode }) => {
  const currentIndex = allPosts.findIndex(post => post.frontmatter.slug === currentSlug);
  const prevPost = currentIndex > 0 ? allPosts[currentIndex - 1] : null;
  const nextPost = currentIndex < allPosts.length - 1 ? allPosts[currentIndex + 1] : null;

  return (
    <div className={`flex justify-between items-center p-4 rounded-lg border ${darkMode ? 'bg-slate-700 border-slate-600' : 'bg-slate-50 border-slate-200'}`}>
      {prevPost ? (
        <button
          onClick={() => onNavigate(prevPost.frontmatter.slug)}
          className={`flex items-center gap-2 p-2 rounded hover:bg-opacity-80 transition-colors ${
            darkMode ? 'hover:bg-slate-600' : 'hover:bg-slate-100'
          }`}
        >
          <span>←</span>
          <div className="text-left">
            <div className={`text-xs ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>Artículo anterior</div>
            <div className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-slate-800'}`}>
              {prevPost.frontmatter.title.length > 40 
                ? prevPost.frontmatter.title.substring(0, 40) + '...' 
                : prevPost.frontmatter.title
              }
            </div>
          </div>
        </button>
      ) : (
        <div></div>
      )}
      
      {nextPost ? (
        <button
          onClick={() => onNavigate(nextPost.frontmatter.slug)}
          className={`flex items-center gap-2 p-2 rounded hover:bg-opacity-80 transition-colors ${
            darkMode ? 'hover:bg-slate-600' : 'hover:bg-slate-100'
          }`}
        >
          <div className="text-right">
            <div className={`text-xs ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>Siguiente artículo</div>
            <div className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-slate-800'}`}>
              {nextPost.frontmatter.title.length > 40 
                ? nextPost.frontmatter.title.substring(0, 40) + '...' 
                : nextPost.frontmatter.title
              }
            </div>
          </div>
          <span>→</span>
        </button>
      ) : (
        <div></div>
      )}
    </div>
  );
};

const RelatedPostCard: React.FC<{ post: ParsedMarkdownPost, onNavigate: (slug: string) => void }> = ({ post, onNavigate }) => {
    // Obtener imagen destacada del post
    const getFeaturedImage = (slug: string, tags?: string[]): string => {
        // Mapeo específico de imágenes temáticas
        const specificImageMap: { [key: string]: string } = {
            'productos-sostenibles-navegantes-guia-compra': 'https://images.unsplash.com/photo-1509391366360-2e959784a276?w=400&h=300&fit=crop&crop=center',
            'mejores-destinos-nauticos-espana-2024': 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=300&fit=crop&crop=center',
            'sostenibilidad-maritima-2024': 'https://images.unsplash.com/photo-1544551763-77ef2d0cfc6c?w=400&h=300&fit=crop&crop=center',
        };
        
        if (specificImageMap[slug]) {
            return specificImageMap[slug];
        }
        
        // Fallback basado en tags
        const tagImageMap: { [key: string]: string } = {
            'sostenibilidad': NAUTICAL_IMAGES.solar_panels,
            'destinos': NAUTICAL_IMAGES.balearic_islands,
            'baleares': NAUTICAL_IMAGES.balearic_islands,
            'galicia': NAUTICAL_IMAGES.atlantic_coast,
            'equipamiento': NAUTICAL_IMAGES.marine_electronics,
            'seguridad': NAUTICAL_IMAGES.safety_equipment,
            'deportes': NAUTICAL_IMAGES.snorkeling,
            'tecnología': NAUTICAL_IMAGES.marine_electronics,
            'familia': NAUTICAL_IMAGES.family_sailing,
            'mascotas': NAUTICAL_IMAGES.pets_on_boat,
        };
        
        for (const tag of tags || []) {
            const lowerTag = tag.toLowerCase();
            for (const [key, imageUrl] of Object.entries(tagImageMap)) {
                if (lowerTag.includes(key)) {
                    return imageUrl;
                }
            }
        }
        
        // Imagen por defecto marítima
        return NAUTICAL_IMAGES.sailing_boat;
    };

    const featuredImage = getFeaturedImage(post.frontmatter.slug, post.frontmatter.tags);
    const readingTime = calculateReadingTime(post.content);

    return (
        <div 
            className="group bg-white dark:bg-slate-800 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden cursor-pointer h-full border border-slate-200 dark:border-slate-700 hover:border-teal-300 dark:hover:border-teal-500 transform hover:-translate-y-1"
            onClick={() => onNavigate(post.frontmatter.slug)}
        >
            {/* Imagen destacada */}
            <div className="relative h-48 overflow-hidden">
                <img 
                    src={featuredImage} 
                    alt={post.frontmatter.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                
                {/* Badge de tiempo de lectura */}
                <div className="absolute top-3 right-3 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm rounded-full px-2 py-1 text-xs font-medium text-slate-700 dark:text-slate-300">
                    ⏱️ {readingTime} min
                </div>
                
                {/* Badge de categoría */}
                {post.frontmatter.tags && post.frontmatter.tags[0] && (
                    <div className="absolute top-3 left-3 bg-teal-500/90 backdrop-blur-sm rounded-full px-2 py-1 text-xs font-medium text-white">
                        {post.frontmatter.tags[0]}
                    </div>
                )}
            </div>
            
            {/* Contenido */}
            <div className="p-4 md:p-5 flex flex-col flex-grow">
                <h4 className="text-sm md:text-base font-semibold text-slate-800 dark:text-white mb-2 group-hover:text-teal-700 dark:group-hover:text-teal-400 transition-colors flex-grow line-clamp-2">
                    {post.frontmatter.title}
                </h4>
                
                {/* Resumen */}
                <p className="text-xs text-slate-600 dark:text-slate-400 mb-3 line-clamp-2">
                    {post.frontmatter.summary}
                </p>
                
                {/* Fecha */}
                <div className="text-xs text-slate-500 dark:text-slate-500 mb-3">
                    📅 {formatDate(post.frontmatter.date)}
                </div>
                
                {/* Call to action */}
                <div className="flex items-center justify-between mt-auto">
                    <span className="text-teal-600 dark:text-teal-400 text-xs md:text-sm font-semibold group-hover:text-teal-700 dark:group-hover:text-teal-300 transition-colors">
                        Leer más →
                    </span>
                    <div className="w-8 h-8 bg-teal-100 dark:bg-teal-900 rounded-full flex items-center justify-center group-hover:bg-teal-200 dark:group-hover:bg-teal-800 transition-colors group-hover:scale-110">
                        <span className="text-teal-600 dark:text-teal-400 text-sm">→</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Componente para la barra de progreso
const ReadingProgressBar: React.FC<{ progress: number }> = ({ progress }) => (
  <div className="fixed top-0 left-0 w-full h-1 bg-slate-200 z-50">
    <div 
      className="h-full bg-teal-500 transition-all duration-300 ease-out"
      style={{ width: `${progress}%` }}
    />
  </div>
);

// Componente para el botón "Volver arriba"
const ScrollToTopButton: React.FC<{ isVisible: boolean }> = ({ isVisible }) => (
  <button
    onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
    className={`fixed bottom-6 right-6 bg-teal-600 hover:bg-teal-700 text-white p-3 rounded-full shadow-lg transition-all duration-300 z-40 ${
      isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'
    }`}
    aria-label="Volver arriba"
  >
    ↑
  </button>
);

const BlogPostPage: React.FC<BlogPostPageProps> = ({ slug, onNavigateToBlogIndex, onNavigateHome, onNavigateToPost, showAppInstallBanner = false }) => {
  const [readingProgress, setReadingProgress] = useState(0);
  const [showScrollToTop, setShowScrollToTop] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [userRating, setUserRating] = useState<number>(0);
  const [isFavorite, setIsFavorite] = useState(false);

  const post = useMemo(() => {
    if (!slug) return null;
    return allBlogPosts.find(p => p.frontmatter.slug === slug);
  }, [slug]);

  // Aplicar SEO dinámico
  useSEO(post || null);

  const readingTime = useMemo(() => {
    if (!post) return 0;
    return calculateReadingTime(post.content);
  }, [post]);

  // Quitar emojis de títulos visibles en entradas
  const sanitizeTitle = (raw: string): string => {
    try {
      return raw.replace(/[\u{1F300}-\u{1FAFF}\u{1F900}-\u{1F9FF}\u{2600}-\u{27BF}\u{1F1E6}-\u{1F1FF}]/gu, '').trim();
    } catch {
      // Fallback sin flags unicode si el entorno no soporta u-escapes
      return raw.replace(/[\u2600-\u27BF]/g, '').trim();
    }
  };





  // Cargar estado de favoritos y valoraciones al iniciar
  useEffect(() => {
    if (!post) return;
    
    // Cargar favoritos
    const favorites = JSON.parse(localStorage.getItem('blogFavorites') || '[]');
    setIsFavorite(favorites.includes(post.frontmatter.slug));
    
    // Cargar valoración del usuario
    const userRatings = JSON.parse(localStorage.getItem('blogUserRatings') || '{}');
    setUserRating(userRatings[post.frontmatter.slug] || 0);
  }, [post]);

  const relatedPosts = useMemo(() => {
    if (!post || !post.frontmatter.tags) return [];
    
    // Find posts with at least one common tag
    const postsWithSharedTags = allBlogPosts.filter(p => {
        if (p.frontmatter.slug === post.frontmatter.slug) return false;
        return p.frontmatter.tags?.some(tag => post.frontmatter.tags?.includes(tag));
    });

    // Sort by number of shared tags, then by date
    postsWithSharedTags.sort((a, b) => {
        const aSharedCount = a.frontmatter.tags?.filter(tag => post.frontmatter.tags?.includes(tag)).length || 0;
        const bSharedCount = b.frontmatter.tags?.filter(tag => post.frontmatter.tags?.includes(tag)).length || 0;
        if (aSharedCount !== bSharedCount) {
            return bSharedCount - aSharedCount;
        }
        return new Date(b.frontmatter.date).getTime() - new Date(a.frontmatter.date).getTime();
    });

    let finalRelatedPosts = postsWithSharedTags.slice(0, 3);
    
    // Fallback if not enough related posts
    if (finalRelatedPosts.length < 3) {
      const recentPostsFallback = allBlogPosts
        .filter(p => p.frontmatter.slug !== post.frontmatter.slug && !finalRelatedPosts.find(frp => frp.frontmatter.slug === p.frontmatter.slug))
        .sort((a, b) => new Date(b.frontmatter.date).getTime() - new Date(a.frontmatter.date).getTime());
      
      finalRelatedPosts.push(...recentPostsFallback.slice(0, 3 - finalRelatedPosts.length));
    }
    
    return finalRelatedPosts;
  }, [post]);



  // Efecto para calcular el progreso de lectura
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = (scrollTop / docHeight) * 100;
      setReadingProgress(Math.min(100, Math.max(0, progress)));
      
      // Mostrar/ocultar botón "Volver arriba"
      setShowScrollToTop(scrollTop > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Toggle dark mode
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  // Toggle favorito
  const toggleFavorite = () => {
    if (!post) return;
    
    const favorites = JSON.parse(localStorage.getItem('blogFavorites') || '[]');
    const newFavorites = isFavorite 
      ? favorites.filter((fav: string) => fav !== post.frontmatter.slug)
      : [...favorites, post.frontmatter.slug];
    
    localStorage.setItem('blogFavorites', JSON.stringify(newFavorites));
    setIsFavorite(!isFavorite);
  };

  // Manejar valoración
  const handleRating = (rating: number) => {
    if (!post) return;
    
    setUserRating(rating);

    
    // Guardar valoración del usuario
    const userRatings = JSON.parse(localStorage.getItem('blogUserRatings') || '{}');
    userRatings[post.frontmatter.slug] = rating;
    localStorage.setItem('blogUserRatings', JSON.stringify(userRatings));
    
    // Aquí podrías enviar la valoración a un servidor
    console.log(`Usuario valoró "${post.frontmatter.title}" con ${rating} estrellas`);
  };

  const handleShareViaWhatsApp = () => {
    if (!post) return;
    const postUrl = `${window.location.origin}/?view=blog_post&slug=${post.frontmatter.slug}`;
    let shareText = `¡Echa un vistazo a este artículo del blog de BoatTrip Planner! 🚤\n\n`;
    shareText += `"${post.frontmatter.title}"\n\n`;
    shareText += `Léelo aquí: ${postUrl}\n\n`;
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(shareText)}`;
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
  };
  
  const handlePrint = () => {
    window.print();
  };

  if (!post) {
    return <NotFoundPage onNavigateHome={onNavigateHome} />;
  }

  const postUrl = `${window.location.origin}/?view=blog_post&slug=${post.frontmatter.slug}`;

  // Función helper para obtener texto de nodos React
  const getNodeTextContent = (node: React.ReactNode): string => {
    if (typeof node === 'string') return node;
    if (typeof node === 'number') return node.toString();
    if (Array.isArray(node)) return node.map(getNodeTextContent).join('');
    if (React.isValidElement(node)) {
      const element = node as React.ReactElement<{ children?: React.ReactNode }>;
      if (element.props && element.props.children) {
        return getNodeTextContent(element.props.children);
      }
    }
    return '';
  };



  const markdownComponents: Components = {
    h1: ({ children }) => {
      const text = getNodeTextContent(children);
      const id = text.toLowerCase().replace(/[^a-z0-9\s]/g, '').replace(/\s+/g, '-');
      return (
        <h1 id={id} className={`text-4xl font-bold mb-8 mt-12 ${darkMode ? 'text-white' : 'text-slate-800'} scroll-mt-20 relative group`}>
          <div className="absolute -left-8 top-0 w-2 h-full bg-gradient-to-b from-teal-500 to-blue-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <span className="relative">
            {children}
            <div className="absolute -bottom-2 left-0 w-0 h-1 bg-gradient-to-r from-teal-500 to-blue-500 rounded-full group-hover:w-full transition-all duration-500"></div>
          </span>
        </h1>
      );
    },
    h2: ({ children }) => {
      const text = getNodeTextContent(children);
      const id = text.toLowerCase().replace(/[^a-z0-9\s]/g, '').replace(/\s+/g, '-');
      return (
        <h2 id={id} className={`text-3xl font-semibold mb-6 mt-10 ${darkMode ? 'text-white' : 'text-slate-800'} scroll-mt-20 relative group`}>
          <div className="absolute -left-6 top-0 w-1 h-full bg-gradient-to-b from-teal-400 to-blue-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <span className="relative">
            {children}
            <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-teal-400 to-blue-400 rounded-full group-hover:w-full transition-all duration-500"></div>
          </span>
        </h2>
      );
    },
    h3: ({ children }) => {
      const text = getNodeTextContent(children);
      const id = text.toLowerCase().replace(/[^a-z0-9\s]/g, '').replace(/\s+/g, '-');
      return (
        <h3 id={id} className={`text-2xl font-semibold mb-4 mt-8 ${darkMode ? 'text-white' : 'text-slate-800'} scroll-mt-20 relative group`}>
          <div className="absolute -left-4 top-0 w-0.5 h-full bg-gradient-to-b from-teal-300 to-blue-300 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <span className="relative">
            {children}
            <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-teal-300 to-blue-300 rounded-full group-hover:w-full transition-all duration-500"></div>
          </span>
        </h3>
      );
    },
    p: ({ children }) => (
      <p className={`mb-6 leading-relaxed text-lg ${darkMode ? 'text-slate-200' : 'text-slate-700'}`}>
        {children}
      </p>
    ),
    ul: ({ children }) => (
      <ul className={`mb-6 pl-8 space-y-3 ${darkMode ? 'text-slate-200' : 'text-slate-700'}`}>
        {children}
      </ul>
    ),
    ol: ({ children }) => (
      <ol className={`mb-6 pl-8 space-y-3 ${darkMode ? 'text-slate-200' : 'text-slate-700'}`}>
        {children}
      </ol>
    ),
    li: ({ children }) => (
      <li className="mb-2 relative">
        <div className="absolute -left-6 top-3 w-2 h-2 bg-teal-500 rounded-full"></div>
        <span className="relative">{children}</span>
      </li>
    ),
    strong: ({ children }) => (
      <strong className={`font-semibold ${darkMode ? 'text-white' : 'text-slate-800'}`}>
        {children}
      </strong>
    ),
    em: ({ children }) => (
      <em className="italic">
        {children}
      </em>
    ),
    blockquote: ({ children }) => (
      <blockquote className={`border-l-4 border-teal-500 pl-6 py-4 my-8 italic relative ${darkMode ? 'bg-gradient-to-r from-slate-700/50 to-slate-600/50 text-slate-200' : 'bg-gradient-to-r from-slate-50 to-blue-50 text-slate-700'} rounded-r-lg`}>
        <div className="absolute top-4 left-4 text-4xl opacity-20">💡</div>
        <div className="relative z-10">{children}</div>
      </blockquote>
    ),
    code: ({ children, className }) => {
      const isInline = !className;
      if (isInline) {
        return (
          <code className={`px-1 py-0.5 rounded text-sm ${darkMode ? 'bg-slate-700 text-teal-300' : 'bg-slate-100 text-slate-800'}`}>
            {children}
          </code>
        );
      }
      return (
        <code className={`block p-4 rounded-lg text-sm overflow-x-auto ${darkMode ? 'bg-slate-700 text-teal-300' : 'bg-slate-100 text-slate-800'}`}>
          {children}
        </code>
      );
    },
         a: ({ href, children, className }) => {
       if (!href) {
         return <span>{children}</span>;
       }

       // Enlaces de Amazon con estilo de botón
       if (className && className.includes('amazon-button')) {
         return (
           <a 
             href={href}
             target="_blank"
             rel="nofollow noopener noreferrer"
             className="inline-block bg-gradient-to-r from-ocean-500 to-sea-600 hover:from-ocean-600 hover:to-sea-700 text-white font-semibold py-3 px-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 text-center my-4"
           >
             {children}
           </a>
         );
       }

       // Enlaces normales
       const isExternal = href.startsWith('http') && !href.includes(window.location.hostname);
        
       return (
         <a 
           href={href}
           target={isExternal ? "_blank" : undefined}
           rel={isExternal ? "nofollow noopener noreferrer" : undefined}
           className="text-teal-600 hover:text-teal-700 underline font-medium transition-colors duration-200"
         >
           {children}
           {isExternal && <span className="ml-1 text-xs opacity-75">↗</span>}
         </a>
       );
     },
    img: ({ src, alt }) => {
      // Mostrar directamente la imagen provista en el markdown (incluida Unsplash)
      return (
        <img
          src={src}
          alt={alt}
          width={src && src.includes('unsplash') ? 1200 : undefined}
          height={src && src.includes('unsplash') ? 600 : undefined}
          className="max-w-full h-auto rounded-2xl shadow-lg my-8"
          onError={(e) => {
            console.error('Error loading image:', src);
            e.currentTarget.style.display = 'none';
          }}
        />
      );
    },
    div: ({ children, className, id }) => {
      // Detectar si es el contenedor de productos de Amazon para el blog post de mascotas
      if (id === 'amazon-products-container' && post.frontmatter.slug === 'mascotas-barcos-alquiler-guia-completa-navegar-companero-peludo') {
        return (
          <RecommendedProducts 
            category="mascotas náuticas"
            title="🛒 PRODUCTOS RECOMENDADOS PARA TU MASCOTA NÁUTICA"
            subtitle="Equipamiento profesional verificado por expertos"
            className="my-8"
          />
        );
      }
      
      // Para otros divs, renderizar normalmente
      return (
        <div className={className} id={id}>
          {children}
        </div>
      );
    },
    // Componente personalizado para renderizar HTML inline de manera segura
    html: ({ children }) => {
      // Si el contenido contiene HTML, renderizarlo de manera segura
      if (typeof children === 'string' && children.includes('<')) {
        return <div dangerouslySetInnerHTML={{ __html: children }} />;
      }
      return <>{children}</>;
    },
  };

  return (
    <>
      {/* Estilos CSS personalizados */}
      <style dangerouslySetInnerHTML={{ __html: customStyles }} />
      
      {/* Barra de progreso */}
      <ReadingProgressBar progress={readingProgress} />
      
      {/* Botón volver arriba */}
      <ScrollToTopButton isVisible={showScrollToTop} />
      
      {/* Hero Section con imagen de fondo mejorada */}
      <div className="relative min-h-[70vh] bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 overflow-hidden">
        {/* Imagen de fondo con overlay mejorado */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat transform scale-105"
          style={{
            backgroundImage: `url(${post.frontmatter.featuredImage})`,
            filter: 'brightness(0.2) contrast(1.3) saturate(1.2)'
          }}
        />
        
        {/* Overlay gradiente mejorado */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />
        
        {/* Patrón de ondas animado mejorado */}
        <div className="absolute inset-0 opacity-30">
          <svg className="w-full h-full" viewBox="0 0 1200 600" xmlns="http://www.w3.org/2000/svg">
            <path d="M0,300 Q300,200 600,300 T1200,300 V600 H0 Z" fill="currentColor" className="text-blue-400">
              <animate attributeName="d" dur="15s" repeatCount="indefinite"
                values="M0,300 Q300,200 600,300 T1200,300 V600 H0 Z;
                        M0,300 Q300,400 600,300 T1200,300 V600 H0 Z;
                        M0,300 Q300,200 600,300 T1200,300 V600 H0 Z" />
            </path>
            <path d="M0,350 Q300,250 600,350 T1200,350 V600 H0 Z" fill="currentColor" className="text-teal-400" opacity="0.5">
              <animate attributeName="d" dur="12s" repeatCount="indefinite"
                values="M0,350 Q300,250 600,350 T1200,350 V600 H0 Z;
                        M0,350 Q300,450 600,350 T1200,350 V600 H0 Z;
                        M0,350 Q300,250 600,350 T1200,350 V600 H0 Z" />
            </path>
          </svg>
        </div>
        
        {/* Partículas flotantes */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-10 w-2 h-2 bg-white/30 rounded-full animate-pulse" style={{animationDelay: '0s'}}></div>
          <div className="absolute top-40 right-20 w-1 h-1 bg-blue-300/40 rounded-full animate-pulse" style={{animationDelay: '2s'}}></div>
          <div className="absolute top-60 left-1/4 w-1.5 h-1.5 bg-teal-300/50 rounded-full animate-pulse" style={{animationDelay: '4s'}}></div>
          <div className="absolute top-80 right-1/3 w-1 h-1 bg-white/20 rounded-full animate-pulse" style={{animationDelay: '6s'}}></div>
        </div>
        
        {/* Contenido del hero mejorado */}
        <div className="relative z-10 flex items-center justify-center min-h-[70vh] px-4">
          <div className="text-center max-w-5xl mx-auto animate-fade-in-up">
            {/* Badge de categoría mejorado */}
            <div className="inline-flex items-center px-6 py-3 rounded-full bg-gradient-to-r from-white/25 to-white/15 backdrop-blur-md border border-white/40 mb-8 shadow-lg">
              <span className="text-white text-sm font-semibold tracking-wide">
                {post.frontmatter.tags?.[0] || 'Náutica'}
              </span>
            </div>
            
            {/* Título principal mejorado (sin emojis) */}
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-8 leading-tight text-shadow-lg gradient-text-hero">
              {sanitizeTitle(post.frontmatter.title)}
            </h1>
            
            {/* Descripción mejorada */}
            <p className="text-xl md:text-2xl text-blue-100 mb-10 max-w-4xl mx-auto leading-relaxed font-light">
              {post.frontmatter.summary}
            </p>
            
            {/* Meta información oculta por solicitud */}
            
            {/* Botones de acción */}
            <div className="flex flex-wrap justify-center gap-4 mt-10">
              <button 
                onClick={() => document.querySelector('article')?.scrollIntoView({behavior: 'smooth'})}
                className="px-8 py-3 bg-gradient-to-r from-teal-500 to-blue-500 text-white font-semibold rounded-full hover:from-teal-600 hover:to-blue-600 transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                Leer Artículo
              </button>
              <button 
                onClick={onNavigateToBlogIndex}
                className="px-8 py-3 bg-white/20 backdrop-blur-sm text-white font-semibold rounded-full border border-white/30 hover:bg-white/30 transition-all duration-300 transform hover:scale-105"
              >
                Ver Más Artículos
              </button>
            </div>
          </div>
        </div>
        

      </div>
      
      {/* Contenido principal */}
      <div className={`w-full max-w-7xl mx-auto transition-all duration-300 ease-out ${darkMode ? 'dark' : ''} ${showAppInstallBanner ? 'pt-4 sm:pt-6' : ''} relative z-10 px-2 sm:px-4 md:px-6`}>
        <div className="w-full max-w-5xl mx-auto blog-layout overflow-hidden">
          {/* Contenido principal */}
          <div className="w-full main-content min-w-0">
            <div className={`${darkMode ? 'bg-slate-800/95 backdrop-blur-sm text-white' : 'bg-white/95 backdrop-blur-sm'} p-4 sm:p-6 md:p-8 rounded-xl sm:rounded-2xl shadow-2xl transition-all duration-300 border ${darkMode ? 'border-slate-700/50' : 'border-white/50'} relative z-5`}>
          {/* Controles de navegación optimizados para móvil */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 sm:mb-8 pb-4 sm:pb-6 border-b border-slate-200/50 dark:border-slate-600/50">
            <div className="flex-1 w-full">
              <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs sm:text-sm text-slate-500 dark:text-slate-400 mb-3 sm:mb-4">
                <div className="flex items-center gap-1 sm:gap-2">
                  <span className="text-base sm:text-lg">🏠</span>
                  <button 
                    onClick={onNavigateHome}
                    className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors duration-200 text-xs sm:text-sm"
                  >
                    Inicio
                  </button>
                </div>
                <span className="text-slate-300 text-xs">→</span>
                <div className="flex items-center gap-1 sm:gap-2">
                  <span className="text-base sm:text-lg">📚</span>
                  <button 
                    onClick={onNavigateToBlogIndex}
                    className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors duration-200 text-xs sm:text-sm"
                  >
                    Blog
                  </button>
                </div>
                <span className="text-slate-300 text-xs">→</span>
                <div className="flex items-center gap-1 sm:gap-2">
                  <span className="text-base sm:text-lg">📖</span>
                  <span className="text-slate-600 dark:text-slate-300 font-medium text-xs sm:text-sm">
                    {post.frontmatter.title.split(' ').slice(0, 2).join(' ')}...
                  </span>
                </div>
              </div>
            </div>
            <div className="flex flex-wrap gap-2 sm:gap-3 mt-3 sm:mt-0 w-full sm:w-auto">
              <Button 
                onClick={toggleDarkMode} 
                variant="secondary" 
                size="sm" 
                className="flex-1 sm:flex-none text-xs sm:text-sm hover:scale-105 transition-transform duration-200"
              >
                {darkMode ? '☀️' : '🌙'}
              </Button>
              <Button 
                onClick={onNavigateToBlogIndex} 
                variant="secondary" 
                size="sm" 
                className="flex-1 sm:flex-none text-xs sm:text-sm hover:scale-105 transition-transform duration-200"
              >
                ← Blog
              </Button>
              <Button 
                onClick={onNavigateHome} 
                variant="primary" 
                size="sm" 
                className="flex-1 sm:flex-none text-xs sm:text-sm hover:scale-105 transition-transform duration-200"
              >
                🚢 Planificador
              </Button>
            </div>
          </div>

          {/* Etiquetas con diseño mejorado optimizadas para móvil */}
          {post.frontmatter.tags && post.frontmatter.tags.length > 0 && (
            <div className="mb-6 sm:mb-8">
              <div className="flex flex-wrap gap-2 sm:gap-3">
                {post.frontmatter.tags.map((tag, index) => (
                  <span 
                    key={tag}
                    className={`inline-flex items-center px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium transition-all duration-300 hover:scale-105 ${
                      darkMode 
                        ? 'bg-gradient-to-r from-teal-500 to-blue-500 text-white shadow-lg shadow-teal-500/25' 
                        : 'bg-gradient-to-r from-teal-100 to-blue-100 text-teal-800 border border-teal-200'
                    }`}
                    style={{
                      animationDelay: `${index * 100}ms`
                    }}
                  >
                    <span className="mr-1 sm:mr-2">
                      {tag === 'mascotas' ? '🐕' : 
                       tag === 'destinos' ? '🗺️' : 
                       tag === 'equipamiento' ? '🔧' : 
                       tag === 'deportes' ? '🏊‍♂️' : 
                       tag === 'sostenibilidad' ? '🌍' : 
                       tag === 'familia' ? '👨‍👩‍👧‍👦' : 
                       tag === 'tecnología' ? '🤖' : 
                       tag === 'fotografía' ? '📸' : 
                       tag === 'problemas' ? '🔧' : 
                       tag === 'servicios' ? '💼' : 
                       tag === 'productos' ? '🛒' : 
                       tag === 'técnicas' ? '📚' : '🏴‍☠️'}
                    </span>
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Contenido del artículo optimizado para móvil */}
          <article className={`prose prose-sm sm:prose-base md:prose-lg max-w-none ${darkMode ? 'prose-invert' : ''} mb-6 sm:mb-8`}>
            <div className="relative">
              {/* Indicador de lectura */}
              <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-teal-500 to-blue-500 rounded-full opacity-20"></div>
              
              <div className="pl-4 sm:pl-6">
                <ReactMarkdown 
                  remarkPlugins={[remarkGfm]} 
                  components={markdownComponents}
                >
                  {post.content}
                </ReactMarkdown>
              </div>
            </div>
          </article>

          {/* Productos Recomendados de Amazon con diseño mejorado - ELIMINADO */}
          {/* {post.frontmatter.tags && post.frontmatter.tags.length > 0 && (
            <div className="mb-12">
              <div className="text-center mb-8">
                <h2 className={`text-3xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-slate-800'}`}>
                  🛒 Productos Recomendados
                </h2>
                <p className={`text-lg ${darkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                  Basándote en este artículo, te recomendamos estos productos de Amazon
                </p>
              </div>
              <ProductRecommendations 
                tags={post.frontmatter.tags}
                title=""
                showTitle={false}
                maxProducts={6}
                content={post.content}
                postTitle={post.frontmatter.title}
              />
            </div>
          )} */}

          {/* Sección de Engagement Optimizada */}
          <div className={`mb-8 pt-6 pb-4 border-t ${darkMode ? 'border-slate-600/30' : 'border-slate-200/50'} relative overflow-hidden`}>
            {/* Fondo decorativo sutil */}
            <div className={`absolute inset-0 ${darkMode ? 'bg-gradient-to-br from-slate-800/10 via-slate-700/5 to-blue-900/10' : 'bg-gradient-to-br from-blue-50/30 via-teal-50/20 to-indigo-50/30'}`}></div>
            <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-teal-400 via-blue-500 to-purple-600"></div>
            
            <div className="relative z-10">
              <div className="text-center mb-6">
                <div className="inline-flex items-center gap-2 mb-3">
                  <span className="text-lg">🚢</span>
                  <h3 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-slate-800'}`}>
                    ¿Te gustó este artículo?
                  </h3>
                  <span className="text-lg">⭐</span>
                </div>
                <p className={`text-sm ${darkMode ? 'text-slate-400' : 'text-slate-600'} max-w-lg mx-auto`}>
                  Compártelo y ayúdanos a llegar a más navegantes
                </p>
              </div>
              
              <div className="flex flex-row gap-4 max-w-4xl mx-auto overflow-x-auto pb-4 scrollbar-hide">
                {/* Valoración - Compacta */}
                <div className={`group relative p-4 rounded-xl flex-1 ${darkMode ? 'bg-slate-800/40 backdrop-blur-sm border-slate-600/20' : 'bg-white/60 backdrop-blur-sm border-slate-200/30'} border shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1`}>
                  <div className="text-center">
                    <div className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-yellow-400 to-orange-500 mb-3 shadow-md">
                      <span className="text-lg">⭐</span>
                    </div>
                    <h4 className={`text-sm font-semibold mb-2 ${darkMode ? 'text-white' : 'text-slate-800'}`}>
                      Valora este artículo
                    </h4>
                    <div className="flex justify-center">
                      <RatingStars 
                        rating={userRating} 
                        onRate={handleRating} 
                        interactive={true}
                        size="md"
                      />
                    </div>
                  </div>
                </div>

                {/* Favorito - Compacta */}
                <div className={`group relative p-4 rounded-xl flex-1 ${darkMode ? 'bg-slate-800/40 backdrop-blur-sm border-slate-600/20' : 'bg-white/60 backdrop-blur-sm border-slate-200/30'} border shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1`}>
                  <div className="text-center">
                    <div className={`inline-flex items-center justify-center w-10 h-10 rounded-xl mb-3 shadow-md transition-all duration-300 ${
                      isFavorite 
                        ? 'bg-gradient-to-br from-pink-500 to-red-500' 
                        : 'bg-gradient-to-br from-slate-400 to-slate-500'
                    }`}>
                      <span className="text-lg">{isFavorite ? '❤️' : '🤍'}</span>
                    </div>
                    <h4 className={`text-sm font-semibold mb-2 ${darkMode ? 'text-white' : 'text-slate-800'}`}>
                      {isFavorite ? 'Guardado' : 'Guardar'}
                    </h4>
                    <button
                      onClick={toggleFavorite}
                      className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 hover:scale-105 ${
                        isFavorite 
                          ? 'bg-gradient-to-r from-pink-500 to-red-500 text-white' 
                          : `${darkMode ? 'bg-slate-600 text-slate-300 hover:bg-slate-500' : 'bg-slate-200 text-slate-700 hover:bg-slate-300'}`
                      }`}
                    >
                      <span className="text-sm">{isFavorite ? '❤️' : '🤍'}</span>
                      {isFavorite ? 'Guardado' : 'Guardar'}
                    </button>
                  </div>
                </div>

                {/* Compartir - Compacta */}
                <div className={`group relative p-4 rounded-xl flex-1 ${darkMode ? 'bg-slate-800/40 backdrop-blur-sm border-slate-600/20' : 'bg-white/60 backdrop-blur-sm border-slate-200/30'} border shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1`}>
                  <div className="text-center">
                    <div className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 mb-3 shadow-md">
                      <span className="text-lg">📤</span>
                    </div>
                    <h4 className={`text-sm font-semibold mb-2 ${darkMode ? 'text-white' : 'text-slate-800'}`}>
                      Compartir
                    </h4>
                    <div className="flex justify-center gap-2">
                      <button
                        onClick={handleShareViaWhatsApp} 
                        className="p-2 rounded-lg bg-green-500 hover:bg-green-600 text-white transition-all duration-200 hover:scale-110"
                        title="WhatsApp"
                      >
                        <WhatsAppIcon className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(post.frontmatter.title)}&url=${encodeURIComponent(postUrl)}`;
                          window.open(twitterUrl, '_blank', 'noopener,noreferrer');
                        }}
                        className="p-2 rounded-lg bg-blue-400 hover:bg-blue-500 text-white transition-all duration-200 hover:scale-110"
                        title="Twitter/X"
                      >
                        <span className="text-sm">𝕏</span>
                      </button>
                      <button
                        onClick={() => {
                          const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(postUrl)}`;
                          window.open(facebookUrl, '_blank', 'noopener,noreferrer');
                        }}
                        className="p-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition-all duration-200 hover:scale-110"
                        title="Facebook"
                      >
                        <span className="text-sm">📘</span>
                      </button>
                      <button
                        onClick={handlePrint}
                        className={`p-2 rounded-lg transition-all duration-200 hover:scale-110 ${
                          darkMode ? 'bg-slate-600 hover:bg-slate-500 text-slate-300' : 'bg-slate-200 hover:bg-slate-300 text-slate-700'
                        }`}
                        title="Imprimir"
                      >
                        <span className="text-sm">🖨️</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Navegación entre artículos */}
          <div className="mt-8">
            <ArticleNavigation
              currentSlug={post.frontmatter.slug}
              allPosts={allBlogPosts}
              onNavigate={onNavigateToPost}
              darkMode={darkMode}
            />
        </div>
        

        {/* Productos recomendados automáticos - ELIMINADO */}
        {/* {recommendedProducts.length > 0 && (
          <div className="mt-10 pt-6 border-t border-slate-200 dark:border-slate-600">
            <h3 className={`text-2xl font-bold mb-6 ${darkMode ? 'text-white' : 'text-slate-800'}`}>Productos recomendados</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {recommendedProducts.map(product => (
                <div key={product.searchTerm} className="bg-white rounded-lg shadow-md p-4 flex flex-col items-center">
                  <img src={product.imageUrl} alt={product.title} className="w-32 h-32 object-contain mb-2" />
                  <div className="font-semibold text-center mb-1">{product.title}</div>
                  <div className="text-green-700 font-bold mb-2">€{product.price}</div>
                  <a href={product.affiliateUrl} target="_blank" rel="noopener noreferrer" className="w-full">
                    <button className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded transition-all">Ver en Amazon</button>
                  </a>
                </div>
              ))}
            </div>
            <div className="text-xs text-slate-500 mt-2">* Enlaces de afiliado. Ayudas a mantener el blog.</div>
          </div>
        )} */}
      </div>
    </div>
        </div>
      </div>
    </>
  );
};

export default BlogPostPage;