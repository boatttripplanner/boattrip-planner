import React, { useState, useRef } from 'react';
import { useChecklistManager } from '../hooks/useChecklistManager';
import { 
  BarChart3Icon, 
  DownloadIcon, 
  UploadIcon, 
  TrashIcon, 
  TrendingUpIcon,
  CheckCircleIcon,
  ClockIcon,
  ShareIcon,
  ShoppingCartIcon
} from './icons';

const ChecklistDashboard: React.FC = () => {
  const {
    progress,
    analytics,
    getCompletionStats,
    exportProgress,
    importProgress,
    clearAllProgress
  } = useChecklistManager();

  const [isImporting, setIsImporting] = useState(false);
  const [importError, setImportError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const stats = getCompletionStats();

  const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsImporting(true);
    setImportError(null);

    try {
      await importProgress(file);
      setImportError(null);
    } catch (error) {
      setImportError(error instanceof Error ? error.message : 'Error al importar archivo');
    } finally {
      setIsImporting(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleClearAll = () => {
    if (window.confirm('¿Estás seguro de que quieres borrar todo el progreso? Esta acción no se puede deshacer.')) {
      clearAllProgress();
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getProgressColor = (progress: number) => {
    if (progress >= 80) return 'text-green-600 bg-green-100';
    if (progress >= 60) return 'text-yellow-600 bg-yellow-100';
    if (progress >= 40) return 'text-orange-600 bg-orange-100';
    return 'text-red-600 bg-red-100';
  };

  const getProgressBarColor = (progress: number) => {
    if (progress >= 80) return 'bg-green-500';
    if (progress >= 60) return 'bg-yellow-500';
    if (progress >= 40) return 'bg-orange-500';
    return 'bg-red-500';
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          📊 Dashboard de Checklists Náuticos
        </h1>
        <p className="text-xl text-gray-600">
          Gestiona tu progreso, revisa estadísticas y optimiza tu experiencia náutica
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Checklists Iniciados</p>
              <p className="text-3xl font-bold text-blue-600">{stats.totalStarted}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <BarChart3Icon className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Checklists Completados</p>
              <p className="text-3xl font-bold text-green-600">{stats.totalCompleted}</p>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <CheckCircleIcon className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Tasa de Completado</p>
              <p className="text-3xl font-bold text-purple-600">{stats.completionRate}%</p>
            </div>
            <div className="p-3 bg-purple-100 rounded-full">
              <TrendingUpIcon className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Items Completados</p>
              <p className="text-3xl font-bold text-orange-600">{stats.averageItemsCompleted}</p>
            </div>
            <div className="p-3 bg-orange-100 rounded-full">
              <CheckCircleIcon className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Engagement Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 bg-blue-100 rounded-lg">
              <ShoppingCartIcon className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Clicks en Productos</p>
              <p className="text-2xl font-bold text-blue-600">{analytics.productClicks}</p>
            </div>
          </div>
          <div className="text-xs text-gray-500">
            Productos Amazon visitados desde checklists
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 bg-green-100 rounded-lg">
              <ShareIcon className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Compartidos</p>
              <p className="text-2xl font-bold text-green-600">{analytics.shares}</p>
            </div>
          </div>
          <div className="text-xs text-gray-500">
            Checklists compartidos en redes sociales
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 bg-purple-100 rounded-lg">
              <DownloadIcon className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Descargados</p>
              <p className="text-2xl font-bold text-purple-600">{analytics.downloads}</p>
            </div>
          </div>
          <div className="text-xs text-gray-500">
            Checklists descargados como JSON
          </div>
        </div>
      </div>

      {/* Progress Table */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 mb-8">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Progreso de Checklists</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Checklist
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Progreso
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Items Completados
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Última Actualización
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tiempo Invertido
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {Object.entries(progress).map(([checklistId, checklistProgress]) => (
                <tr key={checklistId} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {checklistId.charAt(0).toUpperCase() + checklistId.slice(1)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-3">
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full transition-all duration-300 ${getProgressBarColor(checklistProgress.progress)}`}
                          style={{ width: `${checklistProgress.progress}%` }}
                        />
                      </div>
                      <span className={`text-sm font-medium px-2 py-1 rounded-full ${getProgressColor(checklistProgress.progress)}`}>
                        {Math.round(checklistProgress.progress)}%
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {checklistProgress.completedItems.length} / {checklistProgress.totalItems}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(checklistProgress.lastUpdated)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {checklistProgress.timeSpent > 0 ? (
                      <div className="flex items-center space-x-1">
                        <ClockIcon className="w-4 h-4" />
                        <span>{checklistProgress.timeSpent} min</span>
                      </div>
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </td>
                </tr>
              ))}
              {Object.keys(progress).length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                    <div className="text-center">
                      <BarChart3Icon className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                      <p className="text-lg font-medium text-gray-900 mb-2">No hay progreso registrado</p>
                      <p className="text-gray-500">Comienza un checklist para ver tu progreso aquí</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Actions */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Acciones</h2>
        <div className="flex flex-wrap gap-4">
          <button
            onClick={exportProgress}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <DownloadIcon className="w-5 h-5" />
            <span>Exportar Progreso</span>
          </button>

          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <UploadIcon className="w-5 h-5" />
            <span>Importar Progreso</span>
          </button>

          <button
            onClick={handleClearAll}
            className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            <TrashIcon className="w-5 h-5" />
            <span>Borrar Todo</span>
          </button>
        </div>

        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          accept=".json"
          onChange={handleImport}
          className="hidden"
        />

        {/* Import Status */}
        {isImporting && (
          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-blue-800">Importando archivo...</p>
          </div>
        )}

        {importError && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-800">Error: {importError}</p>
          </div>
        )}
      </div>

      {/* Tips Section */}
      <div className="mt-8 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
          💡 Consejos para Maximizar tu Experiencia
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-3xl mb-3">🎯</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Completa Checklists Completos</h3>
            <p className="text-gray-600 text-sm">
              Los checklists completos te dan acceso a productos premium y descuentos exclusivos
            </p>
          </div>
          <div className="text-center">
            <div className="text-3xl mb-3">📱</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Comparte tu Progreso</h3>
            <p className="text-gray-600 text-sm">
              Compartir en redes sociales puede desbloquear contenido adicional y ofertas especiales
            </p>
          </div>
          <div className="text-center">
            <div className="text-3xl mb-3">🔄</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Revisa Regularmente</h3>
            <p className="text-gray-600 text-sm">
              Los checklists se actualizan mensualmente con nuevos productos y consejos
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChecklistDashboard;
