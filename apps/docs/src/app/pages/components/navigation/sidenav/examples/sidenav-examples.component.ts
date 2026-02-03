import { Component, computed, signal } from '@angular/core';
import { TngSidenav, TngSidenavFooterSlot, TngSidenavHeaderSlot } from '@tociva/tailng-ui/navigation';
import { ExampleBlockComponent, TngExampleDemo } from '../../../../../shared/example-block/example-block.component';

@Component({
  standalone: true,
  selector: 'docs-sidenav-examples',
  templateUrl: './sidenav-examples.component.html',
  imports: [TngSidenav, TngSidenavHeaderSlot, TngSidenavFooterSlot, ExampleBlockComponent, TngExampleDemo],
})
export class SidenavExamplesComponent {
  readonly collapsed = signal(false);
  readonly minimalHtml = computed(
    () => `
<tng-sidenav>
  <div class="p-3 font-medium">Nav</div>
  <div class="..."><a>Dashboard</a><a>Settings</a></div>
</tng-sidenav>
`,
  );
  readonly collapsibleHtml = computed(
    () => `
<tng-sidenav [collapsed]="collapsed()">
  <div tngSidenavHeader class="... group-data-[collapsed=true]:max-h-0">App</div>
  ...
  <div tngSidenavFooter class="...">Footer</div>
</tng-sidenav>
`,
  );
}
