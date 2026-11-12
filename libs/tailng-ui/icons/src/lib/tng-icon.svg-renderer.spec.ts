import { RendererFactory2 } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { describe, expect, it, vi } from 'vitest';
import { parseTngIconSvg } from './tng-icon.svg-parser';
import { renderTngIconSvg } from './tng-icon.svg-renderer';

describe('renderTngIconSvg', () => {
  it('creates namespace-correct SVG nodes without using a property or HTML sink', () => {
    const renderer = TestBed.inject(RendererFactory2).createRenderer(null, null);
    const setProperty = vi.spyOn(renderer, 'setProperty');
    const definition = parseTngIconSvg('<svg viewBox="0 0 24 24"><path d="M12 2v20"/></svg>');

    const svg = renderTngIconSvg(renderer, definition, 'test-icon');

    expect(svg.namespaceURI).toBe('http://www.w3.org/2000/svg');
    expect(svg.querySelector('path')?.namespaceURI).toBe('http://www.w3.org/2000/svg');
    expect(svg.getAttribute('aria-hidden')).toBe('true');
    expect(svg.getAttribute('focusable')).toBe('false');
    expect(setProperty).not.toHaveBeenCalled();
  });

  it('prefixes IDs per instance and rewrites local references', () => {
    const renderer = TestBed.inject(RendererFactory2).createRenderer(null, null);
    const definition = parseTngIconSvg(
      '<svg><defs><linearGradient id="paint"><stop offset="0"/></linearGradient></defs><path fill="url(#paint)"/></svg>',
    );

    const first = renderTngIconSvg(renderer, definition, 'first');
    const second = renderTngIconSvg(renderer, definition, 'second');

    expect(first.querySelector('linearGradient')?.id).toBe('first-paint');
    expect(first.querySelector('path')?.getAttribute('fill')).toBe('url(#first-paint)');
    expect(second.querySelector('linearGradient')?.id).toBe('second-paint');
    expect(second.querySelector('path')?.getAttribute('fill')).toBe('url(#second-paint)');
  });

  it('renders title and description content as text nodes', () => {
    const renderer = TestBed.inject(RendererFactory2).createRenderer(null, null);
    const definition = parseTngIconSvg(
      '<svg><title>Save &amp; close</title><desc>Closes the editor</desc></svg>',
    );

    const svg = renderTngIconSvg(renderer, definition, 'labelled');

    expect(svg.querySelector('title')?.textContent).toBe('Save & close');
    expect(svg.querySelector('desc')?.textContent).toBe('Closes the editor');
  });
});
