import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';

// ✅ ALLOWED: own domain data-access
import { KycFacade, OnboardingApplication } from '@banking/kyc/data-access';

// ✅ ALLOWED: shared scope
import { ButtonComponent, BadgeComponent } from '@banking/shared/ui-design-system';
import { isValidNiNumber, isAdult } from '@banking/shared/util-validators';

// ❌ BOUNDARY VIOLATION EXAMPLES (commented out — protected by ESLint):
// import { PaymentsFacade } from '@banking/payments/data-access';
// → Error: scope:kyc notDependOnLibsWithTags blocks scope:payments
//
// import { AccountsFacade } from '@banking/accounts/data-access';
// → Error: scope:kyc notDependOnLibsWithTags blocks scope:accounts
//
// import { LoansFacade } from '@banking/loans/data-access';
// → Error: scope:kyc notDependOnLibsWithTags blocks scope:loans

@Component({
  selector: 'banking-kyc-onboarding',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ButtonComponent, BadgeComponent],
  template: `
    <div class="onboarding-container">
      <h2>Account Onboarding</h2>
      <p class="subtitle">We need to verify your identity to open your account. This is a legal requirement.</p>

      <div *ngIf="facade.onboardingResult() as result" class="result-card">
        <banking-shared-badge variant="info">{{ result.kycStatus }}</banking-shared-badge>
        <h3>Application Received</h3>
        <p>Reference: <strong>{{ result.applicationId }}</strong></p>
        <p>{{ result.nextStep }}</p>
      </div>

      <form *ngIf="!facade.onboardingResult()" [formGroup]="onboardingForm" (ngSubmit)="onSubmit()">
        <fieldset>
          <legend>Personal Details</legend>
          <div class="form-row">
            <div class="form-field">
              <label>First Name</label>
              <input formControlName="firstName" />
            </div>
            <div class="form-field">
              <label>Last Name</label>
              <input formControlName="lastName" />
            </div>
          </div>

          <div class="form-field">
            <label>Date of Birth</label>
            <input type="date" formControlName="dateOfBirth" />
            <span class="error" *ngIf="onboardingForm.get('dateOfBirth')?.errors?.['notAdult']">
              You must be 18 or older to apply.
            </span>
          </div>

          <div class="form-field">
            <label>National Insurance Number</label>
            <input formControlName="nationalInsuranceNumber" placeholder="AB123456C" />
            <span class="error" *ngIf="onboardingForm.get('nationalInsuranceNumber')?.errors?.['invalidNi']">
              Please enter a valid NI number.
            </span>
          </div>
        </fieldset>

        <fieldset>
          <legend>Address</legend>
          <div class="form-field">
            <label>Address Line 1</label>
            <input formControlName="addressLine1" />
          </div>
          <div class="form-field">
            <label>Address Line 2 (optional)</label>
            <input formControlName="addressLine2" />
          </div>
          <div class="form-row">
            <div class="form-field">
              <label>City</label>
              <input formControlName="city" />
            </div>
            <div class="form-field">
              <label>Postcode</label>
              <input formControlName="postcode" />
            </div>
          </div>
        </fieldset>

        <fieldset>
          <legend>Identity Document</legend>
          <div class="form-field">
            <label>Document Type</label>
            <select formControlName="documentType">
              <option value="PASSPORT">Passport</option>
              <option value="DRIVING_LICENCE">Driving Licence</option>
              <option value="NATIONAL_ID">National ID Card</option>
            </select>
          </div>
        </fieldset>

        <banking-shared-button
          type="submit"
          [disabled]="onboardingForm.invalid"
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
    .onboarding-container { max-width: 600px; margin: 0 auto; }
    .subtitle { color: #6b7280; margin-bottom: 2rem; }
    fieldset { border: 1px solid #e5e7eb; border-radius: 8px; padding: 1.25rem; margin-bottom: 1.5rem; }
    legend { font-weight: 700; padding: 0 0.5rem; color: #1a1a2e; }
    .form-field { margin-bottom: 1rem; display: flex; flex-direction: column; gap: 0.25rem; }
    .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
    label { font-weight: 600; font-size: 0.875rem; color: #374151; }
    input, select { padding: 0.625rem; border: 1.5px solid #d1d5db; border-radius: 6px; font-size: 1rem; }
    .error { color: #dc2626; font-size: 0.8rem; }
    .result-card { background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 8px; padding: 1.5rem; }
  `],
})
export class KycOnboardingComponent {
  onboardingForm: FormGroup;

  constructor(
    public facade: KycFacade,
    private fb: FormBuilder
  ) {
    this.onboardingForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      dateOfBirth: ['', [
        Validators.required,
        (c: any) => c.value && !isAdult(c.value) ? { notAdult: true } : null,
      ]],
      nationalInsuranceNumber: ['', [
        Validators.required,
        (c: any) => c.value && !isValidNiNumber(c.value) ? { invalidNi: true } : null,
      ]],
      addressLine1: ['', Validators.required],
      addressLine2: [''],
      city: ['', Validators.required],
      postcode: ['', Validators.required],
      countryCode: ['GB'],
      documentType: ['PASSPORT', Validators.required],
    });
  }

  onSubmit(): void {
    if (this.onboardingForm.invalid) return;
    const application: OnboardingApplication = this.onboardingForm.value;
    this.facade.submitOnboardingApplication(application).subscribe();
  }
}
