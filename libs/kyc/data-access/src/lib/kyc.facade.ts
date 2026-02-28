import { Injectable, signal, computed } from '@angular/core';
import { Observable, of, tap } from 'rxjs';
import { KycProfile, OnboardingApplication, OnboardingResponse, KycStatus } from './kyc.models';

/**
 * @public — exported from index.ts
 *
 * KYC is the most boundary-sensitive domain. It must NEVER import from
 * payments, loans, or accounts. The .eslintrc.json enforces this with
 * explicit notDependOnLibsWithTags constraints for scope:kyc.
 */
@Injectable({ providedIn: 'root' })
export class KycFacade {
  private readonly _profile = signal<KycProfile | null>(null);
  private readonly _isLoading = signal(false);
  private readonly _error = signal<string | null>(null);
  private readonly _onboardingResult = signal<OnboardingResponse | null>(null);

  readonly profile = computed(() => this._profile());
  readonly isLoading = computed(() => this._isLoading());
  readonly error = computed(() => this._error());
  readonly onboardingResult = computed(() => this._onboardingResult());
  readonly isVerified = computed(() => this._profile()?.status === 'VERIFIED');
  readonly kycStatus = computed((): KycStatus => this._profile()?.status ?? 'NOT_STARTED');

  submitOnboardingApplication(
    application: OnboardingApplication
  ): Observable<OnboardingResponse> {
    this._isLoading.set(true);
    // In a real implementation, this would call KycApiService
    const mockResponse: OnboardingResponse = {
      applicationId: `kyc-${Date.now()}`,
      kycStatus: 'PENDING_REVIEW',
      nextStep: 'Document verification will be completed within 24 hours.',
      estimatedCompletionTime: new Date(Date.now() + 86400000).toISOString(),
    };
    return of(mockResponse).pipe(
      tap((result) => {
        this._onboardingResult.set(result);
        this._isLoading.set(false);
      })
    );
  }
}
