import { Component, computed } from '@angular/core';
import { TngButton } from '@tailng-ui/ui/primitives';
import { ExampleBlockComponent, TngExampleDemo } from '../../../../../shared/example-block/example-block.component';

@Component({
  standalone: true,
  selector: 'docs-button-overview',
  templateUrl: './button-overview.component.html',
  imports: [TngButton, ExampleBlockComponent, TngExampleDemo],
})
export class ButtonOverviewComponent {
  readonly basicHtml = computed(
    () => `
<div class="flex flex-wrap gap-3">
  <tng-button variant="solid">Solid</tng-button>
  <tng-button variant="outline">Outline</tng-button>
  <tng-button variant="ghost">Ghost</tng-button>
</div>
`,
  );

  readonly basicTs = computed(
    () => `
import { TngButton } from '@tailng-ui/ui/primitives';
`,
  );
}
