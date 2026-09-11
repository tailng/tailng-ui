import type { TngFlowResolvedConnectionView } from './tng-flow-presentation.types';
import type { TngFlowConnection, TngFlowPoint } from './tng-flow.types';

export type TngFlowConnectionPathType =
  | 'adaptive'
  | 'bezier'
  | 'orthogonal'
  | 'orthogonal-rounded'
  | 'straight';

export type TngFlowConnectionRouting = Readonly<{
  /** TailNG-owned path shape. */
  type?: TngFlowConnectionPathType;
  /** Distance travelled away from an endpoint before the path turns. */
  offset?: number;
  /** Corner radius for rounded orthogonal paths. */
  radius?: number;
  /** Persisted intermediate points in flow canvas coordinates. */
  waypoints?: readonly TngFlowPoint[];
}>;

export type TngFlowConnectionMarker = 'arrow' | 'circle' | 'diamond' | 'none';

export type TngFlowConnectionLabelPlacement = 'center' | 'end' | 'start';

export type TngFlowConnectionLabelOptions = Readonly<{
  placement?: TngFlowConnectionLabelPlacement;
  /** Perpendicular distance from the path in CSS pixels. */
  offset?: number;
  /** Additional horizontal label translation in CSS pixels. */
  offsetX?: number;
  /** Additional vertical label translation in CSS pixels. */
  offsetY?: number;
}>;

export type TngFlowDefaultConnectionRouting = Readonly<{
  type: TngFlowConnectionPathType;
  offset: number;
  radius: number;
}>;

export type TngFlowDefaultConnectionOptions = Readonly<{
  routing: TngFlowDefaultConnectionRouting;
  /** Shorthand for the target marker. */
  marker?: TngFlowConnectionMarker;
  sourceMarker: TngFlowConnectionMarker;
  targetMarker: TngFlowConnectionMarker;
  labelPlacement: TngFlowConnectionLabelPlacement;
  labelOffset?: number;
  labelOffsetX?: number;
  labelOffsetY?: number;
}>;

export type TngFlowMotionPreference = 'disabled' | 'enabled' | 'system';

export type TngFlowEditorOptions = Readonly<{
  defaultConnection?: Partial<
    Omit<TngFlowDefaultConnectionOptions, 'routing'> & {
      routing: Partial<TngFlowDefaultConnectionRouting>;
    }
  >;
  connectionSelectionEnabled?: boolean;
  connectionReassignmentEnabled?: boolean;
  connectionWaypointsEnabled?: boolean;
  selectionEnabled?: boolean;
  reassignmentEnabled?: boolean;
  waypointsEnabled?: boolean;
  motionPreference?: TngFlowMotionPreference;
}>;

/** Focused alias retained for consumers that configure only connection behavior. */
export type TngFlowEditorConnectionOptions = TngFlowEditorOptions;

export type TngFlowConnectionWaypointsChange = Readonly<{
  connectionId: string;
  previousWaypoints: readonly TngFlowPoint[];
  waypoints: readonly TngFlowPoint[];
}>;

export type TngFlowConnectionRoutingChangeSource = 'api' | 'controls';

/** Controlled request to change the path shape of one or more connections. */
export type TngFlowConnectionRoutingChangeRequest = Readonly<{
  connectionIds: readonly string[];
  type: TngFlowConnectionPathType;
  source: TngFlowConnectionRoutingChangeSource;
}>;

export type TngFlowConnectionAriaContext = Readonly<{
  source: string;
  target: string;
  view: TngFlowResolvedConnectionView;
}>;

export type TngFlowConnectionAriaLabelFactory<TData = unknown> = (
  connection: TngFlowConnection<TData>,
  context: TngFlowConnectionAriaContext,
) => string;

/**
 * Compatibility defaults preserve the rendering of definitions created before
 * the routing contract was introduced.
 */
export const DEFAULT_TNG_FLOW_CONNECTION_OPTIONS: TngFlowDefaultConnectionOptions = Object.freeze({
  routing: Object.freeze({
    type: 'bezier',
    offset: 12,
    radius: 8,
  }),
  sourceMarker: 'none',
  targetMarker: 'none',
  marker: 'none',
  labelPlacement: 'center',
  labelOffset: 0,
  labelOffsetX: 0,
  labelOffsetY: 0,
});

/** Recommended opt-in defaults for workflow-authoring applications. */
export const RECOMMENDED_TNG_FLOW_CONNECTION_OPTIONS: TngFlowDefaultConnectionOptions =
  Object.freeze({
    routing: Object.freeze({
      type: 'orthogonal-rounded',
      offset: 24,
      radius: 12,
    }),
    sourceMarker: 'none',
    targetMarker: 'arrow',
    marker: 'arrow',
    labelPlacement: 'center',
    labelOffset: 0,
    labelOffsetX: 0,
    labelOffsetY: 0,
  });
