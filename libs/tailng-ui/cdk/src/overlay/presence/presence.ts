import type {
  TngOverlayPresenceController,
  TngOverlayPresenceDriver,
  TngOverlayPresenceOptions,
  TngOverlayPresencePhase,
  TngOverlayPresenceState,
  TngOverlayPresenceTransitionCleanup,
} from './presence.types';

const noCleanup: TngOverlayPresenceTransitionCleanup = (): void => undefined;

const instantPresenceDriver: TngOverlayPresenceDriver = {
  start: (_phase: TngOverlayPresencePhase, complete: () => void) => {
    complete();
    return noCleanup;
  },
};

class OverlayPresenceController implements TngOverlayPresenceController {
  private readonly driver: TngOverlayPresenceDriver;
  private desiredOpen: boolean;
  private destroyed = false;
  private present: boolean;
  private state: TngOverlayPresenceState;
  private transitionCleanup: TngOverlayPresenceTransitionCleanup | null = null;
  private transitionVersion = 0;

  public constructor(private readonly options: TngOverlayPresenceOptions) {
    const initialOpen = options.initialOpen === true;
    this.desiredOpen = initialOpen;
    this.present = initialOpen;
    this.state = initialOpen ? 'open' : 'closed';
    this.driver = options.driver ?? instantPresenceDriver;
  }

  public destroy(): void {
    if (this.destroyed) return;
    this.destroyed = true;
    this.cancelTransition();
    if (!this.present) return;
    this.present = false;
    this.options.onDismiss?.();
  }

  public getState(): TngOverlayPresenceState {
    return this.state;
  }

  public isOpenRequested(): boolean {
    return this.desiredOpen;
  }

  public isPresent(): boolean {
    return this.present;
  }

  public setOpen(open: boolean): void {
    if (this.destroyed || this.desiredOpen === open) return;
    this.desiredOpen = open;
    if (open) {
      if (!this.present) {
        this.present = true;
        this.options.onPresent?.();
      }
      this.startTransition('enter');
      return;
    }
    if (!this.present) {
      this.setState('closed');
      return;
    }
    this.startTransition('exit');
  }

  private cancelTransition(): void {
    this.transitionVersion += 1;
    this.transitionCleanup?.();
    this.transitionCleanup = null;
  }

  private completeTransition(phase: TngOverlayPresencePhase, version: number): void {
    if (this.destroyed || version !== this.transitionVersion) return;
    this.transitionCleanup = null;
    if (phase === 'enter') {
      if (!this.desiredOpen) this.startTransition('exit');
      else this.setState('open');
      return;
    }
    if (this.desiredOpen) {
      this.startTransition('enter');
      return;
    }
    this.present = false;
    this.setState('closed');
    this.options.onDismiss?.();
  }

  private setState(state: TngOverlayPresenceState): void {
    if (this.state === state) return;
    this.state = state;
    this.options.onStateChange?.(state);
  }

  private startTransition(phase: TngOverlayPresencePhase): void {
    this.cancelTransition();
    const version = this.transitionVersion;
    let completedSynchronously = false;
    let driverReturned = false;
    this.setState(phase === 'enter' ? 'entering' : 'exiting');
    const cleanup = this.driver.start(phase, (): void => {
      completedSynchronously = !driverReturned;
      this.completeTransition(phase, version);
    });
    driverReturned = true;
    if (completedSynchronously) cleanup();
    else this.transitionCleanup = cleanup;
  }
}

export function createOverlayPresenceController(
  options: TngOverlayPresenceOptions = {},
): TngOverlayPresenceController {
  return new OverlayPresenceController(options);
}
