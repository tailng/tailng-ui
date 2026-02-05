import { Component, computed, signal } from '@angular/core';
import { TngDialog } from '@tailng-ui/ui/overlay';
import { ExampleBlockComponent, TngExampleDemo } from '../../../../../shared/example-block/example-block.component';

@Component({
  standalone: true,
  selector: 'docs-dialog-styling',
  templateUrl: './dialog-styling.component.html',
  imports: [TngDialog, ExampleBlockComponent, TngExampleDemo],
})
export class DialogStylingComponent {
  readonly open = signal(false);
  readonly open2 = signal(false);

  readonly panelHtml = computed(
    () => `
<tng-dialog
  [open]="open()"
  (closed)="open.set(false)"
  backdropKlass="fixed inset-0 bg-primary/20"
  panelKlass="... w-80 rounded-xl border-2 border-primary ..."
>
  ...
</tng-dialog>
`,
  );

  readonly headerFooterHtml = computed(
    () => `
<tng-dialog
  headerWrapKlass="border-b border-primary bg-primary/10 px-4 py-3"
  footerWrapKlass="border-t border-primary px-4 py-3 flex justify-end gap-2"
>
  ...
</tng-dialog>
`,
  );
}
