import { Component, signal } from '@angular/core';
import { TngOptionList, TngOverlayPanel } from '@tociva/tailng-ui/popups-overlays';
import { Country, COUNTRY_LIST } from '../../util/country-list';

interface Person {
  name: string;
  age: number;
}

@Component({
  selector: 'playground-option-list-demo',
  standalone: true,
  imports: [TngOptionList, TngOverlayPanel],
  templateUrl: './option-list-demo.component.html',
})
export class OptionListDemoComponent {
  /* ---------- Basic example ---------- */
  options = signal<string[]>(['Apple', 'Banana', 'Cherry', 'Date', 'Elderberry']);
  activeIndex = signal<number>(-1);

  onSelect(event: { item: string; index: number }) {
    console.log('Selected:', event.item, 'at index:', event.index);
    this.activeIndex.set(event.index);

    // Optional: if modal list is open, close it on selection for nicer UX
    if (this.showModalList()) {
      this.closeModalList();
    }
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

  displayPerson = (item: Person) => `${item.name} (${item.age})`;

  /* ---------- Country template example ---------- */
  countryOptions: Country[] = COUNTRY_LIST;
  countryActiveIndex = signal<number>(-1);

  onCountrySelect(event: { item: Country; index: number }) {
    console.log('Selected:', event.item, 'at index:', event.index);
    this.countryActiveIndex.set(event.index);
  }

  /* ---------- Modal example ---------- */
  showModalList = signal(false);

  openModalList() {
    this.showModalList.set(true);

    // Start from first option when opening (nice for keyboard)
    if (this.activeIndex() < 0 && this.options().length > 0) {
      this.activeIndex.set(0);
    }
  }

  closeModalList() {
    this.showModalList.set(false);
  }

  selectActive() {
    const i = this.activeIndex();
    const items = this.options();

    if (i < 0 || i >= items.length) return;

    this.onSelect({ item: items[i], index: i });
    this.closeModalList();
  }

  /* ---------- Modal large list example ---------- */
  showModalListLarge = signal(false); 
  activeIndexLarge = signal<number>(-1);
  optionsLarge = signal<Country[]>(COUNTRY_LIST);

  openModalListLarge() {
    this.showModalListLarge.set(true);
    if (this.activeIndexLarge() < 0 && this.optionsLarge().length > 0) {
      this.activeIndexLarge.set(0);
    }
  }

  onSelectLarge(event: { item: Country; index: number }) {
    console.log('Selected:', event.item, 'at index:', event.index);
    this.activeIndexLarge.set(event.index);
  }

  closeModalListLarge() {
    this.showModalListLarge.set(false);
  }

  selectActiveLarge() {
    const i = this.activeIndexLarge();
    const items = this.optionsLarge();

    if (i < 0 || i >= items.length) return;

    this.onSelectLarge({ item: items[i], index: i });
    this.closeModalListLarge();
  }
}
