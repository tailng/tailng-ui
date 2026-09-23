import { describe, expect, it } from 'vitest';
import { allocateTngSplitLayout, resizeTngSplitPair } from './tng-split-layout.engine';

describe('TailNG split layout sizing engine', () => {
  it('allocates remaining space to grow panes', () => {
    const result = allocateTngSplitLayout(1000, [
      {
        id: 'palette',
        desiredSize: 272,
        minSize: 224,
        maxSize: 360,
        grow: 0,
        collapsed: false,
        collapsedSize: 56,
      },
      {
        id: 'canvas',
        desiredSize: 480,
        minSize: 480,
        maxSize: Number.POSITIVE_INFINITY,
        grow: 1,
        collapsed: false,
        collapsedSize: 0,
      },
      {
        id: 'inspector',
        desiredSize: 288,
        minSize: 288,
        maxSize: 480,
        grow: 0,
        collapsed: true,
        collapsedSize: 0,
      },
    ]);

    expect(result.sizes.get('palette')).toBe(272);
    expect(result.sizes.get('canvas')).toBe(728);
    expect(result.sizes.get('inspector')).toBe(0);
    expect(result.constrained).toBe(false);
  });

  it('shrinks grow panes before fixed panes', () => {
    const result = allocateTngSplitLayout(800, [
      {
        id: 'fixed',
        desiredSize: 300,
        minSize: 200,
        maxSize: 400,
        grow: 0,
        collapsed: false,
        collapsedSize: 0,
      },
      {
        id: 'grow',
        desiredSize: 700,
        minSize: 400,
        maxSize: Number.POSITIVE_INFINITY,
        grow: 1,
        collapsed: false,
        collapsedSize: 0,
      },
    ]);

    expect(result.sizes.get('fixed')).toBe(300);
    expect(result.sizes.get('grow')).toBe(500);
  });

  it('enters constrained mode rather than overflowing impossible minimums', () => {
    const result = allocateTngSplitLayout(300, [
      {
        id: 'left',
        desiredSize: 240,
        minSize: 200,
        maxSize: 300,
        grow: 0,
        collapsed: false,
        collapsedSize: 0,
      },
      {
        id: 'right',
        desiredSize: 240,
        minSize: 200,
        maxSize: 300,
        grow: 0,
        collapsed: false,
        collapsedSize: 0,
      },
    ]);

    expect(result.constrained).toBe(true);
    expect((result.sizes.get('left') ?? 0) + (result.sizes.get('right') ?? 0)).toBe(300);
  });

  
  it('clamps pair movement against both panes', () => {
    const constraints = {
      previousMin: 200,
      previousMax: 450,
      nextMin: 400,
      nextMax: 600,
    };

    expect(
      resizeTngSplitPair(
        { previousSize: 300, nextSize: 500 },
        400,
        constraints,
      ),
    ).toEqual({ previousSize: 400, nextSize: 400 });

    expect(
      resizeTngSplitPair(
        { previousSize: 300, nextSize: 500 },
        -400,
        constraints,
      ),
    ).toEqual({ previousSize: 200, nextSize: 600 });
  });
});
