import { Component, computed, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { TngChips } from '@tailng-ui/ui/form';
import { TngTag } from '@tailng-ui/ui/primitives';
import { ExampleBlockComponent, TngExampleDemo } from '../../../../../shared/example-block/example-block.component';
import { Country, COUNTRY_LIST, toFlagEmoji } from '../../../../../shared/country-list';

@Component({
  standalone: true,
  selector: 'docs-chips-overview',
  templateUrl: './chips-overview.component.html',
  imports: [
    ReactiveFormsModule,
    TngChips,
    TngTag,
    ExampleBlockComponent,
    TngExampleDemo,
  ],
})
export class ChipsOverviewComponent {
  form = new FormGroup({
    countries: new FormControl<Country[]>([], { nonNullable: true }),
  });

  options = signal<Country[]>(COUNTRY_LIST);
  displayCountry = (c: Country) => `${toFlagEmoji(c.code)} ${c.name}`;

  onSearch(term: string) {
    const v = term.toLowerCase().trim();
    this.options.set(v ? COUNTRY_LIST.filter((c) => c.name.toLowerCase().includes(v) || c.iso.toLowerCase().includes(v)) : COUNTRY_LIST);
  }

  readonly basicHtml = computed(
    () => `
<form [formGroup]="form">
  <tng-chips
    formControlName="countries"
    [options]="options()"
    placeholder="Add countries…"
    [displayWith]="displayCountry"
    [allowFreeText]="false"
    (search)="onSearch($event)"
  />
</form>
`,
  );

  readonly basicTs = computed(
    () => `
import { Component, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { TngChips } from '@tailng-ui/ui/form';

@Component({
  selector: 'chips-demo',
  standalone: true,
  imports: [ReactiveFormsModule, TngChips],
  template: \`<form [formGroup]="form">
    <tng-chips formControlName="tags" [options]="options()"
      [displayWith]="displayWith" placeholder="Add…"
      (search)="onSearch($event)" />
  </form>\`,
})
export class ChipsDemoComponent {
  form = new FormGroup({
    tags: new FormControl<string[]>([], { nonNullable: true }),
  });
  options = signal<string[]>([]);
  displayWith = (x: string) => x;
  onSearch(term: string) { /* filter or fetch */ }
}
`,
  );
}
