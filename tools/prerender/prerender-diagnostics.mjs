const RESIZE_OBSERVER_DELIVERY_ERROR =
  /^(?:ERROR\s+)?(?:Error:\s+)?ResizeObserver loop (?:completed with undelivered notifications|limit exceeded)\.?$/;

export function isKnownNonFatalBrowserError(message) {
  return RESIZE_OBSERVER_DELIVERY_ERROR.test(message.trim());
}
