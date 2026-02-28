import { Injectable, inject } from "@angular/core";
import { Observable } from "rxjs";
import { ApiHttpService } from "@banking/shared/data-access-http";
import {
  Loan,
  LoanApplicationRequest,
  LoanApplicationResponse,
} from "./loans.models";

const LOANS_API = "/api/v1/loans";

/** Internal — not part of the public API */
@Injectable({ providedIn: "root" })
export class LoansApiService {
  private api = inject(ApiHttpService);

  constructor() {}

  getLoans(customerId: string): Observable<Loan[]> {
    return this.api.get<Loan[]>(LOANS_API, { params: { customerId } });
  }

  getLoanById(loanId: string): Observable<Loan> {
    return this.api.get<Loan>(`${LOANS_API}/${loanId}`);
  }

  applyForLoan(
    request: LoanApplicationRequest,
  ): Observable<LoanApplicationResponse> {
    return this.api.post<LoanApplicationResponse>(
      `${LOANS_API}/apply`,
      request,
    );
  }

  makeRepayment(loanId: string, amount: number): Observable<Loan> {
    return this.api.post<Loan>(`${LOANS_API}/${loanId}/repayment`, { amount });
  }
}
