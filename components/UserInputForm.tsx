
import React, { useState, useMemo } from 'react';
import { UserPreferences, PlanningMode, DesiredExperienceType, ExperienceLevel, CookieConsentStatus, UserInputFormProps } from '../types';
import { Button } from './Button';
import ProgressStepper from './wizard/ProgressStepper';
import Step1Experience from './wizard/Step1_Experience';
import Step2Route from './wizard/Step2_Route';
import Step3Crew from './wizard/Step3_Crew';
import Step4Preferences from './wizard/Step4_Preferences';
import Step5BoatDetails from './wizard/Step5_BoatDetails';
import Step6Review from './wizard/Step6_Review';
import WizardNavigation from './wizard/WizardNavigation';

const UserInputForm: React.FC<UserInputFormProps> = ({ onSubmit, isLoading, cookieConsent, onReconsiderCookies }) => {
  const [currentStep, setCurrentStep] = useState(1);
  
  const [formData, setFormData] = useState<UserPreferences>({
    planningMode: PlanningMode.RENTAL,
    desiredExperienceType: DesiredExperienceType.FULL_DAY,
    destination: '',
    startDate: new Date().toISOString().slice(0, 10),
    endDate: '',
    numTripDays: 2,
    isSamePortForMultiDay: true,
    arrivalPortForMultiDay: '',
    multiDayTripNotes: '',
    transferDestinationPort: '',
    numPeople: 2,
    experience: ExperienceLevel.BEGINNER_NEEDS_SKIPPER,
    boatingLicense: undefined,
    budgetLevel: undefined,
    customBudgetAmount: undefined,
    budgetNotes: '',
    activities: [],
    otherActivities: '',
    boatTransferDetails: {},
  });

  const isPrimaryInputDisabled = cookieConsent !== CookieConsentStatus.ACCEPTED;

  // Determinar si mostrar el paso del barco
  const shouldShowBoatStep = useMemo(() => {
    const result = (
      formData.planningMode === PlanningMode.OWN_BOAT ||
      (formData.planningMode === PlanningMode.RENTAL && 
       (formData.experience === ExperienceLevel.EXPERIENCED_WITH_LICENSE_NO_SKIPPER ||
        formData.experience === ExperienceLevel.EXPERT_ADVANCED_LICENSE))
    );
    console.log('🔍 DEBUG - shouldShowBoatStep:', {
      planningMode: formData.planningMode,
      experience: formData.experience,
      OWN_BOAT: PlanningMode.OWN_BOAT,
      RENTAL: PlanningMode.RENTAL,
      EXPERIENCED: ExperienceLevel.EXPERIENCED_WITH_LICENSE_NO_SKIPPER,
      EXPERT: ExperienceLevel.EXPERT_ADVANCED_LICENSE,
      result
    });
    return result;
  }, [formData.planningMode, formData.experience]);

  // Crear los steps dinámicamente
  const steps = useMemo(() => {
    const baseSteps = [
      { id: 1, name: 'Experiencia' },
      { id: 2, name: 'Ruta' },
      { id: 3, name: 'Tripulación' },
      { id: 4, name: 'Preferencias' },
    ];

    if (shouldShowBoatStep) {
      baseSteps.push({ id: 5, name: 'Barco' });
    }

    baseSteps.push({ id: shouldShowBoatStep ? 6 : 5, name: 'Revisar' });

    console.log('🔍 DEBUG - steps:', {
      shouldShowBoatStep,
      steps: baseSteps.map(s => s.name),
      totalSteps: baseSteps.length
    });

    return baseSteps;
  }, [shouldShowBoatStep]);

  const totalSteps = steps.length;
  
  const updateFormData = (fields: Partial<UserPreferences>) => {
    setFormData(prev => ({ ...prev, ...fields }));
  };
  
  const goToStep = (step: number) => {
    if (step >= 1 && step <= totalSteps) {
      setCurrentStep(step);
    }
  };

  const handleNext = () => {
    // Step validation logic
    if (currentStep === 1) { // Experiencia
       // No mandatory fields here to validate
    } else if (currentStep === 2) { // Ruta
        if (!formData.destination.trim()) {
            alert(formData.desiredExperienceType === DesiredExperienceType.TRANSFER ? "Por favor, introduce el puerto de origen." : "Por favor, introduce el puerto de salida.");
            return;
        }
        if (formData.desiredExperienceType === DesiredExperienceType.MULTI_DAY) {
            if (!formData.numTripDays || formData.numTripDays < 2) {
                alert("Para 'Varios Días', el número de días debe ser al menos 2.");
                return;
            }
            if(!formData.isSamePortForMultiDay && !(formData.arrivalPortForMultiDay?.trim())) {
                alert("Por favor, introduce el puerto de llegada para tu viaje.");
                return;
            }
        }
        if (formData.desiredExperienceType === DesiredExperienceType.TRANSFER && !(formData.transferDestinationPort?.trim())) {
            alert("Por favor, introduce el puerto de destino para el traslado.");
            return;
        }
    } else if (currentStep === 3) { // Tripulación
        if (!formData.numPeople || formData.numPeople <= 0) {
            alert("El número de personas debe ser mayor que 0.");
            return;
        }
        const needsLicense = formData.experience === ExperienceLevel.EXPERIENCED_WITH_LICENSE_NO_SKIPPER || formData.experience === ExperienceLevel.EXPERT_ADVANCED_LICENSE || formData.planningMode === PlanningMode.OWN_BOAT;
        if (needsLicense && !formData.boatingLicense) {
            alert("Por favor, selecciona tu titulación náutica.");
            return;
        }
    } else if (currentStep === 4) { // Preferencias
      if (formData.budgetLevel === 'specific_amount' && (!formData.customBudgetAmount || formData.customBudgetAmount <= 0)) {
        alert("Por favor, introduce un monto de presupuesto válido.");
        return;
      }
    } else if (currentStep === 5 && shouldShowBoatStep) { // Barco
        const details = formData.boatTransferDetails;
        if (formData.planningMode === PlanningMode.OWN_BOAT) {
            // Solo validar si es barco propio (obligatorio)
            if (!details?.model?.trim()) { alert("Por favor, introduce el modelo de tu barco."); return; }
            if (!details?.length?.trim()) { alert("Por favor, introduce la eslora de tu barco."); return; }
            if (!details?.beam?.trim()) { alert("Por favor, introduce la manga de tu barco."); return; }
            if (!details?.draft?.trim()) { alert("Por favor, introduce el calado de tu barco."); return; }
            if (!details?.cruisingSpeed?.trim()) { alert("Por favor, introduce la velocidad de crucero."); return; }
            if (!details?.tankCapacity?.trim()) { alert("Por favor, introduce la capacidad del depósito."); return; }
            if (!details?.averageConsumption?.trim()) { alert("Por favor, introduce el consumo medio."); return; }
        }
        // Si es alquiler, no validar nada (es opcional)
    }

    if (currentStep < totalSteps) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  // Función de validación global para asegurar coherencia
  const validateFormData = (data: UserPreferences): UserPreferences => {
    let validatedData = { ...data };
    
    // Validación de número de días según tipo de experiencia
    if (data.desiredExperienceType === DesiredExperienceType.SUNSET || 
        data.desiredExperienceType === DesiredExperienceType.FULL_DAY ||
        data.desiredExperienceType === DesiredExperienceType.HALF_DAY_MORNING ||
        data.desiredExperienceType === DesiredExperienceType.HALF_DAY_AFTERNOON) {
      validatedData.numTripDays = 1;
    }
    
    // Validación de actividades según tipo de experiencia
    if (data.desiredExperienceType === DesiredExperienceType.TRANSFER) {
      // Para traslados, limpiar actividades recreativas
      validatedData.activities = data.activities.filter(activity => 
        !['Snorkel', 'Buceo (con equipo propio o guía)', 'Buceo con botella (submarinismo)',
          'Paddle Surf (SUP)', 'Kayak o Canoa', 'Deportes Acuáticos (Esquí, Wakeboard, Donut)',
          'Pesca Recreativa', 'Comida o Picnic a Bordo'].includes(activity)
      );
    }
    
    return validatedData;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validatedData = validateFormData(formData);
    onSubmit(validatedData);
  };
  
  const renderStep = () => {
    const stepProps = {
      data: formData,
      updateData: updateFormData,
      isPrimaryInputDisabled: isPrimaryInputDisabled,
      onReconsiderCookies: onReconsiderCookies,
    };

    switch (currentStep) {
      case 1:
        return <Step1Experience {...stepProps} />;
      case 2:
        return <Step2Route {...stepProps} />;
      case 3:
        return <Step3Crew {...stepProps} />;
      case 4:
        return <Step4Preferences {...stepProps} />;
      case 5:
        if (shouldShowBoatStep) {
          return <Step5BoatDetails {...stepProps} />;
        } else {
          return <Step6Review data={formData} goToStep={goToStep} showBoatSpecsStep={shouldShowBoatStep} />;
        }
      case 6:
        if (shouldShowBoatStep) {
          return <Step6Review data={formData} goToStep={goToStep} showBoatSpecsStep={shouldShowBoatStep} />;
        }
        break;
      default:
        return <div>Paso no encontrado</div>;
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-4 sm:p-6 rounded-lg shadow-2xl space-y-6 w-full">
      <ProgressStepper 
        key={`steps-${steps.length}-${formData.planningMode}`}
        steps={steps.map(s => s.name)} 
        currentStep={currentStep} 
      />
      <div className="mt-6 transition-all duration-300">
        {renderStep()}
      </div>

      {currentStep < totalSteps ? (
        <WizardNavigation
          currentStep={currentStep}
          totalSteps={totalSteps}
          onNext={handleNext}
          onBack={handleBack}
          isLoading={isLoading}
        />
      ) : (
        <div className="flex justify-between items-center pt-5 border-t border-slate-200">
          <Button type="button" onClick={handleBack} variant="secondary">
            &larr; Atrás
          </Button>
          <Button type="submit" disabled={isLoading || isPrimaryInputDisabled} className="w-auto animate-subtle-pulse disabled:animate-none">
            {isLoading ? 'Trazando Rumbo...' : 'Obtener Recomendaciones'}
          </Button>
        </div>
      )}
    </form>
  );
};

export default UserInputForm;