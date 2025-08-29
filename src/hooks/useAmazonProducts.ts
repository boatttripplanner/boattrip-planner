import { useState, useEffect, useCallback } from 'react';
import { AMAZON_API_CONFIG, AMAZON_API_ENDPOINTS, DEFAULT_SEARCH_PARAMS, AmazonProductResponse, AmazonProductItem } from '../config/amazonApi';

interface UseAmazonProductsReturn {
  products: AmazonProductItem[];
  loading: boolean;
  error: string | null;
  searchProducts: (keywords: string, category?: string) => Promise<void>;
  clearProducts: () => void;
}

export const useAmazonProducts = (): UseAmazonProductsReturn => {
  const [products, setProducts] = useState<AmazonProductItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const searchProducts = useCallback(async (keywords: string, category?: string) => {
    if (!AMAZON_API_CONFIG.ACCESS_KEY || !AMAZON_API_CONFIG.SECRET_KEY) {
      setError('Credenciales de Amazon API no configuradas');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // En un entorno real, aquí se haría la llamada a la API de Amazon
      // Por ahora, simulamos productos reales para mascotas náuticas
      const mockProducts: AmazonProductItem[] = [
        {
          ASIN: 'B08N5XQZ9K',
          Title: 'Chaleco Salvavidas para Perros - Tamaño M (15-25kg) - Flotabilidad Certificada',
          DetailPageURL: `https://www.amazon.es/dp/B08N5XQZ9K?tag=${AMAZON_API_CONFIG.ASSOCIATE_TAG}`,
          Offers: {
            Listings: [{
              Price: {
                DisplayAmount: '29,99€',
                Amount: 29.99,
                Currency: 'EUR'
              },
              Availability: {
                Message: 'En stock',
                Type: 'In Stock'
              }
            }]
          },
          CustomerReviews: {
            Count: 1247,
            StarRating: { Value: 4.5 }
          }
        },
        {
          ASIN: 'B09M8KQZ9L',
          Title: 'Chaleco Salvavidas para Perros Grandes - Tamaño L (25-40kg) - Material Resistente',
          DetailPageURL: `https://www.amazon.es/dp/B09M8KQZ9L?tag=${AMAZON_API_CONFIG.ASSOCIATE_TAG}`,
          Offers: {
            Listings: [{
              Price: {
                DisplayAmount: '34,99€',
                Amount: 34.99,
                Currency: 'EUR'
              },
              Availability: {
                Message: 'En stock',
                Type: 'In Stock'
              }
            }]
          },
          CustomerReviews: {
            Count: 892,
            StarRating: { Value: 4.3 }
          }
        },
        {
          ASIN: 'B07P8KQZ9M',
          Title: 'Kit de Emergencia Veterinario Náutico - Vendajes, Antisépticos, Tijeras',
          DetailPageURL: `https://www.amazon.es/dp/B07P8KQZ9M?tag=${AMAZON_API_CONFIG.ASSOCIATE_TAG}`,
          Offers: {
            Listings: [{
              Price: {
                DisplayAmount: '45,99€',
                Amount: 45.99,
                Currency: 'EUR'
              },
              Availability: {
                Message: 'En stock',
                Type: 'In Stock'
              }
            }]
          },
          CustomerReviews: {
            Count: 567,
            StarRating: { Value: 4.7 }
          }
        },
        {
          ASIN: 'B06N8KQZ9N',
          Title: 'Transportín Plegable para Barcos - Resistente al Agua, Fácil Almacenamiento',
          DetailPageURL: `https://www.amazon.es/dp/B06N8KQZ9N?tag=${AMAZON_API_CONFIG.ASSOCIATE_TAG}`,
          Offers: {
            Listings: [{
              Price: {
                DisplayAmount: '39,99€',
                Amount: 39.99,
                Currency: 'EUR'
              },
              Availability: {
                Message: 'En stock',
                Type: 'In Stock'
              }
            }]
          },
          CustomerReviews: {
            Count: 423,
            StarRating: { Value: 4.2 }
          }
        },
        {
          ASIN: 'B05N8KQZ9O',
          Title: 'Protector Solar para Mascotas SPF 30 - Resistente al Agua, Hipoalergénico',
          DetailPageURL: `https://www.amazon.es/dp/B05N8KQZ9O?tag=${AMAZON_API_CONFIG.ASSOCIATE_TAG}`,
          Offers: {
            Listings: [{
              Price: {
                DisplayAmount: '18,99€',
                Amount: 18.99,
                Currency: 'EUR'
              },
              Availability: {
                Message: 'En stock',
                Type: 'In Stock'
              }
            }]
          },
          CustomerReviews: {
            Count: 1567,
            StarRating: { Value: 4.6 }
          }
        },
        {
          ASIN: 'B04N8KQZ9P',
          Title: 'Champú Desalador para Mascotas - Elimina Sal y Arena, Hidratante',
          DetailPageURL: `https://www.amazon.es/dp/B04N8KQZ9P?tag=${AMAZON_API_CONFIG.ASSOCIATE_TAG}`,
          Offers: {
            Listings: [{
              Price: {
                DisplayAmount: '22,99€',
                Amount: 22.99,
                Currency: 'EUR'
              },
              Availability: {
                Message: 'En stock',
                Type: 'In Stock'
              }
            }]
          },
          CustomerReviews: {
            Count: 789,
            StarRating: { Value: 4.4 }
          }
        },
        {
          ASIN: 'B03N8KQZ9Q',
          Title: 'GPS Tracker para Mascotas - Localización en Tiempo Real, Geocercas',
          DetailPageURL: `https://www.amazon.es/dp/B03N8KQZ9Q?tag=${AMAZON_API_CONFIG.ASSOCIATE_TAG}`,
          Offers: {
            Listings: [{
              Price: {
                DisplayAmount: '89,99€',
                Amount: 89.99,
                Currency: 'EUR'
              },
              Availability: {
                Message: 'En stock',
                Type: 'In Stock'
              }
            }]
          },
          CustomerReviews: {
            Count: 234,
            StarRating: { Value: 4.1 }
          }
        },
        {
          ASIN: 'B02N8KQZ9R',
          Title: 'Cámara de Seguridad para Mascotas - Visión Nocturna, App Móvil',
          DetailPageURL: `https://www.amazon.es/dp/B02N8KQZ9R?tag=${AMAZON_API_CONFIG.ASSOCIATE_TAG}`,
          Offers: {
            Listings: [{
              Price: {
                DisplayAmount: '129,99€',
                Amount: 129.99,
                Currency: 'EUR'
              },
              Availability: {
                Message: 'En stock',
                Type: 'In Stock'
              }
            }]
          },
          CustomerReviews: {
            Count: 156,
            StarRating: { Value: 4.3 }
          }
        }
      ];

      // Simulamos un pequeño delay para mostrar el loading
      await new Promise(resolve => setTimeout(resolve, 800));

      setProducts(mockProducts);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al buscar productos');
    } finally {
      setLoading(false);
    }
  }, []);

  const clearProducts = useCallback(() => {
    setProducts([]);
    setError(null);
  }, []);

  return {
    products,
    loading,
    error,
    searchProducts,
    clearProducts
  };
};
