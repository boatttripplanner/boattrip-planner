import React, { useState, useEffect, useRef } from 'react';
import { Search, X, TrendingUp, Clock, Tag } from 'lucide-react';
import { useDebounce } from '../hooks/useDebounce';

interface BlogSearchProps {
  value: string;
  onChange: (value: string) => void;
  onSearch: (query: string) => void;
  suggestions?: string[];
  placeholder?: string;
  className?: string;
}

export const BlogSearch: React.FC<BlogSearchProps> = ({
  value,
  onChange,
  onSearch,
  suggestions = [],
  placeholder = "Buscar en el blog...",
  className = "",
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedSuggestion, setSelectedSuggestion] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  // Debounce del valor de búsqueda
  const debouncedValue = useDebounce(value, 300);

  // Efecto para ejecutar búsqueda cuando cambie el valor debounced
  useEffect(() => {
    if (debouncedValue !== value) {
      onSearch(debouncedValue);
    }
  }, [debouncedValue, onSearch]);

  // Efecto para cerrar sugerencias al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
        setSelectedSuggestion(-1);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Manejar cambios en el input
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    onChange(newValue);
    setShowSuggestions(newValue.length > 0);
    setSelectedSuggestion(-1);
  };

  // Manejar teclas especiales
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showSuggestions || suggestions.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedSuggestion(prev => 
          prev < suggestions.length - 1 ? prev + 1 : 0
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedSuggestion(prev => 
          prev > 0 ? prev - 1 : suggestions.length - 1
        );
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedSuggestion >= 0) {
          handleSuggestionClick(suggestions[selectedSuggestion]);
        } else {
          onSearch(value);
        }
        break;
      case 'Escape':
        setShowSuggestions(false);
        setSelectedSuggestion(-1);
        inputRef.current?.blur();
        break;
    }
  };

  // Manejar clic en sugerencia
  const handleSuggestionClick = (suggestion: string) => {
    onChange(suggestion);
    onSearch(suggestion);
    setShowSuggestions(false);
    setSelectedSuggestion(-1);
    inputRef.current?.focus();
  };

  // Limpiar búsqueda
  const handleClear = () => {
    onChange('');
    onSearch('');
    setShowSuggestions(false);
    setSelectedSuggestion(-1);
    inputRef.current?.focus();
  };

  // Obtener icono para sugerencias
  const getSuggestionIcon = (suggestion: string) => {
    if (suggestion.includes('gps') || suggestion.includes('navegacion')) {
      return <Tag className="w-4 h-4 text-blue-500" />;
    }
    if (suggestion.includes('destino') || suggestion.includes('cala')) {
      return <TrendingUp className="w-4 h-4 text-green-500" />;
    }
    if (suggestion.includes('tiempo') || suggestion.includes('min')) {
      return <Clock className="w-4 h-4 text-orange-500" />;
    }
    return <Tag className="w-4 h-4 text-gray-400" />;
  };

  return (
    <div className={`relative ${className}`}>
      {/* Input de búsqueda */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          className={`
            w-full pl-10 pr-10 py-3 border rounded-lg transition-all duration-200
            ${isFocused 
              ? 'border-blue-500 ring-2 ring-blue-500/20 shadow-lg' 
              : 'border-gray-300 hover:border-gray-400'
            }
            focus:outline-none focus:ring-2 focus:ring-blue-500/20
            placeholder-gray-400 text-gray-900
          `}
        />
        
        {/* Botón de limpiar */}
        {value && (
          <button
            onClick={handleClear}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Limpiar búsqueda"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Sugerencias de búsqueda */}
      {showSuggestions && suggestions.length > 0 && (
        <div
          ref={suggestionsRef}
          className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-xl z-50 max-h-64 overflow-y-auto"
        >
          {suggestions.map((suggestion, index) => (
            <button
              key={suggestion}
              onClick={() => handleSuggestionClick(suggestion)}
              className={`
                w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors duration-150
                flex items-center gap-3
                ${selectedSuggestion === index ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''}
                ${index === 0 ? 'rounded-t-lg' : ''}
                ${index === suggestions.length - 1 ? 'rounded-b-lg' : ''}
              `}
            >
              {getSuggestionIcon(suggestion)}
              <span className="text-gray-700 font-medium">{suggestion}</span>
            </button>
          ))}
        </div>
      )}

      {/* Indicador de búsqueda en tiempo real */}
      {value && (
        <div className="absolute -bottom-6 left-0 text-xs text-gray-500">
          🔍 Búsqueda en tiempo real
        </div>
      )}
    </div>
  );
};
