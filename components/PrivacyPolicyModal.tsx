import React from 'react';
import { CheckIcon } from './icons/CheckIcon';
import { CONTACT_EMAIL } from '../constants';

interface PrivacyPolicyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PrivacyPolicyModal: React.FC<PrivacyPolicyModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-900">Política de Privacidad</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Cerrar política de privacidad"
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
              <h3 className="text-xl font-semibold text-gray-900 mb-3">1. Información General</h3>
              <p className="mb-3">
                BoatTrip Planner ("nosotros", "nuestro", "la empresa") se compromete a proteger su privacidad. 
                Esta Política de Privacidad explica cómo recopilamos, utilizamos, almacenamos y protegemos su información 
                personal cuando utiliza nuestro servicio de planificación de viajes náuticos.
              </p>
              <p>
                Al utilizar nuestro servicio, usted acepta la recopilación y uso de información de acuerdo con esta política.
              </p>
            </section>

            {/* Information We Collect */}
            <section>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">2. Información que Recopilamos</h3>
              
              <h4 className="text-lg font-medium text-gray-800 mb-2">2.1 Información que Usted Nos Proporciona</h4>
              <ul className="list-disc pl-6 space-y-2 mb-4">
                <li>Preferencias de viaje y navegación</li>
                <li>Información sobre experiencia náutica</li>
                <li>Detalles del barco y tripulación</li>
                <li>Destinos y rutas de interés</li>
                <li>Comentarios y feedback</li>
                <li>Dirección de correo electrónico</li>
              </ul>

              <h4 className="text-lg font-medium text-gray-800 mb-2">2.2 Información Recopilada Automáticamente</h4>
              <ul className="list-disc pl-6 space-y-2">
                <li>Dirección IP y datos de ubicación aproximada</li>
                <li>Información del navegador y dispositivo</li>
                <li>Páginas visitadas y tiempo de permanencia</li>
                <li>Cookies y tecnologías similares</li>
                <li>Datos de uso y analytics</li>
              </ul>
            </section>

            {/* How We Use Information */}
            <section>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">3. Cómo Utilizamos su Información</h3>
              <p className="mb-3">Utilizamos la información recopilada para:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Generar recomendaciones personalizadas de viajes</li>
                <li>Mejorar nuestros servicios y funcionalidades</li>
                <li>Proporcionar soporte al cliente</li>
                <li>Enviar comunicaciones relevantes (con su consentimiento)</li>
                <li>Analizar el uso del servicio para optimizaciones</li>
                <li>Cumplir con obligaciones legales</li>
                <li>Prevenir fraudes y abusos</li>
              </ul>
            </section>

            {/* Third-Party Services */}
            <section>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">4. Servicios de Terceros</h3>
              <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-4">
                <div className="flex">
                  <CheckIcon className="w-5 h-5 text-blue-400 mt-0.5 mr-2 flex-shrink-0" />
                  <div>
                    <p className="text-blue-800 font-medium">Servicios Utilizados:</p>
                    <p className="text-blue-700 text-sm">
                      Nuestro servicio utiliza APIs de terceros para proporcionar funcionalidades específicas. 
                      Cada servicio tiene sus propias políticas de privacidad.
                    </p>
                  </div>
                </div>
              </div>
              
              <h4 className="text-lg font-medium text-gray-800 mb-2">4.1 Google Gemini AI</h4>
              <p className="mb-3">
                Utilizamos Google Gemini para generar recomendaciones personalizadas. La información que enviamos 
                a Google está sujeta a la Política de Privacidad de Google.
              </p>

              <h4 className="text-lg font-medium text-gray-800 mb-2">4.2 Servicios Meteorológicos</h4>
              <p className="mb-3">
                AccuWeather y AEMET proporcionan datos meteorológicos. No compartimos información personal 
                con estos servicios, solo datos de ubicación para obtener información meteorológica relevante.
              </p>

              <h4 className="text-lg font-medium text-gray-800 mb-2">4.3 Google AdSense</h4>
              <p className="mb-3">
                Utilizamos Google AdSense para mostrar publicidad relevante. Google puede utilizar cookies 
                para personalizar anuncios basándose en sus intereses.
              </p>
            </section>

            {/* Data Storage and Security */}
            <section>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">5. Almacenamiento y Seguridad</h3>
              <div className="bg-green-50 border-l-4 border-green-400 p-4 mb-4">
                <div className="flex">
                  <CheckIcon className="w-5 h-5 text-green-400 mt-0.5 mr-2 flex-shrink-0" />
                  <div>
                    <p className="text-green-800 font-medium">Compromiso de Seguridad:</p>
                    <p className="text-green-700 text-sm">
                      Implementamos medidas de seguridad técnicas y organizativas para proteger su información personal.
                    </p>
                  </div>
                </div>
              </div>
              
              <ul className="list-disc pl-6 space-y-2">
                <li>Encriptación de datos en tránsito y en reposo</li>
                <li>Acceso restringido a información personal</li>
                <li>Monitoreo regular de seguridad</li>
                <li>Actualizaciones de seguridad regulares</li>
                <li>Backups seguros de datos</li>
              </ul>
            </section>

            {/* Cookies */}
            <section>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">6. Cookies y Tecnologías Similares</h3>
              <p className="mb-3">
                Utilizamos cookies y tecnologías similares para mejorar su experiencia:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Cookies Esenciales:</strong> Necesarias para el funcionamiento básico del sitio</li>
                <li><strong>Cookies de Rendimiento:</strong> Para analizar el uso del sitio y mejorar la experiencia</li>
                <li><strong>Cookies de Publicidad:</strong> Para mostrar anuncios relevantes (con su consentimiento)</li>
                <li><strong>Cookies de Preferencias:</strong> Para recordar sus configuraciones</li>
              </ul>
              <p className="mt-3">
                Puede gestionar sus preferencias de cookies a través de la configuración de su navegador.
              </p>
            </section>

            {/* Data Sharing */}
            <section>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">7. Compartir Información</h3>
              <p className="mb-3">
                No vendemos, alquilamos ni compartimos su información personal con terceros, excepto en las siguientes circunstancias:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Con su consentimiento explícito</li>
                <li>Para cumplir con obligaciones legales</li>
                <li>Con proveedores de servicios que nos ayudan a operar (bajo acuerdos de confidencialidad)</li>
                <li>Para proteger nuestros derechos y seguridad</li>
                <li>En caso de fusión o adquisición empresarial</li>
              </ul>
            </section>

            {/* User Rights */}
            <section>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">8. Sus Derechos</h3>
              <p className="mb-3">Usted tiene los siguientes derechos respecto a su información personal:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Acceso:</strong> Solicitar información sobre los datos que tenemos sobre usted</li>
                <li><strong>Rectificación:</strong> Corregir información inexacta o incompleta</li>
                <li><strong>Eliminación:</strong> Solicitar la eliminación de sus datos personales</li>
                <li><strong>Portabilidad:</strong> Recibir sus datos en formato estructurado</li>
                <li><strong>Limitación:</strong> Restringir el procesamiento de sus datos</li>
                <li><strong>Oposición:</strong> Oponerse al procesamiento de sus datos</li>
                <li><strong>Retirada del consentimiento:</strong> Revocar el consentimiento en cualquier momento</li>
              </ul>
            </section>

            {/* Data Retention */}
            <section>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">9. Retención de Datos</h3>
              <p className="mb-3">
                Conservamos su información personal solo durante el tiempo necesario para los fines descritos en esta política:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Datos de uso: Hasta 2 años</li>
                <li>Preferencias de viaje: Hasta que solicite su eliminación</li>
                <li>Información de contacto: Hasta que se dé de baja</li>
                <li>Datos de analytics: Hasta 26 meses</li>
                <li>Información legal: Según requiera la ley</li>
              </ul>
            </section>

            {/* Children's Privacy */}
            <section>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">10. Privacidad de Menores</h3>
              <p>
                Nuestro servicio no está dirigido a menores de 16 años. No recopilamos intencionalmente información 
                personal de menores de 16 años. Si cree que hemos recopilado información de un menor, 
                contáctenos inmediatamente.
              </p>
            </section>

            {/* International Transfers */}
            <section>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">11. Transferencias Internacionales</h3>
              <p>
                Su información puede ser transferida y procesada en países fuera de su residencia. 
                Nos aseguramos de que estas transferencias cumplan con las leyes de protección de datos aplicables 
                y utilicen medidas de seguridad apropiadas.
              </p>
            </section>

            {/* Changes to Policy */}
            <section>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">12. Cambios en esta Política</h3>
              <p>
                Podemos actualizar esta Política de Privacidad ocasionalmente. Le notificaremos sobre cambios 
                significativos por correo electrónico o mediante un aviso en nuestro sitio web. 
                Su uso continuado del servicio después de los cambios constituye su aceptación de la política actualizada.
              </p>
            </section>

            {/* Contact Information */}
            <section>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">13. Información de Contacto</h3>
              <p className="mb-3">
                Si tiene preguntas sobre esta Política de Privacidad o desea ejercer sus derechos, contáctenos en:
              </p>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="font-medium">Email: <a href={`mailto:${CONTACT_EMAIL}`} className="text-teal-700">{CONTACT_EMAIL}</a></p>
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

export default PrivacyPolicyModal;