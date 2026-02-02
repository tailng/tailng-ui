import {
  Directive,
  HostBinding,
  HostListener,
  computed,
  input,
  inject,
} from '@angular/core';
import { TNG_TABLE } from '../core/tokens/table.token';
import type { TngSortDir } from '../core/types';

@Directive({
  selector: '[tngSortHeader]',
  standalone: true,
})
export class TngSortHeaderDirective {
  readonly colId = input.required<string>();

  private readonly table = inject(TNG_TABLE);

  readonly direction = computed<TngSortDir>(() => this.table.directionFor(this.colId()));
  readonly isSorted = computed(() => this.direction() !== '');

  // a11y
  @HostBinding('attr.role') role = 'button';
  @HostBinding('attr.tabindex') tabindex = 0;

  @HostBinding('attr.aria-sort')
  get ariaSort(): 'none' | 'ascending' | 'descending' {
    const dir = this.direction();
    if (dir === 'asc') return 'ascending';
    if (dir === 'desc') return 'descending';
    return 'none';
  }

  @HostListener('click')
  onClick() {
    this.table.toggleSort(this.colId());
  }

  @HostListener('keydown.enter', ['$event'])
  @HostListener('keydown.space', ['$event'])
  onKey(ev: KeyboardEvent) {
    ev.preventDefault();
    this.table.toggleSort(this.colId());
  }
}
