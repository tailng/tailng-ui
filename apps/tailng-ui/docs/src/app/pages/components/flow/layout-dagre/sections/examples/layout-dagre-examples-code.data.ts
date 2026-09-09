import type { DocsExampleCodeTab } from '../../../../../../shared/example-panel/docs-example-panel.component';

const layoutDagreComponentCode = String.raw`import { Component, signal } from '@angular/core';
import { TngButtonComponent } from '@tailng-ui/components';
import {
  TngFlowEditorComponent,
  type TngFlowDefinition,
  type TngFlowLayoutDirection,
  type TngFlowNodesLayoutRequest,
} from '@tailng-ui/flow';
import { createTngFlowDagreLayoutEngine } from '@tailng-ui/flow/layout-dagre';

type NodeData = Readonly<{ stage: string }>;

const directions: readonly Readonly<{
  label: string;
  value: TngFlowLayoutDirection;
}>[] = [
  { label: 'Left to right', value: 'left-to-right' },
  { label: 'Right to left', value: 'right-to-left' },
  { label: 'Top to bottom', value: 'top-to-bottom' },
  { label: 'Bottom to top', value: 'bottom-to-top' },
];

const initialWorkflow: TngFlowDefinition<NodeData> = {
  id: 'content-publishing',
  name: 'Content publishing workflow',
  nodes: [
    {
      id: 'brief',
      type: 'trigger',
      name: 'Receive brief',
      description: 'Start when a content brief is approved.',
      position: { x: 60, y: 190 },
      data: { stage: 'Trigger' },
      ports: [{ id: 'out', direction: 'output', kind: 'control', multiple: true }],
    },
    {
      id: 'research',
      type: 'agent',
      name: 'Research topic',
      description: 'Collect sources and supporting evidence.',
      position: { x: 430, y: 30 },
      data: { stage: 'Agent' },
      ports: [
        { id: 'in', direction: 'input', kind: 'control' },
        { id: 'out', direction: 'output', kind: 'control' },
      ],
    },
    {
      id: 'draft',
      type: 'agent',
      name: 'Write draft',
      description: 'Create the first article draft.',
      position: { x: 280, y: 350 },
      data: { stage: 'Agent' },
      ports: [
        { id: 'in', direction: 'input', kind: 'control' },
        { id: 'out', direction: 'output', kind: 'control' },
      ],
    },
    {
      id: 'review',
      type: 'approval',
      name: 'Editorial review',
      description: 'Approve the article or request changes.',
      position: { x: 770, y: 250 },
      data: { stage: 'Human review' },
      ports: [
        { id: 'in', direction: 'input', kind: 'control' },
        { id: 'out', direction: 'output', kind: 'control' },
      ],
    },
    {
      id: 'publish',
      type: 'action',
      name: 'Publish article',
      description: 'Send the approved article to the CMS.',
      position: { x: 1060, y: 80 },
      data: { stage: 'Action' },
      ports: [{ id: 'in', direction: 'input', kind: 'control' }],
    },
  ],
  connections: [
    {
      id: 'brief-research',
      source: { nodeId: 'brief', portId: 'out' },
      target: { nodeId: 'research', portId: 'in' },
    },
    {
      id: 'research-draft',
      source: { nodeId: 'research', portId: 'out' },
      target: { nodeId: 'draft', portId: 'in' },
    },
    {
      id: 'draft-review',
      source: { nodeId: 'draft', portId: 'out' },
      target: { nodeId: 'review', portId: 'in' },
    },
    {
      id: 'review-publish',
      source: { nodeId: 'review', portId: 'out' },
      target: { nodeId: 'publish', portId: 'in' },
    },
  ],
};

@Component({
  selector: 'app-layout-dagre-example',
  standalone: true,
  imports: [TngButtonComponent, TngFlowEditorComponent],
  templateUrl: './layout-dagre-example.component.html',
  styleUrl: './layout-dagre-example.component.css',
})
export class LayoutDagreExampleComponent {
  readonly directions = directions;
  readonly direction = signal<TngFlowLayoutDirection>('left-to-right');
  readonly workflow = signal(initialWorkflow);
  readonly layoutEngine = createTngFlowDagreLayoutEngine<NodeData>();
  readonly status = signal('Choose a direction, then arrange the workflow.');

  requestLayout(editor: TngFlowEditorComponent<NodeData>): void {
    this.status.set('Calculating layout…');
    void editor
      .requestAutoLayout({
        direction: this.direction(),
        nodeSpacing: 48,
        levelSpacing: 120,
        componentSpacing: 72,
        viewport: { fit: true, animated: true, padding: 40 },
      })
      .then((requested) => {
        if (!requested) {
          this.status.set('The editor was not ready to calculate a layout.');
        }
      })
      .catch(() => {
        this.status.set('The layout engine could not arrange this workflow.');
      });
  }

  applyLayout(request: TngFlowNodesLayoutRequest): void {
    const positions = new Map(request.nodes.map((move) => [move.id, move.position]));
    this.workflow.update((workflow) => ({
      ...workflow,
      nodes: workflow.nodes.map((node) => ({
        ...node,
        position: positions.get(node.id) ?? node.position,
      })),
    }));
    const direction = directions.find((entry) => entry.value === request.options.direction)?.label;
    this.status.set('Arranged ' + request.nodes.length + ' nodes ' + direction?.toLowerCase() + '.');
  }

  reset(): void {
    this.workflow.set(initialWorkflow);
    this.status.set('Workflow positions reset.');
  }
}`;

const layoutDagrePlainCssMarkup = String.raw`<div class="layout-dagre-example">
  <header class="layout-dagre-example__toolbar" aria-label="Dagre layout tools">
    <label class="layout-dagre-example__direction" for="dagre-direction">
      <span>Direction</span>
      <select
        id="dagre-direction"
        [value]="direction()"
        (change)="direction.set($any($event.target).value)"
      >
        @for (entry of directions; track entry.value) {
          <option [value]="entry.value">{{ entry.label }}</option>
        }
      </select>
    </label>

    <div class="layout-dagre-example__actions">
      <tng-button
        type="button"
        appearance="solid"
        size="sm"
        (click)="requestLayout(editor)"
      >
        Arrange workflow
      </tng-button>
      <tng-button type="button" appearance="outline" size="sm" (click)="reset()">
        Reset
      </tng-button>
    </div>

    <p class="layout-dagre-example__status" role="status" aria-live="polite">
      {{ status() }}
    </p>
  </header>

  <tng-flow-editor
    #editor="tngFlowEditor"
    flowId="dagre-layout-plain-css"
    class="layout-dagre-example__canvas"
    ariaLabel="Dagre automatic layout workflow styled with Plain CSS"
    [definition]="workflow()"
    [layoutEngine]="layoutEngine"
    [showMinimap]="true"
    (nodesLayoutRequested)="applyLayout($event)"
  />
</div>`;

const layoutDagrePlainCss = String.raw`.layout-dagre-example {
  display: grid;
  gap: 0.75rem;
}

.layout-dagre-example__toolbar {
  display: flex;
  flex-wrap: wrap;
  align-items: end;
  gap: 0.75rem;
  padding: 1rem;
  border: 1px solid var(--tng-semantic-border-subtle, #e2e8f0);
  border-radius: 0.75rem;
  background: var(--tng-semantic-background-muted, #f8fafc);
}

.layout-dagre-example__direction {
  display: grid;
  gap: 0.375rem;
  min-width: 11rem;
  color: var(--tng-semantic-foreground-secondary, #475569);
  font-size: 0.75rem;
  font-weight: 600;
}

.layout-dagre-example__direction select {
  min-height: 2.25rem;
  padding-inline: 0.625rem;
  border: 1px solid var(--tng-semantic-border-strong, #cbd5e1);
  border-radius: 0.5rem;
  background: var(--tng-semantic-background-surface, #fff);
  color: var(--tng-semantic-foreground-primary, #0f172a);
  font: inherit;
  font-size: 0.875rem;
}

.layout-dagre-example__direction select:focus-visible {
  outline: 2px solid var(--tng-semantic-accent-brand, #2563eb);
  outline-offset: 2px;
}

.layout-dagre-example__actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.layout-dagre-example__status {
  flex: 1 1 16rem;
  align-self: center;
  min-width: 0;
  margin: 0;
  color: var(--tng-semantic-foreground-secondary, #475569);
  font-size: 0.875rem;
}

.layout-dagre-example__canvas {
  display: block;
  height: 32rem;
  min-height: 26rem;
  overflow: hidden;
  border: 1px solid var(--tng-semantic-border-subtle, #e2e8f0);
  border-radius: 0.75rem;
}

@media (max-width: 720px) {
  .layout-dagre-example__canvas {
    height: 28rem;
  }
}`;

const layoutDagreTailwindMarkup = String.raw`<div class="grid gap-3">
  <header
    class="flex flex-wrap items-end gap-3 rounded-xl border border-[var(--tng-semantic-border-subtle)] bg-[var(--tng-semantic-background-muted)] p-4"
    aria-label="Dagre layout tools"
  >
    <label
      class="grid min-w-44 gap-1.5 text-xs font-semibold text-[var(--tng-semantic-foreground-secondary)]"
      for="dagre-direction"
    >
      <span>Direction</span>
      <select
        id="dagre-direction"
        class="min-h-9 rounded-lg border border-[var(--tng-semantic-border-strong)] bg-[var(--tng-semantic-background-surface)] px-2.5 text-sm text-[var(--tng-semantic-foreground-primary)]"
        [value]="direction()"
        (change)="direction.set($any($event.target).value)"
      >
        @for (entry of directions; track entry.value) {
          <option [value]="entry.value">{{ entry.label }}</option>
        }
      </select>
    </label>

    <div class="flex flex-wrap gap-2">
      <tng-button
        type="button"
        appearance="solid"
        size="sm"
        (click)="requestLayout(editor)"
      >
        Arrange workflow
      </tng-button>
      <tng-button type="button" appearance="outline" size="sm" (click)="reset()">
        Reset
      </tng-button>
    </div>

    <p
      class="m-0 min-w-64 flex-1 self-center text-sm text-[var(--tng-semantic-foreground-secondary)]"
      role="status"
      aria-live="polite"
    >
      {{ status() }}
    </p>
  </header>

  <tng-flow-editor
    #editor="tngFlowEditor"
    flowId="dagre-layout-tailwind-css"
    class="block h-[32rem] min-h-[26rem] overflow-hidden rounded-xl border border-[var(--tng-semantic-border-subtle)] max-[720px]:h-[28rem]"
    ariaLabel="Dagre automatic layout workflow styled with Tailwind CSS"
    [definition]="workflow()"
    [layoutEngine]="layoutEngine"
    [showMinimap]="true"
    (nodesLayoutRequested)="applyLayout($event)"
  />
</div>`;

const layoutDagreTailwindCss = String.raw`:host {
  display: block;
}

/* The example UI is styled with Tailwind utilities in the template. */`;

function layoutDagreCodeTabs(markup: string, css: string): readonly DocsExampleCodeTab[] {
  return Object.freeze([
    {
      value: 'ts',
      label: 'TS',
      language: 'ts',
      title: 'layout-dagre-example.component.ts',
      code: layoutDagreComponentCode,
    },
    {
      value: 'html',
      label: 'HTML',
      language: 'html',
      title: 'layout-dagre-example.component.html',
      code: markup,
    },
    {
      value: 'css',
      label: 'CSS',
      language: 'css',
      title: 'layout-dagre-example.component.css',
      code: css,
    },
  ]);
}

export const layoutDagrePlainCssCodeTabs = layoutDagreCodeTabs(
  layoutDagrePlainCssMarkup,
  layoutDagrePlainCss,
);

export const layoutDagreTailwindCodeTabs = layoutDagreCodeTabs(
  layoutDagreTailwindMarkup,
  layoutDagreTailwindCss,
);
