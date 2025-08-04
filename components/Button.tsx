import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'premium' | 'urgent' | 'bestseller';
  size?: 'sm' | 'md';
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  className, 
  variant = 'primary', 
  size = 'md',
  ...props 
}) => {
  const coreStyles = "font-semibold rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all ease-in-out duration-200 transform hover:-translate-y-0.5 disabled:transform-none touch-friendly inline-flex items-center justify-center safari-button";
  
  const variantStyles = {
    primary: "bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white focus:ring-teal-400 disabled:from-teal-400 disabled:to-teal-500 disabled:opacity-70",
    secondary: "bg-slate-200 hover:bg-slate-300 text-slate-800 focus:ring-teal-500 disabled:bg-slate-100 disabled:text-slate-400",
    outline: "bg-transparent border-2 border-teal-500 text-teal-600 hover:bg-teal-500 hover:text-white focus:ring-teal-400 disabled:border-teal-300 disabled:text-teal-300",
    premium: "bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white focus:ring-purple-400 disabled:from-purple-400 disabled:to-pink-400 disabled:opacity-70",
    urgent: "bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white focus:ring-red-400 disabled:from-red-400 disabled:to-orange-400 disabled:opacity-70",
    bestseller: "bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-white focus:ring-yellow-400 disabled:from-yellow-300 disabled:to-orange-300 disabled:opacity-70",
  };

  const sizeSpecificStyles = {
    md: "py-2.5 sm:py-2 px-3 sm:px-4 text-sm sm:text-base",
    sm: "py-2 sm:py-1.5 px-2.5 sm:px-3 text-xs sm:text-sm",
  };

  return (
    <button
      className={`${coreStyles} ${sizeSpecificStyles[size]} ${variantStyles[variant]} ${className || ''}`}
      {...props}
    >
      {children}
    </button>
  );
};
