import { Component, OnInit, Input, inject } from "@angular/core";

// ✅ ALLOWED: own domain data-access
import { PaymentsFacade, Payment } from "@banking/payments/data-access";

// ✅ ALLOWED: shared design system and utilities
import { BadgeComponent, BadgeVariant } from "@banking/shared/ui-design-system";
import {
  formatCurrency,
  formatDate,
  maskAccountNumber,
} from "@banking/shared/util-formatters";

@Component({
  selector: "banking-payments-transaction-history",
  standalone: true,
  imports: [BadgeComponent],
  template: `
    <div class="history-container">
      <h2>Transaction History</h2>

      @if (facade.isLoading()) {
        <div class="loading">Loading transactions...</div>
      }

      @if (!facade.isLoading() && facade.transactions().length === 0) {
        <div class="empty">No transactions found.</div>
      }

      @if (facade.transactions().length > 0) {
        <ul class="transaction-list">
          @for (txn of facade.transactions(); track txn) {
            <li class="transaction-item">
              <div class="txn-left">
                <span class="txn-name">{{ txn.toName }}</span>
                <span class="txn-account">{{
                  maskAccount(txn.toAccountNumber)
                }}</span>
                <span class="txn-date">{{ formatDate(txn.createdAt) }}</span>
              </div>
              <div class="txn-right">
                <span class="txn-amount">{{
                  formatAmount(txn.amount, txn.currencyCode)
                }}</span>
                <banking-shared-badge [variant]="getStatusVariant(txn)">
                  {{ txn.status }}
                </banking-shared-badge>
              </div>
            </li>
          }
        </ul>
      }
    </div>
  `,
  styles: [
    `
      .history-container {
        max-width: 720px;
      }
      .transaction-list {
        list-style: none;
        padding: 0;
        margin: 0;
      }
      .transaction-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 1rem;
        border-bottom: 1px solid #e5e7eb;
      }
      .txn-left {
        display: flex;
        flex-direction: column;
        gap: 0.125rem;
      }
      .txn-name {
        font-weight: 600;
      }
      .txn-account,
      .txn-date {
        font-size: 0.8rem;
        color: #6b7280;
      }
      .txn-right {
        display: flex;
        flex-direction: column;
        align-items: flex-end;
        gap: 0.25rem;
      }
      .txn-amount {
        font-weight: 700;
        font-size: 1.1rem;
      }
      .loading,
      .empty {
        padding: 2rem;
        text-align: center;
        color: #6b7280;
      }
    `,
  ],
})
export class TransactionHistoryComponent implements OnInit {
  @Input() accountId = "acc-001";

  constructor() {}

  public facade = inject(PaymentsFacade);

  ngOnInit(): void {
    this.facade.loadTransactionHistory(this.accountId);
  }

  formatAmount(amount: number, currency: string): string {
    return formatCurrency(amount, currency);
  }

  formatDate(iso: string): string {
    return formatDate(iso);
  }

  maskAccount(accountNumber: string): string {
    return maskAccountNumber(accountNumber);
  }

  getStatusVariant(payment: Payment): BadgeVariant {
    const map: Record<string, BadgeVariant> = {
      COMPLETED: "success",
      PENDING: "warning",
      PROCESSING: "info",
      FAILED: "danger",
      CANCELLED: "neutral",
    };
    return map[payment.status] ?? "neutral";
  }
}
