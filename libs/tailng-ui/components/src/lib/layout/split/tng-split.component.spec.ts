import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { describe, expect, it, vi } from 'vitest';
import {
  TngSplitGroupComponent,
  TngSplitHandleComponent,
  TngSplitPaneDirective,
} from './tng-split.component';

@Component({
  imports: [TngSplitGroupComponent, TngSplitHandleComponent, TngSplitPaneDirective],
  template: `
    <tng-split-group #group style="width: 1200px; height: 600px" [orientation]="orientation()">
      <aside
        tngSplitPane
        paneId="palette"
        [defaultSize]="272"
        [minSize]="224"
        [maxSize]="360"
        collapsible
        [collapsed]="paletteCollapsed()"
        [collapsedSize]="56"
        (collapsedChange)="paletteCollapsed.set($event)"
      ></aside>
      <tng-split-handle ariaLabel="Resize palette" />
      <main tngSplitPane paneId="canvas" [grow]="1" [minSize]="480"></main>
      <tng-split-handle ariaLabel="Resize inspector" />
      <aside
        tngSplitPane
        paneId="inspector"
        [defaultSize]="352"
        [minSize]="288"
        [maxSize]="480"
        collapsible
        [collapsed]="inspectorCollapsed()"
        (collapsedChange)="inspectorCollapsed.set($event)"
      ></aside>
    </tng-split-group>
  `,
})
class SplitFixtureComponent {
  public readonly orientation = signal<'horizontal' | 'vertical'>('horizontal');
  public readonly paletteCollapsed = signal(false);
  public readonly inspectorCollapsed = signal(false);
}

async function createFixture() {
  const fixture = TestBed.createComponent(SplitFixtureComponent);
  fixture.detectChanges();
  await fixture.whenStable();
  fixture.detectChanges();
  const group = fixture.debugElement.children[0].componentInstance as TngSplitGroupComponent;
  group.recalculate();
  fixture.detectChanges();
  return { fixture, group, host: fixture.nativeElement as HTMLElement };
}

describe('TngSplitGroupComponent', () => {
  it('defers ResizeObserver-driven layout work to an animation frame', async () => {
    const resizeObserverDescriptor = Object.getOwnPropertyDescriptor(window, 'ResizeObserver');
    const requestFrameDescriptor = Object.getOwnPropertyDescriptor(window, 'requestAnimationFrame');
    const cancelFrameDescriptor = Object.getOwnPropertyDescriptor(window, 'cancelAnimationFrame');
    let observerCallback: ResizeObserverCallback | null = null;
    let observerInstance: ResizeObserver | null = null;

    class ControllableResizeObserver implements ResizeObserver {
      public constructor(callback: ResizeObserverCallback) {
        observerCallback = callback;
        observerInstance = this;
      }

      public disconnect(): void {}
      public observe(): void {}
      public unobserve(): void {}
    }

    let scheduledFrame: FrameRequestCallback | null = null;
    const requestFrame = vi.fn((callback: FrameRequestCallback): number => {
      scheduledFrame = callback;
      return 17;
    });
    const cancelFrame = vi.fn();

    Object.defineProperty(window, 'ResizeObserver', {
      configurable: true,
      value: ControllableResizeObserver,
    });
    Object.defineProperty(window, 'requestAnimationFrame', {
      configurable: true,
      value: requestFrame,
    });
    Object.defineProperty(window, 'cancelAnimationFrame', {
      configurable: true,
      value: cancelFrame,
    });

    try {
      const { fixture } = await createFixture();

      expect(observerCallback).not.toBeNull();
      expect(observerInstance).not.toBeNull();
      requestFrame.mockClear();
      scheduledFrame = null;
      (observerCallback as ResizeObserverCallback)([], observerInstance as ResizeObserver);
      (observerCallback as ResizeObserverCallback)([], observerInstance as ResizeObserver);

      expect(requestFrame).toHaveBeenCalledTimes(1);
      expect(scheduledFrame).not.toBeNull();

      fixture.destroy();
      expect(cancelFrame).toHaveBeenCalledWith(17);
    } finally {
      if (resizeObserverDescriptor === undefined) {
        Reflect.deleteProperty(window, 'ResizeObserver');
      } else {
        Object.defineProperty(window, 'ResizeObserver', resizeObserverDescriptor);
      }
      if (requestFrameDescriptor === undefined) {
        Reflect.deleteProperty(window, 'requestAnimationFrame');
      } else {
        Object.defineProperty(window, 'requestAnimationFrame', requestFrameDescriptor);
      }
      if (cancelFrameDescriptor === undefined) {
        Reflect.deleteProperty(window, 'cancelAnimationFrame');
      } else {
        Object.defineProperty(window, 'cancelAnimationFrame', cancelFrameDescriptor);
      }
    }
  });

  it('allocates fixed and grow panes and wires separator aria metadata', async () => {
    const { host } = await createFixture();
    const panes = host.querySelectorAll<HTMLElement>('[tngSplitPane]');
    const handles = host.querySelectorAll<HTMLElement>('tng-split-handle');

    expect(panes[0]?.style.width).toBe('272px');
    expect(panes[1]?.style.width).toBe('574px');
    expect(panes[2]?.style.width).toBe('352px');
    expect(handles[0]?.getAttribute('role')).toBe('separator');
    expect(handles[0]?.getAttribute('aria-orientation')).toBe('vertical');
    expect(handles[0]?.getAttribute('aria-controls')?.split(' ')).toHaveLength(2);
  });

  it('resizes with keyboard steps and emits a final lifecycle event', async () => {
    const { host, group } = await createFixture();
    const handle = host.querySelectorAll<HTMLElement>('tng-split-handle')[0];
    const resizeEnd = vi.fn();
    group.resizeEnd.subscribe(resizeEnd);

    handle.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }));

    expect(host.querySelectorAll<HTMLElement>('[tngSplitPane]')[0]?.style.width).toBe('282px');
    expect(resizeEnd).toHaveBeenCalledWith(
      expect.objectContaining({ previousPaneId: 'palette', source: 'keyboard' }),
    );
  });

  it('toggles the sole collapsible primary pane with Enter and restores it', async () => {
    const { fixture, host } = await createFixture();
    const handle = host.querySelectorAll<HTMLElement>('tng-split-handle')[0];
    const palette = host.querySelectorAll<HTMLElement>('[tngSplitPane]')[0];

    handle.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
    expect(palette.hasAttribute('data-collapsed')).toBe(true);
    expect(palette.style.width).toBe('56px');

    handle.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
    expect(palette.hasAttribute('data-collapsed')).toBe(false);
    expect(Number.parseFloat(palette.style.width)).toBeGreaterThanOrEqual(224);
  });

  it('switches to horizontal separators for vertical groups', async () => {
    const { fixture, host, group } = await createFixture();
    fixture.componentInstance.orientation.set('vertical');
    fixture.detectChanges();
    await fixture.whenStable();
    group.recalculate();
    fixture.detectChanges();

    expect(host.querySelector('tng-split-group')?.getAttribute('data-orientation')).toBe(
      'vertical',
    );
    expect(host.querySelector('tng-split-handle')?.getAttribute('aria-orientation')).toBe(
      'horizontal',
    );
  });
});
