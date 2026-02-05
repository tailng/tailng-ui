import { Component, computed } from '@angular/core';
import { TngIcon } from '@tailng-ui/icons/icon';
import { ExampleBlockComponent, TngExampleDemo } from '../../../../../shared/example-block/example-block.component';

@Component({
  standalone: true,
  selector: 'docs-icon-examples',
  templateUrl: './icon-examples.component.html',
  imports: [TngIcon, ExampleBlockComponent, TngExampleDemo],
})
export class IconExamplesComponent {
  readonly sizeHtml = computed(
    () => `
<tng-icon name="bootstrapAlarm" [size]="20"></tng-icon>
<tng-icon name="bootstrapAlarm" [size]="32"></tng-icon>
<tng-icon name="bootstrapAlarm" size="1.5em"></tng-icon>
`,
  );

  readonly a11yHtml = computed(
    () => `
<tng-icon name="bootstrapBell" [decorative]="false" ariaLabel="Notifications" [size]="24"></tng-icon>
`,
  );
}
