// components/LazyComponent.tsx
// 🚀 Componente de Lazy Loading para optimizar performance

import React, { Suspense, lazy, Component, ErrorInfo, ReactNode } from 'react';
import LoadingSpinner from './LoadingSpinner';

// Error Boundary para manejar errores en componentes lazy
interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Error en componente lazy:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="p-4 text-center text-red-600 bg-red-50 rounded-lg">
          <p>Algo salió mal al cargar este componente.</p>
          <button 
            onClick={() => this.setState({ hasError: false })}
            className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Reintentar
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

// Skeleton Loading Component
const LoadingSkeleton = () => (
  <div className="animate-pulse space-y-4 p-4">
    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
    <div className="space-y-3">
      <div className="h-4 bg-gray-200 rounded"></div>
      <div className="h-4 bg-gray-200 rounded w-5/6"></div>
      <div className="h-4 bg-gray-200 rounded w-4/6"></div>
    </div>
    <div className="h-32 bg-gray-200 rounded"></div>
  </div>
);

// Componente Lazy mejorado con preloading
interface LazyComponentProps {
  importFunc: () => Promise<{ default: React.ComponentType<any> }>;
  fallback?: ReactNode;
  preload?: boolean;
  [key: string]: any;
}

const LazyComponent: React.FC<LazyComponentProps> = ({ 
  importFunc, 
  fallback = <LoadingSkeleton />,
  preload = false,
  ...props 
}) => {
  const LazyLoadedComponent = lazy(importFunc);

  // Preload opcional para componentes críticos
  React.useEffect(() => {
    if (preload) {
      importFunc();
    }
  }, [importFunc, preload]);

  return (
    <ErrorBoundary>
      <Suspense fallback={fallback}>
        <LazyLoadedComponent {...props} />
      </Suspense>
    </ErrorBoundary>
  );
};

export default LazyComponent;
export { LoadingSkeleton, ErrorBoundary };

// Componentes lazy predefinidos para mejor performance
export const LazyBlogPost = lazy(() => import('./BlogPostPage'));
export const LazyBlogIndex = lazy(() => import('../src/components/BlogIndexPage'));
export const LazyItineraryMap = lazy(() => import('./ItineraryMap'));
export const LazyChatInterface = lazy(() => import('./ChatInterface'));
export const LazyAdvancedAffiliateDashboard = lazy(() => import('./AdvancedAffiliateDashboard'));
