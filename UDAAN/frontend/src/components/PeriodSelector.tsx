// Period selector — toggle between Daily/Weekly/Monthly views

import React from 'react';
import { PERIOD_OPTIONS } from '../constants';

interface PeriodSelectorProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export const PeriodSelector: React.FC<PeriodSelectorProps> = ({
  value,
  onChange,
  className = '',
}) => {
  return (
    <div
      className={`inline-flex rounded-lg border border-udaan-border bg-udaan-surface p-0.5 ${className}`}
      role="radiogroup"
      aria-label="Select period"
    >
      {PERIOD_OPTIONS.map((option) => (
        <button
          key={option.value}
          onClick={() => onChange(option.value)}
          className={`px-3.5 py-1.5 rounded-md text-xs font-medium transition-all ${
            value === option.value
              ? 'bg-udaan-cyan/15 text-udaan-cyan border border-udaan-cyan/30'
              : 'text-udaan-text-muted hover:text-udaan-text border border-transparent'
          }`}
          role="radio"
          aria-checked={value === option.value}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
};
