import { Component, Input } from '@angular/core';

export type BadgeVariant = 'success' | 'warning' | 'danger' | 'info' | 'neutral';

/**
 * Status badge used across all domain UIs.
 */
@Component({
  selector: 'banking-shared-badge',
  standalone: true,
  template: `
    <span [class]="'badge badge-' + variant">
      <ng-content />
    </span>
  `,
  styles: [`
    .badge { display: inline-block; padding: 0.25rem 0.625rem; border-radius: 12px; font-size: 0.75rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; }
    .badge-success { background: #d1fae5; color: #065f46; }
    .badge-warning { background: #fef3c7; color: #92400e; }
    .badge-danger { background: #fee2e2; color: #991b1b; }
    .badge-info { background: #dbeafe; color: #1e40af; }
    .badge-neutral { background: #f3f4f6; color: #374151; }
  `],
})
export class BadgeComponent {
  @Input() variant: BadgeVariant = 'neutral';
}
