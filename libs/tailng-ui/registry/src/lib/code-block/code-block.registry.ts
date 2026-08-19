import type { RegistryItem } from '../registry.types';

const codeHighlightingTsTemplate = `import {
  InjectionToken,
  inject,
  makeEnvironmentProviders,
  type EnvironmentProviders,
} from '@angular/core';

type TngCodeHighlightInput = Readonly<{
  code: string;
  language: string | null;
}>;

type TngCodeHighlightResult = Readonly<{
  html: string;
}>;

type TngCodeHighlightRequest = Readonly<{
  adapter: string | null | undefined;
  code: string;
  language: string | null | undefined;
}>;

type TngCodeHighlighterAdapter = Readonly<{
  highlight: (input: TngCodeHighlightInput) => Promise<TngCodeHighlightResult>;
  id: string;
}>;

type TngProvideCodeHighlightingOptions = Readonly<{
  adapters?: readonly TngCodeHighlighterAdapter[];
  allowBuiltinOverride?: boolean;
  defaultAdapter?: string;
}>;

type TngResolvedCodeHighlightingConfig = Readonly<{
  adapters: Readonly<Record<string, TngCodeHighlighterAdapter>>;
  defaultAdapter: string;
}>;

const htmlEscapeAmpersand = /&/g;
const htmlEscapeGt = />/g;
const htmlEscapeLt = /</g;
const htmlEscapeQuote = /"/g;
const htmlEscapeSingleQuote = /'/g;

const TNG_DEFAULT_CODE_HIGHLIGHTER_ID = 'plain';

function hasAdapter(
  adapters: Readonly<Record<string, TngCodeHighlighterAdapter>>,
  adapterId: string,
): boolean {
  return Object.prototype.hasOwnProperty.call(adapters, adapterId);
}

function normalizeRequiredString(value: string, label: string): string {
  const normalizedValue = value.trim();
  if (normalizedValue.length === 0) {
    throw new Error(
      '\${label} cannot be empty.',
    );
  }

  return normalizedValue;
}

function createReadonlyAdapterMap(
  adapters: Readonly<Record<string, TngCodeHighlighterAdapter>>,
): Readonly<Record<string, TngCodeHighlighterAdapter>> {
  return Object.freeze({ ...adapters });
}

function withCustomAdapters(
  baseAdapters: Readonly<Record<string, TngCodeHighlighterAdapter>>,
  customAdapters: readonly TngCodeHighlighterAdapter[],
  allowBuiltinOverride: boolean,
): Record<string, TngCodeHighlighterAdapter> {
  const mergedAdapters: Record<string, TngCodeHighlighterAdapter> = { ...baseAdapters };
  const seenCustomAdapterIds = new Set<string>();

  for (const adapter of customAdapters) {
    const adapterId = normalizeTngCodeHighlighterId(adapter.id);
    const isBuiltinAdapter = hasAdapter(TNG_BUILTIN_CODE_HIGHLIGHTERS, adapterId);

    if (seenCustomAdapterIds.has(adapterId)) {
      throw new Error(
        'Duplicate code highlighter adapter "\${adapterId}" provided.',
      );
    }

    seenCustomAdapterIds.add(adapterId);
    if (isBuiltinAdapter && !allowBuiltinOverride) {
      throw new Error(
        'Code highlighter adapter "\${adapterId}" is reserved. Set allowBuiltinOverride to true to override it.',
      );
    }

    mergedAdapters[adapterId] = adapter;
  }

  return mergedAdapters;
}

function resolveDefaultAdapterId(
  defaultAdapter: string | undefined,
  adapters: Readonly<Record<string, TngCodeHighlighterAdapter>>,
): string {
  const candidateAdapter = defaultAdapter ?? TNG_DEFAULT_CODE_HIGHLIGHTER_ID;
  const normalizedAdapter = normalizeTngCodeHighlighterId(candidateAdapter);
  if (hasAdapter(adapters, normalizedAdapter)) {
    return normalizedAdapter;
  }

  throw new Error(
    'Unknown default code highlighter adapter "\${normalizedAdapter}". Available adapters: \${Object.keys(adapters).join(', ')}',
  );
}

function resolveAdapterFromRequest(
  request: TngCodeHighlightRequest,
  config: TngResolvedCodeHighlightingConfig,
): TngCodeHighlighterAdapter {
  const requestedAdapter = request.adapter;
  if (requestedAdapter !== null && requestedAdapter !== undefined) {
    const normalizedAdapter = normalizeTngCodeHighlighterId(requestedAdapter);
    const resolvedAdapter = config.adapters[normalizedAdapter];
    if (resolvedAdapter !== undefined) {
      return resolvedAdapter;
    }
  }

  return config.adapters[config.defaultAdapter];
}

function normalizeTngCodeLanguage(value: string | null | undefined): string | null {
  if (value === null || value === undefined) {
    return null;
  }

  const normalizedValue = value.trim();
  return normalizedValue.length > 0 ? normalizedValue : null;
}

function normalizeTngCodeHighlighterId(value: string): string {
  return normalizeRequiredString(value, 'Code highlighter adapter id').toLowerCase();
}

function escapeTngCodeHtml(value: string): string {
  return value
    .replace(htmlEscapeAmpersand, '&amp;')
    .replace(htmlEscapeLt, '&lt;')
    .replace(htmlEscapeGt, '&gt;')
    .replace(htmlEscapeQuote, '&quot;')
    .replace(htmlEscapeSingleQuote, '&#39;');
}

function createTngCodeHighlighterAdapter(
  id: string,
  highlight: (input: TngCodeHighlightInput) => Promise<TngCodeHighlightResult>,
): TngCodeHighlighterAdapter {
  const adapterId = normalizeTngCodeHighlighterId(id);
  return Object.freeze({
    highlight,
    id: adapterId,
  });
}

const tngPlainCodeHighlighterAdapter = createTngCodeHighlighterAdapter(
  TNG_DEFAULT_CODE_HIGHLIGHTER_ID,
  async (input: TngCodeHighlightInput): Promise<TngCodeHighlightResult> => ({
    html: escapeTngCodeHtml(input.code),
  }),
);

const TNG_BUILTIN_CODE_HIGHLIGHTERS: Readonly<Record<string, TngCodeHighlighterAdapter>> =
  createReadonlyAdapterMap({
    [TNG_DEFAULT_CODE_HIGHLIGHTER_ID]: tngPlainCodeHighlighterAdapter,
  });

function resolveTngCodeHighlightingConfig(
  options: TngProvideCodeHighlightingOptions = {},
): TngResolvedCodeHighlightingConfig {
  const mergedAdapters = withCustomAdapters(
    TNG_BUILTIN_CODE_HIGHLIGHTERS,
    options.adapters ?? [],
    options.allowBuiltinOverride === true,
  );

  return {
    adapters: createReadonlyAdapterMap(mergedAdapters),
    defaultAdapter: resolveDefaultAdapterId(options.defaultAdapter, mergedAdapters),
  };
}

const TNG_CODE_HIGHLIGHTING_CONFIG = new InjectionToken<TngResolvedCodeHighlightingConfig>(
  'TNG_CODE_HIGHLIGHTING_CONFIG',
  {
    providedIn: 'root',
    factory: (): TngResolvedCodeHighlightingConfig => resolveTngCodeHighlightingConfig(),
  },
);

const TNG_CODE_HIGHLIGHTING_RESOLVER = new InjectionToken<TngCodeHighlightingResolver>(
  'TNG_CODE_HIGHLIGHTING_RESOLVER',
  {
    providedIn: 'root',
    factory: (): TngCodeHighlightingResolver =>
      new TngCodeHighlightingResolver(inject(TNG_CODE_HIGHLIGHTING_CONFIG)),
  },
);

export function provideTngCodeHighlighting(
  options?: TngProvideCodeHighlightingOptions,
): EnvironmentProviders {
  return makeEnvironmentProviders([
    {
      provide: TNG_CODE_HIGHLIGHTING_CONFIG,
      useValue: resolveTngCodeHighlightingConfig(options),
    },
    {
      deps: [TNG_CODE_HIGHLIGHTING_CONFIG],
      provide: TNG_CODE_HIGHLIGHTING_RESOLVER,
      useFactory: (
        config: TngResolvedCodeHighlightingConfig,
      ): TngCodeHighlightingResolver => new TngCodeHighlightingResolver(config),
    },
  ]);
}

export class TngCodeHighlightingResolver {
  public constructor(private readonly config: TngResolvedCodeHighlightingConfig) {}

  public async highlight(request: TngCodeHighlightRequest): Promise<string> {
    const adapter = resolveAdapterFromRequest(request, this.config);
    const normalizedLanguage = normalizeTngCodeLanguage(request.language);
    const result = await adapter.highlight({
      code: request.code,
      language: normalizedLanguage,
    });

    return result.html;
  }
}
`;

const codeBlockPrimitiveTsTemplate = `import { Directive, HostBinding } from '@angular/core';

@Directive({
  selector: '[tngCodeBlock]',
  exportAs: 'tngCodeBlock',
})
export class TngCodeBlockPrimitive {
  @HostBinding('attr.data-slot')
  protected readonly dataSlot = 'code-block' as const;
}

@Directive({
  selector: '[tngCodeBlockHeader]',
  exportAs: 'tngCodeBlockHeader',
})
export class TngCodeBlockHeaderPrimitive {
  @HostBinding('attr.data-slot')
  protected readonly dataSlot = 'code-block-header' as const;
}

@Directive({
  selector: '[tngCodeBlockBody]',
  exportAs: 'tngCodeBlockBody',
})
export class TngCodeBlockBodyPrimitive {
  @HostBinding('attr.data-slot')
  protected readonly dataSlot = 'code-block-body' as const;
}

@Directive({
  selector: '[tngCodeBlockGutter]',
  exportAs: 'tngCodeBlockGutter',
})
export class TngCodeBlockGutterPrimitive {
  @HostBinding('attr.data-slot')
  protected readonly dataSlot = 'code-block-gutter' as const;
}

@Directive({
  selector: '[tngCodeBlockCode]',
  exportAs: 'tngCodeBlockCode',
})
export class TngCodeBlockCodePrimitive {
  @HostBinding('attr.data-slot')
  protected readonly dataSlot = 'code-block-code' as const;
}
`;

const codeBlockComponentTsTemplate = `import {
  booleanAttribute,
  Component,
  computed,
  effect,
  input,
  output,
  signal,
  type OnDestroy,
} from '@angular/core';
import {
  TngCodeBlockBodyPrimitive,
  TngCodeBlockCodePrimitive,
  TngCodeBlockGutterPrimitive,
  TngCodeBlockHeaderPrimitive,
  TngCodeBlockPrimitive,
} from './tng-code-block-primitive';
import { TngCodeHighlightingResolver } from './tng-code-highlighting';

type TngCodeBlockCopyState = 'copied' | 'error' | 'idle';
type TngCodeBlockHighlightMode = 'auto' | 'off' | 'on';
type TngCodeBlockRenderRequest = Readonly<{
  adapter: string | null;
  code: string;
  highlightMode: TngCodeBlockHighlightMode;
  language: string | null;
}>;

const defaultCopyResetDuration = 1500;
const highlightModes = ['auto', 'off', 'on'] as const;
const highlightModeSet = new Set<TngCodeBlockHighlightMode>(highlightModes);

function toRoundedPositiveNumber(value: number): number {
  return Math.max(0, Math.round(value));
}

function normalizeTngCodeLanguage(value: string | null | undefined): string | null {
  if (value === null || value === undefined) {
    return null;
  }

  const normalizedValue = value.trim();
  return normalizedValue.length > 0 ? normalizedValue : null;
}

function shouldHighlight(mode: TngCodeBlockHighlightMode): boolean {
  return mode === 'auto' || mode === 'on';
}

function coerceTngCodeBlockHighlightMode(value: string): TngCodeBlockHighlightMode {
  if (highlightModeSet.has(value as TngCodeBlockHighlightMode)) {
    return value as TngCodeBlockHighlightMode;
  }

  return 'auto';
}

function coerceTngCodeBlockCopyResetDuration(value: number | string): number {
  const numericValue = typeof value === 'number' ? value : Number(value);
  if (!Number.isFinite(numericValue)) {
    return defaultCopyResetDuration;
  }

  return toRoundedPositiveNumber(numericValue);
}

function escapeTngCodeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function normalizeTngCodeBlockCode(value: string | null | undefined): string {
  if (value === null || value === undefined) {
    return '';
  }

  return value.replace(/\r\n?/g, '\n');
}

function toTngCodeBlockLineNumbers(code: string): readonly number[] {
  if (code.length === 0) {
    return [1];
  }

  const lineCount = code.split('\n').length;
  return Array.from({ length: lineCount }, (_, index) => index + 1);
}

@Component({
  selector: 'tng-code-block',
  imports: [
    TngCodeBlockPrimitive,
    TngCodeBlockHeaderPrimitive,
    TngCodeBlockBodyPrimitive,
    TngCodeBlockGutterPrimitive,
    TngCodeBlockCodePrimitive,
  ],
  templateUrl: './tng-code-block.html',
  styleUrl: './tng-code-block.css',
})
export class TngCodeBlock implements OnDestroy {
  public readonly adapter = input<string | null>(null);
  public readonly code = input<string>('');
  public readonly copy = input<boolean, boolean | string>(true, {
    transform: booleanAttribute,
  });
  public readonly copyLabel = input<string>('Copy');
  public readonly copiedLabel = input<string>('Copied');
  public readonly copyResetDuration = input<number, number | string>(defaultCopyResetDuration, {
    transform: coerceTngCodeBlockCopyResetDuration,
  });
  public readonly errorLabel = input<string>('Copy failed');
  public readonly highlightMode = input<TngCodeBlockHighlightMode, string>('auto', {
    transform: coerceTngCodeBlockHighlightMode,
  });
  public readonly language = input<string | null>(null);
  public readonly showHeader = input<boolean, boolean | string>(true, {
    transform: booleanAttribute,
  });
  public readonly showLineNumbers = input<boolean, boolean | string>(true, {
    transform: booleanAttribute,
  });
  public readonly wrap = input<boolean, boolean | string>(false, {
    transform: booleanAttribute,
  });

  public readonly tngCopied = output<string>();
  public readonly tngCopyError = output<Error>();

  protected readonly copyButtonLabel = computed((): string => {
    const state = this.copyState();
    if (state === 'copied') {
      return this.copiedLabel();
    }

    if (state === 'error') {
      return this.errorLabel();
    }

    return this.copyLabel();
  });

  protected readonly copyDisabled = computed((): boolean => {
    return !this.copy() || this.normalizedCode().length === 0;
  });

  protected readonly highlightedHtml = signal<string>('');

  protected readonly languageLabel = computed((): string => {
    return normalizeTngCodeLanguage(this.language()) ?? 'text';
  });

  protected readonly lineNumbers = computed((): readonly number[] => {
    return toTngCodeBlockLineNumbers(this.normalizedCode());
  });

  protected readonly normalizedCode = computed((): string => {
    return normalizeTngCodeBlockCode(this.code());
  });

  private readonly copyState = signal<TngCodeBlockCopyState>('idle');
  private readonly highlightingResolver = new TngCodeHighlightingResolver({
    adapters: {
      plain: {
        id: 'plain',
        highlight: async (input): Promise<Readonly<{ html: string }>> => ({
          html: escapeTngCodeHtml(input.code),
        }),
      },
    },
    defaultAdapter: 'plain',
  });
  private copyResetTimer: ReturnType<typeof setTimeout> | null = null;
  private highlightRequestId = 0;
  private destroyed = false;

  public constructor() {
    effect((): void => {
      void this.updateHighlightedHtml({
        adapter: normalizeTngCodeLanguage(this.adapter()),
        code: this.normalizedCode(),
        highlightMode: this.highlightMode(),
        language: normalizeTngCodeLanguage(this.language()),
      });
    });
  }

  public ngOnDestroy(): void {
    this.destroyed = true;
    this.highlightRequestId += 1;
    this.clearCopyResetTimer();
  }

  protected async onCopyClick(): Promise<void> {
    if (this.copyDisabled()) {
      return;
    }

    try {
      await navigator.clipboard.writeText(this.normalizedCode());
      this.copyState.set('copied');
      this.tngCopied.emit(this.normalizedCode());
      this.scheduleCopyStateReset();
    } catch (error) {
      const normalizedError = error instanceof Error ? error : new Error('Copy failed.');
      this.copyState.set('error');
      this.tngCopyError.emit(normalizedError);
      this.scheduleCopyStateReset();
    }
  }

  private clearCopyResetTimer(): void {
    if (this.copyResetTimer === null) {
      return;
    }

    clearTimeout(this.copyResetTimer);
    this.copyResetTimer = null;
  }

  private isStaleRequest(requestId: number): boolean {
    return this.destroyed || requestId !== this.highlightRequestId;
  }

  private scheduleCopyStateReset(): void {
    this.clearCopyResetTimer();
    this.copyResetTimer = setTimeout((): void => {
      this.copyState.set('idle');
      this.copyResetTimer = null;
    }, this.copyResetDuration());
  }

  private async updateHighlightedHtml(request: TngCodeBlockRenderRequest): Promise<void> {
    const requestId = this.highlightRequestId + 1;
    this.highlightRequestId = requestId;

    if (!shouldHighlight(request.highlightMode)) {
      this.highlightedHtml.set(escapeTngCodeHtml(request.code));
      return;
    }

    try {
      const highlightedHtml = await this.highlightingResolver.highlight({
        adapter: request.adapter,
        code: request.code,
        language: request.language,
      });
      if (this.isStaleRequest(requestId)) {
        return;
      }

      this.highlightedHtml.set(highlightedHtml);
    } catch {
      if (this.isStaleRequest(requestId)) {
        return;
      }

      this.highlightedHtml.set(escapeTngCodeHtml(request.code));
    }
  }
}
`;

const codeBlockTemplateHtml = `<section
  tngCodeBlock
  class="tng-code-block"
  [attr.data-language]="languageLabel()"
  [attr.data-wrap]="wrap() ? '' : null"
>
  @if (showHeader()) {
    <header tngCodeBlockHeader class="tng-code-block__header">
      <span class="tng-code-block__language">{{ languageLabel() }}</span>

      @if (copy()) {
        <button
          type="button"
          class="tng-code-block__copy-button"
          [attr.data-copy-state]="copyButtonLabel()"
          [disabled]="copyDisabled()"
          (click)="onCopyClick()"
        >
          {{ copyButtonLabel() }}
        </button>
      }
    </header>
  }

  <div
    tngCodeBlockBody
    class="tng-code-block__body"
    [class.tng-code-block__body--line-numbers]="showLineNumbers()"
    [class.tng-code-block__body--wrap]="wrap()"
  >
    @if (showLineNumbers()) {
      <ol tngCodeBlockGutter class="tng-code-block__gutter" aria-hidden="true">
        @for (lineNumber of lineNumbers(); track lineNumber) {
          <li class="tng-code-block__line-number">{{ lineNumber }}</li>
        }
      </ol>
    }

    <pre class="tng-code-block__pre">
<code tngCodeBlockCode class="tng-code-block__code" [innerHTML]="highlightedHtml()"></code>
    </pre>
  </div>
</section>
`;

const codeBlockTemplateCss = `:host {
  display: block;
}

.tng-code-block {
  background: var(--tng-code-block-bg, #0b1220);
  border: 1px solid var(--tng-code-block-border, #263142);
  border-radius: var(--tng-code-block-radius, 0.8rem);
  color: var(--tng-code-block-fg, #dbe6f6);
  display: grid;
  overflow: hidden;
}

.tng-code-block__header {
  align-items: center;
  background: var(--tng-code-block-header-bg, rgba(15, 23, 42, 0.9));
  border-bottom: 1px solid var(--tng-code-block-border, #263142);
  display: flex;
  justify-content: space-between;
  min-height: 2.25rem;
  padding: 0.35rem 0.65rem;
}

.tng-code-block__language {
  color: var(--tng-code-block-language-fg, #93c5fd);
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.tng-code-block__copy-button {
  appearance: none;
  background: var(--tng-code-block-copy-bg, transparent);
  border: 1px solid var(--tng-code-block-copy-border, #334155);
  border-radius: 0.55rem;
  color: var(--tng-code-block-copy-fg, #cbd5e1);
  cursor: pointer;
  font: inherit;
  font-size: 0.75rem;
  font-weight: 600;
  min-height: 1.85rem;
  padding: 0 0.7rem;
  transition: background-color 120ms ease, border-color 120ms ease, color 120ms ease, opacity 120ms ease;
}

.tng-code-block__copy-button[data-copy-state='Copied'] {
  background: var(--tng-code-block-copy-success-bg, #166534);
  border-color: var(--tng-code-block-copy-success-bg, #166534);
  color: var(--tng-code-block-copy-success-fg, #f0fdf4);
}

.tng-code-block__copy-button[data-copy-state='Copy failed'] {
  background: var(--tng-code-block-copy-error-bg, #b91c1c);
  border-color: var(--tng-code-block-copy-error-bg, #b91c1c);
  color: var(--tng-code-block-copy-error-fg, #fef2f2);
}

.tng-code-block__copy-button:disabled {
  cursor: not-allowed;
  opacity: 0.55;
}

.tng-code-block__body {
  display: grid;
}

.tng-code-block__body--line-numbers {
  grid-template-columns: auto minmax(0, 1fr);
}

.tng-code-block__gutter {
  background: var(--tng-code-block-gutter-bg, rgba(15, 23, 42, 0.65));
  border-right: 1px solid var(--tng-code-block-border, #263142);
  color: var(--tng-code-block-gutter-fg, #64748b);
  list-style: none;
  margin: 0;
  min-width: 2.8rem;
  padding: 0.75rem 0.45rem;
  text-align: right;
}

.tng-code-block__line-number {
  font-family: var(--tng-code-block-font-family, 'IBM Plex Mono', 'Fira Code', 'Menlo', monospace);
  font-size: 0.78rem;
  line-height: var(--tng-code-block-line-height, 1.6);
}

.tng-code-block__pre {
  margin: 0;
  overflow-x: auto;
  padding: 0.75rem 0.9rem;
}

.tng-code-block__code {
  color: inherit;
  display: block;
  font-family: var(--tng-code-block-font-family, 'IBM Plex Mono', 'Fira Code', 'Menlo', monospace);
  font-size: var(--tng-code-block-font-size, 0.84rem);
  line-height: var(--tng-code-block-line-height, 1.6);
  min-height: 100%;
  white-space: pre;
}

.tng-code-block__body--wrap .tng-code-block__code {
  overflow-wrap: anywhere;
  white-space: pre-wrap;
  word-break: break-word;
}
`;

const codeBlockIndexTsTemplate = `export * from './tng-code-block';
export * from './tng-code-block-primitive';
export * from './tng-code-highlighting';
`;

export const codeBlockRegistryItem = {
  dependencies: [],
  description:
    'Shadcn-style source files for code block primitives, wrapper, and highlighting adapter strategy.',
  install: {
    importPath: './tailng-ui/code-block',
    importSymbols: [
      'TngCodeHighlightingResolver',
      'TngCodeBlock',
      'TngCodeBlockPrimitive',
      'TngCodeBlockHeaderPrimitive',
      'TngCodeBlockBodyPrimitive',
      'TngCodeBlockGutterPrimitive',
      'TngCodeBlockCodePrimitive',
    ],
  },
  files: [
    {
      content: codeBlockPrimitiveTsTemplate,
      path: 'src/app/tailng-ui/code-block/tng-code-block-primitive.ts',
    },
    {
      content: codeHighlightingTsTemplate,
      path: 'src/app/tailng-ui/code-block/tng-code-highlighting.ts',
    },
    {
      content: codeBlockComponentTsTemplate,
      path: 'src/app/tailng-ui/code-block/tng-code-block.ts',
    },
    {
      content: codeBlockTemplateHtml,
      path: 'src/app/tailng-ui/code-block/tng-code-block.html',
    },
    {
      content: codeBlockTemplateCss,
      path: 'src/app/tailng-ui/code-block/tng-code-block.css',
    },
    {
      content: codeBlockIndexTsTemplate,
      path: 'src/app/tailng-ui/code-block/index.ts',
    },
  ],
  name: 'code-block',
} satisfies RegistryItem;
