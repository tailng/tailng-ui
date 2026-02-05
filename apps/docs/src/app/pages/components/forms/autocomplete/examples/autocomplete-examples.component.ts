import { Component, computed, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { TngAutocomplete } from '@tailng-ui/ui/form';
import { TngTag } from '@tailng-ui/ui/primitives';
import { ExampleBlockComponent, TngExampleDemo } from '../../../../../shared/example-block/example-block.component';
import { Country, COUNTRY_LIST, toFlagEmoji } from '../../../../../shared/country-list';

@Component({
  standalone: true,
  selector: 'docs-autocomplete-examples',
  templateUrl: './autocomplete-examples.component.html',
  imports: [
    TngAutocomplete,
    ReactiveFormsModule,
    ExampleBlockComponent,
    TngExampleDemo,
    TngTag,
  ],
})
export class AutocompleteExamplesComponent {
  form = new FormGroup({
    country: new FormControl<Country | null>(null),
    countryCustom: new FormControl<Country | null>(null),
  });

  options = signal<Country[]>([]);
  optionsCustom = signal<Country[]>([]);

  displayCountry = (c: Country) => `${toFlagEmoji(c.code)} ${c.name}`;
  displayCountryText = (c: Country) => `(${c.code}) ${c.name}`;

  onSearch(term: string) {
    const v = term.toLowerCase().trim();
    this.options.set(v ? COUNTRY_LIST.filter((c) => c.name.toLowerCase().includes(v) || c.iso.toLowerCase().includes(v)) : []);
  }

  onSearchCustom(term: string) {
    const v = term.toLowerCase().trim();
    this.optionsCustom.set(v ? COUNTRY_LIST.filter((c) => c.name.toLowerCase().includes(v) || c.iso.toLowerCase().includes(v)) : []);
  }

  readonly basicExampleHtml = computed(
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

  readonly basicExampleTs = computed(
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
  displayCountry = (c: Country) => \`\${c.code} \${c.name}\`;
  onSearch(term: string) {
    const v = term.toLowerCase().trim();
    this.options.set(v ? ALL.filter(c => c.name.toLowerCase().includes(v)) : []);
  }
}
`,
  );

  readonly customTplExampleHtml = computed(
    () => `
<tng-autocomplete
  formControlName="countryCustom"
  [options]="optionsCustom()"
  [displayWith]="displayCountryText"
  placeholder="Search country…"
  (search)="onSearchCustom($event)"
>
  <ng-template #optionTpl let-item>
    <div class="flex items-center gap-2">
      <span class="opacity-70">({{ item.code }})</span>
      <span class="font-semibold text-red-600">{{ item.name }}</span>
    </div>
  </ng-template>
  <ng-template #inputTpl let-item>
    <div class="flex items-center gap-2">
      <span class="opacity-70">({{ item.code }})</span>
      <span class="font-semibold">{{ item.name }}</span>
    </div>
  </ng-template>
</tng-autocomplete>
`,
  );

  readonly customTplExampleTs = computed(
    () => `
// Same as basic; add optionTpl and inputTpl in template.
// optionTpl: dropdown row. inputTpl: selected value in input when closed.
`,
  );

  readonly disabledExampleHtml = computed(
    () => `
<form [formGroup]="form">
  <tng-autocomplete
    formControlName="country"
    [options]="options()"
    [displayWith]="displayCountry"
    placeholder="Disabled"
    (search)="onSearch($event)"
    [disabled]="true"
  />
</form>
`,
  );
}
