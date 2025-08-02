import React, { useState, useEffect } from 'react';
import { AmazonProduct, searchAmazonProducts, getTrendingProducts } from '../services/amazonApi';
import { trackAffiliateClick } from '../services/affiliateTracking';
import { Button } from './Button';
import AmazonProductCard from './AmazonProductCard';

interface DynamicProductRecommendationsProps {
  query?: string;
  category?: string;
  title?: string;
  maxProducts?: number;
  showTrending?: boolean;
  className?: string;
}

const DynamicProductRecommendations: React.FC<DynamicProductRecommendationsProps> = ({
  query,
  category = 'nautical',
  title,
  maxProducts = 6,
  showTrending = false,
  className = ""
}) => {
  const [products, setProducts] = useState<AmazonProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);
        setError(null);

        let productResults: AmazonProduct[] = [];

        if (query) {
          // Búsqueda específica
          const searchResult = await searchAmazonProducts({ 
            query, 
            category,
            sortBy: 'rating'
          });
          productResults = searchResult.products;
        } else if (showTrending) {
          // Productos trending
          productResults = await getTrendingProducts(category);
        } else {
          // Búsqueda por categoría
          const searchResult = await searchAmazonProducts({ 
            query: category, 
            category,
            sortBy: 'rating'
          });
          productResults = searchResult.products;
        }

        setProducts(productResults.slice(0, maxProducts));
      } catch (err) {
        setError('No se pudieron cargar los productos');
        console.error('Error loading products:', err);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, [query, category, maxProducts, showTrending]);

  const handleProductClick = (product: AmazonProduct) => {
    // Track the click
    trackAffiliateClick(
      product.asin,
      product.title,
      product.category,
      'dynamic_recommendations'
    );
    
    // Open Amazon link
    window.open(product.affiliateUrl, '_blank', 'noopener,noreferrer');
  };

  const getCategoryIcon = (category: string): string => {
    const icons: { [key: string]: string } = {
      snorkel: '🤿',
      gps: '🗺️',
      safety: '🛟',
      comfort: '🧊',
      technology: '📱',
      nautical: '⚓',
      summer: '☀️'
    };
    return icons[category] || '🛥️';
  };

  if (loading) {
    return (
      <div className={`bg-gradient-to-br from-blue-50 to-teal-50 border border-blue-200 rounded-lg p-6 my-8 ${className}`}>
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600"></div>
          <span className="ml-3 text-slate-600">Cargando productos...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`bg-red-50 border border-red-200 rounded-lg p-6 my-8 ${className}`}>
        <div className="text-center">
          <span className="text-red-600">⚠️ {error}</span>
          <Button 
            onClick={() => window.location.reload()} 
            variant="secondary" 
            size="sm" 
            className="mt-2"
          >
            Reintentar
          </Button>
        </div>
      </div>
    );
  }

  if (products.length === 0) {
    return null;
  }

  const displayTitle = title || (query 
    ? `🛒 Productos relacionados con "${query}"`
    : showTrending 
    ? `🔥 Productos Trending en ${category}`
    : `🛒 Productos recomendados en ${category}`
  );

  return (
    <div className={`bg-gradient-to-br from-blue-50 to-teal-50 border border-blue-200 rounded-lg p-6 my-8 ${className}`}>
      <h3 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
        <span>{getCategoryIcon(category)}</span>
        {displayTitle}
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {products.map((product) => (
          <AmazonProductCard
            key={product.asin}
            product={product}
            showGallery={true}
          />
        ))}
      </div>
      
      <div className="mt-4 text-center">
        <p className="text-sm text-slate-600">
          💡 Productos seleccionados automáticamente basados en tu contenido. 
          Los enlaces son de afiliados y nos ayudan a mantener el blog.
        </p>
      </div>
    </div>
  );
};

export default DynamicProductRecommendations; 