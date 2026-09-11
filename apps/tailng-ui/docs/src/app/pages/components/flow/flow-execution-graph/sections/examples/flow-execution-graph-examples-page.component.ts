import { DOCUMENT } from '@angular/common';
import { Component, inject, signal, type OnDestroy, type WritableSignal } from '@angular/core';
import { TngButtonComponent } from '@tailng-ui/components';
import type {
  TngFlowConnectionCreateRequest,
  TngFlowConnectionReconnectRequest,
  TngFlowConnectionsDeleteRequest,
  TngFlowDefinition,
  TngFlowNodesMovedEvent,
  TngFlowSelection,
  TngFlowViewport,
} from '@tailng-ui/flow';
import {
  TngFlowExecutionGraphComponent,
  type TngFlowExecutionActivatedEvent,
  type TngFlowNodeExecution,
} from '@tailng-ui/flow/execution';
import {
  plainFlowExecutionGraphCodeTabs,
  tailwindFlowExecutionGraphCodeTabs,
} from './flow-execution-graph-example-code.data';
import type { DocsExampleCodeTab } from '../../../../../../shared/example-panel/docs-example-panel.component';
import {
  DocsExampleTabsSectionComponent,
  DocsExampleVariantDirective,
} from '../../../../../../shared/example-tabs-section/docs-example-tabs-section.component';
import {
  observeDocsCodeThemeChanges,
  resolveDocsCodeBlockTheme,
} from '../../../../../../shared/util';
import {
  FLOW_EXECUTION_VIEWER_DEFINITION,
  findFlowExecutionViewerScenario,
  type FlowExecutionViewerScenario,
  type FlowExecutionViewerScenarioId,
} from '../../../flow-execution-viewer/sections/examples/flow-execution-viewer-example.data';
import {
  applyFlowExecutionGraphConnectionCreate,
  applyFlowExecutionGraphConnectionReconnect,
  applyFlowExecutionGraphConnectionsDelete,
  applyFlowExecutionGraphNodeMoves,
  type FlowExecutionGraphControlledUpdate,
} from '../../flow-execution-graph-editing';

export type FlowExecutionGraphExampleId = FlowExecutionViewerScenarioId | 'dark-mode';

type FlowExecutionGraphExampleState = Readonly<{
  definition: WritableSignal<TngFlowDefinition<unknown>>;
  inspectedNodeId: WritableSignal<string | null>;
  lastActivation: WritableSignal<string>;
  selectedExecutionId: WritableSignal<string | null>;
  selection: WritableSignal<TngFlowSelection>;
  viewport: WritableSignal<TngFlowViewport>;
}>;

type FlowExecutionGraphExample = Readonly<{
  ariaLabel: string;
  forcedTheme: 'dark' | null;
  id: FlowExecutionGraphExampleId;
  narrow: boolean;
  plain: FlowExecutionGraphExampleState;
  plainCodeTabs: readonly DocsExampleCodeTab[];
  plainFlowId: string;
  scenario: FlowExecutionViewerScenario;
  story: string;
  tailwind: FlowExecutionGraphExampleState;
  tailwindCodeTabs: readonly DocsExampleCodeTab[];
  tailwindFlowId: string;
  title: string;
}>;

const FLOW_EXECUTION_GRAPH_EXAMPLE_ORDER: readonly FlowExecutionGraphExampleId[] = [
  'queued-workflow',
  'running-node',
  'retrying-node',
  'waiting-human-input',
  'successful-workflow',
  'failed-node',
  'skipped-branch',
  'parallel-execution',
  'loop-activations',
  'redacted-payloads',
  'large-json-payload',
  'dark-mode',
  'narrow-surface',
];

function createExampleState(scenario: FlowExecutionViewerScenario): FlowExecutionGraphExampleState {
  return Object.freeze({
    definition: signal(cloneDefinition(FLOW_EXECUTION_VIEWER_DEFINITION)),
    inspectedNodeId: signal(scenario.inspectedNodeId),
    lastActivation: signal('No graph activation yet.'),
    selectedExecutionId: signal(scenario.selectedExecutionId),
    selection: signal(cloneSelection(scenario.selection)),
    viewport: signal({ ...scenario.viewport, position: { ...scenario.viewport.position } }),
  });
}

function createExample(id: FlowExecutionGraphExampleId): FlowExecutionGraphExample {
  const scenario = findFlowExecutionViewerScenario(id === 'dark-mode' ? 'running-node' : id);
  const title = id === 'dark-mode' ? 'Dark mode' : scenario.title;
  const story =
    id === 'dark-mode'
      ? 'The standalone graph is scoped inside dark tokens without depending on the global docs theme.'
      : scenario.story;
  const narrow = id === 'narrow-surface';
  const forcedTheme: 'dark' | null = id === 'dark-mode' ? 'dark' : null;
  const codeScenario = { ...scenario, id, title, story, narrow, forcedTheme };

  return Object.freeze({
    ariaLabel: `${title} execution graph`,
    forcedTheme,
    id,
    narrow,
    plain: createExampleState(scenario),
    plainCodeTabs: plainFlowExecutionGraphCodeTabs(codeScenario),
    plainFlowId: `${id}-plain-execution-graph`,
    scenario,
    story,
    tailwind: createExampleState(scenario),
    tailwindCodeTabs: tailwindFlowExecutionGraphCodeTabs(codeScenario),
    tailwindFlowId: `${id}-tailwind-execution-graph`,
    title,
  });
}

function cloneSelection(selection: TngFlowSelection): TngFlowSelection {
  return {
    connectionIds: new Set(selection.connectionIds),
    nodeIds: new Set(selection.nodeIds),
  };
}

function cloneDefinition(definition: TngFlowDefinition<unknown>): TngFlowDefinition<unknown> {
  return {
    ...definition,
    nodes: definition.nodes.map((node) => ({
      ...node,
      position: { ...node.position },
      ports: node.ports?.map((port) => ({ ...port })),
      inputs: node.inputs?.map((port) => ({ ...port })),
      outputs: node.outputs?.map((port) => ({ ...port })),
    })),
    connections: definition.connections.map((connection) => ({
      ...connection,
      source: { ...connection.source },
      target: { ...connection.target },
    })),
  };
}

@Component({
  selector: 'app-flow-execution-graph-examples-page',
  imports: [
    DocsExampleTabsSectionComponent,
    DocsExampleVariantDirective,
    TngButtonComponent,
    TngFlowExecutionGraphComponent,
  ],
  templateUrl: './flow-execution-graph-examples-page.component.html',
  styleUrl: './flow-execution-graph-examples-page.component.css',
})
export class FlowExecutionGraphExamplesPageComponent implements OnDestroy {
  private readonly documentRef = inject(DOCUMENT);

  public readonly examples = FLOW_EXECUTION_GRAPH_EXAMPLE_ORDER.map(createExample);
  public readonly codeBlockTheme = signal<'github-dark' | 'github-light'>(
    resolveDocsCodeBlockTheme(this.documentRef),
  );
  private readonly colorSchemeObserver = observeDocsCodeThemeChanges(
    this.documentRef,
    this.codeBlockTheme,
  );

  public ngOnDestroy(): void {
    this.colorSchemeObserver?.disconnect();
  }

  public resetExample(
    state: FlowExecutionGraphExampleState,
    scenario: FlowExecutionViewerScenario,
  ): void {
    state.definition.set(cloneDefinition(FLOW_EXECUTION_VIEWER_DEFINITION));
    state.inspectedNodeId.set(scenario.inspectedNodeId);
    state.selectedExecutionId.set(scenario.selectedExecutionId);
    state.selection.set(cloneSelection(scenario.selection));
    state.viewport.set({ ...scenario.viewport, position: { ...scenario.viewport.position } });
    state.lastActivation.set('No graph activation yet.');
  }

  public selectedNodeName(state: FlowExecutionGraphExampleState): string {
    const inspectedNodeId = state.inspectedNodeId();
    return (
      state.definition().nodes.find((node) => node.id === inspectedNodeId)?.name ??
      inspectedNodeId ??
      'None'
    );
  }

  public progressLabel(scenario: FlowExecutionViewerScenario): string {
    const progress = scenario.snapshot.progress;
    if (progress === null || progress === undefined) {
      return 'Progress pending';
    }
    return `${Math.round(progress * 100)}% complete`;
  }

  public executionCountLabel(
    state: FlowExecutionGraphExampleState,
    scenario: FlowExecutionViewerScenario,
  ): string {
    const count = this.nodeExecutions(state, scenario).length;
    if (count === 0) {
      return 'No activations';
    }
    if (count === 1) {
      return '1 activation';
    }
    return `${count} activations`;
  }

  public attemptLabel(
    state: FlowExecutionGraphExampleState,
    scenario: FlowExecutionViewerScenario,
  ): string {
    const execution = this.selectedExecution(state, scenario);
    if (execution === null) {
      return 'No execution selected';
    }
    if (execution.maxAttempts === undefined) {
      return `Attempt ${execution.attempt}`;
    }
    return `Attempt ${execution.attempt} of ${execution.maxAttempts}`;
  }

  public payloadStateLabel(
    state: FlowExecutionGraphExampleState,
    scenario: FlowExecutionViewerScenario,
  ): string {
    const execution = this.selectedExecution(state, scenario);
    if (execution === null) {
      return 'Payload unavailable';
    }
    if (execution.input?.state === 'redacted') {
      return 'Input payload redacted';
    }
    if (execution.error !== undefined) {
      return `Error payload ${execution.error.state}`;
    }
    if (execution.output !== undefined) {
      return `Output payload ${execution.output.state}`;
    }
    if (execution.input !== undefined) {
      return `Input payload ${execution.input.state}`;
    }
    return 'Payload unavailable';
  }

  public selectedExecutionMessage(
    state: FlowExecutionGraphExampleState,
    scenario: FlowExecutionViewerScenario,
  ): string {
    const execution = this.selectedExecution(state, scenario);
    return execution?.statusMessage ?? scenario.snapshot.statusMessage ?? 'No execution selected.';
  }

  public onExecutionActivated(
    state: FlowExecutionGraphExampleState,
    event: TngFlowExecutionActivatedEvent<unknown>,
  ): void {
    const nodeName = event.node?.name ?? 'Run';
    const phase = event.execution?.phase ?? 'none';
    state.lastActivation.set(`${nodeName}: ${phase} via ${event.source}`);
  }

  public onNodesMoved(state: FlowExecutionGraphExampleState, event: TngFlowNodesMovedEvent): void {
    state.definition.update((definition) => applyFlowExecutionGraphNodeMoves(definition, event));
  }

  public onConnectionCreateRequested(
    state: FlowExecutionGraphExampleState,
    request: TngFlowConnectionCreateRequest,
  ): void {
    const update = applyFlowExecutionGraphConnectionCreate(state.definition(), request);
    this.applyControlledUpdate(state, update);
    state.lastActivation.set(
      `Connected ${this.nodeName(state, request.source.nodeId)} to ${this.nodeName(state, request.target.nodeId)}.`,
    );
  }

  public onConnectionReconnectRequested(
    state: FlowExecutionGraphExampleState,
    request: TngFlowConnectionReconnectRequest,
  ): void {
    const update = applyFlowExecutionGraphConnectionReconnect(
      state.definition(),
      state.selection(),
      request,
    );
    this.applyControlledUpdate(state, update);
    state.lastActivation.set(`Updated the ${request.changedEndpoint} connection endpoint.`);
  }

  public onConnectionsDeleteRequested(
    state: FlowExecutionGraphExampleState,
    request: TngFlowConnectionsDeleteRequest,
  ): void {
    this.applyControlledUpdate(
      state,
      applyFlowExecutionGraphConnectionsDelete(state.definition(), state.selection(), request),
    );
    state.lastActivation.set(
      `Deleted ${request.connectionIds.length} connection${request.connectionIds.length === 1 ? '' : 's'}.`,
    );
  }

  public hasSelectedConnection(state: FlowExecutionGraphExampleState): boolean {
    return state.selection().connectionIds.size > 0;
  }

  public deleteSelectedConnections(state: FlowExecutionGraphExampleState): void {
    this.onConnectionsDeleteRequested(state, {
      connectionIds: [...state.selection().connectionIds],
      source: 'api',
    });
  }

  private selectedExecution(
    state: FlowExecutionGraphExampleState,
    scenario: FlowExecutionViewerScenario,
  ): TngFlowNodeExecution<unknown> | null {
    const selectedExecutionId = state.selectedExecutionId();
    const nodeExecutions = this.nodeExecutions(state, scenario);
    return (
      nodeExecutions.find((execution) => execution.id === selectedExecutionId) ??
      nodeExecutions[0] ??
      null
    );
  }

  private nodeExecutions(
    state: FlowExecutionGraphExampleState,
    scenario: FlowExecutionViewerScenario,
  ): readonly TngFlowNodeExecution<unknown>[] {
    const inspectedNodeId = state.inspectedNodeId();
    return (scenario.snapshot.nodeExecutions ?? []).filter(
      (execution) => execution.nodeId === inspectedNodeId,
    );
  }

  private applyControlledUpdate(
    state: FlowExecutionGraphExampleState,
    update: FlowExecutionGraphControlledUpdate,
  ): void {
    state.definition.set(update.definition);
    state.selection.set(update.selection);
  }

  private nodeName(state: FlowExecutionGraphExampleState, nodeId: string): string {
    return state.definition().nodes.find((node) => node.id === nodeId)?.name ?? nodeId;
  }
}
