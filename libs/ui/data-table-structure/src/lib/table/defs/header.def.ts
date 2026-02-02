import { Directive, TemplateRef } from '@angular/core';
import { TngHeaderContext } from '../core/types';

@Directive({
  selector: 'ng-template[tngHeader]',
  standalone: true,
})
export class TngHeaderDef {
  constructor(public readonly tpl: TemplateRef<TngHeaderContext>) {}
}
