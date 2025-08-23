// services/amazonProductVerifier.ts
import { searchRealAmazonProducts, AmazonRealProduct } from './amazonRealApi';

export interface VerifiedProduct {
  asin: string;
  title: string;
  price: number;
  rating: number;
  reviewCount: number;
  availability: boolean;
  affiliateUrl: string;
  category: string;
  keywords: string[];
  isVerified: boolean;
}

export interface ProductVerificationResult {
  originalProduct?: VerifiedProduct;
  alternativeProducts: VerifiedProduct[];
  bestAlternative?: VerifiedProduct;
  searchQuery: string;
  category: string;
}

export class AmazonProductVerifier {
  private affiliateTag = "explorashop18-21";
  private verifiedProductsCache = new Map<string, VerifiedProduct>();
  private cacheExpiry = 24 * 60 * 60 * 1000; // 24 horas

  /**
   * Verifica si un producto específico está disponible
   */
  async verifyProductAvailability(asin: string): Promise<VerifiedProduct | null> {
    try {
      console.log(`🔍 Verificando disponibilidad del producto: ${asin}`);
      
      // Verificar cache primero
      const cached = this.verifiedProductsCache.get(asin);
      if (cached && Date.now() - cached.lastVerified < this.cacheExpiry) {
        console.log(`✅ Producto encontrado en cache: ${asin}`);
        return cached;
      }

      // Buscar el producto específico por ASIN
      const searchResult = await searchRealAmazonProducts({
        query: asin,
        category: 'nautical',
        sortBy: 'relevance'
      });

      const product = searchResult.products.find(p => p.asin === asin);
      
      if (product && product.availability) {
        const verifiedProduct: VerifiedProduct = {
          asin: product.asin,
          title: product.title,
          price: product.price,
          rating: product.rating,
          reviewCount: product.reviewCount,
          availability: true,
          affiliateUrl: this.generateAffiliateUrl(product.asin),
          category: this.determineCategory(product.title),
          keywords: this.extractKeywords(product.title),
          isVerified: true,
          lastVerified: Date.now()
        };

        // Guardar en cache
        this.verifiedProductsCache.set(asin, verifiedProduct);
        console.log(`✅ Producto verificado y disponible: ${product.title}`);
        return verifiedProduct;
      }

      console.log(`❌ Producto no disponible o descatalogado: ${asin}`);
      return null;

    } catch (error) {
      console.error(`Error verificando producto ${asin}:`, error);
      return null;
    }
  }

  /**
   * Encuentra productos alternativos cuando el original no está disponible
   */
  async findAlternativeProducts(
    originalQuery: string, 
    category: string = 'nautical',
    maxAlternatives: number = 5
  ): Promise<ProductVerificationResult> {
    try {
      console.log(`🔍 Buscando alternativas para: "${originalQuery}"`);
      
      // Buscar productos relacionados
      const searchResult = await searchRealAmazonProducts({
        query: originalQuery,
        category: category,
        sortBy: 'rating',
        maxResults: maxAlternatives * 2 // Buscar más para filtrar
      });

      const alternativeProducts: VerifiedProduct[] = searchResult.products
        .filter(product => product.availability && product.rating >= 4.0)
        .slice(0, maxAlternatives)
        .map(product => ({
          asin: product.asin,
          title: product.title,
          price: product.price,
          rating: product.rating,
          reviewCount: product.reviewCount,
          availability: true,
          affiliateUrl: this.generateAffiliateUrl(product.asin),
          category: this.determineCategory(product.title),
          keywords: this.extractKeywords(product.title),
          isVerified: true,
          lastVerified: Date.now()
        }));

      const bestAlternative = alternativeProducts.length > 0 
        ? alternativeProducts.reduce((best, current) => 
            current.rating > best.rating ? current : best
          )
        : undefined;

      console.log(`✅ Encontradas ${alternativeProducts.length} alternativas para "${originalQuery}"`);

      return {
        alternativeProducts,
        bestAlternative,
        searchQuery: originalQuery,
        category
      };

    } catch (error) {
      console.error(`Error buscando alternativas para "${originalQuery}":`, error);
      return {
        alternativeProducts: [],
        searchQuery: originalQuery,
        category
      };
    }
  }

  /**
   * Verifica y actualiza la base de datos de productos recomendados
   */
  async verifyRecommendedProducts(): Promise<Map<string, VerifiedProduct>> {
    console.log('🔄 Verificando base de datos de productos recomendados...');
    
    const recommendedProducts = new Map<string, VerifiedProduct>();
    
    // Lista de productos clave a verificar
    const keyProducts = [
      { query: 'protector solar spf50+', category: 'protección solar' },
      { query: 'equipo snorkel completo', category: 'equipo snorkel' },
      { query: 'chaleco salvavidas homologado', category: 'seguridad' },
      { query: 'gps navegación náutica', category: 'navegación' },
      { query: 'cámara acción gopro', category: 'tecnología' },
      { query: 'nevera portátil barco', category: 'comodidad' },
      { query: 'botiquín primeros auxilios', category: 'seguridad' },
      { query: 'gafas sol polarizadas', category: 'accesorios' }
    ];

    for (const product of keyProducts) {
      try {
        const alternatives = await this.findAlternativeProducts(
          product.query, 
          product.category,
          3
        );

        if (alternatives.bestAlternative) {
          recommendedProducts.set(product.category, alternatives.bestAlternative);
          console.log(`✅ Producto verificado para ${product.category}: ${alternatives.bestAlternative.title}`);
        }
      } catch (error) {
        console.error(`Error verificando ${product.category}:`, error);
      }
    }

    console.log(`✅ Verificación completada. ${recommendedProducts.size} productos verificados.`);
    return recommendedProducts;
  }

  /**
   * Genera enlace de afiliado optimizado
   */
  private generateAffiliateUrl(asin: string): string {
    const utmParams = `utm_source=boattrip-planner&utm_medium=affiliate&utm_campaign=nautical_guide&utm_content=verified_product`;
    return `https://www.amazon.es/dp/${asin}?tag=${this.affiliateTag}&linkCode=ogi&th=1&psc=1&ref_=as_li_ss_tl&camp=3638&creative=24630&creativeASIN=${asin}&linkId=nautical_guide_verified_${asin}&${utmParams}`;
  }

  /**
   * Determina la categoría del producto basándose en el título
   */
  private determineCategory(title: string): string {
    const lowerTitle = title.toLowerCase();
    
    if (lowerTitle.includes('solar') || lowerTitle.includes('protector') || lowerTitle.includes('spf')) {
      return 'protección solar';
    }
    if (lowerTitle.includes('snorkel') || lowerTitle.includes('buceo') || lowerTitle.includes('aletas')) {
      return 'equipo snorkel';
    }
    if (lowerTitle.includes('chaleco') || lowerTitle.includes('salvavidas') || lowerTitle.includes('seguridad')) {
      return 'seguridad';
    }
    if (lowerTitle.includes('gps') || lowerTitle.includes('garmin') || lowerTitle.includes('navegación')) {
      return 'navegación';
    }
    if (lowerTitle.includes('cámara') || lowerTitle.includes('gopro') || lowerTitle.includes('fotos')) {
      return 'tecnología';
    }
    if (lowerTitle.includes('nevera') || lowerTitle.includes('cooler') || lowerTitle.includes('hielo')) {
      return 'comodidad';
    }
    if (lowerTitle.includes('botiquín') || lowerTitle.includes('primeros auxilios')) {
      return 'seguridad';
    }
    if (lowerTitle.includes('gafas') || lowerTitle.includes('polarizadas')) {
      return 'accesorios';
    }
    
    return 'general';
  }

  /**
   * Extrae palabras clave del título del producto
   */
  private extractKeywords(title: string): string[] {
    const stopWords = ['el', 'la', 'de', 'del', 'para', 'con', 'por', 'un', 'una', 'y', 'o', 'en', 'es', 'son', 'se', 'que', 'como', 'muy', 'más', 'menos', 'gran', 'pequeño', 'nuevo', 'viejo', 'bueno', 'malo'];
    
    return title
      .toLowerCase()
      .replace(/[^\w\s]/g, ' ')
      .split(/\s+/)
      .filter(word => word.length > 2 && !stopWords.includes(word))
      .slice(0, 5); // Máximo 5 palabras clave
  }

  /**
   * Limpia el cache expirado
   */
  cleanExpiredCache(): void {
    const now = Date.now();
    for (const [asin, product] of this.verifiedProductsCache.entries()) {
      if (now - product.lastVerified > this.cacheExpiry) {
        this.verifiedProductsCache.delete(asin);
      }
    }
    console.log('🧹 Cache limpiado');
  }
}

export const amazonProductVerifier = new AmazonProductVerifier();
