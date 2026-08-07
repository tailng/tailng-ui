import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { TngMenuItem } from '@tailng-ui/primitives';
import { afterEach, describe, expect, it } from 'vitest';
import { TngMultiSelectComponent } from '../../../form/multiselect/tng-multiselect.component';
import { TngSelectComponent } from '../../../form/select/tng-select.component';
import { TngMenuTriggerFor } from '../../../navigation/menu/tng-menu-trigger-for.directive';
import { TngMenuComponent } from '../../../navigation/menu/tng-menu.component';

import { TngPopoverComponent, type TngPopoverCloseReason } from '../tng-popover.component';

type OverlayOption = Readonly<{
  label: string;
  value: string;
}>;

function getByTestId<T extends Element>(
  fixture: { nativeElement: HTMLElement },
  testId: string,
): T {
  const element = fixture.nativeElement.querySelector<T>(`[data-testid="${testId}"]`);
  if (element === null) {
    throw new Error(`Expected element [data-testid="${testId}"] to exist.`);
  }

  return element;
}

function findTrigger(fixture: { nativeElement: HTMLElement }): HTMLButtonElement | null {
  return fixture.nativeElement.querySelector<HTMLButtonElement>('.tng-popover-trigger');
}

function findPanel(fixture: { nativeElement: HTMLElement }): HTMLElement | null {
  return fixture.nativeElement.querySelector('.tng-popover-panel');
}

function keydown(target: EventTarget, key: string): KeyboardEvent {
  const event = new KeyboardEvent('keydown', { bubbles: true, cancelable: true, key });
  target.dispatchEvent(event);
  return event;
}

function pointerdown(target: EventTarget): PointerEvent {
  const event = new PointerEvent('pointerdown', {
    bubbles: true,
    button: 0,
    cancelable: true,
  });
  target.dispatchEvent(event);
  return event;
}

function getFromDocument<T extends Element>(selector: string): T {
  const element = document.querySelector<T>(selector);
  if (element === null) {
    throw new Error(`Expected document element ${selector} to exist.`);
  }

  return element;
}

async function settle(fixture: {
  detectChanges(): void;
  whenStable(): Promise<unknown>;
}): Promise<void> {
  fixture.detectChanges();
  await fixture.whenStable();
  fixture.detectChanges();
}

@Component({
  imports: [TngPopoverComponent],
  template: `
    <tng-popover
      [defaultOpen]="defaultOpen()"
      [disabled]="disabled()"
      [closeOnEscape]="closeOnEscape()"
      [closeOnOutsidePointer]="closeOnOutsidePointer()"
      [ariaLabel]="ariaLabel()"
      [ariaHasPopup]="ariaHasPopup()"
      (openChange)="openChanges.push($event)"
      (closed)="closeReasons.push($event)"
    >
      <button type="button" data-testid="inside-first" data-tng-popover-initial-focus>First</button>
      <button type="button" data-testid="inside-last">Last</button>
    </tng-popover>

    <button type="button" data-testid="outside">Outside</button>
  `,
})
class UncontrolledPopoverHostComponent {
  public defaultOpen = signal(false);
  public disabled = signal(false);
  public closeOnEscape = signal(true);
  public closeOnOutsidePointer = signal(true);
  public ariaLabel = signal('Actions');
  public ariaHasPopup = signal<'dialog' | 'menu' | 'listbox'>('dialog');
  public openChanges: boolean[] = [];
  public closeReasons: TngPopoverCloseReason[] = [];
}

@Component({
  imports: [TngPopoverComponent],
  template: `
    <tng-popover
      [open]="open()"
      [closeOnEscape]="true"
      [closeOnOutsidePointer]="true"
      (openChange)="openChanges.push($event)"
      (closed)="closeReasons.push($event)"
    >
      <button type="button">Inside</button>
    </tng-popover>
  `,
})
class ControlledPopoverHostComponent {
  public open = signal(true);
  public openChanges: boolean[] = [];
  public closeReasons: TngPopoverCloseReason[] = [];
}

@Component({
  imports: [TngPopoverComponent, TngSelectComponent],
  template: `
    <tng-popover
      [defaultOpen]="true"
      [autoFocus]="'none'"
      [restoreFocus]="false"
      (closed)="closeReasons.push($event)"
    >
      <tng-select data-testid="select" [options]="options" [placeholder]="'Pick one'" />
    </tng-popover>

    <button type="button" data-testid="outside">Outside</button>
  `,
})
class PopoverWithSelectHostComponent {
  public options: readonly OverlayOption[] = [
    { label: 'Alpha', value: 'alpha' },
    { label: 'Beta', value: 'beta' },
  ];
  public closeReasons: TngPopoverCloseReason[] = [];
}

@Component({
  imports: [TngPopoverComponent, TngMultiSelectComponent],
  template: `
    <tng-popover
      [defaultOpen]="true"
      [autoFocus]="'none'"
      [restoreFocus]="false"
      (closed)="closeReasons.push($event)"
    >
      <tng-multiselect data-testid="multiselect" [options]="options" [placeholder]="'Pick many'" />
    </tng-popover>
  `,
})
class PopoverWithMultiSelectHostComponent {
  public options: readonly OverlayOption[] = [
    { label: 'Alpha', value: 'alpha' },
    { label: 'Beta', value: 'beta' },
  ];
  public closeReasons: TngPopoverCloseReason[] = [];
}

@Component({
  imports: [TngPopoverComponent, TngMenuComponent, TngMenuTriggerFor, TngMenuItem],
  template: `
    <tng-popover
      [defaultOpen]="true"
      [autoFocus]="'none'"
      [restoreFocus]="false"
      (closed)="closeReasons.push($event)"
    >
      <button type="button" [tngMenuTriggerFor]="menu" data-testid="menu-trigger">Menu</button>
      <tng-menu #menu="tngMenu" data-testid="menu">
        <button type="button" tngMenuItem data-testid="menu-item">Archive</button>
      </tng-menu>
    </tng-popover>
  `,
})
class PopoverWithMenuHostComponent {
  public closeReasons: TngPopoverCloseReason[] = [];
}

describe('tng-popover component behavior', () => {
  afterEach(() => {
    TestBed.resetTestingModule();
    document
      .querySelectorAll('[data-slot="select-overlay"]')
      .forEach((element) => element.remove());
  });

  it('exports the popover component', () => {
    expect(typeof TngPopoverComponent).toBe('function');
  });

  it('renders closed by default with aria/data attributes on trigger and panel', async () => {
    const fixture = TestBed.configureTestingModule({
      imports: [UncontrolledPopoverHostComponent],
    }).createComponent(UncontrolledPopoverHostComponent);

    await settle(fixture);

    const trigger = findTrigger(fixture);
    const panel = findPanel(fixture);

    expect(trigger).not.toBeNull();
    expect(panel).not.toBeNull();
    expect(trigger?.getAttribute('aria-expanded')).toBe('false');
    expect(trigger?.getAttribute('aria-haspopup')).toBe('dialog');
    expect(panel?.id).not.toBe('');
    expect(trigger?.getAttribute('aria-controls')).toBe(panel?.id ?? null);
    expect(panel?.getAttribute('hidden')).toBe('');
    expect(panel?.getAttribute('data-slot')).toBe('popover-panel');
  });

  it('supports defaultOpen in uncontrolled mode', async () => {
    const fixture = TestBed.configureTestingModule({
      imports: [UncontrolledPopoverHostComponent],
    }).createComponent(UncontrolledPopoverHostComponent);
    fixture.componentInstance.defaultOpen.set(true);

    await settle(fixture);

    const trigger = findTrigger(fixture);
    const panel = findPanel(fixture);
    expect(trigger?.getAttribute('aria-expanded')).toBe('true');
    expect(panel?.getAttribute('hidden')).toBeNull();
    expect(panel?.getAttribute('role')).toBe('dialog');
    expect(panel?.getAttribute('aria-label')).toBe('Actions');
  });

  it('trigger toggles uncontrolled open state and emits close reason', async () => {
    const fixture = TestBed.configureTestingModule({
      imports: [UncontrolledPopoverHostComponent],
    }).createComponent(UncontrolledPopoverHostComponent);

    await settle(fixture);

    const trigger = findTrigger(fixture);
    expect(trigger).not.toBeNull();
    trigger?.click();
    await settle(fixture);

    expect(fixture.componentInstance.openChanges).toEqual([true]);
    expect(findPanel(fixture)?.getAttribute('hidden')).toBeNull();

    trigger?.click();
    await settle(fixture);

    expect(fixture.componentInstance.openChanges).toEqual([true, false]);
    expect(fixture.componentInstance.closeReasons).toEqual(['trigger-toggle']);
    expect(findPanel(fixture)?.getAttribute('hidden')).toBe('');
  });

  it('Escape closes when enabled and restores focus to trigger', async () => {
    const fixture = TestBed.configureTestingModule({
      imports: [UncontrolledPopoverHostComponent],
    }).createComponent(UncontrolledPopoverHostComponent);

    await settle(fixture);

    const trigger = findTrigger(fixture);
    expect(trigger).not.toBeNull();
    trigger?.focus();
    trigger?.click();
    await settle(fixture);

    const event = keydown(document, 'Escape');
    await settle(fixture);

    expect(event.defaultPrevented).toBe(true);
    expect(fixture.componentInstance.closeReasons).toEqual(['escape']);
    expect(document.activeElement).toBe(trigger);
  });

  it('outside pointer closes when enabled and does not close when disabled', async () => {
    const fixture = TestBed.configureTestingModule({
      imports: [UncontrolledPopoverHostComponent],
    }).createComponent(UncontrolledPopoverHostComponent);
    fixture.componentInstance.defaultOpen.set(true);

    await settle(fixture);

    pointerdown(getByTestId<HTMLButtonElement>(fixture, 'outside'));
    await settle(fixture);

    expect(fixture.componentInstance.closeReasons).toEqual(['outside-pointer']);

    fixture.componentInstance.closeOnOutsidePointer.set(false);
    fixture.componentInstance.closeReasons.length = 0;
    findTrigger(fixture)?.click();
    await settle(fixture);

    pointerdown(getByTestId<HTMLButtonElement>(fixture, 'outside'));
    await settle(fixture);

    expect(fixture.componentInstance.closeReasons).toEqual([]);
    expect(findPanel(fixture)?.getAttribute('hidden')).toBeNull();
  });

  it('disabled prevents opening via trigger click', async () => {
    const fixture = TestBed.configureTestingModule({
      imports: [UncontrolledPopoverHostComponent],
    }).createComponent(UncontrolledPopoverHostComponent);
    fixture.componentInstance.disabled.set(true);

    await settle(fixture);

    const trigger = findTrigger(fixture);
    trigger?.click();
    await settle(fixture);

    expect(trigger?.getAttribute('data-disabled')).toBe('');
    expect(findPanel(fixture)?.getAttribute('hidden')).toBe('');
    expect(fixture.componentInstance.openChanges).toEqual([]);
  });

  it('auto-focuses first projected focusable element when opened', async () => {
    const fixture = TestBed.configureTestingModule({
      imports: [UncontrolledPopoverHostComponent],
    }).createComponent(UncontrolledPopoverHostComponent);

    await settle(fixture);

    findTrigger(fixture)?.click();
    await settle(fixture);

    expect(document.activeElement).toBe(getByTestId<HTMLButtonElement>(fixture, 'inside-first'));
  });

  it('controlled mode emits close events without mutating host input', async () => {
    const fixture = TestBed.configureTestingModule({
      imports: [ControlledPopoverHostComponent],
    }).createComponent(ControlledPopoverHostComponent);

    await settle(fixture);

    findTrigger(fixture)?.click();
    await settle(fixture);

    expect(fixture.componentInstance.closeReasons).toEqual(['trigger-toggle']);
    expect(fixture.componentInstance.openChanges).toEqual([false]);
    expect(fixture.componentInstance.open()).toBe(true);
    expect(findPanel(fixture)?.getAttribute('hidden')).toBeNull();
  });

  it('keeps the popover open when a portalled select option is selected', async () => {
    const fixture = TestBed.configureTestingModule({
      imports: [PopoverWithSelectHostComponent],
    }).createComponent(PopoverWithSelectHostComponent);

    await settle(fixture);

    pointerdown(getByTestId<HTMLElement>(fixture, 'select').querySelector('button')!);
    await settle(fixture);

    pointerdown(getFromDocument<HTMLElement>('[data-slot="select-option"]'));
    await settle(fixture);

    expect(fixture.componentInstance.closeReasons).toEqual([]);
    expect(findPanel(fixture)?.getAttribute('hidden')).toBeNull();
  });

  it('keeps the popover open when a portalled multiselect option is toggled', async () => {
    const fixture = TestBed.configureTestingModule({
      imports: [PopoverWithMultiSelectHostComponent],
    }).createComponent(PopoverWithMultiSelectHostComponent);

    await settle(fixture);

    pointerdown(getByTestId<HTMLElement>(fixture, 'multiselect').querySelector('button')!);
    await settle(fixture);

    pointerdown(getFromDocument<HTMLElement>('[data-slot="multi-select-option"]'));
    await settle(fixture);

    expect(fixture.componentInstance.closeReasons).toEqual([]);
    expect(findPanel(fixture)?.getAttribute('hidden')).toBeNull();
    expect(
      getFromDocument<HTMLElement>('[data-slot="select-overlay"]').getAttribute('hidden'),
    ).toBeNull();
  });

  it('keeps the popover open when an inner menu item closes its menu', async () => {
    const fixture = TestBed.configureTestingModule({
      imports: [PopoverWithMenuHostComponent],
    }).createComponent(PopoverWithMenuHostComponent);

    await settle(fixture);

    getByTestId<HTMLButtonElement>(fixture, 'menu-trigger').click();
    await settle(fixture);

    getFromDocument<HTMLButtonElement>('[data-testid="menu-item"]').click();
    await settle(fixture);

    expect(fixture.componentInstance.closeReasons).toEqual([]);
    expect(findPanel(fixture)?.getAttribute('hidden')).toBeNull();
    expect(getFromDocument<HTMLElement>('[data-testid="menu"]').getAttribute('data-state')).toBe(
      'closed',
    );
  });
});
