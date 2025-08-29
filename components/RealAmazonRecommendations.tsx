import React from 'react';
import { trackAffiliateClick } from '../services/affiliateTracking';
import { Button } from './Button';
import RealAmazonProductCard from './RealAmazonProductCard';
import RecommendationFallback from './RecommendationFallback';
import { useRecommendations } from '../hooks/useRecommendations';

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
  const {
    products,
    loading,
    error,
    retryCount,
    loadProducts,
    loadTrending,
    reset
  } = useRecommendations({
    query,
    category,
    maxProducts,
    showTrending
  });

  const handleRetry = () => {
    reset();
    loadProducts();
  };

  const handleShowTrending = () => {
    reset();
    loadTrending();
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
      <RecommendationFallback
        error={error}
        onRetry={handleRetry}
        onShowTrending={handleShowTrending}
        query={query}
        category={category}
        className={className}
      />
      
      {retryCount > 0 && (
        <div className="text-center text-sm text-gray-500 mt-2">
          Reintentos: {retryCount}/3
        </div>
      )}
    );
  }

  if (products.length === 0) {
    return (
      <div className={`bg-yellow-50 border border-yellow-200 rounded-lg p-6 my-8 ${className}`}>
        <div className="text-center">
          <div className="text-4xl mb-4">⌛</div>
          <h3 className="text-xl font-bold text-yellow-700 mb-3">
            No se encontraron productos para mostrar
          </h3>
          <div className="text-sm text-yellow-600 mb-4">
            <p>Query: "{query || 'N/A'}" | Categoría: "{category}" | Trending: {showTrending ? 'Sí' : 'No'}</p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
            <Button 
              onClick={handleRetry}
              variant="primary"
              size="lg"
              className="min-w-[140px]"
            >
              🔄 Reintentar
            </Button>
            
            <Button 
              onClick={handleShowTrending}
              variant="secondary"
              size="lg"
              className="min-w-[140px]"
            >
              🔥 Ver Trending
            </Button>
          </div>
          
          <div className="mt-4 text-xs text-yellow-600">
            <p>Si el problema persiste, intenta con una búsqueda diferente o recarga la página</p>
          </div>
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