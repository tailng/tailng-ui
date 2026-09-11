import { Component, viewChild } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { describe, expect, it } from 'vitest';
import type { TngFlowDefinition, TngFlowSelection } from '../../../lib/types/tng-flow.types';
import type { TngFlowRunExecutionSnapshot } from '../../model/tng-flow-execution.types';
import { TngFlowExecutionGraphComponent } from './tng-flow-execution-graph.component';

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
      (selectionChange)="events.push('selection')"
      (inspectedNodeIdChange)="events.push('inspected:' + $event)"
      (selectedExecutionIdChange)="events.push('execution:' + $event)"
    />
  `,
})
class GraphHost {
  public readonly graph = viewChild.required(TngFlowExecutionGraphComponent);
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
});
