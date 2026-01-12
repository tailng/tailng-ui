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
  readonly placeholder = input<string>('DD / MM / YYYY');
  readonly min = input<Date | null>(null);
  readonly max = input<Date | null>(null);
  readonly disabled = input<boolean>(false);

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
  /** committed value (CVA) */
  private value: Dayjs | null = null;

  /** draft value (while overlay open) */
  readonly draft = signal<Dayjs | null>(null);

  /** input text */
  readonly inputValue = signal('');

  private onChange: (value: Date | null) => void = () => {};
  private onTouched: () => void = () => {};

  /* =====================
   * UI constants
   * ===================== */
  readonly months = MONTHS;
  readonly weekdays = WEEKDAYS;

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
  readonly view = computed(() => {
    // view is driven by draft (preferred), then committed, else today
    return (this.draft() ?? this.value ?? dayjs().startOf('day')).startOf('day');
  });

  readonly selectedYear = computed(() => this.view().year());
  readonly selectedMonth = computed(() => this.view().month());

  readonly yearBase = signal<number>(Math.floor(dayjs().year() / YEAR_WINDOW_SIZE) * YEAR_WINDOW_SIZE);
  
  readonly years = computed(() => {
    const base = this.yearBase();
    return Array.from({ length: YEAR_WINDOW_SIZE }, (_, i) => base + i);
  });

  readonly previewLabel = computed(() => {
    const d = this.draft() ?? this.value;
    return d ? d.format('DD MMM YYYY') : '—';
  });

  readonly calendarCells = computed<CalendarCell[]>(() => {
    const v = this.view().startOf('month');
    const startDow = v.day(); // 0..6
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
    // If min/max exists, avoid paging into a window where ALL years are disabled.
    const min = this.minD();
    const max = this.maxD();
  
    if (!min && !max) return false;
  
    const years = Array.from({ length: YEAR_WINDOW_SIZE }, (_, i) => nextBase + i);
    return years.every((y) => this.isYearDisabled(y));
  }
  
  constructor() {
    // Sync external [disabled]
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
    this.inputValue.set(clamped.format('DD/MM/YYYY'));

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

    // initialize draft from committed when opening
    if (this.draft() == null) this.draft.set(this.value ?? dayjs().startOf('day'));
    const y = (this.draft() ?? this.value ?? dayjs()).year();
    this.yearBase.set(Math.floor(y / YEAR_WINDOW_SIZE) * YEAR_WINDOW_SIZE);
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
    if (open) this.open('programmatic');
    else this.close('programmatic');
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
   * Input handling (DD/MM/YYYY)
   * ===================== */
  onInput(ev: Event) {
    if (this.isDisabled()) return;

    const text = (ev.target as HTMLInputElement).value ?? '';
    this.inputValue.set(text);

    const parsed = this.parseDdMmYyyy(text);
    if (!parsed) {
      // Don’t overwrite committed immediately with null while typing.
      // But for form value, we keep it null to show invalid state.
      this.onChange(null);
      return;
    }

    const clamped = this.clampToBounds(parsed);
    this.draft.set(clamped);
    // NOTE: not committing until Confirm (overlay UX). If you want typing to commit immediately, call commit(clamped) here.
    this.onTouched();
  }

  onBlur() {
    this.onTouched();
  }

  onKeydown(ev: KeyboardEvent) {
    if (this.isDisabled()) return;

    if (ev.key === 'Escape' && this.isOpen()) {
      ev.preventDefault();
      this.close('escape');
      return;
    }

    if (!this.isOpen() && (ev.key === 'ArrowDown' || ev.key === 'Enter')) {
      ev.preventDefault();
      this.open('programmatic');
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

  selectDay(cell: CalendarCell): void {
    if (this.isDisabled()) return;

    const d = cell.date.startOf('day');
    if (!this.isWithinBounds(d)) return;

    this.draft.set(this.clampToBounds(d));
  }

  cancel(): void {
    if (this.isDisabled()) return;
    // revert draft -> committed
    this.draft.set(this.value);
    this.inputValue.set(this.value ? this.value.format('DD/MM/YYYY') : '');
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

    this.inputValue.set(clamped.format('DD/MM/YYYY'));
    this.onChange(clamped.toDate());
    this.onTouched();
    this.close('selection');
  }

  /* =====================
   * Selection helpers for template
   * ===================== */
  isMonthSelected(monthIndex0: number): boolean {
    return this.selectedMonth() === monthIndex0;
  }

  isYearSelected(year: number): boolean {
    return this.selectedYear() === year;
  }

  isCellSelected(cell: CalendarCell): boolean {
    const d = this.draft() ?? this.value;
    if (!d) return false;
    return cell.date.isSame(d, 'day');
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
  private parseDdMmYyyy(text: string): Dayjs | null {
    const m = text.trim().match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
    if (!m) return null;

    const dd = Number(m[1]);
    const mm = Number(m[2]);
    const yyyy = Number(m[3]);

    if (mm < 1 || mm > 12) return null;

    const d = dayjs().year(yyyy).month(mm - 1).date(dd).startOf('day');
    if (!d.isValid()) return null;

    // strict validation (31/02 etc)
    if (d.year() !== yyyy || d.month() !== mm - 1 || d.date() !== dd) return null;

    return d;
  }

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
