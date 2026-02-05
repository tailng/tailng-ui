import { Component, computed } from '@angular/core';
import { TngMenu, TngMenuItem, TngMenuTemplate } from '@tailng-ui/ui/navigation';
import { ExampleBlockComponent, TngExampleDemo } from '../../../../../shared/example-block/example-block.component';

@Component({
  standalone: true,
  selector: 'docs-menu-examples',
  templateUrl: './menu-examples.component.html',
  imports: [TngMenu, TngMenuItem, TngMenuTemplate, ExampleBlockComponent, TngExampleDemo],
})
export class MenuExamplesComponent {
  readonly basicHtml = computed(
    () => `
<tng-menu>
  <button tngMenuTrigger type="button">Open menu</button>
  <ng-template tngMenuTemplate>
    <button tngMenuItem type="button" class="...">Profile</button>
    <button tngMenuItem type="button" class="...">Settings</button>
    <button tngMenuItem type="button" class="... text-danger">Logout</button>
  </ng-template>
</tng-menu>
`,
  );

  readonly placementHtml = computed(
    () => `
<tng-menu placement="bottom-end" panelKlass="p-1 min-w-48">
  <button tngMenuTrigger>Actions</button>
  <ng-template tngMenuTemplate>...</ng-template>
</tng-menu>
`,
  );

  readonly modalHtml = computed(
    () => `
<tng-menu [modal]="true" panelKlass="p-2 min-w-48">
  <button tngMenuTrigger>Open modal menu</button>
  <ng-template tngMenuTemplate>...</ng-template>
</tng-menu>
`,
  );

  onAction(_action: string): void {}
}
