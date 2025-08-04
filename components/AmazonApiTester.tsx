// components/AmazonApiTester.tsx
// 🧪 Componente para probar la API real de Amazon

import React, { useState } from 'react';
import { searchAmazonProducts, getAmazonProductDetails, getAmazonRelatedProducts } from '../services/amazonRealApiService';
import { AmazonSearchParams, AmazonProduct, AmazonProductDetails } from '../services/amazonRealApiService';
import { Button } from './Button';

interface AmazonApiTesterProps {
  onClose: () => void;
}

const AmazonApiTester: React.FC<AmazonApiTesterProps> = ({ onClose }) => {
  const [searchQuery, setSearchQuery] = useState('gps náutico');
  const [category, setCategory] = useState('gps');
  const [isLoading, setIsLoading] = useState(false);
  const [searchResults, setSearchResults] = useState<AmazonProduct[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<AmazonProductDetails | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<AmazonProduct[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [testResults, setTestResults] = useState<{
    searchTime?: number;
    totalResults?: number;
    apiStatus: 'idle' | 'testing' | 'success' | 'error';
  }>({ apiStatus: 'idle' });

  // Probar búsqueda de productos
  const testSearch = async () => {
    setIsLoading(true);
    setError(null);
    setTestResults({ apiStatus: 'testing' });

    try {
      const params: AmazonSearchParams = {
        query: searchQuery,
        category: category,
        maxResults: 10,
        page: 1
      };

      console.log('🧪 Iniciando prueba de búsqueda:', params);
      
      const startTime = Date.now();
      const response = await searchAmazonProducts(params);
      const searchTime = Date.now() - startTime;

      setSearchResults(response.products);
      setTestResults({
        searchTime,
        totalResults: response.totalResults,
        apiStatus: 'success'
      });

      console.log('✅ Prueba de búsqueda exitosa:', {
        productsFound: response.products.length,
        totalResults: response.totalResults,
        searchTime: `${searchTime}ms`
      });

    } catch (error) {
      console.error('❌ Error en prueba de búsqueda:', error);
      setError(error instanceof Error ? error.message : 'Error desconocido');
      setTestResults({ apiStatus: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  // Probar detalles de producto
  const testProductDetails = async (asin: string) => {
    setIsLoading(true);
    setError(null);

    try {
      console.log('🧪 Obteniendo detalles del producto:', asin);
      
      const product = await getAmazonProductDetails(asin);
      
      if (product) {
        setSelectedProduct(product);
        console.log('✅ Detalles del producto obtenidos:', {
          asin: product.asin,
          title: product.title,
          price: product.price,
          rating: product.rating,
          reviewCount: product.reviewCount
        });
      } else {
        setError('Producto no encontrado');
      }

    } catch (error) {
      console.error('❌ Error obteniendo detalles del producto:', error);
      setError(error instanceof Error ? error.message : 'Error desconocido');
    } finally {
      setIsLoading(false);
    }
  };

  // Probar productos relacionados
  const testRelatedProducts = async (asin: string) => {
    setIsLoading(true);
    setError(null);

    try {
      console.log('🧪 Obteniendo productos relacionados:', asin);
      
      const related = await getAmazonRelatedProducts(asin, 'Similarities');
      setRelatedProducts(related);
      
      console.log('✅ Productos relacionados obtenidos:', related.length);

    } catch (error) {
      console.error('❌ Error obteniendo productos relacionados:', error);
      setError(error instanceof Error ? error.message : 'Error desconocido');
    } finally {
      setIsLoading(false);
    }
  };

  // Ejecutar todas las pruebas
  const runAllTests = async () => {
    setIsLoading(true);
    setError(null);
    setTestResults({ apiStatus: 'testing' });

    try {
      console.log('🧪 Iniciando suite completa de pruebas de Amazon API...');
      
      // 1. Prueba de búsqueda
      const searchParams: AmazonSearchParams = {
        query: 'chaleco salvavidas náutico',
        category: 'safety',
        maxResults: 5
      };
      
      const searchResponse = await searchAmazonProducts(searchParams);
      
      if (searchResponse.products.length === 0) {
        throw new Error('No se encontraron productos en la búsqueda');
      }

      // 2. Prueba de detalles del primer producto
      const firstProduct = searchResponse.products[0];
      const productDetails = await getAmazonProductDetails(firstProduct.asin);
      
      if (!productDetails) {
        throw new Error('No se pudieron obtener los detalles del producto');
      }

      // 3. Prueba de productos relacionados
      const related = await getAmazonRelatedProducts(firstProduct.asin);
      
      setSearchResults(searchResponse.products);
      setSelectedProduct(productDetails);
      setRelatedProducts(related);
      
      setTestResults({
        searchTime: searchResponse.searchTime,
        totalResults: searchResponse.totalResults,
        apiStatus: 'success'
      });

      console.log('✅ Suite de pruebas completada exitosamente:', {
        searchResults: searchResponse.products.length,
        productDetails: !!productDetails,
        relatedProducts: related.length
      });

    } catch (error) {
      console.error('❌ Error en suite de pruebas:', error);
      setError(error instanceof Error ? error.message : 'Error desconocido');
      setTestResults({ apiStatus: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">🧪 Amazon API Tester</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-xl"
          >
            ×
          </button>
        </div>

        {/* Estado de la API */}
        <div className="mb-6 p-4 rounded-lg border">
          <h3 className="font-semibold mb-2">Estado de la API:</h3>
          <div className="flex items-center space-x-2">
            <div className={`w-3 h-3 rounded-full ${
              testResults.apiStatus === 'idle' ? 'bg-gray-400' :
              testResults.apiStatus === 'testing' ? 'bg-yellow-400' :
              testResults.apiStatus === 'success' ? 'bg-green-400' :
              'bg-red-400'
            }`}></div>
            <span className="capitalize">{testResults.apiStatus}</span>
            {testResults.searchTime && (
              <span className="text-sm text-gray-600">
                (Tiempo de búsqueda: {testResults.searchTime}ms)
              </span>
            )}
          </div>
        </div>

        {/* Controles de prueba */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Consulta de búsqueda:
            </label>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Ej: gps náutico"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Categoría:
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="gps">GPS</option>
              <option value="safety">Seguridad</option>
              <option value="snorkel">Snorkel</option>
              <option value="electronics">Electrónicos</option>
              <option value="tools">Herramientas</option>
            </select>
          </div>
        </div>

        {/* Botones de prueba */}
        <div className="flex flex-wrap gap-2 mb-6">
          <Button
            onClick={testSearch}
            disabled={isLoading}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            {isLoading ? '⏳ Probando...' : '🔍 Probar Búsqueda'}
          </Button>
          
          <Button
            onClick={runAllTests}
            disabled={isLoading}
            className="bg-green-600 hover:bg-green-700 text-white"
          >
            {isLoading ? '⏳ Ejecutando...' : '🚀 Ejecutar Todas las Pruebas'}
          </Button>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <h3 className="font-semibold text-red-800 mb-2">❌ Error:</h3>
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {/* Resultados de búsqueda */}
        {searchResults.length > 0 && (
          <div className="mb-6">
            <h3 className="font-semibold mb-3">📦 Productos Encontrados ({searchResults.length}):</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {searchResults.map((product) => (
                <div key={product.asin} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                  <img
                    src={product.imageUrl}
                    alt={product.title}
                    className="w-full h-32 object-cover rounded mb-2"
                  />
                  <h4 className="font-medium text-sm mb-1 line-clamp-2">{product.title}</h4>
                  <p className="text-lg font-bold text-green-600 mb-1">{product.price}</p>
                  <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                    <span>⭐ {product.rating}/5 ({product.reviewCount})</span>
                    {product.prime && <span className="text-blue-600">Prime</span>}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      onClick={() => testProductDetails(product.asin)}
                      disabled={isLoading}
                      className="bg-purple-600 hover:bg-purple-700 text-white text-xs px-2 py-1"
                    >
                      Detalles
                    </Button>
                    <Button
                      onClick={() => testRelatedProducts(product.asin)}
                      disabled={isLoading}
                      className="bg-orange-600 hover:bg-orange-700 text-white text-xs px-2 py-1"
                    >
                      Relacionados
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Detalles del producto seleccionado */}
        {selectedProduct && (
          <div className="mb-6 p-4 border rounded-lg">
            <h3 className="font-semibold mb-3">📋 Detalles del Producto:</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <img
                  src={selectedProduct.images[0] || selectedProduct.imageUrl}
                  alt={selectedProduct.title}
                  className="w-full h-48 object-cover rounded"
                />
              </div>
              <div>
                <h4 className="font-bold text-lg mb-2">{selectedProduct.title}</h4>
                <p className="text-2xl font-bold text-green-600 mb-2">{selectedProduct.price}</p>
                <p className="text-sm text-gray-600 mb-2">
                  ⭐ {selectedProduct.rating}/5 ({selectedProduct.reviewCount} reseñas)
                </p>
                <p className="text-sm text-gray-600 mb-2">Marca: {selectedProduct.brand}</p>
                <p className="text-sm text-gray-600 mb-2">
                  Disponibilidad: {selectedProduct.availability}
                </p>
                {selectedProduct.prime && (
                  <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded mb-2">
                    Prime
                  </span>
                )}
                <div className="mt-4">
                  <h5 className="font-semibold mb-2">Características:</h5>
                  <ul className="text-sm text-gray-600 space-y-1">
                    {selectedProduct.features.slice(0, 3).map((feature, index) => (
                      <li key={index}>• {feature}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Productos relacionados */}
        {relatedProducts.length > 0 && (
          <div className="mb-6">
            <h3 className="font-semibold mb-3">🔗 Productos Relacionados ({relatedProducts.length}):</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {relatedProducts.map((product) => (
                <div key={product.asin} className="border rounded-lg p-3">
                  <img
                    src={product.imageUrl}
                    alt={product.title}
                    className="w-full h-24 object-cover rounded mb-2"
                  />
                  <h4 className="font-medium text-xs mb-1 line-clamp-2">{product.title}</h4>
                  <p className="text-sm font-bold text-green-600">{product.price}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Información de la API */}
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <h3 className="font-semibold mb-2">ℹ️ Información de la API:</h3>
          <div className="text-sm text-gray-600 space-y-1">
            <p>• <strong>Endpoint:</strong> https://webservices.amazon.es/paapi5/</p>
            <p>• <strong>Marketplace:</strong> Amazon España</p>
            <p>• <strong>Tag de Afiliado:</strong> explorashop18-21</p>
            <p>• <strong>Región:</strong> eu-west-1</p>
            <p>• <strong>Servicio:</strong> ProductAdvertisingAPI</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AmazonApiTester; 