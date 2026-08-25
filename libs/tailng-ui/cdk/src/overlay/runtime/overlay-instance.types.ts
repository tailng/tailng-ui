import type { TngOverlayRuntime } from './overlay-runtime';
import type {
  TngOverlayCollisionOptions,
  TngOverlayDismissReason,
  TngOverlayDirection,
  TngOverlayOffset,
  TngOverlayPlacement,
  TngOverlayPositionResult,
  TngOverlayRect,
} from '@tailng-ui/cdk/overlay';

export type TngOverlayAnchor = Readonly<{
  getRect: () => TngOverlayRect;
}>;

export type TngOverlayFloating = Readonly<{
  getRect: () => TngOverlayRect;
  applyPosition: (result: TngOverlayPositionResult) => void;

  /**
   * Important: must return true for BOTH trigger and content,
   * so outside pointer doesn't dismiss when clicking trigger.
   */
  containsTarget: (target: unknown, path: readonly unknown[]) => boolean;
}>;

export type TngOverlayInstanceOptions = Readonly<{
  id: string;
  runtime: TngOverlayRuntime;

  anchor: TngOverlayAnchor;
  floating: TngOverlayFloating;

  placement?: TngOverlayPlacement;
  offset?: TngOverlayOffset;
  collision?: TngOverlayCollisionOptions;
  direction?: TngOverlayDirection;

  getViewportRect: () => TngOverlayRect;

  dismissOnEscape?: boolean; // default true
  dismissOnOutsidePointer?: boolean; // default true
  modal?: boolean;
  priority?: number;

  onOpenChange?: (open: boolean, reason: TngOverlayDismissReason) => void;
}>;

export type TngOverlayInstance = Readonly<{
  isOpen: () => boolean;
  open: () => void;
  close: (reason?: TngOverlayDismissReason) => void;
  toggle: () => void;
  updatePosition: () => void;
  destroy: () => void;
}>;
