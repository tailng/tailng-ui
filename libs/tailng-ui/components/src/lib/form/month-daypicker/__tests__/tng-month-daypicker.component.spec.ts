import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { afterEach, describe, expect, it } from 'vitest';
import {
  TngMonthDaypickerComponent,
  type TngMonthDayValue,
} from '../tng-month-daypicker.component';

function keydown(target: EventTarget, key: string): KeyboardEvent {
  const event = new KeyboardEvent('keydown', { bubbles: true, cancelable: true, key });
  target.dispatchEvent(event);
  return event;
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

function getRequired<T extends Element>(root: ParentNode, selector: string): T {
  const element = root.querySelector(selector);
  if (element === null) {
    throw new Error(`Expected selector ${selector} to exist.`);
  }

  return element as T;
}

@Component({
  imports: [TngMonthDaypickerComponent],
  template: `
    <tng-month-daypicker
      [defaultValue]="defaultValue()"
      [year]="year()"
      (valueChange)="valueChanges.push($event)"
    />
  `,
})
class MonthDaypickerHostComponent {
  public readonly defaultValue = signal<TngMonthDayValue>({ day: 22, month: 4 });
  public readonly year = signal(2024);
  public readonly valueChanges: TngMonthDayValue[] = [];
}

@Component({
  imports: [TngMonthDaypickerComponent],
  template: `
    <div data-testid="month-day-scroll-parent" style="overflow: auto; max-height: 120px;">
      <tng-month-daypicker [defaultValue]="{ day: 22, month: 4 }" [year]="2024" />
    </div>
  `,
})
class ScrollableMonthDaypickerHostComponent {}

describe('tng-month-daypicker component', () => {
  afterEach(() => {
    document.body.style.overflow = '';
    document.body.style.paddingRight = '';
    document.body.querySelectorAll('[data-slot="datepicker-overlay"]').forEach((element) => {
      element.remove();
    });
    TestBed.resetTestingModule();
  });

  it('uses the month-daypicker selector and displays month-day text', async () => {
    const fixture = TestBed.configureTestingModule({
      imports: [MonthDaypickerHostComponent],
    }).createComponent(MonthDaypickerHostComponent);

    await settle(fixture);

    const input = getRequired<HTMLInputElement>(
      fixture.nativeElement as HTMLElement,
      '[data-slot="datepicker-input"]',
    );
    expect(input.value).toBe('04-22');
  });

  it('parses manual month-day input against the fixed year', async () => {
    const fixture = TestBed.configureTestingModule({
      imports: [MonthDaypickerHostComponent],
    }).createComponent(MonthDaypickerHostComponent);

    await settle(fixture);

    getRequired<HTMLButtonElement>(
      fixture.nativeElement as HTMLElement,
      '[data-slot="datepicker-trigger"]',
    ).click();
    await settle(fixture);

    const input = getRequired<HTMLInputElement>(
      fixture.nativeElement as HTMLElement,
      '[data-slot="datepicker-input"]',
    );
    input.value = '09-14';
    input.dispatchEvent(new Event('input', { bubbles: true }));
    await settle(fixture);

    input.focus();
    keydown(input, 'Enter');
    await settle(fixture);

    expect(fixture.componentInstance.valueChanges).toEqual([{ day: 14, month: 9 }]);
  });

  it('routes period navigation to month selection instead of year selection', async () => {
    const fixture = TestBed.configureTestingModule({
      imports: [MonthDaypickerHostComponent],
    }).createComponent(MonthDaypickerHostComponent);

    await settle(fixture);

    getRequired<HTMLButtonElement>(
      fixture.nativeElement as HTMLElement,
      '[data-slot="datepicker-trigger"]',
    ).click();
    await settle(fixture);
    await waitForAnimationFrame();
    await settle(fixture);

    getRequired<HTMLButtonElement>(document.body, '[data-slot="datepicker-period-button"]').click();
    await settle(fixture);
    await waitForAnimationFrame();
    await settle(fixture);

    expect(document.body.querySelectorAll('[data-slot="datepicker-year"]').length).toBe(0);
    expect(document.body.querySelectorAll('[data-slot="datepicker-month"]').length).toBeGreaterThan(
      0,
    );
  });

  it('locks scrollable ancestors while the month-day overlay is open', async () => {
    const fixture = TestBed.configureTestingModule({
      imports: [ScrollableMonthDaypickerHostComponent],
    }).createComponent(ScrollableMonthDaypickerHostComponent);

    await settle(fixture);

    const scrollParent = getRequired<HTMLElement>(
      fixture.nativeElement as HTMLElement,
      '[data-testid="month-day-scroll-parent"]',
    );
    expect(scrollParent.style.overflow).toBe('auto');

    getRequired<HTMLButtonElement>(
      fixture.nativeElement as HTMLElement,
      '[data-slot="datepicker-trigger"]',
    ).click();
    await settle(fixture);
    await waitForAnimationFrame();
    await settle(fixture);

    expect(document.body.style.overflow).toBe('hidden');
    expect(scrollParent.style.overflow).toBe('hidden');

    getRequired<HTMLButtonElement>(
      fixture.nativeElement as HTMLElement,
      '[data-slot="datepicker-trigger"]',
    ).click();
    await settle(fixture);

    expect(document.body.style.overflow).toBe('');
    expect(scrollParent.style.overflow).toBe('auto');
  });
});