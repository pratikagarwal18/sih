// Routes Page — Analyze representative city pairs

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHeader } from '../components/PageHeader';
import { FilterBar } from '../components/FilterBar';
import { DataTable, type Column } from '../components/DataTable';
import { LoadingSkeleton } from '../components/LoadingSkeleton';
import { ErrorState } from '../components/ErrorState';
import { EmptyState } from '../components/EmptyState';
import { useApi } from '../hooks/useApi';
import { routeService } from '../services/routeService';
import { formatIndex, formatPercentage, formatNumber, formatRelativeTime } from '../utils/formatters';
import type { Route } from '../types/route';
import type { ApiResponse, PaginatedResponse } from '../types/common';

const columns: Column<Route>[] = [
  {
    key: 'origin',
    header: 'Origin',
    sortable: true,
    render: (r) => (
      <div>
        <span className="font-mono text-xs tracking-wider font-semibold text-udaan-text">{r.origin}</span>
        <span className="block text-xs text-udaan-text-dim">{r.originName}</span>
      </div>
    ),
  },
  {
    key: 'destination',
    header: 'Destination',
    sortable: true,
    render: (r) => (
      <div>
        <span className="font-mono text-xs tracking-wider font-semibold text-udaan-text">{r.destination}</span>
        <span className="block text-xs text-udaan-text-dim">{r.destinationName}</span>
      </div>
    ),
  },
  {
    key: 'weight',
    header: 'Weight',
    sortable: true,
    render: (r) => <span className="text-xs">{formatPercentage(r.weight, { showSign: false })}</span>,
  },
  {
    key: 'currentIndex',
    header: 'APIx',
    sortable: true,
    render: (r) => <span className="font-semibold">{formatIndex(r.currentIndex)}</span>,
  },
  {
    key: 'change',
    header: 'Change',
    sortable: true,
    render: (r) => (
      <span className={r.changePercentage > 0 ? 'text-emerald-400' : r.changePercentage < 0 ? 'text-red-400' : 'text-udaan-text-dim'}>
        {formatPercentage(r.changePercentage)}
      </span>
    ),
  },
  {
    key: 'observationCount',
    header: 'Observations',
    sortable: true,
    render: (r) => formatNumber(r.observationCount),
  },
  {
    key: 'coverage',
    header: 'Coverage',
    render: (r) => formatPercentage(r.coverage, { showSign: false }),
  },
  {
    key: 'lastUpdated',
    header: 'Last Updated',
    render: (r) => (
      <span className="text-xs text-udaan-text-muted">{formatRelativeTime(r.lastUpdated)}</span>
    ),
  },
];

export const RoutesPage: React.FC = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  const { data, state, error, refetch } = useApi<ApiResponse<PaginatedResponse<Route>>>(
    (signal) => routeService.getRoutes({ page: 1, pageSize: 50 }, signal),
    []
  );

  const routes = data?.data?.data || [];
  const filtered = search
    ? routes.filter(
        (r) =>
          r.origin.toLowerCase().includes(search.toLowerCase()) ||
          r.destination.toLowerCase().includes(search.toLowerCase()) ||
          r.originName.toLowerCase().includes(search.toLowerCase()) ||
          r.destinationName.toLowerCase().includes(search.toLowerCase())
      )
    : routes;

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
        <PageHeader title="Routes" subtitle="Analyze representative city pairs in the airfare basket" />
        <LoadingSkeleton variant="table" count={8} />
      </div>
    );
  }

  if (state === 'error') {
    return (
      <div>
        <PageHeader title="Routes" subtitle="Analyze representative city pairs in the airfare basket" />
        <ErrorState onRetry={refetch} isNetworkError={error?.code === 'NETWORK_ERROR'} description={error?.message} />
      </div>
    );
  }

  return (
    <div>
      <PageHeader title="Routes" subtitle="Analyze representative city pairs in the airfare basket" />

      <FilterBar
        searchValue={search}
        onSearchChange={setSearch}
        searchPlaceholder="Search routes (e.g. DEL, Mumbai)..."
      />

      {filtered.length === 0 ? (
        <EmptyState
          title="No route data available"
          description="Route observations will appear when the backend data pipeline is connected and collecting fare data."
        />
      ) : (
        <DataTable
          columns={columns}
          data={filtered}
          keyExtractor={(r) => r.routeId}
          onRowClick={(r) => navigate(`/routes/${r.routeId}`)}
          sortBy={sortBy}
          sortOrder={sortOrder}
          onSort={handleSort}
        />
      )}
    </div>
  );
};
