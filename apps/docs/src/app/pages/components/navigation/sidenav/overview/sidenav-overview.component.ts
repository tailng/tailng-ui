import { Component, computed, signal } from '@angular/core';
import { TngSidenav, TngSidenavFooterSlot, TngSidenavHeaderSlot } from '@tailng-ui/ui/navigation';
import { ExampleBlockComponent, TngExampleDemo } from '../../../../../shared/example-block/example-block.component';

@Component({
  standalone: true,
  selector: 'docs-sidenav-overview',
  templateUrl: './sidenav-overview.component.html',
  imports: [TngSidenav, TngSidenavHeaderSlot, TngSidenavFooterSlot, ExampleBlockComponent, TngExampleDemo],
})
export class SidenavOverviewComponent {
  readonly collapsed = signal(false);

  readonly basicHtml = computed(
    () => `
<tng-sidenav [collapsed]="collapsed()">
  <div tngSidenavHeader class="...">App</div>
  <div class="..."><a>Dashboard</a><a>Settings</a></div>
  <div tngSidenavFooter class="...">v1.0</div>
</tng-sidenav>
<button (click)="collapsed.set(!collapsed())">Toggle</button>
`,
  );

  readonly basicTs = computed(
    () => `import { TngSidenav, TngSidenavHeaderSlot, TngSidenavFooterSlot } from '@tailng-ui/ui/navigation';
collapsed = signal(false);`,
  );
}
