import { DOCUMENT } from '@angular/common';
import { Component, inject, signal, type OnDestroy } from '@angular/core';
import {
  TngButtonComponent,
  TngCardComponent,
  TngCardContentComponent,
  TngCardDescriptionComponent,
  TngCardHeaderComponent,
  TngCardTitleComponent,
} from '@tailng-ui/components';
import {
  TngFlowEditorComponent,
  TngFlowNodeTemplateDirective,
  type TngFlowConnectionCandidate,
  type TngFlowConnectionCreateRequest,
  type TngFlowConnectionReconnectRequest,
  type TngFlowConnectionRejectedEvent,
  type TngFlowConnectionsDeleteRequest,
  type TngFlowConnectionValidation,
  type TngFlowDefinition,
  type TngFlowEditorMode,
  type TngFlowNodesDeleteRequest,
  type TngFlowNodePositionChange,
  type TngFlowNodesMovedEvent,
  type TngFlowNodeViews,
  type TngFlowSelection,
} from '@tailng-ui/flow';
import {
  connectionEditingPlainCssCodeTabs,
  connectionEditingTailwindCodeTabs,
  controlledPositionPlainCssCodeTabs,
  controlledPositionTailwindCodeTabs,
  customNodePlainCssCodeTabs,
  customNodeTailwindCodeTabs,
  gridBackgroundPlainCssCodeTabs,
  gridBackgroundTailwindCodeTabs,
  jsonDefinitionPlainCssCodeTabs,
  jsonDefinitionTailwindCodeTabs,
  monitorPlainCssCodeTabs,
  monitorTailwindCodeTabs,
  selectionModesPlainCssCodeTabs,
  selectionModesTailwindCodeTabs,
} from './flow-editor-examples-code.data';
import {
  DocsExampleTabsSectionComponent,
  DocsExampleVariantDirective,
} from '../../../../../../../shared/example-tabs-section/docs-example-tabs-section.component';
import {
  observeDocsCodeThemeChanges,
  resolveDocsCodeBlockTheme,
} from '../../../../../../../shared/util';
import {
  applyFlowNodeMoves,
  flowEditorDemoConnections,
  flowEditorDemoNodes,
} from '../../../flow-editor-demo.data';
import { connectionRoutingDemoCodeTabs } from '../connection-routing-demo/connection-routing-demo-code.data';
import { ConnectionRoutingDemoComponent } from '../connection-routing-demo/connection-routing-demo.component';
import { documentReviewDemoCodeTabs } from '../document-review-demo/document-review-demo-code.data';
import { DocumentReviewDemoComponent } from '../document-review-demo/document-review-demo.component';
import { professionalFlowBuilderDemoCodeTabs } from '../professional-flow-builder-demo/professional-flow-builder-demo-code.data';
import { ProfessionalFlowBuilderDemoComponent } from '../professional-flow-builder-demo/professional-flow-builder-demo.component';
import { timedExecutionDemoCodeTabs } from '../timed-execution-demo/timed-execution-demo-code.data';
import { TimedExecutionDemoComponent } from '../timed-execution-demo/timed-execution-demo.component';

type FlowExampleVariant = 'plain-css' | 'tailwind-css';

const emptySelection = (): TngFlowSelection => ({
  nodeIds: new Set<string>(),
  connectionIds: new Set<string>(),
});

const connectionEditingDefinition = Object.freeze({
  id: 'docs-connection-editing',
  name: 'Connection editing lab',
  nodes: [
    {
      id: 'request',
      type: 'source',
      name: 'Request payload',
      description: 'Primary text payload.',
      position: { x: 50, y: 90 },
      ports: [
        {
          id: 'payload',
          name: 'Text',
          direction: 'output',
          kind: 'data',
          dataType: 'text',
          multiple: true,
        },
      ],
    },
    {
      id: 'fallback',
      type: 'source',
      name: 'Fallback payload',
      description: 'Second source for multiplicity checks.',
      position: { x: 50, y: 320 },
      ports: [
        {
          id: 'payload',
          name: 'Text',
          direction: 'output',
          kind: 'data',
          dataType: 'text',
          multiple: true,
        },
      ],
    },
    {
      id: 'parser',
      type: 'transform',
      name: 'Parse request',
      description: 'Converts text into structured JSON.',
      position: { x: 390, y: 190 },
      ports: [
        {
          id: 'payload',
          name: 'Text',
          direction: 'input',
          kind: 'data',
          dataType: 'text',
        },
        {
          id: 'result',
          name: 'JSON',
          direction: 'output',
          kind: 'data',
          dataType: 'json',
          multiple: true,
        },
      ],
    },
    {
      id: 'publish',
      type: 'target',
      name: 'Publish result',
      description: 'Current connection target.',
      position: { x: 760, y: 90 },
      ports: [
        {
          id: 'result',
          name: 'JSON',
          direction: 'input',
          kind: 'data',
          dataType: 'json',
        },
      ],
    },
    {
      id: 'archive',
      type: 'target',
      name: 'Archive result',
      description: 'Alternate reconnection target.',
      position: { x: 760, y: 320 },
      ports: [
        {
          id: 'result',
          name: 'JSON',
          direction: 'input',
          kind: 'data',
          dataType: 'json',
        },
      ],
    },
  ],
  connections: [
    {
      id: 'parser-to-publish',
      source: { nodeId: 'parser', portId: 'result' },
      target: { nodeId: 'publish', portId: 'result' },
      type: 'bezier',
    },
  ],
} satisfies TngFlowDefinition);

const selectionModesDefinition = Object.freeze({
  id: 'docs-selection-modes',
  name: 'Selection and modes lab',
  nodes: [
    {
      id: 'intake',
      type: 'source',
      name: 'Intake',
      description: 'Movable and deletable.',
      position: { x: 70, y: 170 },
      ports: [
        { id: 'request', name: 'Request', direction: 'output', kind: 'data', multiple: true },
      ],
    },
    {
      id: 'review',
      type: 'review',
      name: 'Locked review',
      description: 'Selectable, but cannot move or delete.',
      position: { x: 410, y: 170 },
      locked: true,
      ports: [
        { id: 'request', name: 'Request', direction: 'input', kind: 'data' },
        { id: 'decision', name: 'Decision', direction: 'output', kind: 'data', multiple: true },
      ],
    },
    {
      id: 'publish',
      type: 'target',
      name: 'Publish',
      description: 'Movable and deletable.',
      position: { x: 760, y: 170 },
      ports: [{ id: 'decision', name: 'Decision', direction: 'input', kind: 'data' }],
    },
  ],
  connections: [
    {
      id: 'intake-to-review',
      source: { nodeId: 'intake', portId: 'request' },
      target: { nodeId: 'review', portId: 'request' },
    },
    {
      id: 'review-to-publish',
      source: { nodeId: 'review', portId: 'decision' },
      target: { nodeId: 'publish', portId: 'decision' },
    },
  ],
} satisfies TngFlowDefinition);

class ConnectionEditingState {
  public readonly definition = signal<TngFlowDefinition>(connectionEditingDefinition);
  public readonly selection = signal<TngFlowSelection>(emptySelection());
  public readonly message = signal('Create a connection or reconnect the existing edge.');
  public readonly rejection = signal<string | null>(null);
  public nextConnectionId = 1;
}

class SelectionModesState {
  public readonly definition = signal<TngFlowDefinition>(selectionModesDefinition);
  public readonly selection = signal<TngFlowSelection>(emptySelection());
  public readonly mode = signal<TngFlowEditorMode>('edit');
  public readonly message = signal('Select a node or connection.');
}

const branchWorkflowDefinition = Object.freeze({
  id: 'docs-branch-merge-workflow',
  name: 'Branch and merge workflow',
  nodes: [
    {
      id: 'request',
      type: 'source',
      name: 'Incoming request',
      description: 'Receive and normalize the request.',
      position: { x: 60, y: 220 },
      data: { detail: 'Normalized request' },
      ports: [
        { id: 'request', name: 'Request', direction: 'output', kind: 'data', multiple: true },
      ],
    },
    {
      id: 'fast-track',
      type: 'automation',
      name: 'Fast-track analysis',
      description: 'Run automated policy checks.',
      position: { x: 390, y: 70 },
      data: { detail: 'Automated assessment' },
      ports: [
        { id: 'request', name: 'Request', direction: 'input', kind: 'data' },
        {
          id: 'result',
          name: 'Assessment',
          direction: 'output',
          kind: 'control',
          side: 'bottom',
        },
      ],
    },
    {
      id: 'risk-review',
      type: 'review',
      name: 'Risk review',
      description: 'Inspect exceptions in parallel.',
      position: { x: 390, y: 350 },
      data: { detail: 'Manual risk assessment' },
      ports: [
        { id: 'request', name: 'Request', direction: 'input', kind: 'data' },
        { id: 'result', name: 'Review', direction: 'output', kind: 'control', side: 'top' },
      ],
    },
    {
      id: 'merge',
      type: 'merge',
      name: 'Merge decision',
      description: 'Combine both branch results.',
      position: { x: 750, y: 220 },
      data: { detail: 'Combined decision' },
      ports: [
        {
          id: 'automatic',
          name: 'Assessment',
          direction: 'input',
          kind: 'control',
          side: 'top',
        },
        { id: 'review', name: 'Review', direction: 'input', kind: 'control', side: 'bottom' },
        { id: 'decision', name: 'Decision', direction: 'output', kind: 'data' },
      ],
    },
    {
      id: 'response',
      type: 'response',
      name: 'Publish response',
      description: 'Return the merged decision.',
      position: { x: 1090, y: 220 },
      data: { detail: 'Final response' },
      ports: [{ id: 'decision', name: 'Decision', direction: 'input', kind: 'data' }],
    },
  ],
  connections: [
    {
      id: 'request-to-fast-track',
      source: { nodeId: 'request', portId: 'request' },
      target: { nodeId: 'fast-track', portId: 'request' },
    },
    {
      id: 'request-to-risk-review',
      source: { nodeId: 'request', portId: 'request' },
      target: { nodeId: 'risk-review', portId: 'request' },
    },
    {
      id: 'fast-track-to-merge',
      source: { nodeId: 'fast-track', portId: 'result' },
      target: { nodeId: 'merge', portId: 'automatic' },
    },
    {
      id: 'risk-review-to-merge',
      source: { nodeId: 'risk-review', portId: 'result' },
      target: { nodeId: 'merge', portId: 'review' },
    },
    {
      id: 'merge-to-response',
      source: { nodeId: 'merge', portId: 'decision' },
      target: { nodeId: 'response', portId: 'decision' },
    },
  ],
} satisfies TngFlowDefinition);

const linearWorkflowDefinition: TngFlowDefinition = Object.freeze({
  id: 'docs-json-workflow',
  name: 'Agent response workflow',
  nodes: flowEditorDemoNodes,
  connections: flowEditorDemoConnections,
});

@Component({
  selector: 'app-flow-editor-examples-page',
  imports: [
    TngButtonComponent,
    TngCardComponent,
    TngCardContentComponent,
    TngCardDescriptionComponent,
    TngCardHeaderComponent,
    TngCardTitleComponent,
    TngFlowEditorComponent,
    TngFlowNodeTemplateDirective,
    DocumentReviewDemoComponent,
    ProfessionalFlowBuilderDemoComponent,
    TimedExecutionDemoComponent,
    ConnectionRoutingDemoComponent,
    DocsExampleTabsSectionComponent,
    DocsExampleVariantDirective,
  ],
  templateUrl: './flow-editor-examples-page.component.html',
  styleUrl: './flow-editor-examples-page.component.css',
})
export class FlowEditorExamplesPageComponent implements OnDestroy {
  private readonly documentRef = inject(DOCUMENT);

  public readonly codeBlockTheme = signal<'github-dark' | 'github-light'>(
    resolveDocsCodeBlockTheme(this.documentRef),
  );
  private readonly colorSchemeObserver = observeDocsCodeThemeChanges(
    this.documentRef,
    this.codeBlockTheme,
  );

  protected readonly customPlainCssNodes = signal(flowEditorDemoNodes);
  protected readonly customTailwindNodes = signal(flowEditorDemoNodes);
  protected readonly branchWorkflowDefinition = branchWorkflowDefinition;
  protected readonly controlledPlainCssDefinition = signal(linearWorkflowDefinition);
  protected readonly controlledTailwindDefinition = signal(linearWorkflowDefinition);
  protected readonly controlledPlainCssChange = signal<TngFlowNodePositionChange | null>(null);
  protected readonly controlledTailwindChange = signal<TngFlowNodePositionChange | null>(null);
  protected readonly gridPlainCssVisible = signal(true);
  protected readonly gridTailwindVisible = signal(true);
  protected readonly connectionPlainCss = new ConnectionEditingState();
  protected readonly connectionTailwind = new ConnectionEditingState();
  protected readonly selectionModesPlainCss = new SelectionModesState();
  protected readonly selectionModesTailwind = new SelectionModesState();
  protected readonly editorModes: readonly TngFlowEditorMode[] = ['edit', 'inspect', 'readonly'];
  protected readonly monitorNodes = flowEditorDemoNodes;
  protected readonly connections = flowEditorDemoConnections;
  protected readonly customViews: TngFlowNodeViews = Object.freeze({
    model: { status: 'running', progress: 52, message: 'Calling retrieval tools' },
    prompt: { status: 'completed' },
    response: { status: 'waiting' },
  });
  protected readonly monitorViews: TngFlowNodeViews = Object.freeze({
    model: { status: 'completed', progress: 100, message: 'Finished in 1.8 seconds' },
    prompt: { status: 'completed', progress: 100 },
    response: { status: 'completed', progress: 100, message: 'Delivered to the user' },
  });
  protected readonly customNodePlainCssCodeTabs = customNodePlainCssCodeTabs;
  protected readonly customNodeTailwindCodeTabs = customNodeTailwindCodeTabs;
  protected readonly jsonDefinitionPlainCssCodeTabs = jsonDefinitionPlainCssCodeTabs;
  protected readonly jsonDefinitionTailwindCodeTabs = jsonDefinitionTailwindCodeTabs;
  protected readonly controlledPositionPlainCssCodeTabs = controlledPositionPlainCssCodeTabs;
  protected readonly controlledPositionTailwindCodeTabs = controlledPositionTailwindCodeTabs;
  protected readonly gridBackgroundPlainCssCodeTabs = gridBackgroundPlainCssCodeTabs;
  protected readonly gridBackgroundTailwindCodeTabs = gridBackgroundTailwindCodeTabs;
  protected readonly connectionEditingPlainCssCodeTabs = connectionEditingPlainCssCodeTabs;
  protected readonly connectionEditingTailwindCodeTabs = connectionEditingTailwindCodeTabs;
  protected readonly selectionModesPlainCssCodeTabs = selectionModesPlainCssCodeTabs;
  protected readonly selectionModesTailwindCodeTabs = selectionModesTailwindCodeTabs;
  protected readonly monitorPlainCssCodeTabs = monitorPlainCssCodeTabs;
  protected readonly monitorTailwindCodeTabs = monitorTailwindCodeTabs;
  protected readonly documentReviewDemoCodeTabs = documentReviewDemoCodeTabs;
  protected readonly professionalFlowBuilderDemoCodeTabs = professionalFlowBuilderDemoCodeTabs;
  protected readonly timedExecutionDemoCodeTabs = timedExecutionDemoCodeTabs;
  protected readonly connectionRoutingDemoCodeTabs = connectionRoutingDemoCodeTabs;
  protected readonly validateConnection = (
    candidate: TngFlowConnectionCandidate,
  ): TngFlowConnectionValidation => {
    const sourceType = candidate.sourcePort.dataType;
    const targetType = candidate.targetPort.dataType;
    if (sourceType !== undefined && targetType !== undefined && sourceType !== targetType) {
      return {
        valid: false,
        code: 'incompatible-data-type',
        reason: `Cannot connect ${sourceType} data to ${targetType} data.`,
      };
    }
    return { valid: true };
  };

  protected onNodesMoved(event: TngFlowNodesMovedEvent, variant: FlowExampleVariant): void {
    const nodes = variant === 'plain-css' ? this.customPlainCssNodes : this.customTailwindNodes;
    nodes.update((currentNodes) => applyFlowNodeMoves(currentNodes, event));
  }

  protected onNodePositionChange(
    event: TngFlowNodePositionChange,
    variant: FlowExampleVariant,
  ): void {
    const definition =
      variant === 'plain-css'
        ? this.controlledPlainCssDefinition
        : this.controlledTailwindDefinition;
    const lastChange =
      variant === 'plain-css' ? this.controlledPlainCssChange : this.controlledTailwindChange;

    lastChange.set(event);
    definition.update((current) => ({
      ...current,
      nodes: current.nodes.map((node) =>
        node.id === event.nodeId ? { ...node, position: event.position } : node,
      ),
    }));
  }

  protected resetControlledPositions(variant: FlowExampleVariant): void {
    const definition =
      variant === 'plain-css'
        ? this.controlledPlainCssDefinition
        : this.controlledTailwindDefinition;
    const lastChange =
      variant === 'plain-css' ? this.controlledPlainCssChange : this.controlledTailwindChange;

    definition.set(linearWorkflowDefinition);
    lastChange.set(null);
  }

  protected createConnection(
    request: TngFlowConnectionCreateRequest,
    state: ConnectionEditingState,
  ): void {
    const connectionId = `example-connection-${state.nextConnectionId}`;
    state.nextConnectionId += 1;
    state.definition.update((definition) => ({
      ...definition,
      connections: [...definition.connections, { id: connectionId, ...request, type: 'bezier' }],
    }));
    state.rejection.set(null);
    state.message.set(`Created ${connectionId}; the consumer added it to the definition.`);
  }

  protected updateConnectionNodePosition(
    event: TngFlowNodePositionChange,
    state: ConnectionEditingState,
  ): void {
    state.definition.update((definition) => ({
      ...definition,
      nodes: definition.nodes.map((node) =>
        node.id === event.nodeId ? { ...node, position: event.position } : node,
      ),
    }));
    state.rejection.set(null);
    state.message.set(`Moved ${event.nodeId}; the consumer stored its position.`);
  }

  protected reconnectConnection(
    request: TngFlowConnectionReconnectRequest,
    state: ConnectionEditingState,
  ): void {
    state.definition.update((definition) => ({
      ...definition,
      connections: definition.connections.map((connection) =>
        connection.id === request.connectionId
          ? { ...connection, source: request.source, target: request.target }
          : connection,
      ),
    }));
    state.rejection.set(null);
    state.message.set(`Reconnected the ${request.changedEndpoint} of ${request.connectionId}.`);
  }

  protected deleteEditingConnections(
    request: TngFlowConnectionsDeleteRequest,
    state: ConnectionEditingState,
  ): void {
    const deletedIds = new Set(request.connectionIds);
    state.definition.update((definition) => ({
      ...definition,
      connections: definition.connections.filter((connection) => !deletedIds.has(connection.id)),
    }));
    state.selection.set(emptySelection());
    state.rejection.set(null);
    state.message.set(`Deleted ${request.connectionIds.join(', ')} from consumer state.`);
  }

  protected deleteEditingNodes(
    request: TngFlowNodesDeleteRequest,
    state: ConnectionEditingState,
  ): void {
    const deletedIds = new Set(request.nodeIds);
    state.definition.update((definition) => ({
      ...definition,
      nodes: definition.nodes.filter((node) => !deletedIds.has(node.id)),
      connections: definition.connections.filter(
        (connection) =>
          !deletedIds.has(connection.source.nodeId) && !deletedIds.has(connection.target.nodeId),
      ),
    }));
    state.selection.set(emptySelection());
    state.rejection.set(null);
    state.message.set(`Deleted ${request.nodeIds.join(', ')} and its attached connections.`);
  }

  protected rejectConnection(
    event: TngFlowConnectionRejectedEvent,
    state: ConnectionEditingState,
  ): void {
    state.rejection.set(event.reason);
    state.message.set('The workflow definition was not changed.');
  }

  protected updateConnectionSelection(
    selection: TngFlowSelection,
    state: ConnectionEditingState,
  ): void {
    state.selection.set(selection);
  }

  protected resetConnectionEditing(state: ConnectionEditingState): void {
    state.definition.set(connectionEditingDefinition);
    state.selection.set(emptySelection());
    state.rejection.set(null);
    state.nextConnectionId = 1;
    state.message.set('Create a connection or reconnect the existing edge.');
  }

  protected updateSelection(selection: TngFlowSelection, state: SelectionModesState): void {
    state.selection.set(selection);
    state.message.set(`Selected ${this.selectionLabel(selection)}.`);
  }

  protected updateSelectionNodePosition(
    event: TngFlowNodePositionChange,
    state: SelectionModesState,
  ): void {
    state.definition.update((definition) => ({
      ...definition,
      nodes: definition.nodes.map((node) =>
        node.id === event.nodeId ? { ...node, position: event.position } : node,
      ),
    }));
    state.message.set(`Moved ${event.nodeId}; external state accepted the new position.`);
  }

  protected deleteSelectedConnections(
    request: TngFlowConnectionsDeleteRequest,
    state: SelectionModesState,
  ): void {
    const deletedIds = new Set(request.connectionIds);
    state.definition.update((definition) => ({
      ...definition,
      connections: definition.connections.filter((connection) => !deletedIds.has(connection.id)),
    }));
    state.selection.set(emptySelection());
    state.message.set(`Deleted ${request.connectionIds.join(', ')} with ${request.source}.`);
  }

  protected deleteSelectedNodes(
    request: TngFlowNodesDeleteRequest,
    state: SelectionModesState,
  ): void {
    const deletedIds = new Set(request.nodeIds);
    state.definition.update((definition) => ({
      ...definition,
      nodes: definition.nodes.filter((node) => !deletedIds.has(node.id)),
      connections: definition.connections.filter(
        (connection) =>
          !deletedIds.has(connection.source.nodeId) && !deletedIds.has(connection.target.nodeId),
      ),
    }));
    state.selection.set(emptySelection());
    state.message.set(`Deleted ${request.nodeIds.join(', ')} and its attached connections.`);
  }

  protected setSelectionMode(mode: TngFlowEditorMode, state: SelectionModesState): void {
    state.mode.set(mode);
    if (mode === 'readonly') {
      state.selection.set(emptySelection());
    }
    state.message.set(
      mode === 'edit'
        ? 'Edit mode enables selection, movement, connections, and deletion.'
        : mode === 'inspect'
          ? 'Inspect mode keeps selection and pan/zoom, but blocks graph edits.'
          : 'Readonly mode allows only pan and zoom; selection is cleared.',
    );
  }

  protected resetSelectionModes(state: SelectionModesState): void {
    state.definition.set(selectionModesDefinition);
    state.selection.set(emptySelection());
    state.mode.set('edit');
    state.message.set('Select a node or connection.');
  }

  protected selectionLabel(selection: TngFlowSelection): string {
    const items = [...selection.nodeIds, ...selection.connectionIds];
    return items.length === 0 ? 'nothing' : items.join(', ');
  }

  protected nodeDetail(data: unknown): string {
    if (typeof data !== 'object' || data === null || !('detail' in data)) {
      return '';
    }
    return typeof data.detail === 'string' ? data.detail : '';
  }

  public ngOnDestroy(): void {
    this.colorSchemeObserver?.disconnect();
  }
}
