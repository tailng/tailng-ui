import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { describe, expect, it } from 'vitest';
import '../../../../styles.css';
import { TngFlowExecutionViewerComponent } from './tng-flow-execution-viewer.component';
import type { TngFlowDefinition } from '../../../lib/types/tng-flow.types';
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
      [definition]="definition"
      [snapshot]="snapshot()"
      [showControls]="false"
      [fitOnInit]="false"
    />
  `,
})
class ExecutionViewerBrowserHost {
  protected readonly definition = definition;
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
}

describe('TngFlowExecutionViewerComponent browser contracts', () => {
  it('renders the graph and inspector with explicit progress semantics', async () => {
    const fixture = TestBed.createComponent(ExecutionViewerBrowserHost);
    fixture.detectChanges();
    await nextFrame();

    const host = fixture.nativeElement as HTMLElement;
    expect(host.querySelector('tng-flow-editor')).not.toBeNull();
    expect(host.querySelector('tng-flow-execution-inspector')).not.toBeNull();
    expect(host.querySelector('tng-progress-bar')).toBeNull();

    fixture.componentInstance.snapshot.update((snapshot) => ({
      ...snapshot,
      nodeExecutions: [
        {
          id: 'task-execution',
          nodeId: 'task',
          activationId: 'activation',
          attempt: 1,
          phase: 'active',
          progress: null,
        },
      ],
    }));
    fixture.detectChanges();
    await nextFrame();

    expect(host.querySelector('tng-progress-bar')).not.toBeNull();
  });
});

function nextFrame(): Promise<void> {
  return new Promise((resolve) => requestAnimationFrame(() => resolve()));
}
