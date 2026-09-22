import { InjectionToken } from '@angular/core';

/**
 * Hints the form-field can use to pick an appearance / layout default for a
 * registered control. Authors can still override via the `appearance` and
 * `controlType` inputs on `<tng-form-field>`.
 *
 * - `text` — text-input-like controls; default to outlined frame.
 * - `inline` — small toggle-shaped controls (switch, toggle, checkbox);
 *   default to plain frame with label trailing on the same row.
 * - `group` — controls that own multiple internal items (toggle-group, radio-group);
 *   default to plain frame.
 * - `composite` — controls with their own internal chrome
 *   (slider, listbox, OTP, datepicker wrappers); default to plain frame.
 */
export type TngFormFieldControlKind = 'text' | 'inline' | 'group' | 'composite';

export type TngFormFieldControl = {
  readonly id: string | null;
  readonly disabled: boolean;
  readonly focused: boolean;
  readonly invalid: boolean;
  readonly required: boolean;

  /**
   * Optional: the actual focusable element inside the control. Used to wire
   * `<label for="">` and `aria-describedby` to the right node when the
   * control's host is not the focusable element (e.g. switch, slider, OTP).
   */
  readonly focusableElement?: HTMLElement | null;

  /**
   * Optional: lets the control hint at its intended appearance / layout so the
   * form-field can pick smart defaults. Authors can still override via inputs.
   */
  readonly controlKind?: TngFormFieldControlKind;

  setDescribedByIds(ids: readonly string[]): void;
  setLabelledById?(id: string | null): void;
  setAriaInvalid?(invalid: boolean): void;
  setAriaRequired?(required: boolean): void;
}

export const TNG_FORM_FIELD_CONTROL = new InjectionToken<TngFormFieldControl>(
  'TNG_FORM_FIELD_CONTROL',
);

