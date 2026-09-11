import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { describe, expect, it } from 'vitest';
import '../../../../styles.css';
import { TngFlowExecutionViewerComponent } from './tng-flow-execution-viewer.component';
import type { TngFlowDefinition } from '../../../lib/types/tng-flow.types';
import type { TngFlowNodesMovedEvent, TngFlowSelection } from '../../../lib/types/tng-flow.types';
import type { TngFlowRunExecutionSnapshot } from '../../model/tng-flow-execution.types';

const definition: TngFlowDefinition = Object.freeze({
  id: 'execution-browser',
  nodes: Object.freeze([
    Object.freeze({
      id: 'task',
      type: 'task',
      name: 'Task',
      position: Object.freeze({ x: 80, y: 80 }),
      ports: Object.freeze([]),
    }),
  ]),
  connections: Object.freeze([]),
});

@Component({
  imports: [TngFlowExecutionViewerComponent],
  template: `
    <tng-flow-execution-viewer
      style="display: block; width: 960px; height: 520px"
      [definition]="definition()"
      [snapshot]="snapshot()"
      [selection]="selection"
      mode="edit"
      [keyboardOptions]="keyboardOptions"
      [snapToGrid]="true"
      [gridSize]="16"
      [showControls]="false"
      [fitOnInit]="false"
      (nodesMoved)="onNodesMoved($event)"
    />
  `,
})
class ExecutionViewerBrowserHost {
  public readonly definition = signal<TngFlowDefinition>(definition);
  protected readonly keyboardOptions = { moveStep: 16, largeMoveStep: 160 };
  protected readonly selection: TngFlowSelection = {
    nodeIds: new Set(['task']),
    connectionIds: new Set(),
  };
  public readonly snapshot = signal<TngFlowRunExecutionSnapshot>({
    id: 'run',
    definitionId: 'execution-browser',
    phase: 'active',
    nodeExecutions: Object.freeze([
      Object.freeze({
        id: 'task-execution',
        nodeId: 'task',
        activationId: 'activation',
        attempt: 1,
        phase: 'active',
      }),
    ]),
  });

  protected onNodesMoved(event: TngFlowNodesMovedEvent): void {
    const positions = new Map(event.nodes.map((move) => [move.id, move.position]));
    this.definition.update((current) => ({
      ...current,
      nodes: current.nodes.map((node) => {
        const position = positions.get(node.id);
        return position === undefined ? node : { ...node, position };
      }),
    }));
  }
}

describe('TngFlowExecutionViewerComponent browser contracts', () => {
  it('renders dynamic progress from execution status', async () => {
    const fixture = TestBed.createComponent(ExecutionViewerBrowserHost);
    fixture.detectChanges();
    await nextFrame();

    const host = fixture.nativeElement as HTMLElement;
    expect(host.querySelector('tng-flow-editor')).not.toBeNull();
    expect(host.querySelector('tng-flow-execution-inspector')).not.toBeNull();
    let progressRoot = host.querySelector<HTMLElement>('[data-slot="progress-bar"]');
    expect(progressRoot?.getAttribute('data-state')).toBe('indeterminate');
    expect(progressRoot?.getAttribute('aria-valuenow')).toBeNull();

    fixture.componentInstance.snapshot.update((snapshot) => ({
      ...snapshot,
      nodeExecutions: [
        {
          id: 'task-execution',
          nodeId: 'task',
          activationId: 'activation',
          attempt: 1,
          phase: 'succeeded',
          statusMessage: 'Completed successfully',
        },
      ],
    }));
    fixture.detectChanges();
    await nextFrame();

    progressRoot = host.querySelector<HTMLElement>('[data-slot="progress-bar"]');
    const node = host.querySelector<HTMLElement>('tng-flow-node');
    expect(progressRoot?.getAttribute('data-state')).toBe('determinate');
    expect(progressRoot?.getAttribute('aria-valuenow')).toBe('100');
    expect(host.querySelector('.tng-flow-node__progress-label')).toBeNull();
    expect(node?.textContent).not.toContain('Completed successfully');
  });

  it('forwards edit-mode movement and persists the controlled node position', async () => {
    const fixture = TestBed.createComponent(ExecutionViewerBrowserHost);
    fixture.detectChanges();
    await fixture.whenStable();
    await nextFrame();

    const handle = (fixture.nativeElement as HTMLElement).querySelector<HTMLElement>(
      '[data-node-id="task"] .tng-flow-editor__drag-handle',
    );
    if (handle === null) {
      throw new Error('Expected edit mode to render a node drag handle.');
    }
    const bounds = handle.getBoundingClientRect();
    const start = { x: bounds.left + bounds.width / 2, y: bounds.top + bounds.height / 2 };
    handle.dispatchEvent(mouseEvent('mousedown', start.x, start.y, 1));
    document.dispatchEvent(mouseEvent('mousemove', start.x + 16, start.y, 1));
    document.dispatchEvent(pointerEvent('pointerup', start.x + 16, start.y, 0));
    await fixture.whenStable();

    expect(fixture.componentInstance.definition().nodes[0]?.position).toEqual({ x: 96, y: 80 });
    expect(definition.nodes[0]?.position).toEqual({ x: 80, y: 80 });
  });
});

function pointerEvent(
  type: string,
  clientX: number,
  clientY: number,
  buttons: number,
): PointerEvent {
  return new PointerEvent(type, {
    bubbles: true,
    cancelable: true,
    button: type === 'pointerdown' || type === 'pointerup' ? 0 : -1,
    buttons,
    clientX,
    clientY,
    isPrimary: true,
    pointerId: 1,
    pointerType: 'mouse',
  });
}

function mouseEvent(type: string, clientX: number, clientY: number, buttons: number): MouseEvent {
  return new MouseEvent(type, {
    bubbles: true,
    cancelable: true,
    button: type === 'mousedown' ? 0 : -1,
    buttons,
    clientX,
    clientY,
  });
}

function nextFrame(): Promise<void> {
  return new Promise((resolve) => requestAnimationFrame(() => resolve()));
}
