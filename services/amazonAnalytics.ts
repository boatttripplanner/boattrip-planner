// services/amazonAnalytics.ts
// 📊 Sistema de Analytics y Métricas Avanzadas para Amazon

import { AMAZON_API_CONFIG } from '../constants';

export interface ConversionEvent {
  id: string;
  userId?: string;
  sessionId: string;
  asin: string;
  productTitle: string;
  eventType: 'view' | 'click' | 'add_to_cart' | 'purchase';
  timestamp: Date;
  source: 'blog' | 'search' | 'recommendation' | 'direct';
  campaign?: string;
  revenue?: number;
  commission?: number;
  metadata: {
    userAgent: string;
    referrer?: string;
    pageUrl: string;
    timeOnPage?: number;
    scrollDepth?: number;
  };
}

export interface AnalyticsSummary {
  totalViews: number;
  totalClicks: number;
  totalConversions: number;
  conversionRate: number;
  totalRevenue: number;
  totalCommission: number;
  averageOrderValue: number;
  topProducts: Array<{
    asin: string;
    title: string;
    views: number;
    clicks: number;
    conversions: number;
    revenue: number;
  }>;
  topCategories: Array<{
    category: string;
    views: number;
    clicks: number;
    conversions: number;
    revenue: number;
  }>;
  performanceBySource: Array<{
    source: string;
    views: number;
    clicks: number;
    conversions: number;
    conversionRate: number;
  }>;
}

export interface ProductPerformance {
  asin: string;
  title: string;
  category: string;
  views: number;
  clicks: number;
  conversions: number;
  conversionRate: number;
  revenue: number;
  commission: number;
  averageOrderValue: number;
  lastUpdated: Date;
}

export interface UserJourney {
  userId: string;
  sessionId: string;
  startTime: Date;
  endTime?: Date;
  events: ConversionEvent[];
  totalRevenue: number;
  conversionPath: string[];
  timeToConversion?: number;
}

class AmazonAnalytics {
  private events: ConversionEvent[] = [];
  private userJourneys: Map<string, UserJourney> = new Map();
  private productPerformance: Map<string, ProductPerformance> = new Map();

  // Registrar evento de conversión
  async trackEvent(event: Omit<ConversionEvent, 'id' | 'timestamp'>): Promise<void> {
    try {
      const fullEvent: ConversionEvent = {
        ...event,
        id: this.generateEventId(),
        timestamp: new Date()
      };

      this.events.push(fullEvent);
      this.updateProductPerformance(fullEvent);
      this.updateUserJourney(fullEvent);

      // En producción, enviar a base de datos
      console.log(`📊 Evento registrado: ${event.eventType} para ${event.asin}`);
    } catch (error) {
      console.error('Error tracking event:', error);
    }
  }

  // Obtener resumen de analytics
  async getAnalyticsSummary(
    startDate: Date,
    endDate: Date
  ): Promise<AnalyticsSummary> {
    try {
      const filteredEvents = this.events.filter(
        event => event.timestamp >= startDate && event.timestamp <= endDate
      );

      const views = filteredEvents.filter(e => e.eventType === 'view').length;
      const clicks = filteredEvents.filter(e => e.eventType === 'click').length;
      const conversions = filteredEvents.filter(e => e.eventType === 'purchase').length;
      const conversionRate = views > 0 ? (conversions / views) * 100 : 0;

      const totalRevenue = filteredEvents
        .filter(e => e.revenue)
        .reduce((sum, e) => sum + (e.revenue || 0), 0);

      const totalCommission = filteredEvents
        .filter(e => e.commission)
        .reduce((sum, e) => sum + (e.commission || 0), 0);

      const averageOrderValue = conversions > 0 ? totalRevenue / conversions : 0;

      return {
        totalViews: views,
        totalClicks: clicks,
        totalConversions: conversions,
        conversionRate,
        totalRevenue,
        totalCommission,
        averageOrderValue,
        topProducts: this.getTopProducts(filteredEvents),
        topCategories: this.getTopCategories(filteredEvents),
        performanceBySource: this.getPerformanceBySource(filteredEvents)
      };
    } catch (error) {
      console.error('Error getting analytics summary:', error);
      throw error;
    }
  }

  // Obtener rendimiento de productos
  async getProductPerformance(
    asin?: string,
    limit: number = 20
  ): Promise<ProductPerformance[]> {
    try {
      const products = Array.from(this.productPerformance.values());
      
      if (asin) {
        return products.filter(p => p.asin === asin);
      }

      return products
        .sort((a, b) => b.revenue - a.revenue)
        .slice(0, limit);
    } catch (error) {
      console.error('Error getting product performance:', error);
      return [];
    }
  }

  // Obtener journey de usuario
  async getUserJourney(userId: string, sessionId?: string): Promise<UserJourney[]> {
    try {
      const journeys = Array.from(this.userJourneys.values());
      
      if (sessionId) {
        return journeys.filter(j => j.userId === userId && j.sessionId === sessionId);
      }

      return journeys.filter(j => j.userId === userId);
    } catch (error) {
      console.error('Error getting user journey:', error);
      return [];
    }
  }

  // Obtener productos con mejor conversión
  async getBestConvertingProducts(limit: number = 10): Promise<ProductPerformance[]> {
    try {
      const products = Array.from(this.productPerformance.values());
      
      return products
        .filter(p => p.views >= 10) // Mínimo 10 vistas para estadísticas confiables
        .sort((a, b) => b.conversionRate - a.conversionRate)
        .slice(0, limit);
    } catch (error) {
      console.error('Error getting best converting products:', error);
      return [];
    }
  }

  // Obtener productos con mayor revenue
  async getTopRevenueProducts(limit: number = 10): Promise<ProductPerformance[]> {
    try {
      const products = Array.from(this.productPerformance.values());
      
      return products
        .sort((a, b) => b.revenue - a.revenue)
        .slice(0, limit);
    } catch (error) {
      console.error('Error getting top revenue products:', error);
      return [];
    }
  }

  // Obtener análisis de cohortes
  async getCohortAnalysis(
    startDate: Date,
    endDate: Date,
    cohortSize: 'day' | 'week' | 'month' = 'week'
  ): Promise<{
    cohorts: Array<{
      cohort: string;
      size: number;
      retention: number[];
      revenue: number[];
    }>;
  }> {
    try {
      // Simulación de análisis de cohortes
      const cohorts = [
        {
          cohort: '2024-01-01',
          size: 150,
          retention: [100, 85, 72, 65, 58, 52, 48],
          revenue: [0, 1200, 2100, 2800, 3200, 3500, 3800]
        },
        {
          cohort: '2024-01-08',
          size: 180,
          retention: [100, 88, 75, 68, 62, 56],
          revenue: [0, 1400, 2400, 3100, 3600, 3900]
        }
      ];

      return { cohorts };
    } catch (error) {
      console.error('Error getting cohort analysis:', error);
      return { cohorts: [] };
    }
  }

  // Obtener análisis de funnel
  async getFunnelAnalysis(
    startDate: Date,
    endDate: Date
  ): Promise<{
    stages: Array<{
      stage: string;
      count: number;
      conversionRate: number;
    }>;
  }> {
    try {
      const filteredEvents = this.events.filter(
        event => event.timestamp >= startDate && event.timestamp <= endDate
      );

      const views = filteredEvents.filter(e => e.eventType === 'view').length;
      const clicks = filteredEvents.filter(e => e.eventType === 'click').length;
      const addToCart = filteredEvents.filter(e => e.eventType === 'add_to_cart').length;
      const purchases = filteredEvents.filter(e => e.eventType === 'purchase').length;

      return {
        stages: [
          {
            stage: 'Vistas',
            count: views,
            conversionRate: 100
          },
          {
            stage: 'Clicks',
            count: clicks,
            conversionRate: views > 0 ? (clicks / views) * 100 : 0
          },
          {
            stage: 'Añadir al Carrito',
            count: addToCart,
            conversionRate: clicks > 0 ? (addToCart / clicks) * 100 : 0
          },
          {
            stage: 'Compras',
            count: purchases,
            conversionRate: addToCart > 0 ? (purchases / addToCart) * 100 : 0
          }
        ]
      };
    } catch (error) {
      console.error('Error getting funnel analysis:', error);
      return { stages: [] };
    }
  }

  // Obtener análisis de ROI por campaña
  async getCampaignROI(
    startDate: Date,
    endDate: Date
  ): Promise<Array<{
    campaign: string;
    spend: number;
    revenue: number;
    roi: number;
    conversions: number;
    cpa: number;
  }>> {
    try {
      const filteredEvents = this.events.filter(
        event => event.timestamp >= startDate && event.timestamp <= endDate && event.campaign
      );

      const campaignData = new Map<string, {
        spend: number;
        revenue: number;
        conversions: number;
      }>();

      for (const event of filteredEvents) {
        if (!event.campaign) continue;

        const current = campaignData.get(event.campaign) || {
          spend: 0,
          revenue: 0,
          conversions: 0
        };

        if (event.revenue) {
          current.revenue += event.revenue;
        }

        if (event.eventType === 'purchase') {
          current.conversions += 1;
        }

        // Simular spend basado en clicks (€0.50 por click)
        if (event.eventType === 'click') {
          current.spend += 0.5;
        }

        campaignData.set(event.campaign, current);
      }

      return Array.from(campaignData.entries()).map(([campaign, data]) => ({
        campaign,
        spend: data.spend,
        revenue: data.revenue,
        roi: data.spend > 0 ? ((data.revenue - data.spend) / data.spend) * 100 : 0,
        conversions: data.conversions,
        cpa: data.conversions > 0 ? data.spend / data.conversions : 0
      }));
    } catch (error) {
      console.error('Error getting campaign ROI:', error);
      return [];
    }
  }

  // Métodos privados
  private generateEventId(): string {
    return `evt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private updateProductPerformance(event: ConversionEvent): void {
    const current = this.productPerformance.get(event.asin) || {
      asin: event.asin,
      title: event.productTitle,
      category: 'nautical', // Por defecto
      views: 0,
      clicks: 0,
      conversions: 0,
      revenue: 0,
      commission: 0,
      averageOrderValue: 0,
      lastUpdated: new Date()
    };

    switch (event.eventType) {
      case 'view':
        current.views += 1;
        break;
      case 'click':
        current.clicks += 1;
        break;
      case 'purchase':
        current.conversions += 1;
        if (event.revenue) {
          current.revenue += event.revenue;
        }
        if (event.commission) {
          current.commission += event.commission;
        }
        break;
    }

    current.conversionRate = current.views > 0 ? (current.conversions / current.views) * 100 : 0;
    current.averageOrderValue = current.conversions > 0 ? current.revenue / current.conversions : 0;
    current.lastUpdated = new Date();

    this.productPerformance.set(event.asin, current);
  }

  private updateUserJourney(event: ConversionEvent): void {
    const journeyKey = `${event.userId || 'anonymous'}_${event.sessionId}`;
    const current = this.userJourneys.get(journeyKey) || {
      userId: event.userId || 'anonymous',
      sessionId: event.sessionId,
      startTime: event.timestamp,
      events: [],
      totalRevenue: 0,
      conversionPath: []
    };

    current.events.push(event);
    
    if (event.revenue) {
      current.totalRevenue += event.revenue;
    }

    if (event.eventType === 'purchase') {
      current.endTime = event.timestamp;
      current.timeToConversion = current.endTime.getTime() - current.startTime.getTime();
    }

    // Actualizar path de conversión
    if (!current.conversionPath.includes(event.asin)) {
      current.conversionPath.push(event.asin);
    }

    this.userJourneys.set(journeyKey, current);
  }

  private getTopProducts(events: ConversionEvent[]): Array<{
    asin: string;
    title: string;
    views: number;
    clicks: number;
    conversions: number;
    revenue: number;
  }> {
    const productStats = new Map<string, {
      title: string;
      views: number;
      clicks: number;
      conversions: number;
      revenue: number;
    }>();

    for (const event of events) {
      const current = productStats.get(event.asin) || {
        title: event.productTitle,
        views: 0,
        clicks: 0,
        conversions: 0,
        revenue: 0
      };

      switch (event.eventType) {
        case 'view':
          current.views += 1;
          break;
        case 'click':
          current.clicks += 1;
          break;
        case 'purchase':
          current.conversions += 1;
          if (event.revenue) {
            current.revenue += event.revenue;
          }
          break;
      }

      productStats.set(event.asin, current);
    }

    return Array.from(productStats.entries())
      .map(([asin, stats]) => ({ asin, ...stats }))
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 10);
  }

  private getTopCategories(events: ConversionEvent[]): Array<{
    category: string;
    views: number;
    clicks: number;
    conversions: number;
    revenue: number;
  }> {
    const categoryStats = new Map<string, {
      views: number;
      clicks: number;
      conversions: number;
      revenue: number;
    }>();

    for (const event of events) {
      const category = 'nautical'; // Por defecto
      const current = categoryStats.get(category) || {
        views: 0,
        clicks: 0,
        conversions: 0,
        revenue: 0
      };

      switch (event.eventType) {
        case 'view':
          current.views += 1;
          break;
        case 'click':
          current.clicks += 1;
          break;
        case 'purchase':
          current.conversions += 1;
          if (event.revenue) {
            current.revenue += event.revenue;
          }
          break;
      }

      categoryStats.set(category, current);
    }

    return Array.from(categoryStats.entries())
      .map(([category, stats]) => ({ category, ...stats }))
      .sort((a, b) => b.revenue - a.revenue);
  }

  private getPerformanceBySource(events: ConversionEvent[]): Array<{
    source: string;
    views: number;
    clicks: number;
    conversions: number;
    conversionRate: number;
  }> {
    const sourceStats = new Map<string, {
      views: number;
      clicks: number;
      conversions: number;
    }>();

    for (const event of events) {
      const current = sourceStats.get(event.source) || {
        views: 0,
        clicks: 0,
        conversions: 0
      };

      switch (event.eventType) {
        case 'view':
          current.views += 1;
          break;
        case 'click':
          current.clicks += 1;
          break;
        case 'purchase':
          current.conversions += 1;
          break;
      }

      sourceStats.set(event.source, current);
    }

    return Array.from(sourceStats.entries())
      .map(([source, stats]) => ({
        source,
        ...stats,
        conversionRate: stats.views > 0 ? (stats.conversions / stats.views) * 100 : 0
      }))
      .sort((a, b) => b.conversionRate - a.conversionRate);
  }
}

export const amazonAnalytics = new AmazonAnalytics();

// Funciones helper
export const trackEvent = (event: Omit<ConversionEvent, 'id' | 'timestamp'>) =>
  amazonAnalytics.trackEvent(event);
export const getAnalyticsSummary = (startDate: Date, endDate: Date) =>
  amazonAnalytics.getAnalyticsSummary(startDate, endDate);
export const getProductPerformance = (asin?: string, limit?: number) =>
  amazonAnalytics.getProductPerformance(asin, limit);
export const getUserJourney = (userId: string, sessionId?: string) =>
  amazonAnalytics.getUserJourney(userId, sessionId);
export const getBestConvertingProducts = (limit?: number) =>
  amazonAnalytics.getBestConvertingProducts(limit);
export const getTopRevenueProducts = (limit?: number) =>
  amazonAnalytics.getTopRevenueProducts(limit);
export const getCohortAnalysis = (startDate: Date, endDate: Date, cohortSize?: 'day' | 'week' | 'month') =>
  amazonAnalytics.getCohortAnalysis(startDate, endDate, cohortSize);
export const getFunnelAnalysis = (startDate: Date, endDate: Date) =>
  amazonAnalytics.getFunnelAnalysis(startDate, endDate);
export const getCampaignROI = (startDate: Date, endDate: Date) =>
  amazonAnalytics.getCampaignROI(startDate, endDate); 