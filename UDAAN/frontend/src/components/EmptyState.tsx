// Empty state component — shown when API returns no data

import React from 'react';
import { Inbox } from 'lucide-react';

interface EmptyStateProps {
  title?: string;
  description?: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title = 'No data available',
  description = 'Connect the UDAAN data service to begin analysis.',
  icon,
  action,
  className = '',
}) => {
  return (
    <div className={`glass-card p-12 flex flex-col items-center justify-center text-center ${className}`}>
      <div className="w-16 h-16 rounded-full bg-udaan-cyan-dim flex items-center justify-center mb-5">
        {icon || <Inbox className="w-8 h-8 text-udaan-cyan" />}
      </div>
      <h3 className="text-lg font-semibold text-udaan-text mb-2">{title}</h3>
      <p className="text-sm text-udaan-text-muted max-w-md mb-6">{description}</p>
      {action && <div>{action}</div>}
    </div>
  );
};
