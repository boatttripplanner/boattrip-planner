import React, { useState, useEffect } from 'react';
import { CheckIcon, BookmarkIcon, ShareIcon, DownloadIcon, ShoppingCartIcon } from './icons';
import { useChecklistManager } from '../hooks/useChecklistManager';

interface ChecklistItem {
  id: string;
  title: string;
  description: string;
  category: string;
  isEssential: boolean;
  isCompleted: boolean;
  amazonProducts?: AmazonProduct[];
  tips?: string[];
}

interface AmazonProduct {
  name: string;
  price: string;
  rating: number;
  reviewCount: number;
  imageUrl: string;
  affiliateUrl: string;
  category: string;
}

interface InteractiveChecklistProps {
  checklistType: 'safety' | 'equipment' | 'destination' | 'maintenance' | 'emergency';
  title: string;
  description: string;
  items: ChecklistItem[];
  onComplete?: (completedItems: string[]) => void;
  onShare?: (checklistData: any) => void;
  onDownload?: () => void;
}

const InteractiveChecklist: React.FC<InteractiveChecklistProps> = ({
  checklistType,
  title,
  description,
  items,
  onComplete,
  onShare,
  onDownload
}) => {
  const {
    startChecklist,
    toggleItem: toggleItemManager,
    updateChecklistTotal,
    getChecklistProgress,
    trackProductClick,
    trackShare,
    trackDownload
  } = useChecklistManager();

  const checklistId = `${checklistType}-${title.toLowerCase().replace(/\s+/g, '-')}`;
  const [checklistItems, setChecklistItems] = useState<ChecklistItem[]>(items);
  const [completedCount, setCompletedCount] = useState(0);
  const [showCompleted, setShowCompleted] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Inicializar checklist en el manager
    startChecklist(checklistId);
    updateChecklistTotal(checklistId, items.length);
    
    // Cargar progreso guardado
    const savedProgress = getChecklistProgress(checklistId);
    if (savedProgress) {
      const updatedItems = items.map(item => ({
        ...item,
        isCompleted: savedProgress.completedItems.includes(item.id)
      }));
      setChecklistItems(updatedItems);
    }
  }, [checklistId, items.length, startChecklist, updateChecklistTotal, getChecklistProgress]);

  useEffect(() => {
    const completed = checklistItems.filter(item => item.isCompleted).length;
    setCompletedCount(completed);
    setProgress((completed / checklistItems.length) * 100);
  }, [checklistItems]);

  const toggleItem = (itemId: string) => {
    const newCompletedState = !checklistItems.find(item => item.id === itemId)?.isCompleted;
    
    setChecklistItems(prev => 
      prev.map(item => 
        item.id === itemId 
          ? { ...item, isCompleted: newCompletedState }
          : item
      )
    );
    
    // Actualizar en el manager
    toggleItemManager(checklistId, itemId, newCompletedState);
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'safety': return '🦺';
      case 'navigation': return '🧭';
      case 'communication': return '📻';
      case 'comfort': return '😌';
      case 'maintenance': return '🔧';
      case 'emergency': return '🚨';
      default: return '📋';
    }
  };

  const getProgressColor = (progress: number) => {
    if (progress >= 80) return 'text-green-600';
    if (progress >= 60) return 'text-yellow-600';
    if (progress >= 40) return 'text-orange-600';
    return 'text-red-600';
  };

  const handleShare = () => {
    const shareData = {
      title: `${title} - Checklist Náutico`,
      text: `He completado ${completedCount} de ${checklistItems.length} items en mi checklist de ${title}`,
      url: window.location.href
    };

    if (navigator.share) {
      navigator.share(shareData);
    } else {
      // Fallback para navegadores que no soportan Web Share API
      navigator.clipboard.writeText(`${shareData.title}\n${shareData.text}\n${shareData.url}`);
      alert('¡Enlace copiado al portapapeles!');
    }

    // Tracking
    trackShare(checklistId, 'web');
    onShare?.(shareData);
  };

  const handleDownload = () => {
    const checklistData = {
      title,
      description,
      completedItems: checklistItems.filter(item => item.isCompleted),
      totalItems: checklistItems.length,
      completedAt: new Date().toISOString(),
      progress: `${completedCount}/${checklistItems.length}`
    };

    const blob = new Blob([JSON.stringify(checklistData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `checklist-${checklistType}-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    // Tracking
    trackDownload(checklistId);
    onDownload?.();
  };

  const filteredItems = selectedCategory === 'all' 
    ? checklistItems 
    : checklistItems.filter(item => item.category === selectedCategory);

  const categories = ['all', ...Array.from(new Set(checklistItems.map(item => item.category))];

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <span className="text-3xl">{getCategoryIcon(checklistType)}</span>
            <div>
              <h2 className="text-2xl font-bold">{title}</h2>
              <p className="text-blue-100">{description}</p>
            </div>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => setIsBookmarked(!isBookmarked)}
              className={`p-2 rounded-full transition-colors ${
                isBookmarked ? 'bg-yellow-500 text-white' : 'bg-white/20 hover:bg-white/30'
              }`}
            >
              <BookmarkIcon className="w-5 h-5" />
            </button>
            <button
              onClick={handleShare}
              className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
            >
              <ShareIcon className="w-5 h-5" />
            </button>
            <button
              onClick={handleDownload}
              className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
            >
              <DownloadIcon className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Progreso</span>
            <span className={`text-sm font-bold ${getProgressColor(progress)}`}>
              {completedCount} de {checklistItems.length} completado
            </span>
          </div>
          <div className="w-full bg-white/20 rounded-full h-3">
            <div 
              className={`h-3 rounded-full transition-all duration-500 ${
                progress >= 80 ? 'bg-green-400' : 
                progress >= 60 ? 'bg-yellow-400' : 
                progress >= 40 ? 'bg-orange-400' : 'bg-red-400'
              }`}
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>

      {/* Category Filter */}
      <div className="p-4 bg-gray-50 border-b">
        <div className="flex flex-wrap gap-2">
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                selectedCategory === category
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              {category === 'all' ? 'Todos' : category.charAt(0).toUpperCase() + category.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Checklist Items */}
      <div className="p-6">
        <div className="space-y-4">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className={`border rounded-lg p-4 transition-all duration-200 ${
                item.isCompleted
                  ? 'bg-green-50 border-green-200'
                  : 'bg-white border-gray-200 hover:border-blue-300'
              }`}
            >
              <div className="flex items-start space-x-3">
                <button
                  onClick={() => toggleItem(item.id)}
                  className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                    item.isCompleted
                      ? 'bg-green-500 border-green-500 text-white'
                      : 'border-gray-300 hover:border-blue-500'
                  }`}
                >
                  {item.isCompleted && <CheckIcon className="w-4 h-4" />}
                </button>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-2">
                    <h3 className={`font-medium ${
                      item.isCompleted ? 'text-green-800 line-through' : 'text-gray-900'
                    }`}>
                      {item.title}
                    </h3>
                    {item.isEssential && (
                      <span className="px-2 py-1 bg-red-100 text-red-800 text-xs font-medium rounded-full">
                        Esencial
                      </span>
                    )}
                    <span className="text-gray-500 text-sm">
                      {getCategoryIcon(item.category)}
                    </span>
                  </div>
                  
                  <p className={`text-sm mb-3 ${
                    item.isCompleted ? 'text-green-700' : 'text-gray-600'
                  }`}>
                    {item.description}
                  </p>

                  {/* Tips */}
                  {item.tips && item.tips.length > 0 && (
                    <div className="mb-3">
                      <p className="text-xs font-medium text-blue-600 mb-2">💡 Consejos:</p>
                      <ul className="text-xs text-gray-600 space-y-1">
                        {item.tips.map((tip, index) => (
                          <li key={index} className="flex items-start space-x-2">
                            <span className="text-blue-400 mt-1">•</span>
                            <span>{tip}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Amazon Products */}
                  {item.amazonProducts && item.amazonProducts.length > 0 && (
                    <div className="mt-4">
                      <p className="text-xs font-medium text-orange-600 mb-2">
                        🛒 Productos Recomendados:
                      </p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                        {item.amazonProducts.map((product, index) => (
                                                     <a
                             key={index}
                             href={product.affiliateUrl}
                             target="_blank"
                             rel="noopener noreferrer"
                             className="block p-3 border border-gray-200 rounded-lg hover:border-orange-300 hover:shadow-md transition-all group"
                             onClick={() => trackProductClick(product.name, product.category)}
                           >
                            <div className="flex items-center space-x-3">
                              <img
                                src={product.imageUrl}
                                alt={product.name}
                                className="w-12 h-12 object-cover rounded-md"
                              />
                              <div className="flex-1 min-w-0">
                                <h4 className="text-sm font-medium text-gray-900 group-hover:text-orange-600 truncate">
                                  {product.name}
                                </h4>
                                <div className="flex items-center space-x-2 mt-1">
                                  <div className="flex items-center">
                                    {[...Array(5)].map((_, i) => (
                                      <span
                                        key={i}
                                        className={`text-xs ${
                                          i < Math.floor(product.rating)
                                            ? 'text-yellow-400'
                                            : 'text-gray-300'
                                        }`}
                                      >
                                        ★
                                      </span>
                                    ))}
                                  </div>
                                  <span className="text-xs text-gray-500">
                                    ({product.reviewCount})
                                  </span>
                                </div>
                                <p className="text-sm font-bold text-orange-600 mt-1">
                                  {product.price}
                                </p>
                              </div>
                              <ShoppingCartIcon className="w-5 h-5 text-gray-400 group-hover:text-orange-500" />
                            </div>
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Completion Message */}
        {completedCount === checklistItems.length && (
          <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg text-center">
            <div className="text-4xl mb-2">🎉</div>
            <h3 className="text-lg font-bold text-green-800 mb-2">
              ¡Checklist Completado!
            </h3>
            <p className="text-green-700">
              Has completado todos los items. ¡Estás listo para tu aventura náutica!
            </p>
            <button
              onClick={() => {
                setChecklistItems(prev => prev.map(item => ({ ...item, isCompleted: false })));
              }}
              className="mt-3 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              Reiniciar Checklist
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default InteractiveChecklist;
