import { Component, computed } from '@angular/core';
import { TngSkeleton } from '@tailng-ui/ui/primitives';
import { ExampleBlockComponent, TngExampleDemo } from '../../../../../shared/example-block/example-block.component';

@Component({
  standalone: true,
  selector: 'docs-skeleton-overview',
  templateUrl: './skeleton-overview.component.html',
  imports: [TngSkeleton, ExampleBlockComponent, TngExampleDemo],
})
export class SkeletonOverviewComponent {
  readonly basicHtml = computed(
    () => `
<tng-skeleton />
<tng-skeleton variant="circular" widthClass="w-12" heightClass="h-12" />
<tng-skeleton variant="rectangular" heightClass="h-32" [slot]="{ container: 'bg-border/50' }" />
`,
  );

  readonly basicTs = computed(
    () => `
import { TngSkeleton } from '@tailng-ui/ui/primitives';

// Text line (default)
<tng-skeleton />

// Circular avatar placeholder
<tng-skeleton variant="circular" widthClass="w-12" heightClass="h-12" />

// Rectangular card with slot override
<tng-skeleton variant="rectangular" heightClass="h-32" [slot]="{ container: 'bg-border/50' }" />
`,
  );
}
