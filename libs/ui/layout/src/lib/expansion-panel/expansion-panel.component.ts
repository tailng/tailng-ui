import {
  Component,
  Directive,
  computed,
  contentChild,
  effect,
  input,
  output,
  signal,
} from '@angular/core';
import { booleanAttribute } from '@angular/core';
import { TngSlotMap, TngSlotValue } from '@tailng-ui/ui';

import { TngExpansionPanelSlot } from './expansion-panel.slots';

/**
 * OPEN-state icon marker.
 * Consumer must import this directive where the icon is used.
 */
@Directive({
  selector: '[tngExpansionIconOpen]',
  standalone: true,
})
export class TngExpansionIconOpen {}

/**
 * CLOSE-state icon marker.
 * Consumer must import this directive where the icon is used.
 */
@Directive({
  selector: '[tngExpansionIconClose]',
  standalone: true,
})
export class TngExpansionIconClose {}

@Component({
  selector: 'tng-expansion-panel',
  standalone: true,
  templateUrl: './expansion-panel.component.html',
})
export class TngExpansionPanel {
  /* =====================
   * Inputs
   * ===================== */

  open = input(false, { transform: booleanAttribute });
  disabled = input(false, { transform: booleanAttribute });
  padded = input(true, { transform: booleanAttribute });

  /* =====================
   * Outputs
   * ===================== */

  openChange = output<boolean>();

  /* =====================
   * Slot hooks (micro styling)
   * ===================== */

  slot = input<TngSlotMap<TngExpansionPanelSlot>>({});

    /* =====================
   * Slots (state icons only)
   * ===================== */

    readonly iconOpen = contentChild(TngExpansionIconOpen);
    readonly iconClose = contentChild(TngExpansionIconClose);
  
    readonly hasOpenIcon = computed(() => !!this.iconOpen());
    readonly hasCloseIcon = computed(() => !!this.iconClose());
    readonly hasAnyCustomIcon = computed(() => this.hasOpenIcon() || this.hasCloseIcon());
  
    // Stable rendering flags (avoid ng-content inside @if)
    readonly showOpenIcon = computed(() => {
      if (!this.hasAnyCustomIcon()) return false;
      if (this.hasOpenIcon() && this.hasCloseIcon()) return this.isOpen();
      if (this.hasOpenIcon()) return true; // only open provided -> use for both states
      return false;
    });
  
    readonly showCloseIcon = computed(() => {
      if (!this.hasAnyCustomIcon()) return false;
      if (this.hasOpenIcon() && this.hasCloseIcon()) return !this.isOpen();
      if (this.hasCloseIcon()) return true; // only close provided -> use for both states
      return false;
    });
  

  /* =====================
   * State
   * ===================== */

  private readonly _isOpen = signal(false);
  readonly isOpen = this._isOpen.asReadonly();

  constructor() {
    effect(() => {
      this._isOpen.set(this.open());
    });
  }

  toggle(): void {
    if (this.disabled()) return;
    const next = !this._isOpen();
    this._isOpen.set(next);
    this.openChange.emit(next);
  }

  /* =====================
   * Internal computed classes
   * ===================== */

  readonly contentRowsClass = computed(() =>
    this.isOpen() ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
  );

  readonly chevronRotateClass = computed(() => (this.isOpen() ? 'rotate-180' : ''));

  /* =====================
   * Class finals (defaults + slot overrides)
   * ===================== */

  readonly containerClassFinal = computed(() =>
    this.cx('rounded-lg border border-border bg-bg', this.slotClass('container')),
  );

  readonly headerClassFinal = computed(() =>
    this.cx(
      'flex w-full items-center justify-between gap-4 px-4 py-3 text-left text-sm font-medium text-foreground',
      'focus:outline-none focus-visible:ring-2 focus-visible:ring-primary',
      'disabled:cursor-not-allowed disabled:opacity-60',
      this.slotClass('header'),
    ),
  );

  readonly titleClassFinal = computed(() =>
    this.cx('flex-1', this.slotClass('title')),
  );

  readonly iconWrapperClassFinal = computed(() =>
    this.cx('ml-2 shrink-0 inline-flex items-center justify-center', this.slotClass('iconWrapper')),
  );

  readonly chevronClassFinal = computed(() =>
    this.cx('h-4 w-4 shrink-0 transition-transform duration-200', this.slotClass('chevron')),
  );

  readonly contentOuterClassFinal = computed(() =>
    this.cx(
      'grid transition-[grid-template-rows] duration-200 ease-in-out',
      this.slotClass('contentOuter'),
    ),
  );

  readonly contentClipClassFinal = computed(() =>
    this.cx('overflow-hidden', this.slotClass('contentClip')),
  );

  readonly contentBodyClassFinal = computed(() => {
    const pad = this.padded() ? (this.slotClass('contentPadding') || 'px-4 pb-4 pt-2') : '';
    return this.cx('text-sm text-muted-foreground', pad, this.slotClass('contentBody'));
  });

  private slotClass(key: TngExpansionPanelSlot): TngSlotValue {
    return this.slot()?.[key];
  }

  private cx(...parts: Array<TngSlotValue>): string {
    return parts
      .flatMap((p) => (Array.isArray(p) ? p : [p]))
      .map((p) => (p ?? '').toString().trim())
      .filter(Boolean)
      .join(' ');
  }
}
