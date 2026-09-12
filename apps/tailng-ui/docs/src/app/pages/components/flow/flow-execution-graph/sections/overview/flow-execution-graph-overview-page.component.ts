import { DOCUMENT } from '@angular/common';
import {
  Component,
  computed,
  inject,
  signal,
  type OnDestroy,
  type WritableSignal,
} from '@angular/core';
import { TngButtonComponent } from '@tailng-ui/components';
import type {
  TngFlowConnectionCreateRequest,
  TngFlowConnectionReconnectRequest,
  TngFlowConnectionRoutingChangeRequest,
  TngFlowConnectionsDeleteRequest,
  TngFlowDefinition,
  TngFlowEditorCommandRequest,
  TngFlowEditorMode,
  TngFlowHistoryState,
  TngFlowHistoryUpdate,
  TngFlowNodesDeleteRequest,
  TngFlowNodesMovedEvent,
  TngFlowSelection,
  TngFlowViewport,
} from '@tailng-ui/flow';
import {
  commitTngFlowHistory,
  createTngFlowHistory,
  redoTngFlowHistory,
  tngFlowHistoryStatus,
  undoTngFlowHistory,
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
  FLOW_EXECUTION_DEFINITION,
  findFlowExecutionScenario,
} from '../../../shared/flow-execution-scenarios.data';
import {
  applyFlowExecutionGraphConnectionCreate,
  applyFlowExecutionGraphConnectionReconnect,
  applyFlowExecutionGraphConnectionRoutingChange,
  applyFlowExecutionGraphConnectionsDelete,
  applyFlowExecutionGraphNodesDelete,
  applyFlowExecutionGraphNodeMoves,
  type FlowExecutionGraphControlledUpdate,
} from '../../flow-execution-graph-editing';

const overviewScenario = findFlowExecutionScenario('running-node');

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
    ...FLOW_EXECUTION_DEFINITION,
    nodes: FLOW_EXECUTION_DEFINITION.nodes.map((node) => ({
      ...node,
      position: { ...node.position },
    })),
    connections: FLOW_EXECUTION_DEFINITION.connections.map((connection) => ({
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
  protected readonly plainHistory = signal(
    createTngFlowHistory(this.plainDefinition(), { selection: this.plainSelection() }),
  );
  protected readonly plainHistoryStatus = computed(() => tngFlowHistoryStatus(this.plainHistory()));
  protected readonly plainInspectedNodeId = signal<string | null>(overviewScenario.inspectedNodeId);
  protected readonly plainSelectedExecutionId = signal<string | null>(
    overviewScenario.selectedExecutionId,
  );
  protected readonly plainViewport = signal<TngFlowViewport>(cloneViewport());
  protected readonly tailwindDefinition = signal<TngFlowDefinition<unknown>>(cloneDefinition());
  protected readonly tailwindMode = signal<TngFlowEditorMode>('edit');
  protected readonly tailwindSelection = signal<TngFlowSelection>(cloneSelection());
  protected readonly tailwindHistory = signal(
    createTngFlowHistory(this.tailwindDefinition(), { selection: this.tailwindSelection() }),
  );
  protected readonly tailwindHistoryStatus = computed(() =>
    tngFlowHistoryStatus(this.tailwindHistory()),
  );
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
    selection: WritableSignal<TngFlowSelection>,
    history: WritableSignal<TngFlowHistoryState<unknown>>,
    event: TngFlowNodesMovedEvent,
  ): void {
    const nextDefinition = applyFlowExecutionGraphNodeMoves(definition(), event);
    this.commitDefinitionUpdate(definition, selection, history, 'Move nodes', () => nextDefinition);
  }

  protected onConnectionCreateRequested(
    definition: WritableSignal<TngFlowDefinition<unknown>>,
    selection: WritableSignal<TngFlowSelection>,
    history: WritableSignal<TngFlowHistoryState<unknown>>,
    request: TngFlowConnectionCreateRequest,
  ): void {
    this.applyControlledUpdate(
      definition,
      selection,
      history,
      applyFlowExecutionGraphConnectionCreate(definition(), request),
      'Create connection',
    );
  }

  protected onConnectionReconnectRequested(
    definition: WritableSignal<TngFlowDefinition<unknown>>,
    selection: WritableSignal<TngFlowSelection>,
    history: WritableSignal<TngFlowHistoryState<unknown>>,
    request: TngFlowConnectionReconnectRequest,
  ): void {
    this.applyControlledUpdate(
      definition,
      selection,
      history,
      applyFlowExecutionGraphConnectionReconnect(definition(), selection(), request),
      'Reconnect connection',
    );
  }

  protected onConnectionsDeleteRequested(
    definition: WritableSignal<TngFlowDefinition<unknown>>,
    selection: WritableSignal<TngFlowSelection>,
    history: WritableSignal<TngFlowHistoryState<unknown>>,
    request: TngFlowConnectionsDeleteRequest,
  ): void {
    this.applyControlledUpdate(
      definition,
      selection,
      history,
      applyFlowExecutionGraphConnectionsDelete(definition(), selection(), request),
      'Delete connections',
    );
  }

  protected onNodesDeleteRequested(
    definition: WritableSignal<TngFlowDefinition<unknown>>,
    selection: WritableSignal<TngFlowSelection>,
    history: WritableSignal<TngFlowHistoryState<unknown>>,
    inspectedNodeId: WritableSignal<string | null>,
    selectedExecutionId: WritableSignal<string | null>,
    request: TngFlowNodesDeleteRequest,
  ): void {
    this.applyControlledUpdate(
      definition,
      selection,
      history,
      applyFlowExecutionGraphNodesDelete(definition(), selection(), request),
      'Delete nodes',
    );
    if (inspectedNodeId() !== null && request.nodeIds.includes(inspectedNodeId() ?? '')) {
      inspectedNodeId.set(null);
      selectedExecutionId.set(null);
    }
  }

  protected onCommandRequested(
    definition: WritableSignal<TngFlowDefinition<unknown>>,
    selection: WritableSignal<TngFlowSelection>,
    history: WritableSignal<TngFlowHistoryState<unknown>>,
    inspectedNodeId: WritableSignal<string | null>,
    selectedExecutionId: WritableSignal<string | null>,
    request: TngFlowEditorCommandRequest,
  ): void {
    if (request.command === 'undo') {
      this.applyHistoryState(
        definition,
        selection,
        history,
        inspectedNodeId,
        selectedExecutionId,
        undoTngFlowHistory(history()),
      );
      return;
    }
    if (request.command === 'redo') {
      this.applyHistoryState(
        definition,
        selection,
        history,
        inspectedNodeId,
        selectedExecutionId,
        redoTngFlowHistory(history()),
      );
    }
  }

  protected onConnectionRoutingChangeRequested(
    definition: WritableSignal<TngFlowDefinition<unknown>>,
    selection: WritableSignal<TngFlowSelection>,
    history: WritableSignal<TngFlowHistoryState<unknown>>,
    request: TngFlowConnectionRoutingChangeRequest,
  ): void {
    this.commitDefinitionUpdate(
      definition,
      selection,
      history,
      `Change ${request.type} routing`,
      (current) => applyFlowExecutionGraphConnectionRoutingChange(current, request),
    );
  }

  protected hasSelectedConnection(selection: WritableSignal<TngFlowSelection>): boolean {
    return selection().connectionIds.size > 0;
  }

  protected deleteSelectedConnections(
    definition: WritableSignal<TngFlowDefinition<unknown>>,
    selection: WritableSignal<TngFlowSelection>,
    history: WritableSignal<TngFlowHistoryState<unknown>>,
  ): void {
    this.onConnectionsDeleteRequested(definition, selection, history, {
      connectionIds: [...selection().connectionIds],
      source: 'api',
    });
  }

  private applyControlledUpdate(
    definition: WritableSignal<TngFlowDefinition<unknown>>,
    selection: WritableSignal<TngFlowSelection>,
    history: WritableSignal<TngFlowHistoryState<unknown>>,
    update: FlowExecutionGraphControlledUpdate,
    label: string,
  ): void {
    definition.set(update.definition);
    selection.set(update.selection);
    history.update((current) =>
      commitTngFlowHistory(current, update.definition, {
        label,
        selection: update.selection,
      }),
    );
  }

  private commitDefinitionUpdate(
    definition: WritableSignal<TngFlowDefinition<unknown>>,
    selection: WritableSignal<TngFlowSelection>,
    history: WritableSignal<TngFlowHistoryState<unknown>>,
    label: string,
    update: TngFlowHistoryUpdate<unknown>,
  ): void {
    const nextDefinition = update(definition());
    definition.set(nextDefinition);
    history.update((current) =>
      commitTngFlowHistory(current, nextDefinition, {
        label,
        selection: selection(),
      }),
    );
  }

  private applyHistoryState(
    definition: WritableSignal<TngFlowDefinition<unknown>>,
    selection: WritableSignal<TngFlowSelection>,
    history: WritableSignal<TngFlowHistoryState<unknown>>,
    inspectedNodeId: WritableSignal<string | null>,
    selectedExecutionId: WritableSignal<string | null>,
    nextHistory: TngFlowHistoryState<unknown>,
  ): void {
    const nextSelection = nextHistory.present.selection ?? {
      connectionIds: new Set(),
      nodeIds: new Set(),
    };
    const selectedNodeId = nextSelection.nodeIds.values().next().value;

    history.set(nextHistory);
    definition.set(nextHistory.present.definition);
    selection.set(nextSelection);
    if (typeof selectedNodeId === 'string') {
      inspectedNodeId.set(selectedNodeId);
      selectedExecutionId.set(null);
      return;
    }
    if (
      inspectedNodeId() !== null &&
      !nextHistory.present.definition.nodes.some((node) => node.id === inspectedNodeId())
    ) {
      inspectedNodeId.set(null);
      selectedExecutionId.set(null);
    }
  }
}
