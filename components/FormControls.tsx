import React from 'react';

interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  id: string;
}

export const InputField: React.FC<InputFieldProps> = ({ label, id, ...props }) => (
  <div>
    <label htmlFor={id} className="block text-sm font-medium text-slate-700 mb-1">
      {label} {props.required && <span className="text-red-500">*</span>}
    </label>
    <input
      id={id}
      className="mt-1 block w-full px-3 py-2.5 sm:py-2 bg-white border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500 text-base text-slate-900 disabled:bg-slate-50 disabled:text-slate-500 disabled:border-slate-200 disabled:shadow-none placeholder:text-slate-500"
      aria-required={props.required}
      {...props}
    />
  </div>
);

interface TextAreaFieldProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  id: string;
}

export const TextAreaField: React.FC<TextAreaFieldProps> = ({ label, id, ...props }) => (
  <div>
    <label htmlFor={id} className="block text-sm font-medium text-slate-700 mb-1">
      {label} {props.required && <span className="text-red-500">*</span>}
    </label>
    <textarea
      id={id}
      className="mt-1 block w-full px-3 py-2.5 sm:py-2 bg-white border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500 text-base text-slate-900 placeholder:text-slate-500 disabled:bg-slate-50 disabled:text-slate-500"
      aria-required={props.required}
      {...props}
    />
  </div>
);


interface SelectFieldProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'value' | 'onChange'> {
  label: string;
  id: string;
  options: { value: string; label: string }[];
  value: string; // HTML select element value is always a string
  onChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
}

export const SelectField: React.FC<SelectFieldProps> = ({ label, id, options, value, onChange, ...rest }) => (
  <div>
    <label htmlFor={id} className="block text-sm font-medium text-slate-700 mb-1">
      {label} {rest.required && <span className="text-red-500">*</span>}
    </label>
    <select
      id={id}
      value={value}
      onChange={onChange}
      className="mt-1 block w-full pl-3 py-2.5 sm:py-2 text-base border-slate-300 focus:outline-none focus:ring-teal-500 focus:border-teal-500 text-base rounded-md shadow-sm bg-white text-slate-900 disabled:bg-slate-50 disabled:text-slate-500"
      aria-required={rest.required}
      {...rest}
    >
      {options.map(option => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  </div>
);

interface CheckboxGroupProps {
  label: string;
  options: string[];
  selectedOptions: string[];
  onChange: (option: string) => void;
  disabled?: boolean;
}

export const CheckboxGroup: React.FC<CheckboxGroupProps> = ({ label, options, selectedOptions, onChange, disabled }) => {
  console.log('🔍 DEBUG - CheckboxGroup render:', { label, options, selectedOptions, disabled });
  
  return (
    <fieldset className={disabled ? 'opacity-70' : ''}>
      <legend className="block text-sm font-medium text-slate-700 mb-1">{label}</legend>
      <div className="mt-2 space-y-2 grid grid-cols-1 sm:grid-cols-2 gap-x-4 max-h-48 overflow-y-auto p-1 border rounded-md border-slate-200 custom-scrollbar">
        {options.map(option => (
          <div key={option} className="flex items-center">
            <div className="relative">
              <input
                id={option.replace(/\s+/g, '-')}
                name={option.replace(/\s+/g, '-')}
                type="checkbox"
                checked={selectedOptions.includes(option)}
                onChange={() => {
                  console.log('🔍 DEBUG - Checkbox clicked:', { option, selectedOptions });
                  onChange(option);
                }}
                className="sr-only"
                disabled={disabled}
              />
              <div 
                onClick={() => {
                  if (!disabled) {
                    console.log('🔍 DEBUG - Checkbox div clicked:', { option, selectedOptions });
                    onChange(option);
                  }
                }}
                className={`
                  w-5 h-5 border-2 rounded flex items-center justify-center cursor-pointer transition-all duration-200
                  ${selectedOptions.includes(option)
                    ? 'border-green-500 bg-green-500 text-white'
                    : 'border-slate-300 bg-white hover:border-green-300'
                  }
                  ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
                `}
              >
                {selectedOptions.includes(option) && (
                  <span className="text-white text-xs font-bold">✓</span>
                )}
              </div>
            </div>
            <label 
              htmlFor={option.replace(/\s+/g, '-')} 
              className={`ml-3 block text-sm text-slate-800 cursor-pointer select-none ${disabled ? 'text-slate-500' : 'hover:text-slate-900'}`}
            >
              {option}
            </label>
          </div>
        ))}
      </div>
    </fieldset>
  );
};

interface DateFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  id: string;
}

export const DateField: React.FC<DateFieldProps> = ({ label, id, ...props }) => (
  <div>
    <label htmlFor={id} className="block text-sm font-medium text-slate-700 mb-1">
      {label} {props.required && <span className="text-red-500">*</span>}
    </label>
    <input
      id={id}
      type="date"
      className="mt-1 block w-full px-3 py-2.5 sm:py-2 bg-white border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500 text-base text-slate-900 placeholder:text-slate-500 disabled:bg-slate-50 disabled:text-slate-500"
      aria-required={props.required}
      {...props}
    />
  </div>
);

interface RadioGroupProps {
  label: string;
  name: string;
  options: { value: string; label: string }[];
  selectedValue: string;
  onChange: (value: string) => void;
  required?: boolean;
  disabled?: boolean;
}

export const RadioGroup: React.FC<RadioGroupProps> = ({ label, name, options, selectedValue, onChange, required, disabled }) => {
  console.log('🔍 DEBUG - RadioGroup render:', { label, name, selectedValue, options });
  
  return (
    <fieldset className={`space-y-2 ${disabled ? 'opacity-70' : ''}`}>
      <legend className="block text-sm font-medium text-slate-700 mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </legend>
      <div className="space-y-2">
        {options.map(option => (
          <button
            key={option.value}
            type="button"
            onClick={() => {
              console.log('🔍 DEBUG - Radio button clicked:', {
                value: option.value,
                currentSelected: selectedValue,
                name
              });
              if (!disabled) {
                onChange(option.value);
              }
            }}
            disabled={disabled}
            className={`
              block w-full p-3 sm:p-3 border-2 rounded-lg text-left transition-all duration-200
              ${selectedValue === option.value 
                ? 'border-teal-500 bg-teal-50 text-teal-700 shadow-sm' 
                : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50'
              }
              ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
            `}
          >
            <div className="flex items-center">
              <div className={`
                w-4 h-4 rounded-full border-2 flex items-center justify-center mr-3
                ${selectedValue === option.value 
                  ? 'border-teal-500 bg-teal-500' 
                  : 'border-slate-300 bg-white'
                }
              `}>
                {selectedValue === option.value && (
                  <div className="w-2 h-2 rounded-full bg-white"></div>
                )}
              </div>
              <span className="text-sm font-medium">{option.label}</span>
            </div>
          </button>
        ))}
      </div>
    </fieldset>
  );
};