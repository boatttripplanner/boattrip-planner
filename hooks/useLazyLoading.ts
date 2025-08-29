import { useState, useEffect, useCallback, useRef } from 'react';

interface UseLazyLoadingOptions {
  threshold?: number;
  rootMargin?: string;
  preload?: boolean;
  preloadDelay?: number;
}

interface UseLazyLoadingReturn {
  isVisible: boolean;
  isLoaded: boolean;
  ref: React.RefObject<HTMLElement>;
  load: () => void;
}

/**
 * Hook personalizado para lazy loading inteligente con preloading
 * Optimiza la carga de componentes y recursos pesados
 */
export const useLazyLoading = (options: UseLazyLoadingOptions = {}): UseLazyLoadingReturn => {
  const {
    threshold = 0.1,
    rootMargin = '50px',
    preload = false,
    preloadDelay = 1000
  } = options;

  const [isVisible, setIsVisible] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const ref = useRef<HTMLElement>(null);
  const observer = useRef<IntersectionObserver | null>(null);

  // Función para cargar el componente
  const load = useCallback(() => {
    if (!isLoaded) {
      setIsLoaded(true);
    }
  }, [isLoaded]);

  // Configurar Intersection Observer
  useEffect(() => {
    if (!ref.current) return;

    observer.current = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          // Cargar inmediatamente si está visible
          load();
          
          // Desconectar el observer una vez que se carga
          if (observer.current) {
            observer.current.disconnect();
          }
        }
      },
      {
        threshold,
        rootMargin,
      }
    );

    observer.current.observe(ref.current);

    return () => {
      if (observer.current) {
        observer.current.disconnect();
      }
    };
  }, [threshold, rootMargin, load]);

  // Preloading inteligente
  useEffect(() => {
    if (preload && !isVisible && !isLoaded) {
      const timer = setTimeout(() => {
        // Preload en background después del delay
        load();
      }, preloadDelay);

      return () => clearTimeout(timer);
    }
  }, [preload, isVisible, isLoaded, preloadDelay, load]);

  return {
    isVisible,
    isLoaded,
    ref,
    load,
  };
};

/**
 * Hook para lazy loading de imágenes con placeholder
 */
export const useImageLazyLoading = (src: string, placeholder?: string) => {
  const [imageSrc, setImageSrc] = useState(placeholder || '');
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    if (!src) return;

    setIsLoading(true);
    setHasError(false);

    const img = new Image();
    
    img.onload = () => {
      setImageSrc(src);
      setIsLoading(false);
    };

    img.onerror = () => {
      setHasError(true);
      setIsLoading(false);
      // Fallback a placeholder si hay error
      if (placeholder) {
        setImageSrc(placeholder);
      }
    };

    img.src = src;

    return () => {
      img.onload = null;
      img.onerror = null;
    };
  }, [src, placeholder]);

  return {
    imageSrc,
    isLoading,
    hasError,
  };
};

/**
 * Hook para lazy loading de componentes con Suspense
 */
export const useComponentLazyLoading = <T extends React.ComponentType<any>>(
  importFunc: () => Promise<{ default: T }>,
  options: UseLazyLoadingOptions = {}
) => {
  const [Component, setComponent] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const loadComponent = useCallback(async () => {
    if (Component) return Component;

    setIsLoading(true);
    setError(null);

    try {
      const module = await importFunc();
      setComponent(() => module.default);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Error loading component'));
    } finally {
      setIsLoading(false);
    }
  }, [Component, importFunc]);

  // Preloading automático
  useEffect(() => {
    if (options.preload) {
      const timer = setTimeout(() => {
        loadComponent();
      }, options.preloadDelay || 1000);

      return () => clearTimeout(timer);
    }
  }, [options.preload, options.preloadDelay, loadComponent]);

  return {
    Component,
    isLoading,
    error,
    loadComponent,
  };
};

/**
 * Hook para lazy loading de datos con caching
 */
export const useDataLazyLoading = <T>(
  fetchFunc: () => Promise<T>,
  options: {
    cache?: boolean;
    cacheKey?: string;
    preload?: boolean;
    preloadDelay?: number;
  } = {}
) => {
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const cache = useRef<Map<string, T>>(new Map());

  const loadData = useCallback(async () => {
    if (data) return data;

    const cacheKey = options.cacheKey || 'default';
    
    // Verificar cache
    if (options.cache && cache.current.has(cacheKey)) {
      setData(cache.current.get(cacheKey)!);
      return cache.current.get(cacheKey)!;
    }

    setIsLoading(true);
    setError(null);

    try {
      const result = await fetchFunc();
      setData(result);
      
      // Guardar en cache
      if (options.cache) {
        cache.current.set(cacheKey, result);
      }
      
      return result;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Error loading data');
      setError(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [data, fetchFunc, options.cache, options.cacheKey]);

  // Preloading automático
  useEffect(() => {
    if (options.preload) {
      const timer = setTimeout(() => {
        loadData();
      }, options.preloadDelay || 1000);

      return () => clearTimeout(timer);
    }
  }, [options.preload, options.preloadDelay, loadData]);

  return {
    data,
    isLoading,
    error,
    loadData,
  };
};

export default useLazyLoading;
