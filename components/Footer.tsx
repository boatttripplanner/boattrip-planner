

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { SAMBOAT_AFFILIATE_URL, AMAZON_AFFILIATE_LINK_PLACEHOLDER } from '../constants';
import { TikTokIcon } from './icons/TikTokIcon';

const Footer: React.FC = () => {
  const [email, setEmail] = useState('');
  const [showPrivacyPolicy, setShowPrivacyPolicy] = useState(false);
  const [showTermsOfService, setShowTermsOfService] = useState(false);
  
  const linkStyle = "hover:text-teal-400 focus:text-teal-400 transition-colors duration-200 focus:outline-none focus:ring-1 focus:ring-teal-400 focus:ring-offset-2 focus:ring-offset-slate-900 rounded-sm px-1";
  
  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Aquí se implementaría la lógica para suscribir al newsletter
    alert('¡Gracias por suscribirte! Te mantendremos informado sobre las últimas novedades náuticas.');
    setEmail('');
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
              <div className="w-10 h-10 bg-gradient-to-br from-blue-50 to-teal-100 rounded-full flex items-center justify-center shadow-lg mr-3">
                <img 
                  src="/apple-touch-icon.png" 
                  alt="BoatTrip Planner Logo" 
                  className="w-6 h-6"
                />
              </div>
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
              <li><Link to="/" className={linkStyle}>Planificador IA</Link></li>
              <li><Link to="/blog" className={linkStyle}>Blog Náutico</Link></li>
              <li><Link to="/about" className={linkStyle}>Sobre Nosotros</Link></li>
              <li><Link to="/how-it-works" className={linkStyle}>Cómo Funciona</Link></li>
            </ul>
          </div>

          {/* Column 3: Recursos */}
          <div>
            <h3 className="text-md font-semibold text-white mb-4 tracking-wider">📚 Recursos</h3>
            <ul className="space-y-3">
              <li><a href={SAMBOAT_AFFILIATE_URL} target="_blank" rel="noopener noreferrer" className={linkStyle}>Alquiler de Barcos</a></li>
              <li><a href={AMAZON_AFFILIATE_LINK_PLACEHOLDER} target="_blank" rel="noopener noreferrer" className={linkStyle}>Equipamiento</a></li>
              <li><a href="https://www.meteored.com" target="_blank" rel="noopener noreferrer" className={linkStyle}>Meteorología</a></li>
              <li><a href="https://www.puertos.es" target="_blank" rel="noopener noreferrer" className={linkStyle}>Puertos</a></li>
            </ul>
          </div>

          {/* Column 4: Social & Legal */}
          <div>
            <h3 className="text-md font-semibold text-white mb-4 tracking-wider">🔗 Social</h3>
            <div className="flex space-x-3 mb-4">
              <a href="https://tiktok.com/@boattripplanner" target="_blank" rel="noopener noreferrer" className="tiktok-link text-slate-400 hover:text-teal-400 transition-colors duration-200">
                <TikTokIcon className="w-6 h-6" />
              </a>
              <a href="https://wa.me/34600000000" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-teal-400 transition-colors duration-200">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
                </svg>
              </a>
            </div>
            
            <div className="space-y-2">
              <button onClick={() => setShowPrivacyPolicy(true)} className={linkStyle}>Política de Privacidad</button>
              <button onClick={() => setShowTermsOfService(true)} className={linkStyle}>Términos de Servicio</button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center mb-4 md:mb-0">
            <span className="text-sm">© 2024 BoatTrip Planner. Navegando hacia el futuro.</span>
          </div>
          
          <div className="flex items-center space-x-4 text-xs">
            <span className="text-slate-500">v1.0.0</span>
            <span className="text-slate-500">•</span>
            <span className="text-slate-500">Made with ❤️ for sailors</span>
          </div>
        </div>
      </div>

      {/* Privacy Policy Modal */}
      {showPrivacyPolicy && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto p-6">
            <h2 className="text-2xl font-bold mb-4">Política de Privacidad</h2>
            <p className="text-gray-700 mb-4">
              Tu privacidad es importante para nosotros. Esta política describe cómo recopilamos, 
              usamos y protegemos tu información personal.
            </p>
            <button 
              onClick={() => setShowPrivacyPolicy(false)}
              className="bg-teal-600 text-white px-4 py-2 rounded hover:bg-teal-700"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}

      {/* Terms of Service Modal */}
      {showTermsOfService && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto p-6">
            <h2 className="text-2xl font-bold mb-4">Términos de Servicio</h2>
            <p className="text-gray-700 mb-4">
              Al usar BoatTrip Planner, aceptas estos términos de servicio que rigen 
              el uso de nuestra plataforma.
            </p>
            <button 
              onClick={() => setShowTermsOfService(false)}
              className="bg-teal-600 text-white px-4 py-2 rounded hover:bg-teal-700"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}
    </footer>
  );
};

export default Footer;