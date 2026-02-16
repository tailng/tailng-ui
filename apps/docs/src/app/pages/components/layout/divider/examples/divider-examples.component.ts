import { Component, computed } from '@angular/core';
import { TngDivider } from '@tailng-ui/ui/layout';
import { ExampleBlockComponent, TngExampleDemo } from '../../../../../shared/example-block/example-block.component';

@Component({
  standalone: true,
  selector: 'docs-divider-examples',
  templateUrl: './divider-examples.component.html',
  imports: [TngDivider, ExampleBlockComponent, TngExampleDemo],
})
export class DividerExamplesComponent {
  readonly labelHtml = computed(
    () => `
<tng-divider label="OR" />
<tng-divider label="Start" align="start" />
<tng-divider label="End" align="end" />
`,
  );
  readonly verticalHtml = computed(
    () => `
<div class="flex items-center gap-4 h-10">
  <span>Item A</span>
  <tng-divider orientation="vertical" [slot]="{ container: 'h-full shrink-0' }" />
  <span>Item B</span>
</div>
`,
  );
  readonly dashedHtml = computed(
    () => `<tng-divider [dashed]="true" />`,
  );
}
