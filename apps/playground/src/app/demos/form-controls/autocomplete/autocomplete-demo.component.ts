import { Component, signal } from '@angular/core';
import { TailngAutocompleteComponent } from '@tailng/ui';

interface City {
  id: number;
  name: string;
  country: string;
}

@Component({
  selector: 'playground-autocomplete-demo',
  standalone: true,
  imports: [TailngAutocompleteComponent],
  templateUrl: './autocomplete-demo.component.html',
})
export class AutocompleteDemoComponent {
  // Full dataset (pretend this comes from an API)
  private readonly allCities: City[] = [
    { id: 1, name: 'Bengaluru', country: 'India' },
    { id: 2, name: 'Chennai', country: 'India' },
    { id: 3, name: 'Kochi', country: 'India' },
    { id: 4, name: 'Mumbai', country: 'India' },
    { id: 5, name: 'Delhi', country: 'India' },
    { id: 6, name: 'London', country: 'UK' },
    { id: 7, name: 'Berlin', country: 'Germany' },
    { id: 8, name: 'Paris', country: 'France' },
  ];

  // Filtered options shown in autocomplete
  options = signal<City[]>([]);

  // Selected value (for demo display)
  selectedCity = signal<City | null>(null);

  // Display function for input + list
  displayCity = (city: City) => `${city.name}, ${city.country}`;

  // Called when user types
  onSearch(term: string) {
    const value = term.toLowerCase().trim();

    if (!value) {
      this.options.set([]);
      return;
    }

    // Simulate API filtering
    const filtered = this.allCities.filter(city =>
      city.name.toLowerCase().includes(value) ||
      city.country.toLowerCase().includes(value)
    );

    this.options.set(filtered);
  }

  // Called when user selects an option
  onSelected(city: City) {
    this.selectedCity.set(city);
  }

  onClosed(reason: string) {
    console.log('Autocomplete closed:', reason);
  }
}
