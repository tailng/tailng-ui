import type { TngControllerFeature } from './controller-feature';
import { TngSortController } from './sort.controller';
import { TngFilterController } from './filter.controller';
import { TngColumnMetaController } from './column-meta.controller';

export class TngTableController {

  readonly _featureId = 'table';
  // Keep references to run lifecycle hooks if you need them later
  private readonly features: TngControllerFeature[] = [];

  readonly sortCtrl = new TngSortController();
  readonly filterCtrl = new TngFilterController();
  readonly colMetaCtrl = new TngColumnMetaController();

  constructor() {
    this.features = [this.sortCtrl, this.filterCtrl, this.colMetaCtrl];
    this.features.forEach((f) => f.onInit?.());
  }

  destroy(): void {
    this.features.forEach((f) => f.onDestroy?.());
  }

  // Optional: re-expose a flat API (so existing code doesn't change)
  readonly sort = this.sortCtrl.sort;

  toggleSort = this.sortCtrl.toggleSort.bind(this.sortCtrl);
  setSort = this.sortCtrl.setSort.bind(this.sortCtrl);
  clearSort = this.sortCtrl.clearSort.bind(this.sortCtrl);
  directionFor = this.sortCtrl.directionFor.bind(this.sortCtrl);
  isSorted = this.sortCtrl.isSorted.bind(this.sortCtrl);

  readonly filters = this.filterCtrl.filters;
  readonly openFilterColId = this.filterCtrl.openFilterColId;
  readonly filterAnchorEl = this.filterCtrl.filterAnchorEl;

  setFilterPanelKlass = this.filterCtrl.setFilterPanelKlass.bind(this.filterCtrl);
  filterPanelKlass = this.filterCtrl.filterPanelKlass.bind(this.filterCtrl);

  openFilter = this.filterCtrl.openFilter.bind(this.filterCtrl);
  closeFilter = this.filterCtrl.closeFilter.bind(this.filterCtrl);
  toggleFilter = this.filterCtrl.toggleFilter.bind(this.filterCtrl);
  isFilterOpenFor = this.filterCtrl.isFilterOpenFor.bind(this.filterCtrl);

  setFilter = this.filterCtrl.setFilter.bind(this.filterCtrl);
  clearFilter = this.filterCtrl.clearFilter.bind(this.filterCtrl);
  clearAllFilters = this.filterCtrl.clearAllFilters.bind(this.filterCtrl);
  filterValueFor = this.filterCtrl.filterValueFor.bind(this.filterCtrl);
  isFiltered = this.filterCtrl.isFiltered.bind(this.filterCtrl);
  setFilters = this.filterCtrl.setFilters.bind(this.filterCtrl);

  registerColumn = this.colMetaCtrl.registerColumn.bind(this.colMetaCtrl);
  unregisterColumn = this.colMetaCtrl.unregisterColumn.bind(this.colMetaCtrl);
  metaFor = this.colMetaCtrl.metaFor.bind(this.colMetaCtrl);
}
