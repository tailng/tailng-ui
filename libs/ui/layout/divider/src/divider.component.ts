import { Component, computed, input } from '@angular/core';
import { booleanAttribute } from '@angular/core';

export type TailngDividerOrientation = 'horizontal' | 'vertical';
export type TailngDividerAlign = 'start' | 'center' | 'end';

@Component({
  selector: 'tng-divider',
  standalone: true,
  templateUrl: './divider.component.html',
})
export class TailngDividerComponent {
  orientation = input<TailngDividerOrientation>('horizontal');
  label = input<string>('');
  align = input<TailngDividerAlign>('center');
  dashed = input(false, { transform: booleanAttribute });

  /* klass hooks */
  rootKlass = input<string>('');

  /** Must include border color: border-border or border-slate-300 */
  lineKlass = input<string>('border-border');

  labelKlass = input<string>('text-xs text-fg/70');
  gapKlass = input<string>('my-4');
  thicknessKlass = input<string>('border-t');

  /** NEW: vertical height that does NOT depend on parent height */
  verticalHeightKlass = input<string>('h-6');

  readonly isVertical = computed(() => this.orientation() === 'vertical');

  readonly rootClasses = computed(() => {
    if (this.isVertical()) {
      // no h-full dependency anymore
      return (`inline-flex shrink-0 items-stretch ${this.rootKlass()}`).trim();
    }
    return (`flex w-full items-center ${this.gapKlass()} ${this.rootKlass()}`).trim();
  });

  readonly lineClasses = computed(() => {
    const style = this.dashed() ? 'border-dashed' : 'border-solid';

    if (this.isVertical()) {
      // Always visible: w-px + explicit height
      return (
        `w-px ${this.verticalHeightKlass()} self-stretch shrink-0 ` +
        `border-l ${style} ${this.lineKlass()}`
      ).trim();
    }

    return (`${this.thicknessKlass()} ${style} ${this.lineKlass()}`).trim();
  });

  readonly leftGrow = computed(() => {
    const a = this.align();
    if (a === 'start') return 'grow-0 w-6';
    if (a === 'end') return 'grow';
    return 'grow';
  });

  readonly rightGrow = computed(() => {
    const a = this.align();
    if (a === 'start') return 'grow';
    if (a === 'end') return 'grow-0 w-6';
    return 'grow';
  });

  readonly labelClasses = computed(
    () => (`px-3 whitespace-nowrap ${this.labelKlass()}`).trim()
  );
}
