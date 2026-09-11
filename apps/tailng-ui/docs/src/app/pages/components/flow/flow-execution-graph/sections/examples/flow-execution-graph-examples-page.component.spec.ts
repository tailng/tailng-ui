import { TestBed } from '@angular/core/testing';
import { describe, expect, it } from 'vitest';
import { findFlowExecutionViewerScenario } from '../../../flow-execution-viewer/sections/examples/flow-execution-viewer-example.data';
import {
  FlowExecutionGraphExamplesPageComponent,
  type FlowExecutionGraphExampleId,
} from './flow-execution-graph-examples-page.component';

class FlowExecutionGraphTestResizeObserver implements ResizeObserver {
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

globalThis.ResizeObserver ??= FlowExecutionGraphTestResizeObserver;

describe(FlowExecutionGraphExamplesPageComponent.name, () => {
  it('defines one graph example for every visual example in the implementation plan', async () => {
    await TestBed.configureTestingModule({
      imports: [FlowExecutionGraphExamplesPageComponent],
    }).compileComponents();

    const expectedIds: readonly FlowExecutionGraphExampleId[] = [
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

    const component = TestBed.createComponent(FlowExecutionGraphExamplesPageComponent)
      .componentInstance;

    expect(component.examples.map((example) => example.id)).toEqual(expectedIds);
  });

  it('renders one tabbed graph-only section per example', async () => {
    await TestBed.configureTestingModule({
      imports: [FlowExecutionGraphExamplesPageComponent],
    }).compileComponents();

    const fixture = TestBed.createComponent(FlowExecutionGraphExamplesPageComponent);
    fixture.detectChanges();

    const nativeElement = fixture.nativeElement as HTMLElement;
    expect(nativeElement.querySelectorAll('app-docs-example-tabs-section').length).toBe(13);
    expect(nativeElement.querySelectorAll('tng-flow-execution-graph').length).toBe(26);
    expect(nativeElement.querySelector('tng-flow-execution-viewer')).toBeNull();
    expect(nativeElement.querySelector('tng-flow-node-properties')).toBeNull();
  });

  it('renders Plain CSS and Tailwind CSS variants for every graph example', async () => {
    await TestBed.configureTestingModule({
      imports: [FlowExecutionGraphExamplesPageComponent],
    }).compileComponents();

    const fixture = TestBed.createComponent(FlowExecutionGraphExamplesPageComponent);
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
      imports: [FlowExecutionGraphExamplesPageComponent],
    }).compileComponents();

    const fixture = TestBed.createComponent(FlowExecutionGraphExamplesPageComponent);
    const component = fixture.componentInstance;

    for (const example of component.examples) {
      expect(example.plainCodeTabs.map((tab) => tab.label)).toEqual(['HTML', 'TS', 'CSS']);
      expect(example.tailwindCodeTabs.map((tab) => tab.label)).toEqual(['HTML', 'TS', 'CSS']);
    }
  });

  it('marks dark mode and narrow embedding as concrete rendered examples', async () => {
    await TestBed.configureTestingModule({
      imports: [FlowExecutionGraphExamplesPageComponent],
    }).compileComponents();

    const fixture = TestBed.createComponent(FlowExecutionGraphExamplesPageComponent);
    fixture.detectChanges();

    const nativeElement = fixture.nativeElement as HTMLElement;
    const darkPreview = nativeElement.querySelector<HTMLElement>(
      '.flow-execution-graph-examples__preview[data-theme="dark"]',
    );
    const narrowPreview = nativeElement.querySelector<HTMLElement>(
      '.flow-execution-graph-examples__preview[data-narrow]',
    );

    expect(darkPreview).not.toBeNull();
    expect(darkPreview?.classList.contains('dark')).toBe(true);
    expect(narrowPreview).not.toBeNull();
  });

  it('summarizes payload availability without rendering large or redacted payload values', async () => {
    await TestBed.configureTestingModule({
      imports: [FlowExecutionGraphExamplesPageComponent],
    }).compileComponents();

    const fixture = TestBed.createComponent(FlowExecutionGraphExamplesPageComponent);
    fixture.detectChanges();

    const text = (fixture.nativeElement as HTMLElement).textContent ?? '';
    expect(text).toContain('Output payload available');
    expect(text).toContain('Input payload redacted');
    expect(text).not.toContain('contactHistory');
    expect(text).not.toContain('PII and customer message body hidden by retention policy.');
  });

  it('resets controlled selection, inspection, viewport, and activation feedback', async () => {
    await TestBed.configureTestingModule({
      imports: [FlowExecutionGraphExamplesPageComponent],
    }).compileComponents();

    const fixture = TestBed.createComponent(FlowExecutionGraphExamplesPageComponent);
    const component = fixture.componentInstance;
    const targetScenario = findFlowExecutionViewerScenario('failed-node');
    const targetExample = component.examples.find((example) => example.id === 'failed-node');

    expect(targetExample).toBeDefined();

    const state = targetExample?.plain;
    if (state === undefined) {
      throw new Error('Missing failed-node graph example.');
    }

    state.selection.set({ nodeIds: new Set(['archive']), connectionIds: new Set() });
    state.inspectedNodeId.set('archive');
    state.selectedExecutionId.set('different-execution');
    state.viewport.set({ position: { x: 100, y: 100 }, scale: 2 });
    state.lastActivation.set('Archive audit: succeeded via graph');
    state.definition.update((definition) => ({
      ...definition,
      nodes: definition.nodes.map((node) =>
        node.id === 'archive' ? { ...node, name: 'Changed archive name' } : node,
      ),
    }));

    component.resetExample(state, targetScenario);

    expect(state.definition().nodes.find((node) => node.id === 'archive')?.name).toBe(
      'Archive audit',
    );
    expect(state.selection()).toEqual(targetScenario.selection);
    expect(state.selection()).not.toBe(targetScenario.selection);
    expect(state.inspectedNodeId()).toBe(targetScenario.inspectedNodeId);
    expect(state.selectedExecutionId()).toBe(targetScenario.selectedExecutionId);
    expect(state.viewport()).toEqual(targetScenario.viewport);
    expect(state.lastActivation()).toBe('No graph activation yet.');
  });
});
