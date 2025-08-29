import React, { useState } from 'react';
import { Filter, X, ChevronDown, ChevronUp } from 'lucide-react';
import { BlogFilters as BlogFiltersType } from '../hooks/useBlogSearch';

interface BlogFiltersProps {
  filters: BlogFiltersType;
  onUpdateFilters: (newFilters: Partial<BlogFiltersType>) => void;
  onResetFilters: () => void;
  availableTags: string[];
  availableCategories: string[];
  totalPosts: number;
  filteredPosts: number;
}

export const BlogFilters: React.FC<BlogFiltersProps> = ({
  filters,
  onUpdateFilters,
  onResetFilters,
  availableTags,
  availableCategories,
  totalPosts,
  filteredPosts,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeSection, setActiveSection] = useState<string | null>(null);

  // Contar filtros activos
  const activeFiltersCount = [
    filters.searchQuery,
    filters.activeTag,
    filters.selectedCategory,
    filters.selectedDifficulty,
    filters.selectedReadingTime,
    filters.selectedMaritimeTheme,
    ...Object.values(filters.maritimeFilters).filter(Boolean),
  ].filter(Boolean).length;

  // Toggle sección
  const toggleSection = (section: string) => {
    setActiveSection(activeSection === section ? null : section);
  };

  // Actualizar filtro individual
  const updateFilter = (key: keyof BlogFiltersType, value: any) => {
    onUpdateFilters({ [key]: value });
  };

  // Actualizar filtro marítimo
  const updateMaritimeFilter = (key: keyof BlogFiltersType['maritimeFilters'], value: boolean) => {
    onUpdateFilters({
      maritimeFilters: {
        ...filters.maritimeFilters,
        [key]: value,
      },
    });
  };

  // Obtener icono para categoría
  const getCategoryIcon = (category: string) => {
    const icons: { [key: string]: string } = {
      'navegacion': '🧭',
      'seguridad': '🛡️',
      'destinos': '🗺️',
      'equipamiento': '🔧',
      'sostenibilidad': '🌍',
      'familia': '👨‍👩‍👧‍👦',
      'deportes': '🏊‍♂️',
      'tecnologia': '🤖',
      'fotografia': '📸',
    };
    return icons[category] || '📝';
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      {/* Header de filtros */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-blue-600" />
            <h3 className="font-semibold text-gray-900">Filtros</h3>
            {activeFiltersCount > 0 && (
              <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                {activeFiltersCount} activo{activeFiltersCount !== 1 ? 's' : ''}
              </span>
            )}
          </div>
          
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">
              {filteredPosts} de {totalPosts} posts
            </span>
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-1 hover:bg-gray-100 rounded transition-colors"
              aria-label={isExpanded ? 'Contraer filtros' : 'Expandir filtros'}
            >
              {isExpanded ? (
                <ChevronUp className="w-4 h-4 text-gray-600" />
              ) : (
                <ChevronDown className="w-4 h-4 text-gray-600" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Contenido de filtros */}
      {isExpanded && (
        <div className="p-4 space-y-4">
          {/* Tags populares */}
          <div className="space-y-2">
            <button
              onClick={() => toggleSection('tags')}
              className="flex items-center justify-between w-full text-left font-medium text-gray-700 hover:text-blue-600 transition-colors"
            >
              <span>🏷️ Tags populares</span>
              {activeSection === 'tags' ? (
                <ChevronUp className="w-4 h-4" />
              ) : (
                <ChevronDown className="w-4 h-4" />
              )}
            </button>
            
            {activeSection === 'tags' && (
              <div className="pl-4 space-y-2">
                <div className="flex flex-wrap gap-2">
                  {availableTags.slice(0, 12).map((tag) => (
                    <button
                      key={tag}
                      onClick={() => updateFilter('activeTag', filters.activeTag === tag ? null : tag)}
                      className={`
                        px-3 py-1.5 text-sm rounded-full transition-all duration-200
                        ${filters.activeTag === tag
                          ? 'bg-blue-600 text-white shadow-md'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }
                      `}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Categorías */}
          <div className="space-y-2">
            <button
              onClick={() => toggleSection('categories')}
              className="flex items-center justify-between w-full text-left font-medium text-gray-700 hover:text-blue-600 transition-colors"
            >
              <span>📂 Categorías</span>
              {activeSection === 'categories' ? (
                <ChevronUp className="w-4 h-4" />
              ) : (
                <ChevronDown className="w-4 h-4" />
              )}
            </button>
            
            {activeSection === 'categories' && (
              <div className="pl-4 space-y-2">
                <div className="grid grid-cols-2 gap-2">
                  {availableCategories.map((category) => (
                    <button
                      key={category}
                      onClick={() => updateFilter('selectedCategory', filters.selectedCategory === category ? '' : category)}
                      className={`
                        flex items-center gap-2 px-3 py-2 text-sm rounded-lg transition-all duration-200
                        ${filters.selectedCategory === category
                          ? 'bg-blue-600 text-white shadow-md'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }
                      `}
                    >
                      <span>{getCategoryIcon(category)}</span>
                      <span className="capitalize">{category}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Tiempo de lectura */}
          <div className="space-y-2">
            <button
              onClick={() => toggleSection('readingTime')}
              className="flex items-center justify-between w-full text-left font-medium text-gray-700 hover:text-blue-600 transition-colors"
            >
              <span>⏱️ Tiempo de lectura</span>
              {activeSection === 'readingTime' ? (
                <ChevronUp className="w-4 h-4" />
              ) : (
                <ChevronDown className="w-4 h-4" />
              )}
            </button>
            
            {activeSection === 'readingTime' && (
              <div className="pl-4 space-y-2">
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { value: '1-3', label: '1-3 min', icon: '⚡' },
                    { value: '4-7', label: '4-7 min', icon: '📖' },
                    { value: '8-15', label: '8-15 min', icon: '📚' },
                    { value: '15+', label: '15+ min', icon: '📖📚' },
                  ].map((option) => (
                    <button
                      key={option.value}
                      onClick={() => updateFilter('selectedReadingTime', filters.selectedReadingTime === option.value ? '' : option.value)}
                      className={`
                        flex items-center gap-2 px-3 py-2 text-sm rounded-lg transition-all duration-200
                        ${filters.selectedReadingTime === option.value
                          ? 'bg-blue-600 text-white shadow-md'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }
                      `}
                    >
                      <span>{option.icon}</span>
                      <span>{option.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Filtros marítimos */}
          <div className="space-y-2">
            <button
              onClick={() => toggleSection('maritime')}
              className="flex items-center justify-between w-full text-left font-medium text-gray-700 hover:text-blue-600 transition-colors"
            >
              <span>🌊 Filtros marítimos</span>
              {activeSection === 'maritime' ? (
                <ChevronUp className="w-4 h-4" />
              ) : (
                <ChevronDown className="w-4 h-4" />
              )}
            </button>
            
            {activeSection === 'maritime' && (
              <div className="pl-4 space-y-2">
                <div className="space-y-2">
                  {[
                    { key: 'onlyWithBoats', label: 'Solo con barcos', icon: '🚢' },
                    { key: 'onlyDestinations', label: 'Solo destinos', icon: '🗺️' },
                    { key: 'onlyEquipment', label: 'Solo equipamiento', icon: '🔧' },
                    { key: 'onlySafety', label: 'Solo seguridad', icon: '🛡️' },
                  ].map((option) => (
                    <label
                      key={option.key}
                      className="flex items-center gap-3 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors"
                    >
                      <input
                        type="checkbox"
                        checked={filters.maritimeFilters[option.key as keyof typeof filters.maritimeFilters]}
                        onChange={(e) => updateMaritimeFilter(
                          option.key as keyof typeof filters.maritimeFilters,
                          e.target.checked
                        )}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <span>{option.icon}</span>
                      <span>{option.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Botones de acción */}
          <div className="flex gap-2 pt-4 border-t border-gray-200">
            <button
              onClick={onResetFilters}
              className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              Limpiar filtros
            </button>
            <button
              onClick={() => setIsExpanded(false)}
              className="px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
            >
              Aplicar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
