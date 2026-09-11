import { ChangeDetectionStrategy, Component, input, model, output, viewChild } from '@angular/core';
import { booleanAttribute } from '@angular/core';
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
  TngFlowNodeCreateRequest,
  TngFlowNodePositionChange,
  TngFlowNodesDeleteRequest,
  TngFlowNodesMovedEvent,
  TngFlowSelection,
  TngFlowViewport,
} from '../../../lib/types/tng-flow.types';
import { EMPTY_TNG_FLOW_SELECTION } from '../../../lib/types/tng-flow.types';
import type {
  TngFlowExecutionActivatedEvent,
  TngFlowExecutionDateTimeFormatter,
  TngFlowExecutionInspectorPosition,
  TngFlowExecutionInspectorScope,
  TngFlowExecutionViewerState,
  TngFlowRunExecutionSnapshot,
} from '../../model/tng-flow-execution.types';
import { TngFlowWorkbenchComponent } from '../workbench/tng-flow-workbench.component';

@Component({
  selector: 'tng-flow-execution-viewer',
  imports: [TngFlowWorkbenchComponent],
  templateUrl: './tng-flow-execution-viewer.component.html',
  styleUrl: './tng-flow-execution-viewer.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  exportAs: 'tngFlowExecutionViewer',
  host: {
    class: 'tng-flow-execution-viewer',
    '[attr.data-state]': 'state()',
    '[attr.data-inspector-open]': 'showInspector() && inspectorOpen() ? "" : null',
    '[attr.data-inspector-position]': 'inspectorPosition()',
  },
})
export class TngFlowExecutionViewerComponent<
  TPayload = unknown,
  TNodeData = unknown,
  TConnectionData = unknown,
> {
  private readonly workbench = viewChild(TngFlowWorkbenchComponent);

  public readonly definition = input<TngFlowDefinition<TNodeData, TConnectionData> | null>(null);
  public readonly snapshot = input<TngFlowRunExecutionSnapshot<TPayload> | null>(null);
  public readonly selection = input<TngFlowSelection>(EMPTY_TNG_FLOW_SELECTION);
  public readonly inspectedNodeId = input<string | null>(null);
  public readonly selectedExecutionId = input<string | null>(null);
  public readonly viewport = input<TngFlowViewport | null>(null);
  public readonly mode = input<TngFlowEditorMode>('inspect');
  public readonly state = input<TngFlowExecutionViewerState>('ready');
  public readonly stateMessage = input<string | null>(null);
  public readonly inspectorScope = input<TngFlowExecutionInspectorScope>('auto');
  public readonly inspectorPosition = input<TngFlowExecutionInspectorPosition>('auto');
  public readonly showInspector = input<boolean, boolean | string>(true, {
    transform: booleanAttribute,
  });
  public readonly inspectorOpen = input<boolean, boolean | string>(true, {
    transform: booleanAttribute,
  });
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
  public readonly flowId = input<string>('tng-flow-execution-viewer');
  public readonly ariaLabel = input<string>('Workflow execution viewer');
  public readonly inspectorBreakpoint = input<number>(720);
  public readonly rightInspectorSize = input<number>(360);
  public readonly bottomInspectorSize = input<number>(280);
  public readonly graphMinSize = input<number>(320);
  public readonly inspectorMinSize = input<number>(240);
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
  public readonly inspectorOpenChange = output<boolean>();
  public readonly executionActivated = output<TngFlowExecutionActivatedEvent<TPayload>>();

  public refreshLayout(): void {
    this.workbench()?.refreshLayout();
  }

  public fitToScreen(animated = true, padding = 48): void {
    this.workbench()?.fitToScreen(animated, padding);
  }

  public requestConnectionRoutingChange(
    type: TngFlowConnectionPathType,
    source: TngFlowConnectionRoutingChangeSource = 'api',
  ): boolean {
    return this.workbench()?.requestConnectionRoutingChange(type, source) ?? false;
  }

  public resetViewport(animated = true): void {
    this.workbench()?.resetViewport(animated);
  }

  public centerNode(nodeId: string, animated = true): boolean {
    return this.workbench()?.centerNode(nodeId, animated) ?? false;
  }

  // eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types -- Compatibility facade mirrors the public controlled-selection API.
  public onEditorSelectionChange(selection: TngFlowSelection): void {
    this.workbench()?.onEditorSelectionChange(selection);
  }
}
