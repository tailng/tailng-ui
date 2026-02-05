import { Component, computed, signal } from '@angular/core';
import { TngSidenav, TngSidenavHeaderSlot } from '@tailng-ui/ui/navigation';
import { ExampleBlockComponent, TngExampleDemo } from '../../../../../shared/example-block/example-block.component';

@Component({
  standalone: true,
  selector: 'docs-sidenav-styling',
  templateUrl: './sidenav-styling.component.html',
  imports: [TngSidenav, TngSidenavHeaderSlot, ExampleBlockComponent, TngExampleDemo],
})
export class SidenavStylingComponent {
  readonly collapsed = signal(false);
  readonly widthHtml = computed(
    () => `<tng-sidenav [collapsed]="collapsed()" expandedKlass="w-48" collapsedKlass="w-14">...</tng-sidenav>`,
  );
}
