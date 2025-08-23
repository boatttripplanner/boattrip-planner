import { useEffect } from 'react';

interface UseBeforeUnloadOptions {
  message?: string;
  enabled?: boolean;
}

/**
 * Hook personalizado para mostrar un mensaje de confirmación
 * antes de que el usuario abandone la página
 */
export const useBeforeUnload = (options: UseBeforeUnloadOptions = {}) => {
  const {
    message = '¿Estás seguro de que quieres salir? Los cambios no guardados se perderán.',
    enabled = true
  } = options;

  useEffect(() => {
    if (!enabled) return;

    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      // Mostrar mensaje personalizado (funciona en la mayoría de navegadores)
      event.preventDefault();
      
      // Para compatibilidad con navegadores más antiguos
      event.returnValue = message;
      
      return message;
    };

    // Agregar el event listener
    window.addEventListener('beforeunload', handleBeforeUnload);

    // Cleanup: remover el event listener cuando el componente se desmonte
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [message, enabled]);
};

/**
 * Hook para confirmar antes de navegar a otra ruta (SPA navigation)
 * Este hook requiere que el componente padre maneje la confirmación
 */
export const useNavigationConfirm = (options: UseBeforeUnloadOptions = {}) => {
  const {
    message = '¿Estás seguro de que quieres salir? Los cambios no guardados se perderán.',
    enabled = true
  } = options;

  useEffect(() => {
    if (!enabled) return;

    const handlePopState = (event: PopStateEvent) => {
      // Prevenir la navegación automáticamente
      event.preventDefault();
      // Restaurar la URL anterior
      window.history.pushState(null, '', window.location.href);
      
      // Disparar un evento personalizado para que el componente padre maneje la confirmación
      const customEvent = new CustomEvent('navigation-confirm', {
        detail: { message, originalEvent: event }
      });
      window.dispatchEvent(customEvent);
    };

    // Agregar el event listener para cambios de ruta
    window.addEventListener('popstate', handlePopState);

    // Cleanup
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [message, enabled]);
};

/**
 * Hook combinado que maneja tanto beforeunload como navegación SPA
 */
export const usePageExitConfirm = (options: UseBeforeUnloadOptions = {}) => {
  useBeforeUnload(options);
  useNavigationConfirm(options);
};

/**
 * Hook que solo maneja beforeunload (para navegación externa)
 */
export const useBeforeUnloadOnly = (options: UseBeforeUnloadOptions = {}) => {
  useBeforeUnload(options);
};
