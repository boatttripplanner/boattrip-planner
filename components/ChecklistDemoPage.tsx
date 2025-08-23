import React, { useState } from 'react';
import ChecklistShowcase from './ChecklistShowcase';
import ChecklistDashboard from './ChecklistDashboard';
import { ChecklistIcon, BarChart3Icon, HomeIcon } from './icons';

const ChecklistDemoPage: React.FC = () => {
  const [currentView, setCurrentView] = useState<'showcase' | 'dashboard'>('showcase');

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Header */}
      <nav className="bg-white shadow-lg border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <ChecklistIcon className="w-8 h-8 text-blue-600" />
                <span className="text-xl font-bold text-gray-900">BoatTrip Checklists</span>
              </div>
            </div>
            
            <div className="flex space-x-2">
              <button
                onClick={() => setCurrentView('showcase')}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                  currentView === 'showcase'
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <HomeIcon className="w-5 h-5" />
                <span>Checklists</span>
              </button>
              
              <button
                onClick={() => setCurrentView('dashboard')}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                  currentView === 'dashboard'
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <BarChart3Icon className="w-5 h-5" />
                <span>Dashboard</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main>
        {currentView === 'showcase' && <ChecklistShowcase />}
        {currentView === 'dashboard' && <ChecklistDashboard />}
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8 mt-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="mb-4">
            <ChecklistIcon className="w-8 h-8 text-blue-400 mx-auto mb-2" />
            <h3 className="text-lg font-semibold">Sistema de Checklists Interactivos</h3>
          </div>
          <p className="text-gray-300 mb-4">
            Organiza tu aventura náutica con checklists inteligentes y productos Amazon recomendados
          </p>
          <div className="text-sm text-gray-400">
            <p>✅ Productos verificados • 💡 Consejos expertos • 📱 Totalmente interactivo</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default ChecklistDemoPage;
