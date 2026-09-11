import { ChangeDetectionStrategy, Component, booleanAttribute, input, output } from '@angular/core';
import { TngFlowPaletteItemDirective } from '../palette-item/tng-flow-palette-item.directive';
import type { TngFlowPaletteItem, TngFlowPaletteItemActivation } from '../types/tng-flow.types';

@Component({
  selector: 'tng-flow-node-palette',
  imports: [TngFlowPaletteItemDirective],
  templateUrl: './tng-flow-node-palette.component.html',
  styleUrl: './tng-flow-node-palette.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  exportAs: 'tngFlowNodePalette',
  host: {
    class: 'tng-flow-node-palette',
  },
})
export class TngFlowNodePaletteComponent<TData = unknown> {
  public readonly items = input<readonly TngFlowPaletteItem<TData>[]>([]);
  public readonly ariaLabel = input<string>('Flow node palette');
  public readonly disabled = input<boolean, boolean | string>(false, {
    transform: booleanAttribute,
  });
  public readonly emptyMessage = input<string>('No nodes available');

  public readonly itemActivated = output<TngFlowPaletteItemActivation<TData>>();

  protected onItemActivated(event: TngFlowPaletteItemActivation<TData>): void {
    this.itemActivated.emit(event);
  }

  protected itemIcon(item: TngFlowPaletteItem<TData>): string {
    return item.icon ?? item.name.slice(0, 1).toUpperCase();
  }
}
