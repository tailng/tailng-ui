import { Component } from '@angular/core';
import { TngSkeleton } from '@tailng-ui/ui/primitives';

@Component({
  selector: 'playground-skeleton-demo',
  standalone: true,
  imports: [TngSkeleton],
  templateUrl: './skeleton-demo.component.html',
})
export class SkeletonDemoComponent {
  shimmer = false;

  // interactive inputs
  variant: 'text' | 'circular' | 'rectangular' = 'text';
  widthClass = 'w-full';
  heightClass = 'h-4';

  // escape hatch (exact CSS values)
  width = '';
  height = '';

  // theming override via slot
  slotContainer = '';

  toggleShimmer() {
    this.shimmer = !this.shimmer;
  }

  setVariant(v: 'text' | 'circular' | 'rectangular') {
    this.variant = v;
  }

  preset(p: 'default' | 'subtle' | 'strong' | 'card') {
    switch (p) {
      case 'default':
        this.slotContainer = '';
        this.widthClass = 'w-full';
        this.heightClass = 'h-4';
        this.width = '';
        this.height = '';
        this.variant = 'text';
        break;

      case 'subtle':
        this.slotContainer = 'bg-alternate-background/70';
        break;

      case 'strong':
        this.slotContainer = 'bg-border/90';
        break;

      case 'card':
        this.variant = 'rectangular';
        this.widthClass = 'w-full';
        this.heightClass = 'h-32';
        this.slotContainer = 'bg-border/70';
        this.width = '';
        this.height = '';
        break;
    }
  }

  useExactSize() {
    this.widthClass = '';
    this.heightClass = '';
    this.width = '240px';
    this.height = '14px';
  }

  clearExactSize() {
    this.width = '';
    this.height = '';
    if (!this.widthClass) this.widthClass = 'w-full';
    if (!this.heightClass) this.heightClass = 'h-4';
  }

  get slot() {
    return this.slotContainer ? { container: this.slotContainer } : {};
  }
}
