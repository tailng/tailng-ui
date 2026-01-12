
import { signal } from '@angular/core';
import { TngTableSortFeature } from '../features/sort.feature';
import { TngTableFilterFeature } from '../features/filter.feature';
import type {
  TailngSort,
  TailngSortDir,
  TailngFilterValue,
  TailngFilters,
  TailngColumnMeta,
} from './table.types';

export class TailngTableController {
  private readonly sortFeature = new TngTableSortFeature();
  private readonly filterFeature = new TngTableFilterFeature();

  // -------------------- SORT --------------------
  readonly sort = this.sortFeature.sort;

  toggleSort(active: string): void {
    this.sortFeature.toggleSort(active);
  }
  setSort(sort: TailngSort): void {
    this.sortFeature.setSort(sort);
  }
  clearSort(): void {
    this.sortFeature.clearSort();
  }
  directionFor(colId: string): TailngSortDir {
    return this.sortFeature.directionFor(colId);
  }
  isSorted(colId: string): boolean {
    return this.sortFeature.isSorted(colId);
  }

  // -------------------- FILTER --------------------
  readonly filters = this.filterFeature.filters;
  readonly openFilterColId = this.filterFeature.openFilterColId;
  readonly filterAnchorEl = this.filterFeature.anchorEl;

  openFilter(colId: string, anchorEl?: HTMLElement | null): void {
    this.filterFeature.openFilter(colId, anchorEl);
  }
  closeFilter(): void {
    this.filterFeature.closeFilter();
  }
  toggleFilter(colId: string, anchorEl?: HTMLElement | null): void {
    this.filterFeature.toggleFilter(colId, anchorEl);
  }
  isFilterOpenFor(colId: string): boolean {
    return this.filterFeature.isFilterOpenFor(colId);
  }

  setFilter(colId: string, value: TailngFilterValue): void {
    this.filterFeature.setFilter(colId, value);
  }
  clearFilter(colId: string): void {
    this.filterFeature.clearFilter(colId);
  }
  clearAllFilters(): void {
    this.filterFeature.clearAllFilters();
  }

  filterValueFor(colId: string): TailngFilterValue | undefined {
    return this.filterFeature.filterValueFor(colId);
  }
  isFiltered(colId: string): boolean {
    return this.filterFeature.isFiltered(colId);
  }

  setFilters(filters: TailngFilters): void {
    this.filters.set(filters);
  }

  // -------------------- COLUMN META (for default filters) --------------------
  private readonly colMeta = signal<Record<string, TailngColumnMeta>>({});

  registerColumn(meta: TailngColumnMeta): void {
    this.colMeta.update((cur) => ({ ...cur, [meta.id]: meta }));
  }

  unregisterColumn(colId: string): void {
    this.colMeta.update((cur) => {
      if (!(colId in cur)) return cur;
      const next = { ...cur };
      delete next[colId];
      return next;
    });
  }

  metaFor(colId: string): TailngColumnMeta | undefined {
    return this.colMeta()[colId];
  }
}
