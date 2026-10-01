import { InjectionToken } from '@angular/core';

export type TngTriggerTargetAttributes = Readonly<{
  ariaControls?: string | null;
  ariaExpanded?: boolean | null;
  ariaHasPopup?: string | null;
  disabled?: boolean | null;
}>;

export type TngTriggerTarget = Readonly<{
  getTngTriggerElement(): HTMLElement | null;
  setTngTriggerAttributes(attributes: TngTriggerTargetAttributes): void;
}>;

export const TNG_TRIGGER_TARGET = new InjectionToken<TngTriggerTarget>('TNG_TRIGGER_TARGET');
