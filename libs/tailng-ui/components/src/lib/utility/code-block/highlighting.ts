import {
  InjectionToken,
  inject,
  makeEnvironmentProviders,
  type EnvironmentProviders,
} from '@angular/core';

export type TngCodeHighlightInput = Readonly<{
  code: string;
  includeLineWrappers?: boolean;
  language: string | null;
  theme?: string | null;
}>;

export type TngCodeHighlightToken = Readonly<{
  className?: string | null;
  content: string;
}>;

export type TngCodeHighlightTokenLine = readonly TngCodeHighlightToken[];

export type TngCodeHighlightHtmlResult = Readonly<{
  html: string;
  kind: 'html';
  language?: string | null;
  trustedHtml?: boolean;
}>;

export type TngCodeHighlightLegacyHtmlResult = Readonly<{
  html: string;
  language?: string | null;
  trustedHtml?: boolean;
}>;

export type TngCodeHighlightTokensResult = Readonly<{
  kind: 'tokens';
  language?: string | null;
  tokens: readonly TngCodeHighlightTokenLine[];
}>;

export type TngCodeHighlightResult =
  | TngCodeHighlightHtmlResult
  | TngCodeHighlightLegacyHtmlResult
  | TngCodeHighlightTokensResult;

export type TngNormalizedCodeHighlightResult =
  | Readonly<{
    html: string;
    kind: 'html';
    language: string | null;
    trustedHtml: boolean;
  }>
  | Readonly<{
    kind: 'tokens';
    language: string | null;
    tokens: readonly TngCodeHighlightTokenLine[];
  }>;

export type TngCodeHighlightRequest = Readonly<{
  adapter: string | null | undefined;
  code: string;
  includeLineWrappers?: boolean;
  language: string | null | undefined;
  theme?: string | null | undefined;
}>;

export type TngCodeHighlighterAdapter = Readonly<{
  highlight: (input: TngCodeHighlightInput) => Promise<TngCodeHighlightResult> | TngCodeHighlightResult;
  id: string;
  supports?: (language: string | null) => boolean;
}>;

export type TngProvideCodeHighlightingOptions = Readonly<{
  adapters?: readonly TngCodeHighlighterAdapter[];
  allowBuiltinOverride?: boolean;
  defaultAdapter?: string;
}>;

export type TngResolvedCodeHighlightingConfig = Readonly<{
  adapters: Readonly<Record<string, TngCodeHighlighterAdapter>>;
  defaultAdapter: string;
}>;

export type TngCodeHighlightingResolverLike = Readonly<{
  highlight: (request: TngCodeHighlightRequest) => Promise<string>;
  highlightResult: (
    request: TngCodeHighlightRequest,
  ) => Promise<TngNormalizedCodeHighlightResult | null>;
}>;

const htmlEscapeAmpersand = /&/g;
const htmlEscapeGt = />/g;
const htmlEscapeLt = /</g;
const htmlEscapeQuote = /"/g;
const htmlEscapeSingleQuote = /'/g;
const htmlEscapeAmpersandValue = '&amp;';
const htmlEscapeGtValue = '&gt;';
const htmlEscapeLtValue = '&lt;';
const htmlEscapeQuoteValue = '&quot;';
const htmlEscapeSingleQuoteValue = '&#39;';

export const TNG_DEFAULT_CODE_HIGHLIGHTER_ID = 'plain';

function hasAdapter(
  adapters: Readonly<Record<string, TngCodeHighlighterAdapter>>,
  adapterId: string,
): boolean {
  return Object.prototype.hasOwnProperty.call(adapters, adapterId);
}

function normalizeRequiredString(value: string, label: string): string {
  const normalizedValue = value.trim();
  if (normalizedValue.length === 0) {
    throw new Error(`${label} cannot be empty.`);
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
      throw new Error(`Duplicate code highlighter adapter "${adapterId}" provided.`);
    }

    seenCustomAdapterIds.add(adapterId);
    if (isBuiltinAdapter && !allowBuiltinOverride) {
      throw new Error(
        `Code highlighter adapter "${adapterId}" is reserved. Set allowBuiltinOverride to true to override it.`,
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
    `Unknown default code highlighter adapter "${normalizedAdapter}". Available adapters: ${Object.keys(adapters).join(', ')}`,
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

function normalizeTokenLine(line: TngCodeHighlightTokenLine): readonly TngCodeHighlightToken[] {
  return line
    .filter((token) => typeof token.content === 'string')
    .map((token) => ({ className: token.className ?? null, content: token.content }));
}

function normalizeHighlightResult(
  result: TngCodeHighlightResult,
  fallbackLanguage: string | null,
): TngNormalizedCodeHighlightResult | null {
  const language = normalizeTngCodeLanguage(result.language) ?? fallbackLanguage;

  if ('kind' in result && result.kind === 'tokens') {
    return {
      kind: 'tokens',
      language,
      tokens: result.tokens.map((line) => normalizeTokenLine(line)),
    };
  }

  if ('html' in result && !('kind' in result && result.kind !== 'html')) {
    return {
      html: result.html,
      kind: 'html',
      language,
      trustedHtml: result.trustedHtml === true,
    };
  }

  return null;
}

function tokenClassNameToAttributeValue(className: string | null | undefined): string {
  if (className === null || className === undefined) {
    return '';
  }

  return className
    .trim()
    .split(/\s+/)
    .filter((token) => token.length > 0)
    .join(' ');
}

function tokensToEscapedHtml(lines: readonly TngCodeHighlightTokenLine[]): string {
  return lines
    .map((line) =>
      line
        .map((token) => {
          const escapedContent = escapeTngCodeHtml(token.content);
          const normalizedClassName = tokenClassNameToAttributeValue(token.className);
          if (normalizedClassName.length === 0) {
            return escapedContent;
          }

          return `<span class="${escapeTngCodeHtml(normalizedClassName)}">${escapedContent}</span>`;
        })
        .join(''),
    )
    .join('\n');
}

export function normalizeTngCodeLanguage(value: string | null | undefined): string | null {
  if (value === null || value === undefined) {
    return null;
  }

  const normalizedValue = value.trim();
  return normalizedValue.length > 0 ? normalizedValue : null;
}

export function normalizeTngCodeHighlighterId(value: string): string {
  return normalizeRequiredString(value, 'Code highlighter adapter id').toLowerCase();
}

export function escapeTngCodeHtml(value: string): string {
  return value
    .replace(htmlEscapeAmpersand, htmlEscapeAmpersandValue)
    .replace(htmlEscapeLt, htmlEscapeLtValue)
    .replace(htmlEscapeGt, htmlEscapeGtValue)
    .replace(htmlEscapeQuote, htmlEscapeQuoteValue)
    .replace(htmlEscapeSingleQuote, htmlEscapeSingleQuoteValue);
}

export function createTngCodeHighlighterAdapter(
  id: string,
  highlight: (input: TngCodeHighlightInput) => Promise<TngCodeHighlightResult> | TngCodeHighlightResult,
  supports?: (language: string | null) => boolean,
): TngCodeHighlighterAdapter {
  const adapterId = normalizeTngCodeHighlighterId(id);
  return Object.freeze({
    highlight,
    id: adapterId,
    supports,
  });
}

export const tngPlainCodeHighlighterAdapter = createTngCodeHighlighterAdapter(
  TNG_DEFAULT_CODE_HIGHLIGHTER_ID,
  (input: TngCodeHighlightInput): TngCodeHighlightResult => ({
    html: escapeTngCodeHtml(input.code),
    kind: 'html',
    language: input.language,
    trustedHtml: false,
  }),
);

export const TNG_BUILTIN_CODE_HIGHLIGHTERS: Readonly<Record<string, TngCodeHighlighterAdapter>> =
  createReadonlyAdapterMap({
    [TNG_DEFAULT_CODE_HIGHLIGHTER_ID]: tngPlainCodeHighlighterAdapter,
  });

export function resolveTngCodeHighlightingConfig(
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

export async function resolveTngCodeHighlightResult(
  request: TngCodeHighlightRequest,
  config: TngResolvedCodeHighlightingConfig,
): Promise<TngNormalizedCodeHighlightResult | null> {
  const adapter = resolveAdapterFromRequest(request, config);
  const normalizedLanguage = normalizeTngCodeLanguage(request.language);

  if (typeof adapter.supports === 'function' && !adapter.supports(normalizedLanguage)) {
    return null;
  }

  const rawResult = await adapter.highlight({
    code: request.code,
    includeLineWrappers: request.includeLineWrappers ?? false,
    language: normalizedLanguage,
    theme: normalizeTngCodeLanguage(request.theme),
  });

  return normalizeHighlightResult(rawResult, normalizedLanguage);
}

export async function highlightWithTngCodeHighlightingConfig(
  request: TngCodeHighlightRequest,
  config: TngResolvedCodeHighlightingConfig,
): Promise<string> {
  const resolvedResult = await resolveTngCodeHighlightResult(request, config);
  if (resolvedResult === null) {
    return escapeTngCodeHtml(request.code);
  }

  if (resolvedResult.kind === 'tokens') {
    return tokensToEscapedHtml(resolvedResult.tokens);
  }

  return resolvedResult.html;
}

export const TNG_CODE_HIGHLIGHTING_CONFIG = new InjectionToken<TngResolvedCodeHighlightingConfig>(
  'TNG_CODE_HIGHLIGHTING_CONFIG',
  {
    providedIn: 'root',
    factory: (): TngResolvedCodeHighlightingConfig => resolveTngCodeHighlightingConfig(),
  },
);

export const TNG_CODE_HIGHLIGHTING_RESOLVER = new InjectionToken<TngCodeHighlightingResolverLike>(
  'TNG_CODE_HIGHLIGHTING_RESOLVER',
  {
    providedIn: 'root',
    factory: (): TngCodeHighlightingResolverLike =>
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
      ): TngCodeHighlightingResolverLike => new TngCodeHighlightingResolver(config),
    },
  ]);
}

export class TngCodeHighlightingResolver {
  public constructor(private readonly config: TngResolvedCodeHighlightingConfig) { }

  public getAdapterIds(): readonly string[] {
    return Object.keys(this.config.adapters);
  }

  public getDefaultAdapterId(): string {
    return this.config.defaultAdapter;
  }

  public async highlight(request: TngCodeHighlightRequest): Promise<string> {
    return highlightWithTngCodeHighlightingConfig(request, this.config);
  }

  public async highlightResult(
    request: TngCodeHighlightRequest,
  ): Promise<TngNormalizedCodeHighlightResult | null> {
    return resolveTngCodeHighlightResult(request, this.config);
  }
}
