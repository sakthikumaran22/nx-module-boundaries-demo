/**
 * Public API Surface for @banking/kyc/data-access
 *
 * KYC is a regulatory domain — its internal workings are strictly encapsulated.
 * ✅ Exported: KycFacade, public types
 * ❌ NOT Exported: KycApiService, internal state, verification logic
 */
export { KycFacade } from './lib/kyc.facade';

export type {
  KycProfile,
  KycStatus,
  KycDocument,
  DocumentType,
  OnboardingApplication,
  OnboardingResponse,
} from './lib/kyc.models';
