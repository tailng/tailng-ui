import {
  Component,
  HostBinding,
  HostListener,
  inject,
  input,
} from '@angular/core';
import { booleanAttribute } from '@angular/core';
import { TailngTabsComponent } from './tabs.component';

@Component({
  selector: 'tng-tab',
  standalone: true,
  template: `<ng-content />`,
})
export class TailngTabComponent {
  private readonly tabs = inject(TailngTabsComponent);

  value = input.required<string>();
  disabled = input(false, { transform: booleanAttribute });

  tabKlass = input<string>(
    'px-3 py-2 text-sm font-medium border-b-2 border-transparent'
  );
  activeKlass = input<string>('border-primary text-primary');
  inactiveKlass = input<string>('text-muted-foreground');
  disabledKlass = input<string>('opacity-50 cursor-not-allowed');

  @HostBinding('attr.role') role = 'tab';

  @HostBinding('attr.aria-selected')
  get selected() {
    return this.tabs.isActive(this.value());
  }

  @HostBinding('attr.tabindex')
  get tabindex() {
    return this.tabs.isActive(this.value()) ? 0 : -1;
  }

  @HostBinding('class')
  get klass() {
    if (this.disabled()) return `${this.tabKlass()} ${this.disabledKlass()}`;
    return this.tabs.isActive(this.value())
      ? `${this.tabKlass()} ${this.activeKlass()}`
      : `${this.tabKlass()} ${this.inactiveKlass()}`;
  }

  @HostListener('click')
  onClick() {
    if (!this.disabled()) {
      this.tabs.setValue(this.value());
    }
  }
}
