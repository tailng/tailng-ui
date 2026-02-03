import { Component, computed } from '@angular/core';
import { TngTag } from '@tociva/tailng-ui/primitives';
import { ExampleBlockComponent, TngExampleDemo } from '../../../../../shared/example-block/example-block.component';

@Component({
  standalone: true,
  selector: 'docs-tag-examples',
  templateUrl: './tag-examples.component.html',
  imports: [TngTag, ExampleBlockComponent, TngExampleDemo],
})
export class TagExamplesComponent {
  readonly colorsHtml = computed(
    () => `
<tng-tag label="Default" color="default"></tng-tag>
<tng-tag label="Primary" color="primary"></tng-tag>
<tng-tag label="Success" color="success"></tng-tag>
<tng-tag label="Danger" color="danger"></tng-tag>
`,
  );

  readonly disabledHtml = computed(
    () => `<tng-tag label="Disabled tag" [disabled]="true"></tng-tag>`,
  );
}
