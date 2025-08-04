import React from 'react';
import { AMAZON_AFFILIATE_TAG } from '../constants';

interface AmazonProductCardProps {
  productName: string;
  asin?: string;
  price?: string;
  rating?: number;
  reviewCount?: number;
  imageUrl?: string;
  category?: string;
  description?: string;
  isPrime?: boolean;
  discount?: string;
  originalPrice?: string;
  className?: string;
}

const AmazonProductCard: React.FC<AmazonProductCardProps> = ({
  productName,
  asin,
  price = 'Ver precio',
  rating = 0,
  reviewCount = 0,
  imageUrl,
  category = 'general',
  description,
  isPrime = false,
  discount,
  originalPrice,
  className = ''
}) => {
  // Generar enlace optimizado de Amazon
  const generateAmazonLink = () => {
    const affiliateTag = AMAZON_AFFILIATE_TAG;
    
    if (asin) {
      // Enlace directo al producto con ASIN
      return `https://www.amazon.es/dp/${asin}?tag=${affiliateTag}&linkCode=ogi&th=1&psc=1&ref_=as_li_ss_tl&camp=3638&creative=24630&creativeASIN=${asin}&linkId=nautical_guide_${category}`;
    } else {
      // Enlace de búsqueda optimizado
      const searchTerm = productName.replace(/\s+/g, '+');
      const utmParams = `utm_source=boattrip-planner&utm_medium=affiliate&utm_campaign=nautical_guide&utm_content=${category}`;
      return `https://www.amazon.es/s?k=${searchTerm}&tag=${affiliateTag}&linkCode=ur2&linkId=nautical_guide_${category}&camp=3638&creative=24630&ref=as_li_ss_tl&${utmParams}`;
    }
  };

  // Generar estrellas de rating
  const generateStars = (rating: number) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    
    return (
      <div className="flex items-center">
        {[...Array(fullStars)].map((_, i) => (
          <span key={i} className="text-yellow-400">★</span>
        ))}
        {hasHalfStar && <span className="text-yellow-400">☆</span>}
        {[...Array(emptyStars)].map((_, i) => (
          <span key={i} className="text-gray-300">☆</span>
        ))}
        <span className="ml-1 text-sm text-gray-600">({reviewCount})</span>
      </div>
    );
  };

  return (
    <div className={`bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 border border-gray-200 overflow-hidden ${className}`}>
      {/* Imagen del producto */}
      <div className="relative">
        {imageUrl ? (
          <img 
            src={imageUrl} 
            alt={productName}
            className="w-full h-48 object-cover"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
            <span className="text-gray-400">Imagen no disponible</span>
          </div>
        )}
        
        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {isPrime && (
            <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded-full font-semibold">
              Prime
            </span>
          )}
          {discount && (
            <span className="bg-red-600 text-white text-xs px-2 py-1 rounded-full font-semibold">
              -{discount}
            </span>
          )}
        </div>
      </div>

      {/* Contenido */}
      <div className="p-4">
        {/* Título */}
        <h3 className="font-semibold text-gray-900 text-sm line-clamp-2 mb-2">
          {productName}
        </h3>

        {/* Rating */}
        {rating > 0 && (
          <div className="mb-2">
            {generateStars(rating)}
          </div>
        )}

        {/* Precio */}
        <div className="mb-3">
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold text-green-600">
              {price}
            </span>
            {originalPrice && originalPrice !== price && (
              <span className="text-sm text-gray-500 line-through">
                {originalPrice}
              </span>
            )}
          </div>
        </div>

        {/* Descripción */}
        {description && (
          <p className="text-sm text-gray-600 mb-3 line-clamp-2">
            {description}
          </p>
        )}

        {/* Botón de compra */}
        <a
          href={generateAmazonLink()}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 px-4 rounded-md transition-colors duration-200 flex items-center justify-center gap-2"
          onClick={() => {
            // Tracking de clics (puedes integrar con Google Analytics)
            if (typeof window !== 'undefined' && (window as any).gtag) {
              (window as any).gtag('event', 'click', {
                'event_category': 'amazon_affiliate',
                'event_label': productName,
                'value': 1
              });
            }
          }}
        >
          <span>Ver en Amazon</span>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
        </a>

        {/* Disclaimer */}
        <p className="text-xs text-gray-500 mt-2 text-center">
          Como afiliado de Amazon, ganamos comisiones por compras calificadas
        </p>
      </div>
    </div>
  );
};

export default AmazonProductCard; 