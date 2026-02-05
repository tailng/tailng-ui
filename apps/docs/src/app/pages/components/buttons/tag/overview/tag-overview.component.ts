import { Component, computed } from '@angular/core';
import { TngTag } from '@tailng-ui/ui/primitives';
import { ExampleBlockComponent, TngExampleDemo } from '../../../../../shared/example-block/example-block.component';

@Component({
  standalone: true,
  selector: 'docs-tag-overview',
  templateUrl: './tag-overview.component.html',
  imports: [TngTag, ExampleBlockComponent, TngExampleDemo],
})
export class TagOverviewComponent {
  readonly basicHtml = computed(
    () => `
<tng-tag label="Default" color="default"></tng-tag>
<tng-tag label="Primary" color="primary"></tng-tag>
<tng-tag label="Success" color="success"></tng-tag>
<tng-tag label="Danger" color="danger"></tng-tag>
`,
  );

  readonly basicTs = computed(
    () => `import { TngTag } from '@tailng-ui/ui/primitives';`,
  );
}
