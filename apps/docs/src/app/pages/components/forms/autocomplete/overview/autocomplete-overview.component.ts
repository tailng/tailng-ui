import { Component, computed, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { TngAutocomplete } from '@tailng-ui/ui/form';
import { TngTag } from '@tailng-ui/ui/primitives';
import { ExampleBlockComponent, TngExampleDemo } from '../../../../../shared/example-block/example-block.component';
import { Country, COUNTRY_LIST, toFlagEmoji } from '../../../../../shared/country-list';

@Component({
  standalone: true,
  selector: 'docs-autocomplete-overview',
  templateUrl: './autocomplete-overview.component.html',
  imports: [
    ReactiveFormsModule,
    TngAutocomplete,
    TngTag,
    ExampleBlockComponent,
    TngExampleDemo,
  ],
})
export class AutocompleteOverviewComponent {
  form = new FormGroup({
    country: new FormControl<Country | null>(null),
  });

  options = signal<Country[]>([]);

  displayCountry = (country: Country) =>
    `${toFlagEmoji(country.code)} ${country.name}`;

  onSearch(term: string) {
    const value = term.toLowerCase().trim();
    if (!value) {
      this.options.set([]);
      return;
    }
    const filtered = COUNTRY_LIST.filter(
      (c) =>
        c.name.toLowerCase().includes(value) ||
        c.iso.toLowerCase().includes(value)
    );
    this.options.set(filtered);
  }

  readonly basicHtml = computed(
    () => `
<form [formGroup]="form">
  <tng-autocomplete
    formControlName="country"
    [options]="options()"
    [displayWith]="displayCountry"
    placeholder="Search country…"
    (search)="onSearch($event)"
  />
</form>
`,
  );

  readonly basicTs = computed(
    () => `
import { Component, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { TngAutocomplete } from '@tailng-ui/ui/form';

@Component({
  selector: 'autocomplete-demo',
  standalone: true,
  imports: [ReactiveFormsModule, TngAutocomplete],
  template: \`<form [formGroup]="form">
    <tng-autocomplete formControlName="country" [options]="options()"
      [displayWith]="displayCountry" placeholder="Search country…"
      (search)="onSearch($event)" />
  </form>\`,
})
export class AutocompleteDemoComponent {
  form = new FormGroup({
    country: new FormControl<Country | null>(null),
  });
  options = signal<Country[]>([]);
  displayCountry = (c: Country) => \`\${c.code} \${c.name}\`;
  onSearch(term: string) {
    const v = term.toLowerCase().trim();
    this.options.set(v ? ALL_OPTIONS.filter(c =>
      c.name.toLowerCase().includes(v) || c.iso.toLowerCase().includes(v)) : []);
  }
}
`,
  );
}
