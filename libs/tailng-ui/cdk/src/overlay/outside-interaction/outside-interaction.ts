import type {
  TngOverlayInteractionController,
  TngOverlayInteractionDocument,
  TngOverlayInteractionOptions,
  TngOverlayKeyboardEvent,
  TngOverlayPointerEvent,
  TngOverlayFocusEvent,
  TngOverlayInteractionDomDocument,
} from './outside-interaction.types';

function isDefaultPrevented(event: Readonly<{ defaultPrevented?: boolean }>): boolean {
  return event.defaultPrevented === true;
}

function toEventPath(
  event: Readonly<{ composedPath?: () => readonly unknown[]; target: unknown }>,
): readonly unknown[] {
  const path = event.composedPath?.();
  if (path !== undefined && path.length > 0) {
    return path;
  }
  return [event.target];
}

class OverlayInteractionController implements TngOverlayInteractionController {
  private readonly documentRef: TngOverlayInteractionDocument | null;

  private readonly keydownListener = (event: TngOverlayKeyboardEvent): void => {
    this.handleKeydown(event);
  };

  private readonly pointerDownListener = (event: TngOverlayPointerEvent): void => {
    this.handlePointerDown(event);
  };

  private readonly focusInListener = (event: TngOverlayFocusEvent): void => {
    this.handleFocusIn(event);
  };

  private started = false;

  public constructor(private readonly options: TngOverlayInteractionOptions) {
    this.documentRef = options.documentRef ?? null;
  }

  public handleKeydown(event: TngOverlayKeyboardEvent): void {
    if (event.key !== 'Escape' || isDefaultPrevented(event)) return;

    const dismissLayer = this.options.layerStack.resolveEscapeDismissTarget();
    if (dismissLayer === null) return;

    dismissLayer.onDismiss('escape-key');
    event.preventDefault?.();
  }

  public handlePointerDown(event: TngOverlayPointerEvent): void {
    if (isDefaultPrevented(event)) return;

    const dismissLayer = this.options.layerStack.resolveOutsidePointerDismissTarget(
      event.target,
      toEventPath(event),
    );
    if (dismissLayer === null) return;

    dismissLayer.onDismiss('outside-pointer');
    event.preventDefault?.();
  }

  public handleFocusIn(event: TngOverlayFocusEvent): void {
    if (isDefaultPrevented(event)) return;

    const dismissLayer = this.options.layerStack.resolveFocusOutsideDismissTarget(
      event.target,
      toEventPath(event),
    );

    if (dismissLayer === null) return;

    dismissLayer.onDismiss('focus-outside');
  }

  public isStarted(): boolean {
    return this.started;
  }

  public start(): void {
    if (this.started || this.documentRef === null) return;

    this.started = true;
    this.documentRef.addKeydownListener(this.keydownListener);
    this.documentRef.addPointerDownListener(this.pointerDownListener);
    this.documentRef.addFocusInListener(this.focusInListener);
  }

  public stop(): void {
    if (!this.started || this.documentRef === null) return;

    this.started = false;
    this.documentRef.removeKeydownListener(this.keydownListener);
    this.documentRef.removePointerDownListener(this.pointerDownListener);
    this.documentRef.removeFocusInListener(this.focusInListener);
  }
}

class OverlayDomInteractionDocument implements TngOverlayInteractionDocument {
  private readonly keydownListenerMap = new Map<
    (event: TngOverlayKeyboardEvent) => void,
    (event: unknown) => void
  >();

  private readonly pointerDownListenerMap = new Map<
    (event: TngOverlayPointerEvent) => void,
    (event: unknown) => void
  >();

  private readonly focusInListenerMap = new Map<
    (event: TngOverlayFocusEvent) => void,
    (event: unknown) => void
  >();

  public constructor(private readonly documentRef: TngOverlayInteractionDomDocument) {}

  public addKeydownListener(listener: (event: TngOverlayKeyboardEvent) => void): void {
    const domListener = (event: unknown): void => listener(event as TngOverlayKeyboardEvent);
    this.keydownListenerMap.set(listener, domListener);

    this.documentRef.addEventListener('keydown', domListener);
  }

  public addPointerDownListener(listener: (event: TngOverlayPointerEvent) => void): void {
    const domListener = (event: unknown): void => listener(event as TngOverlayPointerEvent);
    this.pointerDownListenerMap.set(listener, domListener);

    // capture recommended for outside interactions
    this.documentRef.addEventListener('pointerdown', domListener, true);
  }

  public addFocusInListener(listener: (event: TngOverlayFocusEvent) => void): void {
    const domListener = (event: unknown): void => listener(event as TngOverlayFocusEvent);
    this.focusInListenerMap.set(listener, domListener);

    this.documentRef.addEventListener('focusin', domListener, true);
  }

  public removeKeydownListener(listener: (event: TngOverlayKeyboardEvent) => void): void {
    const domListener = this.keydownListenerMap.get(listener);
    if (domListener === undefined) return;

    this.keydownListenerMap.delete(listener);
    this.documentRef.removeEventListener('keydown', domListener);
  }

  public removePointerDownListener(listener: (event: TngOverlayPointerEvent) => void): void {
    const domListener = this.pointerDownListenerMap.get(listener);
    if (domListener === undefined) return;

    this.pointerDownListenerMap.delete(listener);
    this.documentRef.removeEventListener('pointerdown', domListener, true);
  }

  public removeFocusInListener(listener: (event: TngOverlayFocusEvent) => void): void {
    const domListener = this.focusInListenerMap.get(listener);
    if (domListener === undefined) return;

    this.focusInListenerMap.delete(listener);
    this.documentRef.removeEventListener('focusin', domListener, true);
  }
}

export function createOverlayInteractionController(
  options: TngOverlayInteractionOptions,
): TngOverlayInteractionController {
  return new OverlayInteractionController(options);
}

/**
 * Edge-only helper: convert a real DOM `document` into the adapter interface.
 */
export function createOverlayInteractionDocument(
  documentRef: TngOverlayInteractionDomDocument,
): TngOverlayInteractionDocument {
  return new OverlayDomInteractionDocument(documentRef);
}
