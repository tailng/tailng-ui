import { expect, it, vi } from 'vitest';
import {
  computeOverlayPositionAdapter,
  createOverlayBackdropAdapter,
  createOverlayInteractionAdapter,
  createPortalAdapter,
  createScrollLockAdapter,
} from './overlay.adapter';
import type {
  TngOverlayBackdropController,
  TngOverlayBackdropControllerOptions,
  TngOverlayInteractionController,
  TngOverlayInteractionOptions,
  TngOverlayPositionOptions,
  TngOverlayPositionResult,
  TngPortalManager,
  TngPortalManagerOptions,
  TngScrollLockManager,
  TngScrollLockOptions,
} from '../../overlay';

function createInteractionOptions(): TngOverlayInteractionOptions {
  return {
    layerStack: {
      dismissById: () => undefined,
      dismissTop: () => undefined,
      getLayerIds: () => [],
      getTopLayer: () => null,
      getTopModalLayer: () => null,
      isTopLayer: () => false,
      register: () => undefined,
      resolveEscapeDismissTarget: () => null,
      resolveFocusOutsideDismissTarget: () => null,
      resolveOutsidePointerDismissTarget: () => null,
      unregister: () => undefined,
    },
  };
}

function createPositionOptions(): TngOverlayPositionOptions {
  return {
    anchorRect: { height: 24, left: 40, top: 40, width: 48 },
    overlayRect: { height: 20, left: 0, top: 0, width: 60 },
    viewportRect: { height: 300, left: 0, top: 0, width: 300 },
  };
}

function createPortalManagerMock(): TngPortalManager {
  return {
    clear: () => undefined,
    getMountedPortalIds: () => [],
    isMounted: () => false,
    mount: () => true,
    unmount: () => undefined,
  };
}

function createScrollLockMock(): TngScrollLockManager {
  return {
    acquire: () => undefined,
    clear: () => undefined,
    getLockIds: () => [],
    isLocked: () => false,
    release: () => undefined,
  };
}

function createBackdropMock(): TngOverlayBackdropController {
  return {
    clear: () => undefined,
    dismissTop: () => undefined,
    getBackdropIds: () => [],
    getTopBackdropId: () => null,
    handlePointerDown: () => false,
    hide: () => undefined,
    isShown: () => false,
    show: () => true,
  };
}

function createInteractionMock(): TngOverlayInteractionController {
  return {
    handleFocusIn: () => undefined,
    handleKeydown: () => undefined,
    handlePointerDown: () => undefined,
    isStarted: () => false,
    start: () => undefined,
    stop: () => undefined,
  };
}

type TngDelegateSuite = Readonly<{
  adapterConfig: Readonly<{ mode: 'prefer-angular-cdk' }>;
  angularCdk: Readonly<{
    computePosition: (options: TngOverlayPositionOptions) => TngOverlayPositionResult;
    createBackdropController: (
      options: TngOverlayBackdropControllerOptions,
    ) => TngOverlayBackdropController;
    createInteractionController: (
      options: TngOverlayInteractionOptions,
    ) => TngOverlayInteractionController;
    createPortalManager: (options: TngPortalManagerOptions) => TngPortalManager;
    createScrollLockManager: (options: TngScrollLockOptions) => TngScrollLockManager;
  }>;
  backdropFactory: ReturnType<
    typeof vi.fn<(options: TngOverlayBackdropControllerOptions) => TngOverlayBackdropController>
  >;
  interactionFactory: ReturnType<
    typeof vi.fn<(options: TngOverlayInteractionOptions) => TngOverlayInteractionController>
  >;
  portalFactory: ReturnType<typeof vi.fn<(options: TngPortalManagerOptions) => TngPortalManager>>;
  positionFactory: ReturnType<
    typeof vi.fn<(options: TngOverlayPositionOptions) => TngOverlayPositionResult>
  >;
  scrollLockFactory: ReturnType<
    typeof vi.fn<(options: TngScrollLockOptions) => TngScrollLockManager>
  >;
}>;

type TngDelegatedResults = Readonly<{
  backdrop: TngOverlayBackdropController;
  interaction: TngOverlayInteractionController;
  portal: TngPortalManager;
  position: TngOverlayPositionResult;
  scrollLock: TngScrollLockManager;
}>;

type TngDelegatedCallOutcome = Readonly<{
  results: TngDelegatedResults;
  suite: TngDelegateSuite;
}>;

function createDelegateSuite(): TngDelegateSuite {
  const interactionFactory = vi.fn<
    (options: TngOverlayInteractionOptions) => TngOverlayInteractionController
  >(() => createInteractionMock());
  const portalFactory = vi.fn<(options: TngPortalManagerOptions) => TngPortalManager>(() =>
    createPortalManagerMock(),
  );
  const scrollLockFactory = vi.fn<(options: TngScrollLockOptions) => TngScrollLockManager>(() =>
    createScrollLockMock(),
  );
  const backdropFactory = vi.fn<
    (options: TngOverlayBackdropControllerOptions) => TngOverlayBackdropController
  >(() => createBackdropMock());
  const positionFactory = vi.fn<(options: TngOverlayPositionOptions) => TngOverlayPositionResult>(
    () => ({ align: 'center', side: 'right', x: 200, y: 120 }),
  );

  return {
    adapterConfig: { mode: 'prefer-angular-cdk' },
    angularCdk: {
      computePosition: positionFactory,
      createBackdropController: backdropFactory,
      createInteractionController: interactionFactory,
      createPortalManager: portalFactory,
      createScrollLockManager: scrollLockFactory,
    },
    backdropFactory,
    interactionFactory,
    portalFactory,
    positionFactory,
    scrollLockFactory,
  };
}

function createDelegatedCallOutcome(): TngDelegatedCallOutcome {
  const suite = createDelegateSuite();
  const results: TngDelegatedResults = {
    backdrop: createOverlayBackdropAdapter({
      adapterConfig: suite.adapterConfig,
      angularCdk: suite.angularCdk,
      backdrop: { portal: createPortalManagerMock() },
    }),
    interaction: createOverlayInteractionAdapter({
      adapterConfig: suite.adapterConfig,
      angularCdk: suite.angularCdk,
      interaction: createInteractionOptions(),
    }),
    portal: createPortalAdapter({
      adapterConfig: suite.adapterConfig,
      angularCdk: suite.angularCdk,
      portal: {},
    }),
    position: computeOverlayPositionAdapter({
      adapterConfig: suite.adapterConfig,
      angularCdk: suite.angularCdk,
      position: createPositionOptions(),
    }),
    scrollLock: createScrollLockAdapter({
      adapterConfig: suite.adapterConfig,
      angularCdk: suite.angularCdk,
      scrollLock: {},
    }),
  };

  return { results, suite };
}

it('uses angular-cdk delegates for enabled features in prefer mode', () => {
  const outcome = createDelegatedCallOutcome();
  expect(outcome.suite.interactionFactory).toHaveBeenCalledOnce();
  expect(outcome.suite.portalFactory).toHaveBeenCalledOnce();
  expect(outcome.suite.scrollLockFactory).toHaveBeenCalledOnce();
  expect(outcome.suite.backdropFactory).toHaveBeenCalledOnce();
  expect(outcome.suite.positionFactory).toHaveBeenCalledOnce();
  expect(typeof outcome.results.interaction.start).toBe('function');
  expect(typeof outcome.results.portal.mount).toBe('function');
  expect(typeof outcome.results.scrollLock.acquire).toBe('function');
  expect(typeof outcome.results.backdrop.show).toBe('function');
  expect(outcome.results.position.side).toBe('right');
});

it('falls back when prefer mode is enabled but delegate is missing', () => {
  const interaction = createOverlayInteractionAdapter({
    adapterConfig: { mode: 'prefer-angular-cdk' },
    interaction: createInteractionOptions(),
  });
  const portal = createPortalAdapter({ adapterConfig: { mode: 'prefer-angular-cdk' } });
  const scrollLock = createScrollLockAdapter({ adapterConfig: { mode: 'prefer-angular-cdk' } });
  const backdrop = createOverlayBackdropAdapter({
    adapterConfig: { mode: 'prefer-angular-cdk' },
    backdrop: { portal: createPortalManagerMock() },
  });
  const position = computeOverlayPositionAdapter({
    adapterConfig: { mode: 'prefer-angular-cdk' },
    position: createPositionOptions(),
  });

  expect(typeof interaction.start).toBe('function');
  expect(typeof portal.mount).toBe('function');
  expect(typeof scrollLock.acquire).toBe('function');
  expect(typeof backdrop.show).toBe('function');
  expect(position.side).toBe('bottom');
});

it('respects enabledFeatures filter and ignores delegate for disabled feature', () => {
  const computePosition = vi.fn<(options: TngOverlayPositionOptions) => TngOverlayPositionResult>(
    () => ({ align: 'end', side: 'right', x: 1, y: 1 }),
  );

  const position = computeOverlayPositionAdapter({
    adapterConfig: {
      enabledFeatures: ['overlay-portal'],
      mode: 'prefer-angular-cdk',
    },
    angularCdk: { computePosition },
    position: createPositionOptions(),
  });

  expect(computePosition).not.toHaveBeenCalled();
  expect(position.side).toBe('bottom');
});
