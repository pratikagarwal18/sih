// Overview Page — Main dashboard with hero, KPIs, index chart, and route movements

import React, { useState } from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer,
} from 'recharts';
import {
  TrendingUp, BarChart3, Route, Eye, Layers, Plane,
} from 'lucide-react';
import { StatCard } from '../components/StatCard';
import { ChartCard } from '../components/ChartCard';
import { PeriodSelector } from '../components/PeriodSelector';
import { LoadingSkeleton } from '../components/LoadingSkeleton';
import { EmptyState } from '../components/EmptyState';
import { ErrorState } from '../components/ErrorState';
import { DataTable, type Column } from '../components/DataTable';
import { useApi } from '../hooks/useApi';
import { indexService } from '../services/indexService';
import { formatIndex, formatPercentage, formatNumber, formatRelativeTime } from '../utils/formatters';
import { CHART_COLORS } from '../constants';
import type { OverviewData } from '../types/index';
import type { Route as RouteType } from '../types/route';
import type { ApiResponse } from '../types/common';

const routeColumns: Column<RouteType>[] = [
  {
    key: 'route',
    header: 'Route',
    render: (r) => (
      <span className="font-mono text-xs tracking-wider">
        {r.origin} → {r.destination}
      </span>
    ),
  },
  {
    key: 'currentIndex',
    header: 'Current Index',
    render: (r) => <span className="font-semibold">{formatIndex(r.currentIndex)}</span>,
  },
  {
    key: 'change',
    header: 'Change',
    render: (r) => (
      <span className={r.changePercentage > 0 ? 'text-emerald-400' : r.changePercentage < 0 ? 'text-red-400' : 'text-udaan-text-dim'}>
        {formatPercentage(r.changePercentage)}
      </span>
    ),
  },
  {
    key: 'observations',
    header: 'Observations',
    render: (r) => formatNumber(r.observationCount),
  },
  {
    key: 'lastUpdated',
    header: 'Last Updated',
    render: (r) => (
      <span className="text-udaan-text-muted text-xs">
        {formatRelativeTime(r.lastUpdated)}
      </span>
    ),
  },
];

export const OverviewPage: React.FC = () => {
  const [period, setPeriod] = useState('daily');

  const { data, state, error, refetch } = useApi<ApiResponse<OverviewData>>(
    (signal) => indexService.getOverview(signal),
    []
  );

  const overview = data?.data;
  const idx = overview?.currentIndex;
  const timeSeries = overview?.indexTimeSeries;
  const routes = overview?.topRouteMovements || [];
  const status = overview?.systemStatus;

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-udaan-surface via-udaan-panel to-udaan-bg border border-udaan-border star-field">
        <div className="relative z-10 px-8 py-12 lg:py-16">
          {/* Animated flight path line */}
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none"
            viewBox="0 0 1200 300"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <path
              d="M0 250 Q300 200 500 150 T900 80 T1200 30"
              fill="none"
              stroke="url(#flight-gradient)"
              strokeWidth="1.5"
              className="animate-flight-path"
              opacity="0.4"
            />
            <defs>
              <linearGradient id="flight-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#06b6d4" stopOpacity="0" />
                <stop offset="30%" stopColor="#06b6d4" stopOpacity="0.6" />
                <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.2" />
              </linearGradient>
            </defs>
          </svg>

          {/* Small plane icon animation */}
          <div className="absolute top-8 right-12 animate-plane-move opacity-20">
            <Plane className="w-5 h-5 text-udaan-cyan transform -rotate-45" />
          </div>

          <div className="relative">
            <p className="text-xs font-mono text-udaan-cyan uppercase tracking-[0.25em] mb-3">
              Real-Time Airfare Intelligence
            </p>
            <h1 className="text-3xl lg:text-5xl font-bold text-white leading-tight mb-4 tracking-tight">
              India's Airfare Pulse
            </h1>
            <p className="text-sm lg:text-base text-udaan-text-muted max-w-xl leading-relaxed">
              Real-time measurement of domestic airfare movements across representative Indian routes
              for augmentation of the Consumer Price Index.
            </p>
            <div className="mt-6 flex items-center gap-4 text-xs text-udaan-text-dim font-mono">
              <span className="uppercase tracking-wider">SIH26056</span>
              <span className="w-px h-3 bg-udaan-border" />
              <span>Measure · Understand · Validate</span>
            </div>
          </div>
        </div>

        {/* Subtle red accent line (aviation) */}
        <div className="absolute bottom-0 left-0 w-48 h-0.5 bg-gradient-to-r from-red-500 to-transparent" />
      </section>

      {/* KPI Cards */}
      {state === 'loading' ? (
        <LoadingSkeleton variant="stat" count={5} />
      ) : state === 'error' ? (
        <ErrorState
          onRetry={refetch}
          isNetworkError={error?.code === 'NETWORK_ERROR'}
          description={error?.message}
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <StatCard
            label="Airfare Index"
            value={idx ? formatIndex(idx.value) : null}
            change={idx?.changePercentage}
            icon={<TrendingUp className="w-4 h-4 text-udaan-cyan" />}
          />
          <StatCard
            label="Daily Change"
            value={idx?.changePercentage !== undefined ? formatPercentage(idx.changePercentage) : null}
            subtitle={idx ? `Period: ${idx.period}` : undefined}
            icon={<BarChart3 className="w-4 h-4 text-udaan-cyan" />}
          />
          <StatCard
            label="Routes Covered"
            value={status?.routesCovered !== null ? formatNumber(status?.routesCovered ?? undefined) : null}
            icon={<Route className="w-4 h-4 text-udaan-cyan" />}
          />
          <StatCard
            label="Observations"
            value={status?.totalObservations !== null ? formatNumber(status?.totalObservations ?? undefined) : null}
            icon={<Eye className="w-4 h-4 text-udaan-cyan" />}
          />
          <StatCard
            label="Data Coverage"
            value={status?.dataCoverage !== null ? formatPercentage(status?.dataCoverage ?? undefined, { showSign: false }) : null}
            icon={<Layers className="w-4 h-4 text-udaan-cyan" />}
          />
        </div>
      )}

      {/* Main APIx Chart */}
      <ChartCard
        title="Airfare Price Index (APIx)"
        subtitle="Weighted composite index of domestic airfare observations"
        controls={<PeriodSelector value={period} onChange={setPeriod} />}
        isEmpty={!timeSeries || !timeSeries.data || timeSeries.data.length === 0}
        emptyMessage="Index time-series data will appear when airfare observations are available from the backend."
      >
        <div className="h-72 lg:h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={timeSeries?.data || []}>
              <CartesianGrid strokeDasharray="3 3" stroke={CHART_COLORS.grid} />
              <XAxis
                dataKey="date"
                tick={{ fill: CHART_COLORS.text, fontSize: 11 }}
                tickLine={{ stroke: CHART_COLORS.grid }}
                axisLine={{ stroke: CHART_COLORS.grid }}
              />
              <YAxis
                tick={{ fill: CHART_COLORS.text, fontSize: 11 }}
                tickLine={{ stroke: CHART_COLORS.grid }}
                axisLine={{ stroke: CHART_COLORS.grid }}
                domain={['auto', 'auto']}
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
              <Line
                type="monotone"
                dataKey="value"
                stroke={CHART_COLORS.primary}
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4, fill: CHART_COLORS.primary }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </ChartCard>

      {/* Route Movement Table */}
      <div>
        <h2 className="text-sm font-semibold text-udaan-text-muted uppercase tracking-wider mb-4">
          Route Movement
        </h2>
        {routes.length === 0 && state !== 'loading' ? (
          <EmptyState
            title="No route data available"
            description="Route intelligence will appear when route observations are available from the backend."
          />
        ) : (
          <DataTable
            columns={routeColumns}
            data={routes}
            keyExtractor={(r) => r.routeId}
            emptyMessage="No route movements available."
          />
        )}
      </div>

      {/* Route Visualization Placeholder */}
      <section className="glass-card p-8 text-center">
        <div className="flex flex-col items-center">
          <div className="w-14 h-14 rounded-full bg-udaan-cyan-dim flex items-center justify-center mb-4">
            <Route className="w-7 h-7 text-udaan-cyan" />
          </div>
          <h3 className="text-base font-semibold text-udaan-text mb-2">
            Route Intelligence Map
          </h3>
          <p className="text-sm text-udaan-text-muted max-w-md">
            Route intelligence visualization will appear when geographic route observations
            are available from the backend data pipeline.
          </p>
        </div>
      </section>
    </div>
  );
};
