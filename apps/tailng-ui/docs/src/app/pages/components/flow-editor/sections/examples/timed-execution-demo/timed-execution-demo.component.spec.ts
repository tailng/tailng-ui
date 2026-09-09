import { TestBed } from '@angular/core/testing';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { TimedExecutionDemoComponent } from './timed-execution-demo.component';

class TimedExecutionTestResizeObserver implements ResizeObserver {
  public constructor(private readonly callback: ResizeObserverCallback) {}

  public disconnect(): void {
    // ResizeObserver cleanup is intentionally a no-op in jsdom.
  }

  public observe(target: Element): void {
    this.callback(
      [{ target, contentRect: target.getBoundingClientRect() } as ResizeObserverEntry],
      this,
    );
  }

  public unobserve(): void {
    // Individual targets do not need tracking in this test double.
  }
}

globalThis.ResizeObserver ??= TimedExecutionTestResizeObserver;

function buttonWithText(host: HTMLElement, text: string): HTMLButtonElement {
  const button = Array.from(host.querySelectorAll<HTMLButtonElement>('button')).find((candidate) =>
    candidate.textContent?.includes(text),
  );
  if (button === undefined) {
    throw new Error(`Could not find a button containing "${text}".`);
  }
  return button;
}

describe('TimedExecutionDemoComponent', () => {
  afterEach(() => {
    vi.clearAllTimers();
    vi.useRealTimers();
  });

  it('keeps each connection in progress for three seconds before advancing', () => {
    const fixture = TestBed.createComponent(TimedExecutionDemoComponent);
    fixture.detectChanges();
    const host = fixture.nativeElement as HTMLElement;
    vi.useFakeTimers();

    buttonWithText(host, 'Run simulation').click();
    fixture.detectChanges();

    const firstConnection = host.querySelector('[data-connection-id="receive-to-validate"]');
    expect(firstConnection?.getAttribute('data-status')).toBe('active');
    expect(firstConnection?.getAttribute('data-motion')).toBe('flow');
    expect(host.textContent).toContain('next node in 3s');

    vi.advanceTimersByTime(2000);
    fixture.detectChanges();
    expect(firstConnection?.getAttribute('data-motion')).toBe('flow');
    expect(host.textContent).toContain('next node in 1s');

    vi.advanceTimersByTime(1000);
    fixture.detectChanges();
    const secondConnection = host.querySelector('[data-connection-id="validate-to-approve"]');
    expect(firstConnection?.getAttribute('data-status')).toBe('success');
    expect(secondConnection?.getAttribute('data-status')).toBe('active');
    expect(secondConnection?.getAttribute('data-motion')).toBe('flow');

    vi.advanceTimersByTime(6000);
    fixture.detectChanges();
    expect(host.querySelectorAll('[data-motion="flow"]')).toHaveLength(0);
    expect(host.querySelectorAll('[data-connection-id][data-status="success"]')).toHaveLength(3);
    expect(host.textContent).toContain('Simulation complete');

    fixture.destroy();
  });

  it('cancels the active simulation when reset', () => {
    const fixture = TestBed.createComponent(TimedExecutionDemoComponent);
    fixture.detectChanges();
    const host = fixture.nativeElement as HTMLElement;
    vi.useFakeTimers();

    buttonWithText(host, 'Run simulation').click();
    fixture.detectChanges();
    buttonWithText(host, 'Reset').click();
    fixture.detectChanges();
    vi.advanceTimersByTime(6000);
    fixture.detectChanges();

    expect(host.querySelectorAll('[data-motion="flow"]')).toHaveLength(0);
    expect(host.textContent).toContain('Ready — every connection handoff');

    fixture.destroy();
  });
});
