/**
 * Public API Surface for @banking/accounts/data-access
 *
 * ✅ Exported: AccountsFacade, domain types
 * ❌ NOT Exported: AccountsApiService (internal HTTP layer)
 */
export { AccountsFacade } from './lib/accounts.facade';

export type {
  BankAccount,
  AccountHolder,
  AccountType,
  AccountStatus,
  UpdateAccountSettingsRequest,
} from './lib/accounts.models';
