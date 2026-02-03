import { Component, computed } from '@angular/core';
import { TngMenu, TngMenuItem, TngMenuTemplate } from '@tociva/tailng-ui/navigation';
import { ExampleBlockComponent, TngExampleDemo } from '../../../../../shared/example-block/example-block.component';

@Component({
  standalone: true,
  selector: 'docs-menu-styling',
  templateUrl: './menu-styling.component.html',
  imports: [TngMenu, TngMenuItem, TngMenuTemplate, ExampleBlockComponent, TngExampleDemo],
})
export class MenuStylingComponent {
  readonly panelHtml = computed(
    () => `
<tng-menu
  panelKlass="p-2 min-w-48 rounded-lg border border-border bg-bg shadow-lg"
  triggerKlass="rounded-md bg-primary px-3 py-2 text-sm text-on-primary"
>
  <button tngMenuTrigger type="button">Actions</button>
  <ng-template tngMenuTemplate>...</ng-template>
</tng-menu>
`,
  );
}
