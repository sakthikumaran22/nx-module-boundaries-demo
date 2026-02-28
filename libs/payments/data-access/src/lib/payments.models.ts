/**
 * Domain models for the Payments bounded context.
 * These types are part of the public contract of payments/data-access.
 */

export type PaymentStatus =
  | 'PENDING'
  | 'PROCESSING'
  | 'COMPLETED'
  | 'FAILED'
  | 'CANCELLED';

export type PaymentType = 'FASTER_PAYMENT' | 'BACS' | 'CHAPS' | 'INTERNAL';

export interface Payment {
  readonly id: string;
  readonly referenceNumber: string;
  readonly fromAccountId: string;
  readonly toAccountNumber: string;
  readonly toSortCode: string;
  readonly toName: string;
  readonly amount: number;
  readonly currencyCode: string;
  readonly type: PaymentType;
  readonly status: PaymentStatus;
  readonly reference: string;
  readonly createdAt: string;
  readonly completedAt?: string;
}

export interface TransferRequest {
  readonly fromAccountId: string;
  readonly toAccountNumber: string;
  readonly toSortCode: string;
  readonly toName: string;
  readonly amount: number;
  readonly reference: string;
  readonly type: PaymentType;
}

export interface TransferResponse {
  readonly payment: Payment;
  readonly estimatedCompletionTime: string;
}
