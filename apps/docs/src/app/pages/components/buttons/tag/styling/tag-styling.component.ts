import { Component, computed } from '@angular/core';
import { TngTag } from '@tailng-ui/ui/primitives';
import { ExampleBlockComponent, TngExampleDemo } from '../../../../../shared/example-block/example-block.component';

@Component({
  standalone: true,
  selector: 'docs-tag-styling',
  templateUrl: './tag-styling.component.html',
  imports: [TngTag, ExampleBlockComponent, TngExampleDemo],
})
export class TagStylingComponent {
  readonly variantsHtml = computed(
    () => `
<tng-tag label="Default" color="default"></tng-tag>
<tng-tag label="Primary" color="primary"></tng-tag>
<tng-tag label="Success" color="success"></tng-tag>
<tng-tag label="Danger" color="danger"></tng-tag>
`,
  );
}
