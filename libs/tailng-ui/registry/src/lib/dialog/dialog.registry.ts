import type { RegistryItem } from '../registry.types';

const dialogPrimitiveTsTemplate = `export type TngDialogCloseReason =
  | 'backdrop'
  | 'close-button'
  | 'escape'
  | 'programmatic';

type TngDialogScrollLockSnapshot = Readonly<{
  overflow: string;
  paddingRight: string;
}>;

export type TngDialogScrollLockDocument = Readonly<{
  body: Readonly<{
    style: CSSStyleDeclaration;
  }>;
  documentElement: Readonly<{
    clientWidth: number;
  }>;
}>;

export type TngDialogScrollLockManager = Readonly<{
  acquire: (ownerId: string) => void;
  release: (ownerId: string) => void;
}>;

const focusableSelector = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(',');

let dialogIdSequence = 0;
const scrollLockOwners = new Set<string>();
let scrollLockSnapshot: TngDialogScrollLockSnapshot | null = null;

function resolveDialogScrollbarWidth(documentRef: TngDialogScrollLockDocument): number {
  if (typeof window === 'undefined') {
    return 0;
  }

  return Math.max(0, window.innerWidth - documentRef.documentElement.clientWidth);
}

export function createDialogId(): string {
  dialogIdSequence += 1;
  return \`tng-dialog-\${dialogIdSequence}\`;
}

export function readDialogEventTarget(event: unknown): Node | null {
  if (!(event instanceof Event)) {
    return null;
  }

  return event.target instanceof Node ? event.target : null;
}

export function readDialogKeyboardEvent(event: unknown): KeyboardEvent | null {
  return event instanceof KeyboardEvent ? event : null;
}

export function resolveDialogActiveElement(documentRef: unknown): HTMLElement | null {
  if (!(documentRef instanceof Document)) {
    return null;
  }

  const activeElement = documentRef.activeElement;
  return activeElement instanceof HTMLElement ? activeElement : null;
}

export function resolveDialogFocusableElements(container: unknown): readonly HTMLElement[] {
  if (!(container instanceof HTMLElement)) {
    return [];
  }

  const candidates = Array.from(container.querySelectorAll<HTMLElement>(focusableSelector));
  const focusableElements: HTMLElement[] = [];
  for (const candidate of candidates) {
    if (!candidate.hasAttribute('disabled')) {
      focusableElements.push(candidate);
    }
  }

  return focusableElements;
}

export function resolveDialogMarkedInitialElement(container: unknown): HTMLElement | null {
  if (!(container instanceof HTMLElement)) {
    return null;
  }

  const markedInitial = container.querySelector<HTMLElement>('[data-tng-dialog-initial-focus]');
  if (markedInitial === null) {
    return null;
  }

  if (resolveDialogFocusableElements(container).includes(markedInitial)) {
    return markedInitial;
  }

  return resolveDialogFocusableElements(markedInitial)[0] ?? null;
}

export function resolveDialogGlobalDocument(): Document | null {
  if (typeof document === 'undefined') {
    return null;
  }

  return document;
}

export function toDialogScrollLockDocument(documentRef: unknown): TngDialogScrollLockDocument | null {
  if (!(documentRef instanceof Document)) {
    return null;
  }

  return documentRef as unknown as TngDialogScrollLockDocument;
}

export function createDialogScrollLockManager(options: {
  documentRef: TngDialogScrollLockDocument | null;
}): TngDialogScrollLockManager {
  const { documentRef } = options;

  return {
    acquire(ownerId: string): void {
      if (documentRef === null || scrollLockOwners.has(ownerId)) {
        return;
      }

      scrollLockOwners.add(ownerId);
      if (scrollLockOwners.size !== 1) {
        return;
      }

      const bodyStyle = documentRef.body.style;
      scrollLockSnapshot = {
        overflow: bodyStyle.overflow,
        paddingRight: bodyStyle.paddingRight,
      };

      bodyStyle.overflow = 'hidden';
      const scrollbarWidth = resolveDialogScrollbarWidth(documentRef);
      if (scrollbarWidth > 0) {
        bodyStyle.paddingRight = scrollbarWidth + 'px';
      }
    },
    release(ownerId: string): void {
      if (documentRef === null || !scrollLockOwners.delete(ownerId)) {
        return;
      }

      if (scrollLockOwners.size > 0) {
        return;
      }

      if (scrollLockSnapshot === null) {
        return;
      }

      const bodyStyle = documentRef.body.style;
      bodyStyle.overflow = scrollLockSnapshot.overflow;
      bodyStyle.paddingRight = scrollLockSnapshot.paddingRight;
      scrollLockSnapshot = null;
    },
  };
}
`;

const dialogComponentTsTemplate = `import {
  afterNextRender,
  booleanAttribute,
  Component,
  effect,
  inject,
  Injector,
  input,
  output,
  viewChild,
} from '@angular/core';
import type { ElementRef, OnDestroy } from '@angular/core';
import {
  createDialogId,
  createDialogScrollLockManager,
  readDialogEventTarget,
  readDialogKeyboardEvent,
  resolveDialogActiveElement,
  resolveDialogFocusableElements,
  resolveDialogGlobalDocument,
  resolveDialogMarkedInitialElement,
  toDialogScrollLockDocument,
  type TngDialogCloseReason,
} from './tng-dialog-primitive';

type TngDialogFocusTrapState = Readonly<{
  activeElement: HTMLElement | null;
  first: HTMLElement;
  last: HTMLElement;
  panel: HTMLElement;
}>;

@Component({
  selector: 'tng-dialog',
  templateUrl: './tng-dialog.html',
  styleUrl: './tng-dialog.css',
})
export class TngDialog implements OnDestroy {
  public readonly closeOnBackdrop = input<boolean, boolean | string>(true, {
    transform: booleanAttribute,
  });
  public readonly closeOnEscape = input<boolean, boolean | string>(true, {
    transform: booleanAttribute,
  });
  public readonly description = input<string | null>(null);
  public readonly open = input<boolean, boolean | string>(false, {
    transform: booleanAttribute,
  });
  public readonly title = input<string>('Dialog');

  public readonly closed = output<TngDialogCloseReason>();
  public readonly openChange = output<boolean>();

  protected readonly descriptionId: string;
  protected readonly panelId: string;
  protected readonly titleId: string;

  private readonly documentRef = resolveDialogGlobalDocument();
  private readonly injector = inject(Injector);
  private readonly panelRef = viewChild<ElementRef<HTMLElement>>('panelRef');
  private readonly scrollLock = createDialogScrollLockManager({
    documentRef: toDialogScrollLockDocument(this.documentRef),
  });
  private readonly instanceId = createDialogId();
  private readonly documentPointerDownListener = (event: unknown): void => {
    this.onDocumentPointerDown(event);
  };
  private isActive = false;
  private listenersAttached = false;
  private restoreFocusElement: HTMLElement | null = null;

  private readonly openStateEffect = effect((): void => {
    if (this.open()) {
      this.activateDialog();
      return;
    }

    this.deactivateDialog();
  });

  public constructor() {
    this.descriptionId = \`\${this.instanceId}-description\`;
    this.panelId = \`\${this.instanceId}-panel\`;
    this.titleId = \`\${this.instanceId}-title\`;
  }

  public close(): void {
    this.requestClose('programmatic');
  }

  public ngOnDestroy(): void {
    this.openStateEffect.destroy();
    this.deactivateDialog();
  }

  public onCloseButtonClick(): void {
    this.requestClose('close-button');
  }

  public onPanelKeydown(event: unknown): void {
    const keyboardEvent = readDialogKeyboardEvent(event);
    if (keyboardEvent === null) {
      return;
    }

    if (keyboardEvent.key === 'Escape') {
      this.handleEscapeKey(event);
      return;
    }

    if (keyboardEvent.key === 'Tab') {
      this.trapTabNavigation(event);
    }
  }

  private activateDialog(): void {
    if (this.isActive) {
      return;
    }

    this.isActive = true;
    this.attachBackdropListener();
    this.restoreFocusElement = resolveDialogActiveElement(this.documentRef);
    this.scrollLock.acquire(this.instanceId);
    afterNextRender(
      (): void => {
        this.focusInitialElement();
      },
      { injector: this.injector },
    );
  }

  private attachBackdropListener(): void {
    if (this.listenersAttached || this.documentRef === null) {
      return;
    }

    this.listenersAttached = true;
    this.documentRef.addEventListener('pointerdown', this.documentPointerDownListener);
  }

  private deactivateDialog(): void {
    if (!this.isActive) {
      return;
    }

    this.isActive = false;
    this.detachBackdropListener();
    this.scrollLock.release(this.instanceId);
    this.restoreFocusElement?.focus();
    this.restoreFocusElement = null;
  }

  private detachBackdropListener(): void {
    if (!this.listenersAttached || this.documentRef === null) {
      return;
    }

    this.listenersAttached = false;
    this.documentRef.removeEventListener('pointerdown', this.documentPointerDownListener);
  }

  private focusInitialElement(): void {
    const panel = this.panelRef()?.nativeElement;
    if (panel === undefined) {
      return;
    }

    const markedInitial = resolveDialogMarkedInitialElement(panel);
    if (markedInitial !== null) {
      markedInitial.focus();
      return;
    }

    const firstFocusable = resolveDialogFocusableElements(panel)[0];
    if (firstFocusable !== undefined) {
      firstFocusable.focus();
      return;
    }

    panel.focus();
  }

  private handleEscapeKey(event: unknown): void {
    const keyboardEvent = readDialogKeyboardEvent(event);
    if (keyboardEvent === null) {
      return;
    }

    if (!this.closeOnEscape()) {
      return;
    }

    keyboardEvent.preventDefault();
    this.requestClose('escape');
  }

  private onDocumentPointerDown(event: unknown): void {
    if (!this.closeOnBackdrop()) {
      return;
    }

    const panel = this.panelRef()?.nativeElement;
    const target = readDialogEventTarget(event);
    if (panel === undefined || target === null) {
      return;
    }

    if (panel.contains(target)) {
      return;
    }

    this.requestClose('backdrop');
  }

  private preventAndFocus(event: unknown, target: unknown): void {
    const keyboardEvent = readDialogKeyboardEvent(event);
    if (keyboardEvent === null || !(target instanceof HTMLElement)) {
      return;
    }

    keyboardEvent.preventDefault();
    target.focus();
  }

  private requestClose(reason: TngDialogCloseReason): void {
    this.closed.emit(reason);
    this.openChange.emit(false);
  }

  private resolveFocusTrapState(panel: unknown): TngDialogFocusTrapState | null {
    if (!(panel instanceof HTMLElement)) {
      return null;
    }

    const focusableElements = resolveDialogFocusableElements(panel);
    const first = focusableElements[0];
    if (first === undefined) {
      return null;
    }

    return {
      activeElement: resolveDialogActiveElement(this.documentRef),
      first,
      last: focusableElements[focusableElements.length - 1] ?? first,
      panel,
    };
  }

  private focusEdgeWhenOutsidePanel(event: unknown, focusState: TngDialogFocusTrapState): boolean {
    const activeElement = focusState.activeElement;
    if (activeElement !== null && focusState.panel.contains(activeElement)) {
      return false;
    }

    const keyboardEvent = readDialogKeyboardEvent(event);
    if (keyboardEvent === null) {
      return true;
    }

    const edge = keyboardEvent.shiftKey ? focusState.last : focusState.first;
    this.preventAndFocus(keyboardEvent, edge);
    return true;
  }

  private wrapTabAtEdges(event: unknown, focusState: TngDialogFocusTrapState): void {
    const keyboardEvent = readDialogKeyboardEvent(event);
    if (keyboardEvent === null) {
      return;
    }

    if (keyboardEvent.shiftKey && focusState.activeElement === focusState.first) {
      this.preventAndFocus(keyboardEvent, focusState.last);
      return;
    }

    if (!keyboardEvent.shiftKey && focusState.activeElement === focusState.last) {
      this.preventAndFocus(keyboardEvent, focusState.first);
    }
  }

  private trapTabNavigation(event: unknown): void {
    const panel = this.panelRef()?.nativeElement;
    if (panel === undefined) {
      return;
    }

    const focusState = this.resolveFocusTrapState(panel);
    if (focusState === null) {
      this.preventAndFocus(event, panel);
      return;
    }

    if (this.focusEdgeWhenOutsidePanel(event, focusState)) {
      return;
    }

    this.wrapTabAtEdges(event, focusState);
  }
}
`;

const dialogTemplateHtml = `@if (open()) {
  <div class="tng-dialog-backdrop">
    <section
      #panelRef
      [id]="panelId"
      role="dialog"
      aria-modal="true"
      class="tng-dialog-panel"
      [attr.aria-labelledby]="titleId"
      [attr.aria-describedby]="description() ? descriptionId : null"
      tabindex="-1"
      (keydown)="onPanelKeydown($event)"
    >
      <header class="tng-dialog-header">
        <div class="tng-dialog-heading">
          <h2 [id]="titleId" class="tng-dialog-title">{{ title() }}</h2>
          @if (description()) {
            <p [id]="descriptionId" class="tng-dialog-description">{{ description() }}</p>
          }
        </div>

        <button type="button" class="tng-dialog-close" aria-label="Close dialog" (click)="onCloseButtonClick()">
          ×
        </button>
      </header>

      <div class="tng-dialog-content" data-slot="dialog-content">
        <ng-content />
      </div>
    </section>
  </div>
}
`;

const dialogTemplateCss = `:host {
  display: contents;
}

.tng-dialog-backdrop {
  align-items: center;
  background: rgb(2 6 23 / 72%);
  display: flex;
  inset: 0;
  justify-content: center;
  padding: 1rem;
  position: fixed;
  z-index: 70;
}

.tng-dialog-panel {
  background: var(--tng-semantic-background-surface, #ffffff);
  border: 1px solid var(--tng-semantic-border-strong, #64748b);
  border-radius: 1rem;
  box-shadow: 0 20px 45px rgb(15 23 42 / 35%);
  color: var(--tng-semantic-foreground-primary, #0f172a);
  display: grid;
  gap: 1rem;
  height: var(--tng-dialog-height, auto);
  max-height: calc(100vh - 2rem);
  overflow: auto;
  width: min(92vw, var(--tng-dialog-width, 34rem));
}

.tng-dialog-header {
  align-items: flex-start;
  display: flex;
  gap: 1rem;
  justify-content: space-between;
  padding: 1.2rem 1.2rem 0;
}

.tng-dialog-heading {
  display: grid;
  gap: 0.35rem;
}

.tng-dialog-title {
  font-size: 1.1rem;
  font-weight: 700;
  line-height: 1.3;
  margin: 0;
}

.tng-dialog-description {
  color: var(--tng-semantic-foreground-muted, #475569);
  font-size: 0.92rem;
  line-height: 1.4;
  margin: 0;
}

.tng-dialog-close {
  align-items: center;
  appearance: none;
  background: transparent;
  border: 1px solid var(--tng-semantic-border-strong, #64748b);
  border-radius: 999px;
  color: inherit;
  cursor: pointer;
  display: inline-flex;
  flex: 0 0 auto;
  font-size: 1.2rem;
  height: 2rem;
  justify-content: center;
  line-height: 1;
  width: 2rem;
}

.tng-dialog-close:focus-visible {
  box-shadow: 0 0 0 3px var(--tng-semantic-focus-ring, #60a5fa);
  outline: none;
}

.tng-dialog-content {
  display: grid;
  gap: 1rem;
  padding: 0 1.2rem 1.2rem;
}
`;

const dialogIndexTsTemplate = `export * from './tng-dialog';
export * from './tng-dialog-primitive';
`;

export const dialogRegistryItem = {
  dependencies: [],
  description: 'Shadcn-style source files for dialog wrappers and helpers.',
  install: {
    importPath: './tailng-ui/dialog',
    importSymbols: ['TngDialog'],
  },
  files: [
    {
      content: dialogPrimitiveTsTemplate,
      path: 'src/app/tailng-ui/dialog/tng-dialog-primitive.ts',
    },
    {
      content: dialogComponentTsTemplate,
      path: 'src/app/tailng-ui/dialog/tng-dialog.ts',
    },
    {
      content: dialogTemplateHtml,
      path: 'src/app/tailng-ui/dialog/tng-dialog.html',
    },
    {
      content: dialogTemplateCss,
      path: 'src/app/tailng-ui/dialog/tng-dialog.css',
    },
    {
      content: dialogIndexTsTemplate,
      path: 'src/app/tailng-ui/dialog/index.ts',
    },
  ],
  name: 'dialog',
} satisfies RegistryItem;
