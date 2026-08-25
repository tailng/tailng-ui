import {
  Graph,
  layout as runDagreLayout,
  type EdgeLabel,
  type GraphLabel,
  type NodeLabel,
} from '@dagrejs/dagre';
// ng-packagr requires a secondary entry point to consume the primary entry point by package name.
// eslint-disable-next-line @nx/enforce-module-boundaries
import type {
  TngFlowLayoutConnection,
  TngFlowLayoutEngine,
  TngFlowLayoutGraph,
  TngFlowLayoutNode,
  TngFlowNodeMove,
  TngResolvedFlowLayoutOptions,
} from '@tailng-ui/flow';

type LayoutComponent<TNodeData, TConnectionData> = Readonly<{
  nodes: readonly TngFlowLayoutNode<TNodeData>[];
  connections: readonly TngFlowLayoutConnection<TConnectionData>[];
}>;

type PositionedComponent = Readonly<{
  moves: readonly TngFlowNodeMove[];
  minX: number;
  minY: number;
  width: number;
  height: number;
}>;

const DIRECTION_BY_TAILNG = Object.freeze({
  'left-to-right': 'LR',
  'right-to-left': 'RL',
  'top-to-bottom': 'TB',
  'bottom-to-top': 'BT',
} as const);

export function createTngFlowDagreLayoutEngine<
  TNodeData = unknown,
  TConnectionData = unknown,
>(): TngFlowLayoutEngine<TNodeData, TConnectionData> {
  return Object.freeze({
    calculate: (graph, options) => Promise.resolve(calculateDagreLayout(graph, options)),
  });
}

export const TNG_FLOW_DAGRE_LAYOUT_ENGINE: TngFlowLayoutEngine = createTngFlowDagreLayoutEngine();

function calculateDagreLayout<TNodeData, TConnectionData>(
  graph: TngFlowLayoutGraph<TNodeData, TConnectionData>,
  options: TngResolvedFlowLayoutOptions,
): readonly TngFlowNodeMove[] {
  const normalized = normalizeGraph(graph, options.includeDisconnectedNodes);
  const components = createComponents(normalized);
  const horizontal = options.direction === 'left-to-right' || options.direction === 'right-to-left';
  let cursor = 0;
  return components.flatMap((component) => {
    const positioned = layoutComponent(component, options);
    const moves = packComponent(positioned, cursor, horizontal);
    cursor += (horizontal ? positioned.height : positioned.width) + options.componentSpacing;
    return moves;
  });
}

function normalizeGraph<TNodeData, TConnectionData>(
  graph: TngFlowLayoutGraph<TNodeData, TConnectionData>,
  includeDisconnectedNodes: boolean,
): TngFlowLayoutGraph<TNodeData, TConnectionData> {
  const sortedNodes = [...graph.nodes].sort((left, right) =>
    left.node.id.localeCompare(right.node.id),
  );
  const availableIds = new Set(sortedNodes.map((entry) => entry.node.id));
  const connections = [...graph.connections]
    .filter((entry) => hasCompleteEndpoints(entry, availableIds))
    .sort((left, right) => left.connection.id.localeCompare(right.connection.id));
  if (includeDisconnectedNodes) {
    return { nodes: sortedNodes, connections };
  }
  const connectedIds = new Set(
    connections.flatMap((entry) => [
      entry.connection.source.nodeId,
      entry.connection.target.nodeId,
    ]),
  );
  return {
    nodes: sortedNodes.filter((entry) => connectedIds.has(entry.node.id)),
    connections,
  };
}

function hasCompleteEndpoints<TConnectionData>(
  entry: TngFlowLayoutConnection<TConnectionData>,
  nodeIds: Readonly<ReadonlySet<string>>,
): boolean {
  return nodeIds.has(entry.connection.source.nodeId) && nodeIds.has(entry.connection.target.nodeId);
}

function createComponents<TNodeData, TConnectionData>(
  graph: TngFlowLayoutGraph<TNodeData, TConnectionData>,
): readonly LayoutComponent<TNodeData, TConnectionData>[] {
  const nodesById = new Map(graph.nodes.map((entry) => [entry.node.id, entry]));
  const neighbors = createNeighborIndex(nodesById.keys(), graph.connections);
  const visited = new Set<string>();
  return [...nodesById.keys()].sort().flatMap((id) => {
    if (visited.has(id)) {
      return [];
    }
    const componentIds = collectComponentIds(id, neighbors, visited);
    const componentIdSet = new Set(componentIds);
    return [
      {
        nodes: componentIds.flatMap((nodeId) => {
          const node = nodesById.get(nodeId);
          return node === undefined ? [] : [node];
        }),
        connections: graph.connections.filter(
          (entry) =>
            componentIdSet.has(entry.connection.source.nodeId) &&
            componentIdSet.has(entry.connection.target.nodeId),
        ),
      },
    ];
  });
}

function createNeighborIndex<TConnectionData>(
  nodeIds: Readonly<Iterable<string>>,
  connections: readonly TngFlowLayoutConnection<TConnectionData>[],
): ReadonlyMap<string, ReadonlySet<string>> {
  const neighbors = new Map([...nodeIds].map((id) => [id, new Set<string>()]));
  for (const entry of connections) {
    const source = entry.connection.source.nodeId;
    const target = entry.connection.target.nodeId;
    neighbors.get(source)?.add(target);
    neighbors.get(target)?.add(source);
  }
  return neighbors;
}

function collectComponentIds(
  firstId: string,
  neighbors: Readonly<ReadonlyMap<string, ReadonlySet<string>>>,
  visited: Readonly<Set<string>>,
): readonly string[] {
  const pending = [firstId];
  const ids: string[] = [];
  visited.add(firstId);
  while (pending.length > 0) {
    const id = pending.shift();
    if (id === undefined) {
      continue;
    }
    ids.push(id);
    for (const neighbor of [...(neighbors.get(id) ?? [])].sort()) {
      if (!visited.has(neighbor)) {
        visited.add(neighbor);
        pending.push(neighbor);
      }
    }
  }
  return ids.sort();
}

function layoutComponent<TNodeData, TConnectionData>(
  component: LayoutComponent<TNodeData, TConnectionData>,
  options: TngResolvedFlowLayoutOptions,
): PositionedComponent {
  const graph = createDagreGraph(options);
  for (const entry of component.nodes) {
    graph.setNode(entry.node.id, {
      width: entry.bounds.size.width,
      height: entry.bounds.size.height,
    });
  }
  component.connections.forEach((entry, index) => {
    graph.setEdge(
      entry.connection.source.nodeId,
      entry.connection.target.nodeId,
      {},
      `${entry.connection.id}:${index}`,
    );
  });
  runDagreLayout(graph);
  return positionDagreNodes(component.nodes, graph);
}

function createDagreGraph(
  options: TngResolvedFlowLayoutOptions,
): Graph<GraphLabel, NodeLabel, EdgeLabel> {
  return new Graph<GraphLabel, NodeLabel, EdgeLabel>({ multigraph: true })
    .setGraph({
      rankdir: DIRECTION_BY_TAILNG[options.direction],
      nodesep: options.nodeSpacing,
      ranksep: options.levelSpacing,
      marginx: 0,
      marginy: 0,
    })
    .setDefaultEdgeLabel(() => ({}));
}

function positionDagreNodes<TNodeData>(
  nodes: readonly TngFlowLayoutNode<TNodeData>[],
  graph: Readonly<Graph<GraphLabel, NodeLabel, EdgeLabel>>,
): PositionedComponent {
  const moves = nodes.map((entry) => {
    const label = graph.node(entry.node.id);
    if (!Number.isFinite(label.x) || !Number.isFinite(label.y)) {
      throw new Error(`Dagre did not position node "${entry.node.id}".`);
    }
    return {
      id: entry.node.id,
      position: {
        x: (label.x ?? 0) - entry.bounds.size.width / 2,
        y: (label.y ?? 0) - entry.bounds.size.height / 2,
      },
    };
  });
  return componentBounds(moves, nodes);
}

function componentBounds<TNodeData>(
  moves: readonly TngFlowNodeMove[],
  nodes: readonly TngFlowLayoutNode<TNodeData>[],
): PositionedComponent {
  const sizes = new Map(nodes.map((entry) => [entry.node.id, entry.bounds.size]));
  const minX = Math.min(...moves.map((move) => move.position.x));
  const minY = Math.min(...moves.map((move) => move.position.y));
  const maxX = Math.max(...moves.map((move) => move.position.x + (sizes.get(move.id)?.width ?? 0)));
  const maxY = Math.max(
    ...moves.map((move) => move.position.y + (sizes.get(move.id)?.height ?? 0)),
  );
  return { moves, minX, minY, width: maxX - minX, height: maxY - minY };
}

function packComponent(
  component: PositionedComponent,
  cursor: number,
  horizontal: boolean,
): readonly TngFlowNodeMove[] {
  const offsetX = horizontal ? -component.minX : cursor - component.minX;
  const offsetY = horizontal ? cursor - component.minY : -component.minY;
  return component.moves.map((move) => ({
    id: move.id,
    position: {
      x: move.position.x + offsetX,
      y: move.position.y + offsetY,
    },
  }));
}
