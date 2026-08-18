import {
  booleanAttribute,
  Component,
  computed,
  effect,
  inject,
  input,
  output,
  signal,
  type OnDestroy,
} from '@angular/core';
import { DomSanitizer, type SafeHtml } from '@angular/platform-browser';
import {
  TngCodeBlock as TngCodeBlockPrimitive,
  TngCodeBlockBody as TngCodeBlockBodyPrimitive,
  TngCodeBlockCode as TngCodeBlockCodePrimitive,
  TngCodeBlockGutter as TngCodeBlockGutterPrimitive,
  TngCodeBlockHeader as TngCodeBlockHeaderPrimitive,
  TngCopy,
} from '@tailng-ui/primitives';
import type { TngCopyErrorEvent, TngCopyEvent, TngCopySuccessEvent } from '@tailng-ui/primitives';
import {
  escapeTngCodeHtml,
  normalizeTngCodeLanguage,
  resolveTngCodeHighlightResult,
  TNG_CODE_HIGHLIGHTING_CONFIG,
  type TngCodeHighlightToken,
  type TngCodeHighlightTokenLine,
  type TngCodeHighlightRequest,
  type TngNormalizedCodeHighlightResult,
  type TngResolvedCodeHighlightingConfig,
} from './highlighting';

export type TngCodeBlockCopyMode = boolean | 'auto';
export type TngCodeBlockHighlightLineInput = number | readonly [number, number];
export type TngCodeBlockHighlightMode = 'auto' | 'off' | 'on';
export type TngCodeBlockLineNumbersMode = boolean | 'auto';
export type TngCodeBlockRenderState = 'error' | 'highlighted' | 'highlighting' | 'idle';
export type TngCodeBlockSanitizeHtml = boolean | 'auto';
export type TngCodeBlockVariant = 'compact' | 'default' | 'ghost';

export type TngCodeBlockCopyContext = {
  code: string;
  language: string | null;
  theme: string | null;
};

export type TngCodeBlockRenderStateChange = {
  error?: unknown;
  state: TngCodeBlockRenderState;
};

type TngCodeBlockCopyState = 'copied' | 'error' | 'idle';

type TngCodeBlockRenderRequest = Readonly<{
  adapter: string | null;
  code: string;
  includeLineWrappers: boolean;
  language: string | null;
  theme: string | null;
}>;

type TngCodeBlockRenderedLine = Readonly<{
  dimmed: boolean;
  highlighted: boolean;
  html: SafeHtml | string;
  lineNumber: number;
}>;

const defaultCopyResetDuration = 1500;
const highlightModeSet = new Set<TngCodeBlockHighlightMode>(['auto', 'off', 'on']);

function normalizeOptionalString(value: string | null | undefined): string | null {
  if (value === null || value === undefined) {
    return null;
  }

  const normalized = value.trim();
  return normalized.length > 0 ? normalized : null;
}

function toRoundedPositiveNumber(value: number): number {
  return Math.max(0, Math.round(value));
}

function coerceOptionalBoolean(value: boolean | string | null | undefined): boolean | undefined {
  if (value === undefined || value === null) {
    return undefined;
  }

  return booleanAttribute(value);
}

function coercePositiveInteger(value: number | string, fallback: number): number {
  const numericValue = typeof value === 'number' ? value : Number(value);
  if (!Number.isFinite(numericValue)) {
    return fallback;
  }

  return Math.max(1, Math.round(numericValue));
}

function coerceOptionalPositiveNumber(value: number | string | undefined): number | undefined {
  if (value === undefined) {
    return undefined;
  }

  const numericValue = typeof value === 'number' ? value : Number(value);
  if (!Number.isFinite(numericValue)) {
    return undefined;
  }

  return toRoundedPositiveNumber(numericValue);
}

function coerceTngCodeBlockCopyMode(
  value: string | boolean | null | undefined,
): TngCodeBlockCopyMode {
  if (value === false || value === 'false') {
    return false;
  }

  if (value === true || value === 'true' || value === '') {
    return true;
  }

  return 'auto';
}

function coerceTngCodeBlockLineNumbersMode(
  value: string | boolean | null | undefined,
): TngCodeBlockLineNumbersMode {
  if (value === 'auto') {
    return 'auto';
  }

  if (value === true || value === 'true' || value === '') {
    return true;
  }

  return false;
}

function coerceTngCodeBlockSanitizeHtml(
  value: string | boolean | null | undefined,
): TngCodeBlockSanitizeHtml {
  if (value === false || value === 'false') {
    return false;
  }

  if (value === true || value === 'true' || value === '') {
    return true;
  }

  return 'auto';
}

function normalizeHighlightLineNumber(value: number): number | null {
  if (!Number.isFinite(value)) {
    return null;
  }

  const normalized = Math.round(value);
  return normalized > 0 ? normalized : null;
}

function getHighlightRangeSet(
  start: number,
  end: number,
): Set<number> {
  const set = new Set<number>();
  const normalizedStart = normalizeHighlightLineNumber(start);
  const normalizedEnd = normalizeHighlightLineNumber(end);
  if (normalizedStart !== null && normalizedEnd !== null) {
    const from = Math.min(normalizedStart, normalizedEnd);
    const to = Math.max(normalizedStart, normalizedEnd);
    for (let current = from; current <= to; current += 1) {
      set.add(current);
    }
  }
  return set;
}

function toNormalizedHighlightLineSet(
  value: readonly TngCodeBlockHighlightLineInput[] | null | undefined,
): ReadonlySet<number> {
  if (value === undefined || value === null || value.length === 0) {
    return new Set<number>();
  }

  const normalizedValues = new Set<number>();

  for (const entry of value) {
    if (typeof entry === 'number') {
      const normalized = normalizeHighlightLineNumber(entry);
      if (normalized !== null) {
        normalizedValues.add(normalized);
      }
      continue;
    }

    const rangeSet = getHighlightRangeSet(entry[0], entry[1]);
    for (const num of rangeSet) {
      normalizedValues.add(num);
    }
  }

  return normalizedValues;
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

function renderToken(token: TngCodeHighlightToken): string {
  const escapedContent = escapeTngCodeHtml(token.content);
  const normalizedClassName = tokenClassNameToAttributeValue(token.className);
  if (normalizedClassName.length === 0) {
    return escapedContent;
  }

  return `<span class="${escapeTngCodeHtml(normalizedClassName)}">${escapedContent}</span>`;
}

function renderTokenLine(line: TngCodeHighlightTokenLine): string {
  return line.map((token) => renderToken(token)).join('');
}

function splitCodeLines(code: string): readonly string[] {
  if (code.length === 0) {
    return [''];
  }

  const lines = code.split('\n');
  if (lines.length > 1 && lines[lines.length - 1] === '') {
    lines.pop();
  }

  return lines;
}

function toNormalizedCopyError(value: unknown): Error {
  if (value instanceof Error) {
    return value;
  }

  if (typeof value === 'object' && value !== null && 'error' in value) {
    const nestedError = (value as { error: unknown }).error;
    if (nestedError instanceof Error) {
      return nestedError;
    }
  }

  return new Error('Copy failed.');
}

function toCssSizeValue(value: number | string | null | undefined): string | null {
  if (value === undefined || value === null) {
    return null;
  }

  if (typeof value === 'number') {
    if (!Number.isFinite(value)) {
      return null;
    }

    return `${Math.max(0, value)}px`;
  }

  const normalized = value.trim();
  return normalized.length > 0 ? normalized : null;
}

function shouldHighlight(mode: TngCodeBlockHighlightMode): boolean {
  return mode === 'auto' || mode === 'on';
}

export function coerceTngCodeBlockHighlightMode(value: string): TngCodeBlockHighlightMode {
  if (highlightModeSet.has(value as TngCodeBlockHighlightMode)) {
    return value as TngCodeBlockHighlightMode;
  }

  return 'auto';
}

export function coerceTngCodeBlockCopyResetDuration(value: number | string): number {
  const numericValue = typeof value === 'number' ? value : Number(value);
  if (!Number.isFinite(numericValue)) {
    return defaultCopyResetDuration;
  }

  return toRoundedPositiveNumber(numericValue);
}

export function coerceTngCodeBlockStartingLineNumber(value: number | string): number {
  return coercePositiveInteger(value, 1);
}

export function normalizeTngCodeBlockCode(value: string | null | undefined): string {
  if (value === null || value === undefined) {
    return '';
  }

  return value.replace(/\r\n?/g, '\n');
}

export function toTngCodeBlockLineNumbers(
  code: string,
  startingLineNumber = 1,
): readonly number[] {
  const normalizedStart = Math.max(1, Math.round(startingLineNumber));
  return splitCodeLines(code).map((_, index) => normalizedStart + index);
}

@Component({
  selector: 'tng-code-block',
  imports: [
    TngCodeBlockPrimitive,
    TngCodeBlockHeaderPrimitive,
    TngCodeBlockBodyPrimitive,
    TngCodeBlockGutterPrimitive,
    TngCodeBlockCodePrimitive,
    TngCopy,
  ],
  templateUrl: './tng-code-block.component.html',
  styleUrl: './tng-code-block.component.css',
})
export class TngCodeBlockComponent implements OnDestroy {
  public readonly adapter = input<string | null>(null);
  public readonly caption = input<string | null>(null);
  public readonly code = input<string>('');
  public readonly copyMode = input<TngCodeBlockCopyMode, string | boolean | null | undefined>(
    'auto',
    {
      alias: 'copy',
      transform: coerceTngCodeBlockCopyMode,
    },
  );
  public readonly copyLabel = input<string>('Copy code');
  public readonly copiedLabel = input<string>('Copied');
  public readonly copyResetDuration = input<number, number | string>(defaultCopyResetDuration, {
    transform: coerceTngCodeBlockCopyResetDuration,
  });
  public readonly copySuccessDurationMs = input<number | undefined, number | string | undefined>(
    undefined,
    {
      transform: coerceOptionalPositiveNumber,
    },
  );
  public readonly copyText = input<string | ((ctx: TngCodeBlockCopyContext) => string) | null>(null);
  public readonly errorLabel = input<string>('Copy failed');
  public readonly focusLines = input<boolean, boolean | string>(false, {
    transform: booleanAttribute,
  });
  public readonly highlight = input<boolean, boolean | string>(true, {
    transform: booleanAttribute,
  });
  public readonly highlightDebounceMs = input<number, number | string>(0, {
    transform: coerceTngCodeBlockCopyResetDuration,
  });
  public readonly highlightLines = input<readonly TngCodeBlockHighlightLineInput[] | null>(null);
  public readonly highlightMode = input<TngCodeBlockHighlightMode, string>('auto', {
    transform: coerceTngCodeBlockHighlightMode,
  });
  public readonly language = input<string | null>(null);
  public readonly lineNumbersMode = input<
    TngCodeBlockLineNumbersMode,
    string | boolean | null | undefined
  >(false, {
    alias: 'lineNumbers',
    transform: coerceTngCodeBlockLineNumbersMode,
  });
  public readonly maxHeight = input<string | number | null>(null);
  public readonly sanitizeHtml = input<
    TngCodeBlockSanitizeHtml,
    string | boolean | null | undefined
  >('auto', {
    transform: coerceTngCodeBlockSanitizeHtml,
  });
  public readonly showHeader = input<boolean, boolean | string>(true, {
    transform: booleanAttribute,
  });
  public readonly showLanguageBadge = input<boolean, boolean | string>(true, {
    transform: booleanAttribute,
  });
  public readonly showLineNumbers = input<boolean | undefined, boolean | string | null | undefined>(
    undefined,
    {
      transform: coerceOptionalBoolean,
    },
  );
  public readonly startingLineNumber = input<number, number | string>(1, {
    transform: coerceTngCodeBlockStartingLineNumber,
  });
  public readonly theme = input<string | null>(null);
  public readonly title = input<string | null>(null);
  public readonly variant = input<TngCodeBlockVariant>('default');
  public readonly wrap = input<boolean, boolean | string>(false, {
    transform: booleanAttribute,
  });

  public readonly copy = output<TngCopyEvent>();
  public readonly copyError = output<TngCopyErrorEvent>();
  public readonly copySuccess = output<TngCopySuccessEvent>();
  public readonly renderStateChange = output<TngCodeBlockRenderStateChange>();

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

  protected readonly copyPayload = computed((): string => {
    const value = this.copyText();
    if (typeof value === 'function') {
      try {
        return value({
          code: this.normalizedCode(),
          language: this.languageForBadge(),
          theme: normalizeTngCodeLanguage(this.theme()),
        });
      } catch {
        return this.normalizedCode();
      }
    }

    if (typeof value === 'string') {
      return value;
    }

    return this.normalizedCode();
  });

  protected readonly dataHasCopy = computed((): 'false' | 'true' =>
    this.shouldShowCopyAction() ? 'true' : 'false',
  );

  protected readonly dataHasTitle = computed((): 'false' | 'true' =>
    this.titleText() === null ? 'false' : 'true',
  );

  protected readonly dataHighlighted = computed((): 'false' | 'true' =>
    this.renderState() === 'highlighted' ? 'true' : 'false',
  );

  protected readonly dataWrap = computed((): 'false' | 'true' => (this.wrap() ? 'true' : 'false'));

  protected readonly effectiveCopyResetDuration = computed((): number => {
    return this.copySuccessDurationMs() ?? this.copyResetDuration();
  });

  protected readonly effectiveLineNumbers = computed((): boolean => {
    const legacyValue = this.showLineNumbers();
    if (legacyValue !== undefined) {
      return legacyValue;
    }

    const mode = this.lineNumbersMode();
    if (mode === 'auto') {
      return splitCodeLines(this.normalizedCode()).length > 1;
    }

    return mode;
  });

  protected readonly hasHeaderContent = computed((): boolean => {
    return this.titleText() !== null || this.hasLanguageBadge() || this.shouldShowCopyAction();
  });

  protected readonly hasLanguageBadge = computed((): boolean => {
    return this.showLanguageBadge() && this.languageForBadge() !== null;
  });

  protected readonly highlightLineSet = computed((): ReadonlySet<number> =>
    toNormalizedHighlightLineSet(this.highlightLines()),
  );

  protected readonly isHighlighting = computed((): boolean => this.renderState() === 'highlighting');

  protected readonly languageForBadge = computed((): string | null => {
    return this.resolvedLanguage() ?? this.normalizedLanguage();
  });

  protected readonly languageLabel = computed((): string => {
    return this.languageForBadge() ?? 'text';
  });

  protected readonly lineNumbers = computed((): readonly number[] => {
    return this.renderedLines().map((line) => line.lineNumber);
  });

  protected readonly maxHeightCssValue = computed((): string | null => toCssSizeValue(this.maxHeight()));

  protected readonly normalizedCode = computed((): string => normalizeTngCodeBlockCode(this.code()));

  protected readonly renderState = signal<TngCodeBlockRenderState>('idle');

  protected readonly renderedLines = computed((): readonly TngCodeBlockRenderedLine[] => {
    const baseLines = this.baseLineHtml();
    const start = this.startingLineNumber();
    const highlightSet = this.highlightLineSet();
    const shouldDim = this.focusLines() && highlightSet.size > 0;

    return baseLines.map((html, index) => {
      const lineNumber = start + index;
      const highlighted = highlightSet.has(lineNumber);

      return {
        dimmed: shouldDim && !highlighted,
        highlighted,
        html,
        lineNumber,
      };
    });
  });

  protected readonly shouldRenderBodyLineNumbers = computed((): boolean => this.effectiveLineNumbers());

  protected readonly shouldRenderHeader = computed((): boolean => {
    return this.showHeader() && this.hasHeaderContent();
  });

  protected readonly shouldShowCopyAction = computed((): boolean => {
    const mode = this.copyMode();
    if (mode === 'auto') {
      return this.normalizedCode().length > 0;
    }

    return mode;
  });

  protected readonly titleText = computed((): string | null => normalizeOptionalString(this.title()));

  private readonly baseLineHtml = signal<readonly (SafeHtml | string)[]>(['']);
  private readonly copyState = signal<TngCodeBlockCopyState>('idle');
  private readonly domSanitizer = inject(DomSanitizer);
  private readonly highlightingConfig = inject<TngResolvedCodeHighlightingConfig>(
    TNG_CODE_HIGHLIGHTING_CONFIG,
  );
  private readonly normalizedLanguage = computed((): string | null => normalizeTngCodeLanguage(this.language()));
  private readonly resolvedLanguage = signal<string | null>(null);

  private copyResetTimer: ReturnType<typeof setTimeout> | null = null;
  private destroyed = false;
  private highlightDebounceTimer: ReturnType<typeof setTimeout> | null = null;
  private highlightRequestId = 0;
  private lastEmittedRenderState: TngCodeBlockRenderState = 'idle';
  private readonly renderCache = new Map<string, TngNormalizedCodeHighlightResult | null>();

  public constructor() {
    effect((): void => {
      const request: TngCodeBlockRenderRequest = {
        adapter: normalizeTngCodeLanguage(this.adapter()),
        code: this.normalizedCode(),
        includeLineWrappers: this.shouldIncludeLineWrappers(),
        language: this.normalizedLanguage(),
        theme: normalizeTngCodeLanguage(this.theme()),
      };

      this.enqueueRenderRequest({
        request,
        shouldHighlight: this.shouldHighlightCode(),
      });
    });
  }

  public ngOnDestroy(): void {
    this.destroyed = true;
    this.highlightRequestId += 1;
    this.clearCopyResetTimer();
    this.clearHighlightDebounceTimer();
  }

  protected onPrimitiveCopy(...args: readonly unknown[]): void {
    const [event] = args;
    if (
      typeof event === 'object' &&
      event !== null &&
      'text' in event &&
      'trigger' in event &&
      typeof (event as { text: unknown }).text === 'string' &&
      typeof (event as { trigger: unknown }).trigger === 'string'
    ) {
      this.copy.emit(event as TngCopyEvent);
    }
  }

  protected onPrimitiveCopyError(...args: readonly unknown[]): void {
    const [event] = args;
    const normalizedError = toNormalizedCopyError(event);

    this.copyState.set('error');
    this.tngCopyError.emit(normalizedError);

    if (typeof event === 'object' && event !== null && 'error' in event) {
      this.copyError.emit(event as TngCopyErrorEvent);
    } else {
      this.copyError.emit({ error: normalizedError });
    }

    this.scheduleCopyStateReset();
  }

  protected onPrimitiveCopySuccess(...args: readonly unknown[]): void {
    const [event] = args;
    if (
      typeof event !== 'object' ||
      event === null ||
      !('text' in event) ||
      !('method' in event) ||
      typeof (event as { text: unknown }).text !== 'string' ||
      typeof (event as { method: unknown }).method !== 'string'
    ) {
      return;
    }

    const payload = event as TngCopySuccessEvent;
    this.copyState.set('copied');
    this.copySuccess.emit(payload);
    this.tngCopied.emit(payload.text);
    this.scheduleCopyStateReset();
  }

  private applyPlainText(code: string, language: string | null): void {
    this.resolvedLanguage.set(language);
    this.baseLineHtml.set(splitCodeLines(code).map((line) => escapeTngCodeHtml(line)));
  }

  private applyTokensHighlightResult(tokens: readonly TngCodeHighlightTokenLine[]): boolean {
    if (tokens.length === 0) {
      return false;
    }

    this.baseLineHtml.set(tokens.map((line) => renderTokenLine(line)));
    return true;
  }

  private applyHtmlHighlightResult(html: string, trustedHtml: boolean): boolean {
    const htmlLines = html.split('\n');
    if (htmlLines.length === 0 || (htmlLines.length === 1 && htmlLines[0].length === 0)) {
      return false;
    }

    const shouldBypassSanitization = this.sanitizeHtml() === false && trustedHtml;
    if (shouldBypassSanitization) {
      this.baseLineHtml.set(
        htmlLines.map((line) => this.domSanitizer.bypassSecurityTrustHtml(line)),
      );
      return true;
    }

    this.baseLineHtml.set(htmlLines);
    return true;
  }

  private applyResolvedHighlightResult(
    result: TngNormalizedCodeHighlightResult,
    request: TngCodeBlockRenderRequest,
  ): boolean {
    this.resolvedLanguage.set(result.language ?? request.language);

    if (result.kind === 'tokens') {
      return this.applyTokensHighlightResult(result.tokens);
    }

    return this.applyHtmlHighlightResult(result.html, result.trustedHtml);
  }

  private buildCacheKey(request: TngCodeBlockRenderRequest): string {
    return [
      request.adapter ?? '',
      request.language ?? '',
      request.theme ?? '',
      request.includeLineWrappers ? '1' : '0',
      request.code,
    ].join('\u241f');
  }

  private clearCopyResetTimer(): void {
    if (this.copyResetTimer === null) {
      return;
    }

    clearTimeout(this.copyResetTimer);
    this.copyResetTimer = null;
  }

  private clearHighlightDebounceTimer(): void {
    if (this.highlightDebounceTimer === null) {
      return;
    }

    clearTimeout(this.highlightDebounceTimer);
    this.highlightDebounceTimer = null;
  }

  private enqueueRenderRequest(input: Readonly<{ request: Readonly<TngCodeBlockRenderRequest>; shouldHighlight: boolean }>): void {
    this.clearHighlightDebounceTimer();

    const debounceMs = this.highlightDebounceMs();
    if (debounceMs <= 0) {
      void this.renderRequest(input);
      return;
    }

    this.highlightDebounceTimer = setTimeout((): void => {
      this.highlightDebounceTimer = null;
      void this.renderRequest(input);
    }, debounceMs);
  }

  private isStaleRequest(requestId: number): boolean {
    return this.destroyed || requestId !== this.highlightRequestId;
  }

  private scheduleCopyStateReset(): void {
    this.clearCopyResetTimer();
    this.copyResetTimer = setTimeout((): void => {
      this.copyState.set('idle');
      this.copyResetTimer = null;
    }, this.effectiveCopyResetDuration());
  }

  private setRenderState(state: TngCodeBlockRenderState, error?: unknown): void {
    this.renderState.set(state);

    if (this.lastEmittedRenderState === state) {
      return;
    }

    this.lastEmittedRenderState = state;
    if (state === 'error') {
      this.renderStateChange.emit({ error, state });
      return;
    }

    this.renderStateChange.emit({ state });
  }

  private shouldHighlightCode(): boolean {
    if (!this.highlight()) {
      return false;
    }

    return shouldHighlight(this.highlightMode());
  }

  private shouldIncludeLineWrappers(): boolean {
    return this.effectiveLineNumbers() || this.highlightLineSet().size > 0 || this.focusLines();
  }

  private toHighlightRequest(request: TngCodeBlockRenderRequest): TngCodeHighlightRequest {
    return {
      adapter: request.adapter,
      code: request.code,
      includeLineWrappers: request.includeLineWrappers,
      language: request.language,
      theme: request.theme,
    };
  }

  private async renderRequest(input: Readonly<{ request: Readonly<TngCodeBlockRenderRequest>; shouldHighlight: boolean }>): Promise<void> {
    const requestId = this.highlightRequestId + 1;
    this.highlightRequestId = requestId;

    if (!input.shouldHighlight) {
      this.applyPlainText(input.request.code, input.request.language);
      this.setRenderState('idle');
      return;
    }

    this.setRenderState('highlighting');

    try {
      const cacheKey = this.buildCacheKey(input.request);
      let resolvedResult = this.renderCache.get(cacheKey);
      if (resolvedResult === undefined) {
        resolvedResult = await resolveTngCodeHighlightResult(
          this.toHighlightRequest(input.request),
          this.highlightingConfig,
        );
        this.renderCache.set(cacheKey, resolvedResult);
      }

      if (this.isStaleRequest(requestId)) {
        return;
      }

      if (resolvedResult === null) {
        this.applyPlainText(input.request.code, input.request.language);
        this.setRenderState('highlighted');
        return;
      }

      const didRenderHighlight = this.applyResolvedHighlightResult(resolvedResult, input.request);
      if (!didRenderHighlight) {
        this.applyPlainText(input.request.code, input.request.language);
      }

      this.setRenderState('highlighted');
    } catch (error) {
      if (this.isStaleRequest(requestId)) {
        return;
      }

      this.applyPlainText(input.request.code, input.request.language);
      this.setRenderState('error', error);
    }
  }
}
export { TngCodeBlockComponent as TngCodeBlock };
