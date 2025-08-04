

import React, { useState } from 'react';
import { BoatOutlineIcon } from './icons/BoatOutlineIcon';
import { SparklesIcon } from './icons/SparklesIcon';
import { MapPinIcon } from './icons/MapPinIcon';
import { UsersIcon } from './icons/UsersIcon';
import { ShoppingCartIcon } from './icons/ShoppingCartIcon';
import { PhoneIcon } from './icons/PhoneIcon';
import { CheckCircleIcon } from './icons/CheckCircleIcon';
import { StarOutlineIcon } from './icons/StarOutlineIcon';
import ShieldCheckIcon from './icons/ShieldCheckIcon';
import { MapRouteIcon } from './icons/MapRouteIcon';

const Footer: React.FC = () => {
  const [expandedSections, setExpandedSections] = useState<{ [key: string]: boolean }>({
    navegacion: false,
    recursos: false,
    contacto: false
  });

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const linkStyle = "group flex items-center gap-2 sm:gap-3 py-2 sm:py-2.5 px-2 sm:px-3 rounded-lg sm:rounded-xl hover:bg-white/10 hover:text-white transition-all duration-300 text-slate-200 hover:shadow-lg hover:scale-105 transform";

  return (
    <footer className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white overflow-hidden">
      {/* Enhanced Background Pattern */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.02'%3E%3Ccircle cx='30' cy='30' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}></div>
      </div>
      
      {/* Animated Waves */}
      <div className="absolute bottom-0 left-0 right-0 h-16 sm:h-20 md:h-24 overflow-hidden">
        <div className="absolute bottom-0 left-0 right-0 h-full">
          <svg className="w-full h-full" viewBox="0 0 1200 120" preserveAspectRatio="none">
            <path d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z" opacity=".25" className="fill-ocean-600"></path>
            <path d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z" opacity=".5" className="fill-sea-500"></path>
            <path d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z" className="fill-sunset-400"></path>
          </svg>
        </div>
      </div>

      <div className="relative z-10">
        {/* Main Footer Content - Optimizado para móvil */}
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-6 sm:py-8 md:py-12 lg:py-16">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 sm:gap-8 lg:gap-12">
            
            {/* Enhanced Brand Section - Optimizado para móvil */}
            <div className="lg:col-span-1">
              <div className="mb-4 sm:mb-6">
                <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-gradient-to-br from-ocean-500 to-sea-500 rounded-lg sm:rounded-xl flex items-center justify-center shadow-lg">
                    <BoatOutlineIcon className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-white">BoatTrip Planner</h3>
                    <p className="text-xs sm:text-sm text-ocean-200 font-medium">Planificador Náutico IA</p>
                  </div>
                </div>
                <p className="text-xs sm:text-sm leading-relaxed text-slate-200 mb-4 sm:mb-6">
                  Tu planificador de viajes náuticos inteligente, potenciado por IA. 
                  Trazamos tu rumbo real para aventuras inolvidables en el mar.
                </p>
              </div>
              
              {/* Enhanced Features - Optimizado para móvil */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3">
                <div className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 bg-white/5 rounded-lg sm:rounded-xl border border-white/10 hover:bg-white/10 transition-all duration-300 group">
                  <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-br from-ocean-500/30 to-blue-500/30 rounded-md sm:rounded-lg flex items-center justify-center border border-ocean-400/30 group-hover:scale-110 transition-transform">
                    <SparklesIcon className="w-3 h-3 sm:w-4 sm:h-4 text-ocean-300" />
                  </div>
                  <div>
                    <div className="text-xs sm:text-sm font-medium text-white">Planificación inteligente</div>
                    <div className="text-xs text-slate-300">IA avanzada para rutas óptimas</div>
                  </div>
                </div>
                <div className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 bg-white/5 rounded-lg sm:rounded-xl border border-white/10 hover:bg-white/10 transition-all duration-300 group">
                  <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-br from-sea-500/30 to-teal-500/30 rounded-md sm:rounded-lg flex items-center justify-center border border-sea-400/30 group-hover:scale-110 transition-transform">
                    <MapPinIcon className="w-3 h-3 sm:w-4 sm:h-4 text-sea-300" />
                  </div>
                  <div>
                    <div className="text-xs sm:text-sm font-medium text-white">Destinos exclusivos</div>
                    <div className="text-xs text-slate-300">Lugares únicos del Mediterráneo</div>
                  </div>
                </div>
                <div className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 bg-white/5 rounded-lg sm:rounded-xl border border-white/10 hover:bg-white/10 transition-all duration-300 group">
                  <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-br from-teal-500/30 to-cyan-500/30 rounded-md sm:rounded-lg flex items-center justify-center border border-teal-400/30 group-hover:scale-110 transition-transform">
                    <UsersIcon className="w-3 h-3 sm:w-4 sm:h-4 text-teal-300" />
                  </div>
                  <div>
                    <div className="text-xs sm:text-sm font-medium text-white">Comunidad náutica</div>
                    <div className="text-xs text-slate-300">Conecta con otros navegantes</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Collapsible Sections - Optimizado para móvil */}
            <div className="lg:col-span-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              
              {/* Navegación Section - Optimizado para móvil */}
              <div className="space-y-2 sm:space-y-3">
                <button
                  onClick={() => toggleSection('navegacion')}
                  className="flex items-center justify-between w-full p-2 sm:p-3 bg-white/5 rounded-lg sm:rounded-xl border border-white/10 hover:bg-white/10 transition-all duration-300 group"
                >
                  <div className="flex items-center gap-2 sm:gap-3">
                    <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-br from-blue-500/30 to-indigo-500/30 rounded-md sm:rounded-lg flex items-center justify-center border border-blue-400/30 group-hover:scale-110 transition-transform">
                      <MapRouteIcon className="w-3 h-3 sm:w-4 sm:h-4 text-blue-300" />
                    </div>
                    <div>
                      <h4 className="text-sm sm:text-base font-semibold text-white">Navegación</h4>
                      <p className="text-xs text-slate-300">Explora nuestra plataforma</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-gradient-to-r from-blue-400 to-indigo-400 rounded-full"></div>
                    <span className="text-xs text-slate-300">
                      {expandedSections.navegacion ? 'Ocultar' : 'Ver más'}
                    </span>
                  </div>
                </button>
                
                <div className={`space-y-1 sm:space-y-2 transition-all duration-500 ease-in-out ${
                  expandedSections.navegacion ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0 overflow-hidden'
                }`}>
                  <a href="/" className={linkStyle}>
                    <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-gradient-to-r from-blue-400 to-indigo-400 rounded-full"></div>
                    <span className="text-xs sm:text-sm">Inicio</span>
                  </a>
                  <a href="/?view=wizard" className={linkStyle}>
                    <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-gradient-to-r from-blue-400 to-indigo-400 rounded-full"></div>
                    <span className="text-xs sm:text-sm">Planificador</span>
                  </a>
                  <a href="/?view=blog" className={linkStyle}>
                    <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-gradient-to-r from-blue-400 to-indigo-400 rounded-full"></div>
                    <span className="text-xs sm:text-sm">Blog</span>
                  </a>
                  <a href="/?view=about" className={linkStyle}>
                    <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-gradient-to-r from-blue-400 to-indigo-400 rounded-full"></div>
                    <span className="text-xs sm:text-sm">Sobre Nosotros</span>
                  </a>
                </div>
              </div>

              {/* Recursos Section - Optimizado para móvil */}
              <div className="space-y-2 sm:space-y-3">
                <button
                  onClick={() => toggleSection('recursos')}
                  className="flex items-center justify-between w-full p-2 sm:p-3 bg-white/5 rounded-lg sm:rounded-xl border border-white/10 hover:bg-white/10 transition-all duration-300 group"
                >
                  <div className="flex items-center gap-2 sm:gap-3">
                    <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-br from-purple-500/30 to-pink-500/30 rounded-md sm:rounded-lg flex items-center justify-center border border-purple-400/30 group-hover:scale-110 transition-transform">
                      <ShoppingCartIcon className="w-3 h-3 sm:w-4 sm:h-4 text-purple-300" />
                    </div>
                    <div>
                      <h4 className="text-sm sm:text-base font-semibold text-white">Recursos</h4>
                      <p className="text-xs text-slate-300">Herramientas y productos</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full"></div>
                    <span className="text-xs text-slate-300">
                      {expandedSections.recursos ? 'Ocultar' : 'Ver más'}
                    </span>
                  </div>
                </button>
                
                <div className={`space-y-1 sm:space-y-2 transition-all duration-500 ease-in-out ${
                  expandedSections.recursos ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0 overflow-hidden'
                }`}>
                  <a href="/?view=products" className={linkStyle}>
                    <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full"></div>
                    <span className="text-xs sm:text-sm">Productos Náuticos</span>
                  </a>
                  <a href="/?view=guides" className={linkStyle}>
                    <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full"></div>
                    <span className="text-xs sm:text-sm">Guías de Navegación</span>
                  </a>
                  <a href="/?view=destinations" className={linkStyle}>
                    <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full"></div>
                    <span className="text-xs sm:text-sm">Destinos</span>
                  </a>
                  <a href="/?view=reviews" className={linkStyle}>
                    <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full"></div>
                    <span className="text-xs sm:text-sm">Reviews</span>
                  </a>
                </div>
              </div>

              {/* Contacto Section - Optimizado para móvil */}
              <div className="space-y-2 sm:space-y-3">
                <button
                  onClick={() => toggleSection('contacto')}
                  className="flex items-center justify-between w-full p-2 sm:p-3 bg-white/5 rounded-lg sm:rounded-xl border border-white/10 hover:bg-white/10 transition-all duration-300 group"
                >
                  <div className="flex items-center gap-2 sm:gap-3">
                    <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-br from-red-500/30 to-pink-500/30 rounded-md sm:rounded-lg flex items-center justify-center border border-red-400/30 group-hover:scale-110 transition-transform">
                      <PhoneIcon className="w-3 h-3 sm:w-4 sm:h-4 text-red-300" />
                    </div>
                    <div>
                      <h4 className="text-sm sm:text-base font-semibold text-white">Contacto</h4>
                      <p className="text-xs text-slate-300">Conecta con nosotros</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-gradient-to-r from-red-400 to-pink-400 rounded-full"></div>
                    <span className="text-xs text-slate-300">
                      {expandedSections.contacto ? 'Ocultar' : 'Ver más'}
                    </span>
                  </div>
                </button>
                
                <div className={`space-y-1 sm:space-y-2 transition-all duration-500 ease-in-out ${
                  expandedSections.contacto ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0 overflow-hidden'
                }`}>
                  <a href="mailto:boattripplanner@gmail.com" className={linkStyle}>
                    <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-gradient-to-r from-red-400 to-pink-400 rounded-full"></div>
                    <span className="text-xs sm:text-sm">Email</span>
                  </a>
                  <a href="/?view=privacy" className={linkStyle}>
                    <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-gradient-to-r from-red-400 to-pink-400 rounded-full"></div>
                    <span className="text-xs sm:text-sm">Privacidad</span>
                  </a>
                  <a href="/?view=terms" className={linkStyle}>
                    <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-gradient-to-r from-red-400 to-pink-400 rounded-full"></div>
                    <span className="text-xs sm:text-sm">Términos</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Divider - Optimizado para móvil */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gradient-to-r from-transparent via-white/20 to-transparent"></div>
          </div>
          <div className="relative flex justify-center">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-ocean-500 to-sea-500 rounded-full flex items-center justify-center shadow-lg">
              <BoatOutlineIcon className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            </div>
          </div>
        </div>

        {/* Bottom Bar - Optimizado para móvil */}
        <div className="px-3 sm:px-4 lg:px-8 py-3 sm:py-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-2 sm:gap-4">
            <div className="text-center sm:text-left">
              <p className="text-xs sm:text-sm text-slate-300">
                © 2025 BoatTrip Planner. Todos los derechos reservados.
              </p>
            </div>
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1 sm:py-1.5 bg-white/5 rounded-full border border-white/10">
                <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-xs text-slate-300">Online</span>
              </div>
              <div className="flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1 sm:py-1.5 bg-white/5 rounded-full border border-white/10">
                <ShieldCheckIcon className="w-3 h-3 sm:w-4 sm:h-4 text-green-400" />
                <span className="text-xs text-slate-300">Seguro</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;