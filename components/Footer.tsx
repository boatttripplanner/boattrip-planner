

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

interface FooterProps {
  onShowPrivacyPolicy?: () => void;
  onShowTermsOfService?: () => void;
  onNavigateToMainApp?: () => void;
  onNavigateToBlogIndex?: () => void;
  showAds?: boolean;
  currentView?: any;
}

const Footer: React.FC<FooterProps> = ({ 
  onShowPrivacyPolicy, 
  onShowTermsOfService, 
  onNavigateToMainApp, 
  onNavigateToBlogIndex 
}) => {
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

  const linkStyle = "group flex items-center gap-2 py-2 px-3 rounded-lg hover:bg-white/10 hover:text-white transition-all duration-300 text-slate-200 hover:shadow-md hover:scale-102 transform backdrop-blur-sm";

  return (
    <footer className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white overflow-hidden">
      {/* Enhanced Background Pattern */}
      <div className="absolute inset-0 opacity-15">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.03'%3E%3Ccircle cx='30' cy='30' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}></div>
      </div>
      
      {/* Enhanced Animated Waves - Reduced Height */}
      <div className="absolute bottom-0 left-0 right-0 h-16 overflow-hidden">
        <div className="absolute bottom-0 left-0 right-0 h-full">
          <svg className="w-full h-full" viewBox="0 0 1200 120" preserveAspectRatio="none">
            <path d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z" opacity=".25" className="fill-ocean-600"></path>
            <path d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z" opacity=".5" className="fill-sea-500"></path>
            <path d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z" className="fill-sea-400"></path>
          </svg>
        </div>
      </div>

      <div className="relative z-10">
        {/* Main Footer Content - Compact */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 sm:gap-6">
            
            {/* Compact Brand Section */}
            <div className="lg:col-span-1">
              <div className="mb-3 sm:mb-4">
                <div className="mb-2 sm:mb-3">
                  <div>
                    <h3 className="text-base sm:text-lg font-bold text-white bg-gradient-to-r from-white to-slate-200 bg-clip-text text-transparent">BoatTrip Planner</h3>
                    <p className="text-xs sm:text-sm text-ocean-200 font-medium">Planificador Náutico IA</p>
                  </div>
                </div>
                <p className="text-xs sm:text-sm leading-relaxed text-slate-200 mb-3">
                  Tu planificador de viajes náuticos inteligente, potenciado por IA.
                </p>
              </div>
            </div>

            {/* Compact Collapsible Sections - Inline */}
            <div className="lg:col-span-3 flex flex-col sm:flex-row gap-3 sm:gap-4">
              
              {/* Compact Navegación Section */}
              <div className="space-y-2 flex-1">
                <button
                  onClick={() => toggleSection('navegacion')}
                  className="flex items-center justify-between w-full p-2 sm:p-3 bg-white/5 backdrop-blur-md rounded-lg border border-white/10 hover:bg-white/10 transition-all duration-300 group hover:shadow-md hover:shadow-blue-500/10"
                >
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-br from-blue-500/40 to-indigo-500/40 rounded-lg flex items-center justify-center border border-blue-400/30 group-hover:scale-110 transition-transform shadow-sm">
                      <MapRouteIcon className="w-3 h-3 sm:w-4 sm:h-4 text-blue-300" />
                    </div>
                    <div>
                      <h4 className="text-xs sm:text-sm font-bold text-white">Navegación</h4>
                      <p className="text-xs text-slate-300">Explora nuestra plataforma</p>
                    </div>
                  </div>
                </button>
                
                <div className={`space-y-1 transition-all duration-300 ease-in-out ${
                  expandedSections.navegacion ? 'max-h-60 opacity-100' : 'max-h-0 opacity-0 overflow-hidden'
                }`}>
                  <button 
                    onClick={onNavigateToMainApp} 
                    className={linkStyle + " w-full text-left py-1.5 px-2"}
                  >
                    <span className="text-xs font-medium">Inicio</span>
                  </button>
                  <button 
                    onClick={onNavigateToMainApp} 
                    className={linkStyle + " w-full text-left py-1.5 px-2"}
                  >
                    <span className="text-xs font-medium">Planificador</span>
                  </button>
                  <button 
                    onClick={onNavigateToBlogIndex} 
                    className={linkStyle + " w-full text-left py-1.5 px-2"}
                  >
                    <span className="text-xs font-medium">Blog</span>
                  </button>
                  <button 
                    onClick={() => window.location.href = '/?view=about_us'} 
                    className={linkStyle + " w-full text-left py-1.5 px-2"}
                  >
                    <span className="text-xs font-medium">Sobre Nosotros</span>
                  </button>
                </div>
              </div>

              {/* Compact Recursos Section */}
              <div className="space-y-2 flex-1">
                <button
                  onClick={() => toggleSection('recursos')}
                  className="flex items-center justify-between w-full p-2 sm:p-3 bg-white/5 backdrop-blur-md rounded-lg border border-white/10 hover:bg-white/10 transition-all duration-300 group hover:shadow-md hover:shadow-purple-500/10"
                >
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-br from-purple-500/40 to-pink-500/40 rounded-lg flex items-center justify-center border border-purple-400/30 group-hover:scale-110 transition-transform shadow-sm">
                      <ShoppingCartIcon className="w-3 h-3 sm:w-4 sm:h-4 text-purple-300" />
                    </div>
                    <div>
                      <h4 className="text-xs sm:text-sm font-bold text-white">Recursos</h4>
                      <p className="text-xs text-slate-300">Herramientas y productos</p>
                    </div>
                  </div>
                </button>
                
                <div className={`space-y-1 transition-all duration-300 ease-in-out ${
                  expandedSections.recursos ? 'max-h-60 opacity-100' : 'max-h-0 opacity-0 overflow-hidden'
                }`}>
                  <a href="/?view=blog_index&category=Equipamiento" className={linkStyle + " py-1.5 px-2"}>
                    <span className="text-xs font-medium">Productos Náuticos</span>
                  </a>
                  <a href="/?view=blog_index&category=Técnicas de Navegación" className={linkStyle + " py-1.5 px-2"}>
                    <span className="text-xs font-medium">Guías de Navegación</span>
                  </a>
                  <a href="/?view=blog_index&category=Destinos" className={linkStyle + " py-1.5 px-2"}>
                    <span className="text-xs font-medium">Destinos</span>
                  </a>
                  <a href="/?view=blog_index&category=Reviews" className={linkStyle + " py-1.5 px-2"}>
                    <span className="text-xs font-medium">Reviews</span>
                  </a>
                </div>
              </div>

              {/* Compact Contacto Section */}
              <div className="space-y-2 flex-1">
                <button
                  onClick={() => toggleSection('contacto')}
                  className="flex items-center justify-between w-full p-2 sm:p-3 bg-white/5 backdrop-blur-md rounded-lg border border-white/10 hover:bg-white/10 transition-all duration-300 group hover:shadow-md hover:shadow-red-500/10"
                >
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-br from-red-500/40 to-pink-500/40 rounded-lg flex items-center justify-center border border-red-400/30 group-hover:scale-110 transition-transform shadow-sm">
                      <PhoneIcon className="w-3 h-3 sm:w-4 sm:h-4 text-red-300" />
                    </div>
                    <div>
                      <h4 className="text-xs sm:text-sm font-bold text-white">Contacto</h4>
                      <p className="text-xs text-slate-300">Conecta con nosotros</p>
                    </div>
                  </div>
                </button>
                
                <div className={`space-y-1 transition-all duration-300 ease-in-out ${
                  expandedSections.contacto ? 'max-h-60 opacity-100' : 'max-h-0 opacity-0 overflow-hidden'
                }`}>
                  <a href="https://mail.google.com/mail/?view=cm&fs=1&to=boattripplanner@gmail.com&su=Consulta%20BoatTrip%20Planner&body=Hola,%20me%20gustaría%20obtener%20más%20información%20sobre%20BoatTrip%20Planner." target="_blank" rel="noopener noreferrer" className={linkStyle + " py-1.5 px-2"}>
                    <span className="text-xs font-medium">Email</span>
                  </a>
                  <button 
                    onClick={onShowPrivacyPolicy} 
                    className={linkStyle + " w-full text-left py-1.5 px-2"}
                  >
                    <span className="text-xs font-medium">Privacidad</span>
                  </button>
                  <button 
                    onClick={onShowTermsOfService} 
                    className={linkStyle + " w-full text-left py-1.5 px-2"}
                  >
                    <span className="text-xs font-medium">Términos</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Compact Divider */}
        <div className="relative py-2">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gradient-to-r from-transparent via-white/20 to-transparent"></div>
          </div>

        </div>

        {/* Compact Bottom Bar */}
        <div className="px-4 sm:px-6 lg:px-8 py-2 sm:py-3">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-2 sm:gap-3">
            <div className="text-center sm:text-left">
              <p className="text-xs sm:text-sm text-slate-300 font-medium">
                © 2025 BoatTrip Planner. Todos los derechos reservados.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5 px-2 py-1 bg-white/5 backdrop-blur-md rounded-full border border-white/10 hover:bg-white/10 transition-all duration-300">
                <div className="w-1 h-1 bg-green-400 rounded-full animate-pulse shadow-sm"></div>
                <span className="text-xs text-slate-300 font-medium">Online</span>
              </div>
              <div className="flex items-center gap-1.5 px-2 py-1 bg-white/5 backdrop-blur-md rounded-full border border-white/10 hover:bg-white/10 transition-all duration-300">
                <ShieldCheckIcon className="w-3 h-3 text-green-400" />
                <span className="text-xs text-slate-300 font-medium">Seguro</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;