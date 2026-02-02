import { Component, signal } from '@angular/core';
import { JsonPipe } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

import { TngChips } from '@tociva/tailng-ui/form-controls';
import { Country, COUNTRY_LIST } from '../../util/country-list';
import { toFlagEmoji } from '../../util/common.util';

@Component({
  selector: 'playground-chips-demo',
  standalone: true,
  imports: [ReactiveFormsModule, TngChips, JsonPipe],
  templateUrl: './chips-demo.component.html',
})
export class ChipsDemoComponent {
  // CVA value source
  readonly countriesCtrl = new FormControl<Country[]>(
    [COUNTRY_LIST.find((c) => c.code === 'IN')!],
    { nonNullable: true }
  );
  // CVA value source
  readonly countriesCtrl2 = new FormControl<Country[]>(
    [COUNTRY_LIST.find((c) => c.code === 'IN')!],
    { nonNullable: true }
  );

  // All options
  private readonly allCountries = COUNTRY_LIST;
  private readonly allCountries2 = COUNTRY_LIST;

  // Filtered options shown in overlay
  readonly options = signal<Country[]>(this.allCountries);

  readonly countryOptions2 = signal<Country[]>(this.allCountries2);
  onSearch2(query: string) {
    const q = query.toLowerCase().trim();

    if (!q) {
      this.countryOptions2.set(this.allCountries2);
      return;
    }

    this.countryOptions2.set(
      this.allCountries.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.code.toLowerCase().includes(q) ||
          c.iso.toLowerCase().includes(q)
      )
    );
  }
  /* =====================
   * Handlers
   * ===================== */
  onSearch(query: string) {
    const q = query.toLowerCase().trim();

    if (!q) {
      this.options.set(this.allCountries);
      return;
    }

    this.options.set(
      this.allCountries.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.code.toLowerCase().includes(q) ||
          c.iso.toLowerCase().includes(q)
      )
    );
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
  displayCountry2 = (c: Country) => `(${c.code}) ${c.name}`;
  onChipAdded2(country: Country) {
    console.log('Country added:', country);
  }
  onChipRemoved2(country: Country) {
    console.log('Country removed:', country);
  }
}
