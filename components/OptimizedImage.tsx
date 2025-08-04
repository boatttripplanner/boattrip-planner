import React from 'react';

interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  lazy?: boolean;
  priority?: boolean;
}

const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  width = 800,
  height = 400,
  className = '',
  lazy = true,
  priority = false
}) => {
  // Generar URLs optimizadas para diferentes formatos
  const generateOptimizedUrl = (format: 'webp' | 'avif' | 'jpeg', quality: number = 85): string => {
    if (src.includes('unsplash.com')) {
      const baseUrl = src.split('?')[0];
      return `${baseUrl}?w=${width}&fmt=${format}&q=${quality}&fit=crop&crop=center`;
    }
    return src;
  };

  const webpUrl = generateOptimizedUrl('webp', 85);
  const avifUrl = generateOptimizedUrl('avif', 85);
  const jpegUrl = generateOptimizedUrl('jpeg', 85);

  return (
    <picture className={`block ${className}`}>
      {/* AVIF - Mejor compresión, soporte moderno */}
      <source 
        srcSet={avifUrl} 
        type="image/avif"
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
      />
      
      {/* WebP - Buena compresión, amplio soporte */}
      <source 
        srcSet={webpUrl} 
        type="image/webp"
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
      />
      
      {/* JPEG - Fallback universal */}
      <img
        src={jpegUrl}
        alt={alt}
        width={width}
        height={height}
        loading={lazy ? 'lazy' : 'eager'}
        decoding="async"
        className="w-full h-auto rounded-lg shadow-lg transition-transform duration-300 hover:scale-105"
        style={{
          aspectRatio: `${width}/${height}`,
          objectFit: 'cover'
        }}
        onLoad={(e) => {
          // Añadir clase cuando la imagen se carga
          e.currentTarget.classList.add('loaded');
        }}
        onError={(e) => {
          // Fallback si hay error
          console.warn('Error loading optimized image:', src);
          e.currentTarget.src = src;
        }}
      />
    </picture>
  );
};

export default OptimizedImage; 