import type {
  TngActiveDescendantController,
  TngActiveDescendantOptions,
  TngRovingFocusController,
  TngRovingFocusOptions,
} from '@tailng-ui/cdk/a11y';
import type {
  TngTypeaheadController,
  TngTypeaheadItem,
  TngTypeaheadMatchStrategy,
  TngTypeaheadOptions,
  TngTypeaheadResult,
} from '@tailng-ui/cdk/collections';
import type { TngAngularCdkKeyManagerDelegates } from './key-manager.adapter';

const defaultTypeaheadResetMs = 500;

type TngActiveMoveState = Readonly<{
  activeId: string | null;
  enabledIds: readonly string[];
  hasItems: boolean;
  loop: boolean;
}>;

type TngRovingMoveState = Readonly<{
  activeId: string | null;
  enabledIds: readonly string[];
  loop: boolean;
}>;

type TngTypeaheadCandidateOptions = Readonly<{
  activeId: string | null;
  enabledItems: readonly TngTypeaheadItem[];
  loop: boolean;
  searchFromActive: boolean;
}>;

type TngTypeaheadMatchOptions = Readonly<{
  activeId: string | null;
  buffer: string;
  enabledItems: readonly TngTypeaheadItem[];
  loop: boolean;
  matchStrategy: TngTypeaheadMatchStrategy;
}>;

type TngResolveMovedIdOptions = Readonly<{
  currentIndex: number;
  delta: -1 | 1;
  enabledIds: readonly string[];
  fallback: string | null;
  loop: boolean;
}>;

function normalizeIds(ids: readonly string[] | undefined): readonly string[] {
  const normalizedIds: string[] = [];
  const seenIds = new Set<string>();
  for (const id of ids ?? []) {
    const normalizedId = id.trim();
    if (normalizedId.length === 0 || seenIds.has(normalizedId)) {
      continue;
    }

    seenIds.add(normalizedId);
    normalizedIds.push(normalizedId);
  }

  return normalizedIds;
}

function resolveEnabledIds(
  itemIds: readonly string[],
  disabledIds: readonly string[],
): readonly string[] {
  return itemIds.filter((id) => !disabledIds.includes(id));
}

function firstId(ids: readonly string[]): string | null {
  return ids[0] ?? null;
}

function lastId(ids: readonly string[]): string | null {
  return ids.length > 0 ? (ids[ids.length - 1] ?? null) : null;
}

function resolveBoundaryId(ids: readonly string[], delta: -1 | 1): string | null {
  return delta > 0 ? firstId(ids) : lastId(ids);
}

function resolveMovedId(options: TngResolveMovedIdOptions): string | null {
  const nextIndex = options.currentIndex + options.delta;
  if (nextIndex >= 0 && nextIndex < options.enabledIds.length) {
    return options.enabledIds[nextIndex] ?? null;
  }

  if (!options.loop) {
    return options.fallback;
  }

  return resolveBoundaryId(options.enabledIds, options.delta);
}

function moveActiveDescendantBy(delta: -1 | 1, state: TngActiveMoveState): string | null {
  if (state.enabledIds.length === 0) {
    return state.hasItems ? null : state.activeId;
  }

  const currentIndex = state.activeId === null ? -1 : state.enabledIds.indexOf(state.activeId);
  if (currentIndex < 0) {
    return resolveBoundaryId(state.enabledIds, delta);
  }

  return resolveMovedId({
    currentIndex,
    delta,
    enabledIds: state.enabledIds,
    fallback: state.activeId,
    loop: state.loop,
  });
}

function moveRovingFocusBy(delta: -1 | 1, state: TngRovingMoveState): string | null {
  if (state.enabledIds.length === 0 || state.activeId === null) {
    return state.enabledIds.length === 0 ? null : state.activeId;
  }

  const currentIndex = state.enabledIds.indexOf(state.activeId);
  if (currentIndex < 0) {
    return resolveBoundaryId(state.enabledIds, delta);
  }

  return resolveMovedId({
    currentIndex,
    delta,
    enabledIds: state.enabledIds,
    fallback: state.activeId,
    loop: state.loop,
  });
}

function getTypeaheadSearchBuffer(buffer: string): string {
  if (buffer.length === 0) {
    return buffer;
  }

  const firstCharacter = buffer[0] ?? '';
  const allRepeated = [...buffer].every((character) => character === firstCharacter);
  return allRepeated ? firstCharacter : buffer;
}

function isPrintableCharacter(key: string): boolean {
  return key.length === 1 && key.trim().length > 0;
}

function resolveTypeaheadCandidates(
  options: TngTypeaheadCandidateOptions,
): readonly TngTypeaheadItem[] {
  if (!options.searchFromActive || options.enabledItems.length === 0) {
    return options.enabledItems;
  }

  const currentIndex = options.enabledItems.findIndex((item) => item.id === options.activeId);
  if (currentIndex < 0) {
    return options.enabledItems;
  }

  const nextStartIndex = currentIndex + 1;
  if (!options.loop) {
    return options.enabledItems.slice(nextStartIndex);
  }

  return [
    ...options.enabledItems.slice(nextStartIndex),
    ...options.enabledItems.slice(0, nextStartIndex),
  ];
}

function findTypeaheadMatch(options: TngTypeaheadMatchOptions): string | null {
  const normalizedBuffer = getTypeaheadSearchBuffer(options.buffer.toLowerCase());
  if (normalizedBuffer.length === 0) {
    return null;
  }

  const searchFromActive = options.matchStrategy === 'active' && normalizedBuffer.length === 1;
  const candidates = resolveTypeaheadCandidates({
    activeId: options.activeId,
    enabledItems: options.enabledItems,
    loop: options.loop,
    searchFromActive,
  });

  for (const candidate of candidates) {
    if (candidate.text.toLowerCase().startsWith(normalizedBuffer)) {
      return candidate.id;
    }
  }

  return null;
}

function canUseTypeaheadActiveId(
  enabledItems: readonly TngTypeaheadItem[],
  id: string | null,
): boolean {
  if (id === null) {
    return true;
  }

  return enabledItems.some((item) => item.id === id);
}

function createActiveDescendantAttributes(
  hostId: string,
  activeId: string | null,
): Readonly<Record<string, string>> {
  const attributes: Record<string, string> = { id: hostId };
  if (activeId !== null) {
    attributes['aria-activedescendant'] = activeId;
  }

  return Object.freeze(attributes);
}

class AngularCdkActiveDescendantController implements TngActiveDescendantController {
  private activeId: string | null;
  private disabledIds: readonly string[];
  private itemIds: readonly string[];
  private readonly loop: boolean;

  public constructor(private readonly options: TngActiveDescendantOptions) {
    this.activeId = options.initialActiveId ?? null;
    this.disabledIds = normalizeIds(options.disabledIds);
    this.itemIds = normalizeIds(options.itemIds);
    this.loop = options.loop ?? true;
    this.ensureActiveIdStillValid();
  }

  public clear(): void {
    this.activeId = null;
  }

  public getActiveId(): string | null {
    return this.activeId;
  }

  public getHostAttributes(): Readonly<Record<string, string>> {
    return createActiveDescendantAttributes(this.options.hostId, this.activeId);
  }

  public moveNext(): string | null {
    this.activeId = moveActiveDescendantBy(1, this.getMoveState());
    return this.activeId;
  }

  public movePrev(): string | null {
    this.activeId = moveActiveDescendantBy(-1, this.getMoveState());
    return this.activeId;
  }

  public setDisabledIds(ids: readonly string[]): void {
    this.disabledIds = normalizeIds(ids);
    this.ensureActiveIdStillValid();
  }

  public setActiveId(id: string | null): string | null {
    if (id === null || this.canUseActiveId(id)) {
      this.activeId = id;
    }

    return this.activeId;
  }

  public setItemIds(ids: readonly string[]): void {
    this.itemIds = normalizeIds(ids);
    this.ensureActiveIdStillValid();
  }

  private canUseActiveId(id: string): boolean {
    if (this.itemIds.length === 0) {
      return true;
    }

    return this.itemIds.includes(id) && !this.disabledIds.includes(id);
  }

  private ensureActiveIdStillValid(): void {
    if (this.activeId === null) return;

    if (this.canUseActiveId(this.activeId)) return;

    // Try to reconcile like TailNG controller
    const enabledIds = resolveEnabledIds(this.itemIds, this.disabledIds);

    if (enabledIds.length === 0) {
      this.activeId = null;
      return;
    }

    // If active not found, treat as -1
    const currentIndex = enabledIds.indexOf(this.activeId);

    if (currentIndex < 0) {
      // Move to boundary based on loop behavior
      this.activeId = this.loop ? firstId(enabledIds) : firstId(enabledIds);
      return;
    }

    // Try next
    const next = resolveMovedId({
      currentIndex,
      delta: 1,
      enabledIds,
      fallback: null,
      loop: this.loop,
    });

    this.activeId = next;
  }

  private getMoveState(): TngActiveMoveState {
    return {
      activeId: this.activeId,
      enabledIds: resolveEnabledIds(this.itemIds, this.disabledIds),
      hasItems: this.itemIds.length > 0,
      loop: this.loop,
    };
  }
}

class AngularCdkRovingFocusController implements TngRovingFocusController {
  private activeId: string | null;
  private disabledIds: readonly string[];
  private itemIds: readonly string[];
  private readonly loop: boolean;

  public constructor(options: TngRovingFocusOptions) {
    this.disabledIds = normalizeIds(options.disabledIds);
    this.itemIds = normalizeIds(options.itemIds);
    this.loop = options.loop ?? true;
    this.activeId = this.resolveInitialActiveId(options.initialActiveId);
  }

  public clear(): void {
    this.activeId = null;
  }

  public end(): string | null {
    this.activeId = lastId(this.getEnabledIds());
    return this.activeId;
  }

  public getActiveId(): string | null {
    return this.activeId;
  }

  public home(): string | null {
    this.activeId = firstId(this.getEnabledIds());
    return this.activeId;
  }

  public moveNext(): string | null {
    this.activeId = moveRovingFocusBy(1, this.getMoveState());
    return this.activeId;
  }

  public movePrev(): string | null {
    this.activeId = moveRovingFocusBy(-1, this.getMoveState());
    return this.activeId;
  }

  public setActiveId(id: string | null): string | null {
    if (id === null || this.getEnabledIds().includes(id)) {
      this.activeId = id;
    }

    return this.activeId;
  }

  public setDisabledIds(ids: readonly string[]): void {
    this.disabledIds = normalizeIds(ids);
    this.ensureActiveIdStillValid();
  }

  public setItemIds(ids: readonly string[]): void {
    this.itemIds = normalizeIds(ids);
    this.ensureActiveIdStillValid();
  }

  private ensureActiveIdStillValid(): void {
    if (this.activeId === null || this.getEnabledIds().includes(this.activeId)) {
      return;
    }

    this.activeId = null;
  }

  private getEnabledIds(): readonly string[] {
    return resolveEnabledIds(this.itemIds, this.disabledIds);
  }

  private getMoveState(): TngRovingMoveState {
    return {
      activeId: this.activeId,
      enabledIds: this.getEnabledIds(),
      loop: this.loop,
    };
  }

  private resolveInitialActiveId(initialActiveId: string | null | undefined): string | null {
    if (
      initialActiveId !== undefined &&
      initialActiveId !== null &&
      this.getEnabledIds().includes(initialActiveId)
    ) {
      return initialActiveId;
    }

    if (initialActiveId !== undefined && initialActiveId === null) {
      return null;
    }

    return firstId(this.getEnabledIds());
  }
}

class AngularCdkTypeaheadController implements TngTypeaheadController {
  private activeId: string | null;
  private buffer = '';
  private enabledItems: readonly TngTypeaheadItem[];
  private previousTimestamp = 0;
  private readonly matchStrategy: TngTypeaheadMatchStrategy;
  private readonly loop: boolean;
  private readonly resetMs: number;

  public constructor(options: TngTypeaheadOptions) {
    this.activeId = options.initialActiveId ?? null;
    this.enabledItems = options.items.filter((item) => item.disabled !== true);
    this.matchStrategy = options.matchStrategy ?? 'active';
    this.loop = options.loop ?? true;
    this.resetMs = options.bufferResetMs ?? defaultTypeaheadResetMs;
    this.ensureActiveIdStillValid();
  }

  public getState(): TngTypeaheadResult {
    return { activeId: this.activeId, buffer: this.buffer };
  }

  public handleKey(key: string, timestampMs: number = Date.now()): TngTypeaheadResult {
    if (!isPrintableCharacter(key)) {
      return this.getState();
    }

    this.updateBuffer(key, timestampMs);
    const nextId = findTypeaheadMatch({
      activeId: this.activeId,
      buffer: this.buffer,
      enabledItems: this.enabledItems,
      loop: this.loop,
      matchStrategy: this.matchStrategy,
    });
    if (nextId !== null) {
      this.activeId = nextId;
    }

    return this.getState();
  }

  public reset(): void {
    this.buffer = '';
    this.previousTimestamp = 0;
  }

  public setActiveId(id: string | null): string | null {
    if (canUseTypeaheadActiveId(this.enabledItems, id)) {
      this.activeId = id;
    }

    return this.activeId;
  }

  public setItems(items: readonly TngTypeaheadItem[]): void {
    this.enabledItems = items.filter((item) => item.disabled !== true);
    this.ensureActiveIdStillValid();
  }

  private ensureActiveIdStillValid(): void {
    if (canUseTypeaheadActiveId(this.enabledItems, this.activeId)) {
      return;
    }

    this.activeId = null;
  }

  private updateBuffer(key: string, timestampMs: number): void {
    const shouldReset = timestampMs - this.previousTimestamp > this.resetMs;
    this.buffer = shouldReset ? key : `${this.buffer}${key}`;
    this.previousTimestamp = timestampMs;
  }
}

export type TngAngularCdkKeyManagerDelegateFactoryOptions = Readonly<Record<string, never>>;

export function createAngularCdkKeyManagerDelegates(
  _options: TngAngularCdkKeyManagerDelegateFactoryOptions = {},
): TngAngularCdkKeyManagerDelegates {
  return Object.freeze({
    createActiveDescendantController: (
      options: TngActiveDescendantOptions,
    ): TngActiveDescendantController => new AngularCdkActiveDescendantController(options),
    createRovingFocusController: (options: TngRovingFocusOptions): TngRovingFocusController =>
      new AngularCdkRovingFocusController(options),
    createTypeaheadController: (options: TngTypeaheadOptions): TngTypeaheadController =>
      new AngularCdkTypeaheadController(options),
  });
}
