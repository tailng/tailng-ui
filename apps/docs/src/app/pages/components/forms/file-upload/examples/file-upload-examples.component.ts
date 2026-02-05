import { Component, computed } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { TngFileUpload } from '@tailng-ui/ui/form';
import { TngTag } from '@tailng-ui/ui/primitives';
import { ExampleBlockComponent, TngExampleDemo } from '../../../../../shared/example-block/example-block.component';

@Component({
  standalone: true,
  selector: 'docs-file-upload-examples',
  templateUrl: './file-upload-examples.component.html',
  imports: [
    ReactiveFormsModule,
    TngFileUpload,
    TngTag,
    ExampleBlockComponent,
    TngExampleDemo,
  ],
})
export class FileUploadExamplesComponent {
  form = new FormGroup({
    files: new FormControl<File[] | null>(null),
  });

  readonly basicHtml = computed(
    () => `
<form [formGroup]="form">
  <tng-file-upload formControlName="files" />
</form>
`,
  );

  readonly basicTs = computed(
    () => `
form = new FormGroup({
  files: new FormControl<File[] | null>(null),
});
`,
  );

  readonly acceptMultipleHtml = computed(
    () => `
<tng-file-upload formControlName="files" accept="image/*" [multiple]="true"
  title="Upload images" subtitle="Images only, multiple allowed" />
`,
  );

  readonly disabledHtml = computed(
    () => `
<tng-file-upload formControlName="files" [disabled]="true" />
`,
  );
}
