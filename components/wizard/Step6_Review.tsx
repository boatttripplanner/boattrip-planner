
import React from 'react';
import { UserPreferences, desiredExperienceTypeOptions, experienceLevelOptions, planningModeOptions } from '../../types';
import { budgetLevelOptions } from '../../constants';

import { CheckCircleIcon } from '../icons/CheckCircleIcon';

interface Step6ReviewProps {
  data: UserPreferences;
  goToStep: (step: number) => void;
  showBoatSpecsStep: boolean;
}

const getDisplayValue = (options: { value: string; label: string }[], value: string) => {
  const option = options.find(opt => opt.value === value);
  return option ? option.label : value;
};

const SectionBlock: React.FC<{ title: string; children: React.ReactNode; onEdit: () => void }> = ({ title, children, onEdit }) => (
  <div className="bg-white border border-blue-200 rounded-xl p-6 space-y-4 shadow-md">
    <div className="flex justify-between items-center">
      <h3 className="text-lg font-semibold text-slate-800">{title}</h3>
      <button
        onClick={onEdit}
        className="text-sm text-blue-600 hover:text-blue-700 font-medium hover:underline transition-colors"
      >
        Editar
      </button>
    </div>
    <div className="space-y-3">
      {children}
    </div>
  </div>
);

const ReviewItem: React.FC<{ label: string; value: string | number }> = ({ label, value }) => (
  <div className="flex justify-between items-center py-2 border-b border-blue-100 last:border-b-0">
    <span className="text-slate-600 font-medium">{label}:</span>
    <span className="text-slate-800 font-semibold">{value}</span>
  </div>
);

const ActivitiesPreview: React.FC<{ activities: string[] }> = ({ activities }) => {
  if (activities.length === 0) {
    return (
      <div className="text-center py-4 text-slate-500">
        <p>No se han seleccionado actividades específicas</p>
        <p className="text-sm">La IA sugerirá actividades relevantes para tu experiencia</p>
      </div>
    );
  }

  // Organizar actividades por categorías para mejor visualización
  const categorizedActivities = {
    'Relax y Naturaleza': activities.filter(a => 
      ['Tomar el Sol y Relajarse en Cubierta', 'Observación de Puestas de Sol desde el Mar', 
       'Fotografía Paisajística y Marina', 'Avistamiento de Delfines o Fauna Marina'].includes(a)
    ),
    'Actividades Acuáticas': activities.filter(a => 
      ['Snorkel', 'Buceo (con equipo propio o guía)', 'Buceo con botella (submarinismo)',
       'Paddle Surf (SUP)', 'Kayak o Canoa', 'Deportes Acuáticos (Esquí, Wakeboard, Donut)'].includes(a)
    ),
    'Exploración': activities.filter(a => 
      ['Visitar Calas Escondidas', 'Exploración Costera y Cuevas Marinas',
       'Visitar Puertos Pintorescos y Paseos Marítimos', 'Navegación a Vela (si aplica)'].includes(a)
    ),
    'Otros': activities.filter(a => 
      !['Tomar el Sol y Relajarse en Cubierta', 'Observación de Puestas de Sol desde el Mar', 
        'Fotografía Paisajística y Marina', 'Avistamiento de Delfines o Fauna Marina',
        'Snorkel', 'Buceo (con equipo propio o guía)', 'Buceo con botella (submarinismo)',
        'Paddle Surf (SUP)', 'Kayak o Canoa', 'Deportes Acuáticos (Esquí, Wakeboard, Donut)',
        'Visitar Calas Escondidas', 'Exploración Costera y Cuevas Marinas',
        'Visitar Puertos Pintorescos y Paseos Marítimos', 'Navegación a Vela (si aplica)'].includes(a)
    )
  };

  return (
    <div className="space-y-4">
      {Object.entries(categorizedActivities).map(([category, categoryActivities]) => {
        if (categoryActivities.length === 0) return null;
        
        return (
          <div key={category} className="space-y-3">
            <h4 className="text-sm font-medium text-blue-700 uppercase tracking-wide">
              {category}
            </h4>
            <div className="flex flex-wrap gap-2">
              {categoryActivities.map((activity) => (
                <span
                  key={activity}
                  className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-blue-100 to-teal-100 text-blue-800 border border-blue-200"
                >
                  <CheckCircleIcon className="w-3 h-3 mr-1" />
                  {activity}
                </span>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
};

const Step6Review: React.FC<Step6ReviewProps> = ({ data, goToStep, showBoatSpecsStep }) => {
  return (
    <div className="space-y-8 animate-fade-in">
      <div className="text-center">
        <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-teal-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl">
            <CheckCircleIcon className="h-10 w-10 text-white" />
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold text-slate-800 mb-3">
            Revisa tu
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-teal-600">
                Plan Perfecto
            </span>
        </h2>
        <p className="text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Confirma todos los detalles antes de generar tu recomendación personalizada.
        </p>
      </div>

      <div className="space-y-6">
        <SectionBlock title="Experiencia Náutica" onEdit={() => goToStep(1)}>
          <ReviewItem label="Tipo de Planificación" value={getDisplayValue(planningModeOptions, data.planningMode)} />
          <ReviewItem label="Experiencia Deseada" value={getDisplayValue(desiredExperienceTypeOptions, data.desiredExperienceType)} />
        </SectionBlock>

        <SectionBlock title="Ruta y Fechas" onEdit={() => goToStep(2)}>
          <ReviewItem label={data.desiredExperienceType === 'transfer' ? 'Origen' : 'Salida'} value={data.destination} />
          {data.desiredExperienceType === 'multi_day' && (
            <>
              <ReviewItem label="Duración" value={`${data.numTripDays} días`} />
              {!data.isSamePortForMultiDay && data.arrivalPortForMultiDay && <ReviewItem label="Llegada" value={data.arrivalPortForMultiDay} />}
            </>
          )}
          {data.desiredExperienceType === 'transfer' && data.transferDestinationPort && <ReviewItem label="Destino" value={data.transferDestinationPort} />}
          <ReviewItem label="Fecha de Inicio" value={data.startDate ? new Date(data.startDate + 'T00:00:00').toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric'}) : ''} />
        </SectionBlock>

        <SectionBlock title="Tripulación" onEdit={() => goToStep(3)}>
          <ReviewItem label="Personas" value={data.numPeople} />
          <ReviewItem label="Experiencia" value={getDisplayValue(experienceLevelOptions, data.experience)} />
        </SectionBlock>

        <SectionBlock title="Actividades y Preferencias" onEdit={() => goToStep(4)}>
          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-medium text-slate-700 mb-2">Actividades Seleccionadas:</h4>
              <ActivitiesPreview activities={data.activities} />
            </div>
            
            {data.otherActivities && (
              <div>
                <h4 className="text-sm font-medium text-slate-700 mb-2">Otras Actividades:</h4>
                <p className="text-sm text-slate-800 bg-slate-50 p-2 rounded">{data.otherActivities}</p>
              </div>
            )}
            
            <div className="pt-2 border-t border-blue-200">
              <ReviewItem label="Presupuesto" value={data.budgetLevel ? getDisplayValue(budgetLevelOptions, data.budgetLevel) : 'No especificado'} />
              {data.budgetLevel === 'specific_amount' && <ReviewItem label="Monto" value={`${data.customBudgetAmount?.toLocaleString('es-ES') || '0'} EUR`} />}
            </div>
            
            {data.budgetNotes && (
              <div>
                <h4 className="text-sm font-medium text-slate-700 mb-2">Notas Adicionales:</h4>
                <p className="text-sm text-slate-800 bg-slate-50 p-2 rounded">{data.budgetNotes}</p>
              </div>
            )}
          </div>
        </SectionBlock>
        
        {showBoatSpecsStep && (
          <SectionBlock title="Detalles del Barco" onEdit={() => goToStep(5)}>
            {data.boatTransferDetails ? (
              <>
                {data.boatTransferDetails.model && <ReviewItem label="Modelo" value={data.boatTransferDetails.model} />}
                {data.boatTransferDetails.length && <ReviewItem label="Eslora" value={`${data.boatTransferDetails.length}m`} />}
                {data.boatTransferDetails.beam && <ReviewItem label="Manga" value={`${data.boatTransferDetails.beam}m`} />}
                {data.boatTransferDetails.draft && <ReviewItem label="Calado" value={`${data.boatTransferDetails.draft}m`} />}
                {data.boatTransferDetails.cruisingSpeed && <ReviewItem label="Velocidad de Crucero" value={data.boatTransferDetails.cruisingSpeed} />}
                {data.boatTransferDetails.tankCapacity && <ReviewItem label="Capacidad del Depósito" value={data.boatTransferDetails.tankCapacity} />}
                {data.boatTransferDetails.averageConsumption && <ReviewItem label="Consumo Medio" value={data.boatTransferDetails.averageConsumption} />}
              </>
            ) : (
              <p className="text-slate-500 text-center py-2">No se han especificado detalles del barco</p>
            )}
          </SectionBlock>
        )}
      </div>

      <div className="bg-gradient-to-r from-blue-50 to-teal-50 p-6 rounded-xl border border-blue-200 shadow-lg">
        <h3 className="text-lg font-semibold text-slate-800 mb-3">✨ Tu Recomendación Personalizada</h3>
        <p className="text-sm text-slate-600 mb-3">
          Basándome en tus selecciones, especialmente tus actividades preferidas, 
          generaré un itinerario completamente personalizado que incluirá:
        </p>
        <ul className="text-sm text-slate-700 space-y-2">
          <li className="flex items-start">
            <span className="text-blue-500 mr-2">•</span>
            Destinos específicos para tus actividades seleccionadas
          </li>
          <li className="flex items-start">
            <span className="text-blue-500 mr-2">•</span>
            Horarios optimizados para cada experiencia
          </li>
          <li className="flex items-start">
            <span className="text-blue-500 mr-2">•</span>
            Consejos especializados según tus preferencias
          </li>
          <li className="flex items-start">
            <span className="text-blue-500 mr-2">•</span>
            Checklist personalizado con equipamiento necesario
          </li>
          <li className="flex items-start">
            <span className="text-blue-500 mr-2">•</span>
            Sugerencias adicionales relacionadas con tus intereses
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Step6Review;