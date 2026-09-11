import type { TngFlowDefinition, TngFlowSelection } from '@tailng-ui/flow';
import { describe, expect, it } from 'vitest';
import {
  applyFlowExecutionGraphConnectionCreate,
  applyFlowExecutionGraphConnectionReconnect,
  applyFlowExecutionGraphConnectionRoutingChange,
  applyFlowExecutionGraphConnectionsDelete,
  applyFlowExecutionGraphNodeMoves,
} from './flow-execution-graph-editing';

const definition: TngFlowDefinition<unknown> = Object.freeze({
  id: 'editable-execution',
  nodes: Object.freeze([
    Object.freeze({ id: 'source', type: 'task', name: 'Source', position: { x: 0, y: 0 } }),
    Object.freeze({ id: 'target', type: 'task', name: 'Target', position: { x: 300, y: 0 } }),
  ]),
  connections: Object.freeze([]),
});

const emptySelection: TngFlowSelection = {
  nodeIds: new Set(),
  connectionIds: new Set(),
};

describe('flow execution graph controlled editing', () => {
  it('moves nodes without mutating the input definition', () => {
    const moved = applyFlowExecutionGraphNodeMoves(definition, {
      nodes: [{ id: 'source', position: { x: 48, y: 32 } }],
    });

    expect(moved.nodes[0]?.position).toEqual({ x: 48, y: 32 });
    expect(definition.nodes[0]?.position).toEqual({ x: 0, y: 0 });
  });

  it('creates, reconnects, and deletes a persisted custom-point connection', () => {
    const created = applyFlowExecutionGraphConnectionCreate(definition, {
      source: { nodeId: 'source', portId: 'custom-point-out-right-1' },
      target: { nodeId: 'target', portId: 'custom-point-in-left-1' },
    });

    expect(created.definition.connections).toEqual([
      {
        id: 'docs-connection-1',
        source: { nodeId: 'source', portId: 'custom-point-out-right-1' },
        target: { nodeId: 'target', portId: 'custom-point-in-left-1' },
        routing: { type: 'bezier' },
      },
    ]);
    expect(created.definition.nodes[0]?.ports?.map((port) => port.id)).toContain(
      'custom-point-out-right-1',
    );
    expect(created.definition.nodes[1]?.ports?.map((port) => port.id)).toContain(
      'custom-point-in-left-1',
    );
    expect(created.selection.connectionIds).toEqual(new Set(['docs-connection-1']));

    const reconnected = applyFlowExecutionGraphConnectionReconnect(
      created.definition,
      created.selection,
      {
        connectionId: 'docs-connection-1',
        previousSource: created.definition.connections[0].source,
        previousTarget: created.definition.connections[0].target,
        source: { nodeId: 'source', portId: 'custom-point-out-bottom-1' },
        target: { nodeId: 'target', portId: 'custom-point-in-top-1' },
        changedEndpoint: 'target',
      },
    );

    expect(reconnected.definition.connections[0]).toMatchObject({
      source: { nodeId: 'source', portId: 'custom-point-out-bottom-1' },
      target: { nodeId: 'target', portId: 'custom-point-in-top-1' },
    });
    expect(reconnected.definition.nodes[0]?.ports?.map((port) => port.id)).not.toContain(
      'custom-point-out-right-1',
    );

    const deleted = applyFlowExecutionGraphConnectionsDelete(
      reconnected.definition,
      reconnected.selection,
      { connectionIds: ['docs-connection-1'] },
    );

    expect(deleted.definition.connections).toEqual([]);
    expect(deleted.definition.nodes.flatMap((node) => node.ports ?? [])).toEqual([]);
    expect(deleted.selection).toEqual(emptySelection);
    expect(definition.connections).toEqual([]);
  });

  it('changes selected connection routing without dropping other connection options', () => {
    const created = applyFlowExecutionGraphConnectionCreate(definition, {
      source: { nodeId: 'source', portId: 'custom-point-out-right-1' },
      target: { nodeId: 'target', portId: 'custom-point-in-left-1' },
    });
    const withOptions: TngFlowDefinition<unknown> = {
      ...created.definition,
      connections: created.definition.connections.map((connection) => ({
        ...connection,
        routing: { ...connection.routing, offset: 24, waypoints: [{ x: 150, y: 20 }] },
        targetMarker: 'arrow',
      })),
    };

    const changed = applyFlowExecutionGraphConnectionRoutingChange(withOptions, {
      connectionIds: ['docs-connection-1'],
      type: 'orthogonal-rounded',
      source: 'controls',
    });

    expect(changed.connections[0]).toMatchObject({
      routing: {
        type: 'orthogonal-rounded',
        offset: 24,
        waypoints: [{ x: 150, y: 20 }],
      },
      targetMarker: 'arrow',
    });
    expect(withOptions.connections[0]?.routing?.type).toBe('bezier');
  });
});
