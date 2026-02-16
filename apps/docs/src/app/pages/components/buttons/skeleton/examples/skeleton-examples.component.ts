import { Component, computed } from '@angular/core';
import { TngSkeleton } from '@tailng-ui/ui/primitives';
import { ExampleBlockComponent, TngExampleDemo } from '../../../../../shared/example-block/example-block.component';

@Component({
  standalone: true,
  selector: 'docs-skeleton-examples',
  templateUrl: './skeleton-examples.component.html',
  imports: [TngSkeleton, ExampleBlockComponent, TngExampleDemo],
})
export class SkeletonExamplesComponent {
  readonly textHtml = computed(
    () => `
<tng-skeleton />
<tng-skeleton widthClass="w-2/3" heightClass="h-4" />
`,
  );

  readonly circularHtml = computed(
    () => `
<tng-skeleton variant="circular" widthClass="w-12" heightClass="h-12" />
<tng-skeleton variant="circular" widthClass="w-16" heightClass="h-16" />
`,
  );

  readonly rectangularHtml = computed(
    () => `
<tng-skeleton variant="rectangular" heightClass="h-32" />
<tng-skeleton variant="rectangular" widthClass="w-24" heightClass="h-8" />
`,
  );

  readonly shimmerHtml = computed(
    () => `
<tng-skeleton [shimmer]="true" />
<tng-skeleton [shimmer]="true" variant="circular" widthClass="w-10" heightClass="h-10" />
`,
  );

  readonly slotHtml = computed(
    () => `
<tng-skeleton [slot]="{ container: 'bg-border/50' }" />
<tng-skeleton [slot]="{ container: 'bg-alternate-background/70' }" widthClass="w-1/2" />
`,
  );

  readonly profileLayoutHtml = computed(
    () => `
<div class="flex items-center gap-4">
  <tng-skeleton variant="circular" widthClass="w-12" heightClass="h-12" />
  <div class="flex-1 space-y-2">
    <tng-skeleton widthClass="w-1/3" heightClass="h-4" />
    <tng-skeleton widthClass="w-2/3" heightClass="h-3" />
  </div>
</div>
`,
  );

  readonly cardLayoutHtml = computed(
    () => `
<div class="rounded-md border p-4 space-y-3">
  <tng-skeleton variant="rectangular" heightClass="h-32" />
  <tng-skeleton widthClass="w-2/3" heightClass="h-4" />
  <div class="space-y-2">
    <tng-skeleton widthClass="w-full" heightClass="h-3" />
    <tng-skeleton widthClass="w-5/6" heightClass="h-3" />
  </div>
</div>
`,
  );
}
