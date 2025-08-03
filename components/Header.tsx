import React from 'react';
import { AppView } from '../types';
import { Button } from './Button';

interface HeaderProps {
  title: string;
  onNavigateHome: () => void;
  onNavigateToBlogIndex: () => void;
  currentView: AppView;
  showAppInstallBanner?: boolean;
}

const Header: React.FC<HeaderProps> = ({ 
  title, 
  onNavigateHome, 
  onNavigateToBlogIndex,
  currentView,
  showAppInstallBanner = false
}) => {
  return (
    <header className={`bg-white/90 backdrop-blur-md border-b border-slate-200 sticky z-40 shadow-soft transition-all duration-300 ease-out ${showAppInstallBanner ? 'top-16 sm:top-20' : 'top-0'}`}>
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
        <div className="flex justify-between items-center h-14 sm:h-16">
          {/* Logo and Title */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            <button
              onClick={onNavigateHome}
              className="flex items-center space-x-2 sm:space-x-3 group hover:opacity-80 transition-opacity duration-200"
            >
              <div className="hidden sm:block">
                <h1 className="text-lg sm:text-xl font-bold text-slate-800 group-hover:text-ocean-600 transition-colors duration-200">
                  {title}
                </h1>
                <p className="text-xs text-slate-500">Planificador Náutico IA</p>
              </div>
              <div className="sm:hidden">
                <h1 className="text-lg font-bold text-slate-800 group-hover:text-ocean-600 transition-colors duration-200">
                  {title}
                </h1>
              </div>
            </button>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            <Button
              onClick={onNavigateHome}
              variant={currentView === AppView.MAIN_APP ? "primary" : "secondary"}
              className={`px-3 sm:px-4 py-2 rounded-lg transition-all duration-200 ${
                currentView === AppView.MAIN_APP 
                  ? 'bg-gradient-to-r from-ocean-500 to-sea-500 text-white shadow-medium' 
                  : 'bg-white hover:bg-slate-50 text-slate-700 hover:text-ocean-600 border border-slate-200 hover:border-ocean-200'
              }`}
            >
              <span className="flex items-center gap-2">
                <span>🧭</span>
                <span className="hidden lg:inline">Planificador</span>
              </span>
            </Button>
            
            <Button
              onClick={onNavigateToBlogIndex}
              variant={currentView === AppView.BLOG_INDEX || currentView === AppView.BLOG_POST ? "primary" : "secondary"}
              className={`px-3 sm:px-4 py-2 rounded-lg transition-all duration-200 ${
                currentView === AppView.BLOG_INDEX || currentView === AppView.BLOG_POST
                  ? 'bg-gradient-to-r from-ocean-500 to-sea-500 text-white shadow-medium' 
                  : 'bg-white hover:bg-slate-50 text-slate-700 hover:text-ocean-600 border border-slate-200 hover:border-ocean-200'
              }`}
            >
              <span className="flex items-center gap-2">
                <span>📝</span>
                <span className="hidden lg:inline">Blog</span>
              </span>
            </Button>
          </nav>

          {/* Mobile Navigation */}
          <div className="md:hidden flex items-center space-x-2">
            <Button
              onClick={onNavigateHome}
              variant={currentView === AppView.MAIN_APP ? "primary" : "secondary"}
              className={`px-2 py-1.5 rounded-md transition-all duration-200 text-xs ${
                currentView === AppView.MAIN_APP 
                  ? 'bg-gradient-to-r from-ocean-500 to-sea-500 text-white shadow-medium' 
                  : 'bg-white hover:bg-slate-50 text-slate-700 hover:text-ocean-600 border border-slate-200 hover:border-ocean-200'
              }`}
            >
              🧭
            </Button>
            
            <Button
              onClick={onNavigateToBlogIndex}
              variant={currentView === AppView.BLOG_INDEX || currentView === AppView.BLOG_POST ? "primary" : "secondary"}
              className={`px-2 py-1.5 rounded-md transition-all duration-200 text-xs ${
                currentView === AppView.BLOG_INDEX || currentView === AppView.BLOG_POST
                  ? 'bg-gradient-to-r from-ocean-500 to-sea-500 text-white shadow-medium' 
                  : 'bg-white hover:bg-slate-50 text-slate-700 hover:text-ocean-600 border border-slate-200 hover:border-ocean-200'
              }`}
            >
              📝
            </Button>
          </div>

          {/* Status Indicator */}
          <div className="hidden sm:flex items-center space-x-2">
            <div className="flex items-center space-x-2 px-2 sm:px-3 py-1 bg-gradient-to-r from-sea-50 to-ocean-50 rounded-full border border-sea-200">
              <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-sea-500 rounded-full animate-pulse"></div>
              <span className="text-xs font-medium text-sea-700">Online</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;