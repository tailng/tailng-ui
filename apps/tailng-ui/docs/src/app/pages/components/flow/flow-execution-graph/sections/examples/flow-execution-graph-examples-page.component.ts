import { DOCUMENT } from '@angular/common';
import {
  Component,
  computed,
  inject,
  signal,
  type OnDestroy,
  type Signal,
  type WritableSignal,
} from '@angular/core';
import { TngButtonComponent } from '@tailng-ui/components';
import type {
  TngFlowConnectionCreateRequest,
  TngFlowConnectionReconnectRequest,
  TngFlowConnectionRoutingChangeRequest,
  TngFlowConnectionsDeleteRequest,
  TngFlowDefinition,
  TngFlowEditorCommandRequest,
  TngFlowHistoryState,
  TngFlowHistoryStatus,
  TngFlowHistoryUpdate,
  TngFlowNodesDeleteRequest,
  TngFlowNodesMovedEvent,
  TngFlowSelection,
  TngFlowViewport,
} from '@tailng-ui/flow';
import {
  commitTngFlowHistory,
  createTngFlowHistory,
  redoTngFlowHistory,
  tngFlowHistoryStatus,
  undoTngFlowHistory,
} from '@tailng-ui/flow';
import {
  TngFlowExecutionGraphComponent,
  type TngFlowConnectionExecution,
  type TngFlowExecutionActivatedEvent,
  type TngFlowExecutionPhase,
  type TngFlowNodeExecution,
  type TngFlowRunExecutionSnapshot,
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
  FLOW_EXECUTION_DEFINITION,
  findFlowExecutionScenario,
  type FlowExecutionScenario,
  type FlowExecutionScenarioId,
} from '../../../shared/flow-execution-scenarios.data';
import {
  applyFlowExecutionGraphConnectionCreate,
  applyFlowExecutionGraphConnectionReconnect,
  applyFlowExecutionGraphConnectionRoutingChange,
  applyFlowExecutionGraphConnectionsDelete,
  applyFlowExecutionGraphNodesDelete,
  applyFlowExecutionGraphNodeMoves,
  type FlowExecutionGraphControlledUpdate,
} from '../../flow-execution-graph-editing';

export type FlowExecutionGraphExampleId =
  | FlowExecutionScenarioId
  | 'dark-mode'
  | 'delayed-execution';

type FlowExecutionGraphTimelineStep = Readonly<{
  inspectedNodeId: string;
  label: string;
  selectedExecutionId: string;
  snapshot: TngFlowRunExecutionSnapshot<unknown>;
}>;

type FlowExecutionGraphScenario = Omit<FlowExecutionScenario, 'id'> &
  Readonly<{
    definition: TngFlowDefinition<unknown>;
    id: FlowExecutionGraphExampleId;
    timeline: readonly FlowExecutionGraphTimelineStep[] | null;
  }>;

type FlowExecutionGraphExampleState = Readonly<{
  definition: WritableSignal<TngFlowDefinition<unknown>>;
  history: WritableSignal<TngFlowHistoryState<unknown>>;
  historyStatus: Signal<TngFlowHistoryStatus>;
  inspectedNodeId: WritableSignal<string | null>;
  lastActivation: WritableSignal<string>;
  playing: WritableSignal<boolean>;
  selectedExecutionId: WritableSignal<string | null>;
  selection: WritableSignal<TngFlowSelection>;
  snapshot: WritableSignal<TngFlowRunExecutionSnapshot<unknown>>;
  timeline: readonly FlowExecutionGraphTimelineStep[] | null;
  timelineIndex: WritableSignal<number>;
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
  scenario: FlowExecutionGraphScenario;
  story: string;
  tailwind: FlowExecutionGraphExampleState;
  tailwindCodeTabs: readonly DocsExampleCodeTab[];
  tailwindFlowId: string;
  title: string;
}>;

const FLOW_EXECUTION_GRAPH_EXAMPLE_ORDER: readonly FlowExecutionGraphExampleId[] = [
  'queued-workflow',
  'running-node',
  'delayed-execution',
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

const DELAYED_EXECUTION_NODE_ORDER = ['start', 'delay', 'prepare', 'send', 'end'] as const;

const DELAYED_EXECUTION_DEFINITION = Object.freeze({
  id: 'delayed-execution-workflow',
  name: 'Delayed execution workflow',
  nodes: [
    {
      id: 'start',
      type: 'trigger',
      name: 'Start',
      description: 'Receives the scheduled run signal.',
      position: { x: 0, y: 120 },
      ports: [{ id: 'next', name: 'Next', direction: 'output', kind: 'data', multiple: true }],
    },
    {
      id: 'delay',
      type: 'delay',
      name: 'Delay window',
      description: 'Holds execution until the configured delay expires.',
      position: { x: 360, y: 120 },
      ports: [
        { id: 'input', name: 'Input', direction: 'input', kind: 'data' },
        { id: 'ready', name: 'Ready', direction: 'output', kind: 'data', multiple: true },
      ],
    },
    {
      id: 'prepare',
      type: 'task',
      name: 'Prepare message',
      description: 'Builds the delayed follow-up payload.',
      position: { x: 720, y: 120 },
      ports: [
        { id: 'ready', name: 'Ready', direction: 'input', kind: 'data' },
        { id: 'message', name: 'Message', direction: 'output', kind: 'data', multiple: true },
      ],
    },
    {
      id: 'send',
      type: 'task',
      name: 'Send update',
      description: 'Delivers the prepared update to the customer.',
      position: { x: 720, y: 430 },
      ports: [
        { id: 'message', name: 'Message', direction: 'input', kind: 'data' },
        { id: 'sent', name: 'Sent', direction: 'output', kind: 'data', multiple: true },
      ],
    },
    {
      id: 'end',
      type: 'end',
      name: 'End',
      description: 'Marks the delayed execution as complete.',
      position: { x: 1080, y: 430 },
      ports: [{ id: 'sent', name: 'Sent', direction: 'input', kind: 'data' }],
    },
  ],
  connections: [
    delayedConnection('start-delay', 'start', 'next', 'delay', 'input'),
    delayedConnection('delay-prepare', 'delay', 'ready', 'prepare', 'ready'),
    delayedConnection('prepare-send', 'prepare', 'message', 'send', 'message'),
    delayedConnection('send-end', 'send', 'sent', 'end', 'sent'),
  ],
} satisfies TngFlowDefinition<unknown>);

const DELAYED_EXECUTION_TIMELINE = Object.freeze([
  delayedStep(0, 'start', 'active', 'Start event accepted.', [], 0.08),
  delayedStep(
    1,
    'delay',
    'waiting',
    'Waiting for the configured delay to expire.',
    [{ connectionId: 'start-delay', phase: 'active' }],
    0.25,
  ),
  delayedStep(
    2,
    'prepare',
    'active',
    'Delay expired; preparing the message.',
    [
      { connectionId: 'start-delay', phase: 'succeeded' },
      { connectionId: 'delay-prepare', phase: 'active' },
    ],
    0.48,
  ),
  delayedStep(
    3,
    'send',
    'active',
    'Prepared message is being delivered.',
    [
      { connectionId: 'start-delay', phase: 'succeeded' },
      { connectionId: 'delay-prepare', phase: 'succeeded' },
      { connectionId: 'prepare-send', phase: 'active' },
    ],
    0.72,
  ),
  delayedStep(
    4,
    'end',
    'active',
    'Final handoff is reaching the end node.',
    [
      { connectionId: 'start-delay', phase: 'succeeded' },
      { connectionId: 'delay-prepare', phase: 'succeeded' },
      { connectionId: 'prepare-send', phase: 'succeeded' },
      { connectionId: 'send-end', phase: 'active' },
    ],
    0.9,
  ),
  delayedStep(
    5,
    'end',
    'succeeded',
    'Delayed workflow completed.',
    [
      { connectionId: 'start-delay', phase: 'succeeded' },
      { connectionId: 'delay-prepare', phase: 'succeeded' },
      { connectionId: 'prepare-send', phase: 'succeeded' },
      { connectionId: 'send-end', phase: 'succeeded' },
    ],
    1,
  ),
] satisfies readonly FlowExecutionGraphTimelineStep[]);

const DELAYED_EXECUTION_SCENARIO = Object.freeze({
  id: 'delayed-execution',
  title: 'Delayed execution workflow',
  story:
    'A timed run advances from Start to End, updating node state and animating the active connection as each delayed step begins.',
  definition: DELAYED_EXECUTION_DEFINITION,
  inspectedNodeId: DELAYED_EXECUTION_TIMELINE[0].inspectedNodeId,
  selectedExecutionId: DELAYED_EXECUTION_TIMELINE[0].selectedExecutionId,
  selection: selectNode(DELAYED_EXECUTION_TIMELINE[0].inspectedNodeId),
  snapshot: DELAYED_EXECUTION_TIMELINE[0].snapshot,
  timeline: DELAYED_EXECUTION_TIMELINE,
  viewport: { position: { x: -50, y: -50 }, scale: 0.68 },
} satisfies FlowExecutionGraphScenario);

function createExampleState(scenario: FlowExecutionGraphScenario): FlowExecutionGraphExampleState {
  const definition = signal(cloneDefinition(scenario.definition));
  const selection = signal(cloneSelection(scenario.selection));
  const history = signal(createTngFlowHistory(definition(), { selection: selection() }));

  return Object.freeze({
    definition,
    history,
    historyStatus: computed(() => tngFlowHistoryStatus(history())),
    inspectedNodeId: signal(scenario.inspectedNodeId),
    lastActivation: signal('No graph activation yet.'),
    playing: signal(false),
    selectedExecutionId: signal(scenario.selectedExecutionId),
    selection,
    snapshot: signal(scenario.snapshot),
    timeline: scenario.timeline,
    timelineIndex: signal(0),
    viewport: signal({ ...scenario.viewport, position: { ...scenario.viewport.position } }),
  });
}

function createExample(id: FlowExecutionGraphExampleId): FlowExecutionGraphExample {
  const scenario = findFlowExecutionGraphScenario(id);
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

function selectNode(nodeId: string): TngFlowSelection {
  return { connectionIds: new Set<string>(), nodeIds: new Set([nodeId]) };
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

function findFlowExecutionGraphScenario(id: FlowExecutionGraphExampleId): FlowExecutionGraphScenario {
  if (id === 'delayed-execution') {
    return DELAYED_EXECUTION_SCENARIO;
  }
  const scenario = findFlowExecutionScenario(id === 'dark-mode' ? 'running-node' : id);
  return Object.freeze({
    ...scenario,
    definition: FLOW_EXECUTION_DEFINITION,
    id,
    timeline: null,
  });
}

function delayedConnection(
  id: string,
  sourceNodeId: string,
  sourcePortId: string,
  targetNodeId: string,
  targetPortId: string,
): TngFlowDefinition['connections'][number] {
  return {
    id,
    source: { nodeId: sourceNodeId, portId: sourcePortId },
    target: { nodeId: targetNodeId, portId: targetPortId },
    type: 'bezier',
  };
}

function delayedStep(
  index: number,
  nodeId: string,
  nodePhase: TngFlowExecutionPhase,
  message: string,
  connections: readonly Readonly<{
    connectionId: string;
    phase: TngFlowExecutionPhase;
  }>[],
  progress: number,
): FlowExecutionGraphTimelineStep {
  const currentNodeIndex = DELAYED_EXECUTION_NODE_ORDER.indexOf(
    nodeId as (typeof DELAYED_EXECUTION_NODE_ORDER)[number],
  );
  const completedNodes = DELAYED_EXECUTION_NODE_ORDER.slice(0, currentNodeIndex);
  const nodeExecutions = [
    ...completedNodes.map((completedNodeId, completedIndex) =>
      delayedNodeExecution(
        index,
        completedNodeId,
        'succeeded',
        'Completed successfully.',
        completedIndex,
      ),
    ),
    delayedNodeExecution(index, nodeId, nodePhase, message, completedNodes.length),
  ];
  const snapshot = Object.freeze({
    id: `delayed-execution-step-${index}`,
    definitionId: DELAYED_EXECUTION_DEFINITION.id,
    definitionRevision: 'docs-delayed-1',
    phase: nodePhase === 'succeeded' ? 'succeeded' : 'active',
    statusMessage: message,
    progress,
    input: delayedPayload({ schedule: 'after 5 minutes', source: 'docs-example' }),
    output: nodePhase === 'succeeded' ? delayedPayload({ outcome: 'sent' }) : undefined,
    startedAt: '2026-09-10T08:00:00.000Z',
    finishedAt: nodePhase === 'succeeded' ? '2026-09-10T08:05:10.000Z' : undefined,
    updatedAt: '2026-09-10T08:05:10.000Z',
    durationMs: nodePhase === 'succeeded' ? 310000 : undefined,
    nodeExecutions,
    connectionExecutions: connections.map((connection, connectionIndex) =>
      delayedConnectionExecution(index, connection.connectionId, connection.phase, connectionIndex),
    ),
  } satisfies TngFlowRunExecutionSnapshot<unknown>);

  return Object.freeze({
    inspectedNodeId: nodeId,
    label: message,
    selectedExecutionId: `delayed-execution-step-${index}-${nodeId}`,
    snapshot,
  });
}

function delayedNodeExecution(
  stepIndex: number,
  nodeId: string,
  phase: TngFlowExecutionPhase,
  message: string,
  sequence: number,
): TngFlowNodeExecution<unknown> {
  return {
    id: `delayed-execution-step-${stepIndex}-${nodeId}`,
    nodeId,
    activationId: 'activation-1',
    attempt: 1,
    phase,
    statusMessage: message,
    progress: phase === 'active' ? 0.62 : phase === 'waiting' ? null : undefined,
    input: delayedPayload({ from: 'previous-step', nodeId }),
    output: phase === 'succeeded' ? delayedPayload({ status: 'ok', nodeId }) : undefined,
    startedAt: '2026-09-10T08:00:00.000Z',
    finishedAt: phase === 'succeeded' ? '2026-09-10T08:01:00.000Z' : undefined,
    updatedAt: '2026-09-10T08:02:00.000Z',
    durationMs: phase === 'succeeded' ? 1200 : undefined,
    sequence: sequence + 1,
  };
}

function delayedConnectionExecution(
  stepIndex: number,
  connectionId: string,
  phase: TngFlowExecutionPhase,
  sequence: number,
): TngFlowConnectionExecution<unknown> {
  return {
    id: `delayed-execution-step-${stepIndex}-${connectionId}`,
    connectionId,
    activationId: 'activation-1',
    attempt: 1,
    phase,
    statusMessage: phase === 'active' ? 'Payload is moving.' : 'Payload delivered.',
    payload: delayedPayload({ carried: true, connectionId }),
    startedAt: '2026-09-10T08:00:00.000Z',
    finishedAt: phase === 'succeeded' ? '2026-09-10T08:01:00.000Z' : undefined,
    updatedAt: '2026-09-10T08:02:00.000Z',
    sequence: sequence + 1,
  };
}

function delayedPayload(value: unknown): TngFlowRunExecutionSnapshot<unknown>['input'] {
  return { state: 'available', value, contentType: 'application/json', language: 'json' };
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
  private readonly playbackTimers = new Map<
    FlowExecutionGraphExampleState,
    ReturnType<typeof setInterval>
  >();

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
    for (const timer of this.playbackTimers.values()) {
      clearInterval(timer);
    }
    this.playbackTimers.clear();
  }

  public resetExample(
    state: FlowExecutionGraphExampleState,
    scenario: FlowExecutionGraphScenario,
  ): void {
    this.stopPlayback(state);
    const definition = cloneDefinition(scenario.definition);
    const selection = cloneSelection(scenario.selection);
    state.definition.set(definition);
    state.history.set(createTngFlowHistory(definition, { selection }));
    state.inspectedNodeId.set(scenario.inspectedNodeId);
    state.selectedExecutionId.set(scenario.selectedExecutionId);
    state.selection.set(selection);
    state.snapshot.set(scenario.snapshot);
    state.timelineIndex.set(0);
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

  public progressLabel(snapshot: TngFlowRunExecutionSnapshot<unknown>): string {
    const progress = snapshot.progress;
    if (progress === null || progress === undefined) {
      return 'Progress pending';
    }
    return `${Math.round(progress * 100)}% complete`;
  }

  public timelineLabel(state: FlowExecutionGraphExampleState): string {
    const timeline = state.timeline;
    if (timeline === null) {
      return this.progressLabel(state.snapshot());
    }
    const index = state.timelineIndex();
    const step = timeline[index];
    return step === undefined
      ? this.progressLabel(state.snapshot())
      : `Step ${index + 1} of ${timeline.length}: ${step.label}`;
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
    const nextDefinition = applyFlowExecutionGraphNodeMoves(state.definition(), event);
    this.commitDefinitionUpdate(state, 'Move nodes', () => nextDefinition);
  }

  public onConnectionCreateRequested(
    state: FlowExecutionGraphExampleState,
    request: TngFlowConnectionCreateRequest,
  ): void {
    const update = applyFlowExecutionGraphConnectionCreate(state.definition(), request);
    this.applyControlledUpdate(state, update, 'Create connection');
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
    this.applyControlledUpdate(state, update, 'Reconnect connection');
    state.lastActivation.set(`Updated the ${request.changedEndpoint} connection endpoint.`);
  }

  public onConnectionsDeleteRequested(
    state: FlowExecutionGraphExampleState,
    request: TngFlowConnectionsDeleteRequest,
  ): void {
    const update = applyFlowExecutionGraphConnectionsDelete(
      state.definition(),
      state.selection(),
      request,
    );
    this.applyControlledUpdate(state, update, 'Delete connections');
    state.lastActivation.set(
      `Deleted ${request.connectionIds.length} connection${request.connectionIds.length === 1 ? '' : 's'}.`,
    );
  }

  public onNodesDeleteRequested(
    state: FlowExecutionGraphExampleState,
    request: TngFlowNodesDeleteRequest,
  ): void {
    const update = applyFlowExecutionGraphNodesDelete(
      state.definition(),
      state.selection(),
      request,
    );
    this.applyControlledUpdate(state, update, 'Delete nodes');
    if (
      state.inspectedNodeId() !== null &&
      request.nodeIds.includes(state.inspectedNodeId() ?? '')
    ) {
      state.inspectedNodeId.set(null);
      state.selectedExecutionId.set(null);
    }
    state.lastActivation.set(
      `Deleted ${request.nodeIds.length} node${request.nodeIds.length === 1 ? '' : 's'}.`,
    );
  }

  public onCommandRequested(
    state: FlowExecutionGraphExampleState,
    request: TngFlowEditorCommandRequest,
  ): void {
    if (request.command === 'undo') {
      this.applyHistoryState(state, undoTngFlowHistory(state.history()));
      return;
    }
    if (request.command === 'redo') {
      this.applyHistoryState(state, redoTngFlowHistory(state.history()));
    }
  }

  public onConnectionRoutingChangeRequested(
    state: FlowExecutionGraphExampleState,
    request: TngFlowConnectionRoutingChangeRequest,
  ): void {
    this.commitDefinitionUpdate(
      state,
      `Change ${request.type} routing`,
      (definition) => applyFlowExecutionGraphConnectionRoutingChange(definition, request),
    );
    state.lastActivation.set(
      `Changed ${request.connectionIds.length} connection${request.connectionIds.length === 1 ? '' : 's'} to ${request.type}.`,
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

  public togglePlayback(state: FlowExecutionGraphExampleState): void {
    if (state.playing()) {
      this.stopPlayback(state);
      return;
    }
    this.startPlayback(state);
  }

  public restartPlayback(state: FlowExecutionGraphExampleState): void {
    this.stopPlayback(state);
    this.applyTimelineStep(state, 0);
    this.startPlayback(state);
  }

  private applyControlledUpdate(
    state: FlowExecutionGraphExampleState,
    update: FlowExecutionGraphControlledUpdate,
    label: string,
  ): void {
    state.definition.set(update.definition);
    state.selection.set(update.selection);
    state.history.update((history) =>
      commitTngFlowHistory(history, update.definition, {
        label,
        selection: update.selection,
      }),
    );
  }

  private commitDefinitionUpdate(
    state: FlowExecutionGraphExampleState,
    label: string,
    update: TngFlowHistoryUpdate<unknown>,
  ): void {
    const nextDefinition = update(state.definition());
    state.definition.set(nextDefinition);
    state.history.update((history) =>
      commitTngFlowHistory(history, nextDefinition, {
        label,
        selection: state.selection(),
      }),
    );
  }

  private applyHistoryState(
    state: FlowExecutionGraphExampleState,
    history: TngFlowHistoryState<unknown>,
  ): void {
    const selection = history.present.selection ?? { connectionIds: new Set(), nodeIds: new Set() };
    const selectedNodeId = selection.nodeIds.values().next().value;

    state.history.set(history);
    state.definition.set(history.present.definition);
    state.selection.set(selection);
    if (typeof selectedNodeId === 'string') {
      state.inspectedNodeId.set(selectedNodeId);
      state.selectedExecutionId.set(null);
      return;
    }
    if (
      state.inspectedNodeId() !== null &&
      !history.present.definition.nodes.some((node) => node.id === state.inspectedNodeId())
    ) {
      state.inspectedNodeId.set(null);
      state.selectedExecutionId.set(null);
    }
  }

  private nodeName(state: FlowExecutionGraphExampleState, nodeId: string): string {
    return state.definition().nodes.find((node) => node.id === nodeId)?.name ?? nodeId;
  }

  private startPlayback(state: FlowExecutionGraphExampleState): void {
    const timeline = state.timeline;
    if (timeline === null) {
      return;
    }
    if (state.timelineIndex() >= timeline.length - 1) {
      this.applyTimelineStep(state, 0);
    }
    state.playing.set(true);
    const timer = setInterval(() => {
      const nextIndex = state.timelineIndex() + 1;
      if (nextIndex >= timeline.length) {
        this.stopPlayback(state);
        return;
      }
      this.applyTimelineStep(state, nextIndex);
      if (nextIndex >= timeline.length - 1) {
        this.stopPlayback(state);
      }
    }, 1300);
    this.playbackTimers.set(state, timer);
  }

  private stopPlayback(state: FlowExecutionGraphExampleState): void {
    const timer = this.playbackTimers.get(state);
    if (timer !== undefined) {
      clearInterval(timer);
      this.playbackTimers.delete(state);
    }
    state.playing.set(false);
  }

  private applyTimelineStep(state: FlowExecutionGraphExampleState, index: number): void {
    const step = state.timeline?.[index];
    if (step === undefined) {
      return;
    }
    state.timelineIndex.set(index);
    state.snapshot.set(step.snapshot);
    state.inspectedNodeId.set(step.inspectedNodeId);
    state.selectedExecutionId.set(step.selectedExecutionId);
    state.selection.set(selectNode(step.inspectedNodeId));
    state.lastActivation.set(step.label);
  }
}
