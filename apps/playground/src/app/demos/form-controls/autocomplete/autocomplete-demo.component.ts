import { Component, signal } from '@angular/core';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { TngAutocomplete } from '@tociva/tailng-ui/form-controls';

import { Country, COUNTRY_LIST } from '../../util/country-list';
import { toFlagEmoji } from '../../util/common.util';

@Component({
  selector: 'playground-autocomplete-demo',
  standalone: true,
  imports: [ReactiveFormsModule, TngAutocomplete],
  templateUrl: './autocomplete-demo.component.html',
})
export class AutocompleteDemoComponent {
  // CVA value lives in a FormControl now
  countryCtrl = new FormControl<Country | null>(null);

  // Filtered options shown in autocomplete
  options = signal<Country[]>([]);

  // Display function for input + list
  displayCountry = (country: Country) =>
    `${toFlagEmoji(country.code)} ${country.name}`;

  // Called when user types (still needed for filtering / API calls)
  onSearch(term: string) {
    const value = term.toLowerCase().trim();

    if (!value) {
      this.options.set([]);
      return;
    }

    const filtered = COUNTRY_LIST.filter(
      (country) =>
        country.name.toLowerCase().includes(value) ||
        country.iso.toLowerCase().includes(value)
    );

    this.options.set(filtered);
  }

  countryControl2 = new FormControl<Country | null>(null);
  options2 = signal<Country[]>([]);

  onSearch2(term: string) {
    const value = term.toLowerCase().trim();

    if (!value) {
      this.options2.set([]);
      return;
    }

    const filtered = COUNTRY_LIST.filter(
      (country) =>
        country.name.toLowerCase().includes(value) ||
        country.iso.toLowerCase().includes(value)
      );

    this.options2.set(filtered);
  }

  displayCountryText = (c: Country) => `(${c.code}) ${c.name}`;

  
  onClosed(reason: string) {
    console.log('Autocomplete closed:', reason);
  }
}
