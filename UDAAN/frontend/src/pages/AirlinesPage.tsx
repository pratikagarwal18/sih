// Airlines Page — Compare observed airfare patterns by airline

import React, { useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { PageHeader } from '../components/PageHeader';
import { FilterBar } from '../components/FilterBar';
import { DataTable, type Column } from '../components/DataTable';
import { ChartCard } from '../components/ChartCard';
import { LoadingSkeleton } from '../components/LoadingSkeleton';
import { ErrorState } from '../components/ErrorState';
import { EmptyState } from '../components/EmptyState';
import { useApi } from '../hooks/useApi';
import { airlineService } from '../services/airlineService';
import { formatCurrency, formatNumber, formatPercentage, formatRelativeTime } from '../utils/formatters';
import { CHART_COLORS } from '../constants';
import type { Airline } from '../types/airline';
import type { ApiResponse, PaginatedResponse } from '../types/common';

const columns: Column<Airline>[] = [
  {
    key: 'name',
    header: 'Airline',
    sortable: true,
    render: (a) => (
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-udaan-cyan-dim flex items-center justify-center">
          <span className="text-xs font-bold text-udaan-cyan">{a.code}</span>
        </div>
        <span className="font-medium">{a.name}</span>
      </div>
    ),
  },
  {
    key: 'routesObserved',
    header: 'Routes',
    sortable: true,
    render: (a) => formatNumber(a.routesObserved),
  },
  {
    key: 'totalObservations',
    header: 'Observations',
    sortable: true,
    render: (a) => formatNumber(a.totalObservations),
  },
  {
    key: 'averageObservedFare',
    header: 'Avg. Fare',
    sortable: true,
    render: (a) => formatCurrency(a.averageObservedFare),
  },
  {
    key: 'coverage',
    header: 'Coverage',
    render: (a) => formatPercentage(a.coverage, { showSign: false }),
  },
  {
    key: 'lastUpdated',
    header: 'Last Updated',
    render: (a) => (
      <span className="text-xs text-udaan-text-muted">{formatRelativeTime(a.lastUpdated)}</span>
    ),
  },
];

export const AirlinesPage: React.FC = () => {
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  const { data, state, error, refetch } = useApi<ApiResponse<PaginatedResponse<Airline>>>(
    (signal) => airlineService.getAirlines({ page: 1, pageSize: 50 }, signal),
    []
  );

  const airlines = data?.data?.data || [];
  const filtered = search
    ? airlines.filter(
        (a) =>
          a.name.toLowerCase().includes(search.toLowerCase()) ||
          a.code.toLowerCase().includes(search.toLowerCase())
      )
    : airlines;

  const handleSort = (key: string) => {
    if (sortBy === key) {
      setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortBy(key);
      setSortOrder('asc');
    }
  };

  if (state === 'loading') {
    return (
      <div>
        <PageHeader title="Airlines" subtitle="Compare observed airfare patterns by airline" />
        <LoadingSkeleton variant="table" count={6} />
      </div>
    );
  }

  if (state === 'error') {
    return (
      <div>
        <PageHeader title="Airlines" subtitle="Compare observed airfare patterns by airline" />
        <ErrorState onRetry={refetch} isNetworkError={error?.code === 'NETWORK_ERROR'} description={error?.message} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Airlines" subtitle="Compare observed airfare patterns by airline" />

      <FilterBar
        searchValue={search}
        onSearchChange={setSearch}
        searchPlaceholder="Search airlines..."
      />

      {filtered.length === 0 ? (
        <EmptyState
          title="No airline data available"
          description="Airline observations will appear when the UDAAN data pipeline begins collecting fare data."
        />
      ) : (
        <>
          <DataTable
            columns={columns}
            data={filtered}
            keyExtractor={(a) => a.id}
            sortBy={sortBy}
            sortOrder={sortOrder}
            onSort={handleSort}
          />

          {/* Airline Fare Distribution Chart */}
          <ChartCard
            title="Airline Average Observed Fare"
            isEmpty={filtered.length === 0}
            emptyMessage="Fare distribution chart will appear when airline observation data is available."
          >
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={filtered}>
                  <CartesianGrid strokeDasharray="3 3" stroke={CHART_COLORS.grid} />
                  <XAxis dataKey="code" tick={{ fill: CHART_COLORS.text, fontSize: 11 }} axisLine={{ stroke: CHART_COLORS.grid }} />
                  <YAxis tick={{ fill: CHART_COLORS.text, fontSize: 11 }} axisLine={{ stroke: CHART_COLORS.grid }} />
                  <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: '1px solid rgba(51,65,85,0.5)', borderRadius: '8px', fontSize: 12, color: '#e2e8f0' }} />
                  <Bar dataKey="averageObservedFare" fill={CHART_COLORS.primary} radius={[4, 4, 0, 0]} name="Avg. Fare (₹)" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>

          {/* Route Coverage Chart */}
          <ChartCard
            title="Airline Route Coverage"
            isEmpty={filtered.length === 0}
          >
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={filtered}>
                  <CartesianGrid strokeDasharray="3 3" stroke={CHART_COLORS.grid} />
                  <XAxis dataKey="code" tick={{ fill: CHART_COLORS.text, fontSize: 11 }} axisLine={{ stroke: CHART_COLORS.grid }} />
                  <YAxis tick={{ fill: CHART_COLORS.text, fontSize: 11 }} axisLine={{ stroke: CHART_COLORS.grid }} />
                  <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: '1px solid rgba(51,65,85,0.5)', borderRadius: '8px', fontSize: 12, color: '#e2e8f0' }} />
                  <Bar dataKey="routesObserved" fill={CHART_COLORS.secondary} radius={[4, 4, 0, 0]} name="Routes" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
        </>
      )}
    </div>
  );
};
