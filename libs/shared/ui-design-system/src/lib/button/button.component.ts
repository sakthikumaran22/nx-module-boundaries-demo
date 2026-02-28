import { Component, Input, Output, EventEmitter } from '@angular/core';


export type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'ghost';
export type ButtonSize = 'sm' | 'md' | 'lg';

/**
 * @scope shared
 * @type shared
 *
 * Base button component from the banking design system.
 * Contains zero domain logic — purely presentational.
 */
@Component({
  selector: 'banking-shared-button',
  standalone: true,
  imports: [],
  template: `
    <button
      [class]="buttonClasses"
      [disabled]="disabled || loading"
      [type]="type"
      (click)="clicked.emit($event)"
      >
      @if (loading) {
        <span class="spinner" aria-hidden="true"></span>
      }
      <ng-content />
    </button>
    `,
  styles: [`
    button {
      border: none;
      border-radius: 6px;
      cursor: pointer;
      font-weight: 600;
      transition: all 0.2s ease;
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
    }
    button:disabled { opacity: 0.6; cursor: not-allowed; }
    .btn-sm { padding: 0.375rem 0.75rem; font-size: 0.875rem; }
    .btn-md { padding: 0.625rem 1.25rem; font-size: 1rem; }
    .btn-lg { padding: 0.875rem 1.75rem; font-size: 1.125rem; }
    .btn-primary { background: #1a1a2e; color: white; }
    .btn-primary:hover:not(:disabled) { background: #16213e; }
    .btn-secondary { background: transparent; color: #1a1a2e; border: 2px solid #1a1a2e; }
    .btn-danger { background: #e94560; color: white; }
    .btn-ghost { background: transparent; color: #555; }
    .spinner { width: 1em; height: 1em; border: 2px solid currentColor; border-top-color: transparent; border-radius: 50%; animation: spin 0.6s linear infinite; }
    @keyframes spin { to { transform: rotate(360deg); } }
  `],
})
export class ButtonComponent {
  @Input() variant: ButtonVariant = 'primary';
  @Input() size: ButtonSize = 'md';
  @Input() disabled = false;
  @Input() loading = false;
  @Input() type: 'button' | 'submit' | 'reset' = 'button';
  @Output() clicked = new EventEmitter<MouseEvent>();

  get buttonClasses(): string {
    return `btn-${this.size} btn-${this.variant}`;
  }
}
