import '@angular/compiler';
import { Component } from '@angular/core';
import type { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';
import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  coerceTngCodeEditorSanitizeHtml,
  normalizeTngCodeEditorHighlightDebounceMs,
  normalizeTngCodeEditorRows,
  normalizeTngCodeEditorTabSize,
  readTngCodeEditorEventValue,
  TngCodeEditorComponent,
  type TngCodeEditorRenderStateChange,
  type TngCodeEditorSanitizeHtml,
} from './tng-code-editor.component';
import {
  createTngCodeHighlighterAdapter,
  resolveTngCodeHighlightingConfig,
  TNG_CODE_HIGHLIGHTING_CONFIG,
} from '../../utility/code-block/highlighting';

@Component({
  imports: [TngCodeEditorComponent],
  template: `
    <label for="source-editor">Source</label>
    <tng-code-editor
      id="source-editor"
      name="source"
      [adapter]="adapter"
      [ariaDescribedBy]="'source-help'"
      [ariaInvalid]="invalid"
      [ariaRequired]="required"
      [disabled]="disabled"
      [highlight]="highlight"
      [highlightDebounceMs]="highlightDebounceMs"
      [language]="language"
      [placeholder]="'Write source'"
      [readonly]="readonly"
      [required]="required"
      [rows]="rows"
      [sanitizeHtml]="sanitizeHtml"
      [tabSize]="tabSize"
      [theme]="theme"
      [value]="value"
      (renderStateChange)="renderStateEvents.push($event)"
      (valueChange)="onValueChange($event)"
    />
    <span id="source-help">Source help</span>
  `,
})
class CodeEditorHostComponent {
  public adapter: string | null = null;
  public disabled = false;
  public highlight = true;
  public highlightDebounceMs = 0;
  public invalid: boolean | null = null;
  public language: string | null = 'python';
  public readonly = false;
  public required = false;
  public rows: number | string = 6;
  public sanitizeHtml: TngCodeEditorSanitizeHtml = 'auto';
  public tabSize: number | string = 4;
  public theme: string | null = 'light';
  public value = 'print("ready")';
  public readonly renderStateEvents: TngCodeEditorRenderStateChange[] = [];
  public readonly valueChanges: string[] = [];

  public onValueChange(value: string): void {
    this.value = value;
    this.valueChanges.push(value);
  }
}

type FixtureResult = Readonly<{
  fixture: ComponentFixture<CodeEditorHostComponent>;
  host: CodeEditorHostComponent;
}>;

const specDir = dirname(fileURLToPath(import.meta.url));
const template = readFileSync(resolve(specDir, './tng-code-editor.component.html'), 'utf8');
const styles = readFileSync(resolve(specDir, './tng-code-editor.component.css'), 'utf8');

function provideHighlighting(
  adapters: readonly ReturnType<typeof createTngCodeHighlighterAdapter>[] = [],
  defaultAdapter?: string,
) {
  return {
    provide: TNG_CODE_HIGHLIGHTING_CONFIG,
    useValue: resolveTngCodeHighlightingConfig({ adapters, defaultAdapter }),
  } as const;
}

async function createFixture(
  options: Readonly<{
    adapters?: readonly ReturnType<typeof createTngCodeHighlighterAdapter>[];
    defaultAdapter?: string;
    init?: (host: CodeEditorHostComponent) => void;
  }> = {},
): Promise<FixtureResult> {
  const moduleRef = TestBed.configureTestingModule({
    imports: [CodeEditorHostComponent],
    providers: [provideHighlighting(options.adapters ?? [], options.defaultAdapter)],
  });
  moduleRef.overrideComponent(TngCodeEditorComponent, {
    set: { styles: [styles], template },
  });
  await moduleRef.compileComponents();

  const fixture = moduleRef.createComponent(CodeEditorHostComponent);
  const host = fixture.componentInstance;
  options.init?.(host);
  fixture.detectChanges();
  await flushRender(fixture);
  return { fixture, host };
}

async function flushRender(fixture: ComponentFixture<unknown>): Promise<void> {
  await Promise.resolve();
  fixture.changeDetectorRef.detectChanges();
  await Promise.resolve();
  fixture.changeDetectorRef.detectChanges();
}

function queryTextarea(fixture: ComponentFixture<unknown>): HTMLTextAreaElement {
  const root = fixture.nativeElement as HTMLElement;
  const textarea = root.querySelector('textarea');
  if (!(textarea instanceof HTMLTextAreaElement)) throw new Error('Missing textarea');
  return textarea;
}

function queryHighlightLayer(fixture: ComponentFixture<unknown>): HTMLElement {
  const root = fixture.nativeElement as HTMLElement;
  const layer = root.querySelector('[data-slot="highlight-layer"]');
  if (!(layer instanceof HTMLElement)) throw new Error('Missing highlight layer');
  return layer;
}

afterEach(() => {
  vi.useRealTimers();
  vi.restoreAllMocks();
  TestBed.resetTestingModule();
});

describe('tng-code-editor component', () => {
  it('exports the public component and normalizes public numeric inputs', () => {
    expect(typeof TngCodeEditorComponent).toBe('function');
    expect(normalizeTngCodeEditorRows(0)).toBe(1);
    expect(normalizeTngCodeEditorRows('bad')).toBe(10);
    expect(normalizeTngCodeEditorTabSize(2.6)).toBe(3);
    expect(normalizeTngCodeEditorHighlightDebounceMs(-1)).toBe(0);
    expect(normalizeTngCodeEditorHighlightDebounceMs('bad')).toBe(75);
  });

  it('coerces the sanitization policy', () => {
    expect(coerceTngCodeEditorSanitizeHtml(false)).toBe(false);
    expect(coerceTngCodeEditorSanitizeHtml('true')).toBe(true);
    expect(coerceTngCodeEditorSanitizeHtml(undefined)).toBe('auto');
  });

  it('reads only textarea event values', () => {
    const textarea = document.createElement('textarea');
    textarea.value = 'echo ready';
    const event = new Event('input');
    Object.defineProperty(event, 'target', { value: textarea });
    expect(readTngCodeEditorEventValue(event)).toBe('echo ready');

    const invalidEvent = new Event('input');
    Object.defineProperty(invalidEvent, 'target', { value: document.createElement('input') });
    expect(readTngCodeEditorEventValue(invalidEvent)).toBeNull();
  });

  it('renders the native editing and accessibility contract', async () => {
    const { fixture } = await createFixture();
    const textarea = queryTextarea(fixture);
    const layer = queryHighlightLayer(fixture);

    expect(textarea.value).toBe('print("ready")');
    expect(textarea.id).toBe('source-editor');
    expect(textarea.name).toBe('source');
    expect(textarea.rows).toBe(6);
    expect(textarea.wrap).toBe('off');
    expect(textarea.autocomplete).toBe('off');
    expect(textarea.getAttribute('spellcheck')).toBe('false');
    expect(textarea.getAttribute('aria-describedby')).toBe('source-help');
    expect(layer.getAttribute('aria-hidden')).toBe('true');
    expect(layer.textContent).toContain('print("ready")');
    expect(fixture.nativeElement.querySelector('label').htmlFor).toBe('source-editor');
  });

  it('updates the value model from native input without trapping Tab', async () => {
    const { fixture, host } = await createFixture();
    const textarea = queryTextarea(fixture);
    textarea.value = 'print("changed")';
    textarea.dispatchEvent(new Event('input', { bubbles: true }));
    fixture.detectChanges();

    const tabEvent = new KeyboardEvent('keydown', { bubbles: true, cancelable: true, key: 'Tab' });
    textarea.dispatchEvent(tabEvent);

    expect(host.value).toBe('print("changed")');
    expect(host.valueChanges).toEqual(['print("changed")']);
    expect(tabEvent.defaultPrevented).toBe(false);
  });

  it.each(['disabled', 'readonly'] as const)('does not update while %s', async (state) => {
    const { fixture, host } = await createFixture({
      init: (component) => {
        component[state] = true;
      },
    });
    const textarea = queryTextarea(fixture);
    textarea.value = 'mutated';
    textarea.dispatchEvent(new Event('input', { bubbles: true }));
    fixture.detectChanges();

    expect(host.value).toBe('print("ready")');
    expect(host.valueChanges).toEqual([]);
    expect(textarea[state === 'readonly' ? 'readOnly' : 'disabled']).toBe(true);
  });

  it('synchronizes highlight scrolling in both axes', async () => {
    const { fixture } = await createFixture();
    const textarea = queryTextarea(fixture);
    const layer = queryHighlightLayer(fixture);
    textarea.scrollTop = 31;
    textarea.scrollLeft = 47;
    textarea.dispatchEvent(new Event('scroll'));

    expect(layer.scrollTop).toBe(31);
    expect(layer.scrollLeft).toBe(47);
  });

  it('passes language, theme, adapter, and source to the configured highlighter', async () => {
    const highlight = vi.fn(
      (input: { code: string; language: string | null; theme?: string | null }) => ({
        html: `<span class="token">${input.code}</span>`,
        kind: 'html' as const,
        language: input.language,
      }),
    );
    const adapter = createTngCodeHighlighterAdapter('test', highlight);
    const { fixture } = await createFixture({
      adapters: [adapter],
      defaultAdapter: 'test',
      init: (host) => {
        host.adapter = 'test';
        host.theme = 'github-dark';
      },
    });

    expect(highlight).toHaveBeenCalledWith({
      code: 'print("ready")',
      includeLineWrappers: false,
      language: 'python',
      theme: 'github-dark',
    });
    expect(queryHighlightLayer(fixture).querySelector('.token')?.textContent).toBe(
      'print("ready")',
    );
  });

  it('renders token results and escapes token content', async () => {
    const adapter = createTngCodeHighlighterAdapter('tokens', () => ({
      kind: 'tokens',
      tokens: [[{ className: 'keyword', content: '<script>' }]],
    }));
    const { fixture } = await createFixture({ adapters: [adapter], defaultAdapter: 'tokens' });
    const layer = queryHighlightLayer(fixture);

    expect(layer.querySelector('script')).toBeNull();
    expect(layer.querySelector('.keyword')?.textContent).toBe('<script>');
  });

  it('sanitizes adapter HTML by default', async () => {
    const adapter = createTngCodeHighlighterAdapter('unsafe', () => ({
      html: '<img src=x onerror="window.__tngCodeEditorHack=1"><span>safe</span>',
      kind: 'html',
      trustedHtml: true,
    }));
    const { fixture } = await createFixture({ adapters: [adapter], defaultAdapter: 'unsafe' });
    const layer = queryHighlightLayer(fixture);

    expect(layer.querySelector('img')?.getAttribute('onerror')).toBeNull();
    expect(layer.textContent).toContain('safe');
  });

  it('allows explicitly trusted adapter HTML when sanitization is disabled', async () => {
    const adapter = createTngCodeHighlighterAdapter('trusted', () => ({
      html: '<span data-trusted="yes" onclick="window.__tngCodeEditorHack=1">trusted</span>',
      kind: 'html',
      trustedHtml: true,
    }));
    const { fixture } = await createFixture({
      adapters: [adapter],
      defaultAdapter: 'trusted',
      init: (host) => {
        host.sanitizeHtml = false;
      },
    });
    const trusted = queryHighlightLayer(fixture).querySelector('[data-trusted="yes"]');

    expect(trusted?.getAttribute('onclick')).toBe('window.__tngCodeEditorHack=1');
  });

  it('keeps escaped plain text visible after highlighter failure', async () => {
    const adapter = createTngCodeHighlighterAdapter('failure', () =>
      Promise.reject(new Error('highlight failed')),
    );
    const { fixture, host } = await createFixture({
      adapters: [adapter],
      defaultAdapter: 'failure',
      init: (component) => {
        component.value = '<script>alert(1)</script>';
      },
    });
    const layer = queryHighlightLayer(fixture);

    expect(layer.querySelector('script')).toBeNull();
    expect(layer.textContent).toContain('<script>alert(1)</script>');
    expect(host.renderStateEvents.at(-1)?.state).toBe('error');
  });

  it('ignores stale asynchronous highlight responses', async () => {
    const resolvers: ((value: { html: string; kind: 'html' }) => void)[] = [];
    const adapter = createTngCodeHighlighterAdapter(
      'deferred',
      () => new Promise((resolveResult) => resolvers.push(resolveResult)),
    );
    const { fixture, host } = await createFixture({
      adapters: [adapter],
      defaultAdapter: 'deferred',
    });

    host.value = 'second';
    await flushRender(fixture);
    expect(resolvers).toHaveLength(2);

    resolvers[1]?.({ html: '<span>second-result</span>', kind: 'html' });
    await Promise.resolve();
    fixture.detectChanges();
    resolvers[0]?.({ html: '<span>stale-result</span>', kind: 'html' });
    await Promise.resolve();
    fixture.detectChanges();

    expect(queryHighlightLayer(fixture).textContent).toContain('second-result');
    expect(queryHighlightLayer(fixture).textContent).not.toContain('stale-result');
  });

  it('does not call the adapter when highlighting is disabled', async () => {
    const highlight = vi.fn(() => ({ html: 'highlighted', kind: 'html' as const }));
    const adapter = createTngCodeHighlighterAdapter('spy', highlight);
    const { fixture } = await createFixture({
      adapters: [adapter],
      defaultAdapter: 'spy',
      init: (host) => {
        host.highlight = false;
        host.value = '<b>plain</b>';
      },
    });

    expect(highlight).not.toHaveBeenCalled();
    expect(queryHighlightLayer(fixture).querySelector('b')).toBeNull();
    expect(queryHighlightLayer(fixture).textContent).toContain('<b>plain</b>');
  });
});
