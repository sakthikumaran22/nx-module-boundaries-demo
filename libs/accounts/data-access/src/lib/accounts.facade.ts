import { Injectable, signal, computed } from '@angular/core';
import { AccountsApiService } from './accounts-api.service';
import { BankAccount, AccountHolder } from './accounts.models';

/**
 * @public — exported from index.ts
 * Single public interface for all accounts domain operations.
 */
@Injectable({ providedIn: 'root' })
export class AccountsFacade {
  private readonly _accounts = signal<BankAccount[]>([]);
  private readonly _selectedAccount = signal<BankAccount | null>(null);
  private readonly _holder = signal<AccountHolder | null>(null);
  private readonly _isLoading = signal(false);
  private readonly _error = signal<string | null>(null);

  readonly accounts = computed(() => this._accounts());
  readonly selectedAccount = computed(() => this._selectedAccount());
  readonly holder = computed(() => this._holder());
  readonly isLoading = computed(() => this._isLoading());
  readonly error = computed(() => this._error());
  readonly totalBalance = computed(() =>
    this._accounts().reduce((sum, acc) => sum + acc.balance, 0)
  );
  readonly activeAccounts = computed(() =>
    this._accounts().filter((a) => a.status === 'ACTIVE')
  );

  constructor(private accountsApi: AccountsApiService) {}

  loadAccounts(customerId: string): void {
    this._isLoading.set(true);
    this.accountsApi.getAccounts(customerId).subscribe({
      next: (accounts) => {
        this._accounts.set(accounts);
        this._isLoading.set(false);
      },
      error: () => {
        this._error.set('Failed to load accounts.');
        this._isLoading.set(false);
      },
    });
  }

  selectAccount(account: BankAccount): void {
    this._selectedAccount.set(account);
  }
}
