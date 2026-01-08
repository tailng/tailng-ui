import { CommonModule } from '@angular/common';
import {
  Component,
  computed,
  ContentChild,
  ElementRef,
  input,
  output,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { OptionTplContext } from '@tailng/cdk';

@Component({
  selector: 'tng-option-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './option-list.component.html',
})
export class TailngOptionListComponent<T> {
  @ViewChild('listbox', { static: true })
  listbox!: ElementRef<HTMLElement>;

  readonly optionTemplate = input<TemplateRef<OptionTplContext<T>> | null>(null);

  readonly items = input<T[]>([]);
  readonly activeIndex = input<number>(-1);

  readonly displayWith = input<(item: T) => string>((v) => String(v));
  readonly emptyText = input<string>('No results');

  readonly containerKlass = input<string>('py-1 overflow-auto max-h-60');
  readonly optionKlass = input<string>('px-3 py-2 text-sm cursor-pointer select-none');
  readonly optionActiveKlass = input<string>('bg-primary text-on-primary');
  readonly optionInactiveKlass = input<string>('bg-background text-text');
  readonly emptyKlass = input<string>('px-3 py-2 text-sm text-disable');

  @ContentChild(TemplateRef, { descendants: true })
  optionTpl?: TemplateRef<OptionTplContext<T>>;

  readonly optionMouseDown = output<{ item: T; index: number }>();
  readonly optionHover = output<number>();

  readonly hasItems = computed(() => (this.items()?.length ?? 0) > 0);

  get tpl(): TemplateRef<OptionTplContext<T>> | undefined {
    return this.optionTemplate() ?? this.optionTpl;
  }
  

  display(item: T) {
    return this.displayWith()(item);
  }

  isActive(i: number) {
    return i === this.activeIndex();
  }

  optionClasses(i: number) {
    const state = this.isActive(i) ? this.optionActiveKlass() : this.optionInactiveKlass();
    return `${this.optionKlass()} ${state}`.trim();
  }

  onMouseDown(item: T, index: number, ev: MouseEvent) {
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
