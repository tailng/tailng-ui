import type { DocsExampleCodeTab } from '../../../../../../../shared/example-panel/docs-example-panel.component';

const componentCode = `import { Component, signal } from '@angular/core';
import {
  TngFlowEditorComponent,
  TngFlowPaletteItemDirective,
  ensureTngFlowCustomPointPorts,
  type TngFlowConnectionCreateRequest,
  type TngFlowDefinition,
  type TngFlowNodeCreateRequest,
  type TngFlowNodePositionChange,
  type TngFlowPaletteItem,
  type TngFlowSelection,
} from '@tailng-ui/flow';

type NodeData = Readonly<{
  acceptsInput: boolean;
  createsOutput: boolean;
}>;

const palette: readonly TngFlowPaletteItem<NodeData>[] = [
  {
    id: 'webhook',
    type: 'trigger',
    name: 'Webhook',
    data: { acceptsInput: false, createsOutput: true },
  },
  {
    id: 'request',
    type: 'action',
    name: 'HTTP request',
    data: { acceptsInput: true, createsOutput: true },
  },
  {
    id: 'condition',
    type: 'logic',
    name: 'Condition',
    data: { acceptsInput: true, createsOutput: true },
  },
];

@Component({
  selector: 'app-flow-builder',
  imports: [TngFlowEditorComponent, TngFlowPaletteItemDirective],
  templateUrl: './flow-builder.component.html',
  styleUrl: './flow-builder.component.css',
})
export class FlowBuilderComponent {
  readonly palette = palette;
  readonly definition = signal<TngFlowDefinition<NodeData>>({
    id: 'new-workflow',
    name: 'Untitled workflow',
    nodes: [],
    connections: [],
  });
  readonly selection = signal<TngFlowSelection>({
    nodeIds: new Set(),
    connectionIds: new Set(),
  });
  private sequence = 1;

  createNode(request: TngFlowNodeCreateRequest<NodeData>): void {
    const data = request.item.data!;
    const id = request.item.type + '-' + this.sequence++;
    this.definition.update((flow) => ({
      ...flow,
      nodes: [
        ...flow.nodes,
        {
          id,
          type: request.item.type,
          name: request.item.name,
          position: request.position,
          data,
          ports: [],
        },
      ],
    }));
  }

  moveNode(event: TngFlowNodePositionChange): void {
    this.definition.update((flow) => ({
      ...flow,
      nodes: flow.nodes.map((node) =>
        node.id === event.nodeId ? { ...node, position: event.position } : node,
      ),
    }));
  }

  connect(request: TngFlowConnectionCreateRequest): void {
    const flow = this.definition();
    const nodes = ensureTngFlowCustomPointPorts(flow.nodes, [
      request.source,
      request.target,
    ]);
    this.definition.set({
      ...flow,
      nodes,
      connections: [
        ...flow.connections,
        {
          id: 'connection-' + this.sequence++,
          source: request.source,
          target: request.target,
          type: 'bezier',
        },
      ],
    });
  }
}`;

const markupCode = `<div class="flow-builder">
  <aside class="flow-builder__palette">
    <h3>Step library</h3>
    @for (item of palette; track item.id) {
      <button
        type="button"
        [tngFlowPaletteItem]="item"
        (tngFlowPaletteItemActivate)="
          editor.requestNodeCreate($event.item, undefined, $event.source)
        "
      >
        <strong>{{ item.name }}</strong>
        <span>{{ item.description }}</span>
      </button>
    }
  </aside>

  <tng-flow-editor
    #editor="tngFlowEditor"
    flowId="professional-flow-builder"
    attachmentLayout="custom-points"
    [definition]="definition()"
    [selection]="selection()"
    [snapToGrid]="true"
    (nodeCreateRequested)="createNode($event)"
    (nodePositionChange)="moveNode($event)"
    (connectionCreateRequested)="connect($event)"
    (selectionChange)="selection.set($event)"
  />
</div>`;

const cssCode = `.flow-builder {
  display: grid;
  grid-template-columns: 16rem minmax(0, 1fr);
  min-height: 38rem;
  overflow: hidden;
  border: 1px solid var(--tng-semantic-border-default);
  border-radius: 1rem;
}

.flow-builder__palette {
  display: grid;
  align-content: start;
  gap: 0.5rem;
  padding: 1rem;
  border-right: 1px solid var(--tng-semantic-border-default);
  background: var(--tng-semantic-background-subtle);
}

.flow-builder__palette button {
  display: grid;
  gap: 0.15rem;
  padding: 0.75rem;
  text-align: left;
  border: 1px solid var(--tng-semantic-border-default);
  border-radius: 0.75rem;
  background: var(--tng-semantic-background-surface);
  cursor: pointer;
}

.flow-builder__palette strong {
  font-size: 0.875rem;
}

.flow-builder__palette span {
  font-size: 0.75rem;
  color: var(--tng-semantic-text-muted);
}`;

export const professionalFlowBuilderDemoCodeTabs: readonly DocsExampleCodeTab[] = Object.freeze([
  {
    value: 'ts',
    label: 'TS',
    language: 'ts',
    title: 'flow-builder.component.ts',
    code: componentCode,
  },
  {
    value: 'html',
    label: 'HTML',
    language: 'html',
    title: 'flow-builder.component.html',
    code: markupCode,
  },
  {
    value: 'css',
    label: 'CSS',
    language: 'css',
    title: 'flow-builder.component.css',
    code: cssCode,
  },
]);
