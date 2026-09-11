import { Directive, TemplateRef, inject } from '@angular/core';
import type { TngFlowDefinition, TngFlowNode } from '../../lib/types/tng-flow.types';
import type {
  TngFlowExecutionPayload,
  TngFlowExecutionPayloadView,
  TngFlowWorkbenchMode,
  TngFlowNodePropertyChanges,
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

export type TngFlowNodePropertiesDataTemplateContext<TData = unknown> = Readonly<{
  $implicit: TData | undefined;
  data: TData | undefined;
  node: TngFlowNode<TData>;
  readonly: boolean;
  requestDataChange: (data: TData | undefined) => void;
  requestNodeChange: (changes: TngFlowNodePropertyChanges<TData>) => void;
}>;

export type TngFlowWorkbenchPaletteTemplateContext<
  TPayload = unknown,
  TNodeData = unknown,
  TConnectionData = unknown,
> = Readonly<{
  definition: TngFlowDefinition<TNodeData, TConnectionData> | null;
  mode: TngFlowWorkbenchMode;
  snapshot: TngFlowRunExecutionSnapshot<TPayload> | null;
}>;

export type TngFlowWorkbenchDetailsTemplateContext<
  TPayload = unknown,
  TNodeData = unknown,
  TConnectionData = unknown,
> = Readonly<{
  definition: TngFlowDefinition<TNodeData, TConnectionData> | null;
  inspectedNode: TngFlowNode<TNodeData> | null;
  inspectedNodeId: string | null;
  mode: TngFlowWorkbenchMode;
  selectedExecution: TngFlowNodeExecution<TPayload> | null;
  snapshot: TngFlowRunExecutionSnapshot<TPayload> | null;
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

@Directive({
  selector: 'ng-template[tngFlowNodePropertiesData]',
})
export class TngFlowNodePropertiesDataTemplateDirective<TData = unknown> {
  public readonly templateRef =
    inject<TemplateRef<TngFlowNodePropertiesDataTemplateContext<TData>>>(TemplateRef);
}

@Directive({
  selector: 'ng-template[tngFlowWorkbenchPalette]',
})
export class TngFlowWorkbenchPaletteTemplateDirective<
  TPayload = unknown,
  TNodeData = unknown,
  TConnectionData = unknown,
> {
  public readonly templateRef =
    inject<
      TemplateRef<TngFlowWorkbenchPaletteTemplateContext<TPayload, TNodeData, TConnectionData>>
    >(TemplateRef);
}

@Directive({
  selector: 'ng-template[tngFlowWorkbenchDetails]',
})
export class TngFlowWorkbenchDetailsTemplateDirective<
  TPayload = unknown,
  TNodeData = unknown,
  TConnectionData = unknown,
> {
  public readonly templateRef =
    inject<
      TemplateRef<TngFlowWorkbenchDetailsTemplateContext<TPayload, TNodeData, TConnectionData>>
    >(TemplateRef);
}
