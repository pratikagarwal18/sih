// Route Detail Page — Premium route intelligence

import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, BarChart, Bar,
} from 'recharts';
import { ArrowLeft, Plane } from 'lucide-react';
import { PageHeader } from '../components/PageHeader';
import { StatCard } from '../components/StatCard';
import { ChartCard } from '../components/ChartCard';
import { LoadingSkeleton } from '../components/LoadingSkeleton';
import { ErrorState } from '../components/ErrorState';
import { useApi } from '../hooks/useApi';
import { routeService } from '../services/routeService';
import { formatIndex, formatPercentage, formatCurrency, formatNumber } from '../utils/formatters';
import { CHART_COLORS } from '../constants';
import type { RouteDetail } from '../types/route';
import type { ApiResponse } from '../types/common';

export const RouteDetailPage: React.FC = () => {
  const { routeId } = useParams<{ routeId: string }>();
  const navigate = useNavigate();

  const { data, state, error, refetch } = useApi<ApiResponse<RouteDetail>>(
    (signal) => routeService.getRoute(routeId!, signal),
    [routeId]
  );

  const route = data?.data;

  if (state === 'loading') {
    return (
      <div>
        <PageHeader title="Route Detail" />
        <LoadingSkeleton variant="stat" count={4} />
        <div className="mt-6"><LoadingSkeleton variant="chart" /></div>
      </div>
    );
  }

  if (state === 'error') {
    return (
      <div>
        <PageHeader title="Route Detail" />
        <ErrorState onRetry={refetch} isNetworkError={error?.code === 'NETWORK_ERROR'} description={error?.message} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Back navigation */}
      <button
        onClick={() => navigate('/routes')}
        className="inline-flex items-center gap-2 text-sm text-udaan-text-muted hover:text-udaan-cyan transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Routes
      </button>

      {/* Route Header */}
      <div className="glass-card p-8">
        <div className="flex flex-col sm:flex-row items-center gap-6">
          {/* Origin */}
          <div className="text-center">
            <span className="text-airport-code text-udaan-cyan">{route?.origin || '—'}</span>
            <span className="block text-sm text-udaan-text-muted mt-1">{route?.originName || ''}</span>
          </div>

          {/* Flight path visual */}
          <div className="flex-1 flex items-center justify-center">
            <div className="w-full max-w-xs relative">
              <div className="h-px bg-gradient-to-r from-udaan-cyan via-udaan-cyan/50 to-udaan-blue" />
              <Plane className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-5 h-5 text-udaan-cyan transform rotate-90" />
            </div>
          </div>

          {/* Destination */}
          <div className="text-center">
            <span className="text-airport-code text-udaan-blue">{route?.destination || '—'}</span>
            <span className="block text-sm text-udaan-text-muted mt-1">{route?.destinationName || ''}</span>
          </div>
        </div>
      </div>

      {/* Route Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Current Index" value={route ? formatIndex(route.currentIndex) : null} change={route?.changePercentage} />
        <StatCard label="Weight in Basket" value={route ? formatPercentage(route.weight, { showSign: false }) : null} />
        <StatCard label="Observations" value={route ? formatNumber(route.observationCount) : null} />
        <StatCard label="Coverage" value={route ? formatPercentage(route.coverage, { showSign: false }) : null} />
      </div>

      {/* Historical Index */}
      <ChartCard
        title="Historical Airfare Index"
        isEmpty={!route?.historicalIndex?.length}
        emptyMessage="Historical index data will appear when sufficient observations are collected for this route."
      >
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={route?.historicalIndex || []}>
              <CartesianGrid strokeDasharray="3 3" stroke={CHART_COLORS.grid} />
              <XAxis dataKey="date" tick={{ fill: CHART_COLORS.text, fontSize: 11 }} axisLine={{ stroke: CHART_COLORS.grid }} />
              <YAxis tick={{ fill: CHART_COLORS.text, fontSize: 11 }} axisLine={{ stroke: CHART_COLORS.grid }} domain={['auto', 'auto']} />
              <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: '1px solid rgba(51,65,85,0.5)', borderRadius: '8px', fontSize: 12, color: '#e2e8f0' }} />
              <Line type="monotone" dataKey="value" stroke={CHART_COLORS.primary} strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </ChartCard>

      {/* Airline Comparison */}
      <ChartCard
        title="Airline Comparison"
        isEmpty={!route?.airlineComparison?.length}
        emptyMessage="Airline comparison data will appear when fare observations are available from multiple airlines."
      >
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={route?.airlineComparison || []}>
              <CartesianGrid strokeDasharray="3 3" stroke={CHART_COLORS.grid} />
              <XAxis dataKey="airline" tick={{ fill: CHART_COLORS.text, fontSize: 11 }} axisLine={{ stroke: CHART_COLORS.grid }} />
              <YAxis tick={{ fill: CHART_COLORS.text, fontSize: 11 }} axisLine={{ stroke: CHART_COLORS.grid }} />
              <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: '1px solid rgba(51,65,85,0.5)', borderRadius: '8px', fontSize: 12, color: '#e2e8f0' }} />
              <Bar dataKey="averageFare" fill={CHART_COLORS.primary} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </ChartCard>

      {/* Lead-Time Curve */}
      <ChartCard
        title="Lead-Time Fare Curve"
        subtitle="How observed fares vary by advance purchase window"
        isEmpty={!route?.leadTimeCurve?.length}
        emptyMessage="Lead-time curve will appear when fare observations across multiple advance purchase windows are available."
      >
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={route?.leadTimeCurve || []}>
              <CartesianGrid strokeDasharray="3 3" stroke={CHART_COLORS.grid} />
              <XAxis dataKey="advanceDays" tick={{ fill: CHART_COLORS.text, fontSize: 11 }} axisLine={{ stroke: CHART_COLORS.grid }} tickFormatter={(v: any) => `T+${v}`} />
              <YAxis tick={{ fill: CHART_COLORS.text, fontSize: 11 }} axisLine={{ stroke: CHART_COLORS.grid }} />
              <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: '1px solid rgba(51,65,85,0.5)', borderRadius: '8px', fontSize: 12, color: '#e2e8f0' }} labelFormatter={(v: any) => `T+${v} days`} />
              <Line type="monotone" dataKey="medianFare" stroke={CHART_COLORS.secondary} strokeWidth={2} dot={{ r: 4, fill: CHART_COLORS.secondary }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </ChartCard>

      {/* Fare Breakdown */}
      {route?.fareBreakdown && (
        <div className="glass-card p-6">
          <h3 className="text-sm font-semibold text-udaan-text-muted uppercase tracking-wider mb-4">
            Fare Component Breakdown
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div>
              <span className="text-xs text-udaan-text-dim">Base Fare</span>
              <p className="text-lg font-semibold text-udaan-text mt-1">{formatCurrency(route.fareBreakdown.baseFare)}</p>
            </div>
            <div>
              <span className="text-xs text-udaan-text-dim">Taxes</span>
              <p className="text-lg font-semibold text-udaan-text mt-1">{formatCurrency(route.fareBreakdown.taxes)}</p>
            </div>
            <div>
              <span className="text-xs text-udaan-text-dim">Fees</span>
              <p className="text-lg font-semibold text-udaan-text mt-1">{formatCurrency(route.fareBreakdown.fees)}</p>
            </div>
            <div>
              <span className="text-xs text-udaan-text-dim">Total Fare</span>
              <p className="text-lg font-bold text-udaan-cyan mt-1">{formatCurrency(route.fareBreakdown.totalFare)}</p>
            </div>
          </div>
        </div>
      )}

      {/* Data Quality */}
      {route?.dataQuality && (
        <div className="glass-card p-6">
          <h3 className="text-sm font-semibold text-udaan-text-muted uppercase tracking-wider mb-4">
            Data Quality
          </h3>
          <div className="grid grid-cols-3 gap-4">
            {(['completeness', 'consistency', 'timeliness'] as const).map((metric) => (
              <div key={metric}>
                <span className="text-xs text-udaan-text-dim capitalize">{metric}</span>
                <div className="mt-2 h-2 rounded-full bg-udaan-surface-light overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-udaan-cyan to-udaan-blue transition-all"
                    style={{ width: `${(route.dataQuality[metric] || 0) * 100}%` }}
                  />
                </div>
                <span className="text-xs text-udaan-text-muted mt-1 block">
                  {formatPercentage(route.dataQuality[metric], { showSign: false })}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
