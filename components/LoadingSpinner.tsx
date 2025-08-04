import React from 'react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md'; // sm for small (e.g., 20x20), md for default (48x48)
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ size = 'md' }) => {
  const sizeClasses = size === 'sm' ? 'h-8 w-8' : 'h-16 w-16';
  
  return (
    <div className="flex justify-center items-center">
      <div className={`${sizeClasses} relative -mt-4`}>
        {/* Container con glow effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-ocean-500 to-sea-500 rounded-full opacity-20 blur-sm animate-pulse"></div>
        
        {/* Logo container con borde y glow */}
        <div className="relative w-full h-full bg-gradient-to-br from-ocean-500 via-sea-500 to-sunset-500 rounded-full border border-ocean-400/30 flex items-center justify-center shadow-lg backdrop-blur-sm">
          {/* Logo */}
          <img 
            src="/alex5.svg" 
            alt="BoatTrip Planner Logo" 
            className="w-1/2 h-1/2 animate-float-slow filter drop-shadow-lg"
          />
        </div>
        
        {/* Animated ring effect */}
        <div className="absolute inset-0 border-2 border-ocean-300 rounded-full animate-ping opacity-20"></div>
        <div className="absolute inset-0 border-2 border-sea-300 rounded-full animate-ping opacity-20" style={{ animationDelay: '1s' }}></div>
      </div>
    </div>
  );
};
