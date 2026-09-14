import { DOCUMENT } from '@angular/common';
import { Component, inject, signal, type OnDestroy } from '@angular/core';
import { TngButtonComponent } from '@tailng-ui/components';
import type { TngFlowDefinition, TngFlowNode } from '@tailng-ui/flow';
import {
  TngFlowNodePropertiesComponent,
  TngFlowNodePropertiesDataTemplateDirective,
  type TngFlowNodePropertyChangeRequest,
} from '@tailng-ui/flow/execution';
import {
  flowNodePropertiesExamplesPlainCssCodeTabs,
  flowNodePropertiesExamplesTailwindCodeTabs,
} from './flow-node-properties-examples-code.data';
import {
  DocsExampleTabsSectionComponent,
  DocsExampleVariantDirective,
} from '../../../../../../shared/example-tabs-section/docs-example-tabs-section.component';
import {
  observeDocsCodeThemeChanges,
  resolveDocsCodeBlockTheme,
} from '../../../../../../shared/util';

type FlowNodePropertiesExampleData = Readonly<{
  escalation: string;
  owner: string;
  priority: 'Normal' | 'High' | 'Critical';
  queue: string;
}>;

const initialDefinition: TngFlowDefinition<FlowNodePropertiesExampleData> = {
  id: 'incident-triage-properties',
  name: 'Incident triage workflow',
  connections: [],
  nodes: [
    {
      id: 'ingest-alert',
      type: 'trigger',
      name: 'Ingest alert',
      description: 'Receives monitoring alerts and normalizes the payload.',
      position: { x: 0, y: 0 },
      data: {
        escalation: 'On-call engineer',
        owner: 'Platform',
        priority: 'High',
        queue: 'Reliability',
      },
      ports: [
        {
          id: 'alert',
          direction: 'input',
          kind: 'data',
          label: 'Alert payload',
          dataType: 'json',
          required: true,
        },
        {
          id: 'normalized',
          direction: 'output',
          kind: 'data',
          label: 'Normalized alert',
          dataType: 'json',
        },
      ],
    },
    {
      id: 'classify-impact',
      type: 'model',
      name: 'Classify impact',
      description: 'Scores customer impact and suggests a response lane.',
      position: { x: 0, y: 0 },
      data: {
        escalation: 'Incident commander',
        owner: 'AI operations',
        priority: 'Critical',
        queue: 'Incident response',
      },
      ports: [
        {
          id: 'normalized',
          direction: 'input',
          kind: 'data',
          label: 'Normalized alert',
          dataType: 'json',
          required: true,
        },
        {
          id: 'classification',
          direction: 'output',
          kind: 'data',
          label: 'Classification',
          dataType: 'json',
        },
        {
          id: 'manual-review',
          direction: 'output',
          kind: 'control',
          label: 'Manual review',
        },
      ],
    },
    {
      id: 'notify-owners',
      type: 'action',
      name: 'Notify owners',
      description: 'Posts the incident summary to the selected response queue.',
      position: { x: 0, y: 0 },
      data: {
        escalation: 'Service owner',
        owner: 'Customer care',
        priority: 'Normal',
        queue: 'Support',
      },
      disabled: true,
      ports: [
        {
          id: 'classification',
          direction: 'input',
          kind: 'data',
          label: 'Classification',
          dataType: 'json',
        },
        {
          id: 'sent',
          direction: 'output',
          kind: 'control',
          label: 'Notification sent',
        },
      ],
    },
  ],
};

function cloneDefinition(): TngFlowDefinition<FlowNodePropertiesExampleData> {
  return {
    ...initialDefinition,
    nodes: initialDefinition.nodes.map((node) => ({
      ...node,
      position: { ...node.position },
      data: node.data === undefined ? undefined : { ...node.data },
      ports: node.ports?.map((port) => ({ ...port })),
    })),
    connections: initialDefinition.connections.map((connection) => ({
      ...connection,
      source: { ...connection.source },
      target: { ...connection.target },
    })),
  };
}

class FlowNodePropertiesExampleState {
  public readonly definition =
    signal<TngFlowDefinition<FlowNodePropertiesExampleData>>(cloneDefinition());
  public readonly inspectedNodeId = signal<string | null>('classify-impact');
  public readonly isReadonly = signal(false);
  public readonly showData = signal(true);
  public readonly showPorts = signal(true);
  public readonly status = signal('Classify impact selected. Edit a field to update the panel.');
}

@Component({
  selector: 'app-flow-node-properties-examples-page',
  imports: [
    DocsExampleTabsSectionComponent,
    DocsExampleVariantDirective,
    TngButtonComponent,
    TngFlowNodePropertiesComponent,
    TngFlowNodePropertiesDataTemplateDirective,
  ],
  templateUrl: './flow-node-properties-examples-page.component.html',
  styleUrl: './flow-node-properties-examples-page.component.css',
})
export class FlowNodePropertiesExamplesPageComponent implements OnDestroy {
  private readonly documentRef = inject(DOCUMENT);

  protected readonly codeBlockTheme = signal<'github-dark' | 'github-light'>(
    resolveDocsCodeBlockTheme(this.documentRef),
  );
  private readonly colorSchemeObserver = observeDocsCodeThemeChanges(
    this.documentRef,
    this.codeBlockTheme,
  );

  protected readonly plainExample = new FlowNodePropertiesExampleState();
  protected readonly tailwindExample = new FlowNodePropertiesExampleState();
  protected readonly plainCssCodeTabs = flowNodePropertiesExamplesPlainCssCodeTabs;
  protected readonly tailwindCodeTabs = flowNodePropertiesExamplesTailwindCodeTabs;
  protected readonly priorities: readonly FlowNodePropertiesExampleData['priority'][] = [
    'Normal',
    'High',
    'Critical',
  ];

  public ngOnDestroy(): void {
    this.colorSchemeObserver?.disconnect();
  }

  protected selectNode(
    state: FlowNodePropertiesExampleState,
    node: TngFlowNode<FlowNodePropertiesExampleData>,
  ): void {
    state.inspectedNodeId.set(node.id);
    state.status.set(`${node.name} selected.`);
  }

  protected setReadonly(state: FlowNodePropertiesExampleState, event: Event): void {
    const checked = this.readChecked(event);
    state.isReadonly.set(checked);
    state.status.set(checked ? 'Panel is readonly.' : 'Panel is editable.');
  }

  protected setShowData(state: FlowNodePropertiesExampleState, event: Event): void {
    state.showData.set(this.readChecked(event));
  }

  protected setShowPorts(state: FlowNodePropertiesExampleState, event: Event): void {
    state.showPorts.set(this.readChecked(event));
  }

  protected resetExample(state: FlowNodePropertiesExampleState): void {
    state.definition.set(cloneDefinition());
    state.inspectedNodeId.set('classify-impact');
    state.isReadonly.set(false);
    state.showData.set(true);
    state.showPorts.set(true);
    state.status.set('Example reset.');
  }

  protected applyNodeChanges(
    state: FlowNodePropertiesExampleState,
    request: TngFlowNodePropertyChangeRequest<FlowNodePropertiesExampleData>,
  ): void {
    state.definition.update((definition) => ({
      ...definition,
      nodes: definition.nodes.map((node) =>
        node.id === request.nodeId ? { ...node, ...request.changes } : node,
      ),
    }));
    state.status.set(`${request.node.name} updated from ${request.source}.`);
  }

  protected updateOwner(
    data: FlowNodePropertiesExampleData | undefined,
    event: Event,
    requestDataChange: (data: FlowNodePropertiesExampleData) => void,
  ): void {
    requestDataChange({ ...this.withDefaults(data), owner: this.readValue(event) });
  }

  protected updateQueue(
    data: FlowNodePropertiesExampleData | undefined,
    event: Event,
    requestDataChange: (data: FlowNodePropertiesExampleData) => void,
  ): void {
    requestDataChange({ ...this.withDefaults(data), queue: this.readValue(event) });
  }

  protected updatePriority(
    data: FlowNodePropertiesExampleData | undefined,
    event: Event,
    requestDataChange: (data: FlowNodePropertiesExampleData) => void,
  ): void {
    requestDataChange({
      ...this.withDefaults(data),
      priority: this.toPriority(this.readValue(event)),
    });
  }

  protected updateEscalation(
    data: FlowNodePropertiesExampleData | undefined,
    event: Event,
    requestDataChange: (data: FlowNodePropertiesExampleData) => void,
  ): void {
    requestDataChange({ ...this.withDefaults(data), escalation: this.readValue(event) });
  }

  protected dataOwner(data: FlowNodePropertiesExampleData | undefined): string {
    return this.withDefaults(data).owner;
  }

  protected dataQueue(data: FlowNodePropertiesExampleData | undefined): string {
    return this.withDefaults(data).queue;
  }

  protected dataPriority(
    data: FlowNodePropertiesExampleData | undefined,
  ): FlowNodePropertiesExampleData['priority'] {
    return this.withDefaults(data).priority;
  }

  protected dataEscalation(data: FlowNodePropertiesExampleData | undefined): string {
    return this.withDefaults(data).escalation;
  }

  private withDefaults(
    data: FlowNodePropertiesExampleData | undefined,
  ): FlowNodePropertiesExampleData {
    return (
      data ?? {
        escalation: 'On-call engineer',
        owner: 'Unassigned',
        priority: 'Normal',
        queue: 'Operations',
      }
    );
  }

  private toPriority(value: string): FlowNodePropertiesExampleData['priority'] {
    return value === 'Critical' || value === 'High' ? value : 'Normal';
  }

  private readValue(event: Event): string {
    return event.target instanceof HTMLInputElement || event.target instanceof HTMLSelectElement
      ? event.target.value
      : '';
  }

  private readChecked(event: Event): boolean {
    return event.target instanceof HTMLInputElement ? event.target.checked : false;
  }
}
