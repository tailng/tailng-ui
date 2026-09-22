import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { afterEach, describe, expect, it } from 'vitest';

import {
  TngCommandPaletteComponent,
  type TngCommandPaletteOptionSelect,
} from '../tng-command-palette.component';

type DeviceId = 'router' | 'switch' | 'sensor';

type DeviceOption = Readonly<{
  description?: string;
  disabled?: boolean;
  id: DeviceId;
  label: string;
}>;

const DEVICE_OPTIONS: readonly DeviceOption[] = Object.freeze([
  {
    id: 'router',
    label: 'Router',
    description: 'Core network device',
  },
  {
    id: 'switch',
    label: 'Switch',
    description: 'Access layer device',
  },
  {
    id: 'sensor',
    label: 'Sensor',
    description: 'Disabled telemetry endpoint',
    disabled: true,
  },
]);

@Component({
  imports: [TngCommandPaletteComponent],
  template: `
    <tng-command-palette
      [open]="open()"
      [query]="query()"
      [options]="options()"
      [loading]="loading()"
      [closeOnSelect]="closeOnSelect()"
      [showClearButton]="showClearButton()"
      placeholder="Search devices..."
      [getOptionValue]="getOptionValue"
      [getOptionLabel]="getOptionLabel"
      [getOptionDescription]="getOptionDescription"
      [isOptionDisabled]="isOptionDisabled"
      [trackBy]="trackBy"
      (openChange)="onOpenChange($event)"
      (queryChange)="onQueryChange($event)"
      (optionSelect)="onOptionSelect($event)"
    />
  `,
})
class CommandPaletteHost {
  public readonly open = signal(true);
  public readonly query = signal('');
  public readonly options = signal<readonly DeviceOption[]>(DEVICE_OPTIONS);
  public readonly loading = signal(false);
  public readonly closeOnSelect = signal(true);
  public readonly showClearButton = signal(true);

  public readonly openChanges: boolean[] = [];
  public readonly queryChanges: string[] = [];
  public readonly selections: TngCommandPaletteOptionSelect<DeviceOption, DeviceId>[] = [];
  public readonly trackByCalls: (readonly [number, DeviceOption])[] = [];

  public readonly getOptionValue = (option: DeviceOption): DeviceId => option.id;
  public readonly getOptionLabel = (option: DeviceOption): string => option.label;
  public readonly getOptionDescription = (option: DeviceOption): string | null | undefined =>
    option.description;
  public readonly isOptionDisabled = (option: DeviceOption): boolean => option.disabled === true;
  public readonly trackBy = (index: number, option: DeviceOption): DeviceId => {
    this.trackByCalls.push([index, option] as const);
    return option.id;
  };

  public onOpenChange(open: boolean): void {
    this.openChanges.push(open);
    this.open.set(open);
  }

  public onQueryChange(query: string): void {
    this.queryChanges.push(query);
    this.query.set(query);
  }

  public onOptionSelect(selection: TngCommandPaletteOptionSelect<DeviceOption, DeviceId>): void {
    this.selections.push(selection);
  }
}

@Component({
  imports: [TngCommandPaletteComponent],
  template: `
    <tng-command-palette
      [open]="true"
      [query]="'dev'"
      [options]="options()"
      [loading]="loading()"
      [getOptionValue]="getOptionValue"
      [getOptionLabel]="getOptionLabel"
      [getOptionDescription]="getOptionDescription"
    >
      <ng-template #tngCommandPaletteInputPrefixTpl>
        <span class="custom-prefix">Prefix</span>
      </ng-template>

      <ng-template #tngCommandPaletteInputSuffixTpl>
        <span class="custom-suffix">Suffix</span>
      </ng-template>

      <ng-template #tngCommandPaletteOptionTpl let-item>
        <span class="custom-option">{{ item.label }}</span>
      </ng-template>

      <ng-template #tngCommandPaletteEmptyTpl>
        <span class="custom-empty">Empty slot</span>
      </ng-template>

      <ng-template #tngCommandPaletteLoadingTpl>
        <span class="custom-loading">Loading slot</span>
      </ng-template>

      <ng-template #tngCommandPaletteFooterTpl>
        <span class="custom-footer">Footer slot</span>
      </ng-template>
    </tng-command-palette>
  `,
})
class TemplateCommandPaletteHost {
  public readonly options = signal<readonly DeviceOption[]>(DEVICE_OPTIONS);
  public readonly loading = signal(false);
  public readonly getOptionValue = (option: DeviceOption): DeviceId => option.id;
  public readonly getOptionLabel = (option: DeviceOption): string => option.label;
  public readonly getOptionDescription = (option: DeviceOption): string | null | undefined =>
    option.description;
}

@Component({
  imports: [TngCommandPaletteComponent],
  template: `
    <button type="button" data-testid="trigger" (click)="open.set(true)">Open palette</button>
    <button type="button" data-testid="workspace-action">Workspace action</button>

    <tng-command-palette
      [open]="open()"
      [options]="options()"
      [getOptionValue]="getOptionValue"
      [getOptionLabel]="getOptionLabel"
      [getOptionDescription]="getOptionDescription"
      (openChange)="open.set($event)"
    />

    <input data-testid="workspace-input" />
  `,
})
class TriggeredCommandPaletteHost {
  public readonly open = signal(false);
  public readonly options = signal<readonly DeviceOption[]>(DEVICE_OPTIONS);

  public readonly getOptionValue = (option: DeviceOption): DeviceId => option.id;
  public readonly getOptionLabel = (option: DeviceOption): string => option.label;
  public readonly getOptionDescription = (option: DeviceOption): string | null | undefined =>
    option.description;
}

function getByTestId<T extends Element>(fixture: { nativeElement: HTMLElement }, testId: string): T {
  const element = fixture.nativeElement.querySelector(`[data-testid="${testId}"]`);
  if (element === null) {
    throw new Error(`Expected element [data-testid="${testId}"] to exist.`);
  }

  return element as T;
}

function getPanel(fixture: { nativeElement: HTMLElement }): HTMLElement | null {
  return fixture.nativeElement.querySelector('.tng-command-palette-panel');
}

function requirePanel(fixture: { nativeElement: HTMLElement }): HTMLElement {
  const panel = getPanel(fixture);
  if (panel === null) {
    throw new Error('Expected command palette panel.');
  }
  return panel;
}

function getInput(fixture: { nativeElement: HTMLElement }): HTMLInputElement {
  const input = fixture.nativeElement.querySelector('.tng-command-palette-input');
  if (!(input instanceof HTMLInputElement)) {
    throw new Error('Expected command palette input.');
  }
  return input;
}

function getOptions(fixture: { nativeElement: HTMLElement }): HTMLButtonElement[] {
  return Array.from(
    fixture.nativeElement.querySelectorAll<HTMLButtonElement>('.tng-command-palette-option'),
  );
}

function getClearButton(fixture: { nativeElement: HTMLElement }): HTMLButtonElement {
  const button = fixture.nativeElement.querySelector<HTMLButtonElement>('.tng-command-palette-clear');
  if (button === null) {
    throw new Error('Expected clear button.');
  }

  return button;
}

function getBackdrop(fixture: { nativeElement: HTMLElement }): HTMLElement {
  const backdrop = fixture.nativeElement.querySelector<HTMLElement>(
    '.tng-command-palette-backdrop',
  );
  if (backdrop === null) {
    throw new Error('Expected backdrop.');
  }

  return backdrop;
}

function inputText(input: HTMLInputElement, value: string): void {
  input.value = value;
  input.dispatchEvent(new Event('input', { bubbles: true, cancelable: true }));
}

function keydown(
  element: EventTarget,
  key: string,
  init: Partial<KeyboardEventInit> = {},
): KeyboardEvent {
  const event = new KeyboardEvent('keydown', {
    bubbles: true,
    cancelable: true,
    key,
    shiftKey: init.shiftKey ?? false,
  });
  element.dispatchEvent(event);
  return event;
}

function pointerSelect(option: HTMLElement): void {
  option.dispatchEvent(
    new PointerEvent('pointerdown', {
      bubbles: true,
      button: 0,
      cancelable: true,
    }),
  );
}

async function settle(fixture: { detectChanges(): void; whenStable(): Promise<unknown> }): Promise<void> {
  fixture.detectChanges();
  await fixture.whenStable();
  fixture.detectChanges();
}

describe('tng-command-palette component', () => {
  afterEach(() => {
    TestBed.resetTestingModule();
  });

  it('exports the command palette component', () => {
    expect(typeof TngCommandPaletteComponent).toBe('function');
  });

  it('does not render panel content when closed', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [CommandPaletteHost],
    }).createComponent(CommandPaletteHost);

    fixture.componentInstance.open.set(false);
    fixture.detectChanges();

    expect(getPanel(fixture)).toBeNull();
  });

  it('renders default input, options, descriptions, clear suffix, and footer when open', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [CommandPaletteHost],
    }).createComponent(CommandPaletteHost);

    fixture.componentInstance.query.set('dev');
    fixture.detectChanges();

    expect(requirePanel(fixture)).toBeTruthy();
    expect(getInput(fixture).placeholder).toBe('Search devices...');
    expect(fixture.nativeElement.querySelector('.tng-command-palette-search-icon svg')).toBeTruthy();
    expect(fixture.nativeElement.querySelector('.tng-command-palette-clear')).toBeTruthy();
    expect(fixture.nativeElement.textContent).toContain('Router');
    expect(fixture.nativeElement.textContent).toContain('Core network device');
    expect(fixture.nativeElement.textContent).toContain('↑ ↓ Navigate · Enter Select · Esc Close');
  });

  it('does not render default clear suffix when query is empty', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [CommandPaletteHost],
    }).createComponent(CommandPaletteHost);

    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('.tng-command-palette-clear')).toBeNull();
  });

  it('renders empty and loading defaults, with loading taking precedence', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [CommandPaletteHost],
    }).createComponent(CommandPaletteHost);

    fixture.componentInstance.options.set([]);
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('No results found');

    fixture.componentInstance.loading.set(true);
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('Loading...');
    expect(fixture.nativeElement.textContent).not.toContain('No results found');
  });

  it('renders custom templates for prefix, suffix, options, empty, loading, and footer', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [TemplateCommandPaletteHost],
    }).createComponent(TemplateCommandPaletteHost);

    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.custom-prefix')?.textContent).toContain('Prefix');
    expect(fixture.nativeElement.querySelector('.custom-suffix')?.textContent).toContain('Suffix');
    expect(fixture.nativeElement.querySelector('.custom-option')?.textContent).toContain('Router');
    expect(fixture.nativeElement.querySelector('.custom-footer')?.textContent).toContain('Footer slot');

    fixture.componentInstance.loading.set(true);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.custom-loading')?.textContent).toContain('Loading slot');

    fixture.componentInstance.loading.set(false);
    fixture.componentInstance.options.set([]);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.custom-empty')?.textContent).toContain('Empty slot');
  });

  it('initializes and updates the input value from query', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [CommandPaletteHost],
    }).createComponent(CommandPaletteHost);

    fixture.componentInstance.query.set('router');
    fixture.detectChanges();
    expect(getInput(fixture).value).toBe('router');

    fixture.componentInstance.query.set('switch');
    fixture.detectChanges();
    expect(getInput(fixture).value).toBe('switch');
  });

  it('emits queryChange while typing and when clearing', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [CommandPaletteHost],
    }).createComponent(CommandPaletteHost);

    fixture.componentInstance.query.set('router');
    fixture.detectChanges();

    inputText(getInput(fixture), 'switch');
    fixture.detectChanges();
    expect(fixture.componentInstance.queryChanges).toContain('switch');

    getClearButton(fixture).click();
    fixture.detectChanges();
    expect(fixture.componentInstance.queryChanges).toContain('');
  });

  it('renders updated options and uses trackBy', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [CommandPaletteHost],
    }).createComponent(CommandPaletteHost);

    fixture.detectChanges();
    expect(getOptions(fixture).length).toBe(3);

    fixture.componentInstance.options.set([DEVICE_OPTIONS[1]]);
    fixture.detectChanges();
    expect(getOptions(fixture).length).toBe(1);
    expect(getOptions(fixture)[0]?.textContent).toContain('Switch');
    expect(fixture.componentInstance.trackByCalls.length).toBeGreaterThan(0);
  });

  it('marks disabled options and does not select them by pointer', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [CommandPaletteHost],
    }).createComponent(CommandPaletteHost);

    fixture.detectChanges();
    const options = getOptions(fixture);
    expect(options[2]?.hasAttribute('disabled')).toBe(true);

    const disabledOption = options[2];
    if (disabledOption === undefined) {
      throw new Error('Expected disabled option.');
    }
    pointerSelect(disabledOption);
    fixture.detectChanges();
    expect(fixture.componentInstance.selections.length).toBe(0);
  });

  it('emits optionSelect from pointer selection and closes by default', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [CommandPaletteHost],
    }).createComponent(CommandPaletteHost);

    fixture.detectChanges();
    const firstOption = getOptions(fixture)[0];
    if (firstOption === undefined) {
      throw new Error('Expected first option.');
    }
    pointerSelect(firstOption);
    fixture.detectChanges();

    expect(fixture.componentInstance.selections[0]).toEqual({
      option: DEVICE_OPTIONS[0],
      value: 'router',
      label: 'Router',
    });
    expect(fixture.componentInstance.openChanges).toContain(false);
    expect(getPanel(fixture)).toBeNull();
  });

  it('keeps open after selection when closeOnSelect is false', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [CommandPaletteHost],
    }).createComponent(CommandPaletteHost);

    fixture.componentInstance.closeOnSelect.set(false);
    fixture.detectChanges();
    const firstOption = getOptions(fixture)[0];
    if (firstOption === undefined) {
      throw new Error('Expected first option.');
    }
    pointerSelect(firstOption);
    fixture.detectChanges();

    expect(fixture.componentInstance.selections.length).toBe(1);
    expect(getPanel(fixture)).toBeTruthy();
  });

  it('moves active option from input arrow keys and selects active option with Enter', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [CommandPaletteHost],
    }).createComponent(CommandPaletteHost);

    fixture.detectChanges();
    const input = getInput(fixture);

    keydown(input, 'ArrowDown');
    fixture.detectChanges();
    expect(document.activeElement).toBe(input);
    expect(getOptions(fixture)[0]?.hasAttribute('data-active')).toBe(true);

    keydown(input, 'ArrowDown');
    fixture.detectChanges();
    expect(getOptions(fixture)[1]?.hasAttribute('data-active')).toBe(true);

    keydown(input, 'Enter');
    fixture.detectChanges();
    expect(fixture.componentInstance.selections[0]?.value).toBe('switch');
  });

  it('skips disabled options during keyboard navigation', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [CommandPaletteHost],
    }).createComponent(CommandPaletteHost);

    fixture.detectChanges();
    const input = getInput(fixture);

    keydown(input, 'ArrowDown');
    keydown(input, 'ArrowDown');
    keydown(input, 'ArrowDown');
    fixture.detectChanges();

    const options = getOptions(fixture);
    expect(options[2]?.hasAttribute('data-active')).toBe(false);
    expect(options.filter((option) => option.hasAttribute('data-active')).length).toBe(1);
  });

  it('does not emit selection when Enter has no active option', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [CommandPaletteHost],
    }).createComponent(CommandPaletteHost);

    fixture.detectChanges();
    keydown(getInput(fixture), 'Enter');
    fixture.detectChanges();

    expect(fixture.componentInstance.selections.length).toBe(0);
  });

  it('closes on Escape without query or selection side effects', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [CommandPaletteHost],
    }).createComponent(CommandPaletteHost);

    fixture.detectChanges();
    keydown(getInput(fixture), 'Escape');
    fixture.detectChanges();

    expect(fixture.componentInstance.openChanges).toContain(false);
    expect(fixture.componentInstance.queryChanges.length).toBe(0);
    expect(fixture.componentInstance.selections.length).toBe(0);
  });

  it('closes on backdrop pointerdown', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [CommandPaletteHost],
    }).createComponent(CommandPaletteHost);

    fixture.detectChanges();
    getBackdrop(fixture).dispatchEvent(
      new PointerEvent('pointerdown', {
        bubbles: true,
        button: 0,
        cancelable: true,
      }),
    );
    fixture.detectChanges();

    expect(fixture.componentInstance.openChanges).toContain(false);
    expect(getPanel(fixture)).toBeNull();
  });

  it('isolates nested workspace content, redirects Tab, and restores focus on close', async () => {
    const fixture = TestBed.configureTestingModule({
      imports: [TriggeredCommandPaletteHost],
    }).createComponent(TriggeredCommandPaletteHost);

    await settle(fixture);

    const trigger = getByTestId<HTMLButtonElement>(fixture, 'trigger');
    trigger.focus();
    trigger.click();
    await settle(fixture);

    const workspaceAction = getByTestId<HTMLButtonElement>(fixture, 'workspace-action');
    const workspaceInput = getByTestId<HTMLInputElement>(fixture, 'workspace-input');
    expect(workspaceAction.getAttribute('aria-hidden')).toBe('true');
    expect(workspaceAction.getAttribute('inert')).toBe('');
    expect(workspaceInput.getAttribute('aria-hidden')).toBe('true');
    expect(workspaceInput.getAttribute('inert')).toBe('');

    workspaceInput.focus();
    const tabEvent = keydown(document, 'Tab');
    await settle(fixture);
    expect(tabEvent.defaultPrevented).toBe(true);
    expect(document.activeElement).toBe(getInput(fixture));

    keydown(getInput(fixture), 'Escape');
    await settle(fixture);

    expect(getPanel(fixture)).toBeNull();
    expect(document.activeElement).toBe(trigger);
    expect(workspaceAction.getAttribute('aria-hidden')).toBeNull();
    expect(workspaceAction.getAttribute('inert')).toBeNull();
    expect(workspaceInput.getAttribute('aria-hidden')).toBeNull();
    expect(workspaceInput.getAttribute('inert')).toBeNull();
  });
});
