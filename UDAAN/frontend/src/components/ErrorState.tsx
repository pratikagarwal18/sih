// Error state component — shown when API calls fail

import React from 'react';
import { AlertTriangle, RefreshCw, WifiOff } from 'lucide-react';

interface ErrorStateProps {
  title?: string;
  description?: string;
  onRetry?: () => void;
  isNetworkError?: boolean;
  className?: string;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title,
  description,
  onRetry,
  isNetworkError = false,
  className = '',
}) => {
  const defaultTitle = isNetworkError
    ? 'Backend connection unavailable'
    : 'Unable to retrieve data';

  const defaultDescription = isNetworkError
    ? 'The UDAAN backend is not responding. Check that the backend service is running and the API URL is correctly configured.'
    : 'An error occurred while fetching data. Please try again.';

  return (
    <div className={`glass-card p-12 flex flex-col items-center justify-center text-center ${className}`}>
      <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-5 ${
        isNetworkError ? 'bg-udaan-red-dim' : 'bg-amber-500/10'
      }`}>
        {isNetworkError
          ? <WifiOff className="w-8 h-8 text-udaan-red" />
          : <AlertTriangle className="w-8 h-8 text-amber-400" />
        }
      </div>
      <h3 className="text-lg font-semibold text-udaan-text mb-2">
        {title || defaultTitle}
      </h3>
      <p className="text-sm text-udaan-text-muted max-w-md mb-6">
        {description || defaultDescription}
      </p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-udaan-cyan/10 text-udaan-cyan border border-udaan-cyan/30 hover:bg-udaan-cyan/20 transition-colors text-sm font-medium"
          aria-label="Retry loading data"
        >
          <RefreshCw className="w-4 h-4" />
          Retry
        </button>
      )}
    </div>
  );
};
