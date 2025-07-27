import React from 'react';
import { InfoIcon } from './icons/InfoIcon';

const AndroidCompatibilityAlert: React.FC = () => {
  // Detect iOS device
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
  
  if (!isIOS) {
    return null; // Don't show alert on non-iOS devices
  }

  return (
    <div 
      className="bg-blue-100 border-l-4 border-blue-500 text-blue-800 p-4 rounded-md shadow-md" 
      role="alert"
    >
      <div className="flex items-start">
        <div className="py-1">
          <InfoIcon className="h-6 w-6 text-blue-600 mr-3 flex-shrink-0" />
        </div>
        <div>
          <p className="font-bold text-blue-900">Optimizado para iPhone:</p>
          <p className="text-sm">
            Esta aplicación está optimizada para iPhone y Safari. Para la mejor experiencia, 
            te recomendamos usar Safari en tu iPhone. ¡Disfruta planificando tu aventura náutica!
          </p>
        </div>
      </div>
    </div>
  );
};

export default AndroidCompatibilityAlert;