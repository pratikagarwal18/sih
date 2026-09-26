// Festival Intelligence Page — Context for unusual airfare movements

import React from 'react';
import { Calendar, MapPin, TrendingUp } from 'lucide-react';
import { PageHeader } from '../components/PageHeader';
import { LoadingSkeleton } from '../components/LoadingSkeleton';
import { ErrorState } from '../components/ErrorState';
import { EmptyState } from '../components/EmptyState';
import { StatusBadge } from '../components/StatusBadge';
import { useApi } from '../hooks/useApi';
import { festivalService } from '../services/festivalService';
import { formatDate } from '../utils/formatters';
import type { FestivalEvent } from '../types/festival';
import type { ApiResponse, PaginatedResponse } from '../types/common';

const statusMap: Record<string, 'connected' | 'info' | 'neutral'> = {
  active: 'connected',
  upcoming: 'info',
  concluded: 'neutral',
};

const relevanceColors: Record<string, string> = {
  high: 'text-red-400 bg-red-500/10',
  medium: 'text-amber-400 bg-amber-500/10',
  low: 'text-slate-400 bg-slate-500/10',
};

export const FestivalIntelligencePage: React.FC = () => {
  const { data, state, error, refetch } = useApi<ApiResponse<PaginatedResponse<FestivalEvent>>>(
    (signal) => festivalService.getEvents({ page: 1, pageSize: 50 }, signal),
    []
  );

  const events = data?.data?.data || [];

  if (state === 'loading') {
    return (
      <div>
        <PageHeader title="Festival Intelligence" subtitle="Context for unusual airfare movements" />
        <LoadingSkeleton variant="card" count={6} />
      </div>
    );
  }

  if (state === 'error') {
    return (
      <div>
        <PageHeader title="Festival Intelligence" subtitle="Context for unusual airfare movements" />
        <ErrorState onRetry={refetch} isNetworkError={error?.code === 'NETWORK_ERROR'} description={error?.message} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Festival Intelligence" subtitle="Context for unusual airfare movements" />

      {/* Important note about correlation vs causation */}
      <div className="p-4 rounded-lg bg-udaan-surface border border-udaan-border">
        <p className="text-xs text-udaan-text-muted">
          <strong className="text-udaan-text">Note:</strong> Festival intelligence provides contextual demand signals.
          Fare movements that coincide with festival periods are identified as correlation, not causation.
          This module does not claim that any specific event <em>caused</em> airfare changes.
        </p>
      </div>

      {events.length === 0 ? (
        <EmptyState
          title="No festival intelligence available"
          description="Festival and event data will appear when the backend provides calendar-linked demand signals and airfare observations for analysis."
        />
      ) : (
        <>
          {/* Event Timeline Visual */}
          <div className="glass-card p-6">
            <h3 className="text-sm font-semibold text-udaan-text-muted uppercase tracking-wider mb-6">
              Event Timeline
            </h3>
            <div className="relative">
              {/* Timeline line */}
              <div className="absolute left-4 top-0 bottom-0 w-px bg-udaan-border" />

              <div className="space-y-6">
                {events.map((event, index) => (
                  <div
                    key={event.id}
                    className="relative pl-10 animate-fade-in-up"
                    style={{ animationDelay: `${index * 0.05}s` }}
                  >
                    {/* Timeline dot */}
                    <div className={`absolute left-2.5 top-1 w-3 h-3 rounded-full border-2 border-udaan-bg ${
                      event.status === 'active' ? 'bg-emerald-400' : event.status === 'upcoming' ? 'bg-udaan-cyan' : 'bg-udaan-text-dim'
                    }`} />

                    <div className="glass-card glass-card-hover p-5">
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="text-base font-semibold text-udaan-text">{event.name}</h4>
                            <StatusBadge status={statusMap[event.status] || 'neutral'} label={event.status.toUpperCase()} />
                          </div>
                          <div className="flex flex-wrap items-center gap-3 text-xs text-udaan-text-muted mt-2">
                            <span className="inline-flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              {formatDate(event.startDate)} — {formatDate(event.endDate)}
                            </span>
                            <span className="inline-flex items-center gap-1">
                              <MapPin className="w-3 h-3" />
                              {event.region}
                            </span>
                            <span className="inline-flex items-center gap-1">
                              <TrendingUp className="w-3 h-3" />
                              {event.affectedRoutes.length} affected route{event.affectedRoutes.length !== 1 ? 's' : ''}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-1 rounded text-xs font-medium ${relevanceColors[event.relevance] || relevanceColors.low}`}>
                            {event.relevance.toUpperCase()} relevance
                          </span>
                          <span className="px-2 py-1 rounded text-xs bg-udaan-surface-light text-udaan-text-muted">
                            {event.category}
                          </span>
                        </div>
                      </div>

                      {/* Affected routes */}
                      {event.affectedRoutes.length > 0 && (
                        <div className="mt-3 pt-3 border-t border-udaan-border/30">
                          <span className="text-xs text-udaan-text-dim">Affected routes: </span>
                          <span className="text-xs font-mono text-udaan-text-muted tracking-wider">
                            {event.affectedRoutes.join(' · ')}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
