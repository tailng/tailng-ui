// core/features/sort.feature.ts
import { signal } from '@angular/core';
import type { TngSort, TngSortDir } from '../core/types';

export class TngTableSortFeature {
  readonly sort = signal<TngSort>({ active: '', direction: '' });

  toggleSort(active: string): void {
    const cur = this.sort();
    const same = cur.active === active;

    const nextDir: TngSortDir =
      !same ? 'asc' : cur.direction === 'asc' ? 'desc' : cur.direction === 'desc' ? '' : 'asc';

    this.sort.set({
      active: nextDir ? active : '',
      direction: nextDir,
    });
  }

  setSort(sort: TngSort): void {
    this.sort.set(sort);
  }

  clearSort(): void {
    this.sort.set({ active: '', direction: '' });
  }

  directionFor(colId: string): TngSortDir {
    const s = this.sort();
    return s.active === colId ? s.direction : '';
  }

  isSorted(colId: string): boolean {
    return this.directionFor(colId) !== '';
  }
}
