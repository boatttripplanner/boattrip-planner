// services/affiliateTracking.ts
// Sistema de tracking para enlaces de afiliados

export interface AffiliateClick {
  productId: string;
  productName: string;
  category: string;
  timestamp: number;
  source: 'blog_post' | 'product_recommendations' | 'inline_link';
  postSlug?: string;
  userAgent: string;
  referrer: string;
}

export interface AffiliateStats {
  totalClicks: number;
  clicksByProduct: { [productId: string]: number };
  clicksByCategory: { [category: string]: number };
  clicksBySource: { [source: string]: number };
  revenue: number;
  conversionRate: number;
}

class AffiliateTrackingService {
  private clicks: AffiliateClick[] = [];
  private readonly STORAGE_KEY = 'affiliate_clicks';

  constructor() {
    this.loadClicks();
  }

  // Registrar un click en un enlace de afiliado
  trackClick(
    productId: string,
    productName: string,
    category: string,
    source: AffiliateClick['source'],
    postSlug?: string
  ) {
    const click: AffiliateClick = {
      productId,
      productName,
      category,
      timestamp: Date.now(),
      source,
      postSlug,
      userAgent: navigator.userAgent,
      referrer: document.referrer
    };

    this.clicks.push(click);
    this.saveClicks();
    
    // Enviar a analytics si está configurado
    this.sendToAnalytics(click);
    
    console.log('Affiliate click tracked:', click);
  }

  // Obtener estadísticas
  getStats(): AffiliateStats {
    const totalClicks = this.clicks.length;
    const clicksByProduct: { [productId: string]: number } = {};
    const clicksByCategory: { [category: string]: number } = {};
    const clicksBySource: { [source: string]: number } = {};

    this.clicks.forEach(click => {
      // Contar por producto
      clicksByProduct[click.productId] = (clicksByProduct[click.productId] || 0) + 1;
      
      // Contar por categoría
      clicksByCategory[click.category] = (clicksByCategory[click.category] || 0) + 1;
      
      // Contar por fuente
      clicksBySource[click.source] = (clicksBySource[click.source] || 0) + 1;
    });

    // Calcular revenue estimado (ejemplo: 5% de conversión, €20 promedio por venta)
    const estimatedConversions = Math.floor(totalClicks * 0.05);
    const estimatedRevenue = estimatedConversions * 20;
    const conversionRate = totalClicks > 0 ? (estimatedConversions / totalClicks) * 100 : 0;

    return {
      totalClicks,
      clicksByProduct,
      clicksByCategory,
      clicksBySource,
      revenue: estimatedRevenue,
      conversionRate
    };
  }

  // Obtener productos más populares
  getTopProducts(limit: number = 5): Array<{ productId: string; clicks: number }> {
    const stats = this.getStats();
    return Object.entries(stats.clicksByProduct)
      .map(([productId, clicks]) => ({ productId, clicks }))
      .sort((a, b) => b.clicks - a.clicks)
      .slice(0, limit);
  }

  // Obtener categorías más populares
  getTopCategories(limit: number = 5): Array<{ category: string; clicks: number }> {
    const stats = this.getStats();
    return Object.entries(stats.clicksByCategory)
      .map(([category, clicks]) => ({ category, clicks }))
      .sort((a, b) => b.clicks - a.clicks)
      .slice(0, limit);
  }

  // Exportar datos para análisis
  exportData(): string {
    return JSON.stringify({
      clicks: this.clicks,
      stats: this.getStats(),
      exportDate: new Date().toISOString()
    }, null, 2);
  }

  // Limpiar datos antiguos (más de 30 días)
  cleanOldData() {
    const thirtyDaysAgo = Date.now() - (30 * 24 * 60 * 60 * 1000);
    this.clicks = this.clicks.filter(click => click.timestamp > thirtyDaysAgo);
    this.saveClicks();
  }

  private loadClicks() {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (stored) {
        this.clicks = JSON.parse(stored);
      }
    } catch (error) {
      console.warn('Error loading affiliate clicks:', error);
      this.clicks = [];
    }
  }

  private saveClicks() {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.clicks));
    } catch (error) {
      console.warn('Error saving affiliate clicks:', error);
    }
  }

  private sendToAnalytics(click: AffiliateClick) {
    // Aquí puedes integrar con Google Analytics, Facebook Pixel, etc.
    if (typeof gtag !== 'undefined') {
      gtag('event', 'affiliate_click', {
        product_id: click.productId,
        product_name: click.productName,
        category: click.category,
        source: click.source,
        post_slug: click.postSlug
      });
    }

    // Facebook Pixel
    if (typeof fbq !== 'undefined') {
      fbq('track', 'Lead', {
        content_name: click.productName,
        content_category: click.category,
        value: 20 // Valor estimado
      });
    }
  }
}

// Instancia global del servicio
export const affiliateTracking = new AffiliateTrackingService();

// Función helper para tracking automático
export const trackAffiliateClick = (
  productId: string,
  productName: string,
  category: string,
  source: AffiliateClick['source'],
  postSlug?: string
) => {
  affiliateTracking.trackClick(productId, productName, category, source, postSlug);
};

// Limpiar datos antiguos automáticamente cada semana
setInterval(() => {
  affiliateTracking.cleanOldData();
}, 7 * 24 * 60 * 60 * 1000); // 7 días 