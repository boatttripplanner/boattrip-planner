import React, { useState, useEffect } from 'react';
import { affiliateTracking, AffiliateStats, trackAffiliateClick } from '../services/affiliateTracking';
import { PRODUCT_RECOMMENDATIONS } from '../src/blogData';
import { Button } from './Button';

const AffiliateDashboard: React.FC = () => {
  const [stats, setStats] = useState<AffiliateStats | null>(null);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    setStats(affiliateTracking.getStats());
  }, []);

  const refreshStats = () => {
    setStats(affiliateTracking.getStats());
  };

  const testTracking = () => {
    // Simular clicks de prueba
    trackAffiliateClick('B09M47HFCQ', 'Garmin fēnix 7', 'gps', 'blog_post', 'test-post');
    trackAffiliateClick('B0B1T4TVTS', 'Chaleco Salvavidas', 'safety', 'product_recommendations');
    trackAffiliateClick('garmin+echomap+uhd+gps+nautico', 'GPS Náutico Garmin', 'gps', 'blog_post', 'test-post');
    
    // Actualizar estadísticas
    setTimeout(() => {
      setStats(affiliateTracking.getStats());
    }, 100);
  };

  const exportData = () => {
    const data = affiliateTracking.exportData();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `affiliate-stats-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (!stats) {
    return <div className="text-center py-8">Cargando estadísticas...</div>;
  }

  const topProducts = affiliateTracking.getTopProducts(5);
  const topCategories = affiliateTracking.getTopCategories(5);

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-slate-800">📊 Dashboard de Afiliados</h1>
          <div className="flex gap-2">
            <Button onClick={refreshStats} variant="secondary" size="sm">
              🔄 Actualizar
            </Button>
            <Button onClick={testTracking} variant="secondary" size="sm">
              🧪 Probar Tracking
            </Button>
            <Button onClick={exportData} variant="primary" size="sm">
              📥 Exportar
            </Button>
          </div>
        </div>

        {/* Métricas principales */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">{stats.totalClicks}</div>
            <div className="text-sm text-blue-800">Total de Clicks</div>
          </div>
          
          <div className="bg-green-50 p-4 rounded-lg">
            <div className="text-2xl font-bold text-green-600">€{stats.revenue.toFixed(2)}</div>
            <div className="text-sm text-green-800">Revenue Estimado</div>
          </div>
          
          <div className="bg-yellow-50 p-4 rounded-lg">
            <div className="text-2xl font-bold text-yellow-600">{stats.conversionRate.toFixed(1)}%</div>
            <div className="text-sm text-yellow-800">Tasa de Conversión</div>
          </div>
          
          <div className="bg-purple-50 p-4 rounded-lg">
            <div className="text-2xl font-bold text-purple-600">{Object.keys(stats.clicksByProduct).length}</div>
            <div className="text-sm text-purple-800">Productos Clickeados</div>
          </div>
        </div>

        {/* Clicks por fuente */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Clicks por Fuente</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {Object.entries(stats.clicksBySource).map(([source, clicks]) => (
              <div key={source} className="bg-slate-50 p-4 rounded-lg">
                <div className="text-lg font-semibold text-slate-800">
                  {source === 'blog_post' && '📝 Blog Post'}
                  {source === 'product_recommendations' && '🛒 Productos Recomendados'}
                  {source === 'inline_link' && '🔗 Enlaces Inline'}
                </div>
                <div className="text-2xl font-bold text-slate-600">{clicks}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Productos más populares */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Productos Más Populares</h2>
          <div className="bg-slate-50 rounded-lg p-4">
            {topProducts.map((product, index) => {
              const productInfo = PRODUCT_RECOMMENDATIONS.find(p => p.id === product.productId);
              return (
                <div key={product.productId} className="flex justify-between items-center py-2 border-b border-slate-200 last:border-b-0">
                  <div className="flex items-center gap-3">
                    <span className="text-lg font-bold text-slate-600">#{index + 1}</span>
                    <div>
                      <div className="font-semibold text-slate-800">{productInfo?.name || product.productId}</div>
                      <div className="text-sm text-slate-600">{productInfo?.category || 'Sin categoría'}</div>
                    </div>
                  </div>
                  <div className="text-lg font-bold text-blue-600">{product.clicks} clicks</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Categorías más populares */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Categorías Más Populares</h2>
          <div className="bg-slate-50 rounded-lg p-4">
            {topCategories.map((category, index) => (
              <div key={category.category} className="flex justify-between items-center py-2 border-b border-slate-200 last:border-b-0">
                <div className="flex items-center gap-3">
                  <span className="text-lg font-bold text-slate-600">#{index + 1}</span>
                  <div className="font-semibold text-slate-800">{category.category}</div>
                </div>
                <div className="text-lg font-bold text-green-600">{category.clicks} clicks</div>
              </div>
            ))}
          </div>
        </div>

        {/* Detalles adicionales */}
        <div className="mb-6">
          <Button 
            onClick={() => setShowDetails(!showDetails)} 
            variant="secondary" 
            size="sm"
          >
            {showDetails ? '👁️ Ocultar' : '👁️ Mostrar'} Detalles
          </Button>
        </div>

        {showDetails && (
          <div className="bg-slate-50 rounded-lg p-4">
            <h3 className="text-lg font-semibold mb-4">Detalles Técnicos</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <strong>Total de productos disponibles:</strong> {PRODUCT_RECOMMENDATIONS.length}
              </div>
              <div>
                <strong>Productos con clicks:</strong> {Object.keys(stats.clicksByProduct).length}
              </div>
              <div>
                <strong>Fuentes de tráfico:</strong> {Object.keys(stats.clicksBySource).length}
              </div>
              <div>
                <strong>Categorías activas:</strong> {Object.keys(stats.clicksByCategory).length}
              </div>
            </div>
          </div>
        )}

        {/* Nota informativa */}
        <div className="mt-8 p-4 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-800">
            💡 <strong>Nota:</strong> Los datos de revenue son estimaciones basadas en una tasa de conversión del 5% 
            y un valor promedio de €20 por venta. Los datos reales pueden variar según las comisiones de Amazon.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AffiliateDashboard; 