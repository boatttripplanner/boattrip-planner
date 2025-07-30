
import React, { useMemo } from 'react';
import { WizardStepProps, PlanningMode, DesiredExperienceType } from '../../types';
import { InputField } from '../FormControls';
import { AutocompleteInputField } from '../AutocompleteInputField';
import { boatDatabase } from '../../data/boatModels';
import { BoatOutlineIcon } from '../icons/BoatOutlineIcon';

const Step5BoatDetails: React.FC<WizardStepProps> = ({ data, updateData }) => {
    const boatModelSuggestions = useMemo(() => boatDatabase.map(b => b.displayName), []);
    
    const isRequired = useMemo(() => 
        data.planningMode === PlanningMode.OWN_BOAT || data.desiredExperienceType === DesiredExperienceType.TRANSFER,
        [data.planningMode, data.desiredExperienceType]
    );

    const handleBoatModelChange = (selectedModelName: string) => {
        const selectedBoat = boatDatabase.find(boat => boat.displayName.toLowerCase() === selectedModelName.toLowerCase());
        const details = { ...data.boatTransferDetails, model: selectedModelName };
        if (selectedBoat) {
            details.length = selectedBoat.length || '';
            details.beam = selectedBoat.beam || '';
            details.draft = selectedBoat.draft || '';
            details.cruisingSpeed = selectedBoat.cruisingSpeed || '';
            details.tankCapacity = selectedBoat.tankCapacity || '';
            details.averageConsumption = selectedBoat.averageConsumption || '';
        }
        updateData({ boatTransferDetails: details });
    };

    const handleDetailChange = (field: keyof NonNullable<typeof data.boatTransferDetails>, value: string) => {
        updateData({
            boatTransferDetails: {
                ...data.boatTransferDetails,
                [field]: value
            }
        });
    };
    
    let heading = "Detalles de Tu Barco (Opcional)";
    let description = "Si quieres, danos detalles del tipo de barco que buscas.";
    
    if (data.planningMode === PlanningMode.OWN_BOAT) {
        heading = "Detalles de Tu Barco";
        description = "Introduce las especificaciones de tu embarcación.";
    } else if (data.desiredExperienceType === DesiredExperienceType.TRANSFER) {
        heading = "Especificaciones del Barco para Traslado";
        description = "Introduce las especificaciones de tu embarcación.";
    } else if (data.planningMode === PlanningMode.RENTAL) {
        heading = "Preferencias de Barco (Opcional)";
        description = "Si tienes preferencias específicas sobre el tipo de barco que quieres alquilar, puedes indicarlas aquí.";
    }

  return (
    <div className="space-y-8 animate-fade-in">
        <div className="text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-teal-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl">
                <BoatOutlineIcon className="h-10 w-10 text-white" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-800 mb-3">
                {heading.split(' ').slice(0, -1).join(' ')}
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-teal-600">
                    {heading.split(' ').slice(-1)[0]}
                </span>
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
                {description}
            </p>
        </div>

        <div className="space-y-6 rounded-xl bg-gradient-to-br from-blue-50 to-teal-50 p-8 border border-blue-200 shadow-lg">
            <div className="space-y-4">
                <AutocompleteInputField
                    label="Modelo del Barco"
                    id="boatModel"
                    value={data.boatTransferDetails?.model || ''}
                    onChange={handleBoatModelChange}
                    suggestions={boatModelSuggestions}
                    placeholder="Ej: Beneteau Oceanis 46.1 (autocompletar)"
                    required={isRequired}
                />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <InputField 
                        label="Eslora (metros)" 
                        id="boatLength" 
                        value={data.boatTransferDetails?.length || ''} 
                        onChange={(e) => handleDetailChange('length', e.target.value)}
                        placeholder="Ej: 18.5" 
                        type="text"
                        required={isRequired}
                    />
                    <InputField 
                        label="Manga (metros)" 
                        id="boatBeam" 
                        value={data.boatTransferDetails?.beam || ''}
                        onChange={(e) => handleDetailChange('beam', e.target.value)}
                        placeholder="Ej: 4.8" 
                        type="text" 
                        required={isRequired}
                    />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <InputField 
                        label="Calado (metros)" 
                        id="boatDraft" 
                        value={data.boatTransferDetails?.draft || ''} 
                        onChange={(e) => handleDetailChange('draft', e.target.value)}
                        placeholder="Ej: 1.5" 
                        type="text" 
                        required={isRequired}
                    />
                    <InputField 
                        label="Velocidad de Crucero (nudos)" 
                        id="boatCruisingSpeed" 
                        value={data.boatTransferDetails?.cruisingSpeed || ''}
                        onChange={(e) => handleDetailChange('cruisingSpeed', e.target.value)}
                        placeholder="Ej: 22" 
                        type="text" 
                        required={isRequired}
                    />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <InputField 
                        label="Capacidad del Depósito (litros)" 
                        id="boatTankCapacity" 
                        value={data.boatTransferDetails?.tankCapacity || ''}
                        onChange={(e) => handleDetailChange('tankCapacity', e.target.value)}
                        placeholder="Ej: 3000" 
                        type="text" 
                        required={isRequired}
                    />
                    <InputField 
                        label="Consumo Medio (litros/hora)" 
                        id="boatAverageConsumption" 
                        value={data.boatTransferDetails?.averageConsumption || ''}
                        onChange={(e) => handleDetailChange('averageConsumption', e.target.value)}
                        placeholder="Ej: 150" 
                        type="text" 
                        required={isRequired}
                    />
                </div>
            </div>
        </div>
    </div>
  );
};

export default Step5BoatDetails;