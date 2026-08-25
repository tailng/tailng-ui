import type { TngAngularCdkOverlayDelegates } from './overlay.adapter';
import {
  computeOverlayPosition,
  createOverlayBackdropController,
  createOverlayInteractionController,
  createScrollLockManager,
  type TngOverlayBackdropController,
  type TngOverlayBackdropControllerOptions,
  type TngOverlayInteractionController,
  type TngOverlayInteractionOptions,
  type TngOverlayPositionOptions,
  type TngOverlayPositionResult,
  type TngPortalManager,
  type TngPortalManagerOptions,
  type TngPortalNode,
  type TngScrollLockManager,
  type TngScrollLockOptions,
} from '@tailng-ui/cdk/overlay';

type TngCdkHorizontal = 'center' | 'end' | 'start';
type TngCdkVertical = 'bottom' | 'center' | 'top';

type TngCdkConnectedPosition = Readonly<{
  offsetX?: number;
  offsetY?: number;
  originX: TngCdkHorizontal;
  originY: TngCdkVertical;
  overlayX: TngCdkHorizontal;
  overlayY: TngCdkVertical;
}>;

type TngCdkPositionStrategy = Readonly<{
  withPositions: (positions: readonly TngCdkConnectedPosition[]) => TngCdkPositionStrategy;
  withPush?: (push: boolean) => TngCdkPositionStrategy;
  withViewportMargin?: (margin: number) => TngCdkPositionStrategy;
}>;

type TngCdkPositionBuilder = Readonly<{
  flexibleConnectedTo: (origin: unknown) => TngCdkPositionStrategy;
}>;

type TngCdkPortalContainer = Readonly<{
  appendChild: (node: unknown) => void;
  getBoundingClientRect?: () => Readonly<{ left: number; top: number }>;
  removeChild?: (node: unknown) => void;
}>;

type TngCdkOverlayRef = Readonly<{
  dispose: () => void;
  overlayElement?: TngCdkPortalContainer;
  updatePosition?: () => void;
}>;

type TngCdkBlockScrollStrategy = Readonly<{
  disable: () => void;
  enable: () => void;
}>;

export type TngAngularCdkOverlayLike = Readonly<{
  create: (config: Readonly<Record<string, unknown>>) => TngCdkOverlayRef;
  position: () => TngCdkPositionBuilder;
  scrollStrategies?: Readonly<{
    block?: () => TngCdkBlockScrollStrategy;
  }>;
}>;

export type TngAngularCdkOverlayDelegateFactoryOptions = Readonly<{
  overlay?: TngAngularCdkOverlayLike | null;
}>;

type TngMountedPortal = Readonly<{
  node: TngPortalNode;
  overlayRef: TngCdkOverlayRef;
}>;

type TngConnectedPositionResolver = (context: TngPlacementContext) => TngCdkConnectedPosition;

type TngPlacementContext = Readonly<{
  align: 'center' | 'end' | 'start';
  alignOffset: number;
  direction: 'ltr' | 'rtl';
  sideOffset: number;
}>;

function toPhysicalEdge(direction: 'ltr' | 'rtl', edge: 'left' | 'right'): TngCdkHorizontal {
  if (edge === 'left') {
    return direction === 'rtl' ? 'end' : 'start';
  }

  return direction === 'rtl' ? 'start' : 'end';
}

function toVerticalAlign(align: 'center' | 'end' | 'start'): TngCdkVertical {
  if (align === 'start') {
    return 'top';
  }

  if (align === 'end') {
    return 'bottom';
  }

  return 'center';
}

function toHorizontalAlign(align: 'center' | 'end' | 'start'): TngCdkHorizontal {
  if (align === 'start') {
    return 'start';
  }

  if (align === 'end') {
    return 'end';
  }

  return 'center';
}

function createPlacementContext(options: TngOverlayPositionOptions): TngPlacementContext {
  return {
    align: options.placement?.align ?? 'center',
    alignOffset: options.offset?.align ?? 0,
    direction: options.direction ?? 'ltr',
    sideOffset: options.offset?.side ?? 0,
  };
}

function mapTopPosition(context: TngPlacementContext): TngCdkConnectedPosition {
  return {
    offsetX: context.alignOffset,
    offsetY: -context.sideOffset,
    originX: toHorizontalAlign(context.align),
    originY: 'top',
    overlayX: toHorizontalAlign(context.align),
    overlayY: 'bottom',
  };
}

function mapBottomPosition(context: TngPlacementContext): TngCdkConnectedPosition {
  return {
    offsetX: context.alignOffset,
    offsetY: context.sideOffset,
    originX: toHorizontalAlign(context.align),
    originY: 'bottom',
    overlayX: toHorizontalAlign(context.align),
    overlayY: 'top',
  };
}

function mapLeftPosition(context: TngPlacementContext): TngCdkConnectedPosition {
  return {
    offsetX: -context.sideOffset,
    offsetY: context.alignOffset,
    originX: toPhysicalEdge(context.direction, 'left'),
    originY: toVerticalAlign(context.align),
    overlayX: toPhysicalEdge(context.direction, 'right'),
    overlayY: toVerticalAlign(context.align),
  };
}

function mapRightPosition(context: TngPlacementContext): TngCdkConnectedPosition {
  return {
    offsetX: context.sideOffset,
    offsetY: context.alignOffset,
    originX: toPhysicalEdge(context.direction, 'right'),
    originY: toVerticalAlign(context.align),
    overlayX: toPhysicalEdge(context.direction, 'left'),
    overlayY: toVerticalAlign(context.align),
  };
}

const connectedPositionBySide: Readonly<
  Record<'bottom' | 'left' | 'right' | 'top', TngConnectedPositionResolver>
> = Object.freeze({
  bottom: mapBottomPosition,
  left: mapLeftPosition,
  right: mapRightPosition,
  top: mapTopPosition,
});

function mapToConnectedPosition(options: TngOverlayPositionOptions): TngCdkConnectedPosition {
  const side = options.placement?.side ?? 'bottom';
  const resolver = connectedPositionBySide[side];
  const context = createPlacementContext(options);

  return resolver(context);
}

function createOverlayOrigin(options: TngOverlayPositionOptions): Readonly<Record<string, number>> {
  return {
    height: options.anchorRect.height,
    width: options.anchorRect.width,
    x: options.anchorRect.left,
    y: options.anchorRect.top,
  };
}

function applyCollisionOptions(
  strategy: TngCdkPositionStrategy,
  options: TngOverlayPositionOptions,
): void {
  const collision = options.collision;
  if (collision?.shift !== undefined && strategy.withPush !== undefined) {
    strategy.withPush(collision.shift);
  }

  if (collision?.padding !== undefined && strategy.withViewportMargin !== undefined) {
    strategy.withViewportMargin(collision.padding);
  }
}

function buildPositionConfig(
  overlay: TngAngularCdkOverlayLike,
  options: TngOverlayPositionOptions,
): Readonly<Record<string, unknown>> {
  const strategy = overlay.position().flexibleConnectedTo(createOverlayOrigin(options));
  strategy.withPositions([mapToConnectedPosition(options)]);
  applyCollisionOptions(strategy, options);

  return {
    height: options.overlayRect.height,
    positionStrategy: strategy,
    width: options.overlayRect.width,
  };
}

function readOverlayPosition(
  overlayRef: TngCdkOverlayRef,
): Readonly<{ left: number; top: number }> | null {
  const position = overlayRef.overlayElement?.getBoundingClientRect?.();
  if (position === undefined) {
    return null;
  }

  return position;
}

function toOverlayResult(
  options: TngOverlayPositionOptions,
  position: Readonly<{ left: number; top: number }>,
): TngOverlayPositionResult {
  const align = options.placement?.align ?? 'center';
  const side = options.placement?.side ?? 'bottom';

  return {
    align,
    side,
    x: position.left,
    y: position.top,
  };
}

function computePositionWithOverlay(
  overlay: TngAngularCdkOverlayLike,
  options: TngOverlayPositionOptions,
): TngOverlayPositionResult | null {
  const overlayRef = overlay.create(buildPositionConfig(overlay, options));

  try {
    overlayRef.updatePosition?.();
    const position = readOverlayPosition(overlayRef);
    if (position === null) {
      return null;
    }

    return toOverlayResult(options, position);
  } finally {
    overlayRef.dispose();
  }
}

function isPortalContainer(value: unknown): value is TngCdkPortalContainer {
  return (
    typeof value === 'object' &&
    value !== null &&
    'appendChild' in value &&
    typeof (value as { appendChild?: unknown }).appendChild === 'function'
  );
}

function removePortalNode(mountedPortal: TngMountedPortal): void {
  const container = mountedPortal.overlayRef.overlayElement;
  const removeChild = container?.removeChild;
  if (removeChild !== undefined && typeof removeChild === 'function') {
    removeChild(mountedPortal.node);
  }
}

function unmountPortalIds(portalIds: readonly string[], unmount: (portalId: string) => void): void {
  for (const portalId of portalIds) {
    unmount(portalId);
  }
}

function createOverlayPortalManager(overlay: TngAngularCdkOverlayLike): TngPortalManager {
  const mountedPortals = new Map<string, TngMountedPortal>();

  const unmount = (portalId: string): void => {
    const mountedPortal = mountedPortals.get(portalId);
    if (mountedPortal === undefined) {
      return;
    }

    removePortalNode(mountedPortal);
    mountedPortals.delete(portalId);
    mountedPortal.overlayRef.dispose();
  };

  const clear = (): void => {
    unmountPortalIds([...mountedPortals.keys()], unmount);
  };

  const mount = (options: Readonly<{ node: TngPortalNode; portalId: string }>): boolean => {
    unmount(options.portalId);
    const overlayRef = overlay.create({});
    const container = overlayRef.overlayElement;
    if (!isPortalContainer(container)) {
      overlayRef.dispose();
      return false;
    }

    container.appendChild(options.node);
    mountedPortals.set(options.portalId, { node: options.node, overlayRef });
    return true;
  };

  return Object.freeze({
    clear,
    getMountedPortalIds: (): readonly string[] => [...mountedPortals.keys()],
    isMounted: (portalId: string): boolean => mountedPortals.has(portalId),
    mount: (options): boolean =>
      mount({
        node: options.node,
        portalId: options.portalId,
      }),
    unmount,
  });
}

function createBlockStrategyManager(strategy: TngCdkBlockScrollStrategy): TngScrollLockManager {
  const lockIds = new Set<string>();

  const enableOnFirstAcquire = (): void => {
    if (lockIds.size === 1) {
      strategy.enable();
    }
  };

  const disableOnLastRelease = (): void => {
    if (lockIds.size === 0) {
      strategy.disable();
    }
  };

  return Object.freeze({
    acquire: (lockId: string): void => {
      if (lockIds.has(lockId)) {
        return;
      }

      lockIds.add(lockId);
      enableOnFirstAcquire();
    },
    clear: (): void => {
      if (lockIds.size === 0) {
        return;
      }

      lockIds.clear();
      disableOnLastRelease();
    },
    getLockIds: (): readonly string[] => [...lockIds.values()],
    isLocked: (): boolean => lockIds.size > 0,
    release: (lockId: string): void => {
      if (!lockIds.delete(lockId)) {
        return;
      }

      disableOnLastRelease();
    },
  });
}

function createOverlayBlockScrollLockManager(
  overlay: TngAngularCdkOverlayLike,
): TngScrollLockManager {
  const strategy = overlay.scrollStrategies?.block?.();
  if (strategy === undefined) {
    return createScrollLockManager();
  }

  return createBlockStrategyManager(strategy);
}

export function createAngularCdkOverlayDelegates(
  options: TngAngularCdkOverlayDelegateFactoryOptions,
): TngAngularCdkOverlayDelegates {
  const overlay = options.overlay ?? null;

  return {
    computePosition:
      overlay === null
        ? undefined
        : (positionOptions: TngOverlayPositionOptions): TngOverlayPositionResult =>
            computePositionWithOverlay(overlay, positionOptions) ??
            computeOverlayPosition(positionOptions),
    createBackdropController:
      overlay === null
        ? undefined
        : (backdropOptions: TngOverlayBackdropControllerOptions): TngOverlayBackdropController =>
            createOverlayBackdropController(backdropOptions),
    createInteractionController:
      overlay === null
        ? undefined
        : (interactionOptions: TngOverlayInteractionOptions): TngOverlayInteractionController =>
            createOverlayInteractionController(interactionOptions),
    createPortalManager:
      overlay === null
        ? undefined
        : (_portalOptions: TngPortalManagerOptions): TngPortalManager =>
            createOverlayPortalManager(overlay),
    createScrollLockManager:
      overlay === null
        ? undefined
        : (_scrollLockOptions: TngScrollLockOptions): TngScrollLockManager =>
            createOverlayBlockScrollLockManager(overlay),
  };
}
