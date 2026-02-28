export type AccountType = 'CURRENT' | 'SAVINGS' | 'ISA' | 'JOINT';
export type AccountStatus = 'ACTIVE' | 'FROZEN' | 'CLOSED' | 'PENDING';

export interface BankAccount {
  readonly id: string;
  readonly accountNumber: string;
  readonly sortCode: string;
  readonly accountType: AccountType;
  readonly status: AccountStatus;
  readonly balance: number;
  readonly availableBalance: number;
  readonly currencyCode: string;
  readonly openedAt: string;
  readonly alias?: string;
}

export interface AccountHolder {
  readonly customerId: string;
  readonly firstName: string;
  readonly lastName: string;
  readonly email: string;
  readonly phoneNumber: string;
  readonly accounts: BankAccount[];
}

export interface UpdateAccountSettingsRequest {
  readonly accountId: string;
  readonly alias?: string;
}
