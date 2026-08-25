
import { createSelectionModel, type TngSelectionMode } from '@tailng-ui/cdk/collections';
import { createActiveDescendantController } from '../active-descendant/active-descendant';
import type { TngActiveDescendantController } from '../active-descendant/active-descendant.types';

import { resolveListNavigationKeyAction } from '../list-navigation/list-navigation';
import type {
  TngListNavigationKeyboardEvent,
  TngListNavigationAction,
} from '../list-navigation/list-navigation.types';
export type TngListboxSelectionMode = 'single' | 'multiple';

export type TngListboxOption<T> = Readonly<{
  id: string;
  value: T;
  disabled?: boolean;
  // for typeahead
  text?: string;
}>;

export type TngListboxConfig = Readonly<{
  hostId: string;
  selectionMode?: TngListboxSelectionMode;
  orientation?: 'vertical' | 'horizontal';
  direction?: 'ltr' | 'rtl';
  loop?: boolean;
  disabled?: boolean;
}>;

export type TngListboxController<T> = Readonly<{
  registerOption: (option: TngListboxOption<T>) => void;
  unregisterOption: (id: string) => void;

  setOptionDisabled: (id: string, disabled: boolean) => void;

  setItemOrder: (ids: readonly string[]) => void;

  setActiveId: (id: string | null) => void;
  typeahead: (key: string) => boolean;

  handleKeyDown: (event: TngListNavigationKeyboardEvent) => TngListNavigationAction | null;
  handleClick: (id: string, shiftKey?: boolean) => void;

  getActiveId: () => string | null;
  getSelectedValues: () => readonly T[];

  getHostAttributes: () => Readonly<Record<string, string>>;
  getOptionAttributes: (id: string) => Readonly<Record<string, unknown>>;

  getSelectedIds: () => readonly string[];
  setSelectedIds: (ids: readonly string[]) => void;
  clearSelection: () => void;
}>;

function toSelectionMode(mode: TngListboxSelectionMode | undefined): TngSelectionMode {
  return mode === 'multiple' ? 'multiple' : 'single';
}

type NormalizedListboxConfig = Readonly<{
  hostId: string;
  selectionMode: TngSelectionMode;
  orientation: 'vertical' | 'horizontal';
  direction: 'ltr' | 'rtl';
  loop: boolean;
  disabled: boolean;
}>;

function normalizeListboxConfig(config: TngListboxConfig): NormalizedListboxConfig {
  return {
    hostId: config.hostId,
    selectionMode: toSelectionMode(config.selectionMode),
    orientation: config.orientation ?? 'vertical',
    direction: config.direction ?? 'ltr',
    loop: config.loop ?? true,
    disabled: config.disabled ?? false,
  };
}

export class ListboxController<T> {
  
  private readonly cfg: NormalizedListboxConfig;
  private readonly focusController: TngActiveDescendantController
  private readonly selectionModel: ReturnType<typeof createSelectionModel<string>>;

  private readonly idToValue = new Map<string, T>();
  private readonly idToText = new Map<string, string>();

  private itemIds: string[] = [];
  private disabledIds: string[] = [];

  private typeaheadBuffer = '';
  private typeaheadTimer: ReturnType<typeof setTimeout> | null = null;

  public constructor(config: TngListboxConfig) {
    this.cfg = normalizeListboxConfig(config);

    this.selectionModel = createSelectionModel<string>({ mode: this.cfg.selectionMode });
    this.focusController = createActiveDescendantController({
      hostId: this.cfg.hostId,
      loop: this.cfg.loop,
    });
  }

  private static normalizeText(s: string): string {
    return s.trim().toLowerCase();
  }

  private isEnabled(id: string): boolean {
    return !this.disabledIds.includes(id);
  }

  private findTypeaheadMatch(prefix: string): string | null {
    const p = ListboxController.normalizeText(prefix);
    if (!p) return null;

    // Start searching from the item after current active, then wrap.
    const active = this.focusController.getActiveId();
    const startIndex = active ? this.itemIds.indexOf(active) : -1;

    const ordered = [
      ...this.itemIds.slice(startIndex + 1),
      ...this.itemIds.slice(0, Math.max(0, startIndex + 1)),
    ];

    for (const id of ordered) {
      if (!this.isEnabled(id)) continue;
      const text = this.idToText.get(id);
      if (!text) continue;
      if (ListboxController.normalizeText(text).startsWith(p)) return id;
    }

    return null;
  }

  private syncFocusController(): void {
    this.focusController.setItemIds(this.itemIds);
    this.focusController.setDisabledIds(this.disabledIds);
  }

  private registerOption(option: TngListboxOption<T>): void {
    this.idToValue.set(option.id, option.value);

    // capture label text for typeahead
    if (typeof option.text === 'string') {
      this.idToText.set(option.id, option.text);
    }

    // upsert without duplicating order
    if (!this.itemIds.includes(option.id)) {
      this.itemIds = [...this.itemIds, option.id];
    }

    const isDisabled = option.disabled === true;
    const wasDisabled = this.disabledIds.includes(option.id);

    if (isDisabled && !wasDisabled) {
      this.disabledIds = [...this.disabledIds, option.id];
    } else if (!isDisabled && wasDisabled) {
      this.disabledIds = this.disabledIds.filter((x) => x !== option.id);
    }

    this.syncFocusController();
  }
  
  private findFirstEnabled(
    itemIds: readonly string[],
    isEnabled: (id: string) => boolean,
  ): string | null {
    return itemIds.find(isEnabled) ?? null;
  }
  
  private findNextEnabledFromIndex(params: Readonly<{
    itemIds: readonly string[],
    start: number,
    isEnabled: (id: string) => boolean,
    endExclusive?: number,
  }>
  ): string | null {

    const { itemIds, start, isEnabled, endExclusive } = params;
    for (let i = start; i < Math.min(endExclusive ?? itemIds.length, itemIds.length); i++) {
      const id = itemIds[i];
      if (isEnabled(id)) return id;
    }
    return null;
  }
  
  private findPrevEnabledBeforeIndex(
    itemIds: readonly string[],
    start: number,
    isEnabled: (id: string) => boolean,
  ): string | null {
    for (let i = Math.min(start, itemIds.length - 1); i >= 0; i--) {
      const id = itemIds[i];
      if (isEnabled(id)) return id;
    }
    return null;
  }

  private resolveNextActiveAfterRemoval(options: Readonly<{
    removedIndex: number;
    itemIds: readonly string[];
    disabledIds: readonly string[];
    loop: boolean;
  }>): string | null {
    const { removedIndex, itemIds, disabledIds, loop } = options;
    if (itemIds.length === 0) return null;
  
    const isEnabled = (id: string): boolean => !disabledIds.includes(id);
  
    if (removedIndex < 0) return this.findFirstEnabled(itemIds, isEnabled);
  
    const next = this.findNextEnabledFromIndex({ itemIds, start: removedIndex, isEnabled });
    if (next !== null) return next;
  
    if (loop) {
      const wrapped = this.findNextEnabledFromIndex({ itemIds, start: 0, isEnabled, endExclusive: removedIndex });
      if (wrapped !== null) return wrapped;
    }
  
    return this.findPrevEnabledBeforeIndex(itemIds, removedIndex - 1, isEnabled);
  }

  private unregisterOption(id: string): void {
    this.idToValue.delete(id);
    this.idToText.delete(id);
  
    const prevActive = this.focusController.getActiveId();
    const wasActive = prevActive === id;
  
    // capture position in the *old* order (before removal)
    const removedIndex = this.itemIds.indexOf(id);
  
    // remove from state
    this.itemIds = this.itemIds.filter((x) => x !== id);
    this.disabledIds = this.disabledIds.filter((x) => x !== id);
  
    if (this.selectionModel.isSelected(id)) {
      this.selectionModel.deselect(id);
    }
  
    // sync first (this may clear active if it points to removed id)
    this.syncFocusController();
  
    // if the removed option was active, pick next enabled
    if (wasActive) {
      const nextActive = this.resolveNextActiveAfterRemoval({
        removedIndex,
        itemIds: this.itemIds,
        disabledIds: this.disabledIds,
        loop: this.cfg.loop,
      });
  
      this.focusController.setActiveId(nextActive);
    }
  }

  private setOptionDisabled(id: string, isDisabled: boolean): void {
    if (!this.itemIds.includes(id)) return;

    const wasDisabled = this.disabledIds.includes(id);

    if (isDisabled && !wasDisabled) {
      this.disabledIds = [...this.disabledIds, id];
    } else if (!isDisabled && wasDisabled) {
      this.disabledIds = this.disabledIds.filter((x) => x !== id);
    } else {
      return;
    }

    // active-descendant will reconcile if active becomes disabled
    this.syncFocusController();
  }

  private extendRangeToActive(previousActive: string | null): void {
    if (this.cfg.selectionMode !== 'multiple') return;
  
    const active = this.focusController.getActiveId();
    if (active === null) return;
    if (this.disabledIds.includes(active)) return;
  
    const enabledItemIds = this.itemIds.filter((x) => !this.disabledIds.includes(x));
  
    const anchor =
    this.selectionModel.getAnchor() ??
      previousActive ??
      active;
  
    this.selectionModel.selectRange(anchor, active, {
      orderedValues: enabledItemIds,
      rangeMode: 'merge',
    });
  }

  private handleMoveNext(action: TngListNavigationAction): void {
    const prevActive = this.focusController.getActiveId();
    const active = this.focusController.getActiveId();
    if (active === null) {
      const first = this.itemIds.find((id) => !this.disabledIds.includes(id));
      if (first) this.focusController.setActiveId(first);
    } else {
      this.focusController.moveNext();
    }

    if (action.extendSelection) {
      this.extendRangeToActive(prevActive);
    }
  }

  private handleMovePrev(action: TngListNavigationAction): void {
    const prevActive = this.focusController.getActiveId();
    const active = this.focusController.getActiveId();
    if (active === null) {
      const first = this.itemIds.find((id) => !this.disabledIds.includes(id));
      if (first) this.focusController.setActiveId(first);
    } else {
      this.focusController.movePrev();
    }

    if (action.extendSelection) {
      this.extendRangeToActive(prevActive);
    }
  }

  private handleMoveFirst(action: TngListNavigationAction): void {
    const prevActive = this.focusController.getActiveId();
    const first = this.itemIds.find((id) => !this.disabledIds.includes(id));
    if (first) this.focusController.setActiveId(first);

    if (action.extendSelection) {
      this.extendRangeToActive(prevActive);
    }
  }

  private handleMoveLast(action: TngListNavigationAction): void {
    const prevActive = this.focusController.getActiveId();
    const last = [...this.itemIds].reverse().find((id) => !this.disabledIds.includes(id));
    if (last) this.focusController.setActiveId(last);

    if (action.extendSelection) {
      this.extendRangeToActive(prevActive);
    }
  }

  private handleSelectActive(): void {
    const active = this.focusController.getActiveId();
    if (active !== null && !this.disabledIds.includes(active)) {
      this.selectionModel.select(active);
    }
  }

  private handleToggleActive(): void {
    const active = this.focusController.getActiveId();
    if (active !== null && !this.disabledIds.includes(active)) {
      this.selectionModel.toggle(active);
    }
  }

  private handleSelectAll(): void {
    if (this.cfg.selectionMode !== 'multiple') return;

    this.selectionModel.clear();
    for (const id of this.itemIds) {
      if (!this.disabledIds.includes(id)) this.selectionModel.select(id);
    }
  }

  private applyNavigation(action: TngListNavigationAction): void {
    if (this.cfg.disabled) return;
    const handlers: Record<TngListNavigationAction['type'], () => void> = {
      'move-next': () => this.handleMoveNext(action),
      'move-prev': () => this.handleMovePrev(action),
      'move-first': () => this.handleMoveFirst(action),
      'move-last': () => this.handleMoveLast(action),
      'select-active': () => this.handleSelectActive(),
      'toggle-active': () => this.handleToggleActive(),
      'select-all': () => this.handleSelectAll(),
      'exit': () => { return; },
    };
  
    handlers[action.type]();

  }

  private handleKeyDown(event: TngListNavigationKeyboardEvent): TngListNavigationAction | null {
    const action = resolveListNavigationKeyAction(event, {
      orientation: this.cfg.orientation,
      direction: this.cfg.direction,
      multiSelect: this.cfg.selectionMode === 'multiple',
      behavior: 'listbox',
    });

    if (!action) return null;

    this.applyNavigation(action);
    return action;
  }

  private handleClick(id: string, shiftKey?: boolean): void {
    if (this.cfg.disabled) return;
    if (this.disabledIds.includes(id)) return;

    const anchor = this.selectionModel.getAnchor() ?? this.focusController.getActiveId();

    this.focusController.setActiveId(id);

    if (this.cfg.selectionMode === 'multiple' && shiftKey === true && anchor !== null) {
      const enabledItemIds = this.itemIds.filter((x) => !this.disabledIds.includes(x));

      this.selectionModel.selectRange(anchor, id, {
        orderedValues: enabledItemIds,
        rangeMode: 'merge',
      });
      return;
    }

    if (this.cfg.selectionMode === 'multiple') {
      this.selectionModel.toggle(id);
      return;
    }

    this.selectionModel.select(id);
  }

  private getActiveId(): string | null {
    return this.focusController.getActiveId();
  }

  private getSelectedValues(): readonly T[] {
    return this.selectionModel
      .getSelected()
      .map((id) => this.idToValue.get(id))
      .filter((v): v is T => v !== undefined);
  }

  private getHostAttributes(): Readonly<Record<string, string>> {
    return {
      role: 'listbox',
      ...(this.cfg.selectionMode === 'multiple' ? { 'aria-multiselectable': 'true' } : {}),
      ...this.focusController.getHostAttributes(),
    };
  }

  private getOptionAttributes(id: string): Readonly<Record<string, unknown>> {
    const isSelected = this.selectionModel.isSelected(id);
    const isDisabled = this.disabledIds.includes(id);
    const isActive = this.focusController.getActiveId() === id;

    return {
      role: 'option',
      id,
      'aria-selected': isSelected,
      'aria-disabled': isDisabled || undefined,
      'data-active': isActive || undefined,
      'data-selected': isSelected || undefined,
      'data-disabled': isDisabled || undefined,
    };
  }

  private setItemOrder(ids: readonly string[]): void {
    // reorder only registered itemIds; keep uniqueness; preserve leftovers
    const registered = new Set(this.itemIds);
  
    const next: string[] = [];
    const seen = new Set<string>();
  
    for (const id of ids) {
      if (!id || seen.has(id)) continue;
      if (!registered.has(id)) continue;
      seen.add(id);
      next.push(id);
    }
  
    // append any registered ids not present in DOM query result
    for (const id of this.itemIds) {
      if (!seen.has(id)) next.push(id);
    }
  
    this.itemIds = next;
    this.syncFocusController();
  }

  private setActiveId(id: string | null): void {
    this.focusController.setActiveId(id);
  }
  
  private typeahead(key: string): boolean {
    // only single printable chars
    if (key?.length !== 1) return false;
  
    // reset timer / buffer
    if (this.typeaheadTimer) clearTimeout(this.typeaheadTimer);
    this.typeaheadBuffer += key;
    this.typeaheadTimer = setTimeout(() => {
      this.typeaheadBuffer = '';
      this.typeaheadTimer = null;
    }, 500);
  
    const match = this.findTypeaheadMatch(this.typeaheadBuffer);
    if (!match) return false;
  
    this.focusController.setActiveId(match);
    return true;
  }

  private getSelectedIds(): readonly string[] {
    return this.selectionModel.getSelected();
  }
  
  private clearSelection(): void {
    this.selectionModel.clear();
  }
  
  private setSelectedIds(ids: readonly string[]): void {
    this.selectionModel.clear();
    for (const id of ids) {
      if (!this.itemIds.includes(id)) continue;
      if (this.disabledIds.includes(id)) continue;
      this.selectionModel.select(id);
    }
  }


  // ---------------------------
  // Public API wrapper
  // ---------------------------
  public api(): TngListboxController<T> {
    return Object.freeze({
      registerOption: (o) => this.registerOption(o),
      unregisterOption: (id) => this.unregisterOption(id),
      setOptionDisabled: (id, d) => this.setOptionDisabled(id, d),
      setItemOrder: (ids) => this.setItemOrder(ids),
      setActiveId: (id) => this.setActiveId(id),
      typeahead: (key) => this.typeahead(key),
      handleKeyDown: (e) => this.handleKeyDown(e),
      handleClick: (id, shift) => this.handleClick(id, shift),
      getActiveId: () => this.getActiveId(),
      getSelectedValues: () => this.getSelectedValues(),
      getHostAttributes: () => this.getHostAttributes(),
      getOptionAttributes: (id) => this.getOptionAttributes(id),
      getSelectedIds: () => this.getSelectedIds(),
      setSelectedIds: (ids) => this.setSelectedIds(ids),
      clearSelection: () => this.clearSelection(),
    });
  }
}

export function createListboxController<T>(config: TngListboxConfig): TngListboxController<T> {
  return new ListboxController<T>(config).api();
}
