
export type KeyboardAction =
  | { type: 'move'; index: number }
  | { type: 'select'; index: number }
  | { type: 'close' }
  | { type: 'noop' };

export interface KeyboardNavigationState {
  activeIndex: number;
  itemCount: number;
  loop?: boolean; // optional: wrap around
}

export function handleListKeyboardEvent(
  event: KeyboardEvent,
  state: KeyboardNavigationState
): KeyboardAction {
  const { activeIndex, itemCount, loop = false } = state;

  if (itemCount <= 0) {
    return { type: 'noop' };
  }

  switch (event.key) {
    case 'ArrowDown': {
      event.preventDefault();

      const next =
        activeIndex < itemCount - 1
          ? activeIndex + 1
          : loop
            ? 0
            : activeIndex;

      return { type: 'move', index: next };
    }

    case 'ArrowUp': {
      event.preventDefault();

      const prev =
        activeIndex > 0
          ? activeIndex - 1
          : loop
            ? itemCount - 1
            : activeIndex;

      return { type: 'move', index: prev };
    }

    case 'Home': {
      event.preventDefault();
      return { type: 'move', index: 0 };
    }

    case 'End': {
      event.preventDefault();
      return { type: 'move', index: itemCount - 1 };
    }

    case 'Enter': {
      if (activeIndex >= 0 && activeIndex < itemCount) {
        event.preventDefault();
        return { type: 'select', index: activeIndex };
      }
      return { type: 'noop' };
    }

    case 'Escape': {
      event.preventDefault();
      return { type: 'close' };
    }

    default:
      return { type: 'noop' };
  }
}
