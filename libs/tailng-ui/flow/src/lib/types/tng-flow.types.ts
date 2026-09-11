import type {
  TngFlowConnectionLabelOptions,
  TngFlowConnectionMarker,
  TngFlowConnectionRouting,
} from './tng-flow-connection.types';

export type TngFlowPoint = Readonly<{
  x: number;
  y: number;
}>;

export type TngFlowNodeStatus =
  | 'awaiting-input'
  | 'cancelled'
  | 'completed'
  | 'failed'
  | 'idle'
  | 'paused'
  | 'queued'
  | 'retrying'
  | 'running'
  | 'skipped'
  | 'waiting';

export type TngFlowConnectionType = 'adaptive-curve' | 'bezier' | 'segment' | 'straight';
export type TngFlowPortDirection = 'input' | 'output';
export type TngFlowPortKind = 'control' | 'data' | 'error';
export type TngFlowPortSide = 'bottom' | 'left' | 'right' | 'top';
/**
 * `static-ports` keeps declared port sides and labels.
 * `nearest-border` live-assigns each connected endpoint to its size-normalized exit
 * border (diagonal mixes allowed) and hides port labels.
 * `custom-points` shows a fixed 3-per-side border grid; the user picks start/end slots.
 */
export type TngFlowAttachmentLayout = 'custom-points' | 'nearest-border' | 'static-ports';
export type TngFlowBackgroundGridMode = 'adaptive' | 'canvas';
export type TngFlowEditorMode = 'edit' | 'inspect' | 'readonly';
export type TngFlowDeleteRequestSource = 'api' | 'context-menu' | 'keyboard';
export type TngFlowNodeCreateSource = 'api' | 'keyboard' | 'pointer';

type TngFlowPortBase = {
  id: string;
  name?: string;
  label?: string;
  dataType?: string;
  category?: string;
  required?: boolean;
  disabled?: boolean;
  multiple?: boolean;
  accepts?: readonly string[];
  allowSelfConnection?: boolean;
  /** Node border used by the connector. Defaults to left for inputs and right for outputs. */
  side?: TngFlowPortSide;
};

/** Canonical Milestone 2 port model. */
export type TngFlowPort = Readonly<
  TngFlowPortBase & {
    direction: TngFlowPortDirection;
    kind: TngFlowPortKind;
  }
>;

/** @deprecated Use `TngFlowPort` records in `TngFlowNode.ports`. */
export type TngFlowLegacyPort = Readonly<
  TngFlowPortBase & {
    kind?: TngFlowPortKind;
  }
>;

export type TngFlowNode<TData = unknown> = Readonly<{
  id: string;
  type: string;
  name: string;
  position: TngFlowPoint;
  data?: TData;
  description?: string;
  disabled?: boolean;
  icon?: string;
  ports?: readonly TngFlowPort[];
  /** @deprecated Use `ports` with `direction: 'input'`. */
  inputs?: readonly TngFlowLegacyPort[];
  locked?: boolean;
  /** @deprecated Use `ports` with `direction: 'output'`. */
  outputs?: readonly TngFlowLegacyPort[];
}>;

export type TngFlowEndpoint = Readonly<{
  nodeId: string;
  portId: string;
}>;

export type TngFlowConnection<TData = unknown> = Readonly<{
  id: string;
  source: TngFlowEndpoint;
  target: TngFlowEndpoint;
  label?: string;
  description?: string;
  data?: TData;
  disabled?: boolean;
  reassignable?: boolean;
  selectable?: boolean;
  routing?: TngFlowConnectionRouting;
  sourceMarker?: TngFlowConnectionMarker;
  targetMarker?: TngFlowConnectionMarker;
  labelOptions?: TngFlowConnectionLabelOptions;
  /** @deprecated Use `routing.type`. */
  type?: TngFlowConnectionType;
}>;

export type TngFlowDefinition<TNodeData = unknown, TConnectionData = unknown> = Readonly<{
  id: string;
  name?: string;
  nodes: readonly TngFlowNode<TNodeData>[];
  connections: readonly TngFlowConnection<TConnectionData>[];
}>;

/**
 * A presentation and creation descriptor for one external palette item.
 * Its id belongs to the palette catalog and is not a workflow node id.
 */
export type TngFlowPaletteItem<TData = unknown> = Readonly<{
  id: string;
  type: string;
  name: string;
  data?: TData;
  description?: string;
  disabled?: boolean;
  icon?: string;
}>;

export type TngFlowPaletteItemActivation<TData = unknown> = Readonly<{
  item: TngFlowPaletteItem<TData>;
  source: 'keyboard' | 'pointer';
}>;

export type TngFlowNodeCreateRequest<TData = unknown> = Readonly<{
  item: TngFlowPaletteItem<TData>;
  /** Requested node top-left position in canvas coordinates. */
  position: TngFlowPoint;
  source: TngFlowNodeCreateSource;
}>;

export type TngFlowSelection = Readonly<{
  nodeIds: ReadonlySet<string>;
  connectionIds: ReadonlySet<string>;
}>;

export const EMPTY_TNG_FLOW_SELECTION: TngFlowSelection = Object.freeze({
  nodeIds: new Set<string>(),
  connectionIds: new Set<string>(),
});

export type TngFlowConnectionCandidate<TNodeData = unknown> = Readonly<{
  source: TngFlowEndpoint;
  target: TngFlowEndpoint;
  sourceNode: TngFlowNode<TNodeData>;
  sourcePort: TngFlowPort;
  targetNode: TngFlowNode<TNodeData>;
  targetPort: TngFlowPort;
}>;

export type TngFlowConnectionValidation =
  | Readonly<{ valid: true }>
  | Readonly<{
      valid: false;
      code: string;
      reason: string;
    }>;

export type TngFlowConnectionValidator<TNodeData = unknown> = (
  candidate: TngFlowConnectionCandidate<TNodeData>,
) => TngFlowConnectionValidation;

export type TngFlowConnectionCreateRequest = Readonly<{
  source: TngFlowEndpoint;
  target: TngFlowEndpoint;
  /** Resolved routing selected when the connection was drawn. */
  routing?: TngFlowConnectionRouting;
}>;

export type TngFlowConnectionReconnectRequest = Readonly<{
  connectionId: string;
  previousSource: TngFlowEndpoint;
  previousTarget: TngFlowEndpoint;
  source: TngFlowEndpoint;
  target: TngFlowEndpoint;
  changedEndpoint: 'source' | 'target';
}>;

export type TngFlowConnectionsDeleteRequest = Readonly<{
  connectionIds: readonly string[];
  source: TngFlowDeleteRequestSource;
}>;

export type TngFlowNodesDeleteRequest = Readonly<{
  nodeIds: readonly string[];
  source: TngFlowDeleteRequestSource;
}>;

export type TngFlowConnectionRejectedEvent = Readonly<{
  source?: TngFlowEndpoint;
  target?: TngFlowEndpoint;
  code: string;
  reason: string;
  origin: 'tailng' | 'consumer';
}>;

export type TngFlowNodeView<TStatus extends string = TngFlowNodeStatus> = Readonly<{
  status?: TStatus;
  progress?: number | null;
  /** @deprecated Supply a `TngFlowValidationIssue` with an error severity. */
  invalid?: boolean;
  /** @deprecated Use `TngFlowPresentation.nodes[nodeId].statusMessage`. */
  message?: string | null;
}>;

export type TngFlowNodeViews<TStatus extends string = TngFlowNodeStatus> = Readonly<
  Record<string, TngFlowNodeView<TStatus>>
>;

export type TngFlowNodeMove = Readonly<{
  id: string;
  position: TngFlowPoint;
}>;

export type TngFlowNodesMovedEvent = Readonly<{
  nodes: readonly TngFlowNodeMove[];
}>;

export type TngFlowNodePositionChange = Readonly<{
  nodeId: string;
  previousPosition: TngFlowPoint;
  position: TngFlowPoint;
}>;

/** @deprecated Use `TngFlowConnectionCreateRequest`. */
export type TngFlowConnectionCreatedEvent = Readonly<{
  source: TngFlowEndpoint;
  target: TngFlowEndpoint;
  dropPosition: TngFlowPoint;
}>;

/** @deprecated Use `TngFlowConnectionReconnectRequest`. */
export type TngFlowConnectionReassignedEvent = Readonly<{
  connectionId: string;
  endpoint: 'source' | 'target';
  previousSource: TngFlowEndpoint;
  source: TngFlowEndpoint | undefined;
  previousTarget: TngFlowEndpoint;
  target: TngFlowEndpoint | undefined;
  dropPosition: TngFlowPoint;
}>;

/** @deprecated Use `TngFlowSelection`. */
export type TngFlowSelectionChangedEvent = Readonly<{
  nodeIds: readonly string[];
  connectionIds: readonly string[];
}>;

/** @deprecated Use the split node and connection delete requests. */
export type TngFlowDeleteRequestedEvent = Readonly<{
  nodeIds: readonly string[];
  connectionIds: readonly string[];
}>;

export type TngFlowViewport = Readonly<{
  position: TngFlowPoint;
  scale: number;
}>;

/** @deprecated Use `TngFlowViewport`. */
export type TngFlowViewportChangedEvent = TngFlowViewport;
