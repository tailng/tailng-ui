import { Component, computed, signal } from '@angular/core';
import { TngDialog, TngDialogCloseReason } from '@tociva/tailng-ui/overlay';
import { ExampleBlockComponent, TngExampleDemo } from '../../../../../shared/example-block/example-block.component';

@Component({
  standalone: true,
  selector: 'docs-dialog-overview',
  templateUrl: './dialog-overview.component.html',
  imports: [TngDialog, ExampleBlockComponent, TngExampleDemo],
})
export class DialogOverviewComponent {
  readonly open = signal(false);

  readonly basicHtml = computed(
    () => `
<button (click)="open.set(true)">Open dialog</button>
<tng-dialog [open]="open()" (closed)="onClosed($event)" ariaLabel="Confirm">
  <div tngDialogHeader class="font-semibold">Confirm</div>
  <p class="text-sm">Are you sure?</p>
  <div tngDialogFooter class="flex justify-end gap-2">
    <button (click)="onClosed('cancel')">Cancel</button>
    <button (click)="onClosed('confirm')">OK</button>
  </div>
</tng-dialog>
`,
  );

  readonly basicTs = computed(
    () => `import { signal } from '@angular/core';
import { TngDialog, TngDialogCloseReason } from '@tociva/tailng-ui/overlay';

// In component:
open = signal(false);
onClosed(reason: TngDialogCloseReason) {
  open.set(false);
  // reason: 'confirm' | 'cancel' | 'escape' | 'outside-click' | 'programmatic'
}`,
  );

  onClosed(_reason: TngDialogCloseReason) {
    this.open.set(false);
  }
}
