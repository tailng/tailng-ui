/* eslint-disable complexity, max-lines-per-function -- These helpers encode execution contract precedence, validation, and ordering in one place. */
import type {
  TngFlowConnectionExecution,
  TngFlowExecutionActivation,
  TngFlowExecutionDateTimeFormatter,
  TngFlowExecutionIndex,
  TngFlowExecutionPayload,
  TngFlowExecutionPayloadView,
  TngFlowExecutionPhase,
  TngFlowExecutionWarning,
  TngFlowNodeExecution,
  TngFlowRunExecutionSnapshot,
} from './tng-flow-execution.types';
import type {
  TngFlowConnectionStatus,
  TngFlowConnectionPresentation,
  TngFlowNodePresentation,
  TngFlowPresentation,
  TngFlowDefinition,
  TngFlowNodeStatus,
  TngFlowSelection,
} from '@tailng-ui/flow';

const activePhaseRank: Readonly<Record<TngFlowExecutionPhase, number>> = Object.freeze({
  active: 0,
  waiting: 1,
  pending: 2,
  failed: 3,
  idle: 4,
  cancelled: 5,
  skipped: 6,
  succeeded: 7,
});

const nodeStatusByPhase: Readonly<Record<TngFlowExecutionPhase, TngFlowNodeStatus>> = Object.freeze(
  {
    active: 'running',
    cancelled: 'cancelled',
    failed: 'failed',
    idle: 'idle',
    pending: 'queued',
    skipped: 'skipped',
    succeeded: 'completed',
    waiting: 'waiting',
  },
);

const connectionStatusByPhase: Readonly<Record<TngFlowExecutionPhase, TngFlowConnectionStatus>> =
  Object.freeze({
    active: 'active',
    cancelled: 'warning',
    failed: 'error',
    idle: 'idle',
    pending: 'idle',
    skipped: 'disabled',
    succeeded: 'success',
    waiting: 'warning',
  });

const phaseLabelByPhase: Readonly<Record<TngFlowExecutionPhase, string>> = Object.freeze({
  active: 'Active',
  cancelled: 'Cancelled',
  failed: 'Failed',
  idle: 'Idle',
  pending: 'Pending',
  skipped: 'Skipped',
  succeeded: 'Succeeded',
  waiting: 'Waiting',
});

export function createTngFlowExecutionIndex<TPayload>(
  definition: TngFlowDefinition | null,
  snapshot: TngFlowRunExecutionSnapshot<TPayload> | null,
): TngFlowExecutionIndex<TPayload> {
  const warnings: TngFlowExecutionWarning[] = [];
  if (definition === null || snapshot === null) {
    return emptyExecutionIndex(definition, snapshot, warnings);
  }

  if (definition.id !== snapshot.definitionId) {
    warnings.push({
      code: 'definition-mismatch',
      message: `Execution snapshot "${snapshot.id}" references definition "${snapshot.definitionId}", but the viewer definition is "${definition.id}".`,
      id: snapshot.id,
    });
    return emptyExecutionIndex(definition, null, warnings);
  }

  const nodeIds = new Set(definition.nodes.map((node) => node.id));
  const connectionIds = new Set(definition.connections.map((connection) => connection.id));
  const seenExecutionIds = new Set<string>();
  const nodeExecutions: TngFlowNodeExecution<TPayload>[] = [];
  const connectionExecutions: TngFlowConnectionExecution<TPayload>[] = [];

  for (const execution of snapshot.nodeExecutions ?? []) {
    if (seenExecutionIds.has(execution.id)) {
      warnings.push(duplicateWarning(execution.id));
      continue;
    }
    seenExecutionIds.add(execution.id);
    if (!nodeIds.has(execution.nodeId)) {
      warnings.push({
        code: 'missing-node',
        message: `Node execution "${execution.id}" references missing node "${execution.nodeId}".`,
        id: execution.id,
      });
      continue;
    }
    if (!isFiniteNumber(execution.attempt) || execution.attempt < 1) {
      warnings.push(invalidNumberWarning(execution.id, 'attempt'));
      continue;
    }
    if (execution.sequence !== undefined && !isFiniteNumber(execution.sequence)) {
      warnings.push(invalidNumberWarning(execution.id, 'sequence'));
      continue;
    }
    if (
      execution.durationMs !== undefined &&
      (!isFiniteNumber(execution.durationMs) || execution.durationMs < 0)
    ) {
      warnings.push(invalidNumberWarning(execution.id, 'durationMs'));
      continue;
    }
    nodeExecutions.push(execution);
  }

  for (const execution of snapshot.connectionExecutions ?? []) {
    if (seenExecutionIds.has(execution.id)) {
      warnings.push(duplicateWarning(execution.id));
      continue;
    }
    seenExecutionIds.add(execution.id);
    if (!connectionIds.has(execution.connectionId)) {
      warnings.push({
        code: 'missing-connection',
        message: `Connection execution "${execution.id}" references missing connection "${execution.connectionId}".`,
        id: execution.id,
      });
      continue;
    }
    if (!isFiniteNumber(execution.attempt) || execution.attempt < 1) {
      warnings.push(invalidNumberWarning(execution.id, 'attempt'));
      continue;
    }
    if (execution.sequence !== undefined && !isFiniteNumber(execution.sequence)) {
      warnings.push(invalidNumberWarning(execution.id, 'sequence'));
      continue;
    }
    connectionExecutions.push(execution);
  }

  const sortedNodeExecutions = sortTngFlowNodeExecutions(nodeExecutions);
  const sortedConnectionExecutions = sortTngFlowConnectionExecutions(connectionExecutions);
  return {
    definition,
    snapshot,
    warnings,
    nodeExecutions: sortedNodeExecutions,
    connectionExecutions: sortedConnectionExecutions,
    nodeExecutionsByNodeId: groupBy(sortedNodeExecutions, (execution) => execution.nodeId),
    connectionExecutionsByConnectionId: groupBy(
      sortedConnectionExecutions,
      (execution) => execution.connectionId,
    ),
  };
}

export function sortTngFlowNodeExecutions<TPayload>(
  executions: readonly TngFlowNodeExecution<TPayload>[],
): readonly TngFlowNodeExecution<TPayload>[] {
  return [...executions].sort(compareExecutions);
}

export function sortTngFlowConnectionExecutions<TPayload>(
  executions: readonly TngFlowConnectionExecution<TPayload>[],
): readonly TngFlowConnectionExecution<TPayload>[] {
  return [...executions].sort(compareExecutions);
}

export function groupTngFlowNodeExecutionsByActivation<TPayload>(
  executions: readonly TngFlowNodeExecution<TPayload>[],
): readonly TngFlowExecutionActivation<TPayload>[] {
  const activationOrder: string[] = [];
  const byActivation = new Map<string, TngFlowNodeExecution<TPayload>[]>();
  for (const execution of sortTngFlowNodeExecutions(executions)) {
    const existing = byActivation.get(execution.activationId);
    if (existing === undefined) {
      activationOrder.push(execution.activationId);
      byActivation.set(execution.activationId, [execution]);
      continue;
    }
    existing.push(execution);
  }
  return activationOrder.map((activationId) => ({
    activationId,
    executions: byActivation.get(activationId) ?? [],
  }));
}

export function createTngFlowExecutionPresentation<TPayload>(
  definition: TngFlowDefinition | null,
  index: TngFlowExecutionIndex<TPayload>,
  progressMode: 'explicit' | 'status-driven' = 'status-driven',
): TngFlowPresentation<TngFlowNodeStatus> {
  const nodes: Record<string, TngFlowNodePresentation<TngFlowNodeStatus>> = {};
  const connections: Record<string, TngFlowConnectionPresentation> = {};
  if (definition === null) {
    return {};
  }

  for (const node of definition.nodes) {
    const latest = index.nodeExecutionsByNodeId.get(node.id)?.[0];
    if (latest === undefined) {
      continue;
    }
    const nodePresentation: TngFlowNodePresentation<TngFlowNodeStatus> = {
      status: nodeStatusByPhase[latest.phase],
      statusMessage: latest.statusMessage ?? null,
      highlighted: latest.phase === 'active' || latest.phase === 'waiting',
      dimmed: latest.phase === 'skipped',
    };
    if (progressMode === 'status-driven' || latest.progress !== undefined) {
      nodes[node.id] = {
        ...nodePresentation,
        progress: latest.progress ?? null,
      };
    } else {
      nodes[node.id] = nodePresentation;
    }
  }

  for (const connection of definition.connections) {
    const latest = index.connectionExecutionsByConnectionId.get(connection.id)?.[0];
    if (latest === undefined) {
      continue;
    }
    connections[connection.id] = {
      status: connectionStatusByPhase[latest.phase],
      motion: latest.phase === 'active' ? 'flow' : latest.phase === 'waiting' ? 'pulse' : 'none',
      message: latest.statusMessage ?? null,
    };
  }

  return { nodes, connections };
}

export function resolveTngFlowExecutionInspectedNodeId(
  definition: TngFlowDefinition | null,
  selection: TngFlowSelection,
  inspectedNodeId: string | null,
): string | null {
  if (definition === null || definition.nodes.length === 0) {
    return null;
  }
  const nodeIds = new Set(definition.nodes.map((node) => node.id));
  if (inspectedNodeId !== null && nodeIds.has(inspectedNodeId)) {
    return inspectedNodeId;
  }
  for (const node of definition.nodes) {
    if (selection.nodeIds.has(node.id)) {
      return node.id;
    }
  }
  return null;
}

export function resolveTngFlowSelectedExecution<TPayload>(
  executions: readonly TngFlowNodeExecution<TPayload>[],
  selectedExecutionId: string | null,
): TngFlowNodeExecution<TPayload> | null {
  if (selectedExecutionId !== null) {
    return (
      executions.find((execution) => execution.id === selectedExecutionId) ?? executions[0] ?? null
    );
  }
  return executions[0] ?? null;
}

export function createTngFlowSelectionForNode(nodeId: string | null): TngFlowSelection {
  return {
    nodeIds: new Set(nodeId === null ? [] : [nodeId]),
    connectionIds: new Set(),
  };
}

export function labelTngFlowExecutionPhase(phase: TngFlowExecutionPhase): string {
  return phaseLabelByPhase[phase];
}

export function formatTngFlowExecutionPayload(
  payload: TngFlowExecutionPayload | null | undefined,
  title: string,
): TngFlowExecutionPayloadView {
  if (payload === undefined || payload === null) {
    return {
      title,
      state: 'omitted',
      code: '',
      language: 'text',
      message: 'Not supplied',
    };
  }
  if (payload.state !== 'available') {
    return {
      title: payload.label ?? title,
      state: payload.state,
      code: '',
      language: 'text',
      message: payload.reason ?? labelPayloadState(payload.state),
    };
  }

  const language = payload.language ?? inferPayloadLanguage(payload.contentType, payload.value);
  return {
    title: payload.label ?? title,
    state: 'available',
    code: stringifyPayloadValue(payload.value),
    language,
    message: null,
  };
}

export function formatTngFlowExecutionDateTime(
  value: string | undefined,
  field: 'finishedAt' | 'startedAt' | 'updatedAt',
  formatter?: TngFlowExecutionDateTimeFormatter | null,
): string | null {
  if (value === undefined) {
    return null;
  }
  if (formatter !== undefined && formatter !== null) {
    return formatter(value, { field });
  }
  const timestamp = Date.parse(value);
  if (!Number.isFinite(timestamp)) {
    return value;
  }
  return new Intl.DateTimeFormat(undefined, {
    dateStyle: 'medium',
    timeStyle: 'medium',
  }).format(new Date(timestamp));
}

export function formatTngFlowExecutionDuration(
  input: Readonly<{
    durationMs?: number;
    finishedAt?: string;
    startedAt?: string;
  }>,
): string | null {
  const durationMs =
    input.durationMs ??
    (input.startedAt !== undefined && input.finishedAt !== undefined
      ? Date.parse(input.finishedAt) - Date.parse(input.startedAt)
      : undefined);
  if (durationMs === undefined || !Number.isFinite(durationMs) || durationMs < 0) {
    return null;
  }
  if (durationMs < 1000) {
    return `${Math.round(durationMs)} ms`;
  }
  const seconds = durationMs / 1000;
  if (seconds < 60) {
    return `${seconds.toFixed(seconds < 10 ? 1 : 0)} s`;
  }
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.round(seconds % 60);
  return remainingSeconds === 0 ? `${minutes} min` : `${minutes} min ${remainingSeconds} s`;
}

function emptyExecutionIndex<TPayload>(
  definition: TngFlowDefinition | null,
  snapshot: TngFlowRunExecutionSnapshot<TPayload> | null,
  warnings: readonly TngFlowExecutionWarning[],
): TngFlowExecutionIndex<TPayload> {
  return {
    definition,
    snapshot,
    warnings,
    nodeExecutions: [],
    connectionExecutions: [],
    nodeExecutionsByNodeId: new Map(),
    connectionExecutionsByConnectionId: new Map(),
  };
}

function compareExecutions(
  left: TngFlowNodeExecution | TngFlowConnectionExecution,
  right: TngFlowNodeExecution | TngFlowConnectionExecution,
): number {
  const phaseDelta = activePhaseRank[left.phase] - activePhaseRank[right.phase];
  if (phaseDelta !== 0) {
    return phaseDelta;
  }
  const leftHasSequence = isFiniteNumber(left.sequence);
  const rightHasSequence = isFiniteNumber(right.sequence);
  if (leftHasSequence || rightHasSequence) {
    if (leftHasSequence && rightHasSequence && left.sequence !== right.sequence) {
      return right.sequence - left.sequence;
    }
    if (leftHasSequence !== rightHasSequence) {
      return leftHasSequence ? -1 : 1;
    }
  }
  const recencyDelta = executionRecency(right) - executionRecency(left);
  if (recencyDelta !== 0) {
    return recencyDelta;
  }
  const attemptDelta = right.attempt - left.attempt;
  if (attemptDelta !== 0) {
    return attemptDelta;
  }
  return left.id.localeCompare(right.id);
}

function executionRecency(execution: TngFlowNodeExecution | TngFlowConnectionExecution): number {
  for (const value of [execution.updatedAt, execution.finishedAt, execution.startedAt]) {
    const timestamp = value === undefined ? Number.NaN : Date.parse(value);
    if (Number.isFinite(timestamp)) {
      return timestamp;
    }
  }
  return 0;
}

function groupBy<TItem>(
  items: readonly TItem[],
  keyFor: (item: TItem) => string,
): ReadonlyMap<string, readonly TItem[]> {
  const grouped = new Map<string, TItem[]>();
  for (const item of items) {
    const key = keyFor(item);
    const existing = grouped.get(key);
    if (existing === undefined) {
      grouped.set(key, [item]);
    } else {
      existing.push(item);
    }
  }
  return grouped;
}

function duplicateWarning(id: string): TngFlowExecutionWarning {
  return {
    code: 'duplicate-execution-id',
    message: `Execution id "${id}" appears more than once. The first record is used.`,
    id,
  };
}

function invalidNumberWarning(id: string, field: string): TngFlowExecutionWarning {
  return {
    code: 'invalid-number',
    message: `Execution "${id}" has an invalid numeric "${field}" value.`,
    id,
  };
}

function isFiniteNumber(value: unknown): value is number {
  return typeof value === 'number' && Number.isFinite(value);
}

function inferPayloadLanguage(contentType: string | undefined, value: unknown): string {
  if (contentType?.includes('json') || typeof value === 'object') {
    return 'json';
  }
  if (contentType?.startsWith('text/')) {
    return 'text';
  }
  return 'text';
}

function stringifyPayloadValue(value: unknown): string {
  if (typeof value === 'string') {
    return value;
  }
  try {
    return JSON.stringify(value, null, 2);
  } catch {
    return String(value);
  }
}

function labelPayloadState(state: 'not-recorded' | 'pending' | 'redacted' | 'unavailable'): string {
  if (state === 'pending') {
    return 'Pending';
  }
  if (state === 'not-recorded') {
    return 'Not recorded';
  }
  if (state === 'redacted') {
    return 'Redacted';
  }
  return 'Unavailable';
}
