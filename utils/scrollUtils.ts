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
      // Intentar scroll suave primero
      window.scrollTo({ top: 0, behavior: 'smooth' });
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
