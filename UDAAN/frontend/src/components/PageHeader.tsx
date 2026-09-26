// Page header component — consistent page title area

import React from 'react';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  children?: React.ReactNode;
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  subtitle,
  children,
}) => {
  return (
    <div className="mb-8 animate-fade-in-up">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            {title}
          </h1>
          {subtitle && (
            <p className="text-sm text-udaan-text-muted mt-1">{subtitle}</p>
          )}
        </div>
        {children && <div className="flex items-center gap-3">{children}</div>}
      </div>
      <hr className="runway-separator mt-5" />
    </div>
  );
};
