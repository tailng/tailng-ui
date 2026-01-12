import { TngTableSortFeature } from '../../features/sort.feature';
import type { TailngSort, TailngSortDir } from '../types';
import type { TailngControllerFeature } from './controller-feature';

export class TailngSortController implements TailngControllerFeature {

  readonly featureId = 'sort';
  
  private readonly feature = new TngTableSortFeature();

  readonly sort = this.feature.sort;

  toggleSort(active: string): void {
    this.feature.toggleSort(active);
  }
  setSort(sort: TailngSort): void {
    this.feature.setSort(sort);
  }
  clearSort(): void {
    this.feature.clearSort();
  }
  directionFor(colId: string): TailngSortDir {
    return this.feature.directionFor(colId);
  }
  isSorted(colId: string): boolean {
    return this.feature.isSorted(colId);
  }
}
