import {
  Component,
  ContentChild,
  ElementRef,
  ViewChild,
  computed,
  effect,
  forwardRef,
  input,
  output,
  signal,
  TemplateRef,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { NgTemplateOutlet } from '@angular/common';

import { TailngConnectedOverlayComponent } from '../../../popups-overlays/connected-overlay/src/public-api';
import { TailngOptionListComponent } from '../../../popups-overlays/option-list/src/public-api';
import { TailngOverlayPanelComponent } from '../../../popups-overlays/overlay-panel/src/public-api';
import {
  TailngOverlayRefComponent,
  TailngOverlayCloseReason,
} from '../../../popups-overlays/overlay-ref/src/public-api';

import { handleListKeyboardEvent } from 'libs/cdk/keyboard/keyboard-navigation';
import { OptionTplContext } from '@tailng/cdk';

export type SelectCloseReason = TailngOverlayCloseReason;

export type SelectValueTplContext<T> = { $implicit: T };

@Component({
  selector: 'tng-select',
  standalone: true,
  imports: [
    NgTemplateOutlet, // ✅ needed for rendering valueTpl
    TailngConnectedOverlayComponent,
    TailngOverlayPanelComponent,
    TailngOptionListComponent,
    TailngOverlayRefComponent,
  ],
  templateUrl: './select.component.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TailngSelectComponent),
      multi: true,
    },
  ],
})
export class TailngSelectComponent<T> implements ControlValueAccessor {
  /* =====================
   * Projected templates
   * ===================== */

  // Dropdown option template
  @ContentChild('optionTpl', { read: TemplateRef })
  optionTpl?: TemplateRef<OptionTplContext<T>>;

  // Trigger selected value template
  @ContentChild('valueTpl', { read: TemplateRef })
  valueTpl?: TemplateRef<SelectValueTplContext<T>>;

  @ViewChild('triggerEl', { static: true })
  triggerEl!: ElementRef<HTMLElement>;

  /* =====================
   * Inputs / Outputs
   * ===================== */
  readonly options = input<T[]>([]);

  readonly value = input<T | null>(null);
  readonly placeholder = input<string>('Select…');

  /** External disabled input (read-only) */
  readonly disabled = input<boolean>(false);

  readonly displayWith = input<(item: T) => string>((v) => String(v));

  /** Optional: non-form usage hook */
  readonly selected = output<T>();

  readonly closed = output<SelectCloseReason>();

  /* =====================
   * Theming (section-wise klass inputs)
   * ===================== */
  readonly rootKlass = input<string>('relative');

  readonly triggerKlass = input<string>(
    [
      'w-full',
      'flex items-center justify-between',
      'border border-border rounded-md',
      'px-3 py-2',
      'text-sm',
      'bg-background text-text',
      'focus:outline-none',
      'focus:ring-2 focus:ring-primary',
    ].join(' ')
  );

  readonly valueKlass = input<string>('truncate text-left');
  readonly placeholderKlass = input<string>('text-disable');
  readonly iconKlass = input<string>('ml-2 text-disable');

  /* =====================
   * State
   * ===================== */
  readonly isOpen = signal(false);
  readonly activeIndex = signal<number>(-1);

  protected readonly isDisabled = signal(false);

  private readonly selectedValue = signal<T | null>(null);
  private usingCva = false;

  /* =====================
   * ControlValueAccessor
   * ===================== */
  private onChange: (value: T | null) => void = () => {};
  private onTouched: () => void = () => {};

  constructor() {
    effect(() => {
      this.isDisabled.set(this.disabled());
      if (this.isDisabled()) this.close('programmatic');
    });

    effect(() => {
      const v = this.value();
      if (this.usingCva) return;
      this.selectedValue.set(v);
    });
  }

  writeValue(value: T | null): void {
    this.usingCva = true;
    this.selectedValue.set(value);
  }

  registerOnChange(fn: (value: T | null) => void): void {
    this.usingCva = true;
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.isDisabled.set(isDisabled);
    if (isDisabled) this.close('programmatic');
  }

  /* =====================
   * Helpers
   * ===================== */
  display(item: T | null): string {
    return item == null ? '' : this.displayWith()(item);
  }

  currentValue(): T | null {
    return this.selectedValue();
  }

  /* =====================
   * Trigger classes
   * ===================== */
  readonly triggerClasses = computed(() =>
    (
      this.triggerKlass() +
      (this.isDisabled() ? ' opacity-60 pointer-events-none' : '')
    ).trim()
  );

  /* =====================
   * Overlay state transitions
   * ===================== */
  open(_reason: SelectCloseReason) {
    if (this.isDisabled()) return;

    this.isOpen.set(true);

    const current = this.selectedValue();
    if (current != null) {
      const idx = this.options().indexOf(current);
      this.activeIndex.set(idx >= 0 ? idx : 0);
    } else {
      this.activeIndex.set(this.options().length ? 0 : -1);
    }

    void _reason;
  }

  close(reason: SelectCloseReason) {
    if (!this.isOpen()) return;

    this.isOpen.set(false);
    this.activeIndex.set(-1);
    this.closed.emit(reason);

    queueMicrotask(() => {
      this.triggerEl.nativeElement.focus();
    });
  }

  onOverlayOpenChange(open: boolean) {
    if (this.isDisabled()) {
      this.isOpen.set(false);
      return;
    }

    if (open) this.open('programmatic');
    else this.close('programmatic');
  }

  onOverlayClosed(reason: SelectCloseReason) {
    this.close(reason);
  }

  /* =====================
   * UI Events
   * ===================== */
  onTriggerClick() {
    if (this.isDisabled()) return;
    this.isOpen() ? this.close('programmatic') : this.open('programmatic');
  }

  onBlur() {
    this.onTouched();
    this.close('blur');
  }

  onKeydown(ev: KeyboardEvent) {
    if (this.isDisabled()) return;

    if (!this.isOpen() && (ev.key === 'ArrowDown' || ev.key === 'ArrowUp')) {
      ev.preventDefault();
      this.open('programmatic');
      return;
    }

    const action = handleListKeyboardEvent(ev, {
      activeIndex: this.activeIndex(),
      itemCount: this.options().length,
      loop: false,
    });

    switch (action.type) {
      case 'move':
        this.activeIndex.set(action.index);
        break;

      case 'select': {
        const item = this.options()[action.index];
        if (item !== undefined) this.select(item);
        break;
      }

      case 'close':
        this.close('escape');
        break;

      case 'noop':
      default:
        break;
    }
  }

  select(item: T) {
    if (this.isDisabled()) return;

    this.selectedValue.set(item);

    this.onChange(item);
    this.onTouched();

    this.selected.emit(item);

    this.close('selection');
  }
}
