import React, { useState } from 'react';
import { Button } from './Button';

interface RecommendationFallbackProps {
  error: string;
  onRetry: () => void;
  onShowTrending?: () => void;
  query?: string;
  category?: string;
  className?: string;
}

const RecommendationFallback: React.FC<RecommendationFallbackProps> = ({
  error,
  onRetry,
  onShowTrending,
  query,
  category,
  className = ""
}) => {
  const [isRetrying, setIsRetrying] = useState(false);

  const handleRetry = async () => {
    setIsRetrying(true);
    try {
      await onRetry();
    } finally {
      setIsRetrying(false);
    }
  };

  return (
    <div className={`bg-gradient-to-br from-red-50 to-orange-50 border border-red-200 rounded-lg p-6 my-8 ${className}`}>
      <div className="text-center">
        <div className="text-4xl mb-4">⚠️</div>
        <h3 className="text-xl font-bold text-red-700 mb-3">
          No se pudieron cargar las recomendaciones
        </h3>
        
        <div className="text-red-600 mb-4">
          <p className="mb-2">{error}</p>
          {query && (
            <p className="text-sm text-red-500">
              Búsqueda: "{query}" | Categoría: "{category || 'nautical'}"
            </p>
          )}
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
          <Button
            onClick={handleRetry}
            variant="primary"
            size="lg"
            disabled={isRetrying}
            className="min-w-[140px]"
          >
            {isRetrying ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Reintentando...
              </>
            ) : (
              '🔄 Reintentar'
            )}
          </Button>

          {onShowTrending && (
            <Button
              onClick={onShowTrending}
              variant="secondary"
              size="lg"
              className="min-w-[140px]"
            >
              🔥 Ver Trending
            </Button>
          )}

          <Button
            onClick={() => window.location.reload()}
            variant="outline"
            size="lg"
            className="min-w-[140px]"
          >
            🔄 Recargar Página
          </Button>
        </div>

        <div className="mt-6 bg-white rounded-lg p-4 border border-red-200">
          <h4 className="font-semibold text-gray-800 mb-2">💡 Soluciones posibles:</h4>
          <ul className="text-sm text-gray-600 space-y-1 text-left">
            <li>• Verifica tu conexión a internet</li>
            <li>• Intenta recargar la página</li>
            <li>• Si el problema persiste, contacta con soporte</li>
            <li>• Mientras tanto, puedes explorar nuestros artículos del blog</li>
          </ul>
        </div>

        <div className="mt-4 text-xs text-gray-500">
          <p>¿Necesitas ayuda? Visita <a href="https://www.boattrip-planner.com" className="text-blue-600 hover:underline">www.boattrip-planner.com</a></p>
        </div>
      </div>
    </div>
  );
};

export default RecommendationFallback;
