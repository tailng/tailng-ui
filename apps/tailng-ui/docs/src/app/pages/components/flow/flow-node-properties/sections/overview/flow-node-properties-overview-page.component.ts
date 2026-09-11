import { DOCUMENT } from '@angular/common';
import { Component, inject, signal, type OnDestroy, type WritableSignal } from '@angular/core';
import { TngButtonComponent, TngCodeBlockComponent } from '@tailng-ui/components';
import type { TngFlowDefinition, TngFlowNode } from '@tailng-ui/flow';
import {
  TngFlowNodePropertiesComponent,
  TngFlowNodePropertiesDataTemplateDirective,
  type TngFlowNodePropertyChangeRequest,
} from '@tailng-ui/flow/execution';
import {
  flowNodePropertiesOverviewPlainCssCodeTabs,
  flowNodePropertiesOverviewTailwindCodeTabs,
} from './flow-node-properties-overview-code.data';
import {
  DocsExampleTabsSectionComponent,
  DocsExampleVariantDirective,
} from '../../../../../../shared/example-tabs-section/docs-example-tabs-section.component';
import {
  observeDocsCodeThemeChanges,
  resolveDocsCodeBlockTheme,
} from '../../../../../../shared/util';

type FlowNodePropertiesOverviewData = Readonly<{
  owner: string;
  risk: 'Low' | 'Medium' | 'High';
  sla: string;
}>;

const initialDefinition: TngFlowDefinition<FlowNodePropertiesOverviewData> = {
  id: 'docs-node-properties-agent',
  name: 'Support agent node properties',
  connections: [],
  nodes: [
    {
      id: 'classify-ticket',
      type: 'model',
      name: 'Classify ticket',
      description: 'Categorizes inbound support requests before routing.',
      position: { x: 0, y: 0 },
      data: { owner: 'AI platform', risk: 'Low', sla: '15 min' },
      ports: [
        {
          id: 'ticket-input',
          direction: 'input',
          kind: 'data',
          label: 'Ticket',
          dataType: 'json',
          required: true,
        },
        {
          id: 'category-output',
          direction: 'output',
          kind: 'data',
          label: 'Category',
          dataType: 'string',
        },
      ],
    },
    {
      id: 'approval-gate',
      type: 'review',
      name: 'Approval gate',
      description: 'Pauses high-risk resolutions for a support lead.',
      position: { x: 0, y: 0 },
      data: { owner: 'Support ops', risk: 'High', sla: '4 hr' },
      locked: true,
      ports: [
        {
          id: 'draft-input',
          direction: 'input',
          kind: 'data',
          label: 'Draft',
          dataType: 'markdown',
          required: true,
        },
        {
          id: 'approved-output',
          direction: 'output',
          kind: 'control',
          label: 'Approved',
        },
        {
          id: 'rejected-output',
          direction: 'output',
          kind: 'control',
          label: 'Rejected',
        },
      ],
    },
    {
      id: 'send-response',
      type: 'action',
      name: 'Send response',
      description: 'Publishes the approved response back to the customer.',
      position: { x: 0, y: 0 },
      data: { owner: 'Customer care', risk: 'Medium', sla: '30 min' },
      disabled: true,
      ports: [
        {
          id: 'response-input',
          direction: 'input',
          kind: 'data',
          label: 'Response',
          dataType: 'markdown',
        },
        {
          id: 'sent-output',
          direction: 'output',
          kind: 'control',
          label: 'Sent',
        },
      ],
    },
  ],
};

function cloneDefinition(): TngFlowDefinition<FlowNodePropertiesOverviewData> {
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

@Component({
  selector: 'app-flow-node-properties-overview-page',
  imports: [
    DocsExampleTabsSectionComponent,
    DocsExampleVariantDirective,
    TngButtonComponent,
    TngCodeBlockComponent,
    TngFlowNodePropertiesComponent,
    TngFlowNodePropertiesDataTemplateDirective,
  ],
  templateUrl: './flow-node-properties-overview-page.component.html',
  styleUrl: './flow-node-properties-overview-page.component.css',
})
export class FlowNodePropertiesOverviewPageComponent implements OnDestroy {
  private readonly documentRef = inject(DOCUMENT);

  public readonly codeBlockTheme = signal<'github-dark' | 'github-light'>(
    resolveDocsCodeBlockTheme(this.documentRef),
  );
  private readonly colorSchemeObserver = observeDocsCodeThemeChanges(
    this.documentRef,
    this.codeBlockTheme,
  );

  protected readonly importCode = [
    "import { TngFlowNodePropertiesComponent } from '@tailng-ui/flow/execution';",
    "import type { TngFlowDefinition } from '@tailng-ui/flow';",
  ].join('\n');
  protected readonly plainDefinition =
    signal<TngFlowDefinition<FlowNodePropertiesOverviewData>>(cloneDefinition());
  protected readonly tailwindDefinition =
    signal<TngFlowDefinition<FlowNodePropertiesOverviewData>>(cloneDefinition());
  protected readonly plainInspectedNodeId = signal<string | null>('classify-ticket');
  protected readonly tailwindInspectedNodeId = signal<string | null>('classify-ticket');
  protected readonly plainReadonly = signal(false);
  protected readonly tailwindReadonly = signal(false);
  protected readonly plainStatus = signal(
    'Select a node or edit a field to update the definition.',
  );
  protected readonly tailwindStatus = signal(
    'Select a node or edit a field to update the definition.',
  );
  protected readonly plainCssCodeTabs = flowNodePropertiesOverviewPlainCssCodeTabs;
  protected readonly tailwindCodeTabs = flowNodePropertiesOverviewTailwindCodeTabs;

  public ngOnDestroy(): void {
    this.colorSchemeObserver?.disconnect();
  }

  protected selectNode(
    inspectedNodeId: WritableSignal<string | null>,
    status: WritableSignal<string>,
    node: TngFlowNode<FlowNodePropertiesOverviewData>,
  ): void {
    inspectedNodeId.set(node.id);
    status.set(`${node.name} selected.`);
  }

  protected resetExample(
    definition: WritableSignal<TngFlowDefinition<FlowNodePropertiesOverviewData>>,
    inspectedNodeId: WritableSignal<string | null>,
    readonly: WritableSignal<boolean>,
    status: WritableSignal<string>,
  ): void {
    definition.set(cloneDefinition());
    inspectedNodeId.set('classify-ticket');
    readonly.set(false);
    status.set('Example reset.');
  }

  protected toggleReadonly(
    readonly: WritableSignal<boolean>,
    status: WritableSignal<string>,
  ): void {
    readonly.update((value) => !value);
    status.set(readonly() ? 'Panel is readonly.' : 'Panel is editable.');
  }

  protected applyNodeChanges(
    definition: WritableSignal<TngFlowDefinition<FlowNodePropertiesOverviewData>>,
    status: WritableSignal<string>,
    request: TngFlowNodePropertyChangeRequest<FlowNodePropertiesOverviewData>,
  ): void {
    definition.update((currentDefinition) => ({
      ...currentDefinition,
      nodes: currentDefinition.nodes.map((node) =>
        node.id === request.nodeId ? { ...node, ...request.changes } : node,
      ),
    }));
    status.set(`${request.node.name} updated from ${request.source}.`);
  }

  protected updateOwner(
    data: FlowNodePropertiesOverviewData | undefined,
    event: Event,
    requestDataChange: (data: FlowNodePropertiesOverviewData) => void,
  ): void {
    requestDataChange({ ...this.withDefaults(data), owner: this.readValue(event) });
  }

  protected updateRisk(
    data: FlowNodePropertiesOverviewData | undefined,
    event: Event,
    requestDataChange: (data: FlowNodePropertiesOverviewData) => void,
  ): void {
    requestDataChange({
      ...this.withDefaults(data),
      risk: this.toRisk(this.readValue(event)),
    });
  }

  protected updateSla(
    data: FlowNodePropertiesOverviewData | undefined,
    event: Event,
    requestDataChange: (data: FlowNodePropertiesOverviewData) => void,
  ): void {
    requestDataChange({ ...this.withDefaults(data), sla: this.readValue(event) });
  }

  protected dataOwner(data: FlowNodePropertiesOverviewData | undefined): string {
    return this.withDefaults(data).owner;
  }

  protected dataRisk(data: FlowNodePropertiesOverviewData | undefined): string {
    return this.withDefaults(data).risk;
  }

  protected dataSla(data: FlowNodePropertiesOverviewData | undefined): string {
    return this.withDefaults(data).sla;
  }

  private withDefaults(
    data: FlowNodePropertiesOverviewData | undefined,
  ): FlowNodePropertiesOverviewData {
    return data ?? { owner: 'Unassigned', risk: 'Low', sla: '30 min' };
  }

  private toRisk(value: string): FlowNodePropertiesOverviewData['risk'] {
    return value === 'High' || value === 'Medium' ? value : 'Low';
  }

  private readValue(event: Event): string {
    return event.target instanceof HTMLInputElement || event.target instanceof HTMLSelectElement
      ? event.target.value
      : '';
  }
}
