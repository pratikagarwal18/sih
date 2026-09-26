// Data Sources Page — Backend data pipeline status

import React from 'react';
import { Database, Wifi, WifiOff, AlertTriangle, Settings } from 'lucide-react';
import { PageHeader } from '../components/PageHeader';
import { StatusBadge } from '../components/StatusBadge';
import { LoadingSkeleton } from '../components/LoadingSkeleton';
import { ErrorState } from '../components/ErrorState';
import { EmptyState } from '../components/EmptyState';
import { useApi } from '../hooks/useApi';
import { dataSourceService } from '../services/dataSourceService';
import { formatNumber, formatDateTime, formatPercentage } from '../utils/formatters';
import { DATA_SOURCE_TYPE_LABELS } from '../constants';
import type { DataSourceSummary, DataSource } from '../types/datasource';
import type { ApiResponse } from '../types/common';

const statusIcons: Record<string, React.ReactNode> = {
  connected: <Wifi className="w-4 h-4 text-emerald-400" />,
  degraded: <AlertTriangle className="w-4 h-4 text-amber-400" />,
  unavailable: <WifiOff className="w-4 h-4 text-red-400" />,
  not_configured: <Settings className="w-4 h-4 text-slate-400" />,
};

const complianceLabels: Record<string, { label: string; variant: 'connected' | 'degraded' | 'unavailable' | 'neutral' }> = {
  compliant: { label: 'Compliant', variant: 'connected' },
  non_compliant: { label: 'Non-Compliant', variant: 'unavailable' },
  pending_review: { label: 'Pending Review', variant: 'degraded' },
  unknown: { label: 'Unknown', variant: 'neutral' },
};

function SourceCard({ source }: { source: DataSource }) {
  const typeLabel = DATA_SOURCE_TYPE_LABELS[source.type] || source.type;
  const complianceInfo = complianceLabels[source.complianceStatus] || complianceLabels.unknown;
  const statusVariant = source.status === 'connected' ? 'connected'
    : source.status === 'degraded' ? 'degraded'
    : source.status === 'unavailable' ? 'unavailable'
    : 'not_configured';

  return (
    <div className="glass-card glass-card-hover p-5">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-udaan-surface-light flex items-center justify-center">
            {statusIcons[source.status] || <Database className="w-4 h-4 text-udaan-text-dim" />}
          </div>
          <div>
            <h3 className="text-sm font-semibold text-udaan-text">{source.name}</h3>
            <span className="text-xs text-udaan-text-dim">{typeLabel}</span>
          </div>
        </div>
        <StatusBadge status={statusVariant} label={source.status.toUpperCase().replace('_', ' ')} />
      </div>

      <div className="grid grid-cols-2 gap-3 text-xs">
        <div>
          <span className="text-udaan-text-dim">Last Collection</span>
          <p className="text-udaan-text mt-0.5">
            {source.lastSuccessfulCollection ? formatDateTime(source.lastSuccessfulCollection) : '—'}
          </p>
        </div>
        <div>
          <span className="text-udaan-text-dim">Records</span>
          <p className="text-udaan-text mt-0.5">{formatNumber(source.observationCount)}</p>
        </div>
        <div>
          <span className="text-udaan-text-dim">Coverage</span>
          <p className="text-udaan-text mt-0.5">{formatPercentage(source.coverage, { showSign: false })}</p>
        </div>
        <div>
          <span className="text-udaan-text-dim">Compliance</span>
          <div className="mt-0.5">
            <StatusBadge status={complianceInfo.variant} label={complianceInfo.label} showDot={false} />
          </div>
        </div>
      </div>
    </div>
  );
}

export const DataSourcesPage: React.FC = () => {
  const { data, state, error, refetch } = useApi<ApiResponse<DataSourceSummary>>(
    (signal) => dataSourceService.getDataSources(signal),
    []
  );

  const summary = data?.data;
  const sources = summary?.sources || [];

  // Group sources by type
  const grouped = sources.reduce<Record<string, DataSource[]>>((acc, s) => {
    const type = s.type;
    if (!acc[type]) acc[type] = [];
    acc[type].push(s);
    return acc;
  }, {});

  if (state === 'loading') {
    return (
      <div>
        <PageHeader title="Data Sources" subtitle="Backend data pipeline and collection status" />
        <LoadingSkeleton variant="card" count={6} />
      </div>
    );
  }

  if (state === 'error') {
    return (
      <div>
        <PageHeader title="Data Sources" subtitle="Backend data pipeline and collection status" />
        <ErrorState onRetry={refetch} isNetworkError={error?.code === 'NETWORK_ERROR'} description={error?.message} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Data Sources" subtitle="Backend data pipeline and collection status" />

      {/* Summary Stats */}
      {summary && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="glass-card p-4 text-center">
            <span className="text-xs text-udaan-text-dim">Total Sources</span>
            <p className="text-2xl font-bold text-udaan-text mt-1">{formatNumber(summary.totalSources)}</p>
          </div>
          <div className="glass-card p-4 text-center">
            <span className="text-xs text-udaan-text-dim">Connected</span>
            <p className="text-2xl font-bold text-emerald-400 mt-1">{formatNumber(summary.connectedSources)}</p>
          </div>
          <div className="glass-card p-4 text-center">
            <span className="text-xs text-udaan-text-dim">Total Observations</span>
            <p className="text-2xl font-bold text-udaan-text mt-1">{formatNumber(summary.totalObservations)}</p>
          </div>
          <div className="glass-card p-4 text-center">
            <span className="text-xs text-udaan-text-dim">Last Updated</span>
            <p className="text-sm font-medium text-udaan-text mt-2">
              {summary.lastUpdated ? formatDateTime(summary.lastUpdated) : 'Awaiting data'}
            </p>
          </div>
        </div>
      )}

      {sources.length === 0 ? (
        <EmptyState
          title="No data sources configured"
          description="Data source status will appear when the backend data pipeline is configured and connected."
        />
      ) : (
        Object.entries(grouped).map(([type, typeSources]) => (
          <div key={type}>
            <h2 className="text-sm font-semibold text-udaan-text-muted uppercase tracking-wider mb-3">
              {DATA_SOURCE_TYPE_LABELS[type] || type}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {typeSources.map((source) => (
                <SourceCard key={source.id} source={source} />
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  );
};
