import { afterEach, describe, expect, it } from 'vitest';
import { cleanupDom, createController, dateKey } from './tng-date-range-picker.test-helpers';

afterEach(() => {
  cleanupDom();
});

describe('tng-date-range-picker accessibility attributes', () => {
  it('exposes dialog trigger and grid attributes', () => {
    const controller = createController({
      ariaLabel: 'Travel dates',
      id: 'booking-range',
    });

    let trigger = controller.getOutputs().getTriggerAttributes();
    expect(trigger['aria-haspopup']).toBe('dialog');
    expect(trigger['aria-expanded']).toBe('false');
    expect(trigger['aria-controls']).toBe('booking-range-overlay');

    controller.open();
    trigger = controller.getOutputs().getTriggerAttributes();
    expect(trigger['aria-expanded']).toBe('true');

    const overlay = controller.getOutputs().getOverlayAttributes();
    expect(overlay.role).toBe('dialog');
    expect(overlay['aria-label']).toBe('Travel dates');

    const grid = controller.getOutputs().getGridAttributes();
    expect(grid.role).toBe('grid');
    expect(grid.id).toBe('booking-range-grid');
  });

  it('marks only range endpoints as selected for assistive tech', () => {
    const controller = createController({
      value: {
        end: '2024-04-24',
        start: '2024-04-20',
      },
    });

    const outputs = controller.getOutputs();
    const start = outputs.cells.find((cell) => dateKey(cell.date) === '2024-04-20');
    const middle = outputs.cells.find((cell) => dateKey(cell.date) === '2024-04-22');
    const end = outputs.cells.find((cell) => dateKey(cell.date) === '2024-04-24');

    expect(outputs.getCellAttributes(start as NonNullable<typeof start>)['aria-selected']).toBe(
      'true',
    );
    expect(outputs.getCellAttributes(middle as NonNullable<typeof middle>)['aria-selected']).toBe(
      'false',
    );
    expect(outputs.getCellAttributes(end as NonNullable<typeof end>)['aria-selected']).toBe('true');
  });

  it('sets aria-disabled on disabled dates and descriptive labels for range states', () => {
    const controller = createController({
      disableDate: (date) => dateKey(date) === '2024-04-26',
      value: {
        end: '2024-04-24',
        start: '2024-04-20',
      },
    });
    const outputs = controller.getOutputs();
    const start = outputs.cells.find((cell) => dateKey(cell.date) === '2024-04-20');
    const middle = outputs.cells.find((cell) => dateKey(cell.date) === '2024-04-22');
    const end = outputs.cells.find((cell) => dateKey(cell.date) === '2024-04-24');
    const disabled = outputs.cells.find((cell) => dateKey(cell.date) === '2024-04-26');

    expect(
      outputs.getCellAttributes(disabled as NonNullable<typeof disabled>)['aria-disabled'],
    ).toBe('true');
    expect(outputs.getCellAttributes(start as NonNullable<typeof start>)['aria-label']).toContain(
      'selected start date',
    );
    expect(outputs.getCellAttributes(middle as NonNullable<typeof middle>)['aria-label']).toContain(
      'in selected range',
    );
    expect(outputs.getCellAttributes(end as NonNullable<typeof end>)['aria-label']).toContain(
      'selected end date',
    );
  });

  it('updates ARIA labels and attributes when range, preview, and disabled state changes', () => {
    const controller = createController({
      value: {
        end: null,
        start: '2024-04-20',
      },
    });

    controller.handleCellPointerEnter('2024-04-24');
    let outputs = controller.getOutputs();
    let preview = outputs.cells.find((cell) => dateKey(cell.date) === '2024-04-22');
    expect(
      outputs.getCellAttributes(preview as NonNullable<typeof preview>)['aria-label'],
    ).toContain('in preview range');

    controller.selectDate('2024-04-24');
    outputs = controller.getOutputs();
    preview = outputs.cells.find((cell) => dateKey(cell.date) === '2024-04-22');
    expect(
      outputs.getCellAttributes(preview as NonNullable<typeof preview>)['aria-label'],
    ).toContain('in selected range');

    controller.setDisabled(true);
    expect(controller.getOutputs().getHostAttributes()['data-disabled']).toBe('true');
    expect(controller.getOutputs().getTriggerAttributes()['aria-disabled']).toBe('true');
  });

  it('generates stable non-duplicated ids for trigger, overlay, grid, and cells', () => {
    const controller = createController({
      id: 'stable-range',
    });
    const outputs = controller.getOutputs();
    const ids = [
      outputs.getOverlayAttributes().id,
      outputs.getGridAttributes().id,
      ...outputs.cells.map((cell) => cell.id),
    ].filter((id): id is string => typeof id === 'string');

    expect(outputs.getOverlayAttributes().id).toBe('stable-range-overlay');
    expect(outputs.getGridAttributes().id).toBe('stable-range-grid');
    expect(outputs.getTriggerAttributes()['aria-controls']).toBe('stable-range-overlay');
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('labels both dual-calendar grids and scopes active descendant to the active panel', () => {
    const controller = createController({
      calendarLayout: 'dual',
      focusStrategy: 'active-descendant',
      id: 'travel-range',
    });

    controller.setActiveDate('2024-04-30');
    controller.handleGridKeyDown({
      altKey: false,
      ctrlKey: false,
      key: 'ArrowRight',
      metaKey: false,
      preventDefault: () => undefined,
      shiftKey: false,
    });

    const outputs = controller.getOutputs();
    const leadingGrid = outputs.calendars[0]?.getGridAttributes();
    const trailingGrid = outputs.calendars[1]?.getGridAttributes();

    expect(leadingGrid?.id).toBe('travel-range-grid');
    expect(trailingGrid?.id).toBe('travel-range-grid-1');
    expect(leadingGrid?.['aria-labelledby']).toBe('travel-range-month-label');
    expect(trailingGrid?.['aria-labelledby']).toBe('travel-range-month-label-1');
    expect(leadingGrid?.['aria-label']).toBe('Start date, April 2024');
    expect(trailingGrid?.['aria-label']).toBe('End date, May 2024');
    expect(leadingGrid?.['data-range-boundary']).toBe('start');
    expect(trailingGrid?.['data-range-boundary']).toBe('end');
    expect(leadingGrid?.['aria-activedescendant']).toBeUndefined();
    expect(trailingGrid?.['aria-activedescendant']).toContain(
      'travel-range-calendar-1-cell-2024-05-01',
    );
    expect(outputs.getOverlayAttributes()['data-calendar-layout']).toBe('dual');
  });

  it('removes the trigger from tab order while the overlay is open', () => {
    const controller = createController();

    expect(controller.getOutputs().getTriggerAttributes().tabindex).toBeUndefined();

    controller.open();
    expect(controller.getOutputs().getTriggerAttributes().tabindex).toBe('-1');

    controller.close();
    expect(controller.getOutputs().getTriggerAttributes().tabindex).toBeUndefined();
  });
});
