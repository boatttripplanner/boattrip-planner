/**
 * Utilidades para scroll que funcionan bien tanto en móvil como en web
 */

/**
 * Hace scroll suave al principio de la página
 * Con fallback para navegadores que no soportan smooth scroll
 */
export const scrollToTop = (): void => {
  // Usar requestAnimationFrame para mejor rendimiento
  requestAnimationFrame(() => {
    try {
      // Intentar scroll suave primero con duración personalizada
      window.scrollTo({ 
        top: 0, 
        behavior: 'smooth' 
      });
      
      // Para navegadores que soportan CSS scroll-behavior, podemos hacer scroll más suave
      if (CSS.supports('scroll-behavior', 'smooth')) {
        // Scroll adicional para asegurar que llegue al top
        setTimeout(() => {
          window.scrollTo(0, 0);
        }, 50);
      }
    } catch (error) {
      // Fallback para navegadores que no soportan smooth scroll
      window.scrollTo(0, 0);
    }
  });
};

/**
 * Hace scroll suave a un elemento específico
 * Con fallback para navegadores que no soportan smooth scroll
 */
export const scrollToElement = (element: HTMLElement | null, offset: number = 0): void => {
  if (!element) return;
  
  requestAnimationFrame(() => {
    try {
      const elementPosition = element.offsetTop - offset;
      window.scrollTo({ top: elementPosition, behavior: 'smooth' });
    } catch (error) {
      // Fallback para navegadores que no soportan smooth scroll
      const elementPosition = element.offsetTop - offset;
      window.scrollTo(0, elementPosition);
    }
  });
};

/**
 * Hace scroll suave a una posición específica
 * Con fallback para navegadores que no soportan smooth scroll
 */
export const scrollToPosition = (position: number): void => {
  requestAnimationFrame(() => {
    try {
      window.scrollTo({ top: position, behavior: 'smooth' });
    } catch (error) {
      // Fallback para navegadores que no soportan smooth scroll
      window.scrollTo(0, position);
    }
  });
};

/**
 * Detecta si el navegador soporta smooth scroll
 */
export const supportsSmoothScroll = (): boolean => {
  return 'scrollBehavior' in document.documentElement.style;
};

/**
 * Hace scroll al principio con la mejor estrategia disponible
 */
export const smartScrollToTop = (): void => {
  if (supportsSmoothScroll()) {
    scrollToTop();
  } else {
    // Para navegadores sin soporte, usar scroll instantáneo
    window.scrollTo(0, 0);
  }
};

/**
 * Scroll especial para transiciones de landing page al wizard
 * Más visible y suave para el usuario
 */
export const scrollToTopWithTransition = (): void => {
  // Primero hacer scroll suave
  scrollToTop();
  
  // Luego hacer un scroll adicional para asegurar que llegue al top
  setTimeout(() => {
    // Scroll adicional con easing
    const currentScroll = window.pageYOffset;
    if (currentScroll > 0) {
      const targetScroll = 0;
      const distance = currentScroll - targetScroll;
      const duration = 800; // 800ms para el scroll adicional
      let start: number | null = null;
      
      const animateScroll = (currentTime: number) => {
        if (start === null) start = currentTime;
        const timeElapsed = currentTime - start;
        const progress = Math.min(timeElapsed / duration, 1);
        
        // Easing function (ease-out)
        const easeOut = 1 - Math.pow(1 - progress, 3);
        const newScroll = currentScroll - (distance * easeOut);
        
        window.scrollTo(0, newScroll);
        
        if (progress < 1) {
          requestAnimationFrame(animateScroll);
        }
      };
      
      requestAnimationFrame(animateScroll);
    }
  }, 200);
};
