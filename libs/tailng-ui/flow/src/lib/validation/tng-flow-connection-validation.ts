import { createTngFlowConnectorId } from '../model/tng-flow-connector-id';
import { tngFlowConnectionPairKey } from '../model/tng-flow-graph';
import type {
  TngFlowConnection,
  TngFlowConnectionCandidate,
  TngFlowConnectionValidation,
  TngFlowEndpoint,
  TngFlowPort,
} from '../types/tng-flow.types';

const VALID_CONNECTION: TngFlowConnectionValidation = Object.freeze({ valid: true });

export type TngFlowConnectionValidationIndex = Readonly<{
  connectionIdsByEndpoint: ReadonlyMap<string, ReadonlySet<string>>;
  connectionIdsByPair: ReadonlyMap<string, ReadonlySet<string>>;
}>;

function invalid(code: string, reason: string): TngFlowConnectionValidation {
  return { valid: false, code, reason };
}

function appendToIndex(index: Map<string, Set<string>>, key: string, id: string): void {
  const current = index.get(key);
  if (current === undefined) {
    index.set(key, new Set([id]));
    return;
  }
  current.add(id);
}

export function createTngFlowConnectionValidationIndex<TConnectionData>(
  connections: readonly TngFlowConnection<TConnectionData>[],
): TngFlowConnectionValidationIndex {
  const connectionIdsByEndpoint = new Map<string, Set<string>>();
  const connectionIdsByPair = new Map<string, Set<string>>();
  for (const connection of connections) {
    appendToIndex(
      connectionIdsByEndpoint,
      createTngFlowConnectorId(connection.source.nodeId, connection.source.portId),
      connection.id,
    );
    appendToIndex(
      connectionIdsByEndpoint,
      createTngFlowConnectorId(connection.target.nodeId, connection.target.portId),
      connection.id,
    );
    appendToIndex(
      connectionIdsByPair,
      tngFlowConnectionPairKey(connection.source, connection.target),
      connection.id,
    );
  }
  return { connectionIdsByEndpoint, connectionIdsByPair };
}

function validateDirection(candidate: TngFlowConnectionCandidate): TngFlowConnectionValidation {
  if (candidate.sourcePort.direction !== 'output') {
    return invalid('invalid-source-direction', 'Connections must start from an output port.');
  }
  if (candidate.targetPort.direction !== 'input') {
    return invalid('invalid-target-direction', 'Connections must end at an input port.');
  }
  return VALID_CONNECTION;
}

function validateAvailability(candidate: TngFlowConnectionCandidate): TngFlowConnectionValidation {
  if (candidate.sourceNode.disabled === true || candidate.targetNode.disabled === true) {
    return invalid('disabled-node', 'Disabled nodes cannot accept new connections.');
  }
  if (candidate.sourcePort.disabled === true || candidate.targetPort.disabled === true) {
    return invalid('disabled-port', 'Disabled ports cannot accept new connections.');
  }
  return VALID_CONNECTION;
}

function acceptsTarget(source: TngFlowPort, target: TngFlowPort): boolean {
  const accepted = source.accepts ?? [];
  return (
    accepted.length === 0 ||
    accepted.includes(target.id) ||
    (target.category !== undefined && accepted.includes(target.category))
  );
}

function validateRelationship(candidate: TngFlowConnectionCandidate): TngFlowConnectionValidation {
  const isSelfConnection = candidate.source.nodeId === candidate.target.nodeId;
  if (isSelfConnection && candidate.sourcePort.allowSelfConnection !== true) {
    return invalid(
      'self-connection-disabled',
      'Connections to the same node are not allowed for this port.',
    );
  }
  if (candidate.sourcePort.kind !== candidate.targetPort.kind) {
    return invalid('incompatible-port-kind', 'Source and target port kinds are incompatible.');
  }
  if (!acceptsTarget(candidate.sourcePort, candidate.targetPort)) {
    return invalid('incompatible-ports', 'The source port does not accept this target port.');
  }
  return VALID_CONNECTION;
}

function hasOtherConnection(ids: ReadonlySet<string> | undefined, excludedId?: string): boolean {
  return ids !== undefined && [...ids].some((id) => id !== excludedId);
}

function hasDuplicate(
  candidate: TngFlowConnectionCandidate,
  index: TngFlowConnectionValidationIndex,
  excludeConnectionId?: string,
): boolean {
  const pair = tngFlowConnectionPairKey(candidate.source, candidate.target);
  return hasOtherConnection(index.connectionIdsByPair.get(pair), excludeConnectionId);
}

function validatePortCapacity(
  endpoint: TngFlowEndpoint,
  port: TngFlowPort,
  index: TngFlowConnectionValidationIndex,
  excludeConnectionId?: string,
): TngFlowConnectionValidation {
  const connectorId = createTngFlowConnectorId(endpoint.nodeId, endpoint.portId);
  if (
    port.multiple === true ||
    !hasOtherConnection(index.connectionIdsByEndpoint.get(connectorId), excludeConnectionId)
  ) {
    return VALID_CONNECTION;
  }
  return invalid(
    'port-connection-limit',
    `Port "${port.name ?? port.label ?? port.id}" accepts only one connection.`,
  );
}

function validateMultiplicity(
  candidate: TngFlowConnectionCandidate,
  index: TngFlowConnectionValidationIndex,
  excludeConnectionId?: string,
): TngFlowConnectionValidation {
  const sourceResult = validatePortCapacity(
    candidate.source,
    candidate.sourcePort,
    index,
    excludeConnectionId,
  );
  return sourceResult.valid
    ? validatePortCapacity(
        candidate.target,
        candidate.targetPort,
        index,
        excludeConnectionId,
      )
    : sourceResult;
}

export function validateTngFlowConnectionCandidate<TConnectionData>(
  candidate: TngFlowConnectionCandidate,
  connections: readonly TngFlowConnection<TConnectionData>[],
  excludeConnectionId?: string,
  existingIndex?: TngFlowConnectionValidationIndex,
): TngFlowConnectionValidation {
  const validators = [validateDirection, validateAvailability, validateRelationship] as const;
  for (const validator of validators) {
    const result = validator(candidate);
    if (!result.valid) {
      return result;
    }
  }

  const index = existingIndex ?? createTngFlowConnectionValidationIndex(connections);
  if (hasDuplicate(candidate, index, excludeConnectionId)) {
    return invalid('duplicate-connection', 'This connection already exists.');
  }
  return validateMultiplicity(candidate, index, excludeConnectionId);
}
