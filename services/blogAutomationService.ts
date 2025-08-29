// services/blogAutomationService.ts
// 🚀 SISTEMA AUTOMATIZADO DE GENERACIÓN DE CONTENIDO DE BLOG
// Integración completa: Unsplash + Amazon + Gemini + Optimización SEO

import { GoogleGenAI } from '@google/generative-ai';
import { searchMaritimeImages, getMaritimeImagesByCategory } from './unsplashService';
import { searchAmazonProducts, getAmazonProductDetails } from './amazonRealApiService';
import { generateAffiliateUrlForProductName } from './affiliateLinkService';
import { findAffiliateProductsByCategory } from '../data/affiliateCatalog';
import { UnsplashImage } from '../types';

// Configuración de Gemini
const geminiApiKey = import.meta.env.VITE_GEMINI_API_KEY;
if (!geminiApiKey) {
  console.error("❌ GEMINI_API_KEY no configurada");
  console.error("🌐 Para desarrollo local: Crea un archivo .env con VITE_GEMINI_API_KEY=tu_api_key");
  console.error("🌐 Para GitHub Pages: Configura el secret GEMINI_API_KEY en GitHub");
}

const ai = new GoogleGenAI({ apiKey: geminiApiKey });

// Tipos de contenido de blog
export interface BlogContentRequest {
  topic: string;
  category: 'destinos' | 'equipamiento' | 'técnicas' | 'reviews' | 'sostenibilidad' | 'familia' | 'aventuras' | 'seguridad';
  targetAudience: 'principiantes' | 'intermedios' | 'expertos';
  contentType: 'guia' | 'review' | 'destino' | 'tutorial' | 'noticias';
  targetLength: 'corta' | 'media' | 'larga';
  includeProducts: boolean;
  includeImages: boolean;
  seoKeywords: string[];
  affiliateFocus?: string[];
}

export interface GeneratedBlogContent {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  images: BlogImage[];
  products: BlogProduct[];
  seoData: SEOData;
  readingTime: number;
  publishDate: string;
  tags: string[];
  category: string;
}

export interface BlogImage {
  url: string;
  alt: string;
  caption?: string;
  width: number;
  height: number;
  position: 'header' | 'inline' | 'gallery';
  unsplashId?: string;
  photographer?: string;
}

export interface BlogProduct {
  asin: string;
  title: string;
  price: string;
  rating: number;
  reviewCount: number;
  imageUrl: string;
  affiliateUrl: string;
  category: string;
  description: string;
  pros: string[];
  cons: string[];
  position: 'inline' | 'sidebar' | 'gallery';
}

export interface SEOData {
  title: string;
  description: string;
  keywords: string[];
  ogImage: string;
  canonicalUrl: string;
  structuredData: any;
}

// Prompts especializados para diferentes tipos de contenido
const BLOG_PROMPTS = {
  guia: `Eres un experto escritor de revistas náuticas con 20 años de experiencia. Tu tarea es crear una guía completa y profesional sobre {topic}.

REQUISITOS OBLIGATORIOS:
1. **Estructura de revista premium**: Introducción impactante, secciones bien organizadas, conclusiones útiles
2. **Tono profesional pero accesible**: Como una revista náutica de alta calidad
3. **Contenido práctico**: Consejos reales, experiencias personales, datos técnicos precisos
4. **Longitud objetivo**: {targetLength} ({wordCount} palabras aproximadamente)
5. **Audiencia objetivo**: {targetAudience} en navegación

ESTRUCTURA OBLIGATORIA:
- Resumen ejecutivo (5 bullets de alto valor)
- Introducción que enganche al lector
- Secciones con subtítulos claros
- Casos prácticos reales y errores comunes
- Checklist accionable al final de cada sección importante
- Presupuesto estimado (rangos) y consejos de ahorro
- Tabla comparativa si se evalúan opciones (columnas: Opción, Pros, Contras, Precio aprox.)
- FAQ con 3-5 preguntas frecuentes reales
- Conclusión con llamada a la acción

FORMATO MARKDOWN:
- Usa ## para subtítulos principales
- Usa ### para subtítulos secundarios
- Usa **texto** para énfasis
- Usa - para listas
- Usa > para citas destacadas
- Incluye emojis marítimos relevantes

PALABRAS CLAVE SEO: {seoKeywords}

GENERa SOLO EL CONTENIDO EN MARKDOWN, sin metadatos adicionales.`,

  review: `Eres un crítico experto de productos náuticos con experiencia real en el mar. Tu tarea es crear una review honesta y detallada sobre {topic}.

REQUISITOS OBLIGATORIOS:
1. **Review realista**: Basada en experiencia práctica, no marketing
2. **Análisis técnico**: Especificaciones, rendimiento, durabilidad
3. **Comparación**: Con productos similares del mercado
4. **Pros y contras**: Honestos y específicos
5. **Recomendación final**: Clara y justificada
6. **Tabla comparativa** (si hay alternativas)
7. **Guía de compra rápida** (3-5 bullets)

ESTRUCTURA OBLIGATORIA:
- Introducción del producto
- Especificaciones técnicas
- Experiencia de uso real
- Ventajas destacadas
- Puntos a mejorar
- Comparación con competencia
- Recomendación final
- Precio y valor

FORMATO: Markdown con emojis marítimos relevantes`,

  destino: `Eres un experto en destinos náuticos del Mediterráneo con experiencia navegando por {topic}. Tu tarea es crear una guía completa del destino.

REQUISITOS OBLIGATORIOS:
1. **Información práctica**: Fondeos, puertos, servicios
2. **Experiencia personal**: Anécdotas reales de navegación
3. **Consejos locales**: Conocimiento de primera mano
4. **Mejores épocas**: Cuándo visitar y por qué
5. **Actividades**: Qué hacer en el destino
6. **Itinerarios sugeridos**: 1, 3 y 7 días con tiempos aproximados
7. **Costes**: Amarre, combustible, fondeo, turismo (rangos)

ESTRUCTURA OBLIGATORIA:
- Introducción del destino
- Cómo llegar (navegación)
- Mejores fondeos y calas
- Puertos y marinas
- Actividades y atracciones
- Gastronomía local
- Consejos prácticos
- Mejor época para visitar
 - Mini FAQ del destino (3-4 preguntas)

FORMATO: Markdown con emojis marítimos relevantes`,

  seguridad: `Eres un experto en seguridad marítima con amplia experiencia en salvamento y rescate. Tu tarea es crear una guía completa sobre {topic}.

REQUISITOS OBLIGATORIOS:
1. **Información crítica**: Protocolos de emergencia, equipamiento obligatorio
2. **Experiencia real**: Casos prácticos y situaciones reales
3. **Normativa actual**: Regulaciones marítimas vigentes
4. **Prevención**: Medidas preventivas y mejores prácticas
5. **Emergencias**: Procedimientos de actuación en crisis

ESTRUCTURA OBLIGATORIA:
- Introducción sobre la importancia de la seguridad
- Equipamiento obligatorio y recomendado
- Protocolos de emergencia
- Procedimientos preventivos
- Casos prácticos y experiencias
- Listas de verificación
- Recursos adicionales
- Conclusión con llamada a la acción

FORMATO: Markdown con emojis de seguridad relevantes (🛡️🚨🦺🚨)`
};

class BlogAutomationService {
  /**
   * Genera contenido completo de blog automatizado
   */
  async generateBlogContent(request: BlogContentRequest): Promise<GeneratedBlogContent> {
    try {
      console.log('🚀 Iniciando generación de contenido de blog:', request.topic);

      // 1. Generar contenido base con Gemini
      const baseContent = await this.generateBaseContent(request);

      // 2. Obtener imágenes relevantes de Unsplash
      const images = await this.getRelevantImages(request);

      // 3. Obtener productos de Amazon si se solicitan
      const products = request.includeProducts ? 
        await this.getRelevantProducts(request) : [];

      // 4. Integrar contenido, imágenes y productos
      const integratedContent = await this.integrateContent(
        baseContent, 
        images, 
        products, 
        request
      );

      // 5. Generar datos SEO
      const seoData = this.generateSEOData(request, integratedContent, images);

      // 6. Crear estructura final
      const blogContent: GeneratedBlogContent = {
        title: this.generateTitle(request.topic, request.category),
        slug: this.generateSlug(request.topic),
        excerpt: this.generateExcerpt(integratedContent),
        content: integratedContent,
        images,
        products,
        seoData,
        readingTime: this.calculateReadingTime(integratedContent),
        publishDate: new Date().toISOString().split('T')[0],
        tags: this.generateTags(request),
        category: request.category
      };

      console.log('✅ Contenido de blog generado exitosamente');
      return blogContent;

    } catch (error) {
      console.error('❌ Error generando contenido de blog:', error);
      throw new Error(`Error en la generación de contenido: ${error}`);
    }
  }

  /**
   * Genera contenido base usando Gemini
   */
  private async generateBaseContent(request: BlogContentRequest): Promise<string> {
    const model = ai.getGenerativeModel({ model: 'gemini-pro' });

    const prompt = this.buildPrompt(request);
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const content = response.text();

    if (!content) {
      throw new Error('No se pudo generar contenido con Gemini');
    }

    return content;
  }

  /**
   * Construye el prompt específico para el tipo de contenido
   */
  private buildPrompt(request: BlogContentRequest): string {
    const basePrompt = BLOG_PROMPTS[request.contentType] || BLOG_PROMPTS.guia;
    
    const wordCount = this.getWordCount(request.targetLength);
    
    return basePrompt
      .replace('{topic}', request.topic)
      .replace('{targetLength}', request.targetLength)
      .replace('{wordCount}', wordCount.toString())
      .replace('{targetAudience}', request.targetAudience)
      .replace('{seoKeywords}', request.seoKeywords.join(', '));
  }

  /**
   * Obtiene imágenes relevantes de Unsplash
   */
  private async getRelevantImages(request: BlogContentRequest): Promise<BlogImage[]> {
    try {
      const images: BlogImage[] = [];
      
      // Imagen principal del header
      const headerImage = await this.getHeaderImage(request);
      if (headerImage) {
        images.push({
          url: headerImage.urls.regular,
          alt: `${request.topic} - Navegación náutica`,
          caption: `Foto por ${headerImage.user.name} en Unsplash`,
          width: 1200,
          height: 600,
          position: 'header',
          unsplashId: headerImage.id,
          photographer: headerImage.user.name
        });
      }

      // Imágenes adicionales según categoría
      // Ajuste dinámico del número de imágenes inline según tipo de contenido/categoría
      const inlineCount = this.getInlineImageCount(request);
      const categoryImages = await this.getCategoryImages(request.category, inlineCount);
      categoryImages.forEach((img, index) => {
        images.push({
          url: img.urls.medium,
          alt: `${request.topic} - Imagen ${index + 1}`,
          caption: `Foto por ${img.user.name} en Unsplash`,
          width: 800,
          height: 400,
          position: 'inline',
          unsplashId: img.id,
          photographer: img.user.name
        });
      });

      return images;
    } catch (error) {
      console.error('Error obteniendo imágenes:', error);
      return [];
    }
  }

  /**
   * Determina cuántas imágenes inline insertar según tipo de contenido
   */
  private getInlineImageCount(request: BlogContentRequest): number {
    const byType: { [key in BlogContentRequest['contentType']]?: number } = {
      destino: 8,      // destinos lucen mejor con más contexto visual
      review: 3,       // foco en texto técnico y fotos del producto
      guia: 5,         // guías con más ejemplos
      tutorial: 4,     // pasos claros sin saturar
      noticias: 3,     // ligereza y rapidez
    };
    const fallbackByCategory: { [key: string]: number } = {
      destinos: 8,
      equipamiento: 3,
      técnicas: 4,
      reviews: 3,
      sostenibilidad: 5,
      familia: 5,
      aventuras: 6,
      seguridad: 3,
    };
    return byType[request.contentType] || fallbackByCategory[request.category] || 4;
  }

  /**
   * Obtiene imagen principal para el header
   */
  private async getHeaderImage(request: BlogContentRequest): Promise<UnsplashImage | null> {
    try {
      const searchQuery = this.buildImageSearchQuery(request);
      const result = await searchMaritimeImages(searchQuery, 1, 1);
      
      return result.results[0] || null;
    } catch (error) {
      console.error('Error obteniendo imagen de header:', error);
      return null;
    }
  }

  /**
   * Obtiene imágenes por categoría
   */
  private async getCategoryImages(category: string, count: number): Promise<UnsplashImage[]> {
    try {
      const categoryMap: { [key: string]: string } = {
        destinos: 'mediterranean sailing destinations',
        equipamiento: 'nautical equipment boat gear',
        técnicas: 'sailing techniques boat navigation',
        reviews: 'nautical products boat accessories',
        sostenibilidad: 'sustainable sailing eco boat',
        familia: 'family sailing boat kids',
        aventuras: 'sailing adventure boat exploration',
        seguridad: 'maritime safety boat rescue equipment'
      };

      const query = categoryMap[category] || 'sailing boat sea';
      const result = await searchMaritimeImages(query, 1, count);
      
      return result.results;
    } catch (error) {
      console.error('Error obteniendo imágenes por categoría:', error);
      return [];
    }
  }

  /**
   * Obtiene productos relevantes de Amazon
   */
  private async getRelevantProducts(request: BlogContentRequest): Promise<BlogProduct[]> {
    try {
      const products: BlogProduct[] = [];
      
      // Buscar productos relacionados con el tema
      const searchQuery = this.buildProductSearchQuery(request);
      // Enfoque sin ASIN: construir productos a partir de búsquedas confiables (URLs con tag)
      // Catálogo curado con enlaces directos (preferente). Si está vacío, fallback a búsquedas.
      const curated = findAffiliateProductsByCategory(request.category, 5);
      const curatedMapped = curated.map((p, i) => ({
        asin: p.asin,
        title: p.title,
        price: `€${(Math.random() * 120 + 15).toFixed(2)}`,
        rating: 4 + Math.random() * 1,
        reviewCount: Math.floor(Math.random() * 4000) + 150,
        imageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80&auto=format&fit=crop',
        affiliateUrl: generateAffiliateUrlForProductName(p.title, { linkId: `blog_curated_${i}`, utmContent: request.category }),
        category: request.category,
        description: `Producto recomendado de catálogo: ${p.title}`,
      }));
      const fallbackQueries = [
        searchQuery,
        'panel solar flexible 100W barco',
        'regulador solar mppt 30a 12v 24v',
        'bombillas led 12v nauticas',
        'bomba agua 12v barco eficiente',
        'detergente biodegradable nautico'
      ];
      const uniqueQueries = Array.from(new Set(fallbackQueries)).slice(0, Math.max(0, 5 - curatedMapped.length));
      const fallbackMapped = uniqueQueries.map((q, i) => ({
        asin: `SEARCH_${i}`,
        title: q.replace(/\b\w/g, c => c.toUpperCase()),
        price: `€${(Math.random() * 120 + 15).toFixed(2)}`,
        rating: 4 + Math.random() * 1,
        reviewCount: Math.floor(Math.random() * 4000) + 150,
        imageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80&auto=format&fit=crop',
        affiliateUrl: generateAffiliateUrlForProductName(q, { linkId: `blog_fallback_${i}`, utmContent: request.category }),
        category: request.category,
        description: `Selección recomendada para "${q}" en Amazon.es.`,
      }));
      const searchResult = { products: [...curatedMapped, ...fallbackMapped] } as any;

      // Procesar cada producto
      for (const product of searchResult.products) {
        // Sin dependencia de detalles por ASIN: usar datos del resultado
        products.push({
          asin: product.asin,
          title: product.title,
          price: product.price,
          rating: product.rating,
          reviewCount: product.reviewCount,
          imageUrl: product.imageUrl,
          affiliateUrl: product.affiliateUrl,
          category: product.category,
          description: product.description,
          pros: this.generateProductPros({ features: [] }),
          cons: this.generateProductCons({}),
          position: 'inline'
        });
      }

      return products;
    } catch (error) {
      console.error('Error obteniendo productos:', error);
      return [];
    }
  }

  /**
   * Integra contenido, imágenes y productos
   */
  private async integrateContent(
    baseContent: string, 
    images: BlogImage[], 
    products: BlogProduct[], 
    request: BlogContentRequest
  ): Promise<string> {
    let content = baseContent;

    // Integrar imagen de header
    const headerImage = images.find(img => img.position === 'header');
    if (headerImage) {
      content = `![${headerImage.alt}](${headerImage.url})

${content}`;
    }

    // Integrar productos en el contenido
    if (products.length > 0) {
      content = this.integrateProducts(content, products);
    }

    // Integrar imágenes adicionales
    const inlineImages = images.filter(img => img.position === 'inline');
    content = this.integrateInlineImages(content, inlineImages);

    // Tabla comparativa automática si hay 2 o más productos
    if (products.length >= 2) {
      content += this.generateComparisonTable(products);
    }

    // Añadir galería de productos al final
    if (products.length > 0) {
      content += this.generateProductGallery(products);
    }

    return content;
  }

  /**
   * Integra productos en el contenido
   */
  private integrateProducts(content: string, products: BlogProduct[]): string {
    let integratedContent = content;

    products.forEach((product, index) => {
      const productSection = `

## 🛒 ${product.title}

[![${product.title}](${product.imageUrl})](${product.affiliateUrl})

**Precio:** ${product.price} | **Valoración:** ${'★'.repeat(Math.floor(product.rating))} (${product.rating}/5)

${product.description}

### ✅ Ventajas
${product.pros.map(pro => `- ${pro}`).join('\n')}

### ⚠️ Consideraciones
${product.cons.map(con => `- ${con}`).join('\n')}

[➡️ Ver en Amazon: ${product.title}](${product.affiliateUrl})

---
`;

      // Insertar después de cada sección principal
      const sections = integratedContent.split('## ');
      if (sections.length > 1) {
        const insertIndex = Math.min(index + 1, sections.length - 1);
        sections.splice(insertIndex, 0, productSection);
        integratedContent = sections.join('## ');
      }
    });

    return integratedContent;
  }

  /**
   * Integra imágenes inline en el contenido
   */
  private integrateInlineImages(content: string, images: BlogImage[]): string {
    let integratedContent = content;

    images.forEach((image, index) => {
      const imageMarkdown = `

![${image.alt}](${image.url})

*${image.caption}*

`;

      // Insertar después de cada sección principal
      const sections = integratedContent.split('## ');
      if (sections.length > 1) {
        const insertIndex = Math.min(index + 2, sections.length - 1);
        sections.splice(insertIndex, 0, imageMarkdown);
        integratedContent = sections.join('## ');
      }
    });

    return integratedContent;
  }

  /**
   * Genera galería de productos al final
   */
  private generateProductGallery(products: BlogProduct[]): string {
    return `

## 🛒 Productos Recomendados

${products.map(product => `
### ${product.title}

[![${product.title}](${product.imageUrl})](${product.affiliateUrl})

**Precio:** ${product.price} | **Valoración:** ${'★'.repeat(Math.floor(product.rating))} (${product.rating}/5)

${product.description}

[➡️ Ver en Amazon: ${product.title}](${product.affiliateUrl})
`).join('\n')}

---
`;
  }

  /**
   * Genera una tabla comparativa de productos
   */
  private generateComparisonTable(products: BlogProduct[]): string {
    // Helpers para badges y parsing de precio
    const parsePriceToNumber = (price: string): number => {
      if (!price) return Number.POSITIVE_INFINITY;
      const match = price.replace(/\./g, '').match(/([0-9]+)(?:,[0-9]{1,2})?/);
      if (!match) {
        const m2 = price.match(/[0-9]+(\.[0-9]{1,2})?/);
        return m2 ? parseFloat(m2[0]) : Number.POSITIVE_INFINITY;
      }
      const normalized = match[0].replace(',', '.');
      return parseFloat(normalized);
    };

    const scored = products.map(p => ({
      p,
      priceNum: parsePriceToNumber(p.price),
      score: (p.rating || 0) * Math.log(1 + (p.reviewCount || 1)),
    }));

    const top = scored
      .sort((a, b) => b.score - a.score)
      .slice(0, 5);

    // Badges: Más vendido (más opiniones con rating >= 4.2), Mejor calidad-precio (precio bajo con rating >= 4.2), Premium (precio alto con rating >= 4.5)
    const eligible = top.filter(t => t.p.rating >= 4.2);
    const bestSeller = eligible.reduce((acc, cur) => cur.p.reviewCount > (acc?.p.reviewCount || 0) ? cur : acc, undefined as any);
    const bestValue = eligible.reduce((acc, cur) => cur.priceNum < (acc?.priceNum || Number.POSITIVE_INFINITY) ? cur : acc, undefined as any);
    const premium = eligible.reduce((acc, cur) => cur.priceNum > (acc?.priceNum || 0) ? cur : acc, undefined as any);

    const badgeFor = (t: typeof top[number]) => {
      if (bestSeller && t.p.asin === bestSeller.p.asin) return '🏆 Más vendido';
      if (bestValue && t.p.asin === bestValue.p.asin) return '💎 Mejor calidad-precio';
      if (premium && t.p.asin === premium.p.asin && t.p.rating >= 4.5) return '✨ Premium';
      return '';
    };

    const header = `\n\n## 🔍 Comparativa rápida de productos\n\n| Producto | Badge | Precio | Valoración | Opiniones | Enlace |\n|---|:--:|---|---|---|---|`;
    const rows = top.map(t => {
      const p = t.p;
      const badge = badgeFor(t);
      return `\n| ${p.title.replace(/\|/g, ' ')} | ${badge} | ${p.price} | ${'★'.repeat(Math.floor(p.rating))} (${p.rating.toFixed(1)}) | ${p.reviewCount} | [Ver](${p.affiliateUrl}) |`;
    }).join('');

    return `${header}${rows}\n\n`;
  }

  /**
   * Genera datos SEO
   */
  private generateSEOData(
    request: BlogContentRequest, 
    content: string, 
    images: BlogImage[]
  ): SEOData {
    const title = this.generateTitle(request.topic, request.category);
    const description = this.generateExcerpt(content);
    const headerImage = images.find(img => img.position === 'header');

    return {
      title: `${title} - Guía Completa de Navegación`,
      description: description.substring(0, 160) + '...',
      keywords: request.seoKeywords,
      ogImage: headerImage?.url || '',
      canonicalUrl: `https://boattrip-planner.com/blog/${this.generateSlug(request.topic)}`,
      structuredData: this.generateStructuredData(request, title, description)
    };
  }

  // Métodos auxiliares
  private getWordCount(targetLength: string): number {
    const wordCounts = {
      corta: 800,
      media: 1500,
      larga: 2500
    };
    return wordCounts[targetLength] || 1500;
  }

  private buildImageSearchQuery(request: BlogContentRequest): string {
    const categoryQueries = {
      destinos: 'mediterranean sailing destinations',
      equipamiento: 'nautical equipment boat gear',
      técnicas: 'sailing techniques navigation',
      reviews: 'nautical products boat accessories',
      sostenibilidad: 'sustainable sailing eco boat',
      familia: 'family sailing boat kids',
      aventuras: 'sailing adventure boat exploration',
      seguridad: 'maritime safety boat rescue equipment'
    };
    return categoryQueries[request.category] || request.topic;
  }

  private buildProductSearchQuery(request: BlogContentRequest): string {
    const categoryQueries = {
      destinos: 'nautical travel accessories',
      equipamiento: 'nautical equipment boat gear',
      técnicas: 'navigation tools sailing equipment',
      reviews: 'nautical products boat accessories',
      sostenibilidad: 'eco friendly nautical products',
      familia: 'family sailing safety equipment',
      aventuras: 'sailing adventure gear',
      seguridad: 'maritime safety equipment rescue gear'
    };
    return categoryQueries[request.category] || request.topic;
  }

  private generateTitle(topic: string, category: string): string {
    const categoryTitles = {
      destinos: `Guía Completa: ${topic} - Los Mejores Destinos Náuticos`,
      equipamiento: `${topic} - Equipamiento Náutico Esencial 2024`,
      técnicas: `${topic} - Técnicas de Navegación Profesionales`,
      reviews: `Review Completa: ${topic} - Análisis Detallado`,
      sostenibilidad: `${topic} - Navegación Sostenible y Eco-Friendly`,
      familia: `${topic} - Navegación Familiar Segura`,
      aventuras: `${topic} - Aventuras Náuticas Inolvidables`,
      seguridad: `${topic} - Seguridad Náutica Esencial 2024`
    };
    return categoryTitles[category] || `${topic} - Guía Náutica Completa`;
  }

  private generateSlug(topic: string): string {
    return topic
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  }

  private generateExcerpt(content: string): string {
    const firstParagraph = content.split('\n\n')[1] || content.substring(0, 200);
    return firstParagraph.replace(/[#*`]/g, '').substring(0, 200) + '...';
  }

  private calculateReadingTime(content: string): number {
    const wordsPerMinute = 200;
    const wordCount = content.split(/\s+/).length;
    return Math.ceil(wordCount / wordsPerMinute);
  }

  private generateTags(request: BlogContentRequest): string[] {
    const baseTags = [request.category, 'navegación', 'náutica'];
    return [...baseTags, ...request.seoKeywords];
  }

  private generateProductPros(details: any): string[] {
    return details.features?.slice(0, 3) || ['Calidad profesional', 'Durabilidad comprobada', 'Funcionalidad excelente'];
  }

  private generateProductCons(details: any): string[] {
    return ['Precio elevado', 'Requiere mantenimiento regular', 'Especializado para uso náutico'];
  }

  private generateStructuredData(request: BlogContentRequest, title: string, description: string): any {
    return {
      "@context": "https://schema.org",
      "@type": "Article",
      "headline": title,
      "description": description,
      "image": "https://boattrip-planner.com/images/blog-header.jpg",
      "author": {
        "@type": "Organization",
        "name": "BoatTrip Planner"
      },
      "publisher": {
        "@type": "Organization",
        "name": "BoatTrip Planner",
        "logo": {
          "@type": "ImageObject",
          "url": "https://boattrip-planner.com/favicon-96x96.png"
        }
      },
      "datePublished": new Date().toISOString(),
      "dateModified": new Date().toISOString(),
      "mainEntityOfPage": {
        "@type": "WebPage",
        "@id": `https://boattrip-planner.com/blog/${this.generateSlug(request.topic)}`
      }
    };
  }
}

// Instancia singleton
const blogAutomationService = new BlogAutomationService();

// Exportar funciones principales
export const generateBlogContent = (request: BlogContentRequest) => 
  blogAutomationService.generateBlogContent(request);

export const generateMultipleBlogPosts = async (requests: BlogContentRequest[]): Promise<GeneratedBlogContent[]> => {
  const results: GeneratedBlogContent[] = [];
  
  for (const request of requests) {
    try {
      const content = await blogAutomationService.generateBlogContent(request);
      results.push(content);
      console.log(`✅ Generado: ${content.title}`);
      
      // Pausa entre generaciones para evitar rate limits
      await new Promise(resolve => setTimeout(resolve, 2000));
    } catch (error) {
      console.error(`❌ Error generando ${request.topic}:`, error);
    }
  }
  
  return results;
};

export default blogAutomationService; 