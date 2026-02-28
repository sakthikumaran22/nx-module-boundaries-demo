import { Injectable, signal, computed } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { PaymentsApiService } from './payments-api.service';
import {
  Payment,
  TransferRequest,
  TransferResponse,
} from './payments.models';

export interface PaymentsState {
  readonly transactions: Payment[];
  readonly selectedPayment: Payment | null;
  readonly isLoading: boolean;
  readonly error: string | null;
}

/**
 * @public — exported from index.ts
 *
 * The PaymentsFacade is the ONLY public interface for the payments domain.
 * Feature components interact with payments state and operations exclusively
 * through this facade. The underlying API service, state management, and
 * data structures are all private implementation details.
 *
 * This is the Facade pattern applied at the domain boundary level.
 */
@Injectable({ providedIn: 'root' })
export class PaymentsFacade {
  // --- Signals-based state (internal) ---
  private readonly _transactions = signal<Payment[]>([]);
  private readonly _selectedPayment = signal<Payment | null>(null);
  private readonly _isLoading = signal(false);
  private readonly _error = signal<string | null>(null);

  // --- Public read-only computed signals ---
  readonly transactions = computed(() => this._transactions());
  readonly selectedPayment = computed(() => this._selectedPayment());
  readonly isLoading = computed(() => this._isLoading());
  readonly error = computed(() => this._error());
  readonly pendingTransactions = computed(() =>
    this._transactions().filter((t) => t.status === 'PENDING')
  );

  constructor(private paymentsApi: PaymentsApiService) {}

  loadTransactionHistory(accountId: string): void {
    this._isLoading.set(true);
    this._error.set(null);

    this.paymentsApi.getTransactionHistory(accountId).subscribe({
      next: (transactions) => {
        this._transactions.set(transactions);
        this._isLoading.set(false);
      },
      error: (err) => {
        this._error.set('Failed to load transaction history.');
        this._isLoading.set(false);
        console.error('[PaymentsFacade]', err);
      },
    });
  }

  initiateTransfer(request: TransferRequest): Observable<TransferResponse> {
    this._isLoading.set(true);
    return this.paymentsApi.initiateTransfer(request).pipe(
      tap({
        next: (response) => {
          this._transactions.update((txns) => [response.payment, ...txns]);
          this._isLoading.set(false);
        },
        error: () => {
          this._error.set('Transfer failed. Please try again.');
          this._isLoading.set(false);
        },
      })
    );
  }

  selectPayment(payment: Payment): void {
    this._selectedPayment.set(payment);
  }

  clearSelectedPayment(): void {
    this._selectedPayment.set(null);
  }
}
