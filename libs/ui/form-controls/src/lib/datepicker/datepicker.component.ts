import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  ViewChild,
  computed,
  effect,
  forwardRef,
  inject,
  input,
  signal,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

import { TailngConnectedOverlayComponent } from '../../../popups-overlays/connected-overlay/src/public-api';
import { TailngOverlayPanelComponent } from '../../../popups-overlays/overlay-panel/src/public-api';
import {
  TailngOverlayCloseReason,
  TailngOverlayRefComponent,
} from '../../../popups-overlays/overlay-ref/src/public-api';

import { TailngNativeDateAdapter } from './adapters/native-date.adapter';
import { TNG_DATE_ADAPTER, TngDateAdapter } from './adapters/tng-date-adapter';
import {
  computeNextCaretPos,
  parseSmartDate
} from './utils/datepicker-input.util';

const MONTHS = [
  { index: 0, label: 'Jan' },
  { index: 1, label: 'Feb' },
  { index: 2, label: 'Mar' },
  { index: 3, label: 'Apr' },
  { index: 4, label: 'May' },
  { index: 5, label: 'Jun' },
  { index: 6, label: 'Jul' },
  { index: 7, label: 'Aug' },
  { index: 8, label: 'Sep' },
  { index: 9, label: 'Oct' },
  { index: 10, label: 'Nov' },
  { index: 11, label: 'Dec' },
] as const;

const YEAR_WINDOW_SIZE = 10;
const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'] as const;

type CalendarCell = {
  date: Date;
  label: string;
  isOutsideMonth: boolean;
};

@Component({
  selector: 'tng-datepicker',
  standalone: true,
  imports: [
    TailngOverlayRefComponent,
    TailngConnectedOverlayComponent,
    TailngOverlayPanelComponent,
  ],
  templateUrl: './datepicker.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TailngDatepickerComponent),
      multi: true,
    },
  ],
})
export class TailngDatepickerComponent implements ControlValueAccessor {
  /* =====================
   * Inputs
   * ===================== */
  readonly min = input<Date | null>(null);
  readonly max = input<Date | null>(null);
  readonly disabled = input<boolean>(false);

  readonly displayFormat = input<string>('DD/MM/YYYY');
  readonly previewFormat = input<string>('DD MMM YYYY');

  /** Optional locale for month names (e.g. 'en', 'fr', 'de', 'ml') */
  readonly locale = input<string | null>(null);

  readonly dateAdapter = input<TngDateAdapter | null>(null);

  /** Klass applied to the text input element */
  readonly inputKlass = input<string>('');
  readonly toggleKlass = input<string>('');

  readonly hostKlass = input<string>('');
  readonly disabledKlass = input<string>('');
  readonly fieldKlass = input<string>('');
  readonly toggleIconKlass = input<string>('');
  readonly panelKlass = input<string>('');
  readonly panelFrameKlass = input<string>('');
  readonly panelLayoutKlass = input<string>('');
  readonly monthRailKlass = input<string>('');
  readonly monthListKlass = input<string>('');
  readonly monthItemKlass = input<string>('');
  readonly calendarKlass = input<string>('');
  readonly titleKlass = input<string>('');
  readonly weekdayRowKlass = input<string>('');
  readonly weekdayCellKlass = input<string>('');
  readonly dayGridKlass = input<string>('');
  readonly dayCellKlass = input<string>('');
  readonly previewTextKlass = input<string>('');
  readonly actionBarKlass = input<string>('');
  readonly cancelKlass = input<string>('');
  readonly confirmKlass = input<string>('');
  readonly yearRailKlass = input<string>('');
  readonly yearNavPrevKlass = input<string>('');
  readonly yearListKlass = input<string>('');
  readonly yearItemKlass = input<string>('');
  readonly yearNavNextKlass = input<string>('');

  @ViewChild('inputEl', { static: true })
  inputEl!: ElementRef<HTMLInputElement>;

  /* =====================
   * Overlay state
   * ===================== */
  readonly isOpen = signal(false);
  readonly isDisabled = signal(false);

  private readonly injectedAdapter = inject(TNG_DATE_ADAPTER, { optional: true });
  private readonly nativeAdapter = inject(TailngNativeDateAdapter);

  readonly adapter = computed(
    () => this.dateAdapter() ?? this.injectedAdapter ?? this.nativeAdapter,
  );

  /* =====================
   * Klass (input theming)
   * ===================== */
  readonly inputKlassFinal = computed(() =>
    this.join(
      'w-full rounded-md border border-border bg-bg px-3 py-2 pr-10 text-sm',
      'focus:outline-none focus:ring-2 focus:ring-primary',
      this.inputKlass(),
    ),
  );

  readonly toggleKlassFinal = computed(() =>
    this.join(
      'absolute inset-y-0 right-0 flex w-10 items-center justify-center',
      'rounded-r-md text-fg hover:bg-alternate-background',
      this.toggleKlass(),
    ),
  );

  readonly hostKlassFinal = computed(() =>
    this.join('relative', this.hostKlass()),
  );
  readonly disabledKlassFinal = computed(() =>
    this.join(this.disabledKlass()),
  );
  readonly fieldKlassFinal = computed(() =>
    this.join('relative', this.fieldKlass()),
  );
  readonly toggleIconKlassFinal = computed(() =>
    this.join('h-5 w-5', this.toggleIconKlass()),
  );
  readonly panelKlassFinal = computed(() =>
    this.join(
      'w-[372px] h-[322px] max-h-[322px] p-0',
      this.panelKlass(),
    ),
  );
  readonly panelFrameKlassFinal = computed(() =>
    this.join(
      'w-[370px] h-[320px] overflow-hidden rounded-lg',
      'border border-border bg-bg shadow-lg',
      this.panelFrameKlass(),
    ),
  );
  readonly panelLayoutKlassFinal = computed(() =>
    this.join('grid h-full grid-cols-[64px_1fr_64px]', this.panelLayoutKlass()),
  );
  readonly monthRailKlassFinal = computed(() =>
    this.join('bg-bg p-1 text-fg', this.monthRailKlass()),
  );
  readonly monthListKlassFinal = computed(() =>
    this.join('space-y-0.5', this.monthListKlass()),
  );
  readonly monthItemKlassFinal = computed(() =>
    this.join(
      'w-full rounded px-1 py-0.5 text-[11px] font-semibold transition',
      this.monthItemKlass(),
    ),
  );
  readonly calendarKlassFinal = computed(() =>
    this.join(
      'flex h-full flex-col p-2 border-r border-l border-border',
      this.calendarKlass(),
    ),
  );
  readonly titleKlassFinal = computed(() =>
    this.join(
      'mb-1 text-center text-sm font-semibold',
      this.titleKlass(),
    ),
  );
  readonly weekdayRowKlassFinal = computed(() =>
    this.join(
      'grid grid-cols-7 gap-0.5 text-[10px] font-semibold text-disable',
      this.weekdayRowKlass(),
    ),
  );
  readonly weekdayCellKlassFinal = computed(() =>
    this.join('text-center', this.weekdayCellKlass()),
  );
  readonly dayGridKlassFinal = computed(() =>
    this.join('mt-1 grid grid-cols-7 gap-0.5', this.dayGridKlass()),
  );
  readonly dayCellKlassFinal = computed(() =>
    this.join(
      'h-7 rounded text-[11px] transition',
      this.dayCellKlass(),
    ),
  );
  readonly previewTextKlassFinal = computed(() =>
    this.join(
      'pt-2 text-center text-[11px] text-disable',
      this.previewTextKlass(),
    ),
  );
  readonly actionBarKlassFinal = computed(() =>
    this.join(
      'mt-auto flex items-center justify-end gap-2 pt-4',
      this.actionBarKlass(),
    ),
  );
  readonly cancelKlassFinal = computed(() =>
    this.join(
      'rounded-md border border-border bg-bg',
      'px-3 py-1.5 text-[11px] font-semibold text-fg',
      'shadow-sm hover:bg-alternate-background active:translate-y-[1px]',
      this.cancelKlass(),
    ),
  );
  readonly confirmKlassFinal = computed(() =>
    this.join(
      'rounded-md bg-fg',
      'px-3 py-1.5 text-[11px] font-semibold text-bg',
      'shadow-sm hover:opacity-95 active:translate-y-[1px]',
      this.confirmKlass(),
    ),
  );
  readonly yearRailKlassFinal = computed(() =>
    this.join(
      'bg-bg p-1 text-fg flex flex-col',
      this.yearRailKlass(),
    ),
  );
  readonly yearNavPrevKlassFinal = computed(() =>
    this.join(
      'mx-auto mb-1 flex h-6 w-6 items-center justify-center',
      'rounded bg-bg/10 text-[12px] hover:bg-bg/15 disabled:opacity-40',
      this.yearNavPrevKlass(),
    ),
  );
  readonly yearListKlassFinal = computed(() =>
    this.join('space-y-0.5', this.yearListKlass()),
  );
  readonly yearItemKlassFinal = computed(() =>
    this.join(
      'w-full rounded px-1 py-0.5 text-[11px] font-semibold transition',
      this.yearItemKlass(),
    ),
  );
  readonly yearNavNextKlassFinal = computed(() =>
    this.join(
      'mx-auto mt-1 flex h-6 w-6 items-center justify-center',
      'rounded bg-bg/10 text-[12px] hover:bg-bg/15 disabled:opacity-40',
      this.yearNavNextKlass(),
    ),
  );

  private join(...parts: Array<string | null | undefined>): string {
    return parts.map((p) => (p ?? '').trim()).filter(Boolean).join(' ');
  }

  /* =====================
   * Form values
   * ===================== */
  private value: Date | null = null;
  readonly draft = signal<Date | null>(null);
  readonly inputValue = signal('');

  private onChange: (value: Date | null) => void = () => {};
  private onTouched: () => void = () => {};

  /* =====================
   * UI constants
   * ===================== */
  readonly months = MONTHS;
  readonly weekdays = WEEKDAYS;
  

  readonly focusedDate = signal<Date | null>(null);

  /* =====================
   * Derived bounds
   * ===================== */
  private readonly minD = computed(() =>
    this.min() ? this.adapter().startOfDay(this.min()!) : null
  );
  private readonly maxD = computed(() =>
    this.max() ? this.adapter().startOfDay(this.max()!) : null
  );

  /* =====================
   * View base
   * ===================== */
  readonly view = computed(() =>
    (this.draft() ?? this.value ?? this.adapter().startOfDay(new Date()))
  );

  readonly selectedYear = computed(() => this.adapter().year(this.view()!));
  readonly selectedMonth = computed(() => this.adapter().month(this.view()!));

  readonly yearBase = signal<number>(
    Math.floor(this.adapter().year(new Date()) / YEAR_WINDOW_SIZE) * YEAR_WINDOW_SIZE
  );

  readonly years = computed(() => {
    const base = this.yearBase();
    return Array.from({ length: YEAR_WINDOW_SIZE }, (_, i) => base + i);
  });

  readonly previewLabel = computed(() => {
    const d = this.draft() ?? this.value;
    if (!d) return '—';
    const loc = this.locale();
    return loc ? this.adapter().format(d, this.previewFormat(), loc) : this.adapter().format(d, this.previewFormat());
  });

  readonly calendarCells = computed<CalendarCell[]>(() => {
    const v = this.adapter().startOfMonth(this.view()!);
    const startDow = this.adapter().day(v);
    const gridStart = this.adapter().addDays(v, -startDow);

    const cells: CalendarCell[] = [];
    for (let i = 0; i < 42; i++) {
      const d = this.adapter().addDays(gridStart, i);
      cells.push({
        date: d,
        label: String(this.adapter().date(d)),
        isOutsideMonth: this.adapter().month(d) !== this.adapter().month(v),
      });
    }
    return cells;
  });

  canPrevYearWindow = computed(() => !this.isYearWindowBlocked(this.yearBase() - YEAR_WINDOW_SIZE));
  canNextYearWindow = computed(() => !this.isYearWindowBlocked(this.yearBase() + YEAR_WINDOW_SIZE));

  private isYearWindowBlocked(nextBase: number): boolean {
    const min = this.minD();
    const max = this.maxD();
    if (!min && !max) return false;

    const years = Array.from({ length: YEAR_WINDOW_SIZE }, (_, i) => nextBase + i);
    return years.every((y) => this.isYearDisabled(y));
  }

  constructor() {
    effect(() => {
      this.isDisabled.set(this.disabled());
      if (this.isDisabled()) this.close('programmatic');
    });
  }

  prevYearWindow(): void {
    if (this.isDisabled()) return;
    const next = this.yearBase() - YEAR_WINDOW_SIZE;
    if (this.isYearWindowBlocked(next)) return;
    this.yearBase.set(next);
  }

  nextYearWindow(): void {
    if (this.isDisabled()) return;
    const next = this.yearBase() + YEAR_WINDOW_SIZE;
    if (this.isYearWindowBlocked(next)) return;
    this.yearBase.set(next);
  }

  /* =====================
   * CVA
   * ===================== */
  writeValue(value: Date | string | number | null): void {
    if (value == null) {
      this.value = null;
      this.draft.set(null);
      this.inputValue.set('');
      return;
    }

    const d = this.adapter().startOfDay(new Date(value));
    if (!this.adapter().isValid(d)) return;

    const clamped = this.clampToBounds(d);
    this.value = clamped;
    this.draft.set(clamped);

    this.yearBase.set(Math.floor(this.adapter().year(clamped) / YEAR_WINDOW_SIZE) * YEAR_WINDOW_SIZE);

    const formatted = this.adapter().format(clamped, this.displayFormat(), this.locale() ?? undefined);
    this.inputValue.set(formatted);
  }

  registerOnChange(fn: (value: Date | null) => void): void {
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
   * Overlay control
   * ===================== */
  open(_reason: TailngOverlayCloseReason) {
    if (this.isDisabled()) return;
    this.isOpen.set(true);
  
    if (this.draft() == null) this.draft.set(this.value ?? this.adapter().startOfDay(new Date()));
    const current = (this.draft() ?? this.value ?? this.adapter().startOfDay(new Date()));
  
    // year window sync (existing)
    const y = this.adapter().year(current);
    this.yearBase.set(Math.floor(y / YEAR_WINDOW_SIZE) * YEAR_WINDOW_SIZE);
  
    // keyboard focus starts from current draft/value
    this.focusedDate.set(current);
  }
  

  close(_reason: TailngOverlayCloseReason) {
    if (!this.isOpen()) return;
    this.isOpen.set(false);
  }

  onOverlayOpenChange(open: boolean) {
    if (this.isDisabled()) {
      this.isOpen.set(false);
      return;
    }
    open ? this.open('programmatic') : this.close('programmatic');
  }

  onOverlayClosed(reason: TailngOverlayCloseReason) {
    this.close(reason);
  }

  toggleOverlay() {
    if (this.isDisabled()) return;
    this.isOpen.update((v) => !v);
    if (this.isOpen()) this.open('programmatic');
    queueMicrotask(() => this.inputEl.nativeElement.focus());
  }

  /* =====================
   * Input handling (smart)
   * ===================== */
  onInput(ev: Event) {
    if (this.isDisabled()) return;

    const input = ev.target as HTMLInputElement;
    const raw = input.value ?? '';

    const before = raw;
    const beforeCaret = input.selectionStart ?? before.length;

    const res = parseSmartDate(raw, this.displayFormat(), this.adapter(), this.locale() ?? undefined);

    // Keep what user typed while partial/invalid; don't hard-clear.
    if (res.kind === 'empty') {
      this.inputValue.set('');
      this.draft.set(null);
      this.onChange(null);
      this.onTouched();
      return;
    }

    if (res.kind === 'partial') {
      this.inputValue.set(raw);
      // do not emit null onChange while user is mid-typing
      this.onTouched();
      return;
    }

    if (res.kind === 'invalid') {
      this.inputValue.set(raw);
      this.onChange(null);
      this.onTouched();
      return;
    }

    // valid
    const clamped = this.clampToBounds(res.date);
    this.draft.set(clamped);

    const formatted = this.adapter().format(clamped, this.displayFormat(), this.locale() ?? undefined);
    this.inputValue.set(formatted);

    // Apply formatting back to input while preserving caret
    if (formatted !== raw) {
      input.value = formatted;
      const nextCaret = computeNextCaretPos(before, beforeCaret, formatted);
      queueMicrotask(() => input.setSelectionRange(nextCaret, nextCaret));
    }

    // don’t commit until day click/confirm (your current UX), but
    // we can still emit null/valid? You already treat typing as draft.
    // Keep existing behavior: do NOT call onChange here.
    this.onTouched();
  }

  onBlur() {
    this.onTouched();
  }

  private setFocusedDate(next: Date) {
    const d = this.adapter().startOfDay(next);
  
    // clamp to bounds
    const clamped = this.clampToBounds(d);
  
    this.focusedDate.set(clamped);
  
    // If user navigates to another month/year, update draft to keep calendar view in sync
    this.draft.set(clamped);
  
    // Keep year window aligned
    this.yearBase.set(Math.floor(this.adapter().year(clamped) / YEAR_WINDOW_SIZE) * YEAR_WINDOW_SIZE);
  }
  
  private moveFocusedByDays(delta: number) {
    const base = (this.focusedDate() ?? this.draft() ?? this.value ?? this.adapter().startOfDay(new Date()));
    this.setFocusedDate(this.adapter().addDays(base, delta));
  }
  
  private moveFocusedByMonths(delta: number) {
    const base = (this.focusedDate() ?? this.draft() ?? this.value ?? this.adapter().startOfDay(new Date()));
    this.setFocusedDate(this.adapter().addMonths(base, delta));
  }
  
  private moveFocusedToStartOfMonth() {
    const base = (this.focusedDate() ?? this.draft() ?? this.value ?? this.adapter().startOfDay(new Date()));
    this.setFocusedDate(this.adapter().startOfMonth(base));
  }
  
  private moveFocusedToEndOfMonth() {
    const base = (this.focusedDate() ?? this.draft() ?? this.value ?? this.adapter().startOfDay(new Date()));
    this.setFocusedDate(this.adapter().endOfMonth(base));
  }
  
  isCellFocused(cell: CalendarCell): boolean {
    const f = this.focusedDate();
    if (!f) return false;
    return this.adapter().isSameDay(cell.date, f);
  }  
  
  onKeydown(ev: KeyboardEvent) {
    if (this.isDisabled()) return;
  
    // ---- TAB / SHIFT+TAB -> close popup ----
    if (ev.key === 'Tab' && this.isOpen()) {
      // Do NOT preventDefault -> allow normal focus navigation
      this.close('blur');
      return;
    }
  
    // Escape closes without commit
    if (ev.key === 'Escape' && this.isOpen()) {
      ev.preventDefault();
      this.close('escape');
      return;
    }
  
    // Open when closed
    if (!this.isOpen() && (ev.key === 'ArrowDown' || ev.key === 'Enter')) {
      ev.preventDefault();
      this.open('programmatic');
      return;
    }
  
    // Keyboard navigation only when open
    if (!this.isOpen()) return;
  
    switch (ev.key) {
      case 'ArrowLeft':
        ev.preventDefault();
        this.moveFocusedByDays(-1);
        return;
  
      case 'ArrowRight':
        ev.preventDefault();
        this.moveFocusedByDays(1);
        return;
  
      case 'ArrowUp':
        ev.preventDefault();
        this.moveFocusedByDays(-7);
        return;
  
      case 'ArrowDown':
        ev.preventDefault();
        this.moveFocusedByDays(7);
        return;
  
      case 'PageUp':
        ev.preventDefault();
        this.moveFocusedByMonths(-1);
        return;
  
      case 'PageDown':
        ev.preventDefault();
        this.moveFocusedByMonths(1);
        return;
  
      case 'Home':
        ev.preventDefault();
        this.moveFocusedToStartOfMonth();
        return;
  
      case 'End':
        ev.preventDefault();
        this.moveFocusedToEndOfMonth();
        return;
  
      case 'Enter': {
        ev.preventDefault();
        const f = this.focusedDate();
        if (!f) return;
  
        const clamped = this.clampToBounds(f);
        this.draft.set(clamped);
  
        this.value = clamped;
        this.inputValue.set(this.adapter().format(clamped, this.displayFormat(), this.locale() ?? undefined));
        this.onChange(clamped);
        this.onTouched();
  
        this.close('selection');
        return;
      }
    }
  }  

  /* =====================
   * Calendar actions
   * ===================== */
  selectMonth(monthIndex0: number): void {
    if (this.isDisabled()) return;

    const base = this.draft() ?? this.value ?? this.adapter().startOfDay(new Date());
    const day = this.adapter().date(base);

    const m = this.adapter().setMonth(base, monthIndex0);
    const nextDay = Math.min(day, this.adapter().daysInMonth(m));

    this.draft.set(this.clampToBounds(this.adapter().setDate(m, nextDay)));
  }

  selectYear(year: number): void {
    if (this.isDisabled()) return;

    const base = this.draft() ?? this.value ?? this.adapter().startOfDay(new Date());
    const day = this.adapter().date(base);

    const y = this.adapter().setYear(base, year);
    const nextDay = Math.min(day, this.adapter().daysInMonth(y));

    this.draft.set(this.clampToBounds(this.adapter().setDate(y, nextDay)));
  }

  // day click commits + closes (as you requested)
  selectDay(cell: { date: Date }) {
    if (this.isDisabled()) return;

    const d = this.adapter().startOfDay(cell.date);
    if (!this.isWithinBounds(d)) return;

    const clamped = this.clampToBounds(d);
    this.draft.set(clamped);

    this.value = clamped;

    const formatted = this.adapter().format(clamped, this.displayFormat(), this.locale() ?? undefined);
    this.inputValue.set(formatted);

    this.onChange(clamped);
    this.onTouched();

    this.close('selection');
  }

  cancel(): void {
    if (this.isDisabled()) return;

    this.draft.set(this.value);

    const formatted = this.value
      ? this.adapter().format(this.value, this.displayFormat(), this.locale() ?? undefined)
      : '';

    this.inputValue.set(formatted);
    this.close('blur');
    this.onTouched();
  }

  confirm(): void {
    if (this.isDisabled()) return;

    const d = this.draft();
    if (!d) {
      this.value = null;
      this.inputValue.set('');
      this.onChange(null);
      this.onTouched();
      this.close('selection');
      return;
    }

    const clamped = this.clampToBounds(d);
    this.value = clamped;

    const formatted = this.adapter().format(clamped, this.displayFormat(), this.locale() ?? undefined);
    this.inputValue.set(formatted);

    this.onChange(clamped);
    this.onTouched();
    this.close('selection');
  }

  /* =====================
   * Selection helpers
   * ===================== */
  isMonthSelected(monthIndex0: number): boolean {
    return this.selectedMonth() === monthIndex0;
  }

  isYearSelected(year: number): boolean {
    return this.selectedYear() === year;
  }

  isCellSelected(cell: CalendarCell): boolean {
    const d = this.draft() ?? this.value;
    return !!d && this.adapter().isSameDay(cell.date, d);
  }

  isCellDisabled(cell: CalendarCell): boolean {
    return !this.isWithinBounds(cell.date);
  }

  isMonthDisabled(monthIndex0: number): boolean {
    const min = this.minD();
    const max = this.maxD();
    if (!min && !max) return false;

    const y = this.selectedYear();
    const start = this.adapter().startOfDay(this.adapter().setYear(this.adapter().setMonth(new Date(), monthIndex0), y));
    const end = this.adapter().endOfMonth(start);

    if (min && this.adapter().isBeforeDay(end, min)) return true;
    if (max && this.adapter().isAfterDay(start, max)) return true;
    return false;
  }

  isYearDisabled(year: number): boolean {
    const min = this.minD();
    const max = this.maxD();
    if (!min && !max) return false;

    const start = this.adapter().startOfDay(this.adapter().setYear(this.adapter().setMonth(new Date(), 0), year));
    const end = this.adapter().endOfYear(start);

    if (min && this.adapter().isBeforeDay(end, min)) return true;
    if (max && this.adapter().isAfterDay(start, max)) return true;
    return false;
  }

  /* =====================
   * Internals
   * ===================== */
  private clampToBounds(d: Date): Date {
    const min = this.minD();
    const max = this.maxD();
    if (min && this.adapter().isBeforeDay(d, min)) return min;
    if (max && this.adapter().isAfterDay(d, max)) return max;
    return d;
  }

  private isWithinBounds(d: Date): boolean {
    const min = this.minD();
    const max = this.maxD();
    if (min && this.adapter().isBeforeDay(d, min)) return false;
    if (max && this.adapter().isAfterDay(d, max)) return false;
    return true;
  }
}
