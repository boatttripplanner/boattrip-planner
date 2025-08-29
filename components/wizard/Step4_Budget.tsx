import React, { useState } from 'react';
import { WizardStepProps, BudgetLevel } from '../../types';
import { SelectField, InputField, TextAreaField } from '../FormControls';
import { budgetLevelOptions } from '../../constants';

const formatNumberWithDots = (digits: string): string => {
  if (!digits) return '';
  return digits.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
};

const Step4Budget: React.FC<WizardStepProps> = ({ data, updateData }) => {
  const [displayedCustomBudget, setDisplayedCustomBudget] = useState(
      data.customBudgetAmount ? formatNumberWithDots(data.customBudgetAmount.toString()) : ''
  );
  
  const handleCustomBudgetChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value;
    const digitsOnly = rawValue.replace(/\D/g, ''); 
    
    if (digitsOnly.length <= 10) { 
        setDisplayedCustomBudget(formatNumberWithDots(digitsOnly));
        updateData({ customBudgetAmount: Number(digitsOnly) });
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="text-center">
        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-slate-800 mb-2 sm:mb-3">
          ¿Cuál es tu
          <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-teal-600">
            Presupuesto?
          </span>
        </h2>
        <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed px-2">
          Ayúdanos a adaptar las recomendaciones a tu presupuesto disponible.
        </p>
      </div>

      <div className="space-y-6 rounded-xl bg-gradient-to-br from-blue-50 to-teal-50 p-8 border border-blue-200 shadow-lg">
        <div>
          <SelectField
            label="Nivel de Presupuesto"
            id="budgetLevel"
            value={data.budgetLevel || ''}
            onChange={(e) => updateData({ budgetLevel: e.target.value as BudgetLevel | undefined, customBudgetAmount: undefined })}
            options={budgetLevelOptions}
          />
        </div>
        
        {data.budgetLevel === BudgetLevel.SPECIFIC_AMOUNT && (
          <InputField
            label="Monto del Presupuesto (EUR)"
            id="customBudgetAmount"
            type="text" 
            value={displayedCustomBudget}
            onChange={handleCustomBudgetChange} 
            placeholder="Ej: 500"
            required
            inputMode="numeric" 
          />
        )}
        
        <TextAreaField
          label="Notas Adicionales sobre tu Viaje (Opcional)"
          id="budgetNotes"
          value={data.budgetNotes || ''}
          onChange={(e) => updateData({ budgetNotes: e.target.value })}
          placeholder="Ej: Preferencias alimentarias, celebraciones especiales, restricciones, etc."
          rows={3}
        />
      </div>
    </div>
  );
};

export default Step4Budget;


