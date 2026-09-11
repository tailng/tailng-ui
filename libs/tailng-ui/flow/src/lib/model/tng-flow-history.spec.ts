import { describe, expect, it } from 'vitest';
import {
  commitTngFlowHistory,
  createTngFlowHistory,
  redoTngFlowHistory,
  tngFlowHistoryStatus,
  undoTngFlowHistory,
  updateTngFlowHistory,
} from './tng-flow-history';
import type { TngFlowDefinition } from '../types/tng-flow.types';

const definition: TngFlowDefinition = {
  id: 'workflow',
  nodes: [
    {
      id: 'start',
      type: 'start',
      name: 'Start',
      position: { x: 0, y: 0 },
    },
  ],
  connections: [],
};

function moveStart(x: number): TngFlowDefinition {
  return {
    ...definition,
    nodes: definition.nodes.map((node) => ({
      ...node,
      position: { x, y: node.position.y },
    })),
  };
}

describe('tng-flow-history', () => {
  it('commits graph snapshots and moves backward and forward through them', () => {
    const movedOnce = moveStart(100);
    const movedTwice = moveStart(200);
    const initial = createTngFlowHistory(definition, {
      selection: { nodeIds: new Set(['start']), connectionIds: new Set() },
      timestamp: 1,
    });
    const first = commitTngFlowHistory(initial, movedOnce, {
      label: 'Move start',
      timestamp: 2,
    });
    const second = commitTngFlowHistory(first, movedTwice, {
      label: 'Move start again',
      timestamp: 3,
    });

    expect(tngFlowHistoryStatus(second)).toEqual({
      canUndo: true,
      canRedo: false,
      undoLabel: 'Move start again',
    });

    const undone = undoTngFlowHistory(second);
    expect(undone.present.definition).toBe(movedOnce);
    expect(tngFlowHistoryStatus(undone)).toEqual({
      canUndo: true,
      canRedo: true,
      undoLabel: 'Move start',
      redoLabel: 'Move start again',
    });

    const redone = redoTngFlowHistory(undone);
    expect(redone.present.definition).toBe(movedTwice);
    expect(redone.future).toHaveLength(0);
  });

  it('clears redo when a new edit is committed after undo', () => {
    const first = commitTngFlowHistory(createTngFlowHistory(definition), moveStart(100), {
      label: 'Move once',
    });
    const second = commitTngFlowHistory(first, moveStart(200), { label: 'Move twice' });
    const undone = undoTngFlowHistory(second);
    const forked = commitTngFlowHistory(undone, moveStart(300), { label: 'Move elsewhere' });

    expect(forked.present.definition.nodes[0]?.position.x).toBe(300);
    expect(forked.future).toHaveLength(0);
    expect(tngFlowHistoryStatus(forked)).toMatchObject({ canUndo: true, canRedo: false });
  });

  it('honors custom equality and caps the past stack', () => {
    const initial = createTngFlowHistory(definition, { limit: 2 });
    const unchanged = updateTngFlowHistory(initial, (value) => ({ ...value }), {
      equals: (previous, next) => previous.id === next.id,
    });

    expect(unchanged).toBe(initial);

    const first = commitTngFlowHistory(initial, moveStart(1));
    const second = commitTngFlowHistory(first, moveStart(2));
    const third = commitTngFlowHistory(second, moveStart(3));

    expect(third.past).toHaveLength(2);
    expect(third.past.map((snapshot) => snapshot.definition.nodes[0]?.position.x)).toEqual([1, 2]);
  });
});
