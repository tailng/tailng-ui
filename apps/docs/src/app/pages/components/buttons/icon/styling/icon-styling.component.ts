import { Component, computed } from '@angular/core';
import { TngIcon } from '@tociva/tailng-icons/icon';
import { ExampleBlockComponent, TngExampleDemo } from '../../../../../shared/example-block/example-block.component';

@Component({
  standalone: true,
  selector: 'docs-icon-styling',
  templateUrl: './icon-styling.component.html',
  imports: [TngIcon, ExampleBlockComponent, TngExampleDemo],
})
export class IconStylingComponent {
  readonly klassHtml = computed(
    () => `
<tng-icon name="bootstrapAlarm" klass="text-primary"></tng-icon>
<tng-icon name="bootstrapBell" klass="text-danger text-2xl"></tng-icon>
`,
  );
}
