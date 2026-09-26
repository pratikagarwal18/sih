// Airfare Index Page — Deep analysis of APIx

import React, { useState } from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, BarChart, Bar,
} from 'recharts';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { PageHeader } from '../components/PageHeader';
import { StatCard } from '../components/StatCard';
import { ChartCard } from '../components/ChartCard';
import { PeriodSelector } from '../components/PeriodSelector';
import { LoadingSkeleton } from '../components/LoadingSkeleton';
import { ErrorState } from '../components/ErrorState';
import { useApi } from '../hooks/useApi';
import { indexService } from '../services/indexService';
import { formatIndex, formatPercentage } from '../utils/formatters';
import { CHART_COLORS } from '../constants';
import type { AirfareIndex, IndexTimeSeries, IndexContribution } from '../types/index';
import type { ApiResponse } from '../types/common';

export const AirfareIndexPage: React.FC = () => {
  const [period, setPeriod] = useState('daily');
  const [methodologyOpen, setMethodologyOpen] = useState(false);

  const { data: indexData, state: indexState, error: indexError, refetch: refetchIndex } =
    useApi<ApiResponse<AirfareIndex>>(
      (signal) => indexService.getAirfareIndex({ period: period as 'daily' | 'weekly' | 'monthly' }, signal),
      [period]
    );

  const { data: tsData, state: tsState } = useApi<ApiResponse<IndexTimeSeries>>(
    (signal) => indexService.getTimeSeries({ period: period as 'daily' | 'weekly' | 'monthly' }, signal),
    [period]
  );

  const { data: contribData } = useApi<ApiResponse<IndexContribution>>(
    (signal) => indexService.getContributions(signal),
    []
  );

  const idx = indexData?.data;
  const timeSeries = tsData?.data;
  const contributions = contribData?.data;

  if (indexState === 'loading') {
    return (
      <div className="space-y-6">
        <PageHeader title="Airfare Index" subtitle="Deep analysis of the Airfare Price Index (APIx)" />
        <LoadingSkeleton variant="stat" count={4} />
        <LoadingSkeleton variant="chart" />
      </div>
    );
  }

  if (indexState === 'error') {
    return (
      <div className="space-y-6">
        <PageHeader title="Airfare Index" subtitle="Deep analysis of the Airfare Price Index (APIx)" />
        <ErrorState
          onRetry={refetchIndex}
          isNetworkError={indexError?.code === 'NETWORK_ERROR'}
          description={indexError?.message}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Airfare Index" subtitle="Deep analysis of the Airfare Price Index (APIx)">
        <PeriodSelector value={period} onChange={setPeriod} />
      </PageHeader>

      {/* Current Index KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Current APIx"
          value={idx ? formatIndex(idx.value) : null}
        />
        <StatCard
          label="Previous Period"
          value={idx ? formatIndex(idx.previousValue) : null}
        />
        <StatCard
          label="Change"
          value={idx?.changePercentage !== undefined ? formatPercentage(idx.changePercentage) : null}
          change={idx?.changePercentage}
        />
        <StatCard
          label="Coverage"
          value={idx?.coverage !== undefined ? formatPercentage(idx.coverage, { showSign: false }) : null}
        />
      </div>

      {/* Historical Trend Chart */}
      <ChartCard
        title="APIx Historical Trend"
        subtitle={idx?.basePeriod ? `Base period: ${idx.basePeriod}` : undefined}
        isEmpty={!timeSeries?.data?.length}
        emptyMessage="Historical index data will appear when sufficient observations are collected."
      >
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={timeSeries?.data || []}>
              <CartesianGrid strokeDasharray="3 3" stroke={CHART_COLORS.grid} />
              <XAxis dataKey="date" tick={{ fill: CHART_COLORS.text, fontSize: 11 }} axisLine={{ stroke: CHART_COLORS.grid }} />
              <YAxis tick={{ fill: CHART_COLORS.text, fontSize: 11 }} axisLine={{ stroke: CHART_COLORS.grid }} domain={['auto', 'auto']} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0f172a',
                  border: '1px solid rgba(51,65,85,0.5)',
                  borderRadius: '8px',
                  fontSize: 12,
                  color: '#e2e8f0',
                }}
              />
              <Line type="monotone" dataKey="value" stroke={CHART_COLORS.primary} strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </ChartCard>

      {/* Route Contribution */}
      <ChartCard
        title="Route Contribution to Index"
        isEmpty={!contributions?.routeContributions?.length}
        emptyMessage="Route contribution data will appear when the index basket is calculated."
      >
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={contributions?.routeContributions || []} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke={CHART_COLORS.grid} />
              <XAxis type="number" tick={{ fill: CHART_COLORS.text, fontSize: 11 }} axisLine={{ stroke: CHART_COLORS.grid }} />
              <YAxis
                type="category"
                dataKey="origin"
                tick={{ fill: CHART_COLORS.text, fontSize: 11 }}
                axisLine={{ stroke: CHART_COLORS.grid }}
                width={80}
                tickFormatter={(val: string, index: number) => {
                  const item = contributions?.routeContributions?.[index];
                  return item ? `${item.origin}→${item.destination}` : val;
                }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0f172a',
                  border: '1px solid rgba(51,65,85,0.5)',
                  borderRadius: '8px',
                  fontSize: 12,
                  color: '#e2e8f0',
                }}
              />
              <Bar dataKey="contribution" fill={CHART_COLORS.primary} radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </ChartCard>

      {/* Lead-Time Contribution */}
      <ChartCard
        title="Lead-Time Contribution to Index"
        isEmpty={!contributions?.leadTimeContributions?.length}
        emptyMessage="Lead-time contribution breakdown will be available after index computation."
      >
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={contributions?.leadTimeContributions || []}>
              <CartesianGrid strokeDasharray="3 3" stroke={CHART_COLORS.grid} />
              <XAxis dataKey="advanceDays" tick={{ fill: CHART_COLORS.text, fontSize: 11 }} axisLine={{ stroke: CHART_COLORS.grid }} tickFormatter={(v: any) => `T+${v}`} />
              <YAxis tick={{ fill: CHART_COLORS.text, fontSize: 11 }} axisLine={{ stroke: CHART_COLORS.grid }} />
              <Tooltip
                contentStyle={{ backgroundColor: '#0f172a', border: '1px solid rgba(51,65,85,0.5)', borderRadius: '8px', fontSize: 12, color: '#e2e8f0' }}
                labelFormatter={(v: any) => `T+${v} days`}
              />
              <Bar dataKey="contribution" fill={CHART_COLORS.secondary} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </ChartCard>

      {/* Index Methodology */}
      <div className="glass-card overflow-hidden">
        <button
          onClick={() => setMethodologyOpen(!methodologyOpen)}
          className="w-full flex items-center justify-between p-5 text-left hover:bg-udaan-surface-light/30 transition-colors"
          aria-expanded={methodologyOpen}
        >
          <div>
            <h3 className="text-sm font-semibold text-udaan-text uppercase tracking-wider">
              Index Methodology
            </h3>
            <p className="text-xs text-udaan-text-muted mt-0.5">
              How the Airfare Price Index is calculated
            </p>
          </div>
          {methodologyOpen ? (
            <ChevronUp className="w-5 h-5 text-udaan-text-dim" />
          ) : (
            <ChevronDown className="w-5 h-5 text-udaan-text-dim" />
          )}
        </button>
        {methodologyOpen && (
          <div className="px-5 pb-5 border-t border-udaan-border pt-4 text-sm text-udaan-text-muted space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <span className="text-xs text-udaan-text-dim uppercase tracking-wider">Base Period</span>
                <p className="text-udaan-text mt-1">{idx?.basePeriod || 'To be determined'}</p>
              </div>
              <div>
                <span className="text-xs text-udaan-text-dim uppercase tracking-wider">Route Basket</span>
                <p className="text-udaan-text mt-1">Representative domestic city pairs weighted by traffic</p>
              </div>
              <div>
                <span className="text-xs text-udaan-text-dim uppercase tracking-wider">Weighting Method</span>
                <p className="text-udaan-text mt-1">Passenger-traffic weighted (based on DGCA data)</p>
              </div>
              <div>
                <span className="text-xs text-udaan-text-dim uppercase tracking-wider">Observation Window</span>
                <p className="text-udaan-text mt-1">Multiple advance purchase windows (T+1 to T+45)</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
