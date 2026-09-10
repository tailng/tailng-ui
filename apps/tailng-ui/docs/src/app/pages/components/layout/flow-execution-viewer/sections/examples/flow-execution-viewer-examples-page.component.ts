import { DOCUMENT } from '@angular/common';
import { Component, inject, signal, type OnDestroy, type WritableSignal } from '@angular/core';
import { TngButtonComponent } from '@tailng-ui/components';
import type { TngFlowSelection, TngFlowViewport } from '@tailng-ui/flow';
import {
  TngFlowExecutionViewerComponent,
  type TngFlowExecutionActivatedEvent,
} from '@tailng-ui/flow/execution';
import {
  FLOW_EXECUTION_VIEWER_DEFINITION,
  FLOW_EXECUTION_VIEWER_SCENARIOS,
  type FlowExecutionViewerScenario,
} from './flow-execution-viewer-example.data';
import {
  plainFlowExecutionViewerCodeTabs,
  tailwindFlowExecutionViewerCodeTabs,
} from './flow-execution-viewer-example-code.data';
import type { DocsExampleCodeTab } from '../../../../../../shared/example-panel/docs-example-panel.component';
import {
  DocsExampleTabsSectionComponent,
  DocsExampleVariantDirective,
} from '../../../../../../shared/example-tabs-section/docs-example-tabs-section.component';
import {
  observeDocsCodeThemeChanges,
  resolveDocsCodeBlockTheme,
} from '../../../../../../shared/util';

type FlowExecutionViewerExampleState = Readonly<{
  inspectorOpen: WritableSignal<boolean>;
  inspectedNodeId: WritableSignal<string | null>;
  lastActivation: WritableSignal<string>;
  selectedExecutionId: WritableSignal<string | null>;
  selection: WritableSignal<TngFlowSelection>;
  showInspector: WritableSignal<boolean>;
  viewport: WritableSignal<TngFlowViewport>;
}>;

type FlowExecutionViewerExample = Readonly<{
  ariaLabel: string;
  plain: FlowExecutionViewerExampleState;
  plainCodeTabs: readonly DocsExampleCodeTab[];
  plainFlowId: string;
  scenario: FlowExecutionViewerScenario;
  tailwind: FlowExecutionViewerExampleState;
  tailwindCodeTabs: readonly DocsExampleCodeTab[];
  tailwindFlowId: string;
}>;

function createExampleState(
  scenario: FlowExecutionViewerScenario,
): FlowExecutionViewerExampleState {
  return Object.freeze({
    inspectorOpen: signal(true),
    inspectedNodeId: signal(scenario.inspectedNodeId),
    lastActivation: signal('No activation yet.'),
    selectedExecutionId: signal(scenario.selectedExecutionId),
    selection: signal(cloneSelection(scenario.selection)),
    showInspector: signal(true),
    viewport: signal({ ...scenario.viewport, position: { ...scenario.viewport.position } }),
  });
}

function createExample(scenario: FlowExecutionViewerScenario): FlowExecutionViewerExample {
  return Object.freeze({
    ariaLabel: `${scenario.title} execution viewer`,
    plain: createExampleState(scenario),
    plainCodeTabs: plainFlowExecutionViewerCodeTabs(scenario),
    plainFlowId: `${scenario.id}-plain-execution-viewer`,
    scenario,
    tailwind: createExampleState(scenario),
    tailwindCodeTabs: tailwindFlowExecutionViewerCodeTabs(scenario),
    tailwindFlowId: `${scenario.id}-tailwind-execution-viewer`,
  });
}

function cloneSelection(selection: TngFlowSelection): TngFlowSelection {
  return {
    connectionIds: new Set(selection.connectionIds),
    nodeIds: new Set(selection.nodeIds),
  };
}

@Component({
  selector: 'app-flow-execution-viewer-examples-page',
  imports: [
    DocsExampleTabsSectionComponent,
    DocsExampleVariantDirective,
    TngButtonComponent,
    TngFlowExecutionViewerComponent,
  ],
  templateUrl: './flow-execution-viewer-examples-page.component.html',
  styleUrl: './flow-execution-viewer-examples-page.component.css',
})
export class FlowExecutionViewerExamplesPageComponent implements OnDestroy {
  private readonly documentRef = inject(DOCUMENT);

  public readonly definition = FLOW_EXECUTION_VIEWER_DEFINITION;
  public readonly examples = FLOW_EXECUTION_VIEWER_SCENARIOS.map(createExample);
  public readonly codeBlockTheme = signal<'github-dark' | 'github-light'>(
    resolveDocsCodeBlockTheme(this.documentRef),
  );
  private readonly colorSchemeObserver = observeDocsCodeThemeChanges(
    this.documentRef,
    this.codeBlockTheme,
  );

  public ngOnDestroy(): void {
    this.colorSchemeObserver?.disconnect();
  }

  public resetExample(
    state: FlowExecutionViewerExampleState,
    scenario: FlowExecutionViewerScenario,
  ): void {
    state.inspectorOpen.set(true);
    state.selection.set(cloneSelection(scenario.selection));
    state.showInspector.set(true);
    state.inspectedNodeId.set(scenario.inspectedNodeId);
    state.selectedExecutionId.set(scenario.selectedExecutionId);
    state.viewport.set({ ...scenario.viewport, position: { ...scenario.viewport.position } });
    state.lastActivation.set('No activation yet.');
  }

  public toggleInspector(state: FlowExecutionViewerExampleState): void {
    state.inspectorOpen.update((open) => !open);
  }

  public setInspectorVisible(state: FlowExecutionViewerExampleState, visible: boolean): void {
    state.showInspector.set(visible);
    if (visible) {
      state.inspectorOpen.set(true);
    }
  }

  public selectedNodeName(state: FlowExecutionViewerExampleState): string {
    const inspectedNodeId = state.inspectedNodeId();
    return (
      this.definition.nodes.find((node) => node.id === inspectedNodeId)?.name ??
      inspectedNodeId ??
      'None'
    );
  }

  public progressLabel(scenario: FlowExecutionViewerScenario): string {
    const progress = scenario.snapshot.progress;
    if (progress === null || progress === undefined) {
      return 'Progress pending';
    }
    return `${Math.round(progress * 100)}% complete`;
  }

  public onExecutionActivated(
    state: FlowExecutionViewerExampleState,
    event: TngFlowExecutionActivatedEvent<unknown>,
  ): void {
    const nodeName = event.node?.name ?? 'Run';
    const phase = event.execution?.phase ?? 'none';
    state.lastActivation.set(`${nodeName}: ${phase} via ${event.source}`);
  }
}
