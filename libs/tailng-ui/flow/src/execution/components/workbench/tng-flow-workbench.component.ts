/* eslint-disable complexity, no-console -- The workbench coordinates controlled graph, palette, details, responsive layout, and development diagnostics. */
import { DOCUMENT, NgTemplateOutlet } from '@angular/common';
import type { OnDestroy } from '@angular/core';
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
  inject,
  input,
  isDevMode,
  model,
  output,
  signal,
  viewChild,
} from '@angular/core';
import {
  TngButtonComponent,
  TngSplitGroupComponent,
  TngSplitHandleComponent,
  TngSplitPaneDirective,
  type TngSplitResizeEvent,
} from '@tailng-ui/components';
import { areTngFlowSelectionsEqual } from '../../../lib/model/tng-flow-selection';
import { TngFlowNodePaletteComponent } from '../../../lib/node-palette/tng-flow-node-palette.component';
import type { TngFlowSmartGuidesOptions } from '../../../lib/types/tng-flow-arrangement.types';
import type {
  TngFlowEditorCommandRequest,
  TngFlowEditorCommandShortcuts,
} from '../../../lib/types/tng-flow-command.types';
import type {
  TngFlowConnectionAriaLabelFactory,
  TngFlowConnectionPathType,
  TngFlowConnectionRoutingChangeRequest,
  TngFlowConnectionRoutingChangeSource,
  TngFlowConnectionWaypointsChange,
  TngFlowEditorConnectionOptions,
  TngFlowEditorOptions,
} from '../../../lib/types/tng-flow-connection.types';
import type { TngFlowContextMenuRequest } from '../../../lib/types/tng-flow-context-menu.types';
import type { TngFlowKeyboardOptions } from '../../../lib/types/tng-flow-keyboard.types';
import type { TngFlowMinimapOptions } from '../../../lib/types/tng-flow-minimap.types';
import type {
  TngFlowAttachmentLayout,
  TngFlowConnectionCreateRequest,
  TngFlowConnectionReconnectRequest,
  TngFlowConnectionRejectedEvent,
  TngFlowConnectionsDeleteRequest,
  TngFlowConnectionValidator,
  TngFlowDefinition,
  TngFlowEditorMode,
  TngFlowNode,
  TngFlowNodeCreateRequest,
  TngFlowNodePositionChange,
  TngFlowNodesDeleteRequest,
  TngFlowNodesMovedEvent,
  TngFlowPaletteItem,
  TngFlowPaletteItemActivation,
  TngFlowPoint,
  TngFlowSelection,
  TngFlowViewport,
} from '../../../lib/types/tng-flow.types';
import { EMPTY_TNG_FLOW_SELECTION } from '../../../lib/types/tng-flow.types';
import {
  createTngFlowExecutionIndex,
  resolveTngFlowExecutionInspectedNodeId,
  resolveTngFlowSelectedExecution,
} from '../../model/tng-flow-execution.model';
import type {
  TngFlowExecutionActivatedEvent,
  TngFlowExecutionDateTimeFormatter,
  TngFlowExecutionInspectorPosition,
  TngFlowExecutionInspectorScope,
  TngFlowRunExecutionSnapshot,
  TngFlowWorkbenchDetailsKind,
  TngFlowWorkbenchMode,
  TngFlowWorkbenchState,
} from '../../model/tng-flow-execution.types';
import {
  TngFlowExecutionInspectorTemplateDirective,
  type TngFlowExecutionInspectorTemplateContext,
  TngFlowWorkbenchDetailsTemplateDirective,
  type TngFlowWorkbenchDetailsTemplateContext,
  TngFlowWorkbenchPaletteTemplateDirective,
  type TngFlowWorkbenchPaletteTemplateContext,
} from '../../templates/tng-flow-execution-templates';
import { TngFlowExecutionGraphComponent } from '../graph/tng-flow-execution-graph.component';
import { TngFlowExecutionInspectorComponent } from '../inspector/tng-flow-execution-inspector.component';
import { TngFlowNodePropertiesComponent } from '../node-properties/tng-flow-node-properties.component';

const DEFAULT_DETAILS_BREAKPOINT = 720;
const DEFAULT_RIGHT_DETAILS_SIZE = 360;
const DEFAULT_BOTTOM_DETAILS_SIZE = 280;
const DEFAULT_GRAPH_MIN_SIZE = 320;
const DEFAULT_DETAILS_MIN_SIZE = 240;
const DEFAULT_PALETTE_SIZE = 280;
const DEFAULT_PALETTE_MIN_SIZE = 220;

@Component({
  selector: 'tng-flow-workbench',
  imports: [
    NgTemplateOutlet,
    TngButtonComponent,
    TngFlowExecutionGraphComponent,
    TngFlowExecutionInspectorComponent,
    TngFlowNodePaletteComponent,
    TngFlowNodePropertiesComponent,
    TngSplitGroupComponent,
    TngSplitHandleComponent,
    TngSplitPaneDirective,
  ],
  templateUrl: './tng-flow-workbench.component.html',
  styleUrl: './tng-flow-workbench.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  exportAs: 'tngFlowWorkbench',
  host: {
    class: 'tng-flow-workbench',
    '[attr.data-mode]': 'mode()',
    '[attr.data-state]': 'state()',
    '[attr.data-details-open]': 'showResolvedDetails() ? "" : null',
    '[attr.data-details-position]': 'resolvedDetailsPosition()',
    '[attr.data-palette-open]': 'showResolvedPalette() ? "" : null',
  },
})
export class TngFlowWorkbenchComponent<
  TPayload = unknown,
  TNodeData = unknown,
  TConnectionData = unknown,
> implements OnDestroy
{
  private readonly hostRef = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly documentRef = inject(DOCUMENT);
  private readonly zone = inject(NgZone);
  private readonly changeDetector = inject(ChangeDetectorRef);
  private readonly graph = viewChild(TngFlowExecutionGraphComponent);
  private readonly warningSignatures = new Set<string>();
  private resizeObserver: ResizeObserver | null = null;
  private resizeCleanup: (() => void) | null = null;

  public readonly definition = input<TngFlowDefinition<TNodeData, TConnectionData> | null>(null);
  public readonly snapshot = input<TngFlowRunExecutionSnapshot<TPayload> | null>(null);
  public readonly selection = input<TngFlowSelection>(EMPTY_TNG_FLOW_SELECTION);
  public readonly inspectedNodeId = input<string | null>(null);
  public readonly selectedExecutionId = input<string | null>(null);
  public readonly viewport = input<TngFlowViewport | null>(null);
  public readonly mode = input<TngFlowWorkbenchMode>('inspect');
  public readonly canvasMode = input<TngFlowEditorMode | null>(null);
  public readonly state = input<TngFlowWorkbenchState>('ready');
  public readonly stateMessage = input<string | null>(null);
  public readonly detailsKind = input<TngFlowWorkbenchDetailsKind>('auto');
  public readonly detailsScope = input<TngFlowExecutionInspectorScope>('auto');
  public readonly detailsPosition = input<TngFlowExecutionInspectorPosition>('auto');
  public readonly showDetails = input<boolean, boolean | string>(true, {
    transform: booleanAttribute,
  });
  public readonly detailsOpen = input<boolean, boolean | string>(true, {
    transform: booleanAttribute,
  });
  public readonly showDetailsToggle = input<boolean, boolean | string>(true, {
    transform: booleanAttribute,
  });
  public readonly showPalette = input<boolean, boolean | string>(true, {
    transform: booleanAttribute,
  });
  public readonly paletteOpen = input<boolean, boolean | string>(true, {
    transform: booleanAttribute,
  });
  public readonly showPaletteToggle = input<boolean, boolean | string>(true, {
    transform: booleanAttribute,
  });
  public readonly paletteItems = input<readonly TngFlowPaletteItem<TNodeData>[]>([]);
  public readonly paletteAriaLabel = input<string>('Flow node palette');
  public readonly paletteWidth = input<number>(DEFAULT_PALETTE_SIZE);
  public readonly paletteMinSize = input<number>(DEFAULT_PALETTE_MIN_SIZE);
  public readonly detailsBreakpoint = input<number>(DEFAULT_DETAILS_BREAKPOINT);
  public readonly rightDetailsSize = input<number>(DEFAULT_RIGHT_DETAILS_SIZE);
  public readonly bottomDetailsSize = input<number>(DEFAULT_BOTTOM_DETAILS_SIZE);
  public readonly graphMinSize = input<number>(DEFAULT_GRAPH_MIN_SIZE);
  public readonly detailsMinSize = input<number>(DEFAULT_DETAILS_MIN_SIZE);
  public readonly showControls = input<boolean, boolean | string>(true, {
    transform: booleanAttribute,
  });
  public readonly showConnectionTools = input<boolean, boolean | string>(true, {
    transform: booleanAttribute,
  });
  public readonly showBackground = input<boolean, boolean | string>(true, {
    transform: booleanAttribute,
  });
  public readonly showMinimap = input<boolean, boolean | string>(false, {
    transform: booleanAttribute,
  });
  public readonly showSelectionArea = input<boolean, boolean | string>(true, {
    transform: booleanAttribute,
  });
  public readonly fitOnInit = input<boolean, boolean | string>(true, {
    transform: booleanAttribute,
  });
  public readonly flowId = input<string>('tng-flow-workbench');
  public readonly ariaLabel = input<string>('Flow workbench');
  public readonly attachmentLayout = input<TngFlowAttachmentLayout>('static-ports');
  public readonly connectionValidator = input<TngFlowConnectionValidator<TNodeData> | null>(null);
  public readonly options = input<TngFlowEditorOptions | null>(null);
  public readonly connectionOptions = input<TngFlowEditorConnectionOptions | null>(null);
  public readonly connectionCreationPathType = model<TngFlowConnectionPathType | null>(null);
  public readonly connectionAriaLabel =
    input<TngFlowConnectionAriaLabelFactory<TConnectionData> | null>(null);
  public readonly keyboardOptions = input<TngFlowKeyboardOptions | null>(null);
  public readonly smartGuides = input<TngFlowSmartGuidesOptions | null>(null);
  public readonly minimapOptions = input<TngFlowMinimapOptions | null>(null);
  public readonly commandShortcuts = input<TngFlowEditorCommandShortcuts>(false);
  public readonly contextMenuEnabled = input<boolean, boolean | string>(false, {
    transform: booleanAttribute,
  });
  public readonly snapToGrid = input<boolean, boolean | string>(false, {
    transform: booleanAttribute,
  });
  public readonly gridSize = input<number>(16);
  public readonly dateTimeFormatter = input<TngFlowExecutionDateTimeFormatter | null>(null);

  public readonly nodesMoved = output<TngFlowNodesMovedEvent>();
  public readonly nodePositionChange = output<TngFlowNodePositionChange>();
  public readonly nodeCreateRequested = output<TngFlowNodeCreateRequest<TNodeData>>();
  public readonly connectionCreateRequested = output<TngFlowConnectionCreateRequest>();
  public readonly connectionReconnectRequested = output<TngFlowConnectionReconnectRequest>();
  public readonly connectionRoutingChangeRequested =
    output<TngFlowConnectionRoutingChangeRequest>();
  public readonly connectionWaypointsChange = output<TngFlowConnectionWaypointsChange>();
  public readonly connectionsDeleteRequested = output<TngFlowConnectionsDeleteRequest>();
  public readonly nodesDeleteRequested = output<TngFlowNodesDeleteRequest>();
  public readonly connectionRejected = output<TngFlowConnectionRejectedEvent>();
  public readonly commandRequested = output<TngFlowEditorCommandRequest>();
  public readonly contextMenuRequested = output<TngFlowContextMenuRequest>();
  public readonly selectionChange = output<TngFlowSelection>();
  public readonly inspectedNodeIdChange = output<string | null>();
  public readonly selectedExecutionIdChange = output<string | null>();
  public readonly viewportChange = output<TngFlowViewport>();
  public readonly detailsOpenChange = output<boolean>();
  public readonly paletteOpenChange = output<boolean>();
  public readonly executionActivated = output<TngFlowExecutionActivatedEvent<TPayload>>();

  protected readonly paletteTemplate = contentChild(
    TngFlowWorkbenchPaletteTemplateDirective<TPayload, TNodeData, TConnectionData>,
  );
  protected readonly detailsTemplate = contentChild(
    TngFlowWorkbenchDetailsTemplateDirective<TPayload, TNodeData, TConnectionData>,
  );
  protected readonly inspectorTemplate = contentChild(
    TngFlowExecutionInspectorTemplateDirective<TPayload>,
  );

  private readonly containerWidth = signal(DEFAULT_DETAILS_BREAKPOINT + 1);

  protected readonly index = computed(() =>
    createTngFlowExecutionIndex(this.definition(), this.snapshot()),
  );

  protected readonly editorMode = computed<TngFlowEditorMode>(() => {
    const explicitMode = this.canvasMode();
    if (explicitMode !== null) {
      return explicitMode;
    }
    switch (this.mode()) {
      case 'create':
      case 'edit':
        return 'edit';
      case 'view':
        return 'readonly';
      case 'inspect':
      case 'live':
        return 'inspect';
    }
  });

  protected readonly effectiveInspectedNodeId = computed(() =>
    resolveTngFlowExecutionInspectedNodeId(
      this.definition(),
      this.selection(),
      this.inspectedNodeId(),
    ),
  );

  protected readonly inspectedNode = computed<TngFlowNode<TNodeData> | null>(() => {
    const nodeId = this.effectiveInspectedNodeId();
    return this.definition()?.nodes.find((node) => node.id === nodeId) ?? null;
  });

  protected readonly inspectedNodeExecutions = computed(
    () => this.index().nodeExecutionsByNodeId.get(this.effectiveInspectedNodeId() ?? '') ?? [],
  );

  protected readonly effectiveSelectedExecution = computed(() =>
    resolveTngFlowSelectedExecution(this.inspectedNodeExecutions(), this.selectedExecutionId()),
  );

  protected readonly effectiveSelectedExecutionId = computed(
    () => this.effectiveSelectedExecution()?.id ?? null,
  );

  protected readonly resolvedDetailsKind = computed<Exclude<TngFlowWorkbenchDetailsKind, 'auto'>>(
    () => {
      const requested = this.detailsKind();
      if (requested !== 'auto') {
        return requested;
      }
      switch (this.mode()) {
        case 'live':
          return 'execution';
        case 'create':
        case 'edit':
        case 'inspect':
          return 'node-properties';
        case 'view':
          return 'none';
      }
    },
  );

  protected readonly hasPaletteContent = computed(
    () => this.paletteTemplate() !== undefined || this.paletteItems().length > 0,
  );

  protected readonly showResolvedPalette = computed(
    () =>
      this.showPalette() &&
      this.paletteOpen() &&
      this.hasPaletteContent() &&
      (this.mode() === 'create' || this.mode() === 'edit'),
  );

  protected readonly hasDetailsContent = computed(
    () => this.detailsTemplate() !== undefined || this.resolvedDetailsKind() !== 'none',
  );

  protected readonly showResolvedDetails = computed(
    () => this.showDetails() && this.detailsOpen() && this.hasDetailsContent(),
  );

  protected readonly resolvedDetailsPosition = computed<
    Exclude<TngFlowExecutionInspectorPosition, 'auto'>
  >(() => {
    const requested = this.detailsPosition();
    if (requested === 'right' || requested === 'bottom') {
      return requested;
    }
    return this.containerWidth() <
      this.normalizedPositiveNumber(this.detailsBreakpoint(), DEFAULT_DETAILS_BREAKPOINT)
      ? 'bottom'
      : 'right';
  });

  protected readonly splitOrientation = computed(() =>
    this.resolvedDetailsPosition() === 'right' ? 'horizontal' : 'vertical',
  );

  protected readonly detailsSize = computed(() =>
    this.resolvedDetailsPosition() === 'right'
      ? this.normalizedPositiveNumber(this.rightDetailsSize(), DEFAULT_RIGHT_DETAILS_SIZE)
      : this.normalizedPositiveNumber(this.bottomDetailsSize(), DEFAULT_BOTTOM_DETAILS_SIZE),
  );

  protected readonly normalizedGraphMinSize = computed(() =>
    this.normalizedPositiveNumber(this.graphMinSize(), DEFAULT_GRAPH_MIN_SIZE),
  );

  protected readonly normalizedDetailsMinSize = computed(() =>
    this.normalizedPositiveNumber(this.detailsMinSize(), DEFAULT_DETAILS_MIN_SIZE),
  );

  protected readonly normalizedPaletteSize = computed(() =>
    this.normalizedPositiveNumber(this.paletteWidth(), DEFAULT_PALETTE_SIZE),
  );

  protected readonly normalizedPaletteMinSize = computed(() =>
    this.normalizedPositiveNumber(this.paletteMinSize(), DEFAULT_PALETTE_MIN_SIZE),
  );

  protected readonly paletteTemplateContext = computed<
    TngFlowWorkbenchPaletteTemplateContext<TPayload, TNodeData, TConnectionData>
  >(() => ({
    definition: this.definition(),
    mode: this.mode(),
    snapshot: this.snapshot(),
  }));

  protected readonly detailsTemplateContext = computed<
    TngFlowWorkbenchDetailsTemplateContext<TPayload, TNodeData, TConnectionData>
  >(() => ({
    definition: this.definition(),
    inspectedNode: this.inspectedNode(),
    inspectedNodeId: this.effectiveInspectedNodeId(),
    mode: this.mode(),
    selectedExecution: this.effectiveSelectedExecution(),
    snapshot: this.snapshot(),
  }));

  protected readonly inspectorTemplateContext = computed<
    TngFlowExecutionInspectorTemplateContext<TPayload>
  >(() => ({
    $implicit: this.snapshot(),
    snapshot: this.snapshot(),
    inspectedNodeId: this.effectiveInspectedNodeId(),
    selectedExecution: this.effectiveSelectedExecution(),
  }));

  private readonly resizeEffect = afterRenderEffect((onCleanup) => {
    this.observeContainer();
    onCleanup(() => this.disconnectResizeObserver());
  });

  public ngOnDestroy(): void {
    this.disconnectResizeObserver();
  }

  public refreshLayout(): void {
    this.graph()?.refreshLayout();
  }

  public fitToScreen(animated = true, padding = 48): void {
    this.graph()?.fitToScreen(animated, padding);
  }

  public resetViewport(animated = true): void {
    this.graph()?.resetViewport(animated);
  }

  public centerNode(nodeId: string, animated = true): boolean {
    return this.graph()?.centerNode(nodeId, animated) ?? false;
  }

  public requestNodeCreate(item: TngFlowPaletteItem<TNodeData>, position?: TngFlowPoint): void {
    this.graph()?.requestNodeCreate(item, position, 'api');
  }

  public requestConnectionRoutingChange(
    type: TngFlowConnectionPathType,
    source: TngFlowConnectionRoutingChangeSource = 'api',
  ): boolean {
    return this.graph()?.requestConnectionRoutingChange(type, source) ?? false;
  }

  // eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types -- Public controlled-selection API uses the exported selection type.
  public onEditorSelectionChange(selection: TngFlowSelection): void {
    const graph = this.graph();
    if (graph !== undefined) {
      graph.onEditorSelectionChange(selection);
      return;
    }
    if (areTngFlowSelectionsEqual(selection, this.selection())) {
      return;
    }
    const inspectedNodeId = resolveTngFlowExecutionInspectedNodeId(
      this.definition(),
      selection,
      this.inspectedNodeId(),
    );
    const selectedExecutionId =
      resolveTngFlowSelectedExecution(
        this.index().nodeExecutionsByNodeId.get(inspectedNodeId ?? '') ?? [],
        this.selectedExecutionId(),
      )?.id ?? null;
    this.selectionChange.emit(selection);
    if (inspectedNodeId !== this.effectiveInspectedNodeId()) {
      this.inspectedNodeIdChange.emit(inspectedNodeId);
    }
    if (selectedExecutionId !== this.effectiveSelectedExecutionId()) {
      this.selectedExecutionIdChange.emit(selectedExecutionId);
    }
  }

  protected onPaletteItemActivated(event: TngFlowPaletteItemActivation<TNodeData>): void {
    this.graph()?.requestNodeCreate(event.item, undefined, event.source);
  }

  protected onDetailsExecutionSelected(executionId: string | null): void {
    if (executionId !== this.effectiveSelectedExecutionId()) {
      this.selectedExecutionIdChange.emit(executionId);
    }
  }

  protected onDetailsExecutionActivated(event: TngFlowExecutionActivatedEvent<TPayload>): void {
    this.executionActivated.emit(event);
  }

  protected onViewportChange(viewport: TngFlowViewport): void {
    this.viewportChange.emit(viewport);
  }

  protected toggleDetails(): void {
    const next = !this.showResolvedDetails();
    this.detailsOpenChange.emit(next);
    if (!next) {
      this.restoreFocusAfterPanelCollapse();
    }
  }

  protected togglePalette(): void {
    const next = !this.showResolvedPalette();
    this.paletteOpenChange.emit(next);
    if (!next) {
      this.restoreFocusAfterPanelCollapse();
    }
  }

  protected onSplitResize(event: TngSplitResizeEvent): void {
    const paneSize = event.nextPaneSize;
    if (!Number.isFinite(paneSize) || paneSize < 0) {
      this.warnOnce('invalid-number', 'split-size', 'Invalid split pane size received.');
    }
  }

  private observeContainer(): void {
    if (this.resizeObserver !== null || this.resizeCleanup !== null) {
      return;
    }
    const element = this.hostRef.nativeElement;
    const ownerWindow = element.ownerDocument.defaultView;
    const resizeObserverConstructor = ownerWindow?.ResizeObserver;
    if (resizeObserverConstructor !== undefined) {
      // eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types -- ResizeObserver entries are browser-owned mutable records.
      this.resizeObserver = new resizeObserverConstructor((entries) => {
        const width = entries[0]?.contentRect.width;
        if (width !== undefined && Number.isFinite(width)) {
          this.zone.run(() => {
            this.containerWidth.set(width);
            this.changeDetector.markForCheck();
          });
        }
      });
      this.resizeObserver.observe(element);
      return;
    }
    if (ownerWindow !== undefined && ownerWindow !== null) {
      const resize = (): void => {
        this.containerWidth.set(element.getBoundingClientRect().width);
        this.changeDetector.markForCheck();
      };
      ownerWindow.addEventListener('resize', resize);
      this.resizeCleanup = (): void => ownerWindow.removeEventListener('resize', resize);
      resize();
    }
  }

  private disconnectResizeObserver(): void {
    this.resizeObserver?.disconnect();
    this.resizeObserver = null;
    this.resizeCleanup?.();
    this.resizeCleanup = null;
  }

  private normalizedPositiveNumber(value: number, fallback: number): number {
    if (Number.isFinite(value) && value > 0) {
      return value;
    }
    this.warnOnce('invalid-number', String(value), `Invalid numeric option "${value}".`);
    return fallback;
  }

  private warnOnce(code: string, id: string, message: string): void {
    if (!isDevMode()) {
      return;
    }
    const signature = `${this.snapshot()?.id ?? 'no-snapshot'}|${this.snapshot()?.definitionRevision ?? ''}|${code}|${id}`;
    if (this.warningSignatures.has(signature)) {
      return;
    }
    this.warningSignatures.add(signature);
    console.warn(`[TngFlowWorkbench] ${message}`);
  }

  private restoreFocusAfterPanelCollapse(): void {
    const activeElement = this.documentRef.activeElement;
    if (!(activeElement instanceof HTMLElement)) {
      return;
    }
    if (!this.hostRef.nativeElement.contains(activeElement)) {
      return;
    }
    queueMicrotask(() => this.hostRef.nativeElement.focus());
  }
}
