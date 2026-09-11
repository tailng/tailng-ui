import { TestBed } from '@angular/core/testing';
import { describe, expect, it } from 'vitest';
import {
  FlowExecutionGraphExamplesPageComponent,
  type FlowExecutionGraphExampleId,
} from './flow-execution-graph-examples-page.component';
import { findFlowExecutionViewerScenario } from '../../../flow-execution-viewer/sections/examples/flow-execution-viewer-example.data';

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

    const component = TestBed.createComponent(
      FlowExecutionGraphExamplesPageComponent,
    ).componentInstance;

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
    for (const section of nativeElement.querySelectorAll<HTMLElement>(
      'app-docs-example-tabs-section',
    )) {
      const labels: string[] = [];
      const buttons = section.getElementsByTagName('button') as HTMLCollectionOf<HTMLButtonElement>;
      for (const button of buttons) {
        if (button.dataset.slot === 'tab') {
          const textContent: unknown = button.textContent;
          labels.push(typeof textContent === 'string' ? textContent.trim() : '');
        }
      }

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

  it('omits progress for queued and completed node fixtures', () => {
    const queuedExecutions =
      findFlowExecutionViewerScenario('queued-workflow').snapshot.nodeExecutions ?? [];
    const completedExecutions =
      findFlowExecutionViewerScenario('successful-workflow').snapshot.nodeExecutions ?? [];

    expect(queuedExecutions).not.toHaveLength(0);
    expect(completedExecutions).not.toHaveLength(0);
    for (const execution of [...queuedExecutions, ...completedExecutions]) {
      expect(Object.prototype.hasOwnProperty.call(execution, 'progress')).toBe(false);
    }
  });

  it('renders queued nodes at 0% and completed nodes at 100%', async () => {
    await TestBed.configureTestingModule({
      imports: [FlowExecutionGraphExamplesPageComponent],
    }).compileComponents();

    const fixture = TestBed.createComponent(FlowExecutionGraphExamplesPageComponent);
    fixture.detectChanges();

    const nativeElement = fixture.nativeElement as HTMLElement;
    const queuedPreview = nativeElement.querySelector<HTMLElement>(
      '.flow-execution-graph-examples__preview[data-phase="pending"]',
    );
    const completedPreview = nativeElement.querySelector<HTMLElement>(
      '.flow-execution-graph-examples__preview[data-phase="succeeded"]',
    );

    expect(queuedPreview).not.toBeNull();
    expect(completedPreview).not.toBeNull();
    const queuedProgress = queuedPreview?.querySelector<HTMLElement>(
      'tng-flow-node[data-status="queued"] [data-slot="progress-bar"]',
    );
    const completedProgress = completedPreview?.querySelector<HTMLElement>(
      'tng-flow-node[data-status="completed"] [data-slot="progress-bar"]',
    );

    expect(queuedProgress?.getAttribute('data-state')).toBe('determinate');
    expect(queuedProgress?.getAttribute('aria-valuenow')).toBe('0');
    expect(completedProgress?.getAttribute('data-state')).toBe('determinate');
    expect(completedProgress?.getAttribute('aria-valuenow')).toBe('100');
  });

  it('uses edit mode so nodes can be repositioned', async () => {
    await TestBed.configureTestingModule({
      imports: [FlowExecutionGraphExamplesPageComponent],
    }).compileComponents();

    const fixture = TestBed.createComponent(FlowExecutionGraphExamplesPageComponent);
    fixture.detectChanges();

    const editors = (fixture.nativeElement as HTMLElement).querySelectorAll<HTMLElement>(
      '.tng-flow-editor',
    );
    expect(editors).toHaveLength(26);
    for (const editor of editors) {
      expect(editor.dataset.mode).toBe('edit');
      expect(editor.hasAttribute('data-readonly')).toBe(false);
    }
  });

  it('persists controlled node movement in the example definition', () => {
    const component = TestBed.createComponent(
      FlowExecutionGraphExamplesPageComponent,
    ).componentInstance;
    const state = component.examples[0]?.plain;
    const node = state?.definition().nodes[0];
    if (state === undefined || node === undefined) {
      throw new Error('Expected a graph example node.');
    }

    component.onNodesMoved(state, {
      nodes: [{ id: node.id, position: { x: 321, y: 123 } }],
    });

    expect(
      state.definition().nodes.find((candidate) => candidate.id === node.id)?.position,
    ).toEqual({ x: 321, y: 123 });
    expect(node.position).not.toEqual({ x: 321, y: 123 });
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
