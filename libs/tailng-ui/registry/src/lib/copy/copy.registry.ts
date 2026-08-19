import type { RegistryItem } from '../registry.types';

const copyPrimitiveTsTemplate = `import {
  Directive,
  ElementRef,
  HostBinding,
  HostListener,
  booleanAttribute,
  inject,
  input,
  output,
} from '@angular/core';
import type { ElementRef as NgElementRef } from '@angular/core';

type TngCopyFromTarget = NgElementRef<HTMLElement> | HTMLElement | string | null | undefined;
type TngCopyIgnoreSelectorsInput = readonly string[] | string | null | undefined;

const defaultTngCopyIgnoreSelectors: readonly string[] = Object.freeze([
  '[data-copy-ignore]',
  '.line-no',
  '.line-number',
  '.line-numbers',
]);

function hasNonEmptyText(value: string): boolean {
  return value.trim().length > 0;
}

function dedupeSelectors(selectors: readonly string[]): readonly string[] {
  return [...new Set(selectors)];
}

function normalizeSelectorFromArray(value: readonly string[]): readonly string[] {
  return dedupeSelectors(
    value
      .map((selector) => selector.trim())
      .filter((selector) => selector.length > 0),
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

function isElementRefTarget(value: unknown): value is NgElementRef<HTMLElement> {
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

function extractTextFromSourceElement(sourceElement: unknown, ignoreSelectors: readonly string[]): string {
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

  body.appendChild(textarea);
  textarea.focus();
  textarea.select();

  try {
    return ownerDocument.execCommand('copy');
  } finally {
    body.removeChild(textarea);
  }
}

function normalizeTngCopyIgnoreSelectors(value: TngCopyIgnoreSelectorsInput): readonly string[] {
  if (value === undefined || value === null) {
    return defaultTngCopyIgnoreSelectors;
  }

  if (typeof value === 'string') {
    return normalizeSelectorFromString(value);
  }

  return normalizeSelectorFromArray(value);
}

function resolveTngCopyPayload(
  directText: string | null | undefined,
  sourceText: string | null,
): string | null {
  if (directText !== null && directText !== undefined && hasNonEmptyText(directText)) {
    return directText;
  }

  if (sourceText !== null && hasNonEmptyText(sourceText)) {
    return sourceText;
  }

  return null;
}

async function writeTngClipboardText(text: string, ownerDocument: unknown): Promise<void> {
  const clipboardApi = globalThis.navigator?.clipboard;
  if (clipboardApi !== undefined && typeof clipboardApi.writeText === 'function') {
    await clipboardApi.writeText(text);
    return;
  }

  const didCopy = copyWithExecCommand(text, ownerDocument);
  if (didCopy) {
    return;
  }

  throw new Error('Clipboard API is not available in this environment.');
}

@Directive({
  selector: '[tngCopy]',
  exportAs: 'tngCopy',
})
export class TngCopyPrimitive {
  public readonly tngCopy = input<string | null | undefined>(undefined);
  public readonly tngCopyDisabled = input<boolean, boolean | string>(false, {
    transform: booleanAttribute,
  });
  public readonly tngCopied = output<string>();
  public readonly tngCopyError = output<Error>();
  public readonly tngCopyFrom = input<TngCopyFromTarget>(null);
  public readonly tngCopyIgnoreSelectors = input<readonly string[], TngCopyIgnoreSelectorsInput>(
    defaultTngCopyIgnoreSelectors,
    {
      transform: normalizeTngCopyIgnoreSelectors,
    },
  );
  public readonly tngCopyText = input<string | null | undefined>(undefined);

  private readonly hostElement = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;

  @HostBinding('attr.data-copy-disabled')
  protected get dataCopyDisabledAttr(): '' | null {
    return this.tngCopyDisabled() ? '' : null;
  }

  @HostListener('click', ['$event'])
  protected onHostClick(...args: readonly unknown[]): void {
    const [event] = args;
    if (!(event instanceof Event)) {
      return;
    }

    if (this.tngCopyDisabled()) {
      event.preventDefault();
      event.stopImmediatePropagation();
      return;
    }

    void this.copy();
  }

  public async copy(): Promise<boolean> {
    if (this.tngCopyDisabled()) {
      return false;
    }

    const payload = this.resolvePayload();
    if (payload === null) {
      this.tngCopyError.emit(
        new Error('No copy payload found. Provide tngCopyText or tngCopyFrom.'),
      );
      return false;
    }

    try {
      await writeTngClipboardText(payload, this.hostElement.ownerDocument);
      this.tngCopied.emit(payload);
      return true;
    } catch (error) {
      this.tngCopyError.emit(toCopyError(error));
      return false;
    }
  }

  private resolvePayload(): string | null {
    const sourceElement = resolveSourceElement(this.tngCopyFrom(), this.hostElement.ownerDocument);
    const sourceText =
      sourceElement === null
        ? null
        : extractTextFromSourceElement(sourceElement, this.tngCopyIgnoreSelectors());

    const inputText = this.tngCopyText() ?? this.tngCopy();
    return resolveTngCopyPayload(inputText, sourceText);
  }
}
`;

const copyButtonComponentTsTemplate = `import {
  booleanAttribute,
  Component,
  computed,
  input,
  output,
  signal,
  type OnDestroy,
} from '@angular/core';
import { TngCopyPrimitive } from './tng-copy-primitive';
import type { TngCopyFromTarget, TngCopyIgnoreSelectorsInput } from './tng-copy-primitive';

const defaultResetDelay = 1500;

type TngCopyButtonState = 'copied' | 'copying' | 'error' | 'idle';
type TngCopyButtonAppearance = 'ghost' | 'outline' | 'solid';
type TngCopyButtonSize = 'md' | 'sm';

function toRoundedPositiveNumber(value: number): number {
  return Math.max(0, Math.round(value));
}

function coerceTngCopyButtonResetDelay(value: number | string): number {
  const numericValue = typeof value === 'number' ? value : Number(value);
  if (!Number.isFinite(numericValue)) {
    return defaultResetDelay;
  }

  return toRoundedPositiveNumber(numericValue);
}

@Component({
  selector: 'tng-copy-button',
  imports: [TngCopyPrimitive],
  templateUrl: './tng-copy-button.html',
  styleUrl: './tng-copy-button.css',
})
export class TngCopyButton implements OnDestroy {
  public readonly appearance = input<TngCopyButtonAppearance>('outline');
  public readonly copyLabel = input<string>('Copy');
  public readonly copiedLabel = input<string>('Copied');
  public readonly copyingLabel = input<string>('Copying...');
  public readonly disabled = input<boolean, boolean | string>(false, {
    transform: booleanAttribute,
  });
  public readonly errorLabel = input<string>('Copy failed');
  public readonly from = input<TngCopyFromTarget>(null);
  public readonly ignoreSelectors = input<TngCopyIgnoreSelectorsInput>(null);
  public readonly resetDelay = input<number, number | string>(defaultResetDelay, {
    transform: coerceTngCopyButtonResetDelay,
  });
  public readonly size = input<TngCopyButtonSize>('md');
  public readonly text = input<string | null | undefined>(undefined);

  public readonly tngCopied = output<string>();
  public readonly tngCopyError = output<Error>();

  protected readonly liveMessage = computed((): string => {
    const state = this.state();
    if (state === 'copied') {
      return this.copiedLabel();
    }

    if (state === 'error') {
      return this.errorLabel();
    }

    return '';
  });

  protected readonly label = computed((): string => {
    const state = this.state();
    if (state === 'copying') {
      return this.copyingLabel();
    }

    if (state === 'copied') {
      return this.copiedLabel();
    }

    if (state === 'error') {
      return this.errorLabel();
    }

    return this.copyLabel();
  });

  protected readonly state = signal<TngCopyButtonState>('idle');

  private resetTimer: ReturnType<typeof setTimeout> | null = null;

  public ngOnDestroy(): void {
    this.clearResetTimer();
  }

  protected onHostClick(): void {
    if (this.disabled()) {
      return;
    }

    this.state.set('copying');
  }

  protected onPrimitiveCopied(payload: string): void {
    this.state.set('copied');
    this.tngCopied.emit(payload);
    this.scheduleReset();
  }

  protected onPrimitiveCopyError(...args: readonly unknown[]): void {
    const [error] = args;
    const normalizedError = error instanceof Error ? error : new Error('Copy failed.');
    this.state.set('error');
    this.tngCopyError.emit(normalizedError);
    this.scheduleReset();
  }

  private clearResetTimer(): void {
    if (this.resetTimer === null) {
      return;
    }

    clearTimeout(this.resetTimer);
    this.resetTimer = null;
  }

  private scheduleReset(): void {
    this.clearResetTimer();
    this.resetTimer = setTimeout((): void => {
      this.state.set('idle');
      this.resetTimer = null;
    }, this.resetDelay());
  }
}
`;

const copyButtonTemplateHtml = `<button
  tngCopy
  class="tng-copy-button"
  type="button"
  [disabled]="disabled()"
  [tngCopyText]="text()"
  [tngCopyFrom]="from()"
  [tngCopyIgnoreSelectors]="ignoreSelectors()"
  [tngCopyDisabled]="disabled()"
  [attr.data-appearance]="appearance()"
  [attr.data-size]="size()"
  [attr.data-state]="state()"
  (click)="onHostClick()"
  (tngCopied)="onPrimitiveCopied($event)"
  (tngCopyError)="onPrimitiveCopyError($event)"
>
  {{ label() }}
</button>

<span class="tng-copy-live-region" aria-live="polite">{{ liveMessage() }}</span>
`;

const copyButtonTemplateCss = `:host {
  display: inline-flex;
}

.tng-copy-button {
  align-items: center;
  appearance: none;
  border: 1px solid transparent;
  border-radius: 0.6rem;
  cursor: pointer;
  display: inline-flex;
  font-family: inherit;
  font-size: 0.875rem;
  font-weight: 600;
  justify-content: center;
  line-height: 1;
  transition: background-color 120ms ease, border-color 120ms ease, color 120ms ease, opacity 120ms ease;
}

.tng-copy-button[data-size='sm'] {
  min-height: 2rem;
  padding: 0 0.75rem;
}

.tng-copy-button[data-size='md'] {
  min-height: 2.5rem;
  padding: 0 1rem;
}

.tng-copy-button[data-appearance='solid'] {
  background: var(--tng-semantic-accent-brand, #2563eb);
  color: var(--tng-semantic-foreground-inverse, #f8fafc);
}

.tng-copy-button[data-appearance='outline'] {
  background: transparent;
  border-color: var(--tng-semantic-border-strong, #64748b);
  color: var(--tng-semantic-foreground-primary, #0f172a);
}

.tng-copy-button[data-appearance='ghost'] {
  background: transparent;
  color: var(--tng-semantic-foreground-primary, #0f172a);
}

.tng-copy-button[data-state='copied'] {
  background: var(--tng-semantic-accent-success, #16a34a);
  border-color: transparent;
  color: var(--tng-semantic-foreground-inverse, #f8fafc);
}

.tng-copy-button[data-state='error'] {
  background: var(--tng-semantic-accent-danger, #dc2626);
  border-color: transparent;
  color: var(--tng-semantic-foreground-inverse, #f8fafc);
}

.tng-copy-button:focus-visible {
  box-shadow: 0 0 0 3px var(--tng-semantic-focus-ring, #60a5fa);
  outline: none;
}

.tng-copy-button:disabled,
.tng-copy-button[data-copy-disabled] {
  cursor: not-allowed;
  opacity: 0.55;
}

.tng-copy-live-region {
  border: 0;
  clip: rect(0 0 0 0);
  clip-path: inset(50%);
  height: 1px;
  margin: -1px;
  overflow: hidden;
  padding: 0;
  position: absolute;
  white-space: nowrap;
  width: 1px;
}
`;

const copyIndexTsTemplate = `export * from './tng-copy-button';
export { TngCopyButton as TngCopy } from './tng-copy-button';
export * from './tng-copy-primitive';
`;

export const copyRegistryItem = {
  dependencies: [],
  description: 'Shadcn-style source files for copy primitive and copy button wrapper.',
  install: {
    importPath: './tailng-ui/copy',
    importSymbols: ['TngCopyButton', 'TngCopyPrimitive'],
  },
  files: [
    {
      content: copyPrimitiveTsTemplate,
      path: 'src/app/tailng-ui/copy/tng-copy-primitive.ts',
    },
    {
      content: copyButtonComponentTsTemplate,
      path: 'src/app/tailng-ui/copy/tng-copy-button.ts',
    },
    {
      content: copyButtonTemplateHtml,
      path: 'src/app/tailng-ui/copy/tng-copy-button.html',
    },
    {
      content: copyButtonTemplateCss,
      path: 'src/app/tailng-ui/copy/tng-copy-button.css',
    },
    {
      content: copyIndexTsTemplate,
      path: 'src/app/tailng-ui/copy/index.ts',
    },
  ],
  name: 'copy',
} satisfies RegistryItem;
