// core/features/sort.feature.ts
import { signal } from '@angular/core';
import type { TailngSort, TailngSortDir } from '../core/types';

export class TngTableSortFeature {
  readonly sort = signal<TailngSort>({ active: '', direction: '' });

  toggleSort(active: string): void {
    const cur = this.sort();
    const same = cur.active === active;

    const nextDir: TailngSortDir =
      !same ? 'asc' : cur.direction === 'asc' ? 'desc' : cur.direction === 'desc' ? '' : 'asc';

    this.sort.set({
      active: nextDir ? active : '',
      direction: nextDir,
    });
  }

  setSort(sort: TailngSort): void {
    this.sort.set(sort);
  }

  clearSort(): void {
    this.sort.set({ active: '', direction: '' });
  }

  directionFor(colId: string): TailngSortDir {
    const s = this.sort();
    return s.active === colId ? s.direction : '';
  }

  isSorted(colId: string): boolean {
    return this.directionFor(colId) !== '';
  }
}
