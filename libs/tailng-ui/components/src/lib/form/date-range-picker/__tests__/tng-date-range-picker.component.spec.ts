import { Component, signal, type Type } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { createOverlayRuntime, type TngOverlayRuntime } from '@tailng-ui/cdk';
import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  TngDateRangePickerComponent,
  type TngDateRangePickerSelectionInput,
  type TngDateRangePickerValue,
} from '../tng-date-range-picker.component';

const specDirectory = dirname(fileURLToPath(import.meta.url));
const dateRangePickerComponentCss = readFileSync(
  resolve(specDirectory, '../tng-date-range-picker.component.css'),
  'utf8',
);
const dateRangePickerThemeContractCss = readFileSync(
  resolve(
    specDirectory,
    '../../../../../../theme/src/lib/component-contracts/form/date-range-picker/date-range-picker.css',
  ),
  'utf8',
);

function keydown(target: EventTarget, key: string): KeyboardEvent {
  const event = new KeyboardEvent('keydown', { bubbles: true, cancelable: true, key });
  target.dispatchEvent(event);
  return event;
}

function focus(el: HTMLElement): void {
  el.dispatchEvent(new FocusEvent('focus', { bubbles: false, cancelable: false }));
  el.focus();
}

function dispatchTabAndSimulateBrowserFocus(
  source: HTMLElement,
  target: HTMLElement,
  shiftKey = false,
): KeyboardEvent {
  const event = new KeyboardEvent('keydown', {
    key: 'Tab',
    shiftKey,
    bubbles: true,
    cancelable: true,
  });

  source.dispatchEvent(event);
  source.dispatchEvent(
    new FocusEvent('focusout', {
      bubbles: true,
      relatedTarget: target,
    }),
  );

  target.focus();
  target.dispatchEvent(
    new FocusEvent('focusin', {
      bubbles: true,
      relatedTarget: source,
    }),
  );

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

function getRequired<T extends Element>(
  fixture: { nativeElement: HTMLElement },
  selector: string,
): T {
  const element = fixture.nativeElement.querySelector(selector);
  if (element === null) {
    throw new Error(`Expected selector ${selector} to exist.`);
  }

  return element;
}

function getRequiredFromRoot<T extends Element>(root: ParentNode, selector: string): T {
  const element = root.querySelector(selector);
  if (element === null) {
    throw new Error(`Expected selector ${selector} to exist.`);
  }

  return element;
}

function createRect(top: number, bottom: number): DOMRect {
  return {
    x: 0,
    y: top,
    width: 320,
    height: bottom - top,
    top,
    right: 320,
    bottom,
    left: 0,
    toJSON: () => ({}),
  } as DOMRect;
}

function dateKey(date: Date): string {
  const year = date.getFullYear().toString().padStart(4, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  return `${year}-${month}-${day}`;
}

type FixtureLike = {
  detectChanges(): void;
  nativeElement: HTMLElement;
  whenStable(): Promise<unknown>;
};

async function openOverlay(fixture: FixtureLike): Promise<void> {
  getRequired<HTMLButtonElement>(fixture, '[data-slot="date-range-picker-trigger"]').click();
  await settle(fixture);
  await waitForAnimationFrame();
  await settle(fixture);
}

async function openOverlayByKeyboard(fixture: FixtureLike): Promise<void> {
  const trigger = getRequired<HTMLButtonElement>(
    fixture,
    '[data-slot="date-range-picker-trigger"]',
  );
  trigger.focus();
  keydown(trigger, 'Enter');
  await settle(fixture);
  await waitForAnimationFrame();
  await settle(fixture);
}

async function openOverlayByInputEnter(fixture: FixtureLike): Promise<void> {
  const input = getRequired<HTMLInputElement>(fixture, '[data-slot="date-range-picker-input"]');
  focus(input);
  keydown(input, 'Enter');
  await settle(fixture);
  await waitForAnimationFrame();
  await settle(fixture);
}

function getPickerButton(
  slot: 'date-range-picker-month' | 'date-range-picker-year',
  label: string,
): HTMLButtonElement {
  const button = Array.from(document.body.querySelectorAll(`[data-slot="${slot}"]`)).find(
    (element) => (element as HTMLElement).textContent?.trim() === label,
  ) as HTMLButtonElement | undefined;

  if (button === undefined) {
    throw new Error(`Expected ${slot} button ${label} to exist.`);
  }

  return button;
}

function getActivePickerButton(
  slot: 'date-range-picker-month' | 'date-range-picker-year',
): HTMLButtonElement {
  return getRequiredFromRoot<HTMLButtonElement>(
    document.body,
    `[data-slot="${slot}"][data-active="true"]`,
  );
}

function getActiveDayCell(): HTMLButtonElement {
  return getRequiredFromRoot<HTMLButtonElement>(
    document.body,
    '[data-slot="date-range-picker-cell"][data-active="true"]',
  );
}

async function navigatePickerGridToYear(fixture: FixtureLike, targetYear: string): Promise<void> {
  const grid = getRequiredFromRoot<HTMLElement>(
    document.body,
    '[data-slot="date-range-picker-grid"]',
  );

  for (let attempt = 0; attempt < 50; attempt += 1) {
    if (getActivePickerButton('date-range-picker-year').textContent?.trim() === targetYear) {
      return;
    }

    const activeYear = Number(getActivePickerButton('date-range-picker-year').textContent?.trim());
    const target = Number(targetYear);
    keydown(grid, target < activeYear ? 'ArrowUp' : 'ArrowDown');
    await settle(fixture);
    await waitForAnimationFrame();
    await settle(fixture);
  }

  throw new Error(`Could not navigate the year grid to ${targetYear}.`);
}

async function navigatePickerGridToMonth(fixture: FixtureLike, targetLabel: string): Promise<void> {
  const grid = getRequiredFromRoot<HTMLElement>(
    document.body,
    '[data-slot="date-range-picker-grid"]',
  );
  const monthOrder = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];

  for (let attempt = 0; attempt < 20; attempt += 1) {
    if (getActivePickerButton('date-range-picker-month').textContent?.trim() === targetLabel) {
      return;
    }

    const activeLabel = getActivePickerButton('date-range-picker-month').textContent?.trim() ?? '';
    const activeIndex = monthOrder.indexOf(activeLabel);
    const targetIndex = monthOrder.indexOf(targetLabel);
    if (activeIndex === -1 || targetIndex === -1) {
      throw new Error(`Unknown month label while navigating: ${activeLabel} -> ${targetLabel}`);
    }

    keydown(grid, targetIndex < activeIndex ? 'ArrowLeft' : 'ArrowRight');
    await settle(fixture);
    await waitForAnimationFrame();
    await settle(fixture);
  }

  throw new Error(`Could not navigate the month grid to ${targetLabel}.`);
}

async function navigateDayGridTo(fixture: FixtureLike, dayLabel: string): Promise<void> {
  const grid = getRequiredFromRoot<HTMLElement>(
    document.body,
    '[data-slot="date-range-picker-grid"]',
  );

  for (let attempt = 0; attempt < 80; attempt += 1) {
    if (getActiveDayCell().textContent?.trim() === dayLabel) {
      return;
    }

    const activeDay = Number(getActiveDayCell().textContent?.trim());
    const targetDay = Number(dayLabel);
    if (Number.isNaN(activeDay) || Number.isNaN(targetDay)) {
      throw new Error(`Could not parse day labels while navigating: ${activeDay} -> ${targetDay}`);
    }

    keydown(grid, targetDay < activeDay ? 'ArrowLeft' : 'ArrowRight');
    await settle(fixture);
    await waitForAnimationFrame();
    await settle(fixture);
  }

  throw new Error(`Could not navigate the day grid to ${dayLabel}.`);
}

async function pressActiveElementKey(fixture: FixtureLike, key: string): Promise<void> {
  keydown(document.activeElement as HTMLElement, key);
  await settle(fixture);
  await waitForAnimationFrame();
  await settle(fixture);
}

async function pressTabForward(fixture: FixtureLike): Promise<void> {
  const activeElement = document.activeElement as HTMLElement | null;
  if (activeElement === null) {
    throw new Error('Expected an active element before tabbing.');
  }

  const event = keydown(activeElement, 'Tab');
  await settle(fixture);
  await waitForAnimationFrame();
  await settle(fixture);

  if (event.defaultPrevented) {
    return;
  }

  const overlay = getRequiredFromRoot<HTMLElement>(
    document.body,
    '[data-slot="date-range-picker-overlay"]',
  );
  const focusableElements = Array.from(overlay.querySelectorAll<HTMLElement>('button')).filter(
    (element) => !element.disabled && element.getAttribute('tabindex') !== '-1',
  );
  const currentIndex = focusableElements.indexOf(activeElement);
  const nextElement = focusableElements[currentIndex + 1] ?? focusableElements[0];
  if (nextElement === undefined) {
    throw new Error('Expected a focusable overlay element after tabbing.');
  }

  nextElement.focus();
  await settle(fixture);
}

function activateFocusedButton(button: HTMLButtonElement): void {
  button.focus();
  keydown(button, 'Enter');
  button.dispatchEvent(new MouseEvent('click', { bubbles: true }));
}

function getDayButton(root: ParentNode, dayLabel: string): HTMLButtonElement {
  const target = Array.from(root.querySelectorAll('[data-slot="date-range-picker-cell"]')).find(
    (element) =>
      (element as HTMLButtonElement).disabled === false &&
      (element as HTMLElement).textContent?.trim() === dayLabel,
  ) as HTMLButtonElement | undefined;

  if (target === undefined) {
    throw new Error(`Expected day cell ${dayLabel} to exist.`);
  }

  return target;
}

function expectRangeValue(value: unknown, start: string, end: string | null): void {
  const range = value as TngDateRangePickerValue<Date>;
  expect(range).not.toBeNull();
  if (range === null) {
    return;
  }

  expect(range.start).toBeInstanceOf(Date);
  expect(range.start === null ? null : dateKey(range.start)).toBe(start);
  if (end === null) {
    expect(range.end).toBeNull();
    return;
  }

  expect(range.end).toBeInstanceOf(Date);
  expect(range.end === null ? null : dateKey(range.end)).toBe(end);
}

async function expectInputCommitReopensSelectedRange(
  hostComponent: Type<unknown>,
  nextInputValue: string,
  expectedHeader: string,
  expectedStartLabel: string,
  expectedEndLabel: string | null,
): Promise<void> {
  const fixture = TestBed.configureTestingModule({
    imports: [hostComponent],
  }).createComponent(hostComponent);

  await settle(fixture);

  const input = getRequired<HTMLInputElement>(fixture, '[data-slot="date-range-picker-input"]');
  input.value = nextInputValue;
  input.dispatchEvent(new Event('input', { bubbles: true }));
  await settle(fixture);

  keydown(input, 'Enter');
  await settle(fixture);
  await waitForAnimationFrame();
  await settle(fixture);

  keydown(input, 'Enter');
  await settle(fixture);
  expect(input.value).toBe(nextInputValue);

  await openOverlay(fixture);

  expect(
    getRequiredFromRoot<HTMLButtonElement>(
      document.body,
      '[data-slot="date-range-picker-period-button"]',
    ).textContent?.includes(expectedHeader),
  ).toBe(true);
  expect(getDayButton(document.body, expectedStartLabel).getAttribute('data-range-start')).toBe(
    'true',
  );
  if (expectedEndLabel !== null) {
    expect(getDayButton(document.body, expectedEndLabel).getAttribute('data-range-end')).toBe(
      'true',
    );
  }
}

@Component({
  imports: [TngDateRangePickerComponent],
  template: `
    <tng-date-range-picker
      [defaultValue]="{ start: '2024-04-22', end: '2024-04-24' }"
      (openChange)="openChanges.push($event)"
    />
  `,
})
class DateRangePickerTabFocusHostComponent {
  public readonly openChanges: boolean[] = [];
}

@Component({
  imports: [TngDateRangePickerComponent],
  template: `
    <form>
      <input type="text" data-testid="text-input" />
      <tng-date-range-picker
        [defaultValue]="{ start: '2024-04-22', end: '2024-04-24' }"
        (openChange)="openChanges.push($event)"
      />
      <button type="submit" data-testid="submit-button">Submit</button>
    </form>
  `,
})
class DateRangePickerFormTabOrderHostComponent {
  public readonly openChanges: boolean[] = [];
}

@Component({
  imports: [TngDateRangePickerComponent],
  template: `
    <tng-date-range-picker
      [closeOnSelect]="closeOnSelect()"
      [defaultValue]="defaultValue()"
      [defaultOpen]="defaultOpen()"
      [minDate]="minDate()"
      [maxDate]="maxDate()"
      [placement]="placement()"
      [today]="today()"
      (openChange)="openChanges.push($event)"
      (previewEndDateChange)="previewChanges.push($event)"
      (valueChange)="valueChanges.push($event)"
    />
  `,
})
class UncontrolledDateRangePickerHostComponent {
  public readonly closeOnSelect = signal(true);
  public readonly defaultOpen = signal(false);
  public readonly defaultValue = signal<TngDateRangePickerSelectionInput<Date> | undefined>({
    start: '2024-04-22',
    end: '2024-04-24',
  });
  public readonly minDate = signal<string | null>(null);
  public readonly maxDate = signal<string | null>(null);
  public readonly placement = signal<'auto' | 'bottom' | 'top'>('auto');
  public readonly today = signal('2024-04-18');
  public readonly openChanges: boolean[] = [];
  public readonly previewChanges: Date[] = [];
  public readonly valueChanges: unknown[] = [];
}

@Component({
  imports: [TngDateRangePickerComponent],
  template: `
    <div data-testid="range-scroll-parent" style="overflow: auto; max-height: 120px;">
      <tng-date-range-picker
        [defaultValue]="{ start: '2024-04-22', end: '2024-04-24' }"
        scrollStrategy="block"
        (openChange)="openChanges.push($event)"
      />
    </div>
  `,
})
class ScrollableDateRangePickerHostComponent {
  public readonly openChanges: boolean[] = [];
}

@Component({
  imports: [TngDateRangePickerComponent],
  template: `
    <tng-date-range-picker
      aria-label="Styled Date Range Picker"
      style="
        --tng-date-range-picker-surface: #f8fafc;
        --tng-date-range-picker-border: #d8e2ef;
        --tng-date-range-picker-fg: #0f172a;
        --tng-date-range-picker-brand: #2563eb;
        --tng-date-range-picker-nav-size: 2.8rem;
        --tng-semantic-background-surface: #f8fafc;
        --tng-semantic-border-subtle: #d8e2ef;
        --tng-semantic-foreground-primary: #0f172a;
        --tng-semantic-accent-brand: #2563eb;
        --tng-date-range-picker-z-overlay: 2;
        color-scheme: light;
      "
    />
  `,
})
class StyledDateRangePickerHostComponent {}

@Component({
  imports: [TngDateRangePickerComponent],
  styles: `
    .search-form tng-date-range-picker {
      --tng-date-range-picker-border: transparent;
      --tng-date-range-picker-radius: 0.25rem;
    }
  `,
  template: `
    <div class="search-form">
      <tng-date-range-picker aria-label="Consumer-themed Date Range Picker" />
    </div>
  `,
})
class ConsumerThemedDateRangePickerHostComponent {}

@Component({
  imports: [TngDateRangePickerComponent],
  template: `
    <tng-date-range-picker
      aria-label="Runtime Date Range Picker"
      [overlayRuntime]="overlayRuntime()"
    />
  `,
})
class CustomRuntimeDateRangePickerHostComponent {
  public readonly overlayRuntime = signal<TngOverlayRuntime | null>(
    createOverlayRuntime({ documentRef: document }),
  );
}

describe('tng-date-range-picker component behavior', () => {
  afterEach(() => {
    vi.restoreAllMocks();
    TestBed.resetTestingModule();
    document.body.style.overflow = '';
    document.body.style.paddingRight = '';
    document.documentElement.style.left = '';
    document.documentElement.style.overflowY = '';
    document.documentElement.style.position = '';
    document.documentElement.style.top = '';
    document.documentElement.style.width = '';
    document.body.querySelectorAll('[data-slot="date-range-picker-overlay"]').forEach((element) => {
      element.remove();
    });
  });

  it('exports the date range picker component', () => {
    expect(typeof TngDateRangePickerComponent).toBe('function');
  });

  it('renders the default range value in the editable input', async () => {
    const fixture = TestBed.configureTestingModule({
      imports: [UncontrolledDateRangePickerHostComponent],
    }).createComponent(UncontrolledDateRangePickerHostComponent);

    await settle(fixture);

    const input = getRequired<HTMLInputElement>(fixture, '[data-slot="date-range-picker-input"]');
    expect(input.value).toBe('04-22-2024 – 04-24-2024');
  });

  it('keeps the overlay hidden by default until the trigger opens it', async () => {
    const fixture = TestBed.configureTestingModule({
      imports: [UncontrolledDateRangePickerHostComponent],
    }).createComponent(UncontrolledDateRangePickerHostComponent);

    await settle(fixture);

    const overlay = getRequired<HTMLElement>(fixture, '[data-slot="date-range-picker-overlay"]');
    expect(overlay.getAttribute('hidden')).toBe('');
    expect(overlay.style.display).toBe('none');
    expect(fixture.componentInstance.openChanges).toEqual([]);
  });

  it('opens the overlay from the trigger and emits openChange', async () => {
    const fixture = TestBed.configureTestingModule({
      imports: [UncontrolledDateRangePickerHostComponent],
    }).createComponent(UncontrolledDateRangePickerHostComponent);

    await settle(fixture);
    await openOverlay(fixture);

    expect(fixture.componentInstance.openChanges).toEqual([true]);
    const overlay = getRequiredFromRoot<HTMLElement>(
      document.body,
      '[data-slot="date-range-picker-overlay"]',
    );
    expect(overlay.parentNode).toBe(document.body);
    expect(overlay.style.position).toBe('fixed');
    expect(overlay.style.zIndex).toBe(
      'var(--tng-date-range-picker-z-overlay, var(--tng-z-overlay, 1000))',
    );
    expect((document.activeElement as HTMLElement | null)?.getAttribute('data-slot')).toBe(
      'date-range-picker-cell',
    );
  });

  it('keeps host-scoped theme vars on the portalled overlay', async () => {
    const fixture = TestBed.configureTestingModule({
      imports: [StyledDateRangePickerHostComponent],
    }).createComponent(StyledDateRangePickerHostComponent);

    await settle(fixture);
    await openOverlay(fixture);

    const overlay = getRequiredFromRoot<HTMLElement>(
      document.body,
      '[data-slot="date-range-picker-overlay"]',
    );
    expect(overlay.style.getPropertyValue('--tng-date-range-picker-surface').trim()).toBe(
      '#f8fafc',
    );
    expect(overlay.style.getPropertyValue('--tng-date-range-picker-border').trim()).toBe('#d8e2ef');
    expect(overlay.style.getPropertyValue('--tng-date-range-picker-fg').trim()).toBe('#0f172a');
    expect(overlay.style.getPropertyValue('--tng-date-range-picker-brand').trim()).toBe('#2563eb');
    expect(overlay.style.getPropertyValue('--tng-date-range-picker-nav-size').trim()).toBe(
      '2.8rem',
    );
    expect(overlay.style.getPropertyValue('--tng-date-range-picker-z-overlay').trim()).toBe('2');
    expect(overlay.style.colorScheme).toBe('light');

    getRequired<HTMLButtonElement>(fixture, '[data-slot="date-range-picker-trigger"]').click();
    await settle(fixture);

    expect(overlay.style.getPropertyValue('--tng-date-range-picker-surface').trim()).toBe('');
    expect(overlay.style.getPropertyValue('--tng-date-range-picker-nav-size').trim()).toBe('');
    expect(overlay.style.getPropertyValue('--tng-date-range-picker-z-overlay').trim()).toBe('');
    expect(overlay.style.zIndex).toBe('');
    expect(overlay.style.colorScheme).toBe('');
  });

  it('keeps contract token defaults off the inner root so consumer host overrides can inherit', async () => {
    const fixture = TestBed.configureTestingModule({
      imports: [ConsumerThemedDateRangePickerHostComponent],
    }).createComponent(ConsumerThemedDateRangePickerHostComponent);

    await settle(fixture);

    const host = getRequired<HTMLElement>(fixture, 'tng-date-range-picker');
    const root = getRequired<HTMLElement>(fixture, '.tng-date-range-picker-root');
    const hostStyles = getComputedStyle(host);

    expect(hostStyles.getPropertyValue('--tng-date-range-picker-border').trim()).toBe(
      'transparent',
    );
    expect(hostStyles.getPropertyValue('--tng-date-range-picker-radius').trim()).toBe('0.25rem');
    expect(dateRangePickerThemeContractCss).toMatch(/:where\(tng-date-range-picker\)/);
    expect(dateRangePickerThemeContractCss).toMatch(
      /\[data-slot='date-range-picker'\]:not\(\.tng-date-range-picker-root\)/,
    );
    expect(root.matches("[data-slot='date-range-picker']:not(.tng-date-range-picker-root)")).toBe(
      false,
    );
    expect(dateRangePickerComponentCss).not.toMatch(/--tng-date-range-picker-[\w-]+\s*:/);
  });

  it('registers overlay layers on a provided overlay runtime', async () => {
    const fixture = TestBed.configureTestingModule({
      imports: [CustomRuntimeDateRangePickerHostComponent],
    }).createComponent(CustomRuntimeDateRangePickerHostComponent);

    await settle(fixture);

    const runtime = fixture.componentInstance.overlayRuntime();
    expect(runtime).not.toBeNull();
    expect(runtime?.getLayerIds()).toEqual([]);

    await openOverlay(fixture);
    expect(runtime?.getLayerIds().length).toBe(1);

    getRequired<HTMLButtonElement>(fixture, '[data-slot="date-range-picker-trigger"]').click();
    await settle(fixture);
    expect(runtime?.getLayerIds()).toEqual([]);
  });

  it('commits a full manual range on blur and emits valueChange', async () => {
    const fixture = TestBed.configureTestingModule({
      imports: [UncontrolledDateRangePickerHostComponent],
    }).createComponent(UncontrolledDateRangePickerHostComponent);

    await settle(fixture);

    const input = getRequired<HTMLInputElement>(fixture, '[data-slot="date-range-picker-input"]');
    input.value = '05-01-2024 – 05-08-2024';
    input.dispatchEvent(new Event('input', { bubbles: true }));
    await settle(fixture);

    input.dispatchEvent(new FocusEvent('blur'));
    await settle(fixture);

    expectRangeValue(fixture.componentInstance.valueChanges.at(-1), '2024-05-01', '2024-05-08');
    expect(input.value).toBe('05-01-2024 – 05-08-2024');
  });

  it('commits a full manual range on Enter and emits valueChange', async () => {
    const fixture = TestBed.configureTestingModule({
      imports: [UncontrolledDateRangePickerHostComponent],
    }).createComponent(UncontrolledDateRangePickerHostComponent);
    fixture.componentInstance.defaultValue.set(undefined);

    await settle(fixture);

    const input = getRequired<HTMLInputElement>(fixture, '[data-slot="date-range-picker-input"]');
    input.value = '05-10-2024 – 05-17-2024';
    input.dispatchEvent(new Event('input', { bubbles: true }));
    await settle(fixture);

    await openOverlay(fixture);
    input.focus();
    keydown(input, 'Enter');
    await settle(fixture);

    expectRangeValue(fixture.componentInstance.valueChanges.at(-1), '2024-05-10', '2024-05-17');
  });

  it('commits valid single-date manual input on blur and emits valueChange', async () => {
    const fixture = TestBed.configureTestingModule({
      imports: [UncontrolledDateRangePickerHostComponent],
    }).createComponent(UncontrolledDateRangePickerHostComponent);
    fixture.componentInstance.defaultValue.set(undefined);

    await settle(fixture);

    const input = getRequired<HTMLInputElement>(fixture, '[data-slot="date-range-picker-input"]');
    input.value = '05-10-2024';
    input.dispatchEvent(new Event('input', { bubbles: true }));
    await settle(fixture);

    input.dispatchEvent(new FocusEvent('blur'));
    await settle(fixture);

    expectRangeValue(fixture.componentInstance.valueChanges.at(-1), '2024-05-10', null);
    expect(input.value).toBe('05-10-2024');
  });

  it('keeps the committed value and marks the input invalid when invalid full range blurs', async () => {
    const fixture = TestBed.configureTestingModule({
      imports: [UncontrolledDateRangePickerHostComponent],
    }).createComponent(UncontrolledDateRangePickerHostComponent);

    await settle(fixture);

    const initialChangeCount = fixture.componentInstance.valueChanges.length;
    const input = getRequired<HTMLInputElement>(fixture, '[data-slot="date-range-picker-input"]');
    input.value = 'not-a-date – also-bad';
    input.dispatchEvent(new Event('input', { bubbles: true }));
    await settle(fixture);

    input.dispatchEvent(new FocusEvent('blur'));
    await settle(fixture);

    expect(fixture.componentInstance.valueChanges.length).toBe(initialChangeCount);
    expect(
      getRequired<HTMLElement>(fixture, '[data-slot="date-range-picker-input-shell"]').getAttribute(
        'data-invalid',
      ),
    ).toBe('true');
    expect(input.getAttribute('aria-invalid')).toBe('true');
  });

  it('normalizes reversed range order on keyboard commit', async () => {
    const fixture = TestBed.configureTestingModule({
      imports: [UncontrolledDateRangePickerHostComponent],
    }).createComponent(UncontrolledDateRangePickerHostComponent);
    fixture.componentInstance.defaultValue.set(undefined);

    await settle(fixture);

    const input = getRequired<HTMLInputElement>(fixture, '[data-slot="date-range-picker-input"]');
    input.value = '05-17-2024 – 05-10-2024';
    input.dispatchEvent(new Event('input', { bubbles: true }));
    await settle(fixture);

    input.dispatchEvent(new FocusEvent('blur'));
    await settle(fixture);

    expectRangeValue(fixture.componentInstance.valueChanges.at(-1), '2024-05-10', '2024-05-17');
    expect(input.value).toBe('05-10-2024 – 05-17-2024');
  });

  it('commits manual input with Enter as a partial range start and emits valueChange', async () => {
    const fixture = TestBed.configureTestingModule({
      imports: [UncontrolledDateRangePickerHostComponent],
    }).createComponent(UncontrolledDateRangePickerHostComponent);
    fixture.componentInstance.defaultValue.set(undefined);

    await settle(fixture);

    const input = getRequired<HTMLInputElement>(fixture, '[data-slot="date-range-picker-input"]');
    input.value = '05-10-2024';
    input.dispatchEvent(new Event('input', { bubbles: true }));
    await settle(fixture);

    await openOverlay(fixture);
    input.focus();
    keydown(input, 'Enter');
    await settle(fixture);

    expectRangeValue(fixture.componentInstance.valueChanges.at(-1), '2024-05-10', null);
    expect(input.value).toBe('05-10-2024');
  });

  it('reopens with the partial range start typed into the input selected in the overlay', async () => {
    await expectInputCommitReopensSelectedRange(
      UncontrolledDateRangePickerHostComponent,
      '09-20-2024',
      'September 2024',
      '20',
      null,
    );
  });

  it('selects start and end dates while marking the range cells', async () => {
    const fixture = TestBed.configureTestingModule({
      imports: [UncontrolledDateRangePickerHostComponent],
    }).createComponent(UncontrolledDateRangePickerHostComponent);
    fixture.componentInstance.defaultValue.set(undefined);
    fixture.componentInstance.closeOnSelect.set(false);

    await settle(fixture);
    await openOverlay(fixture);

    getDayButton(document.body, '20').click();
    await settle(fixture);

    expectRangeValue(fixture.componentInstance.valueChanges.at(-1), '2024-04-20', null);
    expect(
      getRequired<HTMLInputElement>(fixture, '[data-slot="date-range-picker-input"]').value,
    ).toBe('04-20-2024');

    getDayButton(document.body, '24').click();
    await settle(fixture);

    expectRangeValue(fixture.componentInstance.valueChanges.at(-1), '2024-04-20', '2024-04-24');
    expect(getDayButton(document.body, '20').getAttribute('data-range-start')).toBe('true');
    expect(getDayButton(document.body, '22').getAttribute('data-in-range')).toBe('true');
    expect(getDayButton(document.body, '24').getAttribute('data-range-end')).toBe('true');
  });

  it('emits preview changes and marks preview range cells while choosing the end date', async () => {
    const fixture = TestBed.configureTestingModule({
      imports: [UncontrolledDateRangePickerHostComponent],
    }).createComponent(UncontrolledDateRangePickerHostComponent);
    fixture.componentInstance.defaultValue.set(undefined);
    fixture.componentInstance.closeOnSelect.set(false);

    await settle(fixture);
    await openOverlay(fixture);

    getDayButton(document.body, '4').click();
    await settle(fixture);

    const day14 = getDayButton(document.body, '14');
    day14.dispatchEvent(new Event('pointerenter'));
    await settle(fixture);

    expect(dateKey(fixture.componentInstance.previewChanges.at(-1)!)).toBe('2024-04-14');
    expect(getDayButton(document.body, '4').getAttribute('data-preview-range')).toBe('true');
    expect(getDayButton(document.body, '10').getAttribute('data-preview-range')).toBe('true');
    expect(day14.getAttribute('data-preview-range')).toBe('true');
    expect(day14.getAttribute('data-preview-end')).toBe('true');
  });

  it('opens the year panel from the period button and drills down to months then days', async () => {
    const fixture = TestBed.configureTestingModule({
      imports: [UncontrolledDateRangePickerHostComponent],
    }).createComponent(UncontrolledDateRangePickerHostComponent);
    fixture.componentInstance.defaultOpen.set(true);

    await settle(fixture);

    getRequiredFromRoot<HTMLButtonElement>(
      document.body,
      '[data-slot="date-range-picker-period-button"]',
    ).click();
    await settle(fixture);

    expect(
      document.body.querySelectorAll('[data-slot="date-range-picker-year"]').length,
    ).toBeGreaterThan(0);

    const yearButton = Array.from(
      document.body.querySelectorAll('[data-slot="date-range-picker-year"]'),
    ).find((element) => (element as HTMLElement).textContent?.trim() === '2024') as
      | HTMLButtonElement
      | undefined;
    yearButton?.click();
    await settle(fixture);

    expect(
      document.body.querySelectorAll('[data-slot="date-range-picker-month"]').length,
    ).toBeGreaterThan(0);

    const monthButton = Array.from(
      document.body.querySelectorAll('[data-slot="date-range-picker-month"]'),
    ).find((element) => (element as HTMLElement).textContent?.trim() === 'Apr') as
      | HTMLButtonElement
      | undefined;
    monthButton?.click();
    await settle(fixture);

    expect(
      document.body.querySelectorAll('[data-slot="date-range-picker-cell"]').length,
    ).toBeGreaterThan(0);
  });

  it('flips the overlay above the trigger when auto placement has more space above', async () => {
    const fixture = TestBed.configureTestingModule({
      imports: [UncontrolledDateRangePickerHostComponent],
    }).createComponent(UncontrolledDateRangePickerHostComponent);
    fixture.componentInstance.defaultOpen.set(true);

    await settle(fixture);

    const anchor = getRequired<HTMLElement>(fixture, '[data-slot="date-range-picker-input-shell"]');
    const overlay = getRequiredFromRoot<HTMLElement>(
      document.body,
      '[data-slot="date-range-picker-overlay"]',
    );
    const originalInnerHeight = window.innerHeight;

    vi.spyOn(anchor, 'getBoundingClientRect').mockReturnValue(createRect(700, 740));
    vi.spyOn(overlay, 'getBoundingClientRect').mockReturnValue(createRect(0, 320));
    Object.defineProperty(overlay, 'scrollHeight', { configurable: true, value: 320 });
    Object.defineProperty(window, 'innerHeight', { configurable: true, value: 760 });

    window.dispatchEvent(new Event('resize'));
    await waitForAnimationFrame();
    await settle(fixture);

    expect(overlay.getAttribute('data-placement')).toBe('top');
    expect(overlay.style.maxHeight).not.toBe('');

    Object.defineProperty(window, 'innerHeight', {
      configurable: true,
      value: originalInnerHeight,
    });
  });

  it('preserves the document scrollbar and locks scrollable ancestors when block is explicit', async () => {
    const fixture = TestBed.configureTestingModule({
      imports: [ScrollableDateRangePickerHostComponent],
    }).createComponent(ScrollableDateRangePickerHostComponent);

    await settle(fixture);

    const scrollParent = getRequired<HTMLElement>(fixture, '[data-testid="range-scroll-parent"]');
    expect(scrollParent.style.overflow).toBe('auto');

    await openOverlay(fixture);

    expect(fixture.componentInstance.openChanges).toEqual([true]);
    expect(document.body.style.overflow).toBe('');
    expect(document.documentElement.style.position).toBe('fixed');
    expect(document.documentElement.style.overflowY).toBe('scroll');
    expect(scrollParent.style.overflow).toBe('hidden');

    getRequired<HTMLButtonElement>(fixture, '[data-slot="date-range-picker-trigger"]').click();
    await settle(fixture);

    expect(document.body.style.overflow).toBe('');
    expect(document.documentElement.style.position).toBe('');
    expect(document.documentElement.style.overflowY).toBe('');
    expect(scrollParent.style.overflow).toBe('auto');
  });

  it('selects an earlier enabled range by keyboard when today is beyond maxDate', async () => {
    const fixture = TestBed.configureTestingModule({
      imports: [UncontrolledDateRangePickerHostComponent],
    }).createComponent(UncontrolledDateRangePickerHostComponent);
    fixture.componentInstance.defaultValue.set(undefined);
    fixture.componentInstance.minDate.set('2024-04-01');
    fixture.componentInstance.maxDate.set('2025-03-31');
    fixture.componentInstance.today.set('2026-06-24');
    fixture.componentInstance.closeOnSelect.set(false);

    await settle(fixture);
    await openOverlayByKeyboard(fixture);

    const periodButton = getRequiredFromRoot<HTMLButtonElement>(
      document.body,
      '[data-slot="date-range-picker-period-button"]',
    );
    expect(periodButton.textContent?.includes('March 2025')).toBe(true);
    expect(getActiveDayCell().textContent?.trim()).toBe('31');

    activateFocusedButton(periodButton);
    await settle(fixture);
    await waitForAnimationFrame();
    await settle(fixture);

    const yearGrid = getRequiredFromRoot<HTMLElement>(
      document.body,
      '[data-slot="date-range-picker-grid"]',
    );
    expect(getActivePickerButton('date-range-picker-year').textContent?.trim()).toBe('2025');

    await navigatePickerGridToYear(fixture, '2024');
    keydown(yearGrid, 'Enter');
    await settle(fixture);
    await waitForAnimationFrame();
    await settle(fixture);

    const monthGrid = getRequiredFromRoot<HTMLElement>(
      document.body,
      '[data-slot="date-range-picker-grid"]',
    );
    await navigatePickerGridToMonth(fixture, 'Apr');
    keydown(monthGrid, 'Enter');
    await settle(fixture);
    await waitForAnimationFrame();
    await settle(fixture);

    expect(periodButton.textContent?.includes('April 2024')).toBe(true);

    const dayGrid = getRequiredFromRoot<HTMLElement>(
      document.body,
      '[data-slot="date-range-picker-grid"]',
    );
    await navigateDayGridTo(fixture, '1');
    keydown(dayGrid, 'Enter');
    await settle(fixture);
    await waitForAnimationFrame();
    await settle(fixture);

    await navigateDayGridTo(fixture, '30');
    keydown(dayGrid, 'Enter');
    await settle(fixture);
    await waitForAnimationFrame();
    await settle(fixture);

    expectRangeValue(fixture.componentInstance.valueChanges.at(-1), '2024-04-01', '2024-04-30');
    expect(
      getRequired<HTMLInputElement>(fixture, '[data-slot="date-range-picker-input"]').value,
    ).toBe('04-01-2024 – 04-30-2024');
    expect(getDayButton(document.body, '1').getAttribute('data-range-start')).toBe('true');
    expect(getDayButton(document.body, '30').getAttribute('data-range-end')).toBe('true');
  });

  it('keeps focus on enabled April after selecting 2024 from a bounded range', async () => {
    const fixture = TestBed.configureTestingModule({
      imports: [UncontrolledDateRangePickerHostComponent],
    }).createComponent(UncontrolledDateRangePickerHostComponent);
    fixture.componentInstance.defaultValue.set(undefined);
    fixture.componentInstance.minDate.set('2024-04-01');
    fixture.componentInstance.maxDate.set('2025-03-31');
    fixture.componentInstance.today.set('2025-03-31');
    fixture.componentInstance.closeOnSelect.set(false);

    await settle(fixture);
    await openOverlayByInputEnter(fixture);

    expect(getActiveDayCell().textContent?.trim()).toBe('31');
    expect(document.activeElement).toBe(getActiveDayCell());

    await pressActiveElementKey(fixture, 'ArrowLeft');
    await pressTabForward(fixture);
    await pressTabForward(fixture);

    const periodButton = getRequiredFromRoot<HTMLButtonElement>(
      document.body,
      '[data-slot="date-range-picker-period-button"]',
    );
    expect(document.activeElement).toBe(periodButton);

    activateFocusedButton(periodButton);
    await settle(fixture);
    await waitForAnimationFrame();
    await settle(fixture);

    expect(getActivePickerButton('date-range-picker-year').textContent?.trim()).toBe('2025');

    await pressActiveElementKey(fixture, 'ArrowLeft');
    expect(getActivePickerButton('date-range-picker-year').textContent?.trim()).toBe('2024');

    await pressActiveElementKey(fixture, 'Enter');

    const activeMonth = getActivePickerButton('date-range-picker-month');
    expect(activeMonth.textContent?.trim()).toBe('Apr');
    expect(activeMonth.disabled).toBe(false);
    expect(getPickerButton('date-range-picker-month', 'Mar').disabled).toBe(true);
    expect(getPickerButton('date-range-picker-month', 'Apr').disabled).toBe(false);

    keydown(
      getRequiredFromRoot<HTMLElement>(document.body, '[data-slot="date-range-picker-grid"]'),
      'ArrowLeft',
    );
    await settle(fixture);
    await waitForAnimationFrame();
    await settle(fixture);

    expect(getActivePickerButton('date-range-picker-month').textContent?.trim()).toBe('Apr');
  });

  it('opens the overlay from the input with Enter and focuses the active day cell', async () => {
    const fixture = TestBed.configureTestingModule({
      imports: [DateRangePickerTabFocusHostComponent],
    }).createComponent(DateRangePickerTabFocusHostComponent);

    await settle(fixture);

    const input = getRequired<HTMLInputElement>(fixture, '[data-slot="date-range-picker-input"]');
    const trigger = getRequired<HTMLButtonElement>(
      fixture,
      '[data-slot="date-range-picker-trigger"]',
    );

    focus(input);
    keydown(input, 'Enter');
    await settle(fixture);
    await waitForAnimationFrame();
    await settle(fixture);

    expect(fixture.componentInstance.openChanges).toEqual([true]);
    expect(
      getRequiredFromRoot<HTMLElement>(
        document.body,
        '[data-slot="date-range-picker-overlay"]',
      ).getAttribute('hidden'),
    ).toBeNull();
    expect(document.activeElement).toBe(getActiveDayCell());
    expect(trigger.getAttribute('tabindex')).toBe('-1');
  });

  it('tabs from a preceding text input to the date range picker input and then to submit', async () => {
    const fixture = TestBed.configureTestingModule({
      imports: [DateRangePickerFormTabOrderHostComponent],
    }).createComponent(DateRangePickerFormTabOrderHostComponent);

    await settle(fixture);

    const textInput = getRequired<HTMLInputElement>(fixture, '[data-testid="text-input"]');
    const rangePickerInput = getRequired<HTMLInputElement>(
      fixture,
      '[data-slot="date-range-picker-input"]',
    );
    const trigger = getRequired<HTMLButtonElement>(
      fixture,
      '[data-slot="date-range-picker-trigger"]',
    );
    const submitButton = getRequired<HTMLButtonElement>(fixture, '[data-testid="submit-button"]');
    const overlay = getRequired<HTMLElement>(fixture, '[data-slot="date-range-picker-overlay"]');

    focus(textInput);
    expect(document.activeElement).toBe(textInput);

    const firstTabEvent = dispatchTabAndSimulateBrowserFocus(textInput, rangePickerInput);
    await settle(fixture);

    expect(firstTabEvent.defaultPrevented).toBe(false);
    expect(document.activeElement).toBe(rangePickerInput);
    expect(document.activeElement).not.toBe(trigger);

    const secondTabEvent = dispatchTabAndSimulateBrowserFocus(rangePickerInput, submitButton);
    await settle(fixture);

    expect(secondTabEvent.defaultPrevented).toBe(false);
    expect(document.activeElement).toBe(submitButton);
    expect(document.activeElement).not.toBe(trigger);
    expect(trigger.getAttribute('tabindex')).toBe('-1');
    expect(overlay.getAttribute('hidden')).toBe('');
    expect(fixture.componentInstance.openChanges).toEqual([]);
  });

  it('opens from the input with Enter, navigates the day grid with arrow keys, and selects a range with Enter', async () => {
    const fixture = TestBed.configureTestingModule({
      imports: [UncontrolledDateRangePickerHostComponent],
    }).createComponent(UncontrolledDateRangePickerHostComponent);
    fixture.componentInstance.defaultValue.set(undefined);
    fixture.componentInstance.closeOnSelect.set(false);
    fixture.componentInstance.today.set('2024-04-18');

    await settle(fixture);

    const input = getRequired<HTMLInputElement>(fixture, '[data-slot="date-range-picker-input"]');

    await openOverlayByInputEnter(fixture);

    expect(getActiveDayCell().textContent?.trim()).toBe('18');
    expect(document.activeElement).toBe(getActiveDayCell());

    await pressActiveElementKey(fixture, 'ArrowRight');
    await pressActiveElementKey(fixture, 'ArrowRight');

    expect(getActiveDayCell().textContent?.trim()).toBe('20');
    expect(document.activeElement).toBe(getActiveDayCell());

    await pressActiveElementKey(fixture, 'Enter');
    await pressActiveElementKey(fixture, 'ArrowRight');
    await pressActiveElementKey(fixture, 'ArrowRight');
    await pressActiveElementKey(fixture, 'ArrowRight');
    await pressActiveElementKey(fixture, 'ArrowRight');

    expect(getActiveDayCell().textContent?.trim()).toBe('24');

    await pressActiveElementKey(fixture, 'Enter');

    expectRangeValue(fixture.componentInstance.valueChanges.at(-1), '2024-04-20', '2024-04-24');
    expect(input.value).toBe('04-20-2024 – 04-24-2024');
    expect(getDayButton(document.body, '20').getAttribute('data-range-start')).toBe('true');
    expect(getDayButton(document.body, '24').getAttribute('data-range-end')).toBe('true');
  });
});
