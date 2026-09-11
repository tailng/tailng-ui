import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { describe, expect, it } from 'vitest';
import { TngFlowNodePaletteComponent } from './tng-flow-node-palette.component';
import type { TngFlowPaletteItem, TngFlowPaletteItemActivation } from '../types/tng-flow.types';

const items: readonly TngFlowPaletteItem[] = [
  {
    id: 'task',
    type: 'task',
    name: 'Task',
    description: 'Run one step',
  },
];

@Component({
  imports: [TngFlowNodePaletteComponent],
  template: ` <tng-flow-node-palette [items]="items" (itemActivated)="activation = $event" /> `,
})
class NodePaletteHost {
  protected readonly items = items;
  public activation: TngFlowPaletteItemActivation | null = null;
}

describe(TngFlowNodePaletteComponent.name, () => {
  it('renders palette items and emits activations', () => {
    const fixture = TestBed.createComponent(NodePaletteHost);
    fixture.detectChanges();

    const button = fixture.nativeElement.querySelector('button') as HTMLButtonElement | null;
    button?.dispatchEvent(new MouseEvent('click', { bubbles: true, detail: 1 }));

    expect(button?.textContent).toContain('Task');
    expect(fixture.componentInstance.activation).toEqual({
      item: items[0],
      source: 'pointer',
    });
  });
});
