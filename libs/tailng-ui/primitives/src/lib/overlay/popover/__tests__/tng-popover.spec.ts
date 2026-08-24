import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { afterEach, describe, expect, it } from 'vitest';
import type { TngOverlayScrollStrategy } from '@tailng-ui/cdk';
import {
  TngPopover,
  TngPopoverClose,
  TngPopoverPanel,
  TngPopoverTrigger,
  type TngPopoverAlign,
  type TngPopoverAriaHasPopup,
  type TngPopoverAutoFocus,
  type TngPopoverCloseReason,
  type TngPopoverPanelRole,
  type TngPopoverSide,
} from '../tng-popover';

function getByTestId<T extends Element>(
  fixture: { nativeElement: HTMLElement },
  testId: string,
): T {
  const element = fixture.nativeElement.querySelector(`[data-testid="${testId}"]`) as T | null;
  if (element === null) {
    throw new Error(`Expected element [data-testid="${testId}"] to exist.`);
  }

  return element;
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

@Component({
  imports: [TngPopover, TngPopoverTrigger, TngPopoverPanel, TngPopoverClose],
  template: `
    <button type="button" data-testid="before">Before</button>

    <section
      tngPopover
      #popover="tngPopover"
      data-testid="root"
      [defaultOpen]="defaultOpen()"
      [disabled]="disabled()"
      [closeOnEscape]="closeOnEscape()"
      [closeOnOutsidePointer]="closeOnOutsidePointer()"
      [restoreFocus]="restoreFocus()"
      [autoFocus]="autoFocus()"
      [side]="side()"
      [align]="align()"
      [ariaHasPopup]="ariaHasPopup()"
      [panelRole]="panelRole()"
      [ariaLabel]="ariaLabel()"
      (openChange)="openChanges.push($event)"
      (closed)="closeReasons.push($event)"
    >
      <button type="button" [tngPopoverTrigger]="popover" data-testid="trigger">Toggle</button>

      <section tngPopoverPanel data-testid="panel">
        <button type="button" data-testid="first" data-tng-popover-initial-focus>First</button>
        <button type="button" data-testid="last">Last</button>
        <button type="button" tngPopoverClose data-testid="close">Close</button>
      </section>
    </section>

    <button type="button" data-testid="outside">Outside</button>
  `,
})
class UncontrolledPopoverHarnessComponent {
  readonly defaultOpen = signal(false);
  readonly disabled = signal(false);
  readonly closeOnEscape = signal(true);
  readonly closeOnOutsidePointer = signal(true);
  readonly restoreFocus = signal(true);
  readonly autoFocus = signal<TngPopoverAutoFocus>('first-focusable');
  readonly side = signal<TngPopoverSide>('bottom');
  readonly align = signal<TngPopoverAlign>('start');
  readonly ariaHasPopup = signal<TngPopoverAriaHasPopup>('dialog');
  readonly panelRole = signal<TngPopoverPanelRole>('dialog');
  readonly ariaLabel = signal<string | null>('Quick actions');

  readonly openChanges: boolean[] = [];
  readonly closeReasons: TngPopoverCloseReason[] = [];
}

@Component({
  imports: [TngPopover, TngPopoverTrigger, TngPopoverPanel],
  template: `
    <section
      tngPopover
      #popover="tngPopover"
      data-testid="root"
      [open]="open()"
      (openChange)="openChanges.push($event)"
      (closed)="closeReasons.push($event)"
    >
      <button type="button" [tngPopoverTrigger]="popover" data-testid="trigger">Toggle</button>

      <section tngPopoverPanel data-testid="panel">
        <button type="button">Inside</button>
      </section>
    </section>
  `,
})
class ControlledPopoverHarnessComponent {
  readonly open = signal(true);
  readonly openChanges: boolean[] = [];
  readonly closeReasons: TngPopoverCloseReason[] = [];
}

@Component({
  imports: [TngPopover, TngPopoverTrigger, TngPopoverPanel],
  template: `
    <div data-testid="scroll-parent" style="height: 120px; overflow: auto">
      <section
        tngPopover
        #popover="tngPopover"
        data-testid="root"
        [open]="open()"
        [scrollStrategy]="scrollStrategy()"
        (openChange)="open.set($event)"
        (closed)="closeReasons.push($event)"
      >
        <button type="button" [tngPopoverTrigger]="popover" data-testid="trigger">Toggle</button>

        <section tngPopoverPanel data-testid="panel">
          <button type="button">Inside</button>
        </section>
      </section>
    </div>
  `,
})
class ScrollStrategyPopoverHarnessComponent {
  readonly open = signal(true);
  readonly scrollStrategy = signal<TngOverlayScrollStrategy>('block');
  readonly closeReasons: TngPopoverCloseReason[] = [];
}

@Component({
  imports: [TngPopover, TngPopoverTrigger, TngPopoverPanel],
  template: `
    <section
      tngPopover
      #firstPopover="tngPopover"
      data-testid="first-root"
      [defaultOpen]="true"
      [autoFocus]="'none'"
      [restoreFocus]="false"
      (closed)="firstCloseReasons.push($event)"
    >
      <button type="button" [tngPopoverTrigger]="firstPopover" data-testid="first-trigger">
        First
      </button>
      <section tngPopoverPanel data-testid="first-panel">
        <button type="button">First panel action</button>
      </section>
    </section>

    <section
      tngPopover
      #secondPopover="tngPopover"
      data-testid="second-root"
      [defaultOpen]="true"
      [autoFocus]="'none'"
      [restoreFocus]="false"
      (closed)="secondCloseReasons.push($event)"
    >
      <button type="button" [tngPopoverTrigger]="secondPopover" data-testid="second-trigger">
        Second
      </button>
      <section tngPopoverPanel data-testid="second-panel">
        <button type="button">Second panel action</button>
      </section>
    </section>

    <button type="button" data-testid="outside">Outside</button>
  `,
})
class StackedPopoverHarnessComponent {
  readonly firstCloseReasons: TngPopoverCloseReason[] = [];
  readonly secondCloseReasons: TngPopoverCloseReason[] = [];
}

describe('tng-popover primitive behavior', () => {
  afterEach(() => {
    TestBed.resetTestingModule();
    document.body.style.overflow = '';
    document.body.style.paddingRight = '';
    document.documentElement.style.left = '';
    document.documentElement.style.overflowY = '';
    document.documentElement.style.position = '';
    document.documentElement.style.top = '';
    document.documentElement.style.width = '';
  });

  it('exports root, trigger, panel, and close directives', () => {
    expect(typeof TngPopover).toBe('function');
    expect(typeof TngPopoverTrigger).toBe('function');
    expect(typeof TngPopoverPanel).toBe('function');
    expect(typeof TngPopoverClose).toBe('function');
  });

  it('renders closed by default and applies root/panel/trigger data hooks', async () => {
    const fixture = TestBed.configureTestingModule({
      imports: [UncontrolledPopoverHarnessComponent],
    }).createComponent(UncontrolledPopoverHarnessComponent);

    await settle(fixture);

    const root = getByTestId<HTMLElement>(fixture, 'root');
    const trigger = getByTestId<HTMLButtonElement>(fixture, 'trigger');
    const panel = getByTestId<HTMLElement>(fixture, 'panel');

    expect(root.getAttribute('data-slot')).toBe('popover');
    expect(root.getAttribute('data-open')).toBe('false');
    expect(root.getAttribute('data-state')).toBe('closed');
    expect(root.getAttribute('data-side')).toBe('bottom');
    expect(root.getAttribute('data-align')).toBe('start');
    expect(trigger.getAttribute('data-slot')).toBe('popover-trigger');
    expect(trigger.getAttribute('aria-expanded')).toBe('false');
    expect(trigger.getAttribute('aria-haspopup')).toBe('dialog');
    expect(panel.getAttribute('data-slot')).toBe('popover-panel');
    expect(panel.getAttribute('hidden')).toBe('');
    expect(panel.id).not.toBe('');
    expect(trigger.getAttribute('aria-controls')).toBe(panel.id);
  });

  it('supports defaultOpen and exposes panel role/label semantics', async () => {
    const fixture = TestBed.configureTestingModule({
      imports: [UncontrolledPopoverHarnessComponent],
    }).createComponent(UncontrolledPopoverHarnessComponent);
    fixture.componentInstance.defaultOpen.set(true);
    fixture.componentInstance.panelRole.set('menu');
    fixture.componentInstance.ariaLabel.set('Project actions');

    await settle(fixture);

    const panel = getByTestId<HTMLElement>(fixture, 'panel');
    expect(panel.getAttribute('hidden')).toBeNull();
    expect(panel.getAttribute('role')).toBe('menu');
    expect(panel.getAttribute('aria-label')).toBe('Project actions');
  });

  it('trigger toggles uncontrolled open/close and emits reasons', async () => {
    const fixture = TestBed.configureTestingModule({
      imports: [UncontrolledPopoverHarnessComponent],
    }).createComponent(UncontrolledPopoverHarnessComponent);

    await settle(fixture);

    const trigger = getByTestId<HTMLButtonElement>(fixture, 'trigger');
    const panel = getByTestId<HTMLElement>(fixture, 'panel');

    trigger.click();
    await settle(fixture);
    expect(panel.getAttribute('hidden')).toBeNull();
    expect(fixture.componentInstance.openChanges).toEqual([true]);

    trigger.click();
    await settle(fixture);
    expect(fixture.componentInstance.closeReasons).toEqual(['trigger-toggle']);
    expect(fixture.componentInstance.openChanges).toEqual([true, false]);
    expect(panel.getAttribute('hidden')).toBe('');
  });

  it('keeps the panel visible and inert until its exit animation completes', async () => {
    const fixture = TestBed.configureTestingModule({
      imports: [UncontrolledPopoverHarnessComponent],
    }).createComponent(UncontrolledPopoverHarnessComponent);
    fixture.componentInstance.defaultOpen.set(true);
    await settle(fixture);

    const trigger = getByTestId<HTMLButtonElement>(fixture, 'trigger');
    const panel = getByTestId<HTMLElement>(fixture, 'panel');
    panel.style.animationName = 'test-popover-exit';
    panel.style.animationDuration = '10s';
    panel.style.animationDelay = '0s';

    trigger.click();
    fixture.detectChanges();

    expect(panel.getAttribute('data-presence')).toBe('exiting');
    expect(panel.getAttribute('aria-hidden')).toBe('true');
    expect(panel.hasAttribute('inert')).toBe(true);
    expect(panel.hasAttribute('hidden')).toBe(false);

    panel.dispatchEvent(new Event('animationend', { bubbles: true }));
    await settle(fixture);

    expect(panel.getAttribute('data-presence')).toBe('closed');
    expect(panel.getAttribute('hidden')).toBe('');
  });

  it('close directive emits programmatic close reason', async () => {
    const fixture = TestBed.configureTestingModule({
      imports: [UncontrolledPopoverHarnessComponent],
    }).createComponent(UncontrolledPopoverHarnessComponent);
    fixture.componentInstance.defaultOpen.set(true);

    await settle(fixture);

    getByTestId<HTMLButtonElement>(fixture, 'close').click();
    await settle(fixture);

    expect(fixture.componentInstance.closeReasons).toEqual(['programmatic']);
    expect(fixture.componentInstance.openChanges).toContain(false);
  });

  it('Escape closes when enabled and restores focus to trigger', async () => {
    const fixture = TestBed.configureTestingModule({
      imports: [UncontrolledPopoverHarnessComponent],
    }).createComponent(UncontrolledPopoverHarnessComponent);

    await settle(fixture);

    const trigger = getByTestId<HTMLButtonElement>(fixture, 'trigger');
    trigger.focus();
    trigger.click();
    await settle(fixture);

    const event = keydown(document, 'Escape');
    await settle(fixture);

    expect(event.defaultPrevented).toBe(true);
    expect(fixture.componentInstance.closeReasons).toEqual(['escape']);
    expect(document.activeElement).toBe(trigger);
  });

  it('does not close on Escape when disabled by input', async () => {
    const fixture = TestBed.configureTestingModule({
      imports: [UncontrolledPopoverHarnessComponent],
    }).createComponent(UncontrolledPopoverHarnessComponent);
    fixture.componentInstance.defaultOpen.set(true);
    fixture.componentInstance.closeOnEscape.set(false);

    await settle(fixture);

    keydown(document, 'Escape');
    await settle(fixture);

    expect(fixture.componentInstance.closeReasons).toEqual([]);
    expect(getByTestId<HTMLElement>(fixture, 'panel').getAttribute('hidden')).toBeNull();
  });

  it('outside pointer closes when enabled and keeps open when disabled', async () => {
    const fixture = TestBed.configureTestingModule({
      imports: [UncontrolledPopoverHarnessComponent],
    }).createComponent(UncontrolledPopoverHarnessComponent);
    fixture.componentInstance.defaultOpen.set(true);

    await settle(fixture);

    pointerdown(getByTestId<HTMLButtonElement>(fixture, 'outside'));
    await settle(fixture);
    expect(fixture.componentInstance.closeReasons).toEqual(['outside-pointer']);
    expect(getByTestId<HTMLElement>(fixture, 'panel').getAttribute('hidden')).toBe('');

    fixture.componentInstance.closeReasons.length = 0;
    fixture.componentInstance.closeOnOutsidePointer.set(false);
    getByTestId<HTMLButtonElement>(fixture, 'trigger').click();
    await settle(fixture);

    pointerdown(getByTestId<HTMLButtonElement>(fixture, 'outside'));
    await settle(fixture);

    expect(fixture.componentInstance.closeReasons).toEqual([]);
    expect(getByTestId<HTMLElement>(fixture, 'panel').getAttribute('hidden')).toBeNull();
  });

  it('closes when the page scrolls while open', async () => {
    const fixture = TestBed.configureTestingModule({
      imports: [UncontrolledPopoverHarnessComponent],
    }).createComponent(UncontrolledPopoverHarnessComponent);
    fixture.componentInstance.defaultOpen.set(true);

    await settle(fixture);

    expect(getByTestId<HTMLElement>(fixture, 'panel').getAttribute('hidden')).toBeNull();

    window.dispatchEvent(new Event('scroll'));
    await settle(fixture);

    expect(fixture.componentInstance.closeReasons).toEqual(['outside-pointer']);
    expect(getByTestId<HTMLElement>(fixture, 'panel').getAttribute('hidden')).toBe('');
  });

  it('preserves the document scrollbar and blocks nested scrolling when strategy is block', async () => {
    const fixture = TestBed.configureTestingModule({
      imports: [ScrollStrategyPopoverHarnessComponent],
    }).createComponent(ScrollStrategyPopoverHarnessComponent);

    await settle(fixture);

    const scrollParent = getByTestId<HTMLElement>(fixture, 'scroll-parent');
    const panel = getByTestId<HTMLElement>(fixture, 'panel');

    expect(panel.getAttribute('hidden')).toBeNull();
    expect(document.body.style.overflow).toBe('');
    expect(document.documentElement.style.position).toBe('fixed');
    expect(document.documentElement.style.overflowY).toBe('scroll');
    expect(scrollParent.style.overflow).toBe('hidden');

    window.dispatchEvent(new Event('scroll'));
    await settle(fixture);

    expect(fixture.componentInstance.closeReasons).toEqual([]);
    expect(panel.getAttribute('hidden')).toBeNull();

    fixture.componentInstance.open.set(false);
    await settle(fixture);

    expect(document.body.style.overflow).toBe('');
    expect(document.documentElement.style.position).toBe('');
    expect(document.documentElement.style.overflowY).toBe('');
    expect(scrollParent.style.overflow).toBe('auto');
  });

  it('disabled state prevents opening from trigger', async () => {
    const fixture = TestBed.configureTestingModule({
      imports: [UncontrolledPopoverHarnessComponent],
    }).createComponent(UncontrolledPopoverHarnessComponent);
    fixture.componentInstance.disabled.set(true);

    await settle(fixture);

    const root = getByTestId<HTMLElement>(fixture, 'root');
    const trigger = getByTestId<HTMLButtonElement>(fixture, 'trigger');
    trigger.click();
    await settle(fixture);

    expect(root.getAttribute('data-disabled')).toBe('');
    expect(getByTestId<HTMLElement>(fixture, 'panel').getAttribute('hidden')).toBe('');
    expect(fixture.componentInstance.openChanges).toEqual([]);
  });

  it('supports optional autofocus into panel content', async () => {
    const fixture = TestBed.configureTestingModule({
      imports: [UncontrolledPopoverHarnessComponent],
    }).createComponent(UncontrolledPopoverHarnessComponent);
    fixture.componentInstance.autoFocus.set('first-focusable');

    await settle(fixture);

    getByTestId<HTMLButtonElement>(fixture, 'trigger').click();
    await settle(fixture);

    expect(document.activeElement).toBe(getByTestId<HTMLButtonElement>(fixture, 'first'));
  });

  it('controlled open state emits close events without mutating host input', async () => {
    const fixture = TestBed.configureTestingModule({
      imports: [ControlledPopoverHarnessComponent],
    }).createComponent(ControlledPopoverHarnessComponent);

    await settle(fixture);

    getByTestId<HTMLButtonElement>(fixture, 'trigger').click();
    await settle(fixture);

    expect(fixture.componentInstance.closeReasons).toEqual(['trigger-toggle']);
    expect(fixture.componentInstance.openChanges).toEqual([false]);
    expect(fixture.componentInstance.open()).toBe(true);
    expect(getByTestId<HTMLElement>(fixture, 'panel').getAttribute('hidden')).toBeNull();
  });

  it('Escape dismisses only the top-most popover layer first', async () => {
    const fixture = TestBed.configureTestingModule({
      imports: [StackedPopoverHarnessComponent],
    }).createComponent(StackedPopoverHarnessComponent);

    await settle(fixture);

    const firstPanel = getByTestId<HTMLElement>(fixture, 'first-panel');
    const secondPanel = getByTestId<HTMLElement>(fixture, 'second-panel');
    expect(firstPanel.getAttribute('hidden')).toBeNull();
    expect(secondPanel.getAttribute('hidden')).toBeNull();

    const firstEscape = keydown(document, 'Escape');
    await settle(fixture);

    expect(firstEscape.defaultPrevented).toBe(true);
    expect(fixture.componentInstance.secondCloseReasons).toEqual(['escape']);
    expect(fixture.componentInstance.firstCloseReasons).toEqual([]);
    expect(secondPanel.getAttribute('hidden')).toBe('');
    expect(firstPanel.getAttribute('hidden')).toBeNull();

    const secondEscape = keydown(document, 'Escape');
    await settle(fixture);

    expect(secondEscape.defaultPrevented).toBe(true);
    expect(fixture.componentInstance.firstCloseReasons).toEqual(['escape']);
    expect(firstPanel.getAttribute('hidden')).toBe('');
  });

  it('outside pointer dismisses only the top-most popover layer first', async () => {
    const fixture = TestBed.configureTestingModule({
      imports: [StackedPopoverHarnessComponent],
    }).createComponent(StackedPopoverHarnessComponent);

    await settle(fixture);

    const firstPanel = getByTestId<HTMLElement>(fixture, 'first-panel');
    const secondPanel = getByTestId<HTMLElement>(fixture, 'second-panel');
    const outside = getByTestId<HTMLButtonElement>(fixture, 'outside');

    pointerdown(outside);
    await settle(fixture);

    expect(fixture.componentInstance.secondCloseReasons).toEqual(['outside-pointer']);
    expect(fixture.componentInstance.firstCloseReasons).toEqual([]);
    expect(secondPanel.getAttribute('hidden')).toBe('');
    expect(firstPanel.getAttribute('hidden')).toBeNull();

    pointerdown(outside);
    await settle(fixture);

    expect(fixture.componentInstance.firstCloseReasons).toEqual(['outside-pointer']);
    expect(firstPanel.getAttribute('hidden')).toBe('');
  });
});
