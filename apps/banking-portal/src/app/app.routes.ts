import { Route } from '@angular/router';

export const appRoutes: Route[] = [
  {
    path: '',
    redirectTo: 'accounts',
    pathMatch: 'full',
  },
  {
    path: 'accounts',
    loadChildren: () =>
      import('@banking/accounts/feature-dashboard').then(
        (m) => m.ACCOUNTS_DASHBOARD_ROUTES
      ),
  },
  {
    path: 'payments',
    loadChildren: () =>
      import('@banking/payments/feature-transfer').then(
        (m) => m.PAYMENTS_TRANSFER_ROUTES
      ),
  },
  {
    path: 'loans',
    loadChildren: () =>
      import('@banking/loans/feature-apply').then(
        (m) => m.LOANS_APPLY_ROUTES
      ),
  },
  {
    path: 'onboarding',
    loadChildren: () =>
      import('@banking/kyc/feature-onboarding').then(
        (m) => m.KYC_ONBOARDING_ROUTES
      ),
  },
];
