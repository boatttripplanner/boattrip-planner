

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

const Footer: React.FC<FooterProps> = ({ 
  onShowPrivacyPolicy, 
  onShowTermsOfService,
  onNavigateToMainApp,
  onNavigateToBlogIndex,
}) => {

  
  const linkStyle = "group flex items-center gap-3 py-2 px-3 rounded-lg hover:bg-white/10 hover:text-white transition-all duration-200 text-slate-200 hover:shadow-sm";
  
  return (
    <footer className="relative bg-gradient-to-br from-slate-800 via-slate-700 to-slate-800 text-white pt-20 pb-8 no-print overflow-hidden border-t-4 border-ocean-500">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.3'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}></div>
      </div>

      {/* Animated Waves */}
      <div className="absolute top-0 left-0 w-full overflow-hidden leading-none" style={{ transform: 'translateY(1px)' }}>
        <svg className="relative block w-full h-[120px] sm:h-[180px]" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" viewBox="0 24 150 28" preserveAspectRatio="none" shapeRendering="auto">
          <defs>
            <path id="gentle-wave-path" d="M-160 44c30 0 58-18 88-18s 58 18 88 18 58-18 88-18 58 18 88 18 v44h-352z" />
          </defs>
          <g className="waves">
            <use xlinkHref="#gentle-wave-path" x="48" y="0" className="fill-slate-600 opacity-80 animate-gentle-wave" />
            <use xlinkHref="#gentle-wave-path" x="48" y="3" className="fill-slate-500 opacity-60 animate-gentle-wave-2" />
            <use xlinkHref="#gentle-wave-path" x="48" y="5" className="fill-slate-400 opacity-40 animate-gentle-wave-3" />
            <use xlinkHref="#gentle-wave-path" x="48" y="7" className="fill-slate-700" />
          </g>
        </svg>
      </div>
      
      {/* Footer Content */}
      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          
          {/* Brand Section */}
          <div className="lg:col-span-1">
            <div className="mb-6">
              <div className="mb-4 flex items-center gap-3">
                <img 
                  src="/favicon.svg" 
                  alt="BoatTrip Planner Logo" 
                  className="w-10 h-10"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = '/favicon-96x96.png';
                  }}
                />
                <div>
                  <h3 className="text-xl font-bold text-white">BoatTrip Planner</h3>
                  <p className="text-sm text-slate-200">Planificador Náutico IA</p>
                </div>
              </div>
              <p className="text-sm leading-relaxed text-slate-100 mb-6">
                Tu planificador de viajes náuticos inteligente, potenciado por IA. 
                Trazamos tu rumbo real para aventuras inolvidables en el mar.
              </p>
              
              {/* Features */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-slate-200">
                  <SparklesIcon className="w-4 h-4 text-ocean-300" />
                  <span>Planificación inteligente</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-200">
                  <MapPinIcon className="w-4 h-4 text-sea-300" />
                  <span>Destinos exclusivos</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-200">
                  <UsersIcon className="w-4 h-4 text-teal-300" />
                  <span>Comunidad náutica</span>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Section */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-ocean-500/30 to-sea-500/30 rounded-lg flex items-center justify-center border border-ocean-400/30">
                <BoatOutlineIcon className="w-4 h-4 text-ocean-300" />
              </div>
              Navegación
            </h3>
            <ul className="space-y-1">
              <li>
                <button onClick={onNavigateToMainApp} className={linkStyle}>
                  <div className="w-2 h-2 bg-ocean-400 rounded-full group-hover:bg-ocean-300 transition-colors"></div>
                  Planificador IA
                </button>
              </li>
              {onNavigateToBlogIndex && (
                <li>
                  <button onClick={onNavigateToBlogIndex} className={linkStyle}>
                    <div className="w-2 h-2 bg-sea-400 rounded-full group-hover:bg-sea-300 transition-colors"></div>
                    Blog Náutico
                  </button>
                </li>
              )}
              <li>
                <a href="/?view=blog_index&category=Destinos" className={linkStyle}>
                  <div className="w-2 h-2 bg-teal-400 rounded-full group-hover:bg-teal-300 transition-colors"></div>
                  Destinos
                </a>
              </li>
              <li>
                <a href="/?view=blog_index&category=Equipamiento" className={linkStyle}>
                  <div className="w-2 h-2 bg-purple-400 rounded-full group-hover:bg-purple-300 transition-colors"></div>
                  Equipamiento
                </a>
              </li>
              <li>
                <a href="/?view=blog_index&category=Consejos" className={linkStyle}>
                  <div className="w-2 h-2 bg-amber-400 rounded-full group-hover:bg-amber-300 transition-colors"></div>
                  Consejos
                </a>
              </li>
            </ul>
          </div>

          {/* Resources Section */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-purple-500/30 to-pink-500/30 rounded-lg flex items-center justify-center border border-purple-400/30">
                <ShoppingCartIcon className="w-4 h-4 text-purple-300" />
              </div>
              Recursos
            </h3>
            <ul className="space-y-1">
              <li>
                <a href={AMAZON_AFFILIATE_LINK_PLACEHOLDER} target="_blank" rel="noopener noreferrer" className={linkStyle}>
                  <div className="w-2 h-2 bg-orange-400 rounded-full group-hover:bg-orange-300 transition-colors"></div>
                  Equipamiento Amazon
                </a>
              </li>
              <li>
                <a href={SAMBOAT_AFFILIATE_URL} target="_blank" rel="noopener noreferrer" className={linkStyle}>
                  <div className="w-2 h-2 bg-blue-400 rounded-full group-hover:bg-blue-300 transition-colors"></div>
                  Alquiler de Barcos
                </a>
              </li>
            </ul>
          </div>

          {/* Contact & Social Section */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-pink-500/30 to-red-500/30 rounded-lg flex items-center justify-center border border-pink-400/30">
                <PhoneIcon className="w-4 h-4 text-pink-300" />
              </div>
              Contacto
            </h3>
            <ul className="space-y-1 mb-6">
              <li>
                <a 
                  href={`mailto:${CONTACT_EMAIL}?subject=Consulta%20BoatTrip%20Planner`} 
                  className={linkStyle}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Enviar email a ${CONTACT_EMAIL}`}
                  onClick={(e) => {
                    // Fallback para dispositivos que no soportan mailto:
                    if (!navigator.userAgent.includes('Mobile') && !window.navigator.userAgent.includes('Android') && !window.navigator.userAgent.includes('iPhone')) {
                      // En desktop, intentar abrir el cliente de correo
                      return;
                    }
                    // En móvil, copiar el email al portapapeles como fallback
                    e.preventDefault();
                    navigator.clipboard.writeText(CONTACT_EMAIL).then(() => {
                      alert(`Email copiado al portapapeles: ${CONTACT_EMAIL}`);
                    }).catch(() => {
                      // Si no se puede copiar, mostrar el email
                      alert(`Email de contacto: ${CONTACT_EMAIL}`);
                    });
                  }}
                >
                  <div className="w-2 h-2 bg-green-400 rounded-full group-hover:bg-green-300 transition-colors"></div>
                  Email
                </a>
              </li>
              <li>
                <button onClick={onShowPrivacyPolicy} className={linkStyle}>
                  <div className="w-2 h-2 bg-indigo-400 rounded-full group-hover:bg-indigo-300 transition-colors"></div>
                  Política de Privacidad
                </button>
              </li>
              <li>
                <button onClick={onShowTermsOfService} className={linkStyle}>
                  <div className="w-2 h-2 bg-cyan-400 rounded-full group-hover:bg-cyan-300 transition-colors"></div>
                  Términos de Uso
                </button>
              </li>
            </ul>
          </div>
        </div>
        
        {/* Divider */}
        <div className="relative mb-8">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t-2 border-ocean-500/30"></div>
          </div>
          <div className="relative flex justify-center">
            <div className="w-12 h-12 bg-gradient-to-br from-white/90 to-slate-100/90 rounded-full flex items-center justify-center border-2 border-ocean-400/50 overflow-hidden shadow-lg">
              <img 
                src="/apple-touch-icon.png" 
                alt="BoatTrip Planner Logo" 
                className="w-8 h-8 object-contain"
              />
            </div>
          </div>
        </div>
        
        {/* Bottom Bar */}
        <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
          {/* Copyright & Features */}
          <div className="flex flex-col sm:flex-row items-center gap-4 text-sm">
            <p className="text-center sm:text-left text-white font-medium">
              &copy; {new Date().getFullYear()} BoatTrip Planner. Todos los derechos reservados.
            </p>
            <div className="flex items-center gap-4 text-xs text-slate-200">
              <span className="hidden sm:inline text-ocean-400">•</span>
              <span className="flex items-center gap-1">
                <SparklesIcon className="w-3 h-3 text-ocean-300" />
                <span>Planificación inteligente</span>
              </span>
              <span className="hidden sm:inline text-ocean-400">•</span>
              <span className="flex items-center gap-1">
                <DocumentTextIcon className="w-3 h-3 text-sea-300" />
                <span>Potenciado por IA</span>
              </span>
            </div>
          </div>
          
          {/* Affiliate & Status */}
          <div className="flex flex-col sm:flex-row items-center gap-4 text-xs">
            <div className="flex items-center gap-2 text-slate-200">
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
            <div className="flex items-center gap-2 px-3 py-1 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-full border border-green-400/30 shadow-sm">
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