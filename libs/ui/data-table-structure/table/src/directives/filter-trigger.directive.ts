
import {
  Directive,
  ElementRef,
  HostBinding,
  HostListener,
  computed,
  inject,
  input,
} from '@angular/core';
import { TNG_TABLE } from '../core/table.token';

@Directive({
  selector: '[tngFilterTrigger]',
  standalone: true,
})
export class TailngFilterTriggerDirective {
  readonly colId = input.required<string>();

  private readonly table = inject(TNG_TABLE);
  private readonly el = inject(ElementRef<HTMLElement>);

  readonly isFiltered = computed(() => this.table.isFiltered(this.colId()));
  readonly isOpen = computed(() => this.table.isFilterOpenFor(this.colId()));

  // a11y
  @HostBinding('attr.role') role = 'button';
  @HostBinding('attr.tabindex') tabindex = 0;
  @HostBinding('attr.aria-haspopup') ariaHaspopup: 'dialog' | 'menu' = 'dialog';

  @HostBinding('attr.aria-expanded')
  get ariaExpanded(): 'true' | 'false' {
    return this.isOpen() ? 'true' : 'false';
  }

  @HostListener('click')
  onClick(): void {
    this.table.toggleFilter(this.colId(), this.el.nativeElement);
  }

  @HostListener('keydown.enter', ['$event'])
  @HostListener('keydown.space', ['$event'])
  onKey(ev: KeyboardEvent): void {
    ev.preventDefault();
    this.table.toggleFilter(this.colId(), this.el.nativeElement);
  }
}
