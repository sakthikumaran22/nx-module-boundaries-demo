/**
 * Public API Surface for @banking/payments/data-access
 *
 * ✅ Exported (Public Contract):
 *   - PaymentsFacade     → the single interface for all payments operations
 *   - Domain models/types → shared type contracts for the feature layer
 *
 * ❌ NOT Exported (Private Implementation):
 *   - PaymentsApiService → internal HTTP layer; consumers use the facade
 *
 * This distinction is intentional. If you need to call a payment API directly,
 * the architecture is telling you something is wrong with your design.
 */
export { PaymentsFacade } from './lib/payments.facade';
export type { PaymentsState } from './lib/payments.facade';

export type {
  Payment,
  PaymentStatus,
  PaymentType,
  TransferRequest,
  TransferResponse,
} from './lib/payments.models';
