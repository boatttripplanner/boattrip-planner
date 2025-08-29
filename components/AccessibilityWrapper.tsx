// components/AccessibilityWrapper.tsx
// ♿ Componente de accesibilidad para mejorar la experiencia de usuarios con discapacidades

import React, { ReactNode, useRef, useEffect } from 'react';

interface AccessibilityWrapperProps {
  children: ReactNode;
  role?: string;
  'aria-label'?: string;
  'aria-describedby'?: string;
  'aria-labelledby'?: string;
  tabIndex?: number;
  className?: string;
  onKeyDown?: (event: React.KeyboardEvent) => void;
  focusable?: boolean;
  skipToContent?: boolean;
}

const AccessibilityWrapper: React.FC<AccessibilityWrapperProps> = ({
  children,
  role,
  'aria-label': ariaLabel,
  'aria-describedby': ariaDescribedby,
  'aria-labelledby': ariaLabelledby,
  tabIndex,
  className = '',
  onKeyDown,
  focusable = false,
  skipToContent = false
}) => {
  const ref = useRef<HTMLDivElement>(null);

  // Manejar navegación por teclado
  const handleKeyDown = (event: React.KeyboardEvent) => {
    // Navegación por teclado estándar
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      if (ref.current) {
        ref.current.click();
      }
    }

    // Navegación por tab
    if (event.key === 'Tab') {
      // Permitir navegación normal por tab
    }

    // Llamar al callback personalizado si existe
    if (onKeyDown) {
      onKeyDown(event);
    }
  };

  // Focus management
  useEffect(() => {
    if (focusable && ref.current) {
      ref.current.setAttribute('tabindex', '0');
    }
  }, [focusable]);

  // Skip to content functionality
  useEffect(() => {
    if (skipToContent && ref.current) {
      const handleSkipToContent = () => {
        ref.current?.focus();
        ref.current?.scrollIntoView({ behavior: 'smooth' });
      };

      // Crear botón de skip to content
      const skipButton = document.createElement('button');
      skipButton.textContent = 'Saltar al contenido principal';
      skipButton.className = 'sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-blue-600 text-white px-4 py-2 rounded z-50';
      skipButton.onclick = handleSkipToContent;
      
      document.body.insertBefore(skipButton, document.body.firstChild);
      
      return () => {
        if (skipButton.parentNode) {
          skipButton.parentNode.removeChild(skipButton);
        }
      };
    }
  }, [skipToContent]);

  return (
    <div
      ref={ref}
      role={role}
      aria-label={ariaLabel}
      aria-describedby={ariaDescribedby}
      aria-labelledby={ariaLabelledby}
      tabIndex={tabIndex}
      className={`${className} ${focusable ? 'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2' : ''}`}
      onKeyDown={handleKeyDown}
    >
      {children}
    </div>
  );
};

// Componentes específicos de accesibilidad
export const AccessibleButton: React.FC<{
  children: ReactNode;
  onClick: () => void;
  'aria-label'?: string;
  disabled?: boolean;
  className?: string;
}> = ({ children, onClick, 'aria-label': ariaLabel, disabled = false, className = '' }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    aria-label={ariaLabel}
    className={`${className} focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed`}
  >
    {children}
  </button>
);

export const AccessibleLink: React.FC<{
  children: ReactNode;
  href: string;
  'aria-label'?: string;
  external?: boolean;
  className?: string;
}> = ({ children, href, 'aria-label': ariaLabel, external = false, className = '' }) => (
  <a
    href={href}
    target={external ? '_blank' : undefined}
    rel={external ? 'noopener noreferrer' : undefined}
    aria-label={ariaLabel}
    className={`${className} focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
  >
    {children}
    {external && <span className="sr-only"> (se abre en una nueva ventana)</span>}
  </a>
);

export const AccessibleImage: React.FC<{
  src: string;
  alt: string;
  'aria-label'?: string;
  className?: string;
  width?: number;
  height?: number;
}> = ({ src, alt, 'aria-label': ariaLabel, className = '', width, height }) => (
  <img
    src={src}
    alt={alt}
    aria-label={ariaLabel}
    className={className}
    width={width}
    height={height}
    loading="lazy"
  />
);

export const AccessibleForm: React.FC<{
  children: ReactNode;
  onSubmit: (event: React.FormEvent) => void;
  'aria-label'?: string;
  className?: string;
}> = ({ children, onSubmit, 'aria-label': ariaLabel, className = '' }) => (
  <form
    onSubmit={onSubmit}
    aria-label={ariaLabel}
    className={className}
    noValidate
  >
    {children}
  </form>
);

export const AccessibleInput: React.FC<{
  type: string;
  name: string;
  'aria-label'?: string;
  'aria-describedby'?: string;
  placeholder?: string;
  required?: boolean;
  className?: string;
  value?: string;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
}> = ({ 
  type, 
  name, 
  'aria-label': ariaLabel, 
  'aria-describedby': ariaDescribedby,
  placeholder, 
  required = false, 
  className = '',
  value,
  onChange
}) => (
  <input
    type={type}
    name={name}
    aria-label={ariaLabel}
    aria-describedby={ariaDescribedby}
    placeholder={placeholder}
    required={required}
    className={`${className} focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
    value={value}
    onChange={onChange}
  />
);

export default AccessibilityWrapper;
