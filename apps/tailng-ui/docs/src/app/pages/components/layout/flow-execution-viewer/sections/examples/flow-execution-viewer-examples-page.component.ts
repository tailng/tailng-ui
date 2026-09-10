import { Component, computed, signal } from '@angular/core';
import { TngButtonComponent } from '@tailng-ui/components';
import type { TngFlowSelection, TngFlowViewport } from '@tailng-ui/flow';
import {
  TngFlowExecutionViewerComponent,
  type TngFlowExecutionActivatedEvent,
} from '@tailng-ui/flow/execution';
import {
  findFlowExecutionViewerScenario,
  FLOW_EXECUTION_VIEWER_DEFINITION,
  FLOW_EXECUTION_VIEWER_SCENARIOS,
  type FlowExecutionViewerScenarioId,
} from './flow-execution-viewer-example.data';

@Component({
  selector: 'app-flow-execution-viewer-examples-page',
  imports: [TngButtonComponent, TngFlowExecutionViewerComponent],
  templateUrl: './flow-execution-viewer-examples-page.component.html',
  styleUrl: './flow-execution-viewer-examples-page.component.css',
})
export class FlowExecutionViewerExamplesPageComponent {
  public readonly definition = FLOW_EXECUTION_VIEWER_DEFINITION;
  public readonly scenarios = FLOW_EXECUTION_VIEWER_SCENARIOS;
  public readonly selectedScenarioId = signal<FlowExecutionViewerScenarioId>(
    FLOW_EXECUTION_VIEWER_SCENARIOS[0]?.id ?? 'queued-workflow',
  );
  public readonly selectedScenario = computed(() =>
    findFlowExecutionViewerScenario(this.selectedScenarioId()),
  );
  public readonly selection = signal<TngFlowSelection>(this.selectedScenario().selection);
  public readonly inspectedNodeId = signal<string | null>(this.selectedScenario().inspectedNodeId);
  public readonly selectedExecutionId = signal<string | null>(
    this.selectedScenario().selectedExecutionId,
  );
  public readonly viewport = signal<TngFlowViewport | null>(this.selectedScenario().viewport);
  public readonly lastActivation = signal<string>('No activation yet.');

  public selectScenario(id: FlowExecutionViewerScenarioId): void {
    const nextScenario = findFlowExecutionViewerScenario(id);
    this.selectedScenarioId.set(id);
    this.selection.set(nextScenario.selection);
    this.inspectedNodeId.set(nextScenario.inspectedNodeId);
    this.selectedExecutionId.set(nextScenario.selectedExecutionId);
    this.viewport.set(nextScenario.viewport);
    this.lastActivation.set('No activation yet.');
  }

  public onSelectionChange(selection: TngFlowSelection): void {
    this.selection.set(selection);
  }

  public onExecutionActivated(event: TngFlowExecutionActivatedEvent<unknown>): void {
    const nodeName = event.node?.name ?? 'Run';
    const phase = event.execution?.phase ?? 'none';
    this.lastActivation.set(`${nodeName}: ${phase} via ${event.source}`);
  }
}
