import { afterEach, expect, it, vi } from 'vitest';
import {
  createElementScrollLockManager,
  createScrollLockManager,
  getGlobalScrollLockManager,
  isTngAnchorVisibleInScrollAncestors,
  resolveTngScrollableAncestors,
} from './scroll-lock';
import type { TngScrollLockDocument } from './scroll-lock.types';

function createDocumentRef(): TngScrollLockDocument {
  return {
    body: {
      style: {},
    },
  };
}

afterEach(() => {
  document.body.innerHTML = '';
  document.body.style.overflow = '';
  document.body.style.paddingRight = '';
  document.body.style.scrollBehavior = '';
  document.documentElement.style.left = '';
  document.documentElement.style.overflowY = '';
  document.documentElement.style.position = '';
  document.documentElement.style.scrollBehavior = '';
  document.documentElement.style.top = '';
  document.documentElement.style.width = '';
});

it('locks a browser viewport while preserving its visible scrollbar and scroll offset', () => {
  const documentRef: TngScrollLockDocument = {
    body: {
      style: { scrollBehavior: 'smooth' },
    },
    documentElement: {
      clientHeight: 800,
      clientWidth: 1180,
      scrollHeight: 1800,
      scrollWidth: 1180,
      style: {
        left: '1px',
        scrollBehavior: 'smooth',
        top: '2px',
      },
    },
  };
  const restoreScrollPosition = vi.fn();
  const manager = createScrollLockManager({
    documentRef,
    getScrollPosition: () => ({ left: 24, top: 160 }),
    restoreScrollPosition,
  });

  manager.acquire('dialog');

  expect(documentRef.documentElement?.style.position).toBe('fixed');
  expect(documentRef.documentElement?.style.width).toBe('100%');
  expect(documentRef.documentElement?.style.overflowY).toBe('scroll');
  expect(documentRef.documentElement?.style.left).toBe('-24px');
  expect(documentRef.documentElement?.style.top).toBe('-160px');
  expect(documentRef.body.style.overflow).toBeUndefined();

  manager.release('dialog');

  expect(documentRef.documentElement?.style.position).toBeUndefined();
  expect(documentRef.documentElement?.style.width).toBeUndefined();
  expect(documentRef.documentElement?.style.overflowY).toBeUndefined();
  expect(documentRef.documentElement?.style.left).toBe('1px');
  expect(documentRef.documentElement?.style.top).toBe('2px');
  expect(documentRef.documentElement?.style.scrollBehavior).toBe('smooth');
  expect(documentRef.body.style.scrollBehavior).toBe('smooth');
  expect(restoreScrollPosition).toHaveBeenCalledWith({ left: 24, top: 160 });
});

it('does not add a scrollbar when an explicit block is acquired on a non-scrollable viewport', () => {
  const documentRef: TngScrollLockDocument = {
    body: { style: {} },
    documentElement: {
      clientHeight: 800,
      clientWidth: 1200,
      scrollHeight: 600,
      scrollWidth: 1200,
      style: {},
    },
  };
  const manager = createScrollLockManager({ documentRef });

  manager.acquire('dialog');

  expect(manager.isLocked()).toBe(true);
  expect(documentRef.documentElement?.style.position).toBeUndefined();
  expect(documentRef.documentElement?.style.overflowY).toBeUndefined();

  manager.release('dialog');
  expect(manager.isLocked()).toBe(false);
});

it('applies lock styles on first acquire and restores on last release', () => {
  const documentRef = createDocumentRef();
  const manager = createScrollLockManager({
    documentRef,
    getScrollbarWidth: () => 12,
  });

  manager.acquire('overlay-a');
  expect(manager.isLocked()).toBe(true);
  expect(documentRef.body.style.overflow).toBe('hidden');
  expect(documentRef.body.style.paddingRight).toBe('12px');

  manager.release('overlay-a');
  expect(manager.isLocked()).toBe(false);
  expect(documentRef.body.style.overflow).toBeUndefined();
  expect(documentRef.body.style.paddingRight).toBeUndefined();
});

it('keeps lock until all ids are released', () => {
  const documentRef = createDocumentRef();
  const manager = createScrollLockManager({ documentRef });

  manager.acquire('a');
  manager.acquire('b');
  manager.release('a');
  expect(manager.isLocked()).toBe(true);
  expect(documentRef.body.style.overflow).toBe('hidden');

  manager.release('b');
  expect(manager.isLocked()).toBe(false);
  expect(documentRef.body.style.overflow).toBeUndefined();
});

it('restores original body style values', () => {
  const documentRef = createDocumentRef();
  documentRef.body.style.overflow = 'clip';
  documentRef.body.style.paddingRight = '4px';
  const manager = createScrollLockManager({
    documentRef,
    getScrollbarWidth: () => 10,
  });

  manager.acquire('a');
  manager.release('a');

  expect(documentRef.body.style.overflow).toBe('clip');
  expect(documentRef.body.style.paddingRight).toBe('4px');
});

it('clear removes all locks and restores styles', () => {
  const documentRef = createDocumentRef();
  const manager = createScrollLockManager({ documentRef });

  manager.acquire('a');
  manager.acquire('b');
  manager.clear();

  expect(manager.getLockIds()).toEqual([]);
  expect(manager.isLocked()).toBe(false);
  expect(documentRef.body.style.overflow).toBeUndefined();
});

it('is no-op when browser mode is unavailable', () => {
  const manager = createScrollLockManager({ documentRef: null });
  manager.acquire('a');
  manager.release('a');

  expect(manager.isLocked()).toBe(false);
});

it('shares global managers per document so nested overlays release independently', () => {
  const documentRef = createDocumentRef();
  const first = getGlobalScrollLockManager({ documentRef });
  const second = getGlobalScrollLockManager({ documentRef });

  expect(first).toBe(second);

  first.acquire('select');
  second.acquire('datepicker');
  first.release('select');

  expect(documentRef.body.style.overflow).toBe('hidden');

  second.release('datepicker');

  expect(documentRef.body.style.overflow).toBeUndefined();
});

it('resolves non-document scrollable ancestors for nested overlay anchors', () => {
  const outer = document.createElement('section');
  const inner = document.createElement('div');
  const anchor = document.createElement('button');
  outer.style.overflow = 'auto';
  inner.style.overflowY = 'visible';

  document.body.appendChild(outer);
  outer.appendChild(inner);
  inner.appendChild(anchor);

  expect(resolveTngScrollableAncestors(anchor)).toEqual([outer]);
  expect(resolveTngScrollableAncestors(anchor, { includeDocument: true })).toEqual([
    outer,
    document.body,
  ]);
});

it('locks element scroll containers with reference counting and restores inline styles', () => {
  const manager = createElementScrollLockManager();
  const container = document.createElement('div');
  container.style.overflow = 'auto';
  container.style.overflowX = 'scroll';
  container.style.overflowY = 'auto';

  manager.acquire('first', [container]);
  manager.acquire('second', [container]);

  expect(manager.isLocked(container)).toBe(true);
  expect(container.style.overflow).toBe('hidden');

  manager.release('first');
  expect(container.style.overflow).toBe('hidden');

  manager.release('second');
  expect(manager.isLocked(container)).toBe(false);
  expect(container.style.overflow).toBe('auto');
  expect(container.style.overflowX).toBe('scroll');
  expect(container.style.overflowY).toBe('auto');
});

it('reports an anchor hidden when it no longer intersects a scroll ancestor', () => {
  const container = document.createElement('div');
  const anchor = document.createElement('button');
  container.appendChild(anchor);
  document.body.appendChild(container);

  vi.spyOn(container, 'getBoundingClientRect').mockReturnValue({
    bottom: 120,
    height: 120,
    left: 0,
    right: 320,
    top: 0,
    width: 320,
    x: 0,
    y: 0,
    toJSON: () => ({}),
  } as DOMRect);
  vi.spyOn(anchor, 'getBoundingClientRect').mockReturnValue({
    bottom: 232,
    height: 32,
    left: 12,
    right: 172,
    top: 200,
    width: 160,
    x: 12,
    y: 200,
    toJSON: () => ({}),
  } as DOMRect);

  expect(isTngAnchorVisibleInScrollAncestors(anchor, [container])).toBe(false);
});
