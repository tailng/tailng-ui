import { Directive, HostListener, inject } from '@angular/core';
import { TngMenu } from './menu.component';

@Directive({
  selector: '[tngMenuItem]',
  standalone: true,
})
export class TngMenuItem {
  private readonly menu = inject(TngMenu, { optional: true });

  @HostListener('click')
  onClick(): void {
    this.menu?.requestCloseOnSelection();
  }
}
