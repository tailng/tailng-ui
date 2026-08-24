import { describe, expect, it } from 'vitest';
import { positionFixedAnchoredOverlay } from './fixed-anchored-overlay';

type MutableOverlayStyle = {
  left: string;
  maxHeight: string;
  maxWidth: string;
  minWidth: string;
  top: string;
  width: string;
};

function createRect(left: number, top: number, width: number, height: number) {
  return { height, left, top, width };
}

function createOverlay(height = 200): Readonly<{
  element: HTMLElement;
  style: MutableOverlayStyle;
}> {
  const style: MutableOverlayStyle = {
    left: '',
    maxHeight: '',
    maxWidth: '',
    minWidth: '',
    top: '',
    width: '',
  };
  const element = {
    getBoundingClientRect: () =>
      createRect(
        Number.parseFloat(style.left) || 0,
        Number.parseFloat(style.top) || 0,
        Number.parseFloat(style.width) || 0,
        height,
      ),
    style,
  } as unknown as HTMLElement;

  return { element, style };
}

function position(
  options: Readonly<{
    anchorLeft?: number;
    anchorWidth: number;
    direction?: 'ltr' | 'rtl';
    maxInlineSize?: number;
    minInlineSize?: number;
    shift?: boolean;
    viewportWidth?: number;
  }>,
) {
  const overlay = createOverlay();
  const anchorLeft = options.anchorLeft ?? 400;
  const result = positionFixedAnchoredOverlay({
    anchor: {} as HTMLElement,
    anchorRect: createRect(anchorLeft, 100, options.anchorWidth, 40),
    collision: { flip: false, padding: 12, shift: options.shift ?? false },
    direction: options.direction,
    maxInlineSize: options.maxInlineSize,
    minInlineSize: options.minInlineSize,
    offset: { side: 8 },
    overlay: overlay.element,
    placement: { align: 'end', side: 'bottom' },
    viewportMargin: 12,
    windowRef: {
      innerHeight: 800,
      innerWidth: options.viewportWidth ?? 1200,
    } as Window,
  });

  return { result, style: overlay.style };
}

describe('positionFixedAnchoredOverlay inline sizing', () => {
  it('uses the minimum width when the anchor is narrower', () => {
    const { result, style } = position({
      anchorWidth: 240,
      maxInlineSize: 320,
      minInlineSize: 288,
    });

    expect(result.inlineSize).toBe(288);
    expect(result.minInlineSize).toBe(288);
    expect(result.maxInlineSize).toBe(320);
    expect(style.width).toBe('288px');
    expect(style.left).toBe('352px');
  });

  it('follows an anchor whose width is between the bounds', () => {
    const { result, style } = position({
      anchorWidth: 300,
      maxInlineSize: 320,
      minInlineSize: 288,
    });

    expect(result.inlineSize).toBe(300);
    expect(style.width).toBe('300px');
    expect(style.left).toBe('400px');
  });

  it('caps a wider anchor and keeps its right edge aligned in LTR', () => {
    const { result, style } = position({
      anchorLeft: 100,
      anchorWidth: 480,
      maxInlineSize: 320,
      minInlineSize: 288,
    });

    expect(result.inlineSize).toBe(320);
    expect(style.width).toBe('320px');
    expect(style.left).toBe('260px');
  });

  it('maps logical end alignment to the left edge in RTL', () => {
    const { style } = position({
      anchorLeft: 260,
      anchorWidth: 240,
      direction: 'rtl',
      maxInlineSize: 320,
      minInlineSize: 288,
    });

    expect(style.left).toBe('260px');
  });

  it('lets the viewport cap both bounds and shifts the overlay into view', () => {
    const { result, style } = position({
      anchorLeft: 12,
      anchorWidth: 120,
      maxInlineSize: 320,
      minInlineSize: 288,
      shift: true,
      viewportWidth: 300,
    });

    expect(result.inlineSize).toBe(276);
    expect(result.minInlineSize).toBe(276);
    expect(result.maxInlineSize).toBe(276);
    expect(style.minWidth).toBe('276px');
    expect(style.maxWidth).toBe('276px');
    expect(style.left).toBe('12px');
  });
});
