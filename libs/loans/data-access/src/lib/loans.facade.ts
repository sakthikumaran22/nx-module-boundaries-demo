import { Injectable, signal, computed } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { LoansApiService } from './loans-api.service';
import { Loan, LoanApplicationRequest, LoanApplicationResponse } from './loans.models';

/**
 * @public — exported from index.ts
 */
@Injectable({ providedIn: 'root' })
export class LoansFacade {
  private readonly _loans = signal<Loan[]>([]);
  private readonly _isLoading = signal(false);
  private readonly _error = signal<string | null>(null);
  private readonly _applicationResult = signal<LoanApplicationResponse | null>(null);

  readonly loans = computed(() => this._loans());
  readonly isLoading = computed(() => this._isLoading());
  readonly error = computed(() => this._error());
  readonly applicationResult = computed(() => this._applicationResult());
  readonly activeLoans = computed(() =>
    this._loans().filter((l) => l.status === 'ACTIVE')
  );
  readonly totalOutstanding = computed(() =>
    this._loans().reduce((sum, l) => sum + l.outstandingBalance, 0)
  );

  constructor(private loansApi: LoansApiService) {}

  loadLoans(customerId: string): void {
    this._isLoading.set(true);
    this.loansApi.getLoans(customerId).subscribe({
      next: (loans) => { this._loans.set(loans); this._isLoading.set(false); },
      error: () => { this._error.set('Failed to load loans.'); this._isLoading.set(false); },
    });
  }

  applyForLoan(request: LoanApplicationRequest): Observable<LoanApplicationResponse> {
    this._isLoading.set(true);
    return this.loansApi.applyForLoan(request).pipe(
      tap({
        next: (result) => { this._applicationResult.set(result); this._isLoading.set(false); },
        error: () => { this._error.set('Loan application failed.'); this._isLoading.set(false); },
      })
    );
  }
}
