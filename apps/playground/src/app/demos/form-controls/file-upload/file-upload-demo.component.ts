import { Component, signal } from '@angular/core';
import { TngFileUpload } from '@tociva/tailng-ui/form-controls';

@Component({
  selector: 'playground-file-upload-demo',
  standalone: true,
  imports: [TngFileUpload],
  templateUrl: './file-upload-demo.component.html',
})
export class FileUploadDemoComponent {
  readonly files = signal<File[] | null>(null);
}
