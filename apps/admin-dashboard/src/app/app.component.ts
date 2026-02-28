import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

/**
 * Admin Dashboard — Internal operations interface.
 * This app consumes all domain libs (payments, loans, accounts, kyc)
 * for admin/operations use cases.
 *
 * It is tagged scope:admin, type:app.
 * It follows the same boundary rules as banking-portal.
 */
@Component({
  selector: 'banking-admin-root',
  standalone: true,
  imports: [RouterOutlet],
  template: `
    <header style="background:#0f172a; color:white; padding:1rem 2rem;">
      <h1>Banking Admin Dashboard</h1>
    </header>
    <main style="padding:2rem;">
      <router-outlet />
    </main>
  `,
})
export class AppComponent {}
