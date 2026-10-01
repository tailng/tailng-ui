import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { TngSelectComponent } from '../../../form/select/tng-select.component';
import { TngButtonComponent } from '../../../utility/button/tng-button.component';
import { TngPopoverTriggerFor } from '../tng-popover-trigger-for.directive';
import { TngPopoverComponent, type TngPopoverCloseReason } from '../tng-popover.component';

function getByTestId<T extends Element>(testId: string): T {
  const element = document.querySelector<T>(`[data-testid="${testId}"]`);
  if (element === null) {
    throw new Error(`Expected element [data-testid="${testId}"] to exist.`);
  }
  return element;
}

function findPanel(): HTMLElement {
  const panel = document.querySelector<HTMLElement>('.tng-popover-panel');
  if (panel === null) {
    throw new Error('Expected popover panel to exist.');
  }
  return panel;
}

function findPopoverHost(): HTMLElement {
  const host = document.querySelector<HTMLElement>('tng-popover');
  if (host === null) {
    throw new Error('Expected tng-popover host to exist.');
  }
  return host;
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

async function settle(fixture: {
  detectChanges(): void;
  whenStable(): Promise<unknown>;
}): Promise<void> {
  fixture.detectChanges();
  await fixture.whenStable();
  fixture.detectChanges();
}

async function nextAnimationFrame(): Promise<void> {
  await new Promise<void>((resolve) => window.requestAnimationFrame(() => resolve()));
}

function createRect(left: number, top: number, width: number, height: number): DOMRect {
  return {
    bottom: top + height,
    height,
    left,
    right: left + width,
    toJSON: () => ({}),
    top,
    width,
    x: left,
    y: top,
  } as DOMRect;
}

@Component({
  imports: [TngButtonComponent, TngPopoverComponent, TngPopoverTriggerFor],
  template: `
    <tng-button
      [tngPopoverTriggerFor]="popover"
      ariaLabel="Filters"
      appearance="outline"
      data-testid="trigger-host"
    >
      <span data-testid="trigger-icon">filter</span>
      <span data-testid="trigger-badge">2</span>
    </tng-button>

    <tng-popover
      #popover="tngPopoverComponent"
      [defaultOpen]="defaultOpen()"
      [disabled]="disabled()"
      [closeOnEscape]="closeOnEscape()"
      [closeOnFocusOutside]="closeOnFocusOutside()"
      [closeOnOutsidePointer]="closeOnOutsidePointer()"
      [side]="side()"
      [align]="align()"
      panelAriaLabel="Filter settings"
      (openChange)="openChanges.push($event)"
      (closed)="closeReasons.push($event)"
    >
      <form data-testid="form">
        <label>
          Query
          <input data-testid="inside-input" />
        </label>
      </form>
    </tng-popover>

    <button type="button" data-testid="outside">Outside</button>
  `,
})
class PopoverHostComponent {
  public defaultOpen = signal(false);
  public disabled = signal(false);
  public closeOnEscape = signal(true);
  public closeOnFocusOutside = signal(false);
  public closeOnOutsidePointer = signal(true);
  public side = signal<'bottom' | 'left' | 'right' | 'top'>('bottom');
  public align = signal<'center' | 'end' | 'start'>('start');
  public openChanges: boolean[] = [];
  public closeReasons: TngPopoverCloseReason[] = [];
}

@Component({
  selector: 'app-projected-content',
  template: `<p data-testid="projected-content">Arbitrary component content</p>`,
})
class ProjectedContentComponent {}

@Component({
  imports: [ProjectedContentComponent, TngPopoverComponent, TngPopoverTriggerFor],
  template: `
    <button type="button" [tngPopoverTriggerFor]="popover" data-testid="native-trigger">
      Open details
    </button>
    <tng-popover #popover="tngPopoverComponent" panelRole="region">
      <app-projected-content />
    </tng-popover>
  `,
})
class NativeTriggerHostComponent {}

@Component({
  imports: [TngPopoverComponent, TngPopoverTriggerFor],
  template: `
    <form data-testid="layout-form" style="display: grid; gap: 1rem">
      <tng-popover #popover="tngPopoverComponent" [autoFocus]="autoFocus()">
        <label>
          Disabled field
          <input data-testid="disabled-form-input" disabled />
        </label>
        <label>
          First available field
          <input data-testid="first-form-input" />
        </label>
        <button type="button" data-testid="form-action">Save</button>
      </tng-popover>

      <button type="button" [tngPopoverTriggerFor]="popover" data-testid="form-trigger">
        Open form
      </button>
    </form>
  `,
})
class FormPopoverHostComponent {
  public readonly autoFocus = signal(true);
}

@Component({
  imports: [TngPopoverComponent, TngPopoverTriggerFor],
  template: `
    <button type="button" [tngPopoverTriggerFor]="popover" data-testid="controlled-trigger">
      Open
    </button>
    <tng-popover
      #popover="tngPopoverComponent"
      [open]="open()"
      (openChange)="openChanges.push($event)"
      (closed)="closeReasons.push($event)"
    >
      <button type="button" data-testid="controlled-inside">Inside</button>
    </tng-popover>
  `,
})
class ControlledPopoverHostComponent {
  public open = signal(true);
  public openChanges: boolean[] = [];
  public closeReasons: TngPopoverCloseReason[] = [];
}

@Component({
  imports: [TngPopoverComponent, TngPopoverTriggerFor, TngSelectComponent],
  template: `
    <button type="button" [tngPopoverTriggerFor]="popover" data-testid="select-popover-trigger">
      Choose owner
    </button>
    <tng-popover
      #popover="tngPopoverComponent"
      [autoFocus]="'none'"
      [closeOnFocusOutside]="true"
    >
      <tng-select data-testid="nested-select" [options]="options" [placeholder]="'Choose owner'" />
    </tng-popover>
  `,
})
class NestedSelectPopoverHostComponent {
  public readonly options = [
    { label: 'Alpha', value: 'alpha' },
    { label: 'Beta', value: 'beta' },
  ];
}

describe('tng-popover detached component behavior', () => {
  afterEach(() => {
    vi.restoreAllMocks();
    TestBed.resetTestingModule();
    document
      .querySelectorAll('[data-slot="select-overlay"]')
      .forEach((element) => element.remove());
  });

  it('exports the detached popover component and trigger directive', () => {
    expect(typeof TngPopoverComponent).toBe('function');
    expect(typeof TngPopoverTriggerFor).toBe('function');
  });

  it('projects arbitrary form content and custom trigger content without nested buttons', async () => {
    const fixture = TestBed.configureTestingModule({
      imports: [PopoverHostComponent],
    }).createComponent(PopoverHostComponent);

    await settle(fixture);

    const triggerHost = getByTestId<HTMLElement>('trigger-host');
    const trigger = triggerHost.querySelector('button');
    expect(trigger).not.toBeNull();
    expect(triggerHost.querySelectorAll('button')).toHaveLength(1);
    expect(getByTestId('trigger-icon')).not.toBeNull();
    expect(getByTestId('trigger-badge')).not.toBeNull();
    expect(getByTestId('form')).not.toBeNull();
    expect(findPanel().contains(getByTestId('form'))).toBe(true);
  });

  it('links ARIA state to the actual native button inside tng-button', async () => {
    const fixture = TestBed.configureTestingModule({
      imports: [PopoverHostComponent],
    }).createComponent(PopoverHostComponent);

    await settle(fixture);

    const trigger = getByTestId<HTMLElement>('trigger-host').querySelector('button')!;
    const panel = findPanel();
    expect(trigger.getAttribute('aria-label')).toBe('Filters');
    expect(trigger.getAttribute('aria-haspopup')).toBe('dialog');
    expect(trigger.getAttribute('aria-controls')).toBe(panel.id);
    expect(trigger.getAttribute('aria-expanded')).toBe('false');
    expect(panel.getAttribute('aria-label')).toBe('Filter settings');
  });

  it('opens and closes from a detached tng-button trigger', async () => {
    const fixture = TestBed.configureTestingModule({
      imports: [PopoverHostComponent],
    }).createComponent(PopoverHostComponent);
    await settle(fixture);

    const trigger = getByTestId<HTMLElement>('trigger-host').querySelector('button')!;
    trigger.click();
    await settle(fixture);

    expect(findPanel().getAttribute('hidden')).toBeNull();
    expect(trigger.getAttribute('aria-expanded')).toBe('true');
    expect(fixture.componentInstance.openChanges).toEqual([true]);
    expect(findPopoverHost().parentElement).toBe(document.body);

    trigger.click();
    await settle(fixture);

    expect(findPanel().getAttribute('hidden')).toBe('');
    expect(trigger.getAttribute('aria-expanded')).toBe('false');
    expect(fixture.componentInstance.openChanges).toEqual([true, false]);
    expect(fixture.componentInstance.closeReasons).toEqual(['trigger-toggle']);
  });

  it('supports a detached native button and arbitrary component content', async () => {
    const fixture = TestBed.configureTestingModule({
      imports: [NativeTriggerHostComponent, ProjectedContentComponent],
    }).createComponent(NativeTriggerHostComponent);
    await settle(fixture);

    getByTestId<HTMLButtonElement>('native-trigger').click();
    await settle(fixture);

    expect(findPanel().getAttribute('hidden')).toBeNull();
    expect(findPanel().contains(getByTestId('projected-content'))).toBe(true);
  });

  it('keeps the popover host out of the form layout before, during, and after opening', async () => {
    const fixture = TestBed.configureTestingModule({
      imports: [FormPopoverHostComponent],
    }).createComponent(FormPopoverHostComponent);
    await settle(fixture);

    const trigger = getByTestId<HTMLButtonElement>('form-trigger');
    const host = findPopoverHost();
    expect(window.getComputedStyle(host).position).toBe('fixed');

    trigger.click();
    await settle(fixture);
    expect(window.getComputedStyle(host).position).toBe('fixed');

    trigger.click();
    await settle(fixture);
    expect(window.getComputedStyle(host).position).toBe('fixed');
  });

  it('focuses the first enabled form control without scrolling when autofocus is enabled', async () => {
    const fixture = TestBed.configureTestingModule({
      imports: [FormPopoverHostComponent],
    }).createComponent(FormPopoverHostComponent);
    await settle(fixture);

    const firstInput = getByTestId<HTMLInputElement>('first-form-input');
    const focus = vi.spyOn(firstInput, 'focus');
    getByTestId<HTMLButtonElement>('form-trigger').click();
    await settle(fixture);

    expect(document.activeElement).toBe(firstInput);
    expect(focus).toHaveBeenCalledWith({ preventScroll: true });
  });

  it('leaves focus on the trigger when autofocus is disabled', async () => {
    const fixture = TestBed.configureTestingModule({
      imports: [FormPopoverHostComponent],
    }).createComponent(FormPopoverHostComponent);
    fixture.componentInstance.autoFocus.set(false);
    await settle(fixture);

    const trigger = getByTestId<HTMLButtonElement>('form-trigger');
    const firstInput = getByTestId<HTMLInputElement>('first-form-input');
    const focus = vi.spyOn(firstInput, 'focus');
    trigger.focus();
    trigger.click();
    await settle(fixture);

    expect(document.activeElement).toBe(trigger);
    expect(focus).not.toHaveBeenCalled();
  });

  it('closes on Escape, emits the reason, updates ARIA, and restores focus', async () => {
    const fixture = TestBed.configureTestingModule({
      imports: [PopoverHostComponent],
    }).createComponent(PopoverHostComponent);
    await settle(fixture);

    const trigger = getByTestId<HTMLElement>('trigger-host').querySelector('button')!;
    trigger.focus();
    trigger.click();
    await settle(fixture);

    const insideInput = getByTestId<HTMLInputElement>('inside-input');
    insideInput.focus();
    expect(document.activeElement).toBe(insideInput);
    expect(trigger.getAttribute('aria-expanded')).toBe('true');

    const event = keydown(document, 'Escape');
    await settle(fixture);

    expect(event.defaultPrevented).toBe(true);
    expect(findPanel().getAttribute('hidden')).toBe('');
    expect(trigger.getAttribute('aria-expanded')).toBe('false');
    expect(fixture.componentInstance.openChanges).toEqual([true, false]);
    expect(fixture.componentInstance.closeReasons).toEqual(['escape']);
    expect(document.activeElement).toBe(trigger);
  });

  it('does not close or prevent Escape when closeOnEscape is false', async () => {
    const fixture = TestBed.configureTestingModule({
      imports: [PopoverHostComponent],
    }).createComponent(PopoverHostComponent);
    fixture.componentInstance.closeOnEscape.set(false);
    await settle(fixture);

    const trigger = getByTestId<HTMLElement>('trigger-host').querySelector('button')!;
    trigger.click();
    await settle(fixture);

    const event = keydown(document, 'Escape');
    await settle(fixture);

    expect(event.defaultPrevented).toBe(false);
    expect(findPanel().getAttribute('hidden')).toBeNull();
    expect(fixture.componentInstance.closeReasons).toEqual([]);
  });

  it('keeps focus-outside dismissal disabled by default and supports explicit opt-in', async () => {
    const fixture = TestBed.configureTestingModule({
      imports: [PopoverHostComponent],
    }).createComponent(PopoverHostComponent);
    fixture.componentInstance.defaultOpen.set(true);
    await settle(fixture);

    const outside = getByTestId<HTMLButtonElement>('outside');
    outside.focus();
    await settle(fixture);

    expect(fixture.componentInstance.closeReasons).toEqual([]);
    expect(findPanel().getAttribute('hidden')).toBeNull();

    fixture.componentInstance.closeOnFocusOutside.set(true);
    await settle(fixture);
    getByTestId<HTMLInputElement>('inside-input').focus();
    outside.focus();
    await settle(fixture);

    expect(fixture.componentInstance.closeReasons).toEqual(['focus-outside']);
    expect(findPanel().getAttribute('hidden')).toBe('');
  });

  it('emits an Escape close request without mutating controlled state', async () => {
    const fixture = TestBed.configureTestingModule({
      imports: [ControlledPopoverHostComponent],
    }).createComponent(ControlledPopoverHostComponent);
    await settle(fixture);

    const event = keydown(document, 'Escape');
    await settle(fixture);

    expect(event.defaultPrevented).toBe(true);
    expect(fixture.componentInstance.openChanges).toEqual([false]);
    expect(fixture.componentInstance.closeReasons).toEqual(['escape']);
    expect(fixture.componentInstance.open()).toBe(true);
    expect(findPanel().getAttribute('hidden')).toBeNull();
  });

  it('treats the detached trigger as inside and closes only for an outside pointer', async () => {
    const fixture = TestBed.configureTestingModule({
      imports: [PopoverHostComponent],
    }).createComponent(PopoverHostComponent);
    await settle(fixture);

    const trigger = getByTestId<HTMLElement>('trigger-host').querySelector('button')!;
    trigger.click();
    await settle(fixture);

    pointerdown(trigger);
    await settle(fixture);
    expect(findPanel().getAttribute('hidden')).toBeNull();

    pointerdown(getByTestId('outside'));
    await settle(fixture);
    expect(findPanel().getAttribute('hidden')).toBe('');
    expect(fixture.componentInstance.closeReasons).toEqual(['outside-pointer']);
  });

  it('prevents activation and disables the real tng-button when disabled', async () => {
    const fixture = TestBed.configureTestingModule({
      imports: [PopoverHostComponent],
    }).createComponent(PopoverHostComponent);
    fixture.componentInstance.disabled.set(true);
    await settle(fixture);

    const trigger = getByTestId<HTMLElement>('trigger-host').querySelector('button')!;
    expect(trigger.disabled).toBe(true);
    trigger.click();
    await settle(fixture);

    expect(findPanel().getAttribute('hidden')).toBe('');
    expect(fixture.componentInstance.openChanges).toEqual([]);
  });

  it('keeps the popover open when an owned portalled select option is chosen', async () => {
    const fixture = TestBed.configureTestingModule({
      imports: [NestedSelectPopoverHostComponent],
    }).createComponent(NestedSelectPopoverHostComponent);
    await settle(fixture);

    getByTestId<HTMLButtonElement>('select-popover-trigger').click();
    await settle(fixture);
    pointerdown(getByTestId<HTMLElement>('nested-select').querySelector('button')!);
    await settle(fixture);
    const option = document.querySelector<HTMLElement>('[data-slot="select-option"]');
    expect(option).not.toBeNull();
    pointerdown(option!);
    await settle(fixture);

    expect(findPanel().getAttribute('hidden')).toBeNull();
  });

  it('keeps the parent popover positioned while it and its nested select are exiting', async () => {
    const fixture = TestBed.configureTestingModule({
      imports: [NestedSelectPopoverHostComponent],
    }).createComponent(NestedSelectPopoverHostComponent);
    await settle(fixture);

    const popoverTrigger = getByTestId<HTMLButtonElement>('select-popover-trigger');
    const popover = findPopoverHost();
    const panel = findPanel();
    vi.spyOn(popoverTrigger, 'getBoundingClientRect').mockReturnValue(
      createRect(320, 240, 140, 36),
    );
    vi.spyOn(panel, 'getBoundingClientRect').mockReturnValue(createRect(0, 0, 260, 140));
    panel.style.animationName = 'test-popover-exit';
    panel.style.animationDuration = '10s';
    panel.style.animationDelay = '0s';

    popoverTrigger.click();
    await settle(fixture);
    await nextAnimationFrame();
    fixture.detectChanges();

    const selectTrigger = getByTestId<HTMLElement>('nested-select').querySelector('button')!;
    pointerdown(selectTrigger);
    await settle(fixture);
    const selectOverlay = document.querySelector<HTMLElement>('[data-slot="select-overlay"]')!;
    expect(selectOverlay).not.toBeNull();
    selectOverlay.style.animationName = 'test-select-exit';
    selectOverlay.style.animationDuration = '10s';
    selectOverlay.style.animationDelay = '0s';

    const left = popover.style.left;
    const top = popover.style.top;
    const selectLeft = selectOverlay.style.left;
    const selectTop = selectOverlay.style.top;
    pointerdown(popoverTrigger);
    popoverTrigger.click();
    fixture.detectChanges();

    expect(selectOverlay.getAttribute('data-presence')).toBe('exiting');
    expect(selectOverlay.parentElement).toBe(document.body);
    expect(selectOverlay.style.left).toBe(selectLeft);
    expect(selectOverlay.style.top).toBe(selectTop);
    expect(panel.getAttribute('data-presence')).toBe('exiting');
    expect(panel.hasAttribute('hidden')).toBe(false);
    expect(popover.parentElement).toBe(document.body);
    expect(popover.style.left).toBe(left);
    expect(popover.style.top).toBe(top);
    expect(popover.style.left).not.toBe('0px');
    expect(popover.style.top).not.toBe('0px');

    panel.dispatchEvent(new Event('animationend', { bubbles: true }));
    await Promise.resolve();
    fixture.detectChanges();

    expect(panel.getAttribute('data-presence')).toBe('closed');
    expect(panel.hasAttribute('hidden')).toBe(true);
    expect(fixture.nativeElement.contains(popover)).toBe(true);
  });

  it('flips and shifts at the viewport edge', async () => {
    const fixture = TestBed.configureTestingModule({
      imports: [PopoverHostComponent],
    }).createComponent(PopoverHostComponent);
    await settle(fixture);

    const trigger = getByTestId<HTMLElement>('trigger-host').querySelector('button')!;
    const panel = findPanel();
    vi.spyOn(trigger, 'getBoundingClientRect').mockReturnValue(createRect(980, 730, 40, 30));
    vi.spyOn(panel, 'getBoundingClientRect').mockReturnValue(createRect(0, 0, 200, 100));

    trigger.click();
    await settle(fixture);
    await nextAnimationFrame();
    fixture.detectChanges();

    const host = findPopoverHost();
    expect(host.getAttribute('data-side')).toBe('top');
    expect(host.style.left).toBe('816px');
    expect(host.style.top).toBe('622px');
  });

  it.each([
    ['bottom', 'start', 400, 348],
    ['bottom', 'center', 350, 348],
    ['bottom', 'end', 300, 348],
    ['top', 'start', 400, 192],
    ['top', 'center', 350, 192],
    ['top', 'end', 300, 192],
    ['right', 'start', 508, 300],
    ['right', 'center', 508, 270],
    ['right', 'end', 508, 240],
    ['left', 'start', 192, 300],
    ['left', 'center', 192, 270],
    ['left', 'end', 192, 240],
  ] as const)('positions side=%s align=%s', async (side, align, x, y) => {
    const fixture = TestBed.configureTestingModule({
      imports: [PopoverHostComponent],
    }).createComponent(PopoverHostComponent);
    fixture.componentInstance.side.set(side);
    fixture.componentInstance.align.set(align);
    await settle(fixture);

    const trigger = getByTestId<HTMLElement>('trigger-host').querySelector('button')!;
    const panel = findPanel();
    vi.spyOn(trigger, 'getBoundingClientRect').mockReturnValue(createRect(400, 300, 100, 40));
    vi.spyOn(panel, 'getBoundingClientRect').mockReturnValue(createRect(0, 0, 200, 100));

    trigger.click();
    await settle(fixture);
    await nextAnimationFrame();
    fixture.detectChanges();

    const host = findPopoverHost();
    expect(host.style.position).toBe('fixed');
    expect(host.style.left).toBe(`${x}px`);
    expect(host.style.top).toBe(`${y}px`);
    expect(host.getAttribute('data-side')).toBe(side);
    expect(host.getAttribute('data-align')).toBe(align);
  });
});
