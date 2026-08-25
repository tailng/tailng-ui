import { shouldUseAngularCdkFeature } from './adapter-config';
import type { TngAngularCdkAdapterConfig } from './adapter.types';
import {
  computeOverlayPosition,
  createOverlayBackdropController,
  createOverlayInteractionController,
  createOverlayLayerStack,
  createPortalManager,
  createScrollLockManager,
  type TngOverlayBackdropController,
  type TngOverlayBackdropControllerOptions,
  type TngOverlayInteractionController,
  type TngOverlayInteractionOptions,
  type TngOverlayLayerStack,
  type TngOverlayPositionOptions,
  type TngOverlayPositionResult,
  type TngPortalManager,
  type TngPortalManagerOptions,
  type TngScrollLockManager,
  type TngScrollLockOptions,
} from '@tailng-ui/cdk/overlay';

type TngOverlayAdapterOptions = Readonly<{
  adapterConfig?: TngAngularCdkAdapterConfig;
  angularCdk?: TngAngularCdkOverlayDelegates;
}>;

export type TngAngularCdkOverlayDelegates = Readonly<{
  computePosition?: (options: TngOverlayPositionOptions) => TngOverlayPositionResult;
  createBackdropController?: (
    options: TngOverlayBackdropControllerOptions,
  ) => TngOverlayBackdropController;
  createInteractionController?: (
    options: TngOverlayInteractionOptions,
  ) => TngOverlayInteractionController;
  createPortalManager?: (options: TngPortalManagerOptions) => TngPortalManager;
  createScrollLockManager?: (options: TngScrollLockOptions) => TngScrollLockManager;
}>;

export type TngOverlayLayerStackAdapterOptions = TngOverlayAdapterOptions;

export type TngOverlayInteractionAdapterOptions = Readonly<
  TngOverlayAdapterOptions & {
    interaction: TngOverlayInteractionOptions;
  }
>;

export type TngOverlayPositionAdapterOptions = Readonly<
  TngOverlayAdapterOptions & {
    position: TngOverlayPositionOptions;
  }
>;

export type TngPortalAdapterOptions = Readonly<
  TngOverlayAdapterOptions & {
    portal?: TngPortalManagerOptions;
  }
>;

export type TngScrollLockAdapterOptions = Readonly<
  TngOverlayAdapterOptions & {
    scrollLock?: TngScrollLockOptions;
  }
>;

export type TngOverlayBackdropAdapterOptions = Readonly<
  TngOverlayAdapterOptions & {
    backdrop: TngOverlayBackdropControllerOptions;
  }
>;

export function createOverlayLayerStackAdapter(
  _options: TngOverlayLayerStackAdapterOptions = {},
): TngOverlayLayerStack {
  return createOverlayLayerStack();
}

export function createOverlayInteractionAdapter(
  options: TngOverlayInteractionAdapterOptions,
): TngOverlayInteractionController {
  const useAngularCdk = shouldUseAngularCdkFeature(
    options.adapterConfig,
    'overlay-outside-interaction',
  );
  if (useAngularCdk && options.angularCdk?.createInteractionController !== undefined) {
    return options.angularCdk.createInteractionController(options.interaction);
  }

  return createOverlayInteractionController(options.interaction);
}

export function computeOverlayPositionAdapter(
  options: TngOverlayPositionAdapterOptions,
): TngOverlayPositionResult {
  const useAngularCdk = shouldUseAngularCdkFeature(options.adapterConfig, 'overlay-positioning');
  if (useAngularCdk && options.angularCdk?.computePosition !== undefined) {
    return options.angularCdk.computePosition(options.position);
  }

  return computeOverlayPosition(options.position);
}

export function createPortalAdapter(options: TngPortalAdapterOptions = {}): TngPortalManager {
  const useAngularCdk = shouldUseAngularCdkFeature(options.adapterConfig, 'overlay-portal');
  if (useAngularCdk && options.angularCdk?.createPortalManager !== undefined) {
    return options.angularCdk.createPortalManager(options.portal ?? {});
  }

  return createPortalManager(options.portal ?? {});
}

export function createScrollLockAdapter(
  options: TngScrollLockAdapterOptions = {},
): TngScrollLockManager {
  const useAngularCdk = shouldUseAngularCdkFeature(options.adapterConfig, 'overlay-scroll-lock');
  if (useAngularCdk && options.angularCdk?.createScrollLockManager !== undefined) {
    return options.angularCdk.createScrollLockManager(options.scrollLock ?? {});
  }

  return createScrollLockManager(options.scrollLock ?? {});
}

export function createOverlayBackdropAdapter(
  options: TngOverlayBackdropAdapterOptions,
): TngOverlayBackdropController {
  const useAngularCdk = shouldUseAngularCdkFeature(options.adapterConfig, 'overlay-backdrop');
  if (useAngularCdk && options.angularCdk?.createBackdropController !== undefined) {
    return options.angularCdk.createBackdropController(options.backdrop);
  }

  return createOverlayBackdropController(options.backdrop);
}
