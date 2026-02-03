import { Component, computed, signal } from '@angular/core';
import { TngDialog, TngDialogCloseReason, TngDialogInitialFocus } from '@tociva/tailng-ui/overlay';
import { ExampleBlockComponent, TngExampleDemo } from '../../../../../shared/example-block/example-block.component';

@Component({
  standalone: true,
  selector: 'docs-dialog-examples',
  templateUrl: './dialog-examples.component.html',
  imports: [TngDialog, TngDialogInitialFocus, ExampleBlockComponent, TngExampleDemo],
})
export class DialogExamplesComponent {
  readonly open = signal(false);
  readonly openNoEscape = signal(false);
  readonly lastReason = signal<TngDialogCloseReason | null>(null);

  readonly confirmHtml = computed(
    () => `
<button (click)="open.set(true)">Open dialog</button>
<tng-dialog [open]="open()" (closed)="onClosed($event)" ariaLabel="Confirm action">
  <div tngDialogHeader class="flex items-center justify-between">
    <span class="font-semibold">Confirm action</span>
    <button (click)="onClosed('cancel')" aria-label="Close">✕</button>
  </div>
  <p>Are you sure you want to continue?</p>
  <div tngDialogFooter class="flex justify-end gap-2">
    <button (click)="onClosed('cancel')">Cancel</button>
    <button tngDialogInitialFocus (click)="onClosed('confirm')">Confirm</button>
  </div>
</tng-dialog>
`,
  );

  readonly confirmTs = computed(
    () => `open = signal(false);
lastReason = signal<TngDialogCloseReason | null>(null);

onClosed(reason: TngDialogCloseReason) {
  this.open.set(false);
  this.lastReason.set(reason);
}`,
  );

  readonly noEscapeHtml = computed(
    () => `
<tng-dialog [open]="open()" (closed)="open.set(false)" [closeOnEscape]="false">
  <div tngDialogHeader>Close via backdrop or button</div>
  <p>Escape key will not close this dialog.</p>
  <div tngDialogFooter>
    <button (click)="open.set(false)">Close</button>
  </div>
</tng-dialog>
`,
  );

  onClosed(reason: TngDialogCloseReason) {
    this.open.set(false);
    this.lastReason.set(reason);
  }
}
