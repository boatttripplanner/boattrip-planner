
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
import { scrollToTop } from '../utils/scrollUtils';

const UserInputForm: React.FC<UserInputFormProps> = ({ onSubmit, isLoading, cookieConsent, onReconsiderCookies, showAppInstallBanner = false }) => {
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
    // Para OWN_BOAT siempre mostrar (tiene su propio barco)
    if (formData.planningMode === PlanningMode.OWN_BOAT) {
      console.log('🔍 DEBUG - shouldShowBoatStep: OWN_BOAT = true');
      return true;
    }
    
    // Para RENTAL solo mostrar si tiene experiencia suficiente (no necesita patrón)
    if (formData.planningMode === PlanningMode.RENTAL) {
      const hasEnoughExperience = formData.experience === ExperienceLevel.EXPERIENCED_WITH_LICENSE_NO_SKIPPER || 
                                 formData.experience === ExperienceLevel.EXPERT_ADVANCED_LICENSE;
      console.log('🔍 DEBUG - shouldShowBoatStep:', {
        planningMode: formData.planningMode,
        experience: formData.experience,
        hasEnoughExperience,
        EXPERIENCED_WITH_LICENSE_NO_SKIPPER: ExperienceLevel.EXPERIENCED_WITH_LICENSE_NO_SKIPPER,
        EXPERT_ADVANCED_LICENSE: ExperienceLevel.EXPERT_ADVANCED_LICENSE
      });
      return hasEnoughExperience;
    }
    
    console.log('🔍 DEBUG - shouldShowBoatStep: false (no conditions met)');
    return false;
  }, [formData.planningMode, formData.desiredExperienceType, formData.experience]);

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
      // Scroll hacia arriba para una mejor experiencia de usuario
      scrollToTop();
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
        const needsLicense = formData.experience === ExperienceLevel.EXPERIENCED_WITH_LICENSE_NO_SKIPPER || formData.experience === ExperienceLevel.EXPERT_ADVANCED_LICENSE;
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
            // Para OWN_BOAT siempre obligatorio
            if (!details?.model?.trim()) { alert("Por favor, introduce el modelo de tu barco."); return; }
            if (!details?.length?.trim()) { alert("Por favor, introduce la eslora de tu barco."); return; }
            if (!details?.beam?.trim()) { alert("Por favor, introduce la manga de tu barco."); return; }
            if (!details?.draft?.trim()) { alert("Por favor, introduce el calado de tu barco."); return; }
            if (!details?.cruisingSpeed?.trim()) { alert("Por favor, introduce la velocidad de crucero."); return; }
            if (!details?.tankCapacity?.trim()) { alert("Por favor, introduce la capacidad del depósito."); return; }
            if (!details?.averageConsumption?.trim()) { alert("Por favor, introduce el consumo medio."); return; }
        } else if (formData.planningMode === PlanningMode.RENTAL && formData.desiredExperienceType === DesiredExperienceType.TRANSFER) {
            // Para RENTAL + TRANSFER también obligatorio
            if (!details?.model?.trim()) { alert("Por favor, introduce el modelo de tu barco."); return; }
            if (!details?.length?.trim()) { alert("Por favor, introduce la eslora de tu barco."); return; }
            if (!details?.beam?.trim()) { alert("Por favor, introduce la manga de tu barco."); return; }
            if (!details?.draft?.trim()) { alert("Por favor, introduce el calado de tu barco."); return; }
            if (!details?.cruisingSpeed?.trim()) { alert("Por favor, introduce la velocidad de crucero."); return; }
            if (!details?.tankCapacity?.trim()) { alert("Por favor, introduce la capacidad del depósito."); return; }
            if (!details?.averageConsumption?.trim()) { alert("Por favor, introduce el consumo medio."); return; }
        }
        // Si es RENTAL sin TRANSFER, no validar nada (es opcional)
    }

    if (currentStep < totalSteps) {
      setCurrentStep(prev => prev + 1);
      // Scroll hacia arriba para una mejor experiencia de usuario
      scrollToTop();
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
      // Scroll hacia arriba para una mejor experiencia de usuario
      scrollToTop();
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
    <div className={`w-full max-w-4xl mx-auto transition-all duration-300 ease-out ${showAppInstallBanner ? 'pt-20 sm:pt-24 md:pt-28' : ''}`}>
      {/* Enhanced Header */}
      <div className={`text-center mb-6 sm:mb-8 animate-fade-in ${showAppInstallBanner ? 'pt-4 sm:pt-6' : ''}`}>
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-800 mb-3 sm:mb-4">
          Planifica tu{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-ocean-600 to-sea-600 animate-pulse">
            Aventura Náutica
          </span>
        </h1>
        <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto px-2">
          Completa los siguientes pasos para generar tu itinerario personalizado
        </p>
        
        {/* Indicador visual de que el wizard está listo */}
        <div className="mt-4 flex justify-center">
          <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-ocean-100 to-sea-100 text-ocean-700 border border-ocean-200 animate-bounce">
            ✨ ¡Comienza aquí tu planificación!
          </div>
        </div>
      </div>

      {/* Enhanced Progress Stepper */}
      <div className="mb-6 sm:mb-8 animate-slide-up">
        <ProgressStepper 
          steps={steps} 
          currentStep={currentStep} 
          onStepClick={goToStep}
        />
      </div>

      {/* Enhanced Form Container */}
      <div className="bg-white rounded-xl sm:rounded-2xl shadow-soft border border-slate-200 overflow-hidden animate-fade-in">
        {/* Form Content */}
        <div className="p-4 sm:p-6 md:p-8">
          {renderStep()}
        </div>

        {/* Enhanced Navigation */}
        <div className="bg-gradient-to-r from-slate-50 to-ocean-50 px-4 sm:px-6 md:px-8 py-4 sm:py-6 border-t border-slate-200">
          <WizardNavigation
            currentStep={currentStep}
            totalSteps={totalSteps}
            onBack={handleBack}
            onNext={handleNext}
            onFinish={handleSubmit}
            isLoading={isLoading}
            isPrimaryInputDisabled={isPrimaryInputDisabled}
          />
        </div>
      </div>


    </div>
  );
};

export default UserInputForm;