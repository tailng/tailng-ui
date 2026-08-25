import { afterEach, describe, expect, expectTypeOf, it } from 'vitest';
import type {
  TngDateRange,
  TngDateRangePickerConfig,
  TngDateRangePickerOutputs,
  TngDateRangeValue,
  TngDateSelectionInput,
  TngDateValue,
} from '../date-range-picker.types';
import type {
  TngDateRangePickerCalendarLayout,
  TngDateRangePickerCalendarPanel,
} from '../tng-date-range-picker';
import * as primitivesIndex from '../../../../index';
import * as rangePickerIndex from '../index';
import {
  cleanupDom,
  collectEvents,
  createController,
  dateKey,
} from './tng-date-range-picker.test-helpers';

function asRange(value: unknown): TngDateRangeValue<Date> {
  return value as TngDateRangeValue<Date>;
}

afterEach(() => {
  cleanupDom();
});

describe('tng-date-range-picker public API', () => {
  it('exposes strict range value typing with nullable start and end fields', () => {
    const empty: TngDateRangeValue = { end: null, start: null };
    const partialStart: TngDateRangeValue = { end: null, start: new Date(2024, 3, 20) };
    const partialEnd: TngDateRangeValue = { end: new Date(2024, 3, 24), start: null };
    const complete: TngDateRangeValue = {
      end: new Date(2024, 3, 24),
      start: new Date(2024, 3, 20),
    };

    expect(empty.start).toBeNull();
    expect(empty.end).toBeNull();
    expect(partialStart.end).toBeNull();
    expect(partialEnd.start).toBeNull();
    expect(complete.start).toBeInstanceOf(Date);
    expect(complete.end).toBeInstanceOf(Date);
    expectTypeOf<TngDateRangeValue<Date>>().toEqualTypeOf<TngDateRange<Date>>();
  });

  it('accepts null, partial range, and complete range value inputs', () => {
    const controller = createController({ value: null });
    expect(controller.getOutputs().value).toBeNull();

    controller.setValue({ end: null, start: '2024-04-20' });
    let range = asRange(controller.getOutputs().value);
    expect(dateKey(range.start as Date)).toBe('2024-04-20');
    expect(range.end).toBeNull();

    controller.setValue({ end: '2024-04-24', start: '2024-04-20' });
    range = asRange(controller.getOutputs().value);
    expect(dateKey(range.start as Date)).toBe('2024-04-20');
    expect(dateKey(range.end as Date)).toBe('2024-04-24');
  });

  it('preserves strict TypeScript typing for range selection input and outputs', () => {
    expectTypeOf<TngDateSelectionInput<Date>>().toMatchTypeOf<
      | Date
      | string
      | null
      | undefined
      | Readonly<{ end: Date | string | null | undefined; start: Date | string | null | undefined }>
    >();
    expectTypeOf<TngDateValue<Date>>().toEqualTypeOf<TngDateRange<Date> | null>();
    expectTypeOf<TngDateRangePickerOutputs<Date>['value']>().toEqualTypeOf<TngDateValue<Date>>();
    expectTypeOf<TngDateRangePickerConfig<Date>['calendarLayout']>().toEqualTypeOf<
      TngDateRangePickerCalendarLayout | undefined
    >();
    expectTypeOf<TngDateRangePickerOutputs<Date>['calendars']>().toEqualTypeOf<
      readonly TngDateRangePickerCalendarPanel<Date>[]
    >();
  });

  it('exports range-picker entry points and parts without datepicker imports', () => {
    expect(rangePickerIndex.createDateRangePickerController).toBeTypeOf('function');
    expect(rangePickerIndex.defaultDateRangePickerDateAdapter).toBeTypeOf('object');
    expect(rangePickerIndex.TngDateRangePickerHost).toBeTypeOf('function');
    expect(rangePickerIndex.TngDateRangePickerTrigger).toBeTypeOf('function');
    expect(rangePickerIndex.TngDateRangePickerOverlay).toBeTypeOf('function');
    expect(rangePickerIndex.TngDateRangePickerDayCell).toBeTypeOf('function');
  });

  it('exports the date range picker from the package primitive index', () => {
    expect(primitivesIndex.createDateRangePickerController).toBeTypeOf('function');
    expect(primitivesIndex.defaultDateRangePickerDateAdapter).toBeTypeOf('object');
    expect(primitivesIndex.TngDateRangePickerOverlay).toBeTypeOf('function');
    expect(primitivesIndex.TngDateRangePickerDayCell).toBeTypeOf('function');
  });

  it('emits valid partial and complete range values without duplicate valueChange events', () => {
    const controller = createController();
    expect(controller.selectCalendarDate).toBeTypeOf('function');
    const events = collectEvents(controller);

    controller.selectDate('2024-04-20');
    controller.selectDate('2024-04-24');

    const valueEvents = events.filter((event) => event.type === 'valueChange');
    expect(valueEvents).toHaveLength(2);
    expect(asRange(valueEvents[0]?.value).start).toBeInstanceOf(Date);
    expect(asRange(valueEvents[0]?.value).end).toBeNull();
    expect(dateKey(asRange(valueEvents[1]?.value).start as Date)).toBe('2024-04-20');
    expect(dateKey(asRange(valueEvents[1]?.value).end as Date)).toBe('2024-04-24');
  });
});
