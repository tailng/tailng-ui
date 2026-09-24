import {
  booleanAttribute,
  Component,
  computed,
  effect,
  inject,
  input,
  model,
  output,
  signal,
  viewChild,
  type ElementRef,
  type OnDestroy,
} from '@angular/core';
import type { FormValueControl } from '@angular/forms/signals';
import { DomSanitizer, type SafeHtml } from '@angular/platform-browser';
import { coerceTngInputNullableBoolean, TngInput } from '@tailng-ui/primitives';
import {
  escapeTngCodeHtml,
  normalizeTngCodeLanguage,
  renderTngCodeHighlightResultHtml,
  resolveTngCodeHighlightResult,
  TNG_CODE_HIGHLIGHTING_CONFIG,
  type TngCodeHighlightRequest,
  type TngResolvedCodeHighlightingConfig,
} from '../../utility/code-block/highlighting';

type NullableBooleanInput = boolean | null | string | undefined;

export type TngCodeEditorRenderState = 'error' | 'highlighted' | 'highlighting' | 'idle';
export type TngCodeEditorRenderStateChange = Readonly<{
  error?: unknown;
  state: TngCodeEditorRenderState;
}>;
export type TngCodeEditorSanitizeHtml = boolean | 'auto';

type TngCodeEditorRenderRequest = Readonly<{
  adapter: string | null;
  code: string;
  language: string | null;
  theme: string | null;
}>;

const defaultHighlightDebounceMs = 75;
const defaultRows = 10;
const defaultTabSize = 4;

function normalizeAttr(value: string | null | undefined): string | null {
  if (value === undefined || value === null) return null;
  const normalized = value.trim();
  return normalized.length > 0 ? normalized : null;
}

function normalizePositiveInteger(value: number | string, fallback: number): number {
  const numericValue = typeof value === 'number' ? value : Number(value);
  if (!Number.isFinite(numericValue)) return fallback;
  return Math.max(1, Math.round(numericValue));
}

export function normalizeTngCodeEditorRows(value: number | string): number {
  return normalizePositiveInteger(value, defaultRows);
}

export function normalizeTngCodeEditorTabSize(value: number | string): number {
  return normalizePositiveInteger(value, defaultTabSize);
}

export function normalizeTngCodeEditorHighlightDebounceMs(value: number | string): number {
  const numericValue = typeof value === 'number' ? value : Number(value);
  if (!Number.isFinite(numericValue)) return defaultHighlightDebounceMs;
  return Math.max(0, Math.round(numericValue));
}

export function coerceTngCodeEditorSanitizeHtml(
  value: boolean | string | null | undefined,
): TngCodeEditorSanitizeHtml {
  if (value === false || value === 'false') return false;
  if (value === true || value === 'true' || value === '') return true;
  return 'auto';
}

export function readTngCodeEditorEventValue(event: unknown): string | null {
  if (!(event instanceof Event)) return null;
  const target = event.target;
  return target instanceof HTMLTextAreaElement ? target.value : null;
}

@Component({
  selector: 'tng-code-editor',
  imports: [TngInput],
  templateUrl: './tng-code-editor.component.html',
  styleUrl: './tng-code-editor.component.css',
})
export class TngCodeEditorComponent implements FormValueControl<string>, OnDestroy {
  public readonly adapter = input<string | null>(null);
  public readonly ariaDescribedBy = input<string | null>(null);
  public readonly ariaInvalid = input<boolean | null, NullableBooleanInput>(null, {
    transform: coerceTngInputNullableBoolean,
  });
  public readonly ariaLabel = input<string | null>(null);
  public readonly ariaLabelledby = input<string | null>(null);
  public readonly ariaRequired = input<boolean | null, NullableBooleanInput>(null, {
    transform: coerceTngInputNullableBoolean,
  });
  public readonly disabled = input<boolean, unknown>(false, { transform: booleanAttribute });
  public readonly highlight = input<boolean, unknown>(true, { transform: booleanAttribute });
  public readonly highlightDebounceMs = input<number, number | string>(defaultHighlightDebounceMs, {
    transform: normalizeTngCodeEditorHighlightDebounceMs,
  });
  public readonly id = input<string | null>(null);
  public readonly inputName = input<string | null>(null, { alias: 'name' });
  public readonly language = input<string | null>(null);
  public readonly placeholder = input<string | null>(null);
  public readonly readonly = input<boolean, unknown>(false, { transform: booleanAttribute });
  public readonly required = input<boolean, unknown>(false, { transform: booleanAttribute });
  public readonly rows = input<number, number | string>(defaultRows, {
    transform: normalizeTngCodeEditorRows,
  });
  public readonly sanitizeHtml = input<
    TngCodeEditorSanitizeHtml,
    boolean | string | null | undefined
  >('auto', { transform: coerceTngCodeEditorSanitizeHtml });
  public readonly tabSize = input<number, number | string>(defaultTabSize, {
    transform: normalizeTngCodeEditorTabSize,
  });
  public readonly theme = input<string | null>(null);
  public readonly value = model<string>('');

  public readonly renderStateChange = output<TngCodeEditorRenderStateChange>();

  protected readonly dataDisabled = computed((): '' | null => (this.disabled() ? '' : null));
  protected readonly dataReadonly = computed((): '' | null => (this.readonly() ? '' : null));
  protected readonly highlightedHtml = signal<SafeHtml | string>('&#8203;');
  protected readonly renderState = signal<TngCodeEditorRenderState>('idle');

  private readonly domSanitizer = inject(DomSanitizer);
  private readonly highlightingConfig = inject<TngResolvedCodeHighlightingConfig>(
    TNG_CODE_HIGHLIGHTING_CONFIG,
  );
  private readonly highlightLayer = viewChild<ElementRef<HTMLElement>>('highlightLayer');
  private readonly textarea = viewChild<ElementRef<HTMLTextAreaElement>>('textarea');

  private destroyed = false;
  private highlightDebounceTimer: ReturnType<typeof setTimeout> | null = null;
  private highlightRequestId = 0;
  private lastEmittedRenderState: TngCodeEditorRenderState = 'idle';

  public constructor() {
    effect((): void => {
      const request: TngCodeEditorRenderRequest = {
        adapter: normalizeTngCodeLanguage(this.adapter()),
        code: this.value(),
        language: normalizeTngCodeLanguage(this.language()),
        theme: normalizeTngCodeLanguage(this.theme()),
      };

      this.applyPlainText(request.code);
      this.enqueueRenderRequest(request);
    });
  }

  public ngOnDestroy(): void {
    this.destroyed = true;
    this.highlightRequestId += 1;
    this.clearHighlightDebounceTimer();
  }

  public onInput(event: unknown): void {
    if (this.disabled() || this.readonly()) return;
    const value = readTngCodeEditorEventValue(event);
    if (value === null) return;
    this.value.set(value);
  }

  public onScroll(): void {
    const textarea = this.textarea()?.nativeElement;
    const highlightLayer = this.highlightLayer()?.nativeElement;
    if (textarea === undefined || highlightLayer === undefined) return;

    highlightLayer.scrollTop = textarea.scrollTop;
    highlightLayer.scrollLeft = textarea.scrollLeft;
  }

  protected normalizeAttrValue(value: string | null | undefined): string | null {
    return normalizeAttr(value);
  }

  private applyPlainText(code: string): void {
    this.highlightedHtml.set(`${escapeTngCodeHtml(code)}&#8203;`);
  }

  private clearHighlightDebounceTimer(): void {
    if (this.highlightDebounceTimer === null) return;
    clearTimeout(this.highlightDebounceTimer);
    this.highlightDebounceTimer = null;
  }

  private enqueueRenderRequest(request: TngCodeEditorRenderRequest): void {
    this.clearHighlightDebounceTimer();
    this.highlightRequestId += 1;

    if (!this.highlight()) {
      this.setRenderState('idle');
      return;
    }

    this.setRenderState('highlighting');
    const debounceMs = this.highlightDebounceMs();
    if (debounceMs === 0) {
      void this.renderRequest(request, this.highlightRequestId);
      return;
    }

    const requestId = this.highlightRequestId;
    this.highlightDebounceTimer = setTimeout((): void => {
      this.highlightDebounceTimer = null;
      void this.renderRequest(request, requestId);
    }, debounceMs);
  }

  private isStaleRequest(requestId: number): boolean {
    return this.destroyed || requestId !== this.highlightRequestId;
  }

  private async renderRequest(
    request: TngCodeEditorRenderRequest,
    requestId: number,
  ): Promise<void> {
    const highlightRequest: TngCodeHighlightRequest = {
      adapter: request.adapter,
      code: request.code,
      language: request.language,
      theme: request.theme,
    };

    try {
      const result = await resolveTngCodeHighlightResult(highlightRequest, this.highlightingConfig);
      if (this.isStaleRequest(requestId)) return;

      if (result === null) {
        this.applyPlainText(request.code);
        this.setRenderState('highlighted');
        return;
      }

      const rendered = renderTngCodeHighlightResultHtml(result);
      const html = `${rendered.html}&#8203;`;
      if (this.sanitizeHtml() === false && rendered.trustedHtml) {
        this.highlightedHtml.set(this.domSanitizer.bypassSecurityTrustHtml(html));
      } else {
        this.highlightedHtml.set(html);
      }
      this.setRenderState('highlighted');
    } catch (error) {
      if (this.isStaleRequest(requestId)) return;
      this.applyPlainText(request.code);
      this.setRenderState('error', error);
    }
  }

  private setRenderState(state: TngCodeEditorRenderState, error?: unknown): void {
    this.renderState.set(state);
    if (this.lastEmittedRenderState === state) return;

    this.lastEmittedRenderState = state;
    this.renderStateChange.emit(state === 'error' ? { error, state } : { state });
  }
}

export { TngCodeEditorComponent as TngCodeEditor };
