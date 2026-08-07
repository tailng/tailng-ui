import { Component, HostBinding, input } from '@angular/core';
import { TngTabs as TngTabsPrimitive } from '@tailng-ui/primitives';

@Component({
  selector: 'tng-tabs',
  hostDirectives: [
    {
      directive: TngTabsPrimitive,
      inputs: [
        'value',
        'defaultValue',
        'activation',
        'orientation',
        'scrollButtons',
        'loop',
        'dir',
        'disabled',
        'lazy',
        'keepAlive',
      ],
      outputs: ['valueChange', 'tabChange', 'focusChange'],
    },
  ],
  templateUrl: './tng-tabs.component.html',
  styleUrl: './tng-tabs.component.css',
  exportAs: 'tngTabsComponent',
})
export class TngTabsComponent {
  public readonly ariaLabel = input<string>('Tabs');

  @HostBinding('attr.aria-label')
  protected get hostAriaLabel(): string {
    return this.ariaLabel();
  }
}
export { TngTabsComponent as TngTabs };
