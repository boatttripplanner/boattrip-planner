
import React, { useState } from 'react';
import { WizardStepProps, ExperienceLevel, BoatingLicenseType, experienceLevelOptions, boatingLicenseTypeOptions, PlanningMode } from '../../types';
import { InputField, SelectField } from '../FormControls';
import { InfoIcon } from '../icons/InfoIcon';

const Step3Crew: React.FC<WizardStepProps> = ({ data, updateData }) => {
  const [showExperienceTooltip, setShowExperienceTooltip] = useState(false);
  const experienceTooltipId = 'experience-tooltip-content-wizard';

  // Logs de depuración
  console.log('🔍 Step3Crew - Componente renderizado');
  console.log('🔍 Step3Crew - Data recibida:', data);

  // Verificar que data tenga las propiedades necesarias
  if (!data || typeof data !== 'object') {
    console.error('❌ Step3Crew - Data inválida:', data);
    return <div>Error: Datos no válidos</div>;
  }

  const currentExperienceOptions = experienceLevelOptions;
  const showBoatingLicenseField = 
    data.experience === ExperienceLevel.EXPERIENCED_WITH_LICENSE_NO_SKIPPER ||
    data.experience === ExperienceLevel.EXPERT_ADVANCED_LICENSE;

  return (
    <div className="space-y-8 animate-fade-in">
        <div className="text-center">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-slate-800 mb-2 sm:mb-3">
                ¿Con quién
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-teal-600">
                    Navegarás?
                </span>
            </h2>
            <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed px-2">
                Cuéntanos sobre tu tripulación para adaptar el plan a vuestras necesidades.
            </p>
        </div>
      
        <div className="space-y-6 rounded-xl bg-gradient-to-br from-blue-50 to-teal-50 p-8 border border-blue-200 shadow-lg">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InputField
                label="Número de Personas"
                id="numPeople"
                type="number"
                value={data.numPeople > 0 ? data.numPeople.toString() : '1'} 
                onChange={(e) => {
                    const value = e.target.value;
                    console.log('🔍 Step3Crew - Input value changed:', value);
                    
                    // Solo actualizar si hay un valor válido
                    if (value && value !== '') {
                        const parsedValue = parseInt(value, 10);
                        if (!isNaN(parsedValue) && parsedValue > 0) {
                            console.log('🔍 Step3Crew - Updating num people to:', parsedValue);
                            updateData({ numPeople: parsedValue });
                        }
                    }
                }}
                onBlur={(e) => {
                    const value = e.target.value;
                    console.log('🔍 Step3Crew - Input blur, value:', value);
                    
                    // Validar y corregir el valor al perder el foco
                    if (!value || value === '' || parseInt(value, 10) <= 0) {
                        console.log('🔍 Step3Crew - Setting default num people to 1');
                        updateData({ numPeople: 1 });
                    }
                }}
                min="1"
                max="20"
                required
                />
                <div className="relative">
                    <SelectField
                        label="Nivel de Experiencia Náutica"
                        id="experience"
                        value={data.experience || ''}
                        onChange={(e) => {
                            const newExperience = e.target.value as ExperienceLevel;
                            console.log('🔍 Step3Crew - Experience changed:', newExperience);
                            const updates: Partial<typeof data> = { experience: newExperience };
                            if (data.planningMode === PlanningMode.RENTAL && newExperience !== ExperienceLevel.EXPERIENCED_WITH_LICENSE_NO_SKIPPER && newExperience !== ExperienceLevel.EXPERT_ADVANCED_LICENSE) {
                               updates.boatingLicense = undefined;
                            }
                            updateData(updates);
                        }}
                        options={currentExperienceOptions}
                    />
                    <button
                        type="button"
                        className="absolute top-0 right-0 mt-1 mr-1 h-5 w-5 text-blue-500 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 rounded-sm"
                        onClick={() => setShowExperienceTooltip(!showExperienceTooltip)}
                        aria-label="Información sobre niveles de experiencia"
                        aria-expanded={showExperienceTooltip}
                        aria-controls={experienceTooltipId}
                    >
                        <InfoIcon className="w-full h-full" aria-hidden="true" />
                    </button>
                    {showExperienceTooltip && (
                        <div 
                            id={experienceTooltipId}
                            className="absolute z-20 w-72 p-3 mt-1 text-sm text-white bg-slate-700 rounded-md shadow-lg right-0 sm:left-1/2 sm:-translate-x-1/2"
                            onClick={() => setShowExperienceTooltip(false)}
                            role="tooltip">
                        Selecciona tu familiaridad con la navegación para determinar si necesitas un patrón.
                        </div>
                    )}
                </div>
            </div>
            
            {showBoatingLicenseField && (
                <SelectField
                  label="Titulación Náutica"
                  id="boatingLicense"
                  value={data.boatingLicense || ''}
                  onChange={(e) => {
                    console.log('🔍 Step3Crew - Boating license changed:', e.target.value);
                    updateData({ boatingLicense: e.target.value as BoatingLicenseType });
                  }}
                  options={[{value: '', label: 'Selecciona tu titulación...'}, ...boatingLicenseTypeOptions.filter(opt => opt.value !== BoatingLicenseType.NO_LICENSE)]}
                  required={showBoatingLicenseField}
                />
            )}
        </div>
    </div>
  );
};

export default Step3Crew;