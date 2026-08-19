/* eslint-disable complexity, max-lines-per-function, max-params -- The interaction controller keeps pointer, keyboard, collapse, and constraint transitions together. */
import { DOCUMENT } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Directive,
  ElementRef,
  HostBinding,
  HostListener,
  InjectionToken,
  booleanAttribute,
  forwardRef,
  inject,
  input,
  output,
  type AfterViewInit,
  type DoCheck,
  type OnDestroy,
  type OnInit,
} from '@angular/core';
import {
  allocateTngSplitLayout,
  clampTngSplitSize,
  normalizeTngSplitSize,
  resizeTngSplitPair,
} from './tng-split-layout.engine';
import type {
  TngSplitOrientation,
  TngSplitPairConstraints,
  TngSplitPrimaryPane,
  TngSplitResizeEvent,
  TngSplitResizeSource,
} from './tng-split-layout.types';

let nextSplitPaneId = 0;

type TngSplitHandlePrimaryPane = 'auto' | TngSplitPrimaryPane;

type SplitPair = Readonly<{
  previous: TngSplitPaneDirective;
  next: TngSplitPaneDirective;
}>;

type ActivePointerResize = Readonly<{
  handle: TngSplitHandleComponent;
  pair: SplitPair;
  pointerId: number;
  startCoordinate: number;
  previousSize: number;
  nextSize: number;
}>;

type TngSplitGroupRegistration = {
  registerPane(pane: TngSplitPaneDirective): void;
  unregisterPane(pane: TngSplitPaneDirective): void;
  registerHandle(handle: TngSplitHandleComponent): void;
  unregisterHandle(handle: TngSplitHandleComponent): void;
  inputsChanged(): void;
};

const TNG_SPLIT_GROUP = new InjectionToken<TngSplitGroupRegistration>('TNG_SPLIT_GROUP');

function optionalBooleanAttribute(value: unknown): boolean | undefined {
  return value === undefined || value === null ? undefined : booleanAttribute(value);
}

function numberInput(value: unknown, fallback: number): number {
  if (value === null || value === undefined || value === '') {
    return fallback;
  }
  const parsed = typeof value === 'number' ? value : Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function optionalNumberInput(value: unknown): number | null {
  if (value === null || value === undefined || value === '') {
    return null;
  }
  const parsed = typeof value === 'number' ? value : Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function createSplitPaneId(): string {
  nextSplitPaneId += 1;
  return `tng-split-pane-${nextSplitPaneId}`;
}

@Component({
  selector: 'tng-split-group',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: TNG_SPLIT_GROUP,
      useExisting: forwardRef(() => TngSplitGroupComponent),
    },
  ],
  template: '<ng-content />',
  styleUrl: './tng-split-group.component.css',
  exportAs: 'tngSplitGroup',
})
export class TngSplitGroupComponent
  implements TngSplitGroupRegistration, AfterViewInit, DoCheck, OnDestroy
{
  private readonly documentRef = inject(DOCUMENT);
  private readonly hostRef = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly changeDetector = inject(ChangeDetectorRef);
  private readonly panes = new Set<TngSplitPaneDirective>();
  private readonly handles = new Set<TngSplitHandleComponent>();
  private readonly renderedSizes = new Map<TngSplitPaneDirective, number>();
  private readonly collapsedStates = new Map<TngSplitPaneDirective, boolean>();
  private readonly lastExpandedSizes = new Map<TngSplitPaneDirective, number>();
  private resizeObserver: ResizeObserver | null = null;
  private resizeObserverFrameId: number | null = null;
  private windowResizeCleanup: (() => void) | null = null;
  private activePointerResize: ActivePointerResize | null = null;
  private animationFrameId: number | null = null;
  private pendingPointerCoordinate: number | null = null;
  private layoutQueued = false;
  private destroyed = false;
  private previousInputSignature = '';
  private previousDocumentCursor = '';
  private previousDocumentUserSelect = '';

  public readonly orientation = input<TngSplitOrientation>('horizontal');
  public readonly disabled = input(false, { transform: booleanAttribute });
  public readonly step = input<number, unknown>(10, {
    transform: (value) => Math.max(1, numberInput(value, 10)),
  });
  public readonly largeStep = input<number, unknown>(50, {
    transform: (value) => Math.max(1, numberInput(value, 50)),
  });

  public readonly resizeStart = output<TngSplitResizeEvent>();
  // eslint-disable-next-line @angular-eslint/no-output-native -- `resize` is the required split-layout lifecycle event.
  public readonly resize = output<TngSplitResizeEvent>();
  public readonly resizeEnd = output<TngSplitResizeEvent>();

  @HostBinding('attr.data-slot')
  protected readonly dataSlot = 'split-group' as const;

  @HostBinding('attr.data-orientation')
  protected get dataOrientation(): TngSplitOrientation {
    return this.orientation();
  }

  @HostBinding('attr.data-disabled')
  protected get dataDisabled(): '' | null {
    return this.disabled() ? '' : null;
  }

  @HostBinding('attr.data-resizing')
  protected get dataResizing(): '' | null {
    return this.activePointerResize === null ? null : '';
  }

  @HostBinding('attr.aria-disabled')
  protected get ariaDisabled(): 'true' | null {
    return this.disabled() ? 'true' : null;
  }

  public ngAfterViewInit(): void {
    this.observeContainer();
    this.scheduleLayout();
  }

  public ngDoCheck(): void {
    const signature = `${this.orientation()}|${this.disabled()}|${this.step()}|${this.largeStep()}`;
    if (signature !== this.previousInputSignature) {
      this.previousInputSignature = signature;
      if (this.disabled() && this.activePointerResize !== null) {
        this.finishPointerResize(this.activePointerResize.handle, true);
      }
      this.scheduleLayout();
    }
  }

  public ngOnDestroy(): void {
    this.destroyed = true;
    if (this.activePointerResize !== null) {
      this.finishPointerResize(this.activePointerResize.handle, true);
    }
    this.cancelScheduledFrame();
    this.cancelResizeObserverFrame();
    this.resizeObserver?.disconnect();
    this.resizeObserver = null;
    this.windowResizeCleanup?.();
    this.windowResizeCleanup = null;
  }

  public registerPane(pane: TngSplitPaneDirective): void {
    this.panes.add(pane);
    this.scheduleLayout();
  }

  public unregisterPane(pane: TngSplitPaneDirective): void {
    this.panes.delete(pane);
    this.renderedSizes.delete(pane);
    this.collapsedStates.delete(pane);
    this.lastExpandedSizes.delete(pane);
    this.scheduleLayout();
  }

  public registerHandle(handle: TngSplitHandleComponent): void {
    this.handles.add(handle);
    this.scheduleLayout();
  }

  public unregisterHandle(handle: TngSplitHandleComponent): void {
    if (this.activePointerResize?.handle === handle) {
      this.finishPointerResize(handle, true);
    }
    this.handles.delete(handle);
    this.scheduleLayout();
  }

  public inputsChanged(): void {
    this.scheduleLayout();
  }

  public recalculate(): void {
    this.reconcileLayout();
  }

  public setPaneSize(paneId: string, size: number): boolean {
    const pane = this.sortedPanes().find((candidate) => candidate.resolvedPaneId === paneId);
    if (pane === undefined || pane.isDisabled || !Number.isFinite(size)) {
      return false;
    }
    const handle = this.handleForPane(pane);
    if (handle === undefined) {
      return false;
    }
    const pair = this.pairFor(handle);
    if (pair === null) {
      return false;
    }
    const current = this.sizeFor(pane);
    const delta = pair.previous === pane ? size - current : current - size;
    this.performDiscreteResize(handle, delta, 'api');
    return true;
  }

  public setPaneCollapsed(paneId: string, collapsed: boolean): boolean {
    const pane = this.sortedPanes().find((candidate) => candidate.resolvedPaneId === paneId);
    if (pane === undefined || !pane.collapsible() || pane.isDisabled) {
      return false;
    }
    const handle = this.handleForPane(pane);
    if (handle === undefined) {
      return false;
    }
    return this.setCollapsedFromHandle(handle, pane, collapsed, 'api');
  }

  public togglePane(paneId: string): boolean {
    const pane = this.sortedPanes().find((candidate) => candidate.resolvedPaneId === paneId);
    if (pane === undefined) {
      return false;
    }
    return this.setPaneCollapsed(paneId, !this.isPaneCollapsed(pane));
  }

  public beginPointerResize(handle: TngSplitHandleComponent, event: PointerEvent): void {
    if (event.button !== 0 || this.isHandleDisabled(handle)) {
      return;
    }
    const pair = this.pairFor(handle);
    if (pair === null || this.isPaneCollapsed(pair.previous) || this.isPaneCollapsed(pair.next)) {
      return;
    }

    event.preventDefault();
    const host = handle.hostElement;
    if (typeof host.setPointerCapture === 'function') {
      host.setPointerCapture(event.pointerId);
    }
    this.activePointerResize = {
      handle,
      pair,
      pointerId: event.pointerId,
      startCoordinate: this.pointerCoordinate(event),
      previousSize: this.sizeFor(pair.previous),
      nextSize: this.sizeFor(pair.next),
    };
    this.applyDocumentResizeStyles();
    this.refreshParts();
    this.resizeStart.emit(this.eventForPair(pair, 'pointer'));
  }

  public updatePointerResize(handle: TngSplitHandleComponent, event: PointerEvent): void {
    const active = this.activePointerResize;
    if (active?.handle !== handle || active.pointerId !== event.pointerId) {
      return;
    }
    event.preventDefault();
    this.pendingPointerCoordinate = this.pointerCoordinate(event);
    if (this.animationFrameId !== null) {
      return;
    }
    this.animationFrameId = this.requestFrame(() => {
      this.animationFrameId = null;
      this.flushPointerResize();
    });
  }

  public finishPointerResize(handle: TngSplitHandleComponent, cancelled = false): void {
    const active = this.activePointerResize;
    if (active?.handle !== handle) {
      return;
    }
    this.cancelScheduledFrame();
    if (!cancelled) {
      this.flushPointerResize();
    }
    if (
      typeof handle.hostElement.hasPointerCapture === 'function' &&
      handle.hostElement.hasPointerCapture(active.pointerId)
    ) {
      handle.hostElement.releasePointerCapture(active.pointerId);
    }
    this.activePointerResize = null;
    this.pendingPointerCoordinate = null;
    this.restoreDocumentResizeStyles();
    this.refreshParts();
    this.resizeEnd.emit(this.eventForPair(active.pair, 'pointer'));
    queueMicrotask(() => this.scheduleLayout());
  }

  public handleKeydown(handle: TngSplitHandleComponent, event: KeyboardEvent): void {
    if (this.isHandleDisabled(handle)) {
      return;
    }
    const physicalOrientation = this.handleOrientation;
    const step = event.shiftKey ? handle.resolvedLargeStep : handle.resolvedStep;
    let physicalDelta: number | null = null;

    if (physicalOrientation === 'vertical') {
      if (event.key === 'ArrowLeft') physicalDelta = -step;
      if (event.key === 'ArrowRight') physicalDelta = step;
    } else {
      if (event.key === 'ArrowUp') physicalDelta = -step;
      if (event.key === 'ArrowDown') physicalDelta = step;
    }

    if (physicalDelta !== null) {
      event.preventDefault();
      this.performDiscreteResize(handle, this.toLogicalDelta(physicalDelta), 'keyboard');
      return;
    }

    if (event.key === 'Enter') {
      const pane = this.primaryPaneFor(handle);
      if (pane?.collapsible()) {
        event.preventDefault();
        this.setCollapsedFromHandle(handle, pane, !this.isPaneCollapsed(pane), 'keyboard');
      }
      return;
    }

    if (event.key === 'Home' || event.key === 'End') {
      event.preventDefault();
      this.movePrimaryPaneToBoundary(handle, event.key === 'Home' ? 'minimum' : 'maximum');
    }
  }

  public handleDoubleClick(handle: TngSplitHandleComponent): void {
    if (this.isHandleDisabled(handle)) {
      return;
    }
    const pane = this.primaryPaneFor(handle);
    if (pane?.collapsible()) {
      this.setCollapsedFromHandle(handle, pane, !this.isPaneCollapsed(pane), 'pointer');
    }
  }

  public isHandleDisabled(handle: TngSplitHandleComponent): boolean {
    const pair = this.pairFor(handle);
    return (
      this.disabled() ||
      handle.disabled() ||
      pair === null ||
      pair.previous.isDisabled ||
      pair.next.isDisabled
    );
  }

  public isHandleResizing(handle: TngSplitHandleComponent): boolean {
    return this.activePointerResize?.handle === handle;
  }

  public get handleOrientation(): 'horizontal' | 'vertical' {
    return this.orientation() === 'horizontal' ? 'vertical' : 'horizontal';
  }

  public ariaControlsFor(handle: TngSplitHandleComponent): string | null {
    const pair = this.pairFor(handle);
    return pair === null ? null : `${pair.previous.domId} ${pair.next.domId}`;
  }

  public ariaValueFor(handle: TngSplitHandleComponent): number {
    const pane = this.primaryPaneFor(handle);
    return pane === null ? 0 : Math.round(this.sizeFor(pane));
  }

  public ariaMinimumFor(handle: TngSplitHandleComponent): number {
    const pane = this.primaryPaneFor(handle);
    if (pane === null) {
      return 0;
    }
    return Math.round(
      pane.collapsible() ? Math.min(pane.minSize(), pane.collapsedSize()) : pane.minSize(),
    );
  }

  public ariaMaximumFor(handle: TngSplitHandleComponent): number {
    const pane = this.primaryPaneFor(handle);
    if (pane === null) {
      return 0;
    }
    const pair = this.pairFor(handle);
    if (pair === null) {
      return Math.round(pane.normalizedMaxSize);
    }
    const pairSize = this.sizeFor(pair.previous) + this.sizeFor(pair.next);
    const other = pair.previous === pane ? pair.next : pair.previous;
    return Math.round(Math.min(pane.normalizedMaxSize, pairSize - other.minSize()));
  }

  public ariaValueTextFor(handle: TngSplitHandleComponent): string {
    const pane = this.primaryPaneFor(handle);
    if (pane === null) {
      return 'Unavailable';
    }
    const collapsed = this.isPaneCollapsed(pane) ? ', collapsed' : '';
    return `${pane.resolvedPaneId}: ${Math.round(this.sizeFor(pane))} pixels${collapsed}`;
  }

  private observeContainer(): void {
    const ownerWindow = this.hostRef.nativeElement.ownerDocument.defaultView;
    const resizeObserverConstructor = ownerWindow?.ResizeObserver;
    if (resizeObserverConstructor !== undefined) {
      this.resizeObserver = new resizeObserverConstructor(() =>
        this.scheduleResizeObserverLayout(),
      );
      this.resizeObserver.observe(this.hostRef.nativeElement);
      return;
    }
    if (ownerWindow !== null && ownerWindow !== undefined) {
      const listener = (): void => this.scheduleLayout();
      ownerWindow.addEventListener('resize', listener);
      this.windowResizeCleanup = (): void => ownerWindow.removeEventListener('resize', listener);
    }
  }

  private scheduleLayout(): void {
    if (this.destroyed || this.layoutQueued) {
      return;
    }
    this.layoutQueued = true;
    queueMicrotask(() => {
      this.layoutQueued = false;
      if (!this.destroyed && this.activePointerResize === null) {
        this.reconcileLayout();
      }
    });
  }

  private scheduleResizeObserverLayout(): void {
    if (this.destroyed || this.resizeObserverFrameId !== null) {
      return;
    }

    this.resizeObserverFrameId = this.requestFrame(() => {
      this.resizeObserverFrameId = null;
      this.scheduleLayout();
    });
  }

  private reconcileLayout(): void {
    const panes = this.sortedPanes();
    if (panes.length === 0) {
      return;
    }
    const containerSize = this.containerAxisSize();
    if (containerSize <= 0) {
      return;
    }
    const available = Math.max(0, containerSize - this.totalHandleSize());
    const result = allocateTngSplitLayout(
      available,
      panes.map((pane) => {
        const collapsed = this.resolveCollapsedState(pane);
        const currentSize = this.renderedSizes.get(pane);
        const controlledSize = pane.size();
        const desiredSize = collapsed
          ? pane.collapsedSize()
          : (controlledSize ?? currentSize ?? pane.defaultSize() ?? pane.minSize());
        return {
          id: pane.domId,
          desiredSize,
          minSize: pane.minSize(),
          maxSize: pane.normalizedMaxSize,
          grow: pane.grow(),
          collapsed,
          collapsedSize: pane.collapsedSize(),
        };
      }),
    );

    for (const pane of panes) {
      const collapsed = this.resolveCollapsedState(pane);
      const size = result.sizes.get(pane.domId) ?? 0;
      this.renderedSizes.set(pane, size);
      if (!collapsed && size > pane.collapsedSize()) {
        this.lastExpandedSizes.set(pane, size);
      }
      pane.applyLayout(size, collapsed, this.isPaneResizing(pane), this.orientation());
    }
    this.hostRef.nativeElement.toggleAttribute('data-constrained', result.constrained);
    this.refreshParts();
  }

  private performDiscreteResize(
    handle: TngSplitHandleComponent,
    delta: number,
    source: TngSplitResizeSource,
  ): void {
    const pair = this.pairFor(handle);
    if (pair === null || this.isHandleDisabled(handle)) {
      return;
    }
    if (this.isPaneCollapsed(pair.previous) || this.isPaneCollapsed(pair.next)) {
      return;
    }
    this.resizeStart.emit(this.eventForPair(pair, source));
    this.applyPairDelta(pair, this.sizeFor(pair.previous), this.sizeFor(pair.next), delta, source);
    this.resizeEnd.emit(this.eventForPair(pair, source));
    queueMicrotask(() => this.scheduleLayout());
  }

  private applyPairDelta(
    pair: SplitPair,
    previousSize: number,
    nextSize: number,
    delta: number,
    source: TngSplitResizeSource,
  ): void {
    const result = resizeTngSplitPair(previousSize, nextSize, delta, this.constraintsFor(pair));
    this.applyPaneSize(pair.previous, result.previousSize, source);
    this.applyPaneSize(pair.next, result.nextSize, source);
    this.resize.emit(this.eventForPair(pair, source));
    this.refreshParts();
  }

  private setCollapsedFromHandle(
    handle: TngSplitHandleComponent,
    pane: TngSplitPaneDirective,
    collapsed: boolean,
    source: TngSplitResizeSource,
  ): boolean {
    const pair = this.pairFor(handle);
    if (
      pair === null ||
      !pane.collapsible() ||
      pane.isDisabled ||
      this.isPaneCollapsed(pane) === collapsed
    ) {
      return false;
    }

    this.resizeStart.emit(this.eventForPair(pair, source));
    if (collapsed) {
      this.lastExpandedSizes.set(pane, this.sizeFor(pane));
    }
    this.collapsedStates.set(pane, collapsed);
    pane.collapsedChange.emit(collapsed);
    const nextSize = collapsed
      ? pane.collapsedSize()
      : clampTngSplitSize(
          this.lastExpandedSizes.get(pane) ?? pane.defaultSize() ?? pane.minSize(),
          pane.minSize(),
          pane.normalizedMaxSize,
        );
    this.renderedSizes.set(pane, nextSize);
    this.reconcileLayout();
    pane.sizeChange.emit(this.sizeFor(pane));
    this.resize.emit(this.eventForPair(pair, source));
    this.resizeEnd.emit(this.eventForPair(pair, source));
    queueMicrotask(() => this.scheduleLayout());
    return true;
  }

  private movePrimaryPaneToBoundary(
    handle: TngSplitHandleComponent,
    boundary: 'maximum' | 'minimum',
  ): void {
    const pair = this.pairFor(handle);
    const primary = this.primaryPaneFor(handle);
    if (pair === null || primary === null) {
      return;
    }

    if (boundary === 'minimum' && primary.collapsible()) {
      this.setCollapsedFromHandle(handle, primary, true, 'keyboard');
      return;
    }
    if (this.isPaneCollapsed(primary)) {
      this.setCollapsedFromHandle(handle, primary, false, 'keyboard');
    }

    const pairTotal = this.sizeFor(pair.previous) + this.sizeFor(pair.next);
    const other = pair.previous === primary ? pair.next : pair.previous;
    const target =
      boundary === 'minimum'
        ? primary.minSize()
        : Math.min(primary.normalizedMaxSize, pairTotal - other.minSize());
    const delta =
      pair.previous === primary ? target - this.sizeFor(primary) : this.sizeFor(primary) - target;
    this.performDiscreteResize(handle, delta, 'keyboard');
  }

  private flushPointerResize(): void {
    const active = this.activePointerResize;
    const coordinate = this.pendingPointerCoordinate;
    if (active === null || coordinate === null) {
      return;
    }
    const physicalDelta = coordinate - active.startCoordinate;
    this.applyPairDelta(
      active.pair,
      active.previousSize,
      active.nextSize,
      this.toLogicalDelta(physicalDelta),
      'pointer',
    );
  }

  private applyPaneSize(
    pane: TngSplitPaneDirective,
    size: number,
    source: TngSplitResizeSource,
  ): void {
    const previous = this.sizeFor(pane);
    const normalized = Math.max(0, size);
    this.renderedSizes.set(pane, normalized);
    if (!this.isPaneCollapsed(pane)) {
      this.lastExpandedSizes.set(pane, normalized);
    }
    pane.applyLayout(normalized, this.isPaneCollapsed(pane), true, this.orientation());
    if (Math.abs(previous - normalized) > 0.01 && source !== undefined) {
      pane.sizeChange.emit(normalized);
    }
  }

  private resolveCollapsedState(pane: TngSplitPaneDirective): boolean {
    const controlled = pane.collapsed();
    if (controlled !== undefined && this.activePointerResize === null) {
      this.collapsedStates.set(pane, controlled);
      return controlled;
    }
    if (!this.collapsedStates.has(pane)) {
      this.collapsedStates.set(pane, controlled ?? pane.defaultCollapsed());
    }
    return this.collapsedStates.get(pane) ?? false;
  }

  private isPaneCollapsed(pane: TngSplitPaneDirective): boolean {
    return this.collapsedStates.get(pane) ?? pane.collapsed() ?? pane.defaultCollapsed();
  }

  private isPaneResizing(pane: TngSplitPaneDirective): boolean {
    const pair = this.activePointerResize?.pair;
    return pair !== undefined && (pair.previous === pane || pair.next === pane);
  }

  private sizeFor(pane: TngSplitPaneDirective): number {
    return (
      this.renderedSizes.get(pane) ??
      (this.isPaneCollapsed(pane)
        ? pane.collapsedSize()
        : (pane.size() ?? pane.defaultSize() ?? pane.minSize()))
    );
  }

  private constraintsFor(pair: SplitPair): TngSplitPairConstraints {
    return {
      previousMin: pair.previous.minSize(),
      previousMax: pair.previous.normalizedMaxSize,
      nextMin: pair.next.minSize(),
      nextMax: pair.next.normalizedMaxSize,
    };
  }

  private eventForPair(pair: SplitPair, source: TngSplitResizeSource): TngSplitResizeEvent {
    return {
      previousPaneId: pair.previous.resolvedPaneId,
      nextPaneId: pair.next.resolvedPaneId,
      previousPaneSize: this.sizeFor(pair.previous),
      nextPaneSize: this.sizeFor(pair.next),
      source,
    };
  }

  private primaryPaneFor(handle: TngSplitHandleComponent): TngSplitPaneDirective | null {
    const pair = this.pairFor(handle);
    if (pair === null) {
      return null;
    }
    const configured = handle.primaryPane();
    if (configured === 'previous') return pair.previous;
    if (configured === 'next') return pair.next;
    if (pair.previous.collapsible() !== pair.next.collapsible()) {
      return pair.previous.collapsible() ? pair.previous : pair.next;
    }
    return pair.previous;
  }

  private pairFor(handle: TngSplitHandleComponent): SplitPair | null {
    const parts = [...this.panes.values(), ...this.handles.values()].sort((left, right) =>
      this.compareElements(left.hostElement, right.hostElement),
    );
    const index = parts.indexOf(handle);
    if (index < 0) {
      return null;
    }
    let previous: TngSplitPaneDirective | undefined;
    let next: TngSplitPaneDirective | undefined;
    for (let cursor = index - 1; cursor >= 0; cursor -= 1) {
      const candidate = parts[cursor];
      if (candidate instanceof TngSplitPaneDirective) {
        previous = candidate;
        break;
      }
    }
    for (let cursor = index + 1; cursor < parts.length; cursor += 1) {
      const candidate = parts[cursor];
      if (candidate instanceof TngSplitPaneDirective) {
        next = candidate;
        break;
      }
    }
    return previous === undefined || next === undefined ? null : { previous, next };
  }

  private handleForPane(pane: TngSplitPaneDirective): TngSplitHandleComponent | undefined {
    return this.sortedHandles().find((handle) => {
      const pair = this.pairFor(handle);
      return pair?.previous === pane || pair?.next === pane;
    });
  }

  private sortedPanes(): TngSplitPaneDirective[] {
    return [...this.panes].sort((left, right) =>
      this.compareElements(left.hostElement, right.hostElement),
    );
  }

  private sortedHandles(): TngSplitHandleComponent[] {
    return [...this.handles].sort((left, right) =>
      this.compareElements(left.hostElement, right.hostElement),
    );
  }

  private compareElements(left: HTMLElement, right: HTMLElement): number {
    if (left === right) return 0;
    const position = left.compareDocumentPosition(right);
    if ((position & 4) !== 0) return -1;
    if ((position & 2) !== 0) return 1;
    return 0;
  }

  private containerAxisSize(): number {
    const host = this.hostRef.nativeElement;
    const rect = host.getBoundingClientRect();
    const fromRect = this.orientation() === 'horizontal' ? rect.width : rect.height;
    if (fromRect > 0) {
      return fromRect;
    }
    const inlineValue = this.orientation() === 'horizontal' ? host.style.width : host.style.height;
    const parsedInline = Number.parseFloat(inlineValue);
    if (Number.isFinite(parsedInline) && parsedInline > 0) {
      return parsedInline;
    }
    const computed = host.ownerDocument.defaultView?.getComputedStyle(host);
    return Number.parseFloat(
      this.orientation() === 'horizontal' ? (computed?.width ?? '0') : (computed?.height ?? '0'),
    );
  }

  private totalHandleSize(): number {
    return this.sortedHandles().reduce(
      (total, handle) => total + handle.layoutSize(this.orientation()),
      0,
    );
  }

  private pointerCoordinate(event: PointerEvent): number {
    return this.orientation() === 'horizontal' ? event.clientX : event.clientY;
  }

  private toLogicalDelta(physicalDelta: number): number {
    if (this.orientation() === 'vertical') {
      return physicalDelta;
    }
    return this.resolveDirection() === 'rtl' ? -physicalDelta : physicalDelta;
  }

  private resolveDirection(): 'ltr' | 'rtl' {
    const host = this.hostRef.nativeElement;
    const computedDirection = host.ownerDocument.defaultView?.getComputedStyle(host).direction;
    if (computedDirection === 'rtl') {
      return 'rtl';
    }
    const direction =
      host.closest<HTMLElement>('[dir]')?.getAttribute('dir') ??
      host.ownerDocument.documentElement.getAttribute('dir');
    return direction?.toLowerCase() === 'rtl' ? 'rtl' : 'ltr';
  }

  private requestFrame(callback: FrameRequestCallback): number {
    const ownerWindow = this.hostRef.nativeElement.ownerDocument.defaultView;
    return (
      ownerWindow?.requestAnimationFrame(callback) ?? Number(ownerWindow?.setTimeout(callback, 16))
    );
  }

  private cancelScheduledFrame(): void {
    if (this.animationFrameId === null) {
      return;
    }
    const ownerWindow = this.hostRef.nativeElement.ownerDocument.defaultView;
    ownerWindow?.cancelAnimationFrame?.(this.animationFrameId);
    ownerWindow?.clearTimeout(this.animationFrameId);
    this.animationFrameId = null;
  }

  private cancelResizeObserverFrame(): void {
    if (this.resizeObserverFrameId === null) {
      return;
    }
    const ownerWindow = this.hostRef.nativeElement.ownerDocument.defaultView;
    ownerWindow?.cancelAnimationFrame?.(this.resizeObserverFrameId);
    ownerWindow?.clearTimeout(this.resizeObserverFrameId);
    this.resizeObserverFrameId = null;
  }

  private applyDocumentResizeStyles(): void {
    const rootStyle = this.documentRef.documentElement.style;
    this.previousDocumentCursor = rootStyle.cursor;
    this.previousDocumentUserSelect = rootStyle.userSelect;
    rootStyle.cursor = this.orientation() === 'horizontal' ? 'col-resize' : 'row-resize';
    rootStyle.userSelect = 'none';
  }

  private restoreDocumentResizeStyles(): void {
    const rootStyle = this.documentRef.documentElement.style;
    rootStyle.cursor = this.previousDocumentCursor;
    rootStyle.userSelect = this.previousDocumentUserSelect;
  }

  private refreshParts(): void {
    for (const handle of this.handles) {
      handle.refresh();
    }
    this.changeDetector.markForCheck();
  }
}

@Component({
  selector: 'tng-split-handle',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<span class="tng-split-handle__indicator" aria-hidden="true"></span>',
  styleUrl: './tng-split-handle.component.css',
  exportAs: 'tngSplitHandle',
})
export class TngSplitHandleComponent implements DoCheck, OnDestroy, OnInit {
  private readonly group = inject(TNG_SPLIT_GROUP, { optional: true, skipSelf: true });
  private readonly hostRef = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly changeDetector = inject(ChangeDetectorRef);
  private previousInputSignature = '';

  public readonly ariaLabel = input<string>('Resize panels');
  public readonly disabled = input(false, { transform: booleanAttribute });
  public readonly step = input<number | null, unknown>(null, { transform: optionalNumberInput });
  public readonly largeStep = input<number | null, unknown>(null, {
    transform: optionalNumberInput,
  });
  public readonly primaryPane = input<TngSplitHandlePrimaryPane>('auto');

  public get hostElement(): HTMLElement {
    return this.hostRef.nativeElement;
  }

  public get resolvedStep(): number {
    const group = this.group as TngSplitGroupComponent | null;
    return Math.max(1, this.step() ?? group?.step() ?? 10);
  }

  public get resolvedLargeStep(): number {
    const group = this.group as TngSplitGroupComponent | null;
    return Math.max(1, this.largeStep() ?? group?.largeStep() ?? this.resolvedStep * 5);
  }

  @HostBinding('attr.data-slot')
  protected readonly dataSlot = 'split-handle' as const;

  @HostBinding('attr.role')
  protected readonly role = 'separator' as const;

  @HostBinding('attr.tabindex')
  protected get tabIndex(): string {
    return this.isDisabled ? '-1' : '0';
  }

  @HostBinding('attr.aria-label')
  protected get hostAriaLabel(): string {
    return this.ariaLabel();
  }

  @HostBinding('attr.aria-orientation')
  protected get ariaOrientation(): 'horizontal' | 'vertical' {
    return this.groupComponent?.handleOrientation ?? 'vertical';
  }

  @HostBinding('attr.aria-controls')
  protected get ariaControls(): string | null {
    return this.groupComponent?.ariaControlsFor(this) ?? null;
  }

  @HostBinding('attr.aria-valuemin')
  protected get ariaValueMin(): string {
    return String(this.groupComponent?.ariaMinimumFor(this) ?? 0);
  }

  @HostBinding('attr.aria-valuemax')
  protected get ariaValueMax(): string {
    return String(this.groupComponent?.ariaMaximumFor(this) ?? 0);
  }

  @HostBinding('attr.aria-valuenow')
  protected get ariaValueNow(): string {
    return String(this.groupComponent?.ariaValueFor(this) ?? 0);
  }

  @HostBinding('attr.aria-valuetext')
  protected get ariaValueText(): string {
    return this.groupComponent?.ariaValueTextFor(this) ?? 'Unavailable';
  }

  @HostBinding('attr.aria-disabled')
  protected get ariaDisabled(): 'true' | null {
    return this.isDisabled ? 'true' : null;
  }

  @HostBinding('attr.data-disabled')
  protected get dataDisabled(): '' | null {
    return this.isDisabled ? '' : null;
  }

  @HostBinding('attr.data-orientation')
  protected get dataOrientation(): 'horizontal' | 'vertical' {
    return this.ariaOrientation;
  }

  @HostBinding('attr.data-resizing')
  protected get dataResizing(): '' | null {
    return this.hostElement.matches('[data-active-resize]') ? '' : null;
  }

  public get isDisabled(): boolean {
    return this.groupComponent?.isHandleDisabled(this) ?? this.disabled();
  }

  public ngOnInit(): void {
    this.group?.registerHandle(this);
  }

  public ngDoCheck(): void {
    const signature = `${this.ariaLabel()}|${this.disabled()}|${this.step()}|${this.largeStep()}|${this.primaryPane()}`;
    if (signature !== this.previousInputSignature) {
      this.previousInputSignature = signature;
      this.group?.inputsChanged();
    }
  }

  public ngOnDestroy(): void {
    this.group?.unregisterHandle(this);
  }

  @HostListener('pointerdown', ['$event'])
  protected onPointerDown(event: PointerEvent): void {
    this.groupComponent?.beginPointerResize(this, event);
  }

  @HostListener('pointermove', ['$event'])
  protected onPointerMove(event: PointerEvent): void {
    this.groupComponent?.updatePointerResize(this, event);
  }

  @HostListener('pointerup')
  @HostListener('pointercancel')
  @HostListener('lostpointercapture')
  protected onPointerEnd(): void {
    this.groupComponent?.finishPointerResize(this);
  }

  @HostListener('keydown', ['$event'])
  protected onKeydown(event: KeyboardEvent): void {
    this.groupComponent?.handleKeydown(this, event);
  }

  @HostListener('dblclick')
  protected onDoubleClick(): void {
    this.groupComponent?.handleDoubleClick(this);
  }

  public layoutSize(groupOrientation: TngSplitOrientation): number {
    const rect = this.hostElement.getBoundingClientRect();
    const fromRect = groupOrientation === 'horizontal' ? rect.width : rect.height;
    if (fromRect > 0) {
      return fromRect;
    }
    const computed = this.hostElement.ownerDocument.defaultView?.getComputedStyle(this.hostElement);
    const parsed = Number.parseFloat(
      groupOrientation === 'horizontal' ? (computed?.width ?? '1') : (computed?.height ?? '1'),
    );
    return Number.isFinite(parsed) && parsed > 0 ? parsed : 1;
  }

  public refresh(): void {
    const active = this.groupComponent?.isHandleResizing(this) ?? false;
    this.hostElement.toggleAttribute('data-active-resize', active);
    this.changeDetector.markForCheck();
  }

  private get groupComponent(): TngSplitGroupComponent | null {
    return this.group instanceof TngSplitGroupComponent ? this.group : null;
  }
}

@Directive({
  selector: '[tngSplitPane]',
  host: {
    class: 'tng-split-pane',
  },
  exportAs: 'tngSplitPane',
})
export class TngSplitPaneDirective implements DoCheck, OnDestroy, OnInit {
  private readonly group = inject(TNG_SPLIT_GROUP, { optional: true, skipSelf: true });
  private readonly hostRef = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly generatedPaneId = createSplitPaneId();
  private readonly initialDomId = this.hostRef.nativeElement.id;
  private previousInputSignature = '';

  public readonly paneId = input<string>('');
  public readonly size = input<number | null, unknown>(null, { transform: optionalNumberInput });
  public readonly defaultSize = input<number | null, unknown>(null, {
    transform: optionalNumberInput,
  });
  public readonly minSize = input<number, unknown>(0, {
    transform: (value) => Math.max(0, numberInput(value, 0)),
  });
  public readonly maxSize = input<number, unknown>(Number.POSITIVE_INFINITY, {
    transform: (value) => {
      if (value === null || value === undefined || value === '') {
        return Number.POSITIVE_INFINITY;
      }
      const parsed = Number(value);
      return Number.isFinite(parsed) ? Math.max(0, parsed) : Number.POSITIVE_INFINITY;
    },
  });
  public readonly grow = input<number, unknown>(0, {
    transform: (value) => Math.max(0, numberInput(value, 0)),
  });
  public readonly collapsible = input(false, { transform: booleanAttribute });
  public readonly collapsed = input<boolean | undefined, unknown>(undefined, {
    transform: optionalBooleanAttribute,
  });
  public readonly defaultCollapsed = input(false, { transform: booleanAttribute });
  public readonly collapsedSize = input<number, unknown>(0, {
    transform: (value) => Math.max(0, numberInput(value, 0)),
  });
  public readonly disabled = input(false, { transform: booleanAttribute });

  public readonly sizeChange = output<number>();
  public readonly collapsedChange = output<boolean>();

  public get hostElement(): HTMLElement {
    return this.hostRef.nativeElement;
  }

  public get resolvedPaneId(): string {
    return this.paneId().trim() || this.generatedPaneId;
  }

  public get domId(): string {
    return this.initialDomId || this.generatedPaneId;
  }

  public get isDisabled(): boolean {
    return this.disabled();
  }

  public get normalizedMaxSize(): number {
    return Math.max(this.minSize(), this.maxSize());
  }

  @HostBinding('attr.id')
  protected get hostId(): string {
    return this.domId;
  }

  @HostBinding('attr.data-slot')
  protected readonly dataSlot = 'split-pane' as const;

  public ngOnInit(): void {
    const style = this.hostElement.style;
    style.boxSizing = 'border-box';
    style.minWidth = '0';
    style.minHeight = '0';
    style.overflow = 'hidden';
    style.background = 'var(--tng-split-pane-background, transparent)';
    this.hostElement.toggleAttribute('data-disabled', this.disabled());
    this.hostElement.toggleAttribute('data-collapsed', this.collapsed() ?? this.defaultCollapsed());
    this.group?.registerPane(this);
  }

  public ngDoCheck(): void {
    const signature = [
      this.resolvedPaneId,
      this.size(),
      this.defaultSize(),
      this.minSize(),
      this.maxSize(),
      this.grow(),
      this.collapsible(),
      this.collapsed(),
      this.defaultCollapsed(),
      this.collapsedSize(),
      this.disabled(),
    ].join('|');
    if (signature !== this.previousInputSignature) {
      this.previousInputSignature = signature;
      this.hostElement.toggleAttribute('data-disabled', this.disabled());
      this.group?.inputsChanged();
    }
  }

  public ngOnDestroy(): void {
    this.group?.unregisterPane(this);
  }

  public applyLayout(
    size: number,
    collapsed: boolean,
    resizing: boolean,
    orientation: TngSplitOrientation,
  ): void {
    const normalizedSize = normalizeTngSplitSize(size, 0);
    const style = this.hostElement.style;
    style.flex = `0 0 ${normalizedSize}px`;
    style.width = orientation === 'horizontal' ? `${normalizedSize}px` : '100%';
    style.height = orientation === 'vertical' ? `${normalizedSize}px` : '100%';
    this.hostElement.toggleAttribute('data-collapsed', collapsed);
    this.hostElement.toggleAttribute('data-resizing', resizing);
    const fullyHidden = collapsed && normalizedSize <= 0;
    this.hostElement.toggleAttribute('inert', fullyHidden);
    if (fullyHidden) {
      this.hostElement.setAttribute('aria-hidden', 'true');
    } else {
      this.hostElement.removeAttribute('aria-hidden');
    }
  }
}
