import { Component, input, computed } from '@angular/core';

@Component({
  selector: 'tng-sidenav',
  standalone: true,
  templateUrl: './sidenav.component.html',
})
export class TngSidenav {
  /* =====================
   * State
   * ===================== */
  readonly collapsed = input<boolean>(false);

  /* =====================
   * Tailwind class inputs
   * ===================== */
  readonly rootKlass = input<string>(
    'group h-full bg-bg border-r border-border flex flex-col ' +
    'transition-[width] duration-200 ease-in-out will-change-[width]'
  );
  
  readonly expandedKlass = input<string>('w-64');
  readonly collapsedKlass = input<string>('w-16');

  readonly contentKlass = input<string>('flex-1 overflow-auto');
  readonly footerKlass = input<string>('border-t border-border');

  /* =====================
   * Computed
   * ===================== */
  readonly classes = computed(() =>
    [this.rootKlass(), this.collapsed() ? this.collapsedKlass() : this.expandedKlass()].join(' ')
  );

  /**
   * Expose state as attribute for Tailwind selectors:
   * `data-[collapsed=true]:...`
   */
  readonly dataCollapsed = computed(() => (this.collapsed() ? 'true' : 'false'));
}
