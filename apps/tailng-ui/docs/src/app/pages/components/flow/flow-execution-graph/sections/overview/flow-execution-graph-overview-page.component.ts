import { DOCUMENT } from '@angular/common';
import { Component, inject, signal, type OnDestroy, type WritableSignal } from '@angular/core';
import { TngButtonComponent } from '@tailng-ui/components';
import type {
  TngFlowDefinition,
  TngFlowEditorMode,
  TngFlowNodesMovedEvent,
  TngFlowSelection,
  TngFlowViewport,
} from '@tailng-ui/flow';
import { TngFlowExecutionGraphComponent } from '@tailng-ui/flow/execution';
import {
  flowExecutionGraphOverviewPlainCssCodeTabs,
  flowExecutionGraphOverviewTailwindCodeTabs,
} from './flow-execution-graph-overview-code.data';
import {
  DocsExampleTabsSectionComponent,
  DocsExampleVariantDirective,
} from '../../../../../../shared/example-tabs-section/docs-example-tabs-section.component';
import {
  observeDocsCodeThemeChanges,
  resolveDocsCodeBlockTheme,
} from '../../../../../../shared/util';
import {
  FLOW_EXECUTION_VIEWER_DEFINITION,
  findFlowExecutionViewerScenario,
} from '../../../flow-execution-viewer/sections/examples/flow-execution-viewer-example.data';

const overviewScenario = findFlowExecutionViewerScenario('running-node');

function cloneSelection(): TngFlowSelection {
  return {
    connectionIds: new Set(overviewScenario.selection.connectionIds),
    nodeIds: new Set(overviewScenario.selection.nodeIds),
  };
}

function cloneViewport(): TngFlowViewport {
  return {
    ...overviewScenario.viewport,
    position: { ...overviewScenario.viewport.position },
  };
}

function cloneDefinition(): TngFlowDefinition<unknown> {
  return {
    ...FLOW_EXECUTION_VIEWER_DEFINITION,
    nodes: FLOW_EXECUTION_VIEWER_DEFINITION.nodes.map((node) => ({
      ...node,
      position: { ...node.position },
    })),
    connections: FLOW_EXECUTION_VIEWER_DEFINITION.connections.map((connection) => ({
      ...connection,
      source: { ...connection.source },
      target: { ...connection.target },
    })),
  };
}

@Component({
  selector: 'app-flow-execution-graph-overview-page',
  imports: [
    DocsExampleTabsSectionComponent,
    DocsExampleVariantDirective,
    TngButtonComponent,
    TngFlowExecutionGraphComponent,
  ],
  templateUrl: './flow-execution-graph-overview-page.component.html',
  styleUrl: './flow-execution-graph-overview-page.component.css',
})
export class FlowExecutionGraphOverviewPageComponent implements OnDestroy {
  private readonly documentRef = inject(DOCUMENT);

  public readonly codeBlockTheme = signal<'github-dark' | 'github-light'>(
    resolveDocsCodeBlockTheme(this.documentRef),
  );
  private readonly colorSchemeObserver = observeDocsCodeThemeChanges(
    this.documentRef,
    this.codeBlockTheme,
  );

  protected readonly modes: readonly TngFlowEditorMode[] = ['edit', 'inspect', 'readonly'];
  protected readonly plainDefinition = signal<TngFlowDefinition<unknown>>(cloneDefinition());
  protected readonly plainMode = signal<TngFlowEditorMode>('edit');
  protected readonly snapshot = overviewScenario.snapshot;
  protected readonly plainSelection = signal<TngFlowSelection>(cloneSelection());
  protected readonly plainInspectedNodeId = signal<string | null>(overviewScenario.inspectedNodeId);
  protected readonly plainSelectedExecutionId = signal<string | null>(
    overviewScenario.selectedExecutionId,
  );
  protected readonly plainViewport = signal<TngFlowViewport>(cloneViewport());
  protected readonly tailwindDefinition = signal<TngFlowDefinition<unknown>>(cloneDefinition());
  protected readonly tailwindMode = signal<TngFlowEditorMode>('edit');
  protected readonly tailwindSelection = signal<TngFlowSelection>(cloneSelection());
  protected readonly tailwindInspectedNodeId = signal<string | null>(
    overviewScenario.inspectedNodeId,
  );
  protected readonly tailwindSelectedExecutionId = signal<string | null>(
    overviewScenario.selectedExecutionId,
  );
  protected readonly tailwindViewport = signal<TngFlowViewport>(cloneViewport());
  protected readonly plainCssCodeTabs = flowExecutionGraphOverviewPlainCssCodeTabs;
  protected readonly tailwindCodeTabs = flowExecutionGraphOverviewTailwindCodeTabs;

  public ngOnDestroy(): void {
    this.colorSchemeObserver?.disconnect();
  }

  protected onNodesMoved(
    definition: WritableSignal<TngFlowDefinition<unknown>>,
    event: TngFlowNodesMovedEvent,
  ): void {
    const positions = new Map(event.nodes.map((move) => [move.id, move.position]));
    definition.update((current) => ({
      ...current,
      nodes: current.nodes.map((node) => {
        const position = positions.get(node.id);
        return position === undefined ? node : { ...node, position };
      }),
    }));
  }
}
