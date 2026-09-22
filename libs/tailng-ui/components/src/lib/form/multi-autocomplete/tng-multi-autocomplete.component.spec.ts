import '@angular/compiler';
import { Component, computed, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { afterEach, describe, expect, it } from 'vitest';

import { TngMultiAutocompleteComponent } from './tng-multi-autocomplete.component';

type MarketOption = {
  readonly code: string;
  readonly label: string;
};

function click(el: HTMLElement): void {
  el.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));
}

function pointerdown(el: HTMLElement): void {
  el.dispatchEvent(
    new PointerEvent('pointerdown', { bubbles: true, cancelable: true, button: 0 }),
  );
}

function inputText(el: HTMLInputElement, value: string): void {
  el.value = value;
  el.dispatchEvent(new Event('input', { bubbles: true, cancelable: true }));
}

function getOpenOverlay(): HTMLElement | null {
  return (
    Array.from(document.body.querySelectorAll('[data-slot="multi-autocomplete-overlay"]')).find(
      (overlay) => overlay.getAttribute('hidden') === null,
    ) ?? null
  ) as HTMLElement | null;
}

@Component({
  imports: [TngMultiAutocompleteComponent],
  template: `
    <tng-multi-autocomplete
      data-testid="multi"
      [options]="options"
      [value]="value()"
      (valueChange)="value.set($event)"
      [getOptionValue]="getOptionValue"
      [getOptionLabel]="getOptionLabel"
      placeholder="Search launch markets"
      [ariaLabel]="'Launch markets'"
    />
  `,
})
class HostComponent {
  readonly options: readonly MarketOption[] = [
    { code: 'ca', label: 'Canada' },
    { code: 'de', label: 'Germany' },
    { code: 'jp', label: 'Japan' },
  ];
  readonly value = signal<readonly string[]>(['de']);
  readonly getOptionValue = (market: MarketOption) => market.code;
  readonly getOptionLabel = (market: MarketOption) => market.label;
}

@Component({
  imports: [TngMultiAutocompleteComponent],
  template: `
    <tng-multi-autocomplete
      data-testid="multi"
      [options]="options()"
      [query]="query()"
      (queryChange)="onQueryChange($event)"
      [getOptionValue]="getOptionValue"
      [getOptionLabel]="getOptionLabel"
    />
  `,
})
class QueryHostComponent {
  readonly options = signal<readonly MarketOption[]>([
    { code: 'ca', label: 'Canada' },
    { code: 'de', label: 'Germany' },
    { code: 'jp', label: 'Japan' },
  ]);
  readonly query = signal('');
  readonly queryChangeCalls: string[] = [];
  readonly getOptionValue = (market: MarketOption) => market.code;
  readonly getOptionLabel = (market: MarketOption) => market.label;

  onQueryChange(query: string): void {
    this.queryChangeCalls.push(query);
    this.query.set(query);
  }
}

@Component({
  imports: [TngMultiAutocompleteComponent],
  template: `
    <tng-multi-autocomplete
      data-testid="multi"
      [options]="filteredOptions()"
      [open]="open()"
      (openChange)="open.set($event)"
      [value]="value()"
      (valueChange)="value.set($event)"
      [query]="query()"
      (queryChange)="query.set($event)"
      [getOptionValue]="getOptionValue"
      [getOptionLabel]="getOptionLabel"
      placeholder="Search launch markets"
      [ariaLabel]="'Launch markets'"
    />
  `,
})
class ProgrammaticOpenQueryHostComponent {
  readonly options: readonly MarketOption[] = [
    { code: 'us', label: 'United States' },
    { code: 'uk', label: 'United Kingdom' },
    { code: 'in', label: 'India' },
  ];
  readonly open = signal(false);
  readonly value = signal<readonly string[]>([]);
  readonly query = signal('');
  readonly filteredOptions = computed(() => {
    const query = this.query().toLowerCase().trim();
    if (!query) {
      return this.options;
    }
    return this.options.filter((option) => option.label.toLowerCase().includes(query));
  });
  readonly getOptionValue = (market: MarketOption) => market.code;
  readonly getOptionLabel = (market: MarketOption) => market.label;
}

@Component({
  imports: [TngMultiAutocompleteComponent],
  template: `
    <tng-multi-autocomplete
      data-testid="multi"
      [options]="filteredOptions()"
      [value]="value()"
      [query]="query()"
      (queryChange)="query.set($event)"
      [getOptionValue]="getOptionValue"
      [getOptionLabel]="getOptionLabel"
      [resolveValueLabel]="resolveValueLabel"
    />
  `,
})
class ResolveLabelHostComponent {
  readonly options: readonly MarketOption[] = [
    { code: 'ca', label: 'Canada' },
    { code: 'de', label: 'Germany' },
    { code: 'jp', label: 'Japan' },
  ];
  readonly value = signal<readonly string[]>(['de', 'jp']);
  readonly query = signal('');
  readonly getOptionValue = (market: MarketOption) => market.code;
  readonly getOptionLabel = (market: MarketOption) => market.label;
  readonly resolveValueLabel = (value: string) =>
    this.options.find((option) => option.code === value)?.label ?? value;
  readonly filteredOptions = computed(() => {
    const normalizedQuery = this.query().toLowerCase().trim();
    if (!normalizedQuery) {
      return this.options;
    }
    return this.options.filter((option) =>
      option.label.toLowerCase().includes(normalizedQuery),
    );
  });
}

describe('tng-multi-autocomplete component', () => {
  afterEach(() => {
    TestBed.resetTestingModule();
    document.body
      .querySelectorAll('[data-slot="multi-autocomplete-overlay"]')
      .forEach((overlay) => overlay.remove());
  });

  it('exports the multi autocomplete component', () => {
    expect(typeof TngMultiAutocompleteComponent).toBe('function');
  });

  it('clicking the wrapper surface focuses the trigger and opens the overlay', async () => {
    const fixture = TestBed.configureTestingModule({
      imports: [HostComponent],
    }).createComponent(HostComponent);

    fixture.detectChanges();

    const hostEl = fixture.nativeElement.querySelector('[data-testid="multi"]') as HTMLElement;
    const trigger = fixture.nativeElement.querySelector(
      '[data-slot="multi-autocomplete-trigger"]',
    ) as HTMLInputElement;

    click(hostEl);
    fixture.detectChanges();
    await Promise.resolve();
    fixture.detectChanges();

    expect(document.activeElement).toBe(trigger);
    expect(getOpenOverlay()).toBeTruthy();
  });

  it('clicking the remove button still removes the selected chip', async () => {
    const fixture = TestBed.configureTestingModule({
      imports: [HostComponent],
    }).createComponent(HostComponent);

    fixture.detectChanges();

    const host = fixture.componentInstance;
    const removeButton = fixture.nativeElement.querySelector(
      '[data-slot="multi-autocomplete-chip"] button',
    ) as HTMLButtonElement;

    pointerdown(removeButton);
    click(removeButton);
    fixture.detectChanges();
    await Promise.resolve();
    fixture.detectChanges();

    expect(host.value()).toEqual([]);
  });

  it('exposes queryChange from the component wrapper when typing', async () => {
    const fixture = TestBed.configureTestingModule({
      imports: [QueryHostComponent],
    }).createComponent(QueryHostComponent);

    fixture.detectChanges();

    const host = fixture.componentInstance;
    const trigger = fixture.nativeElement.querySelector(
      '[data-slot="multi-autocomplete-trigger"]',
    ) as HTMLInputElement;

    trigger.focus();
    fixture.detectChanges();
    await Promise.resolve();
    fixture.detectChanges();

    inputText(trigger, 'api');
    fixture.detectChanges();
    await Promise.resolve();
    fixture.detectChanges();

    expect(host.query()).toBe('api');
    expect(host.queryChangeCalls).toContain('api');
    expect(trigger.value).toBe('api');
  });

  it('renders server-filtered options as provided by the host', async () => {
    const fixture = TestBed.configureTestingModule({
      imports: [QueryHostComponent],
    }).createComponent(QueryHostComponent);

    fixture.detectChanges();

    const host = fixture.componentInstance;
    const trigger = fixture.nativeElement.querySelector(
      '[data-slot="multi-autocomplete-trigger"]',
    ) as HTMLInputElement;

    trigger.focus();
    fixture.detectChanges();
    await Promise.resolve();
    fixture.detectChanges();

    inputText(trigger, 'remote');
    host.options.set([{ code: 'de', label: 'Germany' }]);
    fixture.detectChanges();
    await Promise.resolve();
    fixture.detectChanges();

    const options = Array.from(
      getOpenOverlay()?.querySelectorAll('[data-slot="multi-autocomplete-option"]') ?? [],
    );

    expect(host.query()).toBe('remote');
    expect(options.map((el) => el.textContent?.trim())).toEqual(['Germany']);
  });

  it('keeps programmatic query when opened via controlled open state', async () => {
    const fixture = TestBed.configureTestingModule({
      imports: [ProgrammaticOpenQueryHostComponent],
    }).createComponent(ProgrammaticOpenQueryHostComponent);

    fixture.detectChanges();

    const host = fixture.componentInstance;
    const trigger = fixture.nativeElement.querySelector(
      '[data-slot="multi-autocomplete-trigger"]',
    ) as HTMLInputElement;

    host.query.set('un');
    host.open.set(true);
    fixture.detectChanges();
    await Promise.resolve();
    fixture.detectChanges();

    const options = Array.from(
      getOpenOverlay()?.querySelectorAll('[data-slot="multi-autocomplete-option"]') ?? [],
    );

    expect(host.open()).toBe(true);
    expect(host.query()).toBe('un');
    expect(trigger.value).toBe('un');
    expect(options.map((el) => el.textContent?.trim())).toEqual([
      'United States',
      'United Kingdom',
    ]);
  });

  it('does not clear programmatic query after additional effect flush while open', async () => {
    const fixture = TestBed.configureTestingModule({
      imports: [ProgrammaticOpenQueryHostComponent],
    }).createComponent(ProgrammaticOpenQueryHostComponent);

    fixture.detectChanges();

    const host = fixture.componentInstance;
    const trigger = fixture.nativeElement.querySelector(
      '[data-slot="multi-autocomplete-trigger"]',
    ) as HTMLInputElement;

    host.query.set('un');
    host.open.set(true);
    fixture.detectChanges();
    await Promise.resolve();
    fixture.detectChanges();
    await Promise.resolve();
    fixture.detectChanges();

    expect(host.open()).toBe(true);
    expect(host.query()).toBe('un');
    expect(trigger.value).toBe('un');
  });

  it('keeps chip labels when selected values are not in filtered options', async () => {
    const fixture = TestBed.configureTestingModule({
      imports: [ResolveLabelHostComponent],
    }).createComponent(ResolveLabelHostComponent);

    fixture.detectChanges();

    const host = fixture.componentInstance;
    const trigger = fixture.nativeElement.querySelector(
      '[data-slot="multi-autocomplete-trigger"]',
    ) as HTMLInputElement;

    inputText(trigger, 'Can');
    host.query.set('Can');
    fixture.detectChanges();
    await Promise.resolve();
    fixture.detectChanges();

    const chipLabels = Array.from(
      fixture.nativeElement.querySelectorAll('[data-slot="multi-autocomplete-chip"] > span'),
    )
    
    const renderedLabels = chipLabels
      .map((element) => element.textContent?.trim())
      .filter((value): value is string => !!value);

    expect(renderedLabels).toEqual(['Germany', 'Japan']);
  });
});
