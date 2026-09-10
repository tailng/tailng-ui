import { describe, expect, it } from 'vitest';
import { resolveTngFlowConnectionView, resolveTngFlowNodeView } from './tng-flow-resolved-view';
import type { TngFlowConnection, TngFlowNode } from '../types/tng-flow.types';

const connection: TngFlowConnection = {
  id: 'source-to-target',
  source: { nodeId: 'source', portId: 'output' },
  target: { nodeId: 'target', portId: 'input' },
};

const node: TngFlowNode = {
  id: 'source',
  type: 'task',
  name: 'Source',
  position: { x: 0, y: 0 },
};

describe('resolveTngFlowNodeView', () => {
  it('tracks whether progress was explicitly supplied', () => {
    expect(resolveTngFlowNodeView(node, false, undefined, undefined, [])).toMatchObject({
      progress: null,
      progressSpecified: false,
    });
    expect(resolveTngFlowNodeView(node, false, { progress: null }, undefined, [])).toMatchObject({
      progress: null,
      progressSpecified: true,
    });
    expect(resolveTngFlowNodeView(node, false, undefined, { progress: 40 }, [])).toMatchObject({
      progress: 40,
      progressSpecified: true,
    });
  });
});

describe('resolveTngFlowConnectionView', () => {
  it('provides stable motion defaults', () => {
    expect(resolveTngFlowConnectionView(connection, false, undefined, [])).toMatchObject({
      motion: 'none',
      motionSpeed: 'normal',
      motionDirection: 'forward',
      message: null,
      animated: false,
    });
  });

  it('normalizes pulse motion and accessible runtime messages', () => {
    expect(
      resolveTngFlowConnectionView(
        connection,
        false,
        { motion: 'pulse', message: ' Waiting for approval ' },
        [],
      ),
    ).toMatchObject({
      motion: 'pulse',
      message: 'Waiting for approval',
      animated: true,
    });
  });

  it('maps the deprecated animated flag to flowing motion', () => {
    expect(resolveTngFlowConnectionView(connection, false, { animated: true }, [])).toMatchObject({
      motion: 'flow',
      motionSpeed: 'normal',
      motionDirection: 'forward',
      animated: true,
    });
  });

  it('gives explicit motion precedence over the deprecated animated flag', () => {
    expect(
      resolveTngFlowConnectionView(
        connection,
        false,
        {
          animated: true,
          motion: 'none',
          motionSpeed: 'fast',
          motionDirection: 'reverse',
        },
        [],
      ),
    ).toMatchObject({
      motion: 'none',
      motionSpeed: 'fast',
      motionDirection: 'reverse',
      animated: false,
    });
  });
});
