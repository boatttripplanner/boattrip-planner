import React from 'react';
import { AppView } from '../types';

interface HeaderProps {
  title: string;
  onNavigateHome: () => void;
  onNavigateToBlogIndex?: () => void;
  currentView: AppView;
  onNewQuery?: () => void;
}

const Header: React.FC<HeaderProps> = ({ title, onNavigateHome, onNavigateToBlogIndex, currentView, onNewQuery }) => {
  const isBlogViewActive = currentView === AppView.BLOG_INDEX || currentView === AppView.BLOG_POST;
  const isMainAppActive = currentView === AppView.MAIN_APP;

  return (
    <header className="bg-slate-800 text-white shadow-lg no-print">
      <div className="container mx-auto px-4 py-4 md:px-8 flex items-center justify-between gap-x-3 sm:gap-x-4">
        <button
          onClick={onNavigateHome}
          className="group focus:outline-none focus:ring-2 focus:ring-teal-300 focus:ring-offset-2 focus:ring-offset-slate-800 rounded-lg px-3 py-2 sm:px-4 border-2 border-slate-600 hover:border-slate-500 hover:bg-slate-700/60 transition-colors duration-150 flex-shrink min-w-0"
          aria-label={`Ir a la página principal de ${title.split('|')[0].trim()}`}
        >
          <h1 className="text-lg sm:text-xl md:text-3xl font-bold tracking-tight text-white group-hover:text-slate-100 transition-colors duration-150 break-words">
            {title}
          </h1>
        </button>

        <div className="flex items-center gap-2">
          {isMainAppActive && onNewQuery && (
            <button
              onClick={onNewQuery}
              className="px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-teal-300 focus:ring-offset-2 focus:ring-offset-slate-800 flex-shrink-0 bg-teal-600 hover:bg-teal-700 text-white shadow-md"
              aria-label="Nueva consulta"
            >
              🆕 Nueva Consulta
            </button>
          )}
          
          {onNavigateToBlogIndex && (
            <button
              onClick={onNavigateToBlogIndex}
              className={`px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-teal-300 focus:ring-offset-2 focus:ring-offset-slate-800 flex-shrink-0
                          ${isBlogViewActive 
                            ? 'bg-teal-600 text-white shadow-md ring-2 ring-teal-300/70'
                            : 'bg-slate-700 hover:bg-slate-600 text-slate-200 hover:text-white'
                          }`}
              aria-current={isBlogViewActive ? 'page' : undefined}
            >
              Blog
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;