import { Component, computed } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { TngSelect } from '@tociva/tailng-ui/form';
import { ExampleBlockComponent, TngExampleDemo } from '../../../../../shared/example-block/example-block.component';

@Component({
  standalone: true,
  selector: 'docs-select-overview',
  templateUrl: './select-overview.component.html',
  imports: [
    ReactiveFormsModule,
    TngSelect,
    ExampleBlockComponent,
    TngExampleDemo,
  ],
})
export class SelectOverviewComponent {
  fruits = ['Apple', 'Banana', 'Cherry', 'Date', 'Elderberry'];

  form = new FormGroup({
    fruit: new FormControl<string | null>(null),
  });

  displayFruit = (v: string) => v;

  readonly basicHtml = computed(
    () => `
<form [formGroup]="form">
  <tng-select
    formControlName="fruit"
    [options]="fruits"
    [displayWith]="displayFruit"
    placeholder="Choose a fruit…"
  />
</form>
`,
  );

  readonly basicTs = computed(
    () => `
fruits = ['Apple', 'Banana', 'Cherry', 'Date', 'Elderberry'];
form = new FormGroup({
  fruit: new FormControl<string | null>(null),
});
displayFruit = (v: string) => v;
`,
  );
}
