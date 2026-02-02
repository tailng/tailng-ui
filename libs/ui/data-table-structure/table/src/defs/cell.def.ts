import { Directive, TemplateRef } from '@angular/core';
import { TailngCellContext } from '../core/types';

@Directive({
  selector: 'ng-template[tngCell]',
  standalone: true,
})
export class TailngCellDefDirective<T = unknown> {
  constructor(public readonly tpl: TemplateRef<TailngCellContext<T>>) {}
}
