// Optimizaciones de rendimiento para Boattrip-Planner
// Basado en el reporte de Lighthouse

// 1. Preload de recursos críticos
export const preloadCriticalResources = () => {
  // Preload CSS crítico
  const criticalCSS = document.createElement('link');
  criticalCSS.rel = 'preload';
  criticalCSS.as = 'style';
  criticalCSS.href = '/assets/style.css';
  document.head.appendChild(criticalCSS);

  // Preload fuentes críticas
  const fontPreload = document.createElement('link');
  fontPreload.rel = 'preload';
  fontPreload.as = 'font';
  fontPreload.crossOrigin = 'anonymous';
  fontPreload.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap';
  document.head.appendChild(fontPreload);
};

// 2. Lazy loading de imágenes
export const lazyLoadImages = () => {
  const images = document.querySelectorAll('img[data-src]');
  const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target as HTMLImageElement;
        img.src = img.dataset.src || '';
        img.classList.remove('lazy');
        observer.unobserve(img);
      }
    });
  });

  images.forEach(img => imageObserver.observe(img));
};

// 3. Debounce para evitar reflows excesivos
export const debounce = (func: Function, wait: number) => {
  let timeout: NodeJS.Timeout;
  return function executedFunction(...args: any[]) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

// 4. Throttle para scroll events
export const throttle = (func: Function, limit: number) => {
  let inThrottle: boolean;
  return function() {
    const args = arguments;
    const context = this;
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};

// 5. Optimización de reflows
export const batchDOMUpdates = (updates: (() => void)[]) => {
  // Forzar un reflow antes de los cambios
  document.body.offsetHeight;
  
  // Aplicar todos los cambios
  updates.forEach(update => update());
  
  // Forzar un reflow después de los cambios
  document.body.offsetHeight;
};

// 6. Memoización para cálculos costosos
export const memoize = <T extends (...args: any[]) => any>(fn: T): T => {
  const cache = new Map();
  return ((...args: any[]) => {
    const key = JSON.stringify(args);
    if (cache.has(key)) {
      return cache.get(key);
    }
    const result = fn(...args);
    cache.set(key, result);
    return result;
  }) as T;
};

// 7. Optimización de eventos
export const optimizeEventListeners = () => {
  // Usar event delegation para elementos dinámicos
  document.addEventListener('click', (e) => {
    const target = e.target as HTMLElement;
    
    // Delegar clicks en botones de productos
    if (target.closest('[data-product-button]')) {
      // Manejar click en botón de producto
    }
    
    // Delegar clicks en enlaces de navegación
    if (target.closest('[data-nav-link]')) {
      // Manejar click en enlace de navegación
    }
  }, { passive: true });
};

// 8. Service Worker para cache
export const registerServiceWorker = () => {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js')
      .then(registration => {
        console.log('SW registered: ', registration);
      })
      .catch(registrationError => {
        console.log('SW registration failed: ', registrationError);
      });
  }
};

// 9. Optimización de CSS crítico
export const inlineCriticalCSS = () => {
  const criticalStyles = `
    /* Estilos críticos inline */
    body { margin: 0; font-family: 'Inter', sans-serif; }
    .header { position: fixed; top: 0; width: 100%; z-index: 1000; }
    .main-content { margin-top: 80px; }
    .loading { display: flex; justify-content: center; align-items: center; height: 100vh; }
  `;
  
  const style = document.createElement('style');
  style.textContent = criticalStyles;
  document.head.appendChild(style);
};

// 10. Optimización de bundle
export const optimizeBundle = () => {
  // Cargar componentes no críticos de forma lazy
  const loadComponent = (componentName: string) => {
    return import(`./components/${componentName}`).then(module => module.default);
  };
  
  return {
    loadProductCard: () => loadComponent('ProductCard'),
    loadBlogPost: () => loadComponent('BlogPost'),
    loadMap: () => loadComponent('Map'),
  };
};

// 11. Métricas de rendimiento
export const trackPerformance = () => {
  // LCP (Largest Contentful Paint)
  new PerformanceObserver((entryList) => {
    for (const entry of entryList.getEntries()) {
      console.log('LCP:', entry.startTime);
    }
  }).observe({ entryTypes: ['largest-contentful-paint'] });

  // FID (First Input Delay)
  new PerformanceObserver((entryList) => {
    for (const entry of entryList.getEntries()) {
      console.log('FID:', entry.processingStart - entry.startTime);
    }
  }).observe({ entryTypes: ['first-input'] });

  // CLS (Cumulative Layout Shift)
  new PerformanceObserver((entryList) => {
    let cls = 0;
    for (const entry of entryList.getEntries()) {
      if (!(entry as any).hadRecentInput) {
        cls += (entry as any).value;
      }
    }
    console.log('CLS:', cls);
  }).observe({ entryTypes: ['layout-shift'] });
};

// 12. Inicialización de optimizaciones
export const initPerformanceOptimizations = () => {
  // Aplicar optimizaciones en orden de prioridad
  inlineCriticalCSS();
  preloadCriticalResources();
  optimizeEventListeners();
  lazyLoadImages();
  registerServiceWorker();
  trackPerformance();
  
  // Optimizaciones post-carga
  window.addEventListener('load', () => {
    // Cargar recursos no críticos después de la carga inicial
    const nonCriticalCSS = document.createElement('link');
    nonCriticalCSS.rel = 'stylesheet';
    nonCriticalCSS.href = '/assets/non-critical.css';
    document.head.appendChild(nonCriticalCSS);
  });
}; 