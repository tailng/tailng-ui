import { JsonPipe } from '@angular/common';
import { Component } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { TailngTextInputComponent } from '@tailng/ui';

@Component({
  selector: 'playground-text-input-demo',
  standalone: true,
  imports: [ReactiveFormsModule, TailngTextInputComponent, JsonPipe],
  templateUrl: './text-input-demo.component.html',
})
export class TextInputDemoComponent {
  form = new FormGroup({
    text: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
  });

  get textCtrl() {
    return this.form.controls.text;
  }
}

