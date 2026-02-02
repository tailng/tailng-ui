import { Directive, HostListener, inject } from '@angular/core';
import { TailngMenuComponent } from './menu.component';

@Directive({
  selector: '[tngMenuItem]',
  standalone: true,
})
export class TailngMenuItemDirective {
  private readonly menu = inject(TailngMenuComponent, { optional: true });

  @HostListener('click')
  onClick(): void {
    this.menu?.requestCloseOnSelection();
  }
}