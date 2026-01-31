import { Component, computed, input } from '@angular/core';
import { TailngFocusTrapDirective } from '@tociva/tailng-cdk';

@Component({
  selector: 'tng-overlay-panel',
  standalone: true,
  imports: [TailngFocusTrapDirective],
  templateUrl: './overlay-panel.component.html',
})
export class TailngOverlayPanelComponent {
  /** Consumer-provided class overrides / extensions */
  readonly klass = input<string>('');

  /**
   * When true, treat panel as modal surface:
   * - trap focus
   * - restore focus on destroy
   * - aria-modal="true"
   */
  readonly modal = input<boolean>(false);

  /** a11y */
  readonly role = input<'dialog' | 'menu' | 'listbox' | 'region' | 'presentation'>('presentation');
  readonly ariaLabel = input<string>('');
  readonly ariaLabelledby = input<string>('');
  readonly ariaDescribedby = input<string>('');

  /** Focus trap options (only meaningful when modal=true) */
  readonly restoreFocus = input<boolean>(true);
  readonly autoCapture = input<boolean>(true);
  readonly deferCaptureElements = input<boolean>(false);

  /** Base themed Tailwind classes */
  private readonly baseClasses =
    'bg-bg text-fg border border-border rounded-md shadow-lg max-h-60 overflow-auto outline-none';

  /** Final merged class string */
  readonly classes = computed(() => `${this.baseClasses} ${this.klass()}`.trim());

  /** For ARIA: only true when modal */
  readonly ariaModal = computed(() => (this.modal() ? 'true' : null));
}
