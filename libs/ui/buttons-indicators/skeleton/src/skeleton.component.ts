import { Component, computed, input } from '@angular/core';

@Component({
  selector: 'tng-skeleton',
  standalone: true,
  templateUrl: './skeleton.component.html',
})
export class TailngSkeletonComponent {
  width = input<string>('100%');
  height = input<string>('1rem');
  variant = input<'text' | 'circular' | 'rectangular'>('text');
  klass = input<string>('');

  classes = computed(() => {
    const base = 'animate-pulse bg-gray-200';
    const variantClasses = {
      text: 'rounded',
      circular: 'rounded-full',
      rectangular: 'rounded-md',
    };
    return `${base} ${variantClasses[this.variant()]} ${this.klass()}`.trim();
  });
}

