import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { describe, expect, it } from 'vitest';
import { TngFlowExecutionInspectorComponent } from './tng-flow-execution-inspector.component';
import type { TngFlowDefinition } from '../../../lib/types/tng-flow.types';
import type { TngFlowRunExecutionSnapshot } from '../../model/tng-flow-execution.types';

const definition: TngFlowDefinition = {
  id: 'workflow',
  nodes: [{ id: 'task', type: 'task', name: 'Task', position: { x: 0, y: 0 } }],
  connections: [],
};

const snapshot: TngFlowRunExecutionSnapshot = {
  id: 'run',
  definitionId: 'workflow',
  phase: 'active',
  nodeExecutions: [
    {
      id: 'attempt-1',
      nodeId: 'task',
      activationId: 'activation-1',
      attempt: 1,
      phase: 'failed',
    },
    {
      id: 'attempt-2',
      nodeId: 'task',
      activationId: 'activation-1',
      attempt: 2,
      phase: 'active',
      statusMessage: 'Retrying',
    },
  ],
};

@Component({
  imports: [TngFlowExecutionInspectorComponent],
  template: `
    <tng-flow-execution-inspector
      [definition]="definition"
      [snapshot]="snapshot"
      inspectedNodeId="task"
      (selectedExecutionIdChange)="selectedExecutionId = $event"
    />
  `,
})
class InspectorHost {
  protected readonly definition = definition;
  protected readonly snapshot = snapshot;
  public selectedExecutionId: string | null = null;
}

describe('TngFlowExecutionInspectorComponent', () => {
  it('renders grouped attempts and emits selected execution changes', () => {
    const fixture = TestBed.createComponent(InspectorHost);
    fixture.detectChanges();

    const attempts = fixture.debugElement.queryAll(
      By.css('.tng-flow-execution-inspector__attempt'),
    );
    expect(attempts).toHaveLength(2);
    attempts[0].nativeElement.click();
    fixture.detectChanges();

    expect(fixture.componentInstance.selectedExecutionId).toBe('attempt-2');
  });
});
