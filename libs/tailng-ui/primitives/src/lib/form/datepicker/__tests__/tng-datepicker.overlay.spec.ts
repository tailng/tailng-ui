import { AfterViewInit, Component, ElementRef, ViewChild, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { afterEach, describe, expect, it, vi } from 'vitest';
import type { TngOverlayScrollStrategy } from '@tailng-ui/cdk';
import { createDatepickerController } from '../tng-datepicker';
import { TngDatepickerOverlay } from '../tng-datepicker.overlay';

function createRect(top: number, bottom: number, width = 240): DOMRect {
  return {
    x: 0,
    y: top,
    width,
    height: bottom - top,
    top,
    right: width,
    bottom,
    left: 0,
    toJSON: () => ({}),
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

async function waitForAnimationFrame(): Promise<void> {
  await new Promise<void>((resolve) => {
    requestAnimationFrame(() => resolve());
  });
}

function getRequired<T extends Element>(root: ParentNode, selector: string): T {
  const element = root.querySelector(selector) as T | null;
  if (element === null) {
    throw new Error(`Expected selector ${selector} to exist.`);
  }

  return element;
}

@Component({
  imports: [TngDatepickerOverlay],
  template: `
    <div
      #anchor
      data-slot="datepicker-input-shell"
      data-testid="anchor"
      style="
        width: 240px;
        min-height: 52px;
        --tng-datepicker-nav-size: 2.8rem;
        --tng-datepicker-overlay-min-width: 304px;
        --tng-datepicker-overlay-max-width: 336px;
        --tng-datepicker-surface: #f8fafc;
        --tng-datepicker-border: #d8e2ef;
        --tng-datepicker-fg: #0f172a;
        --tng-datepicker-brand: #2563eb;
        --tng-overlay-enter-duration: 333ms;
        --tng-overlay-exit-duration: 222ms;
        --tng-semantic-background-surface: #f8fafc;
        --tng-semantic-border-subtle: #d8e2ef;
        --tng-semantic-foreground-primary: #0f172a;
        --tng-semantic-accent-brand: #2563eb;
        color-scheme: light;
      "
    >
      <button
        #trigger
        type="button"
        data-slot="datepicker-trigger"
        data-testid="trigger"
        (click)="controller.open()"
      >
        Open
      </button>
    </div>

    <section
      [tngDatepickerOverlay]="controller"
      [tngDatepickerOverlayAnchor]="anchor"
      [tngDatepickerOverlayMaxSize]="336"
      [tngDatepickerOverlayMinSize]="304"
      [tngDatepickerOverlayScrollStrategy]="scrollStrategy()"
      data-testid="overlay"
      style="display: block; min-height: 320px;"
    >
      Overlay
    </section>
  `,
})
class DatepickerOverlayHostComponent implements AfterViewInit {
  @ViewChild('trigger', { static: true })
  private readonly trigger!: ElementRef<HTMLElement>;

  public readonly controller = createDatepickerController<Date>({
    ownerDocument: document,
    trapFocus: true,
    value: '2024-04-22',
  });
  public readonly scrollStrategy = signal<TngOverlayScrollStrategy>('reposition');

  public ngAfterViewInit(): void {
    this.controller.registerTrigger(this.trigger.nativeElement);
  }
}

@Component({
  imports: [TngDatepickerOverlay],
  template: `
    <div data-testid="scroll-parent" style="overflow: auto; max-height: 120px;">
      <div
        #anchor
        data-slot="datepicker-input-shell"
        data-testid="scroll-anchor"
        style="width: 240px; min-height: 52px;"
      >
        <button
          #trigger
          type="button"
          data-slot="datepicker-trigger"
          data-testid="scroll-trigger"
          (click)="controller.open()"
        >
          Open
        </button>
      </div>

      <section
        [tngDatepickerOverlay]="controller"
        [tngDatepickerOverlayAnchor]="anchor"
        [tngDatepickerOverlayScrollStrategy]="scrollStrategy()"
        data-testid="scroll-overlay"
        style="display: block; min-height: 320px;"
      >
        Overlay
      </section>
    </div>
  `,
})
class DatepickerOverlayScrollableHostComponent implements AfterViewInit {
  @ViewChild('trigger', { static: true })
  private readonly trigger!: ElementRef<HTMLElement>;

  public readonly controller = createDatepickerController<Date>({
    ownerDocument: document,
    trapFocus: true,
    value: '2024-04-22',
  });
  public readonly scrollStrategy = signal<TngOverlayScrollStrategy>('reposition');

  public ngAfterViewInit(): void {
    this.controller.registerTrigger(this.trigger.nativeElement);
  }
}

describe('tng-datepicker.overlay', () => {
  afterEach(() => {
    document.body
      .querySelectorAll('[data-testid="overlay"], [data-testid="scroll-overlay"]')
      .forEach((element) => element.remove());
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

  it('mounts the overlay into document.body while open and restores it when closed', async () => {
    const fixture = TestBed.configureTestingModule({
      imports: [DatepickerOverlayHostComponent],
    }).createComponent(DatepickerOverlayHostComponent);

    await settle(fixture);

    const trigger = getRequired<HTMLButtonElement>(
      fixture.nativeElement,
      '[data-testid="trigger"]',
    );
    const overlay = getRequired<HTMLElement>(fixture.nativeElement, '[data-testid="overlay"]');

    expect(overlay.getAttribute('hidden')).toBe('');

    trigger.click();
    await settle(fixture);

    const mountedOverlay = getRequired<HTMLElement>(document.body, '[data-testid="overlay"]');
    expect(mountedOverlay.parentNode).toBe(document.body);
    expect(mountedOverlay.style.position).toBe('fixed');
    expect(document.body.style.overflow).toBe('');
    expect(document.documentElement.style.position).toBe('');
    expect(mountedOverlay.style.zIndex).toBe(
      'var(--tng-datepicker-z-overlay, var(--tng-z-overlay, 1000))',
    );
    expect(mountedOverlay.getAttribute('hidden')).toBeNull();
    expect(mountedOverlay.style.getPropertyValue('--tng-datepicker-surface').trim()).toBe(
      '#f8fafc',
    );
    expect(mountedOverlay.style.getPropertyValue('--tng-datepicker-border').trim()).toBe('#d8e2ef');
    expect(mountedOverlay.style.getPropertyValue('--tng-datepicker-fg').trim()).toBe('#0f172a');
    expect(mountedOverlay.style.getPropertyValue('--tng-datepicker-brand').trim()).toBe('#2563eb');
    expect(mountedOverlay.style.getPropertyValue('--tng-datepicker-nav-size').trim()).toBe(
      '2.8rem',
    );
    expect(mountedOverlay.style.getPropertyValue('--tng-datepicker-overlay-min-width').trim()).toBe(
      '304px',
    );
    expect(mountedOverlay.style.getPropertyValue('--tng-datepicker-overlay-max-width').trim()).toBe(
      '336px',
    );
    expect(mountedOverlay.style.minWidth).toBe('304px');
    expect(mountedOverlay.style.maxWidth).toBe('336px');
    expect(mountedOverlay.style.width).toBe('304px');
    expect(mountedOverlay.style.getPropertyValue('--tng-overlay-enter-duration').trim()).toBe(
      '333ms',
    );
    expect(mountedOverlay.style.getPropertyValue('--tng-overlay-exit-duration').trim()).toBe(
      '222ms',
    );
    expect(mountedOverlay.style.colorScheme).toBe('light');

    fixture.componentInstance.controller.close();
    await settle(fixture);

    expect(overlay.parentNode).toBe(fixture.nativeElement);
    expect(overlay.getAttribute('hidden')).toBe('');
    expect(overlay.style.getPropertyValue('--tng-datepicker-surface').trim()).toBe('');
    expect(overlay.style.getPropertyValue('--tng-datepicker-border').trim()).toBe('');
    expect(overlay.style.getPropertyValue('--tng-datepicker-nav-size').trim()).toBe('');
    expect(overlay.style.getPropertyValue('--tng-datepicker-overlay-min-width').trim()).toBe('');
    expect(overlay.style.getPropertyValue('--tng-datepicker-overlay-max-width').trim()).toBe('');
    expect(overlay.style.getPropertyValue('--tng-overlay-enter-duration').trim()).toBe('');
    expect(overlay.style.minWidth).toBe('');
    expect(overlay.style.maxWidth).toBe('');
    expect(overlay.style.width).toBe('');
    expect(overlay.style.zIndex).toBe('');
    expect(overlay.style.colorScheme).toBe('');
    expect(document.body.style.overflow).toBe('');
  });

  it('keeps an exiting overlay mounted and inert until its animation completes', async () => {
    const fixture = TestBed.configureTestingModule({
      imports: [DatepickerOverlayHostComponent],
    }).createComponent(DatepickerOverlayHostComponent);

    await settle(fixture);
    getRequired<HTMLButtonElement>(fixture.nativeElement, '[data-testid="trigger"]').click();
    await settle(fixture);

    const overlay = getRequired<HTMLElement>(document.body, '[data-testid="overlay"]');
    overlay.style.animationName = 'test-datepicker-exit';
    overlay.style.animationDuration = '10s';
    overlay.style.animationDelay = '0s';

    fixture.componentInstance.controller.close();
    fixture.detectChanges();

    expect(overlay.parentNode).toBe(document.body);
    expect(overlay.getAttribute('data-presence')).toBe('exiting');
    expect(overlay.getAttribute('aria-hidden')).toBe('true');
    expect(overlay.hasAttribute('inert')).toBe(true);
    expect(overlay.hasAttribute('hidden')).toBe(false);

    overlay.dispatchEvent(new Event('animationend', { bubbles: true }));
    await settle(fixture);

    expect(overlay.parentNode).toBe(fixture.nativeElement);
    expect(overlay.getAttribute('data-presence')).toBe('closed');
    expect(overlay.getAttribute('hidden')).toBe('');
  });

  it('flips the overlay above the anchor when there is more available space above', async () => {
    const fixture = TestBed.configureTestingModule({
      imports: [DatepickerOverlayHostComponent],
    }).createComponent(DatepickerOverlayHostComponent);

    await settle(fixture);

    const trigger = getRequired<HTMLButtonElement>(
      fixture.nativeElement,
      '[data-testid="trigger"]',
    );
    const anchor = getRequired<HTMLElement>(fixture.nativeElement, '[data-testid="anchor"]');
    const originalInnerHeight = window.innerHeight;

    trigger.click();
    await settle(fixture);

    const overlay = getRequired<HTMLElement>(document.body, '[data-testid="overlay"]');
    vi.spyOn(anchor, 'getBoundingClientRect').mockReturnValue(createRect(700, 740));
    vi.spyOn(overlay, 'getBoundingClientRect').mockReturnValue(createRect(0, 320));
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

  it('repositions from scroll events by default without locking the page', async () => {
    const fixture = TestBed.configureTestingModule({
      imports: [DatepickerOverlayHostComponent],
    }).createComponent(DatepickerOverlayHostComponent);

    await settle(fixture);

    const trigger = getRequired<HTMLButtonElement>(
      fixture.nativeElement,
      '[data-testid="trigger"]',
    );
    trigger.click();
    await settle(fixture);

    const overlay = getRequired<HTMLElement>(document.body, '[data-testid="overlay"]');
    const anchor = getRequired<HTMLElement>(fixture.nativeElement, '[data-testid="anchor"]');
    vi.spyOn(anchor, 'getBoundingClientRect').mockReturnValue(createRect(100, 140));
    const overlayRectSpy = vi
      .spyOn(overlay, 'getBoundingClientRect')
      .mockReturnValue(createRect(0, 320));

    expect(document.body.style.overflow).toBe('');
    expect(document.documentElement.style.position).toBe('');

    window.dispatchEvent(new Event('scroll'));
    await waitForAnimationFrame();
    await settle(fixture);

    expect(fixture.componentInstance.controller.getOutputs().open).toBe(true);
    expect(overlay.parentNode).toBe(document.body);
    expect(overlay.getAttribute('hidden')).toBeNull();
    expect(overlayRectSpy).toHaveBeenCalled();
  });

  it('preserves the document scrollbar and locks ancestors when block is explicit', async () => {
    const fixture = TestBed.configureTestingModule({
      imports: [DatepickerOverlayScrollableHostComponent],
    }).createComponent(DatepickerOverlayScrollableHostComponent);
    fixture.componentInstance.scrollStrategy.set('block');

    await settle(fixture);

    const trigger = getRequired<HTMLButtonElement>(
      fixture.nativeElement,
      '[data-testid="scroll-trigger"]',
    );
    const scrollParent = getRequired<HTMLElement>(
      fixture.nativeElement,
      '[data-testid="scroll-parent"]',
    );

    expect(scrollParent.style.overflow).toBe('auto');

    trigger.click();
    await settle(fixture);

    expect(document.body.style.overflow).toBe('');
    expect(document.documentElement.style.position).toBe('fixed');
    expect(document.documentElement.style.overflowY).toBe('scroll');
    expect(scrollParent.style.overflow).toBe('hidden');

    fixture.componentInstance.controller.close();
    await settle(fixture);

    expect(document.body.style.overflow).toBe('');
    expect(document.documentElement.style.position).toBe('');
    expect(document.documentElement.style.overflowY).toBe('');
    expect(scrollParent.style.overflow).toBe('auto');
  });

  it('closes when scrolling clips the anchor out of the viewport', async () => {
    const fixture = TestBed.configureTestingModule({
      imports: [DatepickerOverlayHostComponent],
    }).createComponent(DatepickerOverlayHostComponent);

    await settle(fixture);
    const trigger = getRequired<HTMLButtonElement>(
      fixture.nativeElement,
      '[data-testid="trigger"]',
    );
    const anchor = getRequired<HTMLElement>(fixture.nativeElement, '[data-testid="anchor"]');
    trigger.focus();
    trigger.click();
    await settle(fixture);
    const focusSpy = vi.spyOn(trigger, 'focus');

    vi.spyOn(anchor, 'getBoundingClientRect').mockReturnValue(createRect(-80, -40));
    window.dispatchEvent(new Event('scroll'));
    await settle(fixture);

    expect(fixture.componentInstance.controller.getOutputs().open).toBe(false);
    expect(focusSpy).not.toHaveBeenCalled();
    expect(getRequired<HTMLElement>(fixture.nativeElement, '[data-testid="overlay"]').hidden).toBe(
      true,
    );
  });

  it('closes on the first external scroll when close is explicit', async () => {
    const fixture = TestBed.configureTestingModule({
      imports: [DatepickerOverlayHostComponent],
    }).createComponent(DatepickerOverlayHostComponent);
    fixture.componentInstance.scrollStrategy.set('close');

    await settle(fixture);
    const trigger = getRequired<HTMLButtonElement>(
      fixture.nativeElement,
      '[data-testid="trigger"]',
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
});
