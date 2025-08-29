import React, { useState } from 'react';
import { Button } from './Button';
import RealAmazonRecommendations from './RealAmazonRecommendations';

const RecommendationTester: React.FC = () => {
  const [testQuery, setTestQuery] = useState('chaleco salvavidas');
  const [testCategory, setTestCategory] = useState('safety');
  const [showRecommendations, setShowRecommendations] = useState(false);

  const testCategories = [
    { value: 'safety', label: '🛟 Seguridad' },
    { value: 'nautical', label: '⚓ Náutico' },
    { value: 'technology', label: '📱 Tecnología' },
    { value: 'comfort', label: '🧊 Confort' },
    { value: 'snorkel', label: '🤿 Snorkel' },
    { value: 'gps', label: '🗺️ GPS' },
    { value: 'summer', label: '☀️ Verano' }
  ];

  const testQueries = [
    'chaleco salvavidas',
    'gps náutico',
    'protector solar',
    'cargador solar',
    'aletas snorkel',
    'nevera portátil',
    'herramientas náuticas'
  ];

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-4xl mx-auto">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          🧪 Probador de Recomendaciones
        </h2>
        <p className="text-gray-600">
          Prueba el sistema de recomendaciones de Amazon con diferentes consultas y categorías
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Configuración de consulta */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              🔍 Consulta de búsqueda:
            </label>
            <input
              type="text"
              value={testQuery}
              onChange={(e) => setTestQuery(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Ej: chaleco salvavidas"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              📂 Categoría:
            </label>
            <select
              value={testCategory}
              onChange={(e) => setTestCategory(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {testCategories.map(cat => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </select>
          </div>

          <div className="flex gap-2">
            <Button
              onClick={() => setShowRecommendations(true)}
              variant="primary"
              size="lg"
              className="flex-1"
            >
              🚀 Probar Recomendaciones
            </Button>
            
            <Button
              onClick={() => setShowRecommendations(false)}
              variant="outline"
              size="lg"
              className="flex-1"
            >
              🔄 Reiniciar
            </Button>
          </div>
        </div>

        {/* Consultas rápidas */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            ⚡ Consultas rápidas:
          </label>
          <div className="grid grid-cols-2 gap-2">
            {testQueries.map(query => (
              <Button
                key={query}
                onClick={() => {
                  setTestQuery(query);
                  setShowRecommendations(true);
                }}
                variant="secondary"
                size="sm"
                className="text-xs"
              >
                {query}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Información de depuración */}
      <div className="bg-gray-50 rounded-lg p-4 mb-6">
        <h3 className="font-semibold text-gray-800 mb-2">🔧 Información de Depuración:</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div>
            <strong>Consulta actual:</strong> "{testQuery}"
          </div>
          <div>
            <strong>Categoría:</strong> {testCategory}
          </div>
          <div>
            <strong>Estado:</strong> {showRecommendations ? '✅ Activo' : '⏸️ Inactivo'}
          </div>
        </div>
      </div>

      {/* Resultados de las recomendaciones */}
      {showRecommendations && (
        <div className="border-t pt-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4 text-center">
            📊 Resultados de las Recomendaciones
          </h3>
          
          <RealAmazonRecommendations
            query={testQuery}
            category={testCategory}
            maxProducts={6}
            showTrending={false}
            title={`🧪 Prueba: "${testQuery}" en ${testCategory}`}
            className="border-2 border-blue-200"
          />
        </div>
      )}

      {/* Instrucciones */}
      <div className="mt-6 bg-blue-50 rounded-lg p-4">
        <h4 className="font-semibold text-blue-800 mb-2">💡 Cómo usar:</h4>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>• Escribe una consulta o selecciona una de las consultas rápidas</li>
          <li>• Elige una categoría apropiada</li>
          <li>• Haz clic en "Probar Recomendaciones"</li>
          <li>• Observa los resultados y cualquier error que pueda aparecer</li>
          <li>• Usa la consola del navegador para ver logs detallados</li>
        </ul>
      </div>
    </div>
  );
};

export default RecommendationTester;
