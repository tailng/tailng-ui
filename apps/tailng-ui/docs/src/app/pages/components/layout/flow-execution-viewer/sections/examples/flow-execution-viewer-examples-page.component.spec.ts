import { TestBed } from '@angular/core/testing';
import { describe, expect, it } from 'vitest';
import {
  findFlowExecutionViewerScenario,
  FLOW_EXECUTION_VIEWER_SCENARIOS,
  type FlowExecutionViewerScenarioId,
} from './flow-execution-viewer-example.data';
import { FlowExecutionViewerExamplesPageComponent } from './flow-execution-viewer-examples-page.component';

class FlowExecutionViewerTestResizeObserver implements ResizeObserver {
  public constructor(private readonly callback: ResizeObserverCallback) {}

  public disconnect(): void {
    // ResizeObserver cleanup is intentionally a no-op in jsdom.
  }

  public observe(target: Element): void {
    this.callback(
      [{ target, contentRect: target.getBoundingClientRect() } as ResizeObserverEntry],
      this,
    );
  }

  public unobserve(): void {
    // Individual targets do not need tracking in this test double.
  }
}

globalThis.ResizeObserver ??= FlowExecutionViewerTestResizeObserver;

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
      'narrow-surface',
    ];

    expect(FLOW_EXECUTION_VIEWER_SCENARIOS.map((scenario) => scenario.id)).toEqual(expectedIds);
  });

  it('renders one tabbed section per execution viewer example', async () => {
    await TestBed.configureTestingModule({
      imports: [FlowExecutionViewerExamplesPageComponent],
    }).compileComponents();

    const fixture = TestBed.createComponent(FlowExecutionViewerExamplesPageComponent);
    fixture.detectChanges();

    const nativeElement = fixture.nativeElement as HTMLElement;
    expect(nativeElement.querySelectorAll('app-docs-example-tabs-section').length).toBe(
      FLOW_EXECUTION_VIEWER_SCENARIOS.length,
    );
    expect(nativeElement.querySelector('.flow-execution-examples__scenario-card')).toBeNull();
    expect(nativeElement.querySelectorAll('tng-flow-execution-viewer').length).toBe(
      FLOW_EXECUTION_VIEWER_SCENARIOS.length * 2,
    );
  });

  it('renders Plain CSS and Tailwind CSS variants for every example section', async () => {
    await TestBed.configureTestingModule({
      imports: [FlowExecutionViewerExamplesPageComponent],
    }).compileComponents();

    const fixture = TestBed.createComponent(FlowExecutionViewerExamplesPageComponent);
    fixture.detectChanges();

    const nativeElement = fixture.nativeElement as HTMLElement;
    for (const section of nativeElement.querySelectorAll('app-docs-example-tabs-section')) {
      const labels = Array.from(
        section.querySelectorAll<HTMLElement>('[data-slot="tab-list"] > [data-slot="tab"]'),
      ).map((tab) => tab.textContent?.trim());

      expect(labels).toEqual(['Plain CSS', 'Tailwind CSS']);
    }
  });

  it('provides HTML, TS, and CSS source tabs for every style variant', async () => {
    await TestBed.configureTestingModule({
      imports: [FlowExecutionViewerExamplesPageComponent],
    }).compileComponents();

    const fixture = TestBed.createComponent(FlowExecutionViewerExamplesPageComponent);
    const component = fixture.componentInstance;

    for (const example of component.examples) {
      expect(example.plainCodeTabs.map((tab) => tab.label)).toEqual(['HTML', 'TS', 'CSS']);
      expect(example.tailwindCodeTabs.map((tab) => tab.label)).toEqual(['HTML', 'TS', 'CSS']);
    }
  });

  it('defaults every example to a visible expanded right inspector', async () => {
    await TestBed.configureTestingModule({
      imports: [FlowExecutionViewerExamplesPageComponent],
    }).compileComponents();

    const fixture = TestBed.createComponent(FlowExecutionViewerExamplesPageComponent);
    const component = fixture.componentInstance;

    for (const example of component.examples) {
      expect(example.plain.inspectorOpen()).toBe(true);
      expect(example.plain.showInspector()).toBe(true);
      expect(example.tailwind.inspectorOpen()).toBe(true);
      expect(example.tailwind.showInspector()).toBe(true);
    }
  });

  it('collapses and hides the right inspector per example variant', async () => {
    await TestBed.configureTestingModule({
      imports: [FlowExecutionViewerExamplesPageComponent],
    }).compileComponents();

    const fixture = TestBed.createComponent(FlowExecutionViewerExamplesPageComponent);
    const component = fixture.componentInstance;
    const state = component.examples[0]?.plain;

    expect(state).toBeDefined();
    if (state === undefined) {
      throw new Error('Missing first example.');
    }

    component.toggleInspector(state);
    expect(state.inspectorOpen()).toBe(false);

    component.setInspectorVisible(state, false);
    expect(state.showInspector()).toBe(false);
    expect(state.inspectorOpen()).toBe(false);

    component.setInspectorVisible(state, true);
    expect(state.showInspector()).toBe(true);
    expect(state.inspectorOpen()).toBe(true);
  });

  it('resets controlled selection, inspection, viewport, and inspector controls per example variant', async () => {
    await TestBed.configureTestingModule({
      imports: [FlowExecutionViewerExamplesPageComponent],
    }).compileComponents();

    const fixture = TestBed.createComponent(FlowExecutionViewerExamplesPageComponent);
    const component = fixture.componentInstance;
    const targetScenario = findFlowExecutionViewerScenario('failed-node');
    const targetExample = component.examples.find(
      (example) => example.scenario.id === targetScenario.id,
    );

    expect(targetExample).toBeDefined();

    const state = targetExample?.plain;
    if (state === undefined) {
      throw new Error('Missing failed-node example.');
    }

    state.selection.set({ nodeIds: new Set(['archive']), connectionIds: new Set() });
    state.inspectedNodeId.set('archive');
    state.selectedExecutionId.set('different-execution');
    state.viewport.set({ position: { x: 100, y: 100 }, scale: 2 });
    state.inspectorOpen.set(false);
    state.showInspector.set(false);
    state.lastActivation.set('Archive audit: succeeded via graph');

    component.resetExample(state, targetScenario);

    expect(state.selection()).toEqual(targetScenario.selection);
    expect(state.selection()).not.toBe(targetScenario.selection);
    expect(state.inspectedNodeId()).toBe(targetScenario.inspectedNodeId);
    expect(state.selectedExecutionId()).toBe(targetScenario.selectedExecutionId);
    expect(state.viewport()).toEqual(targetScenario.viewport);
    expect(state.inspectorOpen()).toBe(true);
    expect(state.showInspector()).toBe(true);
    expect(state.lastActivation()).toBe('No activation yet.');
  });
});
