import { Component, signal, viewChild } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { describe, expect, it } from 'vitest';
import { TngFlowExecutionGraphComponent } from './tng-flow-execution-graph.component';
import { TngFlowEditorComponent } from '../../../lib/editor/tng-flow-editor.component';
import type { TngFlowConnectionRoutingChangeRequest } from '../../../lib/types/tng-flow-connection.types';
import type { TngFlowDefinition, TngFlowSelection } from '../../../lib/types/tng-flow.types';
import type { TngFlowEditorMode, TngFlowNodesMovedEvent } from '../../../lib/types/tng-flow.types';
import type { TngFlowRunExecutionSnapshot } from '../../model/tng-flow-execution.types';

const definition: TngFlowDefinition = {
  id: 'workflow',
  nodes: [
    { id: 'start', type: 'trigger', name: 'Start', position: { x: 0, y: 0 } },
    { id: 'task', type: 'task', name: 'Task', position: { x: 220, y: 0 } },
  ],
  connections: [],
};

const snapshot: TngFlowRunExecutionSnapshot = {
  id: 'run',
  definitionId: 'workflow',
  phase: 'active',
  nodeExecutions: [
    { id: 'exec-task', nodeId: 'task', activationId: 'a1', attempt: 1, phase: 'active' },
  ],
};

@Component({
  imports: [TngFlowExecutionGraphComponent],
  template: `
    <tng-flow-execution-graph
      [definition]="definition"
      [snapshot]="snapshot"
      [mode]="mode()"
      (nodesMoved)="moved = $event"
      (connectionRoutingChangeRequested)="routingChange = $event"
      (selectionChange)="events.push('selection')"
      (inspectedNodeIdChange)="events.push('inspected:' + $event)"
      (selectedExecutionIdChange)="events.push('execution:' + $event)"
    />
  `,
})
class GraphHost {
  public readonly graph = viewChild.required(TngFlowExecutionGraphComponent);
  public readonly mode = signal<TngFlowEditorMode>('inspect');
  public moved: TngFlowNodesMovedEvent | null = null;
  public routingChange: TngFlowConnectionRoutingChangeRequest | null = null;
  protected readonly definition = definition;
  protected readonly snapshot = snapshot;
  public readonly events: string[] = [];
}

describe('TngFlowExecutionGraphComponent', () => {
  it('emits graph selection, inspected node and execution changes in order', () => {
    const fixture = TestBed.createComponent(GraphHost);
    fixture.detectChanges();

    const selection: TngFlowSelection = {
      nodeIds: new Set(['task']),
      connectionIds: new Set(),
    };
    fixture.componentInstance.graph().onEditorSelectionChange(selection);

    expect(fixture.componentInstance.events).toEqual([
      'selection',
      'inspected:task',
      'execution:exec-task',
    ]);
  });

  it('uses mode as the only interaction control and forwards edit movement', () => {
    const fixture = TestBed.createComponent(GraphHost);
    fixture.componentInstance.mode.set('edit');
    fixture.detectChanges();

    const editor = fixture.debugElement.query(By.directive(TngFlowEditorComponent))
      .componentInstance as TngFlowEditorComponent;
    const movement: TngFlowNodesMovedEvent = {
      nodes: [{ id: 'task', position: { x: 300, y: 120 } }],
    };
    editor.nodesMoved.emit(movement);
    const routingChange: TngFlowConnectionRoutingChangeRequest = {
      connectionIds: ['connection'],
      type: 'straight',
      source: 'controls',
    };
    editor.connectionRoutingChangeRequested.emit(routingChange);

    expect(
      (fixture.nativeElement as HTMLElement)
        .querySelector('.tng-flow-editor')
        ?.getAttribute('data-mode'),
    ).toBe('edit');
    expect(fixture.componentInstance.moved).toEqual(movement);
    expect(fixture.componentInstance.routingChange).toEqual(routingChange);
    expect('readonly' in fixture.componentInstance.graph()).toBe(false);
  });
});
