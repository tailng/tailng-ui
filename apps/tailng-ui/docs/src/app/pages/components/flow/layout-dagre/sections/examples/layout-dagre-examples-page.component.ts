import { DOCUMENT } from '@angular/common';
import { Component, inject, signal, type OnDestroy } from '@angular/core';
import { TngButtonComponent } from '@tailng-ui/components';
import {
  TngFlowEditorComponent,
  type TngFlowDefinition,
  type TngFlowLayoutDirection,
  type TngFlowNodesLayoutRequest,
} from '@tailng-ui/flow';
import { createTngFlowDagreLayoutEngine } from '@tailng-ui/flow/layout-dagre';
import {
  layoutDagrePlainCssCodeTabs,
  layoutDagreTailwindCodeTabs,
} from './layout-dagre-examples-code.data';
import {
  DocsExampleTabsSectionComponent,
  DocsExampleVariantDirective,
} from '../../../../../../shared/example-tabs-section/docs-example-tabs-section.component';
import {
  observeDocsCodeThemeChanges,
  resolveDocsCodeBlockTheme,
} from '../../../../../../shared/util';

type LayoutDemoData = Readonly<{
  stage: string;
}>;

const layoutDirections: readonly Readonly<{
  label: string;
  value: TngFlowLayoutDirection;
}>[] = [
  { label: 'Left to right', value: 'left-to-right' },
  { label: 'Right to left', value: 'right-to-left' },
  { label: 'Top to bottom', value: 'top-to-bottom' },
  { label: 'Bottom to top', value: 'bottom-to-top' },
];

const layoutDemoDefinition: TngFlowDefinition<LayoutDemoData> = {
  id: 'dagre-layout-demo',
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

class LayoutDagreExampleState {
  public readonly direction = signal<TngFlowLayoutDirection>('left-to-right');
  public readonly definition = signal(layoutDemoDefinition);
  public readonly status = signal('Choose a direction, then arrange the workflow.');
}

@Component({
  selector: 'app-layout-dagre-examples-page',
  imports: [
    DocsExampleTabsSectionComponent,
    DocsExampleVariantDirective,
    TngButtonComponent,
    TngFlowEditorComponent,
  ],
  templateUrl: './layout-dagre-examples-page.component.html',
  styleUrl: './layout-dagre-examples-page.component.css',
})
export class LayoutDagreExamplesPageComponent implements OnDestroy {
  private readonly documentRef = inject(DOCUMENT);
  protected readonly codeBlockTheme = signal<'github-dark' | 'github-light'>(
    resolveDocsCodeBlockTheme(this.documentRef),
  );
  private readonly colorSchemeObserver = observeDocsCodeThemeChanges(
    this.documentRef,
    this.codeBlockTheme,
  );

  protected readonly directions = layoutDirections;
  protected readonly plainCssExample = new LayoutDagreExampleState();
  protected readonly tailwindExample = new LayoutDagreExampleState();
  protected readonly layoutEngine = createTngFlowDagreLayoutEngine<LayoutDemoData>();
  protected readonly plainCssCodeTabs = layoutDagrePlainCssCodeTabs;
  protected readonly tailwindCodeTabs = layoutDagreTailwindCodeTabs;

  protected setDirection(state: LayoutDagreExampleState, value: TngFlowLayoutDirection): void {
    state.direction.set(value);
  }

  protected requestLayout(
    editor: TngFlowEditorComponent<LayoutDemoData>,
    state: LayoutDagreExampleState,
  ): void {
    state.status.set('Calculating layout…');
    void editor
      .requestAutoLayout({
        direction: state.direction(),
        nodeSpacing: 48,
        levelSpacing: 120,
        componentSpacing: 72,
        viewport: { fit: true, animated: true, padding: 40 },
      })
      .then((requested) => {
        if (!requested) {
          state.status.set('The editor was not ready to calculate a layout.');
        }
      })
      .catch(() => {
        state.status.set('The layout engine could not arrange this workflow.');
      });
  }

  protected applyLayout(request: TngFlowNodesLayoutRequest, state: LayoutDagreExampleState): void {
    const positions = new Map(request.nodes.map((move) => [move.id, move.position]));
    state.definition.update((definition) => ({
      ...definition,
      nodes: definition.nodes.map((node) => ({
        ...node,
        position: positions.get(node.id) ?? node.position,
      })),
    }));
    state.status.set(
      `Arranged ${request.nodes.length} nodes ${this.directionLabel(request.options.direction).toLowerCase()}.`,
    );
  }

  protected resetDemo(state: LayoutDagreExampleState): void {
    state.definition.set(layoutDemoDefinition);
    state.status.set('Workflow positions reset.');
  }

  private directionLabel(direction: TngFlowLayoutDirection): string {
    return layoutDirections.find((entry) => entry.value === direction)?.label ?? direction;
  }

  public ngOnDestroy(): void {
    this.colorSchemeObserver?.disconnect();
  }
}
