import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

const Header: React.FC = () => {
  const location = useLocation();
  const isBlogView = location.pathname.startsWith('/blog');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  // Asegurar que el menú se cierre cuando cambie la ruta
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);
  
  const getPageTitle = () => {
    switch (location.pathname) {
      case '/':
        return 'BoatTrip Planner';
      case '/about':
        return 'Sobre Nosotros';
      case '/how-it-works':
        return 'Cómo Funciona';
      case '/blog':
        return 'Blog';
      default:
        if (location.pathname.startsWith('/blog/')) {
          return 'Blog';
        }
        return 'BoatTrip Planner';
    }
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const navItems = [
    { to: '/about', label: 'Sobre Nosotros', isActive: location.pathname === '/about' },
    { to: '/how-it-works', label: 'Cómo Funciona', isActive: location.pathname === '/how-it-works' },
    { to: '/blog', label: 'Blog', isActive: isBlogView }
  ];

  return (
    <>
      <header className="bg-slate-100 text-slate-800 shadow-lg no-print relative z-30">
        <div className="container mx-auto px-4 py-3 md:py-4 md:px-8 flex items-center justify-between gap-x-3 sm:gap-x-4">
          {/* Logo/Title */}
          <Link
            to="/"
            className="group focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 focus:ring-offset-slate-100 rounded-lg px-2 py-2 sm:px-4 border-2 border-slate-300 hover:border-slate-400 hover:bg-slate-200/60 transition-colors duration-150 flex-shrink min-w-0"
            aria-label={`Ir a la página principal de ${getPageTitle()}`}
            onClick={closeMenu}
          >
            <h1 className="text-base sm:text-lg md:text-2xl lg:text-3xl font-bold tracking-tight text-slate-800 group-hover:text-slate-700 transition-colors duration-150 break-words">
              {getPageTitle()}
            </h1>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-2">
            {navItems.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className={`px-3 sm:px-4 py-2 rounded-lg text-sm font-semibold transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 focus:ring-offset-slate-100 flex-shrink-0
                          ${item.isActive
                            ? 'bg-teal-600 text-white shadow-md ring-2 ring-teal-300/70'
                            : 'bg-slate-200 hover:bg-slate-300 text-slate-700 hover:text-slate-800'
                          }`}
                aria-current={item.isActive ? 'page' : undefined}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Mobile Hamburger Button - GitHub Style */}
          <button
            onClick={toggleMenu}
            className="md:hidden p-2 rounded-lg bg-slate-200 hover:bg-slate-300 transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 focus:ring-offset-slate-100"
            aria-label="Abrir menú de navegación"
            aria-expanded={isMenuOpen}
          >
            <svg 
              aria-hidden="true" 
              height="16" 
              viewBox="0 0 16 16" 
              version="1.1" 
              width="16" 
              className="text-slate-700"
            >
              <path 
                d="M1 2.75A.75.75 0 0 1 1.75 2h12.5a.75.75 0 0 1 0 1.5H1.75A.75.75 0 0 1 1 2.75Zm0 5A.75.75 0 0 1 1.75 7h12.5a.75.75 0 0 1 0 1.5H1.75A.75.75 0 0 1 1 7.75ZM1.75 12h12.5a.75.75 0 0 1 0 1.5H1.75a.75.75 0 0 1 0-1.5Z"
                fill="currentColor"
              />
            </svg>
          </button>
        </div>
      </header>

      {/* Backdrop - Semi-transparent overlay */}
      {isMenuOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm z-40"
          onClick={closeMenu}
          aria-hidden="true"
        />
      )}

      {/* Mobile Navigation Menu - Side Panel */}
      <div className={`md:hidden fixed top-0 right-0 h-full w-80 bg-white shadow-2xl transform transition-transform duration-300 ease-in-out z-50 ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'}`} style={{ display: isMenuOpen ? 'block' : 'none' }}>
        <div className="flex flex-col h-full">
          {/* Menu Header */}
          <div className="flex items-center justify-between p-4 border-b border-slate-200">
            <h2 className="text-lg font-semibold text-slate-800">Menú</h2>
            <button
              onClick={closeMenu}
              className="p-3 rounded-lg hover:bg-slate-100 transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-teal-500"
              aria-label="Cerrar menú"
            >
              <svg 
                aria-hidden="true" 
                height="20" 
                viewBox="0 0 16 16" 
                version="1.1" 
                width="20" 
                className="text-slate-600"
              >
                <path 
                  d="M3.72 3.72a.75.75 0 0 1 1.06 0L8 6.94l3.22-3.22a.749.749 0 0 1 1.275.326.749.749 0 0 1-.215.734L9.06 8l3.22 3.22a.749.749 0 0 1-.326 1.275.749.749 0 0 1-.734-.215L8 9.06l-3.22 3.22a.751.751 0 0 1-1.042-.018.751.751 0 0 1-.018-1.042L6.94 8 3.72 4.78a.75.75 0 0 1 0-1.06Z"
                  fill="currentColor"
                />
              </svg>
            </button>
          </div>

          {/* Menu Items */}
          <nav className="flex-1 p-4">
            <div className="flex flex-col space-y-2">
              {navItems.map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`px-4 py-3 rounded-lg text-base font-medium transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 focus:ring-offset-white
                            ${item.isActive
                              ? 'bg-teal-600 text-white shadow-md'
                              : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
                            }`}
                  aria-current={item.isActive ? 'page' : undefined}
                  onClick={closeMenu}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </nav>

          {/* Menu Footer */}
          <div className="p-4 border-t border-slate-200">
            <div className="text-sm text-slate-500">
              <p>BoatTrip Planner</p>
              <p className="text-xs mt-1">Tu planificador náutico inteligente</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Header;