import {
  computeOverlayPosition,
  type TngOverlayDismissReason,
  type TngOverlayLayer,
} from '@tailng-ui/cdk/overlay';
import type { TngOverlayInstance, TngOverlayInstanceOptions } from './overlay-instance.types';

function createLayer(
  options: TngOverlayInstanceOptions,
  close: (reason: TngOverlayDismissReason) => void,
): TngOverlayLayer {
  return {
    id: options.id,
    modal: options.modal ?? false,
    priority: options.priority,
    dismissOnEscape: options.dismissOnEscape ?? true,
    dismissOnOutsidePointer: options.dismissOnOutsidePointer ?? true,
    containsTarget: options.floating.containsTarget,
    onDismiss: (reason: TngOverlayDismissReason) => close(reason),
  };
}

function applyOverlayPosition(options: TngOverlayInstanceOptions): void {
  const result = computeOverlayPosition({
    anchorRect: options.anchor.getRect(),
    overlayRect: options.floating.getRect(),
    viewportRect: options.getViewportRect(),
    placement: options.placement,
    offset: options.offset,
    collision: options.collision,
    direction: options.direction,
  });

  options.floating.applyPosition(result);
}

type TngOverlayStateAccess = Readonly<{
  isOpen: () => boolean;
  isDestroyed: () => boolean;
  setOpen: (value: boolean) => void;
  setDestroyed: (value: boolean) => void;
}>;

function ensureAlive(state: TngOverlayStateAccess, id: string): void {
  if (state.isDestroyed()) {
    throw new Error(`Overlay instance "${id}" is destroyed.`);
  }
}

function updatePositionIfOpen(
  state: TngOverlayStateAccess,
  options: TngOverlayInstanceOptions,
): void {
  if (!state.isOpen()) return;
  applyOverlayPosition(options);
}

function closeIfOpen(
  state: TngOverlayStateAccess,
  options: TngOverlayInstanceOptions,
  reason: TngOverlayDismissReason,
): void {
  if (!state.isOpen()) return;
  state.setOpen(false);
  options.runtime.unregisterLayer(options.id);
  options.onOpenChange?.(false, reason);
}

function openIfClosed(
  state: TngOverlayStateAccess,
  options: TngOverlayInstanceOptions,
  layer: TngOverlayLayer,
): void {
  if (state.isOpen()) return;
  state.setOpen(true);
  options.runtime.registerLayer(layer);
  updatePositionIfOpen(state, options);
  options.onOpenChange?.(true, 'programmatic');
}

export function createOverlayInstance(options: TngOverlayInstanceOptions): TngOverlayInstance {
  let open = false;
  let destroyed = false;

  const state: TngOverlayStateAccess = Object.freeze({
    isOpen: () => open,
    isDestroyed: () => destroyed,
    setOpen: (value: boolean) => (open = value),
    setDestroyed: (value: boolean) => (destroyed = value),
  });

  const close = (reason: TngOverlayDismissReason): void => closeIfOpen(state, options, reason);
  const layer = createLayer(options, close);

  return Object.freeze({
    isOpen: () => open,
    open: () => {
      ensureAlive(state, options.id);
      openIfClosed(state, options, layer);
    },
    close: (reason: TngOverlayDismissReason = 'programmatic') => {
      ensureAlive(state, options.id);
      close(reason);
    },
    toggle: () => {
      ensureAlive(state, options.id);
      if (open) close('programmatic');
      else openIfClosed(state, options, layer);
    },
    updatePosition: () => {
      ensureAlive(state, options.id);
      updatePositionIfOpen(state, options);
    },
    destroy: () => {
      if (destroyed) return;
      state.setDestroyed(true);
      close('programmatic');
    },
  });
}
