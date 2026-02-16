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

  readonly containerSlotHtml = computed(
    () => `<tng-tag label="Custom" [slot]="{ container: 'shadow-md ring-1 ring-gray-200' }"></tng-tag>`,
  );

  readonly combinedSlotHtml = computed(
    () => `<tng-tag
  label="Rounded pill"
  color="primary"
  [slot]="{ container: 'rounded-full px-4' }">
</tng-tag>`,
  );
}
