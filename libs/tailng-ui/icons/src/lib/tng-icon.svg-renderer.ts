import { Directive, ElementRef, Renderer2, effect, inject, input } from '@angular/core';
import type { TngSvgAttribute, TngSvgElementNode, TngSvgNode } from './tng-icon.svg-parser';

const SVG_NAMESPACE = 'http://www.w3.org/2000/svg';
let nextIconInstanceId = 0;

function collectIds(node: TngSvgNode, idMap: Map<string, string>, instanceId: string): void {
  if (node.kind === 'text') {
    return;
  }

  const id = node.attributes.find((attribute): boolean => attribute.name === 'id')?.value;
  if (id !== undefined) {
    idMap.set(id, `${instanceId}-${id}`);
  }

  for (const child of node.children) {
    collectIds(child, idMap, instanceId);
  }
}

function rewriteLocalReferences(value: string, idMap: ReadonlyMap<string, string>): string {
  const directReference = /^#([A-Za-z_][A-Za-z0-9_.:-]*)$/u.exec(value);
  if (directReference !== null) {
    const replacement = idMap.get(directReference[1]);
    return replacement === undefined ? value : `#${replacement}`;
  }

  return value.replace(
    /url\(\s*(['"]?)#([A-Za-z_][A-Za-z0-9_.:-]*)\1\s*\)/giu,
    (match, _quote: string, id: string): string => {
      const replacement = idMap.get(id);
      return replacement === undefined ? match : `url(#${replacement})`;
    },
  );
}

function setAttribute(
  renderer: Renderer2,
  element: Element,
  attribute: TngSvgAttribute,
  idMap: ReadonlyMap<string, string>,
): void {
  const value =
    attribute.name === 'id'
      ? (idMap.get(attribute.value) ?? attribute.value)
      : rewriteLocalReferences(attribute.value, idMap);

  renderer.setAttribute(element, attribute.name, value, attribute.namespace);
}

function renderNode(
  renderer: Renderer2,
  node: TngSvgNode,
  idMap: ReadonlyMap<string, string>,
): Node {
  if (node.kind === 'text') {
    return renderer.createText(node.value) as Node;
  }

  const element = renderer.createElement(node.tagName, SVG_NAMESPACE) as Element;
  for (const attribute of node.attributes) {
    setAttribute(renderer, element, attribute, idMap);
  }
  for (const child of node.children) {
    renderer.appendChild(element, renderNode(renderer, child, idMap));
  }

  return element;
}

export function renderTngIconSvg(
  renderer: Renderer2,
  definition: TngSvgElementNode,
  instanceId: string,
): SVGElement {
  const idMap = new Map<string, string>();
  collectIds(definition, idMap, instanceId);

  const svg = renderNode(renderer, definition, idMap) as SVGElement;
  renderer.setAttribute(svg, 'aria-hidden', 'true');
  renderer.setAttribute(svg, 'focusable', 'false');
  renderer.setAttribute(svg, 'height', '100%');
  renderer.setAttribute(svg, 'width', '100%');
  return svg;
}

@Directive({
  selector: '[tngIconSvgDefinition]',
  standalone: true,
})
export class TngIconSvgRenderer {
  public readonly definition = input.required<TngSvgElementNode>({ alias: 'tngIconSvgDefinition' });
  private readonly elementRef = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly instanceId = `tng-icon-${nextIconInstanceId++}`;
  private readonly renderer = inject(Renderer2);
  private renderedSvg: SVGElement | undefined;

  public constructor() {
    effect((): void => {
      const definition = this.definition();
      if (this.renderedSvg !== undefined) {
        this.renderer.removeChild(this.elementRef.nativeElement, this.renderedSvg);
      }

      this.renderedSvg = renderTngIconSvg(this.renderer, definition, this.instanceId);
      this.renderer.appendChild(this.elementRef.nativeElement, this.renderedSvg);
    });
  }
}
