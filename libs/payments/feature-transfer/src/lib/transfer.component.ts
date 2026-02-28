import { Component, OnInit, inject } from "@angular/core";

import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from "@angular/forms";

// ✅ ALLOWED: importing from own domain's data-access
import { PaymentsFacade, TransferRequest } from "@banking/payments/data-access";

// ✅ ALLOWED: importing from shared scope
import { ButtonComponent } from "@banking/shared/ui-design-system";
import { formatCurrency } from "@banking/shared/util-formatters";
import {
  isValidSortCode,
  isValidAccountNumber,
  isValidTransferAmount,
} from "@banking/shared/util-validators";

// ❌ BOUNDARY VIOLATION EXAMPLES (commented out — these would fail ESLint):
// import { LoanEligibilityService } from '@banking/loans/data-access';
// → Error: scope:payments cannot depend on scope:loans
//
// import { AccountsFacade } from '@banking/accounts/data-access';
// → Error: scope:payments cannot depend on scope:accounts (unless explicitly allowed)
//
// import { AppComponent } from '@banking/banking-portal';
// → Error: type:lib cannot depend on type:app
//
// import { MockPaymentInterceptor } from '@banking/banking-portal-e2e';
// → Error: All projects are forbidden from depending on type:e2e

@Component({
  selector: "banking-payments-transfer",
  standalone: true,
  imports: [ReactiveFormsModule, ButtonComponent],
  template: `
    <div class="transfer-container">
      <h2>Make a Transfer</h2>

      @if (facade.error()) {
        <div class="error-banner">
          {{ facade.error() }}
        </div>
      }

      <form [formGroup]="transferForm" (ngSubmit)="onSubmit()">
        <div class="form-field">
          <label for="toName">Recipient Name</label>
          <input
            id="toName"
            formControlName="toName"
            placeholder="John Smith"
          />
        </div>

        <div class="form-field">
          <label for="toSortCode">Sort Code</label>
          <input
            id="toSortCode"
            formControlName="toSortCode"
            placeholder="12-34-56"
          />
          <span class="hint">Format: XX-XX-XX</span>
        </div>

        <div class="form-field">
          <label for="toAccountNumber">Account Number</label>
          <input
            id="toAccountNumber"
            formControlName="toAccountNumber"
            placeholder="12345678"
          />
        </div>

        <div class="form-field">
          <label for="amount">Amount (£)</label>
          <input
            id="amount"
            type="number"
            formControlName="amount"
            placeholder="0.00"
            min="0.01"
            step="0.01"
          />
          @if (transferForm.get("amount")?.value) {
            <span class="preview">
              {{ formatAmount(transferForm.get("amount")?.value) }}
            </span>
          }
        </div>

        <div class="form-field">
          <label for="reference">Payment Reference</label>
          <input
            id="reference"
            formControlName="reference"
            placeholder="Invoice 1234"
            maxlength="18"
          />
        </div>

        <banking-shared-button
          type="submit"
          [disabled]="transferForm.invalid"
          [loading]="facade.isLoading()"
          variant="primary"
          size="lg"
        >
          Send Payment
        </banking-shared-button>
      </form>
    </div>
  `,
  styles: [
    `
      .transfer-container {
        max-width: 480px;
        margin: 0 auto;
      }
      h2 {
        margin-bottom: 1.5rem;
        color: #1a1a2e;
      }
      .form-field {
        margin-bottom: 1.25rem;
        display: flex;
        flex-direction: column;
        gap: 0.25rem;
      }
      label {
        font-weight: 600;
        font-size: 0.875rem;
        color: #374151;
      }
      input {
        padding: 0.625rem;
        border: 1.5px solid #d1d5db;
        border-radius: 6px;
        font-size: 1rem;
      }
      input:focus {
        outline: none;
        border-color: #1a1a2e;
      }
      .hint {
        font-size: 0.75rem;
        color: #9ca3af;
      }
      .preview {
        font-size: 0.875rem;
        color: #065f46;
        font-weight: 600;
      }
      .error-banner {
        background: #fee2e2;
        color: #991b1b;
        padding: 0.75rem 1rem;
        border-radius: 6px;
        margin-bottom: 1rem;
      }
    `,
  ],
})
export class TransferComponent implements OnInit {
  facade = inject(PaymentsFacade);
  private fb = inject(FormBuilder);

  transferForm!: FormGroup;

  constructor() {}

  ngOnInit(): void {
    this.transferForm = this.fb.group({
      toName: ["", [Validators.required, Validators.minLength(2)]],
      toSortCode: [
        "",
        [
          Validators.required,
          (c: any) =>
            isValidSortCode(c.value) ? null : { invalidSortCode: true },
        ],
      ],
      toAccountNumber: [
        "",
        [
          Validators.required,
          (c: any) =>
            isValidAccountNumber(c.value)
              ? null
              : { invalidAccountNumber: true },
        ],
      ],
      amount: [
        null,
        [
          Validators.required,
          (c: any) =>
            isValidTransferAmount(c.value) ? null : { invalidAmount: true },
        ],
      ],
      reference: ["", [Validators.required, Validators.maxLength(18)]],
    });
  }

  formatAmount(value: number): string {
    return formatCurrency(value, "GBP");
  }

  onSubmit(): void {
    if (this.transferForm.invalid) return;
    const request: TransferRequest = {
      fromAccountId: "acc-001", // In a real app, this comes from the accounts facade
      ...this.transferForm.value,
      type: "FASTER_PAYMENT",
    };
    this.facade.initiateTransfer(request).subscribe();
  }
}
