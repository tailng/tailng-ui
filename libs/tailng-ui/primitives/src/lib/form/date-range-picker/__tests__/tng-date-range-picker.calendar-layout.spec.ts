import { afterEach, describe, expect, it } from 'vitest';
import {
  cleanupDom,
  collectEvents,
  createController,
  dateKey,
  keyboardEvent,
} from './tng-date-range-picker.test-helpers';

afterEach(() => {
  cleanupDom();
});

describe('tng-date-range-picker calendar layout', () => {
  it('keeps the headless controller single-calendar by default', () => {
    const outputs = createController().getOutputs();

    expect(outputs.calendarLayout).toBe('single');
    expect(outputs.calendars).toHaveLength(1);
    expect(outputs.cells).toBe(outputs.calendars[0]?.cells);
    expect(dateKey(outputs.visibleMonth)).toBe(dateKey(outputs.calendars[0]?.visibleMonth));
    expect(outputs.getGridAttributes()).toEqual(outputs.calendars[0]?.getGridAttributes());
  });

  it('exposes consecutive dual calendars with independent grid and cell ids', () => {
    const outputs = createController({
      calendarLayout: 'dual',
      id: 'booking-range',
    }).getOutputs();

    expect(outputs.calendarLayout).toBe('dual');
    expect(outputs.calendars.map((calendar) => dateKey(calendar.visibleMonth))).toEqual([
      '2024-04-01',
      '2024-05-01',
    ]);
    expect(outputs.calendars.map((calendar) => calendar.labelMonthYear)).toEqual([
      'April 2024',
      'May 2024',
    ]);
    expect(outputs.calendars.map((calendar) => calendar.rangeBoundary)).toEqual(['start', 'end']);
    expect(outputs.calendars.map((calendar) => calendar.getGridAttributes().id)).toEqual([
      'booking-range-grid',
      'booking-range-grid-1',
    ]);

    const ids = outputs.calendars.flatMap((calendar) => calendar.cells.map((cell) => cell.id));
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('derives the trailing month through year boundaries', () => {
    const controller = createController({ calendarLayout: 'dual' });

    controller.setVisibleMonth('2024-12-01');

    expect(
      controller.getOutputs().calendars.map((calendar) => dateKey(calendar.visibleMonth)),
    ).toEqual(['2024-12-01', '2025-01-01']);
  });

  it('hides outside-day duplicates that belong to the other visible calendar', () => {
    const outputs = createController({ calendarLayout: 'dual' }).getOutputs();
    const april = outputs.calendars[0];
    const may = outputs.calendars[1];
    const mayFirstInApril = april?.cells.find((cell) => dateKey(cell.date) === '2024-05-01');
    const mayFirstInMay = may?.cells.find((cell) => dateKey(cell.date) === '2024-05-01');

    expect(mayFirstInApril?.inMonth).toBe(false);
    expect(mayFirstInApril?.hidden).toBe(true);
    expect(mayFirstInApril?.active).toBe(false);
    expect(mayFirstInMay?.inMonth).toBe(true);
    expect(mayFirstInMay?.hidden).toBe(false);
  });

  it('assigns the leading calendar to start and the trailing calendar to end', () => {
    const controller = createController({
      calendarLayout: 'dual',
      value: { start: '2024-04-22', end: '2024-05-03' },
    });

    controller.selectCalendarDate('2024-04-25', 0, { trigger: 'pointer' });
    let outputs = controller.getOutputs();
    expect(dateKey(outputs.startDate!)).toBe('2024-04-25');
    expect(dateKey(outputs.endDate!)).toBe('2024-05-03');

    controller.selectCalendarDate('2024-05-06', 1, { trigger: 'pointer' });
    outputs = controller.getOutputs();
    expect(dateKey(outputs.startDate!)).toBe('2024-04-25');
    expect(dateKey(outputs.endDate!)).toBe('2024-05-06');
  });

  it('opens a complete range with its end month in the trailing calendar', () => {
    const outputs = createController({
      calendarLayout: 'dual',
      value: { start: '2024-05-20', end: '2024-05-25' },
    }).getOutputs();

    expect(outputs.calendars.map((calendar) => dateKey(calendar.visibleMonth))).toEqual([
      '2024-04-01',
      '2024-05-01',
    ]);
  });

  it('clears an existing end when the next start would exceed it', () => {
    const controller = createController({
      calendarLayout: 'dual',
      value: { start: '2024-05-20', end: '2024-05-25' },
    });

    controller.selectCalendarDate('2024-05-28', 0);

    const outputs = controller.getOutputs();
    expect(dateKey(outputs.startDate!)).toBe('2024-05-28');
    expect(outputs.endDate).toBeNull();
    expect(outputs.validationError).toBeNull();
  });

  it('rejects a missing start or an end before start without changing the value', () => {
    const controller = createController({ calendarLayout: 'dual', value: null });

    controller.selectCalendarDate('2024-05-15', 1);
    expect(controller.getOutputs().value).toBeNull();
    expect(controller.getOutputs().validationError).toBe('start-required');

    controller.selectCalendarDate('2024-05-20', 0);
    controller.selectCalendarDate('2024-05-15', 1);
    let outputs = controller.getOutputs();
    expect(dateKey(outputs.startDate!)).toBe('2024-05-20');
    expect(outputs.endDate).toBeNull();
    expect(outputs.validationError).toBe('end-before-start');

    controller.selectCalendarDate('2024-05-23', 1);
    outputs = controller.getOutputs();
    expect(dateKey(outputs.endDate!)).toBe('2024-05-23');
    expect(outputs.validationError).toBeNull();
  });

  it('keeps Material-style sequential range selection in single layout', () => {
    const controller = createController({ calendarLayout: 'single' });

    controller.selectCalendarDate('2024-04-24', 0);
    controller.selectCalendarDate('2024-04-20', 0);

    const outputs = controller.getOutputs();
    expect(dateKey(outputs.startDate!)).toBe('2024-04-20');
    expect(dateKey(outputs.endDate!)).toBe('2024-04-24');
    expect(outputs.validationError).toBeNull();
  });

  it('uses the active dual panel as the boundary during keyboard selection', () => {
    const controller = createController({ calendarLayout: 'dual', value: null });

    controller.setActiveDate('2024-04-28');
    controller.handleGridKeyDown(keyboardEvent('Enter'));
    controller.setActiveDate('2024-05-03');
    controller.handleGridKeyDown(keyboardEvent('Enter'));

    const outputs = controller.getOutputs();
    expect(dateKey(outputs.startDate!)).toBe('2024-04-28');
    expect(dateKey(outputs.endDate!)).toBe('2024-05-03');
  });

  it('rejects reversed manual ranges in dual layout', () => {
    const controller = createController({ calendarLayout: 'dual', value: null });

    controller.setInputText('05-20-2024 – 05-15-2024');

    expect(controller.commitInputText()).toBe(false);
    expect(controller.getOutputs().value).toBeNull();
    expect(controller.getOutputs().validationError).toBe('end-before-start');
  });

  it('keeps the leading month stable while focus moves inside the trailing calendar', () => {
    const controller = createController({ calendarLayout: 'dual' });

    controller.setActiveDate('2024-04-30');
    controller.handleGridKeyDown(keyboardEvent('ArrowRight'));

    expect(dateKey(controller.getOutputs().activeDate)).toBe('2024-05-01');
    expect(dateKey(controller.getOutputs().visibleMonth)).toBe('2024-04-01');

    controller.setActiveDate('2024-05-31');
    controller.handleGridKeyDown(keyboardEvent('ArrowRight'));

    expect(dateKey(controller.getOutputs().activeDate)).toBe('2024-06-01');
    expect(dateKey(controller.getOutputs().visibleMonth)).toBe('2024-05-01');
  });

  it('preserves one range and preview model across both calendars', () => {
    const controller = createController({ calendarLayout: 'dual' });

    controller.selectDate('2024-04-28');
    controller.handleCellPointerEnter('2024-05-03');

    let outputs = controller.getOutputs();
    const previewDates = outputs.calendars
      .flatMap((calendar) => calendar.cells)
      .filter((cell) => cell.previewRange && !cell.hidden)
      .map((cell) => dateKey(cell.date));
    expect(previewDates).toContain('2024-04-30');
    expect(previewDates).toContain('2024-05-01');

    controller.selectDate('2024-05-03');
    outputs = controller.getOutputs();
    expect(dateKey(outputs.startDate!)).toBe('2024-04-28');
    expect(dateKey(outputs.endDate!)).toBe('2024-05-03');
    expect(outputs.previewEndDate).toBeNull();
  });

  it('emits one leading-month change when the dual window navigates', () => {
    const controller = createController({ calendarLayout: 'dual' });
    const events = collectEvents(controller);

    controller.nextMonth();

    expect(
      controller.getOutputs().calendars.map((calendar) => dateKey(calendar.visibleMonth)),
    ).toEqual(['2024-05-01', '2024-06-01']);
    expect(events.filter((event) => event.type === 'monthChange')).toHaveLength(1);
  });

  it('allows constrained navigation while either month in the target window is selectable', () => {
    const controller = createController({
      calendarLayout: 'dual',
      max: '2024-05-31',
      min: '2024-04-01',
    });

    controller.nextMonth();
    expect(dateKey(controller.getOutputs().visibleMonth)).toBe('2024-05-01');

    controller.nextMonth();
    expect(dateKey(controller.getOutputs().visibleMonth)).toBe('2024-05-01');

    controller.prevMonth();
    controller.prevMonth();
    expect(dateKey(controller.getOutputs().visibleMonth)).toBe('2024-03-01');

    controller.prevMonth();
    expect(dateKey(controller.getOutputs().visibleMonth)).toBe('2024-03-01');
  });

  it('keeps exactly one active tab stop across dual calendars', () => {
    const controller = createController({ calendarLayout: 'dual' });

    controller.setActiveDate('2024-04-30');
    controller.handleGridKeyDown(keyboardEvent('ArrowRight'));

    const outputs = controller.getOutputs();
    const visibleCells = outputs.calendars.flatMap((calendar) =>
      calendar.cells.filter((cell) => !cell.hidden),
    );
    const activeCells = visibleCells.filter(
      (cell) => outputs.getCellAttributes(cell)['data-active'] === 'true',
    );
    const tabbableCells = visibleCells.filter(
      (cell) => outputs.getCellAttributes(cell).tabindex === '0',
    );

    expect(activeCells).toHaveLength(1);
    expect(dateKey(activeCells[0]?.date)).toBe('2024-05-01');
    expect(tabbableCells).toHaveLength(1);
    expect(outputs.calendars[0]?.getGridAttributes()['aria-labelledby']).not.toBe(
      outputs.calendars[1]?.getGridAttributes()['aria-labelledby'],
    );
  });

  it('moves the active month into view when dual layout changes to single', () => {
    const controller = createController({ calendarLayout: 'dual' });

    controller.setActiveDate('2024-04-30');
    controller.handleGridKeyDown(keyboardEvent('ArrowRight'));
    controller.setConfig({ calendarLayout: 'single' });

    const outputs = controller.getOutputs();
    expect(outputs.calendarLayout).toBe('single');
    expect(outputs.calendars).toHaveLength(1);
    expect(dateKey(outputs.visibleMonth)).toBe('2024-05-01');
    expect(dateKey(outputs.activeDate)).toBe('2024-05-01');
  });
});
