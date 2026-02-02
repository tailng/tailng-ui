import {
  Component,
  DestroyRef,
  computed,
  contentChild,
  effect,
  inject,
  input,
  signal,
} from '@angular/core';
import { NgControl } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { merge, of } from 'rxjs';

export type TngFormFieldSize = 'sm' | 'md' | 'lg';
export type TngFormFieldAppearance = 'outline' | 'filled';

@Component({
  selector: 'tng-form-field',
  standalone: true,
  templateUrl: './form-field.component.html',
})
export class TngFormField {
  // Get NgControl from projected child (input/select/custom CVA)
  private readonly ngControl = contentChild(NgControl, { descendants: true });

  private readonly destroyRef = inject(DestroyRef);

  /**
   * Bridge Angular Forms mutable state (touched/dirty/errors) into signals world.
   * We bump this tick on any control event so all computed() re-evaluate.
   */
  private readonly _tick = signal(0);

  private bump() {
    this._tick.update((v) => v + 1);
  }

  /* =====================
   * Content
   * ===================== */
  readonly label = input<string>('');
  readonly hint = input<string>('');

  /**
   * Manual overrides:
   * If provided, they take precedence over NgControl state.
   */
  readonly error = input<string>(''); // manual error text (wins)
  readonly invalid = input<boolean | null>(null);
  readonly disabled = input<boolean | null>(null);

  /**
   * Required mark:
   * Reliable + explicit. (Auto-detecting Validators.required is not stable.)
   */
  readonly required = input<boolean>(false);

  /* =====================
   * Variants
   * ===================== */
  readonly size = input<TngFormFieldSize>('md');
  readonly appearance = input<TngFormFieldAppearance>('outline');

  /* =====================
   * Theming / class hooks (section-wise)
   * ===================== */
  readonly rootKlass = input<string>('w-full');

  readonly labelKlass = input<string>('text-sm font-medium text-fg');
  readonly requiredMarkKlass = input<string>('text-danger');

  readonly hintKlass = input<string>('text-xs text-disable');
  readonly errorKlass = input<string>('text-xs text-danger');

  /** Wrapper around projected control */
  readonly controlShellKlass = input<string>('');

  readonly prefixKlass = input<string>('text-disable');
  readonly suffixKlass = input<string>('text-disable');

  readonly footerKlass = input<string>('mt-1 flex items-start justify-between gap-3');

  /* =====================
   * Control wiring
   * ===================== */
  private readonly ctrl = computed(() => this.ngControl()?.control ?? null);

  constructor() {
    // Subscribe to control events and bump tick whenever form state changes.
    effect(() => {
      const c = this.ngControl()?.control;
      if (!c) return;

      // Angular 17+ provides `events` stream (touched/dirty/etc). Fallback to value/status.
      const anyCtrl = c as any;
      const events$ =
        anyCtrl.events ?? merge(c.valueChanges ?? of(null), c.statusChanges ?? of(null));

      events$
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe(() => this.bump());

      // initial bump so computed picks up current state
      this.bump();
    });
  }

  /* =====================
   * Auto state from control
   * ===================== */
  private readonly autoDisabled = computed(() => {
    this._tick();
    return !!this.ctrl()?.disabled;
  });

  private readonly autoInvalid = computed(() => {
    this._tick();

    const c = this.ctrl();
    if (!c) return false;

    // typical UX: show errors after touched or dirty
    return !!c.invalid && (c.touched || c.dirty);
  });

  /** Prefer explicit inputs; fall back to form control. */
  readonly isDisabled = computed(() => this.disabled() ?? this.autoDisabled());
  readonly isInvalid = computed(() => this.invalid() ?? this.autoInvalid());
  readonly isRequired = computed(() => this.required());

  /**
   * Auto error message:
   * - manual [error] wins
   * - otherwise derive from control.errors
   */
  readonly errorText = computed(() => {
    this._tick();

    const manual = this.error();
    if (manual) return manual;

    const c = this.ctrl();
    if (!c || !this.isInvalid()) return '';

    const errors = c.errors ?? {};
    if (errors['required']) return 'This field is required';
    if (errors['email']) return 'Please enter a valid email';
    if (errors['minlength']?.requiredLength)
      return `Minimum ${errors['minlength'].requiredLength} characters`;
    if (errors['maxlength']?.requiredLength)
      return `Maximum ${errors['maxlength'].requiredLength} characters`;
    if (errors['min']?.min != null) return `Minimum value is ${errors['min'].min}`;
    if (errors['max']?.max != null) return `Maximum value is ${errors['max'].max}`;

    return 'Invalid value';
  });

  readonly showHint = computed(() => !!this.hint() && !this.errorText());
  readonly showError = computed(() => !!this.errorText());

  /* =====================
   * Classes
   * ===================== */
  private readonly sizeShell = computed(() => {
    switch (this.size()) {
      case 'sm':
        return 'px-2 py-1 text-sm';
      case 'lg':
        return 'px-4 py-3 text-base';
      case 'md':
      default:
        return 'px-3 py-2 text-sm';
    }
  });

  private readonly sizeLabel = computed(() => {
    switch (this.size()) {
      case 'sm':
        return 'text-xs';
      case 'lg':
        return 'text-base';
      case 'md':
      default:
        return 'text-sm';
    }
  });

  private readonly appearanceShell = computed(() => {
    return this.appearance() === 'filled'
      ? 'bg-alternate-background border-border'
      : 'bg-bg border-border';
  });

  readonly controlShellClasses = computed(() => {
    // ensure this recomputes when form state changes
    this._tick();

    const base =
      'w-full flex items-center gap-2 rounded-md border transition text-fg ' +
      'focus-within:ring-2 focus-within:ring-primary ' +
      'focus-within:ring-offset-2 focus-within:ring-offset-background';

    const border = this.isInvalid() ? ' border-danger' : '';
    const ring = this.isInvalid() ? ' focus-within:ring-danger' : '';
    const disabled = this.isDisabled() ? ' opacity-60 pointer-events-none' : '';

    return `${base} ${this.sizeShell()} ${this.appearanceShell()}${border}${ring}${disabled} ${this.controlShellKlass()}`.trim();
  });

  readonly labelClasses = computed(() => `${this.labelKlass()} ${this.sizeLabel()}`.trim());
}
