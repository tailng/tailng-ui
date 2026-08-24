export type TngScrollLockStyle = {
  left?: string;
  overflow?: string;
  overflowY?: string;
  paddingRight?: string;
  position?: string;
  scrollBehavior?: string;
  top?: string;
  width?: string;
};

export type TngReadonlyScrollLockStyle = Readonly<TngScrollLockStyle>;

export type TngScrollLockBody = Readonly<{
  style: TngReadonlyScrollLockStyle;
}>;

export type TngScrollLockRoot = Readonly<{
  clientHeight?: number;
  clientWidth?: number;
  scrollHeight?: number;
  scrollWidth?: number;
  style: TngReadonlyScrollLockStyle;
}>;

export type TngScrollLockWindow = Readonly<{
  innerHeight?: number;
  innerWidth?: number;
  pageXOffset?: number;
  pageYOffset?: number;
  scrollTo?: (left: number, top: number) => void;
  scrollX?: number;
  scrollY?: number;
}>;

export type TngScrollLockDocument = Readonly<{
  body: TngScrollLockBody;
  defaultView?: TngScrollLockWindow | null;
  documentElement?: TngScrollLockRoot | null;
}>;

export type TngScrollPosition = Readonly<{
  left: number;
  top: number;
}>;

export type TngScrollLockOptions = Readonly<{
  documentRef?: TngScrollLockDocument | null;
  getScrollbarWidth?: () => number;
  getScrollPosition?: () => TngScrollPosition;
  restoreScrollPosition?: (position: TngScrollPosition) => void;
}>;

export type TngScrollLockManager = Readonly<{
  acquire: (lockId: string) => void;
  clear: () => void;
  getLockIds: () => readonly string[];
  isLocked: () => boolean;
  release: (lockId: string) => void;
}>;

export type TngOverlayScrollStrategy = 'block' | 'close' | 'reposition';

export type TngElementScrollLockSnapshot = Readonly<{
  overflow: string;
  overflowX: string;
  overflowY: string;
}>;

export type TngElementScrollLockManager = Readonly<{
  acquire: (lockId: string, elements: readonly HTMLElement[]) => void;
  clear: () => void;
  getLockIds: () => readonly string[];
  isLocked: (element?: HTMLElement) => boolean;
  release: (lockId: string) => void;
}>;
