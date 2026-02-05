import { Component, computed } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { TngFileUpload } from '@tailng-ui/ui/form';
import { TngTag } from '@tailng-ui/ui/primitives';
import { ExampleBlockComponent, TngExampleDemo } from '../../../../../shared/example-block/example-block.component';

@Component({
  standalone: true,
  selector: 'docs-file-upload-styling',
  templateUrl: './file-upload-styling.component.html',
  imports: [
    ReactiveFormsModule,
    TngFileUpload,
    TngTag,
    ExampleBlockComponent,
    TngExampleDemo,
  ],
})
export class FileUploadStylingComponent {
  form = new FormGroup({
    files: new FormControl<File[] | null>(null),
  });

  readonly dropzoneKlassHtml = computed(
    () => `
<form [formGroup]="form">
  <tng-file-upload formControlName="files"
    dropzoneKlass="border-2 border-dashed border-primary rounded-xl bg-primary/5" />
</form>
`,
  );

  readonly titleSubtitleHtml = computed(
    () => `
<form [formGroup]="form">
  <tng-file-upload formControlName="files" title="Drop files here" subtitle="or click to browse"
    titleKlass="text-base font-bold text-primary" subtitleKlass="text-sm text-disable" />
</form>
`,
  );
}
