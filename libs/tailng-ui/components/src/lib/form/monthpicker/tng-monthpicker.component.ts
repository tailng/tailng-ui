import {
  Component,
  ElementRef,
  booleanAttribute,
  computed,
  effect,
  forwardRef,
  inject,
  input,
  model,
  output,
  signal,
  viewChild,
} from '@angular/core';
import type { FormValueControl } from '@angular/forms/signals';
import type { TngOverlayScrollStrategy } from '@tailng-ui/cdk';
import {
  defaultDatepickerDateAdapter,
  type TngCalendarView,
  type TngDateAdapter,
  type TngDateSelectionInput,
} from '@tailng-ui/primitives';
import { TngDatepickerComponent } from '../datepicker/tng-datepicker.component';
import { createFormFieldAdapter } from '../form-field/tng-form-field-adapter';
import {
  TNG_FORM_FIELD_CONTROL,
  type TngFormFieldControl,
} from '../form-field/tng-form-field.control';

/** A calendar month with a one-based month number (January is 1). */
export type TngYearMonthValue = Readonly<{
  month: number;
  year: number;
}>;

function currentYearMonth(): TngYearMonthValue {
  const today = new Date();
  return Object.freeze({ month: today.getMonth() + 1, year: today.getFullYear() });
}

function normalizeYearMonth(value: Readonly<TngYearMonthValue>): TngYearMonthValue {
  return Object.freeze({
    month: Math.max(1, Math.min(12, Math.trunc(value.month))),
    year: Math.trunc(value.year),
  });
}

function normalizeOptionalYearMonth(
  value: Readonly<TngYearMonthValue> | undefined,
): TngYearMonthValue | undefined {
  return value === undefined ? undefined : normalizeYearMonth(value);
}

function pad2(value: number): string {
  return value.toString().padStart(2, '0');
}

function createDate(value: Readonly<TngYearMonthValue>): Date {
  return defaultDatepickerDateAdapter.createDate(value.year, value.month - 1, 1);
}

function toYearMonth(date: Readonly<Date>): TngYearMonthValue {
  return Object.freeze({
    month: defaultDatepickerDateAdapter.getMonth(date) + 1,
    year: defaultDatepickerDateAdapter.getYear(date),
  });
}

function yearMonthsEqual(
  left: Readonly<TngYearMonthValue>,
  right: Readonly<TngYearMonthValue>,
): boolean {
  return left.month === right.month && left.year === right.year;
}

function createYearMonthAdapter(): TngDateAdapter<Date> {
  return {
    ...defaultDatepickerDateAdapter,
    format: (date, format, locale): string => {
      if (format === 'input') {
        return `${defaultDatepickerDateAdapter.getYear(date)}-${pad2(
          defaultDatepickerDateAdapter.getMonth(date) + 1,
        )}`;
      }

      return defaultDatepickerDateAdapter.format(date, format, locale);
    },
    parse: (text): Date | null => {
      const match = /^(\d{4})-(\d{2})$/.exec(text.trim());
      if (match === null) {
        return null;
      }

      const year = Number(match[1]);
      const month = Number(match[2]);
      if (month < 1 || month > 12) {
        return null;
      }

      return defaultDatepickerDateAdapter.createDate(year, month - 1, 1);
    },
  };
}

@Component({
  selector: 'tng-monthpicker',
  imports: [TngDatepickerComponent],
  template: `
    <tng-datepicker
      #datepicker
      [adapter]="adapter"
      [allowManualInput]="allowManualInput()"
      [ariaDescribedBy]="ariaDescribedBy()"
      [ariaLabel]="ariaLabel()"
      [ariaLabelledBy]="ariaLabelledBy()"
      [autoCommitView]="false"
      [defaultOpen]="defaultOpen()"
      [disabled]="disabled()"
      [fullWidth]="fullWidth()"
      [id]="id()"
      [inputAriaLabel]="inputAriaLabel()"
      [invalid]="invalid()"
      [maxDate]="maxDate()"
      [minDate]="minDate()"
      [placeholder]="placeholder()"
      [readonly]="readonly()"
      [required]="required()"
      [restoreFocus]="restoreFocus()"
      [scrollStrategy]="scrollStrategy()"
      [value]="displayDate()"
      [yearPageSize]="yearPageSize()"
      (monthChange)="handleMonthChange($event)"
      (openChange)="handleOpenChange($event)"
      (valueChange)="handleDateValueChange($event)"
      (viewChange)="handleViewChange($event)"
    />
  `,
  providers: [
    {
      provide: TNG_FORM_FIELD_CONTROL,
      useFactory: (cmp: TngMonthpickerComponent): TngFormFieldControl => cmp.formFieldControl,
      deps: [forwardRef(() => TngMonthpickerComponent)],
    },
  ],
})
export class TngMonthpickerComponent implements FormValueControl<TngYearMonthValue | undefined> {
  private readonly hostEl: HTMLElement = inject(ElementRef<HTMLElement>)
    .nativeElement as HTMLElement;
  private readonly datepicker = viewChild<TngDatepickerComponent<Date>>('datepicker');
  private pendingMonth: TngYearMonthValue | null = null;

  public readonly value = model<TngYearMonthValue | undefined>(undefined);
  public readonly defaultValue = input<TngYearMonthValue, TngYearMonthValue>(currentYearMonth(), {
    transform: normalizeYearMonth,
  });
  public readonly minMonth = input<TngYearMonthValue | undefined, TngYearMonthValue | undefined>(
    undefined,
    { transform: normalizeOptionalYearMonth },
  );
  public readonly maxMonth = input<TngYearMonthValue | undefined, TngYearMonthValue | undefined>(
    undefined,
    { transform: normalizeOptionalYearMonth },
  );
  public readonly allowManualInput = input<boolean, unknown>(true, {
    transform: booleanAttribute,
  });
  public readonly ariaDescribedBy = input<string | null>(null);
  public readonly ariaLabel = input<string | null>(null);
  public readonly ariaLabelledBy = input<string | null>(null);
  public readonly defaultOpen = input<boolean, unknown>(false, { transform: booleanAttribute });
  public readonly disabled = input<boolean, unknown>(false, { transform: booleanAttribute });
  public readonly fullWidth = input<boolean, unknown>(true, { transform: booleanAttribute });
  public readonly id = input<string | null>(null);
  public readonly inputAriaLabel = input<string>('Month input');
  public readonly invalid = input<boolean, unknown>(false, { transform: booleanAttribute });
  public readonly placeholder = input<string>('YYYY-MM');
  public readonly readonly = input<boolean, unknown>(false, { transform: booleanAttribute });
  public readonly required = input<boolean, unknown>(false, { transform: booleanAttribute });
  public readonly restoreFocus = input<boolean, unknown>(true, { transform: booleanAttribute });
  public readonly scrollStrategy = input<TngOverlayScrollStrategy>('reposition');
  public readonly yearPageSize = input<number, number | string>(24, {
    transform: (value) =>
      Math.max(4, Math.trunc(typeof value === 'number' ? value : Number(value))),
  });

  public readonly openChange = output<boolean>();

  protected readonly adapter = createYearMonthAdapter();
  protected readonly selectedMonth = computed(() =>
    normalizeYearMonth(this.value() ?? this.defaultValue()),
  );
  protected readonly displayDate = signal(createDate(currentYearMonth()));
  protected readonly minDate = computed(() => {
    const value = this.minMonth();
    return value === undefined ? undefined : createDate(value);
  });
  protected readonly maxDate = computed(() => {
    const value = this.maxMonth();
    return value === undefined ? undefined : createDate(value);
  });

  public readonly formFieldControl: TngFormFieldControl = createFormFieldAdapter({
    hostElement: this.hostEl,
    focusableSelector: 'input[data-slot="datepicker-input"]',
    controlKind: 'composite',
    isDisabled: () => this.disabled(),
    isFocused: () => false,
    isInvalid: () => this.invalid(),
    isRequired: () => this.required(),
  });

  public constructor() {
    effect(() => {
      this.displayDate.set(createDate(this.selectedMonth()));
    });
  }

  protected handleDateValueChange(value: Readonly<TngDateSelectionInput<Date>> | undefined): void {
    if (!(value instanceof Date)) {
      return;
    }

    const nextValue = toYearMonth(value);
    if (yearMonthsEqual(this.selectedMonth(), nextValue)) {
      return;
    }
    this.value.set(nextValue);
  }

  protected handleMonthChange(date: Date): void {
    this.pendingMonth = toYearMonth(date);
  }

  protected handleOpenChange(open: boolean): void {
    this.openChange.emit(open);
    if (!open) {
      this.pendingMonth = null;
      return;
    }

    this.displayDate.set(createDate(this.selectedMonth()));
    queueMicrotask(() => {
      this.datepicker()?.showMonthsPanel();
    });
  }

  protected handleViewChange(view: TngCalendarView): void {
    if (view !== 'day' || this.pendingMonth === null) {
      return;
    }

    const nextValue = this.pendingMonth;
    this.pendingMonth = null;
    if (!yearMonthsEqual(this.selectedMonth(), nextValue)) {
      this.value.set(nextValue);
    }
    this.datepicker()?.close();
  }
}
