// Stat card — displays a KPI with value, label, and change indicator

import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { formatPercentage } from '../utils/formatters';

interface StatCardProps {
  label: string;
  value: string | number | null | undefined;
  change?: number | null;
  subtitle?: string;
  icon?: React.ReactNode;
  unit?: string;
  className?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  label,
  value,
  change,
  subtitle,
  icon,
  unit = '',
  className = '',
}) => {
  const hasValue = value !== null && value !== undefined && value !== '';
  const hasChange = change !== null && change !== undefined;

  const getTrendIcon = () => {
    if (!hasChange) return null;
    if (change > 0) return <TrendingUp className="w-3.5 h-3.5" />;
    if (change < 0) return <TrendingDown className="w-3.5 h-3.5" />;
    return <Minus className="w-3.5 h-3.5" />;
  };

  const getTrendColor = () => {
    if (!hasChange) return 'text-udaan-text-dim';
    if (change > 0) return 'text-emerald-400';
    if (change < 0) return 'text-red-400';
    return 'text-udaan-text-dim';
  };

  return (
    <div className={`glass-card glass-card-hover p-5 ${className}`}>
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-medium text-udaan-text-muted uppercase tracking-wider">
          {label}
        </span>
        {icon && (
          <div className="w-8 h-8 rounded-lg bg-udaan-cyan-dim flex items-center justify-center">
            {icon}
          </div>
        )}
      </div>

      <div className="flex items-baseline gap-1.5">
        <span className="text-2xl font-bold text-udaan-text">
          {hasValue ? value : '—'}
        </span>
        {hasValue && unit && (
          <span className="text-sm text-udaan-text-muted">{unit}</span>
        )}
      </div>

      <div className="mt-2 flex items-center gap-1.5">
        {hasChange ? (
          <span className={`inline-flex items-center gap-1 text-xs font-medium ${getTrendColor()}`}>
            {getTrendIcon()}
            {formatPercentage(change)}
          </span>
        ) : (
          <span className="text-xs text-udaan-text-dim">
            {subtitle || (hasValue ? '' : 'Awaiting data')}
          </span>
        )}
      </div>
    </div>
  );
};
