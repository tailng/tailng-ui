import { Component, computed, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { afterEach, describe, expect, it } from 'vitest';
import { TngAutocompleteComponent } from './tng-autocomplete.component';

function keydown(el: HTMLElement, init: Partial<KeyboardEventInit> & { key: string }): void {
  el.dispatchEvent(
    new KeyboardEvent('keydown', { bubbles: true, cancelable: true, ...init })
  );
}

function pointerdown(el: HTMLElement): void {
  el.dispatchEvent(
    new PointerEvent('pointerdown', { bubbles: true, cancelable: true, button: 0 })
  );
}

function inputText(el: HTMLInputElement, value: string): void {
  el.value = value;
  el.dispatchEvent(new Event('input', { bubbles: true, cancelable: true }));
}

function getOpenOverlay(): HTMLElement {
  const overlays = Array.from(document.body.querySelectorAll('[data-slot="autocomplete-overlay"]'));
  const openOverlay = overlays.find((overlay) => overlay.getAttribute('hidden') === null) as
    | HTMLElement
    | undefined;
  if (openOverlay === undefined) {
    throw new Error('Expected an open autocomplete overlay.');
  }
  return openOverlay;
}

type Option = { value: string; label: string };

@Component({
  imports: [TngAutocompleteComponent],
  template: `
    <tng-autocomplete
      [options]="filteredOptions()"
      [value]="value()"
      (valueChange)="value.set($event)"
      [query]="query()"
      (queryChange)="query.set($event)"
      [getOptionValue]="getOptionValue"
      [getOptionLabel]="getOptionLabel"
      placeholder="Type to search"
      data-testid="autocomplete"
    />
  `,
})
class HostComponent {
  public readonly options: Option[] = [
    { value: 'a', label: 'Option A' },
    { value: 'b', label: 'Option B' },
    { value: 'c', label: 'Option C' },
  ];
  public readonly value = signal<string | null>(null);
  public readonly query = signal('');
  public readonly filteredOptions = computed(() => {
    const query = this.query().toLowerCase().trim();

    if (!query) {
      return this.options;
    }

    return this.options.filter((option) =>
      option.label.toLowerCase().includes(query),
    );
  });
  public readonly getOptionValue = (o: Option) => o.value;
  public readonly getOptionLabel = (o: Option) => o.label;
}

@Component({
  imports: [TngAutocompleteComponent],
  template: `
    <tng-autocomplete
      [options]="options()"
      [query]="query()"
      (queryChange)="onQueryChange($event)"
      [getOptionValue]="getOptionValue"
      [getOptionLabel]="getOptionLabel"
      data-testid="autocomplete"
    />
  `,
})
class QueryHostComponent {
  public readonly options = signal<Option[]>([
    { value: 'a', label: 'Option A' },
    { value: 'b', label: 'Option B' },
    { value: 'c', label: 'Option C' },
  ]);
  public readonly query = signal('');
  public readonly queryChangeCalls: string[] = [];
  public readonly getOptionValue = (o: Option) => o.value;
  public readonly getOptionLabel = (o: Option) => o.label;

  public onQueryChange(query: string): void {
    this.queryChangeCalls.push(query);
    this.query.set(query);
  }
}

@Component({
  imports: [TngAutocompleteComponent],
  template: `
    <tng-autocomplete
      [options]="filteredOptions()"
      [open]="open()"
      (openChange)="open.set($event)"
      [value]="value()"
      (valueChange)="value.set($event)"
      [query]="query()"
      (queryChange)="query.set($event)"
      [getOptionValue]="getOptionValue"
      [getOptionLabel]="getOptionLabel"
      placeholder="Type to search"
      data-testid="autocomplete"
    />
  `,
})
class ProgrammaticOpenQueryHostComponent {
  public readonly options: Option[] = [
    { value: 'us', label: 'United States' },
    { value: 'uk', label: 'United Kingdom' },
    { value: 'in', label: 'India' },
  ];
  public readonly open = signal(false);
  public readonly value = signal<string | null>(null);
  public readonly query = signal('');
  public readonly filteredOptions = computed(() => {
    const query = this.query().toLowerCase().trim();
    if (!query) {
      return this.options;
    }
    return this.options.filter((option) => option.label.toLowerCase().includes(query));
  });
  public readonly getOptionValue = (o: Option) => o.value;
  public readonly getOptionLabel = (o: Option) => o.label;
}

async function openAutocomplete(
  fixture: { detectChanges: () => void },
  trigger: HTMLElement
): Promise<void> {
  trigger.focus();
  fixture.detectChanges();
  await Promise.resolve();
  fixture.detectChanges();
}

describe('tng-autocomplete component', () => {
  afterEach(() => {
    TestBed.resetTestingModule();
  });

  it('exports the autocomplete component', () => {
    expect(typeof TngAutocompleteComponent).toBe('function');
  });

  it('keeps placeholder as hint-only text when no option is selected', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [HostComponent],
    }).createComponent(HostComponent);

    fixture.detectChanges();

    const trigger = fixture.nativeElement.querySelector(
      '[data-slot="autocomplete-trigger"]'
    ) as HTMLInputElement;

    expect(trigger.placeholder).toBe('Type to search');
    expect(trigger.value).toBe('');
  });

  it('typing after Escape does not prefix placeholder text into the input value', async () => {
    const fixture = TestBed.configureTestingModule({
      imports: [HostComponent],
    }).createComponent(HostComponent);

    fixture.detectChanges();

    const trigger = fixture.nativeElement.querySelector(
      '[data-slot="autocomplete-trigger"]'
    ) as HTMLInputElement;

    await openAutocomplete(fixture, trigger);
    keydown(trigger, { key: 'Escape' });
    fixture.detectChanges();
    await Promise.resolve();
    fixture.detectChanges();

    keydown(trigger, { key: 'o' });
    inputText(trigger, 'o');
    fixture.detectChanges();
    await Promise.resolve();
    fixture.detectChanges();

    expect(trigger.value).toBe('o');
    expect(trigger.value.startsWith('Type to search')).toBe(false);
  });

  it('Space when open does NOT select - inserts into input for typing - e.g. "United St"', async () => {
    const fixture = TestBed.configureTestingModule({
      imports: [HostComponent],
    }).createComponent(HostComponent);

    fixture.detectChanges();

    const host = fixture.componentInstance;
    const trigger = fixture.nativeElement.querySelector(
      '[data-slot="autocomplete-trigger"]'
    ) as HTMLInputElement;

    expect(trigger).toBeTruthy();

    await openAutocomplete(fixture, trigger);

    keydown(trigger, { key: ' ' });
    fixture.detectChanges();

    // Space should NOT select; value stays null
    expect(host.value()).toBe(null);
  });

  it('Enter selection updates input to show selected label (not placeholder)', async () => {
    const fixture = TestBed.configureTestingModule({
      imports: [HostComponent],
    }).createComponent(HostComponent);

    fixture.detectChanges();

    const host = fixture.componentInstance;
    const trigger = fixture.nativeElement.querySelector(
      '[data-slot="autocomplete-trigger"]'
    ) as HTMLInputElement;

    await openAutocomplete(fixture, trigger);

    keydown(trigger, { key: 'Enter' });
    fixture.detectChanges();

    expect(host.value()).toBe('a');
    expect(trigger.value).toBe('Option A');
  });

  it('typing filters options and shows empty state when no option matches', async () => {
    const fixture = TestBed.configureTestingModule({
      imports: [HostComponent],
    }).createComponent(HostComponent);

    fixture.detectChanges();

    const trigger = fixture.nativeElement.querySelector(
      '[data-slot="autocomplete-trigger"]'
    ) as HTMLInputElement;

    await openAutocomplete(fixture, trigger);

    const allOptions = () =>
      Array.from(getOpenOverlay().querySelectorAll('[data-slot="autocomplete-option"]'));
    const emptyState = () => getOpenOverlay().querySelector('[data-slot="autocomplete-empty"]');

    expect(allOptions().map((el) => el.textContent?.trim())).toEqual(['Option A', 'Option B', 'Option C']);

    inputText(trigger, 'Option B');
    fixture.detectChanges();
    await Promise.resolve();
    fixture.detectChanges();

    expect(allOptions().map((el) => el.textContent?.trim())).toEqual(['Option B']);
    expect(emptyState()).toBeNull();

    inputText(trigger, 'zzz');
    fixture.detectChanges();
    await Promise.resolve();
    fixture.detectChanges();

    expect(allOptions().length).toBe(0);
    expect(emptyState()).toBeTruthy();
    expect(emptyState()?.textContent).toContain('No matches');
  });

  it('exposes queryChange from the component wrapper when typing', async () => {
    const fixture = TestBed.configureTestingModule({
      imports: [QueryHostComponent],
    }).createComponent(QueryHostComponent);

    fixture.detectChanges();

    const host = fixture.componentInstance;
    const trigger = fixture.nativeElement.querySelector(
      '[data-slot="autocomplete-trigger"]'
    ) as HTMLInputElement;

    await openAutocomplete(fixture, trigger);

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
      '[data-slot="autocomplete-trigger"]'
    ) as HTMLInputElement;

    await openAutocomplete(fixture, trigger);

    inputText(trigger, 'remote');
    host.options.set([{ value: 'b', label: 'Option B' }]);
    fixture.detectChanges();
    await Promise.resolve();
    fixture.detectChanges();

    const options = Array.from(
      getOpenOverlay().querySelectorAll('[data-slot="autocomplete-option"]'),
    );

    expect(host.query()).toBe('remote');
    expect(options.map((el) => el.textContent?.trim())).toEqual(['Option B']);
  });

  it('keeps programmatic query when opened via controlled open state', async () => {
    const fixture = TestBed.configureTestingModule({
      imports: [ProgrammaticOpenQueryHostComponent],
    }).createComponent(ProgrammaticOpenQueryHostComponent);

    fixture.detectChanges();

    const host = fixture.componentInstance;
    const trigger = fixture.nativeElement.querySelector(
      '[data-slot="autocomplete-trigger"]'
    ) as HTMLInputElement;

    host.query.set('un');
    host.open.set(true);
    fixture.detectChanges();
    await Promise.resolve();
    fixture.detectChanges();

    const options = Array.from(
      getOpenOverlay().querySelectorAll('[data-slot="autocomplete-option"]'),
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
      '[data-slot="autocomplete-trigger"]'
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

  it('pointer-selecting an option selects it, closes overlay, and updates trigger text', async () => {
    const fixture = TestBed.configureTestingModule({
      imports: [HostComponent],
    }).createComponent(HostComponent);

    fixture.detectChanges();

    const host = fixture.componentInstance;
    const trigger = fixture.nativeElement.querySelector(
      '[data-slot="autocomplete-trigger"]'
    ) as HTMLInputElement;

    await openAutocomplete(fixture, trigger);

    const optionB = getOpenOverlay().querySelectorAll('[data-slot="autocomplete-option"]')[1] as HTMLElement;
    expect(optionB?.textContent?.trim()).toBe('Option B');

    pointerdown(optionB);
    fixture.detectChanges();
    await Promise.resolve();
    fixture.detectChanges();

    expect(host.value()).toBe('b');
    expect(trigger.value).toBe('Option B');
    expect(trigger.getAttribute('aria-expanded')).toBe('false');
  });

  it('keeps a programmatic value when the current filter hides that option', async () => {
    const fixture = TestBed.configureTestingModule({
      imports: [HostComponent],
    }).createComponent(HostComponent);

    fixture.detectChanges();

    const host = fixture.componentInstance;
    const trigger = fixture.nativeElement.querySelector(
      '[data-slot="autocomplete-trigger"]'
    ) as HTMLInputElement;

    await openAutocomplete(fixture, trigger);

    inputText(trigger, 'Option A');
    fixture.detectChanges();
    await Promise.resolve();
    fixture.detectChanges();

    expect(
      Array.from(getOpenOverlay().querySelectorAll('[data-slot="autocomplete-option"]')).map((el) =>
        el.textContent?.trim(),
      ),
    ).toEqual(['Option A']);

    host.value.set('b');
    fixture.detectChanges();
    await Promise.resolve();
    fixture.detectChanges();

    expect(host.value()).toBe('b');
    expect(trigger.value).toBe('Option B');
  });

});
