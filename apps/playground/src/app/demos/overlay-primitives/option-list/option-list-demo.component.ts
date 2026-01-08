import { Component, signal } from '@angular/core';
import { TailngOptionListComponent } from '@tailng/ui';
import { TailngOverlayPanelComponent } from '@tailng/ui';
import { Country, COUNTRY_LIST } from '../../util/country-list';

interface Person {
  name: string;
  age: number;
}

@Component({
  selector: 'playground-option-list-demo',
  standalone: true,
  imports: [TailngOptionListComponent, TailngOverlayPanelComponent],
  templateUrl: './option-list-demo.component.html',
})
export class OptionListDemoComponent {
  /* ---------- Basic example ---------- */
  options = signal<string[]>(['Apple', 'Banana', 'Cherry', 'Date', 'Elderberry']);
  activeIndex = signal<number>(-1);

  onSelect(event: { item: string; index: number }) {
    console.log('Selected:', event.item, 'at index:', event.index);
    this.activeIndex.set(event.index);
  }

  /* ---------- Custom display example ---------- */
  customOptions: Person[] = [
    { name: 'John', age: 30 },
    { name: 'Jane', age: 25 },
    { name: 'Bob', age: 35 },
  ];
  customActiveIndex = signal<number>(-1);


  onCustomSelect(event: { item: Person; index: number }) {
    console.log('Selected:', event.item, 'at index:', event.index);
    this.customActiveIndex.set(event.index);
  }

  countryOptions: Country[] = COUNTRY_LIST;
  countryActiveIndex = signal<number>(-1);


  onCountrySelect(event: { item: Country; index: number }) {
    console.log('Selected:', event.item, 'at index:', event.index);
    this.countryActiveIndex.set(event.index);
  }

  displayPerson = (item: Person) => `${item.name} (${item.age})`;
}
