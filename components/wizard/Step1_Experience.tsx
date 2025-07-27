
import React from 'react';
import { WizardStepProps, PlanningMode, DesiredExperienceType, planningModeOptions, desiredExperienceTypeOptions } from '../../types';
import { RadioGroup, SelectField } from '../FormControls';
import { GuidanceSailIcon } from '../icons/GuidanceSailIcon';

const Step1Experience: React.FC<WizardStepProps> = ({ data, updateData }) => {
  return (
    <div className="space-y-6 animate-fade-in">
        <div className="text-center">
            <GuidanceSailIcon className="mx-auto h-12 w-12 text-teal-500" />
            <h2 className="text-xl sm:text-2xl font-semibold text-slate-800 mt-2">Comencemos tu Aventura</h2>
            <p className="text-sm sm:text-base text-slate-600">Dinos qué tipo de experiencia náutica estás buscando.</p>
        </div>

        <div className="space-y-4 rounded-lg bg-slate-50 p-6 border border-slate-200">
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
  );
};

export default Step1Experience;