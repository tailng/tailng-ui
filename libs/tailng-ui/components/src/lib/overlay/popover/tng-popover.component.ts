import type { AfterViewInit, DoCheck, OnDestroy } from '@angular/core';
import {
  Component,
  DestroyRef,
  ElementRef,
  HostBinding,
  NgZone,
  booleanAttribute,
  inject,
  input,
  output,
  signal,
  viewChild,
} from '@angular/core';
import {
  computeOverlayPosition,
  createPortalManager,
  createTngIdFactory,
  type TngOverlayScrollStrategy,
  type TngPortalDocument,
} from '@tailng-ui/cdk';
import {
  coerceTngPopoverAutoFocus,
  TngPopover as TngPopoverPrimitive,
  TngPopoverPanel,
  type TngPopoverAlign,
  type TngPopoverAriaHasPopup,
  type TngPopoverAutoFocus,
  type TngPopoverCloseReason,
  type TngPopoverPanelRole,
  type TngPopoverSide,
} from '@tailng-ui/primitives';

export type {
  TngPopoverAlign,
  TngPopoverAriaHasPopup,
  TngPopoverAutoFocus,
  TngPopoverCloseReason,
  TngPopoverPanelRole,
  TngPopoverSide,
} from '@tailng-ui/primitives';

type OptionalBooleanInput = boolean | null | string | undefined;

type Rect = Readonly<{
  height: number;
  left: number;
  top: number;
  width: number;
}>;

type InlineStyleSnapshot = Readonly<{
  priority: string;
  value: string;
}>;

const createPopoverOverlayId = createTngIdFactory('tng-popover-overlay');

const PORTALLED_POPOVER_THEME_VARS = [
  '--tng-popover-panel-radius',
  '--tng-popover-focus-ring',
  '--tng-popover-z-overlay',
  '--tng-z-overlay',
  '--tng-radius-panel',
  '--tng-semantic-background-surface',
  '--tng-semantic-border-strong',
  '--tng-semantic-foreground-primary',
  '--tng-semantic-focus-ring',
] as const;

function normalizeOptionalBooleanInput(value: OptionalBooleanInput): boolean | undefined {
  if (value === null || value === undefined) {
    return undefined;
  }

  return booleanAttribute(value);
}

function normalizeNonNegativeNumber(value: number | string, fallback: number): number {
  const numericValue = typeof value === 'number' ? value : Number(value);
  return Number.isFinite(numericValue) && numericValue >= 0 ? numericValue : fallback;
}

function rectFromClientRect(rect: DOMRectReadOnly): Rect {
  return {
    height: rect.height,
    left: rect.left,
    top: rect.top,
    width: rect.width,
  };
}

function viewportRect(windowRef: Window): Rect {
  return {
    height: windowRef.innerHeight || 768,
    left: 0,
    top: 0,
    width: windowRef.innerWidth || 1024,
  };
}

function getOwnerWindow(documentRef: Document): Window {
  if (documentRef.defaultView !== null) {
    return documentRef.defaultView;
  }

  if (typeof window !== 'undefined') {
    return window;
  }

  return globalThis as unknown as Window;
}

@Component({
  selector: 'tng-popover',
  imports: [TngPopoverPrimitive, TngPopoverPanel],
  templateUrl: './tng-popover.component.html',
  styleUrl: './tng-popover.component.css',
  exportAs: 'tngPopoverComponent',
})
export class TngPopoverComponent implements AfterViewInit, DoCheck, OnDestroy {
  public readonly ariaHasPopup = input<TngPopoverAriaHasPopup>('dialog');
  public readonly autoFocus = input<TngPopoverAutoFocus, boolean | string>('first-focusable', {
    transform: coerceTngPopoverAutoFocus,
  });
  public readonly align = input<TngPopoverAlign>('start');
  public readonly closeOnEscape = input<boolean, boolean | string>(true, {
    transform: booleanAttribute,
  });
  public readonly closeOnFocusOutside = input<boolean, boolean | string>(false, {
    transform: booleanAttribute,
  });
  public readonly closeOnOutsidePointer = input<boolean, boolean | string>(true, {
    transform: booleanAttribute,
  });
  public readonly collisionPadding = input<number, number | string>(8, {
    transform: (value: number | string): number => normalizeNonNegativeNumber(value, 8),
  });
  public readonly defaultOpen = input<boolean, boolean | string>(false, {
    transform: booleanAttribute,
  });
  public readonly disabled = input<boolean, boolean | string>(false, {
    transform: booleanAttribute,
  });
  public readonly offset = input<number, number | string>(8, {
    transform: (value: number | string): number => normalizeNonNegativeNumber(value, 8),
  });
  public readonly open = input<boolean | undefined, OptionalBooleanInput>(undefined, {
    transform: normalizeOptionalBooleanInput,
  });
  public readonly panelAriaLabel = input<string | null>('Popover');
  public readonly panelAriaLabelledby = input<string | null>(null);
  public readonly panelRole = input<TngPopoverPanelRole>('dialog');
  public readonly restoreFocus = input<boolean, boolean | string>(true, {
    transform: booleanAttribute,
  });
  public readonly scrollStrategy = input<TngOverlayScrollStrategy>('reposition');
  public readonly side = input<TngPopoverSide>('bottom');

  public readonly closed = output<TngPopoverCloseReason>();
  public readonly openChange = output<boolean>();

  private readonly popoverRef = viewChild<TngPopoverPrimitive>('popoverRef');
  private readonly panelRef = viewChild<ElementRef<HTMLElement>>('panelRef');
  private readonly destroyRef = inject(DestroyRef);
  private readonly hostRef = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly ngZone = inject(NgZone);
  private readonly ownerDocument = this.hostRef.nativeElement.ownerDocument;
  private readonly ownerWindow = getOwnerWindow(this.ownerDocument);
  private readonly isBrowser = this.ownerDocument.defaultView !== null;
  private readonly overlayId = createPopoverOverlayId();
  private readonly portalManager = createPortalManager({
    documentRef: this.ownerDocument as unknown as TngPortalDocument,
    isBrowser: this.ownerDocument.defaultView !== null,
  });
  private readonly openState = signal(false);
  private readonly panelId = signal<string | null>(null);
  private readonly resolvedAlign = signal<TngPopoverAlign>('start');
  private readonly resolvedSide = signal<TngPopoverSide>('bottom');

  private triggerOwner: object | null = null;
  private triggerElement: HTMLElement | null = null;
  private registeredPrimitiveTrigger: HTMLElement | null = null;
  private lastOpenState = false;
  private panelPresenceObserver: MutationObserver | null = null;
  private placeholder: Comment | null = null;
  private originalParent: Node | null = null;
  private portalled = false;
  private rafId: number | null = null;
  private removeResizeListener: (() => void) | null = null;
  private removeScrollListener: (() => void) | null = null;
  private resizeObserver: ResizeObserver | null = null;
  private readonly inlineThemeSnapshots = new Map<string, InlineStyleSnapshot>();
  private inlineColorSchemeSnapshot: InlineStyleSnapshot | null = null;

  @HostBinding('attr.data-align')
  protected get dataAlign(): TngPopoverAlign {
    return this.resolvedAlign();
  }

  @HostBinding('attr.data-side')
  protected get dataSide(): TngPopoverSide {
    return this.resolvedSide();
  }

  @HostBinding('attr.data-state')
  protected get dataState(): 'closed' | 'open' {
    return this.openState() ? 'open' : 'closed';
  }

  public constructor() {
    this.placeholder = this.ownerDocument.createComment('tng-popover-anchor');
    this.clearPositioningStyles();
    this.captureOriginalLocation();

    this.destroyRef.onDestroy((): void => {
      this.cancelCloseTeardown();
      this.detachPositioningListeners();
      this.clearPositioningStyles();
      this.restoreToPlaceholder();
      this.placeholder = null;
      this.originalParent = null;
    });
  }

  public ngDoCheck(): void {
    const primitive = this.popoverRef();
    if (primitive === undefined) {
      return;
    }

    this.syncRegisteredTrigger(primitive);
    this.panelId.set(primitive.getPanelId());

    const isOpen = primitive.isOpen();
    this.openState.set(isOpen);

    if (isOpen && !this.lastOpenState) {
      this.lastOpenState = true;
      this.cancelCloseTeardown();
      this.setPositioningPending(true);
      this.mountToBody();
      this.attachPositioningListeners();
      this.queuePositioning();
      return;
    }

    if (!isOpen && this.lastOpenState) {
      this.lastOpenState = false;
      this.setPositioningPending(false);
      this.detachPositioningListeners();
      this.deferCloseTeardown();
      return;
    }

    if (isOpen) {
      this.queuePositioning();
    }
  }

  public ngAfterViewInit(): void {
    this.panelId.set(this.popoverRef()?.getPanelId() ?? null);
  }

  public ngOnDestroy(): void {
    const primitive = this.popoverRef();
    if (primitive !== undefined && this.registeredPrimitiveTrigger !== null) {
      primitive.unregisterTrigger(this.registeredPrimitiveTrigger);
    }
  }

  public isOpen(): boolean {
    return this.openState();
  }

  public isDisabled(): boolean {
    return this.disabled();
  }

  public getPanelId(): string | null {
    const cachedPanelId = this.panelId();
    return this.popoverRef()?.getPanelId() ?? cachedPanelId;
  }

  public getAriaHasPopup(): TngPopoverAriaHasPopup {
    return this.ariaHasPopup();
  }

  public registerTrigger(owner: object, trigger: HTMLElement): void {
    if (this.triggerOwner !== null && this.triggerOwner !== owner) {
      throw new Error('tng-popover supports exactly one [tngPopoverTriggerFor] trigger.');
    }

    if (this.triggerElement !== null && this.triggerElement !== trigger) {
      this.popoverRef()?.unregisterTrigger(this.triggerElement);
      this.registeredPrimitiveTrigger = null;
    }

    this.triggerOwner = owner;
    this.triggerElement = trigger;

    const primitive = this.popoverRef();
    if (primitive !== undefined) {
      this.syncRegisteredTrigger(primitive);
    }
  }

  public unregisterTrigger(owner: object, trigger: HTMLElement): void {
    if (this.triggerOwner !== owner || this.triggerElement !== trigger) {
      return;
    }

    this.popoverRef()?.unregisterTrigger(trigger);
    this.triggerOwner = null;
    this.triggerElement = null;
    this.registeredPrimitiveTrigger = null;
  }

  public openPopover(): void {
    this.popoverRef()?.openPopover();
  }

  public close(reason: TngPopoverCloseReason = 'programmatic'): void {
    this.popoverRef()?.closePopover(reason);
  }

  public toggle(): void {
    this.popoverRef()?.togglePopover();
  }

  public toggleFrom(trigger: HTMLElement): void {
    if (trigger === this.triggerElement) {
      this.popoverRef()?.togglePopover();
    }
  }

  protected onPrimitiveOpenChange(open: boolean): void {
    this.openState.set(open);
    this.openChange.emit(open);
  }

  private syncRegisteredTrigger(primitive: TngPopoverPrimitive): void {
    const trigger = this.triggerElement;
    if (trigger === null || trigger === this.registeredPrimitiveTrigger) {
      return;
    }

    if (this.registeredPrimitiveTrigger !== null) {
      primitive.unregisterTrigger(this.registeredPrimitiveTrigger);
    }

    primitive.registerTrigger(trigger);
    this.registeredPrimitiveTrigger = trigger;
  }

  private queuePositioning(): void {
    if (!this.isBrowser || typeof this.ownerWindow.requestAnimationFrame !== 'function') {
      this.setPositioningPending(false);
      return;
    }

    if (this.rafId !== null) {
      return;
    }

    this.ngZone.runOutsideAngular((): void => {
      this.rafId = this.ownerWindow.requestAnimationFrame((): void => {
        this.rafId = null;
        this.reposition();
      });
    });
  }

  private reposition(): void {
    if (!this.openState()) {
      return;
    }

    const trigger = this.triggerElement;
    const panel = this.panelRef()?.nativeElement;
    if (trigger === null || panel === undefined) {
      this.setPositioningPending(false);
      return;
    }

    const direction =
      this.ownerWindow.getComputedStyle(trigger).direction === 'rtl' ? 'rtl' : 'ltr';
    const result = computeOverlayPosition({
      anchorRect: rectFromClientRect(trigger.getBoundingClientRect()),
      overlayRect: rectFromClientRect(panel.getBoundingClientRect()),
      viewportRect: viewportRect(this.ownerWindow),
      placement: { side: this.side(), align: this.align() },
      offset: { side: this.offset(), align: 0 },
      collision: {
        padding: this.collisionPadding(),
        flip: true,
        shift: true,
      },
      direction,
    });

    this.resolvedSide.set(result.side);
    this.resolvedAlign.set(result.align);
    this.applyPositionStyles(result.x, result.y);
    this.setPositioningPending(false);
  }

  private setPositioningPending(pending: boolean): void {
    if (pending) {
      this.hostRef.nativeElement.setAttribute('data-positioning-state', 'pending');
    } else {
      this.hostRef.nativeElement.removeAttribute('data-positioning-state');
    }
  }

  private applyPositionStyles(x: number, y: number): void {
    const host = this.hostRef.nativeElement;
    host.style.position = 'fixed';
    host.style.left = `${x}px`;
    host.style.top = `${y}px`;
    host.style.right = 'auto';
    host.style.bottom = 'auto';
    host.style.margin = '0';
    host.style.zIndex = 'var(--tng-popover-z-overlay, var(--tng-z-overlay, 60))';
  }

  private clearPositioningStyles(): void {
    const host = this.hostRef.nativeElement;
    host.style.position = 'fixed';
    host.style.left = '0';
    host.style.top = '0';
    host.style.right = 'auto';
    host.style.bottom = 'auto';
    host.style.margin = '0';
    host.style.zIndex = '';
  }

  private deferCloseTeardown(): void {
    this.cancelCloseTeardown();

    const panel = this.panelRef()?.nativeElement;
    if (!this.isBrowser || panel === undefined) {
      this.completeCloseTeardown();
      return;
    }

    this.panelPresenceObserver = new MutationObserver((): void => {
      this.completeCloseTeardownIfDismissed();
    });
    this.panelPresenceObserver.observe(panel, {
      attributeFilter: ['data-presence'],
      attributes: true,
    });

    queueMicrotask((): void => this.completeCloseTeardownIfDismissed());
  }

  private completeCloseTeardownIfDismissed(): void {
    const panel = this.panelRef()?.nativeElement;
    if (
      this.openState() ||
      (panel !== undefined && panel.getAttribute('data-presence') !== 'closed')
    ) {
      return;
    }

    this.completeCloseTeardown();
  }

  private completeCloseTeardown(): void {
    if (this.openState()) {
      return;
    }

    this.cancelCloseTeardown();
    this.clearPositioningStyles();
    this.restoreToPlaceholder();
    this.resolvedSide.set(this.side());
    this.resolvedAlign.set(this.align());
  }

  private cancelCloseTeardown(): void {
    this.panelPresenceObserver?.disconnect();
    this.panelPresenceObserver = null;
  }

  private mountToBody(): void {
    const host = this.hostRef.nativeElement;
    if (
      !this.isBrowser ||
      this.ownerDocument.body === null ||
      host.parentNode === this.ownerDocument.body
    ) {
      return;
    }

    this.captureOriginalLocation();
    this.syncPortalledThemeVars();
    this.portalled = this.portalManager.mount({
      node: host,
      portalId: this.overlayId,
    });
  }

  private captureOriginalLocation(): void {
    const host = this.hostRef.nativeElement;
    if (this.placeholder?.parentNode !== null) {
      return;
    }

    const parent = host.parentNode;
    if (parent === null) {
      return;
    }

    this.originalParent = parent;
    parent.insertBefore(this.placeholder, host);
  }

  private restoreToPlaceholder(): void {
    const host = this.hostRef.nativeElement;

    if (this.portalled) {
      this.portalManager.unmount(this.overlayId);
      this.portalled = false;
    }

    if (this.placeholder?.parentNode !== null && this.placeholder?.parentNode !== undefined) {
      this.placeholder.parentNode.insertBefore(host, this.placeholder);
    } else if (this.originalParent !== null) {
      this.originalParent.appendChild(host);
    }

    this.restorePortalledThemeVars();
  }

  private syncPortalledThemeVars(): void {
    const host = this.hostRef.nativeElement;
    const hostStyles = host.style;
    const computedStyles = this.ownerWindow.getComputedStyle(host);

    this.inlineThemeSnapshots.clear();
    for (const cssVar of PORTALLED_POPOVER_THEME_VARS) {
      this.inlineThemeSnapshots.set(cssVar, {
        value: hostStyles.getPropertyValue(cssVar),
        priority: hostStyles.getPropertyPriority(cssVar),
      });

      const value = computedStyles.getPropertyValue(cssVar).trim();
      if (value === '') {
        hostStyles.removeProperty(cssVar);
      } else {
        hostStyles.setProperty(cssVar, value);
      }
    }

    this.inlineColorSchemeSnapshot = {
      value: hostStyles.getPropertyValue('color-scheme'),
      priority: hostStyles.getPropertyPriority('color-scheme'),
    };
    const colorScheme = computedStyles.colorScheme?.trim();
    if (colorScheme !== '' && colorScheme !== 'normal') {
      hostStyles.colorScheme = colorScheme;
    }
  }

  private restorePortalledThemeVars(): void {
    const hostStyles = this.hostRef.nativeElement.style;
    for (const [cssVar, snapshot] of this.inlineThemeSnapshots) {
      if (snapshot.value === '') {
        hostStyles.removeProperty(cssVar);
      } else {
        hostStyles.setProperty(cssVar, snapshot.value, snapshot.priority);
      }
    }

    if (this.inlineColorSchemeSnapshot !== null) {
      if (this.inlineColorSchemeSnapshot.value === '') {
        hostStyles.removeProperty('color-scheme');
      } else {
        hostStyles.setProperty(
          'color-scheme',
          this.inlineColorSchemeSnapshot.value,
          this.inlineColorSchemeSnapshot.priority,
        );
      }
    }

    this.inlineThemeSnapshots.clear();
    this.inlineColorSchemeSnapshot = null;
  }

  private attachPositioningListeners(): void {
    if (!this.isBrowser || this.removeResizeListener !== null) {
      return;
    }

    const reposition = (): void => this.queuePositioning();
    this.ngZone.runOutsideAngular((): void => {
      this.ownerWindow.addEventListener('resize', reposition);
      this.removeResizeListener = (): void =>
        this.ownerWindow.removeEventListener('resize', reposition);

      if (this.scrollStrategy() === 'reposition') {
        const onScroll = (event: Event): void => {
          if (event.target instanceof Node && this.hostRef.nativeElement.contains(event.target)) {
            return;
          }

          reposition();
        };
        this.ownerWindow.addEventListener('scroll', onScroll, true);
        this.removeScrollListener = (): void =>
          this.ownerWindow.removeEventListener('scroll', onScroll, true);
      }

      if ('ResizeObserver' in this.ownerWindow) {
        this.resizeObserver = new ResizeObserver(reposition);
        if (this.triggerElement !== null) {
          this.resizeObserver.observe(this.triggerElement);
        }
        const panel = this.panelRef()?.nativeElement;
        if (panel !== undefined) {
          this.resizeObserver.observe(panel);
        }
      }
    });
  }

  private detachPositioningListeners(): void {
    this.removeResizeListener?.();
    this.removeScrollListener?.();
    this.removeResizeListener = null;
    this.removeScrollListener = null;
    this.resizeObserver?.disconnect();
    this.resizeObserver = null;

    if (this.rafId !== null) {
      this.ownerWindow.cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
  }
}

export { TngPopoverComponent as TngPopover };
