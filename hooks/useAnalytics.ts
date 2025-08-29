// hooks/useAnalytics.ts
// 🎯 Hook personalizado para tracking de analytics

import { useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { 
  trackEvent, 
  trackPageView, 
  trackTimeOnPage, 
  trackError,
  trackSearch,
  trackRecommendation,
  trackAffiliateClick
} from '../services/analyticsService';

export const useAnalytics = () => {
  const location = useLocation();

  // Tracking automático de vistas de página
  useEffect(() => {
    const pageData = {
      page_title: document.title,
      page_location: window.location.href,
      page_path: location.pathname
    };

    trackPageView(pageData);

    // Tracking de tiempo en página
    const startTime = Date.now();
    return () => {
      const timeSpent = Math.round((Date.now() - startTime) / 1000);
      if (timeSpent > 5) { // Solo registrar si pasó más de 5 segundos
        trackTimeOnPage(timeSpent, location.pathname);
      }
    };
  }, [location.pathname]);

  // Funciones de tracking
  const trackUserAction = useCallback((action: string, category: string, label?: string, value?: number) => {
    trackEvent({
      action,
      category,
      label,
      value
    });
  }, []);

  const trackUserSearch = useCallback((query: string, resultsCount: number) => {
    trackSearch(query, resultsCount);
  }, []);

  const trackUserRecommendation = useCallback((type: string, destination?: string) => {
    trackRecommendation(type, destination);
  }, []);

  const trackUserAffiliateClick = useCallback((productData: {
    productId: string;
    productName: string;
    category: string;
    source: string;
    postSlug?: string;
  }) => {
    trackAffiliateClick(productData);
  }, []);

  const trackUserError = useCallback((errorType: string, errorMessage: string) => {
    trackError(errorType, errorMessage, location.pathname);
  }, [location.pathname]);

  // Tracking de engagement
  const trackEngagement = useCallback((action: string, element: string, value?: string) => {
    trackEvent({
      action,
      category: 'engagement',
      label: element,
      customParameters: {
        element_type: element,
        element_value: value
      }
    });
  }, []);

  // Tracking de formularios
  const trackFormSubmission = useCallback((formName: string, success: boolean, fieldsCount?: number) => {
    trackEvent({
      action: success ? 'form_submit_success' : 'form_submit_error',
      category: 'form',
      label: formName,
      value: fieldsCount,
      customParameters: {
        form_name: formName,
        success: success
      }
    });
  }, []);

  // Tracking de navegación
  const trackNavigation = useCallback((from: string, to: string, method: 'click' | 'back' | 'forward') => {
    trackEvent({
      action: 'navigation',
      category: 'user_journey',
      label: `${from} -> ${to}`,
      customParameters: {
        navigation_method: method,
        from_page: from,
        to_page: to
      }
    });
  }, []);

  return {
    trackUserAction,
    trackUserSearch,
    trackUserRecommendation,
    trackUserAffiliateClick,
    trackUserError,
    trackEngagement,
    trackFormSubmission,
    trackNavigation
  };
};
