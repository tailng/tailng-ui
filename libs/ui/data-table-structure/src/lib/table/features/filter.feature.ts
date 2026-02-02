import { signal } from '@angular/core';
import type { TngFilterValue, TngFilters } from '../core/types';

export class TngTableFilterFeature {
  readonly filters = signal<TngFilters>({});

  /** Active filter UI column id ('' means closed) */
  readonly openFilterColId = signal<string>('');

  /** Anchor element for positioning the overlay */
  readonly anchorEl = signal<HTMLElement | null>(null);

  openFilter(colId: string, anchorEl?: HTMLElement | null): void {
    this.openFilterColId.set(colId);
    this.anchorEl.set(anchorEl ?? null);
  }

  closeFilter(): void {
    this.openFilterColId.set('');
    this.anchorEl.set(null);
  }

  toggleFilter(colId: string, anchorEl?: HTMLElement | null): void {
    if (this.openFilterColId() === colId) {
      this.closeFilter();
      return;
    }
    this.openFilter(colId, anchorEl);
  }

  isFilterOpenFor(colId: string): boolean {
    return this.openFilterColId() === colId;
  }

  setFilter(colId: string, value: TngFilterValue): void {
    this.filters.update((cur) => ({ ...cur, [colId]: value }));
  }

  clearFilter(colId: string): void {
    this.filters.update((cur) => {
      if (!(colId in cur)) return cur;
      const next = { ...cur };
      delete next[colId];
      return next;
    });

    if (this.openFilterColId() === colId) this.closeFilter();
  }

  clearAllFilters(): void {
    this.filters.set({});
    this.closeFilter();
  }

  filterValueFor(colId: string): TngFilterValue | undefined {
    return this.filters()[colId];
  }

  isFiltered(colId: string): boolean {
    return colId in this.filters();
  }
}
