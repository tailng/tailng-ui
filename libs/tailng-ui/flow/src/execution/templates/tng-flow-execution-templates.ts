import { Directive, TemplateRef, inject } from '@angular/core';
import type {
  TngFlowExecutionPayload,
  TngFlowExecutionPayloadView,
  TngFlowNodeExecution,
  TngFlowRunExecutionSnapshot,
} from '../model/tng-flow-execution.types';

export type TngFlowExecutionPayloadTemplateContext<TPayload = unknown> = Readonly<{
  $implicit: TngFlowExecutionPayload<TPayload> | null | undefined;
  payload: TngFlowExecutionPayload<TPayload> | null | undefined;
  view: TngFlowExecutionPayloadView;
  title: string;
}>;

export type TngFlowExecutionInspectorTemplateContext<TPayload = unknown> = Readonly<{
  $implicit: TngFlowRunExecutionSnapshot<TPayload> | null;
  snapshot: TngFlowRunExecutionSnapshot<TPayload> | null;
  inspectedNodeId: string | null;
  selectedExecution: TngFlowNodeExecution<TPayload> | null;
}>;

@Directive({
  selector: 'ng-template[tngFlowExecutionPayload]',
})
export class TngFlowExecutionPayloadTemplateDirective<TPayload = unknown> {
  public readonly templateRef =
    inject<TemplateRef<TngFlowExecutionPayloadTemplateContext<TPayload>>>(TemplateRef);
}

@Directive({
  selector: 'ng-template[tngFlowExecutionInspector]',
})
export class TngFlowExecutionInspectorTemplateDirective<TPayload = unknown> {
  public readonly templateRef =
    inject<TemplateRef<TngFlowExecutionInspectorTemplateContext<TPayload>>>(TemplateRef);
}
