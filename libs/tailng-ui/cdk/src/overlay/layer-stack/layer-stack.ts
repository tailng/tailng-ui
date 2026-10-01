import {
  type TngOverlayDismissReason,
  type TngOverlayLayer,
  type TngOverlayLayerStack,
} from './layer-stack.types';

type TngRegisteredLayer = Readonly<{
  layer: TngOverlayLayer;
  order: number;
}>;

function compareLayers(left: TngRegisteredLayer, right: TngRegisteredLayer): number {
  const priorityDiff = (left.layer.priority ?? 0) - (right.layer.priority ?? 0);
  return priorityDiff === 0 ? left.order - right.order : priorityDiff;
}

function findLayerIndexById(layers: readonly TngRegisteredLayer[], id: string): number {
  return layers.findIndex((entry) => entry.layer.id === id);
}

class OverlayLayerStack implements TngOverlayLayerStack {
  private readonly layers: TngRegisteredLayer[] = [];
  private nextOrder = 0;

  public dismissById(id: string, reason: TngOverlayDismissReason): void {
    const layer = this.findLayerById(id);
    layer?.onDismiss(reason);
  }

  public dismissTop(reason: TngOverlayDismissReason): void {
    this.getTopLayer()?.onDismiss(reason);
  }

  public getLayerIds(): readonly string[] {
    return this.layers.map((entry) => entry.layer.id);
  }

  public getTopLayer(): TngOverlayLayer | null {
    const entry = this.layers[this.layers.length - 1];
    return entry?.layer ?? null;
  }

  public getTopModalLayer(): TngOverlayLayer | null {
    const entry = this.findTopModalEntry();
    return entry?.layer ?? null;
  }

  public isTopLayer(id: string): boolean {
    return this.getTopLayer()?.id === id;
  }

  public register(layer: TngOverlayLayer): void {
    this.unregister(layer.id);
    this.nextOrder += 1;
    this.layers.push({ layer, order: this.nextOrder });
    this.layers.sort(compareLayers);
  }

  /**
   * Escape should dismiss the first eligible layer from the top.
   * If a tooltip/popover opts out of escape, we fall through to the next layer.
   * Modal isolation: never consider layers under the top modal.
   */
  public resolveEscapeDismissTarget(): TngOverlayLayer | null {
    const startIndex = this.resolveModalFloorIndex();

    for (let index = this.layers.length - 1; index >= startIndex; index -= 1) {
      const entry = this.layers[index];
      const layer = entry?.layer;
      if (!layer) continue;

      if (layer.dismissOnEscape === false) {
        continue;
      }

      return layer;
    }

    return null;
  }

  /**
   * Outside focus is opt-in. Containment still protects the complete owned
   * overlay tree, while ineligible top layers may fall through to a parent.
   */
  public resolveFocusOutsideDismissTarget(
    target: unknown,
    path: readonly unknown[],
  ): TngOverlayLayer | null {
    const startIndex = this.resolveModalFloorIndex();

    for (let index = this.layers.length - 1; index >= startIndex; index -= 1) {
      const entry = this.layers[index];
      const layer = entry?.layer;
      if (!layer) continue;

      if (layer.containsTarget?.(target, path) === true) {
        return null;
      }

      if (layer.dismissOnFocusOutside !== true) {
        continue;
      }

      return layer;
    }

    return null;
  }

  /**
   * Outside pointer should dismiss the first eligible layer from the top
   * that does NOT contain the target/path.
   *
   * If the pointer is inside the top layer → dismiss nothing.
   * If the top layer opts out of outside dismissal, fall through to the next layer.
   * Modal isolation: never consider layers under the top modal.
   */
  public resolveOutsidePointerDismissTarget(
    target: unknown,
    path: readonly unknown[],
  ): TngOverlayLayer | null {
    const startIndex = this.resolveModalFloorIndex();

    for (let index = this.layers.length - 1; index >= startIndex; index -= 1) {
      const entry = this.layers[index];
      const layer = entry?.layer;
      if (!layer) continue;

      if (layer.containsTarget?.(target, path) === true) {
        return null; // inside this top-most containing layer => no dismiss
      }

      if (layer.dismissOnOutsidePointer === false) {
        continue;
      }

      return layer;
    }

    return null;
  }

  public unregister(id: string): void {
    const index = findLayerIndexById(this.layers, id);
    if (index >= 0) {
      this.layers.splice(index, 1);
    }
  }

  private findLayerById(id: string): TngOverlayLayer | null {
    const index = findLayerIndexById(this.layers, id);
    return index >= 0 ? (this.layers[index]?.layer ?? null) : null;
  }

  private findTopModalEntry(): TngRegisteredLayer | null {
    for (let index = this.layers.length - 1; index >= 0; index -= 1) {
      const entry = this.layers[index];
      if (entry?.layer.modal === true) {
        return entry;
      }
    }
    return null;
  }

  /**
   * Returns the lowest index we should consider for dismiss resolution.
   * If there is a modal, never consider layers below it.
   */
  private resolveModalFloorIndex(): number {
    const topModalEntry = this.findTopModalEntry();
    if (topModalEntry === null) return 0;

    const idx = this.layers.indexOf(topModalEntry);
    return idx < 0 ? 0 : idx;
  }
}

export function createOverlayLayerStack(): TngOverlayLayerStack {
  return new OverlayLayerStack();
}
