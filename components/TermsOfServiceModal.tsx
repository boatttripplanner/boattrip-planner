import React from 'react';
import { CheckIcon } from './icons/CheckIcon';
import { CONTACT_EMAIL } from '../constants';

interface TermsOfServiceModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const TermsOfServiceModal: React.FC<TermsOfServiceModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-900">Términos de Uso</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Cerrar términos de uso"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="px-6 py-6 text-gray-700 leading-relaxed">
          <div className="space-y-6">
            {/* Introduction */}
            <section>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">1. Aceptación de los Términos</h3>
              <p className="mb-3">
                Al acceder y utilizar BoatTrip Planner ("el Servicio"), usted acepta estar sujeto a estos Términos de Uso. 
                Si no está de acuerdo con alguna parte de estos términos, no debe utilizar nuestro servicio.
              </p>
              <p>
                Estos términos se aplican a todos los usuarios del sitio, incluyendo sin limitación a usuarios que sean navegadores, 
                proveedores de contenido, y contribuyentes de contenido.
              </p>
            </section>

            {/* Service Description */}
            <section>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">2. Descripción del Servicio</h3>
              <p className="mb-3">
                BoatTrip Planner es una plataforma de planificación de viajes náuticos que utiliza inteligencia artificial para:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Generar itinerarios personalizados de viajes en barco</li>
                <li>Proporcionar recomendaciones de destinos náuticos</li>
                <li>Ofrecer consejos de navegación y seguridad</li>
                <li>Facilitar la planificación de rutas marítimas</li>
                <li>Proporcionar información meteorológica y de puertos</li>
              </ul>
            </section>

            {/* User Responsibilities */}
            <section>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">3. Responsabilidades del Usuario</h3>
              <p className="mb-3">Como usuario de nuestro servicio, usted se compromete a:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Proporcionar información precisa y actualizada</li>
                <li>Utilizar el servicio únicamente para fines legales y apropiados</li>
                <li>No intentar acceder a sistemas o datos no autorizados</li>
                <li>Respetar los derechos de propiedad intelectual</li>
                <li>No transmitir contenido malicioso o spam</li>
                <li>Mantener la confidencialidad de su cuenta</li>
              </ul>
            </section>

            {/* Safety and Navigation */}
            <section>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">4. Seguridad Náutica</h3>
              <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-4">
                <div className="flex">
                  <CheckIcon className="w-5 h-5 text-blue-400 mt-0.5 mr-2 flex-shrink-0" />
                  <div>
                    <p className="text-blue-800 font-medium">Importante:</p>
                    <p className="text-blue-700 text-sm">
                      Las recomendaciones proporcionadas por nuestro servicio son informativas y no sustituyen la experiencia 
                      profesional de navegación. Siempre consulte con autoridades marítimas locales y siga las regulaciones 
                      de seguridad vigentes.
                    </p>
                  </div>
                </div>
              </div>
              <ul className="list-disc pl-6 space-y-2">
                <li>Verificar siempre la información meteorológica antes de navegar</li>
                <li>Consultar cartas náuticas oficiales y actualizadas</li>
                <li>Mantener equipos de seguridad en buen estado</li>
                <li>Respetar las regulaciones marítimas locales</li>
                <li>Contar con la documentación y licencias necesarias</li>
              </ul>
            </section>

            {/* Intellectual Property */}
            <section>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">5. Propiedad Intelectual</h3>
              <p className="mb-3">
                El contenido del servicio, incluyendo pero no limitado a texto, gráficos, logos, iconos, imágenes, 
                clips de audio, descargas digitales y compilaciones de datos, es propiedad de BoatTrip Planner o 
                sus proveedores de contenido y está protegido por las leyes de propiedad intelectual.
              </p>
              <p>
                Se prohíbe la reproducción, distribución, modificación o uso comercial de cualquier contenido sin 
                autorización expresa por escrito.
              </p>
            </section>

            {/* Privacy */}
            <section>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">6. Privacidad</h3>
              <p>
                Su privacidad es importante para nosotros. Nuestro uso de la información personal está regido por 
                nuestra Política de Privacidad, que forma parte de estos términos. Al utilizar nuestro servicio, 
                usted acepta el uso de su información de acuerdo con nuestra Política de Privacidad.
              </p>
            </section>

            {/* Disclaimers */}
            <section>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">7. Limitaciones de Responsabilidad</h3>
              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
                <div className="flex">
                  <CheckIcon className="w-5 h-5 text-yellow-400 mt-0.5 mr-2 flex-shrink-0" />
                  <div>
                    <p className="text-yellow-800 font-medium">Descargo de Responsabilidad:</p>
                    <p className="text-yellow-700 text-sm">
                      BoatTrip Planner no se hace responsable por daños directos, indirectos, incidentales, 
                      especiales o consecuentes que puedan resultar del uso de nuestro servicio.
                    </p>
                  </div>
                </div>
              </div>
              <ul className="list-disc pl-6 space-y-2">
                <li>La información proporcionada es "tal como está" sin garantías de ningún tipo</li>
                <li>No garantizamos la precisión, completitud o actualidad de la información</li>
                <li>No somos responsables por decisiones de navegación basadas en nuestras recomendaciones</li>
                <li>El usuario asume toda la responsabilidad por su seguridad y la de su tripulación</li>
              </ul>
            </section>

            {/* Affiliate Links */}
            <section>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">8. Enlaces de Afiliados</h3>
              <p className="mb-3">
                Nuestro servicio puede contener enlaces de afiliados a productos y servicios de terceros. 
                Como afiliado, podemos recibir una comisión por las compras realizadas a través de estos enlaces.
              </p>
              <p>
                Los precios y disponibilidad de los productos pueden cambiar sin previo aviso. 
                Recomendamos verificar la información actualizada directamente con los proveedores.
              </p>
            </section>

            {/* Modifications */}
            <section>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">9. Modificaciones de los Términos</h3>
              <p>
                Nos reservamos el derecho de modificar estos términos en cualquier momento. Los cambios entrarán 
                en vigor inmediatamente después de su publicación en el sitio. Su uso continuado del servicio 
                después de cualquier cambio constituye su aceptación de los nuevos términos.
              </p>
            </section>

            {/* Contact Information */}
            <section>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">10. Información de Contacto</h3>
              <p className="mb-3">
                Si tiene preguntas sobre estos Términos de Uso, puede contactarnos en:
              </p>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="font-medium">Email: <a href={`mailto:${CONTACT_EMAIL}`} className="text-teal-600 hover:text-teal-700">{CONTACT_EMAIL}</a></p>
                <p className="text-sm text-gray-600 mt-1">Última actualización: {new Date().toLocaleDateString('es-ES')}</p>
              </div>
            </section>
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-6 py-4 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
          >
            Entendido
          </button>
        </div>
      </div>
    </div>
  );
};

export default TermsOfServiceModal;