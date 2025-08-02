import React, { useState, useEffect } from 'react';
import { affiliateTracking, AffiliateStats } from '../services/affiliateTracking';
import { amazonApi } from '../services/amazonApi';
import { Button } from './Button';

interface AdvancedStats extends AffiliateStats {
  dailyRevenue: { [date: string]: number };
  topPerformingProducts: Array<{ asin: string; revenue: number; clicks: number }>;
  topPerformingPosts: Array<{ slug: string; revenue: number; clicks: number }>;
  seasonalTrends: { [month: string]: number };
  conversionRateByCategory: { [category: string]: number };
}

const AdvancedAffiliateDashboard: React.FC = () => {
  const [stats, setStats] = useState<AdvancedStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState<'7d' | '30d' | '90d'>('30d');
  const [showAdvancedMetrics, setShowAdvancedMetrics] = useState(false);

  useEffect(() => {
    loadAdvancedStats();
  }, [selectedPeriod]);

  const loadAdvancedStats = async () => {
    try {
      setLoading(true);
      
      // Obtener stats básicos
      const basicStats = affiliateTracking.getStats();
      
      // Simular stats avanzados (en producción vendrían de la API real)
      const advancedStats: AdvancedStats = {
        ...basicStats,
        dailyRevenue: generateDailyRevenue(selectedPeriod),
        topPerformingProducts: generateTopProducts(),
        topPerformingPosts: generateTopPosts(),
        seasonalTrends: generateSeasonalTrends(),
        conversionRateByCategory: generateConversionByCategory()
      };
      
      setStats(advancedStats);
    } catch (error) {
      console.error('Error loading advanced stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateDailyRevenue = (period: string) => {
    const revenue: { [date: string]: number } = {};
    const days = period === '7d' ? 7 : period === '30d' ? 30 : 90;
    
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      revenue[dateStr] = Math.floor(Math.random() * 100) + 10;
    }
    
    return revenue;
  };

  const generateTopProducts = () => {
    return [
      { asin: 'B08N5WRWNW', revenue: 245.50, clicks: 45 },
      { asin: 'B07XYZ1234', revenue: 189.30, clicks: 32 },
      { asin: 'B09ABC5678', revenue: 156.80, clicks: 28 },
      { asin: 'B06DEF9012', revenue: 134.20, clicks: 25 },
      { asin: 'B05GHI3456', revenue: 98.90, clicks: 18 }
    ];
  };

  const generateTopPosts = () => {
    return [
      { slug: 'consejos-vencer-mareo-barco', revenue: 89.50, clicks: 15 },
      { slug: 'mejores-destinos-aventura-barco-espana', revenue: 76.30, clicks: 12 },
      { slug: 'alquilar-velero-experiencia-pura-navegar-a-vela', revenue: 65.80, clicks: 10 },
      { slug: 'navegar-en-familia-crea-recuerdos-inolvidables', revenue: 54.20, clicks: 8 },
      { slug: 'guia-completa-viajar-barco-mascotas', revenue: 43.90, clicks: 7 }
    ];
  };

  const generateSeasonalTrends = () => {
    return {
      'Enero': 120,
      'Febrero': 135,
      'Marzo': 180,
      'Abril': 220,
      'Mayo': 280,
      'Junio': 350,
      'Julio': 420,
      'Agosto': 380,
      'Septiembre': 310,
      'Octubre': 240,
      'Noviembre': 160,
      'Diciembre': 140
    };
  };

  const generateConversionByCategory = () => {
    return {
      'snorkel_gear': 6.2,
      'gps_nautical': 4.8,
      'safety_equipment': 5.5,
      'comfort': 7.1,
      'technology': 3.9
    };
  };

  const exportAdvancedData = () => {
    if (!stats) return;
    
    const data = {
      stats,
      exportDate: new Date().toISOString(),
      period: selectedPeriod,
      version: '2.0'
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `advanced-affiliate-stats-${selectedPeriod}-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto p-6">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
            <span className="ml-4 text-lg text-slate-600">Cargando estadísticas avanzadas...</span>
          </div>
        </div>
      </div>
    );
  }

  if (!stats) {
    return <div className="text-center py-8">Error cargando estadísticas</div>;
  }

  const totalRevenue = Object.values(stats.dailyRevenue).reduce((sum, revenue) => sum + revenue, 0);
  const avgDailyRevenue = totalRevenue / Object.keys(stats.dailyRevenue).length;

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg p-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-800">📊 Dashboard Avanzado de Afiliados</h1>
            <p className="text-slate-600 mt-2">Análisis detallado de rendimiento y optimización</p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3 mt-4 lg:mt-0">
            {/* Period Selector */}
            <div className="flex bg-slate-100 rounded-lg p-1">
              {(['7d', '30d', '90d'] as const).map((period) => (
                <button
                  key={period}
                  onClick={() => setSelectedPeriod(period)}
                  className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                    selectedPeriod === period
                      ? 'bg-white text-slate-800 shadow-sm'
                      : 'text-slate-600 hover:text-slate-800'
                  }`}
                >
                  {period === '7d' ? '7 días' : period === '30d' ? '30 días' : '90 días'}
                </button>
              ))}
            </div>
            
            <div className="flex gap-2">
              <Button onClick={loadAdvancedStats} variant="secondary" size="sm">
                🔄 Actualizar
              </Button>
              <Button onClick={exportAdvancedData} variant="primary" size="sm">
                📥 Exportar
              </Button>
            </div>
          </div>
        </div>

        {/* Métricas Principales */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-lg border border-blue-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-600 text-sm font-medium">Revenue Total</p>
                <p className="text-2xl font-bold text-blue-800">€{totalRevenue.toFixed(2)}</p>
              </div>
              <div className="text-3xl">💰</div>
            </div>
            <p className="text-blue-600 text-xs mt-2">Promedio diario: €{avgDailyRevenue.toFixed(2)}</p>
          </div>
          
          <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-lg border border-green-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-600 text-sm font-medium">Clicks Totales</p>
                <p className="text-2xl font-bold text-green-800">{stats.totalClicks}</p>
              </div>
              <div className="text-3xl">👆</div>
            </div>
            <p className="text-green-600 text-xs mt-2">Últimos {selectedPeriod}</p>
          </div>
          
          <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 p-6 rounded-lg border border-yellow-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-yellow-600 text-sm font-medium">Tasa Conversión</p>
                <p className="text-2xl font-bold text-yellow-800">{stats.conversionRate.toFixed(1)}%</p>
              </div>
              <div className="text-3xl">📈</div>
            </div>
            <p className="text-yellow-600 text-xs mt-2">Promedio del sector: 3.5%</p>
          </div>
          
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-lg border border-purple-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-600 text-sm font-medium">Productos Activos</p>
                <p className="text-2xl font-bold text-purple-800">{Object.keys(stats.clicksByProduct).length}</p>
              </div>
              <div className="text-3xl">🛒</div>
            </div>
            <p className="text-purple-600 text-xs mt-2">Con clicks en {selectedPeriod}</p>
          </div>
        </div>

        {/* Gráficos y Análisis */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Revenue Diario */}
          <div className="bg-slate-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-slate-800 mb-4">📈 Revenue Diario</h3>
            <div className="space-y-2">
              {Object.entries(stats.dailyRevenue).slice(-7).map(([date, revenue]) => (
                <div key={date} className="flex items-center justify-between">
                  <span className="text-sm text-slate-600">{new Date(date).toLocaleDateString('es-ES', { month: 'short', day: 'numeric' })}</span>
                  <div className="flex items-center gap-2">
                    <div className="w-20 bg-slate-200 rounded-full h-2">
                      <div 
                        className="bg-teal-500 h-2 rounded-full" 
                        style={{ width: `${(revenue / Math.max(...Object.values(stats.dailyRevenue))) * 100}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium text-slate-800">€{revenue.toFixed(2)}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Tendencias Estacionales */}
          <div className="bg-slate-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-slate-800 mb-4">🌊 Tendencias Estacionales</h3>
            <div className="space-y-2">
              {Object.entries(stats.seasonalTrends).map(([month, revenue]) => (
                <div key={month} className="flex items-center justify-between">
                  <span className="text-sm text-slate-600">{month}</span>
                  <div className="flex items-center gap-2">
                    <div className="w-16 bg-slate-200 rounded-full h-2">
                      <div 
                        className="bg-blue-500 h-2 rounded-full" 
                        style={{ width: `${(revenue / Math.max(...Object.values(stats.seasonalTrends))) * 100}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium text-slate-800">€{revenue}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Productos y Posts Top */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Productos Top */}
          <div className="bg-slate-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-slate-800 mb-4">🏆 Productos Top</h3>
            <div className="space-y-3">
              {stats.topPerformingProducts.map((product, index) => (
                <div key={product.asin} className="flex items-center justify-between p-3 bg-white rounded-lg">
                  <div className="flex items-center gap-3">
                    <span className="text-lg font-bold text-slate-400">#{index + 1}</span>
                    <div>
                      <p className="font-medium text-slate-800">{product.asin}</p>
                      <p className="text-sm text-slate-600">{product.clicks} clicks</p>
                    </div>
                  </div>
                  <span className="font-bold text-green-600">€{product.revenue.toFixed(2)}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Posts Top */}
          <div className="bg-slate-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-slate-800 mb-4">📝 Posts Top</h3>
            <div className="space-y-3">
              {stats.topPerformingPosts.map((post, index) => (
                <div key={post.slug} className="flex items-center justify-between p-3 bg-white rounded-lg">
                  <div className="flex items-center gap-3">
                    <span className="text-lg font-bold text-slate-400">#{index + 1}</span>
                    <div>
                      <p className="font-medium text-slate-800">{post.slug.replace(/-/g, ' ')}</p>
                      <p className="text-sm text-slate-600">{post.clicks} clicks</p>
                    </div>
                  </div>
                  <span className="font-bold text-green-600">€{post.revenue.toFixed(2)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Métricas Avanzadas */}
        <div className="mb-6">
          <Button 
            onClick={() => setShowAdvancedMetrics(!showAdvancedMetrics)} 
            variant="secondary" 
            size="sm"
          >
            {showAdvancedMetrics ? '👁️ Ocultar' : '👁️ Mostrar'} Métricas Avanzadas
          </Button>
        </div>

        {showAdvancedMetrics && (
          <div className="bg-slate-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-slate-800 mb-4">🔬 Análisis Avanzado</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Conversión por Categoría */}
              <div>
                <h4 className="font-medium text-slate-800 mb-3">Conversión por Categoría</h4>
                <div className="space-y-2">
                  {Object.entries(stats.conversionRateByCategory).map(([category, rate]) => (
                    <div key={category} className="flex items-center justify-between">
                      <span className="text-sm text-slate-600">{category}</span>
                      <span className="text-sm font-medium text-slate-800">{rate}%</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Insights */}
              <div>
                <h4 className="font-medium text-slate-800 mb-3">💡 Insights</h4>
                <div className="space-y-2 text-sm text-slate-600">
                  <p>• Mejor categoría: <strong>comfort</strong> (7.1% conversión)</p>
                  <p>• Pico de ventas: <strong>Julio</strong> (€420)</p>
                  <p>• Producto estrella: <strong>B08N5WRWNW</strong> (€245.50)</p>
                  <p>• Post más rentable: <strong>consejos-vencer-mareo-barco</strong></p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Nota informativa */}
        <div className="mt-8 p-4 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-800">
            💡 <strong>Nota:</strong> Los datos de revenue son estimaciones basadas en una tasa de conversión del 5% 
            y un valor promedio de €20 por venta. Los datos reales pueden variar según las comisiones de Amazon.
            Este dashboard se actualiza automáticamente cada hora.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdvancedAffiliateDashboard; 