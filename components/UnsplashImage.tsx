import React, { useState, useEffect } from 'react';
import { 
  UnsplashImage as UnsplashImageType, 
  getRandomMaritimeImage,
  getMaritimeImagesByCategory,
  searchMaritimeImages,
  getOptimizedImageUrl 
} from '../services/unsplashService';
import { UnsplashImageProps } from '../types';

const UnsplashImage: React.FC<UnsplashImageProps> = ({
  category,
  searchQuery,
  width = 800,
  height = 600,
  quality = 80,
  showAttribution = true,
  className = '',
  alt,
  fallbackSrc = '/images/products/default-product.svg'
}) => {
  const [image, setImage] = useState<UnsplashImageType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchImage = async () => {
      try {
        setLoading(true);
        setError(false);

        let fetchedImage: UnsplashImageType | null = null;

        if (category) {
          const images = await getMaritimeImagesByCategory(category, 1);
          fetchedImage = images[0] || null;
        } else if (searchQuery) {
          const result = await searchMaritimeImages(searchQuery, 1, 1);
          fetchedImage = result.results[0] || null;
        } else {
          // Por defecto, obtener una imagen aleatoria marítima
          fetchedImage = await getRandomMaritimeImage();
        }

        setImage(fetchedImage);
      } catch (err) {
        console.error('Error fetching Unsplash image:', err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchImage();
  }, [category, searchQuery]);

  if (loading) {
    return (
      <div className={`flex justify-center items-center bg-gray-200 ${className}`} style={{ width, height }}>
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error || !image) {
    return (
      <img
        src={fallbackSrc}
        alt={alt || 'Imagen por defecto'}
        className={className}
        style={{ width, height }}
      />
    );
  }

  return (
    <div className={`relative ${className}`}>
      <img
        src={getOptimizedImageUrl(image, width, quality)}
        alt={alt || image.alt_description || 'Imagen marítima'}
        className="w-full h-full object-cover"
        style={{ width, height }}
        loading="lazy"
      />
      
      {showAttribution && (
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-2">
          <p className="text-white text-xs">
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
  );
};

export default UnsplashImage; 