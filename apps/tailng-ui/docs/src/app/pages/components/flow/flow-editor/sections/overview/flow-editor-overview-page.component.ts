import { DOCUMENT } from '@angular/common';
import { Component, inject, signal, type OnDestroy, type WritableSignal } from '@angular/core';
import { TngButtonComponent, TngCodeBlockComponent } from '@tailng-ui/components';
import {
  TngFlowEditorComponent,
  TngFlowPaletteItemDirective,
  type TngFlowConnectionCreateRequest,
  type TngFlowConnectionsDeleteRequest,
  type TngFlowNodesDeleteRequest,
  type TngFlowNodeCreateRequest,
  type TngFlowNodesMovedEvent,
  type TngFlowNode,
  type TngFlowPaletteItem,
  type TngFlowPresentation,
  type TngFlowSelection,
  type TngFlowValidation,
} from '@tailng-ui/flow';
import {
  flowEditorOverviewPlainCssCodeTabs,
  flowEditorOverviewTailwindCodeTabs,
} from './flow-editor-overview-code.data';
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
  flowEditorDemoViews,
  removeFlowItems,
  type FlowEditorDemoData,
} from '../../flow-editor-demo.data';

type FlowEditorOverviewVariant = 'plain-css' | 'tailwind-css';

const emptySelection = (): TngFlowSelection => ({
  nodeIds: new Set<string>(),
  connectionIds: new Set<string>(),
});

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

@Component({
  selector: 'app-flow-editor-overview-page',
  imports: [
    TngButtonComponent,
    TngCodeBlockComponent,
    TngFlowEditorComponent,
    TngFlowPaletteItemDirective,
    DocsExampleTabsSectionComponent,
    DocsExampleVariantDirective,
  ],
  templateUrl: './flow-editor-overview-page.component.html',
  styleUrl: './flow-editor-overview-page.component.css',
})
export class FlowEditorOverviewPageComponent implements OnDestroy {
  private readonly documentRef = inject(DOCUMENT);
  private readonly connectionSequence = signal(0);
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
  protected readonly plainCssConnections = signal(flowEditorDemoConnections);
  protected readonly tailwindNodes =
    signal<readonly TngFlowNode<FlowEditorDemoData>[]>(flowEditorDemoNodes);
  protected readonly tailwindConnections = signal(flowEditorDemoConnections);
  protected readonly plainCssSelection = signal<TngFlowSelection>(emptySelection());
  protected readonly tailwindSelection = signal<TngFlowSelection>(emptySelection());
  protected readonly presentation: TngFlowPresentation = {
    nodes: {
      model: {
        status: flowEditorDemoViews['model']?.status,
        progress: flowEditorDemoViews['model']?.progress,
        statusMessage: flowEditorDemoViews['model']?.message,
        highlighted: true,
      },
      prompt: { status: 'completed', progress: 100 },
      response: { status: 'waiting', statusMessage: 'Waiting for model output', dimmed: true },
    },
    connections: {
      'prompt-to-model': { status: 'success' },
      'model-to-response': {
        status: 'active',
        motion: 'flow',
        motionSpeed: 'normal',
        motionDirection: 'forward',
      },
    },
  };
  protected readonly validation: TngFlowValidation = {
    issues: [
      {
        id: 'docs-model-review',
        code: 'review-recommended',
        severity: 'warning',
        message: 'Review the model configuration before deployment.',
        target: { kind: 'node', nodeId: 'model' },
      },
    ],
  };
  protected readonly paletteItems = overviewPaletteItems;
  protected readonly plainCssCodeTabs = flowEditorOverviewPlainCssCodeTabs;
  protected readonly tailwindCodeTabs = flowEditorOverviewTailwindCodeTabs;

  protected readonly installCode = [
    'pnpm add @tailng-ui/flow @tailng-ui/components @tailng-ui/icons \\',
    '  @foblex/flow @foblex/2d @foblex/mediator @foblex/platform @foblex/utils',
  ].join('\n');
  protected readonly stylesCode = "@import '@tailng-ui/flow/styles.css';";
  protected readonly controlledCode = [
    "import { Component, signal } from '@angular/core';",
    'import {',
    '  TngFlowEditorComponent,',
    '  type TngFlowConnection,',
    '  type TngFlowConnectionCreateRequest,',
    '  type TngFlowNode,',
    '  type TngFlowNodesMovedEvent,',
    '  type TngFlowViewport,',
    "} from '@tailng-ui/flow';",
    '',
    '@Component({',
    '  imports: [TngFlowEditorComponent],',
    '  template: `',
    '    <tng-flow-editor',
    '      [nodes]="nodes()"',
    '      [connections]="connections()"',
    '      [presentation]="presentation"',
    '      [validation]="validation"',
    '      [showMinimap]="true"',
    '      [viewport]="viewport()"',
    '      (nodesMoved)="moveNodes($event)"',
    '      (connectionCreateRequested)="createConnection($event)"',
    '      (viewportChange)="viewport.set($event)"',
    '    />',
    '  `,',
    '})',
    'export class AgentFlowComponent {',
    '  readonly nodes = signal<readonly TngFlowNode[]>(initialNodes);',
    '  readonly connections = signal<readonly TngFlowConnection[]>(initialConnections);',
    '  readonly viewport = signal<TngFlowViewport | null>(null);',
    "  readonly presentation = { nodes: { model: { status: 'running' as const, progress: 68 } } };",
    '  readonly validation = { issues: [] };',
    '',
    '  moveNodes(event: TngFlowNodesMovedEvent): void {',
    '    const positions = new Map(event.nodes.map((node) => [node.id, node.position]));',
    '    this.nodes.update((nodes) =>',
    '      nodes.map((node) => ({ ...node, position: positions.get(node.id) ?? node.position })),',
    '    );',
    '  }',
    '',
    '  createConnection(event: TngFlowConnectionCreateRequest): void {',
    '    this.connections.update((connections) => [',
    '      ...connections,',
    '      {',
    '        id: crypto.randomUUID(),',
    '        source: event.source,',
    '        target: event.target,',
    "        type: 'bezier',",
    '      },',
    '    ]);',
    '  }',
    '}',
  ].join('\n');

  protected onNodesMoved(event: TngFlowNodesMovedEvent, variant: FlowEditorOverviewVariant): void {
    const nodes = variant === 'plain-css' ? this.plainCssNodes : this.tailwindNodes;
    nodes.update((currentNodes) => applyFlowNodeMoves(currentNodes, event));
  }

  protected onConnectionCreateRequested(
    event: TngFlowConnectionCreateRequest,
    variant: FlowEditorOverviewVariant,
  ): void {
    const connections =
      variant === 'plain-css' ? this.plainCssConnections : this.tailwindConnections;
    const id = `docs-connection-${this.connectionSequence()}`;
    this.connectionSequence.update((sequence) => sequence + 1);
    connections.update((currentConnections) => [
      ...currentConnections,
      {
        id,
        source: event.source,
        target: event.target,
        type: 'bezier',
      },
    ]);
  }

  protected onNodeCreateRequested(
    event: TngFlowNodeCreateRequest<FlowEditorDemoData>,
    variant: FlowEditorOverviewVariant,
  ): void {
    const nodes = variant === 'plain-css' ? this.plainCssNodes : this.tailwindNodes;
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
  }

  protected onConnectionsDeleteRequested(
    event: TngFlowConnectionsDeleteRequest,
    variant: FlowEditorOverviewVariant,
  ): void {
    const connections =
      variant === 'plain-css' ? this.plainCssConnections : this.tailwindConnections;
    const deletedIds = new Set(event.connectionIds);
    connections.update((current) => current.filter((item) => !deletedIds.has(item.id)));
    this.selectionFor(variant).update((selection) => ({
      nodeIds: selection.nodeIds,
      connectionIds: new Set([...selection.connectionIds].filter((id) => !deletedIds.has(id))),
    }));
  }

  protected onNodesDeleteRequested(
    event: TngFlowNodesDeleteRequest,
    variant: FlowEditorOverviewVariant,
  ): void {
    const nodes = variant === 'plain-css' ? this.plainCssNodes : this.tailwindNodes;
    const connections =
      variant === 'plain-css' ? this.plainCssConnections : this.tailwindConnections;
    const next = removeFlowItems(nodes(), connections(), {
      nodeIds: event.nodeIds,
      connectionIds: [],
    });
    nodes.set(next.nodes);
    connections.set(next.connections);
    const remainingConnectionIds = new Set(next.connections.map((connection) => connection.id));
    const deletedNodeIds = new Set(event.nodeIds);
    this.selectionFor(variant).update((selection) => ({
      nodeIds: new Set([...selection.nodeIds].filter((id) => !deletedNodeIds.has(id))),
      connectionIds: new Set(
        [...selection.connectionIds].filter((id) => remainingConnectionIds.has(id)),
      ),
    }));
  }

  protected resetDemo(variant: FlowEditorOverviewVariant): void {
    const nodes = variant === 'plain-css' ? this.plainCssNodes : this.tailwindNodes;
    const connections =
      variant === 'plain-css' ? this.plainCssConnections : this.tailwindConnections;
    nodes.set(flowEditorDemoNodes);
    connections.set(flowEditorDemoConnections);
    this.selectionFor(variant).set(emptySelection());
  }

  private selectionFor(variant: FlowEditorOverviewVariant): WritableSignal<TngFlowSelection> {
    return variant === 'plain-css' ? this.plainCssSelection : this.tailwindSelection;
  }

  public ngOnDestroy(): void {
    this.colorSchemeObserver?.disconnect();
  }
}
