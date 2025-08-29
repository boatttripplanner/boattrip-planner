// services/analyticsService.ts
// 📊 Servicio centralizado de Analytics y Tracking

export interface AnalyticsEvent {
  action: string;
  category: string;
  label?: string;
  value?: number;
  customParameters?: Record<string, any>;
}

export interface PageViewEvent {
  page_title: string;
  page_location: string;
  page_path: string;
}

class AnalyticsService {
  private isInitialized = false;
  private analyticsId: string;

  constructor() {
    this.analyticsId = import.meta.env.VITE_GOOGLE_ANALYTICS_ID || 'G-VR3KE7RXBD';
    this.initialize();
  }

  private initialize(): void {
    if (typeof window !== 'undefined' && (window as any).gtag) {
      this.isInitialized = true;
      console.log('✅ Google Analytics inicializado:', this.analyticsId);
    } else {
      console.warn('⚠️ Google Analytics no disponible');
    }
  }

  // Tracking de eventos personalizados
  trackEvent(event: AnalyticsEvent): void {
    if (!this.isInitialized) {
      console.warn('Analytics no inicializado, evento no registrado:', event);
      return;
    }

    try {
      (window as any).gtag('event', event.action, {
        event_category: event.category,
        event_label: event.label,
        value: event.value,
        ...event.customParameters
      });

      console.log('📊 Evento registrado:', event);
    } catch (error) {
      console.error('Error tracking event:', error);
    }
  }

  // Tracking de vistas de página
  trackPageView(pageData: PageViewEvent): void {
    if (!this.isInitialized) return;

    try {
      (window as any).gtag('config', this.analyticsId, {
        page_title: pageData.page_title,
        page_location: pageData.page_location,
        page_path: pageData.page_path
      });

      console.log('📄 Page view registrada:', pageData);
    } catch (error) {
      console.error('Error tracking page view:', error);
    }
  }

  // Tracking de conversiones de afiliados
  trackAffiliateClick(productData: {
    productId: string;
    productName: string;
    category: string;
    source: string;
    postSlug?: string;
  }): void {
    this.trackEvent({
      action: 'affiliate_click',
      category: 'affiliate',
      label: productData.productName,
      customParameters: {
        product_id: productData.productId,
        product_category: productData.category,
        source: productData.source,
        post_slug: productData.postSlug
      }
    });
  }

  // Tracking de búsquedas
  trackSearch(query: string, resultsCount: number): void {
    this.trackEvent({
      action: 'search',
      category: 'engagement',
      label: query,
      value: resultsCount
    });
  }

  // Tracking de recomendaciones
  trackRecommendation(recommendationType: string, destination?: string): void {
    this.trackEvent({
      action: 'recommendation_generated',
      category: 'engagement',
      label: recommendationType,
      customParameters: {
        destination: destination
      }
    });
  }

  // Tracking de tiempo en página
  trackTimeOnPage(timeInSeconds: number, pagePath: string): void {
    this.trackEvent({
      action: 'time_on_page',
      category: 'engagement',
      value: timeInSeconds,
      customParameters: {
        page_path: pagePath
      }
    });
  }

  // Tracking de errores
  trackError(errorType: string, errorMessage: string, pagePath?: string): void {
    this.trackEvent({
      action: 'error',
      category: 'error',
      label: errorType,
      customParameters: {
        error_message: errorMessage,
        page_path: pagePath
      }
    });
  }
}

// Instancia global del servicio
export const analyticsService = new AnalyticsService();

// Funciones de conveniencia para uso directo
export const trackEvent = (event: AnalyticsEvent) => analyticsService.trackEvent(event);
export const trackPageView = (pageData: PageViewEvent) => analyticsService.trackPageView(pageData);
export const trackAffiliateClick = (productData: any) => analyticsService.trackAffiliateClick(productData);
export const trackSearch = (query: string, resultsCount: number) => analyticsService.trackSearch(query, resultsCount);
export const trackRecommendation = (type: string, destination?: string) => analyticsService.trackRecommendation(type, destination);
export const trackError = (type: string, message: string, pagePath?: string) => analyticsService.trackError(type, message, pagePath);
