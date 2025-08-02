
import React, { useMemo } from 'react';
import { WizardStepProps, PlanningMode, DesiredExperienceType, planningModeOptions, desiredExperienceTypeOptions } from '../../types';
import { RadioGroup, SelectField } from '../FormControls';
import { GuidanceSailIcon } from '../icons/GuidanceSailIcon';

const Step1Experience: React.FC<WizardStepProps> = ({ data, updateData }) => {
  // Filtrar opciones de experiencia según el modo de planificación
  const filteredExperienceOptions = useMemo(() => {
    if (data.planningMode === PlanningMode.OWN_BOAT) {
      // Para barco propio, mostrar todas las opciones incluyendo traslado
      return desiredExperienceTypeOptions;
    } else {
      // Para alquiler, excluir la opción de traslado
      return desiredExperienceTypeOptions.filter(option => 
        option.value !== DesiredExperienceType.TRANSFER
      );
    }
  }, [data.planningMode]);
  return (
    <div className="space-y-6 sm:space-y-8 animate-fade-in">
        <div className="text-center">
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-blue-500 to-teal-600 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6 shadow-xl">
                <GuidanceSailIcon className="h-8 w-8 sm:h-10 sm:w-10 text-white" />
            </div>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-slate-800 mb-2 sm:mb-3">
                Comencemos tu
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-teal-600">
                    Aventura Náutica
                </span>
            </h2>
            <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed px-2">
                Dinos qué tipo de experiencia náutica estás buscando para crear tu plan perfecto.
            </p>
        </div>

        <div className="space-y-4 sm:space-y-6 rounded-xl bg-gradient-to-br from-blue-50 to-teal-50 p-4 sm:p-6 md:p-8 border border-blue-200 shadow-lg">
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
                        
                        const newPlanningMode = value as PlanningMode;
                        const updates: Partial<typeof data> = { planningMode: newPlanningMode };
                        
                        // Si cambia de OWN_BOAT a RENTAL y tenía seleccionado TRANSFER, resetear a FULL_DAY
                        if (newPlanningMode === PlanningMode.RENTAL && 
                            data.desiredExperienceType === DesiredExperienceType.TRANSFER) {
                            updates.desiredExperienceType = DesiredExperienceType.FULL_DAY;
                            updates.numTripDays = 1;
                            updates.isSamePortForMultiDay = true;
                            updates.arrivalPortForMultiDay = '';
                            updates.endDate = '';
                            updates.multiDayTripNotes = '';
                            updates.transferDestinationPort = '';
                            updates.boatTransferDetails = {};
                        }
                        
                        updateData(updates);
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
                    options={filteredExperienceOptions}
                    required
                />
            </div>
        </div>
    </div>
  );
};

export default Step1Experience;