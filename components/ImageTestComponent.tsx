import React, { useState, useEffect } from 'react';
import { getProductImagesByTitle } from '../services/amazonImageUrls';

interface ImageTestComponentProps {
  productTitle: string;
}

const ImageTestComponent: React.FC<ImageTestComponentProps> = ({ productTitle }) => {
  const [images, setImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadImages = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const productImages = getProductImagesByTitle(productTitle);
        setImages(productImages);
        
        // Test if images load
        const testImage = new Image();
        testImage.onload = () => {
          console.log('✅ Imagen cargada correctamente:', productImages[0]);
          setLoading(false);
        };
        testImage.onerror = () => {
          console.log('❌ Error al cargar imagen:', productImages[0]);
          setError('Error al cargar la imagen');
          setLoading(false);
        };
        testImage.src = productImages[0];
        
      } catch (err) {
        console.error('Error loading images:', err);
        setError('Error al cargar imágenes');
        setLoading(false);
      }
    };

    loadImages();
  }, [productTitle]);

  if (loading) {
    return (
      <div className="p-4 border rounded-lg">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <p>Cargando imágenes para: {productTitle}</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 border border-red-300 rounded-lg bg-red-50">
        <p className="text-red-600">❌ {error}</p>
        <p className="text-sm text-gray-600">Producto: {productTitle}</p>
      </div>
    );
  }

  return (
    <div className="p-4 border rounded-lg bg-green-50">
      <h3 className="font-semibold text-green-800">✅ Imágenes cargadas correctamente</h3>
      <p className="text-sm text-gray-600">Producto: {productTitle}</p>
      <div className="mt-2">
        {images.map((imageUrl, index) => (
          <div key={index} className="mb-2">
            <img 
              src={imageUrl} 
              alt={`Imagen ${index + 1}`}
              className="w-32 h-32 object-cover border rounded"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = '/images/products/default-product.svg';
              }}
            />
            <p className="text-xs text-gray-500 mt-1">{imageUrl}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ImageTestComponent; 