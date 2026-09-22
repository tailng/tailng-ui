
import type { TngFlowGraphIndex } from './tng-flow-graph';
import type { TngFlowSelection } from '../types/tng-flow.types';

export function sanitizeTngFlowSelection(
  selection: TngFlowSelection,
  index: TngFlowGraphIndex,
): TngFlowSelection {
  return {
    nodeIds: new Set([...selection.nodeIds].filter((id) => index.nodesById.has(id))),
    connectionIds: new Set(
      [...selection.connectionIds].filter((id) => index.connectionsById.has(id)),
    ),
  };
}

export function areTngFlowSelectionsEqual(
  first: TngFlowSelection,
  second: TngFlowSelection,
): boolean {
  return (
    first.nodeIds.size === second.nodeIds.size &&
    first.connectionIds.size === second.connectionIds.size &&
    [...first.nodeIds].every((id) => second.nodeIds.has(id)) &&
    [...first.connectionIds].every((id) => second.connectionIds.has(id))
  );
}
