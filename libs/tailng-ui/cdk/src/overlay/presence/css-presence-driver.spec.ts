import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  PORTALLED_OVERLAY_MOTION_VARS,
  createCssOverlayPresenceDriver,
} from './css-presence-driver';

function animatedElement(duration = '10s'): HTMLElement {
  const element = document.createElement('div');
  element.style.animationName = 'test-overlay-motion';
  element.style.animationDuration = duration;
  element.style.animationDelay = '0s';
  document.body.appendChild(element);
  return element;
}

afterEach(() => {
  vi.useRealTimers();
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
  document.body.replaceChildren();
});

describe('CSS overlay presence driver', () => {
  it('completes synchronously when no rendered target has an animation', () => {
    const element = document.createElement('div');
    document.body.appendChild(element);
    const complete = vi.fn();

    createCssOverlayPresenceDriver({ elements: () => [element], windowRef: window }).start(
      'enter',
      complete,
    );

    expect(complete).toHaveBeenCalledTimes(1);
  });

  it('waits for every animated target and ignores bubbled descendant events', () => {
    const first = animatedElement();
    const second = animatedElement();
    const child = document.createElement('span');
    first.appendChild(child);
    const complete = vi.fn();

    createCssOverlayPresenceDriver({
      elements: () => [first, second],
      windowRef: window,
    }).start('exit', complete);

    child.dispatchEvent(new Event('animationend', { bubbles: true }));
    first.dispatchEvent(new Event('animationend', { bubbles: true }));
    expect(complete).not.toHaveBeenCalled();

    second.dispatchEvent(new Event('animationend', { bubbles: true }));
    expect(complete).toHaveBeenCalledTimes(1);
  });

  it('uses the computed duration as a lost-event fallback', () => {
    vi.useFakeTimers();
    const element = animatedElement('200ms');
    const complete = vi.fn();

    createCssOverlayPresenceDriver({
      elements: () => [element],
      fallbackBufferMs: 25,
      windowRef: window,
    }).start('exit', complete);

    vi.advanceTimersByTime(224);
    expect(complete).not.toHaveBeenCalled();
    vi.advanceTimersByTime(1);
    expect(complete).toHaveBeenCalledTimes(1);
  });

  it('completes immediately when reduced motion is requested', () => {
    const element = animatedElement();
    const complete = vi.fn();
    vi.stubGlobal(
      'matchMedia',
      vi.fn(() => ({ matches: true }) as MediaQueryList),
    );

    createCssOverlayPresenceDriver({ elements: () => [element], windowRef: window }).start(
      'exit',
      complete,
    );

    expect(complete).toHaveBeenCalledTimes(1);
  });

  it('publishes every shared motion variable needed by body portals', () => {
    expect(PORTALLED_OVERLAY_MOTION_VARS).toEqual(
      expect.arrayContaining([
        '--tng-motion-durationFast',
        '--tng-motion-durationNormal',
        '--tng-motion-easingExit',
        '--tng-overlay-enter-duration',
        '--tng-overlay-exit-duration',
        '--tng-overlay-distance',
        '--tng-overlay-scale-from',
      ]),
    );
  });
});
