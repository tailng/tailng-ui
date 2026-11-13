import type { SaxesAttributeNS, SaxesTagNS } from 'saxes';
import { SaxesParser } from './internal/saxes.generated';

const SVG_NAMESPACE = 'http://www.w3.org/2000/svg';
const XLINK_NAMESPACE = 'http://www.w3.org/1999/xlink';
const XMLNS_NAMESPACE = 'http://www.w3.org/2000/xmlns/';
const MAX_SVG_SOURCE_LENGTH = 100_000;
const MAX_SVG_DEPTH = 32;
const MAX_SVG_NODES = 2_000;
const MAX_ATTRIBUTES_PER_ELEMENT = 64;

const ALLOWED_ELEMENTS = new Set([
  'circle',
  'clipPath',
  'defs',
  'desc',
  'ellipse',
  'g',
  'line',
  'linearGradient',
  'mask',
  'path',
  'polygon',
  'polyline',
  'radialGradient',
  'rect',
  'stop',
  'svg',
  'symbol',
  'title',
  'use',
]);

const ALLOWED_ATTRIBUTES = new Set([
  'aria-hidden',
  'aria-label',
  'aria-labelledby',
  'class',
  'clip-path',
  'clip-rule',
  'color',
  'cx',
  'cy',
  'd',
  'fill',
  'fill-opacity',
  'fill-rule',
  'focusable',
  'fx',
  'fy',
  'gradientTransform',
  'gradientUnits',
  'height',
  'href',
  'id',
  'mask',
  'offset',
  'opacity',
  'pathLength',
  'points',
  'preserveAspectRatio',
  'r',
  'role',
  'rx',
  'ry',
  'spreadMethod',
  'stop-color',
  'stop-opacity',
  'stroke',
  'stroke-dasharray',
  'stroke-dashoffset',
  'stroke-linecap',
  'stroke-linejoin',
  'stroke-miterlimit',
  'stroke-opacity',
  'stroke-width',
  'transform',
  'vector-effect',
  'viewBox',
  'width',
  'x',
  'x1',
  'x2',
  'y',
  'y1',
  'y2',
]);

const ALLOWED_STYLE_PROPERTIES = new Set([
  'color',
  'fill',
  'fill-opacity',
  'fill-rule',
  'opacity',
  'stop-color',
  'stop-opacity',
  'stroke',
  'stroke-dasharray',
  'stroke-dashoffset',
  'stroke-linecap',
  'stroke-linejoin',
  'stroke-miterlimit',
  'stroke-opacity',
  'stroke-width',
]);

const TEXT_ELEMENTS = new Set(['desc', 'title']);
const LOCAL_REFERENCE_ATTRIBUTES = new Set(['clip-path', 'fill', 'href', 'mask', 'stroke']);

export type TngSvgAttribute = Readonly<{
  name: string;
  namespace?: typeof XLINK_NAMESPACE;
  value: string;
}>;

export type TngSvgTextNode = Readonly<{
  kind: 'text';
  value: string;
}>;

export type TngSvgElementNode = Readonly<{
  attributes: readonly TngSvgAttribute[];
  children: readonly TngSvgNode[];
  kind: 'element';
  tagName: string;
}>;

export type TngSvgNode = TngSvgElementNode | TngSvgTextNode;

type MutableSvgElementNode = {
  attributes: TngSvgAttribute[];
  children: TngSvgNode[];
  kind: 'element';
  tagName: string;
};

const parsedSvgCache = new Map<string, TngSvgElementNode>();

function invalidSvg(reason: string): Error {
  return new Error(`Invalid icon SVG: ${reason}`);
}

function assertSafeReferenceValue(attributeName: string, value: string): void {
  if (attributeName === 'href') {
    if (!/^#[A-Za-z_][A-Za-z0-9_.:-]*$/.test(value)) {
      throw invalidSvg('href must reference an element in the same icon');
    }
    return;
  }

  const urlToken = /url\(\s*(['"]?)([^'")\s]+)\1\s*\)/giu;
  const matches = [...value.matchAll(urlToken)];

  if (/url\s*\(/iu.test(value) && matches.length === 0) {
    throw invalidSvg(`attribute "${attributeName}" contains an invalid URL`);
  }

  for (const match of matches) {
    if (!/^#[A-Za-z_][A-Za-z0-9_.:-]*$/.test(match[2])) {
      throw invalidSvg(`attribute "${attributeName}" must use a local URL reference`);
    }
  }
}

function assertSafeAttributeValue(attributeName: string, value: string): void {
  if (/javascript\s*:/iu.test(value) || /expression\s*\(/iu.test(value)) {
    throw invalidSvg(`attribute "${attributeName}" contains an unsafe value`);
  }

  if (LOCAL_REFERENCE_ATTRIBUTES.has(attributeName)) {
    assertSafeReferenceValue(attributeName, value);
    return;
  }

  if (attributeName === 'id' && !/^[A-Za-z_][A-Za-z0-9_.:-]*$/.test(value)) {
    throw invalidSvg('id must be a valid local SVG identifier');
  }

  if (/url\s*\(/iu.test(value)) {
    throw invalidSvg(`attribute "${attributeName}" cannot contain a URL`);
  }
}

function normalizeStyleAttributes(style: string): TngSvgAttribute[] {
  const normalized: TngSvgAttribute[] = [];

  for (const declaration of style.split(';')) {
    const separatorIndex = declaration.indexOf(':');
    if (separatorIndex < 0) {
      if (declaration.trim().length > 0) {
        throw invalidSvg('style contains a malformed declaration');
      }
      continue;
    }

    const property = declaration.slice(0, separatorIndex).trim().toLowerCase();
    const value = declaration.slice(separatorIndex + 1).trim();

    if (!ALLOWED_STYLE_PROPERTIES.has(property)) {
      throw invalidSvg(`style property "${property}" is not allowed`);
    }
    if (value.length === 0) {
      throw invalidSvg(`style property "${property}" cannot be empty`);
    }

    assertSafeAttributeValue(property, value);
    normalized.push({ name: property, value });
  }

  return normalized;
}

function normalizeAttribute(attribute: SaxesAttributeNS): readonly TngSvgAttribute[] {
  if (attribute.uri === XMLNS_NAMESPACE) {
    return [];
  }

  if (
    attribute.prefix.toLowerCase().startsWith('on') ||
    attribute.local.toLowerCase().startsWith('on')
  ) {
    throw invalidSvg(`event attribute "${attribute.name}" is not allowed`);
  }

  if (attribute.local === 'style' && attribute.uri.length === 0) {
    return normalizeStyleAttributes(attribute.value);
  }

  if (!ALLOWED_ATTRIBUTES.has(attribute.local)) {
    throw invalidSvg(`attribute "${attribute.name}" is not allowed`);
  }

  if (attribute.uri.length > 0 && attribute.uri !== XLINK_NAMESPACE) {
    throw invalidSvg(`attribute namespace "${attribute.uri}" is not allowed`);
  }

  if (attribute.uri === XLINK_NAMESPACE && attribute.local !== 'href') {
    throw invalidSvg(`xlink attribute "${attribute.name}" is not allowed`);
  }

  assertSafeAttributeValue(attribute.local, attribute.value);

  return [
    {
      name: attribute.uri === XLINK_NAMESPACE ? `xlink:${attribute.local}` : attribute.local,
      ...(attribute.uri === XLINK_NAMESPACE ? { namespace: XLINK_NAMESPACE } : {}),
      value: attribute.value,
    },
  ];
}

function normalizeAttributes(tag: SaxesTagNS): TngSvgAttribute[] {
  const sourceAttributes = Object.values(tag.attributes);
  if (sourceAttributes.length > MAX_ATTRIBUTES_PER_ELEMENT) {
    throw invalidSvg(`element "${tag.local}" has too many attributes`);
  }

  const normalized = new Map<string, TngSvgAttribute>();
  for (const attribute of sourceAttributes) {
    for (const result of normalizeAttribute(attribute)) {
      normalized.set(result.name, result);
    }
  }

  return [...normalized.values()];
}

function freezeNode(node: MutableSvgElementNode): TngSvgElementNode {
  const children = node.children.map((child): TngSvgNode => {
    if (child.kind === 'text') {
      return Object.freeze(child);
    }
    return freezeNode(child as MutableSvgElementNode);
  });

  return Object.freeze({
    attributes: Object.freeze([...node.attributes]),
    children: Object.freeze(children),
    kind: 'element' as const,
    tagName: node.tagName,
  });
}

export function parseTngIconSvg(svg: string): TngSvgElementNode {
  const cached = parsedSvgCache.get(svg);
  if (cached !== undefined) {
    return cached;
  }

  if (svg.length === 0 || svg.length > MAX_SVG_SOURCE_LENGTH) {
    throw invalidSvg('source is empty or exceeds the size limit');
  }

  let root: MutableSvgElementNode | undefined;
  let nodeCount = 0;
  const seenIds = new Set<string>();
  const stack: MutableSvgElementNode[] = [];
  const parser = new SaxesParser({ xmlns: true });

  parser.on('doctype', () => {
    throw invalidSvg('DOCTYPE declarations are not allowed');
  });
  parser.on('processinginstruction', () => {
    throw invalidSvg('processing instructions are not allowed');
  });
  parser.on('cdata', () => {
    throw invalidSvg('CDATA sections are not allowed');
  });
  parser.on('opentag', (tag: SaxesTagNS): void => {
    nodeCount += 1;
    if (nodeCount > MAX_SVG_NODES) {
      throw invalidSvg('node count exceeds the limit');
    }
    if (stack.length >= MAX_SVG_DEPTH) {
      throw invalidSvg('nesting depth exceeds the limit');
    }
    if (!ALLOWED_ELEMENTS.has(tag.local)) {
      throw invalidSvg(`element "${tag.name}" is not allowed`);
    }
    if (tag.uri.length > 0 && tag.uri !== SVG_NAMESPACE) {
      throw invalidSvg(`element namespace "${tag.uri}" is not allowed`);
    }

    const node: MutableSvgElementNode = {
      attributes: normalizeAttributes(tag),
      children: [],
      kind: 'element',
      tagName: tag.local,
    };
    const id = node.attributes.find((attribute): boolean => attribute.name === 'id')?.value;
    if (id !== undefined) {
      if (seenIds.has(id)) {
        throw invalidSvg(`duplicate id "${id}" is not allowed`);
      }
      seenIds.add(id);
    }

    const parent = stack.at(-1);
    if (parent === undefined) {
      if (root !== undefined || node.tagName !== 'svg') {
        throw invalidSvg('the document must have exactly one svg root element');
      }
      root = node;
    } else {
      parent.children.push(node);
    }
    stack.push(node);
  });
  parser.on('text', (value: string): void => {
    if (value.trim().length === 0) {
      return;
    }

    const parent = stack.at(-1);
    if (parent === undefined || !TEXT_ELEMENTS.has(parent.tagName)) {
      throw invalidSvg('text is only allowed inside title and desc elements');
    }

    nodeCount += 1;
    if (nodeCount > MAX_SVG_NODES) {
      throw invalidSvg('node count exceeds the limit');
    }
    parent.children.push({ kind: 'text', value });
  });
  parser.on('closetag', (): void => {
    stack.pop();
  });
  parser.on('error', (error: Error): void => {
    throw invalidSvg(error.message);
  });

  parser.write(svg).close();

  if (root === undefined || stack.length !== 0) {
    throw invalidSvg('the document must contain a complete svg root element');
  }

  const result = freezeNode(root);
  parsedSvgCache.set(svg, result);
  return result;
}
