import { Component, computed } from '@angular/core';
import { TngDivider } from '@tailng-ui/ui/layout';
import { TngTag } from '@tailng-ui/ui/primitives';
import { ExampleBlockComponent, TngExampleDemo } from '../../../../../shared/example-block/example-block.component';

@Component({
  standalone: true,
  selector: 'docs-divider-styling',
  templateUrl: './divider-styling.component.html',
  imports: [TngDivider, TngTag, ExampleBlockComponent, TngExampleDemo],
})
export class DividerStylingComponent {
  readonly containerSlotHtml = computed(
    () => `<tng-divider [slot]="{ container: 'max-w-md' }" />`,
  );
  readonly lineSlotHtml = computed(
    () => `<tng-divider [slot]="{ line: 'border-primary' }" />`,
  );
  readonly labelSlotHtml = computed(
    () => `<tng-divider label="Themed" [slot]="{ label: 'text-primary text-xs font-medium' }" />`,
  );
  readonly gapSlotHtml = computed(
    () => `<tng-divider [slot]="{ gap: 'my-8' }" />`,
  );
  readonly thicknessSlotHtml = computed(
    () => `<tng-divider [slot]="{ thickness: 'border-t-2' }" />`,
  );
  readonly verticalHeightSlotHtml = computed(
    () => `<tng-divider orientation="vertical" [slot]="{ verticalHeight: 'h-10', container: 'h-full shrink-0' }" />`,
  );
  readonly combinedSlotHtml = computed(
    () => `<tng-divider label="Styled" [slot]="{
  container: 'max-w-sm',
  line: 'border-primary/50',
  label: 'text-primary font-medium',
  gap: 'my-6',
  thickness: 'border-t-2'
}" />`,
  );
}
