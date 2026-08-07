import { Component, HostBinding, input } from '@angular/core';
import { TngMenubar as TngMenubarPrimitive } from '@tailng-ui/primitives';

@Component({
  selector: 'tng-menubar',
  hostDirectives: [
    {
      directive: TngMenubarPrimitive,
      inputs: ['loop'],
    },
  ],
  templateUrl: './tng-menubar.component.html',
  styleUrl: './tng-menubar.component.css',
  exportAs: 'tngMenubarComponent',
})
export class TngMenubarComponent {
  public readonly ariaLabel = input<string>('Menubar');

  @HostBinding('attr.aria-label')
  protected get hostAriaLabel(): string {
    return this.ariaLabel();
  }
}
export { TngMenubarComponent as TngMenubar };
