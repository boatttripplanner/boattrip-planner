import React from 'react';
import { ShoppingCartIcon } from './icons/ShoppingCartIcon';

interface AmazonCTAButtonProps {
  href: string;
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'premium' | 'urgent' | 'bestseller';
  size?: 'sm' | 'md' | 'lg';
  price?: string;
  discount?: string;
  badge?: string;
  className?: string;
}

export const AmazonCTAButton: React.FC<AmazonCTAButtonProps> = ({
  href,
  children,
  variant = 'primary',
  size = 'md',
  price,
  discount,
  badge,
  className = ''
}) => {
  const baseClasses = "group relative inline-flex items-center justify-center gap-2 font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 no-underline text-decoration-none";
  
  const variantClasses = {
    primary: "bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white shadow-md hover:shadow-xl focus:ring-amber-500",
    secondary: "bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-md hover:shadow-xl focus:ring-blue-500",
    premium: "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg hover:shadow-2xl focus:ring-purple-500 animate-pulse",
    urgent: "bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white shadow-md hover:shadow-xl focus:ring-red-500 animate-bounce",
    bestseller: "bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white shadow-md hover:shadow-xl focus:ring-green-500"
  };
  
  const sizeClasses = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg"
  };

  const handleClick = (e: React.MouseEvent) => {
    // Track affiliate click
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'affiliate_click', {
        'event_category': 'ecommerce',
        'event_label': 'amazon_cta',
        'value': price ? parseFloat(price.replace(/[€,$]/g, '')) : 0
      });
    }
  };

  return (
    <div className={`relative inline-block ${className}`}>
      {/* Badge superior */}
      {badge && (
        <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-md z-10 animate-pulse">
          {badge}
        </div>
      )}
      
      {/* Botón principal */}
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer nofollow"
        onClick={handleClick}
        className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]}`}
      >
        {/* Icono de carrito */}
        <ShoppingCartIcon className={`${size === 'sm' ? 'w-4 h-4' : size === 'lg' ? 'w-6 h-6' : 'w-5 h-5'} group-hover:rotate-12 transition-transform duration-300`} />
        
        {/* Contenido del botón */}
        <span className="relative z-10">
          {children}
        </span>
        
        {/* Efecto de brillo */}
        <div className="absolute inset-0 rounded-xl bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
        
        {/* Precio y descuento */}
        {(price || discount) && (
          <div className="flex flex-col items-end ml-2">
            {discount && (
              <span className="text-xs bg-white bg-opacity-20 px-2 py-1 rounded-full font-bold">
                -{discount}
              </span>
            )}
            {price && (
              <span className="text-sm font-bold opacity-90">
                {price}
              </span>
            )}
          </div>
        )}
      </a>
      
      {/* Badge Amazon.es eliminado - se veía feo */}
    </div>
  );
};

// Componente especializado para ofertas premium
export const PremiumAmazonCTA: React.FC<Omit<AmazonCTAButtonProps, 'variant'>> = (props) => (
  <div className="relative p-4 bg-gradient-to-r from-yellow-50 to-amber-50 rounded-2xl border-2 border-amber-200 shadow-lg my-6">
    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-amber-500 text-white px-4 py-1 rounded-full text-sm font-bold shadow-md">
      🏆 RECOMENDACIÓN PREMIUM
    </div>
    <div className="text-center pt-2">
      <AmazonCTAButton {...props} variant="premium" size="lg" />
      <p className="text-sm text-amber-700 mt-2 opacity-80">
        ⭐ Producto más vendido en su categoría
      </p>
    </div>
  </div>
);

// Componente para ofertas urgentes
export const UrgentAmazonCTA: React.FC<Omit<AmazonCTAButtonProps, 'variant'>> = (props) => (
  <div className="relative p-4 bg-gradient-to-r from-red-50 to-orange-50 rounded-2xl border-2 border-red-200 shadow-lg my-6">
    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-red-500 text-white px-4 py-1 rounded-full text-sm font-bold shadow-md animate-pulse">
      🔥 OFERTA LIMITADA
    </div>
    <div className="text-center pt-2">
      <AmazonCTAButton {...props} variant="urgent" size="lg" />
      <p className="text-sm text-red-700 mt-2 opacity-80">
        ⏰ Solo por tiempo limitado
      </p>
    </div>
  </div>
);

// Componente para bestsellers
export const BestsellerAmazonCTA: React.FC<Omit<AmazonCTAButtonProps, 'variant'>> = (props) => (
  <div className="relative p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl border-2 border-green-200 shadow-lg my-6">
    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-4 py-1 rounded-full text-sm font-bold shadow-md">
      🥇 BESTSELLER
    </div>
    <div className="text-center pt-2">
      <AmazonCTAButton {...props} variant="bestseller" size="lg" />
      <p className="text-sm text-green-700 mt-2 opacity-80">
        ⭐ Más de 1000 reseñas positivas
      </p>
    </div>
  </div>
);

export default AmazonCTAButton;