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

/**
 * OPEN-state icon marker.
 * Consumer must import this directive where the icon is used.
 */
@Directive({
  selector: '[tngExpansionIconOpen]',
  standalone: true,
})
export class TailngExpansionIconOpenDirective {}

/**
 * CLOSE-state icon marker.
 * Consumer must import this directive where the icon is used.
 */
@Directive({
  selector: '[tngExpansionIconClose]',
  standalone: true,
})
export class TailngExpansionIconCloseDirective {}

@Component({
  selector: 'tng-expansion-panel',
  standalone: true,
  templateUrl: './expansion-panel.component.html',
})
export class TailngExpansionPanelComponent {
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
   * Klass hooks
   * ===================== */

  rootKlass = input<string>('rounded-lg border border-border bg-bg');

  headerKlass = input<string>(
    'flex w-full items-center justify-between gap-4 px-4 py-3 text-left text-sm font-medium text-foreground ' +
      'focus:outline-none focus-visible:ring-2 focus-visible:ring-primary ' +
      'disabled:cursor-not-allowed disabled:opacity-60'
  );

  titleKlass = input<string>('flex-1');

  iconWrapperKlass = input<string>(
    'ml-2 shrink-0 inline-flex items-center justify-center'
  );

  chevronKlass = input<string>(
    'h-4 w-4 shrink-0 transition-transform duration-200'
  );

  contentOuterKlass = input<string>(
    'grid transition-[grid-template-rows] duration-200 ease-in-out'
  );

  contentClipKlass = input<string>('overflow-hidden');
  contentBodyKlass = input<string>('text-sm text-muted-foreground');
  contentPaddingKlass = input<string>('px-4 pb-4 pt-2');

    /* =====================
   * Slots (state icons only)
   * ===================== */

    readonly iconOpen = contentChild(TailngExpansionIconOpenDirective);
    readonly iconClose = contentChild(TailngExpansionIconCloseDirective);
  
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
   * Computed
   * ===================== */

  readonly contentRowsKlass = computed(() =>
    this.isOpen() ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
  );

  readonly chevronRotateKlass = computed(() => (this.isOpen() ? 'rotate-180' : ''));

  /* =====================
   * Final Klass (defaults + user overrides)
   * ===================== */

  readonly finalRootKlass = computed(() =>
    this.join('rounded-lg border border-border bg-bg', this.rootKlass()),
  );

  readonly finalHeaderKlass = computed(() =>
    this.join(
      'flex w-full items-center justify-between gap-4 px-4 py-3 text-left text-sm font-medium text-foreground',
      'focus:outline-none focus-visible:ring-2 focus-visible:ring-primary',
      'disabled:cursor-not-allowed disabled:opacity-60',
      this.headerKlass(),
    ),
  );

  readonly finalTitleKlass = computed(() => this.join('flex-1', this.titleKlass()));

  readonly finalIconWrapperKlass = computed(() =>
    this.join('ml-2 shrink-0 inline-flex items-center justify-center', this.iconWrapperKlass()),
  );

  readonly finalChevronKlass = computed(() =>
    this.join('h-4 w-4 shrink-0 transition-transform duration-200', this.chevronKlass()),
  );

  readonly finalContentOuterKlass = computed(() =>
    this.join(
      'grid transition-[grid-template-rows] duration-200 ease-in-out',
      this.contentOuterKlass(),
    ),
  );

  readonly finalContentClipKlass = computed(() =>
    this.join('overflow-hidden', this.contentClipKlass()),
  );

  readonly finalContentBodyKlass = computed(() => {
    const pad = this.padded() ? this.contentPaddingKlass() : '';
    return this.join('text-sm text-muted-foreground', pad, this.contentBodyKlass());
  });

  private join(...parts: Array<string | null | undefined>): string {
    return parts
      .map((p) => (p ?? '').trim())
      .filter(Boolean)
      .join(' ');
  }
}
