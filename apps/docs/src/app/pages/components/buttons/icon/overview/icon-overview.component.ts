import { Component, computed } from '@angular/core';
import { TngIcon } from '@tociva/tailng-icons/icon';
import { ExampleBlockComponent, TngExampleDemo } from '../../../../../shared/example-block/example-block.component';

@Component({
  standalone: true,
  selector: 'docs-icon-overview',
  templateUrl: './icon-overview.component.html',
  imports: [TngIcon, ExampleBlockComponent, TngExampleDemo],
})
export class IconOverviewComponent {
  readonly basicHtml = computed(
    () => `
<tng-icon name="bootstrapAlarm" [size]="24" klass="text-primary"></tng-icon>
<tng-icon name="bootstrapBell" size="1.5em" klass="text-fg"></tng-icon>
`,
  );

  readonly basicTs = computed(
    () => `import { TngIcon } from '@tociva/tailng-icons/icon';`,
  );
}
