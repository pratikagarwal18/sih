// Chart card wrapper — consistent container for Recharts visualizations

import React from 'react';

interface ChartCardProps {
  title: string;
  subtitle?: string;
  controls?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  isEmpty?: boolean;
  emptyMessage?: string;
}

export const ChartCard: React.FC<ChartCardProps> = ({
  title,
  subtitle,
  controls,
  children,
  className = '',
  isEmpty = false,
  emptyMessage = 'Chart data will appear when observations are available.',
}) => {
  return (
    <div className={`glass-card p-6 ${className}`}>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
        <div>
          <h3 className="text-sm font-semibold text-udaan-text uppercase tracking-wider">
            {title}
          </h3>
          {subtitle && (
            <p className="text-xs text-udaan-text-muted mt-0.5">{subtitle}</p>
          )}
        </div>
        {controls && <div className="flex items-center gap-2">{controls}</div>}
      </div>

      {isEmpty ? (
        <div className="h-64 flex items-center justify-center">
          <p className="text-sm text-udaan-text-dim text-center max-w-xs">
            {emptyMessage}
          </p>
        </div>
      ) : (
        children
      )}
    </div>
  );
};
