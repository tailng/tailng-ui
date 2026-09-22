
import { Directive, TemplateRef, inject } from '@angular/core';
import type { TngFlowConnectionTemplateContext } from '../types/tng-flow-connection-template.types';

@Directive({
  selector: 'ng-template[tngFlowConnection], ng-template[tngFlowConnectionLabel]',
  exportAs: 'tngFlowConnectionTemplate',
})
export class TngFlowConnectionTemplateDirective<TData = unknown> {
  public readonly templateRef =
    inject<TemplateRef<TngFlowConnectionTemplateContext<TData>>>(TemplateRef);

  public static ngTemplateContextGuard<TData>(
    _directive: TngFlowConnectionTemplateDirective<TData>,
    _context: unknown,
  ): _context is TngFlowConnectionTemplateContext<TData> {
    return true;
  }
}
