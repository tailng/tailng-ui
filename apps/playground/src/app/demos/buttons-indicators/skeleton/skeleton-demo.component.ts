import { Component } from '@angular/core';
import { TngSkeleton } from '@tociva/tailng-ui/buttons-indicators';

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
  widthKlass = 'w-full';
  heightKlass = 'h-4';

  // escape hatch (exact CSS values)
  width = '';
  height = '';

  // theming override
  klass = '';

  toggleShimmer() {
    this.shimmer = !this.shimmer;
  }

  setVariant(v: 'text' | 'circular' | 'rectangular') {
    this.variant = v;
  }

  preset(p: 'default' | 'subtle' | 'strong' | 'card') {
    switch (p) {
      case 'default':
        this.klass = '';
        this.widthKlass = 'w-full';
        this.heightKlass = 'h-4';
        this.width = '';
        this.height = '';
        this.variant = 'text';
        break;

      case 'subtle':
        this.klass = 'bg-alternate-background/70';
        break;

      case 'strong':
        this.klass = 'bg-border/90';
        break;

      case 'card':
        this.variant = 'rectangular';
        this.widthKlass = 'w-full';
        this.heightKlass = 'h-32';
        this.klass = 'bg-border/70';
        this.width = '';
        this.height = '';
        break;
    }
  }

  useExactSize() {
    this.widthKlass = '';
    this.heightKlass = '';
    this.width = '240px';
    this.height = '14px';
  }

  clearExactSize() {
    this.width = '';
    this.height = '';
    if (!this.widthKlass) this.widthKlass = 'w-full';
    if (!this.heightKlass) this.heightKlass = 'h-4';
  }
}
