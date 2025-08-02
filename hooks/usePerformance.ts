import { useEffect, useRef, useCallback } from 'react';

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
          if (!entry.hadRecentInput) {
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
        func.apply(this, args);
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