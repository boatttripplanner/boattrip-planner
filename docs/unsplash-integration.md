# 📸 Integración de Unsplash en BoatTrip Planner

Esta guía te explica cómo usar Unsplash para obtener imágenes de alta calidad relacionadas con temas marítimos en tu proyecto.

## 🚀 Configuración Inicial

### 1. Obtener API Key de Unsplash

1. Ve a [https://unsplash.com/developers](https://unsplash.com/developers)
2. Crea una cuenta o inicia sesión
3. Haz clic en "Register as a developer"
4. Completa el formulario de registro
5. Ve a "Your apps" y crea una nueva aplicación
6. Copia la "Access Key"

### 2. Configurar la API Key

Ejecuta el script de configuración:

```bash
node scripts/setup-unsplash.js
```

O manualmente añade a tu archivo `.env`:

```env
VITE_UNSPLASH_ACCESS_KEY=tu_api_key_aqui
```

## 📦 Componentes Disponibles

### UnsplashImage

Componente para mostrar una imagen individual de Unsplash.

```tsx
import UnsplashImage from './components/UnsplashImage';

// Imagen por categoría
<UnsplashImage 
  category="destinations" 
  width={800} 
  height={600} 
  alt="Destinos mediterráneos" 
/>

// Imagen por búsqueda específica
<UnsplashImage 
  searchQuery="split croatia marina" 
  width={400} 
  height={300} 
  alt="Split Croacia" 
/>

// Sin atribución (para fondos)
<UnsplashImage 
  category="sailing" 
  showAttribution={false} 
/>
```

### UnsplashImageGallery

Componente para mostrar galerías de imágenes.

```tsx
import UnsplashImageGallery from './components/UnsplashImageGallery';

// Galería por categoría
<UnsplashImageGallery 
  category="boats" 
  count={6} 
  title="Embarcaciones para explorar" 
/>

// Galería por búsqueda
<UnsplashImageGallery 
  searchQuery="mediterranean sailing" 
  count={8} 
  title="Navegación mediterránea" 
/>
```

## 🏷️ Categorías Disponibles

- `destinations` - Destinos marítimos y puertos
- `boats` - Barcos, veleros, yates
- `sailing` - Navegación y actividades marítimas
- `ports` - Puertos deportivos y marinas
- `sunset` - Atardeceres en el mar
- `crew` - Tripulación y navegantes

## 🔧 Servicios Disponibles

### searchMaritimeImages(query, page, perPage)

Busca imágenes relacionadas con temas marítimos.

```tsx
import { searchMaritimeImages } from '../services/unsplashService';

const result = await searchMaritimeImages('croacia velero', 1, 10);
console.log(result.results); // Array de imágenes
```

### getMaritimeImagesByCategory(category, count)

Obtiene imágenes por categoría específica.

```tsx
import { getMaritimeImagesByCategory } from '../services/unsplashService';

const images = await getMaritimeImagesByCategory('destinations', 5);
```

### getRandomMaritimeImage()

Obtiene una imagen aleatoria marítima.

```tsx
import { getRandomMaritimeImage } from '../services/unsplashService';

const image = await getRandomMaritimeImage();
```

## 🎨 Optimización de Imágenes

### getOptimizedImageUrl(image, width, quality)

Obtiene URLs optimizadas para diferentes tamaños.

```tsx
import { getOptimizedImageUrl } from '../services/unsplashService';

const optimizedUrl = getOptimizedImageUrl(image, 800, 80);
```

## 📝 Ejemplo de Uso en Blog

```tsx
import React from 'react';
import UnsplashImage from './components/UnsplashImage';
import UnsplashImageGallery from './components/UnsplashImageGallery';

const BlogArticle = () => {
  return (
    <article>
      {/* Imagen principal */}
      <UnsplashImage
        category="destinations"
        width={1200}
        height={600}
        alt="Croacia en velero"
        className="rounded-lg shadow-lg"
      />
      
      {/* Contenido del artículo */}
      <h1>Croacia en Velero 2024</h1>
      <p>Descubre los mejores destinos...</p>
      
      {/* Galería de imágenes */}
      <UnsplashImageGallery
        category="boats"
        count={6}
        title="Embarcaciones recomendadas"
      />
      
      {/* Imagen específica */}
      <UnsplashImage
        searchQuery="split croatia marina"
        width={400}
        height={300}
        alt="Puerto de Split"
      />
    </article>
  );
};
```

## ⚡ Ventajas de Unsplash

### ✅ Gratuito para Uso Comercial
- 5,000 requests por hora
- 50,000 requests por mes
- Sin límites de descarga

### ✅ Imágenes de Alta Calidad
- Fotos profesionales
- Resoluciones altas
- Optimización automática

### ✅ Atribución Automática
- Créditos a fotógrafos
- Enlaces a Unsplash
- Cumple con términos de uso

### ✅ Búsqueda Inteligente
- Filtros por categoría
- Búsqueda por palabras clave
- Orientación y tamaño

## 🔒 Seguridad y Mejores Prácticas

### 1. Proteger API Key
- Nunca compartas tu API key
- Usa variables de entorno
- Añade `.env` a `.gitignore`

### 2. Manejo de Errores
```tsx
try {
  const images = await getMaritimeImagesByCategory('destinations');
} catch (error) {
  console.error('Error loading images:', error);
  // Mostrar imagen por defecto
}
```

### 3. Lazy Loading
```tsx
<UnsplashImage
  category="boats"
  loading="lazy" // Carga diferida
/>
```

## 🚨 Límites y Consideraciones

### Rate Limits
- 5,000 requests por hora
- 50,000 requests por mes
- Implementar cache si es necesario

### Atribución Requerida
- Siempre mostrar atribución
- Enlaces a fotógrafo y Unsplash
- No modificar atribuciones

### Fallbacks
- Imágenes por defecto
- Manejo de errores
- Estados de carga

## 📊 Monitoreo de Uso

Puedes monitorear tu uso en:
- [Unsplash Developer Dashboard](https://unsplash.com/oauth/applications)
- Revisar logs de requests
- Implementar analytics propio

## 🆘 Solución de Problemas

### Error: "API key not found"
- Verifica que `VITE_UNSPLASH_ACCESS_KEY` esté configurada
- Reinicia el servidor de desarrollo
- Verifica el archivo `.env`

### Error: "Rate limit exceeded"
- Reduce la frecuencia de requests
- Implementa cache
- Usa imágenes por defecto temporalmente

### Imágenes no cargan
- Verifica conexión a internet
- Revisa la consola del navegador
- Verifica que la API key sea válida

## 📞 Soporte

- [Unsplash API Documentation](https://unsplash.com/documentation)
- [Unsplash Developer Community](https://unsplash.com/developers)
- Issues en el repositorio del proyecto 