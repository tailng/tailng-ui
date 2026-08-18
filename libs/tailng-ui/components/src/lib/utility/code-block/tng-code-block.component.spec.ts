import '@angular/compiler';
import { Component } from '@angular/core';
import type { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import type { TngCopyErrorEvent, TngCopyEvent, TngCopySuccessEvent } from '@tailng-ui/primitives';
import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it, vi, afterEach } from 'vitest';
import {
  createTngCodeHighlighterAdapter,
  resolveTngCodeHighlightingConfig,
  TNG_CODE_HIGHLIGHTING_CONFIG,
  type TngCodeHighlightInput,
  type TngCodeHighlightResult,
} from './highlighting';
import {
  coerceTngCodeBlockCopyResetDuration,
  coerceTngCodeBlockHighlightMode,
  normalizeTngCodeBlockCode,
  TngCodeBlockComponent,
  toTngCodeBlockLineNumbers,
  type TngCodeBlockCopyContext,
  type TngCodeBlockHighlightLineInput,
  type TngCodeBlockRenderStateChange,
  type TngCodeBlockSanitizeHtml,
} from './tng-code-block.component';

@Component({
  imports: [TngCodeBlockComponent],
  template: `
    <button type="button" data-testid="before-btn">Before</button>

    <tng-code-block
      class="consumer-class"
      data-testid="code-block"
      data-consumer-static="yes"
      [attr.data-consumer-dynamic]="consumerAttr"
      [adapter]="adapter"
      [caption]="caption"
      [code]="code"
      [copy]="copy"
      [copyLabel]="copyLabel"
      [copiedLabel]="copiedLabel"
      [copySuccessDurationMs]="copySuccessDurationMs"
      [copyText]="copyText"
      [focusLines]="focusLines"
      [highlight]="highlight"
      [highlightDebounceMs]="highlightDebounceMs"
      [highlightLines]="highlightLines"
      [language]="language"
      [lineNumbers]="lineNumbers"
      [maxHeight]="maxHeight"
      [sanitizeHtml]="sanitizeHtml"
      [showHeader]="showHeader"
      [showLanguageBadge]="showLanguageBadge"
      [startingLineNumber]="startingLineNumber"
      [theme]="theme"
      [title]="title"
      [wrap]="wrap"
      (copy)="onCopy($event)"
      (copyError)="onCopyError($event)"
      (copySuccess)="onCopySuccess($event)"
      (renderStateChange)="onRenderStateChange($event)"
    ></tng-code-block>

    <button type="button" data-testid="after-btn">After</button>
  `,
})
class CodeBlockHostComponent {
  public adapter: string | null = null;
  public caption: string | null = null;
  public code = 'const answer = 42;';
  public consumerAttr = 'dynamic';
  public copy: boolean | 'auto' = 'auto';
  public copyLabel = 'Copy code';
  public copiedLabel = 'Copied';
  public copySuccessDurationMs: number | undefined;
  public copyText: string | ((ctx: TngCodeBlockCopyContext) => string) | null = null;
  public focusLines = false;
  public highlight = true;
  public highlightDebounceMs = 0;
  public highlightLines: readonly TngCodeBlockHighlightLineInput[] | null = null;
  public language: string | null = null;
  public lineNumbers: boolean | 'auto' = false;
  public maxHeight: number | string | null = null;
  public sanitizeHtml: TngCodeBlockSanitizeHtml = 'auto';
  public showHeader = true;
  public showLanguageBadge = true;
  public startingLineNumber = 1;
  public theme: string | null = null;
  public title: string | null = null;
  public wrap = false;

  public readonly copyEvents: TngCopyEvent[] = [];
  public readonly copyErrorEvents: TngCopyErrorEvent[] = [];
  public readonly copySuccessEvents: TngCopySuccessEvent[] = [];
  public readonly renderStateEvents: TngCodeBlockRenderStateChange[] = [];

  public onCopy(event: TngCopyEvent): void {
    this.copyEvents.push(event);
  }

  public onCopyError(event: TngCopyErrorEvent): void {
    this.copyErrorEvents.push(event);
  }

  public onCopySuccess(event: TngCopySuccessEvent): void {
    this.copySuccessEvents.push(event);
  }

  public onRenderStateChange(event: TngCodeBlockRenderStateChange): void {
    this.renderStateEvents.push(event);
  }
}

@Component({
  imports: [TngCodeBlockComponent],
  template: `
    <tng-code-block
      data-testid="code-block-a"
      [adapter]="adapterA"
      [code]="codeA"
      [language]="languageA"
      [theme]="themeA"
      [title]="titleA"
    ></tng-code-block>

    <tng-code-block
      data-testid="code-block-b"
      [adapter]="adapterB"
      [code]="codeB"
      [language]="languageB"
      [theme]="themeB"
      [title]="titleB"
    ></tng-code-block>
  `,
})
class DualCodeBlockHostComponent {
  public adapterA: string | null = null;
  public adapterB: string | null = null;
  public codeA = 'const left = 1;';
  public codeB = 'const right = 2;';
  public languageA: string | null = 'ts';
  public languageB: string | null = 'js';
  public themeA: string | null = 'light';
  public themeB: string | null = 'dark';
  public titleA = 'Left';
  public titleB = 'Right';
}

type SingleFixture = Readonly<{
  fixture: ComponentFixture<CodeBlockHostComponent>;
  host: CodeBlockHostComponent;
}>;

const originalNavigatorClipboardDescriptor = Object.getOwnPropertyDescriptor(
  globalThis.navigator,
  'clipboard',
);
const specDir = dirname(fileURLToPath(import.meta.url));
const codeBlockTemplate = readFileSync(resolve(specDir, './tng-code-block.component.html'), 'utf8');
const codeBlockStyles = readFileSync(resolve(specDir, './tng-code-block.component.css'), 'utf8');

afterEach(() => {
  vi.useRealTimers();
  vi.restoreAllMocks();
  if (originalNavigatorClipboardDescriptor === undefined) {
    Reflect.deleteProperty(globalThis.navigator, 'clipboard');
  } else {
    Object.defineProperty(globalThis.navigator, 'clipboard', originalNavigatorClipboardDescriptor);
  }
  TestBed.resetTestingModule();
});

function provideHighlighting(adapters: readonly ReturnType<typeof createTngCodeHighlighterAdapter>[] = [], defaultAdapter?: string) {
  return {
    provide: TNG_CODE_HIGHLIGHTING_CONFIG,
    useValue: resolveTngCodeHighlightingConfig({
      adapters,
      defaultAdapter,
    }),
  } as const;
}

async function createSingleFixture(
  options: Readonly<{
    adapters?: readonly ReturnType<typeof createTngCodeHighlighterAdapter>[];
    defaultAdapter?: string;
    init?: (host: CodeBlockHostComponent) => void;
  }> = {},
): Promise<SingleFixture> {
  const moduleRef = TestBed.configureTestingModule({
    imports: [CodeBlockHostComponent],
    providers: [provideHighlighting(options.adapters ?? [], options.defaultAdapter)],
  });
  moduleRef.overrideComponent(TngCodeBlockComponent, {
    set: {
      styles: [codeBlockStyles],
      template: codeBlockTemplate,
    },
  });
  await moduleRef.compileComponents();

  const fixture = moduleRef.createComponent(CodeBlockHostComponent);

  const host = fixture.componentInstance;
  options.init?.(host);
  fixture.changeDetectorRef.detectChanges();

  return { fixture, host };
}

async function createDualFixture(options: Readonly<{
  adapters?: readonly ReturnType<typeof createTngCodeHighlighterAdapter>[];
  defaultAdapter?: string;
  init?: (host: DualCodeBlockHostComponent) => void;
}> = {}) {
  const moduleRef = TestBed.configureTestingModule({
    imports: [DualCodeBlockHostComponent],
    providers: [provideHighlighting(options.adapters ?? [], options.defaultAdapter)],
  });
  moduleRef.overrideComponent(TngCodeBlockComponent, {
    set: {
      styles: [codeBlockStyles],
      template: codeBlockTemplate,
    },
  });
  await moduleRef.compileComponents();

  const fixture = moduleRef.createComponent(DualCodeBlockHostComponent);

  const host = fixture.componentInstance;
  options.init?.(host);
  fixture.changeDetectorRef.detectChanges();

  return { fixture, host };
}

async function flushRender(fixture: ComponentFixture<unknown>): Promise<void> {
  await Promise.resolve();
  fixture.changeDetectorRef.detectChanges();
  await Promise.resolve();
  fixture.changeDetectorRef.detectChanges();
}

function queryCodeBlockHost(fixture: ComponentFixture<unknown>, id = 'code-block'): HTMLElement {
  return (fixture.nativeElement as HTMLElement).querySelector<HTMLElement>(`[data-testid="${id}"]`)!;
}

function queryCodeBlock(fixture: ComponentFixture<unknown>, id = 'code-block'): HTMLElement {
  const host = queryCodeBlockHost(fixture, id);
  return host.querySelector<HTMLElement>('.tng-code-block')!;
}

function queryPre(fixture: ComponentFixture<unknown>, id = 'code-block'): HTMLElement {
  return queryCodeBlock(fixture, id).querySelector<HTMLElement>('pre')!;
}

function queryCode(fixture: ComponentFixture<unknown>, id = 'code-block'): HTMLElement {
  return queryCodeBlock(fixture, id).querySelector<HTMLElement>('code')!;
}

function queryRenderedLines(fixture: ComponentFixture<unknown>, id = 'code-block'): readonly HTMLElement[] {
  return Array.from(queryCodeBlock(fixture, id).querySelectorAll<HTMLElement>('.tng-code-block__line'));
}

function queryCopyButton(fixture: ComponentFixture<unknown>, id = 'code-block'): HTMLButtonElement | null {
  return queryCodeBlock(fixture, id).querySelector<HTMLButtonElement>('.tng-code-block__copy-button');
}

function normalizeRenderedText(value: string | null): string {
  return (value ?? '')
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line.length > 0)
    .join('\n');
}

function mockClipboardWriteText(impl: (text: string) => Promise<void>) {
  const writeText = vi.fn(impl);

  Object.defineProperty(globalThis.navigator, 'clipboard', {
    configurable: true,
    get: () => ({ writeText }),
  });

  return writeText;
}

describe('tng-code-block component', () => {
  describe('A) Exports & basic structure', () => {
    it('Exports the code-block component', () => {
      expect(typeof TngCodeBlockComponent).toBe('function');
    });

    it('Renders a <pre> and <code> structure with plain-text fallback by default', async () => {
      const { fixture, host } = await createSingleFixture({
        init: (state) => {
          state.code = 'const a = "<x>";';
          state.highlight = false;
        },
      });

      await flushRender(fixture);

      const pre = queryPre(fixture);
      const code = queryCode(fixture);
      expect(pre).toBeTruthy();
      expect(code).toBeTruthy();
      expect(code.textContent).toContain(host.code);
      expect(code.innerHTML).toContain('&lt;x&gt;');
    });

    it('Does not throw when rendered with empty code', async () => {
      const { fixture } = await createSingleFixture({
        init: (state) => {
          state.code = '';
        },
      });

      await flushRender(fixture);
      const lines = queryRenderedLines(fixture);
      expect(lines.length).toBe(1);
      expect(lines[0]?.textContent ?? '').toBe('');
    });

    it('Preserves consumer-provided host attributes and classes', async () => {
      const { fixture } = await createSingleFixture();
      const codeBlock = queryCodeBlockHost(fixture);
      expect(codeBlock.classList.contains('consumer-class')).toBe(true);
      expect(codeBlock.getAttribute('data-consumer-static')).toBe('yes');
      expect(codeBlock.getAttribute('data-consumer-dynamic')).toBe('dynamic');
    });

    it('Cleans up pending async highlight work on destroy', async () => {
      let resolveHighlight: ((value: TngCodeHighlightResult) => void) | null = null;
      const delayedAdapter = createTngCodeHighlighterAdapter('delayed', () =>
        new Promise<TngCodeHighlightResult>((resolve) => {
          resolveHighlight = resolve;
        }),
      );

      const { fixture } = await createSingleFixture({
        adapters: [delayedAdapter],
        defaultAdapter: 'delayed',
      });

      fixture.destroy();
      expect(() => {
        resolveHighlight?.({ kind: 'html', html: '<span>done</span>' });
      }).not.toThrow();

      await Promise.resolve();
      expect(true).toBe(true);
    });
  });

  describe('B) Inputs & defaults', () => {
    it('Renders the provided code string exactly in plain-text mode (escaped)', async () => {
      const { fixture, host } = await createSingleFixture({
        init: (state) => {
          state.highlight = false;
          state.code = '<div>alpha</div>\nconst b = 2;';
        },
      });

      await flushRender(fixture);

      const code = queryCode(fixture);
      expect(normalizeRenderedText(code.textContent)).toBe(host.code);
      expect(code.innerHTML).toContain('&lt;div&gt;alpha&lt;/div&gt;');
    });

    it('Uses language only for labeling/highlighting and does not change raw copied text', async () => {
      const writeText = mockClipboardWriteText(() => Promise.resolve());
      const { fixture, host } = await createSingleFixture({
        init: (state) => {
          state.code = 'const raw = "<unsafe>";';
          state.language = 'ts';
          state.copy = true;
        },
      });

      await flushRender(fixture);
      const button = queryCopyButton(fixture);
      expect(button).toBeTruthy();

      button?.click();
      await flushRender(fixture);

      expect(writeText).toHaveBeenCalledWith(host.code);
    });

    it('Defaults highlight=true when an adapter is available', async () => {
      const highlightSpy = vi.fn((input: TngCodeHighlightInput): TngCodeHighlightResult => ({
        kind: 'html',
        html: input.code,
      }));
      const adapter = createTngCodeHighlighterAdapter('spy', highlightSpy);

      const { fixture } = await createSingleFixture({
        adapters: [adapter],
        defaultAdapter: 'spy',
      });

      await flushRender(fixture);

      expect(highlightSpy).toHaveBeenCalled();
    });

    it('Renders plain text when highlight=false even if an adapter is available', async () => {
      const highlightSpy = vi.fn((input: TngCodeHighlightInput): TngCodeHighlightResult => ({
        kind: 'html',
        html: `<span class="kw">${input.code}</span>`,
      }));
      const adapter = createTngCodeHighlighterAdapter('spy', highlightSpy);

      const { fixture, host } = await createSingleFixture({
        adapters: [adapter],
        defaultAdapter: 'spy',
        init: (state) => {
          state.highlight = false;
          state.code = 'const plain = 1;';
        },
      });

      await flushRender(fixture);

      expect(highlightSpy).not.toHaveBeenCalled();
      expect(normalizeRenderedText(queryCode(fixture).textContent)).toBe(host.code);
    });

    it('Defaults wrap=false and does not apply wrapping styles unless enabled', async () => {
      const { fixture } = await createSingleFixture();
      const body = queryCodeBlock(fixture).querySelector<HTMLElement>('.tng-code-block__body')!;
      expect(body.classList.contains('tng-code-block__body--wrap')).toBe(false);
      expect(queryCodeBlock(fixture).getAttribute('data-wrap')).toBe('false');
    });

    it('Defaults lineNumbers=false and does not render line-number gutter unless enabled', async () => {
      const { fixture } = await createSingleFixture();
      const gutter = queryCodeBlock(fixture).querySelector('.tng-code-block__gutter');
      expect(gutter).toBeNull();
    });

    it('Defaults startingLineNumber=1 when line numbers are enabled', async () => {
      const { fixture } = await createSingleFixture({
        init: (state) => {
          state.lineNumbers = true;
          state.code = 'a\nb';
        },
      });

      await flushRender(fixture);

      const firstLineNumber = queryCodeBlock(fixture).querySelector('.tng-code-block__line-number');
      expect(firstLineNumber?.textContent?.trim()).toBe('1');
    });

    it('Defaults copy="auto" and shows copy only when code is non-empty', async () => {
      const { fixture, host } = await createSingleFixture({
        init: (state) => {
          state.copy = 'auto';
          state.code = 'const x = 1;';
        },
      });

      await flushRender(fixture);
      expect(queryCopyButton(fixture)).toBeTruthy();

      host.code = '';
      fixture.changeDetectorRef.detectChanges();
      await flushRender(fixture);
      expect(queryCopyButton(fixture)).toBeNull();
    });
  });

  describe('C) Header / title / caption features', () => {
    it('Renders header when title is provided', async () => {
      const { fixture } = await createSingleFixture({
        init: (state) => {
          state.title = 'app.config.ts';
        },
      });

      await flushRender(fixture);

      const header = queryCodeBlock(fixture).querySelector('.tng-code-block__header');
      const title = queryCodeBlock(fixture).querySelector('.tng-code-block__title');
      expect(header).toBeTruthy();
      expect(title?.textContent?.trim()).toBe('app.config.ts');
    });

    it('Does not render header when neither title nor actions are enabled', async () => {
      const { fixture } = await createSingleFixture({
        init: (state) => {
          state.title = null;
          state.copy = false;
          state.language = null;
          state.showLanguageBadge = false;
          state.showHeader = true;
        },
      });

      await flushRender(fixture);

      expect(queryCodeBlock(fixture).querySelector('.tng-code-block__header')).toBeNull();
    });

    it('Renders caption text when caption is provided', async () => {
      const { fixture } = await createSingleFixture({
        init: (state) => {
          state.caption = 'Install dependencies first.';
        },
      });

      await flushRender(fixture);

      const caption = queryCodeBlock(fixture).querySelector('.tng-code-block__caption');
      expect(caption?.textContent?.trim()).toBe('Install dependencies first.');
    });

    it('Renders a language badge when showLanguageBadge=true and language is set', async () => {
      const { fixture } = await createSingleFixture({
        init: (state) => {
          state.language = 'ts';
          state.showLanguageBadge = true;
        },
      });

      await flushRender(fixture);

      const badge = queryCodeBlock(fixture).querySelector('.tng-code-block__language');
      expect(badge?.textContent?.trim()).toBe('ts');
    });

    it('Does not render language badge when language is empty or badge is disabled', async () => {
      const { fixture, host } = await createSingleFixture({
        init: (state) => {
          state.language = 'ts';
          state.showLanguageBadge = false;
        },
      });

      await flushRender(fixture);
      expect(queryCodeBlock(fixture).querySelector('.tng-code-block__language')).toBeNull();

      host.language = '   ';
      host.showLanguageBadge = true;
      fixture.changeDetectorRef.detectChanges();
      await flushRender(fixture);
      expect(queryCodeBlock(fixture).querySelector('.tng-code-block__language')).toBeNull();
    });
  });

  describe('D) Highlighter adapter discovery & fallback', () => {
    it('Renders plain text when no highlighter adapter is provided', async () => {
      const { fixture, host } = await createSingleFixture({
        init: (state) => {
          state.code = 'const fallback = "<ok>";';
        },
      });

      await flushRender(fixture);

      expect(normalizeRenderedText(queryCode(fixture).textContent)).toBe(host.code);
      expect(queryCode(fixture).innerHTML).toContain('&lt;ok&gt;');
    });

    it('Renders plain text when adapter supports(language) returns false', async () => {
      const unsupportedAdapter = createTngCodeHighlighterAdapter(
        'unsupported',
        () => ({ kind: 'html', html: '<span>never</span>' }),
        () => false,
      );

      const { fixture, host } = await createSingleFixture({
        adapters: [unsupportedAdapter],
        defaultAdapter: 'unsupported',
      });

      await flushRender(fixture);

      expect(normalizeRenderedText(queryCode(fixture).textContent)).toBe(host.code);
    });

    it('Does not call adapter when highlight=false', async () => {
      const highlightSpy = vi.fn((): TngCodeHighlightResult => ({ kind: 'html', html: 'x' }));
      const adapter = createTngCodeHighlighterAdapter('spy', highlightSpy);

      const { fixture } = await createSingleFixture({
        adapters: [adapter],
        defaultAdapter: 'spy',
        init: (state) => {
          state.highlight = false;
        },
      });

      await flushRender(fixture);
      expect(highlightSpy).not.toHaveBeenCalled();
    });

    it('Calls adapter when highlight=true and adapter is provided', async () => {
      const highlightSpy = vi.fn((): TngCodeHighlightResult => ({ kind: 'html', html: 'ok' }));
      const adapter = createTngCodeHighlighterAdapter('spy', highlightSpy);

      const { fixture } = await createSingleFixture({
        adapters: [adapter],
        defaultAdapter: 'spy',
      });

      await flushRender(fixture);
      expect(highlightSpy).toHaveBeenCalled();
    });

    it('Passes code, language, and theme to the adapter on highlight', async () => {
      let captured: TngCodeHighlightInput | null = null;
      const adapter = createTngCodeHighlighterAdapter('capture', (input) => {
        captured = input;
        return { kind: 'html', html: input.code };
      });

      const { fixture, host } = await createSingleFixture({
        adapters: [adapter],
        defaultAdapter: 'capture',
        init: (state) => {
          state.code = 'const themed = 1;';
          state.language = 'ts';
          state.theme = 'night-owl';
        },
      });

      await flushRender(fixture);

      expect(captured).toEqual({
        code: host.code,
        includeLineWrappers: false,
        language: 'ts',
        theme: 'night-owl',
      });
    });

    it('Requests includeLineWrappers=true when line numbers or line highlighting are enabled', async () => {
      let captured: TngCodeHighlightInput | null = null;
      const adapter = createTngCodeHighlighterAdapter('capture', (input) => {
        captured = input;
        return { kind: 'html', html: input.code };
      });

      const { fixture } = await createSingleFixture({
        adapters: [adapter],
        defaultAdapter: 'capture',
        init: (state) => {
          state.lineNumbers = true;
          state.highlightLines = [2];
          state.code = 'a\nb';
        },
      });

      await flushRender(fixture);
      expect((captured as unknown as TngCodeHighlightInput)?.includeLineWrappers).toBe(true);
    });

    it('Requests includeLineWrappers=false when no per-line features are enabled', async () => {
      let captured: TngCodeHighlightInput | null = null;
      const adapter = createTngCodeHighlighterAdapter('capture', (input) => {
        captured = input;
        return { kind: 'html', html: input.code };
      });

      const { fixture } = await createSingleFixture({
        adapters: [adapter],
        defaultAdapter: 'capture',
        init: (state) => {
          state.lineNumbers = false;
          state.highlightLines = null;
          state.focusLines = false;
        },
      });

      await flushRender(fixture);
      expect((captured as unknown as TngCodeHighlightInput)?.includeLineWrappers).toBe(false);
    });

    it('Falls back to plain text when adapter throws and emits error render state', async () => {
      const adapter = createTngCodeHighlighterAdapter('throws', () =>
        Promise.reject(new Error('boom')),
      );

      const { fixture, host } = await createSingleFixture({
        adapters: [adapter],
        defaultAdapter: 'throws',
      });

      await flushRender(fixture);

      expect(normalizeRenderedText(queryCode(fixture).textContent)).toBe(host.code);
      expect(host.renderStateEvents.some((event) => event.state === 'error')).toBe(true);
    });
  });

  describe('E) Adapter result handling (html vs tokens)', () => {
    it('Renders adapter kind="html" output into the code region', async () => {
      const adapter = createTngCodeHighlighterAdapter('html', () => ({
        kind: 'html',
        html: '<span class="token">html-output</span>',
      }));

      const { fixture } = await createSingleFixture({
        adapters: [adapter],
        defaultAdapter: 'html',
      });

      await flushRender(fixture);

      expect(queryCode(fixture).innerHTML).toContain('token');
      expect(queryCode(fixture).textContent).toContain('html-output');
    });

    it('Renders adapter kind="tokens" output into the code region', async () => {
      const adapter = createTngCodeHighlighterAdapter('tokens', () => ({
        kind: 'tokens',
        tokens: [
          [{ className: 'kw', content: 'const' }, { content: ' value = 1;' }],
          [{ className: 'kw', content: 'return' }, { content: ' value;' }],
        ],
      }));

      const { fixture } = await createSingleFixture({
        adapters: [adapter],
        defaultAdapter: 'tokens',
      });

      await flushRender(fixture);

      expect(queryCode(fixture).innerHTML).toContain('class="kw"');
      expect(queryRenderedLines(fixture).length).toBe(2);
    });

    it('Preserves adapter-reported effective language in the rendered state', async () => {
      const adapter = createTngCodeHighlighterAdapter('lang', () => ({
        kind: 'html',
        html: '<span>ok</span>',
        language: 'tsx',
      }));

      const { fixture } = await createSingleFixture({
        adapters: [adapter],
        defaultAdapter: 'lang',
        init: (state) => {
          state.language = 'ts';
        },
      });

      await flushRender(fixture);

      const badge = queryCodeBlock(fixture).querySelector('.tng-code-block__language');
      expect(badge?.textContent?.trim()).toBe('tsx');
    });

    it('Ignores unknown adapter result kinds and falls back to plain text safely', async () => {
      const adapter = createTngCodeHighlighterAdapter('weird', () => ({
        kind: 'custom' as unknown as 'html',
        html: '<span>invalid</span>',
      }));

      const { fixture, host } = await createSingleFixture({
        adapters: [adapter],
        defaultAdapter: 'weird',
      });

      await flushRender(fixture);

      expect(normalizeRenderedText(queryCode(fixture).textContent)).toBe(host.code);
      expect(queryCode(fixture).innerHTML).not.toContain('invalid');
    });
  });

  describe('F) Sanitization & safety (html path)', () => {
    it('Sanitizes adapter HTML output by default when sanitizeHtml="auto"', async () => {
      const adapter = createTngCodeHighlighterAdapter('unsafe', () => ({
        kind: 'html',
        html: '<img src=x onerror="window.__tngCodeBlockHack=1"><span>safe</span>',
      }));

      const { fixture } = await createSingleFixture({
        adapters: [adapter],
        defaultAdapter: 'unsafe',
        init: (state) => {
          state.sanitizeHtml = 'auto';
        },
      });

      await flushRender(fixture);

      const img = queryCode(fixture).querySelector('img');
      expect(img?.getAttribute('onerror')).toBeNull();
      expect(queryCode(fixture).textContent).toContain('safe');
    });

    it('Does not sanitize HTML when sanitizeHtml=false and adapter output is trusted', async () => {
      const adapter = createTngCodeHighlighterAdapter('trusted', () => ({
        kind: 'html',
        html: '<span data-trusted="yes" onclick="window.__tngCodeBlockHack=1">trusted</span>',
        trustedHtml: true,
      }));

      const { fixture } = await createSingleFixture({
        adapters: [adapter],
        defaultAdapter: 'trusted',
        init: (state) => {
          state.sanitizeHtml = false;
        },
      });

      await flushRender(fixture);

      const trusted = queryCode(fixture).querySelector('[data-trusted="yes"]');
      expect(trusted).toBeTruthy();
      expect(trusted?.getAttribute('onclick')).toBe('window.__tngCodeBlockHack=1');
    });

    it('Never executes scripts or event handlers from adapter HTML output', async () => {
      Reflect.set(globalThis, '__tngCodeBlockHack', 0);

      const adapter = createTngCodeHighlighterAdapter('script', () => ({
        kind: 'html',
        html: '<script>window.__tngCodeBlockHack=99</script><img src=x onerror="window.__tngCodeBlockHack=42">safe',
      }));

      const { fixture } = await createSingleFixture({
        adapters: [adapter],
        defaultAdapter: 'script',
      });

      await flushRender(fixture);

      expect(Reflect.get(globalThis, '__tngCodeBlockHack')).toBe(0);
    });

    it('Does not break code rendering when HTML sanitizer strips unsupported nodes', async () => {
      const adapter = createTngCodeHighlighterAdapter('strip', () => ({
        kind: 'html',
        html: '<script>alert(1)</script><span>kept</span>',
      }));

      const { fixture } = await createSingleFixture({
        adapters: [adapter],
        defaultAdapter: 'strip',
      });

      await flushRender(fixture);

      expect(queryCode(fixture).textContent).toContain('kept');
    });
  });

  describe('G) Render lifecycle state machine', () => {
    it('Initial render state is idle before highlighting begins', async () => {
      const { fixture } = await createSingleFixture({
        init: (state) => {
          state.highlight = false;
        },
      });
      const codeBlockComponent = fixture.debugElement.query(By.directive(TngCodeBlockComponent))
        .componentInstance as TngCodeBlockComponent;
      expect((codeBlockComponent as unknown as { renderState: () => string }).renderState()).toBe(
        'idle',
      );
    });

    it('Emits render state highlighting before awaiting async adapter highlight', async () => {
      const adapter = createTngCodeHighlighterAdapter('async', () =>
        new Promise<TngCodeHighlightResult>(() => {
          // intentionally unresolved
        }),
      );

      const { host } = await createSingleFixture({
        adapters: [adapter],
        defaultAdapter: 'async',
      });

      expect(host.renderStateEvents[0]?.state).toBe('highlighting');
    });

    it('Emits render state highlighted after successful highlight render', async () => {
      const adapter = createTngCodeHighlighterAdapter('ok', () => ({ kind: 'html', html: '<span>ok</span>' }));

      const { fixture, host } = await createSingleFixture({
        adapters: [adapter],
        defaultAdapter: 'ok',
      });

      await flushRender(fixture);

      expect(host.renderStateEvents.some((event) => event.state === 'highlighted')).toBe(true);
      expect(queryCodeBlock(fixture).getAttribute('data-state')).toBe('highlighted');
    });

    it('Emits render state error after adapter failure and renders plain text fallback', async () => {
      const adapter = createTngCodeHighlighterAdapter('fail', () =>
        Promise.reject(new Error('failed highlight')),
      );

      const { fixture, host } = await createSingleFixture({
        adapters: [adapter],
        defaultAdapter: 'fail',
      });

      await flushRender(fixture);

      const last = host.renderStateEvents[host.renderStateEvents.length - 1];
      expect(last?.state).toBe('error');
      expect(queryCode(fixture).textContent).toContain('const answer = 42;');
    });

    it('Does not emit duplicate render states when inputs do not change', async () => {
      const adapter = createTngCodeHighlighterAdapter('ok', () => ({ kind: 'html', html: '<span>ok</span>' }));

      const { fixture, host } = await createSingleFixture({
        adapters: [adapter],
        defaultAdapter: 'ok',
      });

      await flushRender(fixture);
      const countBefore = host.renderStateEvents.length;

      fixture.changeDetectorRef.detectChanges();
      await flushRender(fixture);

      expect(host.renderStateEvents.length).toBe(countBefore);
    });

    it('Cancels stale async highlight results when a newer highlight request starts', async () => {
      const resolves: ((result: TngCodeHighlightResult) => void)[] = [];
      const adapter = createTngCodeHighlighterAdapter('async', (input) =>
        new Promise<TngCodeHighlightResult>((resolve) => {
          resolves.push((result) => {
            resolve(result);
          });
          expect(input.code.length).toBeGreaterThan(0);
        }),
      );

      const { fixture, host } = await createSingleFixture({
        adapters: [adapter],
        defaultAdapter: 'async',
        init: (state) => {
          state.code = 'first';
        },
      });

      host.code = 'second';
      fixture.changeDetectorRef.detectChanges();

      resolves[0]?.({ kind: 'html', html: '<span>FIRST</span>' });
      await flushRender(fixture);

      resolves[1]?.({ kind: 'html', html: '<span>SECOND</span>' });
      await flushRender(fixture);

      expect(queryCode(fixture).textContent).toContain('SECOND');
      expect(queryCode(fixture).textContent).not.toContain('FIRST');
    });
  });

  describe('H) Re-rendering & performance contracts', () => {
    it('Re-highlights when code changes and highlight=true', async () => {
      const highlightSpy = vi.fn((input: TngCodeHighlightInput): TngCodeHighlightResult => ({
        kind: 'html',
        html: `<span>${input.code}</span>`,
      }));
      const adapter = createTngCodeHighlighterAdapter('spy', highlightSpy);

      const { fixture, host } = await createSingleFixture({
        adapters: [adapter],
        defaultAdapter: 'spy',
      });

      await flushRender(fixture);
      const callsAfterFirstRender = highlightSpy.mock.calls.length;

      host.code = 'const changed = true;';
      fixture.changeDetectorRef.detectChanges();
      await flushRender(fixture);

      expect(highlightSpy.mock.calls.length).toBeGreaterThan(callsAfterFirstRender);
    });

    it('Re-highlights when language changes and highlight=true', async () => {
      const highlightSpy = vi.fn((): TngCodeHighlightResult => ({ kind: 'html', html: '<span>ok</span>' }));
      const adapter = createTngCodeHighlighterAdapter('spy', highlightSpy);

      const { fixture, host } = await createSingleFixture({
        adapters: [adapter],
        defaultAdapter: 'spy',
        init: (state) => {
          state.language = 'ts';
        },
      });

      await flushRender(fixture);
      const callsAfterFirstRender = highlightSpy.mock.calls.length;

      host.language = 'js';
      fixture.changeDetectorRef.detectChanges();
      await flushRender(fixture);

      expect(highlightSpy.mock.calls.length).toBeGreaterThan(callsAfterFirstRender);
    });

    it('Re-highlights when theme changes and highlight=true', async () => {
      const highlightSpy = vi.fn((): TngCodeHighlightResult => ({ kind: 'html', html: '<span>ok</span>' }));
      const adapter = createTngCodeHighlighterAdapter('spy', highlightSpy);

      const { fixture, host } = await createSingleFixture({
        adapters: [adapter],
        defaultAdapter: 'spy',
        init: (state) => {
          state.theme = 'light';
        },
      });

      await flushRender(fixture);
      const callsAfterFirstRender = highlightSpy.mock.calls.length;

      host.theme = 'dark';
      fixture.changeDetectorRef.detectChanges();
      await flushRender(fixture);

      expect(highlightSpy.mock.calls.length).toBeGreaterThan(callsAfterFirstRender);
    });

    it('Does not re-highlight when unrelated inputs (wrap) change', async () => {
      const highlightSpy = vi.fn((): TngCodeHighlightResult => ({ kind: 'html', html: '<span>ok</span>' }));
      const adapter = createTngCodeHighlighterAdapter('spy', highlightSpy);

      const { fixture, host } = await createSingleFixture({
        adapters: [adapter],
        defaultAdapter: 'spy',
      });

      await flushRender(fixture);
      const callsAfterFirstRender = highlightSpy.mock.calls.length;

      host.wrap = !host.wrap;
      fixture.changeDetectorRef.detectChanges();
      await flushRender(fixture);

      expect(highlightSpy.mock.calls.length).toBe(callsAfterFirstRender);
    });

    it('Debounces highlight calls when highlightDebounceMs is configured', async () => {
      vi.useFakeTimers();
      const highlightSpy = vi.fn((_input: TngCodeHighlightInput): TngCodeHighlightResult => ({ kind: 'html', html: '<span>ok</span>' }));
      const adapter = createTngCodeHighlighterAdapter('debounced', highlightSpy);

      const { fixture, host } = await createSingleFixture({
        adapters: [adapter],
        defaultAdapter: 'debounced',
        init: (state) => {
          state.highlightDebounceMs = 50;
        },
      });

      host.code = 'first';
      fixture.changeDetectorRef.detectChanges();
      host.code = 'second';
      fixture.changeDetectorRef.detectChanges();
      host.code = 'third';
      fixture.changeDetectorRef.detectChanges();

      expect(highlightSpy).not.toHaveBeenCalled();

      vi.advanceTimersByTime(50);
      await flushRender(fixture);

      expect(highlightSpy).toHaveBeenCalledTimes(1);
      const lastCallInput = highlightSpy.mock.calls[0]?.[0];
      expect(lastCallInput?.code).toBe('third');
    });

    it('Uses cached highlight result for repeated identical requests', async () => {
      const highlightSpy = vi.fn((input: TngCodeHighlightInput): TngCodeHighlightResult => ({
        kind: 'html',
        html: `<span>${input.code}</span>`,
      }));
      const adapter = createTngCodeHighlighterAdapter('cached', highlightSpy);

      const { fixture, host } = await createSingleFixture({
        adapters: [adapter],
        defaultAdapter: 'cached',
        init: (state) => {
          state.code = 'alpha';
        },
      });

      await flushRender(fixture);
      expect(highlightSpy).toHaveBeenCalledTimes(1);

      host.code = 'beta';
      fixture.changeDetectorRef.detectChanges();
      await flushRender(fixture);
      expect(highlightSpy).toHaveBeenCalledTimes(2);

      host.code = 'alpha';
      fixture.changeDetectorRef.detectChanges();
      await flushRender(fixture);

      expect(highlightSpy).toHaveBeenCalledTimes(2);
    });
  });

  describe('I) Wrapping & scrolling', () => {
    it('Enables wrapping when wrap=true and preserves whitespace semantics', async () => {
      const { fixture } = await createSingleFixture({
        init: (state) => {
          state.wrap = true;
          state.code = 'const veryLongLine = "aaaaaaaaaaaaaaaaaaaaaaaa";';
        },
      });

      await flushRender(fixture);

      const body = queryCodeBlock(fixture).querySelector<HTMLElement>('.tng-code-block__body')!;
      expect(body.classList.contains('tng-code-block__body--wrap')).toBe(true);
      expect(queryCodeBlock(fixture).getAttribute('data-wrap')).toBe('true');
    });

    it('Disables wrapping when wrap=false', async () => {
      const { fixture } = await createSingleFixture({
        init: (state) => {
          state.wrap = false;
        },
      });

      await flushRender(fixture);

      const body = queryCodeBlock(fixture).querySelector<HTMLElement>('.tng-code-block__body')!;
      expect(body.classList.contains('tng-code-block__body--wrap')).toBe(false);
    });

    it('Applies maxHeight and enables scrolling when max height is set', async () => {
      const { fixture } = await createSingleFixture({
        init: (state) => {
          state.maxHeight = 120;
        },
      });

      await flushRender(fixture);

      const pre = queryPre(fixture);
      expect(pre.style.maxHeight).toBe('120px');
      expect(pre.style.overflowY).toBe('auto');
    });

    it('Does not apply scrolling styles when maxHeight is not set', async () => {
      const { fixture } = await createSingleFixture({
        init: (state) => {
          state.maxHeight = null;
        },
      });

      await flushRender(fixture);

      const pre = queryPre(fixture);
      expect(pre.style.maxHeight).toBe('');
      expect(pre.style.overflowY).toBe('');
    });
  });

  describe('J) Line numbers', () => {
    it('Does not render a line-number gutter when lineNumbers=false', async () => {
      const { fixture } = await createSingleFixture({
        init: (state) => {
          state.lineNumbers = false;
          state.code = 'a\nb';
        },
      });

      await flushRender(fixture);

      expect(queryCodeBlock(fixture).querySelector('.tng-code-block__gutter')).toBeNull();
    });

    it('Renders a line-number gutter when lineNumbers=true', async () => {
      const { fixture } = await createSingleFixture({
        init: (state) => {
          state.lineNumbers = true;
          state.code = 'a\nb';
        },
      });

      await flushRender(fixture);

      expect(queryCodeBlock(fixture).querySelector('.tng-code-block__gutter')).toBeTruthy();
    });

    it('Uses startingLineNumber as the first displayed line number', async () => {
      const { fixture } = await createSingleFixture({
        init: (state) => {
          state.lineNumbers = true;
          state.startingLineNumber = 10;
          state.code = 'a\nb';
        },
      });

      await flushRender(fixture);

      const lineNumbers = Array.from(
        queryCodeBlock(fixture).querySelectorAll<HTMLElement>('.tng-code-block__line-number'),
      ).map((item) => item.textContent?.trim());

      expect(lineNumbers[0]).toBe('10');
    });

    it('Line numbers count matches the number of rendered lines', async () => {
      const { fixture } = await createSingleFixture({
        init: (state) => {
          state.lineNumbers = true;
          state.code = 'a\nb\nc';
        },
      });

      await flushRender(fixture);

      const lineNumbers = queryCodeBlock(fixture).querySelectorAll('.tng-code-block__line-number');
      const lines = queryRenderedLines(fixture);
      expect(lineNumbers.length).toBe(lines.length);
    });

    it('Keeps the first rendered line aligned with the first line number (no leading whitespace row)', async () => {
      const { fixture } = await createSingleFixture({
        init: (state) => {
          state.lineNumbers = true;
          state.startingLineNumber = 4;
          state.code = 'import x from "x";\n\nconst y = 1;';
        },
      });

      await flushRender(fixture);

      const lineNumbers = Array.from(
        queryCodeBlock(fixture).querySelectorAll<HTMLElement>('.tng-code-block__line-number'),
      ).map((item) => item.textContent?.trim());
      const lines = queryRenderedLines(fixture).map((line) => line.textContent ?? '');

      expect(lineNumbers[0]).toBe('4');
      expect(lines[0]).toBe('import x from "x";');
      expect(lines[1]).toBe('');
      expect(lines[2]).toBe('const y = 1;');
    });

    it('Line numbers remain aligned when wrapping is enabled', async () => {
      const { fixture } = await createSingleFixture({
        init: (state) => {
          state.wrap = true;
          state.lineNumbers = true;
          state.code = 'first\nsecond\nthird';
        },
      });

      await flushRender(fixture);

      const body = queryCodeBlock(fixture).querySelector<HTMLElement>('.tng-code-block__body')!;
      const lineNumbers = queryCodeBlock(fixture).querySelectorAll('.tng-code-block__line-number');
      const lines = queryRenderedLines(fixture);

      expect(body.classList.contains('tng-code-block__body--line-numbers')).toBe(true);
      expect(body.classList.contains('tng-code-block__body--wrap')).toBe(true);
      expect(lineNumbers.length).toBe(lines.length);
    });

    it('Does not request line wrappers from adapter when line numbers are off', async () => {
      let captured: TngCodeHighlightInput | null = null;
      const adapter = createTngCodeHighlighterAdapter('capture', (input) => {
        captured = input;
        return { kind: 'html', html: input.code };
      });

      const { fixture } = await createSingleFixture({
        adapters: [adapter],
        defaultAdapter: 'capture',
        init: (state) => {
          state.lineNumbers = false;
          state.code = 'a\nb';
        },
      });

      await flushRender(fixture);
      expect((captured as unknown as TngCodeHighlightInput)?.includeLineWrappers).toBe(false);
    });
  });

  describe('K) Highlighted lines & focus lines', () => {
    it('Does not highlight any lines when highlightLines is empty or undefined', async () => {
      const { fixture } = await createSingleFixture({
        init: (state) => {
          state.code = 'a\nb\nc';
          state.highlightLines = [];
        },
      });

      await flushRender(fixture);
      expect(queryCodeBlock(fixture).querySelector('.tng-code-block__line--highlight')).toBeNull();
    });

    it('Highlights a single specified line number when highlightLines includes a number', async () => {
      const { fixture } = await createSingleFixture({
        init: (state) => {
          state.code = 'a\nb\nc';
          state.highlightLines = [2];
        },
      });

      await flushRender(fixture);

      const highlighted = queryCodeBlock(fixture).querySelectorAll('.tng-code-block__line--highlight');
      expect(highlighted.length).toBe(1);
      expect((highlighted[0] as HTMLElement).getAttribute('data-line-number')).toBe('2');
    });

    it('Highlights a specified range when highlightLines includes a tuple range', async () => {
      const { fixture } = await createSingleFixture({
        init: (state) => {
          state.code = 'a\nb\nc\nd';
          state.highlightLines = [[2, 3]];
        },
      });

      await flushRender(fixture);

      const highlighted = Array.from(
        queryCodeBlock(fixture).querySelectorAll<HTMLElement>('.tng-code-block__line--highlight'),
      ).map((line) => line.getAttribute('data-line-number'));
      expect(highlighted).toEqual(['2', '3']);
    });

    it('Merges overlapping ranges in highlightLines deterministically', async () => {
      const { fixture } = await createSingleFixture({
        init: (state) => {
          state.code = 'a\nb\nc\nd\ne';
          state.highlightLines = [[2, 4], [3, 5], 2];
        },
      });

      await flushRender(fixture);

      const highlighted = Array.from(
        queryCodeBlock(fixture).querySelectorAll<HTMLElement>('.tng-code-block__line--highlight'),
      ).map((line) => line.getAttribute('data-line-number'));

      expect(highlighted).toEqual(['2', '3', '4', '5']);
    });

    it('Applies focus/dim effect when focusLines=true and highlightLines is provided', async () => {
      const { fixture } = await createSingleFixture({
        init: (state) => {
          state.code = 'a\nb\nc';
          state.highlightLines = [2];
          state.focusLines = true;
        },
      });

      await flushRender(fixture);

      const dimmed = queryCodeBlock(fixture).querySelectorAll('.tng-code-block__line--dim');
      expect(dimmed.length).toBe(2);
    });

    it('Does not dim lines when focusLines=false', async () => {
      const { fixture } = await createSingleFixture({
        init: (state) => {
          state.code = 'a\nb\nc';
          state.highlightLines = [2];
          state.focusLines = false;
        },
      });

      await flushRender(fixture);

      expect(queryCodeBlock(fixture).querySelector('.tng-code-block__line--dim')).toBeNull();
    });

    it('Ignores out-of-range highlight line indices safely', async () => {
      const { fixture } = await createSingleFixture({
        init: (state) => {
          state.code = 'a\nb\nc';
          state.highlightLines = [999, [1000, 1002]];
        },
      });

      await flushRender(fixture);

      expect(queryCodeBlock(fixture).querySelector('.tng-code-block__line--highlight')).toBeNull();
    });
  });

  describe('L) Copy integration (with tngCopyButton)', () => {
    it('Shows copy action when copy=true', async () => {
      const { fixture } = await createSingleFixture({
        init: (state) => {
          state.copy = true;
        },
      });

      await flushRender(fixture);
      expect(queryCopyButton(fixture)).toBeTruthy();
    });

    it('Hides copy action when copy=false', async () => {
      const { fixture } = await createSingleFixture({
        init: (state) => {
          state.copy = false;
        },
      });

      await flushRender(fixture);
      expect(queryCopyButton(fixture)).toBeNull();
    });

    it('Auto-shows copy action when copy="auto" and code is non-empty', async () => {
      const { fixture } = await createSingleFixture({
        init: (state) => {
          state.copy = 'auto';
          state.code = 'const x = 1;';
        },
      });

      await flushRender(fixture);
      expect(queryCopyButton(fixture)).toBeTruthy();
    });

    it('Copy action copies raw code by default (not highlighted HTML)', async () => {
      const writeText = mockClipboardWriteText(() => Promise.resolve());
      const adapter = createTngCodeHighlighterAdapter('html', () => ({
        kind: 'html',
        html: '<span class="token">highlighted</span>',
      }));

      const { fixture, host } = await createSingleFixture({
        adapters: [adapter],
        defaultAdapter: 'html',
        init: (state) => {
          state.copy = true;
          state.code = 'const rawText = true;';
        },
      });

      await flushRender(fixture);
      queryCopyButton(fixture)?.click();
      await flushRender(fixture);

      expect(writeText).toHaveBeenCalledWith(host.code);
    });

    it('Copy action uses copyText override when provided', async () => {
      const writeText = mockClipboardWriteText(() => Promise.resolve());

      const { fixture } = await createSingleFixture({
        init: (state) => {
          state.copy = true;
          state.code = 'const ignored = true;';
          state.copyText = () => 'explicit-copy-payload';
        },
      });

      await flushRender(fixture);
      queryCopyButton(fixture)?.click();
      await flushRender(fixture);

      expect(writeText).toHaveBeenCalledWith('explicit-copy-payload');
    });

    it('Copy success sets copied UI state for the configured duration', async () => {
      vi.useFakeTimers();
      mockClipboardWriteText(() => Promise.resolve());

      const { fixture } = await createSingleFixture({
        init: (state) => {
          state.copy = true;
          state.copySuccessDurationMs = 25;
        },
      });

      await flushRender(fixture);

      const button = queryCopyButton(fixture);
      button?.click();
      await flushRender(fixture);
      await Promise.resolve(); // allow awaited clipboard promise to resolve
      await flushRender(fixture);

      expect(button?.textContent?.trim()).toBe('Copied');

      vi.advanceTimersByTime(30);
      await flushRender(fixture);

      expect(button?.textContent?.trim()).toBe('Copy code');
    });

    it('Emits copy events (copy, copySuccess, copyError) from the code-block when integrated', async () => {
      const writeText = mockClipboardWriteText(() => {
        throw new Error('clipboard denied');
      });

      const execCommand = vi.fn(() => false);
      Object.defineProperty(document, 'execCommand', {
        configurable: true,
        value: execCommand,
      });

      const { fixture, host } = await createSingleFixture({
        init: (state) => {
          state.copy = true;
        },
      });

      await flushRender(fixture);
      queryCopyButton(fixture)?.click();
      await flushRender(fixture);

      expect(writeText).toHaveBeenCalled();
      expect(execCommand).toHaveBeenCalled();
      expect(host.copyEvents.length).toBe(1);
      expect(host.copyErrorEvents.length).toBe(1);

      writeText.mockResolvedValueOnce(undefined);
      queryCopyButton(fixture)?.click();
      await flushRender(fixture);

      expect(host.copyEvents.length).toBe(2);
      expect(host.copySuccessEvents.length).toBe(1);
    });

    it('Copy action remains accessible via keyboard activation', async () => {
      const { fixture } = await createSingleFixture({
        init: (state) => {
          state.copy = true;
        },
      });

      await flushRender(fixture);
      const button = queryCopyButton(fixture);
      expect(button?.tagName).toBe('BUTTON');

      const event = new KeyboardEvent('keydown', {
        key: 'Enter',
        bubbles: true,
        cancelable: true,
      });

      button?.dispatchEvent(event);
      expect(event.defaultPrevented).toBe(false);
    });
  });

  describe('M) Accessibility & semantics', () => {
    it('Code region is not focus-trapped and allows normal Tab navigation', async () => {
      const { fixture } = await createSingleFixture();
      await flushRender(fixture);

      const code = queryCode(fixture);
      expect(code.getAttribute('tabindex')).toBeNull();

      const event = new KeyboardEvent('keydown', {
        key: 'Tab',
        bubbles: true,
        cancelable: true,
      });

      code.dispatchEvent(event);
      expect(event.defaultPrevented).toBe(false);
    });

    it('Copy button has an accessible label when rendered', async () => {
      const { fixture } = await createSingleFixture({
        init: (state) => {
          state.copy = true;
          state.copyLabel = 'Copy code sample';
        },
      });

      await flushRender(fixture);

      expect(queryCopyButton(fixture)?.getAttribute('aria-label')).toBe('Copy code sample');
    });

    it('Title text is exposed semantically in the header (no role misuse)', async () => {
      const { fixture } = await createSingleFixture({
        init: (state) => {
          state.title = 'main.ts';
        },
      });

      await flushRender(fixture);

      const title = queryCodeBlock(fixture).querySelector('h3.tng-code-block__title');
      expect(title?.textContent?.trim()).toBe('main.ts');
      expect(title?.getAttribute('role')).toBeNull();
    });

    it('Language badge does not steal focus and is not tabbable', async () => {
      const { fixture } = await createSingleFixture({
        init: (state) => {
          state.language = 'ts';
          state.showLanguageBadge = true;
        },
      });

      await flushRender(fixture);

      const badge = queryCodeBlock(fixture).querySelector<HTMLElement>('.tng-code-block__language')!;
      expect(badge).toBeTruthy();
      expect(badge.getAttribute('tabindex')).toBeNull();
    });

    it('Component does not introduce duplicate IDs when multiple instances exist on the page', async () => {
      const { fixture } = await createDualFixture();
      await flushRender(fixture);

      const allIds = Array.from((fixture.nativeElement as HTMLElement).querySelectorAll<HTMLElement>('[id]'))
        .map((node) => node.id)
        .filter((id) => id.length > 0);

      expect(new Set(allIds).size).toBe(allIds.length);
    });
  });

  describe('N) Robustness & edge cases', () => {
    it('Handles Windows line endings (CRLF) without miscounting lines', async () => {
      const { fixture } = await createSingleFixture({
        init: (state) => {
          state.lineNumbers = true;
          state.code = 'a\r\nb\r\nc';
          state.highlight = false;
        },
      });

      await flushRender(fixture);

      const lineNumbers = queryCodeBlock(fixture).querySelectorAll('.tng-code-block__line-number');
      expect(lineNumbers.length).toBe(3);
    });

    it('Handles trailing newline without rendering an extra empty numbered line', async () => {
      const { fixture } = await createSingleFixture({
        init: (state) => {
          state.lineNumbers = true;
          state.code = 'a\nb\n';
          state.highlight = false;
        },
      });

      await flushRender(fixture);

      const lineNumbers = queryCodeBlock(fixture).querySelectorAll('.tng-code-block__line-number');
      expect(lineNumbers.length).toBe(2);
    });

    it('Handles extremely large code blocks without synchronous blocking when adapter is async', async () => {
      const adapter = createTngCodeHighlighterAdapter('async', (input) =>
        new Promise<TngCodeHighlightResult>((resolve) => {
          setTimeout(() => {
            resolve({ kind: 'html', html: input.code });
          }, 0);
        }),
      );

      const largeCode = new Array(300).fill('const row = 1;').join('\n');
      const { fixture } = await createSingleFixture({
        adapters: [adapter],
        defaultAdapter: 'async',
        init: (state) => {
          state.code = largeCode;
        },
      });

      const codeBlock = queryCodeBlock(fixture);
      expect(codeBlock.getAttribute('data-state')).toBe('highlighting');

      await flushRender(fixture);
      await new Promise<void>((resolve) => {
        setTimeout(() => resolve(), 0);
      });
      fixture.changeDetectorRef.detectChanges();
      expect(queryCode(fixture).textContent?.includes('const row = 1;')).toBe(true);
    });

    it('Works when adapter returns empty HTML/tokens by rendering safe fallback', async () => {
      const adapter = createTngCodeHighlighterAdapter('empty-mixed', (input) => {
        if (input.code.includes('token-mode')) {
          return {
            kind: 'tokens',
            tokens: [],
          };
        }

        return {
          kind: 'html',
          html: '',
        };
      });

      const { fixture, host } = await createSingleFixture({
        adapters: [adapter],
        defaultAdapter: 'empty-mixed',
      });
      await flushRender(fixture);
      expect(queryCode(fixture).textContent).toContain('const answer = 42;');

      host.code = 'token-mode';
      fixture.changeDetectorRef.detectChanges();
      await flushRender(fixture);
      expect(normalizeRenderedText(queryCode(fixture).textContent)).toBe('token-mode');
    });

    it('Works when code contains HTML-like characters without injection in plain-text mode', async () => {
      const { fixture } = await createSingleFixture({
        init: (state) => {
          state.highlight = false;
          state.code = '<section data-x="1">hello</section>';
        },
      });

      await flushRender(fixture);

      expect(normalizeRenderedText(queryCode(fixture).textContent)).toBe(
        '<section data-x="1">hello</section>',
      );
      expect(queryCode(fixture).querySelector('section')).toBeNull();
    });

    it('Multiple CodeBlocks with different adapters/themes remain isolated', async () => {
      const leftAdapter = createTngCodeHighlighterAdapter('left', (input) => ({
        kind: 'html',
        html: `<span class="left">${input.theme}:${input.code}</span>`,
      }));
      const rightAdapter = createTngCodeHighlighterAdapter('right', (input) => ({
        kind: 'html',
        html: `<span class="right">${input.theme}:${input.code}</span>`,
      }));

      const { fixture, host } = await createDualFixture({
        adapters: [leftAdapter, rightAdapter],
        defaultAdapter: 'left',
        init: (state) => {
          state.adapterA = 'left';
          state.adapterB = 'right';
          state.themeA = 'aurora';
          state.themeB = 'ocean';
          state.codeA = 'LEFT';
          state.codeB = 'RIGHT';
        },
      });

      await flushRender(fixture);

      expect(queryCode(fixture, 'code-block-a').textContent).toContain(`${host.themeA}:${host.codeA}`);
      expect(queryCode(fixture, 'code-block-b').textContent).toContain(`${host.themeB}:${host.codeB}`);
      expect(queryCode(fixture, 'code-block-a').textContent).not.toContain(`${host.themeB}:${host.codeB}`);
    });

    it('Destroying a CodeBlock during an in-flight highlight does not log errors or update DOM after destroy', async () => {
      const resolves: ((result: TngCodeHighlightResult) => void)[] = [];
      const adapter = createTngCodeHighlighterAdapter('deferred', () =>
        new Promise<TngCodeHighlightResult>((resolve) => {
          resolves.push(resolve);
        }),
      );

      const consoleError = vi.spyOn(console, 'error').mockImplementation(() => undefined);

      const { fixture } = await createSingleFixture({
        adapters: [adapter],
        defaultAdapter: 'deferred',
      });

      fixture.destroy();

      expect(() => {
        resolves[0]?.({ kind: 'html', html: '<span>late</span>' });
      }).not.toThrow();

      await Promise.resolve();
      expect(consoleError).not.toHaveBeenCalled();
    });
  });

  describe('utility coercion and normalization helpers', () => {
    it('normalizes code and line numbers', () => {
      expect(normalizeTngCodeBlockCode('line1\r\nline2\rline3')).toBe('line1\nline2\nline3');
      expect(normalizeTngCodeBlockCode(null)).toBe('');

      expect(toTngCodeBlockLineNumbers('')).toEqual([1]);
      expect(toTngCodeBlockLineNumbers('a\nb\n')).toEqual([1, 2]);
      expect(toTngCodeBlockLineNumbers('a\nb\n', 4)).toEqual([4, 5]);
    });

    it('coerces highlight mode and copy reset duration', () => {
      expect(coerceTngCodeBlockHighlightMode('auto')).toBe('auto');
      expect(coerceTngCodeBlockHighlightMode('on')).toBe('on');
      expect(coerceTngCodeBlockHighlightMode('unknown')).toBe('auto');

      expect(coerceTngCodeBlockCopyResetDuration(Number.NaN)).toBe(1500);
      expect(coerceTngCodeBlockCopyResetDuration(-10)).toBe(0);
      expect(coerceTngCodeBlockCopyResetDuration('900')).toBe(900);
    });
  });
});
