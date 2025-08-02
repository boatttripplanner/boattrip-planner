// data/productRecommendations.ts
// Mapeo de productos recomendados por categoría/tag para automatización

import { AMAZON_AFFILIATE_TAG } from '../constants';

// Función para crear enlaces de afiliados monetizables
const createAffiliateUrl = (asin: string, source: string = 'blog', campaign: string = 'recommendations'): string => {
  const baseUrl = `https://www.amazon.es/dp/${asin}`;
  const params = new URLSearchParams({
    tag: AMAZON_AFFILIATE_TAG,
    linkCode: 'ogi',
    language: 'es_ES',
    ref: source,
    utm_source: 'boattrip-planner',
    utm_medium: 'blog',
    utm_campaign: campaign,
    utm_content: asin
  });
  
  return `${baseUrl}?${params.toString()}`;
};

interface ProductRecommendation {
  asin: string;
  title: string;
  imageUrl: string;
  price: string;
  affiliateUrl: string;
}

interface ProductRecommendationsMap {
  [key: string]: ProductRecommendation[];
}

export const PRODUCT_RECOMMENDATIONS: ProductRecommendationsMap = {
  snorkel: [
    {
      asin: 'B07C2VJ7QK',
      title: 'Cressi Palau Short Fin - Aletas de Snorkel',
      imageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop&crop=center',
      price: '29.99',
      affiliateUrl: createAffiliateUrl('B07C2VJ7QK', 'blog', 'snorkel-fins'),
    },
    {
      asin: 'B08N5WRWNW',
      title: 'Cressi Supernova - Tubo de Snorkel',
      imageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop&crop=center',
      price: '19.99',
      affiliateUrl: createAffiliateUrl('B08N5WRWNW', 'blog', 'snorkel-tube'),
    },
    {
      asin: 'B00J5F4LXS',
      title: 'Cressi F1 - Máscara de Snorkel',
      imageUrl: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400&h=300&fit=crop&crop=center',
      price: '24.99',
      affiliateUrl: createAffiliateUrl('B00J5F4LXS', 'blog', 'snorkel-mask'),
    },
  ],
  gps: [
    {
      asin: 'B01N5IB20Q',
      title: 'Garmin Striker 4 - GPS Náutico',
      imageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&h=300&fit=crop&crop=center',
      price: '199.99',
      affiliateUrl: createAffiliateUrl('B01N5IB20Q', 'blog', 'gps-nautical'),
    },
  ],
  // Puedes añadir más categorías y productos aquí
};

export function getRecommendedProductsForEntry(tags: string[]): ProductRecommendation[] {
  const products: ProductRecommendation[] = [];
  tags.forEach(tag => {
    if (PRODUCT_RECOMMENDATIONS[tag]) {
      products.push(...PRODUCT_RECOMMENDATIONS[tag]);
    }
  });
  // Eliminar duplicados por ASIN
  return Array.from(new Map(products.map(p => [p.asin, p])).values());
}