import { Component, ContentChild, TemplateRef, input } from '@angular/core';
import { TngAlign } from './table.types';
import { TngCellDefDirective } from './cell.def';
import { TngHeaderDefDirective } from './header.def';

@Component({
  selector: 'tng-col',
  standalone: true,
  template: '',
})
export class TailngColComponent<T> {
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

  // Projected templates
  @ContentChild(TngCellDefDirective)
  cellDef?: TngCellDefDirective<T>;

  @ContentChild(TngHeaderDefDirective)
  headerDef?: TngHeaderDefDirective;

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
