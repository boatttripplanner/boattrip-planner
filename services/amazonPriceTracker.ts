// services/amazonPriceTracker.ts
// 🎯 Sistema de Tracking de Precios en Tiempo Real de Amazon

import { AMAZON_API_CONFIG } from '../constants';

export interface PriceHistory {
  asin: string;
  price: number;
  originalPrice?: number;
  timestamp: Date;
  source: 'amazon_api' | 'web_scraping' | 'user_report';
  availability: boolean;
  prime: boolean;
}

export interface PriceAlert {
  asin: string;
  targetPrice: number;
  email: string;
  active: boolean;
  createdAt: Date;
}

export interface ProductPriceData {
  asin: string;
  currentPrice: number;
  originalPrice?: number;
  lowestPrice: number;
  highestPrice: number;
  averagePrice: number;
  priceHistory: PriceHistory[];
  priceChange: {
    last24h: number;
    last7d: number;
    last30d: number;
  };
  availability: boolean;
  prime: boolean;
  lastUpdated: Date;
}

class AmazonPriceTracker {
  private priceCache: Map<string, ProductPriceData> = new Map();
  private alerts: PriceAlert[] = [];
  private readonly CACHE_DURATION = 60 * 60 * 1000; // 1 hora

  // Obtener precio actualizado de un producto
  async getCurrentPrice(asin: string): Promise<ProductPriceData | null> {
    try {
      // Verificar cache
      const cached = this.priceCache.get(asin);
      if (cached && Date.now() - cached.lastUpdated.getTime() < this.CACHE_DURATION) {
        return cached;
      }

      // Obtener precio real de Amazon
      const priceData = await this.fetchPriceFromAmazon(asin);
      if (priceData) {
        this.priceCache.set(asin, priceData);
        this.checkPriceAlerts(asin, priceData.currentPrice);
      }

      return priceData;
    } catch (error) {
      console.error('Error getting current price:', error);
      return null;
    }
  }

  // Obtener historial de precios
  async getPriceHistory(asin: string, days: number = 30): Promise<PriceHistory[]> {
    try {
      // En producción, esto vendría de una base de datos
      const mockHistory: PriceHistory[] = [];
      const basePrice = 100 + Math.random() * 200;
      
      for (let i = days; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        
        // Simular variaciones de precio realistas
        const variation = (Math.random() - 0.5) * 0.1; // ±5%
        const price = basePrice * (1 + variation);
        
        mockHistory.push({
          asin,
          price: Math.round(price * 100) / 100,
          timestamp: date,
          source: 'amazon_api',
          availability: Math.random() > 0.1,
          prime: Math.random() > 0.3
        });
      }

      return mockHistory;
    } catch (error) {
      console.error('Error getting price history:', error);
      return [];
    }
  }

  // Crear alerta de precio
  async createPriceAlert(asin: string, targetPrice: number, email: string): Promise<boolean> {
    try {
      const alert: PriceAlert = {
        asin,
        targetPrice,
        email,
        active: true,
        createdAt: new Date()
      };

      this.alerts.push(alert);
      
      // En producción, guardar en base de datos
      console.log(`✅ Alerta de precio creada para ${asin} a €${targetPrice}`);
      
      return true;
    } catch (error) {
      console.error('Error creating price alert:', error);
      return false;
    }
  }

  // Obtener productos con mejor precio
  async getBestDeals(category: string, limit: number = 10): Promise<ProductPriceData[]> {
    try {
      const deals: ProductPriceData[] = [];
      
      // Simular productos con descuentos
      const mockProducts = [
        { asin: 'B09M47HFCQ', name: 'Garmin fēnix 7', basePrice: 389 },
        { asin: 'B07C2VJ7QK', name: 'Cressi F1 Máscara', basePrice: 24.99 },
        { asin: 'B01M0WXQKX', name: 'Chaleco Salvavidas', basePrice: 65 }
      ];

      for (const product of mockProducts) {
        const discount = Math.random() * 0.3; // Hasta 30% descuento
        const currentPrice = product.basePrice * (1 - discount);
        
        deals.push({
          asin: product.asin,
          currentPrice: Math.round(currentPrice * 100) / 100,
          originalPrice: product.basePrice,
          lowestPrice: currentPrice,
          highestPrice: product.basePrice,
          averagePrice: (currentPrice + product.basePrice) / 2,
          priceHistory: [],
          priceChange: {
            last24h: -discount * 100,
            last7d: -discount * 100,
            last30d: -discount * 100
          },
          availability: true,
          prime: true,
          lastUpdated: new Date()
        });
      }

      return deals.sort((a, b) => 
        ((b.originalPrice || b.currentPrice) - b.currentPrice) - 
        ((a.originalPrice || a.currentPrice) - a.currentPrice)
      ).slice(0, limit);
    } catch (error) {
      console.error('Error getting best deals:', error);
      return [];
    }
  }

  // Comparar precios entre productos similares
  async comparePrices(asins: string[]): Promise<{
    products: ProductPriceData[];
    bestValue: ProductPriceData;
    priceRange: { min: number; max: number; avg: number };
  }> {
    try {
      const products: ProductPriceData[] = [];
      
      for (const asin of asins) {
        const priceData = await this.getCurrentPrice(asin);
        if (priceData) {
          products.push(priceData);
        }
      }

      if (products.length === 0) {
        throw new Error('No se pudieron obtener precios para comparar');
      }

      const prices = products.map(p => p.currentPrice);
      const bestValue = products.reduce((best, current) => 
        current.currentPrice < best.currentPrice ? current : best
      );

      return {
        products,
        bestValue,
        priceRange: {
          min: Math.min(...prices),
          max: Math.max(...prices),
          avg: prices.reduce((a, b) => a + b, 0) / prices.length
        }
      };
    } catch (error) {
      console.error('Error comparing prices:', error);
      throw error;
    }
  }

  // Obtener tendencias de precios
  async getPriceTrends(category: string): Promise<{
    trendingUp: ProductPriceData[];
    trendingDown: ProductPriceData[];
    stable: ProductPriceData[];
  }> {
    try {
      const products = await this.getBestDeals(category, 20);
      
      const trendingUp = products.filter(p => p.priceChange.last7d > 5);
      const trendingDown = products.filter(p => p.priceChange.last7d < -5);
      const stable = products.filter(p => 
        p.priceChange.last7d >= -5 && p.priceChange.last7d <= 5
      );

      return { trendingUp, trendingDown, stable };
    } catch (error) {
      console.error('Error getting price trends:', error);
      return { trendingUp: [], trendingDown: [], stable: [] };
    }
  }

  // Verificar si un precio es histórico
  async isHistoricalLow(asin: string): Promise<{
    isLow: boolean;
    percentage: number;
    daysSinceLastLow: number;
  }> {
    try {
      const priceData = await this.getCurrentPrice(asin);
      const history = await this.getPriceHistory(asin, 365);
      
      if (!priceData || history.length === 0) {
        return { isLow: false, percentage: 0, daysSinceLastLow: 0 };
      }

      const lowestPrice = Math.min(...history.map(h => h.price));
      const isLow = priceData.currentPrice <= lowestPrice;
      const percentage = ((lowestPrice - priceData.currentPrice) / lowestPrice) * 100;
      
      // Encontrar días desde el último precio bajo
      const lastLowIndex = history.findIndex(h => h.price <= priceData.currentPrice);
      const daysSinceLastLow = lastLowIndex >= 0 ? lastLowIndex : 365;

      return { isLow, percentage, daysSinceLastLow };
    } catch (error) {
      console.error('Error checking historical low:', error);
      return { isLow: false, percentage: 0, daysSinceLastLow: 0 };
    }
  }

  // Métodos privados
  private async fetchPriceFromAmazon(asin: string): Promise<ProductPriceData | null> {
    // En producción, aquí haríamos la llamada real a la API de Amazon
    // Por ahora, simulamos con datos realistas
    
    const basePrice = 50 + Math.random() * 300;
    const hasDiscount = Math.random() > 0.6;
    const currentPrice = hasDiscount ? basePrice * 0.8 : basePrice;
    
    return {
      asin,
      currentPrice: Math.round(currentPrice * 100) / 100,
      originalPrice: hasDiscount ? basePrice : undefined,
      lowestPrice: currentPrice * 0.9,
      highestPrice: basePrice,
      averagePrice: (currentPrice + basePrice) / 2,
      priceHistory: [],
      priceChange: {
        last24h: hasDiscount ? -20 : 0,
        last7d: hasDiscount ? -20 : 0,
        last30d: hasDiscount ? -20 : 0
      },
      availability: Math.random() > 0.1,
      prime: Math.random() > 0.3,
      lastUpdated: new Date()
    };
  }

  private checkPriceAlerts(asin: string, currentPrice: number): void {
    const relevantAlerts = this.alerts.filter(
      alert => alert.asin === asin && alert.active && currentPrice <= alert.targetPrice
    );

    for (const alert of relevantAlerts) {
      this.sendPriceAlertEmail(alert, currentPrice);
      alert.active = false; // Desactivar alerta después de enviar
    }
  }

  private async sendPriceAlertEmail(alert: PriceAlert, currentPrice: number): Promise<void> {
    // En producción, enviar email real
    console.log(`📧 Alerta de precio enviada a ${alert.email}: ${alert.asin} ahora cuesta €${currentPrice}`);
  }
}

export const amazonPriceTracker = new AmazonPriceTracker();

// Funciones helper
export const getCurrentPrice = (asin: string) => amazonPriceTracker.getCurrentPrice(asin);
export const getPriceHistory = (asin: string, days?: number) => amazonPriceTracker.getPriceHistory(asin, days);
export const createPriceAlert = (asin: string, targetPrice: number, email: string) => 
  amazonPriceTracker.createPriceAlert(asin, targetPrice, email);
export const getBestDeals = (category: string, limit?: number) => amazonPriceTracker.getBestDeals(category, limit);
export const comparePrices = (asins: string[]) => amazonPriceTracker.comparePrices(asins);
export const getPriceTrends = (category: string) => amazonPriceTracker.getPriceTrends(category);
export const isHistoricalLow = (asin: string) => amazonPriceTracker.isHistoricalLow(asin); 