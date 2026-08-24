import { Component, LOCALE_ID, signal, type Type } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { createOverlayRuntime, type TngOverlayRuntime } from '@tailng-ui/cdk';
import { defaultDatepickerDateAdapter, type TngDateAdapter } from '@tailng-ui/primitives';
import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { TngDatepickerComponent } from '../tng-datepicker.component';

const specDirectory = dirname(fileURLToPath(import.meta.url));
const datepickerComponentCss = readFileSync(
  resolve(specDirectory, '../tng-datepicker.component.css'),
  'utf8',
);
const datepickerThemeContractCss = readFileSync(
  resolve(
    specDirectory,
    '../../../../../../theme/src/lib/component-contracts/form/datepicker/datepicker.css',
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

function createRect(top: number, bottom: number, width = 240, left = 0): DOMRect {
  return {
    x: left,
    y: top,
    width,
    height: bottom - top,
    top,
    right: left + width,
    bottom,
    left,
    toJSON: () => ({}),
  } as DOMRect;
}

const customFormatAdapter: TngDateAdapter<Date> = Object.freeze({
  ...defaultDatepickerDateAdapter,
  format: (date, format, locale) => {
    if (format === 'input') {
      const day = defaultDatepickerDateAdapter.getDate(date).toString().padStart(2, '0');
      const month = (defaultDatepickerDateAdapter.getMonth(date) + 1).toString().padStart(2, '0');
      const year = defaultDatepickerDateAdapter.getYear(date).toString().padStart(4, '0');
      return `${day}.${month}.${year}`;
    }

    if (format === 'month-year') {
      const year = defaultDatepickerDateAdapter.getYear(date).toString().padStart(4, '0');
      const month = defaultDatepickerDateAdapter.format(date, 'month-short', locale).toUpperCase();
      return `${year} · ${month}`;
    }

    return defaultDatepickerDateAdapter.format(date, format, locale);
  },
  parse: (text, locale) => {
    const match = /^(\d{2})\.(\d{2})\.(\d{4})$/.exec(text.trim());
    if (match !== null) {
      const day = Number(match[1]);
      const month = Number(match[2]) - 1;
      const year = Number(match[3]);
      const date = defaultDatepickerDateAdapter.createDate(year, month, day);
      return defaultDatepickerDateAdapter.isValid(date) &&
        defaultDatepickerDateAdapter.getYear(date) === year &&
        defaultDatepickerDateAdapter.getMonth(date) === month &&
        defaultDatepickerDateAdapter.getDate(date) === day
        ? date
        : null;
    }

    return defaultDatepickerDateAdapter.parse(text, locale);
  },
});

type FixtureLike = {
  detectChanges(): void;
  nativeElement: HTMLElement;
  whenStable(): Promise<unknown>;
};

async function openOverlay(fixture: FixtureLike): Promise<void> {
  getRequired<HTMLButtonElement>(fixture, '[data-slot="datepicker-trigger"]').click();
  await settle(fixture);
  await waitForAnimationFrame();
  await settle(fixture);
}

async function selectOverlayDay(fixture: FixtureLike, dayLabel: string): Promise<void> {
  await openOverlay(fixture);

  const target = Array.from(document.body.querySelectorAll('[data-slot="datepicker-cell"]')).find(
    (element) =>
      (element as HTMLButtonElement).disabled === false &&
      (element as HTMLElement).textContent?.trim() === dayLabel,
  ) as HTMLButtonElement | undefined;

  if (target === undefined) {
    throw new Error(`Expected day cell ${dayLabel} to exist.`);
  }

  target.click();
  await settle(fixture);
}

function getSelectedDayCell(): HTMLButtonElement {
  return getRequiredFromRoot<HTMLButtonElement>(
    document.body,
    '[data-slot="datepicker-cell"][data-selected="true"]',
  );
}

function getActiveDayCell(): HTMLButtonElement {
  return getRequiredFromRoot<HTMLButtonElement>(
    document.body,
    '[data-slot="datepicker-cell"][data-active="true"]',
  );
}

function getPickerButton(
  slot: 'datepicker-month' | 'datepicker-year',
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

async function expectInputCommitReopensSelectedDate(
  hostComponent: Type<unknown>,
  initialInputValue: string,
  nextInputValue: string,
  expectedHeader: string,
  expectedDayLabel: string,
): Promise<void> {
  const fixture = TestBed.configureTestingModule({
    imports: [hostComponent],
  }).createComponent(hostComponent);

  await settle(fixture);
  await selectOverlayDay(fixture, '24');

  const input = getRequired<HTMLInputElement>(fixture, '[data-slot="datepicker-input"]');
  expect(input.value).toBe(initialInputValue);

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
      '[data-slot="datepicker-period-button"]',
    ).textContent?.includes(expectedHeader),
  ).toBe(true);
  expect(getSelectedDayCell().textContent?.trim()).toBe(expectedDayLabel);
}

@Component({
  imports: [TngDatepickerComponent],
  template: `
    <tng-datepicker
      [defaultValue]="defaultValue()"
      [defaultOpen]="defaultOpen()"
      [minDate]="minDate()"
      [maxDate]="maxDate()"
      [placement]="placement()"
      (openChange)="openChanges.push($event)"
      (valueChange)="valueChanges.push($event)"
    />
  `,
})
class UncontrolledDatepickerHostComponent {
  public readonly defaultOpen = signal(false);
  public readonly defaultValue = signal('2024-04-22');
  public readonly minDate = signal<string | null>(null);
  public readonly maxDate = signal<string | null>(null);
  public readonly placement = signal<'auto' | 'bottom' | 'top'>('auto');
  public readonly openChanges: boolean[] = [];
  public readonly valueChanges: unknown[] = [];
}

@Component({
  imports: [TngDatepickerComponent],
  template: `
    <div data-testid="scroll-parent" style="overflow: auto; max-height: 120px;">
      <tng-datepicker
        [defaultValue]="'2024-04-22'"
        scrollStrategy="block"
        (openChange)="openChanges.push($event)"
      />
    </div>
  `,
})
class ScrollableDatepickerHostComponent {
  public readonly openChanges: boolean[] = [];
}

@Component({
  imports: [TngDatepickerComponent],
  template: `
    <tng-datepicker
      [adapter]="adapter"
      [defaultValue]="defaultValue()"
      [defaultOpen]="defaultOpen()"
      [minDate]="minDate()"
      [maxDate]="maxDate()"
      [placement]="placement()"
      (openChange)="openChanges.push($event)"
      (valueChange)="valueChanges.push($event)"
    />
  `,
})
class CustomFormatDatepickerHostComponent {
  public readonly adapter = customFormatAdapter;
  public readonly defaultOpen = signal(false);
  public readonly defaultValue = signal('2024-04-22');
  public readonly minDate = signal<string | null>(null);
  public readonly maxDate = signal<string | null>(null);
  public readonly placement = signal<'auto' | 'bottom' | 'top'>('auto');
  public readonly openChanges: boolean[] = [];
  public readonly valueChanges: unknown[] = [];
}

@Component({
  imports: [TngDatepickerComponent],
  template: `
    <tng-datepicker
      aria-label="Styled Datepicker"
      style="
        --tng-datepicker-surface: #f8fafc;
        --tng-datepicker-border: #d8e2ef;
        --tng-datepicker-fg: #0f172a;
        --tng-datepicker-brand: #2563eb;
        --tng-datepicker-nav-size: 2.8rem;
        --tng-semantic-background-surface: #f8fafc;
        --tng-semantic-border-subtle: #d8e2ef;
        --tng-semantic-foreground-primary: #0f172a;
        --tng-semantic-accent-brand: #2563eb;
        --tng-datepicker-z-overlay: 2;
        color-scheme: light;
      "
    />
  `,
})
class StyledDatepickerHostComponent {}

@Component({
  imports: [TngDatepickerComponent],
  styles: `
    .search-form tng-datepicker {
      --tng-datepicker-border: transparent;
      --tng-datepicker-radius: 0.25rem;
    }
  `,
  template: `
    <div class="search-form">
      <tng-datepicker aria-label="Consumer-themed Datepicker" />
    </div>
  `,
})
class ConsumerThemedDatepickerHostComponent {}

@Component({
  imports: [TngDatepickerComponent],
  template: `
    <tng-datepicker aria-label="Runtime Datepicker" [overlayRuntime]="overlayRuntime()" />
  `,
})
class CustomRuntimeDatepickerHostComponent {
  public readonly overlayRuntime = signal<TngOverlayRuntime | null>(
    createOverlayRuntime({ documentRef: document }),
  );
}

@Component({
  imports: [TngDatepickerComponent],
  template: `
    <button type="button" data-testid="before-button">Before</button>
    <tng-datepicker [defaultValue]="'2024-04-22'" (openChange)="openChanges.push($event)" />
    <button type="button" data-testid="after-button">After</button>
  `,
})
class DatepickerTabFocusHostComponent {
  public readonly openChanges: boolean[] = [];
}

@Component({
  imports: [TngDatepickerComponent],
  template: `
    <form>
      <input type="text" data-testid="text-input" />
      <tng-datepicker [defaultValue]="'2024-04-22'" (openChange)="openChanges.push($event)" />
      <button type="submit" data-testid="submit-button">Submit</button>
    </form>
  `,
})
class DatepickerFormTabOrderHostComponent {
  public readonly openChanges: boolean[] = [];
}

describe('tng-datepicker component behavior', () => {
  afterEach(() => {
    document.body.style.overflow = '';
    document.body.style.paddingRight = '';
    document.documentElement.style.left = '';
    document.documentElement.style.overflowY = '';
    document.documentElement.style.position = '';
    document.documentElement.style.top = '';
    document.documentElement.style.width = '';
    vi.restoreAllMocks();
    TestBed.resetTestingModule();
  });

  it('exports the datepicker component', () => {
    expect(typeof TngDatepickerComponent).toBe('function');
  });

  it('renders the default value in the editable input', async () => {
    const fixture = TestBed.configureTestingModule({
      imports: [UncontrolledDatepickerHostComponent],
    }).createComponent(UncontrolledDatepickerHostComponent);

    await settle(fixture);

    const input = getRequired<HTMLInputElement>(fixture, '[data-slot="datepicker-input"]');
    expect(input.value).toBe('04-22-2024');
  });

  it('keeps the overlay hidden by default until the trigger opens it', async () => {
    const fixture = TestBed.configureTestingModule({
      imports: [UncontrolledDatepickerHostComponent],
    }).createComponent(UncontrolledDatepickerHostComponent);

    await settle(fixture);

    const overlay = getRequired<HTMLElement>(fixture, '[data-slot="datepicker-overlay"]');
    expect(overlay.getAttribute('hidden')).toBe('');
    expect(overlay.style.display).toBe('none');
    expect(fixture.componentInstance.openChanges).toEqual([]);
  });

  it('opens the overlay from the trigger and emits openChange', async () => {
    const fixture = TestBed.configureTestingModule({
      imports: [UncontrolledDatepickerHostComponent],
    }).createComponent(UncontrolledDatepickerHostComponent);

    await settle(fixture);

    await openOverlay(fixture);

    expect(fixture.componentInstance.openChanges).toEqual([true]);
    const overlay = getRequiredFromRoot<HTMLElement>(
      document.body,
      '[data-slot="datepicker-overlay"]',
    );
    expect(overlay.parentNode).toBe(document.body);
    expect(overlay.style.position).toBe('fixed');
    expect(overlay.style.zIndex).toBe(
      'var(--tng-datepicker-z-overlay, var(--tng-z-overlay, 1000))',
    );
    expect((document.activeElement as HTMLElement | null)?.getAttribute('data-slot')).toBe(
      'datepicker-cell',
    );
  });

  it('clamps popup width and aligns its logical end to the input-plus-trigger shell', async () => {
    const fixture = TestBed.configureTestingModule({
      imports: [UncontrolledDatepickerHostComponent],
    }).createComponent(UncontrolledDatepickerHostComponent);

    await settle(fixture);

    const anchor = getRequired<HTMLElement>(fixture, '[data-slot="datepicker-input-shell"]');
    const overlay = getRequired<HTMLElement>(fixture, '[data-slot="datepicker-overlay"]');
    const anchorRect = vi
      .spyOn(anchor, 'getBoundingClientRect')
      .mockReturnValue(createRect(100, 140, 240, 400));
    vi.spyOn(overlay, 'getBoundingClientRect').mockImplementation(() =>
      createRect(0, 320, Number.parseFloat(overlay.style.width) || 0),
    );

    await openOverlay(fixture);

    expect(overlay.style.minWidth).toBe('288px');
    expect(overlay.style.maxWidth).toBe('320px');
    expect(overlay.style.width).toBe('288px');
    expect(overlay.style.left).toBe('352px');

    anchorRect.mockReturnValue(createRect(100, 140, 480, 100));
    window.dispatchEvent(new Event('resize'));
    await waitForAnimationFrame();
    await settle(fixture);

    expect(overlay.style.width).toBe('320px');
    expect(overlay.style.left).toBe('260px');
  });

  it('keeps host-scoped theme vars on the portalled overlay', async () => {
    const fixture = TestBed.configureTestingModule({
      imports: [StyledDatepickerHostComponent],
    }).createComponent(StyledDatepickerHostComponent);

    await settle(fixture);
    await openOverlay(fixture);

    const overlay = getRequiredFromRoot<HTMLElement>(
      document.body,
      '[data-slot="datepicker-overlay"]',
    );
    expect(overlay.style.getPropertyValue('--tng-datepicker-surface').trim()).toBe('#f8fafc');
    expect(overlay.style.getPropertyValue('--tng-datepicker-border').trim()).toBe('#d8e2ef');
    expect(overlay.style.getPropertyValue('--tng-datepicker-fg').trim()).toBe('#0f172a');
    expect(overlay.style.getPropertyValue('--tng-datepicker-brand').trim()).toBe('#2563eb');
    expect(overlay.style.getPropertyValue('--tng-datepicker-nav-size').trim()).toBe('2.8rem');
    expect(overlay.style.getPropertyValue('--tng-datepicker-z-overlay').trim()).toBe('2');
    expect(overlay.style.colorScheme).toBe('light');

    getRequired<HTMLButtonElement>(fixture, '[data-slot="datepicker-trigger"]').click();
    await settle(fixture);

    expect(overlay.style.getPropertyValue('--tng-datepicker-surface').trim()).toBe('');
    expect(overlay.style.getPropertyValue('--tng-datepicker-nav-size').trim()).toBe('');
    expect(overlay.style.getPropertyValue('--tng-datepicker-z-overlay').trim()).toBe('');
    expect(overlay.style.zIndex).toBe('');
    expect(overlay.style.colorScheme).toBe('');
  });

  it('keeps contract token defaults off the inner root so consumer host overrides can inherit', async () => {
    const fixture = TestBed.configureTestingModule({
      imports: [ConsumerThemedDatepickerHostComponent],
    }).createComponent(ConsumerThemedDatepickerHostComponent);

    await settle(fixture);

    const host = getRequired<HTMLElement>(fixture, 'tng-datepicker');
    const root = getRequired<HTMLElement>(fixture, '.tng-datepicker-root');
    const hostStyles = getComputedStyle(host);

    expect(hostStyles.getPropertyValue('--tng-datepicker-border').trim()).toBe('transparent');
    expect(hostStyles.getPropertyValue('--tng-datepicker-radius').trim()).toBe('0.25rem');
    expect(datepickerThemeContractCss).toMatch(/:where\(tng-datepicker\)/);
    expect(datepickerThemeContractCss).toMatch(
      /\[data-slot='datepicker'\]:not\(\.tng-datepicker-root\)/,
    );
    expect(root.matches("[data-slot='datepicker']:not(.tng-datepicker-root)")).toBe(false);
    expect(datepickerComponentCss).not.toMatch(/--tng-datepicker-[\w-]+\s*:/);
  });

  it('registers overlay layers on a provided overlay runtime', async () => {
    const fixture = TestBed.configureTestingModule({
      imports: [CustomRuntimeDatepickerHostComponent],
    }).createComponent(CustomRuntimeDatepickerHostComponent);

    await settle(fixture);

    const runtime = fixture.componentInstance.overlayRuntime();
    expect(runtime).not.toBeNull();
    expect(runtime?.getLayerIds()).toEqual([]);

    await openOverlay(fixture);
    expect(runtime?.getLayerIds().length).toBe(1);

    getRequired<HTMLButtonElement>(fixture, '[data-slot="datepicker-trigger"]').click();
    await settle(fixture);
    expect(runtime?.getLayerIds()).toEqual([]);
  });

  it('commits manual input with Enter and emits valueChange', async () => {
    const fixture = TestBed.configureTestingModule({
      imports: [UncontrolledDatepickerHostComponent],
    }).createComponent(UncontrolledDatepickerHostComponent);

    await settle(fixture);

    const input = getRequired<HTMLInputElement>(fixture, '[data-slot="datepicker-input"]');
    input.value = '04-24-2024';
    input.dispatchEvent(new Event('input', { bubbles: true }));
    await settle(fixture);

    await openOverlay(fixture);
    input.focus();
    keydown(input, 'Enter');
    await settle(fixture);

    const lastValue = fixture.componentInstance.valueChanges.at(-1);
    expect(lastValue).toBeInstanceOf(Date);
    expect((lastValue as Date).getFullYear()).toBe(2024);
    expect((lastValue as Date).getMonth()).toBe(3);
    expect((lastValue as Date).getDate()).toBe(24);
    expect(input.value).toBe('04-24-2024');
  });

  it('commits valid manual input on blur and emits valueChange', async () => {
    const fixture = TestBed.configureTestingModule({
      imports: [UncontrolledDatepickerHostComponent],
    }).createComponent(UncontrolledDatepickerHostComponent);

    await settle(fixture);

    const input = getRequired<HTMLInputElement>(fixture, '[data-slot="datepicker-input"]');
    input.value = '04-24-2024';
    input.dispatchEvent(new Event('input', { bubbles: true }));
    await settle(fixture);

    input.dispatchEvent(new FocusEvent('blur'));
    await settle(fixture);

    const lastValue = fixture.componentInstance.valueChanges.at(-1);
    expect(lastValue).toBeInstanceOf(Date);
    expect((lastValue as Date).getFullYear()).toBe(2024);
    expect((lastValue as Date).getMonth()).toBe(3);
    expect((lastValue as Date).getDate()).toBe(24);
    expect(input.value).toBe('04-24-2024');
  });

  it('keeps the committed value and marks the input invalid when invalid manual input blurs', async () => {
    const fixture = TestBed.configureTestingModule({
      imports: [UncontrolledDatepickerHostComponent],
    }).createComponent(UncontrolledDatepickerHostComponent);

    await settle(fixture);

    const initialChangeCount = fixture.componentInstance.valueChanges.length;
    const input = getRequired<HTMLInputElement>(fixture, '[data-slot="datepicker-input"]');
    input.value = 'not-a-date';
    input.dispatchEvent(new Event('input', { bubbles: true }));
    await settle(fixture);

    input.dispatchEvent(new FocusEvent('blur'));
    await settle(fixture);

    expect(fixture.componentInstance.valueChanges.length).toBe(initialChangeCount);
    expect(
      getRequired<HTMLElement>(fixture, '[data-slot="datepicker-input-shell"]').getAttribute(
        'data-invalid',
      ),
    ).toBe('true');
    expect(input.getAttribute('aria-invalid')).toBe('true');

    await openOverlay(fixture);

    expect(
      getRequiredFromRoot<HTMLButtonElement>(
        document.body,
        '[data-slot="datepicker-period-button"]',
      ).textContent?.includes(
        defaultDatepickerDateAdapter.format(new Date(2024, 3, 22), 'month-year', 'en-US'),
      ),
    ).toBe(true);
    expect(getSelectedDayCell().textContent?.trim()).toBe('22');
  });

  it('emits valueChange immediately when selecting a calendar date', async () => {
    const fixture = TestBed.configureTestingModule({
      imports: [UncontrolledDatepickerHostComponent],
    }).createComponent(UncontrolledDatepickerHostComponent);

    await settle(fixture);
    await selectOverlayDay(fixture, '24');

    const lastValue = fixture.componentInstance.valueChanges.at(-1);
    expect(lastValue).toBeInstanceOf(Date);
    expect((lastValue as Date).getFullYear()).toBe(2024);
    expect((lastValue as Date).getMonth()).toBe(3);
    expect((lastValue as Date).getDate()).toBe(24);
  });

  it('reopens with the year typed into the input selected in the overlay', async () => {
    await expectInputCommitReopensSelectedDate(
      UncontrolledDatepickerHostComponent,
      '04-24-2024',
      '04-24-2025',
      defaultDatepickerDateAdapter.format(new Date(2025, 3, 24), 'month-year', 'en-US'),
      '24',
    );
  });

  it('reopens with the month typed into the input selected in the overlay', async () => {
    await expectInputCommitReopensSelectedDate(
      UncontrolledDatepickerHostComponent,
      '04-24-2024',
      '09-24-2024',
      defaultDatepickerDateAdapter.format(new Date(2024, 8, 24), 'month-year', 'en-US'),
      '24',
    );
  });

  it('reopens with the day typed into the input selected in the overlay', async () => {
    await expectInputCommitReopensSelectedDate(
      UncontrolledDatepickerHostComponent,
      '04-24-2024',
      '04-12-2024',
      defaultDatepickerDateAdapter.format(new Date(2024, 3, 12), 'month-year', 'en-US'),
      '12',
    );
  });

  it('reopens with the custom-format year typed into the input selected in the overlay', async () => {
    await expectInputCommitReopensSelectedDate(
      CustomFormatDatepickerHostComponent,
      '24.04.2024',
      '24.04.2025',
      customFormatAdapter.format(new Date(2025, 3, 24), 'month-year', 'en-US'),
      '24',
    );
  });

  it('reopens with the custom-format month typed into the input selected in the overlay', async () => {
    await expectInputCommitReopensSelectedDate(
      CustomFormatDatepickerHostComponent,
      '24.04.2024',
      '24.09.2024',
      customFormatAdapter.format(new Date(2024, 8, 24), 'month-year', 'en-US'),
      '24',
    );
  });

  it('reopens with the custom-format day typed into the input selected in the overlay', async () => {
    await expectInputCommitReopensSelectedDate(
      CustomFormatDatepickerHostComponent,
      '24.04.2024',
      '12.04.2024',
      customFormatAdapter.format(new Date(2024, 3, 12), 'month-year', 'en-US'),
      '12',
    );
  });

  it('keeps the last valid selection and marks the custom-format input invalid when the typed date exceeds maxDate', async () => {
    const fixture = TestBed.configureTestingModule({
      imports: [CustomFormatDatepickerHostComponent],
    }).createComponent(CustomFormatDatepickerHostComponent);
    fixture.componentInstance.maxDate.set('2026-03-31');

    await settle(fixture);
    await selectOverlayDay(fixture, '24');

    const input = getRequired<HTMLInputElement>(fixture, '[data-slot="datepicker-input"]');
    input.value = '22.04.2027';
    input.dispatchEvent(new Event('input', { bubbles: true }));
    await settle(fixture);

    await openOverlay(fixture);
    input.focus();
    keydown(input, 'Enter');
    await settle(fixture);

    expect(
      getRequired<HTMLElement>(fixture, '[data-slot="datepicker-input-shell"]').getAttribute(
        'data-invalid',
      ),
    ).toBe('true');

    await openOverlay(fixture);

    expect(
      getRequiredFromRoot<HTMLButtonElement>(
        document.body,
        '[data-slot="datepicker-period-button"]',
      ).textContent?.includes(
        customFormatAdapter.format(new Date(2024, 3, 24), 'month-year', 'en-US'),
      ),
    ).toBe(true);
    expect(getSelectedDayCell().textContent?.trim()).toBe('24');
  });

  it('opens the year panel from the period button and drills down to months then days', async () => {
    const fixture = TestBed.configureTestingModule({
      imports: [UncontrolledDatepickerHostComponent],
    }).createComponent(UncontrolledDatepickerHostComponent);
    fixture.componentInstance.defaultOpen.set(true);

    await settle(fixture);

    getRequiredFromRoot<HTMLButtonElement>(
      document.body,
      '[data-slot="datepicker-period-button"]',
    ).click();
    await settle(fixture);

    expect(document.body.querySelectorAll('[data-slot="datepicker-year"]').length).toBeGreaterThan(
      0,
    );

    const yearButton = Array.from(
      document.body.querySelectorAll('[data-slot="datepicker-year"]'),
    ).find((element) => (element as HTMLElement).textContent?.trim() === '2024') as
      | HTMLButtonElement
      | undefined;
    yearButton?.click();
    await settle(fixture);

    expect(document.body.querySelectorAll('[data-slot="datepicker-month"]').length).toBeGreaterThan(
      0,
    );

    const monthButton = Array.from(
      document.body.querySelectorAll('[data-slot="datepicker-month"]'),
    ).find((element) => (element as HTMLElement).textContent?.trim() === 'Apr') as
      | HTMLButtonElement
      | undefined;
    monthButton?.click();
    await settle(fixture);

    expect(document.body.querySelectorAll('[data-slot="datepicker-cell"]').length).toBeGreaterThan(
      0,
    );
  });

  it('omits footer actions in the default wrapper overlay', async () => {
    const fixture = TestBed.configureTestingModule({
      imports: [UncontrolledDatepickerHostComponent],
    }).createComponent(UncontrolledDatepickerHostComponent);
    fixture.componentInstance.defaultOpen.set(true);

    await settle(fixture);

    expect(document.body.querySelector('[data-slot="datepicker-footer"]')).toBeNull();
    expect(
      Array.from(document.body.querySelectorAll('button')).some((button) =>
        ['Today', 'Clear', 'Done'].includes(button.textContent?.trim() ?? ''),
      ),
    ).toBe(false);
  });

  it('disables out-of-range months after entering the month panel through material flow', async () => {
    const fixture = TestBed.configureTestingModule({
      imports: [UncontrolledDatepickerHostComponent],
    }).createComponent(UncontrolledDatepickerHostComponent);
    fixture.componentInstance.defaultOpen.set(true);
    fixture.componentInstance.defaultValue.set('2026-02-23');
    fixture.componentInstance.minDate.set('2024-04-01');
    fixture.componentInstance.maxDate.set('2026-03-31');

    await settle(fixture);

    getRequiredFromRoot<HTMLButtonElement>(
      document.body,
      '[data-slot="datepicker-period-button"]',
    ).click();
    await settle(fixture);

    const yearButton = Array.from(
      document.body.querySelectorAll('[data-slot="datepicker-year"]'),
    ).find((element) => (element as HTMLElement).textContent?.trim() === '2026') as
      | HTMLButtonElement
      | undefined;
    yearButton?.click();
    await settle(fixture);

    const monthButtons = Array.from(
      document.body.querySelectorAll('[data-slot="datepicker-month"]'),
    );
    const march = monthButtons.find((button) => button.textContent?.trim() === 'Mar');
    const april = monthButtons.find((button) => button.textContent?.trim() === 'Apr');

    expect(march?.disabled).toBe(false);
    expect(april?.disabled).toBe(true);
  });

  it('keeps month focus on the first enabled month after keyboard-selecting the min-boundary year', async () => {
    const fixture = TestBed.configureTestingModule({
      imports: [UncontrolledDatepickerHostComponent],
    }).createComponent(UncontrolledDatepickerHostComponent);
    fixture.componentInstance.defaultOpen.set(true);
    fixture.componentInstance.defaultValue.set('2026-03-31');
    fixture.componentInstance.minDate.set('2025-04-01');
    fixture.componentInstance.maxDate.set('2026-03-31');

    await settle(fixture);

    getRequiredFromRoot<HTMLButtonElement>(
      document.body,
      '[data-slot="datepicker-period-button"]',
    ).click();
    await settle(fixture);

    const yearGrid = getRequiredFromRoot<HTMLElement>(
      document.body,
      '[data-slot="datepicker-grid"]',
    );
    keydown(yearGrid, 'ArrowLeft');
    await settle(fixture);

    expect(getPickerButton('datepicker-year', '2025').getAttribute('data-active')).toBe('true');

    keydown(yearGrid, 'Enter');
    await settle(fixture);
    await waitForAnimationFrame();
    await settle(fixture);

    const march = getPickerButton('datepicker-month', 'Mar');
    const april = getPickerButton('datepicker-month', 'Apr');

    expect(march.disabled).toBe(true);
    expect(april.disabled).toBe(false);
    expect(march.getAttribute('data-active')).toBeNull();
    expect(april.getAttribute('data-active')).toBe('true');
    expect(document.activeElement).toBe(april);
  });

  it('selects the min-boundary month by keyboard after year selection', async () => {
    const fixture = TestBed.configureTestingModule({
      imports: [UncontrolledDatepickerHostComponent],
    }).createComponent(UncontrolledDatepickerHostComponent);
    fixture.componentInstance.defaultOpen.set(true);
    fixture.componentInstance.defaultValue.set('2026-03-31');
    fixture.componentInstance.minDate.set('2025-04-01');
    fixture.componentInstance.maxDate.set('2026-03-31');

    await settle(fixture);

    getRequiredFromRoot<HTMLButtonElement>(
      document.body,
      '[data-slot="datepicker-period-button"]',
    ).click();
    await settle(fixture);

    const yearGrid = getRequiredFromRoot<HTMLElement>(
      document.body,
      '[data-slot="datepicker-grid"]',
    );
    keydown(yearGrid, 'ArrowLeft');
    await settle(fixture);
    keydown(yearGrid, 'Enter');
    await settle(fixture);
    await waitForAnimationFrame();
    await settle(fixture);

    const monthGrid = getRequiredFromRoot<HTMLElement>(
      document.body,
      '[data-slot="datepicker-grid"]',
    );
    expect(getPickerButton('datepicker-month', 'Apr').getAttribute('data-active')).toBe('true');

    keydown(monthGrid, 'Enter');
    await settle(fixture);
    await waitForAnimationFrame();
    await settle(fixture);

    expect(
      getRequiredFromRoot<HTMLButtonElement>(
        document.body,
        '[data-slot="datepicker-period-button"]',
      ).textContent?.includes(
        defaultDatepickerDateAdapter.format(new Date(2025, 3, 1), 'month-year', 'en-US'),
      ),
    ).toBe(true);

    const aprilFirst = Array.from(
      document.body.querySelectorAll('[data-slot="datepicker-cell"]'),
    ).find((element) => (element as HTMLElement).textContent?.trim() === '1') as
      | HTMLButtonElement
      | undefined;

    expect(aprilFirst).not.toBeUndefined();
    expect(aprilFirst?.disabled).toBe(false);

    aprilFirst?.click();
    await settle(fixture);

    expect(getRequired<HTMLInputElement>(fixture, '[data-slot="datepicker-input"]').value).toBe(
      '04-01-2025',
    );
  });

  it('uses Angular LOCALE_ID for month labels when no locale input is provided', async () => {
    const fixture = TestBed.configureTestingModule({
      imports: [UncontrolledDatepickerHostComponent],
      providers: [{ provide: LOCALE_ID, useValue: 'fr-FR' }],
    }).createComponent(UncontrolledDatepickerHostComponent);
    fixture.componentInstance.defaultOpen.set(true);

    await settle(fixture);

    const expectedHeader = defaultDatepickerDateAdapter.format(
      new Date(2024, 3, 22),
      'month-year',
      'fr-FR',
    );
    expect(
      getRequiredFromRoot<HTMLButtonElement>(
        document.body,
        '[data-slot="datepicker-period-button"]',
      ).textContent?.includes(expectedHeader),
    ).toBe(true);

    getRequiredFromRoot<HTMLButtonElement>(
      document.body,
      '[data-slot="datepicker-period-button"]',
    ).click();
    await settle(fixture);

    const yearButton = Array.from(
      document.body.querySelectorAll('[data-slot="datepicker-year"]'),
    ).find((element) => (element as HTMLElement).textContent?.trim() === '2024') as
      | HTMLButtonElement
      | undefined;
    yearButton?.click();
    await settle(fixture);

    const expectedApril = defaultDatepickerDateAdapter.format(
      new Date(2024, 3, 1),
      'month-short',
      'fr-FR',
    );
    expect(
      Array.from(document.body.querySelectorAll('[data-slot="datepicker-month"]')).some(
        (element) => (element as HTMLElement).textContent?.trim() === expectedApril,
      ),
    ).toBe(true);
  });

  it('flips the overlay above the trigger when auto placement has more space above', async () => {
    const fixture = TestBed.configureTestingModule({
      imports: [UncontrolledDatepickerHostComponent],
    }).createComponent(UncontrolledDatepickerHostComponent);
    fixture.componentInstance.defaultOpen.set(true);

    await settle(fixture);

    const anchor = getRequired<HTMLElement>(fixture, '[data-slot="datepicker-input-shell"]');
    const overlay = getRequiredFromRoot<HTMLElement>(
      document.body,
      '[data-slot="datepicker-overlay"]',
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

  it('closes the overlay when scrolling moves the anchor outside the viewport by default', async () => {
    const fixture = TestBed.configureTestingModule({
      imports: [UncontrolledDatepickerHostComponent],
    }).createComponent(UncontrolledDatepickerHostComponent);

    await settle(fixture);

    getRequired<HTMLButtonElement>(fixture, '[data-slot="datepicker-trigger"]').click();
    await settle(fixture);

    const anchor = getRequired<HTMLElement>(fixture, '[data-slot="datepicker-input-shell"]');
    const overlay = getRequiredFromRoot<HTMLElement>(
      document.body,
      '[data-slot="datepicker-overlay"]',
    );
    const originalInnerHeight = window.innerHeight;
    vi.spyOn(anchor, 'getBoundingClientRect').mockReturnValue(createRect(-80, -20));
    vi.spyOn(overlay, 'getBoundingClientRect').mockReturnValue(createRect(0, 320));
    Object.defineProperty(window, 'innerHeight', { configurable: true, value: 760 });

    expect(document.body.style.overflow).toBe('');
    expect(document.documentElement.style.position).toBe('');

    window.dispatchEvent(new Event('scroll'));
    await settle(fixture);

    expect(fixture.componentInstance.openChanges).toEqual([true, false]);
    expect(overlay.getAttribute('hidden')).toBe('');
    expect(document.body.style.overflow).toBe('');
    expect(document.documentElement.style.position).toBe('');

    Object.defineProperty(window, 'innerHeight', {
      configurable: true,
      value: originalInnerHeight,
    });
  });

  it('preserves the document scrollbar and locks scrollable ancestors when block is explicit', async () => {
    const fixture = TestBed.configureTestingModule({
      imports: [ScrollableDatepickerHostComponent],
    }).createComponent(ScrollableDatepickerHostComponent);

    await settle(fixture);

    const scrollParent = getRequired<HTMLElement>(fixture, '[data-testid="scroll-parent"]');
    expect(scrollParent.style.overflow).toBe('auto');

    await openOverlay(fixture);

    expect(fixture.componentInstance.openChanges).toEqual([true]);
    expect(document.body.style.overflow).toBe('');
    expect(document.documentElement.style.position).toBe('fixed');
    expect(document.documentElement.style.overflowY).toBe('scroll');
    expect(scrollParent.style.overflow).toBe('hidden');

    getRequired<HTMLButtonElement>(fixture, '[data-slot="datepicker-trigger"]').click();
    await settle(fixture);

    expect(document.body.style.overflow).toBe('');
    expect(document.documentElement.style.position).toBe('');
    expect(document.documentElement.style.overflowY).toBe('');
    expect(scrollParent.style.overflow).toBe('auto');
  });

  it('opens the overlay from the input with Enter and lets Tab move focus to the next focusable element', async () => {
    const fixture = TestBed.configureTestingModule({
      imports: [DatepickerTabFocusHostComponent],
    }).createComponent(DatepickerTabFocusHostComponent);

    await settle(fixture);

    const input = getRequired<HTMLInputElement>(fixture, '[data-slot="datepicker-input"]');
    const trigger = getRequired<HTMLButtonElement>(fixture, '[data-slot="datepicker-trigger"]');
    const afterButton = getRequired<HTMLButtonElement>(fixture, '[data-testid="after-button"]');

    focus(input);
    keydown(input, 'Enter');
    await settle(fixture);
    await waitForAnimationFrame();
    await settle(fixture);

    expect(fixture.componentInstance.openChanges).toEqual([true]);
    expect(
      getRequiredFromRoot<HTMLElement>(
        document.body,
        '[data-slot="datepicker-overlay"]',
      ).getAttribute('hidden'),
    ).toBeNull();
    expect(document.activeElement).toBe(input);
    expect(trigger.getAttribute('tabindex')).toBe('-1');

    const tabEvent = dispatchTabAndSimulateBrowserFocus(input, afterButton);
    await settle(fixture);

    expect(tabEvent.defaultPrevented).toBe(false);
    expect(document.activeElement).toBe(afterButton);
    expect(document.activeElement).not.toBe(trigger);
  });

  it('tabs from a preceding text input to the datepicker input and then to submit', async () => {
    const fixture = TestBed.configureTestingModule({
      imports: [DatepickerFormTabOrderHostComponent],
    }).createComponent(DatepickerFormTabOrderHostComponent);

    await settle(fixture);

    const textInput = getRequired<HTMLInputElement>(fixture, '[data-testid="text-input"]');
    const datepickerInput = getRequired<HTMLInputElement>(
      fixture,
      '[data-slot="datepicker-input"]',
    );
    const trigger = getRequired<HTMLButtonElement>(fixture, '[data-slot="datepicker-trigger"]');
    const submitButton = getRequired<HTMLButtonElement>(fixture, '[data-testid="submit-button"]');
    const overlay = getRequired<HTMLElement>(fixture, '[data-slot="datepicker-overlay"]');

    focus(textInput);
    expect(document.activeElement).toBe(textInput);

    const firstTabEvent = dispatchTabAndSimulateBrowserFocus(textInput, datepickerInput);
    await settle(fixture);

    expect(firstTabEvent.defaultPrevented).toBe(false);
    expect(document.activeElement).toBe(datepickerInput);
    expect(document.activeElement).not.toBe(trigger);

    const secondTabEvent = dispatchTabAndSimulateBrowserFocus(datepickerInput, submitButton);
    await settle(fixture);

    expect(secondTabEvent.defaultPrevented).toBe(false);
    expect(document.activeElement).toBe(submitButton);
    expect(document.activeElement).not.toBe(trigger);
    expect(trigger.getAttribute('tabindex')).toBe('-1');
    expect(overlay.getAttribute('hidden')).toBe('');
    expect(fixture.componentInstance.openChanges).toEqual([]);
  });

  it('opens from the input with Enter, navigates the day grid with arrow keys, and selects a date with Enter', async () => {
    const fixture = TestBed.configureTestingModule({
      imports: [UncontrolledDatepickerHostComponent],
    }).createComponent(UncontrolledDatepickerHostComponent);

    await settle(fixture);

    const input = getRequired<HTMLInputElement>(fixture, '[data-slot="datepicker-input"]');
    expect(input.value).toBe('04-22-2024');

    focus(input);
    keydown(input, 'Enter');
    await settle(fixture);
    await waitForAnimationFrame();
    await settle(fixture);

    expect(fixture.componentInstance.openChanges).toEqual([true]);
    expect(getActiveDayCell().textContent?.trim()).toBe('22');

    keydown(input, 'ArrowRight');
    await settle(fixture);
    await waitForAnimationFrame();
    await settle(fixture);
    keydown(input, 'ArrowRight');
    await settle(fixture);
    await waitForAnimationFrame();
    await settle(fixture);

    expect(getActiveDayCell().textContent?.trim()).toBe('24');
    expect(document.activeElement).toBe(getActiveDayCell());

    keydown(document.activeElement as HTMLElement, 'Enter');
    await settle(fixture);

    const lastValue = fixture.componentInstance.valueChanges.at(-1);
    expect(lastValue).toBeInstanceOf(Date);
    expect((lastValue as Date).getFullYear()).toBe(2024);
    expect((lastValue as Date).getMonth()).toBe(3);
    expect((lastValue as Date).getDate()).toBe(24);
    expect(input.value).toBe('04-24-2024');
    expect(getSelectedDayCell().textContent?.trim()).toBe('24');
  });
});
