import React, { useState, useEffect } from 'react';
import { Button } from './Button';

import { MapPinIcon } from './icons/MapPinIcon';
// import { AnchorIcon } from './icons/AnchorIcon'; // Icono no disponible
import { WindIcon } from './icons/WindIcon';
import { NotFoundPageProps } from '../types';

const NotFoundPage: React.FC<NotFoundPageProps> = ({ onNavigateHome, showAppInstallBanner = false }) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Actualizar la hora cada segundo
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setIsLoading(true);
      // Simular búsqueda
      setTimeout(() => {
        setIsLoading(false);
        // Aquí podrías implementar una búsqueda real
        console.log('Buscando:', searchQuery);
      }, 2000);
    }
  };

  const popularDestinations = [
    { name: 'Baleares', url: '/blog/balearicas-guia-completa' },
    { name: 'Canarias', url: '/blog/canarias-destino-nautico' },
    { name: 'Costa Brava', url: '/blog/navegar-costa-brava-explora-encanto-mediterraneo' },
    { name: 'Ibiza', url: '/blog/navegar-en-ibiza-descubre-isla-magica' },
    { name: 'Menorca', url: '/blog/menorca-en-barco-paraiso-calas-turquesas' }
  ];

  const helpfulLinks = [
    { name: 'Planificador de Viajes', action: onNavigateHome },
    { name: 'Blog Náutico', action: () => (window.location.href = '/blog') },
    { name: 'Cómo Funciona', action: () => (window.location.href = '/how-it-works') },
    { name: 'Sobre Nosotros', action: () => (window.location.href = '/about') }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-teal-50 to-cyan-50 relative overflow-hidden">
      {/* Elementos de fondo animados */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Olas animadas */}
        <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-blue-200/30 to-transparent animate-pulse"></div>
        <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-teal-200/20 to-transparent animate-pulse" style={{ animationDelay: '1s' }}></div>
        
        {/* Burbujas flotantes */}
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="absolute w-4 h-4 bg-blue-300/20 rounded-full animate-bounce"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 2}s`,
              animationDuration: `${3 + Math.random() * 2}s`
            }}
          ></div>
        ))}
      </div>

              <div className={`relative z-10 flex flex-col items-center justify-center min-h-screen p-4 transition-all duration-300 ease-out ${showAppInstallBanner ? 'pt-20 sm:pt-24' : ''}`}>
        <div className="w-full max-w-4xl mx-auto">
          {/* Header con información náutica */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-4 mb-4 text-sm text-slate-600">
              <div className="flex items-center gap-2">
                <WindIcon className="w-4 h-4" />
                <span>Viento: {Math.floor(Math.random() * 20) + 5} nudos</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPinIcon className="w-4 h-4" />
                <span>Lat: 40°N, Lon: 3°W</span>
              </div>
              <div className="flex items-center gap-2">
                <span>{currentTime.toLocaleTimeString('es-ES')}</span>
              </div>
            </div>
          </div>

          {/* Contenido principal */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-2xl p-8 md:p-12 border border-white/50">
            {/* Logo principal (igual que en Landing) */}
            <div className="text-center mb-6">
              <div className="flex justify-center">
                <div className="relative">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 bg-gradient-to-br from-ocean-500 via-sea-500 to-sunset-500 rounded-full flex items-center justify-center shadow-2xl">
                    <img
                      src="/alex5.svg"
                      alt="BoatTrip Planner Logo"
                      className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12"
                    />
                  </div>
                  <div className="absolute inset-0 w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 border-2 border-ocean-300 rounded-full animate-ping opacity-20"></div>
                  <div className="absolute inset-0 w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 border-2 border-sea-300 rounded-full animate-ping opacity-20" style={{ animationDelay: '1s' }}></div>
                </div>
              </div>
            </div>

            {/* Título principal sin icono */}
            <div className="text-center mb-8">
              
              <h1 className="text-5xl md:text-7xl font-bold text-slate-800 mb-4">
                ¡Naufragio Digital!
              </h1>
              
              <h2 className="text-xl md:text-2xl font-semibold text-slate-700 mb-6">
                La página que buscas se ha perdido en alta mar
              </h2>
              
              <p className="text-lg text-slate-600 mb-8 max-w-2xl mx-auto leading-relaxed">
                Parece que tu brújula digital te ha llevado a aguas desconocidas. 
                No te preocupes, incluso los mejores navegantes se pierden de vez en cuando. 
                ¡Te ayudamos a encontrar el rumbo correcto!
              </p>
            </div>

            {/* Búsqueda */}
            <div className="mb-8">
              <form onSubmit={handleSearch} className="max-w-md mx-auto">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="¿Qué estás buscando?"
                    className="flex-1 px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  />
                  <Button
                    type="submit"
                    variant="primary"
                    disabled={isLoading}
                    className="px-6"
                  >
                    {isLoading ? 'Buscando…' : 'Buscar'}
                  </Button>
                </div>
              </form>
            </div>

            {/* Destinos populares */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-slate-800 mb-4 text-center">Destinos Populares</h3>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                {popularDestinations.map((dest) => (
                  <button
                    key={dest.name}
                    onClick={() => window.location.href = dest.url}
                    className="p-3 bg-gradient-to-br from-blue-100 to-teal-100 hover:from-blue-200 hover:to-teal-200 rounded-lg transition-all duration-200 text-sm font-medium text-slate-700 hover:scale-105"
                  >
                    {dest.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Enlaces útiles */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-slate-800 mb-4 text-center">Enlaces Útiles</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {helpfulLinks.map((link) => (
                  <button
                    key={link.name}
                    onClick={link.action}
                    className="p-4 bg-gradient-to-br from-slate-100 to-slate-200 hover:from-slate-200 hover:to-slate-300 rounded-lg transition-all duration-200 text-center group"
                  >
                    <div className="text-sm font-medium text-slate-700">
                      {link.name}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Botón principal */}
            <div className="text-center">
              <Button
                onClick={onNavigateHome}
                variant="primary"
                className="text-lg px-8 py-4 bg-gradient-to-r from-teal-500 to-blue-600 hover:from-teal-600 hover:to-blue-700 transform hover:scale-105 transition-all duration-200 shadow-lg"
                aria-label="Volver al planificador principal"
              >
                Navegar al Planificador Principal
              </Button>
            </div>

            {/* Mensaje de consuelo */}
            <div className="mt-8 text-center">
              <div className="inline-flex items-center gap-2 text-slate-500 text-sm">
                <span>Recuerda: "Un buen marinero no teme al mar, aprende a navegarlo"</span>
              </div>
            </div>
          </div>

          {/* Footer informativo */}
          <div className="text-center mt-8 text-sm text-slate-500">
            <p>
              ¿Encontraste un error? <a href="mailto:support@boattrip-planner.com" className="text-teal-600 hover:underline">Reporta el problema</a>
            </p>
            <p className="mt-2">
              Código de error: 404 | Timestamp: {currentTime.toISOString()}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;