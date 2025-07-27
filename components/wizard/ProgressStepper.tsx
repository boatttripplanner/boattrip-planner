
import React from 'react';
import { CheckIcon } from '../icons/CheckIcon';

interface ProgressStepperProps {
  steps: string[];
  currentStep: number;
}

const ProgressStepper: React.FC<ProgressStepperProps> = ({ steps, currentStep }) => {
  return (
    <nav aria-label="Progreso del formulario">
      <ol className="flex items-center justify-around space-x-2">
        {steps.map((step, index) => {
          const stepNumber = index + 1;
          const isCompleted = currentStep > stepNumber;
          const isCurrent = currentStep === stepNumber;

          return (
            <li key={step} className="flex-1">
              <div
                className={`group flex flex-col items-center w-full ${isCompleted ? 'cursor-pointer' : ''}`}
              >
                <div className="flex items-center justify-center w-full">
                   <div className={`flex-1 border-t-2 transition-colors duration-300 ${isCompleted || isCurrent ? 'border-teal-600' : 'border-slate-300'}`}></div>
                    <span
                        className={`flex h-10 w-10 items-center justify-center rounded-full text-lg font-semibold transition-colors duration-300
                        ${isCurrent ? 'bg-teal-600 text-white ring-4 ring-teal-200' : ''}
                        ${isCompleted ? 'bg-teal-600 text-white' : ''}
                        ${!isCurrent && !isCompleted ? 'bg-slate-300 text-slate-600 group-hover:bg-slate-400' : ''}`}
                    >
                        {isCompleted ? <CheckIcon className="w-6 h-6" /> : stepNumber}
                    </span>
                   <div className={`flex-1 border-t-2 transition-colors duration-300 ${isCompleted ? 'border-teal-600' : 'border-slate-300'}`}></div>
                </div>
                <p
                  className={`mt-2 text-xs sm:text-sm font-medium text-center transition-colors duration-300 hidden sm:block
                    ${isCurrent ? 'text-teal-700' : 'text-slate-500'}
                    ${isCompleted ? 'text-slate-700' : ''}`}
                >
                  {step}
                </p>
              </div>
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default ProgressStepper;