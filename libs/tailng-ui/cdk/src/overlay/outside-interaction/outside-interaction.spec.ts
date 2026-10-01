import { expect, it, vi } from 'vitest';
import { createOverlayInteractionController } from './outside-interaction';
import type {
  TngOverlayInteractionDocument,
  TngOverlayKeyboardEvent,
  TngOverlayPointerEvent,
  TngOverlayFocusEvent,
} from './outside-interaction.types';
import { createOverlayLayerStack } from '../layer-stack/layer-stack';

type TngFakeInteractionListeners = Readonly<{
  keydown: Set<(event: TngOverlayKeyboardEvent) => void>;
  pointerdown: Set<(event: TngOverlayPointerEvent) => void>;
  focusin: Set<(event: TngOverlayFocusEvent) => void>;
}>;

function createFakeInteractionDocument(): Readonly<{
  documentRef: TngOverlayInteractionDocument;
  listeners: TngFakeInteractionListeners;
}> {
  const listeners = {
    keydown: new Set<(event: TngOverlayKeyboardEvent) => void>(),
    pointerdown: new Set<(event: TngOverlayPointerEvent) => void>(),
    focusin: new Set<(event: TngOverlayFocusEvent) => void>(),
  } as const;

  const documentRef: TngOverlayInteractionDocument = {
    addKeydownListener: (listener) => {
      listeners.keydown.add(listener);
    },
    removeKeydownListener: (listener) => {
      listeners.keydown.delete(listener);
    },

    addPointerDownListener: (listener) => {
      listeners.pointerdown.add(listener);
    },
    removePointerDownListener: (listener) => {
      listeners.pointerdown.delete(listener);
    },

    addFocusInListener: (listener) => {
      listeners.focusin.add(listener);
    },
    removeFocusInListener: (listener) => {
      listeners.focusin.delete(listener);
    },
  };

  return { documentRef, listeners };
}

it('dismisses top layer on escape', () => {
  const stack = createOverlayLayerStack();
  const onDismiss = vi.fn();
  stack.register({ id: 'layer', onDismiss });

  const controller = createOverlayInteractionController({ layerStack: stack });
  const event: TngOverlayKeyboardEvent = { key: 'Escape' };
  controller.handleKeydown(event);

  expect(onDismiss).toHaveBeenCalledWith('escape-key');
});

it('does nothing on escape when defaultPrevented', () => {
  const stack = createOverlayLayerStack();
  const onDismiss = vi.fn();
  stack.register({ id: 'layer', onDismiss });

  const controller = createOverlayInteractionController({ layerStack: stack });
  controller.handleKeydown({ key: 'Escape', defaultPrevented: true });

  expect(onDismiss).not.toHaveBeenCalled();
});

it('dismisses top layer on outside pointer', () => {
  const stack = createOverlayLayerStack();
  const onDismiss = vi.fn();
  stack.register({
    containsTarget: () => false,
    id: 'layer',
    onDismiss,
  });

  const controller = createOverlayInteractionController({ layerStack: stack });
  const event: TngOverlayPointerEvent = { target: 'outside' };
  controller.handlePointerDown(event);

  expect(onDismiss).toHaveBeenCalledWith('outside-pointer');
});

it('does nothing on pointerdown when defaultPrevented', () => {
  const stack = createOverlayLayerStack();
  const onDismiss = vi.fn();
  stack.register({
    containsTarget: () => false,
    id: 'layer',
    onDismiss,
  });

  const controller = createOverlayInteractionController({ layerStack: stack });
  controller.handlePointerDown({ target: 'outside', defaultPrevented: true });

  expect(onDismiss).not.toHaveBeenCalled();
});

it('ignores inside pointer for top layer', () => {
  const stack = createOverlayLayerStack();
  const onDismiss = vi.fn();
  stack.register({
    containsTarget: () => true,
    id: 'layer',
    onDismiss,
  });

  const controller = createOverlayInteractionController({ layerStack: stack });
  controller.handlePointerDown({ target: 'inside' });

  expect(onDismiss).not.toHaveBeenCalled();
});

it('does not dismiss on outside focus unless the layer explicitly opts in', () => {
  const stack = createOverlayLayerStack();
  const onDismiss = vi.fn();
  stack.register({
    containsTarget: () => false,
    id: 'layer',
    onDismiss,
  });

  const controller = createOverlayInteractionController({ layerStack: stack });
  controller.handleFocusIn({ target: 'outside' });

  expect(onDismiss).not.toHaveBeenCalled();
});

it('dismisses an opted-in layer with a distinct focus-outside reason', () => {
  const stack = createOverlayLayerStack();
  const onDismiss = vi.fn();
  stack.register({
    containsTarget: () => false,
    dismissOnFocusOutside: true,
    id: 'layer',
    onDismiss,
  });

  const controller = createOverlayInteractionController({ layerStack: stack });
  controller.handleFocusIn({ target: 'outside' });

  expect(onDismiss).toHaveBeenCalledWith('focus-outside');
});

it('start and stop attach listeners through interaction document adapter', () => {
  const stack = createOverlayLayerStack();
  const fake = createFakeInteractionDocument();

  const controller = createOverlayInteractionController({
    documentRef: fake.documentRef,
    layerStack: stack,
  });

  controller.start();
  expect(controller.isStarted()).toBe(true);
  expect(fake.listeners.keydown.size).toBe(1);
  expect(fake.listeners.pointerdown.size).toBe(1);
  expect(fake.listeners.focusin.size).toBe(1);

  controller.stop();
  expect(controller.isStarted()).toBe(false);
  expect(fake.listeners.keydown.size).toBe(0);
  expect(fake.listeners.pointerdown.size).toBe(0);
  expect(fake.listeners.focusin.size).toBe(0);
});

it('uses composedPath when provided', () => {
  const stack = createOverlayLayerStack();
  const containsTarget = vi.fn(() => false);
  stack.register({
    containsTarget,
    id: 'layer',
    onDismiss: () => undefined,
  });

  const controller = createOverlayInteractionController({ layerStack: stack });
  const event: TngOverlayPointerEvent = {
    composedPath: () => ['a', 'b'],
    target: 'outside',
  };
  controller.handlePointerDown(event);

  expect(containsTarget).toHaveBeenCalledWith('outside', ['a', 'b']);
});

it('falls back to [target] when composedPath is missing/empty', () => {
  const stack = createOverlayLayerStack();
  const containsTarget = vi.fn(() => false);
  stack.register({
    containsTarget,
    id: 'layer',
    onDismiss: () => undefined,
  });

  const controller = createOverlayInteractionController({ layerStack: stack });
  controller.handlePointerDown({ target: 'outside' });

  expect(containsTarget).toHaveBeenCalledWith('outside', ['outside']);
});
