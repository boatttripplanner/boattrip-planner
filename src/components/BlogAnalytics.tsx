// src/components/BlogAnalytics.tsx
import React, { useState, useEffect } from 'react';
import { allBlogPosts } from '../blogData';

interface BlogStats {
  totalPosts: number;
  totalWords: number;
  averageReadingTime: number;
  mostPopularCategory: string;
  totalFavorites: number;
  mostFavoritedPost: string;
  averageRating: number;
  totalRatings: number;
}

const BlogAnalytics: React.FC = () => {
  const [stats, setStats] = useState<BlogStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    calculateStats();
  }, []);

  const calculateStats = () => {
    // Calcular estadísticas básicas
    const totalPosts = allBlogPosts.length;
    
    // Calcular palabras totales
    const totalWords = allBlogPosts.reduce((acc, post) => {
      return acc + post.content.split(/\s+/).length;
    }, 0);
    
    // Tiempo de lectura promedio (200 palabras por minuto)
    const averageReadingTime = Math.round(totalWords / 200 / totalPosts);
    
    // Categoría más popular
    const categoryCount: { [key: string]: number } = {};
    allBlogPosts.forEach(post => {
      if (post.frontmatter.tags) {
        const category = getArticleCategory(post.frontmatter.tags);
        categoryCount[category] = (categoryCount[category] || 0) + 1;
      }
    });
    
    const mostPopularCategory = Object.entries(categoryCount)
      .sort(([,a], [,b]) => b - a)[0]?.[0] || 'General';
    
    // Favoritos
    const favorites = JSON.parse(localStorage.getItem('blogFavorites') || '[]');
    const totalFavorites = favorites.length;
    
    // Post más favorito
    const favoriteCount: { [key: string]: number } = {};
    favorites.forEach((slug: string) => {
      favoriteCount[slug] = (favoriteCount[slug] || 0) + 1;
    });
    
    const mostFavoritedPost = Object.entries(favoriteCount)
      .sort(([,a], [,b]) => b - a)[0]?.[0] || 'Ninguno';
    
    // Valoraciones
    const userRatings = JSON.parse(localStorage.getItem('blogUserRatings') || '{}');
    const ratings = Object.values(userRatings) as number[];
    const averageRating = ratings.length > 0 
      ? Math.round((ratings.reduce((a, b) => a + b, 0) / ratings.length) * 10) / 10
      : 0;
    
    setStats({
      totalPosts,
      totalWords,
      averageReadingTime,
      mostPopularCategory,
      totalFavorites,
      mostFavoritedPost,
      averageRating,
      totalRatings: ratings.length
    });
    
    setLoading(false);
  };

  const getArticleCategory = (tags: string[]): string => {
    const categoryMap: { [key: string]: string } = {
      'destinos': 'Destinos',
      'técnicas': 'Técnicas de Navegación',
      'equipamiento': 'Equipamiento',
      'seguridad': 'Seguridad',
      'reviews': 'Reviews',
      'consejos': 'Consejos',
      'familia': 'Familia',
      'aventura': 'Aventura',
      'sostenibilidad': 'Sostenibilidad',
      'licencias': 'Licencias y Certificaciones',
      'mascotas': 'Mascotas',
      'deportes': 'Deportes Acuáticos',
      'tecnología': 'Tecnología',
      'bienvenida': 'General'
    };

    for (const tag of tags) {
      const lowerTag = tag.toLowerCase();
      for (const [key, category] of Object.entries(categoryMap)) {
        if (lowerTag.includes(key)) {
          return category;
        }
      }
    }
    return 'General';
  };

  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="h-32 bg-gray-200 rounded-lg"></div>
      </div>
    );
  }

  if (!stats) return null;

  return (
    <div className="bg-gradient-to-br from-teal-50 to-blue-50 p-6 rounded-lg border border-teal-200">
      <h3 className="text-xl font-bold text-slate-800 mb-4">
        📊 Estadísticas del Blog
      </h3>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="text-center">
          <div className="text-2xl font-bold text-teal-600">{stats.totalPosts}</div>
          <div className="text-sm text-slate-600">Artículos</div>
        </div>
        
        <div className="text-center">
          <div className="text-2xl font-bold text-teal-600">{stats.totalWords.toLocaleString()}</div>
          <div className="text-sm text-slate-600">Palabras</div>
        </div>
        
        <div className="text-center">
          <div className="text-2xl font-bold text-teal-600">{stats.averageReadingTime}</div>
          <div className="text-sm text-slate-600">Min. promedio</div>
        </div>
        
        <div className="text-center">
          <div className="text-2xl font-bold text-teal-600">{stats.totalFavorites}</div>
          <div className="text-sm text-slate-600">Favoritos</div>
        </div>
      </div>
      
      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white p-3 rounded-lg">
          <div className="text-sm font-semibold text-slate-700">Categoría más popular</div>
          <div className="text-lg text-teal-600">{stats.mostPopularCategory}</div>
        </div>
        
        <div className="bg-white p-3 rounded-lg">
          <div className="text-sm font-semibold text-slate-700">Valoración promedio</div>
          <div className="text-lg text-teal-600">
            {stats.averageRating > 0 ? `${stats.averageRating}/5 ⭐` : 'Sin valoraciones'}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogAnalytics; 