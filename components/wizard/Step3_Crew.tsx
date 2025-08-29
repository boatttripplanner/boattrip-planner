
import React from 'react';
import { WizardStepProps, ExperienceLevel, BoatingLicenseType, experienceLevelOptions, boatingLicenseTypeOptions, PlanningMode } from '../../types';
import { SelectField } from '../FormControls';

const Step3Crew: React.FC<WizardStepProps> = ({ data, updateData }) => {
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

  // Función para manejar el cambio del número de personas
  const handleNumPeopleChange = (newValue: number) => {
    const clampedValue = Math.max(1, Math.min(12, newValue));
    console.log('🔍 Step3Crew - Updating num people to:', clampedValue);
    updateData({ numPeople: clampedValue });
  };

  // Función para incrementar el número de personas
  const incrementNumPeople = () => {
    const newValue = (data.numPeople || 1) + 1;
    if (newValue <= 12) {
      handleNumPeopleChange(newValue);
    }
  };

  // Función para decrementar el número de personas
  const decrementNumPeople = () => {
    const newValue = (data.numPeople || 1) - 1;
    if (newValue >= 1) {
      handleNumPeopleChange(newValue);
    }
  };

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
          {/* Campo de número de personas mejorado */}
          <div className="space-y-2">
            <label htmlFor="numPeople" className="block text-sm font-medium text-slate-700 mb-2">
              Número de Personas <span className="text-red-500">*</span>
            </label>
            <div className="flex items-center space-x-3">
              {/* Botón de decremento */}
              <button
                type="button"
                onClick={decrementNumPeople}
                disabled={(data.numPeople || 1) <= 1}
                className="w-10 h-10 rounded-lg border-2 border-slate-300 bg-white text-slate-600 hover:border-slate-400 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center font-bold text-lg"
                aria-label="Reducir número de personas"
              >
                -
              </button>
              
              {/* Input central */}
              <div className="flex-1">
                <input
                  id="numPeople"
                  type="number"
                  value={data.numPeople > 0 ? data.numPeople.toString() : '1'} 
                  onChange={(e) => {
                    const value = e.target.value;
                    console.log('🔍 Step3Crew - Input value changed:', value);
                    
                    if (value && value !== '') {
                      const parsedValue = parseInt(value, 10);
                      if (!isNaN(parsedValue) && parsedValue >= 1 && parsedValue <= 12) {
                        handleNumPeopleChange(parsedValue);
                      }
                    }
                  }}
                  onBlur={(e) => {
                    const value = e.target.value;
                    console.log('🔍 Step3Crew - Input blur, value:', value);
                    
                    // Validar y corregir el valor al perder el foco
                    if (!value || value === '' || parseInt(value, 10) < 1) {
                      console.log('🔍 Step3Crew - Setting default num people to 1');
                      updateData({ numPeople: 1 });
                    } else if (parseInt(value, 10) > 12) {
                      console.log('🔍 Step3Crew - Setting max num people to 12');
                      updateData({ numPeople: 12 });
                    }
                  }}
                  min="1"
                  max="12"
                  required
                  className="w-full px-4 py-2.5 border border-slate-300 rounded-lg text-center text-lg font-semibold text-slate-800 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                  placeholder="1"
                />
              </div>
              
              {/* Botón de incremento */}
              <button
                type="button"
                onClick={incrementNumPeople}
                disabled={(data.numPeople || 1) >= 12}
                className="w-10 h-10 rounded-lg border-2 border-slate-300 bg-white text-slate-600 hover:border-slate-400 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center font-bold text-lg"
                aria-label="Aumentar número de personas"
              >
                +
              </button>
            </div>
            
            {/* Indicador de rango */}
            <p className="text-xs text-slate-500 text-center">
              Rango: 1 - 12 personas
            </p>
          </div>

          <div>
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