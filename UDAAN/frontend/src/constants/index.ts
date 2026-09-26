// Application-wide constants

/**
 * Navigation structure for the sidebar
 */
export const NAV_SECTIONS = [
  {
    label: 'OVERVIEW',
    items: [
      { path: '/', label: 'Overview', icon: 'LayoutDashboard' },
    ],
  },
  {
    label: 'AIRFARE INTELLIGENCE',
    items: [
      { path: '/airfare-index', label: 'Airfare Index', icon: 'TrendingUp' },
      { path: '/routes', label: 'Routes', icon: 'Route' },
      { path: '/fare-explorer', label: 'Fare Explorer', icon: 'Search' },
      { path: '/airlines', label: 'Airlines', icon: 'Plane' },
      { path: '/lead-time', label: 'Lead-Time Analysis', icon: 'Clock' },
    ],
  },
  {
    label: 'CONTEXT',
    items: [
      { path: '/festival-intelligence', label: 'Festival Intelligence', icon: 'Sparkles' },
    ],
  },
  {
    label: 'DATA & TRUST',
    items: [
      { path: '/data-sources', label: 'Data Sources', icon: 'Database' },
      { path: '/validation', label: 'Validation', icon: 'ShieldCheck' },
      { path: '/methodology', label: 'Methodology', icon: 'BookOpen' },
    ],
  },
] as const;

/**
 * Advance purchase windows used in lead-time analysis
 */
export const ADVANCE_PURCHASE_WINDOWS = [
  { days: 1, label: 'T+1', description: 'Same-day / next-day' },
  { days: 7, label: 'T+7', description: 'One week advance' },
  { days: 15, label: 'T+15', description: 'Two weeks advance' },
  { days: 30, label: 'T+30', description: 'One month advance' },
  { days: 45, label: 'T+45', description: 'Six weeks advance' },
];

/**
 * Data source type display labels
 */
export const DATA_SOURCE_TYPE_LABELS: Record<string, string> = {
  airline: 'Airline',
  ota: 'OTA',
  dgca: 'DGCA',
  mospi: 'MoSPI',
  other: 'Other',
};

/**
 * Data source status display labels and colors
 */
export const DATA_SOURCE_STATUS_CONFIG: Record<string, { label: string; colorClass: string }> = {
  connected: { label: 'CONNECTED', colorClass: 'text-emerald-400' },
  degraded: { label: 'DEGRADED', colorClass: 'text-amber-400' },
  unavailable: { label: 'UNAVAILABLE', colorClass: 'text-red-400' },
  not_configured: { label: 'NOT CONFIGURED', colorClass: 'text-slate-500' },
};

/**
 * Chart color palette — aviation-inspired
 */
export const CHART_COLORS = {
  primary: '#06b6d4',     // cyan-500
  secondary: '#3b82f6',   // blue-500
  accent: '#ef4444',      // red-500
  surface: '#1e293b',     // slate-800
  grid: '#334155',        // slate-700
  text: '#94a3b8',        // slate-400
  textBright: '#e2e8f0',  // slate-200
  positive: '#10b981',    // emerald-500
  negative: '#ef4444',    // red-500
  neutral: '#64748b',     // slate-500
};

/**
 * Period selector options
 */
export const PERIOD_OPTIONS = [
  { value: 'daily', label: 'Daily' },
  { value: 'weekly', label: 'Weekly' },
  { value: 'monthly', label: 'Monthly' },
] as const;
