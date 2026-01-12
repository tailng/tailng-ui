import { Directive, TemplateRef } from '@angular/core';
import { TailngHeaderContext } from '../core/table.types';

@Directive({
  selector: 'ng-template[tngHeader]',
  standalone: true,
})
export class TailngHeaderDefDirective {
  constructor(public readonly tpl: TemplateRef<TailngHeaderContext>) {}
}
