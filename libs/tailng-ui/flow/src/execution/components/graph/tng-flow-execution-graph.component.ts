/* eslint-disable complexity, no-console -- The graph facade owns execution presentation, controlled selection reconciliation, and dev diagnostics. */
import {
  ChangeDetectionStrategy,
  Component,
  booleanAttribute,
  computed,
  effect,
  input,
  isDevMode,
  model,
  output,
  signal,
  viewChild,
} from '@angular/core';
import { TngFlowEditorComponent } from '../../../lib/editor/tng-flow-editor.component';
import { areTngFlowSelectionsEqual } from '../../../lib/model/tng-flow-selection';
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
import type { TngFlowNodeActivatedEvent } from '../../../lib/types/tng-flow-events.types';
import type { TngFlowKeyboardOptions } from '../../../lib/types/tng-flow-keyboard.types';
import type { TngFlowMinimapOptions } from '../../../lib/types/tng-flow-minimap.types';
import type {
  TngFlowAttachmentLayout,
  TngFlowDefinition,
  TngFlowConnectionCreateRequest,
  TngFlowConnectionReconnectRequest,
  TngFlowConnectionRejectedEvent,
  TngFlowConnectionsDeleteRequest,
  TngFlowConnectionValidator,
  TngFlowEditorMode,
  TngFlowNodeCreateRequest,
  TngFlowNodeCreateSource,
  TngFlowNodePositionChange,
  TngFlowNodesDeleteRequest,
  TngFlowNodesMovedEvent,
  TngFlowPaletteItem,
  TngFlowPoint,
  TngFlowSelection,
  TngFlowViewport,
} from '../../../lib/types/tng-flow.types';
import { EMPTY_TNG_FLOW_SELECTION } from '../../../lib/types/tng-flow.types';
import {
  createTngFlowExecutionIndex,
  createTngFlowExecutionPresentation,
  resolveTngFlowExecutionInspectedNodeId,
  resolveTngFlowSelectedExecution,
} from '../../model/tng-flow-execution.model';
import type {
  TngFlowExecutionActivatedEvent,
  TngFlowRunExecutionSnapshot,
} from '../../model/tng-flow-execution.types';

@Component({
  selector: 'tng-flow-execution-graph',
  imports: [TngFlowEditorComponent],
  templateUrl: './tng-flow-execution-graph.component.html',
  styleUrl: './tng-flow-execution-graph.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  exportAs: 'tngFlowExecutionGraph',
  host: {
    class: 'tng-flow-execution-graph',
  },
})
export class TngFlowExecutionGraphComponent<
  TPayload = unknown,
  TNodeData = unknown,
  TConnectionData = unknown,
> {
  private readonly editor = viewChild(TngFlowEditorComponent);
  private readonly warningSignatures = new Set<string>();
  private liveRegionPrimed = false;
  private lastLiveSignature = '';

  public readonly definition = input<TngFlowDefinition<TNodeData, TConnectionData> | null>(null);
  public readonly snapshot = input<TngFlowRunExecutionSnapshot<TPayload> | null>(null);
  public readonly selection = input<TngFlowSelection>(EMPTY_TNG_FLOW_SELECTION);
  public readonly inspectedNodeId = input<string | null>(null);
  public readonly selectedExecutionId = input<string | null>(null);
  public readonly viewport = input<TngFlowViewport | null>(null);
  public readonly mode = input<TngFlowEditorMode>('inspect');
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
  public readonly flowId = input<string>('tng-flow-execution-graph');
  public readonly ariaLabel = input<string>('Workflow execution graph');
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
  public readonly executionActivated = output<TngFlowExecutionActivatedEvent<TPayload>>();

  protected readonly liveRegionMessage = signal('');

  protected readonly index = computed(() =>
    createTngFlowExecutionIndex(this.definition(), this.snapshot()),
  );

  protected readonly presentation = computed(() =>
    createTngFlowExecutionPresentation(this.definition(), this.index(), 'status-driven'),
  );

  protected readonly effectiveInspectedNodeId = computed(() =>
    resolveTngFlowExecutionInspectedNodeId(
      this.definition(),
      this.selection(),
      this.inspectedNodeId(),
    ),
  );

  protected readonly inspectedNodeExecutions = computed(
    () => this.index().nodeExecutionsByNodeId.get(this.effectiveInspectedNodeId() ?? '') ?? [],
  );

  protected readonly effectiveSelectedExecution = computed(() =>
    resolveTngFlowSelectedExecution(this.inspectedNodeExecutions(), this.selectedExecutionId()),
  );

  protected readonly effectiveSelectedExecutionId = computed(
    () => this.effectiveSelectedExecution()?.id ?? null,
  );

  private readonly warningEffect = effect(() => {
    for (const warning of this.index().warnings) {
      this.warnOnce(warning.code, warning.id ?? '', warning.message);
    }
  });

  private readonly liveRegionEffect = effect(() => {
    const execution = this.effectiveSelectedExecution();
    const nodeId = this.effectiveInspectedNodeId();
    const signature =
      execution === null
        ? `${nodeId ?? ''}|none`
        : `${nodeId ?? ''}|${execution.id}|${execution.phase}|${execution.statusMessage ?? ''}`;
    if (!this.liveRegionPrimed) {
      this.liveRegionPrimed = true;
      this.lastLiveSignature = signature;
      return;
    }
    if (signature === this.lastLiveSignature) {
      return;
    }
    this.lastLiveSignature = signature;
    this.liveRegionMessage.set(
      execution === null
        ? 'No execution is selected.'
        : `${execution.phase}${execution.statusMessage ? `: ${execution.statusMessage}` : ''}`,
    );
  });

  public refreshLayout(): void {
    this.editor()?.refreshLayout();
  }

  public fitToScreen(animated = true, padding = 48): void {
    this.editor()?.fitToScreen(animated, padding);
  }

  public resetViewport(animated = true): void {
    this.editor()?.resetViewport(animated);
  }

  public centerNode(nodeId: string, animated = true): boolean {
    return this.editor()?.centerNode(nodeId, animated) ?? false;
  }

  public requestNodeCreate(
    item: TngFlowPaletteItem<TNodeData>,
    position?: TngFlowPoint,
    source: TngFlowNodeCreateSource = 'api',
  ): void {
    this.editor()?.requestNodeCreate(item, position, source);
  }

  public requestConnectionRoutingChange(
    type: TngFlowConnectionPathType,
    source: TngFlowConnectionRoutingChangeSource = 'api',
  ): boolean {
    return this.editor()?.requestConnectionRoutingChange(type, source) ?? false;
  }

  // eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types -- Public controlled-selection API uses the exported selection type.
  public onEditorSelectionChange(selection: TngFlowSelection): void {
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

  protected onGraphNodeActivated(event: TngFlowNodeActivatedEvent): void {
    const node =
      this.definition()?.nodes.find((candidate) => candidate.id === event.nodeId) ?? null;
    const execution = resolveTngFlowSelectedExecution(
      this.index().nodeExecutionsByNodeId.get(event.nodeId) ?? [],
      this.selectedExecutionId(),
    );
    this.executionActivated.emit({
      node,
      execution,
      source: 'graph',
    });
  }

  protected onViewportChange(viewport: TngFlowViewport): void {
    this.viewportChange.emit(viewport);
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
    console.warn(`[TngFlowExecutionGraph] ${message}`);
  }
}
