import React, { useState, useEffect, useRef } from 'react';

interface OptimizedImageProps {
  src: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
  placeholder?: string;
  priority?: boolean;
}

export const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  className = '',
  width,
  height,
  placeholder,
  priority = false
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [imageSrc, setImageSrc] = useState(placeholder || src);
  const [hasError, setHasError] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (priority) {
      // Load immediately for priority images
      loadImage(src);
    }
  }, [src, priority]);

  const loadImage = (imageUrl: string) => {
    const img = new Image();
    img.onload = () => {
      setImageSrc(imageUrl);
      setIsLoaded(true);
      setHasError(false);
    };
    img.onerror = () => {
      setHasError(true);
      setIsLoaded(false);
    };
    img.src = imageUrl;
  };

  const handleIntersection = (entries: IntersectionObserverEntry[]) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !isLoaded && !hasError) {
        loadImage(src);
      }
    });
  };

  useEffect(() => {
    if (!priority && !isLoaded && !hasError) {
      const observer = new IntersectionObserver(handleIntersection, {
        rootMargin: '50px',
        threshold: 0.1
      });

      if (imgRef.current) {
        observer.observe(imgRef.current);
      }

      return () => observer.disconnect();
    }
  }, [priority, isLoaded, hasError, src]);

  return (
    <img
      ref={imgRef}
      src={imageSrc}
      alt={alt}
      width={width}
      height={height}
      className={`${className} ${
        isLoaded ? 'opacity-100' : 'opacity-50'
      } transition-opacity duration-300 ${
        hasError ? 'bg-gray-200' : ''
      }`}
      loading={priority ? 'eager' : 'lazy'}
      decoding="async"
      onError={() => setHasError(true)}
    />
  );
}; 