// src/components/AmazonProductButton.tsx
import React from 'react';
import { AmazonProductItem } from '../config/amazonApi';

interface AmazonProductButtonProps {
  product: AmazonProductItem;
  className?: string;
  showReviews?: boolean;
  variant?: 'primary' | 'secondary' | 'outline';
}

const AmazonProductButton: React.FC<AmazonProductButtonProps> = ({
  product,
  className = '',
  showReviews = true,
  variant = 'primary'
}) => {
  const getVariantClasses = () => {
    switch (variant) {
      case 'primary':
        return 'bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white shadow-lg hover:shadow-xl';
      case 'secondary':
        return 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-lg hover:shadow-xl';
      case 'outline':
        return 'border-2 border-orange-500 text-orange-600 hover:bg-orange-500 hover:text-white';
      default:
        return 'bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white shadow-lg hover:shadow-xl';
    }
  };

  const formatPrice = (price: any) => {
    if (!price || !price.DisplayAmount) return 'Precio no disponible';
    return price.DisplayAmount;
  };

  const formatReviews = (reviews: any) => {
    if (!reviews || !reviews.Count) return null;
    
    const count = reviews.Count;
    const rating = reviews.StarRating?.Value || 0;
    
    return (
      <div className="flex items-center gap-1 text-xs text-gray-600">
        <div className="flex items-center">
          {[...Array(5)].map((_, i) => (
            <svg
              key={i}
              className={`w-3 h-3 ${
                i < Math.floor(rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'
              }`}
              viewBox="0 0 20 20"
            >
              <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
            </svg>
          ))}
        </div>
        <span>({count})</span>
      </div>
    );
  };

  return (
    <div className={`bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300 ${className}`}>
      <div className="p-4">
        <h3 className="font-semibold text-gray-800 text-sm leading-tight mb-2 line-clamp-2">
          {product.Title}
        </h3>
        
        <div className="flex items-center justify-between mb-3">
          <div className="text-lg font-bold text-orange-600">
            {formatPrice(product.Offers?.Listings?.[0]?.Price)}
          </div>
          {showReviews && formatReviews(product.CustomerReviews)}
        </div>

        <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
          <span className="flex items-center gap-1">
            <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            {product.Offers?.Listings?.[0]?.Availability?.Message || 'Disponible'}
          </span>
        </div>

        <a
          href={product.DetailPageURL}
          target="_blank"
          rel="noopener noreferrer"
          className={`w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 transform hover:scale-105 ${getVariantClasses()}`}
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.13.474.7.7a.5.5 0 00.424.138l9.2-2.25c.476-.119.894.013.992.9l.716 7.498a.5.5 0 01-.8.823l-9.141-8.25a.5.5 0 00-.492-.086l-3.107 1.327a.5.5 0 01-.651-.247L1.5 3H3z" />
            <path d="M16 12.5a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0zM6.5 12.5a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
          </svg>
          Comprar en Amazon
        </a>
      </div>
    </div>
  );
};

export default AmazonProductButton;
