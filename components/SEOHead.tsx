// components/SEOHead.tsx
// 🔍 Componente de SEO dinámico para mejor posicionamiento (sin dependencias externas)

import React, { useEffect } from 'react';

interface SEOHeadProps {
  title?: string;
  description?: string;
  keywords?: string[];
  image?: string;
  url?: string;
  type?: 'website' | 'article' | 'product';
  author?: string;
  publishedTime?: string;
  modifiedTime?: string;
  section?: string;
  tags?: string[];
  structuredData?: any;
  canonicalUrl?: string;
}

const SEOHead: React.FC<SEOHeadProps> = ({
  title = 'BoatTrip Planner - Planifica tu viaje náutico con IA',
  description = 'Planifica tu viaje náutico perfecto con IA. Descubre destinos, calcula rutas, encuentra equipamiento y disfruta de la navegación.',
  keywords = ['viaje náutico', 'planificación', 'navegación', 'destinos marítimos', 'equipamiento náutico', 'IA', 'inteligencia artificial'],
  image = 'https://boattrip-planner.com/images/og-image.jpg',
  url = 'https://boattrip-planner.com/',
  type = 'website',
  author = 'BoatTrip Planner',
  publishedTime,
  modifiedTime,
  section,
  tags = [],
  structuredData,
  canonicalUrl
}) => {
  useEffect(() => {
    const fullTitle = title.includes('BoatTrip Planner') ? title : `${title} | BoatTrip Planner`;
    const fullDescription = description.length > 160 ? description.substring(0, 157) + '...' : description;
    
    // Actualizar título
    document.title = fullTitle;
    
    // Función para actualizar o crear meta tags
    const updateMetaTag = (name: string, content: string, property?: string) => {
      const selector = property ? `meta[property="${property}"]` : `meta[name="${name}"]`;
      let meta = document.querySelector(selector) as HTMLMetaElement;
      
      if (!meta) {
        meta = document.createElement('meta');
        if (property) {
          meta.setAttribute('property', property);
        } else {
          meta.setAttribute('name', name);
        }
        document.head.appendChild(meta);
      }
      
      meta.setAttribute('content', content);
    };
    
    // Actualizar meta tags básicos
    updateMetaTag('description', fullDescription);
    updateMetaTag('keywords', keywords.join(', '));
    updateMetaTag('author', author);
    
    // Actualizar Open Graph
    updateMetaTag('og:type', type, 'og:type');
    updateMetaTag('og:url', url, 'og:url');
    updateMetaTag('og:title', fullTitle, 'og:title');
    updateMetaTag('og:description', fullDescription, 'og:description');
    updateMetaTag('og:image', image, 'og:image');
    updateMetaTag('og:site_name', 'BoatTrip Planner', 'og:site_name');
    updateMetaTag('og:locale', 'es_ES', 'og:locale');
    
    // Actualizar Twitter Card
    updateMetaTag('twitter:card', 'summary_large_image', 'twitter:card');
    updateMetaTag('twitter:site', '@boattripplanner', 'twitter:site');
    updateMetaTag('twitter:title', fullTitle, 'twitter:title');
    updateMetaTag('twitter:description', fullDescription, 'twitter:description');
    updateMetaTag('twitter:image', image, 'twitter:image');
    
    // Actualizar canonical URL
    if (canonicalUrl) {
      let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
      if (!canonical) {
        canonical = document.createElement('link');
        canonical.rel = 'canonical';
        document.head.appendChild(canonical);
      }
      canonical.href = canonicalUrl;
    }
    
    // Generar y actualizar structured data
    const defaultStructuredData = {
      '@context': 'https://schema.org',
      '@type': type === 'article' ? 'Article' : 'WebSite',
      name: fullTitle,
      description: fullDescription,
      url: url,
      image: image,
      author: {
        '@type': 'Organization',
        name: author,
        url: 'https://boattrip-planner.com/'
      },
      publisher: {
        '@type': 'Organization',
        name: 'BoatTrip Planner',
        logo: {
          '@type': 'ImageObject',
          url: 'https://boattrip-planner.com/alex5.svg'
        }
      },
      ...(type === 'article' && {
        datePublished: publishedTime,
        dateModified: modifiedTime,
        articleSection: section,
        keywords: [...keywords, ...tags].join(', ')
      })
    };
    
    const finalStructuredData = structuredData || defaultStructuredData;
    
    // Actualizar structured data
    let script = document.querySelector('script[type="application/ld+json"]') as HTMLScriptElement;
    if (!script) {
      script = document.createElement('script');
      script.type = 'application/ld+json';
      document.head.appendChild(script);
    }
    script.textContent = JSON.stringify(finalStructuredData);
    
    // Meta tags específicos para artículos
    if (type === 'article') {
      if (publishedTime) {
        updateMetaTag('article:published_time', publishedTime, 'article:published_time');
      }
      if (modifiedTime) {
        updateMetaTag('article:modified_time', modifiedTime, 'article:modified_time');
      }
      if (section) {
        updateMetaTag('article:section', section, 'article:section');
      }
      tags.forEach((tag, index) => {
        updateMetaTag(`article:tag_${index}`, tag, `article:tag`);
      });
    }
    
    // Cleanup function
    return () => {
      // No es necesario limpiar meta tags ya que se actualizan en lugar de crear nuevos
    };
  }, [title, description, keywords, image, url, type, author, publishedTime, modifiedTime, section, tags, structuredData, canonicalUrl]);
  
  // Este componente no renderiza nada en el DOM
  return null;
};

export default SEOHead;
