
import React, { useState } from 'react';
import { WizardStepProps, BudgetLevel } from '../../types';
import { SelectField, InputField, TextAreaField } from '../FormControls';
import { budgetLevelOptions } from '../../constants';
import { InfoIcon } from '../icons/InfoIcon';

import { CogIcon } from '../icons/CogIcon';

const formatNumberWithDots = (digits: string): string => {
  if (!digits) return '';
  return digits.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
};

const Step4Preferences: React.FC<WizardStepProps> = ({ data, updateData }) => {
  const [showBudgetTooltip, setShowBudgetTooltip] = useState(false);

  const [displayedCustomBudget, setDisplayedCustomBudget] = useState(
      data.customBudgetAmount ? formatNumberWithDots(data.customBudgetAmount.toString()) : ''
  );

  const budgetTooltipId = 'budget-tooltip-content-wizard';
  
  const handleCustomBudgetChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value;
    const digitsOnly = rawValue.replace(/\D/g, ''); 
    
    if (digitsOnly.length <= 10) { 
        setDisplayedCustomBudget(formatNumberWithDots(digitsOnly));
        updateData({ customBudgetAmount: Number(digitsOnly) });
    }
  };
  
  const handleActivityChange = (activity: string) => {
    const newActivities = data.activities.includes(activity)
      ? data.activities.filter(a => a !== activity)
      : [...data.activities, activity];
    
    // Validación de coherencia de actividades según tipo de experiencia
    let validatedActivities = newActivities;
    
    if (data.desiredExperienceType === 'sunset') {
      // Para puesta de sol, priorizar actividades relacionadas
      const sunsetActivities = [
        'Observación de Puestas de Sol desde el Mar',
        'Fotografía Paisajística y Marina',
        'Romántico (Parejas)'
      ];
      if (!newActivities.some(a => sunsetActivities.includes(a))) {
        // Si no hay actividades de puesta de sol, sugerir agregar una
        console.log('Sugerencia: Para una experiencia de puesta de sol, considera agregar actividades relacionadas');
      }
    }
    
    if (data.desiredExperienceType === 'half_day_morning' || data.desiredExperienceType === 'half_day_afternoon') {
      // Para medio día, evitar actividades que requieran mucho tiempo
      const timeIntensiveActivities = [
        'Buceo con botella (submarinismo)',
        'Exploración Costera y Cuevas Marinas'
      ];
      validatedActivities = newActivities.filter(a => !timeIntensiveActivities.includes(a));
    }
    
    updateData({ activities: validatedActivities });
  };

  const handleClearAllActivities = () => {
    updateData({ activities: [] });
  };

  // Organizar actividades por categorías
  const categorizedActivities = {
    'Relax y Naturaleza': [
      'Tomar el Sol y Relajarse en Cubierta',
      'Observación de Puestas de Sol desde el Mar',
      'Fotografía Paisajística y Marina',
      'Avistamiento de Delfines o Fauna Marina'
    ],
    'Actividades Acuáticas': [
      'Snorkel',
      'Buceo (con equipo propio o guía)',
      'Buceo con botella (submarinismo)',
      'Paddle Surf (SUP)',
      'Kayak o Canoa',
      'Deportes Acuáticos (Esquí, Wakeboard, Donut)'
    ],
    'Exploración y Aventura': [
      'Visitar Calas Escondidas',
      'Exploración Costera y Cuevas Marinas',
      'Visitar Puertos Pintorescos y Paseos Marítimos',
      'Navegación a Vela (si aplica)'
    ],
    'Pesca y Gastronomía': [
      'Pesca Recreativa',
      'Comida o Picnic a Bordo'
    ],
    'Tipo de Viaje': [
      'Celebraciones Especiales (Cumpleaños, Aniversarios)',
      'Romántico (Parejas)',
      'Familiar (con Niños)',
      'Grupo de Amigos'
    ]
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="text-center">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-slate-800 mb-2 sm:mb-3">
                ¿Qué tipo de
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-teal-600">
                    Experiencia Buscas?
                </span>
            </h2>
            <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed px-2">
                Personaliza tu viaje según tus preferencias y estilo de navegación.
            </p>
        </div>

      <div className="space-y-6 rounded-xl bg-gradient-to-br from-blue-50 to-teal-50 p-8 border border-blue-200 shadow-lg">
        <div className="text-center mb-4">
          <h3 className="text-lg font-semibold text-slate-800 mb-2">🎯 ¿Qué te gustaría hacer?</h3>
          <p className="text-sm text-slate-600 mb-3">Selecciona las actividades que más te interesan para personalizar tu itinerario</p>
          
          {/* Contador de actividades seleccionadas */}
          <div className="flex items-center justify-center space-x-3">
            <div className="inline-flex items-center space-x-2 px-3 py-1 bg-teal-100 border border-teal-200 rounded-full">
              <span className="text-sm font-medium text-teal-800">
                {data.activities.length} actividad{data.activities.length !== 1 ? 'es' : ''} seleccionada{data.activities.length !== 1 ? 's' : ''}
              </span>
              {data.activities.length > 0 && (
                <div className="w-2 h-2 bg-teal-500 rounded-full animate-pulse"></div>
              )}
            </div>
            
            {/* Botón para limpiar selecciones */}
            {data.activities.length > 0 && (
              <button
                type="button"
                onClick={handleClearAllActivities}
                className="inline-flex items-center space-x-1 px-2 py-1 text-xs font-medium text-slate-600 bg-slate-100 border border-slate-200 rounded-md hover:bg-slate-200 hover:text-slate-700 transition-colors"
              >
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                <span>Limpiar</span>
              </button>
            )}
          </div>
        </div>

        {Object.entries(categorizedActivities).map(([category, activities]) => (
          <div key={category} className="space-y-3">
            <h4 className="text-md font-medium text-slate-700 border-b border-teal-200 pb-1">
              {category}
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {activities.map((activity) => {
                const isSelected = data.activities.includes(activity);
                return (
                  <label 
                    key={activity} 
                    className={`
                      relative flex items-start space-x-3 p-3 rounded-lg border-2 transition-all duration-200 cursor-pointer
                      ${isSelected 
                        ? 'border-teal-500 bg-teal-50 shadow-sm' 
                        : 'border-slate-200 bg-white hover:border-teal-300 hover:bg-teal-25'
                      }
                    `}
                    onClick={() => handleActivityChange(activity)}
                  >
                    {/* Checkbox personalizado */}
                    <div className="flex-shrink-0 mt-0.5">
                      <div className={`
                        w-5 h-5 rounded border-2 flex items-center justify-center transition-all duration-200
                        ${isSelected 
                          ? 'border-teal-500 bg-teal-500' 
                          : 'border-slate-300 bg-white'
                        }
                      `}>
                        {isSelected && (
                          <svg 
                            className="w-3 h-3 text-white" 
                            fill="currentColor" 
                            viewBox="0 0 20 20"
                          >
                            <path 
                              fillRule="evenodd" 
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" 
                              clipRule="evenodd" 
                            />
                          </svg>
                        )}
                      </div>
                    </div>
                    
                    {/* Texto de la actividad */}
                    <span className={`
                      text-sm font-medium leading-relaxed
                      ${isSelected ? 'text-teal-800' : 'text-slate-700'}
                    `}>
                      {activity}
                    </span>
                    
                    
                  </label>
                );
              })}
            </div>
          </div>
        ))}

        <TextAreaField
            label="Otras Actividades o Solicitudes Especiales (Opcional)"
            id="otherActivities"
            value={data.otherActivities || ''}
            onChange={(e) => updateData({ otherActivities: e.target.value })}
            placeholder="Ej: Celebrar un cumpleaños, equipo de snorkel para niños, etc."
            rows={2}
        />
      </div>

      {/* Sección de Presupuesto */}
      <div className="space-y-4 pt-4 border-t border-slate-200">
        <h3 className="text-lg font-semibold text-slate-800 mb-4">💰 Presupuesto (Opcional)</h3>
        
        <div className="relative">
          <SelectField
            label="Nivel de Presupuesto"
            id="budgetLevel"
            value={data.budgetLevel || ''}
            onChange={(e) => updateData({ budgetLevel: e.target.value as BudgetLevel | undefined, customBudgetAmount: undefined })}
            options={budgetLevelOptions}
          />
          <button
            type="button"
            className="absolute top-0 right-0 mt-1 mr-1 h-5 w-5 text-teal-500 cursor-pointer focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-1 rounded-sm"
            onClick={() => setShowBudgetTooltip(!showBudgetTooltip)}
            aria-label="Información sobre niveles de presupuesto"
            aria-expanded={showBudgetTooltip}
            aria-controls={budgetTooltipId}
          >
            <InfoIcon className="w-full h-full" aria-hidden="true" />
          </button>
          {showBudgetTooltip && (
              <div 
                   id={budgetTooltipId}
                   className="absolute z-20 w-80 p-3 mt-1 text-sm text-white bg-slate-700 rounded-md shadow-lg right-0 sm:left-1/2 sm:-translate-x-1/2"
                   onClick={() => setShowBudgetTooltip(false)}
                   role="tooltip">
                Indica un presupuesto para ayudarnos a personalizar tu plan: desde opciones económicas hasta experiencias de lujo.
              </div>
          )}
        </div>
        
        {data.budgetLevel === BudgetLevel.SPECIFIC_AMOUNT && (
          <InputField
            label="Monto del Presupuesto (EUR)"
            id="customBudgetAmount"
            type="text" 
            value={displayedCustomBudget}
            onChange={handleCustomBudgetChange} 
            placeholder="Ej: 500"
            required
            inputMode="numeric" 
          />
        )}
        
        <TextAreaField
          label="Notas Adicionales sobre tu Viaje (Opcional)"
          id="budgetNotes"
          value={data.budgetNotes || ''}
          onChange={(e) => updateData({ budgetNotes: e.target.value })}
          placeholder="Ej: Preferencias alimentarias, celebraciones especiales, restricciones, etc."
          rows={2}
        />
      </div>
    </div>
  );
};

export default Step4Preferences;