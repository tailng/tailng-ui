import {
  createOverlayInteractionAdapter,
  createOverlayLayerStackAdapter,
  createScrollLockAdapter,
  type TngAngularCdkAdapterConfig,
  type TngAngularCdkOverlayDelegates,
} from '@tailng-ui/cdk/adapters';
import {
  createOverlayInteractionDocument,
  type TngOverlayDismissReason,
  type TngOverlayInteractionController,
  type TngOverlayInteractionDocument,
  type TngOverlayInteractionDomDocument,
  type TngOverlayKeyboardEvent,
  type TngOverlayLayer,
  type TngOverlayLayerStack,
  type TngOverlayPointerEvent,
  type TngScrollLockManager,
  type TngScrollLockOptions,
} from '@tailng-ui/cdk/overlay';

type TngOverlayAdapterRuntimeOptions = Readonly<{
  adapterConfig?: TngAngularCdkAdapterConfig;
  angularCdk?: TngAngularCdkOverlayDelegates;
}>;

export type TngOverlayRuntimeOptions = Readonly<
  TngOverlayAdapterRuntimeOptions & {
    /**
     * Optional document reference for outside-interaction listeners.
     * In non-browser environments, omit this to disable document listeners.
     */
    documentRef?: TngOverlayInteractionDomDocument | null;
  }
>;

// eslint-disable-next-line @typescript-eslint/consistent-type-definitions -- A named interface prevents ng-packagr from inlining private secondary-entry-point paths.
export interface TngOverlayRuntime {
  readonly clearLayers: () => void;
  readonly dispatchKeydown: (event: Readonly<TngOverlayKeyboardEvent>) => void;
  readonly dispatchPointerDown: (event: Readonly<TngOverlayPointerEvent>) => void;
  readonly dismissById: (id: string, reason: TngOverlayDismissReason) => void;
  readonly getLayerIds: () => readonly string[];
  readonly isTopLayer: (id: string) => boolean;
  readonly registerLayer: (layer: TngOverlayLayer) => void;
  readonly unregisterLayer: (id: string) => void;
}

function toInteractionDocument(
  documentRef: TngOverlayInteractionDomDocument | null | undefined,
): TngOverlayInteractionDocument | null {
  if (documentRef == null) return null;
  return createOverlayInteractionDocument(documentRef);
}

class OverlayRuntime implements TngOverlayRuntime {
  private readonly interaction: TngOverlayInteractionController;
  private readonly layerStack: TngOverlayLayerStack;
  private readonly registeredLayerIds = new Set<string>();

  public constructor(private readonly options: Readonly<TngOverlayRuntimeOptions>) {
    this.layerStack = createOverlayLayerStackAdapter({
      adapterConfig: options.adapterConfig,
      angularCdk: options.angularCdk,
    });
    this.interaction = createOverlayInteractionAdapter({
      adapterConfig: options.adapterConfig,
      angularCdk: options.angularCdk,
      interaction: {
        documentRef: toInteractionDocument(options.documentRef),
        layerStack: this.layerStack,
      },
    });
  }

  public clearLayers(): void {
    for (const id of this.getLayerIds()) {
      this.unregisterLayer(id);
    }
  }

  public dispatchKeydown(event: Readonly<TngOverlayKeyboardEvent>): void {
    this.interaction.handleKeydown(event);
  }

  public dispatchPointerDown(event: Readonly<TngOverlayPointerEvent>): void {
    this.interaction.handlePointerDown(event);
  }

  public dismissById(id: string, reason: TngOverlayDismissReason): void {
    this.layerStack.dismissById(id, reason);
  }

  public getLayerIds(): readonly string[] {
    return this.layerStack.getLayerIds();
  }

  public isTopLayer(id: string): boolean {
    return this.layerStack.isTopLayer(id);
  }

  public registerLayer(layer: TngOverlayLayer): void {
    const hasLayer = this.registeredLayerIds.has(layer.id);
    this.layerStack.register(layer);
    if (!hasLayer) {
      this.registeredLayerIds.add(layer.id);
      this.startInteractionIfNeeded();
    }
  }

  public unregisterLayer(id: string): void {
    if (!this.registeredLayerIds.has(id)) {
      return;
    }

    this.layerStack.unregister(id);
    this.registeredLayerIds.delete(id);
    this.stopInteractionIfPossible();
  }

  private startInteractionIfNeeded(): void {
    if (this.registeredLayerIds.size === 1) {
      this.interaction.start();
    }
  }

  private stopInteractionIfPossible(): void {
    if (this.registeredLayerIds.size === 0) {
      this.interaction.stop();
    }
  }
}

export function createOverlayRuntime(
  options: Readonly<TngOverlayRuntimeOptions> = {},
): TngOverlayRuntime {
  return new OverlayRuntime(options);
}

export function createOverlayScrollLockManager(
  options: Readonly<TngScrollLockOptions> = {},
  runtimeOptions: Readonly<TngOverlayAdapterRuntimeOptions> = {},
): TngScrollLockManager {
  return createScrollLockAdapter({
    adapterConfig: runtimeOptions.adapterConfig,
    angularCdk: runtimeOptions.angularCdk,
    scrollLock: options,
  });
}
