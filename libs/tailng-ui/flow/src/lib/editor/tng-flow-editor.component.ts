import { DOCUMENT, NgTemplateOutlet } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  NgZone,
  afterRenderEffect,
  booleanAttribute,
  computed,
  contentChild,
  contentChildren,
  effect,
  inject,
  input,
  model,
  output,
  signal,
  type TemplateRef,
  viewChild,
  viewChildren,
} from '@angular/core';
import {
  FA11yAnnouncer,
  F_A11Y_CONFIG,
  FCanvasComponent,
  FConnectionMarkerArrow,
  FConnectionMarkerCircle,
  FConnectorDirective,
  FFlowComponent,
  FFlowModule,
  FMinimapComponent,
  calculatePointerInFlow,
  provideFFlow,
  type FCreateConnectionSession,
  type IFA11yResolvedConfig,
  withA11y,
} from '@foblex/flow';
import { TngButtonComponent } from '@tailng-ui/components';
import { TngFlowConnectionMarkerDiamondDirective } from './tng-flow-connection-marker-diamond.directive';
import { TngFlowFoblexBridgeDirective } from './tng-flow-foblex-bridge.directive';
import {
  TngFlowKeyboardConfig,
  type TngResolvedFlowKeyboardOptions,
} from './tng-flow-keyboard-config';
import { alignTngFlowNodes, distributeTngFlowNodes } from '../arrangement/tng-flow-arrangement';
import { TngFlowConnectionTemplateDirective } from '../connection-template/tng-flow-connection-template.directive';
import {
  DEFAULT_TNG_FLOW_NODE_SIZE,
  resolveTngFlowNearestBorderSides,
  type TngFlowNearestBorderNode,
} from '../geometry/tng-flow-nearest-border';
import {
  isTngFlowGridEnabled,
  snapTngFlowCoordinate,
  snapTngFlowPoint,
} from '../geometry/tng-flow-position';
import {
  calculateTngFlowLayout,
  type TngFlowLayoutCalculation,
} from '../layout/tng-flow-layout-coordinator';
import { TNG_FLOW_LAYOUT_ENGINE } from '../layout/tng-flow-layout.provider';
import { resolveTngFlowCapabilities } from '../model/tng-flow-capabilities';
import {
  resolveTngFlowConnectionOptions,
  tngFlowLabelPlacementPosition,
  tngFlowPathTypeToRendererType,
  type TngResolvedFlowConnectionOptions,
} from '../model/tng-flow-connection-options';
import { createTngFlowConnectorId, parseTngFlowConnectorId } from '../model/tng-flow-connector-id';
import {
  TNG_FLOW_CUSTOM_POINTS_PER_SIDE,
  isTngFlowCustomPointPortId,
  mergeTngFlowCustomPointPorts,
  parseTngFlowCustomPointId,
} from '../model/tng-flow-custom-point';
import {
  createTngFlowConnectionCandidate,
  createTngFlowGraphIndex,
  getTngFlowNodePorts,
  type TngFlowGraphIndex,
  type TngFlowPortRecord,
} from '../model/tng-flow-graph';
import {
  createTngFlowIssueIndex,
  resolveTngFlowValidationSeverity,
} from '../model/tng-flow-issue-index';
import {
  resolveTngFlowConnectionView,
  resolveTngFlowNodeView,
} from '../model/tng-flow-resolved-view';
import { areTngFlowSelectionsEqual, sanitizeTngFlowSelection } from '../model/tng-flow-selection';
import { TngFlowNodeComponent } from '../node/tng-flow-node.component';
import {
  TngFlowNodeTemplateDirective,
  type TngFlowNodeTemplateContext,
} from '../node-template/tng-flow-node-template.directive';
import { readTngFlowPaletteItemEnvelope } from '../palette-item/tng-flow-palette-item.directive';
import { TngFlowPortComponent } from '../port/tng-flow-port.component';
import type {
  TngFlowArrangementOperation,
  TngFlowArrangementOptions,
  TngFlowArrangementRequestSource,
  TngFlowDistributionAxis,
  TngFlowNodeAlignment,
  TngFlowNodesArrangementRequest,
  TngFlowSmartGuideModifier,
  TngFlowSmartGuidesOptions,
} from '../types/tng-flow-arrangement.types';
import type {
  TngFlowEditorCommand,
  TngFlowEditorCommandRequest,
  TngFlowEditorCommandShortcuts,
  TngFlowEditorCommandSource,
} from '../types/tng-flow-command.types';
import type { TngFlowConnectionTemplateContext } from '../types/tng-flow-connection-template.types';
import {
  DEFAULT_TNG_FLOW_CONNECTION_OPTIONS,
  type TngFlowConnectionAriaLabelFactory,
  type TngFlowConnectionPathType,
  type TngFlowConnectionRouting,
  type TngFlowConnectionRoutingChangeRequest,
  type TngFlowConnectionRoutingChangeSource,
  type TngFlowConnectionWaypointsChange,
  type TngFlowDefaultConnectionOptions,
  type TngFlowEditorConnectionOptions,
  type TngFlowEditorOptions,
  type TngFlowMotionPreference,
} from '../types/tng-flow-connection.types';
import type {
  TngFlowContextMenuRequest,
  TngFlowContextMenuTarget,
} from '../types/tng-flow-context-menu.types';
import type {
  TngFlowActivationSource,
  TngFlowConnectionActivatedEvent,
  TngFlowNodeActivatedEvent,
  TngFlowValidationIssueActivatedEvent,
  TngFlowValidationIssueActivationSource,
} from '../types/tng-flow-events.types';
import type { TngFlowNodeBounds, TngFlowSize } from '../types/tng-flow-geometry.types';
import type { TngFlowKeyboardOptions } from '../types/tng-flow-keyboard.types';
import type {
  TngFlowAutoLayoutOptions,
  TngFlowLayoutEngine,
  TngFlowLayoutGraph,
  TngFlowLayoutNode,
  TngFlowLayoutRequestSource,
  TngFlowNodesLayoutRequest,
  TngResolvedFlowLayoutViewportOptions,
} from '../types/tng-flow-layout.types';
import type {
  TngFlowMinimapOptions,
  TngFlowMinimapPosition,
  TngResolvedFlowMinimapOptions,
} from '../types/tng-flow-minimap.types';
import type { TngFlowRevealOptions } from '../types/tng-flow-navigation.types';
import {
  EMPTY_TNG_FLOW_PRESENTATION,
  type TngFlowPresentation,
  type TngFlowProgressDisplayMode,
  type TngFlowResolvedConnectionView,
  type TngFlowResolvedNodeView,
} from '../types/tng-flow-presentation.types';
import {
  EMPTY_TNG_FLOW_VALIDATION,
  type TngFlowValidation,
  type TngFlowValidationIssue,
  type TngFlowValidationTarget,
} from '../types/tng-flow-validation.types';
import type {
  TngFlowAttachmentLayout,
  TngFlowBackgroundGridMode,
  TngFlowConnection,
  TngFlowConnectionCandidate,
  TngFlowConnectionCreatedEvent,
  TngFlowConnectionCreateRequest,
  TngFlowConnectionReconnectRequest,
  TngFlowConnectionReassignedEvent,
  TngFlowConnectionRejectedEvent,
  TngFlowConnectionsDeleteRequest,
  TngFlowConnectionValidation,
  TngFlowConnectionValidator,
  TngFlowDeleteRequestedEvent,
  TngFlowDefinition,
  TngFlowEditorMode,
  TngFlowEndpoint,
  TngFlowNode,
  TngFlowNodeCreateRequest,
  TngFlowNodeCreateSource,
  TngFlowNodePositionChange,
  TngFlowNodesDeleteRequest,
  TngFlowNodeStatus,
  TngFlowNodeViews,
  TngFlowNodesMovedEvent,
  TngFlowPoint,
  TngFlowPaletteItem,
  TngFlowPort,
  TngFlowPortSide,
  TngFlowSelection,
  TngFlowSelectionChangedEvent,
  TngFlowViewport,
  TngFlowViewportChangedEvent,
} from '../types/tng-flow.types';
import { EMPTY_TNG_FLOW_SELECTION } from '../types/tng-flow.types';
import {
  createTngFlowConnectionValidationIndex,
  validateTngFlowConnectionCandidate,
} from '../validation/tng-flow-connection-validation';
import { analyzeTngFlow } from '../validation/tng-flow-validation';
import { TngFlowValidationBadgeComponent } from '../validation-badge/tng-flow-validation-badge.component';

const EMPTY_ISSUES = Object.freeze([]) as readonly TngFlowValidationIssue[];
const DEFAULT_TNG_FLOW_GRID_SIZE = 16;
const emptyResolvedNodeView = Object.freeze({
  selected: false,
  disabled: false,
  locked: false,
  status: 'idle',
  progress: null,
  progressSpecified: false,
  statusMessage: null,
  validationSeverity: null,
  invalid: false,
  highlighted: false,
  dimmed: false,
});
const noConnectableTargetId = '__tng-flow-no-connectable-target__';
const NON_EDIT_BLOCKED_KEYS = new Set([' ', 'backspace', 'delete']);
const READONLY_BLOCKED_KEYS = new Set([
  'arrowdown',
  'arrowleft',
  'arrowright',
  'arrowup',
  'end',
  'home',
]);
const TNG_FLOW_MINIMAP_POSITIONS = new Set<TngFlowMinimapPosition>([
  'bottom-left',
  'bottom-right',
  'top-left',
  'top-right',
]);
const TNG_FLOW_MINIMAP_KEYBOARD_DELTAS: Readonly<Record<string, TngFlowPoint>> = Object.freeze({
  ArrowLeft: { x: 1, y: 0 },
  ArrowRight: { x: -1, y: 0 },
  ArrowUp: { x: 0, y: 1 },
  ArrowDown: { x: 0, y: -1 },
});
const TNG_FLOW_KEYBOARD_DIRECTION_DELTAS: Readonly<Record<string, TngFlowPoint>> = Object.freeze({
  ArrowLeft: { x: -1, y: 0 },
  ArrowRight: { x: 1, y: 0 },
  ArrowUp: { x: 0, y: -1 },
  ArrowDown: { x: 0, y: 1 },
});
const TNG_FLOW_COMMAND_SHORTCUTS: readonly Readonly<{
  command: TngFlowEditorCommand;
  key: string;
  shiftKey: boolean;
  controlOnly?: boolean;
}>[] = Object.freeze([
  { command: 'undo', key: 'z', shiftKey: false },
  { command: 'redo', key: 'z', shiftKey: true },
  { command: 'redo', key: 'y', shiftKey: false, controlOnly: true },
  { command: 'cut', key: 'x', shiftKey: false },
  { command: 'copy', key: 'c', shiftKey: false },
  { command: 'paste', key: 'v', shiftKey: false },
  { command: 'duplicate', key: 'd', shiftKey: false },
]);
const DEFAULT_TNG_FLOW_MINIMAP_OPTIONS: TngResolvedFlowMinimapOptions = Object.freeze({
  position: 'bottom-left',
  width: 140,
  height: 120,
  minSize: 1000,
  nodeRenderLimit: 10000,
  interactive: true,
  ariaLabel: 'Workflow overview',
});
const TNG_FLOW_MINIMAP_NODE_ID_CLASS_PREFIX = 'tng-flow-minimap__node-id--';
const DEFAULT_TNG_FLOW_SMART_GUIDE_THRESHOLD = 10;
const TNG_FLOW_SMART_GUIDE_MODIFIERS = new Set<TngFlowSmartGuideModifier>([
  'alt',
  'control',
  'meta',
  'shift',
]);

type RendererPointLike = Readonly<{ x: number; y: number }>;
type RendererCanvasChangeLike = Readonly<{ position: RendererPointLike; scale: number }>;
type RendererCreateConnectionLike = Readonly<{
  sourceId: string;
  targetId: string | undefined;
  dropPosition: RendererPointLike;
}>;
type RendererCreateNodeLike = Readonly<{
  data: unknown;
  externalItemRect: Readonly<{
    x: number;
    y: number;
    width: number;
    height: number;
  }>;
}>;
type RendererDeleteSelectedLike = Readonly<{
  nodeIds: readonly string[];
  connectionIds: readonly string[];
}>;
type RendererMoveNodesLike = Readonly<{
  nodes: readonly Readonly<{ id: string; position: RendererPointLike }>[];
}>;
type RendererReassignConnectionLike = Readonly<{
  connectionId: string;
  endpoint: 'source' | 'target';
  previousSourceId: string;
  nextSourceId: string | undefined;
  previousTargetId: string;
  nextTargetId: string | undefined;
  dropPosition: RendererPointLike;
}>;
type RendererSelectionChangeLike = Readonly<{
  nodeIds: readonly string[];
  connectionIds: readonly string[];
}>;
type RendererConnectionWaypointsChangedLike = Readonly<{
  connectionId: string;
  waypoints: readonly RendererPointLike[];
}>;
type ConnectionBooleanOptionKey =
  | 'connectionReassignmentEnabled'
  | 'connectionSelectionEnabled'
  | 'connectionWaypointsEnabled';
type LegacyConnectionBooleanOptionKey =
  | 'reassignmentEnabled'
  | 'selectionEnabled'
  | 'waypointsEnabled';
type MultiSelectEventLike = Readonly<{
  ctrlKey: boolean;
  metaKey: boolean;
  shiftKey: boolean;
}>;

// eslint-disable-next-line complexity, max-params -- Canonical and compatibility aliases have explicit precedence across two inputs.
function resolveConnectionBooleanOption(
  focusedOptions: TngFlowEditorConnectionOptions | null,
  editorOptions: TngFlowEditorOptions | null,
  key: ConnectionBooleanOptionKey,
  legacyKey: LegacyConnectionBooleanOptionKey,
  fallback: boolean,
): boolean {
  const focusedValue = focusedOptions?.[key] ?? focusedOptions?.[legacyKey];
  if (focusedValue !== undefined) {
    return focusedValue;
  }
  return editorOptions?.[key] ?? editorOptions?.[legacyKey] ?? fallback;
}
type NodePortGroups = Readonly<{
  ports: readonly TngFlowPort[];
  bySide: Readonly<Record<TngFlowPortSide, readonly TngFlowPort[]>>;
}>;
type ValidatedConnection = Readonly<{
  validation: TngFlowConnectionValidation;
  origin: 'tailng' | 'consumer';
}>;
type PendingReveal = Readonly<{
  target: TngFlowValidationTarget;
  options: TngFlowRevealOptions;
}>;
type PendingLayoutViewport = Readonly<{
  positions: ReadonlyMap<string, TngFlowPoint>;
  viewport: TngResolvedFlowLayoutViewportOptions;
}>;
type MeasuredLayoutGraph<TNodeData, TConnectionData> = Readonly<{
  graph: TngFlowLayoutGraph<TNodeData, TConnectionData>;
  signature: string;
}>;
type MeasurableLayoutElement = Readonly<{
  dataset: Readonly<DOMStringMap>;
  getBoundingClientRect: () => DOMRect;
}>;
type ResolvedSmartGuidesOptions = Readonly<{
  enabled: boolean;
  alignmentThreshold: number;
  spacingThreshold: number;
  disableModifier?: TngFlowSmartGuideModifier;
}>;
type KeyboardConnectionSourceSession = Readonly<{
  phase: 'source';
  sourceConnectorIds: readonly string[];
  sourceIndex: number;
}>;
type KeyboardConnectionTargetSession = Readonly<{
  phase: 'target';
  sourceConnectorId: string;
  targetConnectorIds: readonly string[];
  targetIndex: number;
}>;
type KeyboardConnectionSession = KeyboardConnectionSourceSession | KeyboardConnectionTargetSession;
type ContextMenuInvocation = Readonly<{
  target: TngFlowContextMenuTarget;
  source: 'keyboard' | 'pointer';
  clientPosition: TngFlowPoint;
}>;
type MinimapHoverNavigationSnapshot = Readonly<{
  canvasPosition: TngFlowPoint;
  canvasScale: number;
  flowSize: TngFlowSize;
  minimapOrigin: TngFlowPoint;
  minimapScale: number;
  viewBoxPosition: TngFlowPoint;
}>;

const TNG_FLOW_LAYOUT_REFRESH_DEBOUNCE_MS = 64;
const TNG_FLOW_CONNECTION_PATH_TYPES = new Set<TngFlowConnectionPathType>([
  'bezier',
  'straight',
  'orthogonal',
  'orthogonal-rounded',
  'adaptive',
]);

type TngFlowConnectionPathOption = Readonly<{
  ariaLabel: string;
  label: string;
  type: TngFlowConnectionPathType;
}>;

const TNG_FLOW_CONNECTION_PATH_OPTIONS: readonly TngFlowConnectionPathOption[] = Object.freeze([
  Object.freeze({
    ariaLabel: 'Use adaptive curve connections',
    label: 'Adaptive curve',
    type: 'adaptive',
  }),
  Object.freeze({
    ariaLabel: 'Use Bézier curve connections',
    label: 'Bézier curve',
    type: 'bezier',
  }),
  Object.freeze({
    ariaLabel: 'Use orthogonal elbow connections',
    label: 'Orthogonal elbow',
    type: 'orthogonal',
  }),
  Object.freeze({
    ariaLabel: 'Use rounded orthogonal elbow connections',
    label: 'Rounded orthogonal elbow',
    type: 'orthogonal-rounded',
  }),
  Object.freeze({ ariaLabel: 'Use straight connections', label: 'Straight', type: 'straight' }),
]);

@Component({
  selector: 'tng-flow-editor',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    FFlowModule,
    FConnectionMarkerArrow,
    FConnectionMarkerCircle,
    NgTemplateOutlet,
    TngButtonComponent,
    TngFlowConnectionMarkerDiamondDirective,
    TngFlowFoblexBridgeDirective,
    TngFlowNodeComponent,
    TngFlowPortComponent,
    TngFlowValidationBadgeComponent,
  ],
  providers: [
    ...provideFFlow(withA11y()),
    FA11yAnnouncer,
    TngFlowKeyboardConfig,
    {
      provide: F_A11Y_CONFIG,
      useFactory: (config: Readonly<TngFlowKeyboardConfig>): IFA11yResolvedConfig =>
        config.foblexConfig as IFA11yResolvedConfig,
      deps: [TngFlowKeyboardConfig],
    },
  ],
  templateUrl: './tng-flow-editor.component.html',
  styleUrl: './tng-flow-editor.component.css',
  exportAs: 'tngFlowEditor',
})
export class TngFlowEditorComponent<
  TData = unknown,
  TStatus extends string = TngFlowNodeStatus,
  TConnectionData = unknown,
> {
  private readonly canvas = viewChild.required(FCanvasComponent);
  private readonly flow = viewChild(FFlowComponent);
  private readonly minimap = viewChild(FMinimapComponent);
  private readonly rendererBridge = viewChild.required(TngFlowFoblexBridgeDirective);
  private readonly connectors = viewChildren(FConnectorDirective);
  protected readonly connectionTemplate = contentChild(
    TngFlowConnectionTemplateDirective<TConnectionData>,
    { descendants: true },
  );
  private readonly nodeTemplates = contentChildren(TngFlowNodeTemplateDirective<TData, TStatus>, {
    descendants: true,
  });
  private readonly documentRef = inject(DOCUMENT);
  private readonly hostElement = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly changeDetectorRef = inject(ChangeDetectorRef);
  private readonly ngZone = inject(NgZone);
  private readonly announcer = inject(FA11yAnnouncer);
  private readonly keyboardConfig = inject(TngFlowKeyboardConfig);
  private readonly providedLayoutEngine = inject(TNG_FLOW_LAYOUT_ENGINE, {
    optional: true,
  }) as TngFlowLayoutEngine<TData, TConnectionData> | null;
  private hasFittedInitialNodes = false;
  private lastFitDefinitionSignature: string | null = null;
  private isFullyRendered = false;
  private layoutRequestSequence = 0;
  private pendingReveal: PendingReveal | null = null;
  private lastFocusedPortConnectorId: string | null = null;
  private lastPointerClientPosition: TngFlowPoint | null = null;
  private minimapPointerInside = false;
  private minimapHoverNavigationSnapshot: MinimapHoverNavigationSnapshot | null = null;
  private minimapHoverResetPosition: TngFlowPoint | null = null;
  private nodePointerSessionActive = false;
  private readonly pendingLayoutViewport = signal<PendingLayoutViewport | null>(null);
  private readonly keyboardConnection = signal<KeyboardConnectionSession | null>(null);
  private readonly currentCanvasScale = signal(1);
  protected readonly scrollZoomLocked = signal(false);
  protected readonly scrollZoomTrigger = (): boolean => !this.scrollZoomLocked();
  private readonly smartGuidesSuppressedForDrag = signal(false);
  /** Live positions during drag before the controlled definition catches up. */
  private readonly provisionalPositions = signal<ReadonlyMap<string, TngFlowPoint>>(new Map());
  /** Last measured node sizes for nearest-border geometry. */
  private readonly measuredNodeSizes = signal<ReadonlyMap<string, TngFlowSize>>(new Map());
  /** Active pointer-connect source connector id while the renderer is dragging a connection. */
  private readonly pointerConnectionSourceId = signal<string | null>(null);

  private get connectionSession(): FCreateConnectionSession {
    return this.rendererBridge().connectionSession as FCreateConnectionSession;
  }

  public readonly definition = input<TngFlowDefinition<TData, TConnectionData> | null>(null);
  public readonly nodes = input<readonly TngFlowNode<TData>[] | null>(null);
  public readonly connections = input<readonly TngFlowConnection<TConnectionData>[] | null>(null);
  public readonly validation = input<TngFlowValidation>(EMPTY_TNG_FLOW_VALIDATION);
  public readonly presentation = input<TngFlowPresentation<TStatus>>(
    EMPTY_TNG_FLOW_PRESENTATION as TngFlowPresentation<TStatus>,
  );
  public readonly progressDisplayMode = input<TngFlowProgressDisplayMode>('status-driven');
  /** @deprecated Use `presentation.nodes`. */
  public readonly nodeViews = input<TngFlowNodeViews<TStatus>>({});
  public readonly mode = input<TngFlowEditorMode>('edit');
  /**
   * `static-ports` keeps declared port sides and labels.
   * `nearest-border` live-assigns each connected endpoint to its exit border
   * (diagonal mixes allowed).
   * `custom-points` synthesizes a fixed 3-per-side border grid for point→point wiring.
   */
  public readonly attachmentLayout = input<TngFlowAttachmentLayout>('static-ports');
  public readonly selection = input<TngFlowSelection>(EMPTY_TNG_FLOW_SELECTION);
  public readonly viewport = input<TngFlowViewport | null>(null);
  public readonly connectionValidator = input<TngFlowConnectionValidator<TData> | null>(null);
  public readonly options = input<TngFlowEditorOptions | null>(null);
  public readonly connectionOptions = input<TngFlowEditorConnectionOptions | null>(null);
  /** Path shape used by the live connection preview and newly requested connections. */
  public readonly connectionCreationPathType = model<TngFlowConnectionPathType | null>(null);
  public readonly connectionAriaLabel =
    input<TngFlowConnectionAriaLabelFactory<TConnectionData> | null>(null);
  public readonly connectionAriaLabelFactory =
    input<TngFlowConnectionAriaLabelFactory<TConnectionData> | null>(null);
  /** Overrides an engine configured with `provideTngFlowLayoutEngine` for this editor. */
  public readonly layoutEngine = input<TngFlowLayoutEngine<TData, TConnectionData> | null>(null);
  public readonly keyboardOptions = input<TngFlowKeyboardOptions | null>(null);
  public readonly smartGuides = input<TngFlowSmartGuidesOptions | null>(null);
  public readonly commandShortcuts = input<TngFlowEditorCommandShortcuts>(false);
  public readonly contextMenuEnabled = input<boolean, boolean | string>(false, {
    transform: booleanAttribute,
  });
  public readonly ariaLabel = input<string>('Workflow editor');
  public readonly flowId = input<string>('tng-flow-editor');
  public readonly fitOnInit = input<boolean, boolean | string>(true, {
    transform: booleanAttribute,
  });
  public readonly fitOnDefinitionChange = input<boolean, boolean | string>(false, {
    transform: booleanAttribute,
  });
  public readonly showBackground = input<boolean, boolean | string>(true, {
    transform: booleanAttribute,
  });
  public readonly showControls = input<boolean, boolean | string>(true, {
    transform: booleanAttribute,
  });
  public readonly showConnectionTools = input<boolean, boolean | string>(true, {
    transform: booleanAttribute,
  });
  public readonly showMinimap = input<boolean, boolean | string>(false, {
    transform: booleanAttribute,
  });
  public readonly minimapOptions = input<TngFlowMinimapOptions | null>(null);
  public readonly showSelectionArea = input<boolean, boolean | string>(true, {
    transform: booleanAttribute,
  });
  public readonly canUndo = input<boolean, boolean | string>(false, {
    transform: booleanAttribute,
  });
  public readonly canRedo = input<boolean, boolean | string>(false, {
    transform: booleanAttribute,
  });
  public readonly snapToGrid = input<boolean, boolean | string>(false, {
    transform: booleanAttribute,
  });
  public readonly gridSize = input<number>(DEFAULT_TNG_FLOW_GRID_SIZE);
  public readonly backgroundGridMode = input<TngFlowBackgroundGridMode>('canvas');
  public readonly zoomMinimum = input<number>(0.35);
  public readonly zoomMaximum = input<number>(2);
  public readonly zoomStep = input<number>(0.15);

  public readonly nodesMoved = output<TngFlowNodesMovedEvent>();
  public readonly nodePositionChange = output<TngFlowNodePositionChange>();
  public readonly nodeCreateRequested = output<TngFlowNodeCreateRequest<TData>>();
  public readonly connectionCreateRequested = output<TngFlowConnectionCreateRequest>();
  public readonly connectionReconnectRequested = output<TngFlowConnectionReconnectRequest>();
  public readonly connectionRoutingChangeRequested =
    output<TngFlowConnectionRoutingChangeRequest>();
  public readonly connectionWaypointsChange = output<TngFlowConnectionWaypointsChange>();
  public readonly connectionsDeleteRequested = output<TngFlowConnectionsDeleteRequest>();
  public readonly nodesDeleteRequested = output<TngFlowNodesDeleteRequest>();
  public readonly nodesLayoutRequested = output<TngFlowNodesLayoutRequest>();
  public readonly nodesArrangementRequested = output<TngFlowNodesArrangementRequest>();
  public readonly selectionChange = output<TngFlowSelection>();
  public readonly commandRequested = output<TngFlowEditorCommandRequest>();
  public readonly contextMenuRequested = output<TngFlowContextMenuRequest>();
  public readonly connectionRejected = output<TngFlowConnectionRejectedEvent>();
  public readonly nodeActivated = output<TngFlowNodeActivatedEvent>();
  public readonly connectionActivated = output<TngFlowConnectionActivatedEvent>();
  public readonly validationIssueActivated = output<TngFlowValidationIssueActivatedEvent>();
  /** @deprecated Use `connectionCreateRequested`. */
  public readonly connectionCreated = output<TngFlowConnectionCreatedEvent>();
  /** @deprecated Use `connectionReconnectRequested`. */
  public readonly connectionReassigned = output<TngFlowConnectionReassignedEvent>();
  /** @deprecated Use `selectionChange`. */
  public readonly selectionChanged = output<TngFlowSelectionChangedEvent>();
  /** @deprecated Use the split node and connection delete outputs. */
  public readonly deleteRequested = output<TngFlowDeleteRequestedEvent>();
  public readonly viewportChange = output<TngFlowViewport>();
  /** @deprecated Use `viewportChange`. */
  public readonly viewportChanged = output<TngFlowViewportChangedEvent>();
  public readonly ready = output<void>();

  private readonly analysis = computed(() => {
    const definition = this.definition();
    return analyzeTngFlow<TData, TConnectionData>(
      definition?.nodes ?? this.nodes() ?? [],
      definition?.connections ?? this.connections() ?? [],
    );
  });
  protected readonly graphNodes = computed(() => this.analysis().nodes);
  protected readonly graphConnections = computed(() => this.analysis().connections);
  protected readonly capabilities = computed(() => resolveTngFlowCapabilities(this.mode()));
  protected readonly canEdit = computed(() => this.capabilities().move);
  protected readonly canSelect = computed(() => this.capabilities().select);
  private readonly effectiveCanvasScale = computed(() => {
    const controlledScale = this.viewport()?.scale;
    return controlledScale !== undefined && Number.isFinite(controlledScale) && controlledScale > 0
      ? controlledScale
      : this.currentCanvasScale();
  });
  protected readonly backgroundGridSize = computed(() => {
    const gridSize = this.gridSize();
    const baseGridSize =
      Number.isFinite(gridSize) && gridSize > 0 ? gridSize : DEFAULT_TNG_FLOW_GRID_SIZE;
    if (this.backgroundGridMode() !== 'adaptive') {
      return baseGridSize;
    }
    return baseGridSize / Math.max(0.01, this.effectiveCanvasScale());
  });
  private readonly resolvedKeyboardOptions = computed<TngResolvedFlowKeyboardOptions>(() => {
    const options = this.keyboardOptions() ?? {};
    const gridSize = this.gridSize();
    const defaultMoveStep =
      this.snapToGrid() && Number.isFinite(gridSize) && gridSize > 0 ? gridSize : 1;
    const moveStep = this.normalizePositiveOption(options.moveStep, defaultMoveStep);
    const connectKeys = options.connectKeys ?? ['c'];
    return {
      moveStep,
      largeMoveStep: this.normalizePositiveOption(options.largeMoveStep, moveStep * 10),
      connectKeys: [...new Set(connectKeys.filter((key) => key.length > 0))],
    };
  });
  public readonly resolvedValidation = computed<TngFlowValidation>(() => ({
    issues: [...this.analysis().issues, ...this.validation().issues],
  }));
  public readonly validationIssues = computed(() => this.resolvedValidation().issues);
  protected readonly validationSeverity = computed(() =>
    resolveTngFlowValidationSeverity(this.validationIssues()),
  );
  protected readonly resolvedMinimapOptions = computed<TngResolvedFlowMinimapOptions>(() => {
    const options = this.minimapOptions() ?? {};
    const requestedPosition = options.position;
    const requestedAriaLabel = options.ariaLabel?.trim();
    return {
      position:
        requestedPosition !== undefined && TNG_FLOW_MINIMAP_POSITIONS.has(requestedPosition)
          ? requestedPosition
          : DEFAULT_TNG_FLOW_MINIMAP_OPTIONS.position,
      width: this.normalizePositiveOption(options.width, DEFAULT_TNG_FLOW_MINIMAP_OPTIONS.width),
      height: this.normalizePositiveOption(options.height, DEFAULT_TNG_FLOW_MINIMAP_OPTIONS.height),
      minSize: this.normalizePositiveOption(
        options.minSize,
        DEFAULT_TNG_FLOW_MINIMAP_OPTIONS.minSize,
      ),
      nodeRenderLimit: this.normalizeNonNegativeOption(
        options.nodeRenderLimit,
        DEFAULT_TNG_FLOW_MINIMAP_OPTIONS.nodeRenderLimit,
      ),
      interactive: options.interactive ?? DEFAULT_TNG_FLOW_MINIMAP_OPTIONS.interactive,
      ariaLabel:
        requestedAriaLabel === undefined || requestedAriaLabel.length === 0
          ? DEFAULT_TNG_FLOW_MINIMAP_OPTIONS.ariaLabel
          : requestedAriaLabel,
    };
  });
  protected readonly resolvedSmartGuidesOptions = computed<ResolvedSmartGuidesOptions>(() => {
    const options = this.smartGuides() ?? {};
    const disableModifier = options.disableModifier;
    return {
      enabled: options.enabled === true,
      alignmentThreshold: this.normalizeNonNegativeOption(
        options.alignmentThreshold,
        DEFAULT_TNG_FLOW_SMART_GUIDE_THRESHOLD,
      ),
      spacingThreshold: this.normalizeNonNegativeOption(
        options.spacingThreshold,
        DEFAULT_TNG_FLOW_SMART_GUIDE_THRESHOLD,
      ),
      ...(disableModifier !== undefined && TNG_FLOW_SMART_GUIDE_MODIFIERS.has(disableModifier)
        ? { disableModifier }
        : {}),
    };
  });
  protected readonly smartGuidesActive = computed(
    () =>
      this.canEdit() &&
      this.resolvedSmartGuidesOptions().enabled &&
      !this.smartGuidesSuppressedForDrag(),
  );
  protected readonly smartGuideAlignmentThreshold = computed(() =>
    this.smartGuideCanvasThreshold(this.resolvedSmartGuidesOptions().alignmentThreshold),
  );
  protected readonly smartGuideSpacingThreshold = computed(() =>
    this.smartGuideCanvasThreshold(this.resolvedSmartGuidesOptions().spacingThreshold),
  );
  protected readonly minimapOverRenderLimit = computed(() => {
    const limit = this.resolvedMinimapOptions().nodeRenderLimit;
    return limit > 0 && this.graphNodes().length > limit;
  });
  private readonly minimapNodeClassById = computed<ReadonlyMap<string, string>>(() => {
    const classByNodeId = new Map<string, string>();
    this.graphNodes().forEach((node, index) => {
      const className = `${TNG_FLOW_MINIMAP_NODE_ID_CLASS_PREFIX}${index}`;
      classByNodeId.set(node.id, className);
    });
    return classByNodeId;
  });
  protected readonly focusRingCompensation = computed(() => {
    return String(1 / Math.max(0.01, this.effectiveCanvasScale()));
  });

  private readonly graphIndex = computed<TngFlowGraphIndex<TData, TConnectionData>>(() => {
    const base = this.analysis().index;
    if (this.attachmentLayout() !== 'custom-points') {
      return base;
    }
    const nodes = this.graphNodes().map((node) => ({
      ...node,
      ports: mergeTngFlowCustomPointPorts(getTngFlowNodePorts(node)),
    }));
    return createTngFlowGraphIndex(nodes, this.graphConnections());
  });
  private readonly issueIndex = computed(() => createTngFlowIssueIndex(this.resolvedValidation()));
  private readonly sanitizedSelection = computed(() =>
    this.canSelect()
      ? sanitizeTngFlowSelection(this.selection(), this.graphIndex())
      : EMPTY_TNG_FLOW_SELECTION,
  );
  private readonly resolvedNodeViews = computed(() => {
    const presentation = this.presentation().nodes;
    const legacyViews = this.nodeViews();
    const issues = this.issueIndex().nodeIssues;
    const selection = this.sanitizedSelection();
    return new Map(
      this.graphNodes().map((node) => [
        node.id,
        resolveTngFlowNodeView(
          node,
          selection.nodeIds.has(node.id),
          presentation?.[node.id],
          legacyViews[node.id],
          issues.get(node.id) ?? EMPTY_ISSUES,
        ),
      ]),
    );
  });
  private readonly resolvedConnectionViews = computed(() => {
    const presentation = this.presentation().connections;
    const issues = this.issueIndex().connectionIssues;
    const selection = this.sanitizedSelection();
    return new Map(
      this.graphConnections().map((connection) => [
        connection.id,
        resolveTngFlowConnectionView(
          connection,
          selection.connectionIds.has(connection.id),
          presentation?.[connection.id],
          issues.get(connection.id) ?? EMPTY_ISSUES,
        ),
      ]),
    );
  });
  private readonly connectionValidationIndex = computed(() =>
    createTngFlowConnectionValidationIndex(this.graphConnections()),
  );
  protected readonly useNearestBorderLayout = computed(
    () => this.attachmentLayout() === 'nearest-border',
  );
  protected readonly useCustomPointsLayout = computed(
    () => this.attachmentLayout() === 'custom-points',
  );
  protected readonly useArrowMarkers = computed(
    () => this.useNearestBorderLayout() || this.useCustomPointsLayout(),
  );
  private readonly compatibilityConnectionDefaults = computed<TngFlowDefaultConnectionOptions>(
    () =>
      this.useArrowMarkers()
        ? Object.freeze({
            ...DEFAULT_TNG_FLOW_CONNECTION_OPTIONS,
            sourceMarker: 'arrow',
            targetMarker: 'arrow',
          })
        : DEFAULT_TNG_FLOW_CONNECTION_OPTIONS,
  );
  private readonly effectiveConnectionOptions = computed<TngFlowEditorConnectionOptions>(() => {
    const editorOptions = this.options() ?? {};
    const connectionOptions = this.connectionOptions() ?? {};
    return {
      ...editorOptions,
      ...connectionOptions,
      defaultConnection: {
        ...editorOptions.defaultConnection,
        ...connectionOptions.defaultConnection,
        routing: {
          ...editorOptions.defaultConnection?.routing,
          ...connectionOptions.defaultConnection?.routing,
        },
      },
    };
  });
  private readonly connectionSelectionEnabled = computed(() =>
    resolveConnectionBooleanOption(
      this.connectionOptions(),
      this.options(),
      'connectionSelectionEnabled',
      'selectionEnabled',
      true,
    ),
  );
  private readonly connectionReassignmentEnabled = computed(() =>
    resolveConnectionBooleanOption(
      this.connectionOptions(),
      this.options(),
      'connectionReassignmentEnabled',
      'reassignmentEnabled',
      true,
    ),
  );
  private readonly connectionWaypointsEnabled = computed(() =>
    resolveConnectionBooleanOption(
      this.connectionOptions(),
      this.options(),
      'connectionWaypointsEnabled',
      'waypointsEnabled',
      false,
    ),
  );
  private readonly resolvedConnectionOptions = computed(() => {
    const editorOptions = this.effectiveConnectionOptions();
    const compatibilityDefaults = this.compatibilityConnectionDefaults();
    return new Map(
      this.graphConnections().map((connection) => [
        connection.id,
        resolveTngFlowConnectionOptions(connection, editorOptions, compatibilityDefaults),
      ]),
    );
  });
  protected readonly connectionPathOptions = TNG_FLOW_CONNECTION_PATH_OPTIONS;
  private readonly editableSelectedConnectionIds = computed(() => {
    const selectedIds = this.sanitizedSelection().connectionIds;
    return this.graphConnections()
      .filter((connection) => selectedIds.has(connection.id) && connection.disabled !== true)
      .map((connection) => connection.id);
  });
  protected readonly activeConnectionPathType = computed<TngFlowConnectionPathType>(() => {
    const selectedType = this.connectionCreationPathType();
    if (this.isConnectionPathType(selectedType)) {
      return selectedType;
    }
    const configuredType = this.effectiveConnectionOptions().defaultConnection?.routing?.type;
    return this.isConnectionPathType(configuredType)
      ? configuredType
      : this.compatibilityConnectionDefaults().routing.type;
  });
  private readonly resolvedConnectionCreationOptions = computed(() =>
    resolveTngFlowConnectionOptions(
      {
        id: '__tng-flow-connection-creation-preview',
        source: { nodeId: '', portId: '' },
        target: { nodeId: '', portId: '' },
        routing: { type: this.activeConnectionPathType() },
      },
      this.effectiveConnectionOptions(),
      this.compatibilityConnectionDefaults(),
    ),
  );
  protected readonly connectionCreationRouting = computed<TngFlowConnectionRouting>(() => {
    const routing = this.resolvedConnectionCreationOptions().routing;
    return Object.freeze({
      type: routing.type,
      offset: routing.offset,
      radius: routing.radius,
    });
  });
  protected readonly connectionCreationRendererType = computed(() =>
    tngFlowPathTypeToRendererType(this.activeConnectionPathType()),
  );
  protected readonly connectionToolsTop = computed(() => {
    const minimap = this.resolvedMinimapOptions();
    return this.showMinimap() && minimap.position === 'top-left' ? minimap.height + 24 : 12;
  });
  private readonly rendererConnectionWaypoints = computed(
    () =>
      new Map(
        [...this.resolvedConnectionOptions()].map(([connectionId, options]) => [
          connectionId,
          options.routing.waypoints.map((point) => ({ x: point.x, y: point.y })),
        ]),
      ),
  );
  protected readonly motionPreference = computed<TngFlowMotionPreference>(
    () => this.effectiveConnectionOptions()?.motionPreference ?? 'system',
  );
  protected readonly createSourceMarker = computed(
    () =>
      this.effectiveConnectionOptions()?.defaultConnection?.sourceMarker ??
      this.compatibilityConnectionDefaults().sourceMarker,
  );
  protected readonly createTargetMarker = computed(
    () =>
      this.effectiveConnectionOptions()?.defaultConnection?.targetMarker ??
      this.effectiveConnectionOptions()?.defaultConnection?.marker ??
      this.compatibilityConnectionDefaults().targetMarker,
  );
  private readonly connectedCustomPointConnectorIds = computed(() => {
    if (!this.useCustomPointsLayout()) {
      return new Set<string>();
    }
    const connected = new Set<string>();
    for (const connection of this.graphConnections()) {
      for (const endpoint of [connection.source, connection.target]) {
        if (isTngFlowCustomPointPortId(endpoint.portId)) {
          connected.add(createTngFlowConnectorId(endpoint.nodeId, endpoint.portId));
        }
      }
    }
    return connected;
  });
  private readonly activeCustomPointConnectSourceId = computed(() => {
    if (!this.useCustomPointsLayout()) {
      return null;
    }
    const pointerSource = this.pointerConnectionSourceId();
    if (pointerSource !== null) {
      return pointerSource;
    }
    const session = this.keyboardConnection();
    if (session?.phase === 'target') {
      return session.sourceConnectorId;
    }
    return null;
  });
  private readonly effectiveNodePositions = computed<ReadonlyMap<string, TngFlowPoint>>(() => {
    const provisional = this.provisionalPositions();
    const positions = new Map<string, TngFlowPoint>();
    for (const node of this.graphNodes()) {
      positions.set(node.id, provisional.get(node.id) ?? node.position);
    }
    return positions;
  });
  private readonly nearestBorderNodes = computed<readonly TngFlowNearestBorderNode[]>(() => {
    const positions = this.effectiveNodePositions();
    const sizes = this.measuredNodeSizes();
    return this.graphNodes().map((node) => ({
      id: node.id,
      position: positions.get(node.id) ?? node.position,
      size: sizes.get(node.id) ?? DEFAULT_TNG_FLOW_NODE_SIZE,
    }));
  });
  private readonly nearestBorderSides = computed<ReadonlyMap<string, TngFlowPortSide>>(() => {
    if (!this.useNearestBorderLayout()) {
      return new Map();
    }
    return resolveTngFlowNearestBorderSides(this.nearestBorderNodes(), this.graphConnections());
  });
  private readonly portGroupsByNodeId = computed<ReadonlyMap<string, NodePortGroups>>(() => {
    const nearestSides = this.nearestBorderSides();
    const useNearest = this.useNearestBorderLayout();
    const useCustomPoints = this.useCustomPointsLayout();
    const entries = this.graphNodes().map((node) => {
      const ports = useCustomPoints
        ? mergeTngFlowCustomPointPorts(getTngFlowNodePorts(node))
        : getTngFlowNodePorts(node);
      const sideFor = (port: TngFlowPort): TngFlowPortSide => {
        if (useNearest) {
          const resolved = nearestSides.get(createTngFlowConnectorId(node.id, port.id));
          if (resolved !== undefined) {
            return resolved;
          }
        }
        return port.side ?? (port.direction === 'input' ? 'left' : 'right');
      };
      const portsForSide = (side: TngFlowPortSide): readonly TngFlowPort[] =>
        ports.filter((port) => sideFor(port) === side);
      return [
        node.id,
        {
          ports,
          bySide: {
            bottom: portsForSide('bottom'),
            left: portsForSide('left'),
            right: portsForSide('right'),
            top: portsForSide('top'),
          },
        },
      ] as const;
    });
    return new Map(entries);
  });
  private readonly provisionalPositionsSyncEffect = effect(() => {
    const provisional = this.provisionalPositions();
    if (provisional.size === 0) {
      return;
    }
    const nodes = this.graphNodes();
    let remaining: Map<string, TngFlowPoint> | null = null;
    for (const node of nodes) {
      const next = provisional.get(node.id);
      if (next?.x === node.position.x && next.y === node.position.y) {
        remaining ??= new Map(provisional);
        remaining.delete(node.id);
      }
    }
    if (remaining !== null) {
      this.provisionalPositions.set(remaining);
    }
  });
  private readonly connectableTargetsByConnectorId = computed<ReadonlyMap<string, string[]>>(() =>
    this.buildConnectableTargets(),
  );
  protected readonly renderableConnections = this.graphConnections;
  protected readonly summaryIssues = computed(() =>
    this.validationIssues().filter((issue) => !this.hasRenderableTarget(issue.target)),
  );
  protected readonly multiSelectTrigger = (event: MultiSelectEventLike): boolean =>
    event.shiftKey || event.metaKey || event.ctrlKey;

  private readonly keyboardConfigEffect = effect(() => {
    this.keyboardConfig.configure(this.resolvedKeyboardOptions());
  });
  private readonly selectionSyncEffect = afterRenderEffect(() => this.syncSelectionToFlow());
  private readonly keyboardGuardEffect = afterRenderEffect((onCleanup) => {
    const host = this.hostElement.nativeElement;
    const keydownListener = (event: KeyboardEvent): void => this.onHostKeydown(event);
    const pointerDownListener = (event: PointerEvent): void => this.onHostPointerDown(event);
    const pointerMoveListener = (event: PointerEvent): void => this.onHostPointerMove(event);
    const pointerFinishListener = (): void => this.onHostPointerFinish();
    const contextMenuListener = (event: MouseEvent): void => this.onHostContextMenu(event);
    host.addEventListener('keydown', keydownListener, true);
    host.addEventListener('pointerdown', pointerDownListener, true);
    host.addEventListener('pointermove', pointerMoveListener, true);
    host.addEventListener('contextmenu', contextMenuListener, true);
    this.documentRef.addEventListener('pointerup', pointerFinishListener, true);
    this.documentRef.addEventListener('pointercancel', pointerFinishListener, true);
    onCleanup(() => {
      host.removeEventListener('keydown', keydownListener, true);
      host.removeEventListener('pointerdown', pointerDownListener, true);
      host.removeEventListener('pointermove', pointerMoveListener, true);
      host.removeEventListener('contextmenu', contextMenuListener, true);
      this.documentRef.removeEventListener('pointerup', pointerFinishListener, true);
      this.documentRef.removeEventListener('pointercancel', pointerFinishListener, true);
    });
  });
  private readonly keyboardFocusRecoveryEffect = afterRenderEffect(() => {
    this.graphNodes();
    this.graphConnections();
    this.mode();
    this.syncKeyboardFocusAfterRender();
  });
  private readonly pointerConnectionSyncEffect = afterRenderEffect((onCleanup) => {
    if (!this.useCustomPointsLayout()) {
      this.pointerConnectionSourceId.set(null);
      return;
    }
    const flow = this.hostElement.nativeElement.querySelector('f-flow');
    if (flow === null) {
      return;
    }
    let wasDragging = flow.classList.contains('f-connections-dragging');
    const sync = (): void => {
      const dragging = flow.classList.contains('f-connections-dragging');
      if (dragging) {
        this.pointerConnectionSourceId.set(this.connectionSession.sourceId ?? null);
      } else if (wasDragging) {
        this.pointerConnectionSourceId.set(null);
      }
      wasDragging = dragging;
    };
    if (wasDragging) {
      sync();
    }
    const observer = new MutationObserver(sync);
    observer.observe(flow, { attributes: true, attributeFilter: ['class'] });
    onCleanup(() => observer.disconnect());
  });
  private readonly flowResizeEffect = afterRenderEffect((onCleanup) => {
    const flow = this.flow();
    if (flow === undefined || typeof ResizeObserver === 'undefined') {
      return;
    }
    const flowHost = flow.hostElement as HTMLElement;
    this.ngZone.runOutsideAngular(() => {
      let hasObservedInitialSize = false;
      let refreshTimer: ReturnType<typeof setTimeout> | undefined;
      const observer = new ResizeObserver(() => {
        if (!hasObservedInitialSize) {
          hasObservedInitialSize = true;
          return;
        }
        if (refreshTimer !== undefined) {
          clearTimeout(refreshTimer);
        }
        refreshTimer = setTimeout(() => {
          refreshTimer = undefined;
          this.refreshLayout();
        }, TNG_FLOW_LAYOUT_REFRESH_DEBOUNCE_MS);
      });
      observer.observe(flowHost);
      onCleanup(() => {
        observer.disconnect();
        if (refreshTimer !== undefined) {
          clearTimeout(refreshTimer);
        }
      });
    });
  });
  private readonly minimapSyncEffect = afterRenderEffect(() => {
    if (!this.showMinimap()) {
      this.endMinimapHoverNavigation();
      return;
    }
    this.graphNodes();
    this.resolvedNodeViews();
    const options = this.resolvedMinimapOptions();
    if (!options.interactive) {
      this.endMinimapHoverNavigation();
    } else if (this.minimapPointerInside) {
      // Graph and minimap geometry can change while hover navigation remains active.
      // Recalculate from the refreshed minimap on the next pointer move without
      // discarding the viewport captured at the start of the interaction.
      this.minimapHoverNavigationSnapshot = null;
    } else {
      this.endMinimapHoverNavigation();
    }
    // A managed restore owns the final transform and connection invalidation. A raw
    // redraw here would remove its CSS transition before connector geometry settles.
    if (!this.rendererBridge().isViewportAnimating) {
      this.canvas().redraw();
    }
  });
  private readonly layoutViewportSyncEffect = afterRenderEffect(() => {
    this.graphNodes();
    this.syncPendingLayoutViewport();
  });
  private readonly definitionFitSyncEffect = afterRenderEffect(() => {
    this.syncFitOnDefinitionChange();
  });

  public connectorId(nodeId: string, portId: string): string {
    return createTngFlowConnectorId(nodeId, portId);
  }

  /**
   * Recalculates rendered connection geometry without changing or emitting the viewport.
   */
  public refreshLayout(): void {
    this.flow()?.redraw();
  }

  public fitToScreen(animated = true, padding = 48): void {
    const normalizedPadding = Number.isFinite(padding) ? Math.max(0, padding) : 48;
    this.canvas().fitToScreen({ x: normalizedPadding, y: normalizedPadding }, animated);
  }

  public resetViewport(animated = true): void {
    this.canvas().resetScaleAndCenter(animated);
  }

  public centerNode(nodeId: string, animated = true): boolean {
    if (!this.graphIndex().nodesById.has(nodeId)) {
      return false;
    }
    this.canvas().centerGroupOrNode(nodeId, animated);
    return true;
  }

  public activateNode(nodeId: string, source: 'api' = 'api'): boolean {
    return this.emitNodeActivated(nodeId, source);
  }

  public activateConnection(connectionId: string, source: 'api' = 'api'): boolean {
    return this.emitConnectionActivated(connectionId, source);
  }

  public activateValidationIssue(issueId: string): boolean {
    const issue = this.validationIssues().find((candidate) => candidate.id === issueId);
    if (issue === undefined) {
      return false;
    }
    this.onValidationIssueActivated(issue, 'api');
    return true;
  }

  public revealTarget(
    target: TngFlowValidationTarget,
    options: TngFlowRevealOptions = {},
  ): boolean {
    if (!this.hasRenderableTarget(target)) {
      return false;
    }
    if (!this.isFullyRendered) {
      this.pendingReveal = { target, options };
      return true;
    }
    this.performReveal(target, options);
    return true;
  }

  public zoomIn(): void {
    this.zoomBy(this.zoomStep());
  }

  public zoomOut(): void {
    this.zoomBy(-this.zoomStep());
  }

  public toggleScrollZoomLock(): void {
    this.scrollZoomLocked.update((locked) => !locked);
  }

  public zoomBy(delta: number): void {
    const canvas = this.canvas();
    const nextScale = Math.min(
      this.zoomMaximum(),
      Math.max(this.zoomMinimum(), canvas.getScale() + delta),
    );
    canvas.setScale(nextScale);
    canvas.redraw();
    canvas.emitCanvasChangeEvent();
  }

  public screenToCanvas(point: TngFlowPoint): TngFlowPoint {
    const flowHost = this.hostElement.nativeElement.querySelector<HTMLElement>('f-flow');
    if (flowHost === null) {
      return this.toPoint(point);
    }
    return this.toPoint(calculatePointerInFlow(point, flowHost, this.canvas().transform));
  }

  public requestNodeCreate(
    item: TngFlowPaletteItem<TData>,
    position?: TngFlowPoint,
    source: TngFlowNodeCreateSource = 'api',
  ): void {
    if (!this.canEdit() || item.disabled === true) {
      return;
    }
    const normalized = this.normalizeCreatePosition(position ?? this.viewportCenter());
    if (normalized !== undefined) {
      this.emitNodeCreateRequest(item, normalized, source);
    }
  }

  public requestCommand(
    command: TngFlowEditorCommand,
    source: TngFlowEditorCommandSource = 'api',
    canvasPosition?: TngFlowPoint,
  ): boolean {
    if (!this.isCommandAllowed(command)) {
      return false;
    }
    const position =
      canvasPosition === undefined
        ? this.defaultCommandPosition(command)
        : this.finitePoint(canvasPosition);
    if (canvasPosition !== undefined && position === undefined) {
      return false;
    }
    const selection = this.copySelection(this.sanitizedSelection());
    this.runInAngular(() =>
      this.commandRequested.emit({
        command,
        selection,
        source,
        ...(position === undefined ? {} : { canvasPosition: position }),
      }),
    );
    return true;
  }

  public requestNodeAlignment(
    alignment: TngFlowNodeAlignment,
    options: TngFlowArrangementOptions = {},
    source: TngFlowArrangementRequestSource = 'api',
  ): boolean {
    return this.requestNodeArrangement({ kind: 'align', alignment }, options, source);
  }

  public requestNodeDistribution(
    axis: TngFlowDistributionAxis,
    options: TngFlowArrangementOptions = {},
    source: TngFlowArrangementRequestSource = 'api',
  ): boolean {
    return this.requestNodeArrangement({ kind: 'distribute', axis }, options, source);
  }

  public async requestAutoLayout(
    options: TngFlowAutoLayoutOptions = {},
    source: TngFlowLayoutRequestSource = 'api',
  ): Promise<boolean> {
    const sequence = ++this.layoutRequestSequence;
    this.pendingLayoutViewport.set(null);
    const engine = this.layoutEngineForRequest();
    if (!this.canStartLayoutRequest(engine)) {
      return false;
    }
    const measured = this.measureLayoutGraph();
    if (measured === null) {
      return false;
    }
    const calculation = await calculateTngFlowLayout({
      engine,
      graph: measured.graph,
      autoLayout: options,
      policy: { snapToGrid: this.snapToGrid(), gridSize: this.gridSize() },
    });
    if (!this.canApplyLayoutCalculation(sequence, measured.signature)) {
      return false;
    }
    this.emitLayoutCalculation(calculation, source);
    return true;
  }

  private requestNodeArrangement(
    operation: TngFlowArrangementOperation,
    options: TngFlowArrangementOptions,
    source: TngFlowArrangementRequestSource,
  ): boolean {
    if (!this.canEdit() || !this.isFullyRendered) {
      return false;
    }
    const selectedIds = this.sanitizedSelection().nodeIds;
    const selectedNodes = this.graphNodes()
      .filter((node) => selectedIds.has(node.id))
      .sort((left, right) => left.id.localeCompare(right.id));
    const measured = this.measureNodeBoundsFor(selectedNodes);
    if (measured === null) {
      return false;
    }
    const resolvedOptions = this.resolveArrangementOptions(options);
    const includeLocked = (resolvedOptions.lockedNodes ?? 'anchor') === 'anchor';
    const participants = measured.filter(
      (entry) => entry.disabled !== true && (includeLocked || entry.locked !== true),
    );
    const minimumParticipants = operation.kind === 'align' ? 2 : 3;
    if (participants.length < minimumParticipants) {
      return false;
    }
    const nodes =
      operation.kind === 'align'
        ? alignTngFlowNodes(measured, operation.alignment, resolvedOptions)
        : distributeTngFlowNodes(measured, operation.axis, resolvedOptions);
    this.runInAngular(() => this.nodesArrangementRequested.emit({ nodes, operation, source }));
    return true;
  }

  private resolveArrangementOptions(options: TngFlowArrangementOptions): TngFlowArrangementOptions {
    return options.gridSize === undefined && this.snapToGrid()
      ? { ...options, gridSize: this.gridSize() }
      : options;
  }

  private layoutEngineForRequest(): TngFlowLayoutEngine<TData, TConnectionData> | null {
    return this.layoutEngine() ?? this.providedLayoutEngine;
  }

  private canStartLayoutRequest(
    engine: TngFlowLayoutEngine<TData, TConnectionData> | null,
  ): engine is TngFlowLayoutEngine<TData, TConnectionData> {
    return this.canEdit() && this.isFullyRendered && engine !== null;
  }

  protected templateFor(
    nodeType: string,
  ): TemplateRef<TngFlowNodeTemplateContext<TData, TStatus>> | null {
    return (
      this.nodeTemplates().find((template) => template.nodeType() === nodeType)?.templateRef ?? null
    );
  }

  protected templateContext(node: TngFlowNode<TData>): TngFlowNodeTemplateContext<TData, TStatus> {
    const issues = this.nodeIssues(node.id);
    return {
      $implicit: node,
      node,
      view: this.viewFor(node.id),
      issues,
      mode: this.mode(),
      readonly: !this.canEdit(),
      selected: this.isNodeSelected(node.id),
    };
  }

  protected connectionTemplateContext(
    connection: TngFlowConnection<TConnectionData>,
  ): TngFlowConnectionTemplateContext<TConnectionData> {
    const view = this.connectionViewFor(connection.id);
    return {
      $implicit: connection,
      connection,
      view,
      issues: this.connectionIssues(connection.id),
      mode: this.mode(),
      selected: view.selected,
    };
  }

  protected connectionLabel(connection: TngFlowConnection<TConnectionData>): string | null {
    return this.normalizeOptionalText(connection.label);
  }

  protected connectionDescription(connection: TngFlowConnection<TConnectionData>): string | null {
    const description = this.normalizeOptionalText(connection.description);
    const view = this.connectionViewFor(connection.id);
    const runtimeDescription =
      view.status === 'idle' && view.message === null
        ? null
        : [`Status: ${view.status}.`, view.message].filter((part) => part !== null).join(' ');
    return [description, runtimeDescription].filter((part) => part !== null).join(' ') || null;
  }

  protected connectionAccessibleLabel(connection: TngFlowConnection<TConnectionData>): string {
    const source = this.connectionEndpointAriaLabel(connection.source);
    const target = this.connectionEndpointAriaLabel(connection.target);
    const customLabel = (this.connectionAriaLabel() ?? this.connectionAriaLabelFactory())?.(
      connection,
      {
        source,
        target,
        view: this.connectionViewFor(connection.id),
      },
    );
    const normalizedCustomLabel = this.normalizeOptionalText(customLabel);
    if (normalizedCustomLabel !== null) {
      return normalizedCustomLabel;
    }
    const label = this.connectionLabel(connection);
    if (label !== null) {
      return label;
    }
    return `Connection from ${source} to ${target}`;
  }

  protected connectionTitle(connection: TngFlowConnection<TConnectionData>): string | null {
    const label = this.connectionLabel(connection);
    const description = this.connectionDescription(connection);
    if (label !== null && description !== null) {
      return `${label} — ${description}`;
    }
    return description ?? label;
  }

  protected connectionOptionsFor(
    connection: TngFlowConnection<TConnectionData>,
  ): TngResolvedFlowConnectionOptions {
    const options = this.resolvedConnectionOptions().get(connection.id);
    if (options === undefined) {
      throw new Error(`Unknown TailNG flow connection "${connection.id}".`);
    }
    return options;
  }

  protected connectionRendererType(options: TngResolvedFlowConnectionOptions): string {
    return tngFlowPathTypeToRendererType(options.routing.type);
  }

  protected connectionLabelPosition(options: TngResolvedFlowConnectionOptions): number {
    return tngFlowLabelPlacementPosition(options.labelPlacement);
  }

  protected connectionRendererWaypoints(connectionId: string): RendererPointLike[] {
    const waypoints = this.rendererConnectionWaypoints().get(connectionId);
    if (waypoints === undefined) {
      throw new Error(`Unknown TailNG flow connection "${connectionId}".`);
    }
    return waypoints;
  }

  protected connectionSelectionDisabled(connection: TngFlowConnection<TConnectionData>): boolean {
    return (
      !this.canSelect() ||
      this.connectionSelectionEnabled() === false ||
      connection.selectable === false
    );
  }

  protected connectionReassignmentDisabled(
    connection: TngFlowConnection<TConnectionData>,
  ): boolean {
    return (
      !this.canEdit() ||
      this.connectionReassignmentEnabled() === false ||
      connection.disabled === true ||
      connection.reassignable === false
    );
  }

  protected connectionWaypointsRendered(options: TngResolvedFlowConnectionOptions): boolean {
    return options.routing.waypoints.length > 0 || this.connectionWaypointsEnabled();
  }

  protected connectionWaypointsVisible(
    connection: TngFlowConnection<TConnectionData>,
    view: TngFlowResolvedConnectionView,
  ): boolean {
    return (
      this.canEdit() &&
      this.connectionWaypointsEnabled() &&
      connection.disabled !== true &&
      view.selected
    );
  }

  protected viewFor(nodeId: string): TngFlowResolvedNodeView<TStatus> {
    return (
      this.resolvedNodeViews().get(nodeId) ??
      (emptyResolvedNodeView as TngFlowResolvedNodeView<TStatus>)
    );
  }

  protected connectionViewFor(connectionId: string): TngFlowResolvedConnectionView {
    const view = this.resolvedConnectionViews().get(connectionId);
    if (view === undefined) {
      throw new Error(`Unknown TailNG flow connection "${connectionId}".`);
    }
    return view;
  }

  protected minimapClassesFor(nodeId: string): string[] {
    const view = this.viewFor(nodeId);
    const nodeIdClass = this.minimapNodeClassById().get(nodeId);
    return [
      'tng-flow-minimap__node',
      ...(nodeIdClass === undefined ? [] : [nodeIdClass]),
      ...(view.selected ? ['tng-flow-minimap__node--selected'] : []),
      ...(view.disabled ? ['tng-flow-minimap__node--disabled'] : []),
      ...(view.highlighted ? ['tng-flow-minimap__node--highlighted'] : []),
      ...(view.validationSeverity === 'error' ? ['tng-flow-minimap__node--error'] : []),
      ...(view.validationSeverity === 'warning' ? ['tng-flow-minimap__node--warning'] : []),
    ];
  }

  protected isNodeSelected(nodeId: string): boolean {
    return this.sanitizedSelection().nodeIds.has(nodeId);
  }

  protected nodeIssues(nodeId: string): readonly TngFlowValidationIssue[] {
    return this.issueIndex().nodeIssues.get(nodeId) ?? EMPTY_ISSUES;
  }

  protected portIssues(nodeId: string, portId: string): readonly TngFlowValidationIssue[] {
    return (
      this.issueIndex().portIssues.get(createTngFlowConnectorId(nodeId, portId)) ?? EMPTY_ISSUES
    );
  }

  protected connectionIssues(connectionId: string): readonly TngFlowValidationIssue[] {
    return this.issueIndex().connectionIssues.get(connectionId) ?? EMPTY_ISSUES;
  }

  protected portsFor(nodeId: string): readonly TngFlowPort[] {
    return this.portGroupsByNodeId().get(nodeId)?.ports ?? [];
  }

  protected portSide(nodeId: string, port: TngFlowPort): TngFlowPortSide {
    if (this.useNearestBorderLayout()) {
      const resolved = this.nearestBorderSides().get(createTngFlowConnectorId(nodeId, port.id));
      if (resolved !== undefined) {
        return resolved;
      }
    }
    return port.side ?? (port.direction === 'input' ? 'left' : 'right');
  }

  protected portPositionFor(nodeId: string, port: TngFlowPort): number {
    if (this.useCustomPointsLayout()) {
      const slot = parseTngFlowCustomPointId(port.id);
      if (slot !== undefined) {
        return this.portPositionPercent(slot.index, TNG_FLOW_CUSTOM_POINTS_PER_SIDE);
      }
    }
    const ports = this.portGroupsByNodeId().get(nodeId)?.bySide[this.portSide(nodeId, port)] ?? [];
    return this.portPositionPercent(ports.indexOf(port), ports.length);
  }

  protected nodeMinHeight(nodeId: string): number {
    if (this.useCustomPointsLayout()) {
      return 112;
    }
    const groups = this.portGroupsByNodeId().get(nodeId);
    const portCount = Math.max(groups?.bySide.left.length ?? 0, groups?.bySide.right.length ?? 0);
    return Math.max(112, 56 + portCount * 30);
  }

  protected portPositionPercent(index: number, count: number): number {
    return ((index + 1) / (count + 1)) * 100;
  }

  protected portLabel(port: TngFlowPort): string | null {
    if (this.useNearestBorderLayout() || this.useCustomPointsLayout()) {
      return null;
    }
    const label = (port.name ?? port.label)?.trim();
    return label === undefined || label.length === 0 ? port.id : label;
  }

  protected isCustomPointPort(port: TngFlowPort): boolean {
    return isTngFlowCustomPointPortId(port.id);
  }

  protected isCustomPointConnected(nodeId: string, portId: string): boolean {
    return this.connectedCustomPointConnectorIds().has(createTngFlowConnectorId(nodeId, portId));
  }

  protected isCustomPointVisible(nodeId: string, port: TngFlowPort): boolean {
    if (!this.useCustomPointsLayout() || !isTngFlowCustomPointPortId(port.id)) {
      return true;
    }
    const connectorId = createTngFlowConnectorId(nodeId, port.id);
    if (this.connectedCustomPointConnectorIds().has(connectorId)) {
      return true;
    }
    return this.isUnconnectedCustomPointVisible(nodeId, port, connectorId);
  }

  private isUnconnectedCustomPointVisible(
    nodeId: string,
    port: TngFlowPort,
    connectorId: string,
  ): boolean {
    if (!this.canEdit()) {
      return false;
    }
    const sourceConnectorId = this.activeCustomPointConnectSourceId();
    if (sourceConnectorId === null) {
      return port.direction === 'output' && this.isNodeSelected(nodeId);
    }
    const sourceEndpoint = parseTngFlowConnectorId(sourceConnectorId);
    if (port.direction === 'output') {
      return sourceEndpoint?.nodeId === nodeId;
    }
    const accepted = this.connectableTargetsByConnectorId().get(sourceConnectorId) ?? [];
    return accepted.includes(connectorId);
  }

  private connectionEndpointAriaLabel(endpoint: TngFlowEndpoint): string {
    const record = this.graphIndex().portsByConnectorId.get(
      createTngFlowConnectorId(endpoint.nodeId, endpoint.portId),
    );
    if (record === undefined) {
      return `${endpoint.nodeId} port ${endpoint.portId}`;
    }
    const label = this.portLabel(record.port) ?? record.port.id;
    return `${record.node.name} ${record.port.direction} port ${label}`;
  }

  private normalizeOptionalText(value: string | undefined): string | null {
    const normalized = value?.trim();
    return normalized === undefined || normalized.length === 0 ? null : normalized;
  }

  protected acceptedTargets(nodeId: string, portId: string): string[] {
    const connectorId = createTngFlowConnectorId(nodeId, portId);
    return this.connectableTargetsByConnectorId().get(connectorId) ?? [noConnectableTargetId];
  }

  protected nodeAriaLabel(node: TngFlowNode<TData>): string {
    const view = this.viewFor(node.id);
    const state = [
      view.status,
      node.disabled === true ? 'disabled' : null,
      node.locked === true ? 'locked' : null,
      view.validationSeverity === null ? null : `${view.validationSeverity} validation`,
    ].filter((value): value is string => value !== null);
    return `${node.name}, ${state.join(', ')}`;
  }

  protected portAriaLabel(node: TngFlowNode<TData>, port: TngFlowPort): string {
    const view = this.viewFor(node.id);
    const label = this.portLabel(port) ?? port.id;
    return `${node.name}, ${port.direction} port ${label}, ${view.status}`;
  }

  protected isKeyboardConnectionSource(nodeId: string, portId: string): boolean {
    const session = this.keyboardConnection();
    const connectorId = createTngFlowConnectorId(nodeId, portId);
    return session?.phase === 'source'
      ? session.sourceConnectorIds[session.sourceIndex] === connectorId
      : session?.sourceConnectorId === connectorId;
  }

  protected isKeyboardConnectionTarget(nodeId: string, portId: string): boolean {
    const session = this.keyboardConnection();
    return (
      session?.phase === 'target' &&
      session.targetConnectorIds[session.targetIndex] === createTngFlowConnectorId(nodeId, portId)
    );
  }

  protected onPortFocus(nodeId: string, portId: string): void {
    this.lastFocusedPortConnectorId = createTngFlowConnectorId(nodeId, portId);
  }

  protected onPortBlur(): void {
    queueMicrotask(() => {
      const activeElement = this.documentRef.activeElement;
      if (
        activeElement !== this.documentRef.body &&
        !this.hostElement.nativeElement.contains(activeElement)
      ) {
        this.lastFocusedPortConnectorId = null;
      }
    });
  }

  protected onPortKeydown(
    event: Readonly<KeyboardEvent>,
    node: TngFlowNode<TData>,
    port: TngFlowPort,
  ): void {
    const session = this.keyboardConnection();
    if (session !== null) {
      if (this.handleKeyboardConnectionKey(event, session)) {
        event.stopPropagation();
      }
      return;
    }
    if (!this.canStartConnectionFromPort(event, node, port)) {
      return;
    }
    event.preventDefault();
    event.stopPropagation();
    this.beginKeyboardConnection(createTngFlowConnectorId(node.id, port.id));
  }

  private canStartConnectionFromPort(
    event: Readonly<KeyboardEvent>,
    node: TngFlowNode<TData>,
    port: TngFlowPort,
  ): boolean {
    return (
      this.canEdit() &&
      node.disabled !== true &&
      node.locked !== true &&
      port.disabled !== true &&
      port.direction === 'output' &&
      this.isConfirmKey(event)
    );
  }

  protected onNodesRendered(): void {
    if (this.fitOnInit() && !this.hasFittedInitialNodes && this.graphNodes().length > 0) {
      this.hasFittedInitialNodes = true;
      this.lastFitDefinitionSignature = this.createFitDefinitionSignature();
      this.fitToScreen(false);
    }
    this.refreshMeasuredNodeSizes();
  }

  protected onReady(): void {
    this.isFullyRendered = true;
    const pendingReveal = this.pendingReveal;
    this.pendingReveal = null;
    if (pendingReveal !== null) {
      queueMicrotask(() => this.performReveal(pendingReveal.target, pendingReveal.options));
    }
    this.refreshMeasuredNodeSizes();
    this.runInAngular(() => this.ready.emit());
  }

  protected onNodeDoubleClick(event: MouseEvent, nodeId: string): void {
    if (!this.isInteractiveActivationTarget(event.target)) {
      this.emitNodeActivated(nodeId, 'pointer');
    }
  }

  protected onConnectionDoubleClick(event: MouseEvent, connectionId: string): void {
    if (!this.isInteractiveActivationTarget(event.target)) {
      this.emitConnectionActivated(connectionId, 'pointer');
    }
  }

  public requestConnectionRoutingChange(
    type: TngFlowConnectionPathType,
    source: TngFlowConnectionRoutingChangeSource = 'api',
  ): boolean {
    if (!this.canEdit() || !this.isConnectionPathType(type)) {
      return false;
    }
    const connectionIds = this.editableSelectedConnectionIds();
    if (connectionIds.length === 0) {
      return false;
    }
    this.runInAngular(() =>
      this.connectionRoutingChangeRequested.emit({ connectionIds, type, source }),
    );
    return true;
  }

  public selectConnectionCreationPathType(type: TngFlowConnectionPathType): boolean {
    if (!this.canEdit() || !this.isConnectionPathType(type)) {
      return false;
    }
    this.connectionCreationPathType.set(type);
    return true;
  }

  protected isActiveConnectionPathType(type: TngFlowConnectionPathType): boolean {
    return this.activeConnectionPathType() === type;
  }

  private isConnectionPathType(value: unknown): value is TngFlowConnectionPathType {
    return (
      typeof value === 'string' &&
      TNG_FLOW_CONNECTION_PATH_TYPES.has(value as TngFlowConnectionPathType)
    );
  }

  protected onConnectionWaypointsChanged(event: RendererConnectionWaypointsChangedLike): void {
    const connection = this.connectionForWaypointChange(event.connectionId);
    if (connection === null) {
      return;
    }
    const previousWaypoints = (connection.routing?.waypoints ?? []).map((point) =>
      Object.freeze({ x: point.x, y: point.y }),
    );
    const waypoints = event.waypoints
      .filter((point) => Number.isFinite(point.x) && Number.isFinite(point.y))
      .map((point) => Object.freeze(this.toPoint(point)));
    if (this.arePointListsEqual(previousWaypoints, waypoints)) {
      return;
    }
    this.runInAngular(() =>
      this.connectionWaypointsChange.emit({
        connectionId: connection.id,
        previousWaypoints,
        waypoints,
      }),
    );
  }

  private connectionForWaypointChange(
    connectionId: string,
  ): TngFlowConnection<TConnectionData> | null {
    if (!this.canEdit() || !this.connectionWaypointsEnabled()) {
      return null;
    }
    const connection = this.graphIndex().connectionsById.get(connectionId);
    return connection === undefined || connection.disabled === true ? null : connection;
  }

  protected onValidationIssueActivated(
    issue: TngFlowValidationIssue,
    source: TngFlowValidationIssueActivationSource,
  ): void {
    this.revealTarget(issue.target, { animated: true, select: true });
    this.runInAngular(() => this.validationIssueActivated.emit({ issue, source }));
  }

  protected onMoveNodes(event: RendererMoveNodesLike): void {
    if (!this.canEdit()) {
      return;
    }
    const nodesById = this.graphIndex().nodesById;
    const moves = event.nodes
      .filter((move) => this.isNodeMovable(nodesById.get(move.id)))
      .map((move) => ({ id: move.id, position: this.toPoint(move.position) }));
    if (moves.length > 0) {
      const normalized = this.normalizeMovePositions(moves, nodesById);
      this.applyProvisionalPositions(normalized);
      this.emitNodeMoves(normalized, nodesById);
    }
  }

  protected onCreateNode(event: RendererCreateNodeLike): void {
    if (!this.canEdit()) {
      return;
    }
    const envelope = readTngFlowPaletteItemEnvelope<TData>(event.data);
    if (envelope === undefined || envelope.item.disabled === true) {
      return;
    }
    const position = this.normalizeCreatePosition({
      x: event.externalItemRect.x,
      y: event.externalItemRect.y,
    });
    if (position !== undefined) {
      this.emitNodeCreateRequest(envelope.item, position, 'pointer');
    }
  }

  protected onCreateConnection(event: RendererCreateConnectionLike): void {
    if (!this.canEdit()) {
      return;
    }
    const sourceRecord = this.portRecordForConnectorId(event.sourceId);
    const targetRecord = this.resolveDroppedPort(event.targetId, event.dropPosition);
    if (sourceRecord === undefined || targetRecord === undefined) {
      return;
    }
    const candidate = createTngFlowConnectionCandidate(sourceRecord, targetRecord);
    const result = this.validateCandidate(candidate);
    if (!result.validation.valid) {
      this.emitConnectionRejected(candidate, result);
      return;
    }
    this.emitConnectionCreated(candidate, event.dropPosition);
  }

  protected onReassignConnection(event: RendererReassignConnectionLike): void {
    if (!this.canEdit()) {
      return;
    }
    const connection = this.graphIndex().connectionsById.get(event.connectionId);
    if (!this.isConnectionReassignable(connection)) {
      return;
    }
    const candidate = this.reconnectCandidate(connection, event);
    if (candidate === undefined) {
      return;
    }
    const result = this.validateCandidate(candidate, connection.id);
    if (!result.validation.valid) {
      this.emitConnectionRejected(candidate, result);
      return;
    }
    this.emitConnectionReconnected(connection, candidate, event);
  }

  protected onSelectionChange(event: RendererSelectionChangeLike): void {
    if (!this.canSelect()) {
      this.requestSelectionResync();
      return;
    }
    const selection = sanitizeTngFlowSelection(
      {
        nodeIds: new Set(event.nodeIds),
        connectionIds: new Set(event.connectionIds),
      },
      this.graphIndex(),
    );
    if (!areTngFlowSelectionsEqual(selection, this.sanitizedSelection())) {
      this.emitSelection(selection);
    }
    this.requestSelectionResync();
  }

  protected onDeleteSelected(event: RendererDeleteSelectedLike): void {
    if (!this.canEdit()) {
      return;
    }
    const nodeIds = event.nodeIds.filter((id) => this.isNodeDeletable(id));
    const connectionIds = event.connectionIds.filter((id) => this.isConnectionDeletable(id));
    this.runInAngular(() => this.emitDeleteRequests(nodeIds, connectionIds));
  }

  protected onViewportChange(event: RendererCanvasChangeLike): void {
    if (Number.isFinite(event.scale) && event.scale > 0) {
      this.currentCanvasScale.set(event.scale);
    }
    this.runInAngular(() => {
      const viewport = {
        position: this.toPoint(event.position),
        scale: event.scale,
      };
      this.viewportChange.emit(viewport);
      this.viewportChanged.emit(viewport);
    });
  }

  protected onMinimapKeydown(event: KeyboardEvent): void {
    const options = this.resolvedMinimapOptions();
    if (!this.showMinimap() || !options.interactive) {
      return;
    }
    if (event.key === 'Home') {
      event.preventDefault();
      event.stopPropagation();
      this.fitToScreen();
      return;
    }
    const unitDelta = TNG_FLOW_MINIMAP_KEYBOARD_DELTAS[event.key];
    if (unitDelta === undefined) {
      return;
    }

    event.preventDefault();
    event.stopPropagation();
    const step = event.shiftKey ? 160 : 40;
    const canvas = this.canvas();
    const current = canvas.getPosition();
    canvas._setPosition({
      x: current.x + unitDelta.x * step,
      y: current.y + unitDelta.y * step,
    });
    canvas.redraw();
    canvas.emitCanvasChangeEvent();
  }

  protected onMinimapPointerEnter(): void {
    if (!this.canNavigateMinimap()) {
      this.endMinimapHoverNavigation();
      return;
    }
    this.minimapPointerInside = true;
  }

  protected onMinimapPointerMove(event: PointerEvent): void {
    if (!this.canNavigateMinimap()) {
      this.endMinimapHoverNavigation();
      return;
    }
    if (!this.isMousePointer(event)) {
      this.endMinimapHoverNavigation();
      return;
    }
    this.minimapPointerInside = true;
    if (event.buttons !== 0) {
      return;
    }

    const minimap = this.minimap();
    const flowHost = this.hostElement.nativeElement.querySelector<HTMLElement>('f-flow');
    if (minimap === undefined || flowHost === null) {
      return;
    }

    const navigation =
      this.minimapHoverNavigationSnapshot ?? this.beginMinimapHoverNavigation(flowHost, minimap);
    const nextPosition = this.minimapCanvasPosition(event, navigation);
    if (!this.isFinitePoint(nextPosition)) {
      return;
    }

    const canvas = this.canvas();
    canvas._setPosition(nextPosition);
    canvas.redraw();
    canvas.emitCanvasChangeEvent();
  }

  protected commitMinimapHoverNavigation(): void {
    if (!this.canNavigateMinimap()) {
      this.endMinimapHoverNavigation();
      return;
    }
    this.minimapHoverResetPosition = this.toPoint(this.canvas().getPosition());
  }

  private canNavigateMinimap(): boolean {
    return this.showMinimap() && this.resolvedMinimapOptions().interactive;
  }

  private isMousePointer(event: Readonly<PointerEvent>): boolean {
    return !event.pointerType || event.pointerType === 'mouse';
  }

  protected onMinimapPointerLeave(): void {
    this.minimapPointerInside = false;
    this.restoreMinimapHoverNavigation(true);
  }

  protected onMinimapPointerCancel(): void {
    this.endMinimapHoverNavigation();
  }

  private endMinimapHoverNavigation(): void {
    this.minimapPointerInside = false;
    this.restoreMinimapHoverNavigation(false);
  }

  private restoreMinimapHoverNavigation(animated: boolean): void {
    const resetPosition = this.minimapHoverResetPosition;
    this.minimapHoverNavigationSnapshot = null;
    this.minimapHoverResetPosition = null;
    if (resetPosition === null) {
      return;
    }

    const canvas = this.canvas();
    const currentPosition = canvas.getPosition();
    if (currentPosition.x === resetPosition.x && currentPosition.y === resetPosition.y) {
      return;
    }
    canvas._setPosition(resetPosition);
    this.rendererBridge().redrawCanvas(this.viewportAnimationAllowed(animated));
  }

  private beginMinimapHoverNavigation(
    flowHost: HTMLElement,
    minimap: Readonly<FMinimapComponent>,
  ): MinimapHoverNavigationSnapshot {
    const canvas = this.canvas();
    const flowRect = flowHost.getBoundingClientRect();
    const minimapState = minimap.state;
    const minimapRect = minimapState.element.getBoundingClientRect();
    const canvasPosition = this.toPoint(canvas.getPosition());
    this.minimapHoverResetPosition ??= canvasPosition;
    const snapshot = {
      canvasPosition,
      canvasScale: canvas.getScale() || 1,
      flowSize: { width: flowRect.width, height: flowRect.height },
      minimapOrigin: { x: minimapRect.left, y: minimapRect.top },
      minimapScale: minimapState.scale,
      viewBoxPosition: { x: minimapState.viewBox.x, y: minimapState.viewBox.y },
    };
    this.minimapHoverNavigationSnapshot = snapshot;
    return snapshot;
  }

  private minimapCanvasPosition(
    event: Readonly<PointerEvent>,
    navigation: MinimapHoverNavigationSnapshot,
  ): TngFlowPoint {
    return {
      x:
        navigation.canvasPosition.x -
        ((event.clientX - navigation.minimapOrigin.x) *
          navigation.minimapScale *
          navigation.canvasScale +
          navigation.viewBoxPosition.x * navigation.canvasScale -
          navigation.flowSize.width / 2),
      y:
        navigation.canvasPosition.y -
        ((event.clientY - navigation.minimapOrigin.y) *
          navigation.minimapScale *
          navigation.canvasScale +
          navigation.viewBoxPosition.y * navigation.canvasScale -
          navigation.flowSize.height / 2),
    };
  }

  private isFinitePoint(point: TngFlowPoint): boolean {
    return Number.isFinite(point.x) && Number.isFinite(point.y);
  }

  private buildConnectableTargets(): ReadonlyMap<string, string[]> {
    const index = this.graphIndex();
    const entries = index.portRecords.map((source) => {
      const targets = index.portRecords
        .filter((target) => target.connectorId !== source.connectorId)
        .filter(
          (target) =>
            this.isConnectionPortEligible(source, 'source') &&
            this.isConnectionPortEligible(target, 'target'),
        )
        .filter((target) => {
          const candidate = createTngFlowConnectionCandidate(source, target);
          return this.validateCandidate(candidate).validation.valid;
        })
        .map((target) => target.connectorId);
      return [source.connectorId, targets.length > 0 ? targets : [noConnectableTargetId]] as const;
    });
    return new Map(entries);
  }

  private isConnectionPortEligible(
    record: TngFlowPortRecord<TData>,
    role: 'source' | 'target',
  ): boolean {
    return (
      record.node.disabled !== true &&
      record.node.locked !== true &&
      record.port.disabled !== true &&
      record.port.direction === (role === 'source' ? 'output' : 'input')
    );
  }

  private validateCandidate(
    candidate: TngFlowConnectionCandidate<TData>,
    excludeConnectionId?: string,
  ): ValidatedConnection {
    const builtIn = validateTngFlowConnectionCandidate(
      candidate,
      this.graphConnections(),
      excludeConnectionId,
      this.connectionValidationIndex(),
    );
    if (!builtIn.valid) {
      return { validation: builtIn, origin: 'tailng' };
    }
    const consumer = this.connectionValidator()?.(candidate);
    return consumer === undefined
      ? { validation: builtIn, origin: 'tailng' }
      : { validation: consumer, origin: 'consumer' };
  }

  private syncSelectionToFlow(): void {
    const flow = this.flow();
    if (flow === undefined) {
      return;
    }
    const selection = this.sanitizedSelection();
    const foblexNodeIds = this.canEdit()
      ? [...selection.nodeIds].filter((id) =>
          this.isNodeMovable(this.graphIndex().nodesById.get(id)),
        )
      : [...selection.nodeIds];
    flow.select(foblexNodeIds, [...selection.connectionIds], false);
  }

  private emitSelection(selection: TngFlowSelection): void {
    this.runInAngular(() => {
      this.selectionChange.emit(selection);
      this.selectionChanged.emit({
        nodeIds: [...selection.nodeIds],
        connectionIds: [...selection.connectionIds],
      });
    });
  }

  private requestSelectionResync(): void {
    queueMicrotask(() => this.syncSelectionToFlow());
  }

  private emitNodeMoves(
    moves: readonly Readonly<{ id: string; position: TngFlowPoint }>[],
    nodesById: ReadonlyMap<string, TngFlowNode<TData>>,
  ): void {
    this.runInAngular(() => {
      this.nodesMoved.emit({ nodes: moves });
      for (const move of moves) {
        const previousPosition = nodesById.get(move.id)?.position;
        if (previousPosition !== undefined) {
          this.nodePositionChange.emit({
            nodeId: move.id,
            previousPosition: this.toPoint(previousPosition),
            position: move.position,
          });
        }
      }
    });
  }

  private normalizeMovePositions(
    moves: readonly Readonly<{ id: string; position: TngFlowPoint }>[],
    nodesById: ReadonlyMap<string, TngFlowNode<TData>>,
  ): readonly Readonly<{ id: string; position: TngFlowPoint }>[] {
    const gridSize = this.gridSize();
    if (!this.snapToGrid() || !isTngFlowGridEnabled(gridSize)) {
      return moves;
    }
    const anchorMove = moves[0];
    const anchorOrigin = nodesById.get(anchorMove.id)?.position;
    if (anchorOrigin === undefined) {
      return moves;
    }
    const rawDelta = {
      x: anchorMove.position.x - anchorOrigin.x,
      y: anchorMove.position.y - anchorOrigin.y,
    };
    const snappedDelta = {
      x:
        rawDelta.x === 0
          ? 0
          : snapTngFlowCoordinate(anchorOrigin.x + rawDelta.x, gridSize) - anchorOrigin.x,
      y:
        rawDelta.y === 0
          ? 0
          : snapTngFlowCoordinate(anchorOrigin.y + rawDelta.y, gridSize) - anchorOrigin.y,
    };
    return moves.map((move) => {
      const origin = nodesById.get(move.id)?.position;
      return origin === undefined
        ? move
        : {
            id: move.id,
            position: {
              x: origin.x + snappedDelta.x,
              y: origin.y + snappedDelta.y,
            },
          };
    });
  }

  private emitNodeCreateRequest(
    item: TngFlowPaletteItem<TData>,
    position: TngFlowPoint,
    source: TngFlowNodeCreateSource,
  ): void {
    this.runInAngular(() => this.nodeCreateRequested.emit({ item, position, source }));
  }

  private normalizeCreatePosition(point: TngFlowPoint): TngFlowPoint | undefined {
    if (!Number.isFinite(point.x) || !Number.isFinite(point.y)) {
      return undefined;
    }
    const gridSize = this.gridSize();
    if (!this.snapToGrid() || !isTngFlowGridEnabled(gridSize)) {
      return this.toPoint(point);
    }
    return snapTngFlowPoint(point, gridSize);
  }

  private viewportCenter(): TngFlowPoint {
    const flowHost = this.hostElement.nativeElement.querySelector<HTMLElement>('f-flow');
    if (flowHost === null) {
      return { x: 0, y: 0 };
    }
    const bounds = flowHost.getBoundingClientRect();
    return this.screenToCanvas({
      x: bounds.left + bounds.width / 2,
      y: bounds.top + bounds.height / 2,
    });
  }

  private emitConnectionCreated(
    candidate: TngFlowConnectionCandidate<TData>,
    dropPosition: RendererPointLike,
  ): void {
    this.runInAngular(() => {
      this.connectionCreateRequested.emit({
        source: candidate.source,
        target: candidate.target,
        routing: this.connectionCreationRouting(),
      });
      this.connectionCreated.emit({
        source: candidate.source,
        target: candidate.target,
        dropPosition: this.toPoint(dropPosition),
      });
    });
  }

  private emitConnectionRejected(
    candidate: TngFlowConnectionCandidate<TData>,
    result: ValidatedConnection,
  ): void {
    if (result.validation.valid) {
      return;
    }
    const rejection = result.validation;
    this.runInAngular(() => {
      this.connectionRejected.emit({
        source: candidate.source,
        target: candidate.target,
        code: rejection.code,
        reason: rejection.reason,
        origin: result.origin,
      });
    });
  }

  private reconnectCandidate(
    connection: TngFlowConnection<TConnectionData>,
    event: RendererReassignConnectionLike,
  ): TngFlowConnectionCandidate<TData> | undefined {
    const droppedId = event.endpoint === 'source' ? event.nextSourceId : event.nextTargetId;
    const dropped = this.resolveDroppedPort(droppedId, event.dropPosition);
    if (dropped === undefined) {
      return undefined;
    }
    const source =
      event.endpoint === 'source' ? dropped : this.portRecordForEndpoint(connection.source);
    const target =
      event.endpoint === 'target' ? dropped : this.portRecordForEndpoint(connection.target);
    return source === undefined || target === undefined
      ? undefined
      : createTngFlowConnectionCandidate(source, target);
  }

  private emitConnectionReconnected(
    connection: TngFlowConnection<TConnectionData>,
    candidate: TngFlowConnectionCandidate<TData>,
    event: RendererReassignConnectionLike,
  ): void {
    this.runInAngular(() => {
      this.connectionReconnectRequested.emit({
        connectionId: connection.id,
        previousSource: connection.source,
        previousTarget: connection.target,
        source: candidate.source,
        target: candidate.target,
        changedEndpoint: event.endpoint,
      });
      this.connectionReassigned.emit({
        connectionId: connection.id,
        endpoint: event.endpoint,
        previousSource: connection.source,
        source: candidate.source,
        previousTarget: connection.target,
        target: candidate.target,
        dropPosition: this.toPoint(event.dropPosition),
      });
    });
  }

  private emitDeleteRequests(nodeIds: readonly string[], connectionIds: readonly string[]): void {
    if (connectionIds.length > 0) {
      this.connectionsDeleteRequested.emit({ connectionIds, source: 'keyboard' });
    }
    if (nodeIds.length > 0) {
      this.nodesDeleteRequested.emit({ nodeIds, source: 'keyboard' });
    }
    if (nodeIds.length > 0 || connectionIds.length > 0) {
      this.deleteRequested.emit({ nodeIds, connectionIds });
    }
  }

  private resolveDroppedPort(
    connectorId: string | undefined,
    dropPosition: RendererPointLike,
  ): TngFlowPortRecord<TData> | undefined {
    return connectorId === undefined
      ? this.portRecordAtPoint(dropPosition)
      : this.portRecordForConnectorId(connectorId);
  }

  private portRecordAtPoint(point: RendererPointLike): TngFlowPortRecord<TData> | undefined {
    if (typeof this.documentRef.elementsFromPoint !== 'function') {
      return undefined;
    }
    for (const element of this.documentRef.elementsFromPoint(point.x, point.y)) {
      const connector = element.closest<HTMLElement>('[data-f-connector-id]');
      const connectorId = connector?.getAttribute('data-f-connector-id');
      const record = this.portRecordForConnectorId(connectorId);
      if (record !== undefined) {
        return record;
      }
    }
    return undefined;
  }

  private portRecordForEndpoint(endpoint: TngFlowEndpoint): TngFlowPortRecord<TData> | undefined {
    return this.portRecordForConnectorId(
      createTngFlowConnectorId(endpoint.nodeId, endpoint.portId),
    );
  }

  private portRecordForConnectorId(
    connectorId: string | null | undefined,
  ): TngFlowPortRecord<TData> | undefined {
    return connectorId === null || connectorId === undefined
      ? undefined
      : this.graphIndex().portsByConnectorId.get(connectorId);
  }

  private isNodeMovable(node: TngFlowNode<TData> | undefined): boolean {
    return node !== undefined && node.disabled !== true && node.locked !== true;
  }

  private isNodeDeletable(nodeId: string): boolean {
    return this.isNodeMovable(this.graphIndex().nodesById.get(nodeId));
  }

  private isConnectionDeletable(connectionId: string): boolean {
    return this.graphIndex().connectionsById.get(connectionId)?.disabled !== true;
  }

  private isConnectionReassignable(
    connection: TngFlowConnection<TConnectionData> | undefined,
  ): connection is TngFlowConnection<TConnectionData> {
    return (
      connection !== undefined && connection.disabled !== true && connection.reassignable !== false
    );
  }

  private hasRenderableTarget(target: TngFlowValidationTarget): boolean {
    switch (target.kind) {
      case 'flow':
        return true;
      case 'node':
        return this.graphIndex().nodesById.has(target.nodeId);
      case 'port':
        return this.graphIndex().portsByConnectorId.has(
          createTngFlowConnectorId(target.nodeId, target.portId),
        );
      case 'connection':
        return this.graphIndex().connectionsById.has(target.connectionId);
    }
  }

  private performReveal(target: TngFlowValidationTarget, options: TngFlowRevealOptions): void {
    const animated = options.animated ?? true;
    switch (target.kind) {
      case 'flow':
        this.fitToScreen(animated, options.padding);
        return;
      case 'node':
        this.centerNode(target.nodeId, animated);
        this.selectRevealedTarget(new Set([target.nodeId]), new Set(), options);
        return;
      case 'port':
        this.centerNode(target.nodeId, animated);
        this.selectRevealedTarget(new Set([target.nodeId]), new Set(), options);
        return;
      case 'connection': {
        const connection = this.graphIndex().connectionsById.get(target.connectionId);
        if (connection === undefined) {
          return;
        }
        this.centerNode(connection.target.nodeId, animated);
        this.selectRevealedTarget(new Set(), new Set([target.connectionId]), options);
      }
    }
  }

  private selectRevealedTarget(
    nodeIds: ReadonlySet<string>,
    connectionIds: ReadonlySet<string>,
    options: TngFlowRevealOptions,
  ): void {
    if (options.select !== true || !this.capabilities().select) {
      return;
    }
    const selection = { nodeIds, connectionIds };
    if (!areTngFlowSelectionsEqual(selection, this.sanitizedSelection())) {
      this.emitSelection(selection);
    }
  }

  private emitNodeActivated(nodeId: string, source: TngFlowActivationSource): boolean {
    if (!this.capabilities().activate || !this.graphIndex().nodesById.has(nodeId)) {
      return false;
    }
    this.runInAngular(() => this.nodeActivated.emit({ nodeId, source }));
    return true;
  }

  private emitConnectionActivated(connectionId: string, source: TngFlowActivationSource): boolean {
    if (!this.capabilities().activate || !this.graphIndex().connectionsById.has(connectionId)) {
      return false;
    }
    this.runInAngular(() => this.connectionActivated.emit({ connectionId, source }));
    return true;
  }

  private onHostKeydown(event: KeyboardEvent): void {
    this.guardKeyboardEvent(event);
    if (this.handleKeyboardContextMenu(event) || this.handleCommandShortcut(event)) {
      return;
    }
    if (this.handleKeyboardConnectionEntry(event)) {
      return;
    }
    if (!this.canHandleActivationKey(event)) {
      return;
    }
    // The Foblex connection and movement modes consume Enter during their bubble-phase
    // listener. Deferring this fallback lets those structural actions win without
    // coupling TailNG to the dependency's private mode state.
    queueMicrotask(() => {
      if (this.canHandleActivationKey(event)) {
        this.activateKeyboardTarget(event.target);
      }
    });
  }

  private handleCommandShortcut(event: KeyboardEvent): boolean {
    if (
      event.defaultPrevented ||
      event.isComposing ||
      event.repeat ||
      this.isInteractiveKeyboardTarget(event.target)
    ) {
      return false;
    }
    const command = this.commandForKeyboardEvent(event);
    if (command === undefined || !this.isCommandShortcutEnabled(command)) {
      return false;
    }
    if (!this.requestCommand(command, 'keyboard')) {
      return false;
    }
    event.preventDefault();
    event.stopImmediatePropagation();
    return true;
  }

  private commandForKeyboardEvent(
    event: Readonly<KeyboardEvent>,
  ): TngFlowEditorCommand | undefined {
    if ((!event.ctrlKey && !event.metaKey) || event.altKey) {
      return undefined;
    }
    const key = event.key.toLowerCase();
    return TNG_FLOW_COMMAND_SHORTCUTS.find(
      (shortcut) =>
        shortcut.key === key &&
        shortcut.shiftKey === event.shiftKey &&
        (shortcut.controlOnly !== true || (event.ctrlKey && !event.metaKey)),
    )?.command;
  }

  private isCommandShortcutEnabled(command: TngFlowEditorCommand): boolean {
    const shortcuts = this.commandShortcuts();
    return shortcuts === true || (Array.isArray(shortcuts) && shortcuts.includes(command));
  }

  private isCommandAllowed(command: TngFlowEditorCommand): boolean {
    return command === 'copy' ? this.capabilities().select : this.canEdit();
  }

  private defaultCommandPosition(command: TngFlowEditorCommand): TngFlowPoint | undefined {
    if (command !== 'paste' && command !== 'duplicate') {
      return undefined;
    }
    return this.lastPointerClientPosition === null
      ? this.viewportCenter()
      : this.screenToCanvas(this.lastPointerClientPosition);
  }

  private onHostPointerDown(event: PointerEvent): void {
    if (
      event.button !== 0 ||
      !this.canEdit() ||
      !(event.target instanceof HTMLElement) ||
      event.target.closest('.tng-flow-editor__drag-handle') === null
    ) {
      return;
    }
    this.nodePointerSessionActive = true;
    const modifier = this.resolvedSmartGuidesOptions().disableModifier;
    const suppress = modifier !== undefined && this.isModifierPressed(event, modifier);
    this.smartGuidesSuppressedForDrag.set(suppress);
    if (suppress) {
      this.changeDetectorRef.detectChanges();
    }
  }

  private onHostPointerFinish(): void {
    if (!this.nodePointerSessionActive) {
      return;
    }
    this.nodePointerSessionActive = false;
    if (this.smartGuidesSuppressedForDrag()) {
      this.smartGuidesSuppressedForDrag.set(false);
      this.changeDetectorRef.detectChanges();
    }
  }

  private onHostPointerMove(event: PointerEvent): void {
    if (!this.isFlowEventTarget(event.target)) {
      return;
    }
    const position = this.finitePoint({ x: event.clientX, y: event.clientY });
    if (position !== undefined) {
      this.lastPointerClientPosition = position;
    }
    if (this.nodePointerSessionActive && this.useNearestBorderLayout()) {
      this.sampleProvisionalPositionsFromDom();
    }
  }

  private applyProvisionalPositions(
    moves: readonly Readonly<{ id: string; position: TngFlowPoint }>[],
  ): void {
    if (!this.useNearestBorderLayout() || moves.length === 0) {
      return;
    }
    const next = new Map(this.provisionalPositions());
    for (const move of moves) {
      next.set(move.id, move.position);
    }
    this.provisionalPositions.set(next);
  }

  // eslint-disable-next-line complexity -- Sampling intentionally handles missing DOM state and unchanged points defensively.
  private sampleProvisionalPositionsFromDom(): void {
    const host = this.flowHost();
    if (host === null) {
      return;
    }
    const selectedIds = this.sanitizedSelection().nodeIds;
    if (selectedIds.size === 0) {
      return;
    }
    const next = new Map(this.provisionalPositions());
    let changed = false;
    for (const nodeId of selectedIds) {
      const element = host.querySelector<HTMLElement>(`[data-node-id="${CSS.escape(nodeId)}"]`);
      if (element === null) {
        continue;
      }
      const rect = element.getBoundingClientRect();
      const canvasPoint = this.screenToCanvas({ x: rect.left, y: rect.top });
      const previous = next.get(nodeId);
      if (previous?.x !== canvasPoint.x || previous.y !== canvasPoint.y) {
        next.set(nodeId, canvasPoint);
        changed = true;
      }
    }
    if (changed) {
      this.provisionalPositions.set(next);
      this.changeDetectorRef.detectChanges();
    }
  }

  private isModifierPressed(
    event: Readonly<PointerEvent>,
    modifier: TngFlowSmartGuideModifier,
  ): boolean {
    switch (modifier) {
      case 'alt':
        return event.altKey;
      case 'control':
        return event.ctrlKey;
      case 'meta':
        return event.metaKey;
      case 'shift':
        return event.shiftKey;
    }
  }

  private onHostContextMenu(event: MouseEvent): void {
    if (
      !this.contextMenuEnabled() ||
      !this.capabilities().select ||
      this.isInteractiveKeyboardTarget(event.target)
    ) {
      return;
    }
    const target = this.contextMenuTarget(event.target);
    const clientPosition = this.finitePoint({ x: event.clientX, y: event.clientY });
    if (target === null || clientPosition === undefined) {
      return;
    }
    this.lastPointerClientPosition = clientPosition;
    this.emitContextMenuRequest({ target, source: 'pointer', clientPosition });
    event.preventDefault();
    event.stopImmediatePropagation();
  }

  private handleKeyboardContextMenu(event: KeyboardEvent): boolean {
    if (
      event.defaultPrevented ||
      !this.contextMenuEnabled() ||
      !this.capabilities().select ||
      this.isInteractiveKeyboardTarget(event.target) ||
      (event.key !== 'ContextMenu' && !(event.key === 'F10' && event.shiftKey))
    ) {
      return false;
    }
    const anchor = this.keyboardContextMenuAnchor();
    this.emitContextMenuRequest({ ...anchor, source: 'keyboard' });
    event.preventDefault();
    event.stopImmediatePropagation();
    return true;
  }

  private keyboardContextMenuAnchor(): Readonly<{
    target: TngFlowContextMenuTarget;
    clientPosition: TngFlowPoint;
  }> {
    const flow = this.flowHost();
    const activeElement = this.activeGraphElement(flow);
    const activeTarget = this.contextMenuTarget(activeElement);
    const bounds = activeElement?.getBoundingClientRect();
    if (activeTarget !== null && bounds !== undefined) {
      const clientPosition = this.finitePoint({
        x: bounds.left + bounds.width / 2,
        y: bounds.top + bounds.height / 2,
      });
      if (clientPosition !== undefined) {
        return { target: activeTarget, clientPosition };
      }
    }
    const flowBounds = flow?.getBoundingClientRect();
    return {
      target: { kind: 'canvas' },
      clientPosition:
        flowBounds === undefined
          ? { x: 0, y: 0 }
          : {
              x: flowBounds.left + flowBounds.width / 2,
              y: flowBounds.top + flowBounds.height / 2,
            },
    };
  }

  private activeGraphElement(flow: HTMLElement | null): HTMLElement | null {
    return this.focusedGraphElement(flow) ?? this.activeDescendantElement(flow);
  }

  private focusedGraphElement(flow: HTMLElement | null): HTMLElement | null {
    const focused = this.documentRef.activeElement;
    if (!(focused instanceof HTMLElement) || flow?.contains(focused) !== true) {
      return null;
    }
    const focusedTarget = this.contextMenuTarget(focused);
    return focusedTarget !== null && focusedTarget.kind !== 'canvas' ? focused : null;
  }

  private activeDescendantElement(flow: HTMLElement | null): HTMLElement | null {
    const activeId = flow?.getAttribute('aria-activedescendant');
    if (activeId === null || activeId === undefined || flow === null) {
      return null;
    }
    const active = this.documentRef.getElementById(activeId);
    return active instanceof HTMLElement && flow.contains(active) ? active : null;
  }

  private emitContextMenuRequest(invocation: ContextMenuInvocation): void {
    const selection = this.contextMenuSelection(invocation.target);
    if (!areTngFlowSelectionsEqual(selection, this.sanitizedSelection())) {
      this.emitSelection(selection);
    }
    this.runInAngular(() =>
      this.contextMenuRequested.emit({
        target: invocation.target,
        source: invocation.source,
        clientPosition: this.toPoint(invocation.clientPosition),
        canvasPosition: this.screenToCanvas(invocation.clientPosition),
        selection,
      }),
    );
  }

  private contextMenuSelection(target: TngFlowContextMenuTarget): TngFlowSelection {
    const current = this.sanitizedSelection();
    if (target.kind === 'node' && !current.nodeIds.has(target.nodeId)) {
      return { nodeIds: new Set([target.nodeId]), connectionIds: new Set() };
    }
    if (target.kind === 'connection' && !current.connectionIds.has(target.connectionId)) {
      const connection = this.graphIndex().connectionsById.get(target.connectionId);
      if (connection?.selectable !== false) {
        return { nodeIds: new Set(), connectionIds: new Set([target.connectionId]) };
      }
    }
    return this.copySelection(current);
  }

  private contextMenuTarget(eventTarget: EventTarget | null): TngFlowContextMenuTarget | null {
    const target = eventTarget instanceof Element ? eventTarget : null;
    const flow = this.flowHost();
    if (target === null || flow?.contains(target) !== true) {
      return null;
    }
    return (
      this.portContextMenuTarget(target) ??
      this.connectionContextMenuTarget(target) ??
      this.nodeContextMenuTarget(target) ?? { kind: 'canvas' }
    );
  }

  private portContextMenuTarget(target: Element): TngFlowContextMenuTarget | null {
    const port = target.closest<HTMLElement>('[data-port-id]');
    const portId = port?.dataset['portId'];
    const portNodeId = port?.closest<HTMLElement>('[data-node-id]')?.dataset['nodeId'];
    return portId === undefined || portNodeId === undefined
      ? null
      : { kind: 'port', nodeId: portNodeId, portId };
  }

  private connectionContextMenuTarget(target: Element): TngFlowContextMenuTarget | null {
    const connectionId =
      target.closest<HTMLElement>('[data-connection-id]')?.dataset['connectionId'];
    return connectionId !== undefined && this.graphIndex().connectionsById.has(connectionId)
      ? { kind: 'connection', connectionId }
      : null;
  }

  private nodeContextMenuTarget(target: Element): TngFlowContextMenuTarget | null {
    const nodeId = target.closest<HTMLElement>('[data-node-id]')?.dataset['nodeId'];
    return nodeId !== undefined && this.graphIndex().nodesById.has(nodeId)
      ? { kind: 'node', nodeId }
      : null;
  }

  private isFlowEventTarget(eventTarget: EventTarget | null): boolean {
    return eventTarget instanceof Node && this.flowHost()?.contains(eventTarget) === true;
  }

  private flowHost(): HTMLElement | null {
    return this.hostElement.nativeElement.querySelector<HTMLElement>('f-flow');
  }

  private copySelection(selection: TngFlowSelection): TngFlowSelection {
    return {
      nodeIds: new Set(selection.nodeIds),
      connectionIds: new Set(selection.connectionIds),
    };
  }

  private finitePoint(point: TngFlowPoint): TngFlowPoint | undefined {
    return Number.isFinite(point.x) && Number.isFinite(point.y) ? this.toPoint(point) : undefined;
  }

  private canHandleActivationKey(event: KeyboardEvent): boolean {
    return (
      !event.defaultPrevented &&
      event.key === 'Enter' &&
      this.capabilities().activate &&
      !this.isInteractiveActivationTarget(event.target)
    );
  }

  private activateKeyboardTarget(eventTarget: EventTarget | null): boolean {
    return this.activateKeyboardElement(eventTarget) ?? this.activateSelectedElement();
  }

  private activateKeyboardElement(eventTarget: EventTarget | null): boolean | undefined {
    const target = eventTarget instanceof Element ? eventTarget : null;
    const nodeId = target?.closest<HTMLElement>('[data-node-id]')?.dataset['nodeId'];
    if (nodeId !== undefined) {
      return this.emitNodeActivated(nodeId, 'keyboard');
    }
    const connectionId =
      target?.closest<HTMLElement>('[data-connection-id]')?.dataset['connectionId'];
    if (connectionId !== undefined) {
      return this.emitConnectionActivated(connectionId, 'keyboard');
    }
    return undefined;
  }

  private activateSelectedElement(): boolean {
    const selection = this.sanitizedSelection();
    const selectedNodeId = selection.nodeIds.size === 1 ? [...selection.nodeIds][0] : undefined;
    if (selectedNodeId !== undefined) {
      return this.emitNodeActivated(selectedNodeId, 'keyboard');
    }
    const selectedConnectionId =
      selection.connectionIds.size === 1 ? [...selection.connectionIds][0] : undefined;
    return (
      selectedConnectionId !== undefined &&
      this.emitConnectionActivated(selectedConnectionId, 'keyboard')
    );
  }

  private handleKeyboardConnectionEntry(event: KeyboardEvent): boolean {
    if (!this.isKeyboardConnectionEntryEvent(event)) {
      return false;
    }
    event.preventDefault();
    event.stopImmediatePropagation();
    this.startKeyboardConnectionFromSelection();
    return true;
  }

  private isKeyboardConnectionEntryEvent(event: Readonly<KeyboardEvent>): boolean {
    const hasModifier = event.ctrlKey || event.metaKey || event.altKey;
    return (
      !event.defaultPrevented &&
      this.canEdit() &&
      !hasModifier &&
      !this.isInteractiveKeyboardTarget(event.target) &&
      this.resolvedKeyboardOptions().connectKeys.some((key) =>
        key.length === 1 ? key.toLowerCase() === event.key.toLowerCase() : key === event.key,
      )
    );
  }

  private startKeyboardConnectionFromSelection(): void {
    const selection = this.sanitizedSelection();
    const nodeIds = [...selection.nodeIds];
    if (nodeIds.length !== 1 || selection.connectionIds.size > 0) {
      this.announcer.announce('Select a single node to start a connection', 'assertive');
      return;
    }
    const node = this.graphIndex().nodesById.get(nodeIds[0]);
    const sources = node === undefined ? [] : this.keyboardSourcesFor(node.id);
    if (sources.length === 0) {
      this.announcer.announce('No connectable source port is available', 'assertive');
      return;
    }
    if (sources.length === 1) {
      this.beginKeyboardConnection(sources[0]);
      return;
    }
    this.startKeyboardSourceSelection(sources);
  }

  private startKeyboardSourceSelection(sources: readonly string[]): void {
    const session: KeyboardConnectionSourceSession = {
      phase: 'source',
      sourceConnectorIds: sources,
      sourceIndex: 0,
    };
    this.keyboardConnection.set(session);
    this.announcer.announce(
      `Choose a source port. Use arrow keys to move, Enter or Space to choose, Escape to cancel`,
    );
    this.focusKeyboardConnectionSource(session);
  }

  private keyboardSourcesFor(nodeId: string): readonly string[] {
    return this.graphIndex()
      .portRecords.filter((record) => record.node.id === nodeId)
      .filter((record) => this.isConnectionPortEligible(record, 'source'))
      .map((record) => record.connectorId)
      .filter((connectorId) => this.connectorDirective(connectorId) !== undefined);
  }

  private beginKeyboardConnection(sourceConnectorId: string): void {
    const source = this.portRecordForConnectorId(sourceConnectorId);
    const sourceConnector = this.connectorDirective(sourceConnectorId);
    if (
      source === undefined ||
      sourceConnector === undefined ||
      !this.isConnectionPortEligible(source, 'source')
    ) {
      return;
    }
    if (!this.beginRendererConnection(sourceConnectorId, sourceConnector)) {
      this.announcer.announce('Connection authoring is unavailable', 'assertive');
      return;
    }
    const targetConnectorIds = this.keyboardTargetConnectorIds();
    if (targetConnectorIds.length === 0) {
      this.connectionSession.cancel();
      this.announcer.announce(
        `No compatible connection target is available for ${this.portRecordLabel(source)}`,
        'assertive',
      );
      return;
    }
    const session: KeyboardConnectionTargetSession = {
      phase: 'target',
      sourceConnectorId,
      targetConnectorIds,
      targetIndex: this.closestConnectorIndex(sourceConnectorId, targetConnectorIds),
    };
    this.keyboardConnection.set(session);
    this.announcer.announce(
      `Connecting from ${this.portRecordLabel(source)}. Use arrow keys to choose a target, Enter or Space to connect, Escape to cancel`,
    );
    this.focusKeyboardConnectionTarget(session);
  }

  private beginRendererConnection(
    sourceConnectorId: string,
    sourceConnector: FConnectorDirective,
  ): boolean {
    const sourceBounds = this.connectorHost(sourceConnectorId)?.getBoundingClientRect();
    if (sourceBounds === undefined) {
      return false;
    }
    const sourcePoint = this.screenToCanvas({
      x: sourceBounds.left + sourceBounds.width / 2,
      y: sourceBounds.top + sourceBounds.height / 2,
    });
    return this.connectionSession.begin(sourceConnector, sourcePoint);
  }

  private keyboardTargetConnectorIds(): readonly string[] {
    return this.connectionSession.connectableTargets
      .map((target) => target.connector.fId())
      .filter((connectorId) => {
        const record = this.portRecordForConnectorId(connectorId);
        return record !== undefined && this.isConnectionPortEligible(record, 'target');
      });
  }

  private handleKeyboardConnectionKey(
    event: Readonly<KeyboardEvent>,
    session: KeyboardConnectionSession,
  ): boolean {
    if (event.key === 'Escape') {
      event.preventDefault();
      this.cancelKeyboardConnection(true);
      return true;
    }
    if (this.isConfirmKey(event)) {
      event.preventDefault();
      this.confirmKeyboardConnectionSelection(session);
      return true;
    }
    if (TNG_FLOW_KEYBOARD_DIRECTION_DELTAS[event.key] === undefined) {
      return false;
    }
    event.preventDefault();
    this.moveKeyboardConnectionFocus(session, event.key);
    return true;
  }

  private confirmKeyboardConnectionSelection(session: KeyboardConnectionSession): void {
    if (session.phase === 'source') {
      this.beginKeyboardConnection(session.sourceConnectorIds[session.sourceIndex]);
      return;
    }
    this.completeKeyboardConnection(session);
  }

  private moveKeyboardConnectionFocus(session: KeyboardConnectionSession, key: string): void {
    if (session.phase === 'source') {
      const next = {
        ...session,
        sourceIndex: this.nextConnectorIndex(session.sourceConnectorIds, session.sourceIndex, key),
      };
      this.keyboardConnection.set(next);
      this.focusKeyboardConnectionSource(next);
      return;
    }
    const next = {
      ...session,
      targetIndex: this.nextConnectorIndex(session.targetConnectorIds, session.targetIndex, key),
    };
    this.keyboardConnection.set(next);
    this.focusKeyboardConnectionTarget(next);
  }

  private completeKeyboardConnection(session: KeyboardConnectionTargetSession): void {
    const source = this.portRecordForConnectorId(session.sourceConnectorId);
    const targetConnectorId = session.targetConnectorIds[session.targetIndex];
    const target = this.portRecordForConnectorId(targetConnectorId);
    if (source === undefined || target === undefined || !this.canEdit()) {
      this.cancelKeyboardConnection(false);
      return;
    }
    const candidate = createTngFlowConnectionCandidate(source, target);
    const result = this.validateCandidate(candidate);
    if (!result.validation.valid) {
      this.emitConnectionRejected(candidate, result);
      this.connectionSession.cancel();
      this.keyboardConnection.set(null);
      this.announcer.announce(`Connection rejected: ${result.validation.reason}`, 'assertive');
      queueMicrotask(() => this.connectorHost(session.sourceConnectorId)?.focus());
      return;
    }
    const targetElement = this.connectorHost(targetConnectorId);
    const bounds = targetElement?.getBoundingClientRect();
    const dropPosition =
      bounds === undefined
        ? { x: 0, y: 0 }
        : { x: bounds.left + bounds.width / 2, y: bounds.top + bounds.height / 2 };
    this.connectionSession.complete(dropPosition);
    this.keyboardConnection.set(null);
    this.announcer.announce(
      `Connection requested from ${this.portRecordLabel(source)} to ${this.portRecordLabel(target)}`,
    );
  }

  private cancelKeyboardConnection(restoreSourceFocus: boolean): void {
    const session = this.keyboardConnection();
    if (session === null) {
      return;
    }
    if (this.connectionSession.isActive) {
      this.connectionSession.cancel();
    }
    this.keyboardConnection.set(null);
    this.announcer.announce('Connection cancelled');
    if (restoreSourceFocus) {
      const sourceConnectorId =
        session.phase === 'source'
          ? session.sourceConnectorIds[session.sourceIndex]
          : session.sourceConnectorId;
      queueMicrotask(() => {
        const source = this.connectorHost(sourceConnectorId);
        const flow = this.hostElement.nativeElement.querySelector<HTMLElement>('f-flow');
        (source ?? flow)?.focus({ preventScroll: true });
      });
    }
  }

  private focusKeyboardConnectionSource(session: KeyboardConnectionSourceSession): void {
    const connectorId = session.sourceConnectorIds[session.sourceIndex];
    const source = this.portRecordForConnectorId(connectorId);
    if (source === undefined) {
      this.cancelKeyboardConnection(false);
      return;
    }
    queueMicrotask(() => {
      this.connectorHost(connectorId)?.focus({ preventScroll: true });
      this.announcer.announce(
        `${this.portRecordLabel(source)}, source ${session.sourceIndex + 1} of ${session.sourceConnectorIds.length}`,
      );
    });
  }

  private focusKeyboardConnectionTarget(session: KeyboardConnectionTargetSession): void {
    const connectorId = session.targetConnectorIds[session.targetIndex];
    const target = this.portRecordForConnectorId(connectorId);
    if (target === undefined) {
      this.cancelKeyboardConnection(false);
      return;
    }
    queueMicrotask(() => {
      this.connectorHost(connectorId)?.focus({ preventScroll: true });
      const targetRef = this.connectionSession.connectableTargets.find(
        (candidate) => candidate.connector.fId() === connectorId,
      );
      if (targetRef !== undefined) {
        this.connectionSession.update(targetRef.rect.gravityCenter);
      }
      this.announcer.announce(
        `${this.portRecordLabel(target)}, target ${session.targetIndex + 1} of ${session.targetConnectorIds.length}`,
      );
    });
  }

  private syncKeyboardFocusAfterRender(): void {
    const session = this.keyboardConnection();
    const canEdit = this.canEdit();
    queueMicrotask(() => this.recoverKeyboardFocus(session, canEdit));
  }

  private recoverKeyboardFocus(session: KeyboardConnectionSession | null, canEdit: boolean): void {
    if (session !== null && !this.isKeyboardConnectionSessionValid(session, canEdit)) {
      this.cancelKeyboardConnection(false);
    }
    const flow = this.hostElement.nativeElement.querySelector<HTMLElement>('f-flow');
    if (flow === null) {
      return;
    }
    this.recoverActiveDescendant(flow);
    this.recoverFocusedPort(flow);
  }

  private isKeyboardConnectionSessionValid(
    session: KeyboardConnectionSession,
    canEdit: boolean,
  ): boolean {
    if (!canEdit) {
      return false;
    }
    const connectorIds =
      session.phase === 'source'
        ? session.sourceConnectorIds
        : [session.sourceConnectorId, ...session.targetConnectorIds];
    return connectorIds.every((id) => this.connectorDirective(id) !== undefined);
  }

  private recoverActiveDescendant(flow: HTMLElement): void {
    const activeDescendant = flow.getAttribute('aria-activedescendant');
    if (activeDescendant === null || this.documentRef.getElementById(activeDescendant) !== null) {
      return;
    }
    flow.removeAttribute('aria-activedescendant');
    if (
      this.documentRef.activeElement === flow ||
      this.documentRef.activeElement === this.documentRef.body
    ) {
      flow.focus({ preventScroll: true });
    }
  }

  private recoverFocusedPort(flow: HTMLElement): void {
    if (
      this.lastFocusedPortConnectorId === null ||
      this.connectorDirective(this.lastFocusedPortConnectorId) !== undefined
    ) {
      return;
    }
    this.lastFocusedPortConnectorId = null;
    if (this.documentRef.activeElement === this.documentRef.body) {
      flow.focus({ preventScroll: true });
    }
  }

  private connectorDirective(connectorId: string): FConnectorDirective | undefined {
    return this.connectors().find((connector) => connector.fId() === connectorId);
  }

  private connectorHost(connectorId: string): HTMLElement | undefined {
    const host: unknown = this.connectorDirective(connectorId)?.hostElement;
    return host instanceof HTMLElement ? host : undefined;
  }

  private connectorCenter(connectorId: string): TngFlowPoint | undefined {
    const bounds = this.connectorHost(connectorId)?.getBoundingClientRect();
    return bounds === undefined
      ? undefined
      : { x: bounds.left + bounds.width / 2, y: bounds.top + bounds.height / 2 };
  }

  private closestConnectorIndex(
    originConnectorId: string,
    connectorIds: readonly string[],
  ): number {
    const origin = this.connectorCenter(originConnectorId);
    if (origin === undefined) {
      return 0;
    }
    let closestIndex = 0;
    let closestDistance = Number.POSITIVE_INFINITY;
    connectorIds.forEach((connectorId, index) => {
      const center = this.connectorCenter(connectorId);
      if (center === undefined) {
        return;
      }
      const distance = Math.hypot(center.x - origin.x, center.y - origin.y);
      if (distance < closestDistance) {
        closestDistance = distance;
        closestIndex = index;
      }
    });
    return closestIndex;
  }

  private nextConnectorIndex(
    connectorIds: readonly string[],
    currentIndex: number,
    key: string,
  ): number {
    const current = this.connectorCenter(connectorIds[currentIndex]);
    const direction = TNG_FLOW_KEYBOARD_DIRECTION_DELTAS[key];
    if (current === undefined || direction === undefined || connectorIds.length < 2) {
      return currentIndex;
    }
    let bestIndex = -1;
    let bestScore = Number.POSITIVE_INFINITY;
    connectorIds.forEach((connectorId, index) => {
      if (index === currentIndex) {
        return;
      }
      const candidate = this.connectorCenter(connectorId);
      const score =
        candidate === undefined
          ? undefined
          : this.connectorNavigationScore(current, candidate, direction);
      if (score === undefined) {
        return;
      }
      if (score < bestScore) {
        bestScore = score;
        bestIndex = index;
      }
    });
    if (bestIndex !== -1) {
      return bestIndex;
    }
    const forward = direction.x + direction.y > 0;
    const delta = forward ? 1 : -1;
    return (currentIndex + delta + connectorIds.length) % connectorIds.length;
  }

  private connectorNavigationScore(
    current: Readonly<TngFlowPoint>,
    candidate: Readonly<TngFlowPoint>,
    direction: Readonly<TngFlowPoint>,
  ): number | undefined {
    const deltaX = candidate.x - current.x;
    const deltaY = candidate.y - current.y;
    const primary = deltaX * direction.x + deltaY * direction.y;
    if (primary <= 0) {
      return undefined;
    }
    const secondary = direction.x === 0 ? deltaX : deltaY;
    return Math.abs(primary) + Math.abs(secondary) * 2;
  }

  private portRecordLabel(record: TngFlowPortRecord<TData>): string {
    return `${record.node.name} ${record.port.direction} port ${this.portLabel(record.port)}`;
  }

  private isConfirmKey(event: Readonly<KeyboardEvent>): boolean {
    return event.key === 'Enter' || event.key === ' ';
  }

  private measureLayoutGraph(): MeasuredLayoutGraph<TData, TConnectionData> | null {
    const nodes = [...this.graphNodes()].sort((left, right) => left.id.localeCompare(right.id));
    if (nodes.length === 0) {
      return null;
    }
    const measured = this.measureNodeBoundsFor(nodes);
    if (measured === null) {
      return null;
    }
    const layoutNodes: TngFlowLayoutNode<TData>[] = measured.map((bounds, index) =>
      Object.freeze({ node: nodes[index], bounds }),
    );
    const nodeIds = new Set(nodes.map((node) => node.id));
    const connections = this.completeLayoutConnections(nodeIds);
    const graph = Object.freeze({
      nodes: Object.freeze(layoutNodes),
      connections: Object.freeze(connections.map((connection) => Object.freeze({ connection }))),
    });
    return {
      graph,
      signature: this.layoutGraphSignature(graph),
    };
  }

  private layoutNodeElements(): ReadonlyMap<string, MeasurableLayoutElement> {
    const elements = this.hostElement.nativeElement.querySelectorAll<HTMLElement>(
      '.tng-flow-editor__node[data-node-id]',
    );
    return new Map(
      Array.from(elements).flatMap((element: MeasurableLayoutElement) => {
        const id = element.dataset['nodeId'];
        return id === undefined ? [] : [[id, element] as const];
      }),
    );
  }

  private measureNodeBoundsFor(
    nodes: readonly TngFlowNode<TData>[],
  ): readonly TngFlowNodeBounds[] | null {
    if (nodes.length === 0) {
      return null;
    }
    const elements = this.layoutNodeElements();
    const scale = this.canvas().getScale();
    const normalizedScale = Number.isFinite(scale) && scale > 0 ? scale : 1;
    const measured: TngFlowNodeBounds[] = [];
    for (const node of nodes) {
      const bounds = this.measureNodeBounds(node, elements.get(node.id), normalizedScale);
      if (bounds === null) {
        return null;
      }
      measured.push(bounds);
    }
    return Object.freeze(measured);
  }

  private measureNodeBounds(
    node: TngFlowNode<TData>,
    element: MeasurableLayoutElement | undefined,
    scale: number,
  ): TngFlowNodeBounds | null {
    if (element === undefined) {
      return null;
    }
    const rect = element.getBoundingClientRect();
    const width = rect.width / scale;
    const height = rect.height / scale;
    if (!Number.isFinite(width) || !Number.isFinite(height) || width <= 0 || height <= 0) {
      return null;
    }
    return Object.freeze({
      id: node.id,
      position: this.toPoint(this.effectiveNodePositions().get(node.id) ?? node.position),
      size: Object.freeze({ width, height }),
      disabled: node.disabled,
      locked: node.locked,
    });
  }

  private refreshMeasuredNodeSizes(): void {
    if (!this.useNearestBorderLayout()) {
      return;
    }
    const measured = this.measureNodeBoundsFor(this.graphNodes());
    if (measured === null) {
      return;
    }
    const previous = this.measuredNodeSizes();
    let changed = previous.size !== measured.length;
    const next = new Map<string, TngFlowSize>();
    for (const bounds of measured) {
      next.set(bounds.id, bounds.size);
      const prior = previous.get(bounds.id);
      if (prior?.width !== bounds.size.width || prior.height !== bounds.size.height) {
        changed = true;
      }
    }
    if (changed) {
      this.measuredNodeSizes.set(next);
    }
  }

  private completeLayoutConnections(
    nodeIds: Readonly<ReadonlySet<string>>,
  ): readonly TngFlowConnection<TConnectionData>[] {
    return [...this.graphConnections()]
      .filter(
        (connection) =>
          nodeIds.has(connection.source.nodeId) && nodeIds.has(connection.target.nodeId),
      )
      .sort((left, right) => left.id.localeCompare(right.id));
  }

  private layoutGraphSignature(graph: TngFlowLayoutGraph<TData, TConnectionData>): string {
    return JSON.stringify({
      nodes: graph.nodes.map((entry) => [
        entry.node.id,
        entry.node.position.x,
        entry.node.position.y,
        entry.bounds.size.width,
        entry.bounds.size.height,
        entry.node.locked === true,
      ]),
      connections: graph.connections.map((entry) => [
        entry.connection.id,
        entry.connection.source.nodeId,
        entry.connection.target.nodeId,
      ]),
    });
  }

  private canApplyLayoutCalculation(sequence: number, signature: string): boolean {
    const current = this.measureLayoutGraph();
    return (
      sequence === this.layoutRequestSequence &&
      this.canEdit() &&
      current !== null &&
      signature === current.signature
    );
  }

  private emitLayoutCalculation(
    calculation: TngFlowLayoutCalculation,
    source: TngFlowLayoutRequestSource,
  ): void {
    const request: TngFlowNodesLayoutRequest = {
      nodes: calculation.nodes,
      options: calculation.options,
      viewport: calculation.viewport,
      source,
    };
    this.pendingLayoutViewport.set(
      calculation.viewport.fit
        ? {
            positions: new Map(calculation.nodes.map((move) => [move.id, move.position] as const)),
            viewport: calculation.viewport,
          }
        : null,
    );
    this.runInAngular(() => this.nodesLayoutRequested.emit(request));
  }

  private syncPendingLayoutViewport(): void {
    const pending = this.pendingLayoutViewport();
    if (pending === null || !this.layoutPositionsApplied(pending.positions)) {
      return;
    }
    this.pendingLayoutViewport.set(null);
    this.fitToScreen(
      this.viewportAnimationAllowed(pending.viewport.animated),
      pending.viewport.padding,
    );
  }

  private syncFitOnDefinitionChange(): void {
    const signature = this.createFitDefinitionSignature();
    if (signature === null) {
      this.lastFitDefinitionSignature = null;
      return;
    }
    if (this.lastFitDefinitionSignature === null) {
      this.lastFitDefinitionSignature = signature;
      return;
    }
    if (signature === this.lastFitDefinitionSignature) {
      return;
    }
    this.lastFitDefinitionSignature = signature;
    if (!this.fitOnDefinitionChange() || this.graphNodes().length === 0) {
      return;
    }
    queueMicrotask(() => this.fitToScreen());
  }

  private createFitDefinitionSignature(): string | null {
    const nodes = this.graphNodes();
    if (nodes.length === 0) {
      return null;
    }
    const nodeSignature = nodes
      .map((node) => `${node.id}:${node.position.x}:${node.position.y}:${node.ports?.length ?? 0}`)
      .join('|');
    const connectionSignature = this.graphConnections()
      .map(
        (connection) =>
          `${connection.id}:${connection.source.nodeId}:${connection.source.portId}>${connection.target.nodeId}:${connection.target.portId}`,
      )
      .join('|');
    return `${nodeSignature}::${connectionSignature}`;
  }

  private layoutPositionsApplied(positions: Readonly<ReadonlyMap<string, TngFlowPoint>>): boolean {
    const nodesById = new Map(this.graphNodes().map((node) => [node.id, node]));
    for (const [id, position] of positions) {
      const current = nodesById.get(id)?.position;
      if (
        current === undefined ||
        Math.abs(current.x - position.x) > 0.5 ||
        Math.abs(current.y - position.y) > 0.5
      ) {
        return false;
      }
    }
    return true;
  }

  private viewportAnimationAllowed(requested: boolean): boolean {
    return (
      requested &&
      this.documentRef.defaultView?.matchMedia?.('(prefers-reduced-motion: reduce)').matches !==
        true
    );
  }

  private guardKeyboardEvent(event: KeyboardEvent): void {
    if (this.capabilities().delete || this.isInteractiveKeyboardTarget(event.target)) {
      return;
    }
    if (!this.shouldBlockKeyboardEvent(event)) {
      return;
    }
    event.preventDefault();
    event.stopImmediatePropagation();
  }

  private shouldBlockKeyboardEvent(event: KeyboardEvent): boolean {
    const key = event.key.toLowerCase();
    if (this.isNonEditAuthoringKey(event, key)) {
      return true;
    }
    if (this.capabilities().select) {
      return false;
    }
    return this.isReadonlySelectionKey(event, key);
  }

  private isNonEditAuthoringKey(event: Readonly<KeyboardEvent>, key: string): boolean {
    if (NON_EDIT_BLOCKED_KEYS.has(key)) {
      return true;
    }
    if (event.ctrlKey || event.metaKey || event.altKey) {
      return false;
    }
    return this.resolvedKeyboardOptions().connectKeys.some(
      (connectKey) => connectKey.toLowerCase() === key,
    );
  }

  private isReadonlySelectionKey(event: Readonly<KeyboardEvent>, key: string): boolean {
    if (READONLY_BLOCKED_KEYS.has(key)) {
      return true;
    }
    return key === 'a' && (event.ctrlKey || event.metaKey);
  }

  private isInteractiveActivationTarget(target: EventTarget | null): boolean {
    return this.isInteractiveKeyboardTarget(target);
  }

  private isInteractiveKeyboardTarget(target: EventTarget | null): boolean {
    if (!(target instanceof HTMLElement)) {
      return false;
    }
    if (target.matches('f-flow')) {
      return false;
    }
    const interactive = target.closest(
      'input, textarea, select, button, summary, a[href], audio[controls], video[controls], [tabindex]:not([tabindex="-1"]), [data-tng-flow-minimap-interactive], [contenteditable]:not([contenteditable="false"])',
    );
    return interactive !== null && !interactive.matches('f-flow');
  }

  private normalizePositiveOption(value: number | undefined, fallback: number): number {
    return typeof value === 'number' && Number.isFinite(value) && value > 0 ? value : fallback;
  }

  private normalizeNonNegativeOption(value: number | undefined, fallback: number): number {
    return typeof value === 'number' && Number.isFinite(value) && value >= 0 ? value : fallback;
  }

  private smartGuideCanvasThreshold(screenThreshold: number): number {
    return (
      Math.round((screenThreshold / Math.max(0.01, this.effectiveCanvasScale())) * 1000) / 1000
    );
  }

  private arePointListsEqual(
    left: readonly TngFlowPoint[],
    right: readonly TngFlowPoint[],
  ): boolean {
    return (
      left.length === right.length &&
      left.every((point, index) => point.x === right[index]?.x && point.y === right[index]?.y)
    );
  }

  private toPoint(point: RendererPointLike): TngFlowPoint {
    return { x: point.x, y: point.y };
  }

  private runInAngular(action: () => void): void {
    if (NgZone.isInAngularZone()) {
      action();
      return;
    }
    this.ngZone.run(action);
  }
}
