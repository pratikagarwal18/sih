// Data table component — reusable sortable table for data display

import React from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';

export interface Column<T> {
  key: string;
  header: string;
  render: (item: T) => React.ReactNode;
  sortable?: boolean;
  className?: string;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  keyExtractor: (item: T) => string;
  onRowClick?: (item: T) => void;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  onSort?: (key: string) => void;
  emptyMessage?: string;
  className?: string;
}

export function DataTable<T>({
  columns,
  data,
  keyExtractor,
  onRowClick,
  sortBy,
  sortOrder,
  onSort,
  emptyMessage = 'No records available.',
  className = '',
}: DataTableProps<T>) {
  return (
    <div className={`glass-card overflow-hidden ${className}`}>
      <div className="overflow-x-auto">
        <table className="w-full text-sm" role="table">
          <thead>
            <tr className="border-b border-udaan-border">
              {columns.map((col) => (
                <th
                  key={col.key}
                  className={`px-4 py-3 text-left text-xs font-medium text-udaan-text-muted uppercase tracking-wider ${
                    col.sortable ? 'cursor-pointer hover:text-udaan-cyan select-none' : ''
                  } ${col.className || ''}`}
                  onClick={() => col.sortable && onSort?.(col.key)}
                  aria-sort={
                    sortBy === col.key
                      ? sortOrder === 'asc' ? 'ascending' : 'descending'
                      : undefined
                  }
                >
                  <span className="inline-flex items-center gap-1">
                    {col.header}
                    {col.sortable && sortBy === col.key && (
                      sortOrder === 'asc'
                        ? <ChevronUp className="w-3 h-3" />
                        : <ChevronDown className="w-3 h-3" />
                    )}
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-4 py-12 text-center text-udaan-text-dim"
                >
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              data.map((item) => (
                <tr
                  key={keyExtractor(item)}
                  className={`border-b border-udaan-border/30 transition-colors hover:bg-udaan-surface-light/50 ${
                    onRowClick ? 'cursor-pointer' : ''
                  }`}
                  onClick={() => onRowClick?.(item)}
                  tabIndex={onRowClick ? 0 : undefined}
                  onKeyDown={(e) => {
                    if (onRowClick && (e.key === 'Enter' || e.key === ' ')) {
                      e.preventDefault();
                      onRowClick(item);
                    }
                  }}
                >
                  {columns.map((col) => (
                    <td key={col.key} className={`px-4 py-3 text-udaan-text ${col.className || ''}`}>
                      {col.render(item)}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
