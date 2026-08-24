export type TngOverlayPresenceState = 'closed' | 'entering' | 'open' | 'exiting';

export type TngOverlayPresencePhase = 'enter' | 'exit';

export type TngOverlayPresenceTransitionCleanup = () => void;

export type TngOverlayPresenceDriver = Readonly<{
  start: (
    phase: TngOverlayPresencePhase,
    complete: () => void,
  ) => TngOverlayPresenceTransitionCleanup;
}>;

export type TngOverlayPresenceOptions = Readonly<{
  driver?: TngOverlayPresenceDriver;
  initialOpen?: boolean;
  onDismiss?: () => void;
  onPresent?: () => void;
  onStateChange?: (state: TngOverlayPresenceState) => void;
}>;

export type TngOverlayPresenceController = Readonly<{
  destroy: () => void;
  getState: () => TngOverlayPresenceState;
  isOpenRequested: () => boolean;
  isPresent: () => boolean;
  setOpen: (open: boolean) => void;
}>;

export type TngCssOverlayPresenceDriverOptions = Readonly<{
  elements: () => readonly HTMLElement[];
  fallbackBufferMs?: number;
  windowRef?: Window | null;
}>;
