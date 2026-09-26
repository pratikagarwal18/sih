// Lead-Time Analysis Page — Advance purchase window analysis

import React from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { PageHeader } from '../components/PageHeader';
import { ChartCard } from '../components/ChartCard';
import { DataTable, type Column } from '../components/DataTable';
import { LoadingSkeleton } from '../components/LoadingSkeleton';
import { ErrorState } from '../components/ErrorState';
import { EmptyState } from '../components/EmptyState';
import { useApi } from '../hooks/useApi';
import { leadTimeService } from '../services/leadTimeService';
import { formatCurrency, formatNumber, formatPercentage } from '../utils/formatters';
import { CHART_COLORS, ADVANCE_PURCHASE_WINDOWS } from '../constants';
import type { LeadTimeAnalysis, LeadTimeObservation } from '../types/leadtime';
import type { ApiResponse } from '../types/common';

const columns: Column<LeadTimeObservation>[] = [
  {
    key: 'label',
    header: 'Lead Time',
    render: (o) => (
      <span className="font-mono text-sm font-semibold text-udaan-cyan">{o.label}</span>
    ),
  },
  {
    key: 'medianFare',
    header: 'Median Fare',
    render: (o) => <span className="font-semibold">{formatCurrency(o.medianFare)}</span>,
  },
  {
    key: 'meanFare',
    header: 'Mean Fare',
    render: (o) => formatCurrency(o.meanFare),
  },
  {
    key: 'minFare',
    header: 'Min',
    render: (o) => formatCurrency(o.minFare),
  },
  {
    key: 'maxFare',
    header: 'Max',
    render: (o) => formatCurrency(o.maxFare),
  },
  {
    key: 'change',
    header: 'Change',
    render: (o) => (
      <span className={o.changeFromPrevious > 0 ? 'text-emerald-400' : o.changeFromPrevious < 0 ? 'text-red-400' : 'text-udaan-text-dim'}>
        {formatPercentage(o.changeFromPrevious)}
      </span>
    ),
  },
  {
    key: 'observationCount',
    header: 'Observations',
    render: (o) => formatNumber(o.observationCount),
  },
];

export const LeadTimePage: React.FC = () => {
  const { data, state, error, refetch } = useApi<ApiResponse<LeadTimeAnalysis>>(
    (signal) => leadTimeService.getAnalysis({}, signal),
    []
  );

  const analysis = data?.data;
  const observations = analysis?.observations || [];

  if (state === 'loading') {
    return (
      <div>
        <PageHeader title="Lead-Time Analysis" subtitle="How observed fares vary with advance purchase window" />
        <LoadingSkeleton variant="chart" />
        <div className="mt-6"><LoadingSkeleton variant="table" count={5} /></div>
      </div>
    );
  }

  if (state === 'error') {
    return (
      <div>
        <PageHeader title="Lead-Time Analysis" subtitle="How observed fares vary with advance purchase window" />
        <ErrorState onRetry={refetch} isNetworkError={error?.code === 'NETWORK_ERROR'} description={error?.message} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Lead-Time Analysis" subtitle="How observed fares vary with advance purchase window" />

      {/* Important distinction */}
      <div className="p-3 rounded-lg bg-udaan-surface border border-udaan-border text-xs text-udaan-text-muted">
        <strong className="text-udaan-text">Important:</strong> This analysis shows how <em>observed</em> fares
        vary across advance purchase windows. This is an observational analysis, not a predictive model.
      </div>

      {/* Lead-Time Curve Chart */}
      <ChartCard
        title="Lead-Time Fare Curve"
        subtitle="Median observed fares across advance purchase windows"
        isEmpty={observations.length === 0}
        emptyMessage="Lead-time fare curve will appear when fare observations across multiple advance purchase windows are available."
      >
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={observations}>
              <CartesianGrid strokeDasharray="3 3" stroke={CHART_COLORS.grid} />
              <XAxis
                dataKey="label"
                tick={{ fill: CHART_COLORS.text, fontSize: 11 }}
                axisLine={{ stroke: CHART_COLORS.grid }}
              />
              <YAxis
                tick={{ fill: CHART_COLORS.text, fontSize: 11 }}
                axisLine={{ stroke: CHART_COLORS.grid }}
              />
              <Tooltip
                contentStyle={{ backgroundColor: '#0f172a', border: '1px solid rgba(51,65,85,0.5)', borderRadius: '8px', fontSize: 12, color: '#e2e8f0' }}
              />
              <Line
                type="monotone"
                dataKey="medianFare"
                stroke={CHART_COLORS.primary}
                strokeWidth={2.5}
                dot={{ r: 5, fill: CHART_COLORS.primary, stroke: '#0f172a', strokeWidth: 2 }}
                name="Median Fare"
              />
              <Line
                type="monotone"
                dataKey="meanFare"
                stroke={CHART_COLORS.secondary}
                strokeWidth={1.5}
                strokeDasharray="5 5"
                dot={false}
                name="Mean Fare"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </ChartCard>

      {/* Observations Table */}
      {observations.length === 0 ? (
        <EmptyState
          title="No lead-time data available"
          description="Lead-time analysis data will appear when fare observations are collected across multiple advance purchase windows (T+1 through T+45)."
        />
      ) : (
        <DataTable
          columns={columns}
          data={observations}
          keyExtractor={(o) => o.label}
        />
      )}

      {/* Advance Purchase Windows Reference */}
      <div className="glass-card p-6">
        <h3 className="text-sm font-semibold text-udaan-text-muted uppercase tracking-wider mb-4">
          Advance Purchase Windows
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {ADVANCE_PURCHASE_WINDOWS.map((w) => (
            <div key={w.label} className="p-3 rounded-lg bg-udaan-surface border border-udaan-border/50">
              <span className="font-mono text-sm font-bold text-udaan-cyan">{w.label}</span>
              <p className="text-xs text-udaan-text-dim mt-1">{w.description}</p>
              <p className="text-xs text-udaan-text-muted mt-0.5">{w.days} days advance</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
