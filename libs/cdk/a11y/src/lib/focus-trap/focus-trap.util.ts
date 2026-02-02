import { FocusTrap, FocusTrapFactory } from '@angular/cdk/a11y';

export type TngFocusTrapOptions = {
  /** CDK 21 signature uses this boolean */
  deferCaptureElements?: boolean;

  /** tailng behavior */
  autoCapture?: boolean;

  /** tailng behavior */
  restoreFocus?: boolean;
};

export type TngFocusTrapHandle = {
  trap: FocusTrap;
  activate: () => void;
  destroy: () => void;
};

export const createTngFocusTrap = (
  factory: FocusTrapFactory,
  element: HTMLElement,
  options: TngFocusTrapOptions = {},
): TngFocusTrapHandle => {
  const previousActive =
    options.restoreFocus === false
      ? null
      : (document.activeElement as HTMLElement | null);

  // CDK 21: create(element, deferCaptureElements?: boolean)
  const trap = factory.create(element, !!options.deferCaptureElements);

  const activate = () => {
    if (options.autoCapture !== false) {
      trap.focusInitialElementWhenReady();
    }
  };

  const destroy = () => {
    trap.destroy();
    if (previousActive && typeof previousActive.focus === 'function') {
      previousActive.focus();
    }
  };

  return { trap, activate, destroy };
};
