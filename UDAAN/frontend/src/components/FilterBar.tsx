// Filter bar component — reusable filter controls

import React, { useState, useCallback, useEffect, useRef } from 'react';
import { Search, X } from 'lucide-react';

interface FilterBarProps {
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  searchPlaceholder?: string;
  children?: React.ReactNode;
  className?: string;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  searchValue = '',
  onSearchChange,
  searchPlaceholder = 'Search...',
  children,
  className = '',
}) => {
  const [localValue, setLocalValue] = useState(searchValue);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setLocalValue(searchValue);
  }, [searchValue]);

  const handleChange = useCallback(
    (value: string) => {
      setLocalValue(value);
      if (debounceRef.current) clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => {
        onSearchChange?.(value);
      }, 300);
    },
    [onSearchChange]
  );

  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, []);

  return (
    <div className={`flex flex-col sm:flex-row gap-3 mb-6 ${className}`}>
      {onSearchChange && (
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-udaan-text-dim" />
          <input
            type="text"
            value={localValue}
            onChange={(e) => handleChange(e.target.value)}
            placeholder={searchPlaceholder}
            className="w-full pl-10 pr-8 py-2 rounded-lg bg-udaan-surface border border-udaan-border text-sm text-udaan-text placeholder:text-udaan-text-dim focus:outline-none focus:border-udaan-cyan/50 transition-colors"
            aria-label={searchPlaceholder}
          />
          {localValue && (
            <button
              onClick={() => handleChange('')}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-udaan-text-dim hover:text-udaan-text"
              aria-label="Clear search"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      )}
      {children && (
        <div className="flex items-center gap-2 flex-wrap">{children}</div>
      )}
    </div>
  );
};
