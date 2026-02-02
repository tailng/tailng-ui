import { Component, ContentChild, TemplateRef, effect, inject, input } from '@angular/core';
import { TNG_TABLE } from '../../core/tokens/table.token';
import type { TngAlign, TngColumnFilterMeta } from '../../core/types';
import { TngCellDef } from '../../defs/cell.def';
import { TngHeaderDef } from '../../defs/header.def';

@Component({
  selector: 'tng-col',
  standalone: true,
  template: '',
})
export class TngCol<T> {
  /** unique column id */
  readonly id = input.required<string>();

  /** header label (fallback when no tngHeader template is provided) */
  readonly header = input<string>('');

  /** optional value resolver */
  readonly value = input<((row: T) => unknown) | null>(null);

  /** width (e.g. '120px', '10rem', '20%') */
  readonly width = input<string | null>(null);

  /** alignment */
  readonly align = input<TngAlign>('left');

  /** extra CSS classes applied to th/td */
  readonly klass = input<string | null>(null);

  /** default filter meta (used by tng-filter-panel) */
  readonly filter = input<TngColumnFilterMeta | null>(null);

  private readonly table = inject(TNG_TABLE);

  // Projected templates
  @ContentChild(TngCellDef)
  cellDef?: TngCellDef<T>;

  @ContentChild(TngHeaderDef)
  headerDef?: TngHeaderDef;

  constructor() {
    // Register column meta for default filter panel + any future features
    effect((onCleanup) => {
      const id = this.id();

      this.table.registerColumn({
        id,
        label: this.resolveHeader(),
        filter: this.filter() ?? undefined,
      });

      onCleanup(() => this.table.unregisterColumn(id));
    });
  }

  resolveHeader(): string {
    return this.header() || this.id();
  }

  resolveValue(row: T): unknown {
    const valueFn = this.value();
    return valueFn ? valueFn(row) : (row as any)?.[this.id()];
  }

  resolveCellTpl(): TemplateRef<any> | undefined {
    return this.cellDef?.tpl;
  }

  resolveHeaderTpl(): TemplateRef<any> | undefined {
    return this.headerDef?.tpl;
  }
}
