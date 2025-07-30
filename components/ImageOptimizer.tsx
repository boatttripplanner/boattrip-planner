import React, { useState, useEffect, useRef } from 'react';

interface ImageOptimizerProps {
  src: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
  priority?: boolean;
  sizes?: string;
  quality?: number;
  placeholder?: string;
  onLoad?: () => void;
  onError?: () => void;
}

export const ImageOptimizer: React.FC<ImageOptimizerProps> = ({
  src,
  alt,
  className = '',
  width,
  height,
  priority = false,
  sizes = '100vw',
  quality = 75,
  placeholder = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjNmNGY2Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzY2NzM4OCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkxvYWRpbmcuLi48L3RleHQ+PC9zdmc+',
  onLoad,
  onError
}) => {
  const [imageSrc, setImageSrc] = useState(placeholder);
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isIntersecting, setIsIntersecting] = useState(priority);
  const imgRef = useRef<HTMLImageElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  // Generate WebP and responsive srcset
  const generateSrcSet = (baseSrc: string) => {
    if (!baseSrc.includes('http') && !baseSrc.startsWith('/')) {
      return baseSrc;
    }

    const sizes = [320, 640, 768, 1024, 1280, 1920];
    return sizes
      .map(size => `${baseSrc}?w=${size}&q=${quality} ${size}w`)
      .join(', ');
  };

  // Generate WebP srcset
  const generateWebPSrcSet = (baseSrc: string) => {
    if (!baseSrc.includes('http') && !baseSrc.startsWith('/')) {
      return baseSrc;
    }

    const sizes = [320, 640, 768, 1024, 1280, 1920];
    return sizes
      .map(size => `${baseSrc}?w=${size}&q=${quality}&fmt=webp ${size}w`)
      .join(', ');
  };

  // Intersection Observer for lazy loading
  useEffect(() => {
    if (priority) {
      setIsIntersecting(true);
      return;
    }

    if ('IntersectionObserver' in window) {
      observerRef.current = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setIsIntersecting(true);
            observerRef.current?.disconnect();
          }
        },
        {
          threshold: 0.1,
          rootMargin: '50px'
        }
      );

      if (imgRef.current) {
        observerRef.current.observe(imgRef.current);
      }
    } else {
      // Fallback for older browsers
      setIsIntersecting(true);
    }

    return () => {
      observerRef.current?.disconnect();
    };
  }, [priority]);

  // Load image when intersecting
  useEffect(() => {
    if (!isIntersecting) return;

    const img = new Image();
    
    img.onload = () => {
      setImageSrc(src);
      setIsLoaded(true);
      setHasError(false);
      onLoad?.();
    };

    img.onerror = () => {
      setIsLoaded(false);
      setHasError(true);
      onError?.();
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
  }, [src, isIntersecting, priority, onLoad, onError]);

  const imageClasses = [
    className,
    isLoaded ? 'animate-pulse bg-gray-200' : '',
    hasError ? 'bg-red-100' : '',
    'transition-opacity duration-300',
    isLoaded ? 'opacity-100' : 'opacity-0'
  ].filter(Boolean).join(' ');

  return (
    <picture>
      {/* WebP source for modern browsers */}
      <source 
        srcSet={generateWebPSrcSet(src)} 
        type="image/webp" 
        sizes={sizes}
      />
      {/* Fallback source */}
      <source 
        srcSet={generateSrcSet(src)} 
        type="image/jpeg" 
        sizes={sizes}
      />
      {/* Fallback img element */}
      <img
        ref={imgRef}
        src={imageSrc}
        alt={alt}
        width={width}
        height={height}
        className={imageClasses}
        loading={priority ? 'eager' : 'lazy'}
        sizes={sizes}
        fetchPriority={priority ? 'high' : 'auto'}
        onLoad={() => setIsLoaded(true)}
        onError={() => {
          setIsLoaded(false);
          setHasError(true);
          onError?.();
        }}
      />
    </picture>
  );
};

// WebP image component with automatic fallback
export const WebPImage: React.FC<ImageOptimizerProps & {
  webpSrc?: string;
}> = ({ webpSrc, src, alt, ...props }) => {
  return (
    <picture>
      {webpSrc && (
        <source srcSet={webpSrc} type="image/webp" />
      )}
      <source srcSet={src} type="image/jpeg" />
      <img
        src={src}
        alt={alt}
        loading="lazy"
        {...props}
      />
    </picture>
  );
};

// Progressive image loading component
export const ProgressiveImage: React.FC<ImageOptimizerProps & {
  lowQualitySrc?: string;
  mediumQualitySrc?: string;
}> = ({ lowQualitySrc, mediumQualitySrc, src, alt, ...props }) => {
  const [currentSrc, setCurrentSrc] = useState(lowQualitySrc || src);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!lowQualitySrc) return;

    const loadHighQuality = () => {
      const img = new Image();
      img.onload = () => {
        setCurrentSrc(src);
        setIsLoading(false);
      };
      img.src = src;
    };

    // Load high quality after a delay
    const timer = setTimeout(loadHighQuality, 1000);
    return () => clearTimeout(timer);
  }, [src, lowQualitySrc]);

  return (
    <img
      src={currentSrc}
      alt={alt}
      className={`${props.className || ''} ${isLoading ? 'blur-sm' : 'blur-0'} transition-all duration-300`}
      loading="lazy"
      {...props}
    />
  );
};

export default ImageOptimizer; 