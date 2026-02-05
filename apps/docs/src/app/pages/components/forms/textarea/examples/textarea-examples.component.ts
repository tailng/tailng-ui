import { Component, computed } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { TngTextarea } from '@tailng-ui/ui/form';
import { TngTag } from '@tailng-ui/ui/primitives';
import { ExampleBlockComponent, TngExampleDemo } from '../../../../../shared/example-block/example-block.component';

@Component({
  standalone: true,
  selector: 'docs-textarea-examples',
  templateUrl: './textarea-examples.component.html',
  imports: [
    TngTextarea,
    ReactiveFormsModule,
    ExampleBlockComponent,
    TngExampleDemo,
    TngTag,
  ],
})
export class TextareaExamplesComponent {
  form = new FormGroup({
    message: new FormControl('', { nonNullable: true }),
  });

  readonly basicHtml = computed(
    () => `
<form [formGroup]="form">
  <tng-textarea formControlName="message" placeholder="Your message" [rows]="4" />
</form>
`,
  );

  readonly basicTs = computed(
    () => `
form = new FormGroup({
  message: new FormControl('', { nonNullable: true }),
});
`,
  );

  readonly rowsHtml = computed(
    () => `
<tng-textarea formControlName="message" placeholder="Taller" [rows]="8" />
`,
  );

  readonly disabledHtml = computed(
    () => `
<tng-textarea formControlName="message" placeholder="Disabled" [disabled]="true" />
`,
  );
}
