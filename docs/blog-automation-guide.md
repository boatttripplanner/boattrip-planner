# 🚀 Guía de Automatización de Blog Náutico

## 📋 Descripción General

El sistema de automatización de blog náutico es una solución completa que integra **IA (Gemini Pro)**, **imágenes de Unsplash** y **productos de Amazon** para generar contenido de revista de alta calidad de forma automática.

## 🎯 Características Principales

### 🤖 Generación de Contenido con IA
- **Gemini Pro**: Contenido de revista profesional
- **Prompts especializados**: Por categoría y tipo de contenido
- **Estructura optimizada**: SEO y legibilidad
- **Tono consistente**: Profesional pero accesible

### 🖼️ Integración con Unsplash
- **Imágenes temáticas**: Específicas para contenido marítimo
- **Optimización automática**: Formatos WebP/AVIF
- **Atribución correcta**: Créditos a fotógrafos
- **Posicionamiento inteligente**: Header, inline, galería

### 🛒 Productos de Amazon
- **API real**: Product Advertising API
- **Enlaces de afiliado**: Tracking automático
- **Reviews integradas**: Pros, contras, valoraciones
- **Categorización**: Por tipo de contenido

### 🔍 Optimización SEO
- **Keywords automáticas**: Basadas en categoría y tema
- **Meta tags**: Título, descripción, Open Graph
- **Structured data**: Schema.org para artículos
- **URLs canónicas**: Optimizadas para SEO

## 🏗️ Arquitectura del Sistema

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Interfaz UI   │    │  Servicio de    │    │   APIs Externas │
│                 │    │ Automatización  │    │                 │
│ - Configuración │◄──►│                 │◄──►│ - Gemini Pro    │
│ - Generación    │    │ - IA Content    │    │ - Unsplash      │
│ - Resultados    │    │ - Image Search  │    │ - Amazon        │
└─────────────────┘    │ - SEO Data      │    └─────────────────┘
                       └─────────────────┘
                                │
                                ▼
                       ┌─────────────────┐
                       │   Integración   │
                       │                 │
                       │ - Blog Data     │
                       │ - Content Merge │
                       │ - File Output   │
                       └─────────────────┘
```

## 📁 Estructura de Archivos

```
services/
├── blogAutomationService.ts    # Servicio principal
├── unsplashService.ts          # Integración Unsplash
└── amazonRealApiService.ts     # API Amazon

components/
├── BlogAutomationInterface.tsx # Interfaz de usuario
└── BlogAutomationDemo.tsx      # Demostración

scripts/
├── blogAutomationRunner.ts     # Script de ejecución
└── run-blog-automation.js      # CLI tool

types.ts                        # Tipos TypeScript
```

## 🚀 Uso del Sistema

### 1. Interfaz Web

```typescript
import { generateBlogContent } from '../services/blogAutomationService';

const request: BlogContentRequest = {
  topic: 'Navegar por las Islas Baleares',
  category: 'destinos',
  targetAudience: 'intermedios',
  contentType: 'guia',
  targetLength: 'media',
  includeProducts: true,
  includeImages: true,
  seoKeywords: ['navegación', 'baleares', 'velero']
};

const content = await generateBlogContent(request);
```

### 2. Línea de Comandos

```bash
# Generar contenido de destinos
node scripts/run-blog-automation.js destinations

# Generar equipamiento con opciones personalizadas
node scripts/run-blog-automation.js equipment --output-dir ./my-content --batch-size 3

# Modo dry-run para pruebas
node scripts/run-blog-automation.js techniques --dry-run
```

### 3. Generación en Lote

```typescript
import { generateMultipleBlogPosts } from '../services/blogAutomationService';

const requests: BlogContentRequest[] = [
  {
    topic: 'GPS Náutico: Guía de Compra 2024',
    category: 'equipamiento',
    contentType: 'review',
    // ... más configuraciones
  },
  // ... más requests
];

const contents = await generateMultipleBlogPosts(requests);
```

## ⚙️ Configuración

### Variables de Entorno

```env
# Gemini AI
VITE_GEMINI_API_KEY=tu_api_key_de_gemini

# Unsplash
VITE_UNSPLASH_ACCESS_KEY=tu_api_key_de_unsplash

# Amazon Product Advertising API
VITE_AMAZON_ACCESS_KEY=tu_access_key
VITE_AMAZON_SECRET_KEY=tu_secret_key
VITE_AMAZON_PARTNER_TAG=tu_partner_tag
VITE_AMAZON_HOST=webservices.amazon.es
```

### Configuración de Categorías

```typescript
const categoryConfig = {
  destinos: {
    imageQuery: 'mediterranean sailing destinations',
    productQuery: 'nautical travel accessories',
    keywords: ['navegación', 'velero', 'mediterráneo', 'calas']
  },
  equipamiento: {
    imageQuery: 'nautical equipment boat gear',
    productQuery: 'nautical equipment boat gear',
    keywords: ['equipamiento náutico', 'seguridad', 'navegación']
  }
  // ... más categorías
};
```

## 📊 Tipos de Contenido

### 1. Guías Completas
- **Estructura**: Introducción, secciones, conclusión
- **Longitud**: 1500-2500 palabras
- **Enfoque**: Educativo y práctico
- **Ejemplo**: "Navegar por las Islas Baleares"

### 2. Reviews de Productos
- **Estructura**: Análisis técnico, pros/cons, recomendación
- **Longitud**: 1000-1500 palabras
- **Enfoque**: Evaluación honesta
- **Ejemplo**: "GPS Náutico: Guía de Compra 2024"

### 3. Guías de Destinos
- **Estructura**: Información práctica, consejos, actividades
- **Longitud**: 1200-2000 palabras
- **Enfoque**: Experiencia personal
- **Ejemplo**: "Menorca: Paraíso de Calas"

### 4. Tutoriales
- **Estructura**: Paso a paso, consejos, ejemplos
- **Longitud**: 800-1500 palabras
- **Enfoque**: Instruccional
- **Ejemplo**: "Navegación Nocturna Segura"

## 🎨 Personalización de Prompts

### Prompt Base para Guías

```typescript
const GUIDE_PROMPT = `Eres un experto escritor de revistas náuticas con 20 años de experiencia. 
Tu tarea es crear una guía completa y profesional sobre {topic}.

REQUISITOS OBLIGATORIOS:
1. Estructura de revista premium
2. Tono profesional pero accesible
3. Contenido práctico y útil
4. Longitud objetivo: {targetLength}
5. Audiencia objetivo: {targetAudience}

ESTRUCTURA OBLIGATORIA:
- Título atractivo y SEO optimizado
- Introducción que enganche al lector
- Secciones con subtítulos claros
- Experiencias personales y anécdotas
- Conclusión con llamada a la acción

FORMATO MARKDOWN con emojis marítimos relevantes.`;
```

### Prompt para Reviews

```typescript
const REVIEW_PROMPT = `Eres un crítico experto de productos náuticos con experiencia real en el mar.
Tu tarea es crear una review honesta y detallada sobre {topic}.

REQUISITOS OBLIGATORIOS:
1. Review realista basada en experiencia práctica
2. Análisis técnico detallado
3. Comparación con productos similares
4. Pros y contras honestos
5. Recomendación final clara

ESTRUCTURA OBLIGATORIA:
- Introducción del producto
- Especificaciones técnicas
- Experiencia de uso real
- Ventajas y desventajas
- Comparación con competencia
- Recomendación final`;
```

## 🖼️ Gestión de Imágenes

### Búsqueda Automática

```typescript
// Búsqueda por categoría
const images = await getMaritimeImagesByCategory('destinations', 5);

// Búsqueda personalizada
const images = await searchMaritimeImages('mediterranean sailing', 1, 10);
```

### Optimización

```typescript
const optimizedImage = {
  original: 'https://images.unsplash.com/photo-123...',
  webp: 'https://images.unsplash.com/photo-123...?fm=webp&w=800&q=85',
  avif: 'https://images.unsplash.com/photo-123...?fm=avif&w=800&q=85',
  thumbnail: 'https://images.unsplash.com/photo-123...?w=400&h=300',
  alt: 'Velero navegando por el Mediterráneo',
  width: 800,
  height: 400,
  lazy: true
};
```

## 🛒 Integración de Productos

### Búsqueda de Productos

```typescript
const searchResult = await searchAmazonProducts({
  query: 'gps náutico',
  category: 'nautical',
  maxResults: 5,
  sortBy: 'rating',
  minPrice: 100,
  maxPrice: 1000
});
```

### Estructura de Producto

```typescript
const product: BlogProduct = {
  asin: 'B08F7PTF54',
  title: 'Garmin ECHOMAP UHD 94sv',
  price: '€1,299',
  rating: 4.9,
  reviewCount: 156,
  imageUrl: 'https://...',
  affiliateUrl: 'https://amazon.es/dp/B08F7PTF54?tag=...',
  category: 'navegacion',
  description: 'GPS náutico premium...',
  pros: ['Calidad excepcional', 'Cartografía detallada'],
  cons: ['Precio elevado', 'Instalación compleja'],
  position: 'inline'
};
```

## 🔍 Optimización SEO

### Meta Tags Automáticos

```typescript
const seoData: SEOData = {
  title: `${title} - Guía Completa de Navegación`,
  description: excerpt.substring(0, 160) + '...',
  keywords: ['navegación', 'náutica', ...seoKeywords],
  ogImage: headerImage?.url || '',
  canonicalUrl: `https://boattrip-planner.com/blog/${slug}`,
  structuredData: {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": title,
    "description": description,
    // ... más datos estructurados
  }
};
```

### Keywords por Categoría

```typescript
const keywordMap = {
  destinos: ['navegación', 'velero', 'mediterráneo', 'calas', 'puertos'],
  equipamiento: ['equipamiento náutico', 'seguridad', 'navegación', 'barco'],
  técnicas: ['navegación', 'técnicas', 'vela', 'marino', 'patrón'],
  reviews: ['review', 'productos náuticos', 'comparativa', 'análisis'],
  sostenibilidad: ['sostenibilidad', 'ecológico', 'verde', 'medio ambiente'],
  familia: ['familia', 'niños', 'seguridad', 'navegación familiar'],
  aventuras: ['aventura', 'exploración', 'travesía', 'expedición']
};
```

## 📈 Métricas y Analytics

### Datos de Rendimiento

```typescript
interface GenerationMetrics {
  totalArticles: number;
  averageGenerationTime: number;
  successRate: number;
  imagesPerArticle: number;
  productsPerArticle: number;
  seoScore: number;
}
```

### Tracking de Conversiones

```typescript
// Tracking de clicks en productos
const trackProductClick = (product: BlogProduct) => {
  gtag('event', 'click', {
    event_category: 'affiliate',
    event_label: product.asin,
    value: parseFloat(product.price.replace('€', ''))
  });
};
```

## 🛠️ Mantenimiento y Monitoreo

### Tareas Regulares

1. **Actualización de Prompts**: Mejorar prompts basado en resultados
2. **Monitoreo de APIs**: Verificar límites y costos
3. **Análisis de Rendimiento**: Revisar métricas de conversión
4. **Actualización de Keywords**: Mantener relevancia SEO

### Logs y Debugging

```typescript
// Logging detallado
console.log('🚀 Iniciando generación:', {
  topic: request.topic,
  category: request.category,
  timestamp: new Date().toISOString()
});

// Error handling
try {
  const content = await generateBlogContent(request);
  console.log('✅ Generación exitosa:', content.title);
} catch (error) {
  console.error('❌ Error en generación:', error);
  // Notificar al equipo
}
```

## 🔧 Troubleshooting

### Problemas Comunes

1. **Error de API Key**
   ```
   ❌ GEMINI_API_KEY no configurada
   Solución: Verificar variables de entorno
   ```

2. **Rate Limiting**
   ```
   ❌ Error: Too many requests
   Solución: Implementar delays entre requests
   ```

3. **Imágenes no encontradas**
   ```
   ❌ No se encontraron imágenes para: equipamiento
   Solución: Ampliar términos de búsqueda
   ```

4. **Productos sin datos**
   ```
   ❌ Producto sin información completa
   Solución: Verificar API de Amazon
   ```

### Debugging

```bash
# Modo verbose
DEBUG=* node scripts/run-blog-automation.js destinations

# Logs detallados
NODE_ENV=development node scripts/run-blog-automation.js equipment
```

## 🚀 Próximas Mejoras

### Funcionalidades Planificadas

1. **Multiidioma**: Soporte para inglés, francés, italiano
2. **Video Integration**: Videos de YouTube automáticos
3. **Social Media**: Posts automáticos en redes sociales
4. **A/B Testing**: Testing de diferentes prompts
5. **Analytics Avanzado**: Métricas de engagement detalladas

### Optimizaciones Técnicas

1. **Caching**: Cache de imágenes y productos
2. **Queue System**: Cola de generación para grandes volúmenes
3. **CDN Integration**: Distribución de contenido optimizada
4. **Real-time Updates**: Actualizaciones en tiempo real

## 📞 Soporte

### Recursos Útiles

- **Documentación API**: [Gemini](https://ai.google.dev/), [Unsplash](https://unsplash.com/developers), [Amazon](https://webservices.amazon.com/paapi5/documentation/)
- **Comunidad**: GitHub Issues, Discord
- **Tutoriales**: Videos en YouTube, artículos en el blog

### Contacto

- **Email**: soporte@boattrip-planner.com
- **GitHub**: [Issues](https://github.com/boattrip-planner/issues)
- **Documentación**: [Wiki](https://github.com/boattrip-planner/wiki)

---

*Esta guía se actualiza regularmente. Última actualización: Enero 2024* 