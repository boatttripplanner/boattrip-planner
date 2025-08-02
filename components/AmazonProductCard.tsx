import React, { useState, useEffect } from 'react';
import { AmazonProduct } from '../services/amazonApi';
import { AmazonRealProduct, getRealProductImages } from '../services/amazonRealApi';
import { trackAffiliateClick } from '../services/affiliateTracking';
import { Button } from './Button';

interface AmazonProductCardProps {
  product: AmazonProduct | AmazonRealProduct;
  className?: string;
  showGallery?: boolean;
}

const AmazonProductCard: React.FC<AmazonProductCardProps> = ({
  product,
  className = "",
  showGallery = false
}) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [images, setImages] = useState<string[]>([product.imageUrl]);
  const [imageLoading, setImageLoading] = useState(true);

  useEffect(() => {
    const loadProductImages = async () => {
      try {
        setImageLoading(true);
        
        // Si el producto ya tiene imágenes cargadas (AmazonRealProduct)
        if ('images' in product && product.images.length > 0) {
          setImages(product.images);
        } else {
          // Cargar imágenes usando la API real con el título del producto
          const productImages = await getRealProductImages(product.asin, product.title);
          setImages(productImages);
        }
      } catch (error) {
        console.error('Error loading product images:', error);
        setImages([product.imageUrl]);
      } finally {
        setImageLoading(false);
      }
    };

    loadProductImages();
  }, [product.asin, product.imageUrl, product.title]);

  const handleProductClick = () => {
    // Track the click
    trackAffiliateClick(
      product.asin,
      product.title,
      product.category,
      'product_card'
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

  return (
    <div className={`bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden group ${className}`}>
      {/* Product Image */}
      <div className="relative h-48 overflow-hidden">
        {imageLoading ? (
          <div className="w-full h-full bg-gray-200 animate-pulse flex items-center justify-center">
            <div className="text-gray-400">Cargando imagen...</div>
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
            
            {/* Image Gallery Navigation */}
            {showGallery && images.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-1 rounded-full hover:bg-opacity-70 transition-all"
                >
                  ←
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-1 rounded-full hover:bg-opacity-70 transition-all"
                >
                  →
                </button>
                
                {/* Image Indicators */}
                <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex gap-1">
                  {images.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`w-2 h-2 rounded-full ${
                        index === currentImageIndex ? 'bg-white' : 'bg-white bg-opacity-50'
                      }`}
                    />
                  ))}
                </div>
              </>
            )}
          </>
        )}
        
        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {product.prime && (
            <span className="bg-blue-600 text-white px-2 py-1 rounded text-xs font-medium">
              Prime
            </span>
          )}
          {product.originalPrice && (
            <span className="bg-red-600 text-white px-2 py-1 rounded text-xs font-medium">
              Oferta
            </span>
          )}
        </div>
        
        {/* Rating */}
        <div className="absolute top-2 right-2 bg-black bg-opacity-70 text-white px-2 py-1 rounded text-xs">
          ⭐ {product.rating.toFixed(1)} ({product.reviewCount})
        </div>
        
        {/* Availability */}
        <div className="absolute bottom-2 right-2">
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
          <h4 className="font-semibold text-slate-800 line-clamp-2 text-sm">
            {product.title}
          </h4>
        </div>
        
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold text-teal-600">
              {product.price}
            </span>
            {product.originalPrice && (
              <span className="text-sm text-slate-500 line-through">
                {product.originalPrice}
              </span>
            )}
          </div>
        </div>
        
        {/* Features */}
        {product.features.length > 0 && (
          <div className="mb-3">
            <ul className="text-xs text-slate-600 space-y-1">
              {product.features.slice(0, 2).map((feature, index) => (
                <li key={index} className="flex items-center gap-1">
                  <span className="text-green-500">✓</span>
                  {feature}
                </li>
              ))}
            </ul>
          </div>
        )}
        
        <button
          onClick={handleProductClick}
          className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded transition-all"
        >
          Ver en Amazon
        </button>
      </div>
    </div>
  );
};

export default AmazonProductCard; 