import { createFocusScope, type TngFocusScopeController } from '@tailng-ui/cdk/a11y';
import {
  type TngOverlayFocusHandoffController,
  type TngOverlayFocusLayerConfig,
} from './focus-handoff.types';

type TngOverlayFocusLayer = Readonly<{
  initialFocusId: string | null;
  scope: TngFocusScopeController;
}>;

function createLayerState(config: TngOverlayFocusLayerConfig): TngOverlayFocusLayer {
  return {
    initialFocusId: config.initialFocusId ?? null,
    scope: createFocusScope({
      members: config.members,
      restoreFocus: config.restoreFocus,
      trapFocus: config.trapFocus,
    }),
  };
}

class OverlayFocusHandoffController implements TngOverlayFocusHandoffController {
  private readonly layers = new Map<string, TngOverlayFocusLayer>();

  public activateLayer(layerId: string, restoreFocusTargetId?: string | null): string | null {
    const layer = this.layers.get(layerId);
    if (layer === undefined) {
      return null;
    }

    layer.scope.activate(restoreFocusTargetId);
    return layer.scope.resolveFocusCandidate(layer.initialFocusId);
  }

  public deactivateLayer(layerId: string): string | null {
    const layer = this.layers.get(layerId);
    return layer?.scope.deactivate() ?? null;
  }

  public isTrapActive(layerId: string): boolean {
    const layer = this.layers.get(layerId);
    return layer?.scope.isTrapActive() ?? false;
  }

  public recordFocus(layerId: string, id: string | null): void {
    const layer = this.layers.get(layerId);
    layer?.scope.recordFocus(id);
  }

  public registerLayer(config: TngOverlayFocusLayerConfig): void {
    this.layers.set(config.layerId, createLayerState(config));
  }

  public resolveFocusCandidate(layerId: string, candidateId: string | null): string | null {
    const layer = this.layers.get(layerId);
    if (layer === undefined) {
      return candidateId;
    }

    return layer.scope.resolveFocusCandidate(candidateId);
  }

  public unregisterLayer(layerId: string): void {
    const layer = this.layers.get(layerId);
    if (layer === undefined) {
      return;
    }

    layer.scope.deactivate();
    this.layers.delete(layerId);
  }
}

export function createOverlayFocusHandoffController(): TngOverlayFocusHandoffController {
  return new OverlayFocusHandoffController();
}
