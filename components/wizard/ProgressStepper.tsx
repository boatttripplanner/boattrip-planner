
import React from 'react';
import { CheckIcon } from '../icons/CheckIcon';

interface Step {
  id: number;
  name: string;
}

interface ProgressStepperProps {
  steps: Step[];
  currentStep: number;
  onStepClick?: (step: number) => void;
}

const ProgressStepper: React.FC<ProgressStepperProps> = ({ 
  steps, 
  currentStep, 
  onStepClick 
}) => {
  return (
    <div className="w-full">
      <div className="flex items-center justify-between relative">
        {/* Progress Line */}
        <div className="absolute top-1/2 left-0 right-0 h-1 bg-slate-200 -translate-y-1/2 z-0"></div>
        <div 
          className="absolute top-1/2 left-0 h-1 bg-gradient-to-r from-ocean-500 to-sea-500 -translate-y-1/2 z-0 transition-all duration-500 ease-out"
          style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
        ></div>

        {/* Steps */}
        {steps.map((step, index) => {
          const isCompleted = index + 1 < currentStep;
          const isCurrent = index + 1 === currentStep;
          const isClickable = onStepClick && (isCompleted || isCurrent);

          return (
            <div key={step.id} className="relative z-10 flex flex-col items-center">
              {/* Step Circle */}
              <button
                onClick={() => isClickable && onStepClick(index + 1)}
                disabled={!isClickable}
                className={`
                  w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center transition-all duration-300
                  ${isCompleted 
                    ? 'bg-gradient-to-r from-ocean-500 to-sea-500 shadow-medium hover:shadow-glow cursor-pointer' 
                    : isCurrent 
                    ? 'bg-gradient-to-r from-ocean-400 to-sea-400 shadow-strong animate-pulse-slow cursor-pointer' 
                    : 'bg-white border-2 border-slate-300 shadow-soft'
                  }
                  ${isClickable ? 'hover:scale-110' : ''}
                `}
              >
                {isCompleted ? (
                  <CheckIcon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                ) : (
                  <span className={`text-xs sm:text-sm font-semibold ${isCurrent ? 'text-white' : 'text-slate-500'}`}>
                    {step.id}
                  </span>
                )}
              </button>

              {/* Step Label */}
              <div className="mt-2 sm:mt-3 text-center max-w-20 sm:max-w-24">
                <span className={`
                  text-xs font-medium transition-colors duration-300
                  ${isCompleted 
                    ? 'text-ocean-600' 
                    : isCurrent 
                    ? 'text-ocean-600 font-semibold' 
                    : 'text-slate-500'
                  }
                `}>
                  {step.name}
                </span>
              </div>

              {/* Current Step Indicator */}
              {isCurrent && (
                <div className="absolute -top-1 -right-1 w-3 h-3 sm:w-4 sm:h-4 bg-sunset-500 rounded-full animate-bounce-slow">
                  <div className="w-full h-full bg-sunset-500 rounded-full animate-ping"></div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Progress Text */}
      <div className="mt-4 sm:mt-6 text-center">
        <p className="text-xs sm:text-sm text-slate-600">
          Paso {currentStep} de {steps.length}
        </p>
        <div className="mt-2 w-full bg-slate-200 rounded-full h-1.5 sm:h-2">
          <div 
            className="bg-gradient-to-r from-ocean-500 to-sea-500 h-1.5 sm:h-2 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${(currentStep / steps.length) * 100}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default ProgressStepper;