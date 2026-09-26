// Fare Explorer — Analytical fare observation explorer (NOT a booking page)

import React, { useState } from 'react';
import { PageHeader } from '../components/PageHeader';
import { FilterBar } from '../components/FilterBar';
import { DataTable, type Column } from '../components/DataTable';
import { LoadingSkeleton } from '../components/LoadingSkeleton';
import { ErrorState } from '../components/ErrorState';
import { EmptyState } from '../components/EmptyState';
import { StatusBadge } from '../components/StatusBadge';
import { useApi } from '../hooks/useApi';
import { airfareService } from '../services/airfareService';
import { formatCurrency, formatDateTime } from '../utils/formatters';
import type { AirfareObservation } from '../types/airfare';
import type { ApiResponse, PaginatedResponse } from '../types/common';

const columns: Column<AirfareObservation>[] = [
  {
    key: 'airline',
    header: 'Airline',
    render: (o) => <span className="font-medium">{o.airline}</span>,
  },
  {
    key: 'route',
    header: 'Route',
    render: (o) => (
      <span className="font-mono text-xs tracking-wider">{o.origin} → {o.destination}</span>
    ),
  },
  {
    key: 'advanceDays',
    header: 'Advance Days',
    render: (o) => (
      <span className="font-mono text-xs">T+{o.advancePurchaseDays}</span>
    ),
  },
  {
    key: 'fareClass',
    header: 'Fare Class',
    render: (o) => (
      <span className="text-xs uppercase tracking-wider">{o.fareClass}</span>
    ),
  },
  {
    key: 'baseFare',
    header: 'Base Fare',
    render: (o) => formatCurrency(o.baseFare),
  },
  {
    key: 'taxes',
    header: 'Taxes',
    render: (o) => formatCurrency(o.taxes),
  },
  {
    key: 'fees',
    header: 'Fees',
    render: (o) => formatCurrency(o.fees),
  },
  {
    key: 'totalFare',
    header: 'Total Fare',
    render: (o) => <span className="font-semibold text-udaan-cyan">{formatCurrency(o.totalFare)}</span>,
  },
  {
    key: 'source',
    header: 'Source',
    render: (o) => <span className="text-xs text-udaan-text-muted">{o.source}</span>,
  },
  {
    key: 'observedAt',
    header: 'Observed At',
    render: (o) => (
      <span className="text-xs text-udaan-text-muted">{formatDateTime(o.observationTimestamp)}</span>
    ),
  },
];

export const FareExplorerPage: React.FC = () => {
  const [search, setSearch] = useState('');
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');

  const { data, state, error, refetch } = useApi<ApiResponse<PaginatedResponse<AirfareObservation>>>(
    (signal) =>
      airfareService.getObservations(
        { origin: origin || undefined, destination: destination || undefined, page: 1, pageSize: 50 },
        signal
      ),
    [origin, destination]
  );

  const observations = data?.data?.data || [];
  const filtered = search
    ? observations.filter(
        (o) =>
          o.airline.toLowerCase().includes(search.toLowerCase()) ||
          o.origin.toLowerCase().includes(search.toLowerCase()) ||
          o.destination.toLowerCase().includes(search.toLowerCase()) ||
          o.flightNumber.toLowerCase().includes(search.toLowerCase())
      )
    : observations;

  if (state === 'loading') {
    return (
      <div>
        <PageHeader title="Fare Explorer" subtitle="Analytical fare observation explorer" />
        <LoadingSkeleton variant="table" count={10} />
      </div>
    );
  }

  if (state === 'error') {
    return (
      <div>
        <PageHeader title="Fare Explorer" subtitle="Analytical fare observation explorer" />
        <ErrorState onRetry={refetch} isNetworkError={error?.code === 'NETWORK_ERROR'} description={error?.message} />
      </div>
    );
  }

  return (
    <div>
      <PageHeader title="Fare Explorer" subtitle="Analytical fare observation explorer — explore collected airfare data points">
        <StatusBadge
          status={observations.length > 0 ? 'connected' : 'neutral'}
          label={observations.length > 0 ? `${observations.length} observations` : 'No observations'}
        />
      </PageHeader>

      <div className="mb-4 p-3 rounded-lg bg-udaan-surface border border-udaan-border text-xs text-udaan-text-muted">
        <strong className="text-udaan-text">Note:</strong> This is an analytical observation explorer, not a flight booking interface.
        All displayed data represents observed fare data points collected by the UDAAN pipeline.
      </div>

      <FilterBar
        searchValue={search}
        onSearchChange={setSearch}
        searchPlaceholder="Search by airline, route, flight number..."
      >
        <input
          type="text"
          placeholder="Origin (e.g. DEL)"
          value={origin}
          onChange={(e) => setOrigin(e.target.value)}
          className="px-3 py-2 rounded-lg bg-udaan-surface border border-udaan-border text-sm text-udaan-text placeholder:text-udaan-text-dim focus:outline-none focus:border-udaan-cyan/50 w-28"
          aria-label="Filter by origin"
        />
        <input
          type="text"
          placeholder="Dest (e.g. BOM)"
          value={destination}
          onChange={(e) => setDestination(e.target.value)}
          className="px-3 py-2 rounded-lg bg-udaan-surface border border-udaan-border text-sm text-udaan-text placeholder:text-udaan-text-dim focus:outline-none focus:border-udaan-cyan/50 w-28"
          aria-label="Filter by destination"
        />
      </FilterBar>

      {filtered.length === 0 ? (
        <EmptyState
          title="No airfare observations available"
          description="Fare observations will appear when the UDAAN data pipeline is connected and collecting fare data from airlines and OTA sources."
        />
      ) : (
        <DataTable
          columns={columns}
          data={filtered}
          keyExtractor={(o) => o.id}
        />
      )}
    </div>
  );
};
