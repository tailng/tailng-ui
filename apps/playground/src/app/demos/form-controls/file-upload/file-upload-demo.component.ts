import { JsonPipe } from '@angular/common';
import { Component } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { TailngFileUploadComponent } from '@tailng/ui';

@Component({
  selector: 'playground-file-upload-demo',
  standalone: true,
  imports: [ReactiveFormsModule, TailngFileUploadComponent, JsonPipe],
  templateUrl: './file-upload-demo.component.html',
})
export class FileUploadDemoComponent {
  form = new FormGroup({
    files: new FormControl<File[] | null>(null, { validators: [Validators.required] }),
  });

  get filesCtrl() {
    return this.form.controls.files;
  }
}

