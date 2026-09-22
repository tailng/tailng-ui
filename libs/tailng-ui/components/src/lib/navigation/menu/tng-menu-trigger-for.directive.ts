import { Directive, ElementRef, HostListener, effect, inject, input } from '@angular/core';
import { createTngIdFactory } from '@tailng-ui/cdk';
import type { TngMenu } from '@tailng-ui/primitives';
import { TNG_TRIGGER_TARGET, type TngTriggerTargetAttributes } from '../../trigger-target';

type TngMenuTriggerKeyboardEvent = Readonly<Pick<KeyboardEvent, 'key'>> &
  Readonly<{ preventDefault: () => void }>;

type TngMenuOpenFocusAction = 'none' | 'first' | 'last';

const createMenuTriggerId = createTngIdFactory('tng-menu-trigger');

function resolveFocusActionForOpenKey(key: string): TngMenuOpenFocusAction | null {
  switch (key) {
    case 'ArrowDown':
      return 'first';
    case 'ArrowUp':
      return 'last';
    case 'Enter':
    case ' ':
      return 'none';
    default:
      return null;
  }
}

@Directive({
  selector: '[tngMenuTriggerFor]',
  exportAs: 'tngMenuTriggerFor',
})
export class TngMenuTriggerFor {
  public readonly tngMenuTriggerFor = input.required<TngMenu>();

  private readonly hostRef = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly triggerTarget = inject(TNG_TRIGGER_TARGET, { optional: true, self: true });

  public constructor() {
    effect((onCleanup): void => {
      const menu = this.tngMenuTriggerFor();
      const trigger = this.triggerTarget?.getTngTriggerElement() ?? this.hostRef.nativeElement;
      const generatedTriggerId = this.ensureTriggerId(trigger);
      this.setTriggerAttributes(trigger, {
        ariaHasPopup: 'menu',
      });
      menu.setTriggerElement(trigger, () => this.syncAriaState(trigger));
      menu.setRestoreFocusOnOutsideClick(false);
      this.syncAriaState(trigger);

      onCleanup((): void => {
        menu.clearTriggerLink(trigger);
        this.setTriggerAttributes(trigger, {
          ariaHasPopup: null,
          ariaControls: null,
          ariaExpanded: null,
        });
        if (generatedTriggerId) {
          trigger.removeAttribute('id');
        }
      });
    });
  }

  @HostListener('click')
  protected onClick(): void {
    const menu = this.tngMenuTriggerFor();
    if (menu.isDisabled()) {
      return;
    }

    if (menu.isOpen()) {
      menu.close(true);
      return;
    }

    menu.open('none');
  }

  @HostListener('keydown', ['$event'])
  protected onKeydown(event: TngMenuTriggerKeyboardEvent): void {
    const menu = this.tngMenuTriggerFor();
    if (menu.isDisabled()) {
      return;
    }

    const focusAction = resolveFocusActionForOpenKey(event.key);
    if (focusAction !== null) {
      event.preventDefault();
      menu.open(focusAction);
      return;
    }

    if (event.key === 'Escape' && menu.isOpen()) {
      event.preventDefault();
      menu.close(true);
    }
  }

  private syncAriaState(trigger: HTMLElement): void {
    const menu = this.tngMenuTriggerFor();

    this.setTriggerAttributes(trigger, {
      ariaControls: menu.id,
      ariaExpanded: menu.isOpen(),
    });
  }

  private ensureTriggerId(trigger: HTMLElement): boolean {
    if (trigger.id.length > 0) {
      return false;
    }

    trigger.id = createMenuTriggerId();
    return true;
  }

  private setTriggerAttributes(trigger: HTMLElement, attributes: TngTriggerTargetAttributes): void {
    if (this.triggerTarget !== null) {
      this.triggerTarget.setTngTriggerAttributes(attributes);
      return;
    }

    this.applyAriaHasPopupAttribute(trigger, attributes);
    this.applyAriaControlsAttribute(trigger, attributes);
    this.applyAriaExpandedAttribute(trigger, attributes);
  }

  private applyAriaHasPopupAttribute(
    trigger: HTMLElement,
    attributes: TngTriggerTargetAttributes,
  ): void {
    if ('ariaHasPopup' in attributes) {
      this.setOrRemoveAttribute(trigger, 'aria-haspopup', attributes.ariaHasPopup);
    }
  }

  private applyAriaControlsAttribute(
    trigger: HTMLElement,
    attributes: TngTriggerTargetAttributes,
  ): void {
    if ('ariaControls' in attributes) {
      this.setOrRemoveAttribute(trigger, 'aria-controls', attributes.ariaControls);
    }
  }

  private applyAriaExpandedAttribute(
    trigger: HTMLElement,
    attributes: TngTriggerTargetAttributes,
  ): void {
    if ('ariaExpanded' in attributes) {
      this.setOrRemoveAttribute(
        trigger,
        'aria-expanded',
        this.toAriaExpandedAttributeValue(attributes.ariaExpanded),
      );
    }
  }

  private toAriaExpandedAttributeValue(value: boolean | null | undefined): 'false' | 'true' | null {
    if (value === null || value === undefined) {
      return null;
    }

    return value ? 'true' : 'false';
  }

  private setOrRemoveAttribute(
    trigger: HTMLElement,
    name: string,
    value: boolean | string | null | undefined,
  ): void {
    if (value === null || value === undefined) {
      trigger.removeAttribute(name);
      return;
    }

    trigger.setAttribute(name, String(value));
  }
}
