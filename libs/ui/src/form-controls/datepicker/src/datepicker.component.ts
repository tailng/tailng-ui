import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  ViewChild,
  computed,
  effect,
  forwardRef,
  input,
  signal,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import dayjs, { Dayjs } from 'dayjs';

import { TailngConnectedOverlayComponent } from '../../../popups-overlays/connected-overlay/src/public-api';
import { TailngOverlayPanelComponent } from '../../../popups-overlays/overlay-panel/src/public-api';
import {
  TailngOverlayCloseReason,
  TailngOverlayRefComponent,
} from '../../../popups-overlays/overlay-ref/src/public-api';

import {
  computeNextCaretPos,
  formatDate,
  parseSmartDate,
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
  date: Dayjs;
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

  @ViewChild('inputEl', { static: true })
  inputEl!: ElementRef<HTMLInputElement>;

  /* =====================
   * Overlay state
   * ===================== */
  readonly isOpen = signal(false);
  readonly isDisabled = signal(false);

  /* =====================
   * Form values
   * ===================== */
  private value: Dayjs | null = null;
  readonly draft = signal<Dayjs | null>(null);
  readonly inputValue = signal('');

  private onChange: (value: Date | null) => void = () => {};
  private onTouched: () => void = () => {};

  /* =====================
   * UI constants
   * ===================== */
  readonly months = MONTHS;
  readonly weekdays = WEEKDAYS;
  

  readonly focusedDate = signal<Dayjs | null>(null);

  /* =====================
   * Derived bounds
   * ===================== */
  private readonly minD = computed(() =>
    this.min() ? dayjs(this.min()!).startOf('day') : null
  );
  private readonly maxD = computed(() =>
    this.max() ? dayjs(this.max()!).startOf('day') : null
  );

  /* =====================
   * View base
   * ===================== */
  readonly view = computed(() =>
    (this.draft() ?? this.value ?? dayjs().startOf('day')).startOf('day')
  );

  readonly selectedYear = computed(() => this.view().year());
  readonly selectedMonth = computed(() => this.view().month());

  readonly yearBase = signal<number>(
    Math.floor(dayjs().year() / YEAR_WINDOW_SIZE) * YEAR_WINDOW_SIZE
  );

  readonly years = computed(() => {
    const base = this.yearBase();
    return Array.from({ length: YEAR_WINDOW_SIZE }, (_, i) => base + i);
  });

  readonly previewLabel = computed(() => {
    const d = this.draft() ?? this.value;
    if (!d) return '—';
    const loc = this.locale();
    return loc ? d.locale(loc).format(this.previewFormat()) : d.format(this.previewFormat());
  });

  readonly calendarCells = computed<CalendarCell[]>(() => {
    const v = this.view().startOf('month');
    const startDow = v.day();
    const gridStart = v.subtract(startDow, 'day');

    const cells: CalendarCell[] = [];
    for (let i = 0; i < 42; i++) {
      const d = gridStart.add(i, 'day');
      cells.push({
        date: d,
        label: String(d.date()),
        isOutsideMonth: d.month() !== v.month(),
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

    const d = dayjs(value).startOf('day');
    if (!d.isValid()) return;

    const clamped = this.clampToBounds(d);
    this.value = clamped;
    this.draft.set(clamped);

    this.yearBase.set(Math.floor(clamped.year() / YEAR_WINDOW_SIZE) * YEAR_WINDOW_SIZE);

    const formatted = formatDate(clamped, this.displayFormat(), this.locale() ?? undefined);
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
  
    if (this.draft() == null) this.draft.set(this.value ?? dayjs().startOf('day'));
    const current = (this.draft() ?? this.value ?? dayjs()).startOf('day');
  
    // year window sync (existing)
    const y = current.year();
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

    const res = parseSmartDate(raw, this.displayFormat(), this.locale() ?? undefined);

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

    const formatted = formatDate(clamped, this.displayFormat(), this.locale() ?? undefined);
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

  private setFocusedDate(next: Dayjs) {
    const d = next.startOf('day');
  
    // clamp to bounds
    const clamped = this.clampToBounds(d);
  
    this.focusedDate.set(clamped);
  
    // If user navigates to another month/year, update draft to keep calendar view in sync
    this.draft.set(clamped);
  
    // Keep year window aligned
    this.yearBase.set(Math.floor(clamped.year() / YEAR_WINDOW_SIZE) * YEAR_WINDOW_SIZE);
  }
  
  private moveFocusedByDays(delta: number) {
    const base = (this.focusedDate() ?? this.draft() ?? this.value ?? dayjs()).startOf('day');
    this.setFocusedDate(base.add(delta, 'day'));
  }
  
  private moveFocusedByMonths(delta: number) {
    const base = (this.focusedDate() ?? this.draft() ?? this.value ?? dayjs()).startOf('day');
    this.setFocusedDate(base.add(delta, 'month'));
  }
  
  private moveFocusedToStartOfMonth() {
    const base = (this.focusedDate() ?? this.draft() ?? this.value ?? dayjs()).startOf('day');
    this.setFocusedDate(base.startOf('month'));
  }
  
  private moveFocusedToEndOfMonth() {
    const base = (this.focusedDate() ?? this.draft() ?? this.value ?? dayjs()).startOf('day');
    this.setFocusedDate(base.endOf('month').startOf('day'));
  }
  
  isCellFocused(cell: CalendarCell): boolean {
    const f = this.focusedDate();
    if (!f) return false;
    return cell.date.isSame(f, 'day');
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
        this.inputValue.set(clamped.format(this.displayFormat()));
        this.onChange(clamped.toDate());
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

    const base = this.draft() ?? this.value ?? dayjs().startOf('day');
    const day = base.date();

    const m = base.set('month', monthIndex0).set('date', 1);
    const nextDay = Math.min(day, m.daysInMonth());

    this.draft.set(this.clampToBounds(m.set('date', nextDay).startOf('day')));
  }

  selectYear(year: number): void {
    if (this.isDisabled()) return;

    const base = this.draft() ?? this.value ?? dayjs().startOf('day');
    const day = base.date();

    const y = base.set('year', year).set('date', 1);
    const nextDay = Math.min(day, y.daysInMonth());

    this.draft.set(this.clampToBounds(y.set('date', nextDay).startOf('day')));
  }

  // day click commits + closes (as you requested)
  selectDay(cell: { date: Dayjs }) {
    if (this.isDisabled()) return;

    const d = cell.date.startOf('day');
    if (!this.isWithinBounds(d)) return;

    const clamped = this.clampToBounds(d);
    this.draft.set(clamped);

    this.value = clamped;

    const formatted = formatDate(clamped, this.displayFormat(), this.locale() ?? undefined);
    this.inputValue.set(formatted);

    this.onChange(clamped.toDate());
    this.onTouched();

    this.close('selection');
  }

  cancel(): void {
    if (this.isDisabled()) return;

    this.draft.set(this.value);

    const formatted = this.value
      ? formatDate(this.value, this.displayFormat(), this.locale() ?? undefined)
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

    const formatted = formatDate(clamped, this.displayFormat(), this.locale() ?? undefined);
    this.inputValue.set(formatted);

    this.onChange(clamped.toDate());
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
    return !!d && cell.date.isSame(d, 'day');
  }

  isCellDisabled(cell: CalendarCell): boolean {
    return !this.isWithinBounds(cell.date);
  }

  isMonthDisabled(monthIndex0: number): boolean {
    const min = this.minD();
    const max = this.maxD();
    if (!min && !max) return false;

    const y = this.selectedYear();
    const start = dayjs().year(y).month(monthIndex0).date(1).startOf('day');
    const end = start.endOf('month');

    if (min && end.isBefore(min)) return true;
    if (max && start.isAfter(max)) return true;
    return false;
  }

  isYearDisabled(year: number): boolean {
    const min = this.minD();
    const max = this.maxD();
    if (!min && !max) return false;

    const start = dayjs().year(year).month(0).date(1).startOf('day');
    const end = start.endOf('year');

    if (min && end.isBefore(min)) return true;
    if (max && start.isAfter(max)) return true;
    return false;
  }

  /* =====================
   * Internals
   * ===================== */
  private clampToBounds(d: Dayjs): Dayjs {
    const min = this.minD();
    const max = this.maxD();
    if (min && d.isBefore(min)) return min;
    if (max && d.isAfter(max)) return max;
    return d;
  }

  private isWithinBounds(d: Dayjs): boolean {
    const min = this.minD();
    const max = this.maxD();
    if (min && d.isBefore(min, 'day')) return false;
    if (max && d.isAfter(max, 'day')) return false;
    return true;
  }
}
