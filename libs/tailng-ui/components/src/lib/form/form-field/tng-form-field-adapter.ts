import type { TngFormFieldControl, TngFormFieldControlKind } from './tng-form-field.control';

/**
 * Shape passed to `createFormFieldAdapter` so each control can describe its
 * focusable element, control kind, and state getters once and reuse the same
 * ARIA wiring boilerplate.
 *
 * - `focusableSelector` is queried against `hostElement` lazily on every read,
 *   so it stays correct even if the control re-renders its internals.
 * - When the focusable element is the host itself (e.g. listbox), omit the
 *   selector — the adapter will use `hostElement` directly.
 */
export type TngFormFieldAdapterDef = {
  hostElement: HTMLElement;
  focusableSelector?: string;
  controlKind: TngFormFieldControlKind;
  isDisabled: () => boolean;
  isFocused: () => boolean;
  isInvalid: () => boolean;
  isRequired: () => boolean;
}

/**
 * Builds a `TngFormFieldControl` adapter object from a small descriptor. Each
 * registered control component provides this via the `TNG_FORM_FIELD_CONTROL`
 * token so the form-field can read state and route ARIA attributes to the
 * right focusable node.
 *
 * The returned object is intentionally a closure over the descriptor: state
 * getters re-read every time the form-field asks, so signal-driven state is
 * picked up automatically without extra wiring.
 */
export function createFormFieldAdapter(def: TngFormFieldAdapterDef): TngFormFieldControl {
  const focusable = (): HTMLElement | null => {
    if (def.focusableSelector === undefined) return def.hostElement;
    return def.hostElement.querySelector<HTMLElement>(def.focusableSelector);
  };

  return {
    controlKind: def.controlKind,
    get id(): string | null {
      const target = focusable();
      const candidate = target?.id ?? '';
      return candidate.length > 0 ? candidate : null;
    },
    get disabled(): boolean {
      return def.isDisabled();
    },
    get focused(): boolean {
      return def.isFocused();
    },
    get invalid(): boolean {
      return def.isInvalid();
    },
    get required(): boolean {
      return def.isRequired();
    },
    get focusableElement(): HTMLElement | null {
      return focusable();
    },
    setDescribedByIds(ids: readonly string[]): void {
      const el = focusable();
      if (el === null) return;
      if (ids.length > 0) {
        el.setAttribute('aria-describedby', ids.join(' '));
      } else {
        el.removeAttribute('aria-describedby');
      }
    },
    setLabelledById(id: string | null): void {
      const el = focusable();
      if (el === null) return;
      if (id === null) {
        el.removeAttribute('aria-labelledby');
      } else {
        el.setAttribute('aria-labelledby', id);
      }
    },
    setAriaInvalid(invalid: boolean): void {
      const el = focusable();
      if (el === null) return;
      if (invalid) {
        el.setAttribute('aria-invalid', 'true');
      } else if (el.getAttribute('aria-invalid') === 'true') {
        el.removeAttribute('aria-invalid');
      }
    },
    setAriaRequired(required: boolean): void {
      const el = focusable();
      if (el === null) return;
      if (required) {
        el.setAttribute('aria-required', 'true');
      } else if (el.getAttribute('aria-required') === 'true') {
        el.removeAttribute('aria-required');
      }
    },
  };
}
