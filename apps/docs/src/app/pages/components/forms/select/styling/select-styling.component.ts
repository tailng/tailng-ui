import { Component, computed } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { TngSelect } from '@tailng-ui/ui/form';
import { TngTag } from '@tailng-ui/ui/primitives';
import { ExampleBlockComponent, TngExampleDemo } from '../../../../../shared/example-block/example-block.component';

@Component({
  standalone: true,
  selector: 'docs-select-styling',
  templateUrl: './select-styling.component.html',
  imports: [
    ReactiveFormsModule,
    TngSelect,
    TngTag,
    ExampleBlockComponent,
    TngExampleDemo,
  ],
})
export class SelectStylingComponent {
  fruits = ['Apple', 'Banana', 'Cherry'];
  form = new FormGroup({
    fruit: new FormControl<string | null>(null),
  });
  displayFruit = (v: string) => v;

  readonly triggerKlassHtml = computed(
    () => `
<form [formGroup]="form">
  <tng-select formControlName="fruit" [options]="fruits" [displayWith]="displayFruit"
    placeholder="Choose…" triggerKlass="w-full flex items-center justify-between border-2 border-primary rounded-lg px-4 py-2" />
</form>
`,
  );

  readonly valuePlaceholderHtml = computed(
    () => `
<form [formGroup]="form">
  <tng-select formControlName="fruit" [options]="fruits" [displayWith]="displayFruit"
    valueKlass="truncate text-left font-semibold text-primary"
    placeholderKlass="text-disable italic" />
</form>
`,
  );
}
