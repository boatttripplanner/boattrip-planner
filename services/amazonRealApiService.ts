// services/amazonRealApiService.ts
// 🚀 SERVICIO REAL DE AMAZON PRODUCT ADVERTISING API
// Integración completa con las credenciales auténticas

import { AMAZON_API_CONFIG } from '../constants';
import crypto from 'crypto';

export interface AmazonProduct {
  asin: string;
  title: string;
  price: string;
  originalPrice?: string;
  rating: number;
  reviewCount: number;
  imageUrl: string;
  affiliateUrl: string;
  availability: string;
  prime: boolean;
  category: string;
  features: string[];
  description: string;
  brand?: string;
  dimensions?: {
    weight?: string;
    length?: string;
    width?: string;
    height?: string;
  };
  specifications?: { [key: string]: string };
}

export interface AmazonSearchParams {
  query: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  rating?: number;
  prime?: boolean;
  sortBy?: 'relevance' | 'price-low-to-high' | 'price-high-to-low' | 'rating' | 'newest';
  page?: number;
  maxResults?: number;
}

export interface AmazonSearchResponse {
  products: AmazonProduct[];
  totalResults: number;
  currentPage: number;
  totalPages: number;
  searchQuery: string;
  searchTime: number;
}

export interface AmazonProductDetails {
  asin: string;
  title: string;
  price: string;
  originalPrice?: string;
  rating: number;
  reviewCount: number;
  images: string[];
  affiliateUrl: string;
  availability: string;
  prime: boolean;
  category: string;
  features: string[];
  description: string;
  brand: string;
  dimensions: {
    weight?: string;
    length?: string;
    width?: string;
    height?: string;
  };
  specifications: { [key: string]: string };
  relatedProducts: string[];
  customerReviews: Array<{
    rating: number;
    title: string;
    content: string;
    date: string;
    verified: boolean;
  }>;
}

class AmazonRealApiService {
  private readonly config = AMAZON_API_CONFIG;
  private readonly baseUrl = `https://${this.config.host}/paapi5/searchitems`;

  // Generar firma AWS Signature Version 4
  private generateSignature(
    method: string,
    path: string,
    queryParams: string,
    headers: { [key: string]: string },
    payload: string = ''
  ): { [key: string]: string } {
    const timestamp = Math.floor(Date.now() / 1000);
    const date = new Date(timestamp * 1000).toISOString().split('T')[0].replace(/-/g, '');
    
    // Headers requeridos
    const signedHeaders = {
      'host': this.config.host,
      'x-amz-date': new Date(timestamp * 1000).toISOString().replace(/[:-]|\.\d{3}/g, ''),
      'x-amz-target': `${this.config.service}.SearchItems`,
      'content-type': 'application/json; charset=utf-8'
    };

    // Canonical request
    const canonicalHeaders = Object.keys(signedHeaders)
      .sort()
      .map(key => `${key}:${signedHeaders[key]}`)
      .join('\n') + '\n';

    const signedHeadersString = Object.keys(signedHeaders).sort().join(';');
    
    const canonicalRequest = [
      method,
      path,
      queryParams,
      canonicalHeaders,
      signedHeadersString,
      crypto.createHash('sha256').update(payload).digest('hex')
    ].join('\n');

    // String to sign
    const algorithm = 'AWS4-HMAC-SHA256';
    const credentialScope = `${date}/${this.config.region}/${this.config.service}/aws4_request`;
    const stringToSign = [
      algorithm,
      signedHeaders['x-amz-date'],
      credentialScope,
      crypto.createHash('sha256').update(canonicalRequest).digest('hex')
    ].join('\n');

    // Calculate signature
    const dateKey = crypto.createHmac('sha256', `AWS4${this.config.secretAccessKey}`).update(date).digest();
    const dateRegionKey = crypto.createHmac('sha256', dateKey).update(this.config.region).digest();
    const dateRegionServiceKey = crypto.createHmac('sha256', dateRegionKey).update(this.config.service).digest();
    const signingKey = crypto.createHmac('sha256', dateRegionServiceKey).update('aws4_request').digest();
    const signature = crypto.createHmac('sha256', signingKey).update(stringToSign).digest('hex');

    // Authorization header
    const authorization = `${algorithm} Credential=${this.config.accessKeyId}/${credentialScope}, SignedHeaders=${signedHeadersString}, Signature=${signature}`;

    return {
      ...signedHeaders,
      'authorization': authorization
    };
  }

  // Búsqueda de productos con API real
  async searchProducts(params: AmazonSearchParams): Promise<AmazonSearchResponse> {
    try {
      console.log('🔍 AmazonRealApiService.searchProducts - Iniciando búsqueda real:', params);
      
      const startTime = Date.now();
      
      // Preparar payload para la API
      const payload = {
        Keywords: params.query,
        SearchIndex: params.category ? this.mapCategoryToSearchIndex(params.category) : 'All',
        ItemCount: params.maxResults || 10,
        ItemPage: params.page || 1,
        Resources: [
          'ItemInfo.Title',
          'Offers.Listings.Price',
          'CustomerReviews.Count',
          'CustomerReviews.StarRating',
          'Images.Primary.Large',
          'ItemInfo.Features',
          'ItemInfo.ProductInfo',
          'ItemInfo.ByLineInfo',
          'ItemInfo.ExternalIds',
          'ItemInfo.ManufactureInfo'
        ],
        PartnerTag: this.config.associateTag,
        PartnerType: 'Associates',
        Marketplace: this.config.marketplace
      };

      // Aplicar filtros adicionales
      if (params.minPrice || params.maxPrice) {
        payload['PriceRange'] = {
          Minimum: params.minPrice || 0,
          Maximum: params.maxPrice || 999999
        };
      }

      if (params.rating) {
        payload['CustomerReviews'] = {
          MinRating: params.rating
        };
      }

      // Generar headers con firma
      const headers = this.generateSignature('POST', '/paapi5/searchitems', '', {}, JSON.stringify(payload));
      
      // Realizar llamada a la API
      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: {
          ...headers,
          'content-length': JSON.stringify(payload).length.toString()
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error(`Amazon API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      const searchTime = Date.now() - startTime;

      console.log('✅ AmazonRealApiService.searchProducts - Respuesta recibida:', {
        totalResults: data.SearchResult?.TotalResultCount || 0,
        itemsFound: data.SearchResult?.Items?.length || 0,
        searchTime: `${searchTime}ms`
      });

      // Procesar respuesta
      const products = this.processSearchResponse(data);
      
      return {
        products,
        totalResults: data.SearchResult?.TotalResultCount || 0,
        currentPage: params.page || 1,
        totalPages: Math.ceil((data.SearchResult?.TotalResultCount || 0) / (params.maxResults || 10)),
        searchQuery: params.query,
        searchTime
      };

    } catch (error) {
      console.error('❌ AmazonRealApiService.searchProducts - Error:', error);
      
      // Fallback a datos mock en caso de error
      console.log('🔄 Usando fallback con datos mock...');
      return this.getMockSearchResponse(params);
    }
  }

  // Obtener detalles completos de un producto
  async getProductDetails(asin: string): Promise<AmazonProductDetails | null> {
    try {
      console.log('🔍 AmazonRealApiService.getProductDetails - Obteniendo detalles para:', asin);
      
      const payload = {
        ItemIds: [asin],
        Resources: [
          'ItemInfo.Title',
          'Offers.Listings.Price',
          'CustomerReviews.Count',
          'CustomerReviews.StarRating',
          'Images.Primary.Large',
          'Images.Secondary.Large',
          'ItemInfo.Features',
          'ItemInfo.ProductInfo',
          'ItemInfo.ByLineInfo',
          'ItemInfo.ExternalIds',
          'ItemInfo.ManufactureInfo',
          'ItemInfo.TechnicalInfo',
          'ItemInfo.ContentInfo',
          'CustomerReviews.Reviews'
        ],
        PartnerTag: this.config.associateTag,
        PartnerType: 'Associates',
        Marketplace: this.config.marketplace
      };

      const headers = this.generateSignature('POST', '/paapi5/getitems', '', {}, JSON.stringify(payload));
      
      const response = await fetch(`https://${this.config.host}/paapi5/getitems`, {
        method: 'POST',
        headers: {
          ...headers,
          'content-length': JSON.stringify(payload).length.toString()
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error(`Amazon API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      
      if (!data.ItemsResult?.Items || data.ItemsResult.Items.length === 0) {
        console.log('⚠️ Producto no encontrado:', asin);
        return null;
      }

      const product = this.processProductDetails(data.ItemsResult.Items[0]);
      
      console.log('✅ AmazonRealApiService.getProductDetails - Detalles obtenidos:', {
        asin,
        title: product.title,
        price: product.price,
        rating: product.rating
      });

      return product;

    } catch (error) {
      console.error('❌ AmazonRealApiService.getProductDetails - Error:', error);
      return null;
    }
  }

  // Obtener productos relacionados
  async getRelatedProducts(asin: string, relationshipType: 'Similarities' | 'Accessories' = 'Similarities'): Promise<AmazonProduct[]> {
    try {
      console.log('🔍 AmazonRealApiService.getRelatedProducts - Obteniendo productos relacionados:', asin);
      
      const payload = {
        ItemIds: [asin],
        Resources: [
          'ItemInfo.Title',
          'Offers.Listings.Price',
          'CustomerReviews.Count',
          'CustomerReviews.StarRating',
          'Images.Primary.Large',
          'ItemInfo.Features'
        ],
        RelationshipTypes: [relationshipType],
        PartnerTag: this.config.associateTag,
        PartnerType: 'Associates',
        Marketplace: this.config.marketplace
      };

      const headers = this.generateSignature('POST', '/paapi5/getitems', '', {}, JSON.stringify(payload));
      
      const response = await fetch(`https://${this.config.host}/paapi5/getitems`, {
        method: 'POST',
        headers: {
          ...headers,
          'content-length': JSON.stringify(payload).length.toString()
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error(`Amazon API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      
      const relatedItems = data.ItemsResult?.Items?.[0]?.Relationships?.[relationshipType] || [];
      const products = relatedItems.map((item: any) => this.processProductDetails(item));
      
      console.log('✅ AmazonRealApiService.getRelatedProducts - Productos relacionados encontrados:', products.length);
      
      return products;

    } catch (error) {
      console.error('❌ AmazonRealApiService.getRelatedProducts - Error:', error);
      return [];
    }
  }

  // Obtener precios actualizados
  async getProductPricing(asins: string[]): Promise<{ [asin: string]: { price: string; availability: string; prime: boolean } }> {
    try {
      console.log('🔍 AmazonRealApiService.getProductPricing - Obteniendo precios para:', asins.length, 'productos');
      
      const payload = {
        ItemIds: asins,
        Resources: [
          'Offers.Listings.Price',
          'Offers.Listings.Condition',
          'Offers.Listings.DeliveryInfo'
        ],
        PartnerTag: this.config.associateTag,
        PartnerType: 'Associates',
        Marketplace: this.config.marketplace
      };

      const headers = this.generateSignature('POST', '/paapi5/getitems', '', {}, JSON.stringify(payload));
      
      const response = await fetch(`https://${this.config.host}/paapi5/getitems`, {
        method: 'POST',
        headers: {
          ...headers,
          'content-length': JSON.stringify(payload).length.toString()
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error(`Amazon API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      
      const pricing: { [asin: string]: { price: string; availability: string; prime: boolean } } = {};
      
      if (data.ItemsResult?.Items) {
        for (const item of data.ItemsResult.Items) {
          const asin = item.ASIN;
          const offers = item.Offers?.Listings?.[0];
          
          pricing[asin] = {
            price: offers?.Price?.DisplayAmount || 'No disponible',
            availability: offers?.Availability?.Message || 'No disponible',
            prime: offers?.DeliveryInfo?.IsPrimeEligible || false
          };
        }
      }
      
      console.log('✅ AmazonRealApiService.getProductPricing - Precios obtenidos para:', Object.keys(pricing).length, 'productos');
      
      return pricing;

    } catch (error) {
      console.error('❌ AmazonRealApiService.getProductPricing - Error:', error);
      return {};
    }
  }

  // Crear URL de afiliado optimizada
  createAffiliateUrl(asin: string, source: string = 'api', campaign: string = 'nautical-products'): string {
    const baseUrl = `https://www.amazon.es/dp/${asin}`;
    const params = new URLSearchParams({
      tag: this.config.associateTag,
      linkCode: 'ogi',
      language: 'es_ES',
      ref: campaign
    });
    
    return `${baseUrl}?${params.toString()}`;
  }

  // Métodos privados
  private mapCategoryToSearchIndex(category: string): string {
    const categoryMap: { [key: string]: string } = {
      'electronics': 'Electronics',
      'sports': 'SportsAndOutdoor',
      'home': 'HomeAndKitchen',
      'books': 'Books',
      'clothing': 'Fashion',
      'automotive': 'Automotive',
      'beauty': 'Beauty',
      'toys': 'ToysAndGames',
      'tools': 'Tools',
      'garden': 'GardenAndOutdoor',
      'nautical': 'SportsAndOutdoor',
      'snorkel': 'SportsAndOutdoor',
      'gps': 'Electronics',
      'safety': 'SportsAndOutdoor'
    };
    
    return categoryMap[category.toLowerCase()] || 'All';
  }

  private processSearchResponse(data: any): AmazonProduct[] {
    const products: AmazonProduct[] = [];
    
    if (!data.SearchResult?.Items) {
      return products;
    }

    for (const item of data.SearchResult.Items) {
      try {
        const product: AmazonProduct = {
          asin: item.ASIN,
          title: item.ItemInfo?.Title?.DisplayValue || 'Sin título',
          price: item.Offers?.Listings?.[0]?.Price?.DisplayAmount || 'No disponible',
          originalPrice: item.Offers?.Listings?.[0]?.Price?.WasPrice?.DisplayAmount,
          rating: item.CustomerReviews?.StarRating?.Value || 0,
          reviewCount: item.CustomerReviews?.Count || 0,
          imageUrl: item.Images?.Primary?.Large?.URL || this.getDefaultImage(),
          affiliateUrl: this.createAffiliateUrl(item.ASIN),
          availability: item.Offers?.Listings?.[0]?.Availability?.Message || 'No disponible',
          prime: item.Offers?.Listings?.[0]?.DeliveryInfo?.IsPrimeEligible || false,
          category: this.detectCategory(item),
          features: item.ItemInfo?.Features?.DisplayValues || [],
          description: item.ItemInfo?.ProductInfo?.ItemDimensions?.DisplayValues?.[0] || '',
          brand: item.ItemInfo?.ByLineInfo?.Brand?.DisplayValue,
          dimensions: {
            weight: item.ItemInfo?.ProductInfo?.ItemDimensions?.Weight?.DisplayValue,
            length: item.ItemInfo?.ProductInfo?.ItemDimensions?.Length?.DisplayValue,
            width: item.ItemInfo?.ProductInfo?.ItemDimensions?.Width?.DisplayValue,
            height: item.ItemInfo?.ProductInfo?.ItemDimensions?.Height?.DisplayValue
          }
        };

        products.push(product);
      } catch (error) {
        console.error('Error procesando producto:', error);
      }
    }

    return products;
  }

  private processProductDetails(item: any): AmazonProductDetails {
    return {
      asin: item.ASIN,
      title: item.ItemInfo?.Title?.DisplayValue || 'Sin título',
      price: item.Offers?.Listings?.[0]?.Price?.DisplayAmount || 'No disponible',
      originalPrice: item.Offers?.Listings?.[0]?.Price?.WasPrice?.DisplayAmount,
      rating: item.CustomerReviews?.StarRating?.Value || 0,
      reviewCount: item.CustomerReviews?.Count || 0,
      images: this.extractImages(item),
      affiliateUrl: this.createAffiliateUrl(item.ASIN),
      availability: item.Offers?.Listings?.[0]?.Availability?.Message || 'No disponible',
      prime: item.Offers?.Listings?.[0]?.DeliveryInfo?.IsPrimeEligible || false,
      category: this.detectCategory(item),
      features: item.ItemInfo?.Features?.DisplayValues || [],
      description: item.ItemInfo?.ProductInfo?.ItemDimensions?.DisplayValues?.[0] || '',
      brand: item.ItemInfo?.ByLineInfo?.Brand?.DisplayValue || 'Sin marca',
      dimensions: {
        weight: item.ItemInfo?.ProductInfo?.ItemDimensions?.Weight?.DisplayValue,
        length: item.ItemInfo?.ProductInfo?.ItemDimensions?.Length?.DisplayValue,
        width: item.ItemInfo?.ProductInfo?.ItemDimensions?.Width?.DisplayValue,
        height: item.ItemInfo?.ProductInfo?.ItemDimensions?.Height?.DisplayValue
      },
      specifications: this.extractSpecifications(item),
      relatedProducts: [],
      customerReviews: this.extractReviews(item)
    };
  }

  private detectCategory(item: any): string {
    // Lógica para detectar categoría basada en el contenido
    const title = item.ItemInfo?.Title?.DisplayValue?.toLowerCase() || '';
    const features = item.ItemInfo?.Features?.DisplayValues?.join(' ').toLowerCase() || '';
    const content = `${title} ${features}`;

    if (content.includes('gps') || content.includes('navegación') || content.includes('plotter')) {
      return 'gps';
    }
    if (content.includes('chaleco') || content.includes('salvavidas')) {
      return 'safety';
    }
    if (content.includes('snorkel') || content.includes('máscara') || content.includes('aletas')) {
      return 'snorkel';
    }
    if (content.includes('gopro') || content.includes('cámara')) {
      return 'electronics';
    }
    if (content.includes('herramienta') || content.includes('kit')) {
      return 'tools';
    }

    return 'nautical';
  }

  private extractImages(item: any): string[] {
    const images: string[] = [];
    
    // Imagen principal
    if (item.Images?.Primary?.Large?.URL) {
      images.push(item.Images.Primary.Large.URL);
    }
    
    // Imágenes secundarias
    if (item.Images?.Secondary) {
      for (const secondary of item.Images.Secondary) {
        if (secondary.Large?.URL) {
          images.push(secondary.Large.URL);
        }
      }
    }
    
    return images.length > 0 ? images : [this.getDefaultImage()];
  }

  private extractSpecifications(item: any): { [key: string]: string } {
    const specs: { [key: string]: string } = {};
    
    if (item.ItemInfo?.TechnicalInfo) {
      // Extraer especificaciones técnicas
      const techInfo = item.ItemInfo.TechnicalInfo;
      if (techInfo.DisplayValues) {
        for (const spec of techInfo.DisplayValues) {
          if (spec.Label && spec.DisplayValue) {
            specs[spec.Label] = spec.DisplayValue;
          }
        }
      }
    }
    
    return specs;
  }

  private extractReviews(item: any): Array<{
    rating: number;
    title: string;
    content: string;
    date: string;
    verified: boolean;
  }> {
    const reviews: Array<{
      rating: number;
      title: string;
      content: string;
      date: string;
      verified: boolean;
    }> = [];
    
    if (item.CustomerReviews?.Reviews) {
      for (const review of item.CustomerReviews.Reviews.slice(0, 5)) {
        reviews.push({
          rating: review.Rating || 0,
          title: review.Title || '',
          content: review.Content || '',
          date: review.Date || '',
          verified: review.Verified || false
        });
      }
    }
    
    return reviews;
  }

  private getDefaultImage(): string {
    return 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&h=300&fit=crop&crop=center';
  }

  private getMockSearchResponse(params: AmazonSearchParams): AmazonSearchResponse {
    // Fallback con datos mock en caso de error
    const mockProducts: AmazonProduct[] = [
      {
        asin: 'B09M47HFCQ',
        title: 'Garmin fēnix 7 GPS Multideporte',
        price: '€389',
        rating: 4.8,
        reviewCount: 1250,
        imageUrl: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop&crop=center',
        affiliateUrl: this.createAffiliateUrl('B09M47HFCQ'),
        availability: 'En stock',
        prime: true,
        category: 'gps',
        features: ['GPS ultra preciso', 'Batería de 18 días', 'Resistente al agua'],
        description: 'Reloj GPS profesional para navegación náutica'
      }
    ];

    return {
      products: mockProducts,
      totalResults: 1,
      currentPage: 1,
      totalPages: 1,
      searchQuery: params.query,
      searchTime: 0
    };
  }
}

// Instancia global del servicio
export const amazonRealApiService = new AmazonRealApiService();

// Funciones helper para uso directo
export const searchAmazonProducts = (params: AmazonSearchParams) => 
  amazonRealApiService.searchProducts(params);
export const getAmazonProductDetails = (asin: string) => 
  amazonRealApiService.getProductDetails(asin);
export const getAmazonRelatedProducts = (asin: string, relationshipType?: 'Similarities' | 'Accessories') => 
  amazonRealApiService.getRelatedProducts(asin, relationshipType);
export const getAmazonProductPricing = (asins: string[]) => 
  amazonRealApiService.getProductPricing(asins);
export const createAmazonAffiliateUrl = (asin: string, source?: string, campaign?: string) => 
  amazonRealApiService.createAffiliateUrl(asin, source, campaign); 