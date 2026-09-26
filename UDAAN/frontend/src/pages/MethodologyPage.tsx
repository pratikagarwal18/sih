// Methodology Page — Pipeline visualization and methodology documentation

import React from 'react';
import {
  ArrowDown, Database, FileCheck, Filter, Scale, BarChart3,
  ShieldCheck, LayoutDashboard, Layers, ClipboardCheck, Sparkles,
} from 'lucide-react';
import { PageHeader } from '../components/PageHeader';
import { ADVANCE_PURCHASE_WINDOWS } from '../constants';

const pipelineSteps = [
  { icon: <Database className="w-5 h-5" />, title: 'Source Collection', description: 'Automated web scraping of airline and OTA portals to collect airfare data points across routes, airlines, and advance purchase windows.' },
  { icon: <Layers className="w-5 h-5" />, title: 'Raw Observations', description: 'Individual fare data points stored with full metadata including route, airline, fare class, timestamp, and source identifier.' },
  { icon: <ShieldCheck className="w-5 h-5" />, title: 'Validation', description: 'Automated validation rules to identify anomalies, outliers, and data quality issues in raw observations.' },
  { icon: <Filter className="w-5 h-5" />, title: 'Cleaning', description: 'Removal of duplicate observations, correction of known data issues, and standardization of fare components.' },
  { icon: <ClipboardCheck className="w-5 h-5" />, title: 'Fare Normalization', description: 'Decomposition of total fares into base fare, taxes, UDF, and applicable fees for consistent comparison.' },
  { icon: <Scale className="w-5 h-5" />, title: 'Route Basket', description: 'Selection of representative domestic city pairs based on passenger traffic data from DGCA.' },
  { icon: <Sparkles className="w-5 h-5" />, title: 'Weighting', description: 'Assignment of route weights based on passenger traffic volumes to construct a representative airfare basket.' },
  { icon: <BarChart3 className="w-5 h-5" />, title: 'APIx Computation', description: 'Calculation of the weighted Airfare Price Index (APIx) using the normalized fare observations and route weights.' },
  { icon: <FileCheck className="w-5 h-5" />, title: 'Validation', description: 'Cross-validation of the computed index against available benchmarks and historical data for quality assurance.' },
  { icon: <LayoutDashboard className="w-5 h-5" />, title: 'Dashboard', description: 'Presentation of index values, trends, and analytical insights through the UDAAN intelligence interface.' },
];

const fareComponents = [
  { name: 'Base Fare', description: 'The core ticket price set by the airline for the specific route and fare class.' },
  { name: 'Taxes', description: 'Government-mandated taxes applicable to domestic air travel (GST, etc.).' },
  { name: 'User Development Fee (UDF)', description: 'Airport user development fee charged per passenger at origin and destination airports.' },
  { name: 'Applicable Fees', description: 'Additional charges including fuel surcharge, carrier-imposed charges, and other regulatory fees.' },
];

export const MethodologyPage: React.FC = () => {
  return (
    <div className="space-y-8">
      <PageHeader
        title="Methodology"
        subtitle="How UDAAN measures and computes the Airfare Price Index"
      />

      {/* Pipeline Visualization */}
      <section className="glass-card p-6">
        <h2 className="text-sm font-semibold text-udaan-text-muted uppercase tracking-wider mb-6">
          Data Pipeline
        </h2>
        <div className="relative">
          {pipelineSteps.map((step, index) => (
            <div key={index} className="relative">
              <div className="flex items-start gap-4 p-4 rounded-lg hover:bg-udaan-surface-light/30 transition-colors">
                <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-udaan-cyan-dim flex items-center justify-center text-udaan-cyan">
                  {step.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-mono text-udaan-text-dim">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <h3 className="text-sm font-semibold text-udaan-text uppercase tracking-wider">
                      {step.title}
                    </h3>
                  </div>
                  <p className="text-xs text-udaan-text-muted mt-1 leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
              {index < pipelineSteps.length - 1 && (
                <div className="flex justify-center py-1">
                  <ArrowDown className="w-4 h-4 text-udaan-border" />
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Fare Components */}
      <section className="glass-card p-6">
        <h2 className="text-sm font-semibold text-udaan-text-muted uppercase tracking-wider mb-6">
          Fare Components
        </h2>
        <p className="text-xs text-udaan-text-muted mb-4">
          Each observed fare is decomposed into the following components for consistent analysis:
        </p>

        <div className="space-y-1">
          {fareComponents.map((component, index) => (
            <div key={component.name}>
              <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-udaan-surface-light/30 transition-colors">
                <span className="text-udaan-cyan font-mono text-sm mt-0.5">
                  {index < fareComponents.length - 1 ? '+' : '='}
                </span>
                <div>
                  <h4 className="text-sm font-semibold text-udaan-text">{component.name}</h4>
                  <p className="text-xs text-udaan-text-muted mt-0.5">{component.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 p-3 rounded-lg bg-udaan-cyan-dim border border-udaan-cyan/20">
          <p className="text-xs text-udaan-cyan font-medium">
            Observed Total Fare = Base Fare + Taxes + UDF + Applicable Fees
          </p>
        </div>
      </section>

      {/* Advance Purchase Windows */}
      <section className="glass-card p-6">
        <h2 className="text-sm font-semibold text-udaan-text-muted uppercase tracking-wider mb-6">
          Advance Purchase Windows
        </h2>
        <p className="text-xs text-udaan-text-muted mb-4">
          Fares are observed across multiple advance purchase windows to capture the full price discovery curve:
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {ADVANCE_PURCHASE_WINDOWS.map((window) => (
            <div key={window.label} className="text-center p-4 rounded-lg bg-udaan-surface border border-udaan-border/50">
              <span className="text-2xl font-bold font-mono text-udaan-cyan">{window.label}</span>
              <p className="text-xs text-udaan-text mt-1">{window.days} days advance</p>
              <p className="text-xs text-udaan-text-dim mt-0.5">{window.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Key Definitions */}
      <section className="glass-card p-6">
        <h2 className="text-sm font-semibold text-udaan-text-muted uppercase tracking-wider mb-6">
          Key Definitions
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="p-3 rounded-lg bg-udaan-surface border border-udaan-border/50">
            <span className="font-semibold text-udaan-text">APIx (Airfare Price Index)</span>
            <p className="text-udaan-text-muted mt-1">
              A weighted composite index measuring the movement of domestic airfare prices across representative Indian routes.
            </p>
          </div>
          <div className="p-3 rounded-lg bg-udaan-surface border border-udaan-border/50">
            <span className="font-semibold text-udaan-text">Route Basket</span>
            <p className="text-udaan-text-muted mt-1">
              A curated set of domestic city pairs selected to represent the overall domestic air travel market.
            </p>
          </div>
          <div className="p-3 rounded-lg bg-udaan-surface border border-udaan-border/50">
            <span className="font-semibold text-udaan-text">Base Period</span>
            <p className="text-udaan-text-muted mt-1">
              The reference period against which index values are calculated. The base period index is set to 100.
            </p>
          </div>
          <div className="p-3 rounded-lg bg-udaan-surface border border-udaan-border/50">
            <span className="font-semibold text-udaan-text">Observation</span>
            <p className="text-udaan-text-muted mt-1">
              A single fare data point collected at a specific time for a specific route, airline, and fare class.
            </p>
          </div>
        </div>
      </section>

      {/* Disclaimer */}
      <div className="p-4 rounded-lg bg-udaan-surface border border-udaan-border text-xs text-udaan-text-dim">
        <strong className="text-udaan-text-muted">Methodology Note:</strong> The specific statistical methods,
        weighting schemes, and validation criteria are subject to refinement by the UDAAN research team.
        This page provides a high-level overview of the pipeline architecture and may be updated as
        the methodology is finalized.
      </div>
    </div>
  );
};
