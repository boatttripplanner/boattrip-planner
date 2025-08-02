import React, { useState, useEffect } from 'react';
import { AmazonRealProduct, searchRealAmazonProducts, getRealTrendingProducts } from '../services/amazonRealApi';
import { trackAffiliateClick } from '../services/affiliateTracking';
import { Button } from './Button';
import RealAmazonProductCard from './RealAmazonProductCard';

interface RealAmazonRecommendationsProps {
  query?: string;
  category?: string;
  title?: string;
  maxProducts?: number;
  showTrending?: boolean;
  className?: string;
  showRealTimePricing?: boolean;
}

const RealAmazonRecommendations: React.FC<RealAmazonRecommendationsProps> = ({
  query,
  category = 'nautical',
  title,
  maxProducts = 6,
  showTrending = false,
  className = "",
  showRealTimePricing = true
}) => {
  const [products, setProducts] = useState<AmazonRealProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadProducts = async () => {
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

        console.log('RealAmazonRecommendations - Productos cargados:', {
          query,
          category,
          showTrending,
          productResults: productResults.length,
          maxProducts,
          finalProducts: productResults.slice(0, maxProducts).length
        });
        setProducts(productResults.slice(0, maxProducts));
      } catch (err) {
        setError('No se pudieron cargar los productos de Amazon');
        console.error('Error loading real Amazon products:', err);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, [query, category, maxProducts, showTrending]);

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
      <div className={`bg-gradient-to-br from-orange-50 to-red-50 border border-orange-200 rounded-lg p-6 my-8 ${className}`}>
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600"></div>
          <span className="ml-3 text-slate-600">Cargando productos reales de Amazon...</span>
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
    return (
      <div className={`bg-yellow-50 border border-yellow-200 rounded-lg p-6 my-8 ${className}`}>
        <div className="text-center">
          <span className="text-yellow-700">⌛ No se encontraron productos para mostrar</span>
          <div className="text-sm text-yellow-600 mt-2">
            Query: "{query}" | Category: "{category}" | Trending: {showTrending ? 'Sí' : 'No'}
          </div>
          <Button 
            onClick={() => window.location.reload()} 
            variant="secondary" 
            size="sm" 
            className="mt-3"
          >
            Recargar productos
          </Button>
        </div>
      </div>
    );
  }

  const displayTitle = title || (query 
    ? `🛒 Productos reales de Amazon: "${query}"`
    : showTrending 
    ? `🔥 Productos Trending en Amazon - ${category}`
    : `🛒 Productos recomendados de Amazon - ${category}`
  );

  return (
    <div className={`bg-gradient-to-br from-orange-50 to-red-50 border border-orange-200 rounded-lg p-6 my-8 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
          <span>{getCategoryIcon(category)}</span>
          {displayTitle}
        </h3>
        
        {/* Amazon Real Badge */}
        <div className="flex items-center gap-2">
          <span className="bg-orange-500 text-white px-3 py-1 rounded-full text-xs font-medium">
            Amazon Real
          </span>
          <span className="bg-green-500 text-white px-3 py-1 rounded-full text-xs font-medium">
            Precios Actualizados
          </span>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {products
          .filter((product, index, self) => 
            // Deduplicar productos por ASIN
            index === self.findIndex(p => p.asin === product.asin)
          )
          .map((product, index) => (
            <RealAmazonProductCard
              key={`${product.asin}-${index}`}
              product={product}
              showGallery={true}
              showRealTimePricing={showRealTimePricing}
            />
          ))
        }
      </div>
      
      <div className="mt-6 text-center">
        <div className="bg-white rounded-lg p-4 border border-orange-200">
          <p className="text-sm text-slate-600 mb-2">
            🛒 <strong>Productos reales de Amazon</strong> con imágenes y precios actualizados
          </p>
          <p className="text-xs text-slate-500">
            💰 Los enlaces son de afiliados y nos ayudan a mantener el blog • 
            📸 Imágenes oficiales de Amazon • 
            ⭐ Ratings y reviews reales
          </p>
        </div>
      </div>
    </div>
  );
};

export default RealAmazonRecommendations; 