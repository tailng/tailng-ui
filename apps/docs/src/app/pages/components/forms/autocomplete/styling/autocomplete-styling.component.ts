import { Component, computed, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { TngAutocomplete } from '@tailng-ui/ui/form';
import { TngTag } from '@tailng-ui/ui/primitives';
import { ExampleBlockComponent, TngExampleDemo } from '../../../../../shared/example-block/example-block.component';
import { Country, COUNTRY_LIST, toFlagEmoji } from '../../../../../shared/country-list';

@Component({
  standalone: true,
  selector: 'docs-autocomplete-styling',
  templateUrl: './autocomplete-styling.component.html',
  imports: [
    TngAutocomplete,
    ReactiveFormsModule,
    TngTag,
    ExampleBlockComponent,
    TngExampleDemo,
  ],
})
export class AutocompleteStylingComponent {
  form = new FormGroup({
    country: new FormControl<Country | null>(null),
  });

  options = signal<Country[]>([]);

  displayCountry = (c: Country) => `${toFlagEmoji(c.code)} ${c.name}`;

  onSearch(term: string) {
    const v = term.toLowerCase().trim();
    this.options.set(v ? COUNTRY_LIST.filter((c) => c.name.toLowerCase().includes(v) || c.iso.toLowerCase().includes(v)) : []);
  }

  readonly klassExampleHtml = computed(
    () => `
<form [formGroup]="form">
  <tng-autocomplete
    formControlName="country"
    [options]="options()"
    [displayWith]="displayCountry"
    placeholder="Search country…"
    (search)="onSearch($event)"
    inputKlass="border-2 border-blue-500 rounded-lg shadow-md w-full max-w-md"
  />
</form>
`,
  );

  readonly klassExampleTs = computed(
    () => `
import { Component, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { TngAutocomplete } from '@tailng-ui/ui/form';

@Component({
  selector: 'autocomplete-demo',
  standalone: true,
  imports: [ReactiveFormsModule, TngAutocomplete],
  templateUrl: './autocomplete.component.html',
})
export class AutocompleteDemoComponent {
  form = new FormGroup({ country: new FormControl<Country | null>(null) });
  options = signal<Country[]>([]);
  displayCountry = (c: Country) => c.name;
  onSearch(term: string) { /* filter options */ }
}
`,
  );

  readonly klassExampleCss = computed(
    () => `
// Default input classes are merged with inputKlass:
// relative z-0 w-full border rounded-md px-3 py-2 text-sm
// focus:outline-none focus:ring-2 focus:ring-primary bg-bg text-fg
`,
  );
}
