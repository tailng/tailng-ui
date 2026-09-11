import { TestBed } from '@angular/core/testing';
import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  FlowExecutionGraphExamplesPageComponent,
  type FlowExecutionGraphExampleId,
} from './flow-execution-graph-examples-page.component';
import {
  FLOW_EXECUTION_VIEWER_DEFINITION,
  findFlowExecutionViewerScenario,
} from '../../../flow-execution-viewer/sections/examples/flow-execution-viewer-example.data';

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
  afterEach(() => {
    vi.useRealTimers();
  });

  it('defines one graph example for every visual example in the implementation plan', async () => {
    await TestBed.configureTestingModule({
      imports: [FlowExecutionGraphExamplesPageComponent],
    }).compileComponents();

    const expectedIds: readonly FlowExecutionGraphExampleId[] = [
      'queued-workflow',
      'running-node',
      'delayed-execution',
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
    expect(nativeElement.querySelectorAll('app-docs-example-tabs-section').length).toBe(14);
    expect(nativeElement.querySelectorAll('tng-flow-execution-graph').length).toBe(28);
    expect(nativeElement.querySelector('tng-flow-execution-viewer')).toBeNull();
    expect(nativeElement.querySelector('tng-flow-node-properties')).toBeNull();
    expect(nativeElement.querySelector('.flow-execution-graph-examples__details')).toBeNull();
    expect(nativeElement.querySelector('aside[aria-label="Selected execution"]')).toBeNull();
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
      expect(example.plainCodeTabs.find((tab) => tab.value === 'html')?.code).toContain(
        'attachmentLayout="custom-points"',
      );
      expect(example.plainCodeTabs.find((tab) => tab.value === 'html')?.code).toContain(
        '[fitOnInit]="true"',
      );
      expect(example.tailwindCodeTabs.find((tab) => tab.value === 'html')?.code).toContain(
        '[fitOnInit]="true"',
      );
      expect(example.plainCodeTabs.find((tab) => tab.value === 'ts')?.code).toContain(
        'onConnectionsDeleteRequested',
      );
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

  it('uses spacious multi-row fixture layouts for graph examples', async () => {
    await TestBed.configureTestingModule({
      imports: [FlowExecutionGraphExamplesPageComponent],
    }).compileComponents();

    const component = TestBed.createComponent(
      FlowExecutionGraphExamplesPageComponent,
    ).componentInstance;
    const sharedNodes = new Map(
      FLOW_EXECUTION_VIEWER_DEFINITION.nodes.map((node) => [node.id, node.position]),
    );
    const delayed = component.examples.find((example) => example.id === 'delayed-execution');
    const delayedNodes = new Map(
      delayed?.plain.definition().nodes.map((node) => [node.id, node.position]),
    );

    expect(
      (sharedNodes.get('normalize')?.x ?? 0) - (sharedNodes.get('intake')?.x ?? 0),
    ).toBeGreaterThanOrEqual(360);
    expect(
      (sharedNodes.get('human-review')?.x ?? 0) - (sharedNodes.get('risk')?.x ?? 0),
    ).toBeGreaterThanOrEqual(360);
    expect(
      (sharedNodes.get('profile')?.y ?? 0) - (sharedNodes.get('risk')?.y ?? 0),
    ).toBeGreaterThanOrEqual(420);
    expect(
      (delayedNodes.get('delay')?.x ?? 0) - (delayedNodes.get('start')?.x ?? 0),
    ).toBeGreaterThanOrEqual(340);
    expect(
      (delayedNodes.get('send')?.y ?? 0) - (delayedNodes.get('prepare')?.y ?? 0),
    ).toBeGreaterThanOrEqual(280);
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
    expect(editors).toHaveLength(28);
    for (const editor of editors) {
      expect(editor.dataset.mode).toBe('edit');
      expect(editor.dataset.attachmentLayout).toBe('custom-points');
      expect(editor.hasAttribute('data-readonly')).toBe(false);
    }
    expect(editors[0]?.querySelectorAll('[data-custom-point-visible]')).toHaveLength(12);
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

  it('persists custom-point connection creation and deletion in controlled state', () => {
    const component = TestBed.createComponent(
      FlowExecutionGraphExamplesPageComponent,
    ).componentInstance;
    const state = component.examples[0]?.plain;
    if (state === undefined) {
      throw new Error('Expected a graph example state.');
    }
    const originalConnectionCount = state.definition().connections.length;

    component.onConnectionCreateRequested(state, {
      source: { nodeId: 'intake', portId: 'custom-point-out-bottom-1' },
      target: { nodeId: 'risk', portId: 'custom-point-in-left-1' },
    });

    expect(state.definition().connections).toHaveLength(originalConnectionCount + 1);
    expect(state.selection().connectionIds).toEqual(new Set(['docs-connection-1']));
    expect(state.definition().nodes.find((node) => node.id === 'intake')?.ports).toContainEqual(
      expect.objectContaining({ id: 'custom-point-out-bottom-1' }),
    );

    component.deleteSelectedConnections(state);

    expect(state.definition().connections).toHaveLength(originalConnectionCount);
    expect(state.selection().connectionIds).toEqual(new Set());
    expect(state.definition().nodes.find((node) => node.id === 'intake')?.ports).not.toContainEqual(
      expect.objectContaining({ id: 'custom-point-out-bottom-1' }),
    );
  });

  it('marks dark mode and narrow embedding as concrete examples', async () => {
    await TestBed.configureTestingModule({
      imports: [FlowExecutionGraphExamplesPageComponent],
    }).compileComponents();

    const component = TestBed.createComponent(
      FlowExecutionGraphExamplesPageComponent,
    ).componentInstance;
    const darkExample = component.examples.find((example) => example.id === 'dark-mode');
    const narrowExample = component.examples.find((example) => example.id === 'narrow-surface');

    expect(darkExample?.forcedTheme).toBe('dark');
    expect(narrowExample?.narrow).toBe(true);
  });

  it('keeps copied graph examples free of selected-execution details panels', async () => {
    await TestBed.configureTestingModule({
      imports: [FlowExecutionGraphExamplesPageComponent],
    }).compileComponents();

    const component = TestBed.createComponent(
      FlowExecutionGraphExamplesPageComponent,
    ).componentInstance;

    for (const example of component.examples) {
      for (const tab of [...example.plainCodeTabs, ...example.tailwindCodeTabs]) {
        expect(tab.code).not.toContain('Selected execution');
        expect(tab.code).not.toContain('execution-graph-example__details');
        expect(tab.code).not.toContain('<aside');
      }
    }
  });

  it('advances the delayed execution example through animated connection steps', async () => {
    await TestBed.configureTestingModule({
      imports: [FlowExecutionGraphExamplesPageComponent],
    }).compileComponents();

    const fixture = TestBed.createComponent(FlowExecutionGraphExamplesPageComponent);
    const component = fixture.componentInstance;
    const delayed = component.examples.find((example) => example.id === 'delayed-execution');

    expect(delayed).toBeDefined();
    const state = delayed?.plain;
    if (state === undefined) {
      throw new Error('Missing delayed execution graph example.');
    }

    expect(state.snapshot().id).toBe('delayed-execution-step-0');
    expect(state.snapshot().connectionExecutions ?? []).toEqual([]);

    vi.useFakeTimers();
    component.togglePlayback(state);
    vi.advanceTimersByTime(1300);

    expect(state.snapshot().id).toBe('delayed-execution-step-1');
    expect(state.inspectedNodeId()).toBe('delay');
    expect(state.selection().nodeIds).toEqual(new Set(['delay']));
    expect(state.snapshot().connectionExecutions).toContainEqual(
      expect.objectContaining({ connectionId: 'start-delay', phase: 'active' }),
    );

    vi.advanceTimersByTime(1300 * 4);

    expect(state.snapshot().phase).toBe('succeeded');
    expect(state.inspectedNodeId()).toBe('end');
    expect(state.playing()).toBe(false);
    fixture.destroy();
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

    component.resetExample(state, targetExample.scenario);

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
