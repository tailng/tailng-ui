import { describe, expect, it } from 'vitest';
import {
  createTngFlowExecutionIndex,
  createTngFlowExecutionPresentation,
  formatTngFlowExecutionDateTime,
  formatTngFlowExecutionDuration,
  formatTngFlowExecutionPayload,
  groupTngFlowNodeExecutionsByActivation,
  resolveTngFlowExecutionInspectedNodeId,
  resolveTngFlowSelectedExecution,
  sortTngFlowNodeExecutions,
} from './tng-flow-execution.model';
import type { TngFlowNodeExecution, TngFlowRunExecutionSnapshot } from './tng-flow-execution.types';
import type { TngFlowDefinition, TngFlowSelection } from '../../lib/types/tng-flow.types';

const definition: TngFlowDefinition = {
  id: 'workflow',
  nodes: [
    { id: 'start', type: 'trigger', name: 'Start', position: { x: 0, y: 0 } },
    { id: 'task', type: 'task', name: 'Task', position: { x: 220, y: 0 } },
  ],
  connections: [
    {
      id: 'start-to-task',
      source: { nodeId: 'start', portId: 'out' },
      target: { nodeId: 'task', portId: 'in' },
    },
  ],
};

const selection = (nodeIds: readonly string[]): TngFlowSelection => ({
  nodeIds: new Set(nodeIds),
  connectionIds: new Set(),
});

describe('flow execution model', () => {
  it('ignores snapshots for a different definition', () => {
    const index = createTngFlowExecutionIndex(definition, {
      id: 'run',
      definitionId: 'other',
      phase: 'active',
      nodeExecutions: [
        { id: 'exec-1', nodeId: 'start', activationId: 'a1', attempt: 1, phase: 'active' },
      ],
    });

    expect(index.snapshot).toBeNull();
    expect(index.nodeExecutions).toHaveLength(0);
    expect(index.warnings).toContainEqual(
      expect.objectContaining({ code: 'definition-mismatch', id: 'run' }),
    );
  });

  it('keeps the first duplicate execution id and excludes missing references', () => {
    const snapshot: TngFlowRunExecutionSnapshot = {
      id: 'run',
      definitionId: 'workflow',
      phase: 'active',
      nodeExecutions: [
        { id: 'same', nodeId: 'start', activationId: 'a1', attempt: 1, phase: 'succeeded' },
        { id: 'same', nodeId: 'task', activationId: 'a1', attempt: 2, phase: 'active' },
        { id: 'missing', nodeId: 'missing-node', activationId: 'a1', attempt: 1, phase: 'active' },
      ],
    };

    const index = createTngFlowExecutionIndex(definition, snapshot);

    expect(index.nodeExecutions.map((execution) => execution.id)).toEqual(['same']);
    expect(index.warnings.map((warning) => warning.code)).toEqual([
      'duplicate-execution-id',
      'missing-node',
    ]);
  });

  it('sorts executions by active phase, sequence, recency, attempt and id', () => {
    const executions: readonly TngFlowNodeExecution[] = [
      {
        id: 'old-active',
        nodeId: 'task',
        activationId: 'a1',
        attempt: 1,
        phase: 'active',
        updatedAt: '2026-01-01T00:00:00Z',
      },
      {
        id: 'new-success',
        nodeId: 'task',
        activationId: 'a2',
        attempt: 3,
        phase: 'succeeded',
        sequence: 99,
      },
      {
        id: 'sequenced-active',
        nodeId: 'task',
        activationId: 'a3',
        attempt: 1,
        phase: 'active',
        sequence: 2,
      },
      {
        id: 'later-sequenced-active',
        nodeId: 'task',
        activationId: 'a3',
        attempt: 2,
        phase: 'active',
        sequence: 3,
      },
    ];

    expect(sortTngFlowNodeExecutions(executions).map((execution) => execution.id)).toEqual([
      'later-sequenced-active',
      'sequenced-active',
      'old-active',
      'new-success',
    ]);
  });

  it('groups retry attempts inside activations', () => {
    const groups = groupTngFlowNodeExecutionsByActivation([
      { id: 'a2-1', nodeId: 'task', activationId: 'a2', attempt: 1, phase: 'succeeded' },
      { id: 'a1-2', nodeId: 'task', activationId: 'a1', attempt: 2, phase: 'failed' },
      { id: 'a1-1', nodeId: 'task', activationId: 'a1', attempt: 1, phase: 'failed' },
    ]);

    expect(groups).toHaveLength(2);
    expect(groups[0].activationId).toBe('a1');
    expect(groups[0].executions.map((execution) => execution.attempt)).toEqual([2, 1]);
  });

  it('projects node and connection execution state into flow presentation', () => {
    const index = createTngFlowExecutionIndex(definition, {
      id: 'run',
      definitionId: 'workflow',
      phase: 'active',
      nodeExecutions: [
        {
          id: 'exec-1',
          nodeId: 'task',
          activationId: 'a1',
          attempt: 1,
          phase: 'active',
          progress: null,
          statusMessage: 'Calling service',
        },
      ],
      connectionExecutions: [
        {
          id: 'conn-1',
          connectionId: 'start-to-task',
          activationId: 'a1',
          attempt: 1,
          phase: 'active',
        },
      ],
    });

    const presentation = createTngFlowExecutionPresentation(definition, index, 'explicit');

    expect(presentation.nodes?.task).toMatchObject({
      status: 'running',
      progress: null,
      statusMessage: 'Calling service',
      highlighted: true,
    });
    expect(presentation.connections?.['start-to-task']).toMatchObject({
      status: 'active',
      motion: 'flow',
    });
  });

  it('omits progress presentation when explicit mode receives no progress field', () => {
    const index = createTngFlowExecutionIndex(definition, {
      id: 'run',
      definitionId: 'workflow',
      phase: 'active',
      nodeExecutions: [
        {
          id: 'exec-1',
          nodeId: 'task',
          activationId: 'a1',
          attempt: 1,
          phase: 'active',
        },
      ],
    });

    const presentation = createTngFlowExecutionPresentation(definition, index, 'explicit');

    expect(Object.prototype.hasOwnProperty.call(presentation.nodes?.task, 'progress')).toBe(false);
  });

  it('treats an undefined progress field as unspecified in explicit mode', () => {
    const index = createTngFlowExecutionIndex(definition, {
      id: 'run',
      definitionId: 'workflow',
      phase: 'succeeded',
      nodeExecutions: [
        {
          id: 'exec-1',
          nodeId: 'task',
          activationId: 'a1',
          attempt: 1,
          phase: 'succeeded',
          progress: undefined,
        },
      ],
    });

    const presentation = createTngFlowExecutionPresentation(definition, index, 'explicit');

    expect(Object.prototype.hasOwnProperty.call(presentation.nodes?.task, 'progress')).toBe(false);
  });

  it('resolves inspected nodes and selected executions independently', () => {
    expect(resolveTngFlowExecutionInspectedNodeId(definition, selection(['task']), null)).toBe(
      'task',
    );
    expect(resolveTngFlowExecutionInspectedNodeId(definition, selection(['task']), 'start')).toBe(
      'start',
    );
    expect(
      resolveTngFlowSelectedExecution(
        [
          { id: 'first', nodeId: 'task', activationId: 'a1', attempt: 1, phase: 'active' },
          { id: 'second', nodeId: 'task', activationId: 'a1', attempt: 2, phase: 'failed' },
        ],
        'missing',
      )?.id,
    ).toBe('first');
  });

  it('formats payloads, timestamps and durations', () => {
    expect(
      formatTngFlowExecutionPayload({ state: 'available', value: { ok: true } }, 'Output'),
    ).toMatchObject({ language: 'json', code: '{\n  "ok": true\n}' });
    expect(
      formatTngFlowExecutionPayload({ state: 'redacted', reason: 'Hidden' }, 'Error'),
    ).toMatchObject({ state: 'redacted', message: 'Hidden' });
    expect(formatTngFlowExecutionPayload({ state: 'not-recorded' }, 'Input')).toMatchObject({
      state: 'not-recorded',
      message: 'Not recorded',
    });
    expect(
      formatTngFlowExecutionDateTime(
        '2026-01-01T00:00:00Z',
        'startedAt',
        (value, context) => `${context.field}:${value}`,
      ),
    ).toBe('startedAt:2026-01-01T00:00:00Z');
    expect(formatTngFlowExecutionDuration({ durationMs: 1250 })).toBe('1.3 s');
  });
});
