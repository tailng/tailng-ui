import { NgTemplateOutlet } from '@angular/common';
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

import { TailngConnectedOverlayComponent } from '../../../popups-overlays/connected-overlay/src/public-api';
import { TailngOptionListComponent } from '../../../popups-overlays/option-list/src/public-api';
import { TailngOverlayPanelComponent } from '../../../popups-overlays/overlay-panel/src/public-api';
import {
  TailngOverlayRefComponent,
  TailngOverlayCloseReason,
} from '../../../popups-overlays/overlay-ref/src/public-api';

import { OptionTplContext } from '@tociva/tailng-cdk';

export type SelectCloseReason = TailngOverlayCloseReason;
export type SelectValueTplContext<T> = { $implicit: T };

@Component({
  selector: 'tng-select',
  standalone: true,
  imports: [
    NgTemplateOutlet,
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

  @ContentChild('optionTpl', { read: TemplateRef })
  optionTpl?: TemplateRef<OptionTplContext<T>>;

  @ContentChild('valueTpl', { read: TemplateRef })
  valueTpl?: TemplateRef<SelectValueTplContext<T>>;

  @ViewChild('triggerEl', { static: true })
  triggerEl!: ElementRef<HTMLElement>;

  // Delegate list navigation keys to OptionList
  @ViewChild(TailngOptionListComponent)
  optionList?: TailngOptionListComponent<T>;

  /* =====================
   * Inputs / Outputs
   * ===================== */
  readonly options = input<T[]>([]);
  readonly value = input<T | null>(null);
  readonly placeholder = input<string>('Select…');

  readonly disabled = input<boolean>(false);

  readonly displayWith = input<(item: T) => string>((v) => String(v));

  readonly selected = output<T>();
  readonly closed = output<SelectCloseReason>();

  /* =====================
   * Theming
   * ===================== */
  readonly rootKlass = input<string>('relative');

  readonly triggerKlass = input<string>(
    [
      'w-full',
      'flex items-center justify-between',
      'border border-border rounded-md',
      'px-3 py-2',
      'text-sm',
      'bg-bg text-fg',
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
   * CVA
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

  readonly triggerClasses = computed(() =>
    (this.triggerKlass() + (this.isDisabled() ? ' opacity-60 pointer-events-none' : '')).trim()
  );

  /* =====================
   * Overlay state
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
    // minimal safer blur (prevents weird immediate refocus issues)
    queueMicrotask(() => {
      if (document.activeElement === this.triggerEl.nativeElement) return;
      this.close('blur');
    });
  }

  onKeydown(ev: KeyboardEvent) {
    if (this.isDisabled()) return;

    // Escape closes
    if (ev.key === 'Escape' && this.isOpen()) {
      ev.preventDefault();
      ev.stopPropagation();
      this.close('escape');
      return;
    }

    // Open on ArrowDown/ArrowUp when closed (and delegate once mounted)
    if (!this.isOpen() && (ev.key === 'ArrowDown' || ev.key === 'ArrowUp')) {
      ev.preventDefault();
      ev.stopPropagation();

      this.open('programmatic');

      requestAnimationFrame(() => {
        const replay = this.cloneKeyboardEvent(ev);
        this.optionList?.onKeydown(replay);
      });
      return;
    }

    if (!this.isOpen()) return;

    // Delegate list-navigation keys to OptionList (including Enter)
    if (!this.isListNavigationKey(ev)) return;

    // WARNING: DO NOT preventDefault here — OptionList ignores defaultPrevented events
    ev.stopPropagation();
    this.optionList?.onKeydown(ev);
  }

  private isListNavigationKey(ev: KeyboardEvent): boolean {
    switch (ev.key) {
      case 'ArrowDown':
      case 'ArrowUp':
      case 'Home':
      case 'End':
      case 'PageDown':
      case 'PageUp':
      case 'Enter':
        return true;
      default:
        return false;
    }
  }

  private cloneKeyboardEvent(ev: KeyboardEvent): KeyboardEvent {
    return new KeyboardEvent(ev.type, {
      key: ev.key,
      code: ev.code,
      location: ev.location,
      repeat: ev.repeat,
      ctrlKey: ev.ctrlKey,
      shiftKey: ev.shiftKey,
      altKey: ev.altKey,
      metaKey: ev.metaKey,
      bubbles: true,
      cancelable: true,
    });
  }

  /* =====================
   * OptionList wiring
   * ===================== */
  onActiveIndexChange(i: number) {
    this.activeIndex.set(i);
  }

  requestSelectActive() {
    const i = this.activeIndex();
    const item = this.options()[i];
    if (item !== undefined) this.select(item);
  }

  /* =====================
   * Selection
   * ===================== */
  select(item: T) {
    if (this.isDisabled()) return;

    this.selectedValue.set(item);

    this.onChange(item);
    this.onTouched();

    this.selected.emit(item);

    this.close('selection');
  }
}
