import { signal } from '@angular/core';
import type { TngColumnMeta } from '../types';
import type { TngControllerFeature } from './controller-feature';

export class TngColumnMetaController implements TngControllerFeature {

  readonly featureId = 'column-meta';
  
  private readonly colMeta = signal<Record<string, TngColumnMeta>>({});

  registerColumn(meta: TngColumnMeta): void {
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

  metaFor(colId: string): TngColumnMeta | undefined {
    return this.colMeta()[colId];
  }
}
