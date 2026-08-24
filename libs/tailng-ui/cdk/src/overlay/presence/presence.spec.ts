import { describe, expect, it, vi } from 'vitest';
import { createOverlayPresenceController } from './presence';
import type {
  TngOverlayPresenceDriver,
  TngOverlayPresencePhase,
  TngOverlayPresenceTransitionCleanup,
} from './presence.types';

function createManualDriver(): Readonly<{
  cancelled: ReturnType<typeof vi.fn>;
  complete: (phase: TngOverlayPresencePhase) => void;
  driver: TngOverlayPresenceDriver;
  starts: TngOverlayPresencePhase[];
}> {
  const starts: TngOverlayPresencePhase[] = [];
  const cancelled = vi.fn();
  const completions = new Map<TngOverlayPresencePhase, () => void>();
  const driver: TngOverlayPresenceDriver = {
    start: (phase, complete): TngOverlayPresenceTransitionCleanup => {
      starts.push(phase);
      completions.set(phase, complete);
      return cancelled;
    },
  };

  return {
    cancelled,
    complete: (phase): void => completions.get(phase)?.(),
    driver,
    starts,
  };
}

describe('overlay presence controller', () => {
  it('starts closed and not present by default', () => {
    const presence = createOverlayPresenceController();

    expect(presence.getState()).toBe('closed');
    expect(presence.isPresent()).toBe(false);
    expect(presence.isOpenRequested()).toBe(false);
  });

  it('supports an initially open overlay without replaying entrance', () => {
    const onStateChange = vi.fn();
    const presence = createOverlayPresenceController({ initialOpen: true, onStateChange });

    expect(presence.getState()).toBe('open');
    expect(presence.isPresent()).toBe(true);
    expect(onStateChange).not.toHaveBeenCalled();
  });

  it('mounts before entering and completes open through the driver', () => {
    const manual = createManualDriver();
    const calls: string[] = [];
    const presence = createOverlayPresenceController({
      driver: manual.driver,
      onPresent: () => calls.push('present'),
      onStateChange: (state) => calls.push(state),
    });

    presence.setOpen(true);

    expect(calls).toEqual(['present', 'entering']);
    expect(presence.isPresent()).toBe(true);
    manual.complete('enter');
    expect(calls).toEqual(['present', 'entering', 'open']);
  });

  it('keeps content present until exit completes', () => {
    const manual = createManualDriver();
    const onDismiss = vi.fn();
    const presence = createOverlayPresenceController({
      driver: manual.driver,
      initialOpen: true,
      onDismiss,
    });

    presence.setOpen(false);
    expect(presence.getState()).toBe('exiting');
    expect(presence.isPresent()).toBe(true);
    expect(onDismiss).not.toHaveBeenCalled();

    manual.complete('exit');
    expect(presence.getState()).toBe('closed');
    expect(presence.isPresent()).toBe(false);
    expect(onDismiss).toHaveBeenCalledTimes(1);
  });

  it('reverses an entering overlay when close is requested', () => {
    const manual = createManualDriver();
    const presence = createOverlayPresenceController({ driver: manual.driver });

    presence.setOpen(true);
    presence.setOpen(false);

    expect(manual.starts).toEqual(['enter', 'exit']);
    expect(manual.cancelled).toHaveBeenCalledTimes(1);
    expect(presence.getState()).toBe('exiting');
    manual.complete('enter');
    expect(presence.getState()).toBe('exiting');
    manual.complete('exit');
    expect(presence.getState()).toBe('closed');
  });

  it('reverses an exiting overlay without remounting it', () => {
    const manual = createManualDriver();
    const onPresent = vi.fn();
    const onDismiss = vi.fn();
    const presence = createOverlayPresenceController({
      driver: manual.driver,
      initialOpen: true,
      onDismiss,
      onPresent,
    });

    presence.setOpen(false);
    presence.setOpen(true);

    expect(manual.starts).toEqual(['exit', 'enter']);
    expect(onPresent).not.toHaveBeenCalled();
    manual.complete('exit');
    expect(presence.getState()).toBe('entering');
    manual.complete('enter');
    expect(presence.getState()).toBe('open');
    expect(onDismiss).not.toHaveBeenCalled();
  });

  it('treats repeated desired states as idempotent', () => {
    const manual = createManualDriver();
    const presence = createOverlayPresenceController({ driver: manual.driver });

    presence.setOpen(false);
    presence.setOpen(true);
    presence.setOpen(true);
    manual.complete('enter');
    presence.setOpen(true);

    expect(manual.starts).toEqual(['enter']);
  });

  it('completes synchronously when no motion driver is supplied', () => {
    const onPresent = vi.fn();
    const onDismiss = vi.fn();
    const presence = createOverlayPresenceController({ onDismiss, onPresent });

    presence.setOpen(true);
    expect(presence.getState()).toBe('open');
    presence.setOpen(false);
    expect(presence.getState()).toBe('closed');
    expect(onPresent).toHaveBeenCalledTimes(1);
    expect(onDismiss).toHaveBeenCalledTimes(1);
  });

  it('cleans an active transition and dismisses present content on destroy', () => {
    const manual = createManualDriver();
    const onDismiss = vi.fn();
    const presence = createOverlayPresenceController({
      driver: manual.driver,
      onDismiss,
    });

    presence.setOpen(true);
    presence.destroy();
    presence.destroy();

    expect(manual.cancelled).toHaveBeenCalledTimes(1);
    expect(onDismiss).toHaveBeenCalledTimes(1);
    expect(presence.isPresent()).toBe(false);
    manual.complete('enter');
    expect(presence.getState()).toBe('entering');
  });

  it('ignores open and close requests after destroy', () => {
    const manual = createManualDriver();
    const presence = createOverlayPresenceController({ driver: manual.driver });

    presence.destroy();
    presence.setOpen(true);
    presence.setOpen(false);

    expect(manual.starts).toEqual([]);
    expect(presence.getState()).toBe('closed');
  });
});
