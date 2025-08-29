import { useState, useCallback, useEffect } from 'react';
import { AmazonRealProduct, searchRealAmazonProducts, getRealTrendingProducts } from '../services/amazonRealApi';

interface UseRecommendationsProps {
  query?: string;
  category?: string;
  maxProducts?: number;
  showTrending?: boolean;
}

interface UseRecommendationsReturn {
  products: AmazonRealProduct[];
  loading: boolean;
  error: string | null;
  retryCount: number;
  loadProducts: () => Promise<void>;
  loadTrending: () => Promise<void>;
  reset: () => void;
}

export const useRecommendations = ({
  query,
  category = 'nautical',
  maxProducts = 6,
  showTrending = false
}: UseRecommendationsProps): UseRecommendationsReturn => {
  const [products, setProducts] = useState<AmazonRealProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  const loadProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      let productResults: AmazonRealProduct[] = [];

      if (query) {
        // Búsqueda específica con API real
        const searchResult = await searchRealAmazonProducts({ 
          query, 
          category,
          sortBy: 'rating'
        });
        productResults = searchResult.products;
      } else if (showTrending) {
        // Productos trending con API real
        productResults = await getRealTrendingProducts(category);
      } else {
        // Búsqueda por categoría con API real
        const searchResult = await searchRealAmazonProducts({ 
          query: category, 
          category,
          sortBy: 'rating'
        });
        productResults = searchResult.products;
      }

      console.log('useRecommendations - Productos cargados:', {
        query,
        category,
        showTrending,
        productResults: productResults.length,
        maxProducts,
        finalProducts: productResults.slice(0, maxProducts).length
      });
      
      if (productResults.length === 0) {
        throw new Error('No se encontraron productos para mostrar');
      }
      
      setProducts(productResults.slice(0, maxProducts));
      setRetryCount(0); // Reset retry count on success
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'No se pudieron cargar los productos de Amazon';
      setError(errorMessage);
      console.error('Error loading real Amazon products:', err);
      setRetryCount(prev => prev + 1);
    } finally {
      setLoading(false);
    }
  }, [query, category, maxProducts, showTrending]);

  const loadTrending = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const trendingProducts = await getRealTrendingProducts(category);
      
      if (trendingProducts.length === 0) {
        throw new Error('No se encontraron productos trending');
      }
      
      setProducts(trendingProducts.slice(0, maxProducts));
      setRetryCount(0);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'No se pudieron cargar los productos trending';
      setError(errorMessage);
      console.error('Error loading trending products:', err);
    } finally {
      setLoading(false);
    }
  }, [category, maxProducts]);

  const reset = useCallback(() => {
    setProducts([]);
    setLoading(false);
    setError(null);
    setRetryCount(0);
  }, []);

  // Auto-retry logic for network errors
  useEffect(() => {
    if (error && retryCount < 3 && !loading) {
      const timer = setTimeout(() => {
        console.log(`🔄 Auto-retry ${retryCount + 1}/3...`);
        loadProducts();
      }, Math.pow(2, retryCount) * 1000); // Exponential backoff: 1s, 2s, 4s

      return () => clearTimeout(timer);
    }
  }, [error, retryCount, loading, loadProducts]);

  // Initial load
  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  return {
    products,
    loading,
    error,
    retryCount,
    loadProducts,
    loadTrending,
    reset
  };
};
