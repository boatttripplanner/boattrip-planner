import React, { useState, useEffect, useRef } from 'react';
import { useIntersectionObserver } from '../hooks/usePerformance';

interface OptimizedImageProps {
  src: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
  placeholder?: string;
  priority?: boolean;
  sizes?: string;
  quality?: number;
}

export const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  className = '',
  width,
  height,
  placeholder = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjNmNGY2Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzY2NzM4OCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkxvYWRpbmcuLi48L3RleHQ+PC9zdmc+',
  priority = false,
  sizes = '100vw',
  quality = 75
}) => {
  const [imageSrc, setImageSrc] = useState(placeholder);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  // Use intersection observer for lazy loading
  const { ref: observerRef, isIntersecting } = useIntersectionObserver({
    threshold: 0.1,
    rootMargin: '50px'
  });

  // Combine refs
  const combinedRef = (node: HTMLImageElement | null) => {
    observerRef(node);
    imgRef.current = node;
  };

  useEffect(() => {
    if (!isIntersecting && !priority) return;

    const img = new Image();
    
    img.onload = () => {
      setImageSrc(src);
      setIsLoading(false);
      setHasError(false);
    };

    img.onerror = () => {
      setIsLoading(false);
      setHasError(true);
      console.warn(`Failed to load image: ${src}`);
    };

    // Add loading delay for non-priority images to prevent layout shifts
    if (!priority) {
      setTimeout(() => {
        img.src = src;
      }, 100);
    } else {
      img.src = src;
    }

    return () => {
      img.onload = null;
      img.onerror = null;
    };
  }, [src, isIntersecting, priority]);

  // Generate responsive srcset for different screen sizes
  const generateSrcSet = (baseSrc: string) => {
    if (!baseSrc.includes('http')) return baseSrc;
    
    const sizes = [320, 640, 768, 1024, 1280, 1920];
    return sizes
      .map(size => `${baseSrc}?w=${size}&q=${quality} ${size}w`)
      .join(', ');
  };

  const imageClasses = [
    className,
    isLoading ? 'animate-pulse bg-gray-200' : '',
    hasError ? 'bg-red-100' : '',
    'transition-opacity duration-300'
  ].filter(Boolean).join(' ');

  return (
    <img
      ref={combinedRef}
      src={imageSrc}
      alt={alt}
      width={width}
      height={height}
      className={imageClasses}
      loading={priority ? 'eager' : 'lazy'}
      sizes={sizes}
      srcSet={!hasError && !isLoading ? generateSrcSet(src) : undefined}
      onLoad={() => setIsLoading(false)}
      onError={() => {
        setIsLoading(false);
        setHasError(true);
      }}
    />
  );
};

// WebP image component with fallback
export const WebPImage: React.FC<OptimizedImageProps & {
  webpSrc?: string;
}> = ({ webpSrc, src, alt, ...props }) => {
  const [supportsWebP, setSupportsWebP] = useState(false);

  useEffect(() => {
    // Check WebP support
    const canvas = document.createElement('canvas');
    canvas.width = 1;
    canvas.height = 1;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      const dataURL = canvas.toDataURL('image/webp');
      setSupportsWebP(dataURL.indexOf('data:image/webp') === 0);
    }
  }, []);

  return (
    <picture>
      {supportsWebP && webpSrc && (
        <source srcSet={webpSrc} type="image/webp" />
      )}
      <OptimizedImage src={src} alt={alt} {...props} />
    </picture>
  );
};

// Progressive image loading component
export const ProgressiveImage: React.FC<OptimizedImageProps & {
  lowQualitySrc?: string;
  mediumQualitySrc?: string;
}> = ({ lowQualitySrc, mediumQualitySrc, src, alt, ...props }) => {
  const [currentSrc, setCurrentSrc] = useState(lowQualitySrc || src);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (!lowQualitySrc) return;

    // Load low quality first
    setCurrentSrc(lowQualitySrc);

    // Then load medium quality
    if (mediumQualitySrc) {
      const mediumImg = new Image();
      mediumImg.onload = () => {
        setCurrentSrc(mediumQualitySrc);
      };
      mediumImg.src = mediumQualitySrc;
    }

    // Finally load high quality
    const highImg = new Image();
    highImg.onload = () => {
      setCurrentSrc(src);
      setIsLoaded(true);
    };
    highImg.src = src;
  }, [lowQualitySrc, mediumQualitySrc, src]);

  return (
    <OptimizedImage
      src={currentSrc}
      alt={alt}
      className={`${props.className || ''} ${isLoaded ? 'opacity-100' : 'opacity-75'}`}
      {...props}
    />
  );
};

export default OptimizedImage; 