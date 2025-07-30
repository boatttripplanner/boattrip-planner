
import React, { useState } from 'react';
import { WizardStepProps, ExperienceLevel, BoatingLicenseType, experienceLevelOptions, boatingLicenseTypeOptions, PlanningMode } from '../../types';
import { InputField, SelectField } from '../FormControls';
import { InfoIcon } from '../icons/InfoIcon';
import { CrewIcon } from '../icons/CrewIcon';

const Step3Crew: React.FC<WizardStepProps> = ({ data, updateData }) => {
  const [showExperienceTooltip, setShowExperienceTooltip] = useState(false);
  const experienceTooltipId = 'experience-tooltip-content-wizard';

  const currentExperienceOptions = data.planningMode === PlanningMode.OWN_BOAT
    ? experienceLevelOptions.filter(opt => 
        opt.value === ExperienceLevel.EXPERIENCED_WITH_LICENSE_NO_SKIPPER ||
        opt.value === ExperienceLevel.EXPERT_ADVANCED_LICENSE
      )
    : experienceLevelOptions;

  const showBoatingLicenseField = 
    data.experience === ExperienceLevel.EXPERIENCED_WITH_LICENSE_NO_SKIPPER ||
    data.experience === ExperienceLevel.EXPERT_ADVANCED_LICENSE ||
    data.planningMode === PlanningMode.OWN_BOAT;

  return (
    <div className="space-y-8 animate-fade-in">
        <div className="text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-teal-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl">
                <CrewIcon className="h-10 w-10 text-white" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-800 mb-3">
                Tu Tripulación
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-teal-600">
                    y Experiencia
                </span>
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
                Cuéntanos sobre quiénes irán a bordo y tu experiencia náutica.
            </p>
        </div>
      
        <div className="space-y-6 rounded-xl bg-gradient-to-br from-blue-50 to-teal-50 p-8 border border-blue-200 shadow-lg">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InputField
                label="Número de Personas"
                id="numPeople"
                type="number"
                value={data.numPeople > 0 ? data.numPeople.toString() : ''} 
                onChange={(e) => {
                    const parsedValue = parseInt(e.target.value, 10);
                    updateData({ numPeople: isNaN(parsedValue) ? 0 : parsedValue });
                }}
                onBlur={() => {
                    if (!data.numPeople || data.numPeople <= 0) {
                        updateData({ numPeople: 1 });
                    }
                }}
                min="1"
                required
                />
                <div className="relative">
                    <SelectField
                        label="Nivel de Experiencia Náutica"
                        id="experience"
                        value={data.experience}
                        onChange={(e) => {
                            const newExperience = e.target.value as ExperienceLevel;
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
                  onChange={(e) => updateData({ boatingLicense: e.target.value as BoatingLicenseType })}
                  options={[{value: '', label: 'Selecciona tu titulación...'}, ...boatingLicenseTypeOptions.filter(opt => opt.value !== BoatingLicenseType.NO_LICENSE)]}
                  required={showBoatingLicenseField}
                />
            )}
        </div>
    </div>
  );
};

export default Step3Crew;