import { Component, computed, signal } from '@angular/core';
import { TngButtonComponent } from '@tailng-ui/components';
import {
  TngFlowEditorComponent,
  TngFlowNodeComponent,
  TngFlowNodeTemplateDirective,
  type TngFlowConnectionCandidate,
  type TngFlowConnectionCreateRequest,
  type TngFlowConnectionReconnectRequest,
  type TngFlowConnectionRejectedEvent,
  type TngFlowConnectionsDeleteRequest,
  type TngFlowConnectionValidation,
  type TngFlowDefinition,
  type TngFlowEditorMode,
  type TngFlowNode,
  type TngFlowNodeCreateRequest,
  type TngFlowNodePositionChange,
  type TngFlowNodesDeleteRequest,
  type TngFlowNodePresentation,
  type TngFlowPresentation,
  type TngFlowSelection,
  type TngFlowValidation,
  type TngFlowValidationIssue,
  type TngFlowValidationIssueActivatedEvent,
} from '@tailng-ui/flow';
import {
  documentExecutionConnectionIds,
  documentExecutionNodeIds,
  documentReviewDefinition,
  documentReviewValidation,
  notificationPaletteItem,
  type DocumentReviewNodeData,
} from './document-review-workflow.data';

type ConfigurationEntry = Readonly<{ key: string; value: string }>;

const editorModes: readonly TngFlowEditorMode[] = ['edit', 'inspect', 'readonly'];
const emptySelection = (): TngFlowSelection => ({
  nodeIds: new Set<string>(),
  connectionIds: new Set<string>(),
});

function formatConfigurationValue(value: unknown): string {
  if (value === null) {
    return 'Not configured';
  }
  if (Array.isArray(value)) {
    return value.join(', ');
  }
  if (typeof value === 'string') {
    return value;
  }
  return JSON.stringify(value) ?? 'Unsupported value';
}

function executionNodeView(
  nodeId: string,
  index: number,
  activeIndex: number,
): TngFlowNodePresentation {
  if (index < activeIndex || (nodeId === 'complete' && index === activeIndex)) {
    return { status: 'completed', progress: 100 };
  }
  if (index === activeIndex) {
    return nodeId === 'manual-review'
      ? { status: 'waiting', statusMessage: 'Waiting for a reviewer', highlighted: true }
      : { status: 'running', progress: 62, highlighted: true };
  }
  return { status: 'idle', dimmed: true };
}

function createExecutionPresentation(activeIndex: number): TngFlowPresentation {
  const nodes = Object.fromEntries(
    documentExecutionNodeIds.map((nodeId, index) => [
      nodeId,
      executionNodeView(nodeId, index, activeIndex),
    ]),
  );
  const connections = Object.fromEntries(
    documentExecutionConnectionIds.map((connectionId, index) => [
      connectionId,
      index < activeIndex
        ? { status: 'success' as const }
        : index === activeIndex - 1
          ? { status: 'active' as const, motion: 'flow' as const }
          : { status: 'idle' as const, dimmed: true },
    ]),
  );
  return { nodes, connections };
}

function issueTargetsDeletedNode(
  issue: TngFlowValidationIssue,
  nodeIds: ReadonlySet<string>,
): boolean {
  return (
    issue.target.kind !== 'flow' && 'nodeId' in issue.target && nodeIds.has(issue.target.nodeId)
  );
}

@Component({
  selector: 'app-document-review-demo',
  imports: [
    TngButtonComponent,
    TngFlowEditorComponent,
    TngFlowNodeComponent,
    TngFlowNodeTemplateDirective,
  ],
  templateUrl: './document-review-demo.component.html',
  styleUrl: './document-review-demo.component.css',
})
export class DocumentReviewDemoComponent {
  protected readonly definition =
    signal<TngFlowDefinition<DocumentReviewNodeData>>(documentReviewDefinition);
  protected readonly selection = signal<TngFlowSelection>(emptySelection());
  protected readonly validation = signal<TngFlowValidation>(documentReviewValidation);
  protected readonly presentation = signal<TngFlowPresentation>({});
  protected readonly mode = signal<TngFlowEditorMode>('edit');
  protected readonly executionIndex = signal<number | null>(null);
  protected readonly lastEvent = signal('Ready — select a node or try one of the workflow tools.');
  protected readonly rejection = signal(false);
  protected readonly editorModes = editorModes;
  protected readonly notificationPaletteItem = notificationPaletteItem;
  private nextNotificationId = 1;
  private nextConnectionId = 1;

  protected readonly selectedNode = computed<TngFlowNode<DocumentReviewNodeData> | null>(() => {
    const nodeId = this.selection().nodeIds.values().next().value;
    return this.definition().nodes.find((node) => node.id === nodeId) ?? null;
  });
  protected readonly selectedConfiguration = computed<readonly ConfigurationEntry[]>(() =>
    Object.entries(this.selectedNode()?.data?.configuration ?? {}).map(([key, value]) => ({
      key,
      value: formatConfigurationValue(value),
    })),
  );
  protected readonly selectedIssues = computed(() => {
    const nodeId = this.selectedNode()?.id;
    return nodeId === undefined
      ? []
      : this.validation().issues.filter(
          (issue) =>
            issue.target.kind !== 'flow' &&
            'nodeId' in issue.target &&
            issue.target.nodeId === nodeId,
        );
  });
  protected readonly canEdit = computed(() => this.mode() === 'edit');
  protected readonly canRemoveSelected = computed(
    () => this.canEdit() && this.selectedNode() !== null,
  );
  protected readonly hasValidation = computed(() => this.validation().issues.length > 0);
  protected readonly canAdvanceExecution = computed(() => {
    const index = this.executionIndex();
    return index !== null && index < documentExecutionNodeIds.length - 1;
  });

  protected readonly validateConnection = (
    candidate: TngFlowConnectionCandidate<DocumentReviewNodeData>,
  ): TngFlowConnectionValidation => {
    const sourceType = candidate.sourcePort.dataType;
    const targetType = candidate.targetPort.dataType;
    return sourceType === undefined || targetType === undefined || sourceType === targetType
      ? { valid: true }
      : {
          valid: false,
          code: 'incompatible-data-type',
          reason: `Cannot connect ${sourceType} data to ${targetType} data.`,
        };
  };

  protected setMode(nextMode: TngFlowEditorMode): void {
    this.mode.set(nextMode);
    if (nextMode === 'readonly') {
      this.selection.set(emptySelection());
    }
    this.rejection.set(false);
    this.lastEvent.set(
      nextMode === 'edit'
        ? 'Edit mode — graph mutations are enabled.'
        : nextMode === 'inspect'
          ? 'Inspect mode — select and navigate without changing the graph.'
          : 'Readonly mode — pan and zoom without selection or editing.',
    );
  }

  protected createNode(request: TngFlowNodeCreateRequest<DocumentReviewNodeData>): void {
    const id = `notification-${this.nextNotificationId++}`;
    const node: TngFlowNode<DocumentReviewNodeData> = {
      id,
      type: request.item.type,
      name: request.item.name,
      description: request.item.description,
      icon: request.item.icon,
      position: request.position,
      ports: [
        { id: 'input', name: 'Input', direction: 'input', kind: 'control', required: true },
        { id: 'complete', name: 'Complete', direction: 'output', kind: 'control' },
      ],
      data: request.item.data,
    };
    this.definition.update((definition) => ({
      ...definition,
      nodes: [...definition.nodes, node],
    }));
    this.selection.set({ nodeIds: new Set([id]), connectionIds: new Set() });
    this.setLastEvent(`Created ${node.name}; the application added it to the definition.`);
  }

  protected moveNode(event: TngFlowNodePositionChange): void {
    this.definition.update((definition) => ({
      ...definition,
      nodes: definition.nodes.map((node) =>
        node.id === event.nodeId ? { ...node, position: event.position } : node,
      ),
    }));
    this.setLastEvent(`Stored the new position for ${event.nodeId}.`);
  }

  protected createConnection(request: TngFlowConnectionCreateRequest): void {
    const id = `document-connection-${this.nextConnectionId++}`;
    this.definition.update((definition) => ({
      ...definition,
      connections: [...definition.connections, { id, ...request, type: 'bezier' }],
    }));
    this.setLastEvent(`Created ${id}; the application accepted the connection request.`);
  }

  protected reconnectConnection(request: TngFlowConnectionReconnectRequest): void {
    this.definition.update((definition) => ({
      ...definition,
      connections: definition.connections.map((connection) =>
        connection.id === request.connectionId
          ? { ...connection, source: request.source, target: request.target }
          : connection,
      ),
    }));
    this.setLastEvent(`Reconnected the ${request.changedEndpoint} of ${request.connectionId}.`);
  }

  protected updateSelection(nextSelection: TngFlowSelection): void {
    this.selection.set(nextSelection);
    const ids = [...nextSelection.nodeIds, ...nextSelection.connectionIds];
    this.setLastEvent(ids.length === 0 ? 'Selection cleared.' : `Selected ${ids.join(', ')}.`);
  }

  protected deleteNodes(request: TngFlowNodesDeleteRequest): void {
    this.removeNodes(new Set(request.nodeIds));
  }

  protected removeSelectedNode(): void {
    this.removeNodes(new Set(this.selection().nodeIds));
  }

  protected deleteConnections(request: TngFlowConnectionsDeleteRequest): void {
    const ids = new Set(request.connectionIds);
    this.definition.update((definition) => ({
      ...definition,
      connections: definition.connections.filter((connection) => !ids.has(connection.id)),
    }));
    this.selection.set(emptySelection());
    this.setLastEvent(`Removed ${request.connectionIds.join(', ')} from application state.`);
  }

  protected rejectConnection(event: TngFlowConnectionRejectedEvent): void {
    this.rejection.set(true);
    this.lastEvent.set(`Connection rejected — ${event.reason}`);
  }

  protected toggleValidation(): void {
    if (this.hasValidation()) {
      this.validation.set({ issues: [] });
      this.setLastEvent('Cleared the external reviewer validation issue.');
      return;
    }
    this.validation.set(documentReviewValidation);
    this.setLastEvent('Added the external reviewer validation issue.');
  }

  protected showFirstError(editor: TngFlowEditorComponent<DocumentReviewNodeData>): void {
    const issue = this.validation().issues.find((candidate) => candidate.severity === 'error');
    if (issue === undefined) {
      this.setLastEvent('There are no validation errors to show.');
      return;
    }
    editor.revealTarget(issue.target, { animated: true, select: true });
    this.setLastEvent(`Focused validation issue — ${issue.message}`);
  }

  protected activateIssue(event: TngFlowValidationIssueActivatedEvent): void {
    this.setLastEvent(`Opened ${event.issue.id} from the ${event.source}.`);
  }

  protected startExecution(): void {
    this.mode.set('inspect');
    this.selection.set(emptySelection());
    this.executionIndex.set(0);
    this.presentation.set(createExecutionPresentation(0));
    this.setLastEvent('Execution started — advance to follow the manual-review path.');
  }

  protected advanceExecution(): void {
    const currentIndex = this.executionIndex();
    if (currentIndex === null || currentIndex >= documentExecutionNodeIds.length - 1) {
      return;
    }
    const nextIndex = currentIndex + 1;
    const nodeId = documentExecutionNodeIds[nextIndex];
    this.executionIndex.set(nextIndex);
    this.presentation.set(createExecutionPresentation(nextIndex));
    this.setLastEvent(
      nodeId === 'complete'
        ? 'Execution completed — the document is approved.'
        : `Execution advanced to ${nodeId}.`,
    );
  }

  protected reset(): void {
    this.definition.set(documentReviewDefinition);
    this.selection.set(emptySelection());
    this.validation.set(documentReviewValidation);
    this.presentation.set({});
    this.mode.set('edit');
    this.executionIndex.set(null);
    this.nextNotificationId = 1;
    this.nextConnectionId = 1;
    this.setLastEvent('Example reset to the application-owned definition.');
  }

  private removeNodes(nodeIds: ReadonlySet<string>): void {
    if (nodeIds.size === 0) {
      return;
    }
    this.definition.update((definition) => ({
      ...definition,
      nodes: definition.nodes.filter((node) => !nodeIds.has(node.id)),
      connections: definition.connections.filter(
        (connection) =>
          !nodeIds.has(connection.source.nodeId) && !nodeIds.has(connection.target.nodeId),
      ),
    }));
    this.validation.update((validation) => ({
      issues: validation.issues.filter((issue) => !issueTargetsDeletedNode(issue, nodeIds)),
    }));
    this.selection.set(emptySelection());
    this.setLastEvent(`Removed ${[...nodeIds].join(', ')} and its attached connections.`);
  }

  private setLastEvent(message: string): void {
    this.rejection.set(false);
    this.lastEvent.set(message);
  }
}
