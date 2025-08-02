
import React from 'react';
import { Button } from '../Button';

interface WizardNavigationProps {
  currentStep: number;
  totalSteps: number;
  onBack: () => void;
  onNext: () => void;
  onFinish: (e: React.FormEvent) => void;
  isLoading: boolean;
  isPrimaryInputDisabled?: boolean;
}

const WizardNavigation: React.FC<WizardNavigationProps> = ({
  currentStep,
  totalSteps,
  onBack,
  onNext,
  onFinish,
  isLoading,
  isPrimaryInputDisabled = false
}) => {
  const isFirstStep = currentStep === 1;
  const isLastStep = currentStep === totalSteps;

  return (
    <div className="flex flex-col sm:flex-row justify-between items-center gap-4 sm:gap-0">
      {/* Back Button */}
      <div className="flex-1 w-full sm:w-auto">
        {!isFirstStep && (
          <Button
            type="button"
            onClick={onBack}
            variant="secondary"
            className="w-full sm:w-auto px-4 sm:px-6 py-2.5 sm:py-3 bg-white hover:bg-slate-50 border border-slate-300 hover:border-slate-400 text-slate-700 hover:text-slate-800 transition-all duration-200 rounded-xl font-medium"
          >
            <span className="flex items-center gap-2">
              <span>←</span>
              Atrás
            </span>
          </Button>
        )}
      </div>

      {/* Progress Indicator */}
      <div className="flex-1 text-center order-first sm:order-none">
        <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-white/80 backdrop-blur-sm rounded-full border border-slate-200">
          <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-ocean-500 rounded-full animate-pulse"></div>
          <span className="text-xs sm:text-sm font-medium text-slate-600">
            Paso {currentStep} de {totalSteps}
          </span>
        </div>
      </div>

      {/* Next/Finish Button */}
      <div className="flex-1 flex justify-end w-full sm:w-auto">
        {isLastStep ? (
          <Button
            type="submit"
            onClick={onFinish}
            disabled={isLoading || isPrimaryInputDisabled}
            className="w-full sm:w-auto px-6 sm:px-8 py-2.5 sm:py-3 bg-gradient-to-r from-ocean-500 to-sea-500 hover:from-ocean-600 hover:to-sea-600 disabled:from-slate-400 disabled:to-slate-500 text-white font-semibold rounded-xl shadow-medium hover:shadow-glow transition-all duration-300 transform hover:-translate-y-0.5 disabled:transform-none"
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span className="text-sm sm:text-base">Generando...</span>
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <span className="text-sm sm:text-base">Obtener Recomendaciones</span>
                <span>⚡</span>
              </span>
            )}
          </Button>
        ) : (
          <Button
            type="button"
            onClick={onNext}
            className="w-full sm:w-auto px-4 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-ocean-500 to-sea-500 hover:from-ocean-600 hover:to-sea-600 text-white font-semibold rounded-xl shadow-medium hover:shadow-glow transition-all duration-300 transform hover:-translate-y-0.5"
          >
            <span className="flex items-center gap-2">
              <span className="text-sm sm:text-base">Siguiente</span>
              <span>→</span>
            </span>
          </Button>
        )}
      </div>
    </div>
  );
};

export default WizardNavigation;
