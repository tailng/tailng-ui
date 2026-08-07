import {
  Component,
  ElementRef,
  booleanAttribute,
  computed,
  forwardRef,
  inject,
  input,
  model,
  output,
  viewChild,
} from '@angular/core';
import type { FormValueControl } from '@angular/forms/signals';
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

export type TngMonthDayValue = Readonly<{
  day: number;
  month: number;
}>;

function currentYear(): number {
  return new Date().getFullYear();
}

function normalizeYear(value: number | string): number {
  return Math.trunc(typeof value === 'number' ? value : Number(value));
}

function normalizeMonthDay(value: Readonly<TngMonthDayValue>): TngMonthDayValue {
  return Object.freeze({
    day: Math.max(1, Math.min(31, Math.trunc(value.day))),
    month: Math.max(1, Math.min(12, Math.trunc(value.month))),
  });
}

function pad2(value: number): string {
  return value.toString().padStart(2, '0');
}

function createDate(year: number, value: TngMonthDayValue): Date {
  return defaultDatepickerDateAdapter.createDate(year, value.month - 1, value.day);
}

function toMonthDay(date: Readonly<Date>): TngMonthDayValue {
  return Object.freeze({
    day: defaultDatepickerDateAdapter.getDate(date),
    month: defaultDatepickerDateAdapter.getMonth(date) + 1,
  });
}

function createMonthDayAdapter(year: number): TngDateAdapter<Date> {
  return {
    ...defaultDatepickerDateAdapter,
    format: (date: Readonly<Date>, format, locale): string => {
      if (format === 'input') {
        return `${pad2(defaultDatepickerDateAdapter.getMonth(date) + 1)}-${pad2(
          defaultDatepickerDateAdapter.getDate(date),
        )}`;
      }

      return defaultDatepickerDateAdapter.format(date, format, locale);
    },
    parse: (text, locale): Date | null => {
      const match = /^(\d{2})-(\d{2})$/.exec(text.trim());
      if (match !== null) {
        return createDate(year, {
          day: Number(match[2]),
          month: Number(match[1]),
        });
      }

      return defaultDatepickerDateAdapter.parse(text, locale);
    },
  };
}

@Component({
  selector: 'tng-month-daypicker',
  imports: [TngDatepickerComponent],
  template: `
    <tng-datepicker
      #datepicker
      [adapter]="adapter()"
      [allowManualInput]="allowManualInput()"
      [autoCommitView]="true"
      [defaultOpen]="defaultOpen()"
      [disabled]="disabled()"
      [fullWidth]="fullWidth()"
      [maxDate]="maxDate()"
      [minDate]="minDate()"
      [placeholder]="placeholder()"
      [readonly]="readonly()"
      [restoreFocus]="restoreFocus()"
      [value]="selectedDate()"
      (openChange)="openChange.emit($event)"
      (valueChange)="handleDateValueChange($event)"
      (viewChange)="handleViewChange($event)"
    />
  `,
  providers: [
    {
      provide: TNG_FORM_FIELD_CONTROL,
      useFactory: (cmp: Readonly<TngMonthDaypickerComponent>): TngFormFieldControl =>
        cmp.formFieldControl,
      deps: [forwardRef(() => TngMonthDaypickerComponent)],
    },
  ],
})
export class TngMonthDaypickerComponent implements FormValueControl<TngMonthDayValue | undefined> {
  private readonly hostEl: HTMLElement =
  inject(ElementRef<HTMLElement>).nativeElement as HTMLElement;
  private readonly datepicker = viewChild<TngDatepickerComponent<Date>>('datepicker');
  private hasObservedInitialValue = false;

  public readonly value = model<TngMonthDayValue | undefined>(undefined);
  public readonly defaultValue = input<TngMonthDayValue, TngMonthDayValue>(
    { day: 1, month: 1 },
    {
      transform: normalizeMonthDay,
    },
  );
  public readonly year = input<number, number | string>(currentYear(), {
    transform: normalizeYear,
  });
  public readonly allowManualInput = input<boolean>(true);
  public readonly defaultOpen = input<boolean>(false);
  public readonly disabled = input<boolean>(false);
  public readonly fullWidth = input<boolean>(true);
  public readonly placeholder = input<string>('MM-DD');
  public readonly readonly = input<boolean>(false);
  public readonly restoreFocus = input<boolean>(true);
  public readonly invalid = input<boolean, unknown>(false, {
    transform: booleanAttribute,
  });
  public readonly required = input<boolean, unknown>(false, {
    transform: booleanAttribute,
  });

  public readonly openChange = output<boolean>();

  /**
   * Form-field integration. The focusable element is the inner datepicker's
   * text input. Label `for=` and aria-describedby route there so the user can
   * click the form-field label to focus the picker input.
   */
  public readonly formFieldControl: TngFormFieldControl = createFormFieldAdapter({
    hostElement: this.hostEl,
    focusableSelector: 'input[data-slot="datepicker-input"]',
    controlKind: 'composite',
    isDisabled: () => this.disabled(),
    isFocused: () => false,
    isInvalid: () => this.invalid(),
    isRequired: () => this.required(),
  });

  protected readonly selectedValue = computed(() => {
    const controlled = this.value();
    return controlled === undefined ? this.defaultValue() : normalizeMonthDay(controlled);
  });
  protected readonly selectedDate = computed(() => createDate(this.year(), this.selectedValue()));
  protected readonly minDate = computed(() =>
    defaultDatepickerDateAdapter.createDate(this.year(), 0, 1),
  );
  protected readonly maxDate = computed(() =>
    defaultDatepickerDateAdapter.createDate(this.year(), 11, 31),
  );
  protected readonly adapter = computed(() => createMonthDayAdapter(this.year()));

  protected handleDateValueChange(value: Readonly<TngDateSelectionInput<Date>> | undefined): void {
    if (!(value instanceof Date)) {
      return;
    }

    const nextValue = toMonthDay(value);
    if (!this.hasObservedInitialValue) {
      this.hasObservedInitialValue = true;
      const selectedValue = this.selectedValue();
      if (selectedValue.month === nextValue.month && selectedValue.day === nextValue.day) {
        return;
      }
    }

    this.value.set(nextValue);
  }

  protected handleViewChange(view: TngCalendarView): void {
    if (view !== 'year') {
      return;
    }

    queueMicrotask(() => {
      this.datepicker()?.showMonthsPanel();
    });
  }
}
