import type { RegistryItem } from '../registry.types';

const highlightingTemplate = `import { InjectionToken, makeEnvironmentProviders, type EnvironmentProviders } from '@angular/core';

export type TngCodeHighlightInput = Readonly<{
  code: string;
  language: string | null;
  theme?: string | null;
}>;

export type TngCodeHighlighterAdapter = Readonly<{
  id: string;
  highlight: (input: TngCodeHighlightInput) => Promise<{ html: string }> | { html: string };
  supports?: (language: string | null) => boolean;
}>;

export type TngCodeHighlightingConfig = Readonly<{
  adapters: Readonly<Record<string, TngCodeHighlighterAdapter>>;
  defaultAdapter: string;
}>;

export function escapeTngCodeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export function createTngCodeHighlighterAdapter(
  id: string,
  highlight: TngCodeHighlighterAdapter['highlight'],
  supports?: TngCodeHighlighterAdapter['supports'],
): TngCodeHighlighterAdapter {
  return Object.freeze({ id: id.trim().toLowerCase(), highlight, supports });
}

const plainAdapter = createTngCodeHighlighterAdapter('plain', (input) => ({
  html: escapeTngCodeHtml(input.code),
}));

export const TNG_CODE_HIGHLIGHTING_CONFIG = new InjectionToken<TngCodeHighlightingConfig>(
  'TNG_CODE_HIGHLIGHTING_CONFIG',
  { providedIn: 'root', factory: () => ({ adapters: { plain: plainAdapter }, defaultAdapter: 'plain' }) },
);

export function provideTngCodeHighlighting(options: Readonly<{
  adapters?: readonly TngCodeHighlighterAdapter[];
  defaultAdapter?: string;
}> = {}): EnvironmentProviders {
  const adapters = Object.fromEntries([
    ['plain', plainAdapter],
    ...(options.adapters ?? []).map((adapter) => [adapter.id, adapter] as const),
  ]);
  const defaultAdapter = options.defaultAdapter ?? 'plain';
  if (adapters[defaultAdapter] === undefined) {
    throw new Error('Unknown default code highlighter adapter "' + defaultAdapter + '".');
  }
  return makeEnvironmentProviders([
    { provide: TNG_CODE_HIGHLIGHTING_CONFIG, useValue: { adapters, defaultAdapter } },
  ]);
}
`;

const componentTemplate = `import {
  booleanAttribute,
  Component,
  effect,
  ElementRef,
  inject,
  input,
  model,
  signal,
  viewChild,
  type OnDestroy,
} from '@angular/core';
import {
  escapeTngCodeHtml,
  TNG_CODE_HIGHLIGHTING_CONFIG,
  type TngCodeHighlightingConfig,
} from './tng-code-highlighting';

@Component({
  selector: 'tng-code-editor',
  templateUrl: './tng-code-editor.html',
  styleUrl: './tng-code-editor.css',
})
export class TngCodeEditor implements OnDestroy {
  readonly value = model('');
  readonly language = input<string | null>(null);
  readonly adapter = input<string | null>(null);
  readonly theme = input<string | null>(null);
  readonly ariaLabel = input<string | null>(null);
  readonly disabled = input(false, { transform: booleanAttribute });
  readonly readonly = input(false, { transform: booleanAttribute });
  readonly rows = input(10, { transform: (value: number | string) => Math.max(1, Number(value) || 10) });
  readonly tabSize = input(4, { transform: (value: number | string) => Math.max(1, Number(value) || 4) });
  readonly highlightDebounceMs = input(75, { transform: (value: number | string) => Math.max(0, Number(value) || 0) });

  protected readonly highlightedHtml = signal('&#8203;');
  private readonly config = inject<TngCodeHighlightingConfig>(TNG_CODE_HIGHLIGHTING_CONFIG);
  private readonly highlightLayer = viewChild<ElementRef<HTMLElement>>('highlightLayer');
  private readonly textarea = viewChild<ElementRef<HTMLTextAreaElement>>('textarea');
  private timer: ReturnType<typeof setTimeout> | null = null;
  private requestId = 0;
  private destroyed = false;

  constructor() {
    effect((onCleanup) => {
      const code = this.value();
      const language = this.language();
      const theme = this.theme();
      const adapterId = this.adapter() ?? this.config.defaultAdapter;
      this.highlightedHtml.set(escapeTngCodeHtml(code) + '&#8203;');
      const requestId = ++this.requestId;
      this.timer = setTimeout(() => {
        const adapter = this.config.adapters[adapterId] ?? this.config.adapters[this.config.defaultAdapter];
        if (adapter === undefined || adapter.supports?.(language) === false) return;
        void Promise.resolve(adapter.highlight({ code, language, theme }))
          .then((result) => {
            if (!this.destroyed && requestId === this.requestId) {
              this.highlightedHtml.set(result.html + '&#8203;');
            }
          })
          .catch(() => undefined);
      }, this.highlightDebounceMs());
      onCleanup(() => {
        if (this.timer !== null) clearTimeout(this.timer);
      });
    });
  }

  ngOnDestroy(): void {
    this.destroyed = true;
    this.requestId += 1;
    if (this.timer !== null) clearTimeout(this.timer);
  }

  protected onInput(event: Event): void {
    if (this.disabled() || this.readonly()) return;
    const target = event.target;
    if (target instanceof HTMLTextAreaElement) this.value.set(target.value);
  }

  protected onScroll(): void {
    const textarea = this.textarea()?.nativeElement;
    const layer = this.highlightLayer()?.nativeElement;
    if (!textarea || !layer) return;
    layer.scrollTop = textarea.scrollTop;
    layer.scrollLeft = textarea.scrollLeft;
  }
}
`;

const htmlTemplate = `<div class="tng-code-editor" [style.--tng-code-editor-tab-size]="tabSize()">
  <pre #highlightLayer class="tng-code-editor__highlight" aria-hidden="true"><code [innerHTML]="highlightedHtml()"></code></pre>
  <textarea
    #textarea
    class="tng-code-editor__textarea"
    autocomplete="off"
    autocapitalize="off"
    autocorrect="off"
    spellcheck="false"
    wrap="off"
    [attr.aria-label]="ariaLabel()"
    [disabled]="disabled()"
    [readonly]="readonly()"
    [rows]="rows()"
    [value]="value()"
    (input)="onInput($event)"
    (scroll)="onScroll()"
  ></textarea>
</div>
`;

const cssTemplate = `:host { display: block; min-width: 0; width: 100%; }
.tng-code-editor {
  background: var(--tng-code-editor-bg, #fff);
  border: 1px solid var(--tng-code-editor-border, #94a3b8);
  border-radius: var(--tng-code-editor-radius, 0.5rem);
  color: var(--tng-code-editor-fg, #0f172a);
  font: var(--tng-code-editor-font, 0.875rem/1.6 ui-monospace, monospace);
  overflow: hidden;
  position: relative;
}
.tng-code-editor:focus-within { box-shadow: 0 0 0 3px var(--tng-code-editor-focus-ring, #93c5fd); }
.tng-code-editor__highlight, .tng-code-editor__textarea {
  box-sizing: border-box;
  font: inherit;
  margin: 0;
  min-width: 0;
  padding: 0.75rem 0.9rem;
  tab-size: var(--tng-code-editor-tab-size, 4);
  white-space: pre;
}
.tng-code-editor__highlight { inset: 0; overflow: hidden; pointer-events: none; position: absolute; }
.tng-code-editor__highlight code { font: inherit; white-space: inherit; }
.tng-code-editor__textarea {
  background: transparent;
  border: 0;
  caret-color: currentColor;
  color: transparent;
  outline: 0;
  overflow: auto;
  position: relative;
  resize: none;
  width: 100%;
}
.tng-code-editor__textarea::selection { background: rgb(59 130 246 / 28%); color: currentColor; }
.tng-code-editor__textarea:disabled { cursor: not-allowed; opacity: 0.55; }
`;

const indexTemplate = `export * from './tng-code-editor';
export * from './tng-code-highlighting';
`;

export const codeEditorRegistryItem = {
  dependencies: [],
  description: 'Ownable source editor with a native textarea and adapter-based highlighting.',
  install: {
    importPath: './tailng-ui/code-editor',
    importSymbols: ['TngCodeEditor', 'provideTngCodeHighlighting'],
  },
  files: [
    {
      content: highlightingTemplate,
      path: 'src/app/tailng-ui/code-editor/tng-code-highlighting.ts',
    },
    { content: componentTemplate, path: 'src/app/tailng-ui/code-editor/tng-code-editor.ts' },
    { content: htmlTemplate, path: 'src/app/tailng-ui/code-editor/tng-code-editor.html' },
    { content: cssTemplate, path: 'src/app/tailng-ui/code-editor/tng-code-editor.css' },
    { content: indexTemplate, path: 'src/app/tailng-ui/code-editor/index.ts' },
  ],
  name: 'code-editor',
} satisfies RegistryItem;
