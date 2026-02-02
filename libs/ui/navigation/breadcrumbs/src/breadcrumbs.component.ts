import { Component, computed, input } from '@angular/core';
import { RouterLink } from '@angular/router';

export type TngBreadcrumbItem = {
  label: string;

  /** Internal route */
  route?: string;

  /** External link */
  href?: string;
  target?: '_self' | '_blank' | '_parent' | '_top';
  rel?: string;

  /** If true, renders as current page even if not last */
  current?: boolean;

  /** If true, not clickable */
  disabled?: boolean;
};

@Component({
  selector: 'tng-breadcrumbs',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './breadcrumbs.component.html',
})
export class TailngBreadcrumbsComponent {
  /** Items */
  readonly items = input<TngBreadcrumbItem[]>([]);

  /** Optional Home crumb (prepended) */
  readonly home = input<TngBreadcrumbItem | null>(null);

  /** Separator text (if you later want icons, change template to project) */
  readonly separator = input<string>('/');

  /** a11y label */
  readonly ariaLabel = input<string>('Breadcrumb');

  /* =====================
   * Klass inputs (Tailng style)
   * ===================== */
  readonly rootKlass = input<string>('flex items-center text-sm text-muted-foreground');
  readonly listKlass = input<string>('flex items-center flex-wrap gap-1');
  readonly itemKlass = input<string>('inline-flex items-center');

  readonly linkKlass = input<string>('text-primary hover:underline');
  readonly currentKlass = input<string>('text-foreground font-medium');
  readonly disabledKlass = input<string>('opacity-60 pointer-events-none');

  readonly separatorKlass = input<string>('mx-2 text-slate-400');

  /* =====================
   * Derived
   * ===================== */
  readonly resolvedItems = computed<TngBreadcrumbItem[]>(() => {
    const home = this.home();
    const items = this.items() ?? [];
    return home ? [home, ...items] : items;
  });

  readonly currentIndex = computed(() => {
    const items = this.resolvedItems();
    const explicit = items.findIndex((x) => !!x.current);
    return explicit >= 0 ? explicit : Math.max(0, items.length - 1);
  });

  isCurrent(i: number): boolean {
    return i === this.currentIndex();
  }

  isClickable(item: TngBreadcrumbItem, i: number): boolean {
    if (item.disabled) return false;
    if (this.isCurrent(i)) return false;
    return !!item.route || !!item.href;
  }

  itemClasses(item: TngBreadcrumbItem, i: number): string {
    const base = this.itemKlass();
    const disabled = item.disabled ? ` ${this.disabledKlass()}` : '';
    return `${base}${disabled}`.trim();
  }

  labelClasses(item: TngBreadcrumbItem, i: number): string {
    const isCurrent = this.isCurrent(i);
    return (isCurrent ? this.currentKlass() : this.linkKlass()).trim();
  }

  relFor(item: TngBreadcrumbItem): string | null {
    if (!item.href) return null;
    if (item.rel) return item.rel;
    return item.target === '_blank' ? 'noopener noreferrer' : null;
  }
}
