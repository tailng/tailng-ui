import { Component, computed } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { TngFileUpload } from '@tailng-ui/ui/form';
import { TngTag } from '@tailng-ui/ui/primitives';
import { ExampleBlockComponent, TngExampleDemo } from '../../../../../shared/example-block/example-block.component';

@Component({
  standalone: true,
  selector: 'docs-file-upload-overview',
  templateUrl: './file-upload-overview.component.html',
  imports: [
    ReactiveFormsModule,
    TngFileUpload,
    TngTag,
    ExampleBlockComponent,
    TngExampleDemo,
  ],
})
export class FileUploadOverviewComponent {
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
}
