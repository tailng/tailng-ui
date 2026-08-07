import { Component, computed, signal, type OnInit } from '@angular/core';

import { TngMultiAutocompleteComponent } from '@tailng-ui/components';
import {
  TngMultiAutocompleteChip,
  TngMultiAutocompleteContent,
  TngMultiAutocompleteListbox,
  TngMultiAutocompleteOption,
  TngMultiAutocompleteOverlay,
  TngMultiAutocompleteTrigger,
} from '@tailng-ui/primitives';

type Country = { code: string; name: string };

@Component({
  selector: 'app-multi-autocomplete-playground-page',
  standalone: true,
  imports: [
    TngMultiAutocompleteChip,
    TngMultiAutocompleteTrigger,
    TngMultiAutocompleteContent,
    TngMultiAutocompleteOverlay,
    TngMultiAutocompleteListbox,
    TngMultiAutocompleteOption,
    TngMultiAutocompleteComponent,
  ],
  templateUrl: './multi-autocomplete-playground-page.component.html',
  styleUrl: './multi-autocomplete-playground-page.component.css',
})
export class MultiAutocompletePlaygroundPageComponent implements OnInit {
  public readonly countries = signal<Country[]>([]);
  public readonly query = signal('');
  public readonly value = signal<readonly string[]>([]);
  public readonly valueC = signal<readonly string[]>([]);
  public readonly open = signal(false);

  public readonly getCountryValue = (c: Country): string => c.name;
  public readonly getCountryLabel = (c: Country): string => c.name;

  public readonly filteredOptions = computed(() => {
    const q = this.query().toLowerCase().trim();
    const list = this.countries();
    const selected = new Set(this.value());

    const matches = q
      ? list.filter((country) => country.name.toLowerCase().includes(q))
      : list;

    const pinnedSelected = list.filter(
      (country) => selected.has(country.name) && (!q || country.name.toLowerCase().includes(q)),
    );

    const remaining = matches.filter((country) => !selected.has(country.name));

    return [...pinnedSelected, ...remaining].slice(0, 50);
  });

  public ngOnInit(): void {
    fetch('/assets/country-list.json')
      .then((response) => response.json())
      .then((data: Country[]) => this.countries.set(data))
      .catch(() => this.countries.set([]));
  }

  public onOpenChange(open: boolean): void {
    this.open.set(open);

    if (!open) {
      this.query.set('');
    }
  }

  public onQueryChange(query: string): void {
    this.query.set(query);
  }

  public onValueChange(value: readonly string[]): void {
    this.value.set(value);
  }

  public removeItem(item: string): void {
    this.value.update((current) => current.filter((entry) => entry !== item));
  }
}