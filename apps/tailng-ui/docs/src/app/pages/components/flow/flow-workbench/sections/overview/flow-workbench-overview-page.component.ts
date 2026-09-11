import { DOCUMENT } from '@angular/common';
import {
  Component,
  computed,
  inject,
  signal,
  type OnDestroy,
  type WritableSignal,
} from '@angular/core';
import { TngButtonComponent, TngCodeBlockComponent } from '@tailng-ui/components';
import {
  type TngFlowConnection,
  type TngFlowConnectionsDeleteRequest,
  type TngFlowDefinition,
  type TngFlowNode,
  type TngFlowNodeCreateRequest,
  type TngFlowNodesMovedEvent,
  type TngFlowNodesDeleteRequest,
  type TngFlowPaletteItem,
  type TngFlowSelection,
} from '@tailng-ui/flow';
import {
  TngFlowWorkbenchComponent,
  type TngFlowRunExecutionSnapshot,
  type TngFlowWorkbenchMode,
  type TngFlowWorkbenchState,
} from '@tailng-ui/flow/execution';
import {
  DocsExampleTabsSectionComponent,
  DocsExampleVariantDirective,
} from '../../../../../../shared/example-tabs-section/docs-example-tabs-section.component';
import {
  observeDocsCodeThemeChanges,
  resolveDocsCodeBlockTheme,
} from '../../../../../../shared/util';
import {
  applyFlowNodeMoves,
  flowEditorDemoConnections,
  flowEditorDemoNodes,
  removeFlowItems,
  type FlowEditorDemoData,
} from '../../../flow-editor/flow-editor-demo.data';
import {
  flowWorkbenchOverviewPlainCssCodeTabs,
  flowWorkbenchOverviewTailwindCodeTabs,
} from './flow-workbench-overview-code.data';

type FlowWorkbenchOverviewVariant = 'plain-css' | 'tailwind-css';

const overviewPaletteItems: readonly TngFlowPaletteItem<FlowEditorDemoData>[] = [
  {
    id: 'human-review-catalog-item',
    type: 'review',
    name: 'Human review',
    description: 'Pause the workflow for an approval decision.',
    data: { detail: 'Manual approval required' },
  },
  {
    id: 'tool-catalog-item',
    type: 'tool',
    name: 'Tool call',
    description: 'Invoke an application-owned workflow tool.',
    data: { detail: 'Application tool invocation' },
  },
];

const overviewModes: readonly { value: TngFlowWorkbenchMode; label: string }[] = [
  { value: 'create', label: 'Create' },
  { value: 'edit', label: 'Edit' },
  { value: 'inspect', label: 'Inspect' },
  { value: 'view', label: 'View' },
  { value: 'live', label: 'Live' },
];

const overviewExecutionSnapshot = {
  id: 'docs-agent-run',
  definitionId: 'support-agent-workbench',
  phase: 'active',
  progress: 68,
  statusMessage: 'Generating the final response',
  startedAt: '2026-09-11T09:00:00.000Z',
  updatedAt: '2026-09-11T09:01:18.000Z',
  nodeExecutions: [
    {
      id: 'prompt-run',
      nodeId: 'prompt',
      activationId: 'support-agent-run',
      attempt: 1,
      phase: 'succeeded',
      progress: 100,
      statusMessage: 'Prompt assembled',
      startedAt: '2026-09-11T09:00:00.000Z',
      finishedAt: '2026-09-11T09:00:12.000Z',
      durationMs: 12000,
    },
    {
      id: 'model-run',
      nodeId: 'model',
      activationId: 'support-agent-run',
      attempt: 1,
      phase: 'active',
      progress: 68,
      statusMessage: 'Reasoning through policy constraints',
      input: {
        state: 'available',
        label: 'Prompt',
        language: 'json',
        value: { ticket: 'Refund request', policy: 'Support refunds v4' },
      },
      startedAt: '2026-09-11T09:00:12.000Z',
      updatedAt: '2026-09-11T09:01:18.000Z',
    },
    {
      id: 'response-run',
      nodeId: 'response',
      activationId: 'support-agent-run',
      attempt: 1,
      phase: 'waiting',
      statusMessage: 'Waiting for model output',
      startedAt: '2026-09-11T09:01:18.000Z',
    },
  ],
  connectionExecutions: [
    {
      id: 'prompt-to-model-run',
      connectionId: 'prompt-to-model',
      activationId: 'support-agent-run',
      attempt: 1,
      phase: 'succeeded',
      statusMessage: 'Prompt delivered',
    },
    {
      id: 'model-to-response-run',
      connectionId: 'model-to-response',
      activationId: 'support-agent-run',
      attempt: 1,
      phase: 'active',
      statusMessage: 'Streaming answer',
    },
  ],
} satisfies TngFlowRunExecutionSnapshot<unknown>;

@Component({
  selector: 'app-flow-workbench-overview-page',
  imports: [
    TngButtonComponent,
    TngCodeBlockComponent,
    TngFlowWorkbenchComponent,
    DocsExampleTabsSectionComponent,
    DocsExampleVariantDirective,
  ],
  templateUrl: './flow-workbench-overview-page.component.html',
  styleUrl: './flow-workbench-overview-page.component.css',
})
export class FlowWorkbenchOverviewPageComponent implements OnDestroy {
  private readonly documentRef = inject(DOCUMENT);
  private readonly nodeSequence = signal(0);

  public readonly codeBlockTheme = signal<'github-dark' | 'github-light'>(
    resolveDocsCodeBlockTheme(this.documentRef),
  );
  private readonly colorSchemeObserver = observeDocsCodeThemeChanges(
    this.documentRef,
    this.codeBlockTheme,
  );

  protected readonly plainCssNodes =
    signal<readonly TngFlowNode<FlowEditorDemoData>[]>(flowEditorDemoNodes);
  protected readonly plainCssConnections =
    signal<readonly TngFlowConnection[]>(flowEditorDemoConnections);
  protected readonly tailwindNodes =
    signal<readonly TngFlowNode<FlowEditorDemoData>[]>(flowEditorDemoNodes);
  protected readonly tailwindConnections =
    signal<readonly TngFlowConnection[]>(flowEditorDemoConnections);
  protected readonly plainCssSelection = signal<TngFlowSelection>({
    nodeIds: new Set(['model']),
    connectionIds: new Set<string>(),
  });
  protected readonly tailwindSelection = signal<TngFlowSelection>({
    nodeIds: new Set(['model']),
    connectionIds: new Set<string>(),
  });
  protected readonly plainCssInspectedNodeId = signal<string | null>('model');
  protected readonly tailwindInspectedNodeId = signal<string | null>('model');
  protected readonly plainCssMode = signal<TngFlowWorkbenchMode>('edit');
  protected readonly tailwindMode = signal<TngFlowWorkbenchMode>('edit');
  protected readonly plainCssPaletteOpen = signal(true);
  protected readonly plainCssDetailsOpen = signal(true);
  protected readonly tailwindPaletteOpen = signal(true);
  protected readonly tailwindDetailsOpen = signal(true);
  protected readonly workbenchState = signal<TngFlowWorkbenchState>('ready');
  protected readonly executionSnapshot = overviewExecutionSnapshot;
  protected readonly modes = overviewModes;
  protected readonly paletteItems = overviewPaletteItems;
  protected readonly plainCssCodeTabs = flowWorkbenchOverviewPlainCssCodeTabs;
  protected readonly tailwindCodeTabs = flowWorkbenchOverviewTailwindCodeTabs;
  protected readonly importCode = [
    "import { TngFlowWorkbenchComponent } from '@tailng-ui/flow/execution';",
    "import type { TngFlowDefinition, TngFlowSelection } from '@tailng-ui/flow';",
  ].join('\n');

  protected readonly plainCssDefinition = computed<TngFlowDefinition<FlowEditorDemoData>>(() =>
    this.createDefinition('plain-css'),
  );
  protected readonly tailwindDefinition = computed<TngFlowDefinition<FlowEditorDemoData>>(() =>
    this.createDefinition('tailwind-css'),
  );

  protected onNodeCreateRequested(
    event: TngFlowNodeCreateRequest<FlowEditorDemoData>,
    variant: FlowWorkbenchOverviewVariant,
  ): void {
    const nodes = this.nodesFor(variant);
    const id = `${event.item.type}-${this.nodeSequence()}`;
    this.nodeSequence.update((sequence) => sequence + 1);
    nodes.update((currentNodes) => [
      ...currentNodes,
      {
        id,
        type: event.item.type,
        name: event.item.name,
        description: event.item.description,
        data: event.item.data,
        icon: event.item.icon,
        position: event.position,
        ports: [],
      },
    ]);
    this.selectionFor(variant).set({ nodeIds: new Set([id]), connectionIds: new Set() });
    this.inspectedNodeIdFor(variant).set(id);
  }

  protected onNodesMoved(
    event: TngFlowNodesMovedEvent,
    variant: FlowWorkbenchOverviewVariant,
  ): void {
    this.nodesFor(variant).update((nodes) => applyFlowNodeMoves(nodes, event));
  }

  protected onConnectionsDeleteRequested(
    event: TngFlowConnectionsDeleteRequest,
    variant: FlowWorkbenchOverviewVariant,
  ): void {
    const deletedIds = new Set(event.connectionIds);
    this.connectionsFor(variant).update((connections) =>
      connections.filter((connection) => !deletedIds.has(connection.id)),
    );
    this.selectionFor(variant).update((selection) => ({
      nodeIds: selection.nodeIds,
      connectionIds: new Set(
        [...selection.connectionIds].filter((connectionId) => !deletedIds.has(connectionId)),
      ),
    }));
  }

  protected onNodesDeleteRequested(
    event: TngFlowNodesDeleteRequest,
    variant: FlowWorkbenchOverviewVariant,
  ): void {
    const nodes = this.nodesFor(variant);
    const connections = this.connectionsFor(variant);
    const next = removeFlowItems(nodes(), connections(), {
      nodeIds: event.nodeIds,
      connectionIds: [],
    });
    const deletedNodeIds = new Set(event.nodeIds);
    const remainingConnectionIds = new Set(next.connections.map((connection) => connection.id));
    nodes.set(next.nodes);
    connections.set(next.connections);
    this.selectionFor(variant).update((selection) => ({
      nodeIds: new Set([...selection.nodeIds].filter((nodeId) => !deletedNodeIds.has(nodeId))),
      connectionIds: new Set(
        [...selection.connectionIds].filter((connectionId) =>
          remainingConnectionIds.has(connectionId),
        ),
      ),
    }));
    const inspectedNodeId = this.inspectedNodeIdFor(variant);
    const currentInspectedNodeId = inspectedNodeId();
    if (currentInspectedNodeId !== null && deletedNodeIds.has(currentInspectedNodeId)) {
      inspectedNodeId.set(next.nodes[0]?.id ?? null);
    }
  }

  protected onSelectionChange(
    selection: TngFlowSelection,
    variant: FlowWorkbenchOverviewVariant,
  ): void {
    this.selectionFor(variant).set(selection);
    this.inspectedNodeIdFor(variant).set([...selection.nodeIds][0] ?? null);
  }

  protected resetDemo(variant: FlowWorkbenchOverviewVariant): void {
    this.nodesFor(variant).set(flowEditorDemoNodes);
    this.connectionsFor(variant).set(flowEditorDemoConnections);
    this.selectionFor(variant).set({ nodeIds: new Set(['model']), connectionIds: new Set() });
    this.inspectedNodeIdFor(variant).set('model');
    this.modeFor(variant).set('edit');
    this.paletteOpenFor(variant).set(true);
    this.detailsOpenFor(variant).set(true);
  }

  protected togglePalette(variant: FlowWorkbenchOverviewVariant): void {
    this.paletteOpenFor(variant).update((open) => !open);
  }

  protected toggleDetails(variant: FlowWorkbenchOverviewVariant): void {
    this.detailsOpenFor(variant).update((open) => !open);
  }

  private createDefinition(
    variant: FlowWorkbenchOverviewVariant,
  ): TngFlowDefinition<FlowEditorDemoData> {
    return {
      id: 'support-agent-workbench',
      name: 'Support agent workbench',
      nodes: this.nodesFor(variant)(),
      connections: this.connectionsFor(variant)(),
    };
  }

  private nodesFor(
    variant: FlowWorkbenchOverviewVariant,
  ): WritableSignal<readonly TngFlowNode<FlowEditorDemoData>[]> {
    return variant === 'plain-css' ? this.plainCssNodes : this.tailwindNodes;
  }

  private connectionsFor(
    variant: FlowWorkbenchOverviewVariant,
  ): WritableSignal<readonly TngFlowConnection[]> {
    return variant === 'plain-css' ? this.plainCssConnections : this.tailwindConnections;
  }

  private selectionFor(variant: FlowWorkbenchOverviewVariant): WritableSignal<TngFlowSelection> {
    return variant === 'plain-css' ? this.plainCssSelection : this.tailwindSelection;
  }

  private inspectedNodeIdFor(variant: FlowWorkbenchOverviewVariant): WritableSignal<string | null> {
    return variant === 'plain-css' ? this.plainCssInspectedNodeId : this.tailwindInspectedNodeId;
  }

  private modeFor(variant: FlowWorkbenchOverviewVariant): WritableSignal<TngFlowWorkbenchMode> {
    return variant === 'plain-css' ? this.plainCssMode : this.tailwindMode;
  }

  private paletteOpenFor(variant: FlowWorkbenchOverviewVariant): WritableSignal<boolean> {
    return variant === 'plain-css' ? this.plainCssPaletteOpen : this.tailwindPaletteOpen;
  }

  private detailsOpenFor(variant: FlowWorkbenchOverviewVariant): WritableSignal<boolean> {
    return variant === 'plain-css' ? this.plainCssDetailsOpen : this.tailwindDetailsOpen;
  }

  public ngOnDestroy(): void {
    this.colorSchemeObserver?.disconnect();
  }
}
