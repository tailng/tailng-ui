import { Component, viewChild } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { describe, expect, it } from 'vitest';
import { TngFlowExecutionViewerComponent } from './tng-flow-execution-viewer.component';
import type { TngFlowDefinition, TngFlowSelection } from '../../../lib/types/tng-flow.types';
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
  imports: [TngFlowExecutionViewerComponent],
  template: `
    <tng-flow-execution-viewer
      [definition]="definition"
      [snapshot]="snapshot"
      [state]="'loading'"
      (selectionChange)="events.push('selection')"
      (inspectedNodeIdChange)="events.push('inspected:' + $event)"
      (selectedExecutionIdChange)="events.push('execution:' + $event)"
    />
  `,
})
class ViewerHost {
  public readonly viewer = viewChild.required(TngFlowExecutionViewerComponent);
  protected readonly definition = definition;
  protected readonly snapshot = snapshot;
  public readonly events: string[] = [];
}

describe('TngFlowExecutionViewerComponent', () => {
  it('emits graph selection, inspected node and execution changes in order', () => {
    const fixture = TestBed.createComponent(ViewerHost);
    fixture.detectChanges();

    const selection: TngFlowSelection = {
      nodeIds: new Set(['task']),
      connectionIds: new Set(),
    };
    fixture.componentInstance.viewer().onEditorSelectionChange(selection);

    expect(fixture.componentInstance.events).toEqual([
      'selection',
      'inspected:task',
      'execution:exec-task',
    ]);
  });
});
