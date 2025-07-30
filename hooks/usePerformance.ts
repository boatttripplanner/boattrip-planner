import { useCallback, useRef, useEffect, useState } from 'react';

// Hook for debouncing values
export const useDebounce = <T>(value: T, delay: number): T => {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

// Hook for throttling function calls
export const useThrottle = <T extends (...args: any[]) => any>(
  callback: T,
  delay: number
): T => {
  const lastCall = useRef(0);
  const lastCallTimer = useRef<NodeJS.Timeout | undefined>(undefined);

  return useCallback(
    (...args: Parameters<T>) => {
      const now = Date.now();

      if (now - lastCall.current >= delay) {
        lastCall.current = now;
        callback(...args);
      } else {
        clearTimeout(lastCallTimer.current!);
        lastCallTimer.current = setTimeout(() => {
          lastCall.current = Date.now();
          callback(...args);
        }, delay - (now - lastCall.current));
      }
    },
    [callback, delay]
  ) as T;
};

// Hook for memoizing expensive calculations
export const useMemoizedValue = <T>(
  factory: () => T,
  deps: React.DependencyList,
  equalityFn?: (prev: T, next: T) => boolean
): T => {
  const ref = useRef<T | undefined>(undefined);
  const depsRef = useRef<React.DependencyList | undefined>(undefined);

  if (!depsRef.current || !equalityFn || !equalityFn(ref.current!, factory())) {
    ref.current = factory();
    depsRef.current = deps;
  }

  return ref.current!;
};

// Hook for intersection observer
export const useIntersectionObserver = (
  options: IntersectionObserverInit = {}
) => {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const [entry, setEntry] = useState<IntersectionObserverEntry | null>(null);
  const elementRef = useRef<Element | null>(null);

  const callback = useCallback((entries: IntersectionObserverEntry[]) => {
    const [entry] = entries;
    setIsIntersecting(entry.isIntersecting);
    setEntry(entry);
  }, []);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(callback, options);
    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [callback, options]);

  return { ref: elementRef, isIntersecting, entry };
};

// Hook for measuring component render time
export const useRenderTime = (componentName: string) => {
  const renderStart = useRef<number | undefined>(undefined);

  useEffect(() => {
    renderStart.current = performance.now();

    return () => {
      if (renderStart.current) {
        const renderTime = performance.now() - renderStart.current;
        if (renderTime > 16) { // Longer than one frame
          console.warn(`${componentName} took ${renderTime.toFixed(2)}ms to render`);
        }
      }
    };
  });
};

// Hook for lazy loading with intersection observer
export const useLazyLoad = (
  threshold: number = 0.1,
  rootMargin: string = '50px'
) => {
  const [isVisible, setIsVisible] = useState(false);
  const { ref, isIntersecting } = useIntersectionObserver({
    threshold,
    rootMargin
  });

  useEffect(() => {
    if (isIntersecting) {
      setIsVisible(true);
    }
  }, [isIntersecting]);

  return { ref, isVisible };
};

// Hook for performance monitoring
export const usePerformanceMonitor = (componentName: string) => {
  const mountTime = useRef<number | undefined>(undefined);
  const updateCount = useRef<number>(0);

  useEffect(() => {
    mountTime.current = performance.now();
    updateCount.current = 0;

    return () => {
      if (mountTime.current) {
        const totalTime = performance.now() - mountTime.current;
        console.log(`${componentName} mounted for ${totalTime.toFixed(2)}ms with ${updateCount.current} updates`);
      }
    };
  }, []);

  useEffect(() => {
    updateCount.current++;
  });

  return {
    getUpdateCount: () => updateCount.current,
    getMountTime: () => mountTime.current
  };
};

// Hook for memory usage monitoring
export const useMemoryMonitor = () => {
  const [memoryInfo, setMemoryInfo] = useState<{
    usedJSHeapSize: number;
    totalJSHeapSize: number;
    jsHeapSizeLimit: number;
  } | null>(null);

  useEffect(() => {
    const updateMemoryInfo = () => {
      if ('memory' in performance) {
        setMemoryInfo((performance as any).memory);
      }
    };

    updateMemoryInfo();
    const interval = setInterval(updateMemoryInfo, 5000); // Update every 5 seconds

    return () => clearInterval(interval);
  }, []);

  return memoryInfo;
};

// Hook for network status monitoring
export const useNetworkStatus = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [connection, setConnection] = useState<{
    effectiveType: string;
    downlink: number;
    rtt: number;
  } | null>(null);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Check connection info if available
    if ('connection' in navigator) {
      const conn = (navigator as any).connection;
      setConnection({
        effectiveType: conn.effectiveType,
        downlink: conn.downlink,
        rtt: conn.rtt
      });

      const handleConnectionChange = () => {
        setConnection({
          effectiveType: conn.effectiveType,
          downlink: conn.downlink,
          rtt: conn.rtt
        });
      };

      conn.addEventListener('change', handleConnectionChange);
      return () => {
        conn.removeEventListener('change', handleConnectionChange);
        window.removeEventListener('online', handleOnline);
        window.removeEventListener('offline', handleOffline);
      };
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return { isOnline, connection };
};

// Hook for optimizing expensive operations
export const useOptimizedCallback = <T extends (...args: any[]) => any>(
  callback: T,
  deps: React.DependencyList,
  options: {
    maxCalls?: number;
    timeWindow?: number;
  } = {}
) => {
  const { maxCalls = 100, timeWindow = 1000 } = options;
  const callCount = useRef<number>(0);
  const lastCallTime = useRef<number>(0);

  return useCallback(
    (...args: Parameters<T>) => {
      const now = Date.now();

      // Reset counter if time window has passed
      if (now - lastCallTime.current > timeWindow) {
        callCount.current = 0;
      }

      // Limit calls per time window
      if (callCount.current < maxCalls) {
        callCount.current++;
        lastCallTime.current = now;
        return callback(...args);
      }

      console.warn(`Callback called too frequently (${callCount.current} times in ${timeWindow}ms)`);
    },
    [callback, maxCalls, timeWindow, ...deps]
  ) as T;
};

// Legacy hook for backward compatibility
interface PerformanceMetrics {
  loadTime: number;
  firstContentfulPaint: number;
  largestContentfulPaint: number;
  cumulativeLayoutShift: number;
}

export const usePerformance = () => {
  const metricsRef = useRef<PerformanceMetrics>({
    loadTime: 0,
    firstContentfulPaint: 0,
    largestContentfulPaint: 0,
    cumulativeLayoutShift: 0
  });

  const measureLoadTime = useCallback(() => {
    if ('performance' in window) {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      if (navigation) {
        metricsRef.current.loadTime = navigation.loadEventEnd - navigation.loadEventStart;
        console.log('Page Load Time:', metricsRef.current.loadTime, 'ms');
      }
    }
  }, []);

  const measureWebVitals = useCallback(() => {
    if ('PerformanceObserver' in window) {
      // First Contentful Paint
      const fcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry) => {
          if (entry.name === 'first-contentful-paint') {
            metricsRef.current.firstContentfulPaint = entry.startTime;
            console.log('First Contentful Paint:', entry.startTime, 'ms');
          }
        });
      });
      fcpObserver.observe({ entryTypes: ['paint'] });

      // Largest Contentful Paint
      const lcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];
        if (lastEntry) {
          metricsRef.current.largestContentfulPaint = lastEntry.startTime;
          console.log('Largest Contentful Paint:', lastEntry.startTime, 'ms');
        }
      });
      lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });

      // Cumulative Layout Shift
      const clsObserver = new PerformanceObserver((list) => {
        let clsValue = 0;
        for (const entry of list.getEntries()) {
                  if (!(entry as any).hadRecentInput) {
          clsValue += (entry as any).value;
        }
        }
        metricsRef.current.cumulativeLayoutShift = clsValue;
        console.log('Cumulative Layout Shift:', clsValue);
      });
      clsObserver.observe({ entryTypes: ['layout-shift'] });
    }
  }, []);

  const debounce = useCallback((func: Function, wait: number) => {
    let timeout: NodeJS.Timeout;
    return function executedFunction(...args: any[]) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }, []);

  const throttle = useCallback((func: Function, limit: number) => {
    let inThrottle: boolean;
    return function executedFunction(...args: any[]) {
      if (!inThrottle) {
        func.apply(null, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  }, []);

  useEffect(() => {
    measureLoadTime();
    measureWebVitals();
  }, [measureLoadTime, measureWebVitals]);

  return {
    metrics: metricsRef.current,
    debounce,
    throttle
  };
}; 