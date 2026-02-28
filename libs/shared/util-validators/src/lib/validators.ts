/**
 * @scope shared
 * @type shared
 *
 * Pure validation utilities for banking domain inputs.
 * No dependencies on any other @banking/* library.
 */

/**
 * Validates a UK sort code (6 digits, optionally separated by dashes).
 */
export function isValidSortCode(value: string): boolean {
  return /^\d{2}-?\d{2}-?\d{2}$/.test(value.trim());
}

/**
 * Validates a UK bank account number (8 digits).
 */
export function isValidAccountNumber(value: string): boolean {
  return /^\d{8}$/.test(value.trim());
}

/**
 * Validates that a transfer amount is a positive number with max 2 decimal places.
 */
export function isValidTransferAmount(value: number): boolean {
  if (value <= 0) return false;
  const decimalPart = value.toString().split('.')[1];
  return !decimalPart || decimalPart.length <= 2;
}

/**
 * Validates a National Insurance number format (UK).
 * @example isValidNiNumber('AB123456C') => true
 */
export function isValidNiNumber(value: string): boolean {
  return /^[A-CEGHJ-PR-TW-Z]{2}\d{6}[A-D]$/i.test(value.trim());
}

/**
 * Validates that a date of birth string indicates the person is at least 18.
 */
export function isAdult(dateOfBirthIso: string): boolean {
  const dob = new Date(dateOfBirthIso);
  const today = new Date();
  const age = today.getFullYear() - dob.getFullYear();
  const monthDiff = today.getMonth() - dob.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
    return age - 1 >= 18;
  }
  return age >= 18;
}
