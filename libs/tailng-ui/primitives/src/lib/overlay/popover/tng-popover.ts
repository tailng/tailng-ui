import type { OnDestroy, OnInit } from '@angular/core';
import {
  Directive,
  ElementRef,
  HostBinding,
  HostListener,
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
  createCssOverlayPresenceDriver,
  createOverlayPresenceController,
  getGlobalElementScrollLockManager,
  getGlobalScrollLockManager,
  resolveFocusableElements,
  resolveTngScrollableAncestors,
  createTngIdFactory,
  type TngOverlayScrollStrategy,
  type TngOverlayPresenceState,
} from '@tailng-ui/cdk';
import type { TngOverlayDismissReason } from '@tailng-ui/cdk/overlay';
import { isOwnedOverlayTarget, TNG_OVERLAY_LAYER_ID_ATTR } from '../_shared/tng-overlay-ownership';
import { tngPrimitiveOverlayRuntime } from '../tng-overlay-runtime';

const createPopoverId = createTngIdFactory('tng-popover');
const createPopoverPanelId = createTngIdFactory('tng-popover-panel');
const createPopoverFocusableId = createTngIdFactory('tng-popover-focusable');

type OptionalBooleanInput = boolean | null | string | undefined;

export type TngPopoverAutoFocus = 'first-focusable' | 'none' | 'panel';
export type TngPopoverSide = 'bottom' | 'left' | 'right' | 'top';
export type TngPopoverAlign = 'center' | 'end' | 'start';
export type TngPopoverPanelRole = 'dialog' | 'listbox' | 'menu' | 'none' | 'region';
export type TngPopoverAriaHasPopup = 'dialog' | 'grid' | 'listbox' | 'menu' | 'tree' | 'true';
export type TngPopoverCloseReason =
  | 'escape'
  | 'outside-pointer'
  | 'programmatic'
  | 'trigger-toggle';

function normalizeOptionalBooleanInput(value: OptionalBooleanInput): boolean | undefined {
  if (value === null || value === undefined) {
    return undefined;
  }

  return booleanAttribute(value);
}

function isPopoverCloseReason(value: string): value is TngPopoverCloseReason {
  return (
    value === 'escape' ||
    value === 'outside-pointer' ||
    value === 'programmatic' ||
    value === 'trigger-toggle'
  );
}

function mapOverlayDismissReason(reason: TngOverlayDismissReason): TngPopoverCloseReason {
  if (reason === 'escape-key') {
    return 'escape';
  }

  if (reason === 'outside-pointer') {
    return 'outside-pointer';
  }

  return 'programmatic';
}

const popoverGlobalDocument = typeof document === 'undefined' ? null : document;
const popoverFocusHandoff = createOverlayFocusHandoffController();

export function resolvePopoverActiveElement(documentRef: unknown): HTMLElement | null {
  if (typeof Document === 'undefined' || !(documentRef instanceof Document)) {
    return null;
  }

  const active = documentRef.activeElement;
  return typeof HTMLElement !== 'undefined' && active instanceof HTMLElement ? active : null;
}

export function resolvePopoverFocusableElements(container: unknown): readonly HTMLElement[] {
  return resolveFocusableElements(container);
}

export function resolvePopoverMarkedInitialElement(container: unknown): HTMLElement | null {
  if (typeof HTMLElement === 'undefined' || !(container instanceof HTMLElement)) {
    return null;
  }

  const markedInitial = container.querySelector<HTMLElement>('[data-tng-popover-initial-focus]');
  if (markedInitial === null) {
    return null;
  }

  if (resolvePopoverFocusableElements(container).includes(markedInitial)) {
    return markedInitial;
  }

  return resolvePopoverFocusableElements(markedInitial)[0] ?? null;
}

@Directive({
  selector: '[tngPopover]',
  exportAs: 'tngPopover',
})
export class TngPopover implements OnDestroy, OnInit {
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
  public readonly closeOnEscape = input<boolean, OptionalBooleanInput>(true, {
    transform: booleanAttribute,
  });
  public readonly closeOnOutsidePointer = input<boolean, OptionalBooleanInput>(true, {
    transform: booleanAttribute,
  });
  public readonly restoreFocus = input<boolean, OptionalBooleanInput>(true, {
    transform: booleanAttribute,
  });
  public readonly autoFocus = input<TngPopoverAutoFocus, string | TngPopoverAutoFocus>(
    'first-focusable',
    {
      transform: (value: string | TngPopoverAutoFocus): TngPopoverAutoFocus => {
        return value === 'none' || value === 'panel' || value === 'first-focusable'
          ? value
          : 'first-focusable';
      },
    },
  );
  public readonly side = input<TngPopoverSide, string | TngPopoverSide>('bottom', {
    transform: (value: string | TngPopoverSide): TngPopoverSide => {
      return value === 'top' || value === 'right' || value === 'bottom' || value === 'left'
        ? value
        : 'bottom';
    },
  });
  public readonly align = input<TngPopoverAlign, string | TngPopoverAlign>('start', {
    transform: (value: string | TngPopoverAlign): TngPopoverAlign => {
      return value === 'start' || value === 'center' || value === 'end' ? value : 'start';
    },
  });
  public readonly panelRole = input<TngPopoverPanelRole, string | TngPopoverPanelRole>('dialog', {
    transform: (value: string | TngPopoverPanelRole): TngPopoverPanelRole => {
      return value === 'dialog' ||
        value === 'menu' ||
        value === 'listbox' ||
        value === 'region' ||
        value === 'none'
        ? value
        : 'dialog';
    },
  });
  public readonly ariaHasPopup = input<TngPopoverAriaHasPopup, string | TngPopoverAriaHasPopup>(
    'dialog',
    {
      transform: (value: string | TngPopoverAriaHasPopup): TngPopoverAriaHasPopup => {
        return value === 'dialog' ||
          value === 'menu' ||
          value === 'listbox' ||
          value === 'tree' ||
          value === 'grid' ||
          value === 'true'
          ? value
          : 'dialog';
      },
    },
  );
  public readonly ariaLabel = input<string | null>(null);
  public readonly scrollStrategy = input<TngOverlayScrollStrategy>('close');

  public readonly openChange = output<boolean>();
  public readonly closed = output<TngPopoverCloseReason>();

  private readonly hostRef = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly injector = inject(Injector);
  private readonly documentRef = popoverGlobalDocument;
  private readonly bodyScrollLock = getGlobalScrollLockManager({
    documentRef: this.hostRef.nativeElement.ownerDocument,
  });
  private readonly elementScrollLock = getGlobalElementScrollLockManager({
    documentRef: this.hostRef.nativeElement.ownerDocument,
  });
  private readonly instanceId = createPopoverId();
  private readonly uncontrolledOpen = signal(false);
  private readonly openStateEffect = effect((): void => {
    const open = this.isOpen();
    this.scrollStrategy();

    if (!this.initialized) {
      return;
    }

    if (open) {
      if (this.isActive) {
        this.setupScrollStrategy();
        return;
      }

      this.activatePopover();
      return;
    }

    this.deactivatePopover();
  });

  private initialized = false;
  private isActive = false;
  private isFocusLayerRegistered = false;
  private isOverlayLayerRegistered = false;
  private panelElement: HTMLElement | null = null;
  private panelElementId: string | null = null;
  private triggerElement: HTMLElement | null = null;
  private removeScrollListener: (() => void) | null = null;
  private scrollAncestors: readonly HTMLElement[] = [];

  @HostBinding('attr.data-slot')
  protected readonly dataSlot = 'popover';

  @HostBinding(`attr.${TNG_OVERLAY_LAYER_ID_ATTR}`)
  protected get overlayLayerIdAttr(): string {
    return this.instanceId;
  }

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

  @HostBinding('attr.data-side')
  protected get dataSideAttr(): TngPopoverSide {
    return this.side();
  }

  @HostBinding('attr.data-align')
  protected get dataAlignAttr(): TngPopoverAlign {
    return this.align();
  }

  public ngOnInit(): void {
    if (!this.isControlled()) {
      this.uncontrolledOpen.set(this.defaultOpen());
    }

    this.initialized = true;
    if (this.isOpen()) {
      this.activatePopover();
    }
  }

  public ngOnDestroy(): void {
    this.openStateEffect.destroy();
    this.deactivatePopover();
  }

  public isOpen(): boolean {
    return this.openInput() ?? this.uncontrolledOpen();
  }

  public openPopover(): void {
    if (this.disabled() || this.isOpen()) {
      return;
    }

    this.setOpenState(true);
  }

  public closePopover(reason: TngPopoverCloseReason = 'programmatic'): void {
    this.requestClose(reason);
  }

  public togglePopover(force?: boolean): void {
    if (force === true) {
      this.openPopover();
      return;
    }

    if (force === false) {
      this.closePopover('programmatic');
      return;
    }

    if (this.isOpen()) {
      this.requestClose('trigger-toggle');
      return;
    }

    this.openPopover();
  }

  public requestClose(reason: TngPopoverCloseReason): void {
    if (!this.isOpen()) {
      return;
    }

    this.closed.emit(reason);
    this.setOpenState(false);
  }

  public registerTrigger(trigger: HTMLElement): void {
    this.triggerElement = trigger;
  }

  public unregisterTrigger(trigger: HTMLElement): void {
    if (this.triggerElement === trigger) {
      this.triggerElement = null;
    }
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

  public getPanelId(): string | null {
    return this.panelElementId;
  }

  public resolvePanelRole(): Exclude<TngPopoverPanelRole, 'none'> | null {
    const role = this.panelRole();
    return role === 'none' ? null : role;
  }

  private activatePopover(): void {
    if (this.isActive) {
      return;
    }

    this.isActive = true;
    this.registerFocusLayer();
    this.activateFocusLayer();
    this.registerOverlayLayer();
    this.setupScrollStrategy();
    this.focusInitialElement();
  }

  private deactivatePopover(): void {
    if (!this.isActive) {
      return;
    }

    this.isActive = false;
    this.deactivateFocusLayer();
    this.unregisterFocusLayer();
    this.unregisterOverlayLayer();
    this.teardownScrollStrategy();
  }

  private focusInitialElement(): void {
    if (this.autoFocus() === 'none') {
      return;
    }

    afterNextRender(
      (): void => {
        if (!this.isOpen()) {
          return;
        }

        const panel = this.panelElement;
        if (panel === null) {
          return;
        }

        if (this.autoFocus() === 'panel') {
          this.focusElement(panel);
          return;
        }

        const focusTarget =
          resolvePopoverMarkedInitialElement(panel) ??
          resolvePopoverFocusableElements(panel)[0] ??
          panel;
        this.focusElement(focusTarget);
      },
      { injector: this.injector },
    );
  }

  public recordFocusedElement(target: unknown): void {
    if (!(target instanceof HTMLElement) || !this.isOpen()) {
      return;
    }

    const panel = this.panelElement;
    if (!panel?.contains(target)) {
      return;
    }

    const targetId = this.ensureElementId(target);
    popoverFocusHandoff.recordFocus(this.instanceId, targetId);
  }

  private setOpenState(next: boolean): void {
    if (this.isOpen() === next) {
      return;
    }

    if (!this.isControlled()) {
      this.uncontrolledOpen.set(next);
    }

    this.openChange.emit(next);
  }

  private isControlled(): boolean {
    return this.openInput() !== undefined;
  }

  private shouldCloseFromEscape(): boolean {
    return this.isOpen() && this.closeOnEscape();
  }

  private shouldCloseFromOutsidePointer(): boolean {
    return this.isOpen() && this.closeOnOutsidePointer();
  }

  private activateFocusLayer(): void {
    const activeElement = resolvePopoverActiveElement(this.documentRef);
    const restoreFocusTargetId =
      activeElement === null ? null : this.ensureElementId(activeElement);
    popoverFocusHandoff.activateLayer(this.instanceId, restoreFocusTargetId);
  }

  private deactivateFocusLayer(): void {
    const restoreFocusTargetId = popoverFocusHandoff.deactivateLayer(this.instanceId);
    if (!this.restoreFocus() || restoreFocusTargetId === null) {
      return;
    }

    const restoreFocusTarget = this.resolveElementById(restoreFocusTargetId) ?? this.triggerElement;
    restoreFocusTarget?.focus();
  }

  private registerFocusLayer(): void {
    if (this.isFocusLayerRegistered) {
      return;
    }

    popoverFocusHandoff.registerLayer({
      layerId: this.instanceId,
      members: (): readonly string[] => {
        const panel = this.panelElement;
        if (panel === null) {
          return [];
        }

        return this.resolveFocusableMemberIds(panel);
      },
      restoreFocus: this.restoreFocus(),
      trapFocus: false,
    });
    this.isFocusLayerRegistered = true;
  }

  private unregisterFocusLayer(): void {
    if (!this.isFocusLayerRegistered) {
      return;
    }

    popoverFocusHandoff.unregisterLayer(this.instanceId);
    this.isFocusLayerRegistered = false;
  }

  private registerOverlayLayer(): void {
    const hostElement = this.hostRef.nativeElement;
    tngPrimitiveOverlayRuntime.registerLayer({
      containsTarget: (target: unknown, path: readonly unknown[]): boolean => {
        if (target instanceof Node && hostElement.contains(target)) {
          return true;
        }

        if (path.includes(hostElement)) {
          return true;
        }

        return isOwnedOverlayTarget(
          target instanceof EventTarget ? target : null,
          this.instanceId,
          path,
        );
      },
      dismissOnEscape: this.shouldCloseFromEscape(),
      dismissOnOutsidePointer: this.shouldCloseFromOutsidePointer(),
      id: this.instanceId,
      onDismiss: (reason: TngOverlayDismissReason): void => {
        if (reason === 'escape-key' && !this.shouldCloseFromEscape()) {
          return;
        }

        if (reason === 'outside-pointer' && !this.shouldCloseFromOutsidePointer()) {
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

  private setupScrollStrategy(): void {
    this.teardownScrollStrategy();

    const anchor = this.triggerElement ?? this.hostRef.nativeElement;
    this.scrollAncestors = resolveTngScrollableAncestors(anchor);

    if (this.scrollStrategy() === 'block') {
      this.bodyScrollLock.acquire(this.instanceId);
      this.elementScrollLock.acquire(this.instanceId, this.scrollAncestors);
      return;
    }

    if (this.scrollStrategy() !== 'close' || this.documentRef === null) {
      return;
    }

    const win = this.documentRef.defaultView;
    if (win === null) {
      return;
    }

    const onScroll = (event: Event): void => {
      if (
        this.panelElement !== null &&
        event.target instanceof Node &&
        this.panelElement.contains(event.target)
      ) {
        return;
      }

      this.requestClose('outside-pointer');
    };
    win.addEventListener('scroll', onScroll, true);
    this.removeScrollListener = (): void => win.removeEventListener('scroll', onScroll, true);
  }

  private teardownScrollStrategy(): void {
    this.removeScrollListener?.();
    this.removeScrollListener = null;
    this.bodyScrollLock.release(this.instanceId);
    this.elementScrollLock.release(this.instanceId);
    this.scrollAncestors = [];
  }

  private focusElement(target: HTMLElement): void {
    const targetId = this.ensureElementId(target);
    const resolvedTargetId = popoverFocusHandoff.resolveFocusCandidate(this.instanceId, targetId);
    if (resolvedTargetId === null) {
      return;
    }

    const resolvedTarget = this.resolveElementById(resolvedTargetId);
    if (resolvedTarget === null) {
      return;
    }

    resolvedTarget.focus();
    popoverFocusHandoff.recordFocus(this.instanceId, resolvedTargetId);
  }

  private resolveFocusableMemberIds(panel: HTMLElement): readonly string[] {
    const focusableElements = resolvePopoverFocusableElements(panel);
    const memberIds: string[] = [];
    const seenIds = new Set<string>();

    const registerMember = (element: HTMLElement): void => {
      const id = this.ensureElementId(element);
      if (seenIds.has(id)) {
        return;
      }

      seenIds.add(id);
      memberIds.push(id);
    };

    registerMember(panel);
    for (const element of focusableElements) {
      registerMember(element);
    }

    return memberIds;
  }

  private ensureElementId(element: HTMLElement): string {
    const existingId = element.id.trim();
    if (existingId.length > 0) {
      return existingId;
    }

    const generatedId = createPopoverFocusableId();
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
  selector: '[tngPopoverTrigger]',
  exportAs: 'tngPopoverTrigger',
})
export class TngPopoverTrigger implements OnDestroy, OnInit {
  private readonly hostRef = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly parentPopover = inject(TngPopover, { optional: true });

  public readonly popoverFor = input<TngPopover | null>(null, {
    alias: 'tngPopoverTrigger',
  });

  @HostBinding('attr.aria-haspopup')
  protected get ariaHasPopupAttr(): TngPopoverAriaHasPopup {
    return this.resolvePopover()?.ariaHasPopup() ?? 'dialog';
  }

  @HostBinding('attr.aria-controls')
  protected get ariaControlsAttr(): string | null {
    return this.resolvePopover()?.getPanelId() ?? null;
  }

  @HostBinding('attr.aria-expanded')
  protected get ariaExpandedAttr(): 'false' | 'true' {
    return this.resolvePopover()?.isOpen() ? 'true' : 'false';
  }

  @HostBinding('attr.data-slot')
  protected readonly dataSlot = 'popover-trigger';

  @HostBinding('attr.data-open')
  protected get dataOpenAttr(): 'false' | 'true' {
    return this.resolvePopover()?.isOpen() ? 'true' : 'false';
  }

  @HostBinding('attr.data-state')
  protected get dataStateAttr(): 'closed' | 'open' {
    return this.resolvePopover()?.isOpen() ? 'open' : 'closed';
  }

  @HostBinding('attr.data-disabled')
  protected get dataDisabledAttr(): '' | null {
    return this.resolvePopover()?.disabled() ? '' : null;
  }

  public ngOnInit(): void {
    this.resolvePopover()?.registerTrigger(this.hostRef.nativeElement);
  }

  public ngOnDestroy(): void {
    this.resolvePopover()?.unregisterTrigger(this.hostRef.nativeElement);
  }

  @HostListener('click')
  protected onClick(): void {
    this.resolvePopover()?.togglePopover();
  }

  private resolvePopover(): TngPopover | null {
    return this.popoverFor() ?? this.parentPopover;
  }
}

@Directive({
  selector: '[tngPopoverPanel], [tngPopoverContent]',
  exportAs: 'tngPopoverPanel',
})
export class TngPopoverPanel implements OnDestroy, OnInit {
  private readonly popover = inject(TngPopover);
  private readonly hostRef = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly generatedId = createPopoverPanelId();
  private readonly presenceState = signal<TngOverlayPresenceState>('closed');
  private readonly presence = createOverlayPresenceController({
    driver: createCssOverlayPresenceDriver({
      elements: () => [this.hostRef.nativeElement],
      windowRef: this.hostRef.nativeElement.ownerDocument.defaultView,
    }),
    onPresent: () => this.prepareForPresence(),
    onStateChange: (state) => {
      this.presenceState.set(state);
      this.applyPresenceState(state);
    },
  });
  private readonly syncPresence = effect(() => {
    this.presence.setOpen(this.popover.isOpen());
  });
  private resolvedId = '';

  @HostBinding('attr.data-slot')
  protected readonly dataSlot = 'popover-panel';

  @HostBinding('attr.data-open')
  protected get dataOpenAttr(): 'false' | 'true' {
    return this.popover.isOpen() ? 'true' : 'false';
  }

  @HostBinding('attr.data-state')
  protected get dataStateAttr(): 'closed' | 'open' {
    return this.popover.isOpen() ? 'open' : 'closed';
  }

  @HostBinding('attr.data-side')
  protected get dataSideAttr(): TngPopoverSide {
    return this.popover.side();
  }

  @HostBinding('attr.data-align')
  protected get dataAlignAttr(): TngPopoverAlign {
    return this.popover.align();
  }

  @HostBinding('attr.hidden')
  protected get hiddenAttr(): '' | null {
    return this.presenceState() === 'closed' ? '' : null;
  }

  @HostBinding('attr.data-presence')
  protected get dataPresenceAttr(): TngOverlayPresenceState {
    return this.presenceState();
  }

  @HostBinding('attr.data-tng-overlay-motion')
  protected readonly overlayMotionAttr = '';

  @HostBinding('attr.aria-hidden')
  protected get ariaHiddenAttr(): 'true' | null {
    return this.presenceState() === 'exiting' ? 'true' : null;
  }

  @HostBinding('attr.inert')
  protected get inertAttr(): '' | null {
    return this.presenceState() === 'exiting' ? '' : null;
  }

  @HostBinding('attr.id')
  protected get idAttr(): string {
    return this.resolvedId;
  }

  @HostBinding('attr.role')
  protected get roleAttr(): Exclude<TngPopoverPanelRole, 'none'> | null {
    return this.popover.resolvePanelRole();
  }

  @HostBinding('attr.aria-label')
  protected get ariaLabelAttr(): string | null {
    return this.popover.ariaLabel();
  }

  @HostBinding('attr.tabindex')
  protected readonly tabIndexAttr = '-1';

  public ngOnInit(): void {
    const hostId = this.hostRef.nativeElement.id.trim();
    this.resolvedId = hostId.length > 0 ? hostId : this.generatedId;
    this.popover.registerPanel(this.hostRef.nativeElement, this.resolvedId);
  }

  public ngOnDestroy(): void {
    this.syncPresence.destroy();
    this.presence.destroy();
    this.popover.unregisterPanel(this.hostRef.nativeElement);
  }

  @HostListener('focusin', ['$event.target'])
  protected onFocusIn(target: EventTarget | null): void {
    this.popover.recordFocusedElement(target);
  }

  private prepareForPresence(): void {
    const panel = this.hostRef.nativeElement;
    panel.removeAttribute('hidden');
    panel.style.removeProperty('display');
  }

  private applyPresenceState(state: TngOverlayPresenceState): void {
    const panel = this.hostRef.nativeElement;
    panel.setAttribute('data-presence', state);
    panel.setAttribute('data-tng-overlay-motion', '');

    if (state === 'closed') {
      panel.setAttribute('hidden', '');
    } else {
      panel.removeAttribute('hidden');
    }

    if (state === 'exiting') {
      panel.setAttribute('aria-hidden', 'true');
      panel.setAttribute('inert', '');
    } else {
      panel.removeAttribute('aria-hidden');
      panel.removeAttribute('inert');
    }
  }
}

@Directive({
  selector: '[tngPopoverClose]',
  exportAs: 'tngPopoverClose',
})
export class TngPopoverClose {
  private readonly popover = inject(TngPopover);

  public readonly closeReason = input<string | null>(null, {
    alias: 'tngPopoverClose',
  });

  @HostBinding('attr.data-slot')
  protected readonly dataSlot = 'popover-close';

  @HostListener('click')
  protected onClick(): void {
    this.popover.requestClose(this.resolveCloseReason());
  }

  private resolveCloseReason(): TngPopoverCloseReason {
    const raw = this.closeReason()?.trim();
    if (raw === undefined || raw.length === 0) {
      return 'programmatic';
    }

    return isPopoverCloseReason(raw) ? raw : 'programmatic';
  }
}
