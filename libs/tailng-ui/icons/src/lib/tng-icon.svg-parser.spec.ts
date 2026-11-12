import { describe, expect, it } from 'vitest';
import { parseTngIconSvg } from './tng-icon.svg-parser';

function getAttributeValue(
  svg: ReturnType<typeof parseTngIconSvg>,
  name: string,
): string | undefined {
  return svg.attributes.find((attribute): boolean => attribute.name === name)?.value;
}

describe('parseTngIconSvg', () => {
  it('parses the supported SVG subset into an immutable tree', () => {
    const svg = parseTngIconSvg(
      '<svg viewBox="0 0 24 24"><g><path d="M1 2h3"/></g><title>Example</title></svg>',
    );

    expect(svg.tagName).toBe('svg');
    expect(getAttributeValue(svg, 'viewBox')).toBe('0 0 24 24');
    expect(svg.children[0]).toMatchObject({ kind: 'element', tagName: 'g' });
    expect(svg.children[1]).toMatchObject({ kind: 'element', tagName: 'title' });
    expect(Object.isFrozen(svg)).toBe(true);
    expect(Object.isFrozen(svg.children)).toBe(true);
  });

  it('normalizes safe presentation styles into SVG attributes', () => {
    const svg = parseTngIconSvg(
      '<svg style="stroke-width:var(--ng-icon__stroke-width, 2);fill:none"></svg>',
    );

    expect(getAttributeValue(svg, 'stroke-width')).toBe('var(--ng-icon__stroke-width, 2)');
    expect(getAttributeValue(svg, 'fill')).toBe('none');
    expect(getAttributeValue(svg, 'style')).toBeUndefined();
  });

  it.each([
    ['scripts', '<svg><script>alert(1)</script></svg>'],
    ['foreign objects', '<svg><foreignObject><div>unsafe</div></foreignObject></svg>'],
    ['event attributes', '<svg><path onclick="alert(1)"/></svg>'],
    ['external href values', '<svg><use href="https://example.com/icon.svg#shape"/></svg>'],
    ['data URLs', '<svg><path fill="url(data:image/svg+xml,unsafe)"/></svg>'],
    ['unsafe styles', '<svg style="background:url(https://example.com/a.png)"></svg>'],
    ['doctype declarations', '<!DOCTYPE svg><svg></svg>'],
    ['multiple roots', '<svg></svg><svg></svg>'],
    ['duplicate IDs', '<svg><path id="same"/><path id="same"/></svg>'],
  ])('rejects %s', (_caseName, source) => {
    expect(() => parseTngIconSvg(source)).toThrow('Invalid icon SVG');
  });

  it('accepts same-icon references used by gradients, masks, and symbols', () => {
    const svg = parseTngIconSvg(
      '<svg><defs><linearGradient id="paint"><stop offset="0" stop-color="red"/></linearGradient></defs><path fill="url(#paint)"/><use href="#shape"/><symbol id="shape"><path d="M0 0"/></symbol></svg>',
    );

    expect(svg.children).toHaveLength(4);
  });
});
