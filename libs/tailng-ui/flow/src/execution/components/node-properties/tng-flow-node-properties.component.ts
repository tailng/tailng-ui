import { NgTemplateOutlet } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  booleanAttribute,
  computed,
  contentChild,
  input,
  output,
} from '@angular/core';
import type { TngFlowDefinition, TngFlowNode, TngFlowPort } from '@tailng-ui/flow';
import type {
  TngFlowNodePropertyChangeRequest,
  TngFlowNodePropertyChanges,
} from '../../model/tng-flow-execution.types';
import {
  TngFlowNodePropertiesDataTemplateDirective,
  type TngFlowNodePropertiesDataTemplateContext,
} from '../../templates/tng-flow-execution-templates';

@Component({
  selector: 'tng-flow-node-properties',
  imports: [NgTemplateOutlet],
  templateUrl: './tng-flow-node-properties.component.html',
  styleUrl: './tng-flow-node-properties.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  exportAs: 'tngFlowNodeProperties',
  host: {
    class: 'tng-flow-node-properties',
    '[attr.data-readonly]': 'readonly() ? "" : null',
  },
})
export class TngFlowNodePropertiesComponent<TData = unknown> {
  public readonly definition = input<TngFlowDefinition<TData> | null>(null);
  public readonly node = input<TngFlowNode<TData> | null>(null);
  public readonly inspectedNodeId = input<string | null>(null);
  public readonly readonly = input<boolean, boolean | string>(false, {
    transform: booleanAttribute,
  });
  public readonly showData = input<boolean, boolean | string>(true, {
    transform: booleanAttribute,
  });
  public readonly showPorts = input<boolean, boolean | string>(true, {
    transform: booleanAttribute,
  });

  public readonly nodeChangeRequested = output<TngFlowNodePropertyChangeRequest<TData>>();

  protected readonly dataTemplate = contentChild(
    TngFlowNodePropertiesDataTemplateDirective<TData>,
  );

  protected readonly resolvedNode = computed<TngFlowNode<TData> | null>(() => {
    const explicitNode = this.node();
    if (explicitNode !== null) {
      return explicitNode;
    }
    const nodeId = this.inspectedNodeId();
    return this.definition()?.nodes.find((candidate) => candidate.id === nodeId) ?? null;
  });

  protected readonly dataTemplateContext = computed<
    TngFlowNodePropertiesDataTemplateContext<TData> | null
  >(() => {
    const node = this.resolvedNode();
    if (node === null) {
      return null;
    }
    return {
      $implicit: node.data,
      data: node.data,
      node,
      readonly: this.readonly(),
      requestDataChange: (data: TData | undefined): void => this.requestDataChange(data),
      requestNodeChange: (changes: TngFlowNodePropertyChanges<TData>): void =>
        this.requestNodeChange(changes, 'data-template'),
    };
  });

  protected readonly ports = computed(() => this.resolvedNode()?.ports ?? []);
  protected readonly inputPorts = computed(() =>
    this.ports().filter((port) => port.direction === 'input'),
  );
  protected readonly outputPorts = computed(() =>
    this.ports().filter((port) => port.direction === 'output'),
  );

  protected onNameInput(event: Event): void {
    this.requestNodeChange({ name: this.readTextInput(event) }, 'field');
  }

  protected onDescriptionInput(event: Event): void {
    this.requestNodeChange({ description: this.optionalText(this.readTextInput(event)) }, 'field');
  }

  protected onDisabledChange(event: Event): void {
    this.requestNodeChange({ disabled: this.readCheckedInput(event) }, 'field');
  }

  protected onLockedChange(event: Event): void {
    this.requestNodeChange({ locked: this.readCheckedInput(event) }, 'field');
  }

  protected portLabel(port: TngFlowPort): string {
    return port.label ?? port.name ?? port.id;
  }

  protected portMeta(port: TngFlowPort): string {
    const values = [port.kind, port.dataType, port.required ? 'required' : null].filter(
      (value): value is string => value !== null && value !== undefined && value.length > 0,
    );
    return values.join(' / ');
  }

  protected dataPreview(data: TData | undefined): string {
    if (data === undefined) {
      return 'No custom data';
    }
    try {
      return JSON.stringify(data, null, 2);
    } catch {
      return String(data);
    }
  }

  private requestDataChange(data: TData | undefined): void {
    this.requestNodeChange({ data }, 'data-template');
  }

  private requestNodeChange(
    changes: TngFlowNodePropertyChanges<TData>,
    source: TngFlowNodePropertyChangeRequest<TData>['source'],
  ): void {
    if (this.readonly()) {
      return;
    }
    const node = this.resolvedNode();
    if (node === null) {
      return;
    }
    this.nodeChangeRequested.emit({
      node,
      nodeId: node.id,
      changes,
      source,
    });
  }

  private readTextInput(event: Event): string {
    return event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement
      ? event.target.value
      : '';
  }

  private readCheckedInput(event: Event): boolean {
    return event.target instanceof HTMLInputElement ? event.target.checked : false;
  }

  private optionalText(value: string): string | undefined {
    return value.length === 0 ? undefined : value;
  }
}
