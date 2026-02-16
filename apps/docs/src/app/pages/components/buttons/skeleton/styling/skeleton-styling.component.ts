import { Component, computed } from '@angular/core';
import { TngSkeleton, TngTag } from '@tailng-ui/ui/primitives';
import { ExampleBlockComponent, TngExampleDemo } from '../../../../../shared/example-block/example-block.component';

@Component({
  standalone: true,
  selector: 'docs-skeleton-styling',
  templateUrl: './skeleton-styling.component.html',
  imports: [TngSkeleton, TngTag, ExampleBlockComponent, TngExampleDemo],
})
export class SkeletonStylingComponent {
  readonly containerSlotHtml = computed(
    () => `<tng-skeleton [slot]="{ container: 'bg-border/50' }" />`,
  );

  readonly combinedHtml = computed(
    () => `<tng-skeleton
  widthClass="w-64"
  heightClass="h-6"
  [slot]="{ container: 'bg-alternate-background/70 rounded-lg' }"
/>`,
  );
}
