import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { afterAll, afterEach, beforeAll, describe, expect, it, vi } from 'vitest';
import {
  normalizeTngTooltipDelay,
  shouldCloseTngTooltipForKey,
  TngTooltipComponent,
} from '../tng-tooltip.component';

const TOOLTIP_Z_INDEX_CHAIN =
  'var(--tng-tooltip-z-overlay, var(--tng-tooltip-overlay-z-index, var(--tng-z-overlay, 20)))';

const tooltipComponentCss = readFileSync(
  join(
    process.cwd(),
    'libs/tailng-ui/components/src/lib/overlay/tooltip/tng-tooltip.component.css',
  ),
  'utf8',
);

const tooltipThemeContractCss = readFileSync(
  join(process.cwd(), 'libs/tailng-ui/theme/src/lib/component-contracts/utility/tooltip.css'),
  'utf8',
);

function findTrigger(fixture: { nativeElement: HTMLElement }): HTMLButtonElement | null {
  const element = fixture.nativeElement.querySelector('.tng-tooltip-trigger');
  return element instanceof HTMLButtonElement ? element : null;
}

function findContent(fixture: { nativeElement: HTMLElement }): HTMLElement | null {
  return fixture.nativeElement.querySelector('.tng-tooltip-content');
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

async function settle(fixture: {
  detectChanges(): void;
  whenStable(): Promise<unknown>;
}): Promise<void> {
  fixture.detectChanges();
  await fixture.whenStable();
  fixture.detectChanges();
}

@Component({
  imports: [TngTooltipComponent],
  template: `
    <tng-tooltip
      [ariaLabel]="ariaLabel()"
      [openDelay]="openDelay()"
      [closeDelay]="closeDelay()"
      [disabled]="disabled()"
      [side]="side()"
      [text]="text()"
      [triggerLabel]="triggerLabel()"
      (openChange)="openChanges.push($event)"
    />
  `,
})
class TooltipHostComponent {
  public ariaLabel = signal<string | null>('More info');
  public openDelay = signal(120);
  public closeDelay = signal(60);
  public disabled = signal(false);
  public side = signal<'top' | 'right' | 'bottom' | 'left'>('top');
  public text = signal('Tooltip body');
  public triggerLabel = signal('Info');
  public openChanges: boolean[] = [];
}

@Component({
  imports: [TngTooltipComponent],
  template: `<tng-tooltip
    style="--tng-tooltip-z-overlay: 42"
    text="Stacked"
    triggerLabel="Info"
  />`,
})
class TooltipComponentTokenHostComponent {}

@Component({
  imports: [TngTooltipComponent],
  template: `<tng-tooltip style="--tng-z-overlay: 99" text="Global stack" triggerLabel="Info" />`,
})
class TooltipGlobalTokenHostComponent {}

@Component({
  imports: [TngTooltipComponent],
  template: `<tng-tooltip
    style="--tng-tooltip-overlay-z-index: 55"
    text="Alias stack"
    triggerLabel="Info"
  />`,
})
class TooltipAliasTokenHostComponent {}

@Component({
  imports: [TngTooltipComponent],
  template: `<tng-tooltip text="Default stack" triggerLabel="Info" />`,
})
class TooltipDefaultZIndexHostComponent {}

describe('tng-tooltip component behavior', () => {
  let tooltipStackStyleElement: HTMLStyleElement | null = null;

  beforeAll(() => {
    tooltipStackStyleElement = document.createElement('style');
    // Unlayered selectors so jsdom applies the theme contract tokens reliably.
    tooltipStackStyleElement.textContent = [
      `tng-tooltip, [tngTooltip] {
        --tng-tooltip-z-overlay: var(--tng-tooltip-overlay-z-index, var(--tng-z-overlay, 20));
      }`,
      `.tng-tooltip-content { z-index: ${TOOLTIP_Z_INDEX_CHAIN}; }`,
    ].join('\n');
    document.head.appendChild(tooltipStackStyleElement);
  });

  afterAll(() => {
    tooltipStackStyleElement?.remove();
    tooltipStackStyleElement = null;
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
    TestBed.resetTestingModule();
  });

  it('exports the tooltip component', () => {
    expect(typeof TngTooltipComponent).toBe('function');
  });

  it('normalizes invalid delay values', () => {
    expect(normalizeTngTooltipDelay(-1)).toBe(0);
    expect(normalizeTngTooltipDelay(Number.NaN)).toBe(0);
    expect(normalizeTngTooltipDelay(125)).toBe(125);
  });

  it('closes on escape key only', () => {
    expect(shouldCloseTngTooltipForKey('Escape')).toBe(true);
    expect(shouldCloseTngTooltipForKey('Enter')).toBe(false);
  });

  it('renders closed by default with tooltip semantics', async () => {
    const fixture = TestBed.configureTestingModule({
      imports: [TooltipHostComponent],
    }).createComponent(TooltipHostComponent);

    await settle(fixture);

    const trigger = findTrigger(fixture);
    const content = findContent(fixture);
    expect(trigger).not.toBeNull();
    expect(content).not.toBeNull();
    expect(trigger?.textContent?.trim()).toBe('Info');
    expect(trigger?.getAttribute('aria-label')).toBe('More info');
    expect(trigger?.getAttribute('aria-describedby')).toBeNull();
    expect(trigger?.getAttribute('data-state')).toBe('closed');
    expect(content?.textContent?.trim()).toBe('Tooltip body');
    expect(content?.getAttribute('role')).toBe('tooltip');
    expect(content?.getAttribute('data-slot')).toBe('tooltip-content');
    expect(content?.getAttribute('data-state')).toBe('closed');
    expect(content?.getAttribute('hidden')).toBe('');
  });

  it('opens on mouseenter after delay and closes on mouseleave after delay', async () => {
    vi.useFakeTimers();
    const fixture = TestBed.configureTestingModule({
      imports: [TooltipHostComponent],
    }).createComponent(TooltipHostComponent);
    fixture.componentInstance.openDelay.set(40);
    fixture.componentInstance.closeDelay.set(30);

    await settle(fixture);

    const trigger = findTrigger(fixture);
    const content = findContent(fixture);
    expect(trigger).not.toBeNull();
    expect(content).not.toBeNull();

    trigger?.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));
    await settle(fixture);

    vi.advanceTimersByTime(39);
    await settle(fixture);
    expect(content?.getAttribute('hidden')).toBe('');

    vi.advanceTimersByTime(1);
    await settle(fixture);
    expect(content?.getAttribute('hidden')).toBeNull();
    expect(trigger?.getAttribute('aria-describedby')).toBe(content?.id ?? null);

    trigger?.dispatchEvent(new MouseEvent('mouseleave', { bubbles: true }));
    await settle(fixture);

    vi.advanceTimersByTime(29);
    await settle(fixture);
    expect(content?.getAttribute('hidden')).toBeNull();

    vi.advanceTimersByTime(1);
    await settle(fixture);
    expect(content?.getAttribute('hidden')).toBe('');
    expect(trigger?.getAttribute('aria-describedby')).toBeNull();
    expect(fixture.componentInstance.openChanges).toEqual([true, false]);
  });

  it('opens on focus and closes on blur', async () => {
    const fixture = TestBed.configureTestingModule({
      imports: [TooltipHostComponent],
    }).createComponent(TooltipHostComponent);
    fixture.componentInstance.openDelay.set(0);
    fixture.componentInstance.closeDelay.set(0);

    await settle(fixture);

    const trigger = findTrigger(fixture);
    const content = findContent(fixture);
    expect(trigger).not.toBeNull();
    expect(content).not.toBeNull();

    trigger?.dispatchEvent(new FocusEvent('focus'));
    await settle(fixture);
    expect(content?.getAttribute('hidden')).toBeNull();

    trigger?.dispatchEvent(new FocusEvent('blur'));
    await settle(fixture);
    expect(content?.getAttribute('hidden')).toBe('');
  });

  it('closes when Escape is pressed while open', async () => {
    const fixture = TestBed.configureTestingModule({
      imports: [TooltipHostComponent],
    }).createComponent(TooltipHostComponent);
    fixture.componentInstance.openDelay.set(0);
    fixture.componentInstance.closeDelay.set(0);

    await settle(fixture);

    const trigger = findTrigger(fixture);
    const content = findContent(fixture);
    trigger?.dispatchEvent(new FocusEvent('focus'));
    await settle(fixture);
    expect(content?.getAttribute('hidden')).toBeNull();

    const event = new KeyboardEvent('keydown', { bubbles: true, cancelable: true, key: 'Escape' });
    trigger?.dispatchEvent(event);
    await settle(fixture);

    expect(event.defaultPrevented).toBe(true);
    expect(content?.getAttribute('hidden')).toBe('');
  });

  it('disabled prevents opening and exposes disabled data hook', async () => {
    const fixture = TestBed.configureTestingModule({
      imports: [TooltipHostComponent],
    }).createComponent(TooltipHostComponent);
    fixture.componentInstance.openDelay.set(0);
    fixture.componentInstance.closeDelay.set(0);
    fixture.componentInstance.disabled.set(true);

    await settle(fixture);

    const root = fixture.nativeElement.querySelector('.tng-tooltip-root') as HTMLElement | null;
    const trigger = findTrigger(fixture);
    const content = findContent(fixture);

    trigger?.dispatchEvent(new FocusEvent('focus'));
    await settle(fixture);

    expect(root?.getAttribute('data-disabled')).toBe('');
    expect(trigger?.hasAttribute('disabled')).toBe(true);
    expect(content?.getAttribute('hidden')).toBe('');
    expect(fixture.componentInstance.openChanges).toEqual([]);
  });

  it('reacts to side changes through content data-side', async () => {
    const fixture = TestBed.configureTestingModule({
      imports: [TooltipHostComponent],
    }).createComponent(TooltipHostComponent);
    fixture.componentInstance.side.set('left');

    await settle(fixture);
    expect(findContent(fixture)?.getAttribute('data-side')).toBe('left');

    fixture.componentInstance.side.set('bottom');
    await settle(fixture);
    expect(findContent(fixture)?.getAttribute('data-side')).toBe('bottom');
  });

  it('uses edge-aware CDK positioning and flips tooltip side near viewport bounds', async () => {
    Object.defineProperty(window, 'innerWidth', { configurable: true, value: 360 });
    Object.defineProperty(window, 'innerHeight', { configurable: true, value: 220 });
    vi.spyOn(window, 'requestAnimationFrame').mockImplementation(
      (callback: FrameRequestCallback): number => {
        callback(0);
        return 1;
      },
    );

    const fixture = TestBed.configureTestingModule({
      imports: [TooltipHostComponent],
    }).createComponent(TooltipHostComponent);
    fixture.componentInstance.openDelay.set(0);
    fixture.componentInstance.closeDelay.set(0);
    fixture.componentInstance.side.set('bottom');

    await settle(fixture);

    const trigger = findTrigger(fixture);
    const content = findContent(fixture);
    expect(trigger).not.toBeNull();
    expect(content).not.toBeNull();

    vi.spyOn(trigger!, 'getBoundingClientRect').mockReturnValue(createRect(120, 170, 80, 20));
    vi.spyOn(content!, 'getBoundingClientRect').mockReturnValue(createRect(0, 0, 160, 72));

    trigger?.dispatchEvent(new FocusEvent('focus'));
    await settle(fixture);

    expect(content?.getAttribute('data-side')).toBe('top');
    expect(content?.style.left).toBe('80px');
    expect(content?.style.top).toBe('90px');
  });

  it('declares the themed overlay z-index chain in component styles', () => {
    expect(tooltipComponentCss).toContain(`z-index: ${TOOLTIP_Z_INDEX_CHAIN};`);
    expect(tooltipThemeContractCss).toContain(
      '--tng-tooltip-z-overlay:        var(--tng-tooltip-overlay-z-index, var(--tng-z-overlay, 20));',
    );
  });

  it('uses the themed z-index chain with the component token', async () => {
    const fixture = TestBed.configureTestingModule({
      imports: [TooltipComponentTokenHostComponent],
    }).createComponent(TooltipComponentTokenHostComponent);

    await settle(fixture);

    const tooltip = fixture.nativeElement.querySelector('tng-tooltip') as HTMLElement | null;
    const content = findContent(fixture);
    expect(tooltip).not.toBeNull();
    expect(content).not.toBeNull();
    expect(getComputedStyle(content!).zIndex).toBe(TOOLTIP_Z_INDEX_CHAIN);
    expect(tooltip!.style.getPropertyValue('--tng-tooltip-z-overlay').trim()).toBe('42');
    expect(getComputedStyle(tooltip!).getPropertyValue('--tng-tooltip-z-overlay').trim()).toBe(
      '42',
    );
  });

  it('falls back to the global overlay token when the component token is unset', async () => {
    const fixture = TestBed.configureTestingModule({
      imports: [TooltipGlobalTokenHostComponent],
    }).createComponent(TooltipGlobalTokenHostComponent);

    await settle(fixture);

    const tooltip = fixture.nativeElement.querySelector('tng-tooltip') as HTMLElement | null;
    const content = findContent(fixture);
    expect(tooltip).not.toBeNull();
    expect(content).not.toBeNull();
    expect(getComputedStyle(content!).zIndex).toBe(TOOLTIP_Z_INDEX_CHAIN);
    expect(tooltip!.style.getPropertyValue('--tng-z-overlay').trim()).toBe('99');
    expect(getComputedStyle(tooltip!).getPropertyValue('--tng-z-overlay').trim()).toBe('99');
    expect(getComputedStyle(tooltip!).getPropertyValue('--tng-tooltip-z-overlay').trim()).toBe(
      'var(--tng-tooltip-overlay-z-index, var(--tng-z-overlay, 20))',
    );
  });

  it('keeps the default overlay z-index when no overlay tokens are set', async () => {
    const fixture = TestBed.configureTestingModule({
      imports: [TooltipDefaultZIndexHostComponent],
    }).createComponent(TooltipDefaultZIndexHostComponent);

    await settle(fixture);

    const tooltip = fixture.nativeElement.querySelector('tng-tooltip') as HTMLElement | null;
    const content = findContent(fixture);
    expect(tooltip).not.toBeNull();
    expect(content).not.toBeNull();
    expect(getComputedStyle(content!).zIndex).toBe(TOOLTIP_Z_INDEX_CHAIN);
    expect(getComputedStyle(tooltip!).getPropertyValue('--tng-tooltip-z-overlay').trim()).toBe(
      'var(--tng-tooltip-overlay-z-index, var(--tng-z-overlay, 20))',
    );
    expect(getComputedStyle(tooltip!).getPropertyValue('--tng-z-overlay').trim()).toBe('');
  });

  it('uses the overlay z-index alias token when the primary token is unset', async () => {
    const fixture = TestBed.configureTestingModule({
      imports: [TooltipAliasTokenHostComponent],
    }).createComponent(TooltipAliasTokenHostComponent);

    await settle(fixture);

    const tooltip = fixture.nativeElement.querySelector('tng-tooltip') as HTMLElement | null;
    const content = findContent(fixture);
    expect(tooltip).not.toBeNull();
    expect(content).not.toBeNull();
    expect(getComputedStyle(content!).zIndex).toBe(TOOLTIP_Z_INDEX_CHAIN);
    expect(tooltip!.style.getPropertyValue('--tng-tooltip-overlay-z-index').trim()).toBe('55');
    expect(
      getComputedStyle(tooltip!).getPropertyValue('--tng-tooltip-overlay-z-index').trim(),
    ).toBe('55');
  });
});
