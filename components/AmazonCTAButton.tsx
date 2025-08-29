import React from 'react';
import { AMAZON_AFFILIATE_TAG } from '../constants';
import { generateAffiliateUrlForProductName } from '../services/affiliateLinkService';

interface AmazonCTAButtonProps {
  productName: string;
  asin?: string;
  category?: string;
  variant?: 'primary' | 'secondary' | 'outline' | 'premium' | 'urgent' | 'bestseller';
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
  className?: string;
  children?: React.ReactNode;
  trackingLabel?: string;
}

const AmazonCTAButton: React.FC<AmazonCTAButtonProps> = ({
  productName,
  asin,
  category = 'general',
  variant = 'primary',
  size = 'md',
  showIcon = true,
  className = '',
  children,
  trackingLabel
}) => {
  // Generar enlace optimizado de Amazon
  const generateAmazonLink = () => generateAffiliateUrlForProductName(productName, { linkId: `cta_${category}`, utmContent: category });

  // Estilos base
  const baseStyles = "inline-flex items-center justify-center font-semibold rounded-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-60";
  
  // Variantes de estilo
  const variantStyles = {
    primary: "bg-orange-500 hover:bg-orange-600 text-white focus:ring-orange-500 shadow-md hover:shadow-lg",
    secondary: "bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-500 shadow-md hover:shadow-lg",
    outline: "border-2 border-orange-500 text-orange-600 hover:bg-orange-50 focus:ring-orange-500",
    premium: "bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white focus:ring-purple-500 shadow-md hover:shadow-lg",
    urgent: "bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white focus:ring-red-500 shadow-md hover:shadow-lg",
    bestseller: "bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-white focus:ring-yellow-500 shadow-md hover:shadow-lg"
  };
  
  // Tamaños
  const sizeStyles = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-base",
    lg: "px-6 py-3 text-lg"
  };

  // Tracking de clics
  const handleClick = () => {
    // Google Analytics tracking
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'click', {
        'event_category': 'amazon_affiliate',
        'event_label': trackingLabel || productName,
        'value': 1,
        'custom_parameter': {
          'product_name': productName,
          'asin': asin,
          'category': category
        }
      });
    }

    // Facebook Pixel tracking (si está disponible)
    if (typeof window !== 'undefined' && (window as any).fbq) {
      (window as any).fbq('track', 'Lead', {
        content_name: productName,
        content_category: category
      });
    }

    // Console log para debugging
    console.log(`Amazon affiliate click: ${productName} (${asin || 'search'})`);
  };

  return (
    <a
      href={generateAmazonLink()}
      target="_blank"
      rel="noopener noreferrer"
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
      onClick={handleClick}
    >
      {children || (
        <>
          <span>{showIcon ? '🛒 ' : ''}Ver en Amazon</span>
          {showIcon && (
            <svg 
              className="ml-2 w-4 h-4" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" 
              />
            </svg>
          )}
        </>
      )}
    </a>
  );
};

export default AmazonCTAButton;