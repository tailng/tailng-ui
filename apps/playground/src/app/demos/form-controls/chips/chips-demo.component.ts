import { Component, signal } from '@angular/core';
import { TailngChipsComponent } from '@tailng/ui';
import { Country, COUNTRY_LIST } from '../../util/country-list';
import { JsonPipe } from '@angular/common';
import { toFlagEmoji } from '../../util/common.util';

@Component({
  selector: 'playground-chips-demo',
  standalone: true,
  imports: [TailngChipsComponent, JsonPipe],
  templateUrl: './chips-demo.component.html',
})
export class ChipsDemoComponent {
  // Selected countries
  readonly countries = signal<Country[]>([
    COUNTRY_LIST.find(c => c.code === 'IN')!,
  ]);

  // All options
  private readonly allCountries = COUNTRY_LIST;

  // Filtered options shown in overlay
  readonly options = signal<Country[]>(this.allCountries);

  /* =====================
   * Handlers
   * ===================== */
  onSearch(query: string) {
    const q = query.toLowerCase().trim();

    this.options.set(
      this.allCountries.filter(c =>
        c.name.toLowerCase().includes(q) ||
        c.code.toLowerCase().includes(q) ||
        c.iso.toLowerCase().includes(q)
      )
    );
  }

  onValueChange(value: Country[]) {
    this.countries.set(value);
  }

  onChipAdded(country: Country) {
    console.log('Country added:', country);
  }

  onChipRemoved(country: Country) {
    console.log('Country removed:', country);
  }

  /* =====================
   * Display helpers
   * ===================== */
  displayCountry = (c: Country) => `${toFlagEmoji(c.code)} ${c.name}`;
}
