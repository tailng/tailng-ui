import { expect, it, vi } from 'vitest';
import { createOverlayLayerStack } from './layer-stack';

it('orders layers by priority and registration order', () => {
  const stack = createOverlayLayerStack();

  stack.register({ id: 'priority-1a', onDismiss: () => undefined, priority: 1 });
  stack.register({ id: 'priority-0', onDismiss: () => undefined, priority: 0 });
  stack.register({ id: 'priority-1b', onDismiss: () => undefined, priority: 1 });

  expect(stack.getLayerIds()).toEqual(['priority-0', 'priority-1a', 'priority-1b']);
  expect(stack.getTopLayer()?.id).toBe('priority-1b');
});

it('dismisses top layer and dismiss by id', () => {
  const stack = createOverlayLayerStack();
  const firstDismiss = vi.fn();
  const secondDismiss = vi.fn();

  stack.register({ id: 'first', onDismiss: firstDismiss });
  stack.register({ id: 'second', onDismiss: secondDismiss });

  stack.dismissTop('escape-key');
  expect(secondDismiss).toHaveBeenCalledWith('escape-key');
  expect(firstDismiss).not.toHaveBeenCalled();

  stack.dismissById('first', 'programmatic');
  expect(firstDismiss).toHaveBeenCalledWith('programmatic');
});

it('resolves dismiss targets from top layer policies', () => {
  const stack = createOverlayLayerStack();

  stack.register({
    dismissOnEscape: false,
    dismissOnFocusOutside: false,
    dismissOnOutsidePointer: false,
    id: 'top',
    onDismiss: () => undefined,
  });

  expect(stack.resolveEscapeDismissTarget()).toBeNull();
  expect(stack.resolveFocusOutsideDismissTarget(null, [])).toBeNull();
  expect(stack.resolveOutsidePointerDismissTarget(null, [])).toBeNull();
});

it('resolves outside focus only for explicitly opted-in layers', () => {
  const stack = createOverlayLayerStack();

  stack.register({
    dismissOnFocusOutside: true,
    id: 'parent',
    onDismiss: () => undefined,
  });
  stack.register({
    dismissOnFocusOutside: false,
    id: 'child',
    onDismiss: () => undefined,
  });

  expect(stack.resolveFocusOutsideDismissTarget('outside', ['outside'])?.id).toBe('parent');
});

it('does not dismiss an opted-in focus layer when focus enters that layer', () => {
  const stack = createOverlayLayerStack();

  stack.register({
    containsTarget: (target) => target === 'inside',
    dismissOnFocusOutside: true,
    id: 'popover',
    onDismiss: () => undefined,
  });

  expect(stack.resolveFocusOutsideDismissTarget('inside', ['inside'])).toBeNull();
});

it('supports top modal lookup', () => {
  const stack = createOverlayLayerStack();

  stack.register({ id: 'base', modal: false, onDismiss: () => undefined });
  stack.register({ id: 'modal', modal: true, onDismiss: () => undefined });
  stack.register({ id: 'tooltip', modal: false, onDismiss: () => undefined });

  expect(stack.getTopModalLayer()?.id).toBe('modal');
});

it('guards nested layers by checking top layer containment', () => {
  const stack = createOverlayLayerStack();

  stack.register({
    id: 'parent',
    onDismiss: () => undefined,
  });
  stack.register({
    containsTarget: (target) => target === 'inside-child',
    id: 'child',
    onDismiss: () => undefined,
  });

  expect(stack.resolveOutsidePointerDismissTarget('inside-child', ['inside-child'])).toBeNull();
  expect(stack.resolveOutsidePointerDismissTarget('outside', ['outside'])?.id).toBe('child');
});

it('ignores unknown unregister and handles replace by id', () => {
  const stack = createOverlayLayerStack();
  const firstDismiss = vi.fn();
  const secondDismiss = vi.fn();

  stack.register({ id: 'layer', onDismiss: firstDismiss, priority: 0 });
  stack.register({ id: 'layer', onDismiss: secondDismiss, priority: 2 });
  stack.unregister('missing');

  expect(stack.getLayerIds()).toEqual(['layer']);
  stack.dismissTop('programmatic');
  expect(firstDismiss).not.toHaveBeenCalled();
  expect(secondDismiss).toHaveBeenCalledWith('programmatic');
});

/**
 * ✅ New: escape falls through if top layer opts out
 */
it('escape resolves the first eligible layer from top (skips dismissOnEscape=false)', () => {
  const stack = createOverlayLayerStack();

  stack.register({ id: 'dialog', onDismiss: () => undefined, dismissOnEscape: true });
  stack.register({ id: 'tooltip', onDismiss: () => undefined, dismissOnEscape: false });

  expect(stack.resolveEscapeDismissTarget()?.id).toBe('dialog');
});

/**
 * ✅ New: outside pointer falls through if top layer opts out
 */
it('outside pointer resolves the first eligible layer from top (skips dismissOnOutsidePointer=false)', () => {
  const stack = createOverlayLayerStack();

  stack.register({
    id: 'menu',
    onDismiss: () => undefined,
    dismissOnOutsidePointer: true,
    containsTarget: (t) => t === 'inside-menu',
  });

  stack.register({
    id: 'tooltip',
    onDismiss: () => undefined,
    dismissOnOutsidePointer: false,
    containsTarget: (t) => t === 'inside-tooltip',
  });

  expect(stack.resolveOutsidePointerDismissTarget('outside', ['outside'])?.id).toBe('menu');
});

/**
 * ✅ New: modal isolation — never dismiss layers under the top modal
 */
it('does not resolve dismiss targets below the top modal layer', () => {
  const stack = createOverlayLayerStack();

  stack.register({
    id: 'base-popover',
    onDismiss: () => undefined,
    dismissOnEscape: true,
    dismissOnOutsidePointer: true,
  });

  stack.register({
    id: 'modal',
    modal: true,
    onDismiss: () => undefined,
    dismissOnEscape: true,
    dismissOnOutsidePointer: true,
    containsTarget: (t) => t === 'inside-modal',
  });

  stack.register({
    id: 'tooltip',
    onDismiss: () => undefined,
    dismissOnEscape: false,
    dismissOnOutsidePointer: false,
  });

  // Escape should resolve modal (tooltip opts out)
  expect(stack.resolveEscapeDismissTarget()?.id).toBe('modal');

  // Outside pointer should resolve modal (tooltip opts out), NOT base-popover
  expect(stack.resolveOutsidePointerDismissTarget('outside', ['outside'])?.id).toBe('modal');
});
