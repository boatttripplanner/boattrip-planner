import React from 'react';

interface AmazonProductButtonProps {
  title: string;
  price?: string;
  rating?: number;
  category: 'sostenibilidad' | 'equipamiento' | 'seguridad' | 'tecnologia' | 'deportes' | 'limpieza' | 'energia' | 'general' | 'destinos' | 'mascotas' | 'familia' | 'pesca' | 'buceo' | 'paddle' | 'camping';
  badge?: 'oferta' | 'mas-vendido' | 'nuevo' | 'eco' | 'limitado' | 'exclusivo' | 'recomendado' | 'top-ventas';
  href: string;
  className?: string;
  onClick?: () => void;
  description?: string;
  discount?: string;
}

// Iconos temáticos por categoría - EXPANDIDO
const categoryIcons = {
  sostenibilidad: '🌱',
  equipamiento: '⚓',
  seguridad: '🛟',
  tecnologia: '📱',
  deportes: '🏄‍♂️',
  limpieza: '🧼',
  energia: '⚡',
  general: '🛍️',
  destinos: '🏝️',
  mascotas: '🐕',
  familia: '👨‍👩‍👧‍👦',
  pesca: '🎣',
  buceo: '🤿',
  paddle: '🏄‍♂️',
  camping: '🏕️'
};

// Gradientes por categoría - MEJORADOS
const categoryGradients = {
  sostenibilidad: 'from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700',
  equipamiento: 'from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700',
  seguridad: 'from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700',
  tecnologia: 'from-purple-500 to-violet-600 hover:from-purple-600 hover:to-violet-700',
  deportes: 'from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700',
  limpieza: 'from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700',
  energia: 'from-yellow-500 to-orange-600 hover:from-yellow-600 hover:to-orange-700',
  general: 'from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700',
  destinos: 'from-pink-500 to-rose-600 hover:from-pink-600 hover:to-rose-700',
  mascotas: 'from-amber-500 to-yellow-600 hover:from-amber-600 hover:to-yellow-700',
  familia: 'from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700',
  pesca: 'from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700',
  buceo: 'from-cyan-500 to-teal-600 hover:from-cyan-600 hover:to-teal-700',
  paddle: 'from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700',
  camping: 'from-green-500 to-lime-600 hover:from-green-600 hover:to-lime-700'
};

// Colores de badges - EXPANDIDOS
const badgeColors = {
  oferta: 'bg-red-500 text-white',
  'mas-vendido': 'bg-yellow-500 text-black',
  nuevo: 'bg-green-500 text-white',
  eco: 'bg-emerald-500 text-white',
  limitado: 'bg-purple-500 text-white',
  exclusivo: 'bg-pink-500 text-white',
  recomendado: 'bg-blue-500 text-white',
  'top-ventas': 'bg-orange-500 text-white'
};

// Textos de badges
const badgeTexts = {
  oferta: '🔥 OFERTA',
  'mas-vendido': '⭐ TOP',
  nuevo: '🆕 NUEVO',
  eco: '🌱 ECO',
  limitado: '⏰ LIMITADO',
  exclusivo: '💎 EXCLUSIVO',
  recomendado: '👍 RECOMENDADO',
  'top-ventas': '🏆 TOP VENTAS'
};

export const AmazonProductButton: React.FC<AmazonProductButtonProps> = ({
  title,
  price,
  rating,
  category,
  badge,
  href,
  className = '',
  onClick,
  description,
  discount
}) => {
  const icon = categoryIcons[category];
  const gradient = categoryGradients[category];
  const badgeColor = badge ? badgeColors[badge] : '';
  const badgeText = badge ? badgeTexts[badge] : '';

  const handleClick = (e: React.MouseEvent) => {
    if (onClick) {
      onClick();
    }
    // Tracking para analytics
    console.log(`🛍️ Producto clickeado: ${title} - Categoría: ${category} - Precio: ${price}`);
  };

  return (
    <div className={`group relative ${className}`}>
      {/* Badge superior */}
      {badge && (
        <div className={`absolute -top-2 -right-2 px-2 py-1 rounded-full text-xs font-bold z-10 ${badgeColor} shadow-lg transform scale-90 group-hover:scale-100 transition-transform duration-200`}>
          {badgeText}
        </div>
      )}

      {/* Badge de descuento */}
      {discount && (
        <div className="absolute -top-2 -left-2 px-2 py-1 rounded-full text-xs font-bold z-10 bg-red-600 text-white shadow-lg transform scale-90 group-hover:scale-100 transition-transform duration-200">
          -{discount}
        </div>
      )}

      {/* Botón principal */}
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        onClick={handleClick}
        className={`
          relative block w-full p-4 rounded-xl shadow-lg
          bg-gradient-to-r ${gradient}
          text-white font-semibold text-left
          transform transition-all duration-300 ease-out
          hover:scale-105 hover:shadow-xl
          active:scale-95
          focus:outline-none focus:ring-4 focus:ring-offset-2 focus:ring-white/30
          cursor-pointer
          overflow-hidden
          min-h-[120px]
        `}
      >
        {/* Efecto de brillo al hover */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out"></div>
        
        {/* Contenido del botón */}
        <div className="relative z-10 flex items-start space-x-3">
          {/* Icono de categoría */}
          <div className="text-2xl flex-shrink-0">
            {icon}
          </div>
          
          {/* Contenido principal */}
          <div className="flex-1 min-w-0">
            {/* Título */}
            <div className="text-sm font-bold leading-tight mb-1">
              {title}
            </div>
            
            {/* Descripción */}
            {description && (
              <div className="text-xs text-white/80 mb-2 line-clamp-2">
                {description}
              </div>
            )}
            
            {/* Precio y rating */}
            <div className="flex items-center justify-between">
              {price && (
                <div className="text-lg font-bold text-yellow-300">
                  {price}
                </div>
              )}
              
              {rating && (
                <div className="flex items-center space-x-1">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className={`text-sm ${i < Math.floor(rating) ? 'text-yellow-300' : 'text-white/30'}`}>
                        ⭐
                      </span>
                    ))}
                  </div>
                  <span className="text-xs text-white/80">({rating})</span>
                </div>
              )}
            </div>
          </div>
          
          {/* Icono de Amazon */}
          <div className="flex-shrink-0 text-white/80 group-hover:text-white transition-colors duration-200">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
            </svg>
          </div>
        </div>
        
        {/* Texto de acción */}
        <div className="absolute bottom-2 right-2 text-xs text-white/70 group-hover:text-white transition-colors duration-200">
          Ver en Amazon →
        </div>
      </a>
    </div>
  );
};

// Componente para mostrar múltiples productos en grid - MEJORADO
export const AmazonProductGrid: React.FC<{
  products: Omit<AmazonProductButtonProps, 'className'>[];
  columns?: 1 | 2 | 3 | 4;
  title?: string;
  subtitle?: string;
}> = ({ products, columns = 2, title, subtitle }) => {
  const gridCols = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 sm:grid-cols-2',
    3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4'
  };

  return (
    <div className="my-8">
      {(title || subtitle) && (
        <div className="text-center mb-6">
          {title && <h3 className="text-2xl font-bold text-gray-800 mb-2">{title}</h3>}
          {subtitle && <p className="text-gray-600">{subtitle}</p>}
        </div>
      )}
      
      <div className={`grid ${gridCols[columns]} gap-4`}>
        {products.map((product, index) => (
          <AmazonProductButton
            key={index}
            {...product}
            className="h-full"
          />
        ))}
      </div>
    </div>
  );
};

// Componente de producto destacado
export const FeaturedProduct: React.FC<{
  product: Omit<AmazonProductButtonProps, 'className'>;
  title?: string;
  subtitle?: string;
}> = ({ product, title, subtitle }) => {
  return (
    <div className="my-8">
      {(title || subtitle) && (
        <div className="text-center mb-6">
          {title && <h3 className="text-2xl font-bold text-gray-800 mb-2">{title}</h3>}
          {subtitle && <p className="text-gray-600">{subtitle}</p>}
        </div>
      )}
      
      <div className="max-w-md mx-auto">
        <AmazonProductButton
          {...product}
          className="h-full"
        />
      </div>
    </div>
  );
}; 