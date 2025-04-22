import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Combines multiple class names and allows for conditional class application
 * with Tailwind CSS support
 */
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

/**
 * Format a number as currency with dollar sign and 2 decimal places
 */
export function formatCurrency(value) {
  if (value === null || value === undefined) return '$0.00';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

/**
 * Format a number as a percentage with 2 decimal places and % sign
 */
export function formatPercent(value) {
  if (value === null || value === undefined) return '0.00%';
  return new Intl.NumberFormat('en-US', {
    style: 'percent',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value / 100);
}

/**
 * Determine price movement styling class
 */
export function getPriceChangeClass(change) {
  if (change > 0) return 'price-up';
  if (change < 0) return 'price-down';
  return 'text-gray-500';
}

/**
 * Get formatted price change with sign
 */
export function getFormattedPriceChange(change) {
  if (!change) return '+0.00';
  const sign = change > 0 ? '+' : '';
  return `${sign}${change.toFixed(2)}`;
}

/**
 * Shorten large numbers for display
 */
export function shortNumber(num) {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }
  return num.toString();
}
