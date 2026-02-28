export type KycStatus = 'NOT_STARTED' | 'IN_PROGRESS' | 'PENDING_REVIEW' | 'VERIFIED' | 'REJECTED' | 'EXPIRED';
export type DocumentType = 'PASSPORT' | 'DRIVING_LICENCE' | 'NATIONAL_ID' | 'UTILITY_BILL';

export interface KycProfile {
  readonly customerId: string;
  readonly status: KycStatus;
  readonly verificationLevel: 1 | 2 | 3;
  readonly lastVerifiedAt?: string;
  readonly expiresAt?: string;
}

export interface KycDocument {
  readonly id: string;
  readonly documentType: DocumentType;
  readonly status: 'PENDING' | 'ACCEPTED' | 'REJECTED';
  readonly submittedAt: string;
  readonly reviewedAt?: string;
  readonly rejectionReason?: string;
}

export interface OnboardingApplication {
  readonly firstName: string;
  readonly lastName: string;
  readonly dateOfBirth: string;
  readonly nationalInsuranceNumber: string;
  readonly addressLine1: string;
  readonly addressLine2?: string;
  readonly city: string;
  readonly postcode: string;
  readonly countryCode: string;
  readonly documentType: DocumentType;
}

export interface OnboardingResponse {
  readonly applicationId: string;
  readonly kycStatus: KycStatus;
  readonly nextStep: string;
  readonly estimatedCompletionTime: string;
}
