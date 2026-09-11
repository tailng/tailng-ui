import { Component, viewChild } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { describe, expect, it } from 'vitest';
import { TngFlowWorkbenchComponent } from './tng-flow-workbench.component';
import type {
  TngFlowDefinition,
  TngFlowNodeCreateRequest,
  TngFlowPaletteItem,
  TngFlowSelection,
} from '../../../lib/types/tng-flow.types';
import type {
  TngFlowRunExecutionSnapshot,
  TngFlowWorkbenchMode,
} from '../../model/tng-flow-execution.types';
import { TngFlowExecutionGraphComponent } from '../graph/tng-flow-execution-graph.component';

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

const paletteItems: readonly TngFlowPaletteItem[] = [
  { id: 'task-template', type: 'task', name: 'Task template' },
];

@Component({
  imports: [TngFlowWorkbenchComponent],
  template: `
    <tng-flow-workbench
      style="display: block; width: 960px; height: 520px"
      [mode]="mode"
      [definition]="definition"
      [snapshot]="snapshot"
      [selection]="selection"
      [paletteItems]="paletteItems"
      [fitOnInit]="false"
      [showPaletteToggle]="showPaletteToggle"
      [showDetailsToggle]="showDetailsToggle"
      (nodeCreateRequested)="nodeCreateRequest = $event"
      (selectionChange)="events.push('selection')"
      (inspectedNodeIdChange)="events.push('inspected:' + $event)"
      (selectedExecutionIdChange)="events.push('execution:' + $event)"
    />
  `,
})
class WorkbenchHost {
  public readonly workbench = viewChild.required(TngFlowWorkbenchComponent);
  public mode: TngFlowWorkbenchMode = 'edit';
  public showPaletteToggle = true;
  public showDetailsToggle = true;
  protected readonly definition = definition;
  protected readonly snapshot = snapshot;
  protected readonly selection: TngFlowSelection = {
    nodeIds: new Set(),
    connectionIds: new Set(),
  };
  protected readonly paletteItems = paletteItems;
  public nodeCreateRequest: TngFlowNodeCreateRequest | null = null;
  public readonly events: string[] = [];
}

describe(TngFlowWorkbenchComponent.name, () => {
  it('renders a palette in create and edit modes and emits controlled node creation requests', () => {
    const fixture = TestBed.createComponent(WorkbenchHost);
    fixture.detectChanges();

    const paletteItem = fixture.nativeElement.querySelector(
      '.tng-flow-node-palette__item',
    ) as HTMLButtonElement | null;
    paletteItem?.dispatchEvent(new MouseEvent('click', { bubbles: true, detail: 1 }));

    expect(fixture.nativeElement.querySelector('tng-flow-node-palette')).not.toBeNull();
    expect(fixture.componentInstance.nodeCreateRequest).toMatchObject({
      item: paletteItems[0],
      position: { x: 0, y: 0 },
      source: 'pointer',
    });
  });

  it('uses execution details in live mode and hides the creation palette', () => {
    const fixture = TestBed.createComponent(WorkbenchHost);
    fixture.componentInstance.mode = 'live';
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('tng-flow-node-palette')).toBeNull();
    expect(fixture.nativeElement.querySelector('tng-flow-execution-inspector')).not.toBeNull();
    expect(fixture.nativeElement.querySelector('tng-flow-node-properties')).toBeNull();
  });

  it('uses node properties for inspection mode by default', () => {
    const fixture = TestBed.createComponent(WorkbenchHost);
    fixture.componentInstance.mode = 'inspect';
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('tng-flow-node-properties')).not.toBeNull();
    expect(fixture.nativeElement.querySelector('tng-flow-execution-inspector')).toBeNull();
  });

  it('keeps controlled selection reconciliation available through the workbench facade', () => {
    const fixture = TestBed.createComponent(WorkbenchHost);
    fixture.detectChanges();

    const selection: TngFlowSelection = {
      nodeIds: new Set(['task']),
      connectionIds: new Set(),
    };
    fixture.componentInstance.workbench().onEditorSelectionChange(selection);

    expect(fixture.componentInstance.events).toEqual([
      'selection',
      'inspected:task',
      'execution:exec-task',
    ]);
  });

  it('passes create and edit modes to the underlying execution graph as edit mode', () => {
    const fixture = TestBed.createComponent(WorkbenchHost);
    fixture.detectChanges();

    const graph = fixture.debugElement.query(By.directive(TngFlowExecutionGraphComponent))
      .componentInstance as TngFlowExecutionGraphComponent;

    expect(graph.mode()).toBe('edit');
  });

  it('can hide built-in panel toggle buttons for API-driven toolbars', () => {
    const fixture = TestBed.createComponent(WorkbenchHost);
    fixture.componentInstance.showPaletteToggle = false;
    fixture.componentInstance.showDetailsToggle = false;
    fixture.detectChanges();

    expect(
      fixture.nativeElement.querySelector('.tng-flow-workbench__actions tng-button'),
    ).toBeNull();
  });
});
