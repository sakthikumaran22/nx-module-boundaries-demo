/**
 * @scope shared
 * @type shared
 *
 * Pure, stateless formatting utilities used across all domains.
 * This library has no imports from any other @banking/* library.
 * It is the foundation layer of the workspace.
 */

/**
 * Formats a numeric amount into a localized currency string.
 * @example formatCurrency(1250.5, 'GBP') => '£1,250.50'
 */
export function formatCurrency(
  amount: number,
  currencyCode = 'GBP',
  locale = 'en-GB'
): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currencyCode,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

/**
 * Formats an ISO date string into a human-readable date.
 * @example formatDate('2024-01-15T10:30:00Z') => '15 Jan 2024'
 */
export function formatDate(
  isoString: string,
  locale = 'en-GB',
  options: Intl.DateTimeFormatOptions = {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }
): string {
  return new Intl.DateTimeFormat(locale, options).format(new Date(isoString));
}

/**
 * Formats a sortcode string with dashes.
 * @example formatSortCode('123456') => '12-34-56'
 */
export function formatSortCode(raw: string): string {
  const digits = raw.replace(/\D/g, '');
  return digits.replace(/(\d{2})(\d{2})(\d{2})/, '$1-$2-$3');
}

/**
 * Masks all but the last 4 characters of an account number.
 * @example maskAccountNumber('12345678') => '****5678'
 */
export function maskAccountNumber(accountNumber: string): string {
  if (accountNumber.length <= 4) return accountNumber;
  const visible = accountNumber.slice(-4);
  const masked = '*'.repeat(accountNumber.length - 4);
  return `${masked}${visible}`;
}
