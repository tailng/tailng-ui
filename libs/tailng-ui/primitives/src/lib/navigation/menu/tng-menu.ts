import {
  ChangeDetectorRef,
  Directive,
  ElementRef,
  HostBinding,
  HostListener,
  inject,
  InjectionToken,
  input,
  NgZone,
  output,
} from '@angular/core';
import { createTngIdFactory } from '@tailng-ui/cdk';

type MenuItemElement = HTMLElement;
type ReadonlyMenuItemElement = Readonly<MenuItemElement>;
type TngMenuFocusAction = 'first' | 'last' | 'next' | 'prev';
type TngMenuOpenFocusAction = 'first' | 'last' | 'none';
type TngMenuSelectTrigger = 'keyboard' | 'pointer';
type TngMenuItemRole = 'menuitem' | 'menuitemcheckbox' | 'menuitemradio';
type TngMenuKeyboardEvent = Readonly<Pick<KeyboardEvent, 'key' | 'shiftKey' | 'target'>> &
  Readonly<{ preventDefault: () => void }>;
type TngMenuPointerEvent = Readonly<Pick<PointerEvent, 'target'>>;
type TngMenuPointerEnterEvent = Readonly<Pick<PointerEvent, 'pointerType'>>;
type TngMenubarArrowHandler = (key: 'ArrowRight' | 'ArrowLeft') => void;
type TngMenubarTabHandler = (shiftKey: boolean) => boolean;

export type TngMenuSelectEvent = Readonly<{
  value: unknown;
  itemId: string;
  trigger: TngMenuSelectTrigger;
}>;

/**
 * When `true` is provided on the same element injector as {@link TngMenu}, {@link TngMenu.open}
 * skips moving focus to the panel synchronously so a host (e.g. `TngMenuComponent` after overlay
 * placement) can focus once coordinates are stable. Headless / primitive-only hosts omit this
 * token so focus behavior stays unchanged.
 */
export const TNG_MENU_DEFER_HOST_FOCUS_UNTIL_POSITIONED = new InjectionToken<boolean>(
  'TNG_MENU_DEFER_HOST_FOCUS_UNTIL_POSITIONED',
);

function getNextIndex(currentIndex: number, total: number): number {
  if (currentIndex < 0) {
    return 0;
  }

  return currentIndex + 1 >= total ? 0 : currentIndex + 1;
}

function getPrevIndex(currentIndex: number, total: number): number {
  if (currentIndex < 0) {
    return total - 1;
  }

  return currentIndex - 1 < 0 ? total - 1 : currentIndex - 1;
}

function resolveMenuFocusAction(key: string): TngMenuFocusAction | null {
  switch (key) {
    case 'ArrowDown':
      return 'next';
    case 'ArrowUp':
      return 'prev';
    case 'Home':
      return 'first';
    case 'End':
      return 'last';
    default:
      return null;
  }
}

function resolveFocusIndex(
  action: TngMenuFocusAction,
  currentIndex: number,
  total: number,
  loop: boolean,
): number {
  switch (action) {
    case 'next':
      if (!loop && currentIndex >= total - 1) {
        return total - 1;
      }
      return getNextIndex(currentIndex, total);
    case 'prev':
      if (!loop) {
        if (currentIndex < 0) {
          return 0;
        }
        if (currentIndex <= 0) {
          return 0;
        }
      }
      return getPrevIndex(currentIndex, total);
    case 'first':
      return 0;
    case 'last':
      return total - 1;
  }
}

const createMenuId = createTngIdFactory('tng-menu');
const createMenuItemId = createTngIdFactory('tng-menu-item');
const createMenuTriggerId = createTngIdFactory('tng-menu-trigger');
const TYPEAHEAD_RESET_MS = 500;

@Directive({
  selector: '[tngMenu]',
  exportAs: 'tngMenu',
})
export class TngMenu {
  private static openRootMenu: TngMenu | null = null;
  private readonly changeDetectorRef = inject(ChangeDetectorRef);
  private readonly hostRef = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly ngZone = inject(NgZone);
  private readonly deferHostFocusUntilPositioned =
    inject(TNG_MENU_DEFER_HOST_FOCUS_UNTIL_POSITIONED, { optional: true }) === true;
  private readonly resolvedId = this.hostRef.nativeElement.getAttribute('id') ?? createMenuId();
  private readonly itemsById = new Map<string, TngMenuItem>();
  private outsidePointerdownCleanup: (() => void) | null = null;
  private typeaheadResetHandle: ReturnType<typeof setTimeout> | null = null;
  private menubarArrowHandler: TngMenubarArrowHandler | null = null;
  private menubarTabHandler: TngMenubarTabHandler | null = null;
  private restoreFocusOnOutsideClick = false;
  private triggerStateSync: (() => void) | null = null;
  private triggerElement: HTMLElement | null = null;
  private activeItemId: string | null = null;
  private parentMenu: TngMenu | null = null;
  private parentMenuItem: TngMenuItem | null = null;
  private openSubmenu: TngMenu | null = null;
  private openState = false;
  private exitPresenceActive = false;
  private typeaheadBuffer = '';

  readonly loop = input<boolean>(true);
  readonly disabled = input<boolean>(false);
  readonly closeOnSelect = input<boolean>(true);
  readonly dismissOnOutsideClick = input<boolean>(true);
  readonly dismissOnFocusout = input<boolean>(false);
  readonly tngMenuOpened = output<void>();
  readonly tngMenuClosed = output<void>();
  readonly tngMenuSelect = output<TngMenuSelectEvent>();

  @HostBinding('attr.data-slot')
  protected readonly dataSlot = 'menu' as const;

  @HostBinding('attr.role')
  protected readonly role = 'menu' as const;

  @HostBinding('attr.id')
  readonly id = this.resolvedId;

  @HostBinding('attr.tabindex')
  protected get tabIndex(): string {
    return this.hostRef.nativeElement.getAttribute('tabindex') ?? '-1';
  }

  @HostBinding('attr.data-state')
  protected get dataState(): 'open' | 'closed' {
    return this.openState ? 'open' : 'closed';
  }

  @HostBinding('attr.hidden')
  protected get hidden(): '' | null {
    return this.openState || this.exitPresenceActive ? null : '';
  }

  @HostBinding('attr.aria-activedescendant')
  protected get ariaActiveDescendant(): string | null {
    return this.activeItemId;
  }

  setTriggerElement(triggerElement: HTMLElement, triggerStateSync?: () => void): void {
    this.triggerElement = triggerElement;
    this.triggerStateSync = triggerStateSync ?? this.triggerStateSync;
    this.syncAriaLabelledby();
  }

  clearTriggerLink(triggerElement?: HTMLElement): void {
    if (triggerElement !== undefined && this.triggerElement !== triggerElement) {
      return;
    }

    this.triggerElement = null;
    this.triggerStateSync = null;
    this.menubarArrowHandler = null;
    this.menubarTabHandler = null;
    this.syncAriaLabelledby();
  }

  setRestoreFocusOnOutsideClick(restoreFocusOnOutsideClick: boolean): void {
    this.restoreFocusOnOutsideClick = restoreFocusOnOutsideClick;
  }

  /** Keeps a styled menu renderable while its visual exit transition runs. */
  setExitPresenceActive(active: boolean): void {
    if (this.exitPresenceActive === active) {
      return;
    }

    this.exitPresenceActive = active;
    this.changeDetectorRef.markForCheck();
  }

  setMenubarArrowHandler(menubarArrowHandler: TngMenubarArrowHandler | null): void {
    this.menubarArrowHandler = menubarArrowHandler;
  }

  setMenubarTabHandler(menubarTabHandler: TngMenubarTabHandler | null): void {
    this.menubarTabHandler = menubarTabHandler;
  }

  setParentMenu(parentMenu: TngMenu, parentMenuItem: TngMenuItem): void {
    this.parentMenu = parentMenu;
    this.parentMenuItem = parentMenuItem;
  }

  focusPanel(): void {
    this.hostRef.nativeElement.focus();
  }

  focusPanelAndMoveActiveItem(action: 'next' | 'prev'): void {
    if (!this.openState) {
      return;
    }

    this.moveActiveItem(action);
    this.hostRef.nativeElement.focus();
    this.changeDetectorRef.detectChanges();
  }

  getTriggerElement(): HTMLElement | null {
    return this.triggerElement;
  }

  getParentMenu(): TngMenu | null {
    return this.parentMenu;
  }

  getOpenSubmenu(): TngMenu | null {
    return this.openSubmenu;
  }

  getHostElement(): HTMLElement {
    return this.hostRef.nativeElement;
  }

  isOpen(): boolean {
    return this.openState;
  }

  isDisabled(): boolean {
    return this.disabled();
  }

  isItemActive(itemId: string): boolean {
    return this.activeItemId === itemId;
  }

  registerItem(item: TngMenuItem): void {
    this.itemsById.set(item.getItemId(), item);
  }

  unregisterItem(item: TngMenuItem): void {
    const orderedItems = Array.from(this.itemsById.values());
    const itemIndex = orderedItems.findIndex((registeredItem) => registeredItem === item);

    if (this.itemsById.get(item.getItemId()) === item) {
      this.itemsById.delete(item.getItemId());
    }

    if (this.activeItemId === item.getItemId()) {
      this.activeItemId =
        itemIndex < 0
          ? this.resolveAdjacentEnabledItemId(item.getItemId())
          : this.resolveAdjacentEnabledItemIdFromRegisteredItems(orderedItems, itemIndex);
    }
  }

  onItemDisabledStateChange(item: TngMenuItem): void {
    if (!item.isDisabled() || this.activeItemId !== item.getItemId()) {
      return;
    }

    this.activeItemId = this.resolveAdjacentEnabledItemId(item.getItemId());
  }

  onItemNavigabilityStateChange(item: TngMenuItem): void {
    if (item.isNavigable() || this.activeItemId !== item.getItemId()) {
      return;
    }

    this.activeItemId = this.resolveAdjacentEnabledItemId(item.getItemId());
  }

  open(focusAction: TngMenuOpenFocusAction = 'none'): void {
    if (this.openState || this.disabled()) {
      return;
    }

    if (this.parentMenu === null) {
      if (TngMenu.openRootMenu !== null && TngMenu.openRootMenu !== this) {
        TngMenu.openRootMenu.close(false);
      }
    } else {
      this.parentMenu.openChildSubmenu(this);
    }

    this.openState = true;
    if (this.parentMenu === null) {
      TngMenu.openRootMenu = this;
    }

    if (focusAction === 'first') {
      this.moveActiveItem('next');
    } else if (focusAction === 'last') {
      this.moveActiveItem('prev');
    } else {
      this.activeItemId = null;
    }

    this.tngMenuOpened.emit();
    this.triggerStateSync?.();
    this.attachOutsidePointerdownListener();
    this.changeDetectorRef.detectChanges();
    if (!this.deferHostFocusUntilPositioned) {
      this.hostRef.nativeElement.focus();
    }
  }

  close(restoreFocus: boolean): void {
    if (!this.openState) {
      return;
    }

    if (this.openSubmenu !== null) {
      this.openSubmenu.close(false);
      this.openSubmenu = null;
    }

    this.openState = false;
    this.activeItemId = null;
    this.clearTypeaheadBuffer();
    this.detachOutsidePointerdownListener();
    this.triggerStateSync?.();

    if (this.parentMenu !== null) {
      this.parentMenu.notifySubmenuClosed(this);
    } else if (TngMenu.openRootMenu === this) {
      TngMenu.openRootMenu = null;
    }

    this.tngMenuClosed.emit();
    if (restoreFocus) {
      this.triggerElement?.focus();
    }

    this.changeDetectorRef.detectChanges();
  }

  ngOnDestroy(): void {
    const wasOpen = this.openState;
    this.openState = false;
    this.activeItemId = null;
    this.clearTypeaheadBuffer();
    this.detachOutsidePointerdownListener();
    this.openSubmenu = null;

    if (wasOpen) {
      if (this.parentMenu !== null) {
        this.parentMenu.notifySubmenuClosed(this);
      } else if (TngMenu.openRootMenu === this) {
        TngMenu.openRootMenu = null;
      }
      this.triggerStateSync?.();
    }

    this.clearTriggerLink();
  }

  requestSelect(item: TngMenuItem, trigger: TngMenuSelectTrigger): void {
    if (!this.openState || !item.isNavigable()) {
      return;
    }

    item.applySelectionState();
    this.activeItemId = item.getItemId();
    this.tngMenuSelect.emit({
      value: item.getValue(),
      itemId: item.getItemId(),
      trigger,
    });

    if (this.closeOnSelect()) {
      this.closeSelfAndAncestorMenus(true);
    }
  }

  setActiveItem(item: TngMenuItem): void {
    if (!this.openState || !item.isNavigable()) {
      return;
    }

    this.activeItemId = item.getItemId();
    this.syncOpenSubmenuWithActiveItem();
    this.changeDetectorRef.detectChanges();
  }

  setSelectedRadioItem(selectedItem: TngMenuItem): void {
    for (const item of this.itemsById.values()) {
      if (item.getRole() !== 'menuitemradio') {
        continue;
      }

      item.setCheckedState(item === selectedItem);
    }
  }

  openChildSubmenu(submenu: TngMenu): void {
    if (this.openSubmenu !== null && this.openSubmenu !== submenu) {
      this.openSubmenu.close(false);
    }

    this.openSubmenu = submenu;
  }

  notifySubmenuClosed(submenu: TngMenu): void {
    if (this.openSubmenu === submenu) {
      this.openSubmenu = null;
    }
  }

  private closeSelfAndAncestorMenus(restoreFocusAtRoot: boolean): void {
    let menuToClose: TngMenu | null = this;

    while (menuToClose !== null) {
      const nextAncestorMenu: TngMenu | null = menuToClose.parentMenu;
      const shouldRestoreFocus = nextAncestorMenu === null && restoreFocusAtRoot;
      menuToClose.close(shouldRestoreFocus);
      menuToClose = nextAncestorMenu;
    }
  }

  private getEnabledMenuItems(): readonly ReadonlyMenuItemElement[] {
    const items = Array.from(
      this.hostRef.nativeElement.querySelectorAll<MenuItemElement>('[tngMenuItem]'),
    );
    const enabledItems: ReadonlyMenuItemElement[] = [];

    for (const item of items) {
      if (this.isNavigableItemElement(item)) {
        enabledItems.push(item);
      }
    }

    return enabledItems;
  }

  private resolveAdjacentEnabledItemId(referenceItemId: string): string | null {
    const items = Array.from(
      this.hostRef.nativeElement.querySelectorAll<MenuItemElement>('[tngMenuItem]'),
    );
    if (items.length === 0) {
      return null;
    }

    const referenceIndex = items.findIndex((item) => item.id === referenceItemId);
    if (referenceIndex < 0) {
      return this.getEnabledMenuItems()[0]?.id ?? null;
    }

    for (let index = referenceIndex + 1; index < items.length; index += 1) {
      const candidate = items[index];
      if (this.isNavigableItemElement(candidate)) {
        return candidate.id;
      }
    }

    for (let index = referenceIndex - 1; index >= 0; index -= 1) {
      const candidate = items[index];
      if (this.isNavigableItemElement(candidate)) {
        return candidate.id;
      }
    }

    return null;
  }

  private resolveAdjacentEnabledItemIdFromRegisteredItems(
    items: readonly TngMenuItem[],
    referenceIndex: number,
  ): string | null {
    for (let index = referenceIndex + 1; index < items.length; index += 1) {
      const candidate = items[index];
      if (candidate.isNavigable() && this.itemsById.get(candidate.getItemId()) === candidate) {
        return candidate.getItemId();
      }
    }

    for (let index = referenceIndex - 1; index >= 0; index -= 1) {
      const candidate = items[index];
      if (candidate.isNavigable() && this.itemsById.get(candidate.getItemId()) === candidate) {
        return candidate.getItemId();
      }
    }

    return null;
  }

  private isNavigableItemElement(item: MenuItemElement): boolean {
    const registeredItem = this.itemsById.get(item.id);
    return registeredItem !== undefined && registeredItem.isNavigable();
  }

  private onDocumentPointerdown(event: TngMenuPointerEvent): void {
    if (!this.openState || !this.dismissOnOutsideClick()) {
      return;
    }

    const target = event.target;
    if (!(target instanceof Node)) {
      return;
    }

    if (this.isTargetInsideOpenMenuTree(target)) {
      return;
    }

    const owningMenubar = this.triggerElement?.closest<HTMLElement>('[data-slot="menubar"]');
    if (owningMenubar?.contains(target) === true) {
      this.close(false);
      return;
    }

    this.close(this.restoreFocusOnOutsideClick);
  }

  private isTargetInsideOpenMenuTree(target: Node): boolean {
    if (this.hostRef.nativeElement.contains(target)) {
      return true;
    }

    if (this.triggerElement?.contains(target) === true) {
      return true;
    }

    return this.openSubmenu?.isTargetInsideOpenMenuTree(target) ?? false;
  }

  @HostListener('focusout', ['$event'])
  protected onFocusout(event: FocusEvent): void {
    if (!this.openState || !this.dismissOnFocusout()) {
      return;
    }

    const relatedTarget = event.relatedTarget;
    if (relatedTarget instanceof Node && this.hostRef.nativeElement.contains(relatedTarget)) {
      return;
    }

    this.close(false);
  }

  private attachOutsidePointerdownListener(): void {
    this.detachOutsidePointerdownListener();

    if (!this.dismissOnOutsideClick()) {
      return;
    }

    const handler = (event: PointerEvent): void => {
      this.onDocumentPointerdown(event);
    };

    this.ngZone.runOutsideAngular(() => {
      document.addEventListener('pointerdown', handler);
      this.outsidePointerdownCleanup = () => {
        document.removeEventListener('pointerdown', handler);
      };
    });
  }

  private syncAriaLabelledby(): void {
    const triggerId = this.triggerElement?.id;

    if (triggerId === undefined || triggerId.length === 0) {
      this.hostRef.nativeElement.removeAttribute('aria-labelledby');
      return;
    }

    this.hostRef.nativeElement.setAttribute('aria-labelledby', triggerId);
  }

  private detachOutsidePointerdownListener(): void {
    this.outsidePointerdownCleanup?.();
    this.outsidePointerdownCleanup = null;
  }

  private moveActiveItem(action: TngMenuFocusAction): void {
    const items = this.getEnabledMenuItems();
    if (items.length === 0) {
      this.activeItemId = null;
      return;
    }

    let currentIndex = -1;
    for (let index = 0; index < items.length; index += 1) {
      if (items[index].id === this.activeItemId) {
        currentIndex = index;
        break;
      }
    }

    const targetIndex = resolveFocusIndex(action, currentIndex, items.length, this.loop());
    this.activeItemId = items[targetIndex]?.id ?? null;
    this.syncOpenSubmenuWithActiveItem();
  }

  private syncOpenSubmenuWithActiveItem(): void {
    if (this.openSubmenu !== null && this.parentMenuItem?.getOwnedSubmenu() !== this.openSubmenu) {
      // no-op safeguard for submenu instances
    }

    const activeItem =
      this.activeItemId === null ? null : (this.itemsById.get(this.activeItemId) ?? null);
    if (this.openSubmenu !== null && activeItem !== this.openSubmenu.parentMenuItem) {
      this.openSubmenu.close(false);
    }
  }

  private moveActiveItemByTypeahead(key: string): boolean {
    const items = this.getEnabledMenuItems();
    if (items.length === 0) {
      return false;
    }

    const normalizedKey = key.trim().toLowerCase();
    if (normalizedKey.length !== 1) {
      return false;
    }

    const repeatingSingleChar =
      this.typeaheadBuffer.length > 0 &&
      this.typeaheadBuffer.split('').every((char) => char === normalizedKey);

    let query = repeatingSingleChar ? normalizedKey : `${this.typeaheadBuffer}${normalizedKey}`;
    let match = this.findTypeaheadMatch(items, query, repeatingSingleChar);

    if (match === null && query !== normalizedKey) {
      query = normalizedKey;
      match = this.findTypeaheadMatch(items, query, true);
    }

    if (match === null) {
      return false;
    }

    this.activeItemId = match.id;
    this.resetTypeaheadBuffer(query);
    return true;
  }

  private findTypeaheadMatch(
    items: readonly ReadonlyMenuItemElement[],
    query: string,
    cycleFromActiveItem: boolean,
  ): ReadonlyMenuItemElement | null {
    const currentIndex = items.findIndex((item) => item.id === this.activeItemId);
    const startIndex =
      cycleFromActiveItem && currentIndex >= 0 ? (currentIndex + 1) % items.length : 0;

    for (let offset = 0; offset < items.length; offset += 1) {
      const index = (startIndex + offset) % items.length;
      const item = items[index];
      const label = item.textContent?.trim().toLowerCase() ?? '';

      if (label.startsWith(query)) {
        return item;
      }
    }

    return null;
  }

  private resetTypeaheadBuffer(nextBuffer: string): void {
    this.typeaheadBuffer = nextBuffer;

    if (this.typeaheadResetHandle !== null) {
      clearTimeout(this.typeaheadResetHandle);
    }

    this.typeaheadResetHandle = setTimeout(() => {
      this.typeaheadBuffer = '';
      this.typeaheadResetHandle = null;
    }, TYPEAHEAD_RESET_MS);
  }

  private clearTypeaheadBuffer(): void {
    this.typeaheadBuffer = '';

    if (this.typeaheadResetHandle !== null) {
      clearTimeout(this.typeaheadResetHandle);
      this.typeaheadResetHandle = null;
    }
  }

  private isEventFromNestedMenu(event: TngMenuKeyboardEvent): boolean {
    const target = event.target;
    if (!(target instanceof Element)) {
      return false;
    }

    const closestMenu = target.closest<HTMLElement>('[data-slot="menu"]');
    return closestMenu !== null && closestMenu !== this.hostRef.nativeElement;
  }

  @HostListener('keydown', ['$event'])
  protected onKeydown(event: TngMenuKeyboardEvent): void {
    if (this.isEventFromNestedMenu(event)) {
      return;
    }

    if (event.key === 'Escape') {
      event.preventDefault();
      if (this.parentMenu !== null) {
        this.close(false);
        this.parentMenu.focusPanel();
        return;
      }
      this.close(true);
      return;
    }

    if (event.key === 'Tab') {
      if (
        this.parentMenu === null &&
        this.menubarTabHandler !== null &&
        this.menubarTabHandler(event.shiftKey)
      ) {
        event.preventDefault();
        return;
      }

      this.close(false);
      return;
    }

    if (event.key === 'ArrowRight') {
      const activeItem =
        this.activeItemId === null ? null : (this.itemsById.get(this.activeItemId) ?? null);
      if (activeItem !== null && activeItem.getOwnedSubmenu() !== null) {
        event.preventDefault();
        activeItem.openOwnedSubmenu('first');
      } else if (this.parentMenu === null && this.menubarArrowHandler !== null) {
        event.preventDefault();
        this.menubarArrowHandler('ArrowRight');
      }
      return;
    }

    if (event.key === 'ArrowLeft') {
      if (this.parentMenu !== null) {
        event.preventDefault();
        this.close(false);
        this.parentMenu.focusPanel();
      } else if (this.menubarArrowHandler !== null) {
        event.preventDefault();
        this.menubarArrowHandler('ArrowLeft');
      }
      return;
    }

    if (event.key === 'Enter' || event.key === ' ') {
      const activeItem =
        this.activeItemId === null ? null : (this.itemsById.get(this.activeItemId) ?? null);
      if (activeItem !== null) {
        event.preventDefault();
        if (activeItem.getOwnedSubmenu() !== null) {
          activeItem.openOwnedSubmenu('first');
        } else {
          this.requestSelect(activeItem, 'keyboard');
        }
      }
      return;
    }

    const action = resolveMenuFocusAction(event.key);
    if (action === null) {
      if (event.key.length === 1 && this.moveActiveItemByTypeahead(event.key)) {
        event.preventDefault();
      }
      return;
    }
    event.preventDefault();
    this.moveActiveItem(action);
  }
}

@Directive({
  selector: '[tngMenuItem]',
  exportAs: 'tngMenuItem',
})
export class TngMenuItem {
  private readonly hostRef = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly menu = inject(TngMenu, { optional: true, skipSelf: true });
  private readonly resolvedId = this.hostRef.nativeElement.getAttribute('id') ?? createMenuItemId();
  private lastDisabledState = false;
  private lastNavigableState = true;
  private lastCheckedInput = false;
  private checkedOverride: boolean | null = null;

  readonly value = input<unknown>(undefined, {
    alias: 'tngMenuItemValue',
  });
  readonly itemRole = input<TngMenuItemRole>('menuitem', {
    alias: 'tngMenuItemRole',
  });
  readonly checked = input<boolean>(false, {
    alias: 'tngMenuItemChecked',
  });
  readonly submenu = input<TngMenu | null>(null, {
    alias: 'tngMenuItemSubmenu',
  });

  constructor() {
    this.lastDisabledState = this.isDisabled();
    this.lastNavigableState = this.isNavigable();
    this.menu?.registerItem(this);
  }

  ngOnInit(): void {
    this.syncHostId();
    this.lastCheckedInput = this.checked();
    this.syncOwnedSubmenuLink();
    this.syncSubmenuState();
  }

  @HostBinding('attr.data-slot')
  protected readonly dataSlot = 'menu-item' as const;

  @HostBinding('attr.role')
  protected get role(): TngMenuItemRole {
    return this.itemRole();
  }

  @HostBinding('attr.id')
  protected readonly id = this.resolvedId;

  @HostBinding('attr.tabindex')
  protected readonly tabIndex = -1;

  @HostBinding('attr.aria-disabled')
  protected get ariaDisabled(): 'true' | null {
    return this.isDisabled() ? 'true' : null;
  }

  @HostBinding('attr.aria-checked')
  protected get ariaChecked(): 'true' | 'false' | null {
    if (this.itemRole() === 'menuitem') {
      return null;
    }

    return this.isChecked() ? 'true' : 'false';
  }

  @HostBinding('attr.data-active')
  protected get dataActive(): '' | null {
    return this.menu?.isItemActive(this.id) ? '' : null;
  }

  @HostBinding('attr.aria-haspopup')
  protected get ariaHaspopup(): 'menu' | null {
    return this.submenu() === null ? null : 'menu';
  }

  @HostBinding('attr.aria-controls')
  protected get ariaControls(): string | null {
    return this.submenu()?.id ?? null;
  }

  @HostListener('click', ['$event'])
  protected onClick(event: MouseEvent): void {
    if (this.shouldIgnoreNestedInteractiveClick(event)) {
      return;
    }

    if (this.submenu() !== null) {
      this.menu?.setActiveItem(this);
      this.openOwnedSubmenu('first');
      return;
    }

    this.select('pointer');
  }

  @HostListener('pointerenter', ['$event'])
  protected onPointerenter(event: TngMenuPointerEnterEvent): void {
    if (event.pointerType === 'touch' || !this.isNavigable()) {
      return;
    }

    this.menu?.setActiveItem(this);

    if (this.submenu() !== null) {
      this.openOwnedSubmenu('first');
    }
  }

  ngOnDestroy(): void {
    this.menu?.unregisterItem(this);
  }

  ngDoCheck(): void {
    const currentDisabledState = this.isDisabled();
    if (currentDisabledState !== this.lastDisabledState) {
      this.lastDisabledState = currentDisabledState;
      this.menu?.onItemDisabledStateChange(this);
    }

    const currentNavigableState = this.isNavigable();
    if (currentNavigableState !== this.lastNavigableState) {
      this.lastNavigableState = currentNavigableState;
      this.menu?.onItemNavigabilityStateChange(this);
    }

    const currentCheckedInput = this.checked();
    if (currentCheckedInput !== this.lastCheckedInput) {
      this.lastCheckedInput = currentCheckedInput;
      this.checkedOverride = null;
    }
  }

  getItemId(): string {
    return this.id;
  }

  getValue(): unknown {
    return this.value();
  }

  getOwnedSubmenu(): TngMenu | null {
    return this.submenu();
  }

  getRole(): TngMenuItemRole {
    return this.itemRole();
  }

  isDisabled(): boolean {
    const element = this.hostRef.nativeElement as HTMLElement & {
      disabled?: boolean;
    };

    return element.disabled || element.hasAttribute('disabled');
  }

  isNavigable(): boolean {
    return !this.isDisabled() && !this.isHiddenOrInert();
  }

  select(trigger: TngMenuSelectTrigger): void {
    this.menu?.requestSelect(this, trigger);
  }

  isChecked(): boolean {
    return this.checkedOverride ?? this.checked();
  }

  setCheckedState(checked: boolean): void {
    this.checkedOverride = checked;
  }

  applySelectionState(): void {
    if (this.itemRole() === 'menuitemcheckbox') {
      this.checkedOverride = !this.isChecked();
      return;
    }

    if (this.itemRole() === 'menuitemradio') {
      this.menu?.setSelectedRadioItem(this);
    }
  }

  openOwnedSubmenu(focusAction: TngMenuOpenFocusAction): void {
    const submenu = this.submenu();
    if (submenu === null) {
      return;
    }

    this.syncOwnedSubmenuLink();
    submenu.open(focusAction);
  }

  private syncOwnedSubmenuLink(): void {
    const submenu = this.submenu();
    if (submenu === null || this.menu === null) {
      return;
    }

    this.syncHostId();
    submenu.setTriggerElement(this.hostRef.nativeElement, () => this.syncSubmenuState());
    submenu.setRestoreFocusOnOutsideClick(false);
    submenu.setParentMenu(this.menu, this);
  }

  private syncHostId(): void {
    if (this.hostRef.nativeElement.id === this.id) {
      return;
    }

    this.hostRef.nativeElement.id = this.id;
  }

  private syncSubmenuState(): void {
    const submenu = this.submenu();
    if (submenu === null) {
      this.hostRef.nativeElement.removeAttribute('aria-expanded');
      return;
    }

    this.hostRef.nativeElement.setAttribute('aria-expanded', submenu.isOpen() ? 'true' : 'false');
  }

  private shouldIgnoreNestedInteractiveClick(event: MouseEvent): boolean {
    const target = event.target;
    if (!(target instanceof Element)) {
      return false;
    }

    const host = this.hostRef.nativeElement;
    const interactiveTarget = target.closest(
      'button, input, select, textarea, a[href], [role="button"], [role="link"], [role="menuitem"], [role="menuitemcheckbox"], [role="menuitemradio"]',
    );

    return interactiveTarget !== null && interactiveTarget !== host;
  }

  private isHiddenOrInert(): boolean {
    const element = this.hostRef.nativeElement as HTMLElement & {
      inert?: boolean;
    };

    return (
      element.hidden ||
      Boolean(element.inert) ||
      element.hasAttribute('hidden') ||
      element.hasAttribute('inert')
    );
  }
}

@Directive({
  selector: '[tngMenuSeparator]',
  exportAs: 'tngMenuSeparator',
})
export class TngMenuSeparator {
  @HostBinding('attr.data-slot')
  protected readonly dataSlot = 'menu-separator' as const;

  @HostBinding('attr.role')
  protected readonly role = 'separator' as const;
}

@Directive({
  selector: '[tngMenuGroupLabel]',
  exportAs: 'tngMenuGroupLabel',
})
export class TngMenuGroupLabel {
  @HostBinding('attr.data-slot')
  protected readonly dataSlot = 'menu-group-label' as const;

  @HostBinding('attr.role')
  protected readonly role = 'presentation' as const;
}

@Directive({
  selector: '[tngMenuBackdrop]',
  exportAs: 'tngMenuBackdrop',
})
export class TngMenuBackdrop {
  readonly menu = input<TngMenu | null>(null, {
    alias: 'tngMenuBackdrop',
  });

  @HostBinding('attr.data-slot')
  protected readonly dataSlot = 'menu-backdrop' as const;

  @HostListener('click')
  protected onClick(): void {
    const menu = this.menu();
    if (menu?.isOpen()) {
      menu.close(false);
    }
  }
}

@Directive({
  selector: '[tngMenuTrigger]',
  exportAs: 'tngMenuTrigger',
})
export class TngMenuTrigger {
  private readonly hostRef = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly resolvedId =
    this.hostRef.nativeElement.getAttribute('id') ?? createMenuTriggerId();
  private linkedMenu: TngMenu | null = null;

  readonly menu = input<TngMenu | null>(null, {
    alias: 'tngMenuTrigger',
  });

  @HostBinding('attr.data-slot')
  protected readonly dataSlot = 'menu-trigger' as const;

  @HostBinding('attr.id')
  protected readonly id = this.resolvedId;

  @HostBinding('attr.aria-haspopup')
  protected readonly ariaHaspopup = 'menu' as const;

  @HostBinding('attr.aria-controls')
  protected get ariaControls(): string | null {
    return this.menu()?.id ?? null;
  }

  ngOnInit(): void {
    this.syncHostId();
    this.syncMenuLink();
    this.syncAriaExpanded();
  }

  ngDoCheck(): void {
    this.syncHostId();
    this.syncMenuLink();
    this.syncAriaExpanded();
  }

  ngOnDestroy(): void {
    if (this.linkedMenu === null) {
      return;
    }

    const linkedMenu = this.linkedMenu;
    linkedMenu.clearTriggerLink(this.hostRef.nativeElement);

    if (linkedMenu.isOpen()) {
      linkedMenu.close(false);
    }

    this.linkedMenu = null;
  }

  @HostListener('click')
  protected onClick(): void {
    if (this.isDisabled()) {
      return;
    }

    const menu = this.syncMenuLink();
    if (menu === null || menu.isDisabled()) {
      return;
    }

    if (menu.isOpen()) {
      menu.close(true);
      return;
    }

    this.openMenu('none');
  }

  @HostListener('keydown', ['$event'])
  protected onKeydown(event: TngMenuKeyboardEvent): void {
    if (this.isDisabled()) {
      return;
    }

    const menu = this.syncMenuLink();

    switch (event.key) {
      case 'Enter':
      case ' ':
        if (menu === null || menu.isDisabled()) {
          return;
        }
        event.preventDefault();
        this.openMenu('none');
        return;
      case 'ArrowDown':
        if (menu === null || menu.isDisabled()) {
          return;
        }
        event.preventDefault();
        this.openMenu('first');
        return;
      case 'ArrowUp':
        if (menu === null || menu.isDisabled()) {
          return;
        }
        event.preventDefault();
        this.openMenu('last');
        return;
      case 'Escape':
        if (menu?.isOpen()) {
          event.preventDefault();
          menu.close(true);
        }
        return;
      default:
        return;
    }
  }

  private openMenu(focusAction: TngMenuOpenFocusAction): void {
    const menu = this.syncMenuLink();
    if (menu === null) {
      return;
    }

    menu.open(focusAction);
  }

  private syncAriaExpanded(): void {
    const menu = this.menu();
    if (menu === null) {
      this.hostRef.nativeElement.removeAttribute('aria-expanded');
      return;
    }

    this.hostRef.nativeElement.setAttribute('aria-expanded', menu.isOpen() ? 'true' : 'false');
  }

  private syncHostId(): void {
    if (this.hostRef.nativeElement.id === this.id) {
      return;
    }

    this.hostRef.nativeElement.id = this.id;
  }

  private isDisabled(): boolean {
    const element = this.hostRef.nativeElement as HTMLElement & {
      disabled?: boolean;
    };

    return (
      element.disabled ||
      element.hasAttribute('disabled') ||
      element.getAttribute('aria-disabled') === 'true'
    );
  }

  private syncMenuLink(): TngMenu | null {
    const menu = this.menu();
    if (menu === null) {
      this.linkedMenu?.clearTriggerLink(this.hostRef.nativeElement);
      this.linkedMenu = null;
      return null;
    }

    if (this.linkedMenu === menu) {
      return menu;
    }

    this.linkedMenu?.clearTriggerLink(this.hostRef.nativeElement);

    this.linkedMenu = menu;
    menu.setTriggerElement(this.hostRef.nativeElement, () => this.syncAriaExpanded());
    menu.setRestoreFocusOnOutsideClick(false);
    this.syncAriaExpanded();
    return menu;
  }
}
