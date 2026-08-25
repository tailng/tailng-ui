import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { afterEach, describe, expect, it } from 'vitest';
import {
  createDateRangePickerController,
  type TngDateRangePickerOutputs,
} from '../tng-date-range-picker';
import {
  bindTngDateRangePicker,
  TngDateRangePickerDayCell,
  TngDateRangePickerDayGrid,
  TngDateRangePickerHost,
  TngDateRangePickerInput,
  TngDateRangePickerTrigger,
} from '../tng-date-range-picker.parts';
import { TngDateRangePickerOverlay } from '../tng-date-range-picker.overlay';
import { cleanupDom, dateKey } from './tng-date-range-picker.test-helpers';

async function settle(fixture: {
  detectChanges(): void;
  whenStable(): Promise<unknown>;
}): Promise<void> {
  fixture.detectChanges();
  await fixture.whenStable();
  fixture.detectChanges();
}

function getRequired<T extends Element>(root: ParentNode, selector: string): T {
  const element = root.querySelector<T>(selector);
  if (element === null) {
    throw new Error(`Expected selector ${selector} to exist.`);
  }

  return element;
}

function getDayButton(root: ParentNode, day: string): HTMLButtonElement {
  const match = Array.from(
    root.querySelectorAll<HTMLButtonElement>('[data-slot="date-range-picker-cell"]'),
  ).find((cell) => !cell.disabled && cell.textContent?.trim() === day);
  if (match === undefined) {
    throw new Error(`Expected day ${day} to exist.`);
  }

  return match;
}

@Component({
  standalone: true,
  imports: [
    TngDateRangePickerHost,
    TngDateRangePickerTrigger,
    TngDateRangePickerDayGrid,
    TngDateRangePickerDayCell,
  ],
  template: `
    <div data-testid="host" [tngDateRangePickerHost]="controller">
      <button type="button" data-testid="trigger" [tngDateRangePickerTrigger]="controller">
        Open
      </button>

      <div data-testid="grid" [tngDateRangePickerDayGrid]="controller">
        @for (cell of outputs().cells; track cell.id) {
          <button type="button" [tngDateRangePickerDayCell]="cell">
            {{ cell.label }}
          </button>
        }
      </div>
    </div>
  `,
})
class DateRangePickerPartsHostComponent {
  public readonly controller = createDateRangePickerController<Date>({
    closeOnSelect: false,
    ownerDocument: document,
    showOutsideDays: true,
    today: '2024-04-18',
    value: {
      end: '2024-04-24',
      start: '2024-04-20',
    },
  });

  public outputs(): TngDateRangePickerOutputs<Date> {
    return this.controller.getOutputs();
  }
}

@Component({
  standalone: true,
  imports: [TngDateRangePickerHost, TngDateRangePickerDayGrid, TngDateRangePickerDayCell],
  template: `
    <div data-testid="dual-host" [tngDateRangePickerHost]="controller">
      @for (calendar of outputs().calendars; track calendar.index) {
        <div
          data-testid="dual-grid"
          [tngDateRangePickerDayGrid]="controller"
          [tngDateRangePickerCalendarIndex]="calendar.index"
        >
          @for (cell of calendar.cells; track cell.id) {
            <button type="button" [tngDateRangePickerDayCell]="cell">
              {{ cell.label }}
            </button>
          }
        </div>
      }
    </div>
  `,
})
class DualDateRangePickerPartsHostComponent {
  public readonly controller = createDateRangePickerController<Date>({
    calendarLayout: 'dual',
    ownerDocument: document,
    showOutsideDays: true,
    today: '2024-04-18',
    value: null,
  });

  public outputs(): TngDateRangePickerOutputs<Date> {
    return this.controller.getOutputs();
  }
}

@Component({
  standalone: true,
  template: `
    <div data-testid="grid">
      @for (cell of bound.outputs().cells; track cell.id) {
        <button
          type="button"
          [attr.data-preview-end]="bound.outputs().getCellAttributes(cell)['data-preview-end']"
          [attr.data-preview-range]="bound.outputs().getCellAttributes(cell)['data-preview-range']"
          [attr.data-slot]="bound.outputs().getCellAttributes(cell)['data-slot']"
          (click)="select(cell)"
          (pointerenter)="preview(cell)"
        >
          {{ cell.label }}
        </button>
      }
    </div>
  `,
})
class DateRangePickerBoundOutputsHostComponent {
  public readonly controller = createDateRangePickerController<Date>({
    closeOnSelect: false,
    ownerDocument: document,
    showOutsideDays: true,
    today: '2024-05-15',
    value: null,
  });
  protected readonly bound = bindTngDateRangePicker(this.controller);

  protected select(cell: Readonly<DayCell>): void {
    this.controller.handleCellClick(cell.date);
  }

  protected preview(cell: Readonly<DayCell>): void {
    this.controller.handleCellPointerEnter(cell.date);
  }
}

@Component({
  standalone: true,
  imports: [
    TngDateRangePickerHost,
    TngDateRangePickerInput,
    TngDateRangePickerTrigger,
    TngDateRangePickerOverlay,
    TngDateRangePickerDayGrid,
    TngDateRangePickerDayCell,
  ],
  template: `
    <div data-testid="host" [tngDateRangePickerHost]="controller">
      <div data-slot="date-range-picker-input-shell">
        <input data-testid="range-input" type="text" [tngDateRangePickerInput]="controller" />
        <button type="button" data-testid="trigger" [tngDateRangePickerTrigger]="controller">
          Open
        </button>
      </div>

      <section data-testid="overlay" [tngDateRangePickerOverlay]="controller">
        <div data-testid="grid" [tngDateRangePickerDayGrid]="controller">
          @for (cell of outputs().cells; track cell.id) {
            <button type="button" [tngDateRangePickerDayCell]="cell">
              {{ cell.label }}
            </button>
          }
        </div>
      </section>
    </div>
  `,
})
class DateRangePickerHeadlessFlowHostComponent {
  public readonly controller = createDateRangePickerController<Date>({
    closeOnSelect: true,
    disableDate: (date) => date.getDay() === 0,
    ownerDocument: document,
    showOutsideDays: true,
    today: '2024-05-15',
    value: null,
  });

  public outputs(): TngDateRangePickerOutputs<Date> {
    return this.controller.getOutputs();
  }
}

describe('tng-date-range-picker primitive parts', () => {
  afterEach(() => {
    cleanupDom();
    TestBed.resetTestingModule();
  });

  it('binds host, trigger, and grid attributes', async () => {
    const fixture = TestBed.configureTestingModule({
      imports: [DateRangePickerPartsHostComponent],
    }).createComponent(DateRangePickerPartsHostComponent);

    await settle(fixture);

    const host = getRequired<HTMLElement>(fixture.nativeElement, '[data-testid="host"]');
    const trigger = getRequired<HTMLButtonElement>(
      fixture.nativeElement,
      '[data-testid="trigger"]',
    );
    const grid = getRequired<HTMLElement>(fixture.nativeElement, '[data-testid="grid"]');

    expect(host.getAttribute('data-slot')).toBe('date-range-picker');
    expect(trigger.getAttribute('aria-haspopup')).toBe('dialog');
    expect(grid.getAttribute('role')).toBe('grid');
  });

  it('binds distinct grid attributes for each calendar in dual layout', async () => {
    const fixture = TestBed.configureTestingModule({
      imports: [DualDateRangePickerPartsHostComponent],
    }).createComponent(DualDateRangePickerPartsHostComponent);

    await settle(fixture);

    const root = fixture.nativeElement as HTMLElement;
    const host = getRequired<HTMLElement>(root, '[data-testid="dual-host"]');
    const grids = Array.from(root.querySelectorAll<HTMLElement>('[data-testid="dual-grid"]'));

    expect(host.getAttribute('data-calendar-layout')).toBe('dual');
    expect(grids).toHaveLength(2);
    expect(new Set(grids.map((grid) => grid.id)).size).toBe(2);
    expect(grids[1]?.id).toBe(`${grids[0]?.id}-1`);
    expect(grids.map((grid) => grid.getAttribute('data-calendar-index'))).toEqual(['0', '1']);
    expect(grids.map((grid) => grid.getAttribute('data-range-boundary'))).toEqual(['start', 'end']);
    expect(grids.map((grid) => grid.getAttribute('aria-label'))).toEqual([
      'Start date, April 2024',
      'End date, May 2024',
    ]);
    expect(
      grids.flatMap((grid) =>
        Array.from(
          grid.querySelectorAll(
            '[data-slot="date-range-picker-cell"][data-active="true"]:not([data-hidden])',
          ),
        ),
      ),
    ).toHaveLength(1);
  });

  it('routes leading and trailing day-cell clicks to start and end', async () => {
    const fixture = TestBed.configureTestingModule({
      imports: [DualDateRangePickerPartsHostComponent],
    }).createComponent(DualDateRangePickerPartsHostComponent);

    await settle(fixture);

    const grids = Array.from(
      (fixture.nativeElement as HTMLElement).querySelectorAll<HTMLElement>(
        '[data-testid="dual-grid"]',
      ),
    );
    getDayButton(grids[0]!, '28').click();
    await settle(fixture);
    getDayButton(grids[1]!, '3').click();
    await settle(fixture);

    const outputs = fixture.componentInstance.controller.getOutputs();
    expect(dateKey(outputs.startDate!)).toBe('2024-04-28');
    expect(dateKey(outputs.endDate!)).toBe('2024-05-03');
  });

  it('marks range start, middle, and end cells with dedicated data attributes', async () => {
    const fixture = TestBed.configureTestingModule({
      imports: [DateRangePickerPartsHostComponent],
    }).createComponent(DateRangePickerPartsHostComponent);

    await settle(fixture);

    const day20 = getDayButton(fixture.nativeElement, '20');
    const day22 = getDayButton(fixture.nativeElement, '22');
    const day24 = getDayButton(fixture.nativeElement, '24');

    expect(day20.getAttribute('data-range-start')).toBe('true');
    expect(day20.getAttribute('data-in-range')).toBeNull();
    expect(day22.getAttribute('data-in-range')).toBe('true');
    expect(day22.getAttribute('aria-selected')).toBe('false');
    expect(day24.getAttribute('data-range-end')).toBe('true');
  });

  it('selects and previews through day-cell part events', async () => {
    const fixture = TestBed.configureTestingModule({
      imports: [DateRangePickerPartsHostComponent],
    }).createComponent(DateRangePickerPartsHostComponent);

    await settle(fixture);
    const day28 = getDayButton(fixture.nativeElement, '28');
    day28.click();
    await settle(fixture);

    const day30 = getDayButton(fixture.nativeElement, '30');
    day30.dispatchEvent(new Event('pointerenter'));
    await settle(fixture);

    const day29 = getDayButton(fixture.nativeElement, '29');
    expect(day29.getAttribute('data-preview-range')).toBe('true');

    day30.click();
    await settle(fixture);

    expect(day29.getAttribute('data-preview-range')).toBeNull();
    expect(day29.getAttribute('data-in-range')).toBe('true');
  });

  it('closes the headless overlay and writes the selected range after choosing start and end dates', async () => {
    const fixture = TestBed.configureTestingModule({
      imports: [DateRangePickerHeadlessFlowHostComponent],
    }).createComponent(DateRangePickerHeadlessFlowHostComponent);

    await settle(fixture);

    const trigger = getRequired<HTMLButtonElement>(
      fixture.nativeElement,
      '[data-testid="trigger"]',
    );
    const input = getRequired<HTMLInputElement>(
      fixture.nativeElement,
      '[data-testid="range-input"]',
    );
    const overlay = getRequired<HTMLElement>(fixture.nativeElement, '[data-testid="overlay"]');

    expect(overlay.getAttribute('hidden')).toBe('');
    expect(input.value).toBe('');

    trigger.click();
    await settle(fixture);

    expect(
      getRequired<HTMLElement>(document.body, '[data-testid="overlay"]').getAttribute('hidden'),
    ).toBeNull();

    getDayButton(document.body, '4').click();
    await settle(fixture);

    expect(
      getRequired<HTMLElement>(document.body, '[data-testid="overlay"]').getAttribute('hidden'),
    ).toBeNull();
    expect(input.value).toBe('05-04-2024');

    getDayButton(document.body, '14').click();
    await settle(fixture);

    expect(overlay.getAttribute('hidden')).toBe('');
    expect(input.value).toBe('05-04-2024 – 05-14-2024');
  });

  it('moves the headless preview end marker with pointer hover after selecting a start date', async () => {
    const fixture = TestBed.configureTestingModule({
      imports: [DateRangePickerHeadlessFlowHostComponent],
    }).createComponent(DateRangePickerHeadlessFlowHostComponent);

    await settle(fixture);

    getRequired<HTMLButtonElement>(fixture.nativeElement, '[data-testid="trigger"]').click();
    await settle(fixture);

    getDayButton(document.body, '4').click();
    await settle(fixture);

    const day14 = getDayButton(document.body, '14');
    day14.dispatchEvent(new Event('pointerenter'));
    await settle(fixture);

    expect(day14.getAttribute('data-preview-end')).toBe('true');
    expect(getDayButton(document.body, '4').getAttribute('data-preview-range')).toBe('true');
    expect(getDayButton(document.body, '10').getAttribute('data-preview-range')).toBe('true');
    expect(day14.getAttribute('data-preview-range')).toBe('true');

    const day16 = getDayButton(document.body, '16');
    day16.dispatchEvent(new Event('pointerenter'));
    await settle(fixture);

    expect(day14.getAttribute('data-preview-end')).toBeNull();
    expect(day14.getAttribute('data-preview-range')).toBe('true');
    expect(day16.getAttribute('data-preview-end')).toBe('true');
    expect(getDayButton(document.body, '15').getAttribute('data-preview-range')).toBe('true');
    expect(day16.getAttribute('data-preview-range')).toBe('true');

    day16.click();
    await settle(fixture);

    expect(day16.getAttribute('data-preview-end')).toBeNull();
    expect(day16.getAttribute('data-range-end')).toBe('true');
  });

  it('notifies subscription-bound outputs when pointer hover changes the preview range', async () => {
    const fixture = TestBed.configureTestingModule({
      imports: [DateRangePickerBoundOutputsHostComponent],
    }).createComponent(DateRangePickerBoundOutputsHostComponent);

    await settle(fixture);

    getDayButton(fixture.nativeElement, '4').click();
    await settle(fixture);

    getDayButton(fixture.nativeElement, '14').dispatchEvent(new Event('pointerenter'));
    await settle(fixture);

    expect(getDayButton(fixture.nativeElement, '4').getAttribute('data-preview-range')).toBe(
      'true',
    );
    expect(getDayButton(fixture.nativeElement, '10').getAttribute('data-preview-range')).toBe(
      'true',
    );
    expect(getDayButton(fixture.nativeElement, '14').getAttribute('data-preview-range')).toBe(
      'true',
    );
    expect(getDayButton(fixture.nativeElement, '14').getAttribute('data-preview-end')).toBe('true');
  });
});
