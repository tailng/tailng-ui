import { Component, computed, signal } from '@angular/core';
import { TngDrawer } from '@tailng-ui/ui/navigation';
import { ExampleBlockComponent, TngExampleDemo } from '../../../../../shared/example-block/example-block.component';

@Component({
  standalone: true,
  selector: 'docs-drawer-styling',
  templateUrl: './drawer-styling.component.html',
  imports: [TngDrawer, ExampleBlockComponent, TngExampleDemo],
})
export class DrawerStylingComponent {
  readonly open = signal(false);
  readonly panelHtml = computed(
    () => `<tng-drawer panelKlass="bg-bg border-l border-border shadow-xl" sizeKlass="w-72">...</tng-drawer>`,
  );
}
