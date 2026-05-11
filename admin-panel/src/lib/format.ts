import { CURRENCY_SYMBOLS } from '@lendlove/shared';

export function formatMoney(amount: number, currency = 'USD'): string {
  const symbol = CURRENCY_SYMBOLS[currency] ?? '$';
  return `${symbol}${amount.toLocaleString('en-US', { maximumFractionDigits: 2 })}`;
}

export function formatDate(ms: number | undefined): string {
  if (!ms) return '—';
  return new Date(ms).toLocaleDateString('en-US', {
    month: 'short',
    day: '2-digit',
    year: 'numeric',
  });
}

export function formatDateTime(ms: number | undefined): string {
  if (!ms) return '—';
  return new Date(ms).toLocaleString('en-US', {
    month: 'short',
    day: '2-digit',
    hour: 'numeric',
    minute: '2-digit',
  });
}
