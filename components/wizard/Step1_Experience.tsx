
import React from 'react';
import { WizardStepProps, PlanningMode, DesiredExperienceType, planningModeOptions, desiredExperienceTypeOptions } from '../../types';
import { RadioGroup, SelectField } from '../FormControls';
import { GuidanceSailIcon } from '../icons/GuidanceSailIcon';

const Step1Experience: React.FC<WizardStepProps> = ({ data, updateData }) => {
  return (
    <div className="space-y-8 animate-fade-in">
        <div className="text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-teal-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl">
                <GuidanceSailIcon className="h-10 w-10 text-white" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-800 mb-3">
                Comencemos tu
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-teal-600">
                    Aventura Náutica
                </span>
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
                Dinos qué tipo de experiencia náutica estás buscando para crear tu plan perfecto.
            </p>
        </div>

        <div className="space-y-6 rounded-xl bg-gradient-to-br from-blue-50 to-teal-50 p-8 border border-blue-200 shadow-lg">
            <div className="space-y-4">
                <RadioGroup
                    label="Planificar con:"
                    name="planningMode"
                    selectedValue={data.planningMode}
                    onChange={(value) => {
                        console.log('🔍 DEBUG - RadioGroup onChange:', {
                            value,
                            currentPlanningMode: data.planningMode,
                            OWN_BOAT: 'own_boat'
                        });
                        updateData({ planningMode: value as PlanningMode });
                    }}
                    options={planningModeOptions}
                />

                <SelectField
                    label="Tipo de Experiencia Deseada"
                    id="desiredExperienceType"
                    value={data.desiredExperienceType}
                    onChange={(e) => {
                        const newType = e.target.value as DesiredExperienceType;
                        const updates: Partial<typeof data> = { desiredExperienceType: newType };
                        
                        // Validación y corrección automática según tipo de experiencia
                        if (newType === DesiredExperienceType.SUNSET || 
                            newType === DesiredExperienceType.FULL_DAY ||
                            newType === DesiredExperienceType.HALF_DAY_MORNING ||
                            newType === DesiredExperienceType.HALF_DAY_AFTERNOON) {
                            updates.numTripDays = 1;
                            updates.isSamePortForMultiDay = true;
                            updates.arrivalPortForMultiDay = '';
                            updates.endDate = ''; 
                            updates.multiDayTripNotes = '';
                        } else if (newType !== DesiredExperienceType.MULTI_DAY) {
                            updates.isSamePortForMultiDay = true;
                            updates.arrivalPortForMultiDay = '';
                            updates.endDate = ''; 
                            updates.multiDayTripNotes = ''; 
                        }
                        
                        updateData(updates);
                    }}
                    options={desiredExperienceTypeOptions}
                    required
                />
            </div>
        </div>
    </div>
  );
};

export default Step1Experience;