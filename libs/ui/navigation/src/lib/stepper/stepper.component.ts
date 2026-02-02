import {
  booleanAttribute,
  Component,
  computed,
  contentChildren,
  effect,
  input,
  numberAttribute,
  output,
  signal,
} from '@angular/core';
import { TngStep } from './step.component';

export type TngStepperOrientation = 'horizontal' | 'vertical';

@Component({
  selector: 'tng-stepper',
  standalone: true,
  templateUrl: './stepper.component.html',
})
export class TngStepper {
  /* =====================
   * Inputs
   * ===================== */

  /**
   * Controlled active index.
   * If not null, stepper behaves controlled.
   * NOTE: No transform here (Angular typing limitation with null initial).
   */
  activeIndex = input<number | null>(null);

  /** Uncontrolled initial index */
  defaultIndex = input(0, { transform: numberAttribute });

  /** Linear mode: prevent jumping forward beyond completed steps */
  linear = input(false, { transform: booleanAttribute });

  /** Orientation */
  orientation = input<TngStepperOrientation>('horizontal');

  /* =====================
   * Outputs
   * ===================== */

  activeIndexChange = output<number>();

  /* =====================
   * Klass hooks
   * ===================== */

  rootKlass = input<string>('w-full');
  headerKlass = input<string>('flex gap-2');
  headerVerticalKlass = input<string>('flex flex-col gap-2');
  panelWrapKlass = input<string>('pt-4');

  /* =====================
   * Children
   * ===================== */

  readonly steps = contentChildren(TngStep, { descendants: true });

  /* =====================
   * State
   * ===================== */

  private readonly _index = signal(0);
  readonly index = this._index.asReadonly();

  constructor() {
    // Controlled/uncontrolled sync
    effect(() => {
      const steps = this.steps(); // track for clamping
      const n = steps.length;

      const controlled = this.activeIndex();
      if (controlled !== null) {
        this._index.set(this.clamp(Number(controlled), n));
        return;
      }

      // uncontrolled init (only when nothing set yet)
      const current = this._index();
      if (current === 0 && this.defaultIndex() !== 0) {
        this._index.set(this.clamp(this.defaultIndex(), n));
      } else {
        // always keep clamped if steps count changes
        this._index.set(this.clamp(current, n));
      }
    });
  }

  /* =====================
   * Public API
   * ===================== */

  setIndex(next: number): void {
    const clamped = this.clamp(next, this.steps().length);
    if (!this.canActivate(clamped)) return;

    this._index.set(clamped);
    this.activeIndexChange.emit(clamped);
  }

  next(): void {
    this.setIndex(this._index() + 1);
  }

  prev(): void {
    this.setIndex(this._index() - 1);
  }

  isActive(i: number): boolean {
    return this._index() === i;
  }

  /* =====================
   * Keyboard navigation (roving focus)
   * ===================== */

  onKeydown(ev: KeyboardEvent): void {
    const steps = this.steps();
    if (!steps.length) return;

    const key = ev.key;
    const horizontal = this.orientation() === 'horizontal';

    const prevKey = horizontal ? 'ArrowLeft' : 'ArrowUp';
    const nextKey = horizontal ? 'ArrowRight' : 'ArrowDown';

    if (key === prevKey) {
      ev.preventDefault();
      this.focusStep(this._index() - 1);
      return;
    }

    if (key === nextKey) {
      ev.preventDefault();
      this.focusStep(this._index() + 1);
      return;
    }

    if (key === 'Home') {
      ev.preventDefault();
      this.focusStep(0);
      return;
    }

    if (key === 'End') {
      ev.preventDefault();
      this.focusStep(steps.length - 1);
      return;
    }

    if (key === 'Enter' || key === ' ') {
      const focusedIndex = steps.findIndex((s) => s.isFocused());
      if (focusedIndex >= 0) {
        ev.preventDefault();
        this.setIndex(focusedIndex);
      }
    }
  }

  focusStep(i: number): void {
    const steps = this.steps();
    const clamped = this.clamp(i, steps.length);
    steps[clamped]?.focus();
  }

  /* =====================
   * Rules
   * ===================== */

  private clamp(i: number, n: number): number {
    if (n <= 0) return 0;
    if (!Number.isFinite(i)) return 0;
    return Math.max(0, Math.min(n - 1, i));
  }

  private canActivate(target: number): boolean {
    const steps = this.steps();
    const current = this._index();

    if (!this.linear()) return true;
    if (target <= current) return true;

    for (let i = 0; i < target; i++) {
      const s = steps[i];
      if (!s) return false;
      if (!s.isComplete()) return false;
    }
    return true;
  }

  /* =====================
   * Computed
   * ===================== */

  readonly headerResolvedKlass = computed(() =>
    this.orientation() === 'vertical' ? this.headerVerticalKlass() : this.headerKlass()
  );

  readonly orientationAttr = computed(() =>
    this.orientation() === 'vertical' ? 'vertical' : 'horizontal'
  );
}
