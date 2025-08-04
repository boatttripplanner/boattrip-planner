

import React, { useState } from 'react';
import { SAMBOAT_AFFILIATE_URL, AMAZON_AFFILIATE_LINK_PLACEHOLDER, CONTACT_EMAIL } from '../constants';
import { FooterProps } from '../types'; 

import { BoatOutlineIcon } from './icons/BoatOutlineIcon';
import { MapPinIcon } from './icons/MapPinIcon';
import { PhoneIcon } from './icons/PhoneIcon';
import { SparklesIcon } from './icons/SparklesIcon';
import { UsersIcon } from './icons/UsersIcon';
import { DocumentTextIcon } from './icons/DocumentTextIcon';
import { ShoppingCartIcon } from './icons/ShoppingCartIcon';
import { InfoIcon } from './icons/InfoIcon';
import { CheckCircleIcon } from './icons/CheckCircleIcon';
import { StarOutlineIcon } from './icons/StarOutlineIcon';
import ShieldCheckIcon from './icons/ShieldCheckIcon';
import { WhatsAppIcon } from './icons/WhatsAppIcon';

const Footer: React.FC<FooterProps> = ({ 
  onShowPrivacyPolicy, 
  onShowTermsOfService,
  onNavigateToMainApp,
  onNavigateToBlogIndex,
}) => {
  // Estados para controlar los desplegables
  const [expandedSections, setExpandedSections] = useState({
    navigation: false,
    resources: false,
    contact: false
  });

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const linkStyle = "group flex items-center gap-3 py-2.5 px-3 rounded-xl hover:bg-white/10 hover:text-white transition-all duration-300 text-slate-200 hover:shadow-lg hover:scale-105 transform";
  
  return (
    <footer className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white pt-16 pb-8 no-print overflow-hidden border-t-4 border-ocean-500">
      {/* Enhanced Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M40 40c0-22.091 17.909-40 40-40v80c-22.091 0-40-17.909-40-40zm0 0c0 22.091-17.909 40-40 40V0c22.091 0 40 17.909 40 40z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}></div>
      </div>

      {/* Enhanced Animated Waves */}
      <div className="absolute top-0 left-0 w-full overflow-hidden leading-none" style={{ transform: 'translateY(1px)' }}>
        <svg className="relative block w-full h-[140px] sm:h-[200px]" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" viewBox="0 24 150 28" preserveAspectRatio="none" shapeRendering="auto">
          <defs>
            <path id="gentle-wave-path" d="M-160 44c30 0 58-18 88-18s 58 18 88 18 58-18 88-18 58 18 88 18 v44h-352z" />
          </defs>
          <g className="waves">
            <use xlinkHref="#gentle-wave-path" x="48" y="0" className="fill-ocean-600 opacity-90 animate-gentle-wave" />
            <use xlinkHref="#gentle-wave-path" x="48" y="3" className="fill-sea-500 opacity-70 animate-gentle-wave-2" />
            <use xlinkHref="#gentle-wave-path" x="48" y="5" className="fill-teal-400 opacity-50 animate-gentle-wave-3" />
            <use xlinkHref="#gentle-wave-path" x="48" y="7" className="fill-slate-700" />
          </g>
        </svg>
      </div>
      
      {/* Footer Content */}
      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
          
          {/* Enhanced Brand Section */}
          <div className="lg:col-span-1">
            <div className="mb-6">
              <div className="mb-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-ocean-500 to-sea-500 rounded-xl flex items-center justify-center shadow-lg">
                    <BoatOutlineIcon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-white">BoatTrip Planner</h3>
                    <p className="text-sm text-ocean-200 font-medium">Planificador Náutico IA</p>
                  </div>
                </div>
                <p className="text-sm leading-relaxed text-slate-200 mb-6">
                  Tu planificador de viajes náuticos inteligente, potenciado por IA. 
                  Trazamos tu rumbo real para aventuras inolvidables en el mar.
                </p>
              </div>
              
              {/* Enhanced Features */}
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 transition-all duration-300 group">
                  <div className="w-8 h-8 bg-gradient-to-br from-ocean-500/30 to-blue-500/30 rounded-lg flex items-center justify-center border border-ocean-400/30 group-hover:scale-110 transition-transform">
                    <SparklesIcon className="w-4 h-4 text-ocean-300" />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-white">Planificación inteligente</div>
                    <div className="text-xs text-slate-300">IA avanzada para rutas óptimas</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 transition-all duration-300 group">
                  <div className="w-8 h-8 bg-gradient-to-br from-sea-500/30 to-teal-500/30 rounded-lg flex items-center justify-center border border-sea-400/30 group-hover:scale-110 transition-transform">
                    <MapPinIcon className="w-4 h-4 text-sea-300" />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-white">Destinos exclusivos</div>
                    <div className="text-xs text-slate-300">Lugares únicos del Mediterráneo</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 transition-all duration-300 group">
                  <div className="w-8 h-8 bg-gradient-to-br from-teal-500/30 to-cyan-500/30 rounded-lg flex items-center justify-center border border-teal-400/30 group-hover:scale-110 transition-transform">
                    <UsersIcon className="w-4 h-4 text-teal-300" />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-white">Comunidad náutica</div>
                    <div className="text-xs text-slate-300">Conecta con otros navegantes</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Enhanced Navigation Section */}
          <div>
            <button 
              onClick={() => toggleSection('navigation')}
              className="w-full text-left mb-4 flex items-center justify-between group hover:bg-white/10 rounded-xl p-3 transition-all duration-300 border border-white/5 hover:border-white/20"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-ocean-500/40 to-sea-500/40 rounded-xl flex items-center justify-center border border-ocean-400/40 group-hover:scale-110 transition-transform">
                  <BoatOutlineIcon className="w-5 h-5 text-ocean-300" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white group-hover:text-ocean-200 transition-colors">
                    Navegación
                  </h3>
                  <p className="text-xs text-slate-300">Explora nuestra plataforma</p>
                </div>
              </div>
              <div className="text-xs text-ocean-300 opacity-60 group-hover:opacity-100 transition-opacity font-medium">
                {expandedSections.navigation ? 'Ocultar' : 'Ver más'}
              </div>
            </button>
            <ul className={`space-y-2 overflow-hidden transition-all duration-500 ${
              expandedSections.navigation ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
            }`}>
              <li>
                <button onClick={onNavigateToMainApp} className={linkStyle}>
                  <div className="w-3 h-3 bg-gradient-to-r from-ocean-400 to-blue-400 rounded-full group-hover:scale-125 transition-transform"></div>
                  <span className="font-medium">Planificador IA</span>
                </button>
              </li>
              {onNavigateToBlogIndex && (
                <li>
                  <button onClick={onNavigateToBlogIndex} className={linkStyle}>
                    <div className="w-3 h-3 bg-gradient-to-r from-sea-400 to-teal-400 rounded-full group-hover:scale-125 transition-transform"></div>
                    <span className="font-medium">Blog Náutico</span>
                  </button>
                </li>
              )}
              <li>
                <a href="/?view=blog_index&category=Destinos" className={linkStyle}>
                  <div className="w-3 h-3 bg-gradient-to-r from-teal-400 to-cyan-400 rounded-full group-hover:scale-125 transition-transform"></div>
                  <span className="font-medium">Destinos</span>
                </a>
              </li>
              <li>
                <a href="/?view=blog_index&category=Equipamiento" className={linkStyle}>
                  <div className="w-3 h-3 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full group-hover:scale-125 transition-transform"></div>
                  <span className="font-medium">Equipamiento</span>
                </a>
              </li>
              <li>
                <a href="/?view=blog_index&category=Consejos" className={linkStyle}>
                  <div className="w-3 h-3 bg-gradient-to-r from-amber-400 to-orange-400 rounded-full group-hover:scale-125 transition-transform"></div>
                  <span className="font-medium">Consejos</span>
                </a>
              </li>
            </ul>
          </div>

          {/* Enhanced Resources Section */}
          <div>
            <button 
              onClick={() => toggleSection('resources')}
              className="w-full text-left mb-4 flex items-center justify-between group hover:bg-white/10 rounded-xl p-3 transition-all duration-300 border border-white/5 hover:border-white/20"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-500/40 to-pink-500/40 rounded-xl flex items-center justify-center border border-purple-400/40 group-hover:scale-110 transition-transform">
                  <ShoppingCartIcon className="w-5 h-5 text-purple-300" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white group-hover:text-purple-200 transition-colors">
                    Recursos
                  </h3>
                  <p className="text-xs text-slate-300">Productos y servicios</p>
                </div>
              </div>
              <div className="text-xs text-purple-300 opacity-60 group-hover:opacity-100 transition-opacity font-medium">
                {expandedSections.resources ? 'Ocultar' : 'Ver más'}
              </div>
            </button>
            <ul className={`space-y-2 overflow-hidden transition-all duration-500 ${
              expandedSections.resources ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
            }`}>
              <li>
                <a href={AMAZON_AFFILIATE_LINK_PLACEHOLDER} target="_blank" rel="noopener noreferrer" className={linkStyle}>
                  <div className="w-3 h-3 bg-gradient-to-r from-orange-400 to-red-400 rounded-full group-hover:scale-125 transition-transform"></div>
                  <span className="font-medium">Equipamiento Amazon</span>
                  <StarOutlineIcon className="w-3 h-3 text-amber-400 ml-auto" />
                </a>
              </li>
              <li>
                <a href={SAMBOAT_AFFILIATE_URL} target="_blank" rel="noopener noreferrer" className={linkStyle}>
                  <div className="w-3 h-3 bg-gradient-to-r from-blue-400 to-indigo-400 rounded-full group-hover:scale-125 transition-transform"></div>
                  <span className="font-medium">Alquiler de Barcos</span>
                  <CheckCircleIcon className="w-3 h-3 text-green-400 ml-auto" />
                </a>
              </li>
            </ul>
          </div>

          {/* Enhanced Contact & Social Section */}
          <div>
            <button 
              onClick={() => toggleSection('contact')}
              className="w-full text-left mb-4 flex items-center justify-between group hover:bg-white/10 rounded-xl p-3 transition-all duration-300 border border-white/5 hover:border-white/20"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-pink-500/40 to-red-500/40 rounded-xl flex items-center justify-center border border-pink-400/40 group-hover:scale-110 transition-transform">
                  <PhoneIcon className="w-5 h-5 text-pink-300" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white group-hover:text-pink-200 transition-colors">
                    Contacto
                  </h3>
                  <p className="text-xs text-slate-300">Estamos aquí para ayudarte</p>
                </div>
              </div>
              <div className="text-xs text-pink-300 opacity-60 group-hover:opacity-100 transition-opacity font-medium">
                {expandedSections.contact ? 'Ocultar' : 'Ver más'}
              </div>
            </button>
            <ul className={`space-y-2 mb-6 overflow-hidden transition-all duration-500 ${
              expandedSections.contact ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
            }`}>
              <li>
                <a 
                  href={`mailto:${CONTACT_EMAIL}?subject=Consulta%20BoatTrip%20Planner`} 
                  className={linkStyle}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Enviar email a ${CONTACT_EMAIL}`}
                  onClick={(e) => {
                    if (!navigator.userAgent.includes('Mobile') && !window.navigator.userAgent.includes('Android') && !window.navigator.userAgent.includes('iPhone')) {
                      return;
                    }
                    e.preventDefault();
                    navigator.clipboard.writeText(CONTACT_EMAIL).then(() => {
                      alert(`Email copiado al portapapeles: ${CONTACT_EMAIL}`);
                    }).catch(() => {
                      alert(`Email de contacto: ${CONTACT_EMAIL}`);
                    });
                  }}
                >
                  <div className="w-3 h-3 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full group-hover:scale-125 transition-transform"></div>
                  <span className="font-medium">Email</span>
                </a>
              </li>
              <li>
                <a 
                  href="https://wa.me/34600000000?text=Hola,%20tengo%20una%20consulta%20sobre%20BoatTrip%20Planner" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className={linkStyle}
                >
                  <div className="w-3 h-3 bg-gradient-to-r from-green-400 to-teal-400 rounded-full group-hover:scale-125 transition-transform"></div>
                  <span className="font-medium">WhatsApp</span>
                  <WhatsAppIcon className="w-3 h-3 text-green-400 ml-auto" />
                </a>
              </li>
              <li>
                <button onClick={onShowPrivacyPolicy} className={linkStyle}>
                  <div className="w-3 h-3 bg-gradient-to-r from-indigo-400 to-purple-400 rounded-full group-hover:scale-125 transition-transform"></div>
                  <span className="font-medium">Política de Privacidad</span>
                  <ShieldCheckIcon className="w-3 h-3 text-indigo-400 ml-auto" />
                </button>
              </li>
              <li>
                <button onClick={onShowTermsOfService} className={linkStyle}>
                  <div className="w-3 h-3 bg-gradient-to-r from-cyan-400 to-blue-400 rounded-full group-hover:scale-125 transition-transform"></div>
                  <span className="font-medium">Términos de Uso</span>
                  <DocumentTextIcon className="w-3 h-3 text-cyan-400 ml-auto" />
                </button>
              </li>
            </ul>
          </div>
        </div>
        
        {/* Enhanced Divider */}
        <div className="relative mb-10">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t-2 border-gradient-to-r from-ocean-500/30 via-sea-500/30 to-teal-500/30"></div>
          </div>
          <div className="relative flex justify-center">
            <div className="px-6 py-2 bg-gradient-to-r from-ocean-500/20 to-sea-500/20 rounded-full border border-ocean-400/30">
              <BoatOutlineIcon className="w-5 h-5 text-ocean-300" />
            </div>
          </div>
        </div>
        
        {/* Enhanced Bottom Bar */}
        <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
          {/* Copyright & Features */}
          <div className="flex flex-col sm:flex-row items-center gap-6 text-sm">
            <p className="text-center sm:text-left text-white font-medium">
              &copy; {new Date().getFullYear()} BoatTrip Planner. Todos los derechos reservados.
            </p>
            <div className="flex items-center gap-6 text-xs text-slate-200">
              <span className="hidden sm:inline text-ocean-400">•</span>
              <span className="flex items-center gap-2 px-3 py-1 bg-white/5 rounded-full border border-white/10">
                <SparklesIcon className="w-3 h-3 text-ocean-300" />
                <span>Planificación inteligente</span>
              </span>
              <span className="hidden sm:inline text-ocean-400">•</span>
              <span className="flex items-center gap-2 px-3 py-1 bg-white/5 rounded-full border border-white/10">
                <DocumentTextIcon className="w-3 h-3 text-sea-300" />
                <span>Potenciado por IA</span>
              </span>
            </div>
          </div>
          
          {/* Enhanced Affiliate & Status */}
          <div className="flex flex-col sm:flex-row items-center gap-4 text-xs">
            <div className="flex items-center gap-2 text-slate-200 px-4 py-2 bg-white/5 rounded-full border border-white/10">
              <InfoIcon className="w-3 h-3 text-amber-300" />
              <span>
                Como afiliado, ganamos con las compras que califican. 
                <a 
                  href={SAMBOAT_AFFILIATE_URL} 
                  target="_blank" 
                  rel="noopener noreferrer sponsored" 
                  className="font-semibold text-ocean-300 hover:text-ocean-200 transition-colors ml-1 underline decoration-dotted underline-offset-2"
                  aria-label="Más información sobre nuestra afiliación (enlace externo)"
                >
                  Saber más
                </a>
              </span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-full border border-green-400/30 shadow-lg">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-green-200 font-medium">Online</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;