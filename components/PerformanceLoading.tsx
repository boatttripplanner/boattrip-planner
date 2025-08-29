// components/PerformanceLoading.tsx
// ⚡ Componente de loading optimizado para performance

import React from 'react';
import { LoadingSkeleton } from './LazyComponent';

// Skeleton Loading Components optimizados
export const CardSkeleton = () => (
  <div className="animate-pulse bg-white rounded-lg shadow-md p-6">
    <div className="flex items-center space-x-4 mb-4">
      <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
      <div className="flex-1">
        <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
        <div className="h-3 bg-gray-200 rounded w-1/2"></div>
      </div>
    </div>
    <div className="space-y-3">
      <div className="h-4 bg-gray-200 rounded"></div>
      <div className="h-4 bg-gray-200 rounded w-5/6"></div>
      <div className="h-4 bg-gray-200 rounded w-4/6"></div>
    </div>
    <div className="mt-4 flex space-x-2">
      <div className="h-8 bg-gray-200 rounded w-20"></div>
      <div className="h-8 bg-gray-200 rounded w-24"></div>
    </div>
  </div>
);

export const BlogPostSkeleton = () => (
  <div className="animate-pulse space-y-6">
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
      <div className="h-4 bg-gray-200 rounded w-1/3 mb-6"></div>
      <div className="h-64 bg-gray-200 rounded mb-4"></div>
      <div className="space-y-3">
        <div className="h-4 bg-gray-200 rounded"></div>
        <div className="h-4 bg-gray-200 rounded"></div>
        <div className="h-4 bg-gray-200 rounded w-5/6"></div>
        <div className="h-4 bg-gray-200 rounded w-4/6"></div>
      </div>
    </div>
  </div>
);

export const RecommendationSkeleton = () => (
  <div className="animate-pulse bg-white rounded-lg shadow-md p-6">
    <div className="flex items-center space-x-4 mb-4">
      <div className="w-16 h-16 bg-gray-200 rounded-lg"></div>
      <div className="flex-1">
        <div className="h-5 bg-gray-200 rounded w-3/4 mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
      </div>
    </div>
    <div className="space-y-3 mb-4">
      <div className="h-4 bg-gray-200 rounded"></div>
      <div className="h-4 bg-gray-200 rounded w-5/6"></div>
    </div>
    <div className="flex justify-between items-center">
      <div className="h-8 bg-gray-200 rounded w-24"></div>
      <div className="h-8 bg-gray-200 rounded w-20"></div>
    </div>
  </div>
);

export const FormSkeleton = () => (
  <div className="animate-pulse space-y-6">
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="h-6 bg-gray-200 rounded w-1/3 mb-6"></div>
      <div className="space-y-4">
        <div>
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
          <div className="h-10 bg-gray-200 rounded"></div>
        </div>
        <div>
          <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
          <div className="h-10 bg-gray-200 rounded"></div>
        </div>
        <div>
          <div className="h-4 bg-gray-200 rounded w-1/5 mb-2"></div>
          <div className="h-20 bg-gray-200 rounded"></div>
        </div>
      </div>
      <div className="mt-6">
        <div className="h-10 bg-gray-200 rounded w-32"></div>
      </div>
    </div>
  </div>
);

export const NavigationSkeleton = () => (
  <div className="animate-pulse bg-white shadow-md">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between items-center h-16">
        <div className="h-8 bg-gray-200 rounded w-32"></div>
        <div className="hidden md:flex space-x-8">
          <div className="h-6 bg-gray-200 rounded w-20"></div>
          <div className="h-6 bg-gray-200 rounded w-24"></div>
          <div className="h-6 bg-gray-200 rounded w-16"></div>
          <div className="h-6 bg-gray-200 rounded w-28"></div>
        </div>
        <div className="h-8 bg-gray-200 rounded w-20"></div>
      </div>
    </div>
  </div>
);

export const DashboardSkeleton = () => (
  <div className="animate-pulse space-y-6">
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="h-24 bg-gray-200 rounded"></div>
        <div className="h-24 bg-gray-200 rounded"></div>
        <div className="h-24 bg-gray-200 rounded"></div>
      </div>
    </div>
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
      <div className="space-y-3">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-12 bg-gray-200 rounded"></div>
        ))}
      </div>
    </div>
  </div>
);

// Componente principal de Performance Loading
interface PerformanceLoadingProps {
  type?: 'card' | 'blog' | 'recommendation' | 'form' | 'navigation' | 'dashboard' | 'default';
  count?: number;
  className?: string;
}

const PerformanceLoading: React.FC<PerformanceLoadingProps> = ({ 
  type = 'default', 
  count = 1, 
  className = '' 
}) => {
  const renderSkeleton = () => {
    switch (type) {
      case 'card':
        return <CardSkeleton />;
      case 'blog':
        return <BlogPostSkeleton />;
      case 'recommendation':
        return <RecommendationSkeleton />;
      case 'form':
        return <FormSkeleton />;
      case 'navigation':
        return <NavigationSkeleton />;
      case 'dashboard':
        return <DashboardSkeleton />;
      default:
        return <LoadingSkeleton />;
    }
  };

  return (
    <div className={className}>
      {[...Array(count)].map((_, index) => (
        <div key={index} className={index > 0 ? 'mt-4' : ''}>
          {renderSkeleton()}
        </div>
      ))}
    </div>
  );
};

export default PerformanceLoading;
export {
  CardSkeleton,
  BlogPostSkeleton,
  RecommendationSkeleton,
  FormSkeleton,
  NavigationSkeleton,
  DashboardSkeleton
};
