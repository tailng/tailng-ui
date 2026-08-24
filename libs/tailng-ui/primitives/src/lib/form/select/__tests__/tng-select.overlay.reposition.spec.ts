import { Component, ViewChild, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest';
import type { TngOverlayScrollStrategy } from '@tailng-ui/cdk';

import { TngSelect } from '../tng-select';
import { TngSelectTrigger, TngSelectContent } from '../tng-select.parts';
import { TngSelectOverlay } from '../tng-select.overlay';
import { TngSelectListbox, TngSelectOption } from '../tng-select.listbox';

function pointerdown(el: HTMLElement, init: Partial<PointerEventInit> = {}): void {
  el.dispatchEvent(
    new PointerEvent('pointerdown', {
      bubbles: true,
      cancelable: true,
      button: 0,
      ...init,
    }),
  );
}

function dispatchWindowScroll(): void {
  // use capture listeners often attached to window/document
  window.dispatchEvent(new Event('scroll'));
  document.dispatchEvent(new Event('scroll'));
}

@Component({
  imports: [
    TngSelect,
    TngSelectTrigger,
    TngSelectContent,
    TngSelectOverlay,
    TngSelectListbox,
    TngSelectOption,
  ],
  template: `
    <button
      tngSelect
      #api="tngSelect"
      [open]="open()"
      (openChange)="open.set($event)"
      data-testid="select"
    >
      <span tngSelectTrigger data-testid="trigger">Trigger</span>

      <div tngSelectContent data-testid="content">
        <!-- portaled panel -->
        <div tngSelectOverlay data-testid="overlay">
          <div tngSelectListbox data-testid="listbox">
            <div tngSelectOption [tngValue]="'a'">A</div>
          </div>
        </div>
      </div>
    </button>
  `,
})
class HostComponent {
  @ViewChild('api', { static: true }) api!: TngSelect<string>;
  open = signal(false);
}

@Component({
  imports: [
    TngSelect,
    TngSelectTrigger,
    TngSelectContent,
    TngSelectOverlay,
    TngSelectListbox,
    TngSelectOption,
  ],
  template: `
    <div data-testid="scroll-parent" style="height: 120px; overflow: auto">
      <button
        tngSelect
        #api="tngSelect"
        [open]="open()"
        (openChange)="open.set($event)"
        data-testid="select"
      >
        <span tngSelectTrigger data-testid="trigger">Trigger</span>

        <div tngSelectContent data-testid="content">
          <div tngSelectOverlay [scrollStrategy]="scrollStrategy()" data-testid="overlay">
            <div tngSelectListbox data-testid="listbox">
              <div tngSelectOption [tngValue]="'a'">A</div>
            </div>
          </div>
        </div>
      </button>
    </div>
  `,
})
class ScrollStrategyHostComponent {
  @ViewChild('api', { static: true }) api!: TngSelect<string>;
  open = signal(false);
  scrollStrategy = signal<TngOverlayScrollStrategy>('block');
}

describe('tng-select overlay primitive (scroll lock + reposition)', () => {
  let addSpy: ReturnType<typeof vi.spyOn>;
  let removeSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    addSpy = vi.spyOn(window, 'addEventListener');
    removeSpy = vi.spyOn(window, 'removeEventListener');
  });

  afterEach(() => {
    addSpy.mockRestore();
    removeSpy.mockRestore();
    document.body.innerHTML = '';
    document.body.style.overflow = '';
    document.body.style.paddingRight = '';
    document.documentElement.style.left = '';
    document.documentElement.style.overflowY = '';
    document.documentElement.style.position = '';
    document.documentElement.style.top = '';
    document.documentElement.style.width = '';
  });

  it('does not reposition while closed (no measurements)', () => {
    const fixture = TestBed.configureTestingModule({ imports: [HostComponent] }).createComponent(
      HostComponent,
    );
    fixture.detectChanges();

    const trigger = fixture.nativeElement.querySelector('[data-testid="trigger"]') as HTMLElement;
    const overlay = fixture.nativeElement.querySelector('[data-testid="overlay"]') as HTMLElement;

    const triggerRectSpy = vi.spyOn(trigger, 'getBoundingClientRect');
    const overlayRectSpy = vi.spyOn(overlay, 'getBoundingClientRect');

    // dispatch events while closed
    window.dispatchEvent(new Event('resize'));
    dispatchWindowScroll();

    expect(triggerRectSpy).not.toHaveBeenCalled();
    expect(overlayRectSpy).not.toHaveBeenCalled();
  });

  it('repositions on resize when open - measures trigger + overlay', async () => {
    const fixture = TestBed.configureTestingModule({
      imports: [HostComponent],
    }).createComponent(HostComponent);
    fixture.detectChanges();

    const trigger = fixture.nativeElement.querySelector('[data-testid="trigger"]') as HTMLElement;
    const overlay = fixture.nativeElement.querySelector('[data-testid="overlay"]') as HTMLElement;

    // IMPORTANT: overlay will be moved to body; spy must be set before open
    const triggerRectSpy = vi.spyOn(trigger, 'getBoundingClientRect').mockReturnValue({
      left: 100,
      top: 100,
      width: 80,
      height: 30,
      right: 180,
      bottom: 130,
      x: 100,
      y: 100,
      toJSON: () => ({}),
    } as any);

    const overlayRectSpy = vi.spyOn(overlay, 'getBoundingClientRect').mockReturnValue({
      left: 0,
      top: 0,
      width: 120,
      height: 60,
      right: 120,
      bottom: 60,
      x: 0,
      y: 0,
      toJSON: () => ({}),
    } as any);

    // open
    pointerdown(trigger);
    fixture.detectChanges();

    // flush initial queueMicrotask positioning
    await Promise.resolve();

    // clear initial positioning measurements so we only assert "resize caused it"
    triggerRectSpy.mockClear();
    overlayRectSpy.mockClear();

    window.dispatchEvent(new Event('resize'));

    // ✅ overlay batches reposition via requestAnimationFrame
    await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));

    expect(triggerRectSpy).toHaveBeenCalled();
    expect(overlayRectSpy).toHaveBeenCalled();
  });

  it('repositions on scroll by default without locking the page', async () => {
    const fixture = TestBed.configureTestingModule({
      imports: [HostComponent],
    }).createComponent(HostComponent);
    fixture.detectChanges();

    const trigger = fixture.nativeElement.querySelector('[data-testid="trigger"]') as HTMLElement;
    const overlay = fixture.nativeElement.querySelector('[data-testid="overlay"]') as HTMLElement;

    const triggerRectSpy = vi.spyOn(trigger, 'getBoundingClientRect').mockReturnValue({
      left: 100,
      top: 100,
      width: 80,
      height: 30,
      right: 180,
      bottom: 130,
      x: 100,
      y: 100,
      toJSON: () => ({}),
    } as any);

    const overlayRectSpy = vi.spyOn(overlay, 'getBoundingClientRect').mockReturnValue({
      left: 0,
      top: 0,
      width: 120,
      height: 60,
      right: 120,
      bottom: 60,
      x: 0,
      y: 0,
      toJSON: () => ({}),
    } as any);

    // open
    pointerdown(trigger);
    fixture.detectChanges();

    // flush initial queueMicrotask positioning
    await Promise.resolve();

    expect(document.body.style.overflow).toBe('');
    expect(document.documentElement.style.position).toBe('');

    // clear initial calls
    triggerRectSpy.mockClear();
    overlayRectSpy.mockClear();

    // dispatch scroll on both common targets (impls vary)
    window.dispatchEvent(new Event('scroll'));
    document.dispatchEvent(new Event('scroll'));

    // ✅ reposition is typically rAF-batched
    await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));

    expect(triggerRectSpy).toHaveBeenCalled();
    expect(overlayRectSpy).toHaveBeenCalled();

    fixture.componentInstance.open.set(false);
    fixture.detectChanges();

    expect(document.body.style.overflow).toBe('');
  });

  it('preserves the document scrollbar and blocks nested scrolling when block is explicit', async () => {
    const fixture = TestBed.configureTestingModule({
      imports: [ScrollStrategyHostComponent],
    }).createComponent(ScrollStrategyHostComponent);
    fixture.detectChanges();

    const host = fixture.componentInstance;
    const scrollParent = fixture.nativeElement.querySelector(
      '[data-testid="scroll-parent"]',
    ) as HTMLElement;
    const trigger = fixture.nativeElement.querySelector('[data-testid="trigger"]') as HTMLElement;

    pointerdown(trigger);
    fixture.detectChanges();
    await Promise.resolve();

    expect(host.api.open()).toBe(true);
    expect(document.body.style.overflow).toBe('');
    expect(document.documentElement.style.position).toBe('fixed');
    expect(document.documentElement.style.overflowY).toBe('scroll');
    expect(scrollParent.style.overflow).toBe('hidden');

    host.open.set(false);
    fixture.detectChanges();

    expect(document.body.style.overflow).toBe('');
    expect(document.documentElement.style.position).toBe('');
    expect(document.documentElement.style.overflowY).toBe('');
    expect(scrollParent.style.overflow).toBe('auto');
  });

  it('closes on scroll when scrollStrategy is close', async () => {
    const fixture = TestBed.configureTestingModule({
      imports: [ScrollStrategyHostComponent],
    }).createComponent(ScrollStrategyHostComponent);
    fixture.componentInstance.scrollStrategy.set('close');
    fixture.detectChanges();

    const host = fixture.componentInstance;
    const trigger = fixture.nativeElement.querySelector('[data-testid="trigger"]') as HTMLElement;

    pointerdown(trigger);
    fixture.detectChanges();
    await Promise.resolve();

    expect(host.api.open()).toBe(true);
    expect(document.body.style.overflow).toBe('');

    window.dispatchEvent(new Event('scroll'));
    fixture.detectChanges();

    expect(host.api.open()).toBe(false);
  });

  it('stops repositioning after close (no measurements after events)', async () => {
    const fixture = TestBed.configureTestingModule({ imports: [HostComponent] }).createComponent(
      HostComponent,
    );
    fixture.detectChanges();

    const host = fixture.componentInstance;
    const trigger = fixture.nativeElement.querySelector('[data-testid="trigger"]') as HTMLElement;
    const overlay = fixture.nativeElement.querySelector('[data-testid="overlay"]') as HTMLElement;

    const triggerRectSpy = vi.spyOn(trigger, 'getBoundingClientRect').mockReturnValue({
      left: 100,
      top: 100,
      width: 80,
      height: 30,
      right: 180,
      bottom: 130,
      x: 100,
      y: 100,
      toJSON: () => ({}),
    } as any);

    const overlayRectSpy = vi.spyOn(overlay, 'getBoundingClientRect').mockReturnValue({
      left: 0,
      top: 0,
      width: 120,
      height: 60,
      right: 120,
      bottom: 60,
      x: 0,
      y: 0,
      toJSON: () => ({}),
    } as any);

    pointerdown(trigger);
    fixture.detectChanges();
    await Promise.resolve();

    // close programmatically
    host.open.set(false);
    fixture.detectChanges();

    triggerRectSpy.mockClear();
    overlayRectSpy.mockClear();

    window.dispatchEvent(new Event('resize'));
    dispatchWindowScroll();
    await Promise.resolve();

    expect(triggerRectSpy).not.toHaveBeenCalled();
    expect(overlayRectSpy).not.toHaveBeenCalled();
  });

  it('adds listeners on open and removes them on close/destroy', async () => {
    const fixture = TestBed.configureTestingModule({ imports: [HostComponent] }).createComponent(
      HostComponent,
    );
    fixture.detectChanges();

    const host = fixture.componentInstance;
    const trigger = fixture.nativeElement.querySelector('[data-testid="trigger"]') as HTMLElement;

    // open
    pointerdown(trigger);
    fixture.detectChanges();
    await Promise.resolve();

    // We don't pin exact options, just that resize is registered for anchored layout updates.
    const addCalls = addSpy.mock.calls.map(([type]) => type);
    expect(addCalls).toContain('resize');
    expect(addCalls).toContain('scroll');

    // close
    host.open.set(false);
    fixture.detectChanges();

    const removeCalls = removeSpy.mock.calls.map(([type]) => type);
    expect(removeCalls).toContain('resize');
    expect(removeCalls).toContain('scroll');

    // destroy also safe (no throw); if already removed, this just ensures no regressions
    fixture.destroy();
  });
});
