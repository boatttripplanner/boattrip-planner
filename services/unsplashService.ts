import { createApi } from 'unsplash-js';
import { UnsplashImage, UnsplashSearchResult, UnsplashCategory } from '../types';

// Configuración de Unsplash API
const unsplash = createApi({
  accessKey: import.meta.env.VITE_UNSPLASH_ACCESS_KEY || '',
});

/**
 * Busca imágenes en Unsplash relacionadas con temas marítimos
 */
export const searchMaritimeImages = async (
  query: string,
  page: number = 1,
  perPage: number = 10
): Promise<UnsplashSearchResult> => {
  try {
    // Añadir términos marítimos al query para asegurar relevancia
    const maritimeQuery = `${query} boat sailing sea ocean maritime`;
    
    const result = await unsplash.search.getPhotos({
      query: maritimeQuery,
      page,
      perPage,
      orientation: 'landscape',
      orderBy: 'relevant',
    });

    if (result.errors) {
      console.error('Unsplash API errors:', result.errors);
      throw new Error('Error al buscar imágenes en Unsplash');
    }

    return {
      results: result.response?.results || [],
      total: result.response?.total || 0,
      total_pages: result.response?.total_pages || 0,
    };
  } catch (error) {
    console.error('Error en searchMaritimeImages:', error);
    throw error;
  }
};

/**
 * Obtiene una imagen aleatoria relacionada con temas marítimos
 */
export const getRandomMaritimeImage = async (): Promise<UnsplashImage | null> => {
  try {
    const result = await unsplash.photos.getRandom({
      query: 'boat sailing sea ocean maritime',
      orientation: 'landscape',
    });

    if (result.errors) {
      console.error('Unsplash API errors:', result.errors);
      return null;
    }

    return result.response as UnsplashImage;
  } catch (error) {
    console.error('Error en getRandomMaritimeImage:', error);
    return null;
  }
};

/**
 * Obtiene imágenes específicas para diferentes tipos de contenido marítimo
 */
export const getMaritimeImagesByCategory = async (
  category: UnsplashCategory,
  count: number = 5
): Promise<UnsplashImage[]> => {
  const categoryQueries = {
    destinations: 'mediterranean sailing destinations boat',
    boats: 'sailboat yacht boat sailing',
    sailing: 'sailing boat sea ocean',
    ports: 'marina port boat dock',
    sunset: 'sunset boat sea sailing',
    crew: 'sailing crew boat team',
  };

  try {
    const result = await unsplash.search.getPhotos({
      query: categoryQueries[category],
      page: 1,
      perPage: count,
      orientation: 'landscape',
      orderBy: 'relevant',
    });

    if (result.errors) {
      console.error('Unsplash API errors:', result.errors);
      return [];
    }

    return result.response?.results || [];
  } catch (error) {
    console.error('Error en getMaritimeImagesByCategory:', error);
    return [];
  }
};

/**
 * Obtiene la URL optimizada de una imagen de Unsplash
 */
export const getOptimizedImageUrl = (
  image: UnsplashImage,
  width: number = 800,
  quality: number = 80
): string => {
  // Unsplash permite optimización de URLs añadiendo parámetros
  return `${image.urls.regular}&w=${width}&q=${quality}&fit=crop&crop=entropy`;
};

/**
 * Obtiene la URL de descarga directa de una imagen
 */
export const getDownloadUrl = (image: UnsplashImage): string => {
  return `${image.urls.full}&dl=1`;
}; 