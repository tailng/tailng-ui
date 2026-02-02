
import { Directive, TemplateRef } from '@angular/core';

@Directive({
  selector: 'ng-template[tngMenuTemplate]',
  standalone: true,
})
export class TailngMenuTemplateDirective {
  constructor(public readonly tpl: TemplateRef<unknown>) {}
}