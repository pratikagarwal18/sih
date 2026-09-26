// Status badge component — displays colored status indicators

import React from 'react';

type BadgeVariant = 'connected' | 'degraded' | 'unavailable' | 'not_configured' | 'positive' | 'negative' | 'neutral' | 'info';

interface StatusBadgeProps {
  status: BadgeVariant;
  label?: string;
  showDot?: boolean;
  className?: string;
}

const variantStyles: Record<BadgeVariant, { bg: string; text: string; dot: string }> = {
  connected: { bg: 'bg-emerald-500/10', text: 'text-emerald-400', dot: 'bg-emerald-400' },
  positive: { bg: 'bg-emerald-500/10', text: 'text-emerald-400', dot: 'bg-emerald-400' },
  degraded: { bg: 'bg-amber-500/10', text: 'text-amber-400', dot: 'bg-amber-400' },
  unavailable: { bg: 'bg-red-500/10', text: 'text-red-400', dot: 'bg-red-400' },
  negative: { bg: 'bg-red-500/10', text: 'text-red-400', dot: 'bg-red-400' },
  not_configured: { bg: 'bg-slate-500/10', text: 'text-slate-400', dot: 'bg-slate-400' },
  neutral: { bg: 'bg-slate-500/10', text: 'text-slate-400', dot: 'bg-slate-400' },
  info: { bg: 'bg-cyan-500/10', text: 'text-cyan-400', dot: 'bg-cyan-400' },
};

const defaultLabels: Record<BadgeVariant, string> = {
  connected: 'Connected',
  positive: 'Active',
  degraded: 'Degraded',
  unavailable: 'Unavailable',
  negative: 'Error',
  not_configured: 'Not Configured',
  neutral: 'Unknown',
  info: 'Info',
};

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  label,
  showDot = true,
  className = '',
}) => {
  const style = variantStyles[status] || variantStyles.neutral;
  const displayLabel = label || defaultLabels[status] || status;

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${style.bg} ${style.text} ${className}`}
      role="status"
      aria-label={displayLabel}
    >
      {showDot && (
        <span className={`w-1.5 h-1.5 rounded-full ${style.dot}`} aria-hidden="true" />
      )}
      {displayLabel}
    </span>
  );
};
