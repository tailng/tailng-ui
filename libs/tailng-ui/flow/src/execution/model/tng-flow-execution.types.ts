import type {
  TngFlowDefinition,
  TngFlowNode,
  TngFlowSelection,
  TngFlowViewport,
} from '../../lib/types/tng-flow.types';

export type TngFlowExecutionPhase =
  | 'idle'
  | 'pending'
  | 'active'
  | 'waiting'
  | 'succeeded'
  | 'failed'
  | 'cancelled'
  | 'skipped';

export type TngFlowExecutionViewerState = 'empty' | 'error' | 'loading' | 'ready';

export type TngFlowExecutionInspectorScope = 'auto' | 'node' | 'run';

export type TngFlowExecutionInspectorPosition = 'auto' | 'bottom' | 'right';

export type TngFlowExecutionDateTimeFormatter = (
  value: string,
  context: Readonly<{ field: 'finishedAt' | 'startedAt' | 'updatedAt' }>,
) => string;

export type TngFlowExecutionPayload<TValue = unknown> =
  | Readonly<{
      state: 'available';
      value: TValue;
      contentType?: string;
      language?: string;
      label?: string;
    }>
  | Readonly<{
      state: 'not-recorded' | 'pending' | 'redacted' | 'unavailable';
      reason?: string;
      label?: string;
    }>;

export type TngFlowNodeExecution<TPayload = unknown> = Readonly<{
  id: string;
  nodeId: string;
  activationId: string;
  attempt: number;
  maxAttempts?: number;
  phase: TngFlowExecutionPhase;
  statusMessage?: string | null;
  progress?: number | null;
  input?: TngFlowExecutionPayload<TPayload>;
  output?: TngFlowExecutionPayload<TPayload>;
  error?: TngFlowExecutionPayload<TPayload>;
  startedAt?: string;
  finishedAt?: string;
  updatedAt?: string;
  durationMs?: number;
  sequence?: number;
}>;

export type TngFlowConnectionExecution<TPayload = unknown> = Readonly<{
  id: string;
  connectionId: string;
  activationId: string;
  attempt: number;
  phase: TngFlowExecutionPhase;
  statusMessage?: string | null;
  payload?: TngFlowExecutionPayload<TPayload>;
  startedAt?: string;
  finishedAt?: string;
  updatedAt?: string;
  sequence?: number;
}>;

export type TngFlowRunExecutionSnapshot<TPayload = unknown> = Readonly<{
  id: string;
  definitionId: string;
  definitionRevision?: string;
  phase: TngFlowExecutionPhase;
  statusMessage?: string | null;
  progress?: number | null;
  input?: TngFlowExecutionPayload<TPayload>;
  output?: TngFlowExecutionPayload<TPayload>;
  error?: TngFlowExecutionPayload<TPayload>;
  startedAt?: string;
  finishedAt?: string;
  updatedAt?: string;
  durationMs?: number;
  nodeExecutions?: readonly TngFlowNodeExecution<TPayload>[];
  connectionExecutions?: readonly TngFlowConnectionExecution<TPayload>[];
}>;

export type TngFlowExecutionWarningCode =
  | 'definition-mismatch'
  | 'duplicate-execution-id'
  | 'invalid-number'
  | 'missing-connection'
  | 'missing-node';

export type TngFlowExecutionWarning = Readonly<{
  code: TngFlowExecutionWarningCode;
  message: string;
  id?: string;
}>;

export type TngFlowExecutionActivation<TPayload = unknown> = Readonly<{
  activationId: string;
  executions: readonly TngFlowNodeExecution<TPayload>[];
}>;

export type TngFlowExecutionIndex<TPayload = unknown> = Readonly<{
  definition: TngFlowDefinition | null;
  snapshot: TngFlowRunExecutionSnapshot<TPayload> | null;
  warnings: readonly TngFlowExecutionWarning[];
  nodeExecutions: readonly TngFlowNodeExecution<TPayload>[];
  connectionExecutions: readonly TngFlowConnectionExecution<TPayload>[];
  nodeExecutionsByNodeId: ReadonlyMap<string, readonly TngFlowNodeExecution<TPayload>[]>;
  connectionExecutionsByConnectionId: ReadonlyMap<
    string,
    readonly TngFlowConnectionExecution<TPayload>[]
  >;
}>;

export type TngFlowExecutionActivatedEvent<TPayload = unknown> = Readonly<{
  node: TngFlowNode | null;
  execution: TngFlowNodeExecution<TPayload> | null;
  source: 'api' | 'graph' | 'history' | 'inspector';
}>;

export type TngFlowExecutionPayloadView = Readonly<{
  title: string;
  state: TngFlowExecutionPayload['state'] | 'omitted';
  code: string;
  language: string;
  message: string | null;
}>;

export type TngFlowExecutionViewerChange<TPayload = unknown> = Readonly<{
  selection: TngFlowSelection;
  inspectedNodeId: string | null;
  selectedExecutionId: string | null;
  viewport: TngFlowViewport | null;
  snapshot: TngFlowRunExecutionSnapshot<TPayload> | null;
}>;
