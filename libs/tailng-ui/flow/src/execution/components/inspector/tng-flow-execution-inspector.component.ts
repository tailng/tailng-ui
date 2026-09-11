import { NgTemplateOutlet } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  contentChild,
  input,
  output,
} from '@angular/core';
import type { TngFlowDefinition, TngFlowNode } from '../../../lib/types/tng-flow.types';
import {
  createTngFlowExecutionIndex,
  formatTngFlowExecutionDateTime,
  formatTngFlowExecutionDuration,
  formatTngFlowExecutionPayload,
  groupTngFlowNodeExecutionsByActivation,
  labelTngFlowExecutionPhase,
  resolveTngFlowSelectedExecution,
} from '../../model/tng-flow-execution.model';
import type {
  TngFlowExecutionActivatedEvent,
  TngFlowExecutionDateTimeFormatter,
  TngFlowExecutionInspectorScope,
  TngFlowExecutionPayload,
  TngFlowNodeExecution,
  TngFlowRunExecutionSnapshot,
} from '../../model/tng-flow-execution.types';
import {
  TngFlowExecutionPayloadTemplateDirective,
  type TngFlowExecutionPayloadTemplateContext,
} from '../../templates/tng-flow-execution-templates';
import { TngFlowExecutionPayloadComponent } from '../payload/tng-flow-execution-payload.component';

@Component({
  selector: 'tng-flow-execution-inspector',
  imports: [NgTemplateOutlet, TngFlowExecutionPayloadComponent],
  templateUrl: './tng-flow-execution-inspector.component.html',
  styleUrl: './tng-flow-execution-inspector.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'tng-flow-execution-inspector',
    '[attr.data-scope]': 'resolvedScope()',
  },
})
export class TngFlowExecutionInspectorComponent<TPayload = unknown> {
  public readonly definition = input<TngFlowDefinition | null>(null);
  public readonly snapshot = input<TngFlowRunExecutionSnapshot<TPayload> | null>(null);
  public readonly inspectedNodeId = input<string | null>(null);
  public readonly selectedExecutionId = input<string | null>(null);
  public readonly scope = input<TngFlowExecutionInspectorScope>('auto');
  public readonly dateTimeFormatter = input<TngFlowExecutionDateTimeFormatter | null>(null);

  public readonly selectedExecutionIdChange = output<string | null>();
  public readonly executionActivated = output<TngFlowExecutionActivatedEvent<TPayload>>();

  protected readonly payloadTemplate = contentChild(
    TngFlowExecutionPayloadTemplateDirective<TPayload>,
  );

  protected readonly index = computed(() =>
    createTngFlowExecutionIndex(this.definition(), this.snapshot()),
  );

  protected readonly inspectedNode = computed<TngFlowNode | null>(() => {
    const nodeId = this.inspectedNodeId();
    return this.definition()?.nodes.find((node) => node.id === nodeId) ?? null;
  });

  protected readonly nodeExecutions = computed(
    () => this.index().nodeExecutionsByNodeId.get(this.inspectedNodeId() ?? '') ?? [],
  );

  protected readonly activations = computed(() =>
    groupTngFlowNodeExecutionsByActivation(this.nodeExecutions()),
  );

  protected readonly selectedExecution = computed(() =>
    resolveTngFlowSelectedExecution(this.nodeExecutions(), this.selectedExecutionId()),
  );

  protected readonly resolvedScope = computed<TngFlowExecutionInspectorScope>(() => {
    const requested = this.scope();
    if (requested !== 'auto') {
      return requested;
    }
    return this.inspectedNode() === null ? 'run' : 'node';
  });

  protected readonly runPhaseLabel = computed(() => {
    const snapshot = this.snapshot();
    return snapshot === null ? 'No execution' : labelTngFlowExecutionPhase(snapshot.phase);
  });

  protected readonly nodePhaseLabel = computed(() => {
    const execution = this.selectedExecution();
    return execution === null ? 'No execution' : labelTngFlowExecutionPhase(execution.phase);
  });

  protected selectExecution(execution: TngFlowNodeExecution<TPayload>): void {
    this.selectedExecutionIdChange.emit(execution.id);
    this.executionActivated.emit({
      node: this.inspectedNode(),
      execution,
      source: 'history',
    });
  }

  protected phaseLabel(phase: TngFlowNodeExecution['phase']): string {
    return labelTngFlowExecutionPhase(phase);
  }

  protected attemptLabel(execution: TngFlowNodeExecution<TPayload>): string {
    const max = execution.maxAttempts;
    return max === undefined
      ? `Attempt ${execution.attempt}`
      : `Attempt ${execution.attempt} of ${max}`;
  }

  protected isSelectedExecution(execution: TngFlowNodeExecution<TPayload>): boolean {
    return this.selectedExecution()?.id === execution.id;
  }

  protected dateTime(
    value: string | undefined,
    field: 'finishedAt' | 'startedAt' | 'updatedAt',
  ): string | null {
    return formatTngFlowExecutionDateTime(value, field, this.dateTimeFormatter());
  }

  protected duration(
    input: Readonly<{ durationMs?: number; finishedAt?: string; startedAt?: string }>,
  ): string | null {
    return formatTngFlowExecutionDuration(input);
  }

  protected payloadContext(
    payload: TngFlowExecutionPayload<TPayload> | null | undefined,
    title: string,
  ): TngFlowExecutionPayloadTemplateContext<TPayload> {
    return {
      $implicit: payload,
      payload,
      title,
      view: formatTngFlowExecutionPayload(payload, title),
    };
  }
}
