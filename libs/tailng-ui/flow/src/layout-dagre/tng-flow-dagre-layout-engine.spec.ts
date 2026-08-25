// ng-packagr requires a secondary entry point to consume the primary entry point by package name.
// eslint-disable-next-line @nx/enforce-module-boundaries
import type {
  TngFlowLayoutDirection,
  TngFlowLayoutGraph,
  TngFlowNodeMove,
  TngResolvedFlowLayoutOptions,
} from '@tailng-ui/flow';
import { describe, expect, it } from 'vitest';
import { createTngFlowDagreLayoutEngine } from './tng-flow-dagre-layout-engine';

const options: TngResolvedFlowLayoutOptions = {
  direction: 'left-to-right',
  nodeSpacing: 48,
  levelSpacing: 120,
  componentSpacing: 64,
  preserveLockedNodes: true,
  includeDisconnectedNodes: true,
};

function createGraph(
  nodes: readonly Readonly<{ id: string; width?: number; height?: number }>[],
  edges: readonly (readonly [string, string])[],
): TngFlowLayoutGraph {
  return {
    nodes: nodes.map((node) => ({
      node: { id: node.id, type: 'step', name: node.id, position: { x: 0, y: 0 } },
      bounds: {
        id: node.id,
        position: { x: 0, y: 0 },
        size: { width: node.width ?? 180, height: node.height ?? 96 },
      },
    })),
    connections: edges.map(([source, target], index) => ({
      connection: {
        id: `edge-${index}`,
        source: { nodeId: source, portId: 'out' },
        target: { nodeId: target, portId: 'in' },
      },
    })),
  };
}

function moveIndex(moves: readonly TngFlowNodeMove[]): ReadonlyMap<string, TngFlowNodeMove> {
  return new Map(moves.map((move) => [move.id, move]));
}

function expectNoOverlaps(graph: TngFlowLayoutGraph, moves: readonly TngFlowNodeMove[]): void {
  const indexed = moveIndex(moves);
  const rectangles = graph.nodes.flatMap((entry) => {
    const position = indexed.get(entry.node.id)?.position;
    return position === undefined
      ? []
      : [
          {
            id: entry.node.id,
            left: position.x,
            top: position.y,
            right: position.x + entry.bounds.size.width,
            bottom: position.y + entry.bounds.size.height,
          },
        ];
  });
  for (let leftIndex = 0; leftIndex < rectangles.length; leftIndex += 1) {
    for (let rightIndex = leftIndex + 1; rightIndex < rectangles.length; rightIndex += 1) {
      const left = rectangles[leftIndex];
      const right = rectangles[rightIndex];
      const overlaps =
        left.left < right.right &&
        left.right > right.left &&
        left.top < right.bottom &&
        left.bottom > right.top;
      expect(overlaps, `${left.id} overlaps ${right.id}`).toBe(false);
    }
  }
}

describe('@tailng-ui/flow/layout-dagre', () => {
  it('arranges a linear five-node graph deterministically without overlaps', async () => {
    const graph = createGraph(
      ['a', 'b', 'c', 'd', 'e'].map((id) => ({ id })),
      [
        ['a', 'b'],
        ['b', 'c'],
        ['c', 'd'],
        ['d', 'e'],
      ],
    );
    const engine = createTngFlowDagreLayoutEngine();

    const first = await engine.calculate(graph, options);
    const second = await engine.calculate(graph, options);
    const indexed = moveIndex(first);

    expect(second).toEqual(first);
    expect(first.map((move) => move.id).sort()).toEqual(['a', 'b', 'c', 'd', 'e']);
    expect(indexed.get('a')?.position.x).toBeLessThan(indexed.get('b')?.position.x ?? 0);
    expect(indexed.get('d')?.position.x).toBeLessThan(indexed.get('e')?.position.x ?? 0);
    expectNoOverlaps(graph, first);
  });

  it('lays out differently sized branches and a merge without collisions', async () => {
    const graph = createGraph(
      [
        { id: 'start', width: 140, height: 80 },
        { id: 'approve', width: 320, height: 120 },
        { id: 'reject', width: 180, height: 180 },
        { id: 'merge', width: 240, height: 96 },
      ],
      [
        ['start', 'approve'],
        ['start', 'reject'],
        ['approve', 'merge'],
        ['reject', 'merge'],
      ],
    );
    const moves = await createTngFlowDagreLayoutEngine().calculate(graph, options);
    const indexed = moveIndex(moves);

    expect(indexed.get('start')?.position.x).toBeLessThan(indexed.get('approve')?.position.x ?? 0);
    expect(indexed.get('approve')?.position.x).toBeLessThan(indexed.get('merge')?.position.x ?? 0);
    expect(indexed.get('reject')?.position.y).not.toBe(indexed.get('approve')?.position.y);
    expectNoOverlaps(graph, moves);
  });

  it('packs disconnected components predictably and can leave isolated nodes untouched', async () => {
    const graph = createGraph(
      [{ id: 'a' }, { id: 'b' }, { id: 'c' }, { id: 'd' }, { id: 'isolated' }],
      [
        ['a', 'b'],
        ['c', 'd'],
      ],
    );
    const engine = createTngFlowDagreLayoutEngine();
    const included = await engine.calculate(graph, options);
    const excluded = await engine.calculate(graph, {
      ...options,
      includeDisconnectedNodes: false,
    });
    const indexed = moveIndex(included);

    expect(included.map((move) => move.id).sort()).toEqual(['a', 'b', 'c', 'd', 'isolated']);
    expect(excluded.map((move) => move.id).sort()).toEqual(['a', 'b', 'c', 'd']);
    expect(
      (indexed.get('c')?.position.y ?? 0) - (indexed.get('a')?.position.y ?? 0),
    ).toBeGreaterThanOrEqual(96 + options.componentSpacing);
    expectNoOverlaps(graph, included);
  });

  it('handles cycles and incomplete connections without throwing', async () => {
    const complete = createGraph(
      [{ id: 'a' }, { id: 'b' }, { id: 'c' }],
      [
        ['a', 'b'],
        ['b', 'c'],
        ['c', 'a'],
      ],
    );
    const graph: TngFlowLayoutGraph = {
      ...complete,
      connections: [
        ...complete.connections,
        {
          connection: {
            id: 'incomplete',
            source: { nodeId: 'missing', portId: 'out' },
            target: { nodeId: 'a', portId: 'in' },
          },
        },
      ],
    };
    const engine = createTngFlowDagreLayoutEngine();

    await expect(engine.calculate(graph, options)).resolves.toHaveLength(3);
    expect(await engine.calculate(graph, options)).toEqual(await engine.calculate(graph, options));
  });

  it.each<readonly [TngFlowLayoutDirection, 'x' | 'y', boolean]>([
    ['left-to-right', 'x', true],
    ['right-to-left', 'x', false],
    ['top-to-bottom', 'y', true],
    ['bottom-to-top', 'y', false],
  ])('supports %s layout', async (direction, axis, increasing) => {
    const graph = createGraph([{ id: 'source' }, { id: 'target' }], [['source', 'target']]);
    const moves = await createTngFlowDagreLayoutEngine().calculate(graph, {
      ...options,
      direction,
    });
    const indexed = moveIndex(moves);
    const source = indexed.get('source')?.position[axis] ?? 0;
    const target = indexed.get('target')?.position[axis] ?? 0;

    expect(increasing ? source < target : source > target).toBe(true);
  });
});
