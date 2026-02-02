import { Directive, TemplateRef } from '@angular/core';
import { TngCellContext } from '../core/types';

@Directive({
  selector: 'ng-template[tngCell]',
  standalone: true,
})
export class TngCellDef<T = unknown> {
  constructor(public readonly tpl: TemplateRef<TngCellContext<T>>) {}
}
