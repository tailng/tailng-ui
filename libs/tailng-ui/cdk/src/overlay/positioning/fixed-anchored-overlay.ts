import { computeOverlayPosition } from './positioning';
import type {
  TngOverlayCollisionOptions,
  TngOverlayOffset,
  TngOverlayPlacement,
  TngOverlayRect,
} from './positioning.types';

type MaybeRect = Readonly<{
  height: number;
  left: number;
  top: number;
  width: number;
}>;

export type TngFixedAnchoredOverlayPositionOptions = Readonly<{
  anchor: HTMLElement;
  /**
   * Optional rect override. When provided, this rect is used for positioning
   * instead of `anchor.getBoundingClientRect()`. Useful when the visible
   * frame to align with does not match the DOM anchor element exactly (e.g.
   * positioning an overlay to span a form-field wrapper while still using the
   * inner control for vertical bounds).
   */
  anchorRect?: TngOverlayRect;
  collision: TngOverlayCollisionOptions;
  direction?: 'ltr' | 'rtl';
  /** Maximum inline size before the viewport constraint is applied. */
  maxInlineSize?: number;
  /** Minimum inline size, capped by the maximum available inline size. */
  minInlineSize?: number;
  offset: TngOverlayOffset;
  overlay: HTMLElement;
  placement: TngOverlayPlacement;
  viewportMargin: number;
  windowRef: Window;
}>;

export type TngFixedAnchoredOverlayPositionResult = Readonly<{
  availableHeight: number;
  inlineSize: number;
  maxInlineSize: number;
  minInlineSize: number;
  side: 'bottom' | 'top';
}>;

function rectFromClientRect(rect: Readonly<DOMRect | ClientRect>): MaybeRect {
  return {
    height: rect.height,
    left: rect.left,
    top: rect.top,
    width: rect.width,
  };
}

function viewportRect(windowRef: Readonly<Window>): MaybeRect {
  return {
    height: windowRef.innerHeight || 768,
    left: 0,
    top: 0,
    width: windowRef.innerWidth || 1024,
  };
}

function getAvailableHeight(
  side: 'top' | 'bottom',
  rects: Readonly<{ anchor: MaybeRect; viewport: MaybeRect }>,
  options: Readonly<{ margin: number; offset: number }>,
): number {
  const { anchor, viewport } = rects;
  const anchorBottom = anchor.top + anchor.height;

  return side === 'top'
    ? Math.max(0, Math.floor(anchor.top - options.margin - options.offset))
    : Math.max(0, Math.floor(viewport.height - anchorBottom - options.margin - options.offset));
}

function normalizeInlineSize(value: number | undefined, fallback: number): number {
  return value === undefined || !Number.isFinite(value) ? fallback : Math.max(0, value);
}

function resolveInlineSizeBounds(
  options: Readonly<{ max?: number; min?: number; viewport: number }>,
): Readonly<{ max: number; min: number }> {
  const max = Math.min(normalizeInlineSize(options.max, options.viewport), options.viewport);
  return {
    max,
    min: Math.min(normalizeInlineSize(options.min, 0), max),
  };
}

function applyOverlayInlineSize(
  options: Readonly<{
    anchor: number;
    max?: number;
    min?: number;
    overlay: HTMLElement;
    viewport: number;
  }>,
): Readonly<{ inlineSize: number; maxInlineSize: number; minInlineSize: number }> {
  const bounds = resolveInlineSizeBounds(options);
  const inlineSize = Math.min(bounds.max, Math.max(bounds.min, options.anchor));
  options.overlay.style.width = `${inlineSize}px`;
  options.overlay.style.minWidth = `${bounds.min}px`;
  options.overlay.style.maxWidth = `${bounds.max}px`;
  options.overlay.style.maxHeight = '';
  return { inlineSize, maxInlineSize: bounds.max, minInlineSize: bounds.min };
}

export function positionFixedAnchoredOverlay(
  options: Readonly<TngFixedAnchoredOverlayPositionOptions>,
): TngFixedAnchoredOverlayPositionResult {
  const anchorRect: MaybeRect =
    options.anchorRect ?? rectFromClientRect(options.anchor.getBoundingClientRect());
  const viewport = viewportRect(options.windowRef);
  const { inlineSize, maxInlineSize, minInlineSize } = applyOverlayInlineSize({
    anchor: anchorRect.width,
    max: options.maxInlineSize,
    min: options.minInlineSize,
    overlay: options.overlay,
    viewport: Math.max(0, viewport.width - options.viewportMargin * 2),
  });

  const result = computeOverlayPosition({
    anchorRect,
    collision: options.collision,
    direction: options.direction ?? 'ltr',
    offset: options.offset,
    overlayRect: rectFromClientRect(options.overlay.getBoundingClientRect()),
    placement: options.placement,
    viewportRect: viewport,
  });

  options.overlay.style.left = `${result.x}px`;
  options.overlay.style.top = `${result.y}px`;

  const availableHeight = getAvailableHeight(
    result.side === 'top' ? 'top' : 'bottom',
    { anchor: anchorRect, viewport },
    { margin: options.viewportMargin, offset: options.offset.side ?? 0 },
  );

  if (availableHeight > 0) {
    options.overlay.style.maxHeight = `${availableHeight}px`;
  }

  return {
    availableHeight,
    inlineSize,
    maxInlineSize,
    minInlineSize,
    side: result.side === 'top' ? 'top' : 'bottom',
  };
}
