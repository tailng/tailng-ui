/* eslint-disable @typescript-eslint/prefer-readonly-parameter-types -- Public history helpers accept immutable TailNG graph snapshots and state records. */
import type { TngFlowDefinition, TngFlowSelection } from '../types/tng-flow.types';

export const TNG_FLOW_HISTORY_DEFAULT_LIMIT = 50;

export type TngFlowHistorySnapshot<TNodeData = unknown, TConnectionData = unknown> = Readonly<{
  definition: TngFlowDefinition<TNodeData, TConnectionData>;
  selection?: TngFlowSelection;
  label?: string;
  timestamp: number;
}>;

export type TngFlowHistoryState<TNodeData = unknown, TConnectionData = unknown> = Readonly<{
  past: readonly TngFlowHistorySnapshot<TNodeData, TConnectionData>[];
  present: TngFlowHistorySnapshot<TNodeData, TConnectionData>;
  future: readonly TngFlowHistorySnapshot<TNodeData, TConnectionData>[];
  limit: number;
}>;

export type TngFlowHistoryCreateOptions = Readonly<{
  label?: string;
  limit?: number;
  selection?: TngFlowSelection;
  timestamp?: number;
}>;

export type TngFlowHistoryCommitOptions<TNodeData = unknown, TConnectionData = unknown> = Readonly<{
  equals?: (
    previous: TngFlowDefinition<TNodeData, TConnectionData>,
    next: TngFlowDefinition<TNodeData, TConnectionData>,
  ) => boolean;
  label?: string;
  limit?: number;
  selection?: TngFlowSelection;
  timestamp?: number;
}>;

export type TngFlowHistoryUpdate<TNodeData = unknown, TConnectionData = unknown> = (
  definition: TngFlowDefinition<TNodeData, TConnectionData>,
) => TngFlowDefinition<TNodeData, TConnectionData>;

export type TngFlowHistoryStatus = Readonly<{
  canUndo: boolean;
  canRedo: boolean;
  undoLabel?: string;
  redoLabel?: string;
}>;

export function createTngFlowHistory<TNodeData = unknown, TConnectionData = unknown>(
  definition: TngFlowDefinition<TNodeData, TConnectionData>,
  options: TngFlowHistoryCreateOptions = {},
): TngFlowHistoryState<TNodeData, TConnectionData> {
  return {
    past: [],
    present: createHistorySnapshot(definition, options),
    future: [],
    limit: normalizeLimit(options.limit),
  };
}

export function resetTngFlowHistory<TNodeData = unknown, TConnectionData = unknown>(
  definition: TngFlowDefinition<TNodeData, TConnectionData>,
  options: TngFlowHistoryCreateOptions = {},
): TngFlowHistoryState<TNodeData, TConnectionData> {
  return createTngFlowHistory(definition, options);
}

export function commitTngFlowHistory<TNodeData = unknown, TConnectionData = unknown>(
  state: TngFlowHistoryState<TNodeData, TConnectionData>,
  definition: TngFlowDefinition<TNodeData, TConnectionData>,
  options: TngFlowHistoryCommitOptions<TNodeData, TConnectionData> = {},
): TngFlowHistoryState<TNodeData, TConnectionData> {
  const equals = options.equals ?? Object.is;
  if (equals(state.present.definition, definition)) {
    return state;
  }

  const limit = normalizeLimit(options.limit ?? state.limit);
  return {
    past: limitSnapshots([...state.past, state.present], limit),
    present: createHistorySnapshot(definition, options),
    future: [],
    limit,
  };
}

export function updateTngFlowHistory<TNodeData = unknown, TConnectionData = unknown>(
  state: TngFlowHistoryState<TNodeData, TConnectionData>,
  update: TngFlowHistoryUpdate<TNodeData, TConnectionData>,
  options: TngFlowHistoryCommitOptions<TNodeData, TConnectionData> = {},
): TngFlowHistoryState<TNodeData, TConnectionData> {
  return commitTngFlowHistory(state, update(state.present.definition), options);
}

export function undoTngFlowHistory<TNodeData = unknown, TConnectionData = unknown>(
  state: TngFlowHistoryState<TNodeData, TConnectionData>,
): TngFlowHistoryState<TNodeData, TConnectionData> {
  const previous = state.past[state.past.length - 1];
  if (previous === undefined) {
    return state;
  }
  return {
    ...state,
    past: state.past.slice(0, -1),
    present: previous,
    future: [state.present, ...state.future],
  };
}

export function redoTngFlowHistory<TNodeData = unknown, TConnectionData = unknown>(
  state: TngFlowHistoryState<TNodeData, TConnectionData>,
): TngFlowHistoryState<TNodeData, TConnectionData> {
  const next = state.future[0];
  if (next === undefined) {
    return state;
  }
  return {
    ...state,
    past: limitSnapshots([...state.past, state.present], state.limit),
    present: next,
    future: state.future.slice(1),
  };
}

export function tngFlowHistoryStatus(state: TngFlowHistoryState): TngFlowHistoryStatus {
  const redoSnapshot = state.future[0];
  return {
    canUndo: state.past.length > 0,
    canRedo: redoSnapshot !== undefined,
    ...(state.present.label === undefined ? {} : { undoLabel: state.present.label }),
    ...(redoSnapshot?.label === undefined ? {} : { redoLabel: redoSnapshot.label }),
  };
}

function createHistorySnapshot<TNodeData, TConnectionData>(
  definition: TngFlowDefinition<TNodeData, TConnectionData>,
  options: TngFlowHistoryCreateOptions,
): TngFlowHistorySnapshot<TNodeData, TConnectionData> {
  return {
    definition,
    ...(options.selection === undefined ? {} : { selection: copySelection(options.selection) }),
    ...(options.label === undefined ? {} : { label: options.label }),
    timestamp: options.timestamp ?? Date.now(),
  };
}

function copySelection(selection: TngFlowSelection): TngFlowSelection {
  return {
    nodeIds: new Set(selection.nodeIds),
    connectionIds: new Set(selection.connectionIds),
  };
}

function normalizeLimit(limit: number | undefined): number {
  if (limit === undefined || !Number.isFinite(limit)) {
    return TNG_FLOW_HISTORY_DEFAULT_LIMIT;
  }
  return Math.max(1, Math.floor(limit));
}

function limitSnapshots<TNodeData, TConnectionData>(
  snapshots: readonly TngFlowHistorySnapshot<TNodeData, TConnectionData>[],
  limit: number,
): readonly TngFlowHistorySnapshot<TNodeData, TConnectionData>[] {
  return snapshots.length <= limit ? snapshots : snapshots.slice(snapshots.length - limit);
}
