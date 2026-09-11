import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import {
  FCanvasComponent,
  FCirclePatternComponent,
  FComponentsStore,
  FCreateConnectionEvent,
  FDeleteSelectedEvent,
  FFlowComponent,
  FMinimapComponent,
  FMoveNodesEvent,
  FSelectionChangeEvent,
  FZoomDirective,
} from '@foblex/flow';
import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it, vi } from 'vitest';
import { TngFlowEditorComponent } from './tng-flow-editor.component';
import { TngFlowFoblexBridgeDirective } from './tng-flow-foblex-bridge.directive';
import { TngFlowConnectionTemplateDirective } from '../connection-template/tng-flow-connection-template.directive';
import { createTngFlowConnectorId } from '../model/tng-flow-connector-id';
import { TngFlowNodeTemplateDirective } from '../node-template/tng-flow-node-template.directive';
import { createTngFlowPaletteItemEnvelope } from '../palette-item/tng-flow-palette-item.directive';
import type { TngFlowNodesArrangementRequest } from '../types/tng-flow-arrangement.types';
import type { TngFlowEditorCommandRequest } from '../types/tng-flow-command.types';
import type { TngFlowConnectionWaypointsChange } from '../types/tng-flow-connection.types';
import type { TngFlowContextMenuRequest } from '../types/tng-flow-context-menu.types';
import type { TngFlowValidationIssueActivatedEvent } from '../types/tng-flow-events.types';
import type { TngFlowLayoutEngine } from '../types/tng-flow-layout.types';
import type { TngFlowPresentation } from '../types/tng-flow-presentation.types';
import type { TngFlowValidation } from '../types/tng-flow-validation.types';
import type {
  TngFlowDefinition,
  TngFlowConnection,
  TngFlowConnectionCreateRequest,
  TngFlowConnectionRejectedEvent,
  TngFlowNode,
  TngFlowNodeCreateRequest,
  TngFlowNodePositionChange,
  TngFlowNodesMovedEvent,
  TngFlowPaletteItem,
} from '../types/tng-flow.types';

const specDirectory = dirname(fileURLToPath(import.meta.url));
const editorStyles = readFileSync(resolve(specDirectory, 'tng-flow-editor.component.css'), 'utf8');

const nodes: readonly TngFlowNode<{ summary: string }>[] = [
  {
    id: 'custom',
    type: 'tool',
    name: 'Custom tool',
    position: { x: 40, y: 80 },
    data: { summary: 'Custom template content' },
    outputs: [{ id: 'custom-output', label: 'Result' }],
  },
  {
    id: 'default',
    type: 'model',
    name: 'Default model',
    position: { x: 360, y: 80 },
    data: { summary: 'Default template content' },
    inputs: [{ id: 'default-input', label: 'Prompt' }],
  },
];

const definition: TngFlowDefinition<{ summary: string }> = {
  id: 'milestone-one',
  name: 'Milestone one workflow',
  nodes: [
    nodes[0],
    nodes[1],
    {
      id: 'locked',
      type: 'response',
      name: 'Locked response',
      position: { x: 680, y: 80 },
      data: { summary: 'Cannot be dragged' },
      inputs: [{ id: 'locked-input', name: 'Answer', kind: 'control', required: true }],
      locked: true,
    },
  ],
  connections: [
    {
      id: 'custom-to-default',
      source: { nodeId: 'custom', portId: 'custom-output' },
      target: { nodeId: 'default', portId: 'default-input' },
    },
    {
      id: 'custom-to-locked',
      source: { nodeId: 'custom', portId: 'custom-output' },
      target: { nodeId: 'locked', portId: 'locked-input' },
      reassignable: false,
    },
  ],
};

@Component({
  imports: [TngFlowEditorComponent, TngFlowNodeTemplateDirective],
  template: `
    <tng-flow-editor
      [nodes]="nodes()"
      [connections]="[]"
      [selection]="selection()"
      [presentation]="presentation()"
      [validation]="validation()"
      [fitOnInit]="false"
    >
      <ng-template tngFlowNode="tool" let-node let-view="view" let-issues="issues">
        <article
          data-testid="custom-node"
          [attr.data-validation]="view.validationSeverity"
          [attr.data-issue-count]="issues.length"
        >
          {{ node.data.summary }} / {{ view.selected ? 'selected' : 'idle' }}
        </article>
      </ng-template>
    </tng-flow-editor>
  `,
})
class FlowEditorHost {
  public readonly nodes = signal(nodes);
  public readonly selection = signal({
    nodeIds: new Set<string>(),
    connectionIds: new Set<string>(),
  });
  public readonly presentation = signal<TngFlowPresentation>({});
  public readonly validation = signal<TngFlowValidation>({ issues: [] });
}

@Component({
  imports: [TngFlowEditorComponent, TngFlowNodeTemplateDirective],
  template: `
    <tng-flow-editor [definition]="definition" [fitOnInit]="false">
      <ng-template tngFlowNode="tool" let-node>
        <article data-testid="definition-custom-node">{{ node.data.summary }}</article>
      </ng-template>
    </tng-flow-editor>
  `,
})
class FlowDefinitionHost {
  protected readonly definition = definition;
}

const labelledConnections: readonly TngFlowConnection[] = [
  {
    id: 'custom-to-default',
    source: { nodeId: 'custom', portId: 'custom-output' },
    target: { nodeId: 'default', portId: 'default-input' },
    label: 'A deliberately long approval route label for truncation',
    description: 'Continue only after the custom tool has approved the prompt.',
    type: 'bezier',
  },
];

@Component({
  imports: [TngFlowConnectionTemplateDirective, TngFlowEditorComponent],
  template: `
    <tng-flow-editor
      [nodes]="nodes"
      [connections]="connections"
      [selection]="selection()"
      [presentation]="presentation()"
      [validation]="validation()"
      [mode]="mode()"
      [fitOnInit]="false"
    >
      <ng-template
        tngFlowConnection
        let-connection
        let-view="view"
        let-issues="issues"
        let-mode="mode"
        let-selected="selected"
      >
        <span
          data-testid="custom-connection-label"
          [attr.data-connection-id]="connection.id"
          [attr.data-status]="view.status"
          [attr.data-validation]="view.validationSeverity"
          [attr.data-issue-count]="issues.length"
          [attr.data-mode]="mode"
          [attr.data-selected]="selected ? '' : null"
        >
          {{ connection.label }}
        </span>
        <button type="button" data-testid="custom-connection-action">Inspect</button>
      </ng-template>
    </tng-flow-editor>
  `,
})
class FlowConnectionTemplateHost {
  protected readonly nodes = nodes;
  protected readonly connections = labelledConnections;
  public readonly mode = signal<'edit' | 'inspect'>('edit');
  public readonly selection = signal({
    nodeIds: new Set<string>(),
    connectionIds: new Set<string>(),
  });
  public readonly presentation = signal<TngFlowPresentation>({});
  public readonly validation = signal<TngFlowValidation>({ issues: [] });
}

type EditorEventHarness = Readonly<{
  onMoveNodes: (event: FMoveNodesEvent) => void;
  onCreateConnection: (event: FCreateConnectionEvent) => void;
  onCreateNode: (event: {
    data: unknown;
    externalItemRect: { x: number; y: number; width: number; height: number };
  }) => void;
  onSelectionChange: (event: FSelectionChangeEvent) => void;
  onDeleteSelected: (event: FDeleteSelectedEvent) => void;
  onConnectionWaypointsChanged: (event: {
    connectionId: string;
    waypoints: readonly { x: number; y: number }[];
  }) => void;
  onViewportChange: (event: { position: { x: number; y: number }; scale: number }) => void;
  onReassignConnection: (event: {
    connectionId: string;
    endpoint: 'source' | 'target';
    previousSourceId: string;
    nextSourceId: string | undefined;
    previousTargetId: string;
    nextTargetId: string | undefined;
    dropPosition: { x: number; y: number };
  }) => void;
  onReady: () => void;
  portPositionPercent: (index: number, count: number) => number;
  onMoveNodes: (event: {
    nodes: readonly Readonly<{ id: string; position: { x: number; y: number } }>[];
  }) => void;
}>;

class ControllableResizeObserver implements ResizeObserver {
  public static instances: ControllableResizeObserver[] = [];
  public disconnected = false;
  private readonly targets = new Set<Element>();

  public constructor(private readonly callback: ResizeObserverCallback) {
    ControllableResizeObserver.instances.push(this);
  }

  public static reset(): void {
    ControllableResizeObserver.instances = [];
  }

  public static forTarget(target: Element): ControllableResizeObserver {
    const observer = ControllableResizeObserver.instances.find((candidate) =>
      candidate.targets.has(target),
    );
    if (observer === undefined) {
      throw new Error('Expected a ResizeObserver for the requested target.');
    }
    return observer;
  }

  public disconnect(): void {
    this.disconnected = true;
    this.targets.clear();
  }

  public observe(target: Element): void {
    this.targets.add(target);
  }

  public unobserve(target: Element): void {
    this.targets.delete(target);
  }

  public emit(target: Element, width: number, height: number): void {
    this.callback(
      [
        {
          target,
          contentRect: new DOMRect(0, 0, width, height),
        } as ResizeObserverEntry,
      ],
      this,
    );
  }
}

describe('TngFlowEditorComponent', () => {
  it('renders the background at the configured grid spacing and hides it independently of snap', () => {
    const fixture = TestBed.createComponent(TngFlowEditorComponent);
    fixture.componentRef.setInput('fitOnInit', false);
    fixture.componentRef.setInput('gridSize', 24);
    fixture.componentRef.setInput('snapToGrid', true);
    fixture.detectChanges();

    const findCirclePattern = (): FCirclePatternComponent | undefined =>
      fixture.debugElement.query(
        (debugElement) => debugElement.componentInstance instanceof FCirclePatternComponent,
      )?.componentInstance as FCirclePatternComponent | undefined;

    expect(findCirclePattern()?.radius()).toBe(24);

    fixture.componentRef.setInput('gridSize', 0);
    fixture.detectChanges();

    expect(findCirclePattern()?.radius()).toBe(16);

    fixture.componentRef.setInput('showBackground', false);
    fixture.detectChanges();

    expect(findCirclePattern()).toBeUndefined();
    expect(fixture.componentInstance.snapToGrid()).toBe(true);
  });

  it('keeps adaptive visual grid density fixed across controlled and runtime zoom changes', () => {
    const fixture = TestBed.createComponent(TngFlowEditorComponent);
    fixture.componentRef.setInput('fitOnInit', false);
    fixture.componentRef.setInput('gridSize', 24);
    fixture.componentRef.setInput('snapToGrid', true);
    fixture.componentRef.setInput('backgroundGridMode', 'adaptive');
    fixture.componentRef.setInput('viewport', {
      position: { x: 0, y: 0 },
      scale: 0.35,
    });
    fixture.detectChanges();

    const findCirclePattern = (): FCirclePatternComponent | undefined =>
      fixture.debugElement.query(
        (debugElement) => debugElement.componentInstance instanceof FCirclePatternComponent,
      )?.componentInstance as FCirclePatternComponent | undefined;

    expect(findCirclePattern()?.radius()).toBeCloseTo(24 / 0.35);

    fixture.componentRef.setInput('viewport', {
      position: { x: 0, y: 0 },
      scale: 0.18,
    });
    fixture.detectChanges();

    expect(findCirclePattern()?.radius()).toBeCloseTo(24 / 0.18);

    fixture.componentRef.setInput('viewport', {
      position: { x: 0, y: 0 },
      scale: 1,
    });
    fixture.detectChanges();

    expect(findCirclePattern()?.radius()).toBe(24);

    fixture.componentRef.setInput('viewport', null);
    fixture.detectChanges();
    (
      fixture.componentInstance as unknown as Pick<EditorEventHarness, 'onViewportChange'>
    ).onViewportChange({
      position: { x: 0, y: 0 },
      scale: 0.35,
    });
    fixture.detectChanges();

    expect(findCirclePattern()?.radius()).toBeCloseTo(24 / 0.35);
    expect(fixture.componentInstance.gridSize()).toBe(24);
    expect(fixture.componentInstance.snapToGrid()).toBe(true);
  });

  it('refreshes connection geometry without changing or emitting the viewport', () => {
    const fixture = TestBed.createComponent(TngFlowEditorComponent);
    fixture.componentRef.setInput('definition', definition);
    fixture.componentRef.setInput('viewport', {
      position: { x: 32, y: -18 },
      scale: 1.25,
    });
    fixture.componentRef.setInput('fitOnInit', false);
    fixture.detectChanges();
    const flow = fixture.debugElement.query(
      (debugElement) => debugElement.componentInstance instanceof FFlowComponent,
    ).componentInstance as FFlowComponent;
    const redraw = vi.spyOn(flow, 'redraw');
    const fitToScreen = vi.spyOn(fixture.componentInstance, 'fitToScreen');
    const resetViewport = vi.spyOn(fixture.componentInstance, 'resetViewport');
    const viewportChanged = vi.fn();
    fixture.componentInstance.viewportChange.subscribe(viewportChanged);

    fixture.componentInstance.refreshLayout();

    expect(redraw).toHaveBeenCalledOnce();
    expect(fitToScreen).not.toHaveBeenCalled();
    expect(resetViewport).not.toHaveBeenCalled();
    expect(viewportChanged).not.toHaveBeenCalled();
  });

  it('fits the viewport after controlled definition changes when requested', async () => {
    const fixture = TestBed.createComponent(TngFlowEditorComponent);
    fixture.componentRef.setInput('definition', definition);
    fixture.componentRef.setInput('fitOnInit', false);
    fixture.componentRef.setInput('fitOnDefinitionChange', true);
    fixture.detectChanges();

    const fitToScreen = vi.spyOn(fixture.componentInstance, 'fitToScreen');
    fixture.componentRef.setInput('definition', {
      ...definition,
      nodes: [
        ...definition.nodes,
        {
          id: 'summary',
          type: 'step',
          name: 'Summary',
          position: { x: 720, y: 120 },
        },
      ],
    });
    fixture.detectChanges();
    await Promise.resolve();

    expect(fitToScreen).toHaveBeenCalledOnce();
  });

  it('does not fit the viewport after controlled definition changes by default', async () => {
    const fixture = TestBed.createComponent(TngFlowEditorComponent);
    fixture.componentRef.setInput('definition', definition);
    fixture.componentRef.setInput('fitOnInit', false);
    fixture.detectChanges();

    const fitToScreen = vi.spyOn(fixture.componentInstance, 'fitToScreen');
    fixture.componentRef.setInput('definition', {
      ...definition,
      nodes: [
        ...definition.nodes,
        {
          id: 'summary',
          type: 'step',
          name: 'Summary',
          position: { x: 720, y: 120 },
        },
      ],
    });
    fixture.detectChanges();
    await Promise.resolve();

    expect(fitToScreen).not.toHaveBeenCalled();
  });

  it('ignores the initial flow size, coalesces resize bursts, and cleans up on destroy', () => {
    const originalResizeObserver = globalThis.ResizeObserver;
    vi.useFakeTimers();
    ControllableResizeObserver.reset();
    globalThis.ResizeObserver = ControllableResizeObserver;

    try {
      const fixture = TestBed.createComponent(TngFlowEditorComponent);
      fixture.componentRef.setInput('definition', definition);
      fixture.componentRef.setInput('fitOnInit', false);
      fixture.detectChanges();
      const flow = fixture.debugElement.query(
        (debugElement) => debugElement.componentInstance instanceof FFlowComponent,
      ).componentInstance as FFlowComponent;
      const flowHost = flow.hostElement as HTMLElement;
      const observer = ControllableResizeObserver.forTarget(flowHost);
      const redraw = vi.spyOn(flow, 'redraw');

      observer.emit(flowHost, 1000, 576);
      vi.advanceTimersByTime(64);
      expect(redraw).not.toHaveBeenCalled();

      observer.emit(flowHost, 920, 576);
      observer.emit(flowHost, 800, 520);
      observer.emit(flowHost, 700, 480);
      vi.advanceTimersByTime(63);
      expect(redraw).not.toHaveBeenCalled();
      vi.advanceTimersByTime(1);
      expect(redraw).toHaveBeenCalledOnce();

      observer.emit(flowHost, 1000, 576);
      fixture.destroy();
      vi.advanceTimersByTime(64);
      expect(observer.disconnected).toBe(true);
      expect(redraw).toHaveBeenCalledOnce();
    } finally {
      globalThis.ResizeObserver = originalResizeObserver;
      ControllableResizeObserver.reset();
      vi.useRealTimers();
    }
  });

  it('emits application-owned command requests and enforces the mode matrix', () => {
    const fixture = TestBed.createComponent(TngFlowEditorComponent);
    expect('readonly' in fixture.componentInstance).toBe(false);
    fixture.componentRef.setInput('definition', definition);
    fixture.componentRef.setInput('selection', {
      nodeIds: new Set(['custom']),
      connectionIds: new Set<string>(),
    });
    fixture.componentRef.setInput('fitOnInit', false);
    fixture.detectChanges();
    const requested = vi.fn<(request: TngFlowEditorCommandRequest) => void>();
    fixture.componentInstance.commandRequested.subscribe(requested);

    expect(
      fixture.componentInstance.requestCommand('duplicate', 'context-menu', { x: 320, y: 180 }),
    ).toBe(true);
    expect(requested).toHaveBeenLastCalledWith({
      command: 'duplicate',
      selection: {
        nodeIds: new Set(['custom']),
        connectionIds: new Set(),
      },
      source: 'context-menu',
      canvasPosition: { x: 320, y: 180 },
    });

    fixture.componentRef.setInput('mode', 'inspect');
    fixture.detectChanges();
    expect(fixture.componentInstance.requestCommand('copy')).toBe(true);
    expect(fixture.componentInstance.requestCommand('cut')).toBe(false);

    fixture.componentRef.setInput('mode', 'readonly');
    fixture.detectChanges();
    expect(fixture.componentInstance.requestCommand('copy')).toBe(false);
    expect(requested).toHaveBeenCalledTimes(2);
  });

  it('keeps shortcuts opt-in and honors an explicit command allow-list', () => {
    const fixture = TestBed.createComponent(TngFlowEditorComponent);
    fixture.componentRef.setInput('definition', definition);
    fixture.componentRef.setInput('fitOnInit', false);
    fixture.detectChanges();
    const requested = vi.fn<(request: TngFlowEditorCommandRequest) => void>();
    fixture.componentInstance.commandRequested.subscribe(requested);
    const flow = (fixture.nativeElement as HTMLElement).querySelector<HTMLElement>('f-flow');
    if (flow === null) {
      throw new Error('Expected the flow host to render.');
    }

    const disabledCopy = new KeyboardEvent('keydown', {
      bubbles: true,
      cancelable: true,
      ctrlKey: true,
      key: 'c',
    });
    flow.dispatchEvent(disabledCopy);
    expect(disabledCopy.defaultPrevented).toBe(false);
    expect(requested).not.toHaveBeenCalled();

    fixture.componentRef.setInput('commandShortcuts', ['copy']);
    fixture.detectChanges();
    const enabledCopy = new KeyboardEvent('keydown', {
      bubbles: true,
      cancelable: true,
      metaKey: true,
      key: 'c',
    });
    flow.dispatchEvent(enabledCopy);
    const excludedPaste = new KeyboardEvent('keydown', {
      bubbles: true,
      cancelable: true,
      metaKey: true,
      key: 'v',
    });
    flow.dispatchEvent(excludedPaste);

    expect(enabledCopy.defaultPrevented).toBe(true);
    expect(excludedPaste.defaultPrevented).toBe(false);
    expect(requested).toHaveBeenCalledOnce();
    expect(requested).toHaveBeenCalledWith(
      expect.objectContaining({ command: 'copy', source: 'keyboard' }),
    );
  });

  it.each([
    ['undo', 'z', { ctrlKey: true }],
    ['redo', 'z', { metaKey: true, shiftKey: true }],
    ['redo', 'y', { ctrlKey: true }],
    ['cut', 'x', { metaKey: true }],
    ['copy', 'c', { ctrlKey: true }],
    ['paste', 'v', { metaKey: true }],
    ['duplicate', 'd', { ctrlKey: true }],
  ] as const)('maps the %s command shortcut', (command, key, modifiers) => {
    const fixture = TestBed.createComponent(TngFlowEditorComponent);
    fixture.componentRef.setInput('definition', definition);
    fixture.componentRef.setInput('commandShortcuts', true);
    fixture.componentRef.setInput('fitOnInit', false);
    fixture.detectChanges();
    const requested = vi.fn<(request: TngFlowEditorCommandRequest) => void>();
    fixture.componentInstance.commandRequested.subscribe(requested);
    const flow = (fixture.nativeElement as HTMLElement).querySelector<HTMLElement>('f-flow');
    const event = new KeyboardEvent('keydown', {
      bubbles: true,
      cancelable: true,
      key,
      ...modifiers,
    });
    flow?.dispatchEvent(event);

    expect(event.defaultPrevented).toBe(true);
    expect(requested).toHaveBeenCalledWith(expect.objectContaining({ command }));
  });

  it('emits selection before a pointer context request for an unselected graph target', () => {
    const fixture = TestBed.createComponent(TngFlowEditorComponent);
    fixture.componentRef.setInput('definition', definition);
    fixture.componentRef.setInput('selection', {
      nodeIds: new Set(['custom']),
      connectionIds: new Set<string>(),
    });
    fixture.componentRef.setInput('contextMenuEnabled', true);
    fixture.componentRef.setInput('fitOnInit', false);
    fixture.detectChanges();
    const order: string[] = [];
    let request: TngFlowContextMenuRequest | undefined;
    fixture.componentInstance.selectionChange.subscribe(() => order.push('selection'));
    fixture.componentInstance.contextMenuRequested.subscribe((event) => {
      order.push('context');
      request = event;
    });
    const target = (fixture.nativeElement as HTMLElement).querySelector<HTMLElement>(
      '[data-node-id="default"]',
    );
    const event = new MouseEvent('contextmenu', {
      bubbles: true,
      cancelable: true,
      clientX: 640,
      clientY: 360,
    });
    target?.dispatchEvent(event);

    expect(event.defaultPrevented).toBe(true);
    expect(order).toEqual(['selection', 'context']);
    expect(request?.target).toEqual({ kind: 'node', nodeId: 'default' });
    expect(request?.source).toBe('pointer');
    expect(request?.clientPosition).toEqual({ x: 640, y: 360 });
    expect(typeof request?.canvasPosition.x).toBe('number');
    expect(typeof request?.canvasPosition.y).toBe('number');
    expect(request?.selection).toEqual({
      nodeIds: new Set(['default']),
      connectionIds: new Set(),
    });
  });

  it('preserves controlled selection for selected, port, and canvas context requests', () => {
    const fixture = TestBed.createComponent(TngFlowEditorComponent);
    const selection = {
      nodeIds: new Set(['custom', 'default']),
      connectionIds: new Set<string>(),
    };
    fixture.componentRef.setInput('definition', definition);
    fixture.componentRef.setInput('selection', selection);
    fixture.componentRef.setInput('contextMenuEnabled', true);
    fixture.componentRef.setInput('fitOnInit', false);
    fixture.detectChanges();
    const selected = vi.fn();
    const requested = vi.fn<(request: TngFlowContextMenuRequest) => void>();
    fixture.componentInstance.selectionChange.subscribe(selected);
    fixture.componentInstance.contextMenuRequested.subscribe(requested);
    const host = fixture.nativeElement as HTMLElement;
    const selectedNode = host.querySelector<HTMLElement>('[data-node-id="custom"]');
    const port = host.querySelector<HTMLElement>(
      '[data-node-id="custom"] [data-port-id="custom-output"]',
    );
    const canvas = host.querySelector<HTMLElement>('f-canvas');

    for (const target of [selectedNode, port, canvas]) {
      target?.dispatchEvent(
        new MouseEvent('contextmenu', {
          bubbles: true,
          cancelable: true,
          clientX: 100,
          clientY: 80,
        }),
      );
    }

    expect(selected).not.toHaveBeenCalled();
    expect(requested).toHaveBeenCalledTimes(3);
    expect(requested.mock.calls.map(([event]) => event.target)).toEqual([
      { kind: 'node', nodeId: 'custom' },
      { kind: 'port', nodeId: 'custom', portId: 'custom-output' },
      { kind: 'canvas' },
    ]);
    for (const [event] of requested.mock.calls) {
      expect(event.selection).toEqual(selection);
      expect(event.selection).not.toBe(selection);
    }
  });

  it('proposes a selectable connection as the controlled context-menu selection', () => {
    const fixture = TestBed.createComponent(TngFlowEditorComponent);
    fixture.componentRef.setInput('definition', definition);
    fixture.componentRef.setInput('contextMenuEnabled', true);
    fixture.componentRef.setInput('fitOnInit', false);
    fixture.detectChanges();
    const requested = vi.fn<(request: TngFlowContextMenuRequest) => void>();
    fixture.componentInstance.contextMenuRequested.subscribe(requested);
    const connection = (fixture.nativeElement as HTMLElement).querySelector<HTMLElement>(
      '[data-connection-id="custom-to-default"]',
    );
    connection?.dispatchEvent(
      new MouseEvent('contextmenu', {
        bubbles: true,
        cancelable: true,
        clientX: 200,
        clientY: 120,
      }),
    );

    expect(requested).toHaveBeenCalledOnce();
    expect(requested.mock.calls[0][0].target).toEqual({
      kind: 'connection',
      connectionId: 'custom-to-default',
    });
    expect(requested.mock.calls[0][0].selection).toEqual({
      nodeIds: new Set(),
      connectionIds: new Set(['custom-to-default']),
    });
  });

  it('does not intercept context menus unless enabled or while readonly', () => {
    const fixture = TestBed.createComponent(TngFlowEditorComponent);
    fixture.componentRef.setInput('definition', definition);
    fixture.componentRef.setInput('fitOnInit', false);
    fixture.detectChanges();
    const requested = vi.fn();
    fixture.componentInstance.contextMenuRequested.subscribe(requested);
    const node = (fixture.nativeElement as HTMLElement).querySelector<HTMLElement>(
      '[data-node-id="custom"]',
    );
    const disabledEvent = new MouseEvent('contextmenu', {
      bubbles: true,
      cancelable: true,
    });
    node?.dispatchEvent(disabledEvent);

    fixture.componentRef.setInput('contextMenuEnabled', true);
    fixture.componentRef.setInput('mode', 'readonly');
    fixture.detectChanges();
    const readonlyEvent = new MouseEvent('contextmenu', {
      bubbles: true,
      cancelable: true,
    });
    node?.dispatchEvent(readonlyEvent);

    expect(disabledEvent.defaultPrevented).toBe(false);
    expect(readonlyEvent.defaultPrevented).toBe(false);
    expect(requested).not.toHaveBeenCalled();
  });

  it.each(['inspect', 'readonly'] as const)(
    'rejects automatic layout requests in %s mode',
    async (mode) => {
      const calculate = vi.fn<TngFlowLayoutEngine['calculate']>(() => Promise.resolve([]));
      const fixture = TestBed.createComponent(TngFlowEditorComponent);
      fixture.componentRef.setInput('definition', definition);
      fixture.componentRef.setInput('layoutEngine', { calculate });
      fixture.componentRef.setInput('mode', mode);
      fixture.componentRef.setInput('fitOnInit', false);
      fixture.detectChanges();
      const harness = fixture.componentInstance as unknown as EditorEventHarness;
      harness.onReady();

      await expect(fixture.componentInstance.requestAutoLayout()).resolves.toBe(false);
      expect(calculate).not.toHaveBeenCalled();
    },
  );

  it.each(['inspect', 'readonly'] as const)(
    'rejects node arrangement requests in %s mode',
    (mode) => {
      const fixture = TestBed.createComponent(TngFlowEditorComponent);
      fixture.componentRef.setInput('definition', definition);
      fixture.componentRef.setInput('selection', {
        nodeIds: new Set(['custom', 'default']),
        connectionIds: new Set<string>(),
      });
      fixture.componentRef.setInput('mode', mode);
      fixture.componentRef.setInput('fitOnInit', false);
      fixture.detectChanges();
      const harness = fixture.componentInstance as unknown as EditorEventHarness;
      harness.onReady();
      const requested = vi.fn<(request: TngFlowNodesArrangementRequest) => void>();
      fixture.componentInstance.nodesArrangementRequested.subscribe(requested);

      expect(fixture.componentInstance.requestNodeAlignment('left')).toBe(false);
      expect(fixture.componentInstance.requestNodeDistribution('horizontal')).toBe(false);
      expect(requested).not.toHaveBeenCalled();
    },
  );

  it('keeps smart guides opt-in and converts screen thresholds to canvas coordinates', async () => {
    const fixture = TestBed.createComponent(TngFlowEditorComponent);
    fixture.componentRef.setInput('definition', definition);
    fixture.componentRef.setInput('viewport', { position: { x: 0, y: 0 }, scale: 2 });
    fixture.componentRef.setInput('smartGuides', {
      enabled: true,
      alignmentThreshold: 20,
      spacingThreshold: 30,
      disableModifier: 'alt',
    });
    fixture.componentRef.setInput('fitOnInit', false);
    fixture.detectChanges();
    await fixture.whenStable();

    const lines = fixture.debugElement.query(By.css('f-magnetic-lines'));
    const rects = fixture.debugElement.query(By.css('f-magnetic-rects'));
    expect(lines.componentInstance.threshold()).toBe(10);
    expect(rects.componentInstance.alignThreshold()).toBe(10);
    expect(rects.componentInstance.spacingThreshold()).toBe(15);

    fixture.componentRef.setInput('mode', 'inspect');
    fixture.detectChanges();

    expect(fixture.debugElement.query(By.css('f-magnetic-lines'))).toBeNull();
    expect(fixture.debugElement.query(By.css('f-magnetic-rects'))).toBeNull();
  });

  it('renders and emits controlled intents without mutating a deeply frozen definition', () => {
    const frozenDefinition = structuredClone(definition);
    const freezeRecursively = (value: unknown): void => {
      if (typeof value !== 'object' || value === null || Object.isFrozen(value)) {
        return;
      }
      for (const nested of Object.values(value)) {
        freezeRecursively(nested);
      }
      Object.freeze(value);
    };
    freezeRecursively(frozenDefinition);
    const before = JSON.stringify(frozenDefinition);

    const fixture = TestBed.createComponent(TngFlowEditorComponent<{ summary: string }>);
    fixture.componentRef.setInput('definition', frozenDefinition);
    fixture.componentRef.setInput('fitOnInit', false);
    fixture.detectChanges();

    const moved = vi.fn<(event: TngFlowNodesMovedEvent) => void>();
    fixture.componentInstance.nodesMoved.subscribe(moved);
    const harness = fixture.componentInstance as unknown as EditorEventHarness;
    harness.onMoveNodes(new FMoveNodesEvent([{ id: 'custom', position: { x: 160, y: 192 } }]));

    expect(moved).toHaveBeenCalledWith({
      nodes: [{ id: 'custom', position: { x: 160, y: 192 } }],
    });
    expect(JSON.stringify(frozenDefinition)).toBe(before);
    expect(frozenDefinition.nodes[0].position).toEqual({ x: 40, y: 80 });
    expect(Object.isFrozen(frozenDefinition)).toBe(true);
    expect(Object.isFrozen(frozenDefinition.nodes)).toBe(true);
    expect(Object.isFrozen(frozenDefinition.connections[0].source)).toBe(true);
  });

  it('renders default nodes, consumer templates, and editor-owned ports', () => {
    const fixture = TestBed.createComponent(FlowEditorHost);
    fixture.detectChanges();

    const host = fixture.nativeElement as HTMLElement;

    expect(host.querySelector('[data-testid="custom-node"]')?.textContent).toContain(
      'Custom template content',
    );
    expect(host.textContent).toContain('Default model');
    expect(host.querySelectorAll('[fconnector]')).toHaveLength(2);
    expect(host.querySelector('[data-node-id="custom"]')).not.toBeNull();
  });

  it('uses the editor selection ring as a custom-node fallback', () => {
    const fixture = TestBed.createComponent(FlowEditorHost);
    fixture.componentInstance.selection.set({
      nodeIds: new Set(['custom', 'default']),
      connectionIds: new Set(),
    });
    fixture.detectChanges();

    const host = fixture.nativeElement as HTMLElement;
    const customNode = host.querySelector<HTMLElement>('[data-testid="custom-node"]');
    const customContent = customNode?.closest<HTMLElement>('.tng-flow-editor__node-content');
    const defaultNode = host.querySelector<HTMLElement>('[data-node-id="default"] tng-flow-node');
    const defaultContent = defaultNode?.closest<HTMLElement>('.tng-flow-editor__node-content');
    expect(customNode?.textContent).toContain('selected');
    expect(customContent?.hasAttribute('data-custom-node')).toBe(true);
    expect(defaultContent?.hasAttribute('data-custom-node')).toBe(false);
    expect(editorStyles).toMatch(
      /\.tng-flow-editor__node--selected \.tng-flow-editor__node-content\[data-custom-node\]\s*\{/,
    );
    expect(editorStyles).toMatch(/--_node-selection-ring-width:\s*calc\(2 \* var\(--_ring\)\);/);
    expect(editorStyles).toMatch(
      /box-shadow:\s*inset 0 0 0 var\(--_node-validation-ring-width\) var\(--_node-validation-ring-color\),\s*0 0 0 var\(--_node-selection-ring-width\) var\(--_node-selection-ring-color\);/s,
    );
    expect(editorStyles).toMatch(
      /\.tng-flow-editor__node-content > tng-flow-node\s*\{[^}]*--tng-flow-node-selection-shadow:\s*0 0 0 calc\(2 \* var\(--_ring\)\) var\(--_select\);/s,
    );
    expect(defaultNode?.hasAttribute('data-selected')).toBe(true);
  });

  it('provides resolved presentation and indexed issues to custom node templates', () => {
    const fixture = TestBed.createComponent(FlowEditorHost);
    fixture.componentInstance.presentation.set({
      nodes: { custom: { status: 'running', highlighted: true } },
    });
    fixture.componentInstance.validation.set({
      issues: [
        {
          id: 'custom-warning',
          code: 'review',
          severity: 'warning',
          message: 'Review the custom node.',
          target: { kind: 'node', nodeId: 'custom' },
        },
      ],
    });
    fixture.detectChanges();

    const customNode = (fixture.nativeElement as HTMLElement).querySelector(
      '[data-testid="custom-node"]',
    );
    expect(customNode?.getAttribute('data-validation')).toBe('warning');
    expect(customNode?.getAttribute('data-issue-count')).toBe('1');
  });

  it('keeps runtime status separate from node and port validation', () => {
    const fixture = TestBed.createComponent(TngFlowEditorComponent);
    fixture.componentRef.setInput('nodes', nodes);
    fixture.componentRef.setInput('presentation', {
      nodes: { default: { status: 'running', progress: 40 } },
    });
    fixture.componentRef.setInput('validation', {
      issues: [
        {
          id: 'node-warning',
          code: 'review',
          severity: 'warning',
          message: 'Review the node.',
          target: { kind: 'node', nodeId: 'default' },
        },
        {
          id: 'port-error',
          code: 'required-input',
          severity: 'error',
          message: 'Connect this input.',
          target: { kind: 'port', nodeId: 'default', portId: 'default-input' },
        },
      ],
    });
    fixture.componentRef.setInput('fitOnInit', false);
    fixture.detectChanges();

    const host = fixture.nativeElement as HTMLElement;
    const visibleNode = host.querySelector('[data-node-id="default"] tng-flow-node');
    const port = host.querySelector('[data-node-id="default"] tng-flow-port');
    const portFrame = host.querySelector('[data-port-id="default-input"]');
    expect(visibleNode?.getAttribute('data-status')).toBe('running');
    expect(visibleNode?.getAttribute('data-validation')).toBe('warning');
    expect(visibleNode?.hasAttribute('aria-invalid')).toBe(false);
    expect(port?.getAttribute('data-validation')).toBe('error');
    expect(port?.getAttribute('aria-invalid')).toBe('true');
    expect(portFrame?.getAttribute('data-direction')).toBe('input');
  });

  it('renders a complete definition with exact connections and locked nodes', () => {
    const fixture = TestBed.createComponent(FlowDefinitionHost);
    fixture.detectChanges();

    const host = fixture.nativeElement as HTMLElement;
    expect(host.querySelectorAll('[data-node-id]')).toHaveLength(3);
    expect(host.querySelectorAll('f-connection')).toHaveLength(2);
    expect(host.querySelectorAll('tng-flow-port')).toHaveLength(3);
    expect(host.querySelector('[data-testid="definition-custom-node"]')?.textContent).toContain(
      'Custom template content',
    );
    expect(host.querySelector('[data-node-id="locked"] .tng-flow-editor__drag-handle')).toBeNull();
    expect(host.querySelector('#custom-to-default')?.classList).not.toContain(
      'f-connection-reassign-disabled',
    );
    expect(host.querySelector('#custom-to-locked')?.classList).toContain(
      'f-connection-reassign-disabled',
    );
  });

  it('renders an accessible default connection label without changing the owned path', () => {
    const fixture = TestBed.createComponent(TngFlowEditorComponent);
    fixture.componentRef.setInput('nodes', nodes);
    fixture.componentRef.setInput('connections', labelledConnections);
    fixture.componentRef.setInput('fitOnInit', false);
    fixture.detectChanges();

    const host = fixture.nativeElement as HTMLElement;
    const connection = host.querySelector<HTMLElement>('[data-connection-id="custom-to-default"]');
    const label = connection?.querySelector<HTMLElement>('.tng-flow-editor__connection-label');
    const content = connection?.querySelector<HTMLElement>('[data-connection-content]');

    expect(connection?.getAttribute('aria-label')).toBe(labelledConnections[0].label);
    expect(connection?.getAttribute('aria-description')).toBe(labelledConnections[0].description);
    expect(label?.textContent?.trim()).toBe(labelledConnections[0].label);
    expect(label?.getAttribute('title')).toBe(labelledConnections[0].label);
    expect(content?.classList.contains('f-connection-content')).toBe(true);
    expect(connection?.querySelectorAll('.f-connection-path')).toHaveLength(1);
    expect(connection?.querySelector('[data-testid="custom-connection-label"]')).toBeNull();
  });

  it('keeps unlabeled connections backward compatible and gives them endpoint names', () => {
    const fixture = TestBed.createComponent(TngFlowEditorComponent);
    fixture.componentRef.setInput('nodes', nodes);
    fixture.componentRef.setInput('connections', [
      {
        id: 'custom-to-default',
        source: { nodeId: 'custom', portId: 'custom-output' },
        target: { nodeId: 'default', portId: 'default-input' },
      },
    ]);
    fixture.componentRef.setInput('fitOnInit', false);
    fixture.detectChanges();

    const host = fixture.nativeElement as HTMLElement;
    const connection = host.querySelector<HTMLElement>('[data-connection-id="custom-to-default"]');

    expect(connection?.querySelector('[data-connection-content]')).toBeNull();
    expect(connection?.getAttribute('aria-label')).toBe(
      'Connection from Custom tool output port Result to Default model input port Prompt',
    );
    expect(connection?.querySelectorAll('.f-connection-path')).toHaveLength(1);
  });

  it('provides runtime, validation, mode, and controlled selection to connection templates', () => {
    const fixture = TestBed.createComponent(FlowConnectionTemplateHost);
    fixture.componentInstance.selection.set({
      nodeIds: new Set(),
      connectionIds: new Set(['custom-to-default']),
    });
    fixture.componentInstance.presentation.set({
      connections: {
        'custom-to-default': { status: 'active', highlighted: true },
      },
    });
    fixture.componentInstance.validation.set({
      issues: [
        {
          id: 'route-warning',
          code: 'review-route',
          severity: 'warning',
          message: 'Review the approval route.',
          target: { kind: 'connection', connectionId: 'custom-to-default' },
        },
      ],
    });
    fixture.componentInstance.mode.set('inspect');
    fixture.detectChanges();

    const host = fixture.nativeElement as HTMLElement;
    const connection = host.querySelector<HTMLElement>('[data-connection-id="custom-to-default"]');
    const customLabel = connection?.querySelector<HTMLElement>(
      '[data-testid="custom-connection-label"]',
    );
    const content = connection?.querySelector<HTMLElement>('[data-connection-content]');

    expect(customLabel?.textContent?.trim()).toBe(labelledConnections[0].label);
    expect(customLabel?.getAttribute('data-status')).toBe('active');
    expect(customLabel?.getAttribute('data-validation')).toBe('warning');
    expect(customLabel?.getAttribute('data-issue-count')).toBe('1');
    expect(customLabel?.getAttribute('data-mode')).toBe('inspect');
    expect(customLabel?.hasAttribute('data-selected')).toBe(true);
    expect(content?.querySelectorAll('.f-connection-path')).toHaveLength(0);
    expect(connection?.querySelectorAll('.f-connection-path')).toHaveLength(1);
    expect(content?.querySelector('tng-flow-validation-badge')).not.toBeNull();
    expect(content?.querySelector('[data-testid="custom-connection-action"]')).not.toBeNull();
  });

  it('projects connection motion and validation onto TailNG data attributes', () => {
    const fixture = TestBed.createComponent(TngFlowEditorComponent);
    fixture.componentRef.setInput('definition', definition);
    fixture.componentRef.setInput('presentation', {
      connections: {
        'custom-to-default': {
          status: 'active',
          motion: 'flow',
          motionSpeed: 'fast',
          motionDirection: 'reverse',
          highlighted: true,
        },
        'custom-to-locked': {
          status: 'active',
          motion: 'flow',
          motionSpeed: 'slow',
        },
      },
    });
    fixture.componentRef.setInput('validation', {
      issues: [
        {
          id: 'connection-warning',
          code: 'review-path',
          severity: 'warning',
          message: 'Review this connection.',
          target: { kind: 'connection', connectionId: 'custom-to-default' },
        },
      ],
    });
    fixture.componentRef.setInput('fitOnInit', false);
    fixture.detectChanges();

    const connection = (fixture.nativeElement as HTMLElement).querySelector(
      '[data-connection-id="custom-to-default"]',
    );
    expect(connection?.getAttribute('data-status')).toBe('active');
    expect(connection?.getAttribute('data-validation')).toBe('warning');
    expect(connection?.getAttribute('data-motion')).toBe('flow');
    expect(connection?.getAttribute('data-motion-speed')).toBe('fast');
    expect(connection?.getAttribute('data-motion-direction')).toBe('reverse');
    expect(connection?.hasAttribute('data-animated')).toBe(true);
    expect(connection?.hasAttribute('data-highlighted')).toBe(true);
    expect(
      (fixture.nativeElement as HTMLElement).querySelectorAll('[data-motion="flow"]'),
    ).toHaveLength(2);

    fixture.componentRef.setInput('presentation', {
      connections: { 'custom-to-default': { motion: 'none' } },
    });
    fixture.detectChanges();

    expect(connection?.getAttribute('data-motion')).toBe('none');
    expect(connection?.getAttribute('data-motion-speed')).toBe('normal');
    expect(connection?.getAttribute('data-motion-direction')).toBe('forward');
    expect(connection?.hasAttribute('data-animated')).toBe(false);
  });

  it('resolves TailNG routing, markers, and label placement without exposing renderer names', () => {
    const fixture = TestBed.createComponent(TngFlowEditorComponent);
    fixture.componentRef.setInput('nodes', nodes);
    fixture.componentRef.setInput('connections', [
      {
        ...labelledConnections[0],
        routing: { type: 'orthogonal-rounded', offset: 28, radius: 14 },
        sourceMarker: 'circle',
        targetMarker: 'diamond',
        labelOptions: { placement: 'end', offset: 7, offsetX: 4, offsetY: -2 },
      },
    ]);
    fixture.componentRef.setInput('fitOnInit', false);
    fixture.detectChanges();

    const host = fixture.nativeElement as HTMLElement;
    const connection = host.querySelector<HTMLElement>('[data-connection-id="custom-to-default"]');
    const connectionDebugElement = fixture.debugElement.query(
      By.css('[data-connection-id="custom-to-default"]'),
    );
    const renderer = connectionDebugElement.componentInstance as {
      fOffset: number;
      fRadius: number;
      fType: string;
    };

    expect(connection?.getAttribute('data-path-type')).toBe('orthogonal-rounded');
    expect(connection?.getAttribute('data-f-connection-type')).toBe('segment');
    expect(renderer).toMatchObject({ fOffset: 28, fRadius: 14, fType: 'segment' });
    expect(connection?.querySelector('f-connection-marker-circle')).not.toBeNull();
    expect(
      connection?.querySelector(
        'f-connection-marker-circle.tng-flow-editor__connection-marker-diamond',
      ),
    ).not.toBeNull();
    expect(
      connection?.querySelector('[data-connection-content]')?.getAttribute('data-label-placement'),
    ).toBe('end');
    expect(
      (connection?.querySelector('[data-connection-content]') as HTMLElement | null)?.style
        .translate,
    ).toBe('4px -2px');
  });

  it('renders history placeholders and five always-available connection creation styles', () => {
    const fixture = TestBed.createComponent(TngFlowEditorComponent);
    fixture.componentRef.setInput('nodes', nodes);
    fixture.componentRef.setInput('connections', labelledConnections);
    fixture.detectChanges();

    const host = fixture.nativeElement as HTMLElement;
    const toolbar = host.querySelector('.tng-flow-editor__authoring-tools');
    const controls = host.querySelectorAll('[data-connection-path-control]');
    const bezierButton = host.querySelector<HTMLButtonElement>(
      '[data-connection-path-control="bezier"] button',
    );
    const straightButton = host.querySelector<HTMLButtonElement>(
      '[data-connection-path-control="straight"] button',
    );

    expect(toolbar?.getAttribute('role')).toBe('toolbar');
    expect(toolbar?.getAttribute('aria-label')).toBe('Flow editing tools');
    expect(controls).toHaveLength(5);
    expect(
      host.querySelector<HTMLButtonElement>('[data-editor-command="undo"] button')?.disabled,
    ).toBe(true);
    expect(
      host.querySelector<HTMLButtonElement>('[data-editor-command="redo"] button')?.disabled,
    ).toBe(true);
    expect(bezierButton?.getAttribute('aria-pressed')).toBe('true');
    expect(straightButton?.getAttribute('aria-pressed')).toBe('false');
    expect(
      [...host.querySelectorAll<HTMLButtonElement>('[data-connection-path-control] button')].every(
        (button) => !button.disabled,
      ),
    ).toBe(true);

    straightButton?.click();
    fixture.detectChanges();

    expect(fixture.componentInstance.connectionCreationPathType()).toBe('straight');
    expect(straightButton?.getAttribute('aria-pressed')).toBe('true');
    expect(bezierButton?.getAttribute('aria-pressed')).toBe('false');

    fixture.componentRef.setInput('showConnectionTools', false);
    fixture.detectChanges();

    expect(host.querySelector('.tng-flow-editor__authoring-tools')).toBeNull();

    fixture.componentRef.setInput('showConnectionTools', true);
    fixture.componentRef.setInput('mode', 'inspect');
    fixture.detectChanges();

    expect(fixture.componentInstance.selectConnectionCreationPathType('bezier')).toBe(false);
    expect(
      (fixture.nativeElement as HTMLElement).querySelector('.tng-flow-editor__authoring-tools'),
    ).toBeNull();
  });

  it('derives the initial creation style from the configured connection default', () => {
    const fixture = TestBed.createComponent(TngFlowEditorComponent);
    fixture.componentRef.setInput('nodes', nodes);
    fixture.componentRef.setInput('connections', labelledConnections);
    fixture.componentRef.setInput('connectionOptions', {
      defaultConnection: { routing: { type: 'orthogonal', offset: 20 } },
    });
    fixture.detectChanges();

    const host = fixture.nativeElement as HTMLElement;
    const orthogonalButton = host.querySelector<HTMLButtonElement>(
      '[data-connection-path-control="orthogonal"] button',
    );
    const createConnection = fixture.debugElement.query(By.css('f-connection-for-create'))
      .componentInstance as { fOffset: number; fRadius: number; fType: string };

    expect(orthogonalButton?.getAttribute('aria-pressed')).toBe('true');
    expect(createConnection).toMatchObject({ fOffset: 20, fRadius: 0, fType: 'segment' });
  });

  it('supports pulse presentation, motion preference, runtime descriptions, and aria factories', () => {
    const fixture = TestBed.createComponent(TngFlowEditorComponent);
    fixture.componentRef.setInput('nodes', nodes);
    fixture.componentRef.setInput('connections', labelledConnections);
    fixture.componentRef.setInput('options', { motionPreference: 'disabled' });
    fixture.componentRef.setInput(
      'connectionAriaLabel',
      (_connection: TngFlowConnection, context: { source: string; target: string }) =>
        `Route ${context.source} toward ${context.target}`,
    );
    fixture.componentRef.setInput('presentation', {
      connections: {
        'custom-to-default': {
          status: 'warning',
          motion: 'pulse',
          message: 'Waiting for approval',
        },
      },
    });
    fixture.componentRef.setInput('fitOnInit', false);
    fixture.detectChanges();

    const host = fixture.nativeElement as HTMLElement;
    const editor = host.querySelector<HTMLElement>('.tng-flow-editor');
    const connection = host.querySelector<HTMLElement>('[data-connection-id="custom-to-default"]');

    expect(editor?.getAttribute('data-motion-preference')).toBe('disabled');
    expect(connection?.getAttribute('data-motion')).toBe('pulse');
    expect(connection?.getAttribute('aria-label')).toContain(
      'Route Custom tool output port Result',
    );
    expect(connection?.getAttribute('aria-description')).toContain('Status: warning.');
    expect(connection?.getAttribute('aria-description')).toContain('Waiting for approval');
  });

  it('emits one immutable committed waypoint change only while waypoint editing is enabled', () => {
    const fixture = TestBed.createComponent(TngFlowEditorComponent);
    const originalWaypoints = Object.freeze([Object.freeze({ x: 160, y: 80 })]);
    fixture.componentRef.setInput('nodes', nodes);
    fixture.componentRef.setInput('connections', [
      {
        ...labelledConnections[0],
        routing: { type: 'orthogonal-rounded', waypoints: originalWaypoints },
      },
    ]);
    fixture.componentRef.setInput('selection', {
      nodeIds: new Set<string>(),
      connectionIds: new Set(['custom-to-default']),
    });
    fixture.componentRef.setInput('options', { connectionWaypointsEnabled: true });
    fixture.componentRef.setInput('fitOnInit', false);
    fixture.detectChanges();

    const waypointChanges = vi.fn<(event: TngFlowConnectionWaypointsChange) => void>();
    fixture.componentInstance.connectionWaypointsChange.subscribe(waypointChanges);
    const editor = fixture.componentInstance as unknown as EditorEventHarness;
    editor.onConnectionWaypointsChanged({
      connectionId: 'custom-to-default',
      waypoints: [
        { x: 220, y: 100 },
        { x: 300, y: 140 },
      ],
    });

    expect(waypointChanges).toHaveBeenCalledOnce();
    expect(waypointChanges).toHaveBeenCalledWith({
      connectionId: 'custom-to-default',
      previousWaypoints: [{ x: 160, y: 80 }],
      waypoints: [
        { x: 220, y: 100 },
        { x: 300, y: 140 },
      ],
    });
    expect(originalWaypoints).toEqual([{ x: 160, y: 80 }]);

    fixture.componentRef.setInput('mode', 'inspect');
    fixture.detectChanges();
    editor.onConnectionWaypointsChanged({
      connectionId: 'custom-to-default',
      waypoints: [{ x: 400, y: 200 }],
    });
    expect(waypointChanges).toHaveBeenCalledOnce();
  });

  it('distributes ports evenly across each node side', () => {
    const fixture = TestBed.createComponent(TngFlowEditorComponent);
    fixture.componentRef.setInput('fitOnInit', false);
    fixture.detectChanges();

    const editor = fixture.componentInstance as unknown as EditorEventHarness;

    expect(editor.portPositionPercent(0, 1)).toBe(50);
    expect(editor.portPositionPercent(0, 2)).toBeCloseTo(100 / 3);
    expect(editor.portPositionPercent(1, 2)).toBeCloseTo(200 / 3);
    expect([
      editor.portPositionPercent(0, 3),
      editor.portPositionPercent(1, 3),
      editor.portPositionPercent(2, 3),
    ]).toEqual([25, 50, 75]);
  });

  it('places ports on explicitly selected top and bottom borders', () => {
    const fixture = TestBed.createComponent(TngFlowEditorComponent);
    fixture.componentRef.setInput('nodes', [
      {
        id: 'vertical',
        type: 'step',
        name: 'Vertical step',
        position: { x: 40, y: 80 },
        ports: [
          { id: 'first-in', direction: 'input', kind: 'data', side: 'top' },
          { id: 'second-in', direction: 'input', kind: 'data', side: 'top' },
          { id: 'out', direction: 'output', kind: 'data', side: 'bottom' },
        ],
      },
    ]);
    fixture.componentRef.setInput('fitOnInit', false);
    fixture.detectChanges();

    const host = fixture.nativeElement as HTMLElement;
    const topPorts = host.querySelectorAll<HTMLElement>(
      '[data-node-id="vertical"] > [data-side="top"]',
    );
    const bottomPort = host.querySelector<HTMLElement>(
      '[data-node-id="vertical"] > [data-side="bottom"]',
    );

    expect(topPorts).toHaveLength(2);
    expect(Number.parseFloat(topPorts[0].style.left)).toBeCloseTo(100 / 3);
    expect(Number.parseFloat(topPorts[1].style.left)).toBeCloseTo(200 / 3);
    expect(topPorts[0].style.top).toBe('-0.375rem');
    expect(Number.parseFloat(bottomPort?.style.left ?? '')).toBe(50);
    expect(bottomPort?.style.top).toBe('');
    expect(bottomPort?.style.bottom).toBe('-0.375rem');
    expect(bottomPort?.querySelector('tng-flow-port')?.getAttribute('data-side')).toBe('bottom');
  });

  it('uses the same minimum height for port positioning and the visible default node', () => {
    const fixture = TestBed.createComponent(TngFlowEditorComponent);
    fixture.componentRef.setInput('nodes', [
      {
        id: 'merge',
        type: 'merge',
        name: 'Merge decision',
        position: { x: 40, y: 80 },
        inputs: [
          { id: 'assessment', direction: 'input', label: 'Assessment' },
          { id: 'review', direction: 'input', label: 'Review' },
        ],
        outputs: [{ id: 'decision', direction: 'output', label: 'Decision' }],
      },
    ]);
    fixture.componentRef.setInput('fitOnInit', false);
    fixture.detectChanges();

    const host = fixture.nativeElement as HTMLElement;
    const node = host.querySelector<HTMLElement>('[data-node-id="merge"]');
    const nodeContent = node?.querySelector<HTMLElement>('.tng-flow-editor__node-content');
    const visibleNode = nodeContent?.querySelector<HTMLElement>('tng-flow-node');
    const inputPorts = node?.querySelectorAll<HTMLElement>('.tng-flow-editor__port--input');
    const outputPort = node?.querySelector<HTMLElement>('.tng-flow-editor__port--output');

    expect(node?.style.minHeight).toBe('116px');
    expect(nodeContent?.style.minHeight).toBe('116px');
    expect(visibleNode?.style.minHeight).toBe('116px');
    expect(Number.parseFloat(inputPorts?.[0]?.style.top ?? '')).toBeCloseTo(100 / 3);
    expect(Number.parseFloat(inputPorts?.[1]?.style.top ?? '')).toBeCloseTo(200 / 3);
    expect(Number.parseFloat(outputPort?.style.top ?? '')).toBe(50);
  });

  it('translates Foblex gestures into controlled TailNG events', () => {
    const fixture = TestBed.createComponent(TngFlowEditorComponent);
    fixture.componentRef.setInput('nodes', nodes);
    fixture.componentRef.setInput('fitOnInit', false);
    fixture.detectChanges();

    const editor = fixture.componentInstance;
    const harness = editor as unknown as EditorEventHarness;
    const moved = vi.fn<(event: TngFlowNodesMovedEvent) => void>();
    const positionChanged = vi.fn<(event: TngFlowNodePositionChange) => void>();
    const created = vi.fn();
    const selected = vi.fn();
    const deleted = vi.fn();

    editor.nodesMoved.subscribe(moved);
    editor.nodePositionChange.subscribe(positionChanged);
    editor.connectionCreated.subscribe(created);
    editor.selectionChanged.subscribe(selected);
    editor.deleteRequested.subscribe(deleted);

    harness.onMoveNodes(new FMoveNodesEvent([{ id: 'custom', position: { x: 120, y: 160 } }]));
    harness.onCreateConnection(
      new FCreateConnectionEvent('custom::custom-output', 'default::default-input', {
        x: 240,
        y: 160,
      }),
    );
    harness.onSelectionChange(new FSelectionChangeEvent(['custom'], [], []));
    harness.onDeleteSelected(new FDeleteSelectedEvent(['custom'], [], []));

    expect(moved).toHaveBeenCalledWith({
      nodes: [{ id: 'custom', position: { x: 120, y: 160 } }],
    });
    expect(positionChanged).toHaveBeenCalledWith({
      nodeId: 'custom',
      previousPosition: { x: 40, y: 80 },
      position: { x: 120, y: 160 },
    });
    expect(nodes[0].position).toEqual({ x: 40, y: 80 });
    expect(created).toHaveBeenCalledWith({
      source: { nodeId: 'custom', portId: 'custom-output' },
      target: { nodeId: 'default', portId: 'default-input' },
      dropPosition: { x: 240, y: 160 },
    });
    expect(selected).toHaveBeenCalledWith({ nodeIds: ['custom'], connectionIds: [] });
    expect(deleted).toHaveBeenCalledWith({ nodeIds: ['custom'], connectionIds: [] });
  });

  it('emits controlled node-create requests for branded palette drops', () => {
    const fixture = TestBed.createComponent(
      TngFlowEditorComponent<{
        summary: string;
      }>,
    );
    fixture.componentRef.setInput('nodes', nodes);
    fixture.componentRef.setInput('fitOnInit', false);
    fixture.componentRef.setInput('snapToGrid', true);
    fixture.componentRef.setInput('gridSize', 16);
    fixture.detectChanges();

    const editor = fixture.componentInstance;
    const harness = editor as unknown as EditorEventHarness;
    const created = vi.fn<(event: TngFlowNodeCreateRequest<{ summary: string }>) => void>();
    const item: TngFlowPaletteItem<{ summary: string }> = {
      id: 'model-palette-item',
      type: 'model',
      name: 'Model',
      data: { summary: 'New model' },
    };
    editor.nodeCreateRequested.subscribe(created);

    harness.onCreateNode({
      data: createTngFlowPaletteItemEnvelope(item),
      externalItemRect: { x: 103, y: 73, width: 280, height: 112 },
    });
    harness.onCreateNode({
      data: item,
      externalItemRect: { x: 200, y: 200, width: 280, height: 112 },
    });

    expect(created).toHaveBeenCalledOnce();
    expect(created).toHaveBeenCalledWith({
      item,
      position: { x: 96, y: 80 },
      source: 'pointer',
    });
    expect(nodes[0].position).toEqual({ x: 40, y: 80 });
  });

  it('supports explicit keyboard/API placement and blocks creation outside edit mode', () => {
    const fixture = TestBed.createComponent(TngFlowEditorComponent<{ summary: string }>);
    fixture.componentRef.setInput('fitOnInit', false);
    fixture.detectChanges();

    const editor = fixture.componentInstance;
    const created = vi.fn<(event: TngFlowNodeCreateRequest<{ summary: string }>) => void>();
    const item: TngFlowPaletteItem<{ summary: string }> = {
      id: 'tool-palette-item',
      type: 'tool',
      name: 'Tool',
    };
    editor.nodeCreateRequested.subscribe(created);

    editor.requestNodeCreate(item, { x: 120, y: 144 }, 'keyboard');
    fixture.componentRef.setInput('mode', 'inspect');
    fixture.detectChanges();
    editor.requestNodeCreate(item, { x: 300, y: 300 }, 'api');

    expect(created).toHaveBeenCalledOnce();
    expect(created).toHaveBeenCalledWith({
      item,
      position: { x: 120, y: 144 },
      source: 'keyboard',
    });
  });

  it('blocks graph mutation events in read-only mode', () => {
    const fixture = TestBed.createComponent(TngFlowEditorComponent);
    fixture.componentRef.setInput('nodes', nodes);
    fixture.componentRef.setInput('mode', 'readonly');
    fixture.componentRef.setInput('fitOnInit', false);
    fixture.detectChanges();

    const editor = fixture.componentInstance;
    const harness = editor as unknown as EditorEventHarness;
    const created = vi.fn();
    const deleted = vi.fn();
    const selected = vi.fn();

    editor.connectionCreated.subscribe(created);
    editor.deleteRequested.subscribe(deleted);
    editor.selectionChange.subscribe(selected);
    harness.onCreateConnection(
      new FCreateConnectionEvent('custom::custom-output', 'default::default-input', { x: 0, y: 0 }),
    );
    harness.onDeleteSelected(new FDeleteSelectedEvent(['custom'], [], []));
    harness.onSelectionChange(new FSelectionChangeEvent(['custom'], [], []));

    expect(created).not.toHaveBeenCalled();
    expect(deleted).not.toHaveBeenCalled();
    expect(selected).not.toHaveBeenCalled();
  });

  it('activates nodes by double click and Enter only in edit and inspect modes', () => {
    const fixture = TestBed.createComponent(TngFlowEditorComponent);
    fixture.componentRef.setInput('nodes', nodes);
    fixture.componentRef.setInput('selection', {
      nodeIds: new Set(['custom']),
      connectionIds: new Set(),
    });
    fixture.componentRef.setInput('fitOnInit', false);
    fixture.detectChanges();

    const editor = fixture.componentInstance;
    const activated = vi.fn();
    editor.nodeActivated.subscribe(activated);
    const host = fixture.nativeElement as HTMLElement;
    host
      .querySelector('[data-node-id="custom"]')
      ?.dispatchEvent(new MouseEvent('dblclick', { bubbles: true }));
    fixture.componentRef.setInput('mode', 'inspect');
    fixture.detectChanges();
    host.dispatchEvent(new KeyboardEvent('keydown', { bubbles: true, key: 'Enter' }));
    fixture.componentRef.setInput('mode', 'readonly');
    fixture.detectChanges();
    host
      .querySelector('[data-node-id="custom"]')
      ?.dispatchEvent(new MouseEvent('dblclick', { bubbles: true }));

    expect(activated.mock.calls).toEqual([
      [{ nodeId: 'custom', source: 'pointer' }],
      [{ nodeId: 'custom', source: 'keyboard' }],
    ]);
  });

  it('allows selection but blocks graph mutation requests in inspect mode', () => {
    const fixture = TestBed.createComponent(TngFlowEditorComponent);
    fixture.componentRef.setInput('nodes', nodes);
    fixture.componentRef.setInput('mode', 'inspect');
    fixture.componentRef.setInput('fitOnInit', false);
    fixture.detectChanges();

    const editor = fixture.componentInstance;
    const harness = editor as unknown as EditorEventHarness;
    const created = vi.fn();
    const deleted = vi.fn();
    const selected = vi.fn();
    editor.connectionCreateRequested.subscribe(created);
    editor.nodesDeleteRequested.subscribe(deleted);
    editor.selectionChange.subscribe(selected);

    harness.onCreateConnection(
      new FCreateConnectionEvent('custom::custom-output', 'default::default-input', { x: 0, y: 0 }),
    );
    harness.onDeleteSelected(new FDeleteSelectedEvent(['custom'], [], []));
    harness.onSelectionChange(new FSelectionChangeEvent(['custom'], [], []));

    expect(created).not.toHaveBeenCalled();
    expect(deleted).not.toHaveBeenCalled();
    expect(selected).toHaveBeenCalledWith({
      nodeIds: new Set(['custom']),
      connectionIds: new Set(),
    });
  });

  it('emits canonical create requests and rejects invalid directions', () => {
    const fixture = TestBed.createComponent(TngFlowEditorComponent);
    fixture.componentRef.setInput('nodes', nodes);
    fixture.componentRef.setInput('connectionCreationPathType', 'adaptive');
    fixture.componentRef.setInput('fitOnInit', false);
    fixture.detectChanges();

    const editor = fixture.componentInstance;
    const harness = editor as unknown as EditorEventHarness;
    const created = vi.fn();
    const rejected = vi.fn<(event: TngFlowConnectionRejectedEvent) => void>();
    editor.connectionCreateRequested.subscribe(created);
    editor.connectionRejected.subscribe(rejected);

    harness.onCreateConnection(
      new FCreateConnectionEvent('default::default-input', 'custom::custom-output', { x: 0, y: 0 }),
    );
    harness.onCreateConnection(
      new FCreateConnectionEvent('default::default-input', 'default::default-input', {
        x: 0,
        y: 0,
      }),
    );

    expect(created).toHaveBeenCalledWith({
      source: { nodeId: 'custom', portId: 'custom-output' },
      target: { nodeId: 'default', portId: 'default-input' },
      routing: { type: 'adaptive', offset: 12, radius: 8 },
    });
    expect(rejected.mock.calls[0]?.[0].reason).toContain('output');
    expect(rejected.mock.calls[0]?.[0]).toMatchObject({
      code: 'invalid-source-direction',
      origin: 'tailng',
    });
  });

  it('skips malformed persisted connections and reports their structural issue safely', () => {
    const fixture = TestBed.createComponent(TngFlowEditorComponent);
    fixture.componentRef.setInput('definition', {
      id: 'malformed',
      nodes,
      connections: [
        {
          id: 'broken',
          source: { nodeId: 'missing', portId: 'output' },
          target: { nodeId: 'default', portId: 'default-input' },
        },
      ],
    });
    fixture.componentRef.setInput('fitOnInit', false);

    expect(() => fixture.detectChanges()).not.toThrow();
    expect((fixture.nativeElement as HTMLElement).querySelectorAll('f-connection')).toHaveLength(0);
    expect(fixture.componentInstance.validationIssues().map((issue) => issue.code)).toContain(
      'missing-source-node',
    );
  });

  it('reveals a target, requests controlled selection, and activates issues by stable id', () => {
    const fixture = TestBed.createComponent(TngFlowEditorComponent);
    fixture.componentRef.setInput('nodes', nodes);
    fixture.componentRef.setInput('validation', {
      issues: [
        {
          id: 'reveal-node',
          code: 'review',
          severity: 'warning',
          message: 'Review this node.',
          target: { kind: 'node', nodeId: 'default' },
        },
      ],
    });
    fixture.componentRef.setInput('fitOnInit', false);
    fixture.detectChanges();

    const editor = fixture.componentInstance;
    const harness = editor as unknown as EditorEventHarness;
    const selected = vi.fn();
    const issueActivated = vi.fn<(event: TngFlowValidationIssueActivatedEvent) => void>();
    const centerNode = vi.spyOn(editor, 'centerNode').mockReturnValue(true);
    editor.selectionChange.subscribe(selected);
    editor.validationIssueActivated.subscribe(issueActivated);
    harness.onReady();

    expect(editor.revealTarget({ kind: 'node', nodeId: 'default' }, { select: true })).toBe(true);
    expect(centerNode).toHaveBeenCalledWith('default', true);
    expect(selected).toHaveBeenCalledWith({
      nodeIds: new Set(['default']),
      connectionIds: new Set(),
    });
    expect(editor.activateValidationIssue('reveal-node')).toBe(true);
    expect(issueActivated.mock.calls[0]?.[0]).toMatchObject({
      source: 'api',
      issue: { id: 'reveal-node' },
    });
  });

  it('runs the consumer validator after built-in validation', () => {
    const fixture = TestBed.createComponent(TngFlowEditorComponent);
    const validator = vi.fn(() => ({
      valid: false as const,
      code: 'consumer-rule',
      reason: 'Consumer rejected this pair.',
    }));
    fixture.componentRef.setInput('nodes', nodes);
    fixture.componentRef.setInput('connectionValidator', validator);
    fixture.componentRef.setInput('fitOnInit', false);
    fixture.detectChanges();
    validator.mockClear();

    const editor = fixture.componentInstance;
    const harness = editor as unknown as EditorEventHarness;
    const created = vi.fn();
    const rejected = vi.fn<(event: TngFlowConnectionRejectedEvent) => void>();
    editor.connectionCreateRequested.subscribe(created);
    editor.connectionRejected.subscribe(rejected);

    harness.onCreateConnection(
      new FCreateConnectionEvent('custom::custom-output', 'default::default-input', {
        x: 0,
        y: 0,
      }),
    );

    expect(validator).toHaveBeenCalledOnce();
    expect(created).not.toHaveBeenCalled();
    expect(rejected.mock.calls[0]?.[0].reason).toBe('Consumer rejected this pair.');
    expect(rejected.mock.calls[0]?.[0]).toMatchObject({
      code: 'consumer-rule',
      origin: 'consumer',
    });
  });

  it('validates reconnection and emits the complete controlled request', () => {
    const fixture = TestBed.createComponent(TngFlowEditorComponent);
    fixture.componentRef.setInput('definition', {
      id: 'reconnect',
      nodes: [
        { ...nodes[0], outputs: [{ id: 'custom-output', multiple: true }] },
        {
          ...nodes[1],
          inputs: [{ id: 'default-input' }, { id: 'alternate-input' }],
        },
      ],
      connections: [definition.connections[0]],
    });
    fixture.componentRef.setInput('fitOnInit', false);
    fixture.detectChanges();

    const editor = fixture.componentInstance;
    const harness = editor as unknown as EditorEventHarness;
    const reconnected = vi.fn();
    editor.connectionReconnectRequested.subscribe(reconnected);

    harness.onReassignConnection({
      connectionId: 'custom-to-default',
      endpoint: 'target',
      previousSourceId: 'custom::custom-output',
      nextSourceId: undefined,
      previousTargetId: 'default::default-input',
      nextTargetId: 'default::alternate-input',
      dropPosition: { x: 0, y: 0 },
    });

    expect(reconnected).toHaveBeenCalledWith({
      connectionId: 'custom-to-default',
      previousSource: { nodeId: 'custom', portId: 'custom-output' },
      previousTarget: { nodeId: 'default', portId: 'default-input' },
      source: { nodeId: 'custom', portId: 'custom-output' },
      target: { nodeId: 'default', portId: 'alternate-input' },
      changedEndpoint: 'target',
    });
  });

  it('splits delete requests and protects locked nodes', () => {
    const fixture = TestBed.createComponent(TngFlowEditorComponent);
    fixture.componentRef.setInput('definition', definition);
    fixture.componentRef.setInput('fitOnInit', false);
    fixture.detectChanges();

    const editor = fixture.componentInstance;
    const harness = editor as unknown as EditorEventHarness;
    const nodesDeleted = vi.fn();
    const connectionsDeleted = vi.fn();
    editor.nodesDeleteRequested.subscribe(nodesDeleted);
    editor.connectionsDeleteRequested.subscribe(connectionsDeleted);

    harness.onDeleteSelected(
      new FDeleteSelectedEvent(['custom', 'locked'], [], ['custom-to-default']),
    );

    expect(nodesDeleted).toHaveBeenCalledWith({ nodeIds: ['custom'], source: 'keyboard' });
    expect(connectionsDeleted).toHaveBeenCalledWith({
      connectionIds: ['custom-to-default'],
      source: 'keyboard',
    });
  });

  it('redraws the canvas when a viewport control changes the scale', () => {
    const fixture = TestBed.createComponent(TngFlowEditorComponent);
    fixture.componentRef.setInput('fitOnInit', false);
    fixture.detectChanges();

    const canvas = (fixture.nativeElement as HTMLElement).querySelector('f-canvas');
    fixture.componentInstance.zoomBy(0.15);

    expect(canvas?.style.transform).toContain('matrix(1.15');
  });

  it('toggles the mouse-wheel zoom lock without disabling viewport controls', () => {
    const fixture = TestBed.createComponent(TngFlowEditorComponent);
    fixture.componentRef.setInput('fitOnInit', false);
    fixture.detectChanges();

    const host = fixture.nativeElement as HTMLElement;
    const zoom = fixture.debugElement
      .query(By.directive(FZoomDirective))
      .injector.get(FZoomDirective);
    const lockControl = host.querySelector<HTMLButtonElement>(
      'tng-button[title="Lock scroll zoom"] button',
    );
    const wheelEvent = new WheelEvent('wheel', { deltaY: 100 });

    expect(lockControl?.getAttribute('aria-pressed')).toBe('false');
    expect(zoom.fWheelTrigger(wheelEvent)).toBe(true);

    lockControl?.click();
    fixture.detectChanges();

    const unlockControl = host.querySelector<HTMLButtonElement>(
      'tng-button[title="Unlock scroll zoom"] button',
    );
    expect(unlockControl?.getAttribute('aria-pressed')).toBe('true');
    expect(zoom.fWheelTrigger(wheelEvent)).toBe(false);

    fixture.componentInstance.zoomBy(0.15);
    expect(host.querySelector('f-canvas')?.getAttribute('style')).toContain('matrix(1.15');
  });

  it('emits the canonical viewport output together with its deprecated alias', () => {
    const fixture = TestBed.createComponent(TngFlowEditorComponent);
    fixture.componentRef.setInput('fitOnInit', false);
    fixture.detectChanges();

    const editor = fixture.componentInstance;
    const harness = editor as unknown as EditorEventHarness;
    const canonical = vi.fn();
    const legacy = vi.fn();
    editor.viewportChange.subscribe(canonical);
    editor.viewportChanged.subscribe(legacy);

    harness.onViewportChange({ position: { x: -24, y: 32 }, scale: 1.15 });

    expect(canonical).toHaveBeenCalledWith({ position: { x: -24, y: 32 }, scale: 1.15 });
    expect(legacy).toHaveBeenCalledWith({ position: { x: -24, y: 32 }, scale: 1.15 });
  });

  it('keeps the minimap opt-in and applies accessible default options', () => {
    const fixture = TestBed.createComponent(TngFlowEditorComponent);
    fixture.componentRef.setInput('nodes', nodes);
    fixture.componentRef.setInput('fitOnInit', false);
    fixture.detectChanges();

    expect(
      (fixture.nativeElement as HTMLElement).querySelector('.tng-flow-editor__minimap-shell'),
    ).toBeNull();

    fixture.componentRef.setInput('showMinimap', true);
    fixture.detectChanges();

    const shell = (fixture.nativeElement as HTMLElement).querySelector<HTMLElement>(
      '.tng-flow-editor__minimap-shell',
    );
    const minimap = fixture.debugElement.query(
      (debugElement) => debugElement.componentInstance instanceof FMinimapComponent,
    ).componentInstance as FMinimapComponent;
    expect(shell?.getAttribute('data-position')).toBe('bottom-left');
    expect(shell?.getAttribute('role')).toBe('group');
    expect(shell?.getAttribute('tabindex')).toBe('0');
    expect(shell?.getAttribute('aria-label')).toBe('Workflow overview');
    expect(shell?.style.width).toBe('140px');
    expect(shell?.style.height).toBe('120px');
    expect(minimap.fMinSize()).toBe(1000);
    expect(minimap.fNodeRenderLimit()).toBe(10000);
  });

  it('normalizes custom minimap options and hides non-interactive overviews from assistive tech', () => {
    const fixture = TestBed.createComponent(TngFlowEditorComponent);
    fixture.componentRef.setInput('showMinimap', true);
    fixture.componentRef.setInput('fitOnInit', false);
    fixture.componentRef.setInput('minimapOptions', {
      position: 'top-right',
      width: 196,
      height: 108,
      minSize: 720,
      nodeRenderLimit: 12,
      interactive: false,
      ariaLabel: 'Process map',
    });
    fixture.detectChanges();

    const shell = (fixture.nativeElement as HTMLElement).querySelector<HTMLElement>(
      '.tng-flow-editor__minimap-shell',
    );
    const minimapElement = shell?.querySelector<HTMLElement>('f-minimap');
    const minimap = fixture.debugElement.query(
      (debugElement) => debugElement.componentInstance instanceof FMinimapComponent,
    ).componentInstance as FMinimapComponent;
    expect(shell?.getAttribute('data-position')).toBe('top-right');
    expect(shell?.getAttribute('aria-hidden')).toBe('true');
    expect(shell?.hasAttribute('tabindex')).toBe(false);
    expect(shell?.hasAttribute('role')).toBe(false);
    expect(shell?.style.width).toBe('196px');
    expect(shell?.style.height).toBe('108px');
    expect(minimapElement?.style.pointerEvents).toBe('none');
    expect(minimap.fMinSize()).toBe(720);
    expect(minimap.fNodeRenderLimit()).toBe(12);
  });

  it('maps TailNG node presentation and validation states to minimap classes', () => {
    const fixture = TestBed.createComponent(TngFlowEditorComponent);
    fixture.componentRef.setInput('nodes', [nodes[0], { ...nodes[1], disabled: true }]);
    fixture.componentRef.setInput('selection', {
      nodeIds: new Set(['custom']),
      connectionIds: new Set(),
    });
    fixture.componentRef.setInput('presentation', {
      nodes: { custom: { highlighted: true } },
    });
    fixture.componentRef.setInput('validation', {
      issues: [
        {
          id: 'invalid-default',
          code: 'invalid',
          severity: 'error',
          message: 'Default node is invalid.',
          target: { kind: 'node', nodeId: 'default' },
        },
      ],
    });
    fixture.componentRef.setInput('fitOnInit', false);
    fixture.detectChanges();

    const harness = fixture.componentInstance as unknown as {
      minimapClassesFor: (nodeId: string) => string[];
    };
    expect(harness.minimapClassesFor('custom')).toEqual([
      'tng-flow-minimap__node',
      'tng-flow-minimap__node-id--0',
      'tng-flow-minimap__node--selected',
      'tng-flow-minimap__node--highlighted',
    ]);
    expect(harness.minimapClassesFor('default')).toEqual([
      'tng-flow-minimap__node',
      'tng-flow-minimap__node-id--1',
      'tng-flow-minimap__node--disabled',
      'tng-flow-minimap__node--error',
    ]);
  });

  function createInteractiveMinimapFixture() {
    const fixture = TestBed.createComponent(TngFlowEditorComponent);
    fixture.componentRef.setInput('nodes', nodes);
    fixture.componentRef.setInput('showMinimap', true);
    fixture.componentRef.setInput('fitOnInit', false);
    fixture.detectChanges();

    const host = fixture.nativeElement as HTMLElement;
    const flow = host.querySelector<HTMLElement>('f-flow');
    const shell = host.querySelector<HTMLElement>('.tng-flow-editor__minimap-shell');
    if (flow === null || shell === null) {
      throw new Error('Expected the interactive minimap to render.');
    }
    const canvas = fixture.debugElement.query(
      (debugElement) => debugElement.componentInstance instanceof FCanvasComponent,
    ).componentInstance as FCanvasComponent;
    const minimap = fixture.debugElement.query(
      (debugElement) => debugElement.componentInstance instanceof FMinimapComponent,
    ).componentInstance as FMinimapComponent;
    const bridgeDebugElement = fixture.debugElement.query(
      By.directive(TngFlowFoblexBridgeDirective),
    );
    const bridge = bridgeDebugElement.injector.get(TngFlowFoblexBridgeDirective);
    const componentsStore = bridgeDebugElement.injector.get(FComponentsStore);
    vi.spyOn(flow, 'getBoundingClientRect').mockReturnValue(new DOMRect(100, 50, 800, 600));
    vi.spyOn(minimap.state.element, 'getBoundingClientRect').mockReturnValue(
      new DOMRect(20, 30, 140, 120),
    );
    minimap.state.scale = 2;
    minimap.state.viewBox.x = 10;
    minimap.state.viewBox.y = 20;

    return { bridge, canvas, componentsStore, fixture, minimap, shell };
  }

  function finishCanvasTransformTransition(canvas: FCanvasComponent): void {
    const event = new Event('transitionend');
    Object.defineProperty(event, 'propertyName', { value: 'transform' });
    canvas.hostElement.dispatchEvent(event);
  }

  function expectMinimapHoverToSurviveSync(
    update: (fixture: ReturnType<typeof createInteractiveMinimapFixture>['fixture']) => void,
  ): void {
    const { bridge, canvas, fixture, shell } = createInteractiveMinimapFixture();
    const setPosition = vi.spyOn(canvas, '_setPosition');
    const emitCanvasChange = vi.spyOn(canvas, 'emitCanvasChangeEvent');
    vi.spyOn(bridge, 'redrawCanvas').mockImplementation(() => undefined);

    shell.dispatchEvent(new MouseEvent('pointermove', { bubbles: true, clientX: 50, clientY: 60 }));
    expect(setPosition).toHaveBeenLastCalledWith({ x: 330, y: 220 });
    const emittedAfterHover = emitCanvasChange.mock.calls.length;

    update(fixture);
    fixture.detectChanges();

    expect(setPosition).toHaveBeenLastCalledWith({ x: 330, y: 220 });
    expect(emitCanvasChange).toHaveBeenCalledTimes(emittedAfterHover);

    shell.dispatchEvent(new MouseEvent('pointerleave'));
    expect(setPosition).toHaveBeenLastCalledWith({ x: 0, y: 0 });
  }

  it('keeps minimap hover active when an immutable definition synchronizes', () => {
    expectMinimapHoverToSurviveSync((fixture) => {
      fixture.componentRef.setInput('definition', {
        id: 'synchronized-definition',
        nodes: nodes.map((node) => ({ ...node, position: { ...node.position } })),
        connections: [],
      });
    });
  });

  it('keeps minimap hover active when presentation synchronizes', () => {
    expectMinimapHoverToSurviveSync((fixture) => {
      fixture.componentRef.setInput('presentation', {
        nodes: { custom: { highlighted: true } },
      });
    });
  });

  it('keeps minimap hover active when legacy node views synchronize', () => {
    expectMinimapHoverToSurviveSync((fixture) => {
      fixture.componentRef.setInput('nodeViews', {
        custom: { status: 'running' },
      });
    });
  });

  it('keeps minimap hover active when selection synchronizes', () => {
    expectMinimapHoverToSurviveSync((fixture) => {
      fixture.componentRef.setInput('selection', {
        nodeIds: new Set(['custom']),
        connectionIds: new Set(),
      });
    });
  });

  it('keeps minimap hover active when a controlled viewport echoes the preview', () => {
    expectMinimapHoverToSurviveSync((fixture) => {
      fixture.componentRef.setInput('viewport', {
        position: { x: 330, y: 220 },
        scale: 1,
      });
    });
  });

  it('rebases minimap hover geometry without discarding the original reset position', () => {
    const { canvas, fixture, minimap, shell } = createInteractiveMinimapFixture();
    const setPosition = vi.spyOn(canvas, '_setPosition');

    shell.dispatchEvent(new MouseEvent('pointermove', { bubbles: true, clientX: 50, clientY: 60 }));
    expect(setPosition).toHaveBeenLastCalledWith({ x: 330, y: 220 });

    fixture.componentRef.setInput('definition', {
      id: 'geometry-update',
      nodes: nodes.map((node) => ({
        ...node,
        position: { x: node.position.x + 40, y: node.position.y + 20 },
      })),
      connections: [],
    });
    fixture.detectChanges();
    minimap.state.scale = 3;
    minimap.state.viewBox.x = 15;
    minimap.state.viewBox.y = 25;

    shell.dispatchEvent(new MouseEvent('pointermove', { bubbles: true, clientX: 60, clientY: 70 }));

    expect(setPosition).toHaveBeenLastCalledWith({ x: 595, y: 375 });
    expect(Number.isFinite(canvas.getPosition().x)).toBe(true);
    expect(Number.isFinite(canvas.getPosition().y)).toBe(true);

    shell.dispatchEvent(new MouseEvent('pointerleave'));
    expect(setPosition).toHaveBeenLastCalledWith({ x: 0, y: 0 });
  });

  it('restores hover navigation smoothly on leave and commits the latest clicked position', () => {
    const { bridge, canvas, shell } = createInteractiveMinimapFixture();
    const setPosition = vi.spyOn(canvas, '_setPosition');
    const redrawCanvas = vi.spyOn(bridge, 'redrawCanvas').mockImplementation(() => undefined);

    shell.dispatchEvent(
      new MouseEvent('pointermove', {
        bubbles: true,
        clientX: 50,
        clientY: 60,
      }),
    );

    expect(setPosition).toHaveBeenCalledWith({ x: 330, y: 220 });

    shell.dispatchEvent(new MouseEvent('pointerleave'));

    expect(setPosition).toHaveBeenLastCalledWith({ x: 0, y: 0 });
    expect(redrawCanvas).toHaveBeenNthCalledWith(1, true);

    shell.dispatchEvent(
      new MouseEvent('pointermove', {
        bubbles: true,
        clientX: 50,
        clientY: 60,
      }),
    );
    shell.dispatchEvent(
      new MouseEvent('pointermove', {
        bubbles: true,
        buttons: 1,
        clientX: 60,
        clientY: 70,
      }),
    );

    expect(setPosition).toHaveBeenLastCalledWith({ x: 330, y: 220 });

    shell.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    shell.dispatchEvent(
      new MouseEvent('pointermove', {
        bubbles: true,
        clientX: 60,
        clientY: 70,
      }),
    );

    expect(setPosition).toHaveBeenLastCalledWith({ x: 310, y: 200 });

    shell.dispatchEvent(new MouseEvent('pointerleave'));

    expect(setPosition).toHaveBeenLastCalledWith({ x: 330, y: 220 });
    expect(redrawCanvas).toHaveBeenNthCalledWith(2, true);
  });

  it('uses Foblex viewport animation lifecycle and defers minimap synchronization redraws', () => {
    const { canvas, componentsStore, fixture, shell } = createInteractiveMinimapFixture();
    const synchronizedDefinition = (): TngFlowDefinition<{ summary: string }> => ({
      ...definition,
      nodes: definition.nodes.map((node) => ({ ...node, position: { ...node.position } })),
      connections: definition.connections.map((connection) => ({
        ...connection,
        source: { ...connection.source },
        target: { ...connection.target },
      })),
    });
    fixture.componentRef.setInput('definition', synchronizedDefinition());
    fixture.detectChanges();

    const redraw = vi.spyOn(canvas, 'redraw');
    const emitCanvasChange = vi.spyOn(canvas, 'emitCanvasChangeEvent');
    const emitConnectionChanges = vi.spyOn(componentsStore, 'emitConnectionChanges');

    shell.dispatchEvent(new MouseEvent('pointermove', { bubbles: true, clientX: 50, clientY: 60 }));
    const emittedAfterHover = emitCanvasChange.mock.calls.length;
    shell.dispatchEvent(new MouseEvent('pointerleave'));

    expect(componentsStore.isViewportAnimating).toBe(true);
    expect(emitCanvasChange).toHaveBeenCalledTimes(emittedAfterHover + 1);
    const redrawsAfterRestoreStarted = redraw.mock.calls.length;

    fixture.componentRef.setInput('definition', synchronizedDefinition());
    fixture.detectChanges();

    expect(componentsStore.isViewportAnimating).toBe(true);
    expect(redraw).toHaveBeenCalledTimes(redrawsAfterRestoreStarted);
    expect(emitConnectionChanges).not.toHaveBeenCalled();

    finishCanvasTransformTransition(canvas);

    expect(componentsStore.isViewportAnimating).toBe(false);
    expect(emitConnectionChanges).toHaveBeenCalledTimes(1);
    expect(redraw).toHaveBeenCalledTimes(redrawsAfterRestoreStarted + 1);
  });

  it('restores minimap hover navigation immediately when reduced motion is preferred', () => {
    const originalDescriptor = Object.getOwnPropertyDescriptor(window, 'matchMedia');
    Object.defineProperty(window, 'matchMedia', {
      configurable: true,
      value: vi.fn((query: string) => ({
        matches: query === '(prefers-reduced-motion: reduce)',
        media: query,
      })) as Window['matchMedia'],
    });

    try {
      const { bridge, canvas, shell } = createInteractiveMinimapFixture();
      const redraw = vi.spyOn(canvas, 'redraw');
      const redrawWithAnimation = vi.spyOn(canvas, 'redrawWithAnimation');
      const redrawCanvas = vi.spyOn(bridge, 'redrawCanvas');

      shell.dispatchEvent(
        new MouseEvent('pointermove', { bubbles: true, clientX: 50, clientY: 60 }),
      );
      const redrawCountAfterHover = redraw.mock.calls.length;
      shell.dispatchEvent(new MouseEvent('pointerleave'));

      expect(redrawWithAnimation).not.toHaveBeenCalled();
      expect(redraw).toHaveBeenCalledTimes(redrawCountAfterHover + 1);
      expect(redrawCanvas).toHaveBeenCalledWith(false);
    } finally {
      if (originalDescriptor === undefined) {
        Reflect.deleteProperty(window, 'matchMedia');
      } else {
        Object.defineProperty(window, 'matchMedia', originalDescriptor);
      }
    }
  });

  it('uses an immediate restore when minimap synchronization interrupts hover navigation', () => {
    const { bridge, canvas, fixture, shell } = createInteractiveMinimapFixture();
    const setPosition = vi.spyOn(canvas, '_setPosition');
    const redrawCanvas = vi.spyOn(bridge, 'redrawCanvas');

    shell.dispatchEvent(new MouseEvent('pointermove', { bubbles: true, clientX: 50, clientY: 60 }));
    fixture.componentRef.setInput('minimapOptions', { interactive: false });
    fixture.detectChanges();

    expect(setPosition).toHaveBeenLastCalledWith({ x: 0, y: 0 });
    expect(redrawCanvas).toHaveBeenCalledWith(false);
  });

  it('restores hover navigation immediately when the minimap is hidden', () => {
    const { bridge, canvas, fixture, shell } = createInteractiveMinimapFixture();
    const setPosition = vi.spyOn(canvas, '_setPosition');
    const redrawCanvas = vi.spyOn(bridge, 'redrawCanvas');

    shell.dispatchEvent(new MouseEvent('pointermove', { bubbles: true, clientX: 50, clientY: 60 }));
    fixture.componentRef.setInput('showMinimap', false);
    fixture.detectChanges();

    expect(setPosition).toHaveBeenLastCalledWith({ x: 0, y: 0 });
    expect(redrawCanvas).toHaveBeenCalledWith(false);
  });

  it('restores hover navigation immediately on pointer cancellation', () => {
    const { bridge, canvas, shell } = createInteractiveMinimapFixture();
    const setPosition = vi.spyOn(canvas, '_setPosition');
    const redrawCanvas = vi.spyOn(bridge, 'redrawCanvas');

    shell.dispatchEvent(new MouseEvent('pointermove', { bubbles: true, clientX: 50, clientY: 60 }));
    shell.dispatchEvent(new MouseEvent('pointercancel'));

    expect(setPosition).toHaveBeenLastCalledWith({ x: 0, y: 0 });
    expect(redrawCanvas).toHaveBeenCalledWith(false);
  });

  it('does not pan from hover when minimap interaction is disabled', () => {
    const fixture = TestBed.createComponent(TngFlowEditorComponent);
    fixture.componentRef.setInput('nodes', nodes);
    fixture.componentRef.setInput('showMinimap', true);
    fixture.componentRef.setInput('fitOnInit', false);
    fixture.componentRef.setInput('minimapOptions', { interactive: false });
    fixture.detectChanges();

    const canvas = fixture.debugElement.query(
      (debugElement) => debugElement.componentInstance instanceof FCanvasComponent,
    ).componentInstance as FCanvasComponent;
    const setPosition = vi.spyOn(canvas, '_setPosition');
    const shell = (fixture.nativeElement as HTMLElement).querySelector<HTMLElement>(
      '.tng-flow-editor__minimap-shell',
    );
    shell?.dispatchEvent(
      new MouseEvent('pointermove', { bubbles: true, clientX: 50, clientY: 60 }),
    );

    expect(setPosition).not.toHaveBeenCalled();
  });

  it('keeps minimap viewport navigation active in readonly mode without graph mutations', async () => {
    const fixture = TestBed.createComponent(TngFlowEditorComponent);
    fixture.componentRef.setInput('nodes', nodes);
    fixture.componentRef.setInput('showMinimap', true);
    fixture.componentRef.setInput('mode', 'readonly');
    fixture.componentRef.setInput('fitOnInit', false);
    fixture.detectChanges();

    const viewportChanged = vi.fn();
    const nodesMoved = vi.fn();
    const fitToScreen = vi.spyOn(fixture.componentInstance, 'fitToScreen');
    fixture.componentInstance.viewportChange.subscribe(viewportChanged);
    fixture.componentInstance.nodesMoved.subscribe(nodesMoved);
    const shell = (fixture.nativeElement as HTMLElement).querySelector<HTMLElement>(
      '.tng-flow-editor__minimap-shell',
    );
    const arrowEvent = new KeyboardEvent('keydown', {
      bubbles: true,
      cancelable: true,
      key: 'ArrowRight',
    });
    shell?.dispatchEvent(arrowEvent);
    await new Promise<void>((resolve) => globalThis.setTimeout(resolve, 0));

    expect(arrowEvent.defaultPrevented).toBe(true);
    expect(viewportChanged).toHaveBeenCalledWith({ position: { x: -40, y: 0 }, scale: 1 });
    expect(nodesMoved).not.toHaveBeenCalled();

    shell?.dispatchEvent(
      new KeyboardEvent('keydown', { bubbles: true, cancelable: true, key: 'Home' }),
    );
    expect(fitToScreen).toHaveBeenCalledOnce();
  });

  it('keeps navigation available and reports when node rectangles exceed the render limit', () => {
    const fixture = TestBed.createComponent(TngFlowEditorComponent);
    fixture.componentRef.setInput('nodes', nodes);
    fixture.componentRef.setInput('showMinimap', true);
    fixture.componentRef.setInput('fitOnInit', false);
    fixture.componentRef.setInput('minimapOptions', { nodeRenderLimit: 1 });
    fixture.detectChanges();

    const shell = (fixture.nativeElement as HTMLElement).querySelector<HTMLElement>(
      '.tng-flow-editor__minimap-shell',
    );
    expect(shell?.hasAttribute('data-limited')).toBe(true);
    expect(shell?.querySelector('.tng-flow-editor__minimap-limit')?.textContent).toContain(
      'Overview simplified',
    );
    expect(shell?.querySelector<HTMLElement>('f-minimap')?.style.pointerEvents).toBe('auto');
  });

  it('places connected endpoints on facing borders in nearest-border mode', () => {
    const fixture = TestBed.createComponent(TngFlowEditorComponent);
    fixture.componentRef.setInput('attachmentLayout', 'nearest-border');
    fixture.componentRef.setInput('nodes', [
      {
        id: 'source',
        type: 'step',
        name: 'Source',
        position: { x: 0, y: 0 },
        ports: [
          { id: 'out', direction: 'output', kind: 'data', name: 'Start' },
          { id: 'create-out', direction: 'output', kind: 'data', multiple: true },
        ],
      },
      {
        id: 'target',
        type: 'step',
        name: 'Target',
        position: { x: 400, y: 0 },
        ports: [
          { id: 'in', direction: 'input', kind: 'data', name: 'End' },
          { id: 'create-in', direction: 'input', kind: 'data', multiple: true },
        ],
      },
    ]);
    fixture.componentRef.setInput('connections', [
      {
        id: 'source-to-target',
        source: { nodeId: 'source', portId: 'out' },
        target: { nodeId: 'target', portId: 'in' },
      },
    ]);
    fixture.componentRef.setInput('fitOnInit', false);
    fixture.detectChanges();

    const host = fixture.nativeElement as HTMLElement;
    const sourceOut = host.querySelector<HTMLElement>(
      '[data-node-id="source"] > [data-port-id="out"]',
    );
    const targetIn = host.querySelector<HTMLElement>(
      '[data-node-id="target"] > [data-port-id="in"]',
    );

    expect(sourceOut?.getAttribute('data-side')).toBe('right');
    expect(targetIn?.getAttribute('data-side')).toBe('left');
    expect(sourceOut?.querySelector('.tng-flow-port__label')).toBeNull();
    expect(targetIn?.querySelector('.tng-flow-port__label')).toBeNull();
    expect(fixture.componentInstance.useNearestBorderLayout()).toBe(true);
  });

  it('live-updates nearest-border sides from provisional move positions', () => {
    const fixture = TestBed.createComponent(TngFlowEditorComponent);
    fixture.componentRef.setInput('attachmentLayout', 'nearest-border');
    fixture.componentRef.setInput('nodes', [
      {
        id: 'source',
        type: 'step',
        name: 'Source',
        position: { x: 0, y: 0 },
        ports: [{ id: 'out', direction: 'output', kind: 'data' }],
      },
      {
        id: 'target',
        type: 'step',
        name: 'Target',
        position: { x: 400, y: 0 },
        ports: [{ id: 'in', direction: 'input', kind: 'data' }],
      },
    ]);
    fixture.componentRef.setInput('connections', [
      {
        id: 'source-to-target',
        source: { nodeId: 'source', portId: 'out' },
        target: { nodeId: 'target', portId: 'in' },
      },
    ]);
    fixture.componentRef.setInput('fitOnInit', false);
    fixture.detectChanges();

    const editor = fixture.componentInstance as unknown as EditorEventHarness;
    editor.onMoveNodes({
      nodes: [{ id: 'target', position: { x: 0, y: 300 } }],
    });
    fixture.detectChanges();

    const host = fixture.nativeElement as HTMLElement;
    expect(
      host.querySelector<HTMLElement>('[data-node-id="source"] > [data-port-id="out"]')?.dataset[
        'side'
      ],
    ).toBe('bottom');
    expect(
      host.querySelector<HTMLElement>('[data-node-id="target"] > [data-port-id="in"]')?.dataset[
        'side'
      ],
    ).toBe('top');
    // Declared port sides stay untouched; layout is an editor overlay.
    expect(
      fixture.componentInstance.nodes()?.find((node) => node.id === 'source')?.ports?.[0]?.side,
    ).toBeUndefined();
  });

  it('equal-spaces mixed input and output endpoints on one nearest border', () => {
    const fixture = TestBed.createComponent(TngFlowEditorComponent);
    fixture.componentRef.setInput('attachmentLayout', 'nearest-border');
    fixture.componentRef.setInput('nodes', [
      {
        id: 'hub',
        type: 'step',
        name: 'Hub',
        position: { x: 200, y: 0 },
        ports: [
          { id: 'in-from-left', direction: 'input', kind: 'data' },
          { id: 'out-to-right', direction: 'output', kind: 'data' },
        ],
      },
      {
        id: 'left',
        type: 'step',
        name: 'Left',
        position: { x: 0, y: 0 },
        ports: [{ id: 'out', direction: 'output', kind: 'data' }],
      },
      {
        id: 'right',
        type: 'step',
        name: 'Right',
        position: { x: 400, y: 0 },
        ports: [{ id: 'in', direction: 'input', kind: 'data' }],
      },
    ]);
    fixture.componentRef.setInput('connections', [
      {
        id: 'left-to-hub',
        source: { nodeId: 'left', portId: 'out' },
        target: { nodeId: 'hub', portId: 'in-from-left' },
      },
      {
        id: 'hub-to-right',
        source: { nodeId: 'hub', portId: 'out-to-right' },
        target: { nodeId: 'right', portId: 'in' },
      },
    ]);
    fixture.componentRef.setInput('fitOnInit', false);
    fixture.detectChanges();

    const host = fixture.nativeElement as HTMLElement;
    const hubLeft = host.querySelectorAll<HTMLElement>('[data-node-id="hub"] > [data-side="left"]');
    const hubRight = host.querySelectorAll<HTMLElement>(
      '[data-node-id="hub"] > [data-side="right"]',
    );

    expect(hubLeft).toHaveLength(1);
    expect(hubRight).toHaveLength(1);
    expect(Number.parseFloat(hubLeft[0].style.top)).toBe(50);
    expect(Number.parseFloat(hubRight[0].style.top)).toBe(50);
  });

  it('equal-spaces two inputs that resolve to the same nearest border', () => {
    const fixture = TestBed.createComponent(TngFlowEditorComponent);
    fixture.componentRef.setInput('attachmentLayout', 'nearest-border');
    fixture.componentRef.setInput('nodes', [
      {
        id: 'sink',
        type: 'step',
        name: 'Sink',
        position: { x: 400, y: 0 },
        ports: [
          { id: 'in-a', direction: 'input', kind: 'data' },
          { id: 'in-b', direction: 'input', kind: 'data' },
        ],
      },
      {
        id: 'a',
        type: 'step',
        name: 'A',
        position: { x: 0, y: -40 },
        ports: [{ id: 'out', direction: 'output', kind: 'data' }],
      },
      {
        id: 'b',
        type: 'step',
        name: 'B',
        position: { x: 0, y: 40 },
        ports: [{ id: 'out', direction: 'output', kind: 'data' }],
      },
    ]);
    fixture.componentRef.setInput('connections', [
      {
        id: 'a-to-sink',
        source: { nodeId: 'a', portId: 'out' },
        target: { nodeId: 'sink', portId: 'in-a' },
      },
      {
        id: 'b-to-sink',
        source: { nodeId: 'b', portId: 'out' },
        target: { nodeId: 'sink', portId: 'in-b' },
      },
    ]);
    fixture.componentRef.setInput('fitOnInit', false);
    fixture.detectChanges();

    const host = fixture.nativeElement as HTMLElement;
    const leftPorts = host.querySelectorAll<HTMLElement>(
      '[data-node-id="sink"] > [data-side="left"]',
    );
    expect(leftPorts).toHaveLength(2);
    expect(Number.parseFloat(leftPorts[0].style.top)).toBeCloseTo(100 / 3);
    expect(Number.parseFloat(leftPorts[1].style.top)).toBeCloseTo(200 / 3);
  });

  it('keeps static-ports labels and declared sides by default', () => {
    const fixture = TestBed.createComponent(TngFlowEditorComponent);
    fixture.componentRef.setInput('nodes', [
      {
        id: 'labeled',
        type: 'step',
        name: 'Labeled',
        position: { x: 0, y: 0 },
        ports: [{ id: 'start', direction: 'input', kind: 'data', name: 'Start', side: 'top' }],
      },
    ]);
    fixture.componentRef.setInput('fitOnInit', false);
    fixture.detectChanges();

    const host = fixture.nativeElement as HTMLElement;
    const port = host.querySelector<HTMLElement>(
      '[data-node-id="labeled"] > [data-port-id="start"]',
    );
    expect(port?.getAttribute('data-side')).toBe('top');
    expect(port?.querySelector('.tng-flow-port__label')?.textContent).toContain('Start');
    expect(host.querySelector('f-connection-marker-arrow')).toBeNull();
  });

  it('synthesizes a custom-points grid and shows idle outputs only on the selected node', () => {
    const fixture = TestBed.createComponent(TngFlowEditorComponent);
    fixture.componentRef.setInput('attachmentLayout', 'custom-points');
    fixture.componentRef.setInput('nodes', [
      {
        id: 'source',
        type: 'step',
        name: 'Source',
        position: { x: 0, y: 0 },
        ports: [],
      },
      {
        id: 'target',
        type: 'step',
        name: 'Target',
        position: { x: 320, y: 0 },
        ports: [],
      },
    ]);
    fixture.componentRef.setInput('fitOnInit', false);
    fixture.detectChanges();

    const host = fixture.nativeElement as HTMLElement;
    const customPorts = host.querySelectorAll<HTMLElement>(
      '[data-node-id="source"] > [data-custom-point]',
    );
    expect(customPorts.length).toBe(24);
    expect(
      [...customPorts].filter((port) => port.hasAttribute('data-custom-point-visible')),
    ).toHaveLength(0);
    expect(host.querySelector('f-connection-marker-arrow')).not.toBeNull();
    expect(fixture.componentInstance.useCustomPointsLayout()).toBe(true);
    expect(fixture.componentInstance.useArrowMarkers()).toBe(true);

    fixture.componentRef.setInput('selection', {
      nodeIds: new Set(['source']),
      connectionIds: new Set(),
    });
    fixture.detectChanges();

    const visibleOnSource = [
      ...host.querySelectorAll<HTMLElement>(
        '[data-node-id="source"] > [data-custom-point-visible]',
      ),
    ];
    expect(visibleOnSource).toHaveLength(12);
    expect(visibleOnSource.every((port) => port.getAttribute('data-direction') === 'output')).toBe(
      true,
    );
    expect(
      host.querySelectorAll('[data-node-id="target"] > [data-custom-point-visible]'),
    ).toHaveLength(0);

    fixture.componentRef.setInput('mode', 'inspect');
    fixture.detectChanges();

    expect(host.querySelectorAll('[data-custom-point-visible]')).toHaveLength(0);
  });

  it('limits custom-points visibility to the source and valid target inputs while connecting', () => {
    const fixture = TestBed.createComponent(TngFlowEditorComponent);
    fixture.componentRef.setInput('attachmentLayout', 'custom-points');
    fixture.componentRef.setInput('nodes', [
      {
        id: 'source',
        type: 'step',
        name: 'Source',
        position: { x: 0, y: 0 },
        ports: [],
      },
      {
        id: 'target',
        type: 'step',
        name: 'Target',
        position: { x: 320, y: 0 },
        ports: [],
      },
      {
        id: 'other',
        type: 'step',
        name: 'Other',
        position: { x: 640, y: 0 },
        ports: [],
      },
    ]);
    fixture.componentRef.setInput('connectionValidator', (candidate) =>
      candidate.target.nodeId === 'other'
        ? { valid: false, code: 'blocked', reason: 'Other is not a valid target.' }
        : { valid: true },
    );
    fixture.componentRef.setInput('fitOnInit', false);
    fixture.detectChanges();

    const sourceOutId = createTngFlowConnectorId('source', 'custom-point-out-right-1');
    const editor = fixture.componentInstance as unknown as {
      pointerConnectionSourceId: { set: (value: string | null) => void };
      isCustomPointVisible: (
        nodeId: string,
        port: { id: string; direction: 'input' | 'output'; kind: 'data' },
      ) => boolean;
    };
    editor.pointerConnectionSourceId.set(sourceOutId);

    const sampleOut = {
      id: 'custom-point-out-right-0',
      direction: 'output' as const,
      kind: 'data' as const,
    };
    const sampleIn = {
      id: 'custom-point-in-left-0',
      direction: 'input' as const,
      kind: 'data' as const,
    };

    expect(editor.isCustomPointVisible('source', sampleOut)).toBe(true);
    expect(editor.isCustomPointVisible('target', sampleIn)).toBe(true);
    expect(editor.isCustomPointVisible('other', sampleOut)).toBe(false);
    expect(editor.isCustomPointVisible('other', sampleIn)).toBe(false);

    fixture.detectChanges();

    const host = fixture.nativeElement as HTMLElement;
    const visibleOn = (nodeId: string): HTMLElement[] =>
      Array.from(
        host.querySelectorAll<HTMLElement>(
          `[data-node-id="${nodeId}"] > [data-custom-point-visible]`,
        ),
      );

    expect(
      visibleOn('source').every((port) => port.getAttribute('data-direction') === 'output'),
    ).toBe(true);
    expect(visibleOn('source').length).toBe(12);
    expect(
      visibleOn('target').every((port) => port.getAttribute('data-direction') === 'input'),
    ).toBe(true);
    expect(visibleOn('target').length).toBe(12);
    expect(visibleOn('other')).toHaveLength(0);
  });

  it('emits custom-point endpoint ids on connection create', () => {
    const fixture = TestBed.createComponent(TngFlowEditorComponent);
    const created: TngFlowConnectionCreateRequest[] = [];
    fixture.componentRef.setInput('attachmentLayout', 'custom-points');
    fixture.componentRef.setInput('nodes', [
      {
        id: 'source',
        type: 'step',
        name: 'Source',
        position: { x: 0, y: 0 },
        ports: [],
      },
      {
        id: 'target',
        type: 'step',
        name: 'Target',
        position: { x: 320, y: 0 },
        ports: [],
      },
    ]);
    fixture.componentRef.setInput('fitOnInit', false);
    fixture.componentInstance.connectionCreateRequested.subscribe((request) =>
      created.push(request),
    );
    fixture.detectChanges();

    (
      fixture.componentInstance as unknown as {
        onCreateConnection: (event: {
          sourceId: string;
          targetId: string;
          dropPosition: { x: number; y: number };
        }) => void;
      }
    ).onCreateConnection({
      sourceId: createTngFlowConnectorId('source', 'custom-point-out-right-1'),
      targetId: createTngFlowConnectorId('target', 'custom-point-in-left-1'),
      dropPosition: { x: 10, y: 10 },
    });

    expect(created).toEqual([
      {
        source: { nodeId: 'source', portId: 'custom-point-out-right-1' },
        target: { nodeId: 'target', portId: 'custom-point-in-left-1' },
        routing: { type: 'bezier', offset: 12, radius: 8 },
      },
    ]);
  });

  it('keeps custom-point sides fixed when a node moves', () => {
    const fixture = TestBed.createComponent(TngFlowEditorComponent);
    fixture.componentRef.setInput('attachmentLayout', 'custom-points');
    fixture.componentRef.setInput('nodes', [
      {
        id: 'source',
        type: 'step',
        name: 'Source',
        position: { x: 0, y: 0 },
        ports: [
          {
            id: 'custom-point-out-right-1',
            direction: 'output',
            kind: 'data',
            side: 'right',
          },
        ],
      },
      {
        id: 'target',
        type: 'step',
        name: 'Target',
        position: { x: 320, y: 0 },
        ports: [
          {
            id: 'custom-point-in-left-1',
            direction: 'input',
            kind: 'data',
            side: 'left',
          },
        ],
      },
    ]);
    fixture.componentRef.setInput('connections', [
      {
        id: 'edge',
        source: { nodeId: 'source', portId: 'custom-point-out-right-1' },
        target: { nodeId: 'target', portId: 'custom-point-in-left-1' },
      },
    ]);
    fixture.componentRef.setInput('fitOnInit', false);
    fixture.detectChanges();

    const host = fixture.nativeElement as HTMLElement;
    const sourcePort = host.querySelector<HTMLElement>(
      '[data-node-id="source"] > [data-port-id="custom-point-out-right-1"]',
    );
    expect(sourcePort?.getAttribute('data-side')).toBe('right');

    (
      fixture.componentInstance as unknown as {
        provisionalPositions: { set: (value: Map<string, { x: number; y: number }>) => void };
      }
    ).provisionalPositions.set(new Map([['source', { x: 0, y: 400 }]]));
    fixture.detectChanges();

    expect(
      host
        .querySelector<HTMLElement>(
          '[data-node-id="source"] > [data-port-id="custom-point-out-right-1"]',
        )
        ?.getAttribute('data-side'),
    ).toBe('right');
  });
});
