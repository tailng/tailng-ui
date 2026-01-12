import { signal } from '@angular/core';
import type { TailngColumnMeta } from './table.types';
import type { TailngControllerFeature } from './controller-feature';

export class TailngColumnMetaController implements TailngControllerFeature {

  readonly featureId = 'column-meta';
  
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
