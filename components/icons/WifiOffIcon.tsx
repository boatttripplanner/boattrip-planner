import React from 'react';

interface WifiOffIconProps {
  className?: string;
}

export const WifiOffIcon: React.FC<WifiOffIconProps> = ({ className = "w-6 h-6" }) => {
  return (
    <svg 
      className={className} 
      fill="none" 
      stroke="currentColor" 
      viewBox="0 0 24 24"
    >
      <path 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        strokeWidth={2} 
        d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M12 2.25a9.75 9.75 0 016.364 2.636M12 21.75a9.75 9.75 0 01-6.364-2.636M12 6.75a5.25 5.25 0 013.536 1.464M12 17.25a5.25 5.25 0 01-3.536-1.464" 
      />
    </svg>
  );
}; 