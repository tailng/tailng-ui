import type { RegistryItem } from '../registry.types';

const menuPrimitiveTsTemplate = `import { Directive, ElementRef, HostBinding, HostListener, inject } from '@angular/core';

type MenuItemElement = HTMLElement;

function getEnabledMenuItems(host: HTMLElement): readonly MenuItemElement[] {
  return [...host.querySelectorAll<MenuItemElement>('[role="menuitem"]')].filter(
    (element) => element.getAttribute('aria-disabled') !== 'true',
  );
}

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

@Directive({
  selector: '[tngMenu]',
  exportAs: 'tngMenu',
})
export class TngMenuPrimitive {
  private readonly hostRef = inject<ElementRef<HTMLElement>>(ElementRef);

  @HostBinding('attr.data-slot')
  protected readonly dataSlot = 'menu' as const;

  @HostBinding('attr.role')
  protected readonly role = 'menu' as const;

  @HostListener('keydown', ['$event'])
  protected onKeydown(event: KeyboardEvent): void {
    const items = getEnabledMenuItems(this.hostRef.nativeElement);
    if (items.length === 0) {
      return;
    }

    const currentIndex = items.findIndex((item) => item === document.activeElement);

    if (event.key === 'ArrowDown') {
      event.preventDefault();
      items[getNextIndex(currentIndex, items.length)]?.focus();
      return;
    }

    if (event.key === 'ArrowUp') {
      event.preventDefault();
      items[getPrevIndex(currentIndex, items.length)]?.focus();
      return;
    }

    if (event.key === 'Home') {
      event.preventDefault();
      items[0]?.focus();
      return;
    }

    if (event.key === 'End') {
      event.preventDefault();
      items[items.length - 1]?.focus();
    }
  }
}
`;

const triggerTargetTsTemplate = `import { InjectionToken } from '@angular/core';

export type TngTriggerTargetAttributes = Readonly<{
  ariaControls?: string | null;
  ariaExpanded?: boolean | null;
  ariaHasPopup?: string | null;
}>;

export interface TngTriggerTarget {
  getTngTriggerElement(): HTMLElement | null;
  setTngTriggerAttributes(attributes: TngTriggerTargetAttributes): void;
}

export const TNG_TRIGGER_TARGET = new InjectionToken<TngTriggerTarget>('TNG_TRIGGER_TARGET');
`;

const menuComponentTsTemplate = `import {
  Component,
  ElementRef,
  HostListener,
  inject,
  input,
  signal,
  viewChild,
} from '@angular/core';
import { TngMenuPrimitive } from './tng-menu-primitive';

const menuPanelIdPrefix = 'tng-menu-panel-';

let menuPanelIdSequence = 0;

type TngMenuTriggerStateSync = () => void;

function createMenuPanelId(): string {
  menuPanelIdSequence += 1;
  return \`\${menuPanelIdPrefix}\${menuPanelIdSequence}\`;
}

function resolveFirstEnabledMenuItem(panel: HTMLUListElement | undefined): HTMLElement | null {
  if (panel === undefined) {
    return null;
  }

  const items = Array.from(panel.querySelectorAll<HTMLElement>('[role="menuitem"]'));
  for (const item of items) {
    if (item.getAttribute('aria-disabled') !== 'true') {
      return item;
    }
  }

  return null;
}

@Component({
  selector: 'tng-menu',
  imports: [TngMenuPrimitive],
  templateUrl: './tng-menu.html',
  styleUrl: './tng-menu.css',
  exportAs: 'tngMenu',
})
export class TngMenu {
  public readonly ariaLabel = input<string>('Menu');
  protected readonly open = signal(false);
  protected readonly panelId = createMenuPanelId();

  private readonly hostRef = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly panelRef = viewChild<ElementRef<HTMLUListElement>>('panelRef');
  private readonly triggerElements = new Set<HTMLElement>();
  private readonly triggerStateSyncs = new Map<HTMLElement, TngMenuTriggerStateSync>();

  public closeMenu(): void {
    if (!this.open()) {
      return;
    }

    this.open.set(false);
    this.syncTriggerState();
  }

  public getPanelId(): string {
    return this.panelId;
  }

  public isOpen(): boolean {
    return this.open();
  }

  public openMenu(): void {
    if (this.open()) {
      return;
    }

    this.open.set(true);
    this.syncTriggerState();
    queueMicrotask((): void => {
      const panel = this.panelRef()?.nativeElement;
      const firstMenuItem = resolveFirstEnabledMenuItem(panel);
      if (firstMenuItem !== null) {
        firstMenuItem.focus();
        return;
      }

      panel?.focus();
    });
  }

  public registerTrigger(trigger: HTMLElement, syncTriggerState?: TngMenuTriggerStateSync): void {
    this.triggerElements.add(trigger);
    if (syncTriggerState !== undefined) {
      this.triggerStateSyncs.set(trigger, syncTriggerState);
    }
  }

  public toggleMenu(): void {
    if (this.open()) {
      this.closeMenu();
      return;
    }

    this.openMenu();
  }

  public unregisterTrigger(trigger: HTMLElement): void {
    this.triggerElements.delete(trigger);
    this.triggerStateSyncs.delete(trigger);
  }

  private syncTriggerState(): void {
    for (const syncTriggerState of this.triggerStateSyncs.values()) {
      syncTriggerState();
    }
  }

  @HostListener('document:click', ['$event'])
  protected onDocumentClick(event: unknown): void {
    if (!this.open()) {
      return;
    }

    if (!(event instanceof Event)) {
      return;
    }

    const target = event.target;
    if (!(target instanceof Node)) {
      return;
    }

    if (this.hostRef.nativeElement.contains(target)) {
      return;
    }

    for (const trigger of this.triggerElements) {
      if (trigger.contains(target)) {
        return;
      }
    }

    this.closeMenu();
  }

  @HostListener('document:keydown.escape')
  protected onEscapeKeydown(): void {
    this.closeMenu();
  }
}
`;

const menuTriggerDirectiveTsTemplate = `import {
  Directive,
  ElementRef,
  HostListener,
  effect,
  inject,
  input,
} from '@angular/core';
import type { TngMenu } from './tng-menu';
import { TNG_TRIGGER_TARGET, type TngTriggerTargetAttributes } from '../tng-trigger-target';

type TngMenuTriggerKeyboardEvent = Readonly<Pick<KeyboardEvent, 'key'>> &
  Readonly<{ preventDefault: () => void }>;

let menuTriggerIdSequence = 0;

function createMenuTriggerId(): string {
  menuTriggerIdSequence += 1;
  return \`tng-menu-trigger-\${menuTriggerIdSequence}\`;
}

function shouldOpenMenuForKey(key: string): boolean {
  return key === 'ArrowDown' || key === 'Enter' || key === ' ';
}

@Directive({
  selector: '[tngMenuTriggerFor]',
  exportAs: 'tngMenuTriggerFor',
})
export class TngMenuTriggerFor {
  public readonly tngMenuTriggerFor = input.required<TngMenu>();

  private readonly hostRef = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly triggerTarget = inject(TNG_TRIGGER_TARGET, { optional: true, self: true });

  public constructor() {
    effect((onCleanup): void => {
      const menu = this.tngMenuTriggerFor();
      const trigger = this.triggerTarget?.getTngTriggerElement() ?? this.hostRef.nativeElement;
      const generatedTriggerId = this.ensureTriggerId(trigger);
      this.setTriggerAttributes(trigger, {
        ariaHasPopup: 'menu',
      });
      menu.registerTrigger(trigger, () => this.syncAriaState(trigger));
      this.syncAriaState(trigger);

      onCleanup((): void => {
        menu.unregisterTrigger(trigger);
        this.setTriggerAttributes(trigger, {
          ariaHasPopup: null,
          ariaControls: null,
          ariaExpanded: null,
        });
        if (generatedTriggerId) {
          trigger.removeAttribute('id');
        }
      });
    });
  }

  @HostListener('click')
  protected onClick(): void {
    this.tngMenuTriggerFor().toggleMenu();
    this.syncAriaState(this.resolveTriggerElement());
  }

  @HostListener('keydown', ['$event'])
  protected onKeydown(event: TngMenuTriggerKeyboardEvent): void {
    if (!shouldOpenMenuForKey(event.key)) {
      return;
    }

    event.preventDefault();
    this.tngMenuTriggerFor().openMenu();
    this.syncAriaState(this.resolveTriggerElement());
  }

  private resolveTriggerElement(): HTMLElement {
    return this.triggerTarget?.getTngTriggerElement() ?? this.hostRef.nativeElement;
  }

  private syncAriaState(trigger: HTMLElement): void {
    const menu = this.tngMenuTriggerFor();
    const panelId = menu.isOpen() ? menu.getPanelId() : null;
    this.setTriggerAttributes(trigger, {
      ariaControls: panelId,
      ariaExpanded: menu.isOpen(),
    });
  }

  private ensureTriggerId(trigger: HTMLElement): boolean {
    if (trigger.id.length > 0) {
      return false;
    }

    trigger.id = createMenuTriggerId();
    return true;
  }

  private setTriggerAttributes(trigger: HTMLElement, attributes: TngTriggerTargetAttributes): void {
    if (this.triggerTarget !== null) {
      this.triggerTarget.setTngTriggerAttributes(attributes);
      return;
    }

    if ('ariaHasPopup' in attributes) {
      this.setOrRemoveAttribute(trigger, 'aria-haspopup', attributes.ariaHasPopup);
    }

    if ('ariaControls' in attributes) {
      this.setOrRemoveAttribute(trigger, 'aria-controls', attributes.ariaControls);
    }

    if ('ariaExpanded' in attributes) {
      this.setOrRemoveAttribute(
        trigger,
        'aria-expanded',
        attributes.ariaExpanded === null || attributes.ariaExpanded === undefined
          ? null
          : attributes.ariaExpanded
            ? 'true'
            : 'false',
      );
    }
  }

  private setOrRemoveAttribute(
    trigger: HTMLElement,
    name: string,
    value: boolean | string | null | undefined,
  ): void {
    if (value === null || value === undefined) {
      trigger.removeAttribute(name);
      return;
    }

    trigger.setAttribute(name, String(value));
  }
}
`;

const menuTemplateHtml = `@if (open()) {
  <ul
    #panelRef
    tngMenu
    class="tng-menu tng-menu--panel"
    [attr.aria-label]="ariaLabel()"
    [id]="panelId"
    tabindex="-1"
  >
    <ng-content />
  </ul>
}
`;

const menuTemplateCss = `:host {
  display: contents;
}

.tng-menu {
  border: 1px solid #cbd5e1;
  border-radius: 0.75rem;
  display: grid;
  gap: 0.25rem;
  list-style: none;
  margin: 0;
  max-width: 18rem;
  padding: 0.4rem;
}

.tng-menu--panel {
  inset-block-start: calc(100% + var(--tng-menu-offset, 0.4rem));
  inset-inline-start: 0;
  position: absolute;
  z-index: var(--tng-menu-z-index, 200);
}

.tng-menu :where([role='menuitem']) {
  align-items: center;
  border-radius: 0.5rem;
  cursor: pointer;
  display: flex;
  min-height: 2.25rem;
  padding: 0 0.7rem;
}
`;

const menuIndexTsTemplate = `export * from './tng-menu';
export * from './tng-menu-primitive';
export * from './tng-menu-trigger-for';
`;

export const menuRegistryItem = {
  dependencies: [],
  description: 'Shadcn-style source files for menu primitive and styled wrapper.',
  install: {
    importPath: './tailng-ui/menu',
    importSymbols: ['TngMenu', 'TngMenuTriggerFor', 'TngMenuPrimitive'],
  },
  files: [
    {
      content: triggerTargetTsTemplate,
      path: 'src/app/tailng-ui/tng-trigger-target.ts',
    },
    {
      content: menuPrimitiveTsTemplate,
      path: 'src/app/tailng-ui/menu/tng-menu-primitive.ts',
    },
    {
      content: menuComponentTsTemplate,
      path: 'src/app/tailng-ui/menu/tng-menu.ts',
    },
    {
      content: menuTemplateHtml,
      path: 'src/app/tailng-ui/menu/tng-menu.html',
    },
    {
      content: menuTemplateCss,
      path: 'src/app/tailng-ui/menu/tng-menu.css',
    },
    {
      content: menuTriggerDirectiveTsTemplate,
      path: 'src/app/tailng-ui/menu/tng-menu-trigger-for.ts',
    },
    {
      content: menuIndexTsTemplate,
      path: 'src/app/tailng-ui/menu/index.ts',
    },
  ],
  name: 'menu',
} satisfies RegistryItem;
