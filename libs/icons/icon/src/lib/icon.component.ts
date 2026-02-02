import { Component, computed, input } from '@angular/core';
import { NgIconComponent } from '@ng-icons/core';
import { booleanAttribute } from '@angular/core';

type TngIconSize = number | string;

@Component({
  selector: 'tng-icon',
  standalone: true,
  imports: [NgIconComponent],
  templateUrl: './icon.component.html',
})
export class TngIcon {
  /** Icon name from @ng-icons registry */
  name = input.required<string>();

  /**
   * Size:
   * - number => px
   * - string => passed as-is (e.g. '1em', '20px', '1.25rem')
   */
  size = input<TngIconSize>('1em');

  /** Additional classes for host element */
  klass = input<string>('');

  /**
   * Accessibility:
   * - decorative=true => aria-hidden (default)
   * - decorative=false => aria-label is recommended
   */
  decorative = input(true, { transform: booleanAttribute });
  ariaLabel = input<string>('');

  readonly normalizedSize = computed(() => {
    const s = this.size();
    return typeof s === 'number' ? `${s}px` : s;
  });

  readonly classes = computed(() => {
    const extra = this.klass().trim();
    return ['inline-flex', 'align-middle', extra].filter(Boolean).join(' ');
  });

  readonly ariaHidden = computed(() => (this.decorative() ? 'true' : null));

  readonly computedAriaLabel = computed(() => {
    if (this.decorative()) return null;
    const label = this.ariaLabel().trim();
    return label || null;
  });
}
