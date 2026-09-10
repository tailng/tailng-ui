import { TestBed } from '@angular/core/testing';
import {
  findFlowExecutionViewerScenario,
  FLOW_EXECUTION_VIEWER_SCENARIOS,
  type FlowExecutionViewerScenarioId,
} from './flow-execution-viewer-example.data';
import { FlowExecutionViewerExamplesPageComponent } from './flow-execution-viewer-examples-page.component';

describe(FlowExecutionViewerExamplesPageComponent.name, () => {
  it('defines one scenario for every visual example in the implementation plan', () => {
    const expectedIds: readonly FlowExecutionViewerScenarioId[] = [
      'queued-workflow',
      'running-node',
      'retrying-node',
      'waiting-human-input',
      'successful-workflow',
      'failed-node',
      'skipped-branch',
      'parallel-execution',
      'loop-activations',
      'redacted-payloads',
      'large-json-payload',
      'dark-mode',
      'narrow-surface',
    ];

    expect(FLOW_EXECUTION_VIEWER_SCENARIOS.map((scenario) => scenario.id)).toEqual(expectedIds);
  });

  it('renders the scenario gallery and controlled execution viewer', async () => {
    await TestBed.configureTestingModule({
      imports: [FlowExecutionViewerExamplesPageComponent],
    }).compileComponents();

    const fixture = TestBed.createComponent(FlowExecutionViewerExamplesPageComponent);
    fixture.detectChanges();

    const nativeElement = fixture.nativeElement as HTMLElement;
    expect(nativeElement.querySelectorAll('.flow-execution-examples__scenario-card').length).toBe(
      FLOW_EXECUTION_VIEWER_SCENARIOS.length,
    );
    expect(nativeElement.querySelector('tng-flow-execution-viewer')).not.toBeNull();
  });

  it('resets controlled selection, inspection, and viewport when switching scenarios', async () => {
    await TestBed.configureTestingModule({
      imports: [FlowExecutionViewerExamplesPageComponent],
    }).compileComponents();

    const fixture = TestBed.createComponent(FlowExecutionViewerExamplesPageComponent);
    const component = fixture.componentInstance;
    const targetScenario = findFlowExecutionViewerScenario('failed-node');

    component.onSelectionChange({ nodeIds: new Set(['archive']), connectionIds: new Set() });
    component.inspectedNodeId.set('archive');
    component.selectedExecutionId.set('different-execution');
    component.viewport.set({ position: { x: 100, y: 100 }, scale: 2 });

    component.selectScenario('failed-node');

    expect(component.selection()).toBe(targetScenario.selection);
    expect(component.inspectedNodeId()).toBe(targetScenario.inspectedNodeId);
    expect(component.selectedExecutionId()).toBe(targetScenario.selectedExecutionId);
    expect(component.viewport()).toEqual(targetScenario.viewport);
  });
});
