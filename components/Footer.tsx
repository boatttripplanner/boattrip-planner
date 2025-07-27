

import React, { useState } from 'react';
import { SAMBOAT_AFFILIATE_URL, AMAZON_AFFILIATE_LINK_PLACEHOLDER } from '../constants';
import { FooterProps } from '../types'; 
import { SailboatIcon } from './icons/SailboatIcon';
import { TikTokIcon } from './icons/TikTokIcon';
import { WhatsAppIcon } from './icons/WhatsAppIcon';


const Footer: React.FC<FooterProps> = ({ 
  onShowPrivacyPolicy, 
  onShowTermsOfService,
  onNavigateToMainApp,
  onNavigateToBlogIndex,
}) => {
  const [showNewsletter, setShowNewsletter] = useState(false);
  const [email, setEmail] = useState('');
  
  const linkStyle = "hover:text-teal-400 focus:text-teal-400 transition-colors duration-200 focus:outline-none focus:ring-1 focus:ring-teal-400 focus:ring-offset-2 focus:ring-offset-slate-900 rounded-sm px-1";
  
  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Aquí se implementaría la lógica para suscribir al newsletter
    alert('¡Gracias por suscribirte! Te mantendremos informado sobre las últimas novedades náuticas.');
    setEmail('');
    setShowNewsletter(false);
  };
  
  const handleWhatsAppContact = () => {
    const message = encodeURIComponent('¡Hola! Me interesa saber más sobre BoatTrip Planner 🚤');
    window.open(`https://wa.me/34600000000?text=${message}`, '_blank');
  };
  
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-8 text-left">
          
          {/* Column 1: Brand */}
          <div className="lg:col-span-2">
            <div className="flex items-center mb-4">
              <SailboatIcon className="w-10 h-10 text-teal-400 mr-3" />
              <span className="text-2xl font-bold text-white">BoatTrip Planner</span>
            </div>
            <p className="text-sm mb-4 leading-relaxed">
              Tu planificador de viajes náuticos inteligente, potenciado por IA. 
              Trazamos tu rumbo ideal para aventuras inolvidables en el mar.
            </p>
            
            {/* Newsletter */}
            <div className="mb-4">
              <h4 className="text-sm font-semibold text-white mb-2">📧 Newsletter Náutico</h4>
              <p className="text-xs text-slate-400 mb-3">Recibe consejos, destinos y novedades náuticas</p>
              <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-2">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="tu@email.com"
                  className="flex-1 px-3 py-2 bg-slate-800 border border-slate-600 rounded-lg text-sm text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent"
                  required
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white text-sm font-medium rounded-lg transition-colors duration-200 sm:w-auto w-full"
                >
                  Suscribir
                </button>
              </form>
            </div>
          </div>

          {/* Column 2: Explore */}
          <div>
            <h3 className="text-md font-semibold text-white mb-4 tracking-wider">🚤 Explora</h3>
            <ul className="space-y-3">
              <li><button onClick={onNavigateToMainApp} className={linkStyle}>Planificador IA</button></li>
              {onNavigateToBlogIndex && <li><button onClick={onNavigateToBlogIndex} className={linkStyle}>Blog Náutico</button></li>}
              <li><a href="#destinos" className={linkStyle}>Destinos</a></li>
              <li><a href="#consejos" className={linkStyle}>Consejos</a></li>
              <li><a href="#equipamiento" className={linkStyle}>Equipamiento</a></li>
            </ul>
          </div>

          {/* Column 3: Recursos */}
          <div>
            <h3 className="text-md font-semibold text-white mb-4 tracking-wider">📚 Recursos</h3>
            <ul className="space-y-3">
              <li><a href={AMAZON_AFFILIATE_LINK_PLACEHOLDER} target="_blank" rel="noopener noreferrer" className={linkStyle}>Equipamiento Amazon</a></li>
              <li><a href={SAMBOAT_AFFILIATE_URL} target="_blank" rel="noopener noreferrer" className={linkStyle}>Alquiler de Barcos</a></li>
              <li><a href="#checklists" className={linkStyle}>Checklists</a></li>
              <li><a href="#mapas" className={linkStyle}>Mapas Náuticos</a></li>
              <li><a href="#permisos" className={linkStyle}>Permisos</a></li>
            </ul>
          </div>

          {/* Column 4: Contacto */}
          <div>
            <h3 className="text-md font-semibold text-white mb-4 tracking-wider">📞 Contacto</h3>
            <ul className="space-y-3">
              <li>
                <button onClick={handleWhatsAppContact} className={`${linkStyle} flex items-center gap-2`}>
                  <WhatsAppIcon className="w-4 h-4" />
                  WhatsApp
                </button>
              </li>
              <li><a href="mailto:info@boattrip-planner.com" className={linkStyle}>Email</a></li>
              <li><button onClick={onShowPrivacyPolicy} className={linkStyle}>Privacidad</button></li>
              <li><button onClick={onShowTermsOfService} className={linkStyle}>Términos</button></li>
            </ul>
          </div>

          {/* Column 5: Social */}
          <div>
            <h3 className="text-md font-semibold text-white mb-4 tracking-wider">🌊 Síguenos</h3>
            <div className="flex flex-col space-y-3">
              <a 
                href="https://www.tiktok.com/@boattrip.planner" 
                target="_blank" 
                rel="noopener noreferrer" 
                className={`${linkStyle} flex items-center gap-2`} 
                aria-label="TikTok"
              >
                <TikTokIcon className="w-5 h-5" />
                TikTok
              </a>
              <a 
                href="https://instagram.com/boattrip.planner" 
                target="_blank" 
                rel="noopener noreferrer" 
                className={`${linkStyle} flex items-center gap-2`} 
                aria-label="Instagram"
              >
                📸 Instagram
              </a>
              <a 
                href="https://youtube.com/@boattripplanner" 
                target="_blank" 
                rel="noopener noreferrer" 
                className={`${linkStyle} flex items-center gap-2`} 
                aria-label="YouTube"
              >
                🎥 YouTube
              </a>
            </div>
          </div>
        </div>
        
        <hr className="my-8 border-slate-700" />
        
        {/* Bottom Bar */}
        <div className="flex flex-col lg:flex-row items-center justify-between text-sm">
          <div className="flex flex-col sm:flex-row items-center gap-4 mb-4 lg:mb-0">
            <p className="text-center sm:text-left">
              &copy; {new Date().getFullYear()} BoatTrip Planner. Todos los derechos reservados.
            </p>
            <div className="flex items-center gap-4 text-xs">
              <span className="hidden sm:inline">•</span>
              <span>🚤 Planificación náutica inteligente</span>
              <span className="hidden sm:inline">•</span>
              <span>🤖 Potenciado por IA</span>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row items-center gap-4 text-xs">
            <p className="text-center sm:text-right">
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
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-teal-400 rounded-full animate-pulse"></span>
              <span>Online</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;