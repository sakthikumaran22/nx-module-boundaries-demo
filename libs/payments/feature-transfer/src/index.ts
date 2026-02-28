import { Route } from '@angular/router';
import { TransferComponent } from './lib/transfer.component';

export const PAYMENTS_TRANSFER_ROUTES: Route[] = [
  {
    path: '',
    component: TransferComponent,
  },
];
