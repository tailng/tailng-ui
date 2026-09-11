import { describe, expect, it } from 'vitest';
import type { TngFlowDefinition, TngFlowNode } from '../types/tng-flow.types';
import {
  applyTngFlowSemanticHandles,
  createTngFlowSemanticConnectionCreateRequest,
  createTngFlowSemanticHandleData,
  createTngFlowCustomPointGrid,
  createTngFlowCustomPointId,
  ensureTngFlowCustomPointPorts,
  isTngFlowCustomPointPortId,
  mergeTngFlowCustomPointPorts,
  parseTngFlowCustomPointId,
  pruneUnusedTngFlowCustomPointPorts,
  resolveTngFlowSemanticHandles,
  TNG_FLOW_CUSTOM_POINTS_PER_SIDE,
} from './tng-flow-custom-point';

describe('tng-flow custom point ids', () => {
  it('creates and parses slot ids', () => {
    const id = createTngFlowCustomPointId('output', 'right', 1);
    expect(id).toBe('custom-point-out-right-1');
    expect(parseTngFlowCustomPointId(id)).toEqual({
      id,
      direction: 'output',
      side: 'right',
      index: 1,
    });
  });

  it('rejects malformed ids', () => {
    expect(parseTngFlowCustomPointId('connection-output-1')).toBeUndefined();
    expect(parseTngFlowCustomPointId('custom-point-out-right-3')).toBeUndefined();
    expect(isTngFlowCustomPointPortId('custom-point-in-left-0')).toBe(true);
  });

  it('builds a full 3-per-side out+in grid', () => {
    const grid = createTngFlowCustomPointGrid();
    expect(grid).toHaveLength(4 * TNG_FLOW_CUSTOM_POINTS_PER_SIDE * 2);
    expect(grid.filter((port) => port.direction === 'output')).toHaveLength(12);
    expect(grid.filter((port) => port.direction === 'input')).toHaveLength(12);
  });

  it('merges without replacing existing ports', () => {
    const existing = [
      {
        id: 'custom-point-out-right-1',
        direction: 'output' as const,
        kind: 'data' as const,
        side: 'right' as const,
        name: 'Pinned',
      },
    ];
    const merged = mergeTngFlowCustomPointPorts(existing);
    expect(merged.find((port) => port.id === 'custom-point-out-right-1')?.name).toBe('Pinned');
    expect(merged.length).toBeGreaterThan(existing.length);
  });
});

describe('semantic custom-point handles', () => {
  it('creates compact connection data for logical handles', () => {
    expect(
      createTngFlowSemanticHandleData({
        sourceHandle: 'success',
        targetHandle: '',
      }),
    ).toEqual({ sourceHandle: 'success' });
  });

  it('keeps visual custom-point endpoints separate from logical handles', () => {
    const request = createTngFlowSemanticConnectionCreateRequest(
      {
        source: { nodeId: 'condition', portId: 'custom-point-out-right-1' },
        target: { nodeId: 'notify', portId: 'custom-point-in-left-1' },
      },
      {
        sourceHandle: 'yes',
        targetHandle: 'input',
      },
    );

    expect(request).toEqual({
      source: { nodeId: 'condition', portId: 'custom-point-out-right-1' },
      target: { nodeId: 'notify', portId: 'custom-point-in-left-1' },
      data: {
        sourceHandle: 'yes',
        targetHandle: 'input',
      },
    });
  });

  it('applies and resolves semantic handles on connection data', () => {
    const connection = applyTngFlowSemanticHandles(
      {
        id: 'condition-to-notify',
        source: { nodeId: 'condition', portId: 'custom-point-out-right-1' },
        target: { nodeId: 'notify', portId: 'custom-point-in-left-1' },
        data: { ruleId: 'primary' },
      },
      { sourceHandle: 'success', targetHandle: 'caseId' },
    );

    expect(connection.data).toEqual({
      ruleId: 'primary',
      sourceHandle: 'success',
      targetHandle: 'caseId',
    });
    expect(resolveTngFlowSemanticHandles(connection)).toEqual({
      sourceHandle: 'success',
      targetHandle: 'caseId',
    });
  });
});

describe('ensureTngFlowCustomPointPorts', () => {
  it('adds missing custom-point ports and leaves others unchanged', () => {
    const nodes: readonly TngFlowNode[] = [
      {
        id: 'a',
        type: 'step',
        name: 'A',
        position: { x: 0, y: 0 },
        ports: [],
      },
      {
        id: 'b',
        type: 'step',
        name: 'B',
        position: { x: 100, y: 0 },
        ports: [
          {
            id: 'custom-point-in-left-0',
            direction: 'input',
            kind: 'data',
            side: 'left',
          },
        ],
      },
    ];

    const next = ensureTngFlowCustomPointPorts(nodes, [
      { nodeId: 'a', portId: 'custom-point-out-right-2' },
      { nodeId: 'b', portId: 'custom-point-in-left-0' },
      { nodeId: 'b', portId: 'ordinary' },
    ]);

    expect(next[0].ports?.map((port) => port.id)).toEqual(['custom-point-out-right-2']);
    expect(next[0].ports?.[0]).toMatchObject({
      direction: 'output',
      side: 'right',
    });
    expect(next[1].ports?.map((port) => port.id)).toEqual(['custom-point-in-left-0']);
  });
});

describe('pruneUnusedTngFlowCustomPointPorts', () => {
  it('removes unused custom-point ports', () => {
    const definition: TngFlowDefinition = {
      id: 'flow',
      nodes: [
        {
          id: 'a',
          type: 'step',
          name: 'A',
          position: { x: 0, y: 0 },
          ports: [
            {
              id: 'custom-point-out-right-0',
              direction: 'output',
              kind: 'data',
              side: 'right',
            },
            {
              id: 'custom-point-out-right-1',
              direction: 'output',
              kind: 'data',
              side: 'right',
            },
            { id: 'keep', direction: 'output', kind: 'data' },
          ],
        },
        {
          id: 'b',
          type: 'step',
          name: 'B',
          position: { x: 100, y: 0 },
          ports: [
            {
              id: 'custom-point-in-left-0',
              direction: 'input',
              kind: 'data',
              side: 'left',
            },
          ],
        },
      ],
      connections: [
        {
          id: 'a-to-b',
          source: { nodeId: 'a', portId: 'custom-point-out-right-0' },
          target: { nodeId: 'b', portId: 'custom-point-in-left-0' },
        },
      ],
    };

    const pruned = pruneUnusedTngFlowCustomPointPorts(definition);
    expect(pruned.nodes[0].ports?.map((port) => port.id)).toEqual([
      'custom-point-out-right-0',
      'keep',
    ]);
    expect(pruned.nodes[1].ports?.map((port) => port.id)).toEqual(['custom-point-in-left-0']);
  });
});
