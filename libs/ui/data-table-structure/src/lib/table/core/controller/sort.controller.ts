import { TngTableSortFeature } from '../../features/sort.feature';
import type { TngSort, TngSortDir } from '../types';
import type { TngControllerFeature } from './controller-feature';

export class TngSortController implements TngControllerFeature {

  readonly featureId = 'sort';
  
  private readonly feature = new TngTableSortFeature();

  readonly sort = this.feature.sort;

  toggleSort(active: string): void {
    this.feature.toggleSort(active);
  }
  setSort(sort: TngSort): void {
    this.feature.setSort(sort);
  }
  clearSort(): void {
    this.feature.clearSort();
  }
  directionFor(colId: string): TngSortDir {
    return this.feature.directionFor(colId);
  }
  isSorted(colId: string): boolean {
    return this.feature.isSorted(colId);
  }
}
