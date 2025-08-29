import React, { useEffect } from 'react';
import { useAmazonProducts } from '../hooks/useAmazonProducts';
import AmazonProductButton from './AmazonProductButton';

interface RecommendedProductsProps {
  category?: string;
  title?: string;
  subtitle?: string;
  className?: string;
}

const RecommendedProducts: React.FC<RecommendedProductsProps> = ({
  category = 'mascotas náuticas',
  title = '🛒 PRODUCTOS RECOMENDADOS PARA TU MASCOTA NÁUTICA',
  subtitle = 'Equipamiento profesional verificado por expertos',
  className = ''
}) => {
  const { products, loading, error, searchProducts, clearProducts } = useAmazonProducts();

  useEffect(() => {
    // Cargar productos automáticamente al montar el componente
    searchProducts(category);
    
    // Cleanup al desmontar
    return () => {
      clearProducts();
    };
  }, [category, searchProducts, clearProducts]);

  if (loading) {
    return (
      <div className={`bg-gradient-to-br from-blue-50 to-indigo-100 rounded-xl p-6 ${className}`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Buscando los mejores productos...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`bg-red-50 border border-red-200 rounded-xl p-6 ${className}`}>
        <div className="text-center">
          <div className="text-red-500 text-4xl mb-2">⚠️</div>
          <h3 className="text-red-800 font-semibold mb-2">Error al cargar productos</h3>
          <p className="text-red-600 text-sm">{error}</p>
          <button
            onClick={() => searchProducts(category)}
            className="mt-3 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  if (!products || products.length === 0) {
    return (
      <div className={`bg-gray-50 border border-gray-200 rounded-xl p-6 ${className}`}>
        <div className="text-center">
          <div className="text-gray-400 text-4xl mb-2">🔍</div>
          <h3 className="text-gray-600 font-semibold mb-2">No se encontraron productos</h3>
          <p className="text-gray-500 text-sm">Intenta con otros términos de búsqueda</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-gradient-to-br from-blue-50 to-indigo-100 rounded-xl p-6 ${className}`}>
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">{title}</h2>
        <p className="text-gray-600">{subtitle}</p>
        <div className="w-24 h-1 bg-gradient-to-r from-orange-400 to-orange-600 mx-auto mt-3 rounded-full"></div>
      </div>

      {/* Grid de productos */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.map((product, index) => (
          <AmazonProductButton
            key={product.ASIN || index}
            product={product}
            variant={index % 3 === 0 ? 'primary' : index % 3 === 1 ? 'secondary' : 'outline'}
            className="h-full"
          />
        ))}
      </div>

      {/* Footer informativo */}
      <div className="mt-8 text-center">
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="flex items-center justify-center gap-2 text-sm text-gray-600 mb-2">
            <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span>Productos verificados por expertos náuticos</span>
          </div>
          <div className="flex items-center justify-center gap-2 text-sm text-gray-600 mb-2">
            <svg className="w-4 h-4 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
              <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.13.474.7.7a.5.5 0 00.424.138l9.2-2.25c.476-.119.894.013.992.9l.716 7.498a.5.5 0 01-.8.823l-9.141-8.25a.5.5 0 00-.492-.086l-3.107 1.327a.5.5 0 01-.651-.247L1.5 3H3z" />
            </svg>
            <span>Enlaces de afiliado - Sin costo adicional para ti</span>
          </div>
          <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
            <svg className="w-4 h-4 text-orange-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
            </svg>
            <span>Compra segura a través de Amazon</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecommendedProducts;
