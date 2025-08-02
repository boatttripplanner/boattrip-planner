import React, { useState, useEffect } from 'react';
import { AmazonRealProduct, getRealProductImages } from '../services/amazonRealApi';
import { trackAffiliateClick } from '../services/affiliateTracking';
import { Button } from './Button';

interface RealAmazonProductCardProps {
  product: AmazonRealProduct;
  className?: string;
  showGallery?: boolean;
  showRealTimePricing?: boolean;
}

const RealAmazonProductCard: React.FC<RealAmazonProductCardProps> = ({
  product,
  className = "",
  showGallery = true,
  showRealTimePricing = true
}) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [images, setImages] = useState<string[]>(product.images || [product.imageUrl]);
  const [imageLoading, setImageLoading] = useState(true);
  const [priceLoading, setPriceLoading] = useState(false);

  useEffect(() => {
    const loadProductImages = async () => {
      try {
        setImageLoading(true);
        
        // Cargar imágenes reales de Amazon con el título del producto
        const realImages = await getRealProductImages(product.asin, product.title);
        setImages(realImages.length > 0 ? realImages : [product.imageUrl]);
      } catch (error) {
        console.error('Error loading real product images:', error);
        setImages([product.imageUrl]);
      } finally {
        setImageLoading(false);
      }
    };

    loadProductImages();
  }, [product.asin, product.imageUrl, product.title]);

  const handleProductClick = () => {
    // Track the click con datos reales
    trackAffiliateClick(
      product.asin,
      product.title,
      product.category,
      'real_amazon_card'
    );
    
    // Open Amazon link
    window.open(product.affiliateUrl, '_blank', 'noopener,noreferrer');
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
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

  const getPriceColor = (price: string): string => {
    const numericPrice = parseFloat(price.replace('€', ''));
    if (numericPrice < 50) return 'text-green-600';
    if (numericPrice < 100) return 'text-blue-600';
    if (numericPrice < 200) return 'text-orange-600';
    return 'text-red-600';
  };

  return (
    <div className={`bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden group border border-gray-100 ${className}`}>
      {/* Product Image with Real Amazon Images */}
      <div className="relative h-48 overflow-hidden">
        {imageLoading ? (
          <div className="w-full h-full bg-gradient-to-br from-blue-50 to-teal-50 animate-pulse flex items-center justify-center">
            <div className="text-gray-400 flex flex-col items-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600 mb-2"></div>
              <span className="text-sm">Cargando imagen real...</span>
            </div>
          </div>
        ) : (
          <>
            <img 
              src={images[currentImageIndex]} 
              alt={product.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = '/images/products/default-product.svg';
              }}
            />
            
            {/* Real Amazon Badge */}
            <div className="absolute top-2 left-2">
              <span className="bg-orange-500 text-white px-2 py-1 rounded text-xs font-medium">
                Amazon Real
              </span>
            </div>
            
            {/* Image Gallery Navigation */}
            {showGallery && images.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-all"
                >
                  ←
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-all"
                >
                  →
                </button>
                
                {/* Image Indicators */}
                <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex gap-1">
                  {images.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`w-2 h-2 rounded-full transition-all ${
                        index === currentImageIndex ? 'bg-white scale-125' : 'bg-white bg-opacity-50'
                      }`}
                    />
                  ))}
                </div>
              </>
            )}
          </>
        )}
        
        {/* Badges */}
        <div className="absolute top-2 right-2 flex flex-col gap-1">
          {product.prime && (
            <span className="bg-blue-600 text-white px-2 py-1 rounded text-xs font-medium">
              Prime
            </span>
          )}
          {product.originalPrice && (
            <span className="bg-red-600 text-white px-2 py-1 rounded text-xs font-medium">
              -{Math.round(((parseFloat(product.originalPrice.replace('€', '')) - parseFloat(product.price.replace('€', ''))) / parseFloat(product.originalPrice.replace('€', ''))) * 100)}%
            </span>
          )}
        </div>
        
        {/* Rating */}
        <div className="absolute bottom-2 right-2 bg-black bg-opacity-70 text-white px-2 py-1 rounded text-xs">
          ⭐ {product.rating.toFixed(1)} ({product.reviewCount.toLocaleString()})
        </div>
        
        {/* Availability */}
        <div className="absolute bottom-2 left-2">
          <span className={`px-2 py-1 rounded text-xs font-medium ${
            product.availability === 'En stock' 
              ? 'bg-green-600 text-white' 
              : 'bg-red-600 text-white'
          }`}>
            {product.availability}
          </span>
        </div>
      </div>
      
      <div className="p-4">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-lg">{getCategoryIcon(product.category)}</span>
          <h4 className="font-semibold text-slate-800 line-clamp-2 text-sm leading-tight">
            {product.title}
          </h4>
        </div>
        
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className={`text-lg font-bold ${getPriceColor(product.price)}`}>
              {product.price}
            </span>
            {product.originalPrice && (
              <span className="text-sm text-slate-500 line-through">
                {product.originalPrice}
              </span>
            )}
          </div>
          
          {/* Real-time pricing indicator */}
          {showRealTimePricing && (
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-xs text-green-600 font-medium">Precio actual</span>
            </div>
          )}
        </div>
        
        {/* Features */}
        {product.features.length > 0 && (
          <div className="mb-3">
            <ul className="text-xs text-slate-600 space-y-1">
              {product.features.slice(0, 3).map((feature, index) => (
                <li key={index} className="flex items-start gap-1">
                  <span className="text-green-500 mt-0.5">✓</span>
                  <span className="leading-tight">{feature}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
        
        <Button
          onClick={handleProductClick}
          variant="primary"
          size="sm"
          className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
        >
          🛒 Ver en Amazon
        </Button>
        
        {/* Real Amazon disclaimer */}
        <div className="mt-2 text-center">
          <p className="text-xs text-slate-500">
            📸 Imágenes reales de Amazon • 💰 Precios actualizados
          </p>
        </div>
      </div>
    </div>
  );
};

export default RealAmazonProductCard; 