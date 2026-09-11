import type {
  TngFlowConnection,
  TngFlowConnectionCreateRequest,
  TngFlowDefinition,
  TngFlowEndpoint,
  TngFlowNode,
  TngFlowPort,
  TngFlowPortDirection,
  TngFlowPortSide,
} from '../types/tng-flow.types';
import { getTngFlowNodePorts } from './tng-flow-graph';

export const TNG_FLOW_CUSTOM_POINT_PREFIX = 'custom-point-';
export const TNG_FLOW_CUSTOM_POINTS_PER_SIDE = 3;

const CUSTOM_POINT_SIDES: readonly TngFlowPortSide[] = Object.freeze([
  'left',
  'right',
  'top',
  'bottom',
]);

const CUSTOM_POINT_ID_PATTERN =
  /^custom-point-(out|in)-(left|right|top|bottom)-([0-2])$/;

export type TngFlowCustomPointSlot = Readonly<{
  id: string;
  direction: TngFlowPortDirection;
  side: TngFlowPortSide;
  index: number;
}>;

export type TngFlowSemanticConnectionHandles = Readonly<{
  sourceHandle?: string;
  targetHandle?: string;
}>;

export type TngFlowSemanticHandleConnectionData = Readonly<{
  sourceHandle?: string;
  targetHandle?: string;
}>;

export type TngFlowSemanticConnectionCreateRequest = TngFlowConnectionCreateRequest &
  Readonly<{
    data: TngFlowSemanticHandleConnectionData;
  }>;

export function createTngFlowCustomPointId(
  direction: TngFlowPortDirection,
  side: TngFlowPortSide,
  index: number,
): string {
  const role = direction === 'input' ? 'in' : 'out';
  return `${TNG_FLOW_CUSTOM_POINT_PREFIX}${role}-${side}-${index}`;
}

export function parseTngFlowCustomPointId(portId: string): TngFlowCustomPointSlot | undefined {
  const match = CUSTOM_POINT_ID_PATTERN.exec(portId);
  if (match === null) {
    return undefined;
  }
  return {
    id: portId,
    direction: match[1] === 'in' ? 'input' : 'output',
    side: match[2] as TngFlowPortSide,
    index: Number(match[3]),
  };
}

export function isTngFlowCustomPointPortId(portId: string): boolean {
  return parseTngFlowCustomPointId(portId) !== undefined;
}

export function createTngFlowCustomPointPort(slot: TngFlowCustomPointSlot): TngFlowPort {
  return {
    id: slot.id,
    direction: slot.direction,
    kind: 'data',
    side: slot.side,
    multiple: false,
  };
}

export function createTngFlowSemanticHandleData(
  handles: TngFlowSemanticConnectionHandles,
): TngFlowSemanticHandleConnectionData {
  return compactTngFlowSemanticHandles(handles);
}

export function createTngFlowSemanticConnectionCreateRequest(
  request: TngFlowConnectionCreateRequest,
  handles: TngFlowSemanticConnectionHandles,
): TngFlowSemanticConnectionCreateRequest {
  return {
    ...request,
    data: createTngFlowSemanticHandleData(handles),
  };
}

export function applyTngFlowSemanticHandles<TConnectionData extends Record<string, unknown>>(
  connection: TngFlowConnection<TConnectionData>,
  handles: TngFlowSemanticConnectionHandles,
): TngFlowConnection<TConnectionData & TngFlowSemanticHandleConnectionData> {
  return {
    ...connection,
    data: {
      ...(connection.data ?? {}),
      ...compactTngFlowSemanticHandles(handles),
    } as TConnectionData & TngFlowSemanticHandleConnectionData,
  };
}

export function resolveTngFlowSemanticHandles(
  connection: TngFlowConnection<unknown>,
): TngFlowSemanticHandleConnectionData {
  if (!isRecord(connection.data)) {
    return {};
  }
  return compactTngFlowSemanticHandles({
    sourceHandle: stringValue(connection.data['sourceHandle']),
    targetHandle: stringValue(connection.data['targetHandle']),
  });
}

/** Full 3-per-side out+in grid (24 ports). */
export function createTngFlowCustomPointGrid(): readonly TngFlowPort[] {
  const ports: TngFlowPort[] = [];
  for (const side of CUSTOM_POINT_SIDES) {
    for (let index = 0; index < TNG_FLOW_CUSTOM_POINTS_PER_SIDE; index += 1) {
      for (const direction of ['output', 'input'] as const) {
        const id = createTngFlowCustomPointId(direction, side, index);
        ports.push(
          createTngFlowCustomPointPort({
            id,
            direction,
            side,
            index,
          }),
        );
      }
    }
  }
  return Object.freeze(ports);
}

/**
 * Merges definition ports with the synthetic custom-point grid.
 * Existing ports with the same id win (already persisted slots).
 */
export function mergeTngFlowCustomPointPorts(
  existing: readonly TngFlowPort[],
): readonly TngFlowPort[] {
  const byId = new Map(existing.map((port) => [port.id, port]));
  for (const synthetic of createTngFlowCustomPointGrid()) {
    if (!byId.has(synthetic.id)) {
      byId.set(synthetic.id, synthetic);
    }
  }
  return [...byId.values()];
}

/**
 * Ensures nodes include ports for the given custom-point endpoints.
 */
export function ensureTngFlowCustomPointPorts<TNodeData = unknown>(
  nodes: readonly TngFlowNode<TNodeData>[],
  endpoints: readonly TngFlowEndpoint[],
): readonly TngFlowNode<TNodeData>[] {
  const neededByNode = new Map<string, TngFlowPort[]>();
  for (const endpoint of endpoints) {
    const slot = parseTngFlowCustomPointId(endpoint.portId);
    if (slot === undefined) {
      continue;
    }
    const list = neededByNode.get(endpoint.nodeId) ?? [];
    if (!list.some((port) => port.id === slot.id)) {
      list.push(createTngFlowCustomPointPort(slot));
    }
    neededByNode.set(endpoint.nodeId, list);
  }
  if (neededByNode.size === 0) {
    return nodes;
  }

  return nodes.map((node) => {
    const needed = neededByNode.get(node.id);
    if (needed === undefined) {
      return node;
    }
    const existing = getTngFlowNodePorts(node);
    const existingIds = new Set(existing.map((port) => port.id));
    const toAdd = needed.filter((port) => !existingIds.has(port.id));
    return toAdd.length === 0 ? node : { ...node, ports: [...existing, ...toAdd] };
  });
}

/**
 * Removes custom-point ports that are not referenced by any connection.
 */
export function pruneUnusedTngFlowCustomPointPorts<
  TNodeData = unknown,
  TConnectionData = unknown,
>(
  definition: TngFlowDefinition<TNodeData, TConnectionData>,
): TngFlowDefinition<TNodeData, TConnectionData> {
  const usedPorts = new Set(
    definition.connections.flatMap((connection) => [
      `${connection.source.nodeId}:${connection.source.portId}`,
      `${connection.target.nodeId}:${connection.target.portId}`,
    ]),
  );

  return {
    ...definition,
    nodes: definition.nodes.map((node) => ({
      ...node,
      ports: getTngFlowNodePorts(node).filter(
        (port) =>
          !isTngFlowCustomPointPortId(port.id) || usedPorts.has(`${node.id}:${port.id}`),
      ),
    })),
  };
}

function compactTngFlowSemanticHandles(
  handles: TngFlowSemanticConnectionHandles,
): TngFlowSemanticHandleConnectionData {
  const result: { sourceHandle?: string; targetHandle?: string } = {};
  if (handles.sourceHandle !== undefined && handles.sourceHandle !== '') {
    result.sourceHandle = handles.sourceHandle;
  }
  if (handles.targetHandle !== undefined && handles.targetHandle !== '') {
    result.targetHandle = handles.targetHandle;
  }
  return result;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function stringValue(value: unknown): string | undefined {
  return typeof value === 'string' ? value : undefined;
}
