// Validation Page — Index validation against benchmarks

import React from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend,
} from 'recharts';
import { PageHeader } from '../components/PageHeader';
import { StatCard } from '../components/StatCard';
import { ChartCard } from '../components/ChartCard';
import { DataTable, type Column } from '../components/DataTable';
import { LoadingSkeleton } from '../components/LoadingSkeleton';
import { ErrorState } from '../components/ErrorState';
import { EmptyState } from '../components/EmptyState';
import { useApi } from '../hooks/useApi';
import { validationService } from '../services/validationService';
import { formatIndex, formatPercentage, formatNumber } from '../utils/formatters';
import { CHART_COLORS } from '../constants';
import type { ValidationSummary, ValidationResult } from '../types/validation';
import type { ApiResponse } from '../types/common';

const columns: Column<ValidationResult>[] = [
  {
    key: 'period',
    header: 'Period',
    render: (r) => <span className="font-mono text-xs">{r.period}</span>,
  },
  {
    key: 'udaanIndex',
    header: 'UDAAN APIx',
    render: (r) => <span className="font-semibold text-udaan-cyan">{formatIndex(r.udaanIndex)}</span>,
  },
  {
    key: 'benchmarkIndex',
    header: 'Benchmark',
    render: (r) => <span className="font-semibold">{formatIndex(r.benchmarkIndex)}</span>,
  },
  {
    key: 'deviation',
    header: 'Deviation',
    render: (r) => (
      <span className={Math.abs(r.deviation) > 5 ? 'text-amber-400' : 'text-emerald-400'}>
        {formatPercentage(r.deviation)}
      </span>
    ),
  },
  {
    key: 'observations',
    header: 'Observations',
    render: (r) => formatNumber(r.observations),
  },
  {
    key: 'coverage',
    header: 'Coverage',
    render: (r) => formatPercentage(r.coverage, { showSign: false }),
  },
];

export const ValidationPage: React.FC = () => {
  const { data, state, error, refetch } = useApi<ApiResponse<ValidationSummary>>(
    (signal) => validationService.getValidation({}, signal),
    []
  );

  const validation = data?.data;
  const results = validation?.results || [];

  if (state === 'loading') {
    return (
      <div>
        <PageHeader title="Validation" subtitle="Index validation against benchmark datasets" />
        <LoadingSkeleton variant="stat" count={4} />
        <div className="mt-6"><LoadingSkeleton variant="chart" /></div>
      </div>
    );
  }

  if (state === 'error') {
    return (
      <div>
        <PageHeader title="Validation" subtitle="Index validation against benchmark datasets" />
        <ErrorState onRetry={refetch} isNetworkError={error?.code === 'NETWORK_ERROR'} description={error?.message} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Validation" subtitle="Index validation against benchmark datasets" />

      {/* Validation KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Average Deviation"
          value={validation ? formatPercentage(validation.averageDeviation) : null}
        />
        <StatCard
          label="Max Deviation"
          value={validation ? formatPercentage(validation.maxDeviation) : null}
        />
        <StatCard
          label="Total Periods"
          value={validation ? formatNumber(validation.totalPeriods) : null}
        />
        <StatCard
          label="Backtest Period"
          value={validation?.backtestPeriod || null}
          subtitle={validation ? undefined : 'Awaiting validation data'}
        />
      </div>

      {/* UDAAN vs Benchmark Chart */}
      <ChartCard
        title="UDAAN APIx vs Benchmark"
        subtitle="30-day backtest comparison"
        isEmpty={results.length === 0}
        emptyMessage="Validation dataset not available. Comparison chart will appear when both UDAAN index and benchmark data are available."
      >
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={results}>
              <CartesianGrid strokeDasharray="3 3" stroke={CHART_COLORS.grid} />
              <XAxis dataKey="period" tick={{ fill: CHART_COLORS.text, fontSize: 11 }} axisLine={{ stroke: CHART_COLORS.grid }} />
              <YAxis tick={{ fill: CHART_COLORS.text, fontSize: 11 }} axisLine={{ stroke: CHART_COLORS.grid }} domain={['auto', 'auto']} />
              <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: '1px solid rgba(51,65,85,0.5)', borderRadius: '8px', fontSize: 12, color: '#e2e8f0' }} />
              <Legend wrapperStyle={{ fontSize: 12, color: '#94a3b8' }} />
              <Line type="monotone" dataKey="udaanIndex" stroke={CHART_COLORS.primary} strokeWidth={2} dot={false} name="UDAAN APIx" />
              <Line type="monotone" dataKey="benchmarkIndex" stroke={CHART_COLORS.accent} strokeWidth={2} dot={false} name="Benchmark" strokeDasharray="5 5" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </ChartCard>

      {/* Validation Results Table */}
      {results.length === 0 ? (
        <EmptyState
          title="Validation dataset not available"
          description="Validation results will appear when the UDAAN index has been computed and benchmark comparison data is provided by the backend."
        />
      ) : (
        <div>
          <h2 className="text-sm font-semibold text-udaan-text-muted uppercase tracking-wider mb-4">
            30-Day Backtest Results
          </h2>
          <DataTable
            columns={columns}
            data={results}
            keyExtractor={(r) => r.period}
          />
        </div>
      )}
    </div>
  );
};
