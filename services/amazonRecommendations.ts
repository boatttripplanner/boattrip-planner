// services/amazonRecommendations.ts
// 🧠 Sistema de Recomendaciones Inteligentes para Amazon

import { AMAZON_API_CONFIG } from '../constants';

export interface UserProfile {
  userId: string;
  preferences: {
    categories: string[];
    priceRange: { min: number; max: number };
    brands: string[];
    features: string[];
    experienceLevel: 'beginner' | 'intermediate' | 'expert';
  };
  behavior: {
    viewedProducts: string[];
    purchasedProducts: string[];
    searchHistory: string[];
    timeSpent: { [category: string]: number };
  };
  demographics: {
    age?: number;
    location?: string;
    boatType?: string;
    sailingExperience?: number;
  };
}

export interface ProductRecommendation {
  asin: string;
  title: string;
  score: number;
  reason: string;
  category: string;
  price: number;
  imageUrl: string;
  affiliateUrl: string;
  matchFactors: {
    categoryMatch: number;
    priceMatch: number;
    brandMatch: number;
    featureMatch: number;
    popularityMatch: number;
  };
}

export interface RecommendationContext {
  currentProduct?: string;
  userProfile?: UserProfile;
  searchQuery?: string;
  category?: string;
  priceRange?: { min: number; max: number };
  season?: 'spring' | 'summer' | 'autumn' | 'winter';
  location?: string;
}

class AmazonRecommendations {
  private userProfiles: Map<string, UserProfile> = new Map();
  private productDatabase: Map<string, any> = new Map();
  private seasonalProducts: Map<string, string[]> = new Map();

  constructor() {
    this.initializeSeasonalProducts();
    this.initializeProductDatabase();
  }

  // Obtener recomendaciones personalizadas
  async getPersonalizedRecommendations(
    userId: string, 
    context: RecommendationContext = {},
    limit: number = 10
  ): Promise<ProductRecommendation[]> {
    try {
      const userProfile = this.userProfiles.get(userId) || this.createDefaultProfile(userId);
      const recommendations: ProductRecommendation[] = [];

      // Obtener productos candidatos
      const candidates = await this.getCandidateProducts(context);
      
      // Calcular scores para cada candidato
      for (const product of candidates) {
        const score = this.calculateRecommendationScore(product, userProfile, context);
        
        if (score > 0.3) { // Solo productos con score mínimo
          recommendations.push({
            ...product,
            score,
            reason: this.generateRecommendationReason(product, userProfile, context),
            matchFactors: this.calculateMatchFactors(product, userProfile, context)
          });
        }
      }

      // Ordenar por score y limitar resultados
      return recommendations
        .sort((a, b) => b.score - a.score)
        .slice(0, limit);
    } catch (error) {
      console.error('Error getting personalized recommendations:', error);
      return [];
    }
  }

  // Obtener recomendaciones basadas en producto actual
  async getProductBasedRecommendations(
    asin: string, 
    limit: number = 8
  ): Promise<ProductRecommendation[]> {
    try {
      const currentProduct = this.productDatabase.get(asin);
      if (!currentProduct) {
        return [];
      }

      const recommendations: ProductRecommendation[] = [];
      
      // 1. Productos complementarios
      const complementary = this.findComplementaryProducts(currentProduct);
      recommendations.push(...complementary);

      // 2. Productos de la misma categoría
      const sameCategory = this.findSameCategoryProducts(currentProduct);
      recommendations.push(...sameCategory);

      // 3. Productos de marcas relacionadas
      const sameBrand = this.findSameBrandProducts(currentProduct);
      recommendations.push(...sameBrand);

      // Eliminar duplicados y ordenar
      const uniqueRecommendations = this.removeDuplicates(recommendations);
      return uniqueRecommendations
        .sort((a, b) => b.score - a.score)
        .slice(0, limit);
    } catch (error) {
      console.error('Error getting product-based recommendations:', error);
      return [];
    }
  }

  // Obtener recomendaciones para principiantes
  async getBeginnerRecommendations(
    category: string = 'nautical',
    limit: number = 10
  ): Promise<ProductRecommendation[]> {
    try {
      const beginnerProducts = [
        {
          asin: 'B07C2VJ7QK',
          title: 'Cressi F1 - Máscara de Snorkel (Principiante)',
          category: 'snorkel',
          price: 24.99,
          score: 0.95,
          reason: 'Perfecta para principiantes - fácil de usar y ajustar',
          imageUrl: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=300&fit=crop&crop=center',
          affiliateUrl: `https://www.amazon.es/dp/B07C2VJ7QK?tag=${AMAZON_API_CONFIG.associateTag}`
        },
        {
          asin: 'B01M0WXQKX',
          title: 'Chaleco Salvavidas Básico (Obligatorio)',
          category: 'safety',
          price: 45.99,
          score: 0.98,
          reason: 'Equipamiento de seguridad esencial para cualquier navegante',
          imageUrl: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=300&fit=crop&crop=center',
          affiliateUrl: `https://www.amazon.es/dp/B01M0WXQKX?tag=${AMAZON_API_CONFIG.associateTag}`
        },
        {
          asin: 'B08XQRZQRF',
          title: 'Protector Solar Resistente al Agua SPF 50',
          category: 'protection',
          price: 12.99,
          score: 0.92,
          reason: 'Protección solar esencial para actividades acuáticas',
          imageUrl: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=300&fit=crop&crop=center',
          affiliateUrl: `https://www.amazon.es/dp/B08XQRZQRF?tag=${AMAZON_API_CONFIG.associateTag}`
        }
      ];

      return beginnerProducts
        .filter(p => category === 'nautical' || p.category === category)
        .slice(0, limit);
    } catch (error) {
      console.error('Error getting beginner recommendations:', error);
      return [];
    }
  }

  // Obtener recomendaciones estacionales
  async getSeasonalRecommendations(
    season: 'spring' | 'summer' | 'autumn' | 'winter',
    limit: number = 10
  ): Promise<ProductRecommendation[]> {
    try {
      const seasonalProducts = this.seasonalProducts.get(season) || [];
      const recommendations: ProductRecommendation[] = [];

      for (const asin of seasonalProducts.slice(0, limit)) {
        const product = this.productDatabase.get(asin);
        if (product) {
          recommendations.push({
            ...product,
            score: 0.85 + Math.random() * 0.1,
            reason: `Producto ideal para ${this.getSeasonName(season)}`,
            matchFactors: {
              categoryMatch: 0.9,
              priceMatch: 0.8,
              brandMatch: 0.7,
              featureMatch: 0.85,
              popularityMatch: 0.8
            }
          });
        }
      }

      return recommendations.sort((a, b) => b.score - a.score);
    } catch (error) {
      console.error('Error getting seasonal recommendations:', error);
      return [];
    }
  }

  // Obtener recomendaciones de ofertas especiales
  async getDealRecommendations(
    category: string = 'nautical',
    minDiscount: number = 20,
    limit: number = 10
  ): Promise<ProductRecommendation[]> {
    try {
      const deals: ProductRecommendation[] = [];
      
      // Simular productos con descuentos
      const dealProducts = [
        {
          asin: 'B09M47HFCQ',
          title: 'Garmin fēnix 7 - 25% Descuento',
          category: 'gps',
          price: 291.75,
          originalPrice: 389,
          discount: 25,
          score: 0.95,
          reason: 'Oferta especial - 25% de descuento en GPS premium',
          imageUrl: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop&crop=center',
          affiliateUrl: `https://www.amazon.es/dp/B09M47HFCQ?tag=${AMAZON_API_CONFIG.associateTag}`
        },
        {
          asin: 'B07C2VFINS',
          title: 'Cressi Aletas - 30% Descuento',
          category: 'snorkel',
          price: 20.99,
          originalPrice: 29.99,
          discount: 30,
          score: 0.88,
          reason: 'Gran oferta en equipamiento de snorkel',
          imageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop&crop=center',
          affiliateUrl: `https://www.amazon.es/dp/B07C2VFINS?tag=${AMAZON_API_CONFIG.associateTag}`
        }
      ];

      return dealProducts
        .filter(p => p.discount >= minDiscount && (category === 'nautical' || p.category === category))
        .slice(0, limit);
    } catch (error) {
      console.error('Error getting deal recommendations:', error);
      return [];
    }
  }

  // Actualizar perfil de usuario
  async updateUserProfile(userId: string, updates: Partial<UserProfile>): Promise<void> {
    try {
      const currentProfile = this.userProfiles.get(userId) || this.createDefaultProfile(userId);
      const updatedProfile = { ...currentProfile, ...updates };
      
      this.userProfiles.set(userId, updatedProfile);
      console.log(`✅ Perfil actualizado para usuario ${userId}`);
    } catch (error) {
      console.error('Error updating user profile:', error);
    }
  }

  // Registrar comportamiento del usuario
  async recordUserBehavior(
    userId: string, 
    action: 'view' | 'purchase' | 'search',
    data: { asin?: string; query?: string; category?: string; timeSpent?: number }
  ): Promise<void> {
    try {
      const profile = this.userProfiles.get(userId) || this.createDefaultProfile(userId);
      
      switch (action) {
        case 'view':
          if (data.asin) {
            profile.behavior.viewedProducts.push(data.asin);
            // Mantener solo los últimos 50 productos vistos
            profile.behavior.viewedProducts = profile.behavior.viewedProducts.slice(-50);
          }
          break;
        case 'purchase':
          if (data.asin) {
            profile.behavior.purchasedProducts.push(data.asin);
            // Mantener solo los últimos 20 productos comprados
            profile.behavior.purchasedProducts = profile.behavior.purchasedProducts.slice(-20);
          }
          break;
        case 'search':
          if (data.query) {
            profile.behavior.searchHistory.push(data.query);
            // Mantener solo las últimas 30 búsquedas
            profile.behavior.searchHistory = profile.behavior.searchHistory.slice(-30);
          }
          break;
      }

      if (data.category && data.timeSpent) {
        profile.behavior.timeSpent[data.category] = 
          (profile.behavior.timeSpent[data.category] || 0) + data.timeSpent;
      }

      this.userProfiles.set(userId, profile);
    } catch (error) {
      console.error('Error recording user behavior:', error);
    }
  }

  // Métodos privados
  private createDefaultProfile(userId: string): UserProfile {
    return {
      userId,
      preferences: {
        categories: ['nautical'],
        priceRange: { min: 10, max: 500 },
        brands: [],
        features: [],
        experienceLevel: 'beginner'
      },
      behavior: {
        viewedProducts: [],
        purchasedProducts: [],
        searchHistory: [],
        timeSpent: {}
      },
      demographics: {}
    };
  }

  private async getCandidateProducts(context: RecommendationContext): Promise<any[]> {
    // En producción, esto vendría de la base de datos de productos
    const candidates = Array.from(this.productDatabase.values());
    
    // Filtrar por contexto
    if (context.category) {
      return candidates.filter(p => p.category === context.category);
    }
    
    if (context.priceRange) {
      return candidates.filter(p => 
        p.price >= context.priceRange!.min && p.price <= context.priceRange!.max
      );
    }
    
    return candidates;
  }

  private calculateRecommendationScore(
    product: any, 
    userProfile: UserProfile, 
    context: RecommendationContext
  ): number {
    let score = 0;
    
    // Match de categoría
    if (userProfile.preferences.categories.includes(product.category)) {
      score += 0.3;
    }
    
    // Match de precio
    if (product.price >= userProfile.preferences.priceRange.min && 
        product.price <= userProfile.preferences.priceRange.max) {
      score += 0.25;
    }
    
    // Match de marca
    if (userProfile.preferences.brands.includes(product.brand)) {
      score += 0.2;
    }
    
    // Popularidad
    score += Math.min(product.popularity || 0, 0.15);
    
    // Factores contextuales
    if (context.season && this.isSeasonalProduct(product, context.season)) {
      score += 0.1;
    }
    
    return Math.min(score, 1);
  }

  private generateRecommendationReason(
    product: any, 
    userProfile: UserProfile, 
    context: RecommendationContext
  ): string {
    const reasons = [];
    
    if (userProfile.preferences.categories.includes(product.category)) {
      reasons.push('Basado en tus categorías favoritas');
    }
    
    if (product.price <= userProfile.preferences.priceRange.max) {
      reasons.push('Dentro de tu rango de precio');
    }
    
    if (context.season && this.isSeasonalProduct(product, context.season)) {
      reasons.push(`Ideal para ${this.getSeasonName(context.season)}`);
    }
    
    if (userProfile.behavior.purchasedProducts.includes(product.asin)) {
      reasons.push('Ya has comprado productos similares');
    }
    
    return reasons.length > 0 ? reasons.join(', ') : 'Recomendado para ti';
  }

  private calculateMatchFactors(
    product: any, 
    userProfile: UserProfile, 
    context: RecommendationContext
  ): any {
    return {
      categoryMatch: userProfile.preferences.categories.includes(product.category) ? 0.9 : 0.3,
      priceMatch: product.price >= userProfile.preferences.priceRange.min && 
                  product.price <= userProfile.preferences.priceRange.max ? 0.8 : 0.4,
      brandMatch: userProfile.preferences.brands.includes(product.brand) ? 0.9 : 0.5,
      featureMatch: 0.7, // Basado en features del producto
      popularityMatch: Math.min(product.popularity || 0.5, 0.9)
    };
  }

  private findComplementaryProducts(product: any): ProductRecommendation[] {
    // Lógica para encontrar productos complementarios
    const complementaryMap: { [key: string]: string[] } = {
      'snorkel': ['B07C2VFINS', 'B08N5WRTUB'], // Aletas y tubo
      'gps': ['B01M0WXQKX', 'B08XQRZQRF'], // Chaleco y protector solar
      'safety': ['B07C2VJ7QK', 'B08XQRZQRF'] // Máscara y protector solar
    };
    
    const complementaryAsins = complementaryMap[product.category] || [];
    const recommendations: ProductRecommendation[] = [];
    
    for (const asin of complementaryAsins) {
      const compProduct = this.productDatabase.get(asin);
      if (compProduct) {
        recommendations.push({
          ...compProduct,
          score: 0.85,
          reason: 'Producto complementario ideal',
          matchFactors: {
            categoryMatch: 0.8,
            priceMatch: 0.7,
            brandMatch: 0.6,
            featureMatch: 0.9,
            popularityMatch: 0.7
          }
        });
      }
    }
    
    return recommendations;
  }

  private findSameCategoryProducts(product: any): ProductRecommendation[] {
    const sameCategory = Array.from(this.productDatabase.values())
      .filter(p => p.category === product.category && p.asin !== product.asin)
      .slice(0, 3);
    
    return sameCategory.map(p => ({
      ...p,
      score: 0.75,
      reason: 'Producto similar en la misma categoría',
      matchFactors: {
        categoryMatch: 1.0,
        priceMatch: 0.6,
        brandMatch: 0.5,
        featureMatch: 0.7,
        popularityMatch: 0.6
      }
    }));
  }

  private findSameBrandProducts(product: any): ProductRecommendation[] {
    const sameBrand = Array.from(this.productDatabase.values())
      .filter(p => p.brand === product.brand && p.asin !== product.asin)
      .slice(0, 2);
    
    return sameBrand.map(p => ({
      ...p,
      score: 0.8,
      reason: 'Otro producto de la misma marca',
      matchFactors: {
        categoryMatch: 0.6,
        priceMatch: 0.7,
        brandMatch: 1.0,
        featureMatch: 0.6,
        popularityMatch: 0.7
      }
    }));
  }

  private removeDuplicates(recommendations: ProductRecommendation[]): ProductRecommendation[] {
    const seen = new Set();
    return recommendations.filter(rec => {
      if (seen.has(rec.asin)) {
        return false;
      }
      seen.add(rec.asin);
      return true;
    });
  }

  private isSeasonalProduct(product: any, season: string): boolean {
    const seasonalCategories: { [key: string]: string[] } = {
      'summer': ['snorkel', 'protection', 'comfort'],
      'winter': ['safety', 'gps', 'technology'],
      'spring': ['snorkel', 'safety', 'comfort'],
      'autumn': ['safety', 'gps', 'technology']
    };
    
    return seasonalCategories[season]?.includes(product.category) || false;
  }

  private getSeasonName(season: string): string {
    const seasonNames: { [key: string]: string } = {
      'spring': 'primavera',
      'summer': 'verano',
      'autumn': 'otoño',
      'winter': 'invierno'
    };
    
    return seasonNames[season] || season;
  }

  private initializeSeasonalProducts(): void {
    this.seasonalProducts.set('summer', [
      'B07C2VJ7QK', 'B07C2VFINS', 'B08XQRZQRF', 'B0BC2VJ7QK'
    ]);
    this.seasonalProducts.set('winter', [
      'B09M47HFCQ', 'B01M0WXQKX', 'B0AC2VJ7QK'
    ]);
    this.seasonalProducts.set('spring', [
      'B07C2VJ7QK', 'B01M0WXQKX', 'B0CC2VJ7QK'
    ]);
    this.seasonalProducts.set('autumn', [
      'B09M47HFCQ', 'B01M0WXQKX', 'B0DC2VJ7QK'
    ]);
  }

  private initializeProductDatabase(): void {
    // Base de datos de productos para recomendaciones
    const products = [
      {
        asin: 'B07C2VJ7QK',
        title: 'Cressi F1 - Máscara de Snorkel',
        category: 'snorkel',
        brand: 'Cressi',
        price: 24.99,
        popularity: 0.9,
        imageUrl: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400&h=300&fit=crop&crop=center',
        affiliateUrl: `https://www.amazon.es/dp/B07C2VJ7QK?tag=${AMAZON_API_CONFIG.associateTag}`
      },
      {
        asin: 'B09M47HFCQ',
        title: 'Garmin fēnix 7 - GPS Multideporte',
        category: 'gps',
        brand: 'Garmin',
        price: 389,
        popularity: 0.95,
        imageUrl: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop&crop=center',
        affiliateUrl: `https://www.amazon.es/dp/B09M47HFCQ?tag=${AMAZON_API_CONFIG.associateTag}`
      },
      {
        asin: 'B01M0WXQKX',
        title: 'Chaleco Salvavidas Homologado',
        category: 'safety',
        brand: 'Crewsaver',
        price: 65,
        popularity: 0.88,
        imageUrl: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400&h=300&fit=crop&crop=center',
        affiliateUrl: `https://www.amazon.es/dp/B01M0WXQKX?tag=${AMAZON_API_CONFIG.associateTag}`
      }
    ];

    for (const product of products) {
      this.productDatabase.set(product.asin, product);
    }
  }
}

export const amazonRecommendations = new AmazonRecommendations();

// Funciones helper
export const getPersonalizedRecommendations = (userId: string, context?: RecommendationContext, limit?: number) =>
  amazonRecommendations.getPersonalizedRecommendations(userId, context, limit);
export const getProductBasedRecommendations = (asin: string, limit?: number) =>
  amazonRecommendations.getProductBasedRecommendations(asin, limit);
export const getBeginnerRecommendations = (category?: string, limit?: number) =>
  amazonRecommendations.getBeginnerRecommendations(category, limit);
export const getSeasonalRecommendations = (season: 'spring' | 'summer' | 'autumn' | 'winter', limit?: number) =>
  amazonRecommendations.getSeasonalRecommendations(season, limit);
export const getDealRecommendations = (category?: string, minDiscount?: number, limit?: number) =>
  amazonRecommendations.getDealRecommendations(category, minDiscount, limit);
export const updateUserProfile = (userId: string, updates: Partial<UserProfile>) =>
  amazonRecommendations.updateUserProfile(userId, updates);
export const recordUserBehavior = (userId: string, action: 'view' | 'purchase' | 'search', data: any) =>
  amazonRecommendations.recordUserBehavior(userId, action, data); 