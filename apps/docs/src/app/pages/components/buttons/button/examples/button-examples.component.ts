import { Component, computed } from '@angular/core';
import { TngButton } from '@tailng-ui/ui/primitives';
import { ExampleBlockComponent, TngExampleDemo } from '../../../../../shared/example-block/example-block.component';

@Component({
  standalone: true,
  selector: 'docs-button-examples',
  templateUrl: './button-examples.component.html',
  imports: [TngButton, ExampleBlockComponent, TngExampleDemo],
})
export class ButtonExamplesComponent {
  readonly variantsHtml = computed(
    () => `
<tng-button variant="solid">Solid</tng-button>
<tng-button variant="outline">Outline</tng-button>
<tng-button variant="ghost">Ghost</tng-button>
`,
  );

  readonly sizesHtml = computed(
    () => `
<tng-button size="sm">Small</tng-button>
<tng-button size="md">Medium</tng-button>
<tng-button size="lg">Large</tng-button>
`,
  );

  readonly statesHtml = computed(
    () => `
<tng-button [disabled]="true">Disabled</tng-button>
<tng-button [loading]="true">Loading…</tng-button>
`,
  );

  readonly blockHtml = computed(
    () => `<tng-button [block]="true">Block button</tng-button>`,
  );
}
