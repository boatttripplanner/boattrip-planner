// Configuración de la API de Amazon Product Advertising
export const AMAZON_API_CONFIG = {
  ACCESS_KEY: import.meta.env.VITE_AMAZON_ACCESS_KEY || '',
  SECRET_KEY: import.meta.env.VITE_AMAZON_SECRET_KEY || '',
  ASSOCIATE_TAG: import.meta.env.VITE_AMAZON_ASSOCIATE_TAG || 'explorashop18-21',
  REGION: 'eu-west-1',
  MARKETPLACE: 'ES',
  HOST: 'webservices.amazon.es'
};

// Endpoints de la API
export const AMAZON_API_ENDPOINTS = {
  SEARCH_ITEMS: 'https://webservices.amazon.es/paapi5/searchitems',
  GET_ITEMS: 'https://webservices.amazon.es/paapi5/getitems'
};

// Parámetros de búsqueda por defecto
export const DEFAULT_SEARCH_PARAMS = {
  Keywords: '',
  SearchIndex: 'All',
  ItemCount: 10,
  Resources: [
    'Images.Primary.Medium',
    'ItemInfo.Title',
    'Offers.Listings.Price',
    'CustomerReviews.Count',
    'CustomerReviews.StarRating'
  ].join(','),
  PartnerTag: 'explorashop18-21',
  PartnerType: 'Associates',
  Marketplace: 'www.amazon.es'
};

// Interfaz para productos de Amazon
export interface AmazonProductItem {
  ASIN: string;
  Title: string;
  DetailPageURL: string;
  Images?: {
    Primary?: {
      Medium?: {
        URL: string;
        Height: number;
        Width: number;
      };
    };
  };
  Offers?: {
    Listings?: Array<{
      Price: {
        DisplayAmount: string;
        Amount: number;
        Currency: string;
      };
      Availability: {
        Message: string;
        Type: string;
      };
    }>;
  };
  CustomerReviews?: {
    Count?: number;
    StarRating?: {
      Value: number;
    };
  };
}

export interface AmazonProductResponse {
  SearchResult: {
    TotalResultCount: number;
    Items: AmazonProductItem[];
  };
  SearchRefinements?: any[];
}

// Función para generar firma de la API (simplificada para demo)
export const generateSignature = (params: any): string => {
  // En producción, aquí se implementaría la firma real de AWS
  return 'demo-signature';
};

// Función para construir URL de producto con affiliate tag
export const buildProductUrl = (asin: string, associateTag: string = 'explorashop18-21'): string => {
  return `https://www.amazon.es/dp/${asin}?tag=${associateTag}`;
};
