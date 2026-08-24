import { AfterViewInit, Component, ElementRef, ViewChild, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { createOverlayRuntime, type TngOverlayScrollStrategy } from '@tailng-ui/cdk';
import { TngDateRangePickerOverlay } from '../tng-date-range-picker.overlay';
import {
  appendFocusable,
  cleanupDom,
  collectEvents,
  createController,
  dateKey,
} from './tng-date-range-picker.test-helpers';

async function settle(fixture: {
  detectChanges(): void;
  whenStable(): Promise<unknown>;
}): Promise<void> {
  fixture.detectChanges();
  await fixture.whenStable();
  fixture.detectChanges();
}

async function waitForAnimationFrame(): Promise<void> {
  await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));
}

function createRect(top: number, bottom: number, width = 240): DOMRect {
  return {
    bottom,
    height: bottom - top,
    left: 0,
    right: width,
    top,
    width,
    x: 0,
    y: top,
    toJSON: () => ({}),
  } as DOMRect;
}

function getRequired<T extends Element>(root: ParentNode, selector: string): T {
  const element = root.querySelector<T>(selector);
  if (element === null) {
    throw new Error(`Expected selector ${selector} to exist.`);
  }

  return element;
}

@Component({
  imports: [TngDateRangePickerOverlay],
  template: `
    <div
      #anchor
      data-slot="date-range-picker-input-shell"
      data-testid="range-anchor"
      style="
        width: 240px;
        min-height: 52px;
        --tng-date-range-picker-nav-size: 2.7rem;
        --tng-date-range-picker-surface: #111827;
        --tng-date-range-picker-border: #334155;
        --tng-date-range-picker-fg: #f8fafc;
        --tng-date-range-picker-brand: #22c55e;
        --tng-date-range-picker-z-overlay: 9;
        --tng-semantic-background-surface: #111827;
        --tng-semantic-border-subtle: #334155;
        --tng-semantic-foreground-primary: #f8fafc;
        --tng-semantic-accent-brand: #22c55e;
        color-scheme: dark;
      "
    >
      <button
        #trigger
        type="button"
        data-slot="date-range-picker-trigger"
        data-testid="range-trigger"
        (click)="controller.open()"
      >
        Open
      </button>
    </div>

    <section
      [tngDateRangePickerOverlay]="controller"
      [tngDateRangePickerOverlayAnchor]="anchor"
      [tngDateRangePickerOverlayScrollStrategy]="scrollStrategy()"
      data-testid="range-overlay"
      style="display: block; min-height: 320px;"
    >
      Overlay
    </section>
  `,
})
class DateRangePickerOverlayThemeHostComponent implements AfterViewInit {
  @ViewChild('trigger', { static: true })
  private readonly trigger!: ElementRef<HTMLElement>;

  public readonly controller = createController({
    ownerDocument: document,
    trapFocus: true,
    value: {
      end: '2024-04-24',
      start: '2024-04-20',
    },
  });
  public readonly scrollStrategy = signal<TngOverlayScrollStrategy>('reposition');

  public ngAfterViewInit(): void {
    this.controller.registerTrigger(this.trigger.nativeElement);
  }
}

@Component({
  imports: [TngDateRangePickerOverlay],
  template: `
    <div data-testid="range-scroll-parent" style="overflow: auto; max-height: 120px;">
      <div
        #anchor
        data-slot="date-range-picker-input-shell"
        data-testid="range-scroll-anchor"
        style="width: 240px; min-height: 52px;"
      >
        <button
          #trigger
          type="button"
          data-slot="date-range-picker-trigger"
          data-testid="range-scroll-trigger"
          (click)="controller.open()"
        >
          Open
        </button>
      </div>

      <section
        [tngDateRangePickerOverlay]="controller"
        [tngDateRangePickerOverlayAnchor]="anchor"
        [tngDateRangePickerOverlayScrollStrategy]="scrollStrategy()"
        data-testid="range-scroll-overlay"
        style="display: block; min-height: 320px;"
      >
        Overlay
      </section>
    </div>
  `,
})
class DateRangePickerOverlayScrollableHostComponent implements AfterViewInit {
  @ViewChild('trigger', { static: true })
  private readonly trigger!: ElementRef<HTMLElement>;

  public readonly controller = createController({
    ownerDocument: document,
    trapFocus: true,
    value: {
      end: '2024-04-24',
      start: '2024-04-20',
    },
  });
  public readonly scrollStrategy = signal<TngOverlayScrollStrategy>('reposition');

  public ngAfterViewInit(): void {
    this.controller.registerTrigger(this.trigger.nativeElement);
  }
}

afterEach(() => {
  cleanupDom();
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

describe('tng-date-range-picker overlay behavior', () => {
  it('opens, closes, and reports close reasons', () => {
    const controller = createController();

    controller.open();
    expect(controller.getOutputs().open).toBe(true);

    controller.close('escape');
    expect(controller.getOutputs().open).toBe(false);
    expect(controller.getState().lastCloseReason).toBe('escape');
  });

  it('does not open when disabled', () => {
    const controller = createController({
      disabled: true,
    });

    controller.open();
    expect(controller.getOutputs().open).toBe(false);
  });

  it('restores focus to the trigger when closing', () => {
    const trigger = appendFocusable();
    const controller = createController({
      restoreFocus: true,
      trapFocus: true,
    });
    controller.registerTrigger(trigger);

    trigger.focus();
    controller.open();
    controller.close('programmatic');

    expect(document.activeElement).toBe(trigger);
  });

  it('registers a dismissible overlay layer while open', () => {
    const runtime = createOverlayRuntime({ documentRef: document });
    const trigger = appendFocusable();
    const overlay = document.createElement('div');
    document.body.appendChild(overlay);

    const controller = createController({
      closeOnEscape: true,
      overlayRuntime: runtime,
    });
    controller.registerTrigger(trigger);
    controller.registerOverlay(overlay);
    controller.open();

    runtime.dispatchKeydown({ key: 'Escape' });
    expect(controller.getOutputs().open).toBe(false);
  });

  it('keeps dark-mode theme vars on the portalled overlay and clears them on close', async () => {
    const fixture = TestBed.configureTestingModule({
      imports: [DateRangePickerOverlayThemeHostComponent],
    }).createComponent(DateRangePickerOverlayThemeHostComponent);

    await settle(fixture);

    const trigger = getRequired<HTMLButtonElement>(
      fixture.nativeElement,
      '[data-testid="range-trigger"]',
    );
    const overlay = getRequired<HTMLElement>(
      fixture.nativeElement,
      '[data-testid="range-overlay"]',
    );

    expect(overlay.getAttribute('hidden')).toBe('');

    trigger.click();
    await settle(fixture);

    const mountedOverlay = getRequired<HTMLElement>(document.body, '[data-testid="range-overlay"]');
    expect(mountedOverlay.parentNode).toBe(document.body);
    expect(mountedOverlay.style.position).toBe('fixed');
    expect(mountedOverlay.style.zIndex).toBe(
      'var(--tng-date-range-picker-z-overlay, var(--tng-z-overlay, 1000))',
    );
    expect(mountedOverlay.getAttribute('hidden')).toBeNull();
    expect(mountedOverlay.style.getPropertyValue('--tng-date-range-picker-surface').trim()).toBe(
      '#111827',
    );
    expect(mountedOverlay.style.getPropertyValue('--tng-date-range-picker-border').trim()).toBe(
      '#334155',
    );
    expect(mountedOverlay.style.getPropertyValue('--tng-date-range-picker-fg').trim()).toBe(
      '#f8fafc',
    );
    expect(mountedOverlay.style.getPropertyValue('--tng-date-range-picker-brand').trim()).toBe(
      '#22c55e',
    );
    expect(mountedOverlay.style.getPropertyValue('--tng-date-range-picker-nav-size').trim()).toBe(
      '2.7rem',
    );
    expect(mountedOverlay.style.getPropertyValue('--tng-date-range-picker-z-overlay').trim()).toBe(
      '9',
    );
    expect(mountedOverlay.style.colorScheme).toBe('dark');

    fixture.componentInstance.controller.close();
    await settle(fixture);

    expect(overlay.parentNode).toBe(fixture.nativeElement);
    expect(overlay.getAttribute('hidden')).toBe('');
    expect(overlay.style.getPropertyValue('--tng-date-range-picker-surface').trim()).toBe('');
    expect(overlay.style.getPropertyValue('--tng-date-range-picker-nav-size').trim()).toBe('');
    expect(overlay.style.getPropertyValue('--tng-date-range-picker-z-overlay').trim()).toBe('');
    expect(overlay.style.zIndex).toBe('');
    expect(overlay.style.colorScheme).toBe('');
  });

  it('keeps document and nested scrolling enabled by default', async () => {
    const fixture = TestBed.configureTestingModule({
      imports: [DateRangePickerOverlayScrollableHostComponent],
    }).createComponent(DateRangePickerOverlayScrollableHostComponent);

    await settle(fixture);

    const trigger = getRequired<HTMLButtonElement>(
      fixture.nativeElement,
      '[data-testid="range-scroll-trigger"]',
    );
    const scrollParent = getRequired<HTMLElement>(
      fixture.nativeElement,
      '[data-testid="range-scroll-parent"]',
    );

    expect(scrollParent.style.overflow).toBe('auto');

    trigger.click();
    await settle(fixture);

    expect(document.body.style.overflow).toBe('');
    expect(document.documentElement.style.position).toBe('');
    expect(scrollParent.style.overflow).toBe('auto');

    fixture.componentInstance.controller.close();
    await settle(fixture);

    expect(document.body.style.overflow).toBe('');
    expect(scrollParent.style.overflow).toBe('auto');
  });

  it('repositions on external scroll while the anchor remains visible', async () => {
    const fixture = TestBed.configureTestingModule({
      imports: [DateRangePickerOverlayThemeHostComponent],
    }).createComponent(DateRangePickerOverlayThemeHostComponent);

    await settle(fixture);
    const trigger = getRequired<HTMLButtonElement>(
      fixture.nativeElement,
      '[data-testid="range-trigger"]',
    );
    const anchor = getRequired<HTMLElement>(fixture.nativeElement, '[data-testid="range-anchor"]');
    trigger.click();
    await settle(fixture);

    const overlay = getRequired<HTMLElement>(document.body, '[data-testid="range-overlay"]');
    vi.spyOn(anchor, 'getBoundingClientRect').mockReturnValue(createRect(100, 140));
    const overlayRectSpy = vi
      .spyOn(overlay, 'getBoundingClientRect')
      .mockReturnValue(createRect(0, 320));

    window.dispatchEvent(new Event('scroll'));
    await waitForAnimationFrame();
    await settle(fixture);

    expect(fixture.componentInstance.controller.getOutputs().open).toBe(true);
    expect(overlayRectSpy).toHaveBeenCalled();
  });

  it('preserves the document scrollbar and locks ancestors when block is explicit', async () => {
    const fixture = TestBed.configureTestingModule({
      imports: [DateRangePickerOverlayScrollableHostComponent],
    }).createComponent(DateRangePickerOverlayScrollableHostComponent);
    fixture.componentInstance.scrollStrategy.set('block');

    await settle(fixture);
    const trigger = getRequired<HTMLButtonElement>(
      fixture.nativeElement,
      '[data-testid="range-scroll-trigger"]',
    );
    const scrollParent = getRequired<HTMLElement>(
      fixture.nativeElement,
      '[data-testid="range-scroll-parent"]',
    );
    trigger.click();
    await settle(fixture);

    expect(document.body.style.overflow).toBe('');
    expect(document.documentElement.style.position).toBe('fixed');
    expect(document.documentElement.style.overflowY).toBe('scroll');
    expect(scrollParent.style.overflow).toBe('hidden');

    fixture.componentInstance.controller.close();
    await settle(fixture);

    expect(document.documentElement.style.position).toBe('');
    expect(document.documentElement.style.overflowY).toBe('');
    expect(scrollParent.style.overflow).toBe('auto');
  });

  it('closes when scrolling clips the anchor out of the viewport', async () => {
    const fixture = TestBed.configureTestingModule({
      imports: [DateRangePickerOverlayThemeHostComponent],
    }).createComponent(DateRangePickerOverlayThemeHostComponent);

    await settle(fixture);
    const trigger = getRequired<HTMLButtonElement>(
      fixture.nativeElement,
      '[data-testid="range-trigger"]',
    );
    const anchor = getRequired<HTMLElement>(fixture.nativeElement, '[data-testid="range-anchor"]');
    trigger.focus();
    trigger.click();
    await settle(fixture);
    const focusSpy = vi.spyOn(trigger, 'focus');

    vi.spyOn(anchor, 'getBoundingClientRect').mockReturnValue(createRect(-80, -40));
    window.dispatchEvent(new Event('scroll'));
    await settle(fixture);

    expect(fixture.componentInstance.controller.getOutputs().open).toBe(false);
    expect(focusSpy).not.toHaveBeenCalled();
  });

  it('closes on the first external scroll when close is explicit', async () => {
    const fixture = TestBed.configureTestingModule({
      imports: [DateRangePickerOverlayThemeHostComponent],
    }).createComponent(DateRangePickerOverlayThemeHostComponent);
    fixture.componentInstance.scrollStrategy.set('close');

    await settle(fixture);
    const trigger = getRequired<HTMLButtonElement>(
      fixture.nativeElement,
      '[data-testid="range-trigger"]',
    );
    trigger.focus();
    trigger.click();
    await settle(fixture);
    const focusSpy = vi.spyOn(trigger, 'focus');

    window.dispatchEvent(new Event('scroll'));
    await settle(fixture);

    expect(fixture.componentInstance.controller.getOutputs().open).toBe(false);
    expect(focusSpy).not.toHaveBeenCalled();
  });

  it('computes layout values for overlay, push, and side modes', () => {
    const overlayController = createController({
      overlayMode: 'overlay',
    });
    overlayController.open();
    expect(overlayController.getOutputs().layout).toEqual({
      mode: 'overlay',
      offsetX: 0,
      width: 0,
    });

    const pushController = createController({
      overlayMode: 'push',
      overlaySize: 280,
      position: 'start',
    });
    pushController.open();
    expect(pushController.getOutputs().layout).toEqual({
      mode: 'push',
      offsetX: 280,
      width: 280,
    });

    const sideController = createController({
      direction: 'rtl',
      overlayMode: 'side',
      overlaySize: 320,
      position: 'end',
    });
    sideController.open();
    expect(sideController.getOutputs().layout).toEqual({
      mode: 'side',
      offsetX: 320,
      width: 320,
    });
  });

  it('toggles from the trigger and emits stable openedChange events without duplicates', () => {
    const controller = createController();
    const events = collectEvents(controller);

    controller.toggleOpen();
    controller.open();
    controller.toggleOpen();
    controller.close('programmatic');

    expect(controller.getOutputs().open).toBe(false);
    expect(events.map((event) => event.type)).toEqual([
      'openStart',
      'opened',
      'closeStart',
      'closed',
    ]);
  });

  it('closes on outside pointerdown only when outside close is enabled', () => {
    const trigger = appendFocusable('button');
    const overlay = document.createElement('div');
    document.body.append(overlay);

    const closable = createController({
      ownerDocument: document,
    });
    closable.registerTrigger(trigger);
    closable.registerOverlay(overlay);
    closable.open();
    document.body.dispatchEvent(new MouseEvent('pointerdown', { bubbles: true }));
    expect(closable.getOutputs().open).toBe(false);
    expect(closable.getState().lastCloseReason).toBe('outside');

    const sticky = createController({
      closeOnOutsideClick: false,
      ownerDocument: document,
    });
    sticky.registerTrigger(trigger);
    sticky.registerOverlay(overlay);
    sticky.open();
    document.body.dispatchEvent(new MouseEvent('pointerdown', { bubbles: true }));
    expect(sticky.getOutputs().open).toBe(true);
  });

  it('auto-closes only after a complete range selection when closeOnSelect is enabled', () => {
    const controller = createController({
      closeOnSelect: true,
    });
    controller.open();

    controller.selectDate('2024-04-20');
    expect(controller.getOutputs().open).toBe(true);

    controller.handleCellPointerEnter('2024-04-24');
    expect(controller.getOutputs().open).toBe(true);

    controller.selectDate('2024-04-24');
    expect(controller.getOutputs().open).toBe(false);
    expect(controller.getState().lastCloseReason).toBe('select');
    expect(controller.getOutputs().previewEndDate).toBeNull();
  });

  it('preserves selected range across close and reopen and focuses the selected anchor', () => {
    const controller = createController({
      value: {
        end: '2024-04-24',
        start: '2024-04-20',
      },
    });

    controller.open();
    controller.close('programmatic');
    controller.open();

    expect(dateKey(controller.getOutputs().startDate as Date)).toBe('2024-04-20');
    expect(dateKey(controller.getOutputs().endDate as Date)).toBe('2024-04-24');
    expect(dateKey(controller.getOutputs().activeDate)).toBe('2024-04-24');
  });

  it('uses today as the active open target when no range exists', () => {
    const controller = createController({
      today: '2024-05-08',
      value: null,
    });

    controller.open();
    expect(dateKey(controller.getOutputs().activeDate)).toBe('2024-05-08');
  });
});
