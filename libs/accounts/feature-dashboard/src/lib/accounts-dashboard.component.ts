import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

// ✅ ALLOWED: own domain data-access
import { AccountsFacade, BankAccount } from '@banking/accounts/data-access';

// ✅ ALLOWED: shared scope
import { BadgeComponent, BadgeVariant } from '@banking/shared/ui-design-system';
import { formatCurrency, maskAccountNumber, formatSortCode } from '@banking/shared/util-formatters';

@Component({
  selector: 'banking-accounts-dashboard',
  standalone: true,
  imports: [CommonModule, BadgeComponent],
  template: `
    <div class="dashboard">
      <div class="dashboard-header">
        <h2>My Accounts</h2>
        <div class="total-balance" *ngIf="!facade.isLoading()">
          Total Balance: <strong>{{ formatAmount(facade.totalBalance(), 'GBP') }}</strong>
        </div>
      </div>

      <div *ngIf="facade.isLoading()" class="loading">Loading your accounts...</div>

      <div class="account-grid" *ngIf="!facade.isLoading()">
        <div
          *ngFor="let account of facade.activeAccounts()"
          class="account-card"
          (click)="selectAccount(account)"
          [class.selected]="facade.selectedAccount()?.id === account.id"
        >
          <div class="account-card-header">
            <span class="account-type">{{ account.accountType }}</span>
            <banking-shared-badge [variant]="getStatusVariant(account)">
              {{ account.status }}
            </banking-shared-badge>
          </div>
          <div class="account-number">
            {{ maskNumber(account.accountNumber) }}
          </div>
          <div class="sort-code">Sort: {{ formatCode(account.sortCode) }}</div>
          <div class="balance">
            <span class="label">Balance</span>
            <span class="amount">{{ formatAmount(account.balance, account.currencyCode) }}</span>
          </div>
          <div class="available-balance">
            Available: {{ formatAmount(account.availableBalance, account.currencyCode) }}
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .dashboard-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; }
    .total-balance { font-size: 1rem; color: #6b7280; }
    .account-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 1.25rem; }
    .account-card { background: white; border-radius: 12px; padding: 1.5rem; box-shadow: 0 1px 4px rgba(0,0,0,0.08); cursor: pointer; border: 2px solid transparent; transition: all 0.2s; }
    .account-card:hover { box-shadow: 0 4px 12px rgba(0,0,0,0.12); }
    .account-card.selected { border-color: #1a1a2e; }
    .account-card-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem; }
    .account-type { font-weight: 700; font-size: 0.875rem; text-transform: uppercase; letter-spacing: 0.05em; color: #374151; }
    .account-number { font-family: monospace; font-size: 1.1rem; letter-spacing: 0.1em; margin-bottom: 0.25rem; }
    .sort-code { font-size: 0.8rem; color: #9ca3af; margin-bottom: 1rem; }
    .balance { display: flex; justify-content: space-between; margin-bottom: 0.25rem; }
    .label { color: #6b7280; }
    .amount { font-weight: 700; font-size: 1.25rem; color: #1a1a2e; }
    .available-balance { font-size: 0.8rem; color: #6b7280; text-align: right; }
  `],
})
export class AccountsDashboardComponent implements OnInit {
  constructor(public facade: AccountsFacade) {}

  ngOnInit(): void {
    this.facade.loadAccounts('customer-001');
  }

  selectAccount(account: BankAccount): void {
    this.facade.selectAccount(account);
  }

  formatAmount(amount: number, currency: string): string {
    return formatCurrency(amount, currency);
  }

  maskNumber(accountNumber: string): string {
    return maskAccountNumber(accountNumber);
  }

  formatCode(sortCode: string): string {
    return formatSortCode(sortCode);
  }

  getStatusVariant(account: BankAccount): BadgeVariant {
    const map: Record<string, BadgeVariant> = {
      ACTIVE: 'success',
      FROZEN: 'warning',
      CLOSED: 'neutral',
      PENDING: 'info',
    };
    return map[account.status] ?? 'neutral';
  }
}
