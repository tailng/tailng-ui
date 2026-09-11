import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { describe, expect, it } from 'vitest';
import type { TngFlowDefinition } from '../../../lib/types/tng-flow.types';
import type { TngFlowNodePropertyChangeRequest } from '../../model/tng-flow-execution.types';
import { TngFlowNodePropertiesDataTemplateDirective } from '../../templates/tng-flow-execution-templates';
import { TngFlowNodePropertiesComponent } from './tng-flow-node-properties.component';

type NodeData = Readonly<{ queue: string }>;

const definition: TngFlowDefinition<NodeData> = {
  id: 'workflow',
  nodes: [
    {
      id: 'task',
      type: 'task',
      name: 'Task',
      description: 'Review record',
      position: { x: 0, y: 0 },
      data: { queue: 'finance' },
      ports: [
        { id: 'in', direction: 'input', kind: 'data', label: 'Request' },
        { id: 'out', direction: 'output', kind: 'control', label: 'Approved' },
      ],
    },
  ],
  connections: [],
};

@Component({
  imports: [TngFlowNodePropertiesComponent],
  template: `
    <tng-flow-node-properties
      [definition]="definition"
      inspectedNodeId="task"
      (nodeChangeRequested)="requests.push($event)"
    />
  `,
})
class NodePropertiesHost {
  protected readonly definition = definition;
  public readonly requests: TngFlowNodePropertyChangeRequest<NodeData>[] = [];
}

@Component({
  imports: [TngFlowNodePropertiesComponent, TngFlowNodePropertiesDataTemplateDirective],
  template: `
    <tng-flow-node-properties
      [definition]="definition"
      inspectedNodeId="task"
      (nodeChangeRequested)="requests.push($event)"
    >
      <ng-template
        tngFlowNodePropertiesData
        let-data="data"
        let-requestDataChange="requestDataChange"
      >
        <button type="button" (click)="requestDataChange({ queue: data.queue + '-vip' })">
          Update data
        </button>
      </ng-template>
    </tng-flow-node-properties>
  `,
})
class NodePropertiesTemplateHost {
  protected readonly definition = definition;
  public readonly requests: TngFlowNodePropertyChangeRequest<NodeData>[] = [];
}

describe('TngFlowNodePropertiesComponent', () => {
  it('emits immutable node property change requests for built-in fields', () => {
    const fixture = TestBed.createComponent(NodePropertiesHost);
    fixture.detectChanges();

    const input = fixture.debugElement.query(By.css('input[type="text"]'))
      .nativeElement as HTMLInputElement;
    input.value = 'Updated task';
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    expect(fixture.componentInstance.requests).toEqual([
      {
        node: definition.nodes[0],
        nodeId: 'task',
        changes: { name: 'Updated task' },
        source: 'field',
      },
    ]);
  });

  it('lets a projected data template request data changes', () => {
    const fixture = TestBed.createComponent(NodePropertiesTemplateHost);
    fixture.detectChanges();

    fixture.debugElement.query(By.css('button')).nativeElement.click();
    fixture.detectChanges();

    expect(fixture.componentInstance.requests).toEqual([
      {
        node: definition.nodes[0],
        nodeId: 'task',
        changes: { data: { queue: 'finance-vip' } },
        source: 'data-template',
      },
    ]);
  });
});
