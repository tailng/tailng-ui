import { expect, it } from 'vitest';
import { createOverlayRuntime, type TngOverlayRuntime } from './overlay-runtime';
import type {
  TngOverlayDismissReason,
  TngOverlayLayer,
} from '../layer-stack/layer-stack.types';

type TngDismissEvent = Readonly<{
  id: string;
  reason: TngOverlayDismissReason;
}>;

type TngCreateLayerOptions = Readonly<{
  containsTarget: (target: unknown, path: readonly unknown[]) => boolean;
  dismissOnFocusOutside?: boolean;
  id: string;
  onDismiss: (event: TngDismissEvent) => void;
}>;

function createLayer(
  runtime: TngOverlayRuntime,
  options: TngCreateLayerOptions,
): TngOverlayLayer {
  return {
    containsTarget: options.containsTarget,
    dismissOnFocusOutside: options.dismissOnFocusOutside,
    id: options.id,
    onDismiss: (reason: TngOverlayDismissReason): void => {
      options.onDismiss({ id: options.id, reason });
      runtime.unregisterLayer(options.id);
    },
  };
}

it('keeps outside focus opt-in and dispatches a distinct reason', () => {
  const runtime = createOverlayRuntime();
  const dismissEvents: TngDismissEvent[] = [];
  runtime.registerLayer(
    createLayer(runtime, {
      containsTarget: containsNever,
      dismissOnFocusOutside: true,
      id: 'popover',
      onDismiss: (event): void => {
        dismissEvents.push(event);
      },
    }),
  );

  runtime.dispatchFocusIn({ target: 'outside' });

  expect(dismissEvents).toEqual([{ id: 'popover', reason: 'focus-outside' }]);
});

function containsNever(): boolean {
  return false;
}

function containsPanel(
  panel: Readonly<{ id: string }>,
  target: unknown,
  path: readonly unknown[],
): boolean {
  if (path.includes(panel)) {
    return true;
  }

  return target === panel;
}

it('dismisses only the top-most layer on escape key', () => {
  const runtime = createOverlayRuntime();
  const dismissEvents: TngDismissEvent[] = [];
  runtime.registerLayer(
    createLayer(runtime, {
      containsTarget: containsNever,
      id: 'dialog',
      onDismiss: (event): void => {
        dismissEvents.push(event);
      },
    }),
  );
  runtime.registerLayer(
    createLayer(runtime, {
      containsTarget: containsNever,
      id: 'popover',
      onDismiss: (event): void => {
        dismissEvents.push(event);
      },
    }),
  );

  runtime.dispatchKeydown({ key: 'Escape' });
  expect(dismissEvents).toEqual([{ id: 'popover', reason: 'escape-key' }]);
  expect(runtime.getLayerIds()).toEqual(['dialog']);
  expect(runtime.isTopLayer('dialog')).toBe(true);
});

it('ignores outside-pointer dismiss when event target belongs to top layer path', () => {
  const runtime = createOverlayRuntime();
  const dismissEvents: TngDismissEvent[] = [];
  const topPanel = { id: 'top-panel' };
  runtime.registerLayer(
    createLayer(runtime, {
      containsTarget: containsNever,
      id: 'dialog',
      onDismiss: (event): void => {
        dismissEvents.push(event);
      },
    }),
  );
  runtime.registerLayer(
    createLayer(runtime, {
      containsTarget: containsPanel.bind(null, topPanel),
      id: 'popover',
      onDismiss: (event): void => {
        dismissEvents.push(event);
      },
    }),
  );

  runtime.dispatchPointerDown({
    composedPath: () => [topPanel],
    target: topPanel,
  });

  expect(dismissEvents).toEqual([]);
  expect(runtime.getLayerIds()).toEqual(['dialog', 'popover']);
  expect(runtime.isTopLayer('popover')).toBe(true);
});

it('dismisses top layer first, then next layer on subsequent outside-pointer', () => {
  const runtime = createOverlayRuntime();
  const dismissEvents: TngDismissEvent[] = [];
  runtime.registerLayer(
    createLayer(runtime, {
      containsTarget: containsNever,
      id: 'dialog',
      onDismiss: (event): void => {
        dismissEvents.push(event);
      },
    }),
  );
  runtime.registerLayer(
    createLayer(runtime, {
      containsTarget: containsNever,
      id: 'popover',
      onDismiss: (event): void => {
        dismissEvents.push(event);
      },
    }),
  );

  runtime.dispatchPointerDown({ target: { id: 'outside-1' } });
  runtime.dispatchPointerDown({ target: { id: 'outside-2' } });

  expect(dismissEvents).toEqual([
    { id: 'popover', reason: 'outside-pointer' },
    { id: 'dialog', reason: 'outside-pointer' },
  ]);
  expect(runtime.getLayerIds()).toEqual([]);
});
