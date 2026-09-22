import { createTngFlowConnectorId } from '../model/tng-flow-connector-id';
import {
  createTngFlowGraphIndex,
  getTngFlowNodePorts,
  tngFlowConnectionPairKey,
  type TngFlowGraphIndex,
  type TngFlowPortRecord,
} from '../model/tng-flow-graph';
import type {
  TngFlowConnectionLabelOptions,
  TngFlowConnectionLabelPlacement,
  TngFlowConnectionMarker,
  TngFlowConnectionPathType,
  TngFlowConnectionRouting,
} from '../types/tng-flow-connection.types';
import type {
  TngFlowStructuralIssueCode,
  TngFlowValidationIssue,
  TngFlowValidationSeverity,
  TngFlowValidationTarget,
} from '../types/tng-flow-validation.types';
import type {
  TngFlowConnection,
  TngFlowConnectionType,
  TngFlowDefinition,
  TngFlowEndpoint,
  TngFlowNode,
  TngFlowPort,
  TngFlowPortDirection,
  TngFlowPortKind,
  TngFlowPortSide,
} from '../types/tng-flow.types';

/** @deprecated Use `TngFlowStructuralIssueCode`. */
export type TngFlowValidationIssueCode = TngFlowStructuralIssueCode;
export type { TngFlowValidationIssue } from '../types/tng-flow-validation.types';

export type TngFlowAnalysis<TNodeData = unknown, TConnectionData = unknown> = Readonly<{
  nodes: readonly TngFlowNode<TNodeData>[];
  connections: readonly TngFlowConnection<TConnectionData>[];
  index: TngFlowGraphIndex<TNodeData, TConnectionData>;
  issues: readonly TngFlowValidationIssue[];
}>;

type UnknownRecord = Record<string, unknown>;
type MutableAnalysis<TNodeData, TConnectionData> = {
  nodes: TngFlowNode<TNodeData>[];
  connections: TngFlowConnection<TConnectionData>[];
  issues: TngFlowValidationIssue[];
};

const CONNECTION_TYPES: readonly TngFlowConnectionType[] = [
  'adaptive-curve',
  'bezier',
  'segment',
  'straight',
];
const CONNECTION_PATH_TYPES: readonly TngFlowConnectionPathType[] = [
  'adaptive',
  'bezier',
  'orthogonal',
  'orthogonal-rounded',
  'straight',
];
const CONNECTION_MARKERS: readonly TngFlowConnectionMarker[] = [
  'arrow',
  'circle',
  'diamond',
  'none',
];
const CONNECTION_LABEL_PLACEMENTS: readonly TngFlowConnectionLabelPlacement[] = [
  'center',
  'end',
  'start',
];
const PORT_DIRECTIONS: readonly TngFlowPortDirection[] = ['input', 'output'];
const PORT_KINDS: readonly TngFlowPortKind[] = ['control', 'data', 'error'];
const PORT_SIDES: readonly TngFlowPortSide[] = ['bottom', 'left', 'right', 'top'];

function isRecord(value: unknown): value is UnknownRecord {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function encoded(value: string | number): string {
  return encodeURIComponent(String(value));
}

function addIssue(
  issues: TngFlowValidationIssue[],
  code: TngFlowStructuralIssueCode,
  message: string,
  target: TngFlowValidationTarget,
  identity: string,
  severity: TngFlowValidationSeverity = 'error',
): void {
  issues.push({
    id: `tailng:${code}:${identity}`,
    code,
    severity,
    message,
    target,
  });
}

function optionalString(record: UnknownRecord, key: string): string | undefined {
  const value = record[key];
  return typeof value === 'string' ? value : undefined;
}

function optionalNonEmptyString(record: UnknownRecord, key: string): string | undefined {
  const value = optionalString(record, key)?.trim();
  return value === undefined || value.length === 0 ? undefined : value;
}

function optionalBoolean(record: UnknownRecord, key: string): boolean | undefined {
  const value = record[key];
  return typeof value === 'boolean' ? value : undefined;
}

function optionalFiniteNumber(record: UnknownRecord, key: string): number | undefined {
  const value = record[key];
  return typeof value === 'number' && Number.isFinite(value) ? value : undefined;
}

function sanitizeConnectionRouting(value: unknown): TngFlowConnectionRouting | undefined {
  if (!isRecord(value)) {
    return undefined;
  }
  const rawType = value['type'];
  const type =
    typeof rawType === 'string' &&
    CONNECTION_PATH_TYPES.includes(rawType as TngFlowConnectionPathType)
      ? (rawType as TngFlowConnectionPathType)
      : undefined;
  const rawWaypoints = value['waypoints'];
  const waypoints = Array.isArray(rawWaypoints)
    ? rawWaypoints
        .filter(
          (point): point is UnknownRecord =>
            isRecord(point) &&
            typeof point['x'] === 'number' &&
            Number.isFinite(point['x']) &&
            typeof point['y'] === 'number' &&
            Number.isFinite(point['y']),
        )
        .map((point) => ({ x: point['x'] as number, y: point['y'] as number }))
    : undefined;
  const offset = optionalFiniteNumber(value, 'offset');
  const radius = optionalFiniteNumber(value, 'radius');
  return type === undefined &&
    offset === undefined &&
    radius === undefined &&
    waypoints === undefined
    ? undefined
    : { type, offset, radius, waypoints };
}

function sanitizeConnectionMarker(value: unknown): TngFlowConnectionMarker | undefined {
  return typeof value === 'string' && CONNECTION_MARKERS.includes(value as TngFlowConnectionMarker)
    ? (value as TngFlowConnectionMarker)
    : undefined;
}

function sanitizeConnectionLabelOptions(value: unknown): TngFlowConnectionLabelOptions | undefined {
  if (!isRecord(value)) {
    return undefined;
  }
  const rawPlacement = value['placement'];
  const placement =
    typeof rawPlacement === 'string' &&
    CONNECTION_LABEL_PLACEMENTS.includes(rawPlacement as TngFlowConnectionLabelPlacement)
      ? (rawPlacement as TngFlowConnectionLabelPlacement)
      : undefined;
  const offset = optionalFiniteNumber(value, 'offset');
  const offsetX = optionalFiniteNumber(value, 'offsetX');
  const offsetY = optionalFiniteNumber(value, 'offsetY');
  return placement === undefined &&
    offset === undefined &&
    offsetX === undefined &&
    offsetY === undefined
    ? undefined
    : { placement, offset, offsetX, offsetY };
}

function optionalStringArray(record: UnknownRecord, key: string): readonly string[] | undefined {
  const value = record[key];
  return Array.isArray(value)
    ? value.filter((item): item is string => typeof item === 'string')
    : undefined;
}

function sanitizePort(
  rawPort: unknown,
  nodeId: string,
  fallbackDirection: TngFlowPortDirection | undefined,
  index: number,
  issues: TngFlowValidationIssue[],
): TngFlowPort | undefined {
  if (!isRecord(rawPort)) {
    addIssue(
      issues,
      'invalid-port-record',
      `Node "${nodeId}" contains a malformed port record.`,
      { kind: 'node', nodeId },
      `${encoded(nodeId)}:${index}`,
    );
    return undefined;
  }

  const id = typeof rawPort['id'] === 'string' ? rawPort['id'].trim() : '';
  if (id.length === 0) {
    addIssue(
      issues,
      'empty-port-id',
      `Node "${nodeId}" contains a port with an empty id.`,
      { kind: 'node', nodeId },
      `${encoded(nodeId)}:${index}`,
    );
    return undefined;
  }

  const rawDirection = rawPort['direction'];
  const direction =
    typeof rawDirection === 'string' &&
    PORT_DIRECTIONS.includes(rawDirection as TngFlowPortDirection)
      ? (rawDirection as TngFlowPortDirection)
      : fallbackDirection;
  if (direction === undefined) {
    addIssue(
      issues,
      'invalid-port-direction',
      `Port "${id}" on node "${nodeId}" has an invalid direction.`,
      { kind: 'port', nodeId, portId: id },
      `${encoded(nodeId)}:${encoded(id)}`,
    );
    return undefined;
  }

  const rawKind = rawPort['kind'];
  const kind =
    typeof rawKind === 'string' && PORT_KINDS.includes(rawKind as TngFlowPortKind)
      ? (rawKind as TngFlowPortKind)
      : 'data';
  const rawSide = rawPort['side'];
  const side =
    typeof rawSide === 'string' && PORT_SIDES.includes(rawSide as TngFlowPortSide)
      ? (rawSide as TngFlowPortSide)
      : undefined;

  return {
    id,
    direction,
    kind,
    name: optionalString(rawPort, 'name'),
    label: optionalString(rawPort, 'label'),
    dataType: optionalString(rawPort, 'dataType'),
    category: optionalString(rawPort, 'category'),
    required: optionalBoolean(rawPort, 'required'),
    disabled: optionalBoolean(rawPort, 'disabled'),
    multiple: optionalBoolean(rawPort, 'multiple'),
    accepts: optionalStringArray(rawPort, 'accepts'),
    allowSelfConnection: optionalBoolean(rawPort, 'allowSelfConnection'),
    side,
  };
}

function sanitizePorts(
  node: UnknownRecord,
  nodeId: string,
  issues: TngFlowValidationIssue[],
): readonly TngFlowPort[] {
  const usesCanonicalPorts = Array.isArray(node['ports']);
  const hasLegacyPorts = Array.isArray(node['inputs']) || Array.isArray(node['outputs']);
  if (usesCanonicalPorts && hasLegacyPorts) {
    addIssue(
      issues,
      'mixed-port-model',
      `Node "${nodeId}" mixes canonical ports with legacy inputs or outputs.`,
      { kind: 'node', nodeId },
      encoded(nodeId),
    );
  }

  const rawPorts: readonly Readonly<{ value: unknown; direction?: TngFlowPortDirection }>[] =
    usesCanonicalPorts
      ? (node['ports'] as unknown[]).map((value) => ({ value }))
      : [
          ...(Array.isArray(node['inputs'])
            ? (node['inputs'] as unknown[]).map((value) => ({
                value,
                direction: 'input' as const,
              }))
            : []),
          ...(Array.isArray(node['outputs'])
            ? (node['outputs'] as unknown[]).map((value) => ({
                value,
                direction: 'output' as const,
              }))
            : []),
        ];
  const ids = new Set<string>();
  const ports: TngFlowPort[] = [];

  rawPorts.forEach((raw, index) => {
    const port = sanitizePort(raw.value, nodeId, raw.direction, index, issues);
    if (port === undefined) {
      return;
    }
    if (ids.has(port.id)) {
      addIssue(
        issues,
        'duplicate-port-id',
        `Port id "${port.id}" is used more than once on node "${nodeId}".`,
        { kind: 'port', nodeId, portId: port.id },
        `${encoded(nodeId)}:${encoded(port.id)}:${index}`,
      );
      return;
    }
    ids.add(port.id);
    ports.push(port);
  });

  return ports;
}

function sanitizeNode<TNodeData>(
  rawNode: unknown,
  index: number,
  nodesById: Map<string, TngFlowNode<TNodeData>>,
  issues: TngFlowValidationIssue[],
): TngFlowNode<TNodeData> | undefined {
  if (!isRecord(rawNode)) {
    addIssue(
      issues,
      'invalid-node-record',
      'The definition contains a malformed node record.',
      { kind: 'flow' },
      String(index),
    );
    return undefined;
  }

  const id = typeof rawNode['id'] === 'string' ? rawNode['id'].trim() : '';
  if (id.length === 0) {
    addIssue(issues, 'empty-node-id', 'A node has an empty id.', { kind: 'flow' }, String(index));
    return undefined;
  }
  const ports = sanitizePorts(rawNode, id, issues);
  const existingNode = nodesById.get(id);
  if (existingNode !== undefined) {
    addIssue(
      issues,
      'duplicate-node-id',
      `Node id "${id}" is used more than once.`,
      { kind: 'flow' },
      `${encoded(id)}:${index}`,
    );
    const existingPortIds = new Set(getTngFlowNodePorts(existingNode).map((port) => port.id));
    for (const port of ports) {
      if (existingPortIds.has(port.id)) {
        addIssue(
          issues,
          'duplicate-port-id',
          `Port id "${port.id}" is used more than once on node "${id}".`,
          { kind: 'port', nodeId: id, portId: port.id },
          `${encoded(id)}:${encoded(port.id)}:${index}`,
        );
      }
    }
    return undefined;
  }

  const rawPosition = rawNode['position'];
  const hasValidPosition =
    isRecord(rawPosition) &&
    typeof rawPosition['x'] === 'number' &&
    Number.isFinite(rawPosition['x']) &&
    typeof rawPosition['y'] === 'number' &&
    Number.isFinite(rawPosition['y']);
  if (!hasValidPosition) {
    addIssue(
      issues,
      'invalid-node-position',
      `Node "${id}" has a non-finite or missing position and was placed at the origin.`,
      { kind: 'node', nodeId: id },
      encoded(id),
    );
  }

  const type = optionalNonEmptyString(rawNode, 'type') ?? 'unknown';
  const name = optionalNonEmptyString(rawNode, 'name') ?? id;
  if (type === 'unknown' || (name === id && optionalString(rawNode, 'name') === undefined)) {
    addIssue(
      issues,
      'invalid-node-record',
      `Node "${id}" is missing a valid type or name.`,
      { kind: 'node', nodeId: id },
      `${encoded(id)}:identity`,
    );
  }

  const node: TngFlowNode<TNodeData> = {
    id,
    type,
    name,
    position: hasValidPosition
      ? { x: rawPosition['x'] as number, y: rawPosition['y'] as number }
      : { x: 0, y: 0 },
    data: rawNode['data'] as TNodeData | undefined,
    description: optionalString(rawNode, 'description'),
    disabled: optionalBoolean(rawNode, 'disabled'),
    icon: optionalString(rawNode, 'icon'),
    ports,
    locked: optionalBoolean(rawNode, 'locked'),
  };
  nodesById.set(id, node);
  return node;
}

function sanitizeNodes<TNodeData>(
  value: unknown,
  issues: TngFlowValidationIssue[],
): readonly TngFlowNode<TNodeData>[] {
  if (!Array.isArray(value)) {
    addIssue(
      issues,
      'invalid-nodes',
      'The flow definition does not contain a valid nodes array.',
      { kind: 'flow' },
      'nodes',
    );
    return [];
  }

  const nodesById = new Map<string, TngFlowNode<TNodeData>>();
  return value
    .map((node, index) => sanitizeNode<TNodeData>(node, index, nodesById, issues))
    .filter((node): node is TngFlowNode<TNodeData> => node !== undefined);
}

function sanitizeEndpoint(value: unknown): TngFlowEndpoint | undefined {
  if (!isRecord(value)) {
    return undefined;
  }
  const nodeId = typeof value['nodeId'] === 'string' ? value['nodeId'].trim() : '';
  const portId = typeof value['portId'] === 'string' ? value['portId'].trim() : '';
  return nodeId.length > 0 && portId.length > 0 ? { nodeId, portId } : undefined;
}

function sanitizeConnection<TConnectionData>(
  rawConnection: unknown,
  index: number,
  ids: Set<string>,
  issues: TngFlowValidationIssue[],
): TngFlowConnection<TConnectionData> | undefined {
  if (!isRecord(rawConnection)) {
    addIssue(
      issues,
      'invalid-connections',
      'The definition contains a malformed connection record.',
      { kind: 'flow' },
      String(index),
    );
    return undefined;
  }

  const id = typeof rawConnection['id'] === 'string' ? rawConnection['id'].trim() : '';
  if (id.length === 0) {
    addIssue(
      issues,
      'empty-connection-id',
      'A connection has an empty id.',
      { kind: 'flow' },
      String(index),
    );
    return undefined;
  }
  if (ids.has(id)) {
    addIssue(
      issues,
      'duplicate-connection-id',
      `Connection id "${id}" is used more than once.`,
      { kind: 'flow' },
      `${encoded(id)}:${index}`,
    );
  } else {
    ids.add(id);
  }

  const source = sanitizeEndpoint(rawConnection['source']);
  const target = sanitizeEndpoint(rawConnection['target']);
  if (source === undefined || target === undefined) {
    addIssue(
      issues,
      source === undefined ? 'missing-source-port' : 'missing-target-port',
      `Connection "${id}" contains a malformed endpoint.`,
      { kind: 'connection', connectionId: id },
      encoded(id),
    );
    return undefined;
  }

  const rawType = rawConnection['type'];
  const type =
    typeof rawType === 'string' && CONNECTION_TYPES.includes(rawType as TngFlowConnectionType)
      ? (rawType as TngFlowConnectionType)
      : undefined;
  return {
    id,
    source,
    target,
    label: optionalString(rawConnection, 'label'),
    description: optionalString(rawConnection, 'description'),
    data: rawConnection['data'] as TConnectionData | undefined,
    disabled: optionalBoolean(rawConnection, 'disabled'),
    reassignable: optionalBoolean(rawConnection, 'reassignable'),
    selectable: optionalBoolean(rawConnection, 'selectable'),
    routing: sanitizeConnectionRouting(rawConnection['routing']),
    sourceMarker: sanitizeConnectionMarker(rawConnection['sourceMarker']),
    targetMarker: sanitizeConnectionMarker(rawConnection['targetMarker']),
    labelOptions: sanitizeConnectionLabelOptions(rawConnection['labelOptions']),
    type,
  };
}

function sanitizeConnections<TConnectionData>(
  value: unknown,
  issues: TngFlowValidationIssue[],
): readonly TngFlowConnection<TConnectionData>[] {
  if (!Array.isArray(value)) {
    addIssue(
      issues,
      'invalid-connections',
      'The flow definition does not contain a valid connections array.',
      { kind: 'flow' },
      'connections',
    );
    return [];
  }
  const ids = new Set<string>();
  return value
    .map((connection, index) => sanitizeConnection<TConnectionData>(connection, index, ids, issues))
    .filter(
      (connection): connection is TngFlowConnection<TConnectionData> => connection !== undefined,
    );
}

function acceptsTarget(source: TngFlowPort, target: TngFlowPort): boolean {
  const accepted = source.accepts ?? [];
  return (
    accepted.length === 0 ||
    accepted.includes(target.id) ||
    (target.category !== undefined && accepted.includes(target.category))
  );
}

function resolveConnection<TNodeData, TConnectionData>(
  connection: TngFlowConnection<TConnectionData>,
  nodeIndex: TngFlowGraphIndex<TNodeData, never>,
  issues: TngFlowValidationIssue[],
):
  | Readonly<{ source: TngFlowPortRecord<TNodeData>; target: TngFlowPortRecord<TNodeData> }>
  | undefined {
  const sourceNode = nodeIndex.nodesById.get(connection.source.nodeId);
  const targetNode = nodeIndex.nodesById.get(connection.target.nodeId);
  if (sourceNode === undefined) {
    addIssue(
      issues,
      'missing-source-node',
      `Connection "${connection.id}" references a missing source node.`,
      { kind: 'connection', connectionId: connection.id },
      encoded(connection.id),
    );
  }
  if (targetNode === undefined) {
    addIssue(
      issues,
      'missing-target-node',
      `Connection "${connection.id}" references a missing target node.`,
      { kind: 'connection', connectionId: connection.id },
      encoded(connection.id),
    );
  }
  if (sourceNode === undefined || targetNode === undefined) {
    return undefined;
  }

  const source = nodeIndex.portsByConnectorId.get(
    createTngFlowConnectorId(connection.source.nodeId, connection.source.portId),
  );
  const target = nodeIndex.portsByConnectorId.get(
    createTngFlowConnectorId(connection.target.nodeId, connection.target.portId),
  );
  if (source === undefined) {
    addIssue(
      issues,
      'missing-source-port',
      `Connection "${connection.id}" references a missing source port.`,
      { kind: 'connection', connectionId: connection.id },
      encoded(connection.id),
    );
  }
  if (target === undefined) {
    addIssue(
      issues,
      'missing-target-port',
      `Connection "${connection.id}" references a missing target port.`,
      { kind: 'connection', connectionId: connection.id },
      encoded(connection.id),
    );
  }
  if (source === undefined || target === undefined) {
    return undefined;
  }

  let hasInvalidDirection = false;
  if (source.port.direction !== 'output') {
    addIssue(
      issues,
      'invalid-source-port',
      `Connection "${connection.id}" uses an input port as its source.`,
      { kind: 'connection', connectionId: connection.id },
      encoded(connection.id),
    );
    hasInvalidDirection = true;
  }
  if (target.port.direction !== 'input') {
    addIssue(
      issues,
      'invalid-target-port',
      `Connection "${connection.id}" uses an output port as its target.`,
      { kind: 'connection', connectionId: connection.id },
      encoded(connection.id),
    );
    hasInvalidDirection = true;
  }
  if (hasInvalidDirection) {
    return undefined;
  }
  return { source, target };
}

function validateResolvedConnection<TNodeData, TConnectionData>(
  connection: TngFlowConnection<TConnectionData>,
  source: TngFlowPortRecord<TNodeData>,
  target: TngFlowPortRecord<TNodeData>,
  issues: TngFlowValidationIssue[],
): void {
  if (!acceptsTarget(source.port, target.port)) {
    addIssue(
      issues,
      'incompatible-ports',
      `Source port "${source.port.id}" does not accept target port "${target.port.id}".`,
      { kind: 'connection', connectionId: connection.id },
      encoded(connection.id),
    );
  }
  if (source.port.kind !== target.port.kind) {
    addIssue(
      issues,
      'incompatible-port-kind',
      `Connection "${connection.id}" joins ports with different kinds.`,
      { kind: 'connection', connectionId: connection.id },
      encoded(connection.id),
    );
  }
  if (source.node.id === target.node.id && source.port.allowSelfConnection !== true) {
    addIssue(
      issues,
      'self-connection-disabled',
      `Port "${source.port.id}" does not allow connections to its own node.`,
      { kind: 'connection', connectionId: connection.id },
      encoded(connection.id),
    );
  }
}

function validateConnections<TNodeData, TConnectionData>(
  connections: readonly TngFlowConnection<TConnectionData>[],
  nodeIndex: TngFlowGraphIndex<TNodeData, never>,
  analysis: MutableAnalysis<TNodeData, TConnectionData>,
): void {
  const pairs = new Set<string>();
  const counts = new Map<string, number>();
  const renderedConnectionIds = new Set<string>();

  connections.forEach((connection, index) => {
    const hasRenderableId = !renderedConnectionIds.has(connection.id);
    renderedConnectionIds.add(connection.id);
    const resolved = resolveConnection(connection, nodeIndex, analysis.issues);
    if (resolved === undefined || !hasRenderableId) {
      return;
    }

    const pair = tngFlowConnectionPairKey(connection.source, connection.target);
    if (pairs.has(pair)) {
      addIssue(
        analysis.issues,
        'duplicate-connection',
        `Connection "${connection.id}" duplicates an existing endpoint pair.`,
        { kind: 'connection', connectionId: connection.id },
        `${encoded(connection.id)}:${index}`,
      );
    }
    pairs.add(pair);
    validateResolvedConnection(connection, resolved.source, resolved.target, analysis.issues);
    analysis.connections.push(connection);

    for (const record of [resolved.source, resolved.target]) {
      counts.set(record.connectorId, (counts.get(record.connectorId) ?? 0) + 1);
    }
  });

  for (const [connectorId, count] of counts) {
    const record = nodeIndex.portsByConnectorId.get(connectorId);
    if (record === undefined || count <= 1 || record.port.multiple === true) {
      continue;
    }
    addIssue(
      analysis.issues,
      'port-connection-limit',
      `Port "${record.port.id}" has ${count} connections but is not marked as multiple.`,
      { kind: 'port', nodeId: record.node.id, portId: record.port.id },
      `${encoded(record.node.id)}:${encoded(record.port.id)}`,
    );
  }
}

export function analyzeTngFlow<TNodeData = unknown, TConnectionData = unknown>(
  nodesValue: unknown,
  connectionsValue: unknown,
): TngFlowAnalysis<TNodeData, TConnectionData> {
  const analysis: MutableAnalysis<TNodeData, TConnectionData> = {
    nodes: [],
    connections: [],
    issues: [],
  };
  analysis.nodes.push(...sanitizeNodes<TNodeData>(nodesValue, analysis.issues));
  const nodeIndex = createTngFlowGraphIndex<TNodeData, never>(analysis.nodes, []);
  const connections = sanitizeConnections<TConnectionData>(connectionsValue, analysis.issues);
  validateConnections(connections, nodeIndex, analysis);
  const index = createTngFlowGraphIndex(analysis.nodes, analysis.connections);
  return { ...analysis, index };
}

export function validateTngFlowDefinition(
  definition: TngFlowDefinition,
): readonly TngFlowValidationIssue[] {
  return analyzeTngFlow(definition.nodes, definition.connections).issues;
}

/** @deprecated Use `validateTngFlowDefinition`. */
export function validateTngFlow(
  nodes: readonly TngFlowNode[],
  connections: readonly TngFlowConnection[],
): readonly TngFlowValidationIssue[] {
  return analyzeTngFlow(nodes, connections).issues;
}
