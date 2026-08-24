import {
  type TngElementScrollLockManager,
  type TngElementScrollLockSnapshot,
  type TngScrollLockDocument,
  type TngScrollLockStyle,
  type TngScrollLockManager,
  type TngScrollLockOptions,
  type TngScrollPosition,
} from './scroll-lock.types';

type TngBodySnapshot = Readonly<{
  overflow: string | null;
  paddingRight: string | null;
}>;

type TngRootSnapshot = Readonly<{
  bodyScrollBehavior: string | null;
  left: string | null;
  overflowY: string | null;
  position: string | null;
  rootScrollBehavior: string | null;
  scrollPosition: TngScrollPosition;
  top: string | null;
  width: string | null;
}>;

type TngDocumentLockSnapshot =
  | Readonly<{ mode: 'body'; styles: TngBodySnapshot }>
  | Readonly<{ mode: 'root'; styles: TngRootSnapshot }>;

function readStyleValue(style: TngScrollLockStyle, key: keyof TngScrollLockStyle): string | null {
  return style[key] ?? null;
}

class ScrollLockManager implements TngScrollLockManager {
  private readonly documentRef: TngScrollLockDocument | null;
  private readonly getScrollbarWidth: () => number;
  private readonly getScrollPosition: () => TngScrollPosition;
  private readonly restoreScrollPosition: (position: TngScrollPosition) => void;
  private readonly lockIds = new Set<string>();
  private readonly enabled: boolean;
  private initialSnapshot: TngDocumentLockSnapshot | null = null;

  public constructor(options: Readonly<TngScrollLockOptions>) {
    this.documentRef = options.documentRef ?? null;
    this.enabled = this.documentRef !== null;
    this.getScrollbarWidth = options.getScrollbarWidth ?? ((): number => 0);
    this.getScrollPosition = options.getScrollPosition ?? (() => this.readScrollPosition());
    this.restoreScrollPosition =
      options.restoreScrollPosition ?? ((position) => this.restoreWindowScrollPosition(position));
  }

  public acquire(lockId: string): void {
    if (this.lockIds.has(lockId)) {
      return;
    }

    this.lockIds.add(lockId);
    if (this.lockIds.size === 1) {
      this.applyLockStyles();
    }
  }

  public clear(): void {
    if (this.lockIds.size === 0) {
      return;
    }

    this.lockIds.clear();
    this.restoreLockStyles();
  }

  public getLockIds(): readonly string[] {
    return [...this.lockIds.values()];
  }

  public isLocked(): boolean {
    return this.lockIds.size > 0;
  }

  public release(lockId: string): void {
    if (!this.lockIds.has(lockId)) {
      return;
    }

    this.lockIds.delete(lockId);
    if (this.lockIds.size === 0) {
      this.restoreLockStyles();
    }
  }

  private applyLockStyles(): void {
    if (!this.enabled) {
      return;
    }

    const rootStyle = this.getRootStyle();
    if (rootStyle !== null && this.hasScrollableViewport()) {
      const bodyStyle = this.getBodyStyle();
      const scrollPosition = this.getScrollPosition();
      this.initialSnapshot = {
        mode: 'root',
        styles: {
          bodyScrollBehavior:
            bodyStyle === null ? null : readStyleValue(bodyStyle, 'scrollBehavior'),
          left: readStyleValue(rootStyle, 'left'),
          overflowY: readStyleValue(rootStyle, 'overflowY'),
          position: readStyleValue(rootStyle, 'position'),
          rootScrollBehavior: readStyleValue(rootStyle, 'scrollBehavior'),
          scrollPosition,
          top: readStyleValue(rootStyle, 'top'),
          width: readStyleValue(rootStyle, 'width'),
        },
      };

      rootStyle.left = `${-scrollPosition.left}px`;
      rootStyle.top = `${-scrollPosition.top}px`;
      rootStyle.position = 'fixed';
      rootStyle.width = '100%';
      rootStyle.overflowY = 'scroll';
      return;
    }

    const style = this.getBodyStyle();
    if (style === null || rootStyle !== null) {
      return;
    }

    this.initialSnapshot = {
      mode: 'body',
      styles: {
        overflow: readStyleValue(style, 'overflow'),
        paddingRight: readStyleValue(style, 'paddingRight'),
      },
    };
    style.overflow = 'hidden';
    const scrollbarWidth = this.getScrollbarWidth();
    if (scrollbarWidth > 0) {
      style.paddingRight = `${scrollbarWidth}px`;
    }
  }

  private restoreLockStyles(): void {
    const snapshot = this.initialSnapshot;
    if (!this.enabled || snapshot === null) {
      return;
    }

    this.initialSnapshot = null;

    if (snapshot.mode === 'body') {
      const bodyStyle = this.getBodyStyle();
      if (bodyStyle === null) {
        return;
      }

      this.restoreStyleValue(bodyStyle, 'overflow', snapshot.styles.overflow);
      this.restoreStyleValue(bodyStyle, 'paddingRight', snapshot.styles.paddingRight);
      return;
    }

    const rootStyle = this.getRootStyle();
    if (rootStyle === null) {
      return;
    }

    const bodyStyle = this.getBodyStyle();
    this.restoreStyleValue(rootStyle, 'left', snapshot.styles.left);
    this.restoreStyleValue(rootStyle, 'overflowY', snapshot.styles.overflowY);
    this.restoreStyleValue(rootStyle, 'position', snapshot.styles.position);
    this.restoreStyleValue(rootStyle, 'top', snapshot.styles.top);
    this.restoreStyleValue(rootStyle, 'width', snapshot.styles.width);

    rootStyle.scrollBehavior = 'auto';
    if (bodyStyle !== null) {
      bodyStyle.scrollBehavior = 'auto';
    }
    this.restoreScrollPosition(snapshot.styles.scrollPosition);
    this.restoreStyleValue(rootStyle, 'scrollBehavior', snapshot.styles.rootScrollBehavior);
    if (bodyStyle !== null) {
      this.restoreStyleValue(bodyStyle, 'scrollBehavior', snapshot.styles.bodyScrollBehavior);
    }
  }

  private getBodyStyle(): TngScrollLockStyle | null {
    if (this.documentRef === null) {
      return null;
    }

    return this.documentRef.body.style as TngScrollLockStyle;
  }

  private getRootStyle(): TngScrollLockStyle | null {
    const root = this.documentRef?.documentElement;
    return root?.style == null ? null : (root.style as TngScrollLockStyle);
  }

  private hasScrollableViewport(): boolean {
    const root = this.documentRef?.documentElement;
    if (root == null) {
      return false;
    }

    const viewport = this.documentRef?.defaultView;
    const viewportHeight = root.clientHeight ?? viewport?.innerHeight ?? 0;
    const viewportWidth = root.clientWidth ?? viewport?.innerWidth ?? 0;
    const scrollHeight = root.scrollHeight ?? 0;
    const scrollWidth = root.scrollWidth ?? 0;
    const hasKnownDimensions = scrollHeight > 0 || scrollWidth > 0;

    if (!hasKnownDimensions) {
      // DOM shims such as JSDOM do not expose viewport layout dimensions. Keep
      // the real-browser locking behavior available in those environments.
      return true;
    }

    return scrollHeight > viewportHeight || scrollWidth > viewportWidth;
  }

  private readScrollPosition(): TngScrollPosition {
    const windowRef = this.documentRef?.defaultView;
    return {
      left: windowRef?.scrollX ?? windowRef?.pageXOffset ?? 0,
      top: windowRef?.scrollY ?? windowRef?.pageYOffset ?? 0,
    };
  }

  private restoreWindowScrollPosition(position: TngScrollPosition): void {
    const windowRef = this.documentRef?.defaultView;
    if (windowRef?.scrollTo === undefined) {
      return;
    }

    const current = this.readScrollPosition();
    if (current.left === position.left && current.top === position.top) {
      return;
    }

    windowRef.scrollTo(position.left, position.top);
  }

  private restoreStyleValue(
    style: TngScrollLockStyle,
    key: keyof TngScrollLockStyle,
    value: string | null,
  ): void {
    if (value === null) {
      delete style[key];
      return;
    }

    style[key] = value;
  }
}

type ElementLockState = {
  count: number;
  snapshot: TngElementScrollLockSnapshot;
};

type TngScrollableAncestorOptions = Readonly<{
  includeDocument?: boolean;
}>;

const SCROLLABLE_OVERFLOW_RE = /(auto|overlay|scroll)/;

function uniqueElements(elements: readonly HTMLElement[]): HTMLElement[] {
  return [...new Set(elements)];
}

function isDocumentRoot(element: HTMLElement): boolean {
  const documentRef = element.ownerDocument;
  return element === documentRef.body || element === documentRef.documentElement;
}

function getElementWindow(element: HTMLElement): Window | null {
  return element.ownerDocument.defaultView ?? (typeof window === 'undefined' ? null : window);
}

function isScrollableOverflow(value: string): boolean {
  return SCROLLABLE_OVERFLOW_RE.test(value);
}

export function isTngScrollableElement(element: HTMLElement): boolean {
  const win = getElementWindow(element);
  if (win === null) {
    return false;
  }

  const style = win.getComputedStyle(element);
  const overflow = `${style.overflow} ${style.overflowX} ${style.overflowY}`;
  if (isScrollableOverflow(overflow)) {
    return true;
  }

  return false;
}

export function resolveTngScrollableAncestors(
  element: HTMLElement,
  options: TngScrollableAncestorOptions = {},
): readonly HTMLElement[] {
  const includeDocument = options.includeDocument ?? false;
  const documentRef = element.ownerDocument;
  const ancestors: HTMLElement[] = [];
  let current = element.parentElement;

  while (current !== null) {
    if (isDocumentRoot(current)) {
      if (includeDocument && current === documentRef.body) {
        ancestors.push(current);
      }
      break;
    }

    if (isTngScrollableElement(current)) {
      ancestors.push(current);
    }

    current = current.parentElement;
  }

  if (includeDocument && documentRef.body !== null && !ancestors.includes(documentRef.body)) {
    ancestors.push(documentRef.body);
  }

  return uniqueElements(ancestors);
}

function rectsIntersect(
  a: Readonly<{ height: number; left: number; top: number; width: number }>,
  b: Readonly<{ height: number; left: number; top: number; width: number }>,
): boolean {
  const aRight = a.left + a.width;
  const aBottom = a.top + a.height;
  const bRight = b.left + b.width;
  const bBottom = b.top + b.height;

  return a.left < bRight && aRight > b.left && a.top < bBottom && aBottom > b.top;
}

function viewportRect(
  win: Window,
): Readonly<{ height: number; left: number; top: number; width: number }> {
  return {
    height: win.innerHeight || 768,
    left: 0,
    top: 0,
    width: win.innerWidth || 1024,
  };
}

export function isTngAnchorVisibleInScrollAncestors(
  anchor: HTMLElement,
  ancestors: readonly HTMLElement[],
): boolean {
  const win = getElementWindow(anchor);
  if (win === null) {
    return true;
  }

  const anchorRect = anchor.getBoundingClientRect();
  if (anchorRect.width <= 0 || anchorRect.height <= 0) {
    return false;
  }

  if (!rectsIntersect(anchorRect, viewportRect(win))) {
    return false;
  }

  for (const ancestor of ancestors) {
    if (isDocumentRoot(ancestor)) {
      continue;
    }

    if (!rectsIntersect(anchorRect, ancestor.getBoundingClientRect())) {
      return false;
    }
  }

  return true;
}

class ElementScrollLockManager implements TngElementScrollLockManager {
  private readonly lockElements = new Map<string, readonly HTMLElement[]>();
  private readonly elementStates = new WeakMap<HTMLElement, ElementLockState>();

  public acquire(lockId: string, elements: readonly HTMLElement[]): void {
    if (this.lockElements.has(lockId)) {
      return;
    }

    const unique = uniqueElements(elements);
    this.lockElements.set(lockId, unique);

    for (const element of unique) {
      this.acquireElement(element);
    }
  }

  public clear(): void {
    for (const lockId of this.getLockIds()) {
      this.release(lockId);
    }
  }

  public getLockIds(): readonly string[] {
    return [...this.lockElements.keys()];
  }

  public isLocked(element?: HTMLElement): boolean {
    if (element === undefined) {
      return this.lockElements.size > 0;
    }

    return this.elementStates.has(element);
  }

  public release(lockId: string): void {
    const elements = this.lockElements.get(lockId);
    if (elements === undefined) {
      return;
    }

    this.lockElements.delete(lockId);

    for (const element of elements) {
      this.releaseElement(element);
    }
  }

  private acquireElement(element: HTMLElement): void {
    const state = this.elementStates.get(element);
    if (state !== undefined) {
      state.count += 1;
      return;
    }

    this.elementStates.set(element, {
      count: 1,
      snapshot: {
        overflow: element.style.overflow,
        overflowX: element.style.overflowX,
        overflowY: element.style.overflowY,
      },
    });

    element.style.overflow = 'hidden';
  }

  private releaseElement(element: HTMLElement): void {
    const state = this.elementStates.get(element);
    if (state === undefined) {
      return;
    }

    state.count -= 1;
    if (state.count > 0) {
      return;
    }

    element.style.overflow = state.snapshot.overflow;
    element.style.overflowX = state.snapshot.overflowX;
    element.style.overflowY = state.snapshot.overflowY;
    this.elementStates.delete(element);
  }
}

export function createScrollLockManager(
  options: Readonly<TngScrollLockOptions> = {},
): TngScrollLockManager {
  return new ScrollLockManager(options);
}

export function createElementScrollLockManager(): TngElementScrollLockManager {
  return new ElementScrollLockManager();
}

const globalScrollLockManagers = new WeakMap<object, TngScrollLockManager>();
const globalElementScrollLockManagers = new WeakMap<object, TngElementScrollLockManager>();

export function getGlobalScrollLockManager(
  options: Readonly<TngScrollLockOptions> = {},
): TngScrollLockManager {
  const documentRef = options.documentRef ?? null;
  if (documentRef === null) {
    return createScrollLockManager(options);
  }

  const key = documentRef as object;
  const existing = globalScrollLockManagers.get(key);
  if (existing !== undefined) {
    return existing;
  }

  const manager = createScrollLockManager(options);
  globalScrollLockManagers.set(key, manager);
  return manager;
}

export function getGlobalElementScrollLockManager(
  options: Readonly<{ documentRef?: Document | null }> = {},
): TngElementScrollLockManager {
  const documentRef = options.documentRef ?? null;
  if (documentRef === null) {
    return createElementScrollLockManager();
  }

  const key = documentRef as object;
  const existing = globalElementScrollLockManagers.get(key);
  if (existing !== undefined) {
    return existing;
  }

  const manager = createElementScrollLockManager();
  globalElementScrollLockManagers.set(key, manager);
  return manager;
}
