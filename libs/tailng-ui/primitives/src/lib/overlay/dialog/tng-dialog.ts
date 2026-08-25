import {
  Directive,
  ElementRef,
  HostBinding,
  HostListener,
  OnDestroy,
  OnInit,
  afterNextRender,
  booleanAttribute,
  effect,
  inject,
  Injector,
  input,
  output,
  signal,
} from '@angular/core';
import {
  createOverlayFocusHandoffController,
  getGlobalModalIsolationManager,
  createOverlayScrollLockManager,
  resolveFirstFocusableElement,
  resolveFocusableElements,
  createTngIdFactory,
} from '@tailng-ui/cdk';
import type {
  TngModalIsolationDocument,
  TngModalIsolationElement,
  TngOverlayDismissReason,
  TngScrollLockDocument,
} from '@tailng-ui/cdk/overlay';
import { tngPrimitiveOverlayRuntime } from '../tng-overlay-runtime';

const createDialogId = createTngIdFactory('tng-dialog');
const createDialogPanelId = createTngIdFactory('tng-dialog-panel');
const createDialogTitleId = createTngIdFactory('tng-dialog-title');
const createDialogDescriptionId = createTngIdFactory('tng-dialog-description');
const createDialogFocusableId = createTngIdFactory('tng-dialog-focusable');

export type TngDialogAutoFocus = 'dialog' | 'first-focusable' | 'none';
export type TngDialogCloseReason = 'backdrop' | 'close-button' | 'escape' | 'programmatic';

type OptionalBooleanInput = boolean | null | string | undefined;

function normalizeOptionalBooleanInput(value: OptionalBooleanInput): boolean | undefined {
  if (value === null || value === undefined) {
    return undefined;
  }

  return booleanAttribute(value);
}

function toScrollLockDocument(documentRef: unknown): TngScrollLockDocument | null {
  if (typeof Document === 'undefined' || !(documentRef instanceof Document)) {
    return null;
  }

  return documentRef as unknown as TngScrollLockDocument;
}

function toModalIsolationDocument(documentRef: unknown): TngModalIsolationDocument | null {
  if (typeof Document === 'undefined' || !(documentRef instanceof Document)) {
    return null;
  }

  return documentRef as unknown as TngModalIsolationDocument;
}

function toModalIsolationElement(elementRef: unknown): TngModalIsolationElement | null {
  if (typeof HTMLElement === 'undefined' || !(elementRef instanceof HTMLElement)) {
    return null;
  }

  return elementRef as unknown as TngModalIsolationElement;
}

function mapOverlayDismissReason(reason: TngOverlayDismissReason): TngDialogCloseReason {
  if (reason === 'escape-key') {
    return 'escape';
  }

  if (reason === 'outside-pointer') {
    return 'backdrop';
  }

  return 'programmatic';
}

const dialogGlobalDocument = typeof document === 'undefined' ? null : document;
const dialogModalIsolation = getGlobalModalIsolationManager({
  documentRef: toModalIsolationDocument(dialogGlobalDocument),
});
const dialogFocusHandoff = createOverlayFocusHandoffController();

export function resolveTngDialogActiveElement(documentRef: unknown): HTMLElement | null {
  if (typeof Document === 'undefined' || !(documentRef instanceof Document)) {
    return null;
  }

  const activeElement = documentRef.activeElement;
  return typeof HTMLElement !== 'undefined' && activeElement instanceof HTMLElement
    ? activeElement
    : null;
}

export function resolveTngDialogFocusableElements(container: unknown): readonly HTMLElement[] {
  return resolveFocusableElements(container);
}

export function resolveTngDialogMarkedInitialElement(container: unknown): HTMLElement | null {
  if (typeof HTMLElement === 'undefined' || !(container instanceof HTMLElement)) {
    return null;
  }

  const markedInitial = container.querySelector<HTMLElement>('[data-tng-dialog-initial-focus]');
  if (markedInitial === null) {
    return null;
  }

  if (resolveTngDialogFocusableElements(container).includes(markedInitial)) {
    return markedInitial;
  }

  return resolveTngDialogFocusableElements(markedInitial)[0] ?? null;
}

function readKeyboardEvent(event: unknown): KeyboardEvent | null {
  return event instanceof KeyboardEvent ? event : null;
}

function resolveFirstFocusableWithin(container: unknown): HTMLElement | null {
  return resolveFirstFocusableElement(container);
}

function isDialogCloseReason(value: string): value is TngDialogCloseReason {
  return value === 'backdrop' || value === 'close-button' || value === 'escape' || value === 'programmatic';
}

@Directive({
  selector: '[tngDialog]',
  exportAs: 'tngDialog',
})
export class TngDialog implements OnDestroy, OnInit {
  public readonly openInput = input<boolean | undefined, OptionalBooleanInput>(undefined, {
    alias: 'open',
    transform: normalizeOptionalBooleanInput,
  });
  public readonly defaultOpen = input<boolean, OptionalBooleanInput>(false, {
    transform: booleanAttribute,
  });
  public readonly disabled = input<boolean, OptionalBooleanInput>(false, {
    transform: booleanAttribute,
  });
  public readonly dismissible = input<boolean, OptionalBooleanInput>(true, {
    transform: booleanAttribute,
  });
  public readonly closeOnBackdropClick = input<boolean, OptionalBooleanInput>(true, {
    transform: booleanAttribute,
  });
  public readonly closeOnEscape = input<boolean, OptionalBooleanInput>(true, {
    transform: booleanAttribute,
  });
  public readonly restoreFocus = input<boolean, OptionalBooleanInput>(true, {
    transform: booleanAttribute,
  });
  public readonly autoFocus = input<TngDialogAutoFocus, TngDialogAutoFocus | string>('first-focusable', {
    transform: (value: TngDialogAutoFocus | string): TngDialogAutoFocus => {
      return value === 'none' || value === 'dialog' || value === 'first-focusable'
        ? value
        : 'first-focusable';
    },
  });
  public readonly trapFocus = input<boolean, OptionalBooleanInput>(true, {
    transform: booleanAttribute,
  });
  public readonly lockScroll = input<boolean, OptionalBooleanInput>(true, {
    transform: booleanAttribute,
  });
  public readonly ariaLabel = input<string | null>(null);
  public readonly ariaLabelledby = input<string | null>(null);
  public readonly ariaDescribedby = input<string | null>(null);

  public readonly openChange = output<boolean>();
  public readonly closed = output<TngDialogCloseReason>();

  private readonly hostRef = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly documentRef = dialogGlobalDocument;
  private readonly injector = inject(Injector);
  private readonly instanceId = createDialogId();
  private readonly scrollLock = createOverlayScrollLockManager({
    documentRef: toScrollLockDocument(this.documentRef),
  });
  private readonly documentKeydownListener = (event: KeyboardEvent): void => {
    this.handleDocumentKeydown(event);
  };

  private readonly uncontrolledOpen = signal(false);
  private readonly openStateEffect = effect((): void => {
    if (!this.initialized) {
      return;
    }

    if (this.isOpen()) {
      this.activateDialog();
      return;
    }

    this.deactivateDialog();
  });

  private initialized = false;
  private isActive = false;
  private isFocusLayerRegistered = false;
  private isOverlayLayerRegistered = false;
  private panelElement: HTMLElement | null = null;
  private panelElementId: string | null = null;
  private registeredTitleId: string | null = null;
  private registeredDescriptionId: string | null = null;

  @HostBinding('attr.data-slot')
  protected readonly dataSlot = 'dialog';

  @HostBinding('attr.data-open')
  protected get dataOpenAttr(): 'false' | 'true' {
    return this.isOpen() ? 'true' : 'false';
  }

  @HostBinding('attr.data-state')
  protected get dataStateAttr(): 'closed' | 'open' {
    return this.isOpen() ? 'open' : 'closed';
  }

  @HostBinding('attr.data-disabled')
  protected get dataDisabledAttr(): '' | null {
    return this.disabled() ? '' : null;
  }

  public ngOnInit(): void {
    if (!this.isControlled()) {
      this.uncontrolledOpen.set(this.defaultOpen());
    }

    this.initialized = true;
    if (this.isOpen()) {
      this.activateDialog();
    }
  }

  public ngOnDestroy(): void {
    this.openStateEffect.destroy();
    this.deactivateDialog();
    this.unregisterFocusLayer();
  }

  public isOpen(): boolean {
    return this.openInput() ?? this.uncontrolledOpen();
  }

  public openDialog(): void {
    if (this.disabled()) {
      return;
    }

    this.setOpenState(true);
  }

  public closeDialog(reason: TngDialogCloseReason = 'programmatic'): void {
    this.requestClose(reason);
  }

  public toggleDialog(force?: boolean): void {
    if (force !== undefined) {
      if (force) {
        this.openDialog();
        return;
      }

      this.closeDialog('programmatic');
      return;
    }

    if (this.isOpen()) {
      this.closeDialog('programmatic');
      return;
    }

    this.openDialog();
  }

  public requestClose(reason: TngDialogCloseReason): void {
    if (!this.isOpen()) {
      return;
    }

    this.closed.emit(reason);
    this.setOpenState(false);
  }

  public registerPanel(panel: HTMLElement, id: string): void {
    this.panelElement = panel;
    this.panelElementId = id;
  }

  public unregisterPanel(panel: HTMLElement): void {
    if (this.panelElement === panel) {
      this.panelElement = null;
      this.panelElementId = null;
    }
  }

  public registerTitle(id: string): void {
    this.registeredTitleId = id;
  }

  public unregisterTitle(id: string): void {
    if (this.registeredTitleId === id) {
      this.registeredTitleId = null;
    }
  }

  public registerDescription(id: string): void {
    this.registeredDescriptionId = id;
  }

  public unregisterDescription(id: string): void {
    if (this.registeredDescriptionId === id) {
      this.registeredDescriptionId = null;
    }
  }

  public getPanelId(): string | null {
    return this.panelElementId;
  }

  public resolveAriaLabelledby(): string | null {
    const explicit = this.ariaLabelledby()?.trim() ?? '';
    if (explicit.length > 0) {
      return explicit;
    }

    return this.registeredTitleId;
  }

  public resolveAriaDescribedby(): string | null {
    const explicit = this.ariaDescribedby()?.trim() ?? '';
    if (explicit.length > 0) {
      return explicit;
    }

    return this.registeredDescriptionId;
  }

  public onBackdropPointerDown(event: PointerEvent): void {
    if (!this.shouldCloseFromBackdrop()) {
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

  public trapTabNavigation(event: unknown): void {
    if (!this.trapFocus()) {
      return;
    }

    const keyboardEvent = readKeyboardEvent(event);
    if (keyboardEvent === null || keyboardEvent.key !== 'Tab') {
      return;
    }

    const panel = this.panelElement;
    if (panel === null) {
      return;
    }

    if (!dialogFocusHandoff.isTrapActive(this.instanceId)) {
      return;
    }

    const focusableMemberIds = this.resolveFocusableMemberIds(panel);
    const firstMemberId = focusableMemberIds[0];
    if (firstMemberId === undefined) {
      keyboardEvent.preventDefault();
      panel.focus();
      return;
    }
    const lastMemberId = focusableMemberIds[focusableMemberIds.length - 1] ?? firstMemberId;

    const activeElement = resolveTngDialogActiveElement(this.documentRef);
    const activeElementId = activeElement === null ? null : this.ensureElementId(activeElement);

    let candidateId: string | null = null;
    if (activeElement === null || !panel.contains(activeElement)) {
      candidateId = keyboardEvent.shiftKey ? lastMemberId : firstMemberId;
    } else if (activeElementId === firstMemberId && keyboardEvent.shiftKey) {
      candidateId = lastMemberId;
    } else if (activeElementId === lastMemberId && !keyboardEvent.shiftKey) {
      candidateId = firstMemberId;
    } else {
      if (activeElementId !== null) {
        dialogFocusHandoff.recordFocus(this.instanceId, activeElementId);
      }

      return;
    }

    const resolvedId = dialogFocusHandoff.resolveFocusCandidate(this.instanceId, candidateId);
    if (resolvedId === null) {
      return;
    }

    const nextFocusTarget = this.resolveElementById(resolvedId);
    if (nextFocusTarget === null) {
      return;
    }

    keyboardEvent.preventDefault();
    nextFocusTarget.focus();
    dialogFocusHandoff.recordFocus(this.instanceId, resolvedId);
  }

  public recordFocusedElement(target: unknown): void {
    if (!(target instanceof HTMLElement) || !this.isOpen()) {
      return;
    }

    const panel = this.panelElement;
    if (panel === null || !panel.contains(target)) {
      return;
    }

    const targetId = this.ensureElementId(target);
    dialogFocusHandoff.recordFocus(this.instanceId, targetId);
  }

  private activateDialog(): void {
    if (this.isActive) {
      return;
    }

    this.isActive = true;

    if (this.lockScroll()) {
      this.scrollLock.acquire(this.instanceId);
    }

    this.registerFocusLayer();
    this.activateFocusLayer();
    this.registerOverlayLayer();
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

    if (this.lockScroll()) {
      this.scrollLock.release(this.instanceId);
    }

    this.removeDocumentKeydownListener();
    this.deactivateModalIsolation();
    this.deactivateFocusLayer();
    this.unregisterFocusLayer();
    this.unregisterOverlayLayer();
  }

  private focusInitialElement(): void {
    if (!this.isOpen()) {
      return;
    }

    const panel = this.panelElement;
    if (panel === null) {
      return;
    }

    if (this.autoFocus() === 'none') {
      return;
    }

    if (this.autoFocus() === 'dialog') {
      panel.focus();
      return;
    }

    const markedInitial = resolveTngDialogMarkedInitialElement(panel);
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

  private isControlled(): boolean {
    return this.openInput() !== undefined;
  }

  private setOpenState(nextOpen: boolean): void {
    if (nextOpen && this.disabled()) {
      return;
    }

    if (this.isOpen() === nextOpen) {
      return;
    }

    if (!this.isControlled()) {
      this.uncontrolledOpen.set(nextOpen);
    }

    this.openChange.emit(nextOpen);
  }

  private shouldCloseFromBackdrop(): boolean {
    return this.isOpen() && this.dismissible() && this.closeOnBackdropClick();
  }

  private shouldCloseFromEscape(): boolean {
    return this.isOpen() && this.dismissible() && this.closeOnEscape();
  }

  private activateModalIsolation(): void {
    const hostElement = toModalIsolationElement(this.hostRef.nativeElement);
    if (hostElement === null) {
      return;
    }

    dialogModalIsolation.activate(this.instanceId, hostElement);
  }

  private deactivateModalIsolation(): void {
    dialogModalIsolation.deactivate(this.instanceId);
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

  private registerOverlayLayer(): void {
    const hostElement = this.hostRef.nativeElement;
    tngPrimitiveOverlayRuntime.registerLayer({
      containsTarget: (target: unknown, path: readonly unknown[]): boolean => {
        if (target instanceof Node && hostElement.contains(target)) {
          return true;
        }

        return path.includes(hostElement);
      },
      dismissOnEscape: this.shouldCloseFromEscape(),
      dismissOnOutsidePointer: false,
      id: this.instanceId,
      modal: true,
      onDismiss: (reason: TngOverlayDismissReason): void => {
        if (reason === 'escape-key' && !this.shouldCloseFromEscape()) {
          return;
        }

        if (reason === 'outside-pointer' && !this.shouldCloseFromBackdrop()) {
          return;
        }

        this.requestClose(mapOverlayDismissReason(reason));
      },
    });

    this.isOverlayLayerRegistered = true;
  }

  private unregisterOverlayLayer(): void {
    if (!this.isOverlayLayerRegistered) {
      return;
    }

    tngPrimitiveOverlayRuntime.unregisterLayer(this.instanceId);
    this.isOverlayLayerRegistered = false;
  }

  private activateFocusLayer(): void {
    const activeElement = resolveTngDialogActiveElement(this.documentRef);
    const restoreFocusTargetId = activeElement === null ? null : this.ensureElementId(activeElement);
    dialogFocusHandoff.activateLayer(this.instanceId, restoreFocusTargetId);
  }

  private deactivateFocusLayer(): void {
    const restoreFocusTargetId = dialogFocusHandoff.deactivateLayer(this.instanceId);
    if (!this.restoreFocus() || restoreFocusTargetId === null) {
      return;
    }

    const restoreFocusTarget = this.resolveElementById(restoreFocusTargetId);
    restoreFocusTarget?.focus();
  }

  private registerFocusLayer(): void {
    if (this.isFocusLayerRegistered) {
      return;
    }

    dialogFocusHandoff.registerLayer({
      layerId: this.instanceId,
      members: (): readonly string[] => {
        const panel = this.panelElement;
        if (panel === null) {
          return [];
        }

        return this.resolveFocusableMemberIds(panel);
      },
      restoreFocus: this.restoreFocus(),
      trapFocus: this.trapFocus(),
    });
    this.isFocusLayerRegistered = true;
  }

  private unregisterFocusLayer(): void {
    if (!this.isFocusLayerRegistered) {
      return;
    }

    dialogFocusHandoff.unregisterLayer(this.instanceId);
    this.isFocusLayerRegistered = false;
  }

  private resolveFocusableMemberIds(panel: HTMLElement): readonly string[] {
    const focusableElements = resolveTngDialogFocusableElements(panel);
    if (focusableElements.length === 0) {
      return [];
    }

    return focusableElements.map((element) => this.ensureElementId(element));
  }

  private ensureElementId(element: HTMLElement): string {
    const existingId = element.id.trim();
    if (existingId.length > 0) {
      return existingId;
    }

    const generatedId = createDialogFocusableId();
    element.id = generatedId;
    return generatedId;
  }

  private resolveElementById(id: string): HTMLElement | null {
    if (this.documentRef === null) {
      return null;
    }

    const element = this.documentRef.getElementById(id);
    return element instanceof HTMLElement ? element : null;
  }
}

@Directive({
  selector: '[tngDialogPanel]',
  exportAs: 'tngDialogPanel',
})
export class TngDialogPanel implements OnDestroy, OnInit {
  private readonly dialog = inject(TngDialog);
  private readonly hostRef = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly resolvedId = this.hostRef.nativeElement.id.trim().length > 0
    ? this.hostRef.nativeElement.id
    : createDialogPanelId();

  @HostBinding('attr.data-slot')
  protected readonly dataSlot = 'dialog-panel';

  @HostBinding('attr.data-open')
  protected get dataOpenAttr(): 'false' | 'true' {
    return this.dialog.isOpen() ? 'true' : 'false';
  }

  @HostBinding('attr.data-state')
  protected get dataStateAttr(): 'closed' | 'open' {
    return this.dialog.isOpen() ? 'open' : 'closed';
  }

  @HostBinding('attr.hidden')
  protected get hiddenAttr(): '' | null {
    return this.dialog.isOpen() ? null : '';
  }

  @HostBinding('attr.id')
  protected get idAttr(): string {
    return this.resolvedId;
  }

  @HostBinding('attr.role')
  protected readonly roleAttr = 'dialog';

  @HostBinding('attr.tabindex')
  protected readonly tabindexAttr = '-1';

  @HostBinding('attr.aria-describedby')
  protected get ariaDescribedByAttr(): string | null {
    return this.dialog.resolveAriaDescribedby();
  }

  @HostBinding('attr.aria-label')
  protected get ariaLabelAttr(): string | null {
    const label = this.dialog.ariaLabel()?.trim() ?? '';
    return label.length > 0 ? label : null;
  }

  @HostBinding('attr.aria-labelledby')
  protected get ariaLabelledByAttr(): string | null {
    return this.dialog.resolveAriaLabelledby();
  }

  @HostBinding('attr.aria-modal')
  protected get ariaModalAttr(): 'true' | null {
    return this.dialog.isOpen() ? 'true' : null;
  }

  public ngOnInit(): void {
    this.dialog.registerPanel(this.hostRef.nativeElement, this.resolvedId);
  }

  public ngOnDestroy(): void {
    this.dialog.unregisterPanel(this.hostRef.nativeElement);
  }

  @HostListener('keydown', ['$event'])
  protected onKeydown(event: KeyboardEvent): void {
    if (event.key === 'Tab') {
      this.dialog.trapTabNavigation(event);
    }
  }

  @HostListener('focusin', ['$event.target'])
  protected onFocusIn(target: unknown): void {
    this.dialog.recordFocusedElement(target);
  }
}

@Directive({
  selector: '[tngDialogBackdrop]',
  exportAs: 'tngDialogBackdrop',
})
export class TngDialogBackdrop {
  private readonly dialog = inject(TngDialog);

  @HostBinding('attr.data-slot')
  protected readonly dataSlot = 'dialog-backdrop';

  @HostBinding('attr.data-open')
  protected get dataOpenAttr(): 'false' | 'true' {
    return this.dialog.isOpen() ? 'true' : 'false';
  }

  @HostBinding('attr.data-state')
  protected get dataStateAttr(): 'closed' | 'open' {
    return this.dialog.isOpen() ? 'open' : 'closed';
  }

  @HostBinding('attr.hidden')
  protected get hiddenAttr(): '' | null {
    return this.dialog.isOpen() ? null : '';
  }

  @HostListener('pointerdown', ['$event'])
  protected onPointerDown(event: PointerEvent): void {
    this.dialog.onBackdropPointerDown(event);
  }
}

@Directive({
  selector: '[tngDialogTrigger]',
  exportAs: 'tngDialogTrigger',
})
export class TngDialogTrigger {
  private readonly parentDialog = inject(TngDialog, { optional: true });

  public readonly dialogFor = input<TngDialog | null>(null, {
    alias: 'tngDialogTrigger',
  });

  @HostBinding('attr.aria-haspopup')
  protected readonly ariaHasPopupAttr = 'dialog';

  @HostBinding('attr.aria-controls')
  protected get ariaControlsAttr(): string | null {
    return this.resolveDialog()?.getPanelId() ?? null;
  }

  @HostBinding('attr.aria-expanded')
  protected get ariaExpandedAttr(): 'false' | 'true' {
    return this.resolveDialog()?.isOpen() ? 'true' : 'false';
  }

  @HostBinding('attr.data-slot')
  protected readonly dataSlot = 'dialog-trigger';

  @HostBinding('attr.data-open')
  protected get dataOpenAttr(): 'false' | 'true' {
    return this.resolveDialog()?.isOpen() ? 'true' : 'false';
  }

  @HostBinding('attr.data-state')
  protected get dataStateAttr(): 'closed' | 'open' {
    return this.resolveDialog()?.isOpen() ? 'open' : 'closed';
  }

  @HostBinding('attr.data-disabled')
  protected get dataDisabledAttr(): '' | null {
    return this.resolveDialog()?.disabled() ? '' : null;
  }

  @HostListener('click')
  protected onClick(): void {
    this.resolveDialog()?.openDialog();
  }

  private resolveDialog(): TngDialog | null {
    return this.dialogFor() ?? this.parentDialog;
  }
}

@Directive({
  selector: '[tngDialogTitle]',
  exportAs: 'tngDialogTitle',
})
export class TngDialogTitle implements OnDestroy, OnInit {
  private readonly dialog = inject(TngDialog);
  private readonly hostRef = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly resolvedId = this.hostRef.nativeElement.id.trim().length > 0
    ? this.hostRef.nativeElement.id
    : createDialogTitleId();

  @HostBinding('attr.data-slot')
  protected readonly dataSlot = 'dialog-title';

  @HostBinding('attr.id')
  protected get idAttr(): string {
    return this.resolvedId;
  }

  public ngOnInit(): void {
    this.dialog.registerTitle(this.resolvedId);
  }

  public ngOnDestroy(): void {
    this.dialog.unregisterTitle(this.resolvedId);
  }
}

@Directive({
  selector: '[tngDialogDescription]',
  exportAs: 'tngDialogDescription',
})
export class TngDialogDescription implements OnDestroy, OnInit {
  private readonly dialog = inject(TngDialog);
  private readonly hostRef = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly resolvedId = this.hostRef.nativeElement.id.trim().length > 0
    ? this.hostRef.nativeElement.id
    : createDialogDescriptionId();

  @HostBinding('attr.data-slot')
  protected readonly dataSlot = 'dialog-description';

  @HostBinding('attr.id')
  protected get idAttr(): string {
    return this.resolvedId;
  }

  public ngOnInit(): void {
    this.dialog.registerDescription(this.resolvedId);
  }

  public ngOnDestroy(): void {
    this.dialog.unregisterDescription(this.resolvedId);
  }
}

@Directive({
  selector: '[tngDialogContent]',
  exportAs: 'tngDialogContent',
})
export class TngDialogContent {
  @HostBinding('attr.data-slot')
  protected readonly dataSlot = 'dialog-content';
}

@Directive({
  selector: '[tngDialogActions]',
  exportAs: 'tngDialogActions',
})
export class TngDialogActions {
  @HostBinding('attr.data-slot')
  protected readonly dataSlot = 'dialog-actions';
}

@Directive({
  selector: '[tngDialogClose]',
  exportAs: 'tngDialogClose',
})
export class TngDialogClose {
  private readonly dialog = inject(TngDialog);

  public readonly closeReason = input<string | null>(null, {
    alias: 'tngDialogClose',
  });

  @HostBinding('attr.data-slot')
  protected readonly dataSlot = 'dialog-close';

  @HostListener('click')
  protected onClick(): void {
    this.dialog.requestClose(this.resolveCloseReason());
  }

  private resolveCloseReason(): TngDialogCloseReason {
    const raw = this.closeReason()?.trim();
    if (raw === undefined || raw.length === 0) {
      return 'close-button';
    }

    return isDialogCloseReason(raw) ? raw : 'close-button';
  }
}
