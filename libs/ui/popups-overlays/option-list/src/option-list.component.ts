import { Component, computed, ElementRef, input, output, ViewChild } from '@angular/core';

@Component({
  selector: 'tng-option-list',
  standalone: true,
  templateUrl: './option-list.component.html',
})
export class TailngOptionListComponent<T> {

  @ViewChild('listbox', { static: true })
  listbox!: ElementRef<HTMLElement>;
  
  items = input<T[]>([]);
  activeIndex = input<number>(-1);

  // how to display an item
  displayWith = input<(item: T) => string>((v) => String(v));

  // texts
  emptyText = input<string>('No results');

  // events
  optionMouseDown = output<{ item: T; index: number }>();
  optionHover = output<number>();

  readonly hasItems = computed(() => this.items().length > 0);

  display(item: T) {
    return this.displayWith()(item);
  }

  onMouseDown(item: T, index: number, ev: MouseEvent) {
    // Important: mousedown beats input blur
    ev.preventDefault();
    this.optionMouseDown.emit({ item, index });
  }

  onMouseEnter(index: number) {
    this.optionHover.emit(index);
  }

  getContainer(): HTMLElement {
    return this.listbox.nativeElement;
  }
}
