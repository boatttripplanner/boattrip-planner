

import React from 'react';
import { SAMBOAT_AFFILIATE_URL } from '../constants';
import { FooterProps } from '../types'; 
import { SailboatIcon } from './icons/SailboatIcon';
import { TikTokIcon } from './icons/TikTokIcon';


const Footer: React.FC<FooterProps> = ({ 
  onShowPrivacyPolicy, 
  onShowTermsOfService,
  onNavigateToMainApp,
  onNavigateToBlogIndex,
}) => {
  const linkStyle = "hover:text-teal-400 focus:text-teal-400 transition-colors duration-200 focus:outline-none focus:ring-1 focus:ring-teal-400 focus:ring-offset-2 focus:ring-offset-slate-900 rounded-sm px-1";
  
  return (
    <footer className="relative bg-slate-900 text-slate-400 pt-24 pb-8 no-print">
      {/* Animated Waves */}
      <div className="absolute top-0 left-0 w-full overflow-hidden leading-none" style={{ transform: 'translateY(1px)' }}>
          <svg className="relative block w-full h-[100px] sm:h-[150px]" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" viewBox="0 24 150 28" preserveAspectRatio="none" shapeRendering="auto">
              <defs>
                  <path id="gentle-wave-path" d="M-160 44c30 0 58-18 88-18s 58 18 88 18 58-18 88-18 58 18 88 18 v44h-352z" />
              </defs>
              <g className="waves">
                  <use xlinkHref="#gentle-wave-path" x="48" y="0" className="fill-slate-800 opacity-70 animate-gentle-wave" />
                  <use xlinkHref="#gentle-wave-path" x="48" y="3" className="fill-slate-800 opacity-50 animate-gentle-wave-2" />
                  <use xlinkHref="#gentle-wave-path" x="48" y="5" className="fill-slate-800 opacity-30 animate-gentle-wave-3" />
                  <use xlinkHref="#gentle-wave-path" x="48" y="7" className="fill-slate-900" />
              </g>
          </svg>
      </div>
      
      {/* Footer Content */}
      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8 text-left">
          
          {/* Column 1: Brand */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center mb-3">
              <SailboatIcon className="w-8 h-8 text-teal-400 mr-2" />
              <span className="text-xl font-bold text-white">BoatTrip Planner</span>
            </div>
            <p className="text-sm">Tu planificador de viajes náuticos, potenciado por IA. Trazamos tu rumbo ideal.</p>
          </div>

          {/* Column 2: Explore */}
          <div>
            <h3 className="text-md font-semibold text-white mb-3 tracking-wider">Explora</h3>
            <ul className="space-y-2">
              <li><button onClick={onNavigateToMainApp} className={linkStyle}>Planificador</button></li>
              {onNavigateToBlogIndex && <li><button onClick={onNavigateToBlogIndex} className={linkStyle}>Blog</button></li>}
            </ul>
          </div>

          {/* Column 3: Legal */}
          <div>
            <h3 className="text-md font-semibold text-white mb-3 tracking-wider">Legal</h3>
            <ul className="space-y-2">
              <li><button onClick={onShowPrivacyPolicy} className={linkStyle}>Política de Privacidad</button></li>
              <li><button onClick={onShowTermsOfService} className={linkStyle}>Términos de Servicio</button></li>
            </ul>
          </div>

          {/* Column 4: Social */}
          <div>
            <h3 className="text-md font-semibold text-white mb-3 tracking-wider">Síguenos</h3>
            <div className="flex space-x-4">
              <a href="https://www.tiktok.com/@boattrip.planner" target="_blank" rel="noopener noreferrer" className={`${linkStyle} tiktok-link`} aria-label="TikTok"><TikTokIcon className="w-6 h-6" /></a>
            </div>
          </div>
        </div>
        
        <hr className="my-6 border-slate-700" />
        
        {/* Bottom Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-center md:justify-between text-sm text-center">
            <p className="mb-4 sm:mb-0">
              &copy; {new Date().getFullYear()} BoatTrip Planner. Todos los derechos reservados.
            </p>
            <p>
              Como afiliado, ganamos con las compras que califican. 
              <a 
                href={SAMBOAT_AFFILIATE_URL} 
                target="_blank" 
                rel="noopener noreferrer sponsored" 
                className="font-semibold text-teal-400 hover:text-teal-300 transition-colors ml-1"
                aria-label="Más información sobre nuestra afiliación (enlace externo)"
              >
                Saber más
              </a>
            </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;