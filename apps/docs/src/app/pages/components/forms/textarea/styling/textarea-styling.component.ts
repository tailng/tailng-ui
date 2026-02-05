import { Component, computed } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { TngTextarea } from '@tailng-ui/ui/form';
import { TngTag } from '@tailng-ui/ui/primitives';
import { ExampleBlockComponent, TngExampleDemo } from '../../../../../shared/example-block/example-block.component';

@Component({
  standalone: true,
  selector: 'docs-textarea-styling',
  templateUrl: './textarea-styling.component.html',
  imports: [
    TngTextarea,
    ReactiveFormsModule,
    TngTag,
    ExampleBlockComponent,
    TngExampleDemo,
  ],
})
export class TextareaStylingComponent {
  form = new FormGroup({
    message: new FormControl('', { nonNullable: true }),
  });

  readonly klassHtml = computed(
    () => `
<form [formGroup]="form">
  <tng-textarea formControlName="message" placeholder="Custom styled"
    klass="border-2 border-blue-500 rounded-lg shadow-md min-h-[100px]" />
</form>
`,
  );
}
