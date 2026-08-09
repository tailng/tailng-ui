import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import {
  FormField,
  form,
  max as maxValidator,
  min as minValidator,
  pattern as patternValidator,
} from '@angular/forms/signals';
import { describe, expect, it } from 'vitest';

import {
  TngAutocomplete,
  TngMultiAutocomplete,
  TngMultiSelect,
  TngSelect,
  type TngNumberRangeValue,
} from '@tailng-ui/primitives';

import { TngAutocompleteComponent } from '../autocomplete/tng-autocomplete.component';
import { TngCheckboxComponent } from '../checkbox/tng-checkbox.component';
import { TngDateRangePickerComponent } from '../date-range-picker/tng-date-range-picker.component';
import { TngDatepickerComponent } from '../datepicker/tng-datepicker.component';
import { TngInputOtpComponent } from '../input-otp/tng-input-otp.component';
import { TngInputComponent } from '../input/tng-input.component';
import { TngMonthDaypickerComponent } from '../month-daypicker/tng-month-daypicker.component';
import { TngMultiAutocompleteComponent } from '../multi-autocomplete/tng-multi-autocomplete.component';
import { TngMultiSelectComponent } from '../multiselect/tng-multiselect.component';
import { TngNumberRangeComponent } from '../number-range/tng-number-range.component';
import { TngRadioComponent } from '../radio/tng-radio.component';
import { TngSelectComponent } from '../select/tng-select.component';
import { TngRangeSliderComponent } from '../range-slider/tng-range-slider.component';
import { TngSliderComponent } from '../slider/tng-slider.component';
import type { TngRangeSliderValue } from '../range-slider/tng-range-slider.utils';
import { TngSwitchComponent } from '../switch/tng-switch.component';
import { TngTextareaComponent } from '../textarea/tng-textarea.component';
import { TngToggleComponent } from '../toggle/tng-toggle.component';
import { TngYearpickerComponent } from '../yearpicker/tng-yearpicker.component';

type TeamOption = Readonly<{
  id: string;
  label: string;
}>;

const teamOptions: readonly TeamOption[] = Object.freeze([
  { id: 'alpha', label: 'Alpha' },
  { id: 'bravo', label: 'Bravo' },
  { id: 'charlie', label: 'Charlie' },
]);

@Component({
  imports: [FormField, TngInputComponent],
  template: `<tng-input
    data-testid="input"
    ariaLabel="Project name"
    [formField]="projectForm.name"
  ></tng-input>`,
})
class InputSignalFormsHostComponent {
  readonly projectModel = signal({ name: 'Initial name' });
  readonly projectForm = form(this.projectModel);
}

@Component({
  imports: [FormField, TngInputComponent],
  template: `<tng-input
    data-testid="input"
    ariaLabel="Project code"
    [formField]="projectForm.code"
  ></tng-input>`,
})
class InputPatternSignalFormsHostComponent {
  readonly projectModel = signal({ code: 'ABC' });
  readonly projectForm = form(this.projectModel, (project) => {
    patternValidator(project.code, /^[A-Z]+$/);
  });
}

@Component({
  imports: [FormField, TngTextareaComponent],
  template: `<tng-textarea
    data-testid="textarea"
    ariaLabel="Description"
    [formField]="projectForm.description"
  ></tng-textarea>`,
})
class TextareaSignalFormsHostComponent {
  readonly projectModel = signal({ description: 'Initial notes' });
  readonly projectForm = form(this.projectModel);
}

@Component({
  imports: [FormField, TngSliderComponent],
  template: `<tng-slider data-testid="slider" [formField]="settingsForm.volume"></tng-slider>`,
})
class SliderSignalFormsHostComponent {
  readonly settingsModel = signal({ volume: 25 });
  readonly settingsForm = form(this.settingsModel, (settings) => {
    minValidator(settings.volume, 0);
    maxValidator(settings.volume, 100);
  });
}

@Component({
  imports: [FormField, TngRangeSliderComponent],
  template: `<tng-range-slider
    data-testid="range-slider"
    [formField]="filtersForm.price"
    [lowerBound]="10"
    [upperBound]="90"
  ></tng-range-slider>`,
})
class RangeSliderSignalFormsHostComponent {
  readonly filtersModel = signal<{ price: TngRangeSliderValue }>({
    price: { min: 20, max: 80 },
  });
  readonly filtersForm = form(this.filtersModel);
}

@Component({
  imports: [FormField, TngCheckboxComponent],
  template: `
    <tng-checkbox data-testid="checkbox" [formField]="releaseForm.ready">
      Release ready
    </tng-checkbox>
  `,
})
class CheckboxSignalFormsHostComponent {
  readonly releaseModel = signal({ ready: true });
  readonly releaseForm = form(this.releaseModel);
}

@Component({
  imports: [FormField, TngRadioComponent],
  template: `
    <tng-radio data-testid="radio" [formField]="settingsForm.selected"> Primary option </tng-radio>
  `,
})
class RadioSignalFormsHostComponent {
  readonly settingsModel = signal({ selected: false });
  readonly settingsForm = form(this.settingsModel);
}

@Component({
  imports: [FormField, TngSwitchComponent],
  template: `
    <tng-switch data-testid="switch" [formField]="settingsForm.enabled"> Enable sync </tng-switch>
  `,
})
class SwitchSignalFormsHostComponent {
  readonly settingsModel = signal({ enabled: true });
  readonly settingsForm = form(this.settingsModel);
}

@Component({
  imports: [FormField, TngToggleComponent],
  template: `
    <tng-toggle data-testid="toggle" [formField]="preferencesForm.pinned"> Pin sidebar </tng-toggle>
  `,
})
class ToggleSignalFormsHostComponent {
  readonly preferencesModel = signal({ pinned: false });
  readonly preferencesForm = form(this.preferencesModel);
}

@Component({
  imports: [FormField, TngInputOtpComponent],
  template: `<tng-input-otp
    data-testid="otp"
    [length]="4"
    [formField]="verificationForm.code"
  ></tng-input-otp>`,
})
class InputOtpSignalFormsHostComponent {
  readonly verificationModel = signal({ code: '12' });
  readonly verificationForm = form(this.verificationModel);
}

@Component({
  imports: [FormField, TngInputOtpComponent],
  template: `<tng-input-otp
    data-testid="otp"
    type="custom"
    [length]="4"
    [formField]="verificationForm.code"
  ></tng-input-otp>`,
})
class InputOtpPatternSignalFormsHostComponent {
  readonly verificationModel = signal({ code: 'AB' });
  readonly verificationForm = form(this.verificationModel, (verification) => {
    patternValidator(verification.code, /^[A-Z]+$/);
  });
}

@Component({
  imports: [FormField, TngNumberRangeComponent],
  template: `<tng-number-range
    data-testid="range"
    ariaLabel="Price range"
    [formField]="pricingForm.range"
  ></tng-number-range>`,
})
class NumberRangeSignalFormsHostComponent {
  readonly pricingModel = signal<{ range: TngNumberRangeValue }>({
    range: { min: 10, max: 50 },
  });
  readonly pricingForm = form(this.pricingModel);
}

@Component({
  imports: [FormField, TngDatepickerComponent],
  template: `<tng-datepicker
    data-testid="datepicker"
    [formField]="bookingForm.date"
  ></tng-datepicker>`,
})
class DatepickerSignalFormsHostComponent {
  readonly bookingModel = signal<{ date: Date | null }>({ date: new Date(2026, 2, 31) });
  readonly bookingForm = form(this.bookingModel);
}

@Component({
  imports: [FormField, TngDateRangePickerComponent],
  template: `<tng-date-range-picker
    data-testid="date-range"
    [formField]="bookingForm.range"
  ></tng-date-range-picker>`,
})
class DateRangePickerSignalFormsHostComponent {
  readonly bookingModel = signal({
    range: {
      start: new Date(2024, 3, 22),
      end: new Date(2024, 3, 24),
    },
  });
  readonly bookingForm = form(this.bookingModel);
}

@Component({
  imports: [FormField, TngDateRangePickerComponent],
  template: `<tng-date-range-picker
    data-testid="date-range"
    [formField]="bookingForm.range"
    [closeOnSelect]="false"
    [today]="today"
  />`,
})
class DateRangePickerEmptySignalFormsHostComponent {
  readonly today = '2024-04-18';
  readonly bookingModel = signal({
    range: { start: null as Date | null, end: null as Date | null },
  });
  readonly bookingForm = form(this.bookingModel);
}

@Component({
  imports: [FormField, TngMonthDaypickerComponent],
  template: `<tng-month-daypicker
    data-testid="month-day"
    [formField]="reminderForm.date"
  ></tng-month-daypicker>`,
})
class MonthDaypickerSignalFormsHostComponent {
  readonly reminderModel = signal({ date: { month: 4, day: 22 } });
  readonly reminderForm = form(this.reminderModel);
}

@Component({
  imports: [FormField, TngYearpickerComponent],
  template: `<tng-yearpicker data-testid="year" [formField]="archiveForm.year"></tng-yearpicker>`,
})
class YearpickerSignalFormsHostComponent {
  readonly archiveModel = signal({ year: 2024 });
  readonly archiveForm = form(this.archiveModel);
}

@Component({
  imports: [FormField, TngSelectComponent],
  template: `
    <tng-select
      data-testid="select"
      aria-label="Team owner"
      [formField]="assigneeForm.owner"
      [options]="options"
      [getOptionLabel]="optionLabel"
      [getOptionValue]="optionValue"
    ></tng-select>
  `,
})
class SelectSignalFormsHostComponent {
  readonly options = teamOptions;
  readonly assigneeModel = signal({ owner: 'alpha' });
  readonly assigneeForm = form(this.assigneeModel);

  readonly optionLabel = (option: TeamOption): string => option.label;
  readonly optionValue = (option: TeamOption): string => option.id;
}

@Component({
  imports: [FormField, TngAutocompleteComponent],
  template: `
    <tng-autocomplete
      data-testid="autocomplete"
      [formField]="assigneeForm.owner"
      [options]="options"
      [getOptionLabel]="optionLabel"
      [getOptionValue]="optionValue"
    ></tng-autocomplete>
  `,
})
class AutocompleteSignalFormsHostComponent {
  readonly options = teamOptions;
  readonly assigneeModel = signal<{ owner: string | null }>({ owner: 'alpha' });
  readonly assigneeForm = form(this.assigneeModel);

  readonly optionLabel = (option: TeamOption): string => option.label;
  readonly optionValue = (option: TeamOption): string => option.id;
}

@Component({
  imports: [FormField, TngMultiSelectComponent],
  template: `
    <tng-multiselect
      data-testid="multiselect"
      aria-label="Reviewers"
      [formField]="reviewForm.reviewers"
      [options]="options"
      [getOptionLabel]="optionLabel"
      [getOptionValue]="optionValue"
    ></tng-multiselect>
  `,
})
class MultiselectSignalFormsHostComponent {
  readonly options = teamOptions;
  readonly reviewModel = signal({ reviewers: ['alpha'] as readonly string[] });
  readonly reviewForm = form(this.reviewModel);

  readonly optionLabel = (option: TeamOption): string => option.label;
  readonly optionValue = (option: TeamOption): string => option.id;
}

@Component({
  imports: [FormField, TngMultiAutocompleteComponent],
  template: `
    <tng-multi-autocomplete
      data-testid="multi-autocomplete"
      [formField]="reviewForm.reviewers"
      [options]="options"
      [getOptionLabel]="optionLabel"
      [getOptionValue]="optionValue"
    ></tng-multi-autocomplete>
  `,
})
class MultiAutocompleteSignalFormsHostComponent {
  readonly options = teamOptions;
  readonly reviewModel = signal({ reviewers: ['alpha'] as readonly string[] });
  readonly reviewForm = form(this.reviewModel);

  readonly optionLabel = (option: TeamOption): string => option.label;
  readonly optionValue = (option: TeamOption): string => option.id;
}

function queryRequiredElement<T extends Element>(
  fixture: ReturnType<typeof TestBed.createComponent>,
  selector: string,
  expectedType: abstract new (...args: never[]) => T,
): T {
  const element = fixture.nativeElement.querySelector(selector);
  if (!(element instanceof expectedType)) {
    throw new Error(`Expected ${selector} to match ${expectedType.name}.`);
  }

  return element;
}

async function settle(fixture: {
  detectChanges(): void;
  whenStable(): Promise<unknown>;
}): Promise<void> {
  fixture.detectChanges();
  await fixture.whenStable();
  fixture.detectChanges();
}

async function waitForAnimationFrame(): Promise<void> {
  await new Promise<void>((resolve) => {
    requestAnimationFrame(() => resolve());
  });
}

async function openDatepicker(fixture: ReturnType<typeof TestBed.createComponent>): Promise<void> {
  queryRequiredElement(
    fixture,
    '[data-testid="datepicker"] [data-slot="datepicker-trigger"]',
    HTMLButtonElement,
  ).click();
  await settle(fixture);
  await waitForAnimationFrame();
  await settle(fixture);
}

async function selectDatepickerDay(
  fixture: ReturnType<typeof TestBed.createComponent>,
  dayLabel: string,
): Promise<void> {
  await openDatepicker(fixture);

  const target = Array.from(document.body.querySelectorAll('[data-slot="datepicker-cell"]')).find(
    (element) =>
      element instanceof HTMLButtonElement &&
      !element.disabled &&
      element.textContent?.trim() === dayLabel,
  );

  if (!(target instanceof HTMLButtonElement)) {
    throw new Error(`Expected datepicker day ${dayLabel} to exist.`);
  }

  target.click();
  await settle(fixture);
}

function expectDateParts(value: Date | null, year: number, monthIndex: number, day: number): void {
  expect(value).toBeInstanceOf(Date);
  expect(value?.getFullYear()).toBe(year);
  expect(value?.getMonth()).toBe(monthIndex);
  expect(value?.getDate()).toBe(day);
}

function expectRangeDateParts(
  range: { start: Date | null; end: Date | null },
  startYear: number,
  startMonthIndex: number,
  startDay: number,
  endYear: number,
  endMonthIndex: number,
  endDay: number,
): void {
  expectDateParts(range.start, startYear, startMonthIndex, startDay);
  expectDateParts(range.end, endYear, endMonthIndex, endDay);
}

function expectPartialRangeStart(
  range: { start: Date | null; end: Date | null },
  year: number,
  monthIndex: number,
  day: number,
): void {
  expectDateParts(range.start, year, monthIndex, day);
  expect(range.end).toBeNull();
}

function keydown(target: EventTarget, key: string): void {
  target.dispatchEvent(new KeyboardEvent('keydown', { bubbles: true, cancelable: true, key }));
}

async function openDateRangePicker(
  fixture: ReturnType<typeof TestBed.createComponent>,
): Promise<void> {
  queryRequiredElement(
    fixture,
    '[data-testid="date-range"] [data-slot="date-range-picker-trigger"]',
    HTMLButtonElement,
  ).click();
  await settle(fixture);
  await waitForAnimationFrame();
  await settle(fixture);
}

async function selectDateRangePickerDays(
  fixture: ReturnType<typeof TestBed.createComponent>,
  startLabel: string,
  endLabel: string,
): Promise<void> {
  await openDateRangePicker(fixture);

  const clickDay = (dayLabel: string): void => {
    const target = Array.from(
      document.body.querySelectorAll('[data-slot="date-range-picker-cell"]'),
    ).find(
      (element) =>
        element instanceof HTMLButtonElement &&
        !element.disabled &&
        element.textContent?.trim() === dayLabel,
    );

    if (!(target instanceof HTMLButtonElement)) {
      throw new Error(`Expected date-range-picker day ${dayLabel} to exist.`);
    }

    target.click();
  };

  clickDay(startLabel);
  await settle(fixture);
  clickDay(endLabel);
  await settle(fixture);
}

describe('tailng-ui signal forms interop', () => {
  it('binds tng-input through its signal forms value model', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [InputSignalFormsHostComponent],
    }).createComponent(InputSignalFormsHostComponent);

    fixture.detectChanges();

    const host = fixture.componentInstance;
    const input = queryRequiredElement(fixture, '[data-testid="input"] input', HTMLInputElement);

    expect(input.value).toBe('Initial name');

    host.projectModel.set({ name: 'Renamed project' });
    fixture.detectChanges();
    expect(input.value).toBe('Renamed project');

    input.value = 'Signal-ready input';
    input.dispatchEvent(new Event('input', { bubbles: true }));
    fixture.detectChanges();

    expect(host.projectModel().name).toBe('Signal-ready input');
  });

  it('binds signal form pattern metadata to tng-input', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [InputPatternSignalFormsHostComponent],
    }).createComponent(InputPatternSignalFormsHostComponent);

    fixture.detectChanges();

    const input = queryRequiredElement(fixture, '[data-testid="input"] input', HTMLInputElement);

    expect(input.getAttribute('pattern')).toBe('^[A-Z]+$');
  });

  it('binds tng-textarea through its signal forms value model', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [TextareaSignalFormsHostComponent],
    }).createComponent(TextareaSignalFormsHostComponent);

    fixture.detectChanges();

    const host = fixture.componentInstance;
    const textarea = queryRequiredElement(
      fixture,
      '[data-testid="textarea"] textarea',
      HTMLTextAreaElement,
    );

    expect(textarea.value).toBe('Initial notes');

    host.projectModel.set({ description: 'Updated notes' });
    fixture.detectChanges();
    expect(textarea.value).toBe('Updated notes');

    textarea.value = 'User typed notes';
    textarea.dispatchEvent(new Event('input', { bubbles: true }));
    fixture.detectChanges();

    expect(host.projectModel().description).toBe('User typed notes');
  });

  it('binds tng-slider through its signal forms value model', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [SliderSignalFormsHostComponent],
    }).createComponent(SliderSignalFormsHostComponent);

    fixture.detectChanges();

    const host = fixture.componentInstance;
    const slider = queryRequiredElement(
      fixture,
      '[data-testid="slider"] input[type="range"]',
      HTMLInputElement,
    );

    expect(slider.value).toBe('25');

    host.settingsModel.set({ volume: 75 });
    fixture.detectChanges();
    expect(slider.value).toBe('75');

    slider.value = '42';
    slider.dispatchEvent(new Event('input', { bubbles: true }));
    fixture.detectChanges();

    expect(host.settingsModel().volume).toBe(42);
  });

  it('binds tng-range-slider through its signal forms value model', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [RangeSliderSignalFormsHostComponent],
    }).createComponent(RangeSliderSignalFormsHostComponent);

    fixture.detectChanges();

    const host = fixture.componentInstance;
    const minSlider = queryRequiredElement(
      fixture,
      '[data-testid="range-slider"] [data-slot="range-slider-min-thumb"]',
      HTMLInputElement,
    );
    const maxSlider = queryRequiredElement(
      fixture,
      '[data-testid="range-slider"] [data-slot="range-slider-max-thumb"]',
      HTMLInputElement,
    );

    expect(minSlider.value).toBe('20');
    expect(maxSlider.value).toBe('80');

    host.filtersModel.set({ price: { min: 30, max: 70 } });
    fixture.detectChanges();
    expect(minSlider.value).toBe('30');
    expect(maxSlider.value).toBe('70');

    minSlider.value = '40';
    minSlider.dispatchEvent(new Event('input', { bubbles: true }));
    fixture.detectChanges();

    expect(host.filtersModel().price).toEqual({ min: 40, max: 70 });
  });

  it('binds tng-checkbox through its signal forms checked model', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [CheckboxSignalFormsHostComponent],
    }).createComponent(CheckboxSignalFormsHostComponent);

    fixture.detectChanges();

    const host = fixture.componentInstance;
    const input = queryRequiredElement(
      fixture,
      '[data-testid="checkbox"] input[type="checkbox"]',
      HTMLInputElement,
    );

    expect(input.checked).toBe(true);

    host.releaseModel.set({ ready: false });
    fixture.detectChanges();
    expect(input.checked).toBe(false);

    input.checked = true;
    input.dispatchEvent(new Event('change', { bubbles: true }));
    fixture.detectChanges();

    expect(host.releaseModel().ready).toBe(true);
  });

  it('binds tng-radio through its signal forms checked model', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [RadioSignalFormsHostComponent],
    }).createComponent(RadioSignalFormsHostComponent);

    fixture.detectChanges();

    const host = fixture.componentInstance;
    const input = queryRequiredElement(fixture, '[data-testid="radio"] input', HTMLInputElement);

    expect(input.checked).toBe(false);

    host.settingsModel.set({ selected: true });
    fixture.detectChanges();
    expect(input.checked).toBe(true);

    input.checked = false;
    input.dispatchEvent(new Event('change', { bubbles: true }));
    fixture.detectChanges();

    expect(host.settingsModel().selected).toBe(false);
  });

  it('binds tng-switch through its signal forms checked model', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [SwitchSignalFormsHostComponent],
    }).createComponent(SwitchSignalFormsHostComponent);

    fixture.detectChanges();

    const host = fixture.componentInstance;
    const input = queryRequiredElement(
      fixture,
      '[data-testid="switch"] input[type="checkbox"]',
      HTMLInputElement,
    );
    const button = queryRequiredElement(
      fixture,
      '[data-testid="switch"] button',
      HTMLButtonElement,
    );

    expect(input.checked).toBe(true);

    host.settingsModel.set({ enabled: false });
    fixture.detectChanges();
    expect(input.checked).toBe(false);

    button.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));
    fixture.detectChanges();

    expect(host.settingsModel().enabled).toBe(true);
  });

  it('binds tng-toggle through its signal forms checked model', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [ToggleSignalFormsHostComponent],
    }).createComponent(ToggleSignalFormsHostComponent);

    fixture.detectChanges();

    const host = fixture.componentInstance;
    const button = queryRequiredElement(
      fixture,
      '[data-testid="toggle"] button',
      HTMLButtonElement,
    );

    expect(button.getAttribute('aria-pressed')).toBe('false');

    host.preferencesModel.set({ pinned: true });
    fixture.detectChanges();
    expect(button.getAttribute('aria-pressed')).toBe('true');

    button.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));
    fixture.detectChanges();

    expect(host.preferencesModel().pinned).toBe(false);
  });

  it('binds tng-input-otp through its signal forms value model', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [InputOtpSignalFormsHostComponent],
    }).createComponent(InputOtpSignalFormsHostComponent);

    fixture.detectChanges();

    const host = fixture.componentInstance;
    const firstSlot = queryRequiredElement(
      fixture,
      '[data-testid="otp"] [data-tng-otp-slot="0"]',
      HTMLInputElement,
    );

    expect(firstSlot.value).toBe('1');

    host.verificationModel.set({ code: '98' });
    fixture.detectChanges();
    expect(firstSlot.value).toBe('9');

    firstSlot.value = '4';
    firstSlot.dispatchEvent(new Event('input', { bubbles: true }));
    fixture.detectChanges();

    expect(host.verificationModel().code).toBe('48');
  });

  it('binds signal form pattern metadata to tng-input-otp', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [InputOtpPatternSignalFormsHostComponent],
    }).createComponent(InputOtpPatternSignalFormsHostComponent);

    fixture.detectChanges();

    const host = fixture.componentInstance;
    const firstSlot = queryRequiredElement(
      fixture,
      '[data-testid="otp"] [data-tng-otp-slot="0"]',
      HTMLInputElement,
    );

    firstSlot.value = 'C';
    firstSlot.dispatchEvent(new Event('input', { bubbles: true }));
    fixture.detectChanges();

    expect(host.verificationModel().code).toBe('CB');
  });

  it('binds tng-number-range through its signal forms value model', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [NumberRangeSignalFormsHostComponent],
    }).createComponent(NumberRangeSignalFormsHostComponent);

    fixture.detectChanges();

    const host = fixture.componentInstance;
    const minInput = queryRequiredElement(
      fixture,
      '[data-testid="range"] .tng-number-range__input--min',
      HTMLInputElement,
    );
    const maxInput = queryRequiredElement(
      fixture,
      '[data-testid="range"] .tng-number-range__input--max',
      HTMLInputElement,
    );

    expect(minInput.value).toBe('10');
    expect(maxInput.value).toBe('50');

    host.pricingModel.set({ range: { min: 20, max: 80 } });
    fixture.detectChanges();
    expect(minInput.value).toBe('20');
    expect(maxInput.value).toBe('80');

    minInput.value = '25';
    minInput.dispatchEvent(new Event('input', { bubbles: true }));
    fixture.detectChanges();

    expect(host.pricingModel().range).toEqual({ min: 25, max: 80 });
  });

  it('reflects signal form model values into tng-datepicker', async () => {
    const fixture = TestBed.configureTestingModule({
      imports: [DatepickerSignalFormsHostComponent],
    }).createComponent(DatepickerSignalFormsHostComponent);

    await settle(fixture);

    const host = fixture.componentInstance;
    const input = queryRequiredElement(
      fixture,
      '[data-testid="datepicker"] input[data-slot="datepicker-input"]',
      HTMLInputElement,
    );

    expect(input.value).toBe('03-31-2026');

    host.bookingModel.set({ date: new Date(2025, 3, 1) });
    await settle(fixture);

    expect(input.value).toBe('04-01-2025');
  });

  it('updates the signal form model when tng-datepicker commits typed input on blur', async () => {
    const fixture = TestBed.configureTestingModule({
      imports: [DatepickerSignalFormsHostComponent],
    }).createComponent(DatepickerSignalFormsHostComponent);

    await settle(fixture);

    const host = fixture.componentInstance;
    const input = queryRequiredElement(
      fixture,
      '[data-testid="datepicker"] input[data-slot="datepicker-input"]',
      HTMLInputElement,
    );

    input.value = '04-24-2026';
    input.dispatchEvent(new Event('input', { bubbles: true }));
    await settle(fixture);

    input.dispatchEvent(new FocusEvent('blur'));
    await settle(fixture);

    expectDateParts(host.bookingModel().date, 2026, 3, 24);
  });

  it('updates the signal form model when tng-datepicker selects a calendar date', async () => {
    const fixture = TestBed.configureTestingModule({
      imports: [DatepickerSignalFormsHostComponent],
    }).createComponent(DatepickerSignalFormsHostComponent);

    await settle(fixture);

    const host = fixture.componentInstance;
    await selectDatepickerDay(fixture, '24');

    expectDateParts(host.bookingModel().date, 2026, 2, 24);
  });

  it('reflects signal form model values into tng-date-range-picker', async () => {
    const fixture = TestBed.configureTestingModule({
      imports: [DateRangePickerSignalFormsHostComponent],
    }).createComponent(DateRangePickerSignalFormsHostComponent);

    await settle(fixture);

    const host = fixture.componentInstance;
    const input = queryRequiredElement(
      fixture,
      '[data-testid="date-range"] input[data-slot="date-range-picker-input"]',
      HTMLInputElement,
    );

    expect(input.value).toBe('04-22-2024 – 04-24-2024');

    host.bookingModel.set({
      range: {
        start: new Date(2024, 4, 1),
        end: new Date(2024, 4, 8),
      },
    });
    await settle(fixture);

    expect(input.value).toBe('05-01-2024 – 05-08-2024');
  });

  it('updates the signal form model when tng-date-range-picker commits a full typed range on blur', async () => {
    const fixture = TestBed.configureTestingModule({
      imports: [DateRangePickerSignalFormsHostComponent],
    }).createComponent(DateRangePickerSignalFormsHostComponent);

    await settle(fixture);

    const host = fixture.componentInstance;
    const input = queryRequiredElement(
      fixture,
      '[data-testid="date-range"] input[data-slot="date-range-picker-input"]',
      HTMLInputElement,
    );

    input.value = '05-01-2024 – 05-08-2024';
    input.dispatchEvent(new Event('input', { bubbles: true }));
    await settle(fixture);

    input.dispatchEvent(new FocusEvent('blur'));
    await settle(fixture);

    expectRangeDateParts(host.bookingModel().range, 2024, 4, 1, 2024, 4, 8);
  });

  it('updates the signal form model when tng-date-range-picker commits a full typed range on Enter', async () => {
    const fixture = TestBed.configureTestingModule({
      imports: [DateRangePickerSignalFormsHostComponent],
    }).createComponent(DateRangePickerSignalFormsHostComponent);

    await settle(fixture);

    const host = fixture.componentInstance;
    const input = queryRequiredElement(
      fixture,
      '[data-testid="date-range"] input[data-slot="date-range-picker-input"]',
      HTMLInputElement,
    );

    input.value = '05-10-2024 – 05-17-2024';
    input.dispatchEvent(new Event('input', { bubbles: true }));
    await settle(fixture);

    await openDateRangePicker(fixture);
    input.focus();
    keydown(input, 'Enter');
    await settle(fixture);

    expectRangeDateParts(host.bookingModel().range, 2024, 4, 10, 2024, 4, 17);
  });

  it('updates the signal form model when tng-date-range-picker commits a single typed date on blur', async () => {
    const fixture = TestBed.configureTestingModule({
      imports: [DateRangePickerEmptySignalFormsHostComponent],
    }).createComponent(DateRangePickerEmptySignalFormsHostComponent);

    await settle(fixture);

    const host = fixture.componentInstance;
    const input = queryRequiredElement(
      fixture,
      '[data-testid="date-range"] input[data-slot="date-range-picker-input"]',
      HTMLInputElement,
    );

    input.value = '05-10-2024';
    input.dispatchEvent(new Event('input', { bubbles: true }));
    await settle(fixture);

    input.dispatchEvent(new FocusEvent('blur'));
    await settle(fixture);

    expectPartialRangeStart(host.bookingModel().range, 2024, 4, 10);
  });

  it('updates the signal form model when tng-date-range-picker selects a calendar range', async () => {
    const fixture = TestBed.configureTestingModule({
      imports: [DateRangePickerEmptySignalFormsHostComponent],
    }).createComponent(DateRangePickerEmptySignalFormsHostComponent);

    await settle(fixture);

    const host = fixture.componentInstance;
    await selectDateRangePickerDays(fixture, '20', '24');

    expectRangeDateParts(host.bookingModel().range, 2024, 3, 20, 2024, 3, 24);
  });

  it('does not update the signal form model when invalid range text blurs', async () => {
    const fixture = TestBed.configureTestingModule({
      imports: [DateRangePickerSignalFormsHostComponent],
    }).createComponent(DateRangePickerSignalFormsHostComponent);

    await settle(fixture);

    const host = fixture.componentInstance;
    const input = queryRequiredElement(
      fixture,
      '[data-testid="date-range"] input[data-slot="date-range-picker-input"]',
      HTMLInputElement,
    );

    input.value = 'not-a-date';
    input.dispatchEvent(new Event('input', { bubbles: true }));
    await settle(fixture);

    input.dispatchEvent(new FocusEvent('blur'));
    await settle(fixture);

    expectRangeDateParts(host.bookingModel().range, 2024, 3, 22, 2024, 3, 24);
    expect(
      fixture.nativeElement
        .querySelector('[data-slot="date-range-picker-input-shell"]')
        ?.getAttribute('data-invalid'),
    ).toBe('true');
    expect(input.getAttribute('aria-invalid')).toBe('true');
  });

  it('reflects signal form model values into tng-month-daypicker', async () => {
    const fixture = TestBed.configureTestingModule({
      imports: [MonthDaypickerSignalFormsHostComponent],
    }).createComponent(MonthDaypickerSignalFormsHostComponent);

    await settle(fixture);

    const host = fixture.componentInstance;
    const input = queryRequiredElement(
      fixture,
      '[data-testid="month-day"] input[data-slot="datepicker-input"]',
      HTMLInputElement,
    );

    expect(input.value).toBe('04-22');

    host.reminderModel.set({ date: { month: 5, day: 8 } });
    await settle(fixture);

    expect(input.value).toBe('05-08');
  });

  it('reflects signal form model values into tng-yearpicker', async () => {
    const fixture = TestBed.configureTestingModule({
      imports: [YearpickerSignalFormsHostComponent],
    }).createComponent(YearpickerSignalFormsHostComponent);

    await settle(fixture);

    const host = fixture.componentInstance;
    const input = queryRequiredElement(
      fixture,
      '[data-testid="year"] input[data-slot="datepicker-input"]',
      HTMLInputElement,
    );

    expect(input.value).toBe('2024');

    host.archiveModel.set({ year: 2030 });
    await settle(fixture);

    expect(input.value).toBe('2030');
  });

  it('binds tng-select through its host directive model signal', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [SelectSignalFormsHostComponent],
    }).createComponent(SelectSignalFormsHostComponent);

    fixture.detectChanges();

    const host = fixture.componentInstance;
    const selectPrimitive = fixture.debugElement
      .query(By.css('[data-testid="select"]'))
      .injector.get<TngSelect<string>>(TngSelect);

    expect(selectPrimitive.value()).toBe('alpha');

    host.assigneeModel.set({ owner: 'bravo' });
    fixture.detectChanges();
    expect(selectPrimitive.value()).toBe('bravo');

    selectPrimitive.selectValue('charlie');
    fixture.detectChanges();

    expect(host.assigneeModel().owner).toBe('charlie');
  });

  it('binds tng-autocomplete through its host directive model signal', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [AutocompleteSignalFormsHostComponent],
    }).createComponent(AutocompleteSignalFormsHostComponent);

    fixture.detectChanges();

    const host = fixture.componentInstance;
    const autocompletePrimitive = fixture.debugElement
      .query(By.css('[data-testid="autocomplete"]'))
      .injector.get<TngAutocomplete<string>>(TngAutocomplete);

    expect(autocompletePrimitive.value()).toBe('alpha');

    host.assigneeModel.set({ owner: 'bravo' });
    fixture.detectChanges();
    expect(host.assigneeModel().owner).toBe('bravo');
    expect(autocompletePrimitive.value()).toBe('bravo');
  });

  it('binds tng-multiselect through its host directive model signal', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [MultiselectSignalFormsHostComponent],
    }).createComponent(MultiselectSignalFormsHostComponent);

    fixture.detectChanges();

    const host = fixture.componentInstance;
    const multiselectPrimitive = fixture.debugElement
      .query(By.css('[data-testid="multiselect"]'))
      .injector.get<TngMultiSelect<string>>(TngMultiSelect);

    expect(multiselectPrimitive.value()).toEqual(['alpha']);

    host.reviewModel.set({ reviewers: ['alpha', 'bravo'] });
    fixture.detectChanges();
    expect(multiselectPrimitive.value()).toEqual(['alpha', 'bravo']);

    multiselectPrimitive.value.set(['charlie']);
    fixture.detectChanges();

    expect(host.reviewModel().reviewers).toEqual(['charlie']);
  });

  it('binds tng-multi-autocomplete through its host directive model signal', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [MultiAutocompleteSignalFormsHostComponent],
    }).createComponent(MultiAutocompleteSignalFormsHostComponent);

    fixture.detectChanges();

    const host = fixture.componentInstance;
    const multiAutocompletePrimitive = fixture.debugElement
      .query(By.css('[data-testid="multi-autocomplete"]'))
      .injector.get<TngMultiAutocomplete<string>>(TngMultiAutocomplete);

    expect(multiAutocompletePrimitive.value()).toEqual(['alpha']);

    host.reviewModel.set({ reviewers: ['alpha', 'bravo'] });
    fixture.detectChanges();
    expect(multiAutocompletePrimitive.value()).toEqual(['alpha', 'bravo']);

    multiAutocompletePrimitive.value.set(['charlie']);
    fixture.detectChanges();

    expect(host.reviewModel().reviewers).toEqual(['charlie']);
  });
});
