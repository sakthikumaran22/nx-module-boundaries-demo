export type LoanStatus = 'DRAFT' | 'SUBMITTED' | 'UNDER_REVIEW' | 'APPROVED' | 'REJECTED' | 'ACTIVE' | 'CLOSED';
export type LoanType = 'PERSONAL' | 'MORTGAGE' | 'AUTO' | 'BUSINESS';

export interface Loan {
  readonly id: string;
  readonly customerId: string;
  readonly loanType: LoanType;
  readonly status: LoanStatus;
  readonly principalAmount: number;
  readonly outstandingBalance: number;
  readonly interestRate: number;
  readonly termMonths: number;
  readonly monthlyRepayment: number;
  readonly nextRepaymentDate: string;
  readonly currencyCode: string;
  readonly createdAt: string;
}

export interface LoanApplicationRequest {
  readonly loanType: LoanType;
  readonly requestedAmount: number;
  readonly termMonths: number;
  readonly purpose: string;
  readonly annualIncome: number;
}

export interface LoanApplicationResponse {
  readonly applicationId: string;
  readonly status: LoanStatus;
  readonly estimatedApr: number;
  readonly estimatedMonthlyRepayment: number;
  readonly decisionExpectedBy: string;
}
