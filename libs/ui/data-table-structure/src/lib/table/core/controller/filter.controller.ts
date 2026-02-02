import { signal } from '@angular/core';
import { TngTableFilterFeature } from '../../features/filter.feature';
import type { TngFilterValue, TngFilters } from '../types';
import type { TngControllerFeature } from './controller-feature';

export class TngFilterController implements TngControllerFeature {
  
  readonly featureId = 'filter';
  
  private readonly feature = new TngTableFilterFeature();

  readonly filters = this.feature.filters;
  readonly openFilterColId = this.feature.openFilterColId;
  readonly filterAnchorEl = this.feature.anchorEl;

  private readonly _filterPanelKlass = signal<string>('');

  setFilterPanelKlass(v: string): void {
    this._filterPanelKlass.set(v);
  }
  filterPanelKlass(): string {
    return this._filterPanelKlass();
  }

  openFilter(colId: string, anchorEl?: HTMLElement | null): void {
    this.feature.openFilter(colId, anchorEl);
  }
  closeFilter(): void {
    this.feature.closeFilter();
  }
  toggleFilter(colId: string, anchorEl?: HTMLElement | null): void {
    this.feature.toggleFilter(colId, anchorEl);
  }
  isFilterOpenFor(colId: string): boolean {
    return this.feature.isFilterOpenFor(colId);
  }

  setFilter(colId: string, value: TngFilterValue): void {
    this.feature.setFilter(colId, value);
  }
  clearFilter(colId: string): void {
    this.feature.clearFilter(colId);
  }
  clearAllFilters(): void {
    this.feature.clearAllFilters();
  }

  filterValueFor(colId: string): TngFilterValue | undefined {
    return this.feature.filterValueFor(colId);
  }
  isFiltered(colId: string): boolean {
    return this.feature.isFiltered(colId);
  }

  setFilters(filters: TngFilters): void {
    this.filters.set(filters);
  }
}
