import React, { useEffect, useCallback, useMemo } from 'react';

interface PerformanceOptimizerProps {
  children: React.ReactNode;
}

export const PerformanceOptimizer: React.FC<PerformanceOptimizerProps> = ({ children }) => {
  // Debounce function to prevent excessive re-renders
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

  // Throttle function for performance-critical events
  const throttle = useCallback((func: Function, limit: number) => {
    let inThrottle: boolean;
    return function executedFunction(...args: any[]) {
      if (!inThrottle) {
        func.apply(this, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  }, []);

  // Performance monitoring with better thresholds
  useEffect(() => {
    if ('performance' in window) {
      // Monitor long tasks with better thresholds
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.duration > 16) { // Tasks longer than 16ms (one frame)
            console.warn('Long task detected:', entry);
          }
        }
      });
      
      observer.observe({ entryTypes: ['longtask'] });

      // Monitor layout shifts with better thresholds
      const layoutObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if ((entry as any).value > 0.05) { // Layout shifts > 0.05 (more sensitive)
            console.warn('Layout shift detected:', entry);
          }
        }
      });
      
      layoutObserver.observe({ entryTypes: ['layout-shift'] });

      // Monitor First Input Delay (FID)
      const fidObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.processingStart - entry.startTime > 100) { // FID > 100ms
            console.warn('Slow first input detected:', entry);
          }
        }
      });
      
      fidObserver.observe({ entryTypes: ['first-input'] });

      // Monitor Largest Contentful Paint (LCP)
      const lcpObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.startTime > 2500) { // LCP > 2.5s
            console.warn('Slow LCP detected:', entry);
          }
        }
      });
      
      lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });

      return () => {
        observer.disconnect();
        layoutObserver.disconnect();
        fidObserver.disconnect();
        lcpObserver.disconnect();
      };
    }
  }, []);

  // Optimize scroll events with throttling
  useEffect(() => {
    const handleScroll = throttle(() => {
      // Handle scroll events efficiently
    }, 16); // ~60fps

    window.addEventListener('scroll', handleScroll, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [throttle]);

  // Optimize resize events with debouncing
  useEffect(() => {
    const handleResize = debounce(() => {
      // Handle resize events efficiently
    }, 100);

    window.addEventListener('resize', handleResize, { passive: true });
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [debounce]);

  // Optimize touch events
  useEffect(() => {
    const handleTouchStart = throttle(() => {
      // Handle touch events efficiently
    }, 16);

    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    
    return () => {
      window.removeEventListener('touchstart', handleTouchStart);
    };
  }, [throttle]);

  // Preload critical resources
  useEffect(() => {
    // Preload critical CSS
    const criticalCSS = document.createElement('link');
    criticalCSS.rel = 'preload';
    criticalCSS.as = 'style';
    criticalCSS.href = '/assets/style.css';
    document.head.appendChild(criticalCSS);

    // Preload critical fonts
    const fontPreload = document.createElement('link');
    fontPreload.rel = 'preload';
    fontPreload.as = 'font';
    fontPreload.type = 'font/woff2';
    fontPreload.crossOrigin = 'anonymous';
    document.head.appendChild(fontPreload);

    return () => {
      document.head.removeChild(criticalCSS);
      document.head.removeChild(fontPreload);
    };
  }, []);

  // Memory management
  useEffect(() => {
    const cleanup = () => {
      // Clear any cached data that's not needed
      if ('caches' in window) {
        caches.keys().then(names => {
          names.forEach(name => {
            if (name.includes('old-')) {
              caches.delete(name);
            }
          });
        });
      }
    };

    // Clean up every 5 minutes
    const interval = setInterval(cleanup, 5 * 60 * 1000);

    return () => {
      clearInterval(interval);
      cleanup();
    };
  }, []);

  return <>{children}</>;
};

export default PerformanceOptimizer; 