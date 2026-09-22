import {
  DestroyRef,
  Directive,
  ElementRef,
  HostBinding,
  HostListener,
  booleanAttribute,
  effect,
  inject,
  input,
  output,
  signal,
  type Signal,
} from '@angular/core';
import type { ElementRef as NgElementRef } from '@angular/core';

type TngCopyElementRef = Readonly<NgElementRef<HTMLElement>>;
type TngCopySourceElement = HTMLElement;

export type TngCopyFromTarget =
  | TngCopyElementRef
  | TngCopySourceElement
  | string
  | null
  | undefined;
export type TngCopyIgnoreSelectorsInput = readonly string[] | string | null | undefined;
export type TngCopyButtonTextInput = string | (() => string) | Signal<string> | null | undefined;
export type TngCopyButtonTrigger = 'keyboard' | 'pointer' | 'programmatic';
export type TngCopyButtonStatus = 'copying' | 'error' | 'idle' | 'success';
export type TngCopyFormat = 'text/html' | 'text/plain';

/**
 * Accept string because template/attribute bindings commonly arrive as strings.
 * Keeping this broad also avoids `no-redundant-type-constituents` (string + literals).
 */
export type TngCopyFormatInput = string | null | undefined;
export type TngCopyMethod = 'clipboard' | 'execCommand';
export type TngCopyAnnounce = 'auto' | boolean;

export type TngCopyAnnounceInput = string | boolean | null | undefined;

export type TngCopyEvent = {
  text: string;
  trigger: TngCopyButtonTrigger;
}

export type TngCopySuccessEvent = {
  method: TngCopyMethod;
  text: string;
}

export type TngCopyErrorEvent = {
  error: unknown;
}

export const defaultTngCopyIgnoreSelectors: readonly string[] = Object.freeze([
  '[data-copy-ignore]',
  '.line-no',
  '.line-number',
  '.line-numbers',
]);
export const defaultTngCopySuccessDurationMs = 1500;
export const defaultTngCopySuccessAnnouncement = 'Copied to clipboard';
export const defaultTngCopyErrorAnnouncement = 'Copy failed';

function hasNonEmptyText(value: string): boolean {
  return value.trim().length > 0;
}

function dedupeSelectors(selectors: readonly string[]): readonly string[] {
  return [...new Set(selectors)];
}

function normalizeSelectorFromArray(value: readonly string[]): readonly string[] {
  return dedupeSelectors(
    value.map((selector) => selector.trim()).filter((selector) => selector.length > 0),
  );
}

function normalizeSelectorFromString(value: string): readonly string[] {
  return dedupeSelectors(
    value
      .split(',')
      .map((selector) => selector.trim())
      .filter((selector) => selector.length > 0),
  );
}

function toCopyError(error: unknown): Error {
  if (error instanceof Error) {
    return error;
  }

  if (typeof error === 'string') {
    return new Error(error);
  }

  return new Error('Copy failed.');
}

function isHtmlElement(value: unknown): value is HTMLElement {
  return typeof HTMLElement !== 'undefined' && value instanceof HTMLElement;
}

function isDocument(value: unknown): value is Document {
  return typeof Document !== 'undefined' && value instanceof Document;
}

function isElementRefTarget(value: unknown): value is TngCopyElementRef {
  if (typeof value !== 'object' || value === null) {
    return false;
  }

  if (!('nativeElement' in value)) {
    return false;
  }

  const candidate = value as { nativeElement: unknown };
  return isHtmlElement(candidate.nativeElement);
}

function resolveSourceElement(source: unknown, ownerDocument: unknown): HTMLElement | null {
  if (!isDocument(ownerDocument)) {
    return null;
  }

  if (source === null || source === undefined) {
    return null;
  }

  if (typeof source === 'string') {
    const normalizedSelector = source.trim();
    if (normalizedSelector.length === 0) {
      return null;
    }

    return ownerDocument.querySelector<HTMLElement>(normalizedSelector);
  }

  if (isHtmlElement(source)) {
    return source;
  }

  if (isElementRefTarget(source)) {
    return source.nativeElement;
  }

  return null;
}

function removeIgnoredNodes(root: unknown, ignoreSelectors: readonly string[]): void {
  if (!isHtmlElement(root)) {
    return;
  }

  for (const selector of ignoreSelectors) {
    try {
      const ignoredNodes: readonly Element[] = Array.from(root.querySelectorAll(selector));
      for (const node of ignoredNodes) {
        node.remove();
      }
    } catch {
      continue;
    }
  }
}

function isTextInputElement(
  sourceElement: unknown,
): sourceElement is HTMLInputElement | HTMLTextAreaElement {
  const isInputElement =
    typeof HTMLInputElement !== 'undefined' && sourceElement instanceof HTMLInputElement;
  if (isInputElement) {
    return true;
  }

  return typeof HTMLTextAreaElement !== 'undefined' && sourceElement instanceof HTMLTextAreaElement;
}

function extractTextFromSourceElement(
  sourceElement: unknown,
  ignoreSelectors: readonly string[],
): string {
  if (!isHtmlElement(sourceElement)) {
    return '';
  }

  if (isTextInputElement(sourceElement)) {
    return sourceElement.value;
  }

  if (ignoreSelectors.length === 0) {
    return sourceElement.textContent ?? '';
  }

  const clone = sourceElement.cloneNode(true) as HTMLElement;
  removeIgnoredNodes(clone, ignoreSelectors);
  return clone.textContent ?? '';
}

function copyWithExecCommand(text: string, ownerDocument: unknown): boolean {
  if (!isDocument(ownerDocument)) {
    return false;
  }

  if (typeof ownerDocument.execCommand !== 'function') {
    return false;
  }

  const body = ownerDocument.body;
  if (body === null) {
    return false;
  }

  const textarea = ownerDocument.createElement('textarea');
  textarea.value = text;
  textarea.setAttribute('readonly', '');
  textarea.style.inset = '0';
  textarea.style.opacity = '0';
  textarea.style.pointerEvents = 'none';
  textarea.style.position = 'fixed';
  const activeElement = ownerDocument.activeElement;
  const restoreTarget = isHtmlElement(activeElement) ? activeElement : null;

  body.appendChild(textarea);
  textarea.focus();
  textarea.select();

  try {
    return ownerDocument.execCommand('copy');
  } finally {
    body.removeChild(textarea);
    if (restoreTarget !== null && ownerDocument.contains(restoreTarget)) {
      restoreTarget.focus();
    }
  }
}

function toRoundedPositiveNumber(value: number): number {
  return Math.max(0, Math.round(value));
}

function toPlainTextFromHtml(html: string, ownerDocument: unknown): string {
  if (!isDocument(ownerDocument)) {
    return html.replace(/<[^>]*>/g, '');
  }

  const template = ownerDocument.createElement('template');
  template.innerHTML = html;
  return template.content.textContent ?? '';
}

function normalizeHotkey(value: string | null | undefined): string | null {
  if (value === undefined || value === null) {
    return null;
  }

  const normalized = value.trim().toLowerCase();
  return normalized.length > 0 ? normalized : null;
}

function normalizeKey(value: string): string {
  if (value === ' ') {
    return 'space';
  }

  const normalized = value.trim().toLowerCase();
  if (normalized === 'spacebar') {
    return 'space';
  }

  return normalized;
}

function isActivationKey(key: string): boolean {
  return key === 'Enter' || key === ' ';
}

function isNativeButton(value: unknown): value is HTMLButtonElement {
  return typeof HTMLButtonElement !== 'undefined' && value instanceof HTMLButtonElement;
}

function isElement(value: unknown): value is Element {
  return typeof Element !== 'undefined' && value instanceof Element;
}

function resolveExplicitText(
  value: TngCopyButtonTextInput,
): { error: Error | null; value: string | null | undefined } {
  if (value === undefined || value === null) {
    return { error: null, value };
  }

  if (typeof value === 'string') {
    return { error: null, value };
  }

  try {
    const result = value();
    if (result === null || result === undefined) {
      return { error: null, value: null };
    }

    return { error: null, value: typeof result === 'string' ? result : String(result) };
  } catch (error) {
    return { error: toCopyError(error), value: null };
  }
}

type TngHotkeyModifiers = Readonly<{
  ctrl: boolean;
  meta: boolean;
  alt: boolean;
  shift: boolean;
  key: string;
}>;

function parseHotkey(hotkey: string): TngHotkeyModifiers | null {
  const tokens = hotkey
    .split('+')
    .map((t) => t.trim().toLowerCase())
    .filter(Boolean);

  if (tokens.length === 0) return null;

  const key = tokens[tokens.length - 1];
  const mods = new Set(tokens.slice(0, -1));

  const isMac = /mac|iphone|ipad|ipod/i.test(globalThis.navigator?.platform ?? '');
  const modCtrl = mods.has('ctrl') || (mods.has('mod') && !isMac);
  const modMeta = mods.has('meta') || (mods.has('mod') && isMac);

  return {
    ctrl: modCtrl,
    meta: modMeta,
    alt: mods.has('alt'),
    shift: mods.has('shift'),
    key,
  };
}

export function eventMatchesHotkey(event: KeyboardEvent, hotkey: string): boolean {
  const parsed = parseHotkey(hotkey);
  if (!parsed) return false;

  const checks: readonly (readonly [boolean, boolean])[] = [
    [event.ctrlKey, parsed.ctrl],
    [event.metaKey, parsed.meta],
    [event.altKey, parsed.alt],
    [event.shiftKey, parsed.shift],
  ];

  if (checks.some(([actual, expected]) => actual !== expected)) return false;

  return normalizeKey(event.key) === normalizeKey(parsed.key);
}

function coerceTngCopySuccessDuration(value: number | string): number {
  const numericValue = typeof value === 'number' ? value : Number(value);
  if (!Number.isFinite(numericValue)) {
    return defaultTngCopySuccessDurationMs;
  }

  return toRoundedPositiveNumber(numericValue);
}

export function coerceTngCopyAnnounce(value: TngCopyAnnounceInput): TngCopyAnnounce {
  if (value === true || value === false) return value;
  if (value === null || value === undefined) return 'auto';

  const v = String(value).trim().toLowerCase();
  if (v === '' || v === 'true') return true;
  if (v === 'false') return false;
  return 'auto';
}

export function coerceTngCopyFormat(value: TngCopyFormatInput): TngCopyFormat {
  const v = value === null || value === undefined ? '' : String(value).trim().toLowerCase();
  return v === 'text/html' ? 'text/html' : 'text/plain';
}

export function normalizeTngCopyIgnoreSelectors(
  value: TngCopyIgnoreSelectorsInput,
): readonly string[] {
  if (value === undefined || value === null) {
    return defaultTngCopyIgnoreSelectors;
  }

  if (typeof value === 'string') {
    return normalizeSelectorFromString(value);
  }

  return normalizeSelectorFromArray(value);
}

export function resolveTngCopyPayload(
  directText: string | null | undefined,
  sourceText: string | null,
): string | null {
  if (directText !== null && directText !== undefined) {
    return hasNonEmptyText(directText) ? directText : null;
  }

  if (sourceText !== null && hasNonEmptyText(sourceText)) {
    return sourceText;
  }

  return null;
}

type TngClipboardLike = Readonly<{
  write?: (items: readonly unknown[]) => Promise<void>;
  writeText?: (text: string) => Promise<void>;
}>;

function canWriteHtml(
  clipboardApi: TngClipboardLike,
): clipboardApi is Readonly<{ write: (items: readonly unknown[]) => Promise<void> }> {
  return (
    typeof clipboardApi.write === 'function' &&
    typeof ClipboardItem !== 'undefined' &&
    typeof Blob !== 'undefined'
  );
}

async function tryWriteTngClipboard(params: Readonly<{
  format: TngCopyFormat;
  text: string;
  plainText: string;
}>): Promise<TngCopyMethod | null> {
  const { format, text, plainText } = params;

  const clipboardApi = globalThis.navigator?.clipboard as unknown as TngClipboardLike | undefined;
  if (clipboardApi === undefined) {
    return null;
  }

  if (format === 'text/html' && canWriteHtml(clipboardApi)) {
    const clipboardItem = new ClipboardItem({
      'text/html': new Blob([text], { type: 'text/html' }),
      'text/plain': new Blob([plainText], { type: 'text/plain' }),
    });
    await clipboardApi.write([clipboardItem]);
    return 'clipboard';
  }

  if (typeof clipboardApi.writeText === 'function') {
    await clipboardApi.writeText(plainText);
    return 'clipboard';
  }

  return null;
}

export async function writeTngClipboardText(
  text: string,
  ownerDocument: unknown,
  format: TngCopyFormat = 'text/plain',
): Promise<TngCopyMethod> {
  const plainText = format === 'text/html' ? toPlainTextFromHtml(text, ownerDocument) : text;

  let clipboardError: unknown = null;

  try {
    const result = await tryWriteTngClipboard({ format, text, plainText });
    if (result !== null) {
      return result;
    }
  } catch (error) {
    clipboardError = error;
  }

  if (copyWithExecCommand(plainText, ownerDocument)) {
    return 'execCommand';
  }

  if (clipboardError !== null) {
    throw toCopyError(clipboardError);
  }

  throw new Error('Clipboard API is not available in this environment.');
}

@Directive({
  selector: '[tngCopy], [tngCopyButton]',
  exportAs: 'tngCopy',
})
export class TngCopy {
  public readonly tngCopy = output<TngCopyEvent>();
  public readonly tngCopyButtonText = input<TngCopyButtonTextInput>(undefined);
  public readonly tngCopyButtonTarget = input<TngCopyFromTarget>(null);
  public readonly tngCopyButtonFormat = input<TngCopyFormat, TngCopyFormatInput>('text/plain', {
    transform: coerceTngCopyFormat,
  });
  public readonly tngCopyButtonSuccessDurationMs = input<number, number | string>(
    defaultTngCopySuccessDurationMs,
    { transform: coerceTngCopySuccessDuration },
  );
  public readonly tngCopyButtonDisabled = input<boolean, boolean | string>(false, {
    transform: booleanAttribute,
  });
  public readonly tngCopyButtonHotkey = input<string | null>(null);
  public readonly tngCopyButtonAnnounce = input<TngCopyAnnounce, TngCopyAnnounceInput>('auto', {
    transform: coerceTngCopyAnnounce,
  });
  public readonly tngCopyButtonSuccessMessage = input<string>(defaultTngCopySuccessAnnouncement);
  public readonly tngCopyButtonErrorMessage = input<string>(defaultTngCopyErrorAnnouncement);
  public readonly tngCopyDisabled = input<boolean, boolean | string>(false, {
    transform: booleanAttribute,
  });
  public readonly tngCopied = output<string>();
  public readonly tngCopySuccess = output<TngCopySuccessEvent>();
  public readonly tngCopyError = output<TngCopyErrorEvent>();
  public readonly tngCopyFrom = input<TngCopyFromTarget>(null);
  public readonly tngCopyIgnoreSelectors = input<readonly string[], TngCopyIgnoreSelectorsInput>(
    defaultTngCopyIgnoreSelectors,
    {
      transform: normalizeTngCopyIgnoreSelectors,
    },
  );
  public readonly tngCopyText = input<string | null | undefined>(undefined);
  public readonly tngCopyAnnounced = output<string>();
  public readonly status = signal<TngCopyButtonStatus>('idle');
  public readonly lastCopiedText = signal<string | null>(null);
  public readonly error = signal<Error | null>(null);

  private readonly hostElement = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
  private readonly destroyRef = inject(DestroyRef);
  private successResetTimer: ReturnType<typeof setTimeout> | null = null;
  private copying = false;

  @HostBinding('attr.data-copy-disabled')
  protected get dataCopyDisabledAttr(): '' | null {
    return this.isDisabled() ? '' : null;
  }

  @HostBinding('attr.aria-disabled')
  protected get ariaDisabledAttr(): 'true' | null {
    if (isNativeButton(this.hostElement)) {
      return null;
    }

    return this.isDisabled() ? 'true' : null;
  }

  @HostBinding('attr.disabled')
  protected get disabledAttr(): '' | null {
    if (!isNativeButton(this.hostElement)) {
      return null;
    }

    return this.isDisabled() ? '' : null;
  }

  public constructor() {
    effect((onCleanup): void => {
      const hotkey = normalizeHotkey(this.tngCopyButtonHotkey());
      if (hotkey === null) {
        return;
      }

      const ownerDocument = this.hostElement.ownerDocument;
      const listener = (event: KeyboardEvent): void => {
        if (!this.isHostOrChildFocused()) {
          return;
        }

        if (!eventMatchesHotkey(event, hotkey)) {
          return;
        }

        event.preventDefault();
        void this.tryCopy('keyboard');
      };

      ownerDocument.addEventListener('keydown', listener);
      onCleanup(() => ownerDocument.removeEventListener('keydown', listener));
    });

    this.destroyRef.onDestroy((): void => {
      this.clearSuccessResetTimer();
    });
  }

  @HostListener('click', ['$event'])
  protected onHostClick(...args: readonly unknown[]): void {
    const [event] = args;
    if (!(event instanceof Event)) {
      return;
    }

    if (this.isDisabled() && !isNativeButton(this.hostElement)) {
      event.preventDefault();
      event.stopImmediatePropagation();
      return;
    }

    void this.tryCopy('pointer');
  }

  @HostListener('keydown', ['$event'])
  protected onHostKeyDown(...args: readonly unknown[]): void {
    if (isNativeButton(this.hostElement)) {
      return;
    }

    const [event] = args;
    if (!(event instanceof KeyboardEvent)) {
      return;
    }

    if (!isActivationKey(event.key)) {
      return;
    }

    event.preventDefault();
    if (this.isDisabled()) {
      return;
    }

    void this.tryCopy('keyboard');
  }

  public async copy(): Promise<boolean> {
    return this.tryCopy('programmatic');
  }

  private shouldAnnounce(trigger: TngCopyButtonTrigger): boolean {
    const announce = this.tngCopyButtonAnnounce();
    if (announce === false) {
      return false;
    }

    if (announce === true) {
      return true;
    }

    return trigger === 'keyboard';
  }

  private isDisabled(): boolean {
    return this.tngCopyDisabled() || this.tngCopyButtonDisabled();
  }

  private isHostOrChildFocused(): boolean {
    const activeElement = this.hostElement.ownerDocument.activeElement;
    if (!isElement(activeElement)) {
      return false;
    }

    return activeElement === this.hostElement || this.hostElement.contains(activeElement);
  }

  private clearSuccessResetTimer(): void {
    if (this.successResetTimer === null) {
      return;
    }

    clearTimeout(this.successResetTimer);
    this.successResetTimer = null;
  }

  private scheduleSuccessReset(): void {
    this.clearSuccessResetTimer();
    this.successResetTimer = setTimeout((): void => {
      this.status.set('idle');
      this.successResetTimer = null;
    }, this.tngCopyButtonSuccessDurationMs());
  }

  private announce(message: string, trigger: TngCopyButtonTrigger): void {
    if (!this.shouldAnnounce(trigger)) {
      return;
    }

    const normalizedMessage = message.trim();
    if (normalizedMessage.length === 0) {
      return;
    }

    this.tngCopyAnnounced.emit(normalizedMessage);
  }

  private emitError(error: Error, trigger: TngCopyButtonTrigger): void {
    this.status.set('error');
    this.error.set(error);
    this.tngCopyError.emit({ error });
    this.announce(this.tngCopyButtonErrorMessage(), trigger);
  }

  private async doCopy(text: string, trigger: TngCopyButtonTrigger): Promise<boolean> {
    try {
      const method = await writeTngClipboardText(
        text,
        this.hostElement.ownerDocument,
        this.tngCopyButtonFormat(),
      );
      this.status.set('success');
      this.lastCopiedText.set(text);
      this.tngCopied.emit(text);
      this.tngCopySuccess.emit({ text, method });
      this.announce(this.tngCopyButtonSuccessMessage(), trigger);
      this.scheduleSuccessReset();
      return true;
    } catch (error) {
      this.emitError(toCopyError(error), trigger);
      return false;
    } finally {
      this.copying = false;
    }
  }

  private async tryCopy(trigger: TngCopyButtonTrigger): Promise<boolean> {
    if (this.copying) {
      return false;
    }

    if (this.isDisabled()) {
      return false;
    }

    this.clearSuccessResetTimer();
    this.status.set('copying');
    this.error.set(null);
    this.copying = true;

    const resolvedPayload = this.resolvePayload();
    if (resolvedPayload.error !== null) {
      this.emitError(resolvedPayload.error, trigger);
      this.copying = false;
      return false;
    }

    if (resolvedPayload.text === null) {
      this.emitError(
        new Error('No copy payload found. Provide tngCopyButtonText/tngCopyText or target inputs.'),
        trigger,
      );
      this.copying = false;
      return false;
    }

    this.tngCopy.emit({ text: resolvedPayload.text, trigger });
    const result = await this.doCopy(resolvedPayload.text, trigger);
    return result;

    
  }

  private findSourceText(): string | null {
    const configuredTarget = this.tngCopyButtonTarget() ?? this.tngCopyFrom();
    const hasConfiguredTarget =
      configuredTarget !== undefined &&
      configuredTarget !== null &&
      !(typeof configuredTarget === 'string' && configuredTarget.trim().length === 0);

    const sourceElement = resolveSourceElement(configuredTarget, this.hostElement.ownerDocument);
    if (hasConfiguredTarget && sourceElement === null) {
      throw new Error('Copy target was not found.');
    }
    const sourceText =
      sourceElement === null
        ? null
        : extractTextFromSourceElement(sourceElement, this.tngCopyIgnoreSelectors());
    return sourceText;
  }

  private resolvePayload(): { error: Error | null; text: string | null } {
    const explicitTextResult = resolveExplicitText(this.tngCopyButtonText());
    if (explicitTextResult.error !== null) {
      return { error: explicitTextResult.error, text: null };
    }

    const fallbackText = this.tngCopyText();
    const directText =
      explicitTextResult.value !== undefined ? explicitTextResult.value : fallbackText;

    try {
      const sourceText = this.findSourceText();
      return { error: null, text: resolveTngCopyPayload(directText, sourceText) };
    } catch (error) {
      return { error: toCopyError(error), text: null };
    }
  }
}
