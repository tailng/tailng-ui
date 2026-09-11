import {
  ensureTngFlowCustomPointPorts,
  pruneUnusedTngFlowCustomPointPorts,
  type TngFlowConnectionCreateRequest,
  type TngFlowConnectionReconnectRequest,
  type TngFlowConnectionsDeleteRequest,
  type TngFlowDefinition,
  type TngFlowNodesMovedEvent,
  type TngFlowSelection,
} from '@tailng-ui/flow';

export type FlowExecutionGraphControlledUpdate = Readonly<{
  definition: TngFlowDefinition<unknown>;
  selection: TngFlowSelection;
}>;

export function applyFlowExecutionGraphNodeMoves(
  definition: TngFlowDefinition<unknown>,
  event: TngFlowNodesMovedEvent,
): TngFlowDefinition<unknown> {
  const positions = new Map(event.nodes.map((move) => [move.id, move.position]));
  return {
    ...definition,
    nodes: definition.nodes.map((node) => {
      const position = positions.get(node.id);
      return position === undefined ? node : { ...node, position };
    }),
  };
}

export function applyFlowExecutionGraphConnectionCreate(
  definition: TngFlowDefinition<unknown>,
  request: TngFlowConnectionCreateRequest,
): FlowExecutionGraphControlledUpdate {
  const id = nextConnectionId(definition);
  const nodes = ensureTngFlowCustomPointPorts(definition.nodes, [request.source, request.target]);
  return {
    definition: {
      ...definition,
      nodes,
      connections: [
        ...definition.connections,
        {
          id,
          source: request.source,
          target: request.target,
          routing: { type: 'bezier' },
        },
      ],
    },
    selection: {
      nodeIds: new Set(),
      connectionIds: new Set([id]),
    },
  };
}

export function applyFlowExecutionGraphConnectionReconnect(
  definition: TngFlowDefinition<unknown>,
  selection: TngFlowSelection,
  request: TngFlowConnectionReconnectRequest,
): FlowExecutionGraphControlledUpdate {
  if (!definition.connections.some((connection) => connection.id === request.connectionId)) {
    return { definition, selection };
  }
  const nodes = ensureTngFlowCustomPointPorts(definition.nodes, [request.source, request.target]);
  const connections = definition.connections.map((connection) =>
    connection.id === request.connectionId
      ? { ...connection, source: request.source, target: request.target }
      : connection,
  );
  return {
    definition: pruneUnusedTngFlowCustomPointPorts({ ...definition, nodes, connections }),
    selection,
  };
}

export function applyFlowExecutionGraphConnectionsDelete(
  definition: TngFlowDefinition<unknown>,
  selection: TngFlowSelection,
  request: Pick<TngFlowConnectionsDeleteRequest, 'connectionIds'>,
): FlowExecutionGraphControlledUpdate {
  const deletedIds = new Set(request.connectionIds);
  if (deletedIds.size === 0) {
    return { definition, selection };
  }
  return {
    definition: pruneUnusedTngFlowCustomPointPorts({
      ...definition,
      connections: definition.connections.filter((connection) => !deletedIds.has(connection.id)),
    }),
    selection: {
      nodeIds: new Set(selection.nodeIds),
      connectionIds: new Set(
        [...selection.connectionIds].filter((connectionId) => !deletedIds.has(connectionId)),
      ),
    },
  };
}

function nextConnectionId(definition: TngFlowDefinition<unknown>): string {
  const ids = new Set(definition.connections.map((connection) => connection.id));
  let suffix = 1;
  while (ids.has(`docs-connection-${suffix}`)) {
    suffix += 1;
  }
  return `docs-connection-${suffix}`;
}
