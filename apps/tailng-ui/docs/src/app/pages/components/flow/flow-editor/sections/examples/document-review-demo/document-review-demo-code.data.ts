import { documentReviewDefinition } from './document-review-workflow.data';
import type { DocsExampleCodeTab } from '../../../../../../../shared/example-panel/docs-example-panel.component';

const componentCode = `import { Component, signal } from '@angular/core';
import {
  TngFlowEditorComponent,
  TngFlowNodeComponent,
  TngFlowNodeTemplateDirective,
  type TngFlowConnectionCreateRequest,
  type TngFlowEditorMode,
  type TngFlowNodePositionChange,
  type TngFlowPresentation,
  type TngFlowSelection,
  type TngFlowValidation,
} from '@tailng-ui/flow';
import { documentReviewFlow } from './document-review-flow.data';

@Component({
  selector: 'app-document-review',
  standalone: true,
  imports: [
    TngFlowEditorComponent,
    TngFlowNodeComponent,
    TngFlowNodeTemplateDirective,
  ],
  templateUrl: './document-review.component.html',
})
export class DocumentReviewComponent {
  readonly definition = signal(documentReviewFlow);
  readonly mode = signal<TngFlowEditorMode>('edit');
  readonly selection = signal<TngFlowSelection>({
    nodeIds: new Set(),
    connectionIds: new Set(),
  });
  readonly validation = signal<TngFlowValidation>({
    issues: [{
      id: 'manual-review-assignee-required',
      code: 'required-configuration',
      severity: 'error',
      message: 'Select a reviewer for this step.',
      target: { kind: 'node', nodeId: 'manual-review' },
    }],
  });
  readonly presentation = signal<TngFlowPresentation>({});

  moveNode(event: TngFlowNodePositionChange): void {
    this.definition.update((flow) => ({
      ...flow,
      nodes: flow.nodes.map((node) =>
        node.id === event.nodeId ? { ...node, position: event.position } : node,
      ),
    }));
  }

  createConnection(request: TngFlowConnectionCreateRequest): void {
    this.definition.update((flow) => ({
      ...flow,
      connections: [
        ...flow.connections,
        { id: crypto.randomUUID(), ...request, type: 'bezier' },
      ],
    }));
  }

  run(): void {
    this.mode.set('inspect');
    this.presentation.set({
      nodes: {
        start: { status: 'completed' },
        upload: { status: 'completed' },
        extract: { status: 'running', progress: 62, highlighted: true },
      },
      connections: {
        'start-to-upload': { status: 'success' },
        'upload-to-extract': { status: 'active', motion: 'flow' },
      },
    });
  }
}`;

const markupCode = `<div class="document-review-toolbar">
  <button type="button" (click)="mode.set('edit')">Edit</button>
  <button type="button" (click)="mode.set('inspect')">Inspect</button>
  <button type="button" (click)="mode.set('readonly')">Readonly</button>
  <button type="button" (click)="run()">Run simulation</button>
  <button type="button" (click)="editor.revealTarget(
    validation().issues[0].target,
    { select: true, animated: true }
  )">Show first error</button>
</div>

<div class="document-review-workspace">
  <tng-flow-editor
    #editor="tngFlowEditor"
    flowId="document-review"
    ariaLabel="Interactive document review workflow"
    [definition]="definition()"
    [selection]="selection()"
    [validation]="validation()"
    [presentation]="presentation()"
    [mode]="mode()"
    [zoomMinimum]="0.18"
    (nodePositionChange)="moveNode($event)"
    (connectionCreateRequested)="createConnection($event)"
    (selectionChange)="selection.set($event)"
  >
    <ng-template tngFlowNode="decision" let-node let-view="view" let-issues="issues">
      <tng-flow-node
        [name]="node.name"
        [description]="node.description"
        [status]="view.status"
        [selected]="view.selected"
        [validationIssues]="issues"
      >
        <div class="decision-paths">
          <span>Auto approve</span>
          <span>Needs review</span>
        </div>
      </tng-flow-node>
    </ng-template>
  </tng-flow-editor>

  <aside class="document-review-inspector">
    <!-- Render the selected node's domain data, ports, and issues here. -->
  </aside>
</div>`;

const cssCode = `.document-review-toolbar {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  padding: 1rem;
}

.document-review-workspace {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 18rem;
}

tng-flow-editor {
  display: block;
  height: 34rem;
}

.document-review-inspector {
  padding: 1rem;
  border-left: 1px solid var(--tng-semantic-border-subtle);
  background: var(--tng-semantic-background-canvas);
}

.decision-paths {
  display: flex;
  gap: 0.5rem;
  margin-top: 0.75rem;
}

@media (max-width: 900px) {
  .document-review-workspace {
    grid-template-columns: 1fr;
  }
}`;

const dataCode = `import type { TngFlowDefinition } from '@tailng-ui/flow';

export type DocumentReviewNodeData = Readonly<{
  summary?: string;
  configuration?: Readonly<Record<string, unknown>>;
}>;

export const documentReviewFlow: TngFlowDefinition<DocumentReviewNodeData> = ${JSON.stringify(
  documentReviewDefinition,
  null,
  2,
)};`;

export const documentReviewDemoCodeTabs: readonly DocsExampleCodeTab[] = Object.freeze([
  {
    value: 'ts',
    label: 'TS',
    language: 'ts',
    title: 'document-review.component.ts',
    code: componentCode,
  },
  {
    value: 'html',
    label: 'HTML',
    language: 'html',
    title: 'document-review.component.html',
    code: markupCode,
  },
  {
    value: 'css',
    label: 'CSS',
    language: 'css',
    title: 'document-review.component.css',
    code: cssCode,
  },
  {
    value: 'data',
    label: 'Data',
    language: 'ts',
    title: 'document-review-flow.data.ts',
    code: dataCode,
  },
]);
