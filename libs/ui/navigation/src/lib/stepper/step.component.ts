import {
  Component,
  ElementRef,
  HostBinding,
  HostListener,
  inject,
  input,
  computed,
  signal,
} from '@angular/core';
import { booleanAttribute } from '@angular/core';
import { TngStepper } from './stepper.component';

@Component({
  selector: 'tng-step',
  standalone: true,
  template: `<ng-content />`,
})
export class TngStep {
  private readonly stepper = inject(TngStepper);
  private readonly el = inject(ElementRef<HTMLElement>);

  /* =====================
   * Inputs
   * ===================== */

  /** Optional label (you can also project content) */
  label = input<string>('');

  /** Disable this step */
  disabled = input(false, { transform: booleanAttribute });

  /** Mark as complete (used by linear mode to allow forward navigation) */
  complete = input(false, { transform: booleanAttribute });

  /* =====================
   * Klass hooks
   * ===================== */

  stepKlass = input<string>(
    'inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium border border-transparent'
  );
  activeKlass = input<string>('bg-primary text-on-primary');
  inactiveKlass = input<string>('bg-bg text-muted-foreground hover:text-foreground hover:bg-slate-50');
  disabledKlass = input<string>('opacity-50 cursor-not-allowed');

  /* =====================
   * Internal
   * ===================== */

  private readonly focused = signal(false);

  isComplete(): boolean {
    return this.complete();
  }

  isFocused(): boolean {
    return this.focused();
  }

  focus(): void {
    this.el.nativeElement.focus();
  }

  /* =====================
   * Host bindings
   * ===================== */

  @HostBinding('attr.role') role = 'tab';

  @HostBinding('attr.tabindex')
  get tabindex() {
    // roving tabindex: active is focusable by default, others -1
    return this.stepper.isActive(this.index()) ? 0 : -1;
  }

  @HostBinding('attr.aria-selected')
  get selected() {
    return this.stepper.isActive(this.index());
  }

  @HostBinding('attr.aria-disabled')
  get ariaDisabled() {
    return this.disabled() ? 'true' : null;
  }

  @HostBinding('class')
  get klass() {
    if (this.disabled()) return `${this.stepKlass()} ${this.disabledKlass()}`.trim();
    return this.stepper.isActive(this.index())
      ? `${this.stepKlass()} ${this.activeKlass()}`.trim()
      : `${this.stepKlass()} ${this.inactiveKlass()}`.trim();
  }

  /* =====================
   * Index resolution
   * ===================== */

  readonly index = computed(() => {
    const steps = this.stepper.steps();
    return steps.indexOf(this);
  });

  /* =====================
   * Events
   * ===================== */

  @HostListener('click')
  onClick(): void {
    if (this.disabled()) return;
    this.stepper.setIndex(this.index());
  }

  @HostListener('focus')
  onFocus(): void {
    this.focused.set(true);
  }

  @HostListener('blur')
  onBlur(): void {
    this.focused.set(false);
  }
}
