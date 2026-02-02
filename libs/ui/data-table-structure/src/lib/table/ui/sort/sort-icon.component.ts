import { Component, inject } from '@angular/core';
import { TngSortHeaderDirective } from '../../directives/sort-header.directive';

@Component({
  selector: 'tng-sort-icon',
  standalone: true,
  template: `
    @switch (dir()) {
      @case ('asc') { <span aria-hidden="true">▲</span> }
      @case ('desc') { <span aria-hidden="true">▼</span> }
      @default { <span aria-hidden="true" class="opacity-40">↕</span> }
    }
  `,
})
export class TngSortIcon {
  private readonly host = inject(TngSortHeaderDirective);
  readonly dir = this.host.direction;
}