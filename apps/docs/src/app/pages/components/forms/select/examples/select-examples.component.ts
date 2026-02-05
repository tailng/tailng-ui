import { Component, computed, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { TngSelect } from '@tailng-ui/ui/form';
import { TngTag } from '@tailng-ui/ui/primitives';
import { ExampleBlockComponent, TngExampleDemo } from '../../../../../shared/example-block/example-block.component';

@Component({
  standalone: true,
  selector: 'docs-select-examples',
  templateUrl: './select-examples.component.html',
  imports: [
    ReactiveFormsModule,
    TngSelect,
    TngTag,
    ExampleBlockComponent,
    TngExampleDemo,
  ],
})
export class SelectExamplesComponent {
  fruits = ['Apple', 'Banana', 'Cherry', 'Date', 'Elderberry'];
  lastSelected = signal<string | null>(null);

  form = new FormGroup({
    fruit: new FormControl<string | null>(null),
  });

  displayFruit = (v: string) => v;

  onSelected(item: string) {
    this.lastSelected.set(item);
  }

  readonly basicHtml = computed(
    () => `
<form [formGroup]="form">
  <tng-select formControlName="fruit" [options]="fruits"
    [displayWith]="displayFruit" placeholder="Choose a fruit…" />
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

  readonly disabledHtml = computed(
    () => `
<tng-select formControlName="fruit" [options]="fruits" [displayWith]="displayFruit"
  placeholder="Disabled" [disabled]="true" />
`,
  );

  readonly selectedHtml = computed(
    () => `
<tng-select formControlName="fruit" [options]="fruits" [displayWith]="displayFruit"
  (selected)="onSelected($event)" />
`,
  );

  readonly selectedTs = computed(
    () => `
lastSelected = signal<string | null>(null);
onSelected(item: string) {
  this.lastSelected.set(item);
}
`,
  );
}
