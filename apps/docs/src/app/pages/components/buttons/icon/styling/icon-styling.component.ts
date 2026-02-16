import { Component, computed } from '@angular/core';
import { TngIcon } from '@tailng-ui/icons/icon';
import { TngTag } from '@tailng-ui/ui/primitives';
import { ExampleBlockComponent, TngExampleDemo } from '../../../../../shared/example-block/example-block.component';

@Component({
  standalone: true,
  selector: 'docs-icon-styling',
  templateUrl: './icon-styling.component.html',
  imports: [TngIcon, TngTag, ExampleBlockComponent, TngExampleDemo],
})
export class IconStylingComponent {
  readonly iconSlotHtml = computed(
    () => `<tng-icon name="bootstrapAlarm" [slot]="{ icon: 'text-primary' }"></tng-icon>
<tng-icon name="bootstrapBell" [slot]="{ icon: 'text-danger text-2xl' }"></tng-icon>`,
  );

  readonly combinedSlotHtml = computed(
    () => `<tng-icon
  name="bootstrapCheck"
  size="1.5em"
  [slot]="{ icon: 'text-success ring-2 ring-success/30 rounded-full p-1' }">
</tng-icon>`,
  );
}
