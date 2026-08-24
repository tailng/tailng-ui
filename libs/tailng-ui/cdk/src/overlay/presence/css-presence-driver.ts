import type {
  TngCssOverlayPresenceDriverOptions,
  TngOverlayPresenceDriver,
  TngOverlayPresenceTransitionCleanup,
} from './presence.types';

export const PORTALLED_OVERLAY_MOTION_VARS = [
  '--tng-motion-durationFast',
  '--tng-motion-durationNormal',
  '--tng-motion-durationSlow',
  '--tng-motion-easingStandard',
  '--tng-motion-easingExit',
  '--tng-motion-distanceSmall',
  '--tng-motion-scaleSubtle',
  '--tng-overlay-enter-duration',
  '--tng-overlay-exit-duration',
  '--tng-overlay-enter-easing',
  '--tng-overlay-exit-easing',
  '--tng-overlay-distance',
  '--tng-overlay-scale-from',
] as const;

function parseCssTime(value: string): number {
  const trimmed = value.trim();
  if (trimmed.endsWith('ms')) return Number.parseFloat(trimmed) || 0;
  if (trimmed.endsWith('s')) return (Number.parseFloat(trimmed) || 0) * 1000;
  return 0;
}

function parseCssTimeList(value: string): readonly number[] {
  return value.split(',').map(parseCssTime);
}

function maxAnimationTime(style: CSSStyleDeclaration): number {
  if (style.animationName === 'none') return 0;
  const durations = parseCssTimeList(style.animationDuration);
  const delays = parseCssTimeList(style.animationDelay);
  const count = Math.max(durations.length, delays.length);
  let longest = 0;
  for (let index = 0; index < count; index += 1) {
    const duration = durations[index % durations.length] ?? 0;
    const delay = delays[index % delays.length] ?? 0;
    longest = Math.max(longest, duration + delay);
  }
  return longest;
}

function prefersReducedMotion(view: Window): boolean {
  return (
    typeof view.matchMedia === 'function' &&
    view.matchMedia('(prefers-reduced-motion: reduce)').matches
  );
}

class CssPresenceTransition {
  private readonly pending = new Set<HTMLElement>();
  private readonly removers: (() => void)[] = [];
  private cancelled = false;
  private fallbackHandle: number | null = null;
  private finished = false;
  private view: Window | null;

  public constructor(
    private readonly options: TngCssOverlayPresenceDriverOptions,
    private readonly complete: () => void,
  ) {
    this.view = options.windowRef ?? null;
  }

  public start(): TngOverlayPresenceTransitionCleanup {
    if (this.options.elements().some((element) => element.isConnected)) {
      this.startForRenderedElements();
    } else {
      queueMicrotask(() => this.startForRenderedElements());
    }
    return (): void => this.cleanup();
  }

  private cleanup(): void {
    this.cancelled = true;
    for (const remove of this.removers) remove();
    this.removers.length = 0;
    if (this.fallbackHandle === null) return;
    this.view?.clearTimeout(this.fallbackHandle);
    this.fallbackHandle = null;
  }

  private finish(): void {
    if (this.finished) return;
    this.finished = true;
    this.cleanup();
    this.complete();
  }

  private startForRenderedElements(): void {
    if (this.cancelled) return;
    const elements = this.getConnectedElements();
    this.resolveView(elements);
    if (!this.canAnimate(elements)) {
      this.finish();
      return;
    }
    const longestAnimationMs = this.trackElements(elements);
    if (this.pending.size === 0) {
      this.finish();
      return;
    }
    this.fallbackHandle =
      this.view?.setTimeout(
        () => this.finish(),
        longestAnimationMs + (this.options.fallbackBufferMs ?? 50),
      ) ?? null;
  }

  private canAnimate(elements: readonly HTMLElement[]): boolean {
    if (elements.length === 0 || this.view === null) return false;
    return !prefersReducedMotion(this.view);
  }

  private getConnectedElements(): readonly HTMLElement[] {
    return this.options.elements().filter((element) => element.isConnected);
  }

  private resolveView(elements: readonly HTMLElement[]): void {
    if (this.view !== null) return;
    this.view = elements[0]?.ownerDocument.defaultView ?? null;
  }

  private trackElements(elements: readonly HTMLElement[]): number {
    let longestAnimationMs = 0;
    for (const element of elements) {
      longestAnimationMs = Math.max(longestAnimationMs, this.trackElement(element));
    }
    return longestAnimationMs;
  }

  private trackElement(element: HTMLElement): number {
    if (this.view === null) return 0;
    const animationMs = maxAnimationTime(this.view.getComputedStyle(element));
    if (animationMs <= 0) return 0;
    this.pending.add(element);
    const onEnd = (event: Event): void => {
      if (event.target !== element) return;
      this.pending.delete(element);
      if (this.pending.size === 0) this.finish();
    };
    element.addEventListener('animationend', onEnd);
    element.addEventListener('animationcancel', onEnd);
    this.removers.push((): void => {
      element.removeEventListener('animationend', onEnd);
      element.removeEventListener('animationcancel', onEnd);
    });
    return animationMs;
  }
}

export function createCssOverlayPresenceDriver(
  options: TngCssOverlayPresenceDriverOptions,
): TngOverlayPresenceDriver {
  return {
    start: (_phase, complete) => new CssPresenceTransition(options, complete).start(),
  };
}
