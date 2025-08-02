import React from 'react';
import { ProductRecommendation } from '../src/blogData';
import { Button } from './Button';
import { trackAffiliateClick } from '../services/affiliateTracking';

interface ProductRecommendationsProps {
  products: ProductRecommendation[];
  title?: string;
  className?: string;
  maxProducts?: number;
}

const ProductRecommendations: React.FC<ProductRecommendationsProps> = ({
  products,
  title = "🛒 Productos Recomendados para tu Aventura Náutica",
  className = "",
  maxProducts = 3
}) => {
  const displayProducts = products.slice(0, maxProducts);

  if (displayProducts.length === 0) {
    return null;
  }

  return (
    <div className={`bg-gradient-to-br from-blue-50 to-teal-50 border border-blue-200 rounded-lg p-6 my-8 ${className}`}>
      <h3 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
        <span>🛒</span>
        {title}
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {displayProducts.map((product) => (
          <div key={product.id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden">
            {/* Product Image Placeholder */}
            <div className="h-32 bg-gradient-to-br from-blue-100 to-teal-100 flex items-center justify-center">
              <span className="text-2xl">
                {product.category === 'snorkel_gear' && '🤿'}
                {product.category === 'life_jackets' && '🛟'}
                {product.category === 'gps_nautical' && '🗺️'}
                {product.category === 'sun_protection' && '☀️'}
                {product.category === 'coolers' && '🧊'}
                {product.category === 'waterproof_cameras' && '📷'}
                {product.category === 'nautical_books' && '📚'}
                {product.category === 'first_aid_kit' && '🩹'}
                {product.category === 'nautical_tools' && '🔧'}
                {product.category === 'water_sports' && '🏄‍♂️'}
                {!['snorkel_gear', 'life_jackets', 'gps_nautical', 'sun_protection', 'coolers', 'waterproof_cameras', 'nautical_books', 'first_aid_kit', 'nautical_tools', 'water_sports'].includes(product.category) && '🛥️'}
              </span>
            </div>
            
            <div className="p-4">
              <h4 className="font-semibold text-slate-800 mb-2 line-clamp-2">
                {product.name}
              </h4>
              
              <p className="text-sm text-slate-600 mb-3 line-clamp-2">
                {product.description}
              </p>
              
              <div className="flex items-center justify-between mb-3">
                {product.price && (
                  <span className="text-lg font-bold text-teal-600">
                    {product.price}
                  </span>
                )}
                
                {product.rating && (
                  <div className="flex items-center gap-1">
                    <span className="text-yellow-500">⭐</span>
                    <span className="text-sm text-slate-600">{product.rating}</span>
                  </div>
                )}
              </div>
              
              <Button
                onClick={() => {
                  // Track the click
                  trackAffiliateClick(
                    product.id,
                    product.name,
                    product.category,
                    'product_recommendations'
                  );
                  
                  // Open Amazon link
                  window.open(product.amazonLink, '_blank', 'noopener,noreferrer');
                }}
                variant="primary"
                size="sm"
                className="w-full"
              >
                Ver en Amazon
              </Button>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-4 text-center">
        <p className="text-sm text-slate-600">
          💡 Estos enlaces son de afiliados. Al comprar a través de ellos, nos ayudas a mantener el blog sin coste adicional para ti.
        </p>
      </div>
    </div>
  );
};

export default ProductRecommendations; 