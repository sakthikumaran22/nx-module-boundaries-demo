import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';

// ✅ ALLOWED: own domain data-access
import { LoansFacade, LoanApplicationRequest } from '@banking/loans/data-access';

// ✅ ALLOWED: shared scope
import { ButtonComponent } from '@banking/shared/ui-design-system';
import { formatCurrency } from '@banking/shared/util-formatters';

// ❌ BOUNDARY VIOLATION EXAMPLES (commented out):
// import { PaymentsFacade } from '@banking/payments/data-access';
// → Error: scope:loans cannot depend on scope:payments
//
// import { KycFacade } from '@banking/kyc/data-access';
// → Error: scope:loans cannot depend on scope:kyc

@Component({
  selector: 'banking-loans-apply',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ButtonComponent],
  template: `
    <div class="apply-container">
      <h2>Apply for a Loan</h2>

      <div *ngIf="facade.applicationResult() as result" class="success-banner">
        <h3>Application Submitted!</h3>
        <p>Application ID: <strong>{{ result.applicationId }}</strong></p>
        <p>Estimated APR: <strong>{{ result.estimatedApr }}%</strong></p>
        <p>Estimated Monthly Repayment: <strong>{{ formatAmount(result.estimatedMonthlyRepayment) }}</strong></p>
        <p>Decision expected by: <strong>{{ result.decisionExpectedBy }}</strong></p>
      </div>

      <form *ngIf="!facade.applicationResult()" [formGroup]="loanForm" (ngSubmit)="onSubmit()">
        <div class="form-field">
          <label>Loan Type</label>
          <select formControlName="loanType">
            <option value="PERSONAL">Personal Loan</option>
            <option value="AUTO">Auto Loan</option>
            <option value="MORTGAGE">Mortgage</option>
            <option value="BUSINESS">Business Loan</option>
          </select>
        </div>

        <div class="form-field">
          <label>Requested Amount (£)</label>
          <input type="number" formControlName="requestedAmount" min="1000" max="100000" step="500" />
          <span class="hint" *ngIf="loanForm.get('requestedAmount')?.value">
            {{ formatAmount(loanForm.get('requestedAmount')?.value) }}
          </span>
        </div>

        <div class="form-field">
          <label>Repayment Term</label>
          <select formControlName="termMonths">
            <option value="12">12 months</option>
            <option value="24">24 months</option>
            <option value="36">36 months</option>
            <option value="48">48 months</option>
            <option value="60">60 months</option>
          </select>
        </div>

        <div class="form-field">
          <label>Annual Income (£)</label>
          <input type="number" formControlName="annualIncome" min="0" step="1000" />
        </div>

        <div class="form-field">
          <label>Purpose</label>
          <textarea formControlName="purpose" rows="3" placeholder="Briefly describe the purpose of this loan..."></textarea>
        </div>

        <banking-shared-button
          type="submit"
          [disabled]="loanForm.invalid"
          [loading]="facade.isLoading()"
          variant="primary"
          size="lg"
        >
          Submit Application
        </banking-shared-button>
      </form>
    </div>
  `,
  styles: [`
    .apply-container { max-width: 520px; margin: 0 auto; }
    .form-field { margin-bottom: 1.25rem; display: flex; flex-direction: column; gap: 0.25rem; }
    label { font-weight: 600; font-size: 0.875rem; color: #374151; }
    input, select, textarea { padding: 0.625rem; border: 1.5px solid #d1d5db; border-radius: 6px; font-size: 1rem; }
    .hint { font-size: 0.875rem; color: #065f46; font-weight: 600; }
    .success-banner { background: #d1fae5; border-radius: 8px; padding: 1.5rem; margin-bottom: 1rem; }
  `],
})
export class LoanApplyComponent {
  loanForm: FormGroup;

  constructor(
    public facade: LoansFacade,
    private fb: FormBuilder
  ) {
    this.loanForm = this.fb.group({
      loanType: ['PERSONAL', Validators.required],
      requestedAmount: [null, [Validators.required, Validators.min(1000)]],
      termMonths: [24, Validators.required],
      annualIncome: [null, [Validators.required, Validators.min(0)]],
      purpose: ['', [Validators.required, Validators.minLength(10)]],
    });
  }

  formatAmount(value: number): string {
    return formatCurrency(value, 'GBP');
  }

  onSubmit(): void {
    if (this.loanForm.invalid) return;
    const request: LoanApplicationRequest = this.loanForm.value;
    this.facade.applyForLoan(request).subscribe();
  }
}
