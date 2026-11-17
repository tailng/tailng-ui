import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { afterEach, describe, expect, it } from 'vitest';
import { TngMonthpickerComponent, type TngYearMonthValue } from '../tng-monthpicker.component';

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

function getRequired<T extends Element>(root: unknown, selector: string): T {
  if (!(root instanceof HTMLElement) && !(root instanceof Document)) {
    throw new Error('Expected a queryable DOM root.');
  }

  const element = root.querySelector(selector);
  if (element === null) {
    throw new Error(`Expected selector ${selector} to exist.`);
  }

  return element as T;
}

function findButton(
  slot: 'datepicker-month' | 'datepicker-year',
  label: string,
): HTMLButtonElement {
  const button = Array.from(
    document.body.querySelectorAll<HTMLButtonElement>(`[data-slot="${slot}"]`),
  ).find((candidate) => candidate.textContent?.trim() === label);
  if (button === undefined) {
    throw new Error(`Expected ${slot} button ${label} to exist.`);
  }

  return button;
}

@Component({
  imports: [TngMonthpickerComponent],
  template: `
    <tng-monthpicker
      [allowManualInput]="allowManualInput()"
      [defaultValue]="defaultValue()"
      [disabled]="disabled()"
      [maxMonth]="maxMonth()"
      [minMonth]="minMonth()"
      [readonly]="readonly()"
      (openChange)="openChanges.push($event)"
      (valueChange)="valueChanges.push($event)"
    />
  `,
})
class MonthpickerHostComponent {
  public readonly allowManualInput = signal(true);
  public readonly defaultValue = signal<TngYearMonthValue>({ month: 4, year: 2024 });
  public readonly disabled = signal(false);
  public readonly maxMonth = signal<TngYearMonthValue | undefined>(undefined);
  public readonly minMonth = signal<TngYearMonthValue | undefined>(undefined);
  public readonly readonly = signal(false);
  public readonly openChanges: boolean[] = [];
  public readonly valueChanges: TngYearMonthValue[] = [];
}

@Component({
  imports: [TngMonthpickerComponent],
  template: `<tng-monthpicker [value]="value()" (valueChange)="value.set($event)" />`,
})
class ControlledMonthpickerHostComponent {
  public readonly value = signal<TngYearMonthValue>({ month: 4, year: 2024 });
}

@Component({
  imports: [TngMonthpickerComponent],
  template: `
    <div data-testid="month-scroll-parent" style="overflow: auto; max-height: 120px;">
      <tng-monthpicker [defaultValue]="{ month: 4, year: 2024 }" scrollStrategy="block" />
    </div>
  `,
})
class ScrollableMonthpickerHostComponent {}

describe('tng-monthpicker component', () => {
  afterEach(() => {
    document.body.style.overflow = '';
    document.body.style.paddingRight = '';
    document.documentElement.style.left = '';
    document.documentElement.style.overflowY = '';
    document.documentElement.style.position = '';
    document.documentElement.style.top = '';
    document.documentElement.style.width = '';
    document.body.querySelectorAll('[data-slot="datepicker-overlay"]').forEach((element) => {
      element.remove();
    });
    TestBed.resetTestingModule();
  });

  it('uses the monthpicker selector and formats its value as YYYY-MM', async () => {
    const fixture = TestBed.configureTestingModule({
      imports: [MonthpickerHostComponent],
    }).createComponent(MonthpickerHostComponent);

    await settle(fixture);

    expect(
      getRequired<HTMLInputElement>(fixture.nativeElement, '[data-slot="datepicker-input"]').value,
    ).toBe('2024-04');
    expect(fixture.componentInstance.valueChanges).toEqual([]);
  });

  it('updates the displayed value when the controlled value changes', async () => {
    const fixture = TestBed.configureTestingModule({
      imports: [ControlledMonthpickerHostComponent],
    }).createComponent(ControlledMonthpickerHostComponent);

    await settle(fixture);
    fixture.componentInstance.value.set({ month: 12, year: 2030 });
    await settle(fixture);

    expect(
      getRequired<HTMLInputElement>(fixture.nativeElement, '[data-slot="datepicker-input"]').value,
    ).toBe('2030-12');
  });

  it('opens directly to the month panel without rendering a day grid', async () => {
    const fixture = TestBed.configureTestingModule({
      imports: [MonthpickerHostComponent],
    }).createComponent(MonthpickerHostComponent);

    await settle(fixture);
    getRequired<HTMLButtonElement>(
      fixture.nativeElement,
      '[data-slot="datepicker-trigger"]',
    ).click();
    await settle(fixture);
    await waitForAnimationFrame();
    await settle(fixture);

    expect(document.body.querySelectorAll('[data-slot="datepicker-month"]')).toHaveLength(12);
    expect(document.body.querySelectorAll('[data-slot="datepicker-cell"]')).toHaveLength(0);
    expect(findButton('datepicker-month', 'Apr').getAttribute('aria-selected')).toBe('true');
  });

  it('commits a clicked month and closes the popup', async () => {
    const fixture = TestBed.configureTestingModule({
      imports: [MonthpickerHostComponent],
    }).createComponent(MonthpickerHostComponent);

    await settle(fixture);
    getRequired<HTMLButtonElement>(
      fixture.nativeElement,
      '[data-slot="datepicker-trigger"]',
    ).click();
    await settle(fixture);
    await waitForAnimationFrame();
    findButton('datepicker-month', 'Sep').click();
    await settle(fixture);

    expect(fixture.componentInstance.valueChanges).toEqual([{ month: 9, year: 2024 }]);
    expect(fixture.componentInstance.openChanges.at(-1)).toBe(false);
    expect(
      document.body.querySelector('[data-slot="datepicker-overlay"]')?.getAttribute('data-open'),
    ).toBe('false');
  });

  it('chooses a year without committing and then commits it with the chosen month', async () => {
    const fixture = TestBed.configureTestingModule({
      imports: [MonthpickerHostComponent],
    }).createComponent(MonthpickerHostComponent);

    await settle(fixture);
    getRequired<HTMLButtonElement>(
      fixture.nativeElement,
      '[data-slot="datepicker-trigger"]',
    ).click();
    await settle(fixture);
    await waitForAnimationFrame();
    getRequired<HTMLButtonElement>(document.body, '[data-slot="datepicker-period-button"]').click();
    await settle(fixture);
    findButton('datepicker-year', '2026').click();
    await settle(fixture);

    expect(fixture.componentInstance.valueChanges).toEqual([]);
    expect(document.body.querySelectorAll('[data-slot="datepicker-month"]')).toHaveLength(12);

    findButton('datepicker-month', 'Feb').click();
    await settle(fixture);
    expect(fixture.componentInstance.valueChanges).toEqual([{ month: 2, year: 2026 }]);
  });

  it('does not commit when paging to another year', async () => {
    const fixture = TestBed.configureTestingModule({
      imports: [MonthpickerHostComponent],
    }).createComponent(MonthpickerHostComponent);

    await settle(fixture);
    getRequired<HTMLButtonElement>(
      fixture.nativeElement,
      '[data-slot="datepicker-trigger"]',
    ).click();
    await settle(fixture);
    await waitForAnimationFrame();
    const nextButton = Array.from(
      document.body.querySelectorAll<HTMLButtonElement>('[data-slot="datepicker-nav-button"]'),
    ).at(-1);
    nextButton?.click();
    await settle(fixture);

    expect(fixture.componentInstance.valueChanges).toEqual([]);
  });

  it('commits the active month with Enter', async () => {
    const fixture = TestBed.configureTestingModule({
      imports: [MonthpickerHostComponent],
    }).createComponent(MonthpickerHostComponent);

    await settle(fixture);
    getRequired<HTMLButtonElement>(
      fixture.nativeElement,
      '[data-slot="datepicker-trigger"]',
    ).click();
    await settle(fixture);
    await waitForAnimationFrame();
    const selected = findButton('datepicker-month', 'Apr');
    selected.focus();
    keydown(selected, 'ArrowRight');
    keydown(document.activeElement ?? selected, 'Enter');
    await settle(fixture);

    expect(fixture.componentInstance.valueChanges).toEqual([{ month: 5, year: 2024 }]);
  });

  it('commits valid YYYY-MM manual input', async () => {
    const fixture = TestBed.configureTestingModule({
      imports: [MonthpickerHostComponent],
    }).createComponent(MonthpickerHostComponent);

    await settle(fixture);
    const input = getRequired<HTMLInputElement>(
      fixture.nativeElement,
      '[data-slot="datepicker-input"]',
    );
    input.value = '2027-11';
    input.dispatchEvent(new Event('input', { bubbles: true }));
    input.focus();
    keydown(input, 'Enter');
    await settle(fixture);
    keydown(input, 'Enter');
    await settle(fixture);

    expect(fixture.componentInstance.valueChanges).toEqual([{ month: 11, year: 2027 }]);
  });

  it.each(['2024-00', '2024-13', '24-04', 'not-a-month'])(
    'rejects invalid manual input %s and preserves the value',
    async (invalidValue) => {
      const fixture = TestBed.configureTestingModule({
        imports: [MonthpickerHostComponent],
      }).createComponent(MonthpickerHostComponent);

      await settle(fixture);
      const input = getRequired<HTMLInputElement>(
        fixture.nativeElement,
        '[data-slot="datepicker-input"]',
      );
      input.value = invalidValue;
      input.dispatchEvent(new Event('input', { bubbles: true }));
      input.focus();
      keydown(input, 'Enter');
      await settle(fixture);
      keydown(input, 'Enter');
      await settle(fixture);

      expect(fixture.componentInstance.valueChanges).toEqual([]);
      expect(input.getAttribute('aria-invalid')).toBe('true');
    },
  );

  it('disables months outside minMonth and maxMonth', async () => {
    const fixture = TestBed.configureTestingModule({
      imports: [MonthpickerHostComponent],
    }).createComponent(MonthpickerHostComponent);
    fixture.componentInstance.minMonth.set({ month: 4, year: 2024 });
    fixture.componentInstance.maxMonth.set({ month: 9, year: 2024 });

    await settle(fixture);
    getRequired<HTMLButtonElement>(
      fixture.nativeElement,
      '[data-slot="datepicker-trigger"]',
    ).click();
    await settle(fixture);
    await waitForAnimationFrame();

    expect(findButton('datepicker-month', 'Mar').disabled).toBe(true);
    expect(findButton('datepicker-month', 'Apr').disabled).toBe(false);
    expect(findButton('datepicker-month', 'Sep').disabled).toBe(false);
    expect(findButton('datepicker-month', 'Oct').disabled).toBe(true);
  });

  it('keeps calendar selection available when readonly is true', async () => {
    const fixture = TestBed.configureTestingModule({
      imports: [MonthpickerHostComponent],
    }).createComponent(MonthpickerHostComponent);
    fixture.componentInstance.readonly.set(true);

    await settle(fixture);
    const input = getRequired<HTMLInputElement>(
      fixture.nativeElement,
      '[data-slot="datepicker-input"]',
    );
    expect(input.readOnly).toBe(true);
    getRequired<HTMLButtonElement>(
      fixture.nativeElement,
      '[data-slot="datepicker-trigger"]',
    ).click();
    await settle(fixture);
    await waitForAnimationFrame();
    expect(document.body.querySelectorAll('[data-slot="datepicker-month"]')).toHaveLength(12);
  });

  it('prevents all interaction when disabled is true', async () => {
    const fixture = TestBed.configureTestingModule({
      imports: [MonthpickerHostComponent],
    }).createComponent(MonthpickerHostComponent);
    fixture.componentInstance.disabled.set(true);

    await settle(fixture);
    const trigger = getRequired<HTMLButtonElement>(
      fixture.nativeElement,
      '[data-slot="datepicker-trigger"]',
    );
    expect(trigger.disabled).toBe(true);
    trigger.click();
    await settle(fixture);
    expect(trigger.getAttribute('aria-expanded')).toBe('false');
    expect(
      document.body.querySelector('[data-slot="datepicker-overlay"]')?.getAttribute('data-open'),
    ).toBe('false');
  });

  it('locks scroll ancestors when scrollStrategy is block', async () => {
    const fixture = TestBed.configureTestingModule({
      imports: [ScrollableMonthpickerHostComponent],
    }).createComponent(ScrollableMonthpickerHostComponent);

    await settle(fixture);
    const scrollParent = getRequired<HTMLElement>(
      fixture.nativeElement,
      '[data-testid="month-scroll-parent"]',
    );
    getRequired<HTMLButtonElement>(
      fixture.nativeElement,
      '[data-slot="datepicker-trigger"]',
    ).click();
    await settle(fixture);
    await waitForAnimationFrame();
    await settle(fixture);

    expect(document.documentElement.style.position).toBe('fixed');
    expect(scrollParent.style.overflow).toBe('hidden');
  });
});
