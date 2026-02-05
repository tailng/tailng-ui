import { Component, computed, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { TngChips } from '@tailng-ui/ui/form';
import { TngTag } from '@tailng-ui/ui/primitives';
import { ExampleBlockComponent, TngExampleDemo } from '../../../../../shared/example-block/example-block.component';
import { Country, COUNTRY_LIST, toFlagEmoji } from '../../../../../shared/country-list';

@Component({
  standalone: true,
  selector: 'docs-chips-styling',
  templateUrl: './chips-styling.component.html',
  imports: [
    TngChips,
    ReactiveFormsModule,
    TngTag,
    ExampleBlockComponent,
    TngExampleDemo,
  ],
})
export class ChipsStylingComponent {
  form = new FormGroup({
    countries: new FormControl<Country[]>([], { nonNullable: true }),
  });

  options = signal<Country[]>(COUNTRY_LIST);
  displayCountry = (c: Country) => `${toFlagEmoji(c.code)} ${c.name}`;

  onSearch(term: string) {
    const v = term.toLowerCase().trim();
    this.options.set(v ? COUNTRY_LIST.filter((c) => c.name.toLowerCase().includes(v) || c.iso.toLowerCase().includes(v)) : COUNTRY_LIST);
  }

  readonly containerKlassHtml = computed(
    () => `
<form [formGroup]="form">
  <tng-chips formControlName="countries" [options]="options()"
    [displayWith]="displayCountry" [allowFreeText]="false"
    (search)="onSearch($event)"
    containerKlass="w-full min-h-[42px] px-3 py-2 flex flex-wrap gap-2 border-2 border-blue-500 rounded-lg bg-blue-50/30" />
</form>
`,
  );

  readonly chipKlassHtml = computed(
    () => `
chipKlass="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-blue-100 border border-blue-300 text-sm"
`,
  );
}
