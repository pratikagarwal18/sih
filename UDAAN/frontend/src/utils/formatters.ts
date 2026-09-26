// Formatting utility functions for consistent data display

/**
 * Format a date string to Indian-friendly display format
 * Input: ISO date string (e.g., "2026-09-24T10:30:00Z")
 * Output: "24 Sep 2026"
 */
export function formatDate(dateString: string | null | undefined): string {
  if (!dateString) return '—';
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return '—';
    return date.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  } catch {
    return '—';
  }
}

/**
 * Format a date-time string to Indian-friendly display format
 * Output: "24 Sep 2026, 04:00 PM"
 */
export function formatDateTime(dateString: string | null | undefined): string {
  if (!dateString) return '—';
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return '—';
    return date.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  } catch {
    return '—';
  }
}

/**
 * Format currency in Indian Rupees
 * Output: "₹12,345.00"
 */
export function formatCurrency(
  value: number | null | undefined,
  options?: { minimumFractionDigits?: number; maximumFractionDigits?: number }
): string {
  if (value === null || value === undefined) return '—';
  try {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: options?.minimumFractionDigits ?? 0,
      maximumFractionDigits: options?.maximumFractionDigits ?? 0,
    }).format(value);
  } catch {
    return '—';
  }
}

/**
 * Format a percentage value
 * Input: 0.0534 → Output: "+5.34%"
 */
export function formatPercentage(
  value: number | null | undefined,
  options?: { showSign?: boolean; decimals?: number }
): string {
  if (value === null || value === undefined) return '—';
  const decimals = options?.decimals ?? 2;
  const showSign = options?.showSign ?? true;
  const formatted = Math.abs(value).toFixed(decimals);
  if (showSign) {
    const sign = value > 0 ? '+' : value < 0 ? '-' : '';
    return `${sign}${formatted}%`;
  }
  return `${formatted}%`;
}

/**
 * Format a number with Indian-style grouping
 * Output: "1,23,456"
 */
export function formatNumber(value: number | null | undefined): string {
  if (value === null || value === undefined) return '—';
  try {
    return new Intl.NumberFormat('en-IN').format(value);
  } catch {
    return '—';
  }
}

/**
 * Format an index value (2 decimal places)
 */
export function formatIndex(value: number | null | undefined): string {
  if (value === null || value === undefined) return '—';
  return value.toFixed(2);
}

/**
 * Get a human-readable relative time string
 */
export function formatRelativeTime(dateString: string | null | undefined): string {
  if (!dateString) return '—';
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return '—';
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMinutes = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMinutes < 1) return 'Just now';
    if (diffMinutes < 60) return `${diffMinutes}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return formatDate(dateString);
  } catch {
    return '—';
  }
}
