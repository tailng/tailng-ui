/* eslint-disable complexity, max-params -- Fixture builders keep the scenario definitions compact and readable. */
import type { TngFlowDefinition, TngFlowSelection, TngFlowViewport } from '@tailng-ui/flow';
import type {
  TngFlowConnectionExecution,
  TngFlowExecutionPayload,
  TngFlowExecutionPhase,
  TngFlowNodeExecution,
  TngFlowRunExecutionSnapshot,
} from '@tailng-ui/flow/execution';

export type FlowExecutionViewerScenarioId =
  | 'queued-workflow'
  | 'running-node'
  | 'retrying-node'
  | 'waiting-human-input'
  | 'successful-workflow'
  | 'failed-node'
  | 'skipped-branch'
  | 'parallel-execution'
  | 'loop-activations'
  | 'redacted-payloads'
  | 'large-json-payload'
  | 'narrow-surface';

export type FlowExecutionViewerScenario = Readonly<{
  id: FlowExecutionViewerScenarioId;
  title: string;
  story: string;
  snapshot: TngFlowRunExecutionSnapshot<unknown>;
  selection: TngFlowSelection;
  inspectedNodeId: string | null;
  selectedExecutionId: string | null;
  viewport: TngFlowViewport;
  narrow?: boolean;
}>;

type NodeSeed = Readonly<{
  nodeId: string;
  phase: TngFlowExecutionPhase;
  message: string;
  progress?: number | null;
  attempt?: number;
  maxAttempts?: number;
  activationId?: string;
  input?: TngFlowExecutionPayload<unknown>;
  output?: TngFlowExecutionPayload<unknown>;
  error?: TngFlowExecutionPayload<unknown>;
  durationMs?: number;
}>;

type ConnectionSeed = Readonly<{
  connectionId: string;
  phase: TngFlowExecutionPhase;
  message?: string;
  activationId?: string;
  payload?: TngFlowExecutionPayload<unknown>;
}>;

type FlowExecutionDemoConnection = TngFlowDefinition['connections'][number];

export const FLOW_EXECUTION_VIEWER_DEFINITION = Object.freeze({
  id: 'support-escalation-workflow',
  name: 'Support escalation workflow',
  nodes: [
    {
      id: 'intake',
      type: 'trigger',
      name: 'Ticket intake',
      description: 'Receives a support ticket from the help desk queue.',
      position: { x: 0, y: 320 },
      ports: [{ id: 'ticket', name: 'Ticket', direction: 'output', kind: 'data', multiple: true }],
    },
    {
      id: 'normalize',
      type: 'task',
      name: 'Normalize ticket',
      description: 'Cleans fields, detects language, and extracts customer account metadata.',
      position: { x: 380, y: 320 },
      ports: [
        { id: 'ticket', name: 'Ticket', direction: 'input', kind: 'data' },
        { id: 'normalized', name: 'Normalized', direction: 'output', kind: 'data', multiple: true },
      ],
    },
    {
      id: 'risk',
      type: 'task',
      name: 'Risk check',
      description: 'Scores urgency, SLA risk, and churn probability.',
      position: { x: 780, y: 80 },
      ports: [
        { id: 'normalized', name: 'Normalized', direction: 'input', kind: 'data' },
        { id: 'risk', name: 'Risk', direction: 'output', kind: 'data', multiple: true },
      ],
    },
    {
      id: 'profile',
      type: 'task',
      name: 'Profile lookup',
      description: 'Loads account plan, owner, and recent product usage.',
      position: { x: 780, y: 560 },
      ports: [
        { id: 'normalized', name: 'Normalized', direction: 'input', kind: 'data' },
        { id: 'profile', name: 'Profile', direction: 'output', kind: 'data', multiple: true },
      ],
    },
    {
      id: 'human-review',
      type: 'approval',
      name: 'Human review',
      description: 'Support lead approves the proposed escalation response.',
      position: { x: 1180, y: 320 },
      ports: [
        { id: 'risk', name: 'Risk', direction: 'input', kind: 'data' },
        { id: 'profile', name: 'Profile', direction: 'input', kind: 'data' },
        { id: 'decision', name: 'Decision', direction: 'output', kind: 'data', multiple: true },
      ],
    },
    {
      id: 'publish',
      type: 'task',
      name: 'Publish response',
      description: 'Posts the final customer response and escalates ownership.',
      position: { x: 1580, y: 320 },
      ports: [
        { id: 'decision', name: 'Decision', direction: 'input', kind: 'data' },
        { id: 'result', name: 'Result', direction: 'output', kind: 'data', multiple: true },
      ],
    },
    {
      id: 'notify',
      type: 'task',
      name: 'Notify owner',
      description: 'Sends the account owner the escalation summary.',
      position: { x: 1980, y: 80 },
      ports: [{ id: 'result', name: 'Result', direction: 'input', kind: 'data' }],
    },
    {
      id: 'archive',
      type: 'task',
      name: 'Archive audit',
      description: 'Stores the run transcript and payload metadata.',
      position: { x: 1980, y: 560 },
      ports: [{ id: 'result', name: 'Result', direction: 'input', kind: 'data' }],
    },
  ],
  connections: [
    connection('intake-normalize', 'intake', 'ticket', 'normalize', 'ticket'),
    connection('normalize-risk', 'normalize', 'normalized', 'risk', 'normalized'),
    connection('normalize-profile', 'normalize', 'normalized', 'profile', 'normalized'),
    connection('risk-review', 'risk', 'risk', 'human-review', 'risk'),
    connection('profile-review', 'profile', 'profile', 'human-review', 'profile'),
    connection('review-publish', 'human-review', 'decision', 'publish', 'decision'),
    connection('publish-notify', 'publish', 'result', 'notify', 'result'),
    connection('publish-archive', 'publish', 'result', 'archive', 'result'),
    {
      id: 'review-normalize',
      source: { nodeId: 'human-review', portId: 'decision' },
      target: { nodeId: 'normalize', portId: 'ticket' },
      label: 'Needs correction',
      type: 'bezier',
    },
  ],
} satisfies TngFlowDefinition);

export const FLOW_EXECUTION_VIEWER_SCENARIOS: readonly FlowExecutionViewerScenario[] =
  Object.freeze([
    scenario('queued-workflow', {
      title: 'Queued workflow',
      story:
        'The run has been accepted but no node has started. The graph remains calm and the inspector explains the pending state.',
      inspectedNodeId: 'intake',
      selectedExecutionId: 'queued-workflow-intake',
      snapshot: snapshot(
        'queued-workflow',
        'pending',
        'Run is queued behind two active escalations.',
        [node({ nodeId: 'intake', phase: 'pending', message: 'Waiting for worker capacity.' })],
      ),
    }),
    scenario('running-node', {
      title: 'Running node',
      story:
        'Ticket intake and normalization succeeded. Risk scoring is active with explicit progress while profile lookup has not started.',
      inspectedNodeId: 'risk',
      selectedExecutionId: 'running-node-risk',
      snapshot: snapshot(
        'running-node',
        'active',
        'Risk check is evaluating the ticket.',
        [
          doneNode('intake'),
          doneNode('normalize'),
          node({
            nodeId: 'risk',
            phase: 'active',
            message: 'Scoring account risk signals.',
            progress: 0.58,
            output: pending('Risk score is still streaming.'),
          }),
          node({ nodeId: 'profile', phase: 'pending', message: 'Waiting for normalized ticket.' }),
        ],
        [
          doneConnection('intake-normalize'),
          doneConnection('normalize-risk'),
          pendingConnection('normalize-profile'),
        ],
        0.34,
      ),
    }),
    scenario('retrying-node', {
      title: 'Retrying node',
      story:
        'Profile lookup failed once due to a throttled CRM call and is now retrying on the second attempt.',
      inspectedNodeId: 'profile',
      selectedExecutionId: 'retrying-node-profile-attempt-2',
      snapshot: snapshot(
        'retrying-node',
        'active',
        'Profile lookup is retrying after a recoverable upstream error.',
        [
          doneNode('intake'),
          doneNode('normalize'),
          doneNode('risk'),
          node({
            nodeId: 'profile',
            phase: 'failed',
            message: 'CRM API returned 429.',
            attempt: 1,
            maxAttempts: 3,
            error: available({ code: 429, retryAfterMs: 2000 }, 'Retryable error'),
          }),
          node({
            nodeId: 'profile',
            phase: 'active',
            message: 'Retrying CRM profile lookup.',
            progress: 0.42,
            attempt: 2,
            maxAttempts: 3,
          }),
        ],
        [
          doneConnection('intake-normalize'),
          doneConnection('normalize-risk'),
          activeConnection('normalize-profile'),
        ],
        0.46,
      ),
    }),
    scenario('waiting-human-input', {
      title: 'Waiting for human input',
      story:
        'Automated branches completed and the run is paused until a support lead approves or edits the response.',
      inspectedNodeId: 'human-review',
      selectedExecutionId: 'waiting-human-input-human-review',
      snapshot: snapshot(
        'waiting-human-input',
        'waiting',
        'Waiting for support lead approval.',
        [
          doneNode('intake'),
          doneNode('normalize'),
          doneNode('risk'),
          doneNode('profile'),
          node({
            nodeId: 'human-review',
            phase: 'waiting',
            message: 'Approval required before publishing.',
            input: available({ owner: 'Mina', priority: 'high', proposedAction: 'Escalate' }),
          }),
        ],
        [
          doneConnection('intake-normalize'),
          doneConnection('normalize-risk'),
          doneConnection('normalize-profile'),
          doneConnection('risk-review'),
          doneConnection('profile-review'),
        ],
        0.68,
      ),
    }),
    scenario('successful-workflow', {
      title: 'Successful workflow',
      story:
        'Every required branch succeeded. The selected publish node shows final result payload and downstream audit branches are complete.',
      inspectedNodeId: 'publish',
      selectedExecutionId: 'successful-workflow-publish',
      snapshot: successfulSnapshot(
        'successful-workflow',
        'succeeded',
        'Workflow finished successfully.',
      ),
    }),
    scenario('failed-node', {
      title: 'Failed node with error',
      story:
        'Publishing failed with a validation error. The graph highlights the failed node and the inspector shows the structured error payload.',
      inspectedNodeId: 'publish',
      selectedExecutionId: 'failed-node-publish',
      snapshot: snapshot(
        'failed-node',
        'failed',
        'Publish response failed validation.',
        [
          doneNode('intake'),
          doneNode('normalize'),
          doneNode('risk'),
          doneNode('profile'),
          doneNode('human-review'),
          node({
            nodeId: 'publish',
            phase: 'failed',
            message: 'Response template is missing required account owner.',
            error: available(
              {
                code: 'template_required_field',
                field: 'accountOwner',
                remediation: 'Re-run profile lookup or assign manually.',
              },
              'Publish error',
            ),
          }),
        ],
        [
          doneConnection('intake-normalize'),
          doneConnection('normalize-risk'),
          doneConnection('normalize-profile'),
          doneConnection('risk-review'),
          doneConnection('profile-review'),
          doneConnection('review-publish'),
        ],
        0.76,
      ),
    }),
    scenario('skipped-branch', {
      title: 'Skipped branch',
      story:
        'The owner notification branch is skipped because this low-risk customer does not require account-owner escalation.',
      inspectedNodeId: 'notify',
      selectedExecutionId: 'skipped-branch-notify',
      snapshot: snapshot(
        'skipped-branch',
        'succeeded',
        'Workflow completed with one optional branch skipped.',
        [
          doneNode('intake'),
          doneNode('normalize'),
          doneNode('risk'),
          doneNode('profile'),
          doneNode('human-review'),
          doneNode('publish'),
          node({
            nodeId: 'notify',
            phase: 'skipped',
            message: 'Skipped: low-risk customer and no owner escalation required.',
          }),
          doneNode('archive'),
        ],
        [
          doneConnection('intake-normalize'),
          doneConnection('normalize-risk'),
          doneConnection('normalize-profile'),
          doneConnection('risk-review'),
          doneConnection('profile-review'),
          doneConnection('review-publish'),
          doneConnection('publish-archive'),
          {
            connectionId: 'publish-notify',
            activationId: 'activation-1',
            phase: 'skipped',
            message: 'Condition evaluated false.',
          },
        ],
      ),
    }),
    scenario('parallel-execution', {
      title: 'Parallel execution',
      story:
        'Risk check and profile lookup are both active after normalization. Two outgoing edges animate at the same time.',
      inspectedNodeId: 'profile',
      selectedExecutionId: 'parallel-execution-profile',
      snapshot: snapshot(
        'parallel-execution',
        'active',
        'Running independent enrichment branches in parallel.',
        [
          doneNode('intake'),
          doneNode('normalize'),
          node({
            nodeId: 'risk',
            phase: 'active',
            message: 'Calculating urgency and SLA risk.',
            progress: 0.51,
          }),
          node({
            nodeId: 'profile',
            phase: 'active',
            message: 'Loading account profile and product usage.',
            progress: 0.63,
          }),
        ],
        [
          doneConnection('intake-normalize'),
          activeConnection('normalize-risk'),
          activeConnection('normalize-profile'),
        ],
        0.48,
      ),
    }),
    scenario('loop-activations', {
      title: 'Loop with multiple activations',
      story:
        'Human review requested a correction, sending the run back through normalization. The inspector shows separate activation history.',
      inspectedNodeId: 'normalize',
      selectedExecutionId: 'loop-activations-normalize-activation-2',
      snapshot: snapshot(
        'loop-activations',
        'active',
        'Second activation is correcting the ticket summary.',
        [
          doneNode('intake'),
          node({
            nodeId: 'normalize',
            phase: 'succeeded',
            message: 'Initial normalization completed.',
            activationId: 'activation-1',
            output: available({ language: 'en', urgency: 'medium' }),
          }),
          doneNode('risk'),
          doneNode('profile'),
          node({
            nodeId: 'human-review',
            phase: 'succeeded',
            message: 'Reviewer requested a summary correction.',
            output: available({ decision: 'revise', field: 'summary' }),
          }),
          node({
            nodeId: 'normalize',
            phase: 'active',
            message: 'Applying reviewer correction.',
            progress: 0.71,
            activationId: 'activation-2',
            output: pending('Corrected summary is being generated.'),
          }),
        ],
        [
          doneConnection('intake-normalize'),
          doneConnection('normalize-risk'),
          doneConnection('normalize-profile'),
          doneConnection('risk-review'),
          doneConnection('profile-review'),
          doneConnection('review-normalize'),
        ],
        0.62,
      ),
    }),
    scenario('redacted-payloads', {
      title: 'Redacted payloads',
      story:
        'Sensitive customer content is present but intentionally redacted. The payload panel explains why values are unavailable.',
      inspectedNodeId: 'human-review',
      selectedExecutionId: 'redacted-payloads-human-review',
      snapshot: snapshot(
        'redacted-payloads',
        'waiting',
        'Waiting for approval with sensitive content hidden.',
        [
          doneNode('intake'),
          doneNode('normalize'),
          doneNode('risk'),
          doneNode('profile'),
          node({
            nodeId: 'human-review',
            phase: 'waiting',
            message: 'Reviewer can approve without exposing PII in logs.',
            input: redacted('PII and customer message body hidden by retention policy.'),
            output: pending('Decision has not been submitted.'),
          }),
        ],
        [
          doneConnection('intake-normalize'),
          doneConnection('normalize-risk'),
          doneConnection('normalize-profile'),
          doneConnection('risk-review'),
          doneConnection('profile-review'),
        ],
      ),
    }),
    scenario('large-json-payload', {
      title: 'Large JSON payload',
      story:
        'Profile lookup produced a large nested response. The default payload renderer keeps it scrollable inside the inspector.',
      inspectedNodeId: 'profile',
      selectedExecutionId: 'large-json-payload-profile',
      snapshot: snapshot(
        'large-json-payload',
        'succeeded',
        'Profile payload captured for audit.',
        [
          doneNode('intake'),
          doneNode('normalize'),
          doneNode('risk'),
          node({
            nodeId: 'profile',
            phase: 'succeeded',
            message: 'Profile response contained usage, billing, and contact history.',
            output: available(largeProfilePayload(), 'Profile lookup output'),
            durationMs: 1620,
          }),
        ],
        [doneConnection('intake-normalize'), doneConnection('normalize-profile')],
      ),
    }),
    scenario('narrow-surface', {
      title: 'Constrained embedding surface',
      story:
        'The viewer is constrained to an embedded surface while keeping node details in the right-side panel.',
      inspectedNodeId: 'human-review',
      selectedExecutionId: 'narrow-surface-human-review',
      narrow: true,
      snapshot: snapshot(
        'narrow-surface',
        'waiting',
        'Compact embed is waiting for approval.',
        [
          doneNode('intake'),
          doneNode('normalize'),
          doneNode('risk'),
          doneNode('profile'),
          node({
            nodeId: 'human-review',
            phase: 'waiting',
            message: 'Approval required in compact layout.',
            input: available({ reviewer: 'Support lead', dueInMinutes: 12 }),
          }),
        ],
        [
          doneConnection('intake-normalize'),
          doneConnection('normalize-risk'),
          doneConnection('normalize-profile'),
          doneConnection('risk-review'),
          doneConnection('profile-review'),
        ],
      ),
      viewport: { position: { x: -400, y: -120 }, scale: 0.44 },
    }),
  ]);

export function findFlowExecutionViewerScenario(
  id: FlowExecutionViewerScenarioId,
): FlowExecutionViewerScenario {
  const scenarioResult = FLOW_EXECUTION_VIEWER_SCENARIOS.find((item) => item.id === id);
  if (scenarioResult === undefined) {
    throw new Error(`Unknown flow execution viewer scenario "${id}".`);
  }
  return scenarioResult;
}

function scenario(
  id: FlowExecutionViewerScenarioId,
  partial: Omit<FlowExecutionViewerScenario, 'id' | 'selection' | 'viewport'> &
    Partial<Pick<FlowExecutionViewerScenario, 'selection' | 'viewport'>>,
): FlowExecutionViewerScenario {
  return Object.freeze({
    id,
    selection:
      partial.inspectedNodeId === null ? emptySelection() : selectNode(partial.inspectedNodeId),
    viewport: { position: { x: -70, y: -60 }, scale: 0.52 },
    ...partial,
  });
}

function snapshot(
  id: FlowExecutionViewerScenarioId,
  phase: TngFlowExecutionPhase,
  statusMessage: string,
  nodeSeeds: readonly NodeSeed[],
  connectionSeeds: readonly ConnectionSeed[] = [],
  progress: number | null = null,
): TngFlowRunExecutionSnapshot<unknown> {
  return Object.freeze({
    id,
    definitionId: FLOW_EXECUTION_VIEWER_DEFINITION.id,
    definitionRevision: 'docs-example-1',
    phase,
    statusMessage,
    progress,
    input: available({ queue: 'priority-support', source: 'docs-example' }, 'Run input'),
    output: phase === 'succeeded' ? available({ outcome: 'resolved', auditId: id }) : undefined,
    error: phase === 'failed' ? unavailable('Run failed before final output.') : undefined,
    startedAt: '2026-09-10T08:00:00.000Z',
    updatedAt: '2026-09-10T08:02:15.000Z',
    durationMs: phase === 'succeeded' || phase === 'failed' ? 135000 : undefined,
    nodeExecutions: nodeSeeds.map((seed, index) => nodeFromSeed(id, seed, index)),
    connectionExecutions: connectionSeeds.map((seed, index) => connectionFromSeed(id, seed, index)),
  });
}

function successfulSnapshot(
  id: FlowExecutionViewerScenarioId,
  phase: TngFlowExecutionPhase,
  statusMessage: string,
): TngFlowRunExecutionSnapshot<unknown> {
  return snapshot(
    id,
    phase,
    statusMessage,
    [
      doneNode('intake'),
      doneNode('normalize'),
      doneNode('risk'),
      doneNode('profile'),
      doneNode('human-review'),
      doneNode('publish'),
      doneNode('notify'),
      doneNode('archive'),
    ],
    [
      doneConnection('intake-normalize'),
      doneConnection('normalize-risk'),
      doneConnection('normalize-profile'),
      doneConnection('risk-review'),
      doneConnection('profile-review'),
      doneConnection('review-publish'),
      doneConnection('publish-notify'),
      doneConnection('publish-archive'),
    ],
    1,
  );
}

function nodeFromSeed(
  scenarioId: FlowExecutionViewerScenarioId,
  seed: NodeSeed,
  index: number,
): TngFlowNodeExecution<unknown> {
  const attempt = seed.attempt ?? 1;
  const activationId = seed.activationId ?? 'activation-1';
  const idParts =
    seed.attempt === undefined
      ? [scenarioId, seed.nodeId]
      : [scenarioId, seed.nodeId, `attempt-${attempt}`];
  if (activationId !== 'activation-1' && seed.attempt === undefined) {
    idParts.push(activationId);
  }
  return {
    id: idParts.join('-'),
    nodeId: seed.nodeId,
    activationId,
    attempt,
    maxAttempts: seed.maxAttempts,
    phase: seed.phase,
    statusMessage: seed.message,
    ...(seed.progress === undefined ? {} : { progress: seed.progress }),
    input: seed.input ?? available({ from: 'previous-step', nodeId: seed.nodeId }),
    output: seed.output ?? defaultOutput(seed),
    error: seed.error,
    startedAt: '2026-09-10T08:00:00.000Z',
    finishedAt:
      seed.phase === 'active' || seed.phase === 'waiting' || seed.phase === 'pending'
        ? undefined
        : '2026-09-10T08:01:10.000Z',
    updatedAt: '2026-09-10T08:02:15.000Z',
    durationMs: seed.durationMs ?? (seed.phase === 'succeeded' ? 920 : undefined),
    sequence: index + 1,
  };
}

function connectionFromSeed(
  scenarioId: FlowExecutionViewerScenarioId,
  seed: ConnectionSeed,
  index: number,
): TngFlowConnectionExecution<unknown> {
  return {
    id: `${scenarioId}-${seed.connectionId}-edge`,
    connectionId: seed.connectionId,
    activationId: seed.activationId ?? 'activation-1',
    attempt: 1,
    phase: seed.phase,
    statusMessage: seed.message ?? null,
    payload: seed.payload ?? available({ carried: true, connectionId: seed.connectionId }),
    startedAt: '2026-09-10T08:00:00.000Z',
    updatedAt: '2026-09-10T08:02:15.000Z',
    sequence: index + 1,
  };
}

function doneNode(nodeId: string): NodeSeed {
  return {
    nodeId,
    phase: 'succeeded',
    message: 'Completed successfully.',
    output: available({ status: 'ok', nodeId }),
  };
}

function node(seed: NodeSeed): NodeSeed {
  return seed;
}

function doneConnection(connectionId: string): ConnectionSeed {
  return { connectionId, phase: 'succeeded', message: 'Payload delivered.' };
}

function activeConnection(connectionId: string): ConnectionSeed {
  return { connectionId, phase: 'active', message: 'Streaming payload.' };
}

function pendingConnection(connectionId: string): ConnectionSeed {
  return { connectionId, phase: 'pending', message: 'Waiting for source node.' };
}

function connection(
  id: string,
  sourceNodeId: string,
  sourcePortId: string,
  targetNodeId: string,
  targetPortId: string,
): FlowExecutionDemoConnection {
  return {
    id,
    source: { nodeId: sourceNodeId, portId: sourcePortId },
    target: { nodeId: targetNodeId, portId: targetPortId },
    type: 'bezier' as const,
  };
}

function available(value: unknown, label?: string): TngFlowExecutionPayload<unknown> {
  return { state: 'available', value, label, contentType: 'application/json', language: 'json' };
}

function pending(reason: string): TngFlowExecutionPayload<unknown> {
  return { state: 'pending', reason };
}

function redacted(reason: string): TngFlowExecutionPayload<unknown> {
  return { state: 'redacted', reason };
}

function unavailable(reason: string): TngFlowExecutionPayload<unknown> {
  return { state: 'unavailable', reason };
}

function defaultOutput(seed: NodeSeed): TngFlowExecutionPayload<unknown> | undefined {
  if (seed.phase === 'succeeded') {
    return available({ status: 'ok', nodeId: seed.nodeId });
  }
  if (seed.phase === 'pending' || seed.phase === 'waiting' || seed.phase === 'active') {
    return pending('Output is not available yet.');
  }
  return undefined;
}

function selectNode(nodeId: string): TngFlowSelection {
  return { nodeIds: new Set([nodeId]), connectionIds: new Set<string>() };
}

function emptySelection(): TngFlowSelection {
  return { nodeIds: new Set<string>(), connectionIds: new Set<string>() };
}

function largeProfilePayload(): Readonly<{
  accountId: string;
  plan: string;
  owner: Readonly<{ name: string; region: string; escalationChannel: string }>;
  usage: readonly Readonly<{
    week: string;
    activeSeats: number;
    workflowRuns: number;
    failedRuns: number;
  }>[];
  recentTickets: readonly Readonly<{ id: string; sentiment: string; topic: string }>[];
  flags: Readonly<{
    healthScore: number;
    renewalWindowDays: number;
    sensitiveFieldsRemoved: boolean;
  }>;
}> {
  return {
    accountId: 'acct_91KPM2',
    plan: 'Enterprise',
    owner: { name: 'Mina Patel', region: 'NA', escalationChannel: '#accounts-priority' },
    usage: Array.from({ length: 16 }, (_, index) => ({
      week: `2026-W${String(index + 22).padStart(2, '0')}`,
      activeSeats: 180 + index * 3,
      workflowRuns: 3200 + index * 187,
      failedRuns: index % 5,
    })),
    recentTickets: Array.from({ length: 10 }, (_, index) => ({
      id: `SUP-${8400 + index}`,
      sentiment: index < 2 ? 'negative' : 'neutral',
      topic: index % 2 === 0 ? 'billing' : 'automation latency',
    })),
    flags: {
      healthScore: 71,
      renewalWindowDays: 43,
      sensitiveFieldsRemoved: true,
    },
  };
}
