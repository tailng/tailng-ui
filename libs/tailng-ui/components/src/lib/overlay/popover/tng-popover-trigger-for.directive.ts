import {
  DestroyRef,
  Directive,
  ElementRef,
  HostListener,
  computed,
  effect,
  inject,
  input,
} from '@angular/core';
import { createTngIdFactory } from '@tailng-ui/cdk';
import type { TngPopoverComponent } from './tng-popover.component';
import { TNG_TRIGGER_TARGET, type TngTriggerTargetAttributes } from '../../trigger-target';

const createPopoverTriggerId = createTngIdFactory('tng-popover-trigger');

@Directive({
  selector: '[tngPopoverTriggerFor]',
  exportAs: 'tngPopoverTriggerFor',
})
export class TngPopoverTriggerFor {
  public readonly tngPopoverTriggerFor = input.required<TngPopoverComponent>();

  private readonly destroyRef = inject(DestroyRef);
  private readonly hostRef = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly triggerTarget = inject(TNG_TRIGGER_TARGET, { optional: true, self: true });
  private readonly triggerElement = computed(
    (): HTMLElement => this.triggerTarget?.getTngTriggerElement() ?? this.hostRef.nativeElement,
  );
  private generatedTriggerId: string | null = null;
  private nativeDisabledInitially = false;

  public constructor() {
    this.setupRegistrationEffect();
    this.setupStateEffect();
    this.setupDestroyCleanup();
  }

  @HostListener('click')
  protected onClick(): void {
    this.tngPopoverTriggerFor().toggleFrom(this.triggerElement());
  }

  private setupRegistrationEffect(): void {
    effect((onCleanup): void => {
      const popover = this.tngPopoverTriggerFor();
      const trigger = this.triggerElement();

      if (trigger.id.trim().length === 0) {
        this.generatedTriggerId = createPopoverTriggerId();
        trigger.id = this.generatedTriggerId;
      }

      this.nativeDisabledInitially = this.isNativeButton(trigger) ? trigger.disabled : false;
      popover.registerTrigger(this, trigger);

      onCleanup((): void => {
        popover.unregisterTrigger(this, trigger);
        if (this.generatedTriggerId !== null && trigger.id === this.generatedTriggerId) {
          trigger.removeAttribute('id');
        }
        this.generatedTriggerId = null;
      });
    });
  }

  private setupStateEffect(): void {
    effect((): void => {
      const popover = this.tngPopoverTriggerFor();
      const trigger = this.triggerElement();
      const open = popover.isOpen();
      const disabled = popover.isDisabled();

      this.setTriggerAttributes(trigger, {
        ariaControls: popover.getPanelId(),
        ariaExpanded: open,
        ariaHasPopup: popover.getAriaHasPopup(),
        disabled,
      });
      trigger.setAttribute('data-slot', 'popover-trigger');
      trigger.setAttribute('data-state', open ? 'open' : 'closed');
      if (disabled) {
        trigger.setAttribute('data-disabled', '');
      } else {
        trigger.removeAttribute('data-disabled');
      }
    });
  }

  private setupDestroyCleanup(): void {
    this.destroyRef.onDestroy((): void => {
      const trigger = this.triggerElement();
      this.setTriggerAttributes(trigger, {
        ariaControls: null,
        ariaExpanded: null,
        ariaHasPopup: null,
        disabled: null,
      });
      trigger.removeAttribute('data-slot');
      trigger.removeAttribute('data-state');
      trigger.removeAttribute('data-disabled');
    });
  }

  private setTriggerAttributes(trigger: HTMLElement, attributes: TngTriggerTargetAttributes): void {
    if (this.triggerTarget !== null) {
      this.triggerTarget.setTngTriggerAttributes(attributes);
      return;
    }

    this.setOrRemoveAttribute(trigger, 'aria-controls', attributes.ariaControls);
    this.setOrRemoveAttribute(
      trigger,
      'aria-expanded',
      attributes.ariaExpanded === null || attributes.ariaExpanded === undefined
        ? null
        : String(attributes.ariaExpanded),
    );
    this.setOrRemoveAttribute(trigger, 'aria-haspopup', attributes.ariaHasPopup);

    if ('disabled' in attributes) {
      const disabled = attributes.disabled;
      if (this.isNativeButton(trigger)) {
        trigger.disabled = this.nativeDisabledInitially || disabled === true;
      } else {
        this.setOrRemoveAttribute(trigger, 'aria-disabled', disabled === true ? 'true' : null);
      }
    }
  }

  private setOrRemoveAttribute(
    trigger: HTMLElement,
    name: string,
    value: string | null | undefined,
  ): void {
    if (value === null || value === undefined) {
      trigger.removeAttribute(name);
    } else {
      trigger.setAttribute(name, value);
    }
  }

  private isNativeButton(trigger: HTMLElement): trigger is HTMLButtonElement {
    return trigger.tagName === 'BUTTON';
  }
}
