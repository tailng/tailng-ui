import { Component, computed, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { TngChips } from '@tailng-ui/ui/form';
import { TngTag } from '@tailng-ui/ui/primitives';
import { ExampleBlockComponent, TngExampleDemo } from '../../../../../shared/example-block/example-block.component';
import { Country, COUNTRY_LIST, toFlagEmoji } from '../../../../../shared/country-list';

@Component({
  standalone: true,
  selector: 'docs-chips-examples',
  templateUrl: './chips-examples.component.html',
  imports: [
    TngChips,
    ReactiveFormsModule,
    ExampleBlockComponent,
    TngExampleDemo,
    TngTag,
  ],
})
export class ChipsExamplesComponent {
  form = new FormGroup({
    countries: new FormControl<Country[]>([], { nonNullable: true }),
    countriesCustom: new FormControl<Country[]>([], { nonNullable: true }),
  });

  options = signal<Country[]>(COUNTRY_LIST);
  optionsCustom = signal<Country[]>(COUNTRY_LIST);

  displayCountry = (c: Country) => `${toFlagEmoji(c.code)} ${c.name}`;
  displayCountry2 = (c: Country) => `(${c.code}) ${c.name}`;

  onSearch(term: string) {
    const v = term.toLowerCase().trim();
    this.options.set(v ? COUNTRY_LIST.filter((c) => c.name.toLowerCase().includes(v) || c.iso.toLowerCase().includes(v)) : COUNTRY_LIST);
  }

  onSearchCustom(term: string) {
    const v = term.toLowerCase().trim();
    this.optionsCustom.set(v ? COUNTRY_LIST.filter((c) => c.name.toLowerCase().includes(v) || c.iso.toLowerCase().includes(v)) : COUNTRY_LIST);
  }

  readonly basicHtml = computed(
    () => `
<form [formGroup]="form">
  <tng-chips formControlName="countries" [options]="options()"
    placeholder="Add countries…" [displayWith]="displayCountry"
    [allowFreeText]="false" (search)="onSearch($event)" />
</form>
`,
  );

  readonly basicTs = computed(
    () => `
form = new FormGroup({
  countries: new FormControl<Country[]>([], { nonNullable: true }),
});
options = signal<Country[]>(ALL_COUNTRIES);
displayCountry = (c: Country) => \`\${c.code} \${c.name}\`;
onSearch(term: string) { /* filter options */ }
`,
  );

  readonly customTplHtml = computed(
    () => `
<tng-chips formControlName="countriesCustom" [options]="optionsCustom()"
  [displayWith]="displayCountry2" [allowFreeText]="false"
  (search)="onSearchCustom($event)">
  <ng-template #chipTpl let-item>
    <span class="flex items-center gap-2">
      <span class="opacity-70 text-red-600">({{ item.code }})</span>
      <span class="font-semibold">{{ item.name }}</span>
    </span>
  </ng-template>
  <ng-template #optionTpl let-item>
    <div class="flex items-center gap-2">
      <span class="opacity-70">({{ item.code }})</span>
      <span class="font-semibold text-red-600">{{ item.name }}</span>
    </div>
  </ng-template>
</tng-chips>
`,
  );

  readonly freeTextHtml = computed(
    () => `
<form [formGroup]="form">
  <tng-chips formControlName="tags" placeholder="Add tags…"
    [options]="[]" [allowFreeText]="true" />
</form>
`,
  );
}
