import { useState, useEffect, useCallback } from 'react';

export interface ChecklistItem {
  id: string;
  title: string;
  description: string;
  category: string;
  isEssential: boolean;
  isCompleted: boolean;
  amazonProducts?: AmazonProduct[];
  tips?: string[];
  completedAt?: string;
}

export interface AmazonProduct {
  name: string;
  price: string;
  rating: number;
  reviewCount: number;
  imageUrl: string;
  affiliateUrl: string;
  category: string;
}

export interface ChecklistData {
  id: string;
  type: 'safety' | 'equipment' | 'destination' | 'maintenance' | 'emergency';
  title: string;
  description: string;
  items: ChecklistItem[];
}

export interface ChecklistProgress {
  checklistId: string;
  completedItems: string[];
  totalItems: number;
  progress: number;
  lastUpdated: string;
  timeSpent: number; // en minutos
}

export interface ChecklistAnalytics {
  totalChecklistsStarted: number;
  totalChecklistsCompleted: number;
  totalItemsCompleted: number;
  averageCompletionRate: number;
  mostPopularCategory: string;
  averageTimeToComplete: number;
  productClicks: number;
  shares: number;
  downloads: number;
}

const STORAGE_KEY = 'nautical_checklists_progress';
const ANALYTICS_KEY = 'nautical_checklists_analytics';

export const useChecklistManager = () => {
  const [checklists, setChecklists] = useState<Record<string, ChecklistData>>({});
  const [progress, setProgress] = useState<Record<string, ChecklistProgress>>({});
  const [analytics, setAnalytics] = useState<ChecklistAnalytics>({
    totalChecklistsStarted: 0,
    totalChecklistsCompleted: 0,
    totalItemsCompleted: 0,
    averageCompletionRate: 0,
    mostPopularCategory: '',
    averageTimeToComplete: 0,
    productClicks: 0,
    shares: 0,
    downloads: 0
  });

  // Cargar datos del localStorage al inicializar
  useEffect(() => {
    loadFromStorage();
  }, []);

  // Guardar en localStorage cuando cambie el progreso
  useEffect(() => {
    saveToStorage();
  }, [progress, analytics]);

  const loadFromStorage = useCallback(() => {
    try {
      const savedProgress = localStorage.getItem(STORAGE_KEY);
      const savedAnalytics = localStorage.getItem(ANALYTICS_KEY);
      
      if (savedProgress) {
        setProgress(JSON.parse(savedProgress));
      }
      
      if (savedAnalytics) {
        setAnalytics(JSON.parse(savedAnalytics));
      }
    } catch (error) {
      console.error('Error loading checklists from storage:', error);
    }
  }, []);

  const saveToStorage = useCallback(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
      localStorage.setItem(ANALYTICS_KEY, JSON.stringify(analytics));
    } catch (error) {
      console.error('Error saving checklists to storage:', error);
    }
  }, [progress, analytics]);

  const startChecklist = useCallback((checklistId: string) => {
    setProgress(prev => {
      const existing = prev[checklistId];
      if (!existing) {
        // Nuevo checklist iniciado
        const newProgress: ChecklistProgress = {
          checklistId,
          completedItems: [],
          totalItems: 0,
          progress: 0,
          lastUpdated: new Date().toISOString(),
          timeSpent: 0
        };
        
        setAnalytics(prevAnalytics => ({
          ...prevAnalytics,
          totalChecklistsStarted: prevAnalytics.totalChecklistsStarted + 1
        }));
        
        return { ...prev, [checklistId]: newProgress };
      }
      return prev;
    });
  }, []);

  const toggleItem = useCallback((checklistId: string, itemId: string, isCompleted: boolean) => {
    setProgress(prev => {
      const current = prev[checklistId];
      if (!current) return prev;

      const updatedCompletedItems = isCompleted
        ? [...current.completedItems, itemId]
        : current.completedItems.filter(id => id !== itemId);

      const updatedProgress: ChecklistProgress = {
        ...current,
        completedItems: updatedCompletedItems,
        progress: (updatedCompletedItems.length / current.totalItems) * 100,
        lastUpdated: new Date().toISOString()
      };

      // Actualizar analytics
      setAnalytics(prevAnalytics => ({
        ...prevAnalytics,
        totalItemsCompleted: isCompleted 
          ? prevAnalytics.totalItemsCompleted + 1 
          : prevAnalytics.totalItemsCompleted - 1
      }));

      // Verificar si el checklist está completo
      if (updatedCompletedItems.length === current.totalItems && !current.completedItems.includes(itemId)) {
        setAnalytics(prevAnalytics => ({
          ...prevAnalytics,
          totalChecklistsCompleted: prevAnalytics.totalChecklistsCompleted + 1
        }));
      }

      return { ...prev, [checklistId]: updatedProgress };
    });
  }, []);

  const updateChecklistTotal = useCallback((checklistId: string, totalItems: number) => {
    setProgress(prev => {
      const current = prev[checklistId];
      if (!current) return prev;

      return {
        ...prev,
        [checklistId]: {
          ...current,
          totalItems,
          progress: (current.completedItems.length / totalItems) * 100
        }
      };
    });
  }, []);

  const resetChecklist = useCallback((checklistId: string) => {
    setProgress(prev => {
      const current = prev[checklistId];
      if (!current) return prev;

      return {
        ...prev,
        [checklistId]: {
          ...current,
          completedItems: [],
          progress: 0,
          lastUpdated: new Date().toISOString(),
          timeSpent: 0
        }
      };
    });
  }, []);

  const trackProductClick = useCallback((productName: string, category: string) => {
    setAnalytics(prev => ({
      ...prev,
      productClicks: prev.productClicks + 1
    }));

    // Aquí podrías enviar a Google Analytics o similar
    if (typeof gtag !== 'undefined') {
      gtag('event', 'product_click', {
        product_name: productName,
        product_category: category,
        checklist_type: 'nautical'
      });
    }
  }, []);

  const trackShare = useCallback((checklistId: string, platform?: string) => {
    setAnalytics(prev => ({
      ...prev,
      shares: prev.shares + 1
    }));

    // Analytics
    if (typeof gtag !== 'undefined') {
      gtag('event', 'checklist_share', {
        checklist_id: checklistId,
        platform: platform || 'web',
        checklist_type: 'nautical'
      });
    }
  }, []);

  const trackDownload = useCallback((checklistId: string) => {
    setAnalytics(prev => ({
      ...prev,
      downloads: prev.downloads + 1
    }));

    // Analytics
    if (typeof gtag !== 'undefined') {
      gtag('event', 'checklist_download', {
        checklist_id: checklistId,
        checklist_type: 'nautical'
      });
    }
  }, []);

  const getChecklistProgress = useCallback((checklistId: string): ChecklistProgress | null => {
    return progress[checklistId] || null;
  }, [progress]);

  const getAllProgress = useCallback((): ChecklistProgress[] => {
    return Object.values(progress);
  }, [progress]);

  const getCompletionStats = useCallback(() => {
    const totalStarted = analytics.totalChecklistsStarted;
    const totalCompleted = analytics.totalChecklistsCompleted;
    const completionRate = totalStarted > 0 ? (totalCompleted / totalStarted) * 100 : 0;

    return {
      totalStarted,
      totalCompleted,
      completionRate: Math.round(completionRate * 100) / 100,
      averageItemsCompleted: analytics.totalItemsCompleted,
      averageCompletionRate: analytics.averageCompletionRate
    };
  }, [analytics]);

  const exportProgress = useCallback(() => {
    const exportData = {
      progress,
      analytics,
      exportedAt: new Date().toISOString(),
      version: '1.0'
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { 
      type: 'application/json' 
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `nautical-checklists-progress-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [progress, analytics]);

  const importProgress = useCallback((file: File) => {
    return new Promise<void>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = JSON.parse(e.target?.result as string);
          if (data.progress && data.analytics) {
            setProgress(data.progress);
            setAnalytics(data.analytics);
            resolve();
          } else {
            reject(new Error('Formato de archivo inválido'));
          }
        } catch (error) {
          reject(error);
        }
      };
      reader.onerror = () => reject(new Error('Error leyendo archivo'));
      reader.readAsText(file);
    });
  }, []);

  const clearAllProgress = useCallback(() => {
    setProgress({});
    setAnalytics({
      totalChecklistsStarted: 0,
      totalChecklistsCompleted: 0,
      totalItemsCompleted: 0,
      averageCompletionRate: 0,
      mostPopularCategory: '',
      averageTimeToComplete: 0,
      productClicks: 0,
      shares: 0,
      downloads: 0
    });
  }, []);

  return {
    // Estado
    progress,
    analytics,
    
    // Acciones principales
    startChecklist,
    toggleItem,
    updateChecklistTotal,
    resetChecklist,
    
    // Tracking
    trackProductClick,
    trackShare,
    trackDownload,
    
    // Consultas
    getChecklistProgress,
    getAllProgress,
    getCompletionStats,
    
    // Import/Export
    exportProgress,
    importProgress,
    clearAllProgress,
    
    // Utilidades
    loadFromStorage,
    saveToStorage
  };
};

// Declaración global para gtag (Google Analytics)
declare global {
  interface Window {
    gtag: (...args: any[]) => void;
  }
}

const gtag = typeof window !== 'undefined' ? window.gtag : undefined;
