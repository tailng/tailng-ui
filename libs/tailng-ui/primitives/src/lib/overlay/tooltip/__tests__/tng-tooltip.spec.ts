import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { TngPopover, TngPopoverPanel, TngPopoverTrigger } from '../../popover/tng-popover';
import {
  normalizeTngTooltipDelay,
  resolveTngTooltipAriaDescribedBy,
  resolveTngTooltipDataState,
  resolveTngTooltipHidden,
  shouldCloseTngTooltipForKey,
  TngTooltip,
  TngTooltipContent,
  type TngTooltipSide,
  TngTooltipTrigger,
} from '../tng-tooltip';

function getByTestId<T extends Element>(
  fixture: { nativeElement: HTMLElement },
  testId: string,
): T {
  const element = fixture.nativeElement.querySelector(`[data-testid="${testId}"]`);
  if (element === null) {
    throw new Error(`Expected element [data-testid="${testId}"] to exist.`);
  }

  return element as T;
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
  imports: [TngTooltipTrigger, TngTooltipContent],
  template: `
    <button
      type="button"
      tngTooltipTrigger
      data-testid="trigger"
      [describedBy]="tooltipId()"
      [open]="open()"
      [disabled]="disabled()"
      (focus)="open.set(true)"
      (blur)="open.set(false)"
      (mouseenter)="open.set(true)"
      (mouseleave)="open.set(false)"
    >
      Trigger
    </button>

    <span
      tngTooltipContent
      data-testid="content"
      [id]="tooltipId()"
      [open]="open()"
      [side]="side()"
    >
      Tooltip body
    </span>
  `,
})
class TooltipHarnessComponent {
  public readonly open = signal(false);
  public readonly disabled = signal(false);
  public readonly side = signal<TngTooltipSide>('top');
  public readonly tooltipId = signal('tooltip-harness');
}

@Component({
  imports: [TngTooltip, TngTooltipTrigger, TngTooltipContent],
  template: `
    <span
      tngTooltip
      data-testid="root"
      [openDelay]="openDelay()"
      [closeDelay]="closeDelay()"
      [disabled]="disabled()"
      [side]="side()"
    >
      <button type="button" tngTooltipTrigger data-testid="trigger">Trigger</button>
      <span tngTooltipContent data-testid="content" [id]="tooltipId()">Tooltip body</span>
    </span>
  `,
})
class TooltipRootHarnessComponent {
  public readonly openDelay = signal(0);
  public readonly closeDelay = signal(0);
  public readonly disabled = signal(false);
  public readonly side = signal<TngTooltipSide>('bottom');
  public readonly tooltipId = signal('tooltip-root-harness');
}

@Component({
  imports: [TngTooltip, TngTooltipTrigger, TngTooltipContent],
  template: `
    <span tngTooltip data-testid="root" [openDelay]="0" [closeDelay]="0">
      <button type="button" tngTooltipTrigger data-testid="trigger">Trigger</button>
      <span tngTooltipContent data-testid="content">Tooltip body</span>
    </span>
  `,
})
class TooltipRootAutoIdHarnessComponent {}

@Component({
  imports: [TngTooltip, TngTooltipTrigger, TngTooltipContent],
  template: `
    <span tngTooltip [openDelay]="0" [closeDelay]="0">
      <button type="button" tngTooltipTrigger data-testid="trigger-a">Trigger A</button>
      <span tngTooltipContent data-testid="content-a">Tooltip A</span>
    </span>

    <span tngTooltip [openDelay]="0" [closeDelay]="0">
      <button type="button" tngTooltipTrigger data-testid="trigger-b">Trigger B</button>
      <span tngTooltipContent data-testid="content-b">Tooltip B</span>
    </span>
  `,
})
class TooltipTwoRootHarnessComponent {}

@Component({
  imports: [
    TngTooltip,
    TngTooltipTrigger,
    TngTooltipContent,
    TngPopover,
    TngPopoverTrigger,
    TngPopoverPanel,
  ],
  template: `
    <span tngTooltip [openDelay]="0" [closeDelay]="0">
      <button type="button" tngTooltipTrigger data-testid="tooltip-trigger">Tooltip trigger</button>
      <span tngTooltipContent data-testid="tooltip-content">Tooltip content</span>
    </span>

    <section
      tngPopover
      #popover="tngPopover"
      data-testid="popover-root"
      [autoFocus]="'none'"
      [restoreFocus]="false"
    >
      <button type="button" [tngPopoverTrigger]="popover" data-testid="popover-trigger">
        Popover trigger
      </button>
      <section tngPopoverPanel data-testid="popover-panel">Popover panel</section>
    </section>
  `,
})
class TooltipPopoverStackHarnessComponent {}

async function settle(fixture: {
  detectChanges(): void;
  whenStable(): Promise<unknown>;
}): Promise<void> {
  fixture.detectChanges();
  await fixture.whenStable();
  fixture.detectChanges();
}

describe('tng-tooltip primitive helpers', () => {
  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
    TestBed.resetTestingModule();
  });

  it('exports tooltip trigger and content primitives', () => {
    expect(typeof TngTooltipTrigger).toBe('function');
    expect(typeof TngTooltipContent).toBe('function');
    expect(typeof TngTooltip).toBe('function');
  });

  it('maps open state to attributes', () => {
    expect(resolveTngTooltipDataState(true)).toBe('open');
    expect(resolveTngTooltipDataState(false)).toBe('closed');
    expect(resolveTngTooltipHidden(true)).toBeNull();
    expect(resolveTngTooltipHidden(false)).toBe('');
  });

  it('normalizes delay and escape-key close helpers', () => {
    expect(normalizeTngTooltipDelay(-1)).toBe(0);
    expect(normalizeTngTooltipDelay(Number.NaN)).toBe(0);
    expect(normalizeTngTooltipDelay(20)).toBe(20);
    expect(shouldCloseTngTooltipForKey('Escape')).toBe(true);
    expect(shouldCloseTngTooltipForKey('Enter')).toBe(false);
  });

  it('resolves aria-describedby only when open and id is valid', () => {
    expect(resolveTngTooltipAriaDescribedBy(false, 'tip-1')).toBeNull();
    expect(resolveTngTooltipAriaDescribedBy(true, null)).toBeNull();
    expect(resolveTngTooltipAriaDescribedBy(true, '  ')).toBeNull();
    expect(resolveTngTooltipAriaDescribedBy(true, 'tip-1')).toBe('tip-1');
  });

  it('renders closed state attributes by default', async () => {
    const fixture = TestBed.configureTestingModule({
      imports: [TooltipHarnessComponent],
    }).createComponent(TooltipHarnessComponent);

    await settle(fixture);

    const trigger = getByTestId<HTMLButtonElement>(fixture, 'trigger');
    const content = getByTestId<HTMLElement>(fixture, 'content');

    expect(trigger.getAttribute('data-slot')).toBe('tooltip-trigger');
    expect(trigger.getAttribute('data-state')).toBe('closed');
    expect(trigger.getAttribute('data-disabled')).toBeNull();
    expect(trigger.getAttribute('aria-describedby')).toBeNull();
    expect(content.getAttribute('data-slot')).toBe('tooltip-content');
    expect(content.getAttribute('data-state')).toBe('closed');
    expect(content.getAttribute('data-side')).toBe('top');
    expect(content.getAttribute('role')).toBe('tooltip');
    expect(content.getAttribute('hidden')).toBe('');
  });

  it('reflects open state and aria-describedby when host state opens', async () => {
    const fixture = TestBed.configureTestingModule({
      imports: [TooltipHarnessComponent],
    }).createComponent(TooltipHarnessComponent);
    fixture.componentInstance.open.set(true);

    await settle(fixture);

    const trigger = getByTestId<HTMLButtonElement>(fixture, 'trigger');
    const content = getByTestId<HTMLElement>(fixture, 'content');

    expect(trigger.getAttribute('data-state')).toBe('open');
    expect(trigger.getAttribute('aria-describedby')).toBe('tooltip-harness');
    expect(content.getAttribute('data-state')).toBe('open');
    expect(content.getAttribute('hidden')).toBeNull();
  });

  it('keeps content visible and inert until its exit animation completes', async () => {
    const fixture = TestBed.configureTestingModule({
      imports: [TooltipHarnessComponent],
    }).createComponent(TooltipHarnessComponent);
    fixture.componentInstance.open.set(true);
    await settle(fixture);

    const content = getByTestId<HTMLElement>(fixture, 'content');
    content.style.animationName = 'test-tooltip-exit';
    content.style.animationDuration = '10s';
    content.style.animationDelay = '0s';

    fixture.componentInstance.open.set(false);
    fixture.detectChanges();

    expect(content.getAttribute('data-presence')).toBe('exiting');
    expect(content.getAttribute('aria-hidden')).toBe('true');
    expect(content.hasAttribute('inert')).toBe(true);
    expect(content.hasAttribute('hidden')).toBe(false);

    content.dispatchEvent(new Event('animationend', { bubbles: true }));
    await settle(fixture);

    expect(content.getAttribute('data-presence')).toBe('closed');
    expect(content.getAttribute('hidden')).toBe('');
  });

  it('applies disabled and side hooks', async () => {
    const fixture = TestBed.configureTestingModule({
      imports: [TooltipHarnessComponent],
    }).createComponent(TooltipHarnessComponent);
    fixture.componentInstance.disabled.set(true);
    fixture.componentInstance.side.set('left');

    await settle(fixture);

    const trigger = getByTestId<HTMLButtonElement>(fixture, 'trigger');
    const content = getByTestId<HTMLElement>(fixture, 'content');
    expect(trigger.getAttribute('data-disabled')).toBe('');
    expect(content.getAttribute('data-side')).toBe('left');
  });

  it('supports hover + focus host wiring for uncontrolled composition', async () => {
    const fixture = TestBed.configureTestingModule({
      imports: [TooltipHarnessComponent],
    }).createComponent(TooltipHarnessComponent);

    await settle(fixture);

    const trigger = getByTestId<HTMLButtonElement>(fixture, 'trigger');

    trigger.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));
    await settle(fixture);
    expect(trigger.getAttribute('data-state')).toBe('open');

    trigger.dispatchEvent(new MouseEvent('mouseleave', { bubbles: true }));
    await settle(fixture);
    expect(trigger.getAttribute('data-state')).toBe('closed');

    trigger.dispatchEvent(new FocusEvent('focus'));
    await settle(fixture);
    expect(trigger.getAttribute('data-state')).toBe('open');

    trigger.dispatchEvent(new FocusEvent('blur'));
    await settle(fixture);
    expect(trigger.getAttribute('data-state')).toBe('closed');
  });

  it('supports root-managed open/close wiring without host state handlers', async () => {
    const fixture = TestBed.configureTestingModule({
      imports: [TooltipRootHarnessComponent],
    }).createComponent(TooltipRootHarnessComponent);
    await settle(fixture);

    const trigger = getByTestId<HTMLButtonElement>(fixture, 'trigger');
    const content = getByTestId<HTMLElement>(fixture, 'content');

    expect(trigger.getAttribute('aria-describedby')).toBeNull();
    expect(content.getAttribute('hidden')).toBe('');

    trigger.dispatchEvent(new FocusEvent('focus'));
    await settle(fixture);
    expect(trigger.getAttribute('aria-describedby')).toBe('tooltip-root-harness');
    expect(content.getAttribute('hidden')).toBeNull();

    trigger.dispatchEvent(new FocusEvent('blur'));
    await settle(fixture);
    expect(trigger.getAttribute('aria-describedby')).toBeNull();
    expect(content.getAttribute('hidden')).toBe('');
  });

  it('closes root-managed tooltip on scroll', async () => {
    const fixture = TestBed.configureTestingModule({
      imports: [TooltipRootHarnessComponent],
    }).createComponent(TooltipRootHarnessComponent);
    await settle(fixture);

    const trigger = getByTestId<HTMLButtonElement>(fixture, 'trigger');
    const content = getByTestId<HTMLElement>(fixture, 'content');

    trigger.dispatchEvent(new FocusEvent('focus'));
    await settle(fixture);
    expect(content.getAttribute('hidden')).toBeNull();

    window.dispatchEvent(new Event('scroll'));
    await settle(fixture);

    expect(content.getAttribute('hidden')).toBe('');
    expect(trigger.getAttribute('aria-describedby')).toBeNull();
  });

  it('participates in overlay runtime and closes on Escape keydown from document', async () => {
    const fixture = TestBed.configureTestingModule({
      imports: [TooltipRootHarnessComponent],
    }).createComponent(TooltipRootHarnessComponent);
    await settle(fixture);

    const trigger = getByTestId<HTMLButtonElement>(fixture, 'trigger');
    const content = getByTestId<HTMLElement>(fixture, 'content');

    trigger.dispatchEvent(new FocusEvent('focus'));
    await settle(fixture);
    expect(content.getAttribute('hidden')).toBeNull();

    const escapeEvent = new KeyboardEvent('keydown', {
      bubbles: true,
      cancelable: true,
      key: 'Escape',
    });
    document.dispatchEvent(escapeEvent);
    await settle(fixture);

    expect(escapeEvent.defaultPrevented).toBe(true);
    expect(content.getAttribute('hidden')).toBe('');
  });

  it('participates in overlay runtime and closes on outside pointer down', async () => {
    const fixture = TestBed.configureTestingModule({
      imports: [TooltipRootHarnessComponent],
    }).createComponent(TooltipRootHarnessComponent);
    await settle(fixture);

    const trigger = getByTestId<HTMLButtonElement>(fixture, 'trigger');
    const content = getByTestId<HTMLElement>(fixture, 'content');

    trigger.dispatchEvent(new FocusEvent('focus'));
    await settle(fixture);
    expect(content.getAttribute('hidden')).toBeNull();

    const pointerDown = new Event('pointerdown', { bubbles: true, cancelable: true });
    document.body.dispatchEvent(pointerDown);
    await settle(fixture);

    expect(pointerDown.defaultPrevented).toBe(true);
    expect(content.getAttribute('hidden')).toBe('');
  });

  it('closes only the top tooltip layer first when multiple tooltip layers are open', async () => {
    const fixture = TestBed.configureTestingModule({
      imports: [TooltipTwoRootHarnessComponent],
    }).createComponent(TooltipTwoRootHarnessComponent);
    await settle(fixture);

    const triggerA = getByTestId<HTMLButtonElement>(fixture, 'trigger-a');
    const triggerB = getByTestId<HTMLButtonElement>(fixture, 'trigger-b');
    const contentA = getByTestId<HTMLElement>(fixture, 'content-a');
    const contentB = getByTestId<HTMLElement>(fixture, 'content-b');

    triggerA.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));
    await settle(fixture);
    triggerB.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));
    await settle(fixture);
    expect(contentA.getAttribute('hidden')).toBeNull();
    expect(contentB.getAttribute('hidden')).toBeNull();

    const escapeEvent = new KeyboardEvent('keydown', {
      bubbles: true,
      cancelable: true,
      key: 'Escape',
    });
    document.dispatchEvent(escapeEvent);
    await settle(fixture);

    expect(escapeEvent.defaultPrevented).toBe(true);
    expect(contentB.getAttribute('hidden')).toBe('');
    expect(contentA.getAttribute('hidden')).toBeNull();
  });

  it('shares overlay runtime with popover so Escape closes top popover before tooltip', async () => {
    const fixture = TestBed.configureTestingModule({
      imports: [TooltipPopoverStackHarnessComponent],
    }).createComponent(TooltipPopoverStackHarnessComponent);
    await settle(fixture);

    const tooltipTrigger = getByTestId<HTMLButtonElement>(fixture, 'tooltip-trigger');
    const tooltipContent = getByTestId<HTMLElement>(fixture, 'tooltip-content');
    const popoverTrigger = getByTestId<HTMLButtonElement>(fixture, 'popover-trigger');
    const popoverPanel = getByTestId<HTMLElement>(fixture, 'popover-panel');

    tooltipTrigger.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));
    await settle(fixture);
    popoverTrigger.click();
    await settle(fixture);

    expect(tooltipContent.getAttribute('hidden')).toBeNull();
    expect(popoverPanel.getAttribute('data-state')).toBe('open');

    const escapeEvent = new KeyboardEvent('keydown', {
      bubbles: true,
      cancelable: true,
      key: 'Escape',
    });
    document.dispatchEvent(escapeEvent);
    await settle(fixture);

    expect(escapeEvent.defaultPrevented).toBe(true);
    expect(popoverPanel.getAttribute('data-state')).toBe('closed');
    expect(tooltipContent.getAttribute('hidden')).toBeNull();
  });

  it('auto-wires generated content id to trigger aria-describedby in root-managed mode', async () => {
    const fixture = TestBed.configureTestingModule({
      imports: [TooltipRootAutoIdHarnessComponent],
    }).createComponent(TooltipRootAutoIdHarnessComponent);
    await settle(fixture);

    const trigger = getByTestId<HTMLButtonElement>(fixture, 'trigger');
    const content = getByTestId<HTMLElement>(fixture, 'content');

    expect(content.id).toMatch(/^tng-tooltip-content-\d+$/);
    expect(trigger.getAttribute('aria-describedby')).toBeNull();

    trigger.dispatchEvent(new FocusEvent('focus'));
    await settle(fixture);
    expect(trigger.getAttribute('aria-describedby')).toBe(content.id);

    trigger.dispatchEvent(new FocusEvent('blur'));
    await settle(fixture);
    expect(trigger.getAttribute('aria-describedby')).toBeNull();
  });

  it('applies CDK positioning with side flipping in root-managed mode', async () => {
    Object.defineProperty(window, 'innerWidth', { configurable: true, value: 360 });
    Object.defineProperty(window, 'innerHeight', { configurable: true, value: 220 });
    vi.spyOn(window, 'requestAnimationFrame').mockImplementation(
      (callback: FrameRequestCallback): number => {
        callback(0);
        return 1;
      },
    );

    const fixture = TestBed.configureTestingModule({
      imports: [TooltipRootHarnessComponent],
    }).createComponent(TooltipRootHarnessComponent);
    await settle(fixture);

    const trigger = getByTestId<HTMLButtonElement>(fixture, 'trigger');
    const content = getByTestId<HTMLElement>(fixture, 'content');
    vi.spyOn(trigger, 'getBoundingClientRect').mockReturnValue(createRect(120, 170, 80, 20));
    vi.spyOn(content, 'getBoundingClientRect').mockReturnValue(createRect(0, 0, 160, 72));

    trigger.dispatchEvent(new FocusEvent('focus'));
    await settle(fixture);

    expect(content.getAttribute('data-side')).toBe('top');
    expect(content.style.left).toBe('80px');
    expect(content.style.top).toBe('90px');
  });
});
