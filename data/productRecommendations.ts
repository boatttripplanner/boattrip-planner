// data/productRecommendations.ts
// Mapeo de productos recomendados por categoría/tag para automatización

import { AMAZON_AFFILIATE_TAG } from '../constants';

// Función para crear URLs de búsqueda directa en Amazon.es
const createSearchUrl = (searchTerm: string, source: string = 'blog', campaign: string = 'recommendations'): string => {
  const encodedTerm = encodeURIComponent(searchTerm);
  return `https://www.amazon.es/s?k=${encodedTerm}&tag=${AMAZON_AFFILIATE_TAG}`;
};

interface ProductRecommendation {
  searchTerm: string;
  title: string;
  imageUrl: string;
  price: string;
  affiliateUrl: string;
  category: string;
}

interface ProductRecommendationsMap {
  [key: string]: ProductRecommendation[];
}

export const PRODUCT_RECOMMENDATIONS: ProductRecommendationsMap = {
  snorkel: [
    {
      searchTerm: 'protector solar resistente agua',
      title: 'Protector Solar Resistente al Agua',
      imageUrl: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=300&fit=crop&crop=center',
      price: 'Desde 12.99€',
      affiliateUrl: createSearchUrl('protector solar resistente agua', 'blog', 'protector-solar'),
      category: 'protección solar'
    },
    {
      searchTerm: 'chaleco salvavidas homologado',
      title: 'Chaleco Salvavidas Homologado',
      imageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&h=300&fit=crop&crop=center',
      price: 'Desde 45.99€',
      affiliateUrl: createSearchUrl('chaleco salvavidas homologado', 'blog', 'chaleco-salvavidas'),
      category: 'seguridad'
    },
    {
      searchTerm: 'aletas snorkel cressi',
      title: 'Equipo de Snorkel Cressi',
      imageUrl: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400&h=300&fit=crop&crop=center',
      price: 'Desde 24.99€',
      affiliateUrl: createSearchUrl('aletas snorkel cressi', 'blog', 'aletas-snorkel'),
      category: 'equipo snorkel'
    },
  ],
  gps: [
    {
      searchTerm: 'garmin fenix 7',
      title: 'Garmin fēnix 7 - Smartwatch GPS',
      imageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&h=300&fit=crop&crop=center',
      price: 'Desde 699.99€',
      affiliateUrl: createSearchUrl('garmin fenix 7', 'blog', 'gps-garmin'),
      category: 'gps navegación'
    },
  ],
  tecnologia: [
    {
      searchTerm: 'gopro hero 11',
      title: 'GoPro HERO11 Black',
      imageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&h=300&fit=crop&crop=center',
      price: 'Desde 399.99€',
      affiliateUrl: createSearchUrl('gopro hero 11', 'blog', 'gopro-camera'),
      category: 'tecnología'
    },
  ],
  nevera: [
    {
      searchTerm: 'nevera portatil coleman',
      title: 'Nevera Portátil Coleman',
      imageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&h=300&fit=crop&crop=center',
      price: 'Desde 89.99€',
      affiliateUrl: createSearchUrl('nevera portatil coleman', 'blog', 'nevera-coleman'),
      category: 'nevera cooler'
    },
  ],
  botiquin: [
    {
      searchTerm: 'botiquin primeros auxilios',
      title: 'Botiquín Primeros Auxilios',
      imageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&h=300&fit=crop&crop=center',
      price: 'Desde 29.99€',
      affiliateUrl: createSearchUrl('botiquin primeros auxilios', 'blog', 'botiquin-emergencia'),
      category: 'botiquín'
    },
  ],
  gafas: [
    {
      searchTerm: 'gafas sol polarizadas',
      title: 'Gafas de Sol Polarizadas',
      imageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&h=300&fit=crop&crop=center',
      price: 'Desde 19.99€',
      affiliateUrl: createSearchUrl('gafas sol polarizadas', 'blog', 'gafas-polarizadas'),
      category: 'gafas sol'
    },
  ],
  deportes: [
    {
      searchTerm: 'equipo deportes acuaticos',
      title: 'Equipo Deportes Acuáticos',
      imageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&h=300&fit=crop&crop=center',
      price: 'Desde 49.99€',
      affiliateUrl: createSearchUrl('equipo deportes acuaticos', 'blog', 'deportes-acuaticos'),
      category: 'deportes acuáticos'
    },
  ],
  ropa: [
    {
      searchTerm: 'ropa nautica',
      title: 'Ropa Náutica y Accesorios',
      imageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&h=300&fit=crop&crop=center',
      price: 'Desde 39.99€',
      affiliateUrl: createSearchUrl('ropa nautica', 'blog', 'ropa-nautica'),
      category: 'ropa accesorios'
    },
  ],
  comida: [
    {
      searchTerm: 'comida barco conservas',
      title: 'Comida y Bebidas para Barco',
      imageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&h=300&fit=crop&crop=center',
      price: 'Desde 15.99€',
      affiliateUrl: createSearchUrl('comida barco conservas', 'blog', 'comida-barco'),
      category: 'comida bebidas'
    },
  ],
  limpieza: [
    {
      searchTerm: 'productos limpieza barco',
      title: 'Productos Limpieza Barco',
      imageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&h=300&fit=crop&crop=center',
      price: 'Desde 9.99€',
      affiliateUrl: createSearchUrl('productos limpieza barco', 'blog', 'limpieza-barco'),
      category: 'limpieza'
    },
  ],
  documentacion: [
    {
      searchTerm: 'documentacion nautica',
      title: 'Documentación Náutica',
      imageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&h=300&fit=crop&crop=center',
      price: 'Desde 19.99€',
      affiliateUrl: createSearchUrl('documentacion nautica', 'blog', 'documentacion-nautica'),
      category: 'documentación'
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
  // Eliminar duplicados por searchTerm
  return Array.from(new Map(products.map(p => [p.searchTerm, p])).values());
}