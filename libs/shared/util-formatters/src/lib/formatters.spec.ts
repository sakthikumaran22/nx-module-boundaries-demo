import {
  formatCurrency,
  formatDate,
  formatSortCode,
  maskAccountNumber,
} from './formatters';

describe('formatCurrency', () => {
  it('should format a GBP amount correctly', () => {
    expect(formatCurrency(1250.5, 'GBP')).toBe('£1,250.50');
  });

  it('should format zero correctly', () => {
    expect(formatCurrency(0, 'GBP')).toBe('£0.00');
  });
});

describe('formatSortCode', () => {
  it('should insert dashes into a raw sort code', () => {
    expect(formatSortCode('123456')).toBe('12-34-56');
  });

  it('should strip non-numeric characters before formatting', () => {
    expect(formatSortCode('12-34-56')).toBe('12-34-56');
  });
});

describe('maskAccountNumber', () => {
  it('should mask all but the last 4 digits', () => {
    expect(maskAccountNumber('12345678')).toBe('****5678');
  });

  it('should return the full number if 4 chars or less', () => {
    expect(maskAccountNumber('1234')).toBe('1234');
  });
});
