export type TngOverlayDismissReason =
  | 'escape-key'
  | 'focus-outside'
  | 'outside-pointer'
  | 'programmatic';

export type TngOverlayLayer = Readonly<{
  containsTarget?: (target: unknown, path: readonly unknown[]) => boolean;
  dismissOnEscape?: boolean;
  dismissOnFocusOutside?: boolean;
  dismissOnOutsidePointer?: boolean;
  id: string;
  modal?: boolean;
  onDismiss: (reason: TngOverlayDismissReason) => void;
  priority?: number;
}>;

export type TngOverlayLayerStack = Readonly<{
  dismissById: (id: string, reason: TngOverlayDismissReason) => void;
  dismissTop: (reason: TngOverlayDismissReason) => void;
  getLayerIds: () => readonly string[];
  getTopLayer: () => TngOverlayLayer | null;
  getTopModalLayer: () => TngOverlayLayer | null;
  isTopLayer: (id: string) => boolean;
  register: (layer: TngOverlayLayer) => void;
  resolveEscapeDismissTarget: () => TngOverlayLayer | null;
  resolveFocusOutsideDismissTarget: (
    target: unknown,
    path: readonly unknown[],
  ) => TngOverlayLayer | null;
  resolveOutsidePointerDismissTarget: (
    target: unknown,
    path: readonly unknown[],
  ) => TngOverlayLayer | null;
  unregister: (id: string) => void;
}>;
