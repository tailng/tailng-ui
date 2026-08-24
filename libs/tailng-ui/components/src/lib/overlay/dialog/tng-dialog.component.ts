import {
  afterNextRender,
  booleanAttribute,
  Component,
  ElementRef,
  effect,
  inject,
  Injector,
  input,
  output,
  signal,
  viewChild,
} from '@angular/core';
import type { OnDestroy } from '@angular/core';
import {
  createOverlayScrollLockManager,
  createCssOverlayPresenceDriver,
  createOverlayPresenceController,
  createTngIdFactory,
  getGlobalModalIsolationManager,
  type TngOverlayDismissReason,
} from '@tailng-ui/cdk';
import type { TngOverlayPresenceState } from '@tailng-ui/cdk';
import type {
  TngModalIsolationDocument,
  TngModalIsolationElement,
  TngScrollLockDocument,
} from '@tailng-ui/cdk/overlay';
import { tngOverlayRuntime } from '../tng-overlay-runtime';

const createDialogId = createTngIdFactory('tng-dialog');

const focusableSelector = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(',');

type TngFocusTrapState = Readonly<{
  activeElement: HTMLElement | null;
  first: HTMLElement;
  last: HTMLElement;
  panel: HTMLElement;
}>;

export type TngDialogCloseReason = 'backdrop' | 'close-button' | 'escape' | 'programmatic';

function readKeyboardEvent(event: unknown): KeyboardEvent | null {
  return event instanceof KeyboardEvent ? event : null;
}

function readTabKeyboardEvent(event: unknown): KeyboardEvent | null {
  const keyboardEvent = readKeyboardEvent(event);
  return keyboardEvent?.key === 'Tab' ? keyboardEvent : null;
}

function resolveActiveElement(documentRef: unknown): HTMLElement | null {
  if (!(documentRef instanceof Document)) {
    return null;
  }

  const activeElement = documentRef.activeElement;
  return activeElement instanceof HTMLElement ? activeElement : null;
}

function resolveFocusableElements(container: unknown): readonly HTMLElement[] {
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

function resolveFirstFocusableWithin(container: unknown): HTMLElement | null {
  return resolveFocusableElements(container)[0] ?? null;
}

function resolveMarkedInitialElement(container: unknown): HTMLElement | null {
  if (!(container instanceof HTMLElement)) {
    return null;
  }

  const markedInitial = container.querySelector<HTMLElement>('[data-tng-dialog-initial-focus]');
  if (markedInitial === null) {
    return null;
  }

  if (resolveFocusableElements(container).includes(markedInitial)) {
    return markedInitial;
  }

  return resolveFirstFocusableWithin(markedInitial);
}

function toScrollLockDocument(documentRef: unknown): TngScrollLockDocument | null {
  if (!(documentRef instanceof Document)) {
    return null;
  }

  return documentRef as unknown as TngScrollLockDocument;
}

function toModalIsolationDocument(documentRef: unknown): TngModalIsolationDocument | null {
  if (!(documentRef instanceof Document)) {
    return null;
  }

  return documentRef as unknown as TngModalIsolationDocument;
}

function toModalIsolationElement(elementRef: unknown): TngModalIsolationElement | null {
  if (!(elementRef instanceof HTMLElement)) {
    return null;
  }

  return elementRef as unknown as TngModalIsolationElement;
}

function toDialogCloseReason(reason: TngOverlayDismissReason): TngDialogCloseReason | null {
  if (reason === 'escape-key') {
    return 'escape';
  }

  if (reason === 'outside-pointer') {
    return 'backdrop';
  }

  return null;
}

@Component({
  selector: 'tng-dialog',
  templateUrl: './tng-dialog.component.html',
  styleUrl: './tng-dialog.component.css',
})
export class TngDialogComponent implements OnDestroy {
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

  private readonly documentRef = typeof document === 'undefined' ? null : document;
  private readonly hostRef = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly injector = inject(Injector);
  private readonly backdropRef = viewChild<ElementRef<HTMLElement>>('backdropRef');
  private readonly panelRef = viewChild<ElementRef<HTMLElement>>('panelRef');
  private readonly scrollLock = createOverlayScrollLockManager({
    documentRef: toScrollLockDocument(this.documentRef),
  });
  private readonly modalIsolation = getGlobalModalIsolationManager({
    documentRef: toModalIsolationDocument(this.documentRef),
  });
  private readonly documentKeydownListener = (event: KeyboardEvent): void => {
    this.handleDocumentKeydown(event);
  };
  private readonly instanceId = createDialogId();
  private isActive = false;
  private isLayerRegistered = false;
  private restoreFocusElement: HTMLElement | null = null;
  protected readonly rendered = signal(false);
  protected readonly presenceState = signal<TngOverlayPresenceState>('closed');
  private readonly presence = createOverlayPresenceController({
    driver: createCssOverlayPresenceDriver({
      elements: () => {
        const elements = [this.backdropRef()?.nativeElement, this.panelRef()?.nativeElement];
        return elements.filter((element): element is HTMLElement => element !== undefined);
      },
      windowRef: this.documentRef?.defaultView ?? null,
    }),
    onDismiss: () => this.rendered.set(false),
    onPresent: () => this.rendered.set(true),
    onStateChange: (state) => this.presenceState.set(state),
  });

  private readonly openStateEffect = effect((): void => {
    if (this.open()) {
      this.presence.setOpen(true);
      this.activateDialog();
      return;
    }

    this.deactivateDialog();
    this.presence.setOpen(false);
  });

  public constructor() {
    this.descriptionId = `${this.instanceId}-description`;
    this.panelId = `${this.instanceId}-panel`;
    this.titleId = `${this.instanceId}-title`;
  }

  public close(): void {
    this.requestClose('programmatic');
  }

  public ngOnDestroy(): void {
    this.openStateEffect.destroy();
    this.deactivateDialog();
    this.presence.destroy();
  }

  public onCloseButtonClick(): void {
    this.requestClose('close-button');
  }

  public onBackdropPointerDown(event: PointerEvent): void {
    if (!this.closeOnBackdrop()) {
      return;
    }

    if (!(event.currentTarget instanceof HTMLElement)) {
      return;
    }

    if (event.target !== event.currentTarget) {
      return;
    }

    event.preventDefault();
    this.requestClose('backdrop');
  }

  public onPanelKeydown(event: unknown): void {
    const keyboardEvent = readKeyboardEvent(event);
    if (keyboardEvent === null) {
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
    this.registerOverlayLayer();
    this.restoreFocusElement = resolveActiveElement(this.documentRef);
    this.scrollLock.acquire(this.instanceId);
    this.activateModalIsolation();
    this.addDocumentKeydownListener();
    afterNextRender(
      (): void => {
        this.focusInitialElement();
      },
      { injector: this.injector },
    );
  }

  private deactivateDialog(): void {
    if (!this.isActive) {
      return;
    }

    this.isActive = false;
    this.removeDocumentKeydownListener();
    this.unregisterOverlayLayer();
    this.scrollLock.release(this.instanceId);
    this.deactivateModalIsolation();
    this.restoreFocusElement?.focus();
    this.restoreFocusElement = null;
  }

  private handleOverlayDismiss(reason: TngOverlayDismissReason): void {
    const closeReason = toDialogCloseReason(reason);
    if (closeReason === null) {
      return;
    }

    this.requestClose(closeReason);
  }

  private registerOverlayLayer(): void {
    if (this.isLayerRegistered) {
      return;
    }

    this.isLayerRegistered = true;
    tngOverlayRuntime.registerLayer({
      containsTarget: (target: unknown, path: readonly unknown[]): boolean => {
        const panel = this.panelRef()?.nativeElement;
        if (panel === undefined) {
          return false;
        }

        if (path.includes(panel)) {
          return true;
        }

        return target instanceof Node ? panel.contains(target) : false;
      },
      dismissOnEscape: this.closeOnEscape(),
      dismissOnOutsidePointer: false,
      id: this.instanceId,
      modal: true,
      onDismiss: (reason: TngOverlayDismissReason): void => {
        this.handleOverlayDismiss(reason);
      },
      priority: 100,
    });
  }

  private unregisterOverlayLayer(): void {
    if (!this.isLayerRegistered) {
      return;
    }

    this.isLayerRegistered = false;
    tngOverlayRuntime.unregisterLayer(this.instanceId);
  }

  private activateModalIsolation(): void {
    const hostElement = toModalIsolationElement(this.hostRef.nativeElement);
    if (hostElement === null) {
      return;
    }

    this.modalIsolation.activate(this.instanceId, hostElement);
  }

  private deactivateModalIsolation(): void {
    this.modalIsolation.deactivate(this.instanceId);
  }

  private addDocumentKeydownListener(): void {
    this.documentRef?.addEventListener('keydown', this.documentKeydownListener);
  }

  private removeDocumentKeydownListener(): void {
    this.documentRef?.removeEventListener('keydown', this.documentKeydownListener);
  }

  private handleDocumentKeydown(event: KeyboardEvent): void {
    if (!this.isActive || event.defaultPrevented) {
      return;
    }

    this.trapTabNavigation(event);
  }

  private focusInitialElement(): void {
    const panel = this.panelRef()?.nativeElement;
    if (panel === undefined) {
      return;
    }

    const markedInitial = resolveMarkedInitialElement(panel);
    if (markedInitial !== null) {
      markedInitial.focus();
      return;
    }

    const firstFocusable = resolveFirstFocusableWithin(panel);
    if (firstFocusable !== null) {
      firstFocusable.focus();
      return;
    }

    panel.focus();
  }

  private preventAndFocus(event: unknown, target: unknown): void {
    const keyboardEvent = readKeyboardEvent(event);
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

  private resolveFocusTrapState(panel: unknown): TngFocusTrapState | null {
    if (!(panel instanceof HTMLElement)) {
      return null;
    }

    const focusableElements = resolveFocusableElements(panel);
    const first = focusableElements[0];
    if (first === undefined) {
      return null;
    }

    return {
      activeElement: resolveActiveElement(this.documentRef),
      first,
      last: focusableElements[focusableElements.length - 1] ?? first,
      panel,
    };
  }

  private focusEdgeWhenOutsidePanel(event: unknown, focusState: unknown): boolean {
    const state = focusState as TngFocusTrapState;
    const activeElement = state.activeElement;
    if (activeElement !== null && state.panel.contains(activeElement)) {
      return false;
    }

    const keyboardEvent = readKeyboardEvent(event);
    if (keyboardEvent === null) {
      return true;
    }

    const edge = keyboardEvent.shiftKey ? state.last : state.first;
    this.preventAndFocus(keyboardEvent, edge);
    return true;
  }

  private wrapTabAtEdges(event: unknown, focusState: unknown): void {
    const state = focusState as TngFocusTrapState;
    const keyboardEvent = readKeyboardEvent(event);
    if (keyboardEvent === null) {
      return;
    }

    if (keyboardEvent.shiftKey && state.activeElement === state.first) {
      this.preventAndFocus(keyboardEvent, state.last);
      return;
    }

    if (!keyboardEvent.shiftKey && state.activeElement === state.last) {
      this.preventAndFocus(keyboardEvent, state.first);
    }
  }

  private isFocusTrapActive(): boolean {
    return this.isActive && tngOverlayRuntime.isTopLayer(this.instanceId);
  }

  private trapTabNavigation(event: unknown): void {
    const keyboardEvent = readTabKeyboardEvent(event);
    if (keyboardEvent === null) {
      return;
    }

    if (!this.isFocusTrapActive()) {
      return;
    }

    const panel = this.panelRef()?.nativeElement;
    if (panel === undefined) {
      return;
    }

    const focusState = this.resolveFocusTrapState(panel);
    if (focusState === null) {
      this.preventAndFocus(keyboardEvent, panel);
      return;
    }

    if (this.focusEdgeWhenOutsidePanel(keyboardEvent, focusState)) {
      return;
    }

    this.wrapTabAtEdges(keyboardEvent, focusState);
  }
}
export { TngDialogComponent as TngDialog };
