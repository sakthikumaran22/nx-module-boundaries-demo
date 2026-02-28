import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiHttpService } from '@banking/shared/data-access-http';
import { Payment, TransferRequest, TransferResponse } from './payments.models';

const PAYMENTS_API = '/api/v1/payments';

/**
 * Internal HTTP service for the payments domain.
 * This class is NOT exported from the library's index.ts.
 * External consumers must go through PaymentsFacade.
 */
@Injectable({ providedIn: 'root' })
export class PaymentsApiService {
  constructor(private api: ApiHttpService) {}

  initiateTransfer(request: TransferRequest): Observable<TransferResponse> {
    return this.api.post<TransferResponse>(`${PAYMENTS_API}/transfer`, request);
  }

  getPaymentById(paymentId: string): Observable<Payment> {
    return this.api.get<Payment>(`${PAYMENTS_API}/${paymentId}`);
  }

  getTransactionHistory(accountId: string): Observable<Payment[]> {
    return this.api.get<Payment[]>(`${PAYMENTS_API}/history`, {
      params: { accountId },
    });
  }

  cancelPayment(paymentId: string): Observable<Payment> {
    return this.api.patch<Payment>(`${PAYMENTS_API}/${paymentId}/cancel`, {});
  }
}
