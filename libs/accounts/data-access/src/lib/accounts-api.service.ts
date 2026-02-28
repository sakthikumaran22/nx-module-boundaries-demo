import { Injectable, inject } from "@angular/core";
import { Observable } from "rxjs";
import { ApiHttpService } from "@banking/shared/data-access-http";
import {
  BankAccount,
  AccountHolder,
  UpdateAccountSettingsRequest,
} from "./accounts.models";

const ACCOUNTS_API = "/api/v1/accounts";

/** Internal — not exported from index.ts */
@Injectable({ providedIn: "root" })
export class AccountsApiService {
  private api = inject(ApiHttpService);

  constructor() {}

  getAccountHolder(customerId: string): Observable<AccountHolder> {
    return this.api.get<AccountHolder>(`${ACCOUNTS_API}/holder/${customerId}`);
  }

  getAccounts(customerId: string): Observable<BankAccount[]> {
    return this.api.get<BankAccount[]>(ACCOUNTS_API, {
      params: { customerId },
    });
  }

  getAccountById(accountId: string): Observable<BankAccount> {
    return this.api.get<BankAccount>(`${ACCOUNTS_API}/${accountId}`);
  }

  updateSettings(
    request: UpdateAccountSettingsRequest,
  ): Observable<BankAccount> {
    return this.api.patch<BankAccount>(
      `${ACCOUNTS_API}/${request.accountId}/settings`,
      request,
    );
  }
}
