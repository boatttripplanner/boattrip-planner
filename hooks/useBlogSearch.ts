import { useMemo, useState, useCallback } from 'react';
import { ParsedMarkdownPost } from '../types';

export interface BlogFilters {
  searchQuery: string;
  activeTag: string | null;
  selectedCategory: string;
  selectedDifficulty: string;
  selectedReadingTime: string;
  selectedMaritimeTheme: string;
  maritimeFilters: {
    onlyWithBoats: boolean;
    onlyDestinations: boolean;
    onlyEquipment: boolean;
    onlySafety: boolean;
  };
}

export interface BlogSearchResult {
  posts: ParsedMarkdownPost[];
  totalResults: number;
  searchTime: number;
  suggestions: string[];
}

export function useBlogSearch(allPosts: ParsedMarkdownPost[]) {
  const [filters, setFilters] = useState<BlogFilters>({
    searchQuery: '',
    activeTag: null,
    selectedCategory: '',
    selectedDifficulty: '',
    selectedReadingTime: '',
    selectedMaritimeTheme: '',
    maritimeFilters: {
      onlyWithBoats: false,
      onlyDestinations: false,
      onlyEquipment: false,
      onlySafety: false,
    },
  });

  // Función para calcular tiempo de lectura
  const calculateReadingTime = (content: string): number => {
    const wordsPerMinute = 200;
    const wordCount = content.split(/\s+/).length;
    return Math.ceil(wordCount / wordsPerMinute);
  };

  // Crear índice de búsqueda optimizado
  const searchIndex = useMemo(() => {
    return allPosts.map(post => ({
      id: post.frontmatter.slug,
      title: post.frontmatter.title.toLowerCase(),
      summary: post.frontmatter.summary.toLowerCase(),
      content: post.content.toLowerCase(),
      tags: post.frontmatter.tags?.map(tag => tag.toLowerCase()) || [],
      author: post.frontmatter.author?.toLowerCase() || '',
      category: post.frontmatter.category?.toLowerCase() || '',
      date: post.frontmatter.date,
      readingTime: calculateReadingTime(post.content),
    }));
  }, [allPosts]);

  // Función de búsqueda optimizada con índice
  const searchPosts = useCallback((query: string): ParsedMarkdownPost[] => {
    if (!query.trim()) return allPosts;

    const startTime = performance.now();
    const lowerQuery = query.toLowerCase();
    const queryWords = lowerQuery.split(/\s+/).filter(word => word.length > 2);

    const results = searchIndex
      .map((indexedPost, originalIndex) => {
        let score = 0;
        const post = allPosts[originalIndex];

        // Búsqueda por título (mayor peso)
        if (indexedPost.title.includes(lowerQuery)) {
          score += 100;
        }

        // Búsqueda por palabras individuales
        queryWords.forEach(word => {
          if (indexedPost.title.includes(word)) score += 50;
          if (indexedPost.summary.includes(word)) score += 30;
          if (indexedPost.tags.some(tag => tag.includes(word))) score += 25;
          if (indexedPost.content.includes(word)) score += 10;
        });

        // Búsqueda exacta en tags
        if (indexedPost.tags.some(tag => tag === lowerQuery)) {
          score += 40;
        }

        return { post, score };
      })
      .filter(result => result.score > 0)
      .sort((a, b) => b.score - a.score)
      .map(result => result.post);

    const endTime = performance.now();
    console.log(`🔍 Búsqueda completada en ${(endTime - startTime).toFixed(2)}ms`);

    return results;
  }, [searchIndex, allPosts]);

  // Aplicar filtros combinados
  const applyFilters = useCallback((posts: ParsedMarkdownPost[]): ParsedMarkdownPost[] => {
    let filteredPosts = [...posts];

    // Filtro por tag
    if (filters.activeTag) {
      filteredPosts = filteredPosts.filter(post =>
        post.frontmatter.tags?.includes(filters.activeTag!)
      );
    }

    // Filtro por categoría
    if (filters.selectedCategory) {
      filteredPosts = filteredPosts.filter(post =>
        post.frontmatter.category === filters.selectedCategory
      );
    }

    // Filtro por tiempo de lectura
    if (filters.selectedReadingTime) {
      filteredPosts = filteredPosts.filter(post => {
        const readingTime = calculateReadingTime(post.content);
        switch (filters.selectedReadingTime) {
          case '1-3':
            return readingTime >= 1 && readingTime <= 3;
          case '4-7':
            return readingTime >= 4 && readingTime <= 7;
          case '8-15':
            return readingTime >= 8 && readingTime <= 15;
          case '15+':
            return readingTime > 15;
          default:
            return true;
        }
      });
    }

    // Filtros marítimos
    if (filters.maritimeFilters.onlyWithBoats) {
      filteredPosts = filteredPosts.filter(post =>
        post.content.toLowerCase().includes('barco') ||
        post.content.toLowerCase().includes('velero') ||
        post.content.toLowerCase().includes('yate')
      );
    }

    if (filters.maritimeFilters.onlyDestinations) {
      filteredPosts = filteredPosts.filter(post =>
        post.content.toLowerCase().includes('destino') ||
        post.content.toLowerCase().includes('cala') ||
        post.content.toLowerCase().includes('isla')
      );
    }

    return filteredPosts;
  }, [filters]);

  // Generar sugerencias de búsqueda
  const generateSearchSuggestions = (query: string, index: any[]): string[] => {
    if (!query.trim() || query.length < 2) return [];

    const suggestions = new Set<string>();
    const lowerQuery = query.toLowerCase();

    // Buscar en títulos
    index.forEach(post => {
      if (post.title.includes(lowerQuery)) {
        const words = post.title.split(/\s+/);
        words.forEach(word => {
          if (word.toLowerCase().includes(lowerQuery) && word.length > 2) {
            suggestions.add(word);
          }
        });
      }
    });

    // Buscar en tags
    index.forEach(post => {
      post.tags.forEach((tag: string) => {
        if (tag.includes(lowerQuery)) {
          suggestions.add(tag);
        }
      });
    });

    return Array.from(suggestions).slice(0, 5);
  };

  // Obtener resultados finales
  const searchResults = useMemo((): BlogSearchResult => {
    const startTime = performance.now();
    
    // Aplicar búsqueda primero
    let results = searchPosts(filters.searchQuery);
    
    // Aplicar filtros adicionales
    results = applyFilters(results);
    
    const endTime = performance.now();
    const searchTime = endTime - startTime;

    // Generar sugerencias de búsqueda
    const suggestions = generateSearchSuggestions(filters.searchQuery, searchIndex);

    return {
      posts: results,
      totalResults: results.length,
      searchTime,
      suggestions,
    };
  }, [filters, searchPosts, applyFilters, searchIndex]);

  // Actualizar filtros
  const updateFilters = useCallback((newFilters: Partial<BlogFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  }, []);

  // Resetear filtros
  const resetFilters = useCallback(() => {
    setFilters({
      searchQuery: '',
      activeTag: null,
      selectedCategory: '',
      selectedDifficulty: '',
      selectedReadingTime: '',
      selectedMaritimeTheme: '',
      maritimeFilters: {
        onlyWithBoats: false,
        onlyDestinations: false,
        onlyEquipment: false,
        onlySafety: false,
      },
    });
  }, []);

  return {
    filters,
    searchResults,
    updateFilters,
    resetFilters,
    calculateReadingTime,
  };
}
