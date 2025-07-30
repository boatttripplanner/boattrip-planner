import React, { useState, useEffect } from 'react';
import { useTenant, useTenantUsage, useTenantFeatures } from '../contexts/TenantContext';
import { AnalyticsData, RevenueMetrics, UserMetrics, BoatMetrics } from '../types/tenant';

interface DashboardAnalyticsProps {
  period?: 'day' | 'week' | 'month' | 'year';
  showRevenue?: boolean;
  showUsers?: boolean;
  showBoats?: boolean;
  showWeather?: boolean;
  showPerformance?: boolean;
}

export default function DashboardAnalytics({
  period = 'month',
  showRevenue = true,
  showUsers = true,
  showBoats = true,
  showWeather = true,
  showPerformance = true,
}: DashboardAnalyticsProps) {
  const { currentTenant, analytics, isFeatureEnabled } = useTenant();
  const { usage, getUsagePercentage, isOverLimit } = useTenantUsage();
  const { hasAnalytics } = useTenantFeatures();
  
  const [selectedPeriod, setSelectedPeriod] = useState(period);
  const [isLoading, setIsLoading] = useState(false);

  // Verificar si el usuario tiene acceso a analytics
  if (!hasAnalytics) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-50 to-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Analytics Avanzado</h3>
          <p className="text-gray-600 mb-4">Actualiza tu plan para acceder a métricas detalladas y reportes avanzados.</p>
          <button className="bg-gradient-to-r from-blue-600 to-teal-600 text-white px-6 py-2 rounded-lg hover:from-blue-700 hover:to-teal-700 transition-all duration-200">
            Actualizar Plan
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header del Dashboard */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Dashboard Analytics</h2>
            <p className="text-gray-600 mt-1">
              {currentTenant?.settings.branding.companyName || 'BoatTrip Planner'} - Métricas de rendimiento
            </p>
          </div>
          
          <div className="flex items-center space-x-4 mt-4 sm:mt-0">
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value as any)}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="day">Hoy</option>
              <option value="week">Esta Semana</option>
              <option value="month">Este Mes</option>
              <option value="year">Este Año</option>
            </select>
            
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
              Exportar
            </button>
          </div>
        </div>
      </div>

      {/* Métricas Principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {showRevenue && (
          <MetricCard
            title="Ingresos Recurrentes"
            value={analytics?.metrics.revenue.mrr || 0}
            format="currency"
            change={analytics?.metrics.revenue.growth || 0}
            icon="revenue"
            color="green"
          />
        )}
        
        {showUsers && (
          <MetricCard
            title="Usuarios Activos"
            value={analytics?.metrics.users.active || 0}
            format="number"
            change={analytics?.metrics.users.retention || 0}
            icon="users"
            color="blue"
          />
        )}
        
        {showBoats && (
          <MetricCard
            title="Recomendaciones"
            value={analytics?.metrics.boats.recommendations || 0}
            format="number"
            change={analytics?.metrics.boats.conversions || 0}
            icon="boats"
            color="purple"
          />
        )}
        
        {showWeather && (
          <MetricCard
            title="Precisión Meteorológica"
            value={analytics?.metrics.weather.accuracy || 0}
            format="percentage"
            change={analytics?.metrics.weather.impact || 0}
            icon="weather"
            color="teal"
          />
        )}
      </div>

      {/* Gráficos y Visualizaciones */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Gráfico de Ingresos */}
        {showRevenue && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Evolución de Ingresos</h3>
            <RevenueChart data={analytics?.metrics.revenue.projections || []} />
          </div>
        )}

        {/* Gráfico de Uso */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Uso de Recursos</h3>
          <UsageChart usage={usage} />
        </div>
      </div>

      {/* Tabla de Métricas Detalladas */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Métricas Detalladas</h3>
        <DetailedMetricsTable analytics={analytics} usage={usage} />
      </div>

      {/* Alertas y Notificaciones */}
      <AlertsSection usage={usage} isOverLimit={isOverLimit} />
    </div>
  );
}

// Componente de Tarjeta de Métrica
interface MetricCardProps {
  title: string;
  value: number;
  format: 'currency' | 'number' | 'percentage';
  change: number;
  icon: string;
  color: 'green' | 'blue' | 'purple' | 'teal' | 'red' | 'yellow';
}

function MetricCard({ title, value, format, change, icon, color }: MetricCardProps) {
  const formatValue = (val: number, fmt: string) => {
    switch (fmt) {
      case 'currency':
        return new Intl.NumberFormat('es-ES', {
          style: 'currency',
          currency: 'EUR',
          minimumFractionDigits: 0,
        }).format(val);
      case 'percentage':
        return `${val.toFixed(1)}%`;
      default:
        return new Intl.NumberFormat('es-ES').format(val);
    }
  };

  const getIconColor = (color: string) => {
    const colors = {
      green: 'from-green-500 to-green-600',
      blue: 'from-blue-500 to-blue-600',
      purple: 'from-purple-500 to-purple-600',
      teal: 'from-teal-500 to-teal-600',
      red: 'from-red-500 to-red-600',
      yellow: 'from-yellow-500 to-yellow-600',
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">
            {formatValue(value, format)}
          </p>
          <div className="flex items-center mt-2">
            <span className={`text-sm font-medium ${change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {change >= 0 ? '+' : ''}{change.toFixed(1)}%
            </span>
            <span className="text-sm text-gray-500 ml-1">vs período anterior</span>
          </div>
        </div>
        
        <div className={`w-12 h-12 bg-gradient-to-br ${getIconColor(color)} rounded-lg flex items-center justify-center`}>
          <MetricIcon icon={icon} />
        </div>
      </div>
    </div>
  );
}

// Iconos para las métricas
function MetricIcon({ icon }: { icon: string }) {
  const icons = {
    revenue: (
      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
      </svg>
    ),
    users: (
      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
      </svg>
    ),
    boats: (
      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.75 17.25h16.5M2.25 17.25h19.5M2.25 13.5l3.879-3.879a3.375 3.375 0 014.772 0l2.098 2.098a3.375 3.375 0 004.771 0l3.88-3.879M2.25 9.75h19.5" />
      </svg>
    ),
    weather: (
      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
      </svg>
    ),
  };

  return icons[icon as keyof typeof icons] || icons.revenue;
}

// Gráfico de Ingresos
function RevenueChart({ data }: { data: any[] }) {
  if (!data || data.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-gray-500">
        No hay datos disponibles
      </div>
    );
  }

  return (
    <div className="h-64 flex items-center justify-center text-gray-500">
      Gráfico de Ingresos (Chart.js o Recharts)
    </div>
  );
}

// Gráfico de Uso
function UsageChart({ usage }: { usage: any }) {
  if (!usage) {
    return (
      <div className="h-64 flex items-center justify-center text-gray-500">
        No hay datos de uso disponibles
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <UsageBar label="Usuarios" current={usage.users?.current || 0} limit={usage.users?.limit || 100} />
      <UsageBar label="Barcos" current={usage.boats?.current || 0} limit={usage.boats?.limit || 50} />
      <UsageBar label="API Calls" current={usage.apiCalls?.current || 0} limit={usage.apiCalls?.limit || 1000} />
      <UsageBar label="Almacenamiento" current={usage.storage?.used || 0} limit={usage.storage?.limit || 1000} unit="MB" />
    </div>
  );
}

// Barra de Uso
function UsageBar({ label, current, limit, unit = '' }: { label: string; current: number; limit: number; unit?: string }) {
  const percentage = Math.min((current / limit) * 100, 100);
  const isOverLimit = percentage > 100;

  return (
    <div>
      <div className="flex justify-between text-sm mb-1">
        <span className="text-gray-600">{label}</span>
        <span className="text-gray-900">
          {current.toLocaleString()}{unit} / {limit.toLocaleString()}{unit}
        </span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className={`h-2 rounded-full transition-all duration-300 ${
            isOverLimit ? 'bg-red-500' : percentage > 80 ? 'bg-yellow-500' : 'bg-green-500'
          }`}
          style={{ width: `${Math.min(percentage, 100)}%` }}
        />
      </div>
    </div>
  );
}

// Tabla de Métricas Detalladas
function DetailedMetricsTable({ analytics, usage }: { analytics: any; usage: any }) {
  const metrics = [
    { label: 'MRR', value: analytics?.metrics.revenue.mrr || 0, format: 'currency' },
    { label: 'ARR', value: analytics?.metrics.revenue.arr || 0, format: 'currency' },
    { label: 'Churn Rate', value: analytics?.metrics.revenue.churn || 0, format: 'percentage' },
    { label: 'LTV', value: analytics?.metrics.revenue.ltv || 0, format: 'currency' },
    { label: 'CAC', value: analytics?.metrics.revenue.cac || 0, format: 'currency' },
    { label: 'Usuarios Totales', value: analytics?.metrics.users.total || 0, format: 'number' },
    { label: 'Usuarios Activos', value: analytics?.metrics.users.active || 0, format: 'number' },
    { label: 'Engagement', value: analytics?.metrics.users.engagement || 0, format: 'percentage' },
    { label: 'Barcos Totales', value: analytics?.metrics.boats.total || 0, format: 'number' },
    { label: 'Conversiones', value: analytics?.metrics.boats.conversions || 0, format: 'percentage' },
    { label: 'Rating Promedio', value: analytics?.metrics.boats.averageRating || 0, format: 'number' },
    { label: 'Precisión Meteorológica', value: analytics?.metrics.weather.accuracy || 0, format: 'percentage' },
  ];

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Métrica
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Valor
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Estado
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {metrics.map((metric, index) => (
            <tr key={index}>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {metric.label}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {formatMetricValue(metric.value, metric.format)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <MetricStatus value={metric.value} format={metric.format} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// Formatear valor de métrica
function formatMetricValue(value: number, format: string) {
  switch (format) {
    case 'currency':
      return new Intl.NumberFormat('es-ES', {
        style: 'currency',
        currency: 'EUR',
        minimumFractionDigits: 0,
      }).format(value);
    case 'percentage':
      return `${value.toFixed(1)}%`;
    default:
      return new Intl.NumberFormat('es-ES').format(value);
  }
}

// Estado de la métrica
function MetricStatus({ value, format }: { value: number; format: string }) {
  let status = 'neutral';
  
  if (format === 'percentage') {
    if (value >= 80) status = 'good';
    else if (value >= 60) status = 'warning';
    else status = 'bad';
  } else if (format === 'currency') {
    if (value > 0) status = 'good';
    else status = 'bad';
  }

  const statusConfig = {
    good: { color: 'bg-green-100 text-green-800', text: 'Excelente' },
    warning: { color: 'bg-yellow-100 text-yellow-800', text: 'Aceptable' },
    bad: { color: 'bg-red-100 text-red-800', text: 'Necesita Mejora' },
    neutral: { color: 'bg-gray-100 text-gray-800', text: 'Normal' },
  };

  const config = statusConfig[status as keyof typeof statusConfig];

  return (
    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${config.color}`}>
      {config.text}
    </span>
  );
}

// Sección de Alertas
function AlertsSection({ usage, isOverLimit }: { usage: any; isOverLimit: (metric: string) => boolean }) {
  const alerts = [];

  if (isOverLimit('users')) {
    alerts.push({
      type: 'warning',
      title: 'Límite de Usuarios Excedido',
      message: 'Has superado el límite de usuarios de tu plan actual.',
      action: 'Actualizar Plan',
    });
  }

  if (isOverLimit('apiCalls')) {
    alerts.push({
      type: 'error',
      title: 'Límite de API Calls Excedido',
      message: 'Has superado el límite de llamadas a la API.',
      action: 'Actualizar Plan',
    });
  }

  if (alerts.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      {alerts.map((alert, index) => (
        <div
          key={index}
          className={`p-4 rounded-lg border ${
            alert.type === 'error'
              ? 'bg-red-50 border-red-200 text-red-800'
              : 'bg-yellow-50 border-yellow-200 text-yellow-800'
          }`}
        >
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-semibold">{alert.title}</h4>
              <p className="text-sm mt-1">{alert.message}</p>
            </div>
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm">
              {alert.action}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
} 