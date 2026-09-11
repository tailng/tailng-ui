import { DOCUMENT } from '@angular/common';
import { Component, inject, signal, type OnDestroy, type WritableSignal } from '@angular/core';
import { TngButtonComponent } from '@tailng-ui/components';
import type {
  TngFlowConnectionCreateRequest,
  TngFlowConnectionReconnectRequest,
  TngFlowConnectionsDeleteRequest,
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
import {
  applyFlowExecutionGraphConnectionCreate,
  applyFlowExecutionGraphConnectionReconnect,
  applyFlowExecutionGraphConnectionsDelete,
  applyFlowExecutionGraphNodeMoves,
  type FlowExecutionGraphControlledUpdate,
} from '../../flow-execution-graph-editing';

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
    definition.update((current) => applyFlowExecutionGraphNodeMoves(current, event));
  }

  protected onConnectionCreateRequested(
    definition: WritableSignal<TngFlowDefinition<unknown>>,
    selection: WritableSignal<TngFlowSelection>,
    request: TngFlowConnectionCreateRequest,
  ): void {
    this.applyControlledUpdate(
      definition,
      selection,
      applyFlowExecutionGraphConnectionCreate(definition(), request),
    );
  }

  protected onConnectionReconnectRequested(
    definition: WritableSignal<TngFlowDefinition<unknown>>,
    selection: WritableSignal<TngFlowSelection>,
    request: TngFlowConnectionReconnectRequest,
  ): void {
    this.applyControlledUpdate(
      definition,
      selection,
      applyFlowExecutionGraphConnectionReconnect(definition(), selection(), request),
    );
  }

  protected onConnectionsDeleteRequested(
    definition: WritableSignal<TngFlowDefinition<unknown>>,
    selection: WritableSignal<TngFlowSelection>,
    request: TngFlowConnectionsDeleteRequest,
  ): void {
    this.applyControlledUpdate(
      definition,
      selection,
      applyFlowExecutionGraphConnectionsDelete(definition(), selection(), request),
    );
  }

  protected hasSelectedConnection(selection: WritableSignal<TngFlowSelection>): boolean {
    return selection().connectionIds.size > 0;
  }

  protected deleteSelectedConnections(
    definition: WritableSignal<TngFlowDefinition<unknown>>,
    selection: WritableSignal<TngFlowSelection>,
  ): void {
    this.onConnectionsDeleteRequested(definition, selection, {
      connectionIds: [...selection().connectionIds],
      source: 'api',
    });
  }

  private applyControlledUpdate(
    definition: WritableSignal<TngFlowDefinition<unknown>>,
    selection: WritableSignal<TngFlowSelection>,
    update: FlowExecutionGraphControlledUpdate,
  ): void {
    definition.set(update.definition);
    selection.set(update.selection);
  }
}
