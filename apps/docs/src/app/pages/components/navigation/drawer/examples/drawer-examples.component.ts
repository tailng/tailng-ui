import { Component, computed, signal } from '@angular/core';
import { TngDrawer } from '@tailng-ui/ui/navigation';
import { ExampleBlockComponent, TngExampleDemo } from '../../../../../shared/example-block/example-block.component';

@Component({
  standalone: true,
  selector: 'docs-drawer-examples',
  templateUrl: './drawer-examples.component.html',
  imports: [TngDrawer, ExampleBlockComponent, TngExampleDemo],
})
export class DrawerExamplesComponent {
  readonly open = signal(false);
  readonly openRight = signal(false);
  readonly openBottom = signal(false);
  readonly leftHtml = computed(
    () => `
<tng-drawer [open]="open()" (closed)="open.set(false)" placement="left">
  <div class="p-4">... <button (click)="open.set(false)">Close</button></div>
</tng-drawer>
`,
  );
  readonly placementHtml = computed(
    () => `
<tng-drawer [open]="open()" (closed)="open.set(false)" placement="right">...</tng-drawer>
<tng-drawer [open]="open()" (closed)="open.set(false)" placement="bottom" heightKlass="h-48">...</tng-drawer>
`,
  );
}
