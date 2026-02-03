import { Component, computed, signal } from '@angular/core';
import { TngDrawer } from '@tociva/tailng-ui/navigation';
import { ExampleBlockComponent, TngExampleDemo } from '../../../../../shared/example-block/example-block.component';

@Component({
  standalone: true,
  selector: 'docs-drawer-overview',
  templateUrl: './drawer-overview.component.html',
  imports: [TngDrawer, ExampleBlockComponent, TngExampleDemo],
})
export class DrawerOverviewComponent {
  readonly open = signal(false);
  readonly basicHtml = computed(
    () => `
<button (click)="open.set(true)">Open drawer</button>
<tng-drawer [open]="open()" (closed)="open.set(false)" placement="right">
  <div class="p-4">... <button (click)="open.set(false)">Close</button></div>
</tng-drawer>
`,
  );
  readonly basicTs = computed(
    () => `import { TngDrawer } from '@tociva/tailng-ui/navigation';
open = signal(false);`,
  );
}
