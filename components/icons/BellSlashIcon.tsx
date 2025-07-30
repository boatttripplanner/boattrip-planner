import React from 'react';

interface BellSlashIconProps {
  className?: string;
}

export const BellSlashIcon: React.FC<BellSlashIconProps> = ({ className = "w-6 h-6" }) => {
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
        d="M9.143 17.082a24.248 24.248 0 003.844.148m-3.844-.148a23.856 23.856 0 01-5.455-1.31 8.964 8.964 0 002.3-6.062m0-4.006a6 6 0 00-6 6v.75a8.964 8.964 0 002.3 6.062m0-4.006a24.255 24.255 0 015.714 0m-5.714 0a3 3 0 115.714 0m-5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" 
      />
    </svg>
  );
}; 