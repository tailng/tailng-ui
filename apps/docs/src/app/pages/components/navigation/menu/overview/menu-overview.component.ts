import { Component, computed } from '@angular/core';
import { TngMenu, TngMenuItem, TngMenuTemplate } from '@tociva/tailng-ui/navigation';
import { ExampleBlockComponent, TngExampleDemo } from '../../../../../shared/example-block/example-block.component';

@Component({
  standalone: true,
  selector: 'docs-menu-overview',
  templateUrl: './menu-overview.component.html',
  imports: [TngMenu, TngMenuItem, TngMenuTemplate, ExampleBlockComponent, TngExampleDemo],
})
export class MenuOverviewComponent {
  readonly basicHtml = computed(
    () => `
<tng-menu>
  <button tngMenuTrigger type="button" class="...">Open menu</button>
  <ng-template tngMenuTemplate>
    <button tngMenuItem type="button" class="...">Profile</button>
    <button tngMenuItem type="button" class="...">Settings</button>
    <button tngMenuItem type="button" class="...">Logout</button>
  </ng-template>
</tng-menu>
`,
  );

  readonly basicTs = computed(
    () => `import { TngMenu, TngMenuItem, TngMenuTemplate } from '@tociva/tailng-ui/navigation';`,
  );
}
