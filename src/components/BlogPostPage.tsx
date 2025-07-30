// src/components/BlogPostPage.tsx
import React, { useMemo, useState, useEffect } from 'react';
import ReactMarkdown, { Components } from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { BlogPostPageProps, ParsedMarkdownPost } from '../../types';
import { allBlogPosts } from '../blogData';
import { Button } from '../../components/Button';
import NotFoundPage from '../../components/NotFoundPage';
import { AMAZON_AFFILIATE_LINK_PLACEHOLDER } from '../../constants';
import { ShoppingCartIcon } from '../../components/icons/ShoppingCartIcon';
import { WhatsAppIcon } from '../../components/icons/WhatsAppIcon';

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
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          onClick={() => interactive && onRate && onRate(star)}
          disabled={!interactive}
          className={`${interactive ? 'cursor-pointer hover:scale-110' : 'cursor-default'} transition-transform duration-200`}
        >
          <span className={`${sizeClasses[size]} ${star <= rating ? 'text-yellow-400' : 'text-gray-300'}`}>
            ★
          </span>
        </button>
      ))}
    </div>
  );
};



// Componente para tabla de contenidos
const TableOfContents: React.FC<{ 
  headings: Array<{ id: string; text: string; level: number }>;
  activeHeading: string;
  darkMode: boolean;
}> = ({ headings, activeHeading, darkMode }) => {
  const scrollToHeading = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  if (headings.length === 0) return null;

  return (
    <div className={`sticky top-4 mb-6 p-4 rounded-lg border ${darkMode ? 'bg-slate-700 border-slate-600' : 'bg-slate-50 border-slate-200'}`}>
      <h4 className={`font-semibold mb-3 ${darkMode ? 'text-white' : 'text-slate-800'}`}>
        📋 Tabla de Contenidos
      </h4>
      <nav className="space-y-1">
        {headings.map((heading) => (
          <button
            key={heading.id}
            onClick={() => scrollToHeading(heading.id)}
            className={`block w-full text-left px-2 py-1 rounded text-sm transition-colors ${
              activeHeading === heading.id
                ? `${darkMode ? 'bg-teal-600 text-white' : 'bg-teal-100 text-teal-800'}`
                : `${darkMode ? 'text-slate-300 hover:bg-slate-600' : 'text-slate-600 hover:bg-slate-100'}`
            }`}
            style={{ paddingLeft: `${(heading.level - 1) * 12 + 8}px` }}
          >
            {heading.text}
          </button>
        ))}
      </nav>
    </div>
  );
};

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

const RelatedPostCard: React.FC<{ post: ParsedMarkdownPost, onNavigate: (slug: string) => void }> = ({ post, onNavigate }) => (
    <div 
        className="group bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 flex flex-col overflow-hidden cursor-pointer h-full"
        onClick={() => onNavigate(post.frontmatter.slug)}
    >
        <div className="p-4 flex flex-col flex-grow">
            <h4 className="text-md font-semibold text-slate-800 mb-2 group-hover:text-teal-700 transition-colors flex-grow">
                {post.frontmatter.title}
            </h4>
            <span className="text-teal-600 text-sm font-semibold self-start group-hover:text-teal-700 transition-colors">
                Leer más &rarr;
            </span>
        </div>
    </div>
);

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

const BlogPostPage: React.FC<BlogPostPageProps> = ({ slug, onNavigateToBlogIndex, onNavigateHome, onNavigateToPost }) => {
  const [readingProgress, setReadingProgress] = useState(0);
  const [showScrollToTop, setShowScrollToTop] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [userRating, setUserRating] = useState<number>(0);
  const [isFavorite, setIsFavorite] = useState(false);

  const [activeHeading, setActiveHeading] = useState<string>('');
  const [headings, setHeadings] = useState<Array<{ id: string; text: string; level: number }>>([]);

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

  // Extraer encabezados del contenido
  useEffect(() => {
    if (!post) return;
    
    const extractedHeadings: Array<{ id: string; text: string; level: number }> = [];
    const lines = post.content.split('\n');
    
    lines.forEach(line => {
      const headingMatch = line.match(/^(#{1,6})\s+(.+)$/);
      if (headingMatch) {
        const level = headingMatch[1].length;
        const text = headingMatch[2].trim();
        const id = text.toLowerCase()
          .replace(/[^a-z0-9\s]/g, '')
          .replace(/\s+/g, '-');
        extractedHeadings.push({ id, text, level });
      }
    });
    
    setHeadings(extractedHeadings);
  }, [post]);

  // Detectar encabezado activo al hacer scroll
  useEffect(() => {
    const handleScroll = () => {
      if (!headings.length) return;
      
      const scrollPosition = window.scrollY + 100;
      let currentActive = '';
      
      headings.forEach(heading => {
        const element = document.getElementById(heading.id);
        if (element && element.offsetTop <= scrollPosition) {
          currentActive = heading.id;
        }
      });
      
      setActiveHeading(currentActive);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [headings]);

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

  const markdownComponents: Components = {
    h1: ({ children }) => {
      const text = getNodeTextContent(children);
      const id = text.toLowerCase().replace(/[^a-z0-9\s]/g, '').replace(/\s+/g, '-');
      return (
        <h1 id={id} className={`text-3xl font-bold mb-6 mt-8 ${darkMode ? 'text-white' : 'text-slate-800'} scroll-mt-20`}>
          {children}
        </h1>
      );
    },
    h2: ({ children }) => {
      const text = getNodeTextContent(children);
      const id = text.toLowerCase().replace(/[^a-z0-9\s]/g, '').replace(/\s+/g, '-');
      return (
        <h2 id={id} className={`text-2xl font-semibold mb-4 mt-6 ${darkMode ? 'text-white' : 'text-slate-800'} scroll-mt-20`}>
          {children}
        </h2>
      );
    },
    h3: ({ children }) => {
      const text = getNodeTextContent(children);
      const id = text.toLowerCase().replace(/[^a-z0-9\s]/g, '').replace(/\s+/g, '-');
      return (
        <h3 id={id} className={`text-xl font-semibold mb-3 mt-5 ${darkMode ? 'text-white' : 'text-slate-800'} scroll-mt-20`}>
          {children}
        </h3>
      );
    },
    p: ({ children }) => (
      <p className={`mb-4 leading-relaxed ${darkMode ? 'text-slate-200' : 'text-slate-700'}`}>
        {children}
      </p>
    ),
    ul: ({ children }) => (
      <ul className={`mb-4 pl-6 space-y-2 ${darkMode ? 'text-slate-200' : 'text-slate-700'}`}>
        {children}
      </ul>
    ),
    ol: ({ children }) => (
      <ol className={`mb-4 pl-6 space-y-2 ${darkMode ? 'text-slate-200' : 'text-slate-700'}`}>
        {children}
      </ol>
    ),
    li: ({ children }) => (
      <li className="mb-1">
        {children}
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
      <blockquote className={`border-l-4 border-teal-500 pl-4 py-2 my-4 italic ${darkMode ? 'bg-slate-700 text-slate-200' : 'bg-slate-50 text-slate-700'}`}>
        {children}
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
    a: ({ href, children }) => {
      if (href?.includes(AMAZON_AFFILIATE_LINK_PLACEHOLDER)) {
        return (
          <a
            href={href} 
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-teal-600 hover:text-teal-700 underline"
          >
            {children}
            <ShoppingCartIcon className="w-4 h-4" />
          </a>
        );
      }
            return (
        <a 
          href={href} 
          className="text-teal-600 hover:text-teal-700 underline"
              >
                {children}
        </a>
      );
    },
    img: ({ src, alt }) => (
      <img 
        src={src} 
        alt={alt} 
        className="max-w-full h-auto rounded-lg shadow-md my-4"
      />
    ),
  };

  return (
    <>
      {/* Barra de progreso */}
      <ReadingProgressBar progress={readingProgress} />
      
      {/* Botón volver arriba */}
      <ScrollToTopButton isVisible={showScrollToTop} />
      
      <div className={`w-full max-w-6xl mx-auto transition-colors duration-300 ${darkMode ? 'dark' : ''}`}>
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Tabla de contenidos - Solo visible en desktop */}
          <div className="hidden lg:block lg:col-span-1">
            <div className="sticky top-4">
              <TableOfContents 
                headings={headings} 
                activeHeading={activeHeading} 
                darkMode={darkMode} 
              />
            </div>
          </div>
          
          {/* Contenido principal */}
          <div className="lg:col-span-3">
            <div className={`${darkMode ? 'bg-slate-800 text-white' : 'bg-white'} p-6 md:p-8 rounded-lg shadow-xl transition-colors duration-300`}>
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 pb-4 border-b border-slate-200 dark:border-slate-600">
            <div className="flex-1">
              <h1 className={`text-3xl sm:text-4xl font-bold ${darkMode ? 'text-white' : 'text-slate-800'} mb-2`}>
                {post.frontmatter.title}
              </h1>
              <div className={`flex flex-wrap items-center gap-4 text-sm ${darkMode ? 'text-slate-300' : 'text-slate-500'}`}>
                <span>{formatDate(post.frontmatter.date)}</span>
                <span>•</span>
                <span>⏱️ {readingTime} min de lectura</span>
                {post.frontmatter.author && (
                  <>
                    <span>•</span>
                    <span>Por {post.frontmatter.author}</span>
                  </>
                )}
              </div>
            </div>
            <div className="flex gap-2 mt-4 sm:mt-0">
              <Button 
                onClick={toggleDarkMode} 
                variant="secondary" 
                size="sm" 
                className="w-auto"
              >
                {darkMode ? '☀️' : '🌙'}
              </Button>
              <Button onClick={onNavigateToBlogIndex} variant="secondary" size="sm" className="w-auto">
                ← Volver al Blog
              </Button>
              <Button onClick={onNavigateHome} variant="secondary" size="sm" className="w-auto">
                Ir al Planificador
              </Button>
            </div>
          </div>

          {/* Etiquetas */}
            {post.frontmatter.tags && post.frontmatter.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-6">
              {post.frontmatter.tags.map((tag) => (
                <span 
                  key={tag}
                  className={`text-xs px-3 py-1 rounded-full ${darkMode ? 'bg-teal-600 text-white' : 'bg-teal-100 text-teal-800'}`}
                >
                  {tag}
                  </span>
                ))}
              </div>
            )}

          {/* Contenido del artículo */}
          <article className={`prose prose-lg max-w-none ${darkMode ? 'prose-invert' : ''} mb-8`}>
            <ReactMarkdown 
              remarkPlugins={[remarkGfm]} 
              components={markdownComponents}
            >
            {post.content}
          </ReactMarkdown>
        </article>

          {/* Acciones sociales unificadas */}
          <div className={`mb-8 pt-6 border-t ${darkMode ? 'border-slate-600' : 'border-slate-200'}`}>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              {/* Sección izquierda: Valoración y favorito */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                {/* Valoración */}
                <div className="flex items-center gap-3">
                  <span className={`text-sm font-medium ${darkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                    ¿Te gustó?
                  </span>
                  <RatingStars 
                    rating={userRating} 
                    onRate={handleRating} 
                    interactive={true}
                    size="md"
                  />
                </div>

                {/* Favorito */}
                <button
                  onClick={toggleFavorite}
                  className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isFavorite 
                      ? 'bg-red-100 text-red-700 hover:bg-red-200' 
                      : `${darkMode ? 'bg-slate-700 text-slate-300 hover:bg-slate-600' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`
                  }`}
                >
                  {isFavorite ? '❤️' : '🤍'} {isFavorite ? 'Guardado' : 'Guardar'}
                </button>
              </div>

              {/* Sección derecha: Compartir */}
              <div className="flex items-center gap-2">
                <span className={`text-sm font-medium ${darkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                  Compartir:
                </span>
                <div className="flex gap-2">
                  {/* WhatsApp */}
                  <button
            onClick={handleShareViaWhatsApp} 
                    className="p-2 rounded-lg bg-green-500 hover:bg-green-600 text-white transition-colors duration-200"
                    title="Compartir en WhatsApp"
                  >
                    <WhatsAppIcon className="w-4 h-4" />
                  </button>

                  {/* Twitter */}
                  <button
                    onClick={() => {
                      const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(post.frontmatter.title)}&url=${encodeURIComponent(postUrl)}`;
                      window.open(twitterUrl, '_blank', 'noopener,noreferrer');
                    }}
                    className="p-2 rounded-lg bg-blue-500 hover:bg-blue-600 text-white transition-colors duration-200"
                    title="Compartir en Twitter"
                  >
                    🐦
                  </button>

                  {/* Facebook */}
                  <button
                    onClick={() => {
                      const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(postUrl)}`;
                      window.open(facebookUrl, '_blank', 'noopener,noreferrer');
                    }}
                    className="p-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition-colors duration-200"
                    title="Compartir en Facebook"
                  >
                    📘
                  </button>

                  {/* Imprimir */}
                  <button
            onClick={handlePrint}
                    className={`p-2 rounded-lg transition-colors duration-200 ${
                      darkMode ? 'bg-slate-700 hover:bg-slate-600 text-slate-300' : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                    }`}
                    title="Imprimir artículo"
                  >
                    🖨️
                  </button>
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
        
          {/* Artículos relacionados */}
        {relatedPosts.length > 0 && (
            <div className="mt-10 pt-6 border-t border-slate-200 dark:border-slate-600">
              <h3 className={`text-2xl font-bold mb-6 ${darkMode ? 'text-white' : 'text-slate-800'}`}>
                Artículos Relacionados
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {relatedPosts.map((relatedPost) => (
                        <RelatedPostCard 
                            key={relatedPost.frontmatter.slug}
                            post={relatedPost}
                            onNavigate={onNavigateToPost}
                        />
                    ))}
                </div>
            </div>
        )}
      </div>
    </div>
        </div>
      </div>
    </>
  );
};

export default BlogPostPage;