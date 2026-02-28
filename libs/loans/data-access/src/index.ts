/**
 * Public API Surface for @banking/loans/data-access
 *
 * ✅ Exported: LoansFacade, domain types
 * ❌ NOT Exported: LoansApiService (internal HTTP layer)
 */
export { LoansFacade } from './lib/loans.facade';

export type {
  Loan,
  LoanStatus,
  LoanType,
  LoanApplicationRequest,
  LoanApplicationResponse,
} from './lib/loans.models';
