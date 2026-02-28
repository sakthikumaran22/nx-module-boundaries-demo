import { Component } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'banking-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <header class="app-header">
      <h1>NX Banking Portal</h1>
      <nav>
        <a routerLink="/accounts" routerLinkActive="active">Accounts</a>
        <a routerLink="/payments" routerLinkActive="active">Payments</a>
        <a routerLink="/loans" routerLinkActive="active">Loans</a>
        <a routerLink="/onboarding" routerLinkActive="active">Onboarding</a>
      </nav>
    </header>
    <main>
      <router-outlet />
    </main>
  `,
  styles: [`
    .app-header { background: #1a1a2e; color: white; padding: 1rem 2rem; display: flex; justify-content: space-between; align-items: center; }
    nav a { color: white; margin-left: 1.5rem; text-decoration: none; }
    nav a.active { border-bottom: 2px solid #e94560; }
    main { padding: 2rem; }
  `],
})
export class AppComponent {
  title = 'banking-portal';
}
