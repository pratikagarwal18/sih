// Loading skeleton component for data-pending states

import React from 'react';

interface LoadingSkeletonProps {
  variant?: 'card' | 'chart' | 'table' | 'text' | 'stat';
  count?: number;
  className?: string;
}

export const LoadingSkeleton: React.FC<LoadingSkeletonProps> = ({
  variant = 'card',
  count = 1,
  className = '',
}) => {
  const items = Array.from({ length: count });

  if (variant === 'stat') {
    return (
      <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 ${className}`}>
        {items.map((_, i) => (
          <div key={i} className="glass-card p-5">
            <div className="skeleton h-3 w-24 mb-3" />
            <div className="skeleton h-8 w-20 mb-2" />
            <div className="skeleton h-3 w-16" />
          </div>
        ))}
      </div>
    );
  }

  if (variant === 'chart') {
    return (
      <div className={`glass-card p-6 ${className}`}>
        <div className="skeleton h-4 w-48 mb-6" />
        <div className="flex items-end gap-1 h-48">
          {Array.from({ length: 24 }).map((_, i) => (
            <div
              key={i}
              className="skeleton flex-1"
              style={{ height: `${20 + Math.random() * 80}%` }}
            />
          ))}
        </div>
        <div className="skeleton h-3 w-full mt-4" />
      </div>
    );
  }

  if (variant === 'table') {
    return (
      <div className={`glass-card overflow-hidden ${className}`}>
        <div className="p-4 border-b border-udaan-border">
          <div className="skeleton h-4 w-32" />
        </div>
        {items.map((_, i) => (
          <div key={i} className="p-4 border-b border-udaan-border/50 flex gap-4">
            <div className="skeleton h-4 w-20" />
            <div className="skeleton h-4 w-16" />
            <div className="skeleton h-4 flex-1" />
            <div className="skeleton h-4 w-24" />
            <div className="skeleton h-4 w-16" />
          </div>
        ))}
      </div>
    );
  }

  if (variant === 'text') {
    return (
      <div className={className}>
        {items.map((_, i) => (
          <div key={i} className="skeleton h-4 mb-2" style={{ width: `${60 + Math.random() * 40}%` }} />
        ))}
      </div>
    );
  }

  // Default: card skeleton
  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 ${className}`}>
      {items.map((_, i) => (
        <div key={i} className="glass-card p-5">
          <div className="skeleton h-4 w-3/4 mb-4" />
          <div className="skeleton h-3 w-1/2 mb-3" />
          <div className="skeleton h-3 w-2/3" />
        </div>
      ))}
    </div>
  );
};
