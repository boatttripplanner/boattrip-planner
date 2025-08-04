import React, { useState, useEffect } from 'react';
import { 
  UnsplashImage, 
  searchMaritimeImages, 
  getMaritimeImagesByCategory,
  getOptimizedImageUrl 
} from '../services/unsplashService';
import { UnsplashImageGalleryProps } from '../types';

const UnsplashImageGallery: React.FC<UnsplashImageGalleryProps> = ({
  category,
  searchQuery,
  count = 6,
  title,
  showAttribution = true,
  className = ''
}) => {
  const [images, setImages] = useState<UnsplashImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        setLoading(true);
        setError(null);

        let fetchedImages: UnsplashImage[] = [];

        if (category) {
          fetchedImages = await getMaritimeImagesByCategory(category, count);
        } else if (searchQuery) {
          const result = await searchMaritimeImages(searchQuery, 1, count);
          fetchedImages = result.results;
        } else {
          // Por defecto, mostrar imágenes de destinos
          fetchedImages = await getMaritimeImagesByCategory('destinations', count);
        }

        setImages(fetchedImages);
      } catch (err) {
        setError('Error al cargar las imágenes');
        console.error('Error fetching images:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchImages();
  }, [category, searchQuery, count]);

  if (loading) {
    return (
      <div className={`flex justify-center items-center p-8 ${className}`}>
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`text-center p-8 text-red-600 ${className}`}>
        <p>{error}</p>
      </div>
    );
  }

  if (images.length === 0) {
    return (
      <div className={`text-center p-8 text-gray-500 ${className}`}>
        <p>No se encontraron imágenes</p>
      </div>
    );
  }

  return (
    <div className={className}>
      {title && (
        <h3 className="text-xl font-semibold mb-4 text-gray-800">{title}</h3>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {images.map((image) => (
          <div key={image.id} className="group relative overflow-hidden rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
            <img
              src={getOptimizedImageUrl(image, 400, 80)}
              alt={image.alt_description || 'Imagen marítima'}
              className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
              loading="lazy"
            />
            
            {showAttribution && (
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3">
                <p className="text-white text-sm">
                  Foto de{' '}
                  <a
                    href={image.links.html}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline hover:text-blue-200"
                  >
                    {image.user.name}
                  </a>
                  {' '}en{' '}
                  <a
                    href="https://unsplash.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline hover:text-blue-200"
                  >
                    Unsplash
                  </a>
                </p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default UnsplashImageGallery; 