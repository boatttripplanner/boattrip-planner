import { useEffect, useRef } from 'react';

interface UseScrollToTopOptions {
  behavior?: ScrollBehavior;
  delay?: number;
  enabled?: boolean;
}

export const useScrollToTop = (
  dependency: any,
  options: UseScrollToTopOptions = {}
) => {
  const {
    behavior = 'smooth',
    delay = 100,
    enabled = true
  } = options;

  const isInitialMount = useRef(true);
  const lastDependency = useRef(dependency);

  useEffect(() => {
    // No hacer scroll en el montaje inicial
    if (isInitialMount.current) {
      isInitialMount.current = false;
      lastDependency.current = dependency;
      return;
    }

    // Solo ejecutar si la dependencia realmente cambió
    if (lastDependency.current === dependency) {
      return;
    }

    if (!enabled) return;

    console.log('🔄 useScrollToTop triggered:', { 
      oldDependency: lastDependency.current, 
      newDependency: dependency, 
      behavior, 
      delay, 
      enabled 
    });

    const scrollToTop = () => {
      console.log('📱 Scrolling to top...');
      window.scrollTo({
        top: 0,
        left: 0,
        behavior
      });
    };

    // Pequeño delay para asegurar que el DOM se ha actualizado
    const timeoutId = setTimeout(scrollToTop, delay);

    // Actualizar la dependencia de referencia
    lastDependency.current = dependency;

    return () => clearTimeout(timeoutId);
  }, [dependency, behavior, delay, enabled]);

  // Función manual para hacer scroll al top
  const scrollToTop = () => {
    if (!enabled) return;
    
    console.log('📱 Manual scroll to top...');
    window.scrollTo({
      top: 0,
      left: 0,
      behavior
    });
  };

  return { scrollToTop };
};
