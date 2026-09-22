import { Directive, TemplateRef, inject } from '@angular/core';

@Directive({
  selector: 'ng-template[tngBreadcrumbSeparatorTemplate]',
  exportAs: 'tngBreadcrumbSeparatorTemplate',
})
export class TngBreadcrumbSeparatorTemplateDirective {
  public readonly templateRef = inject<TemplateRef<unknown>>(TemplateRef);
}
