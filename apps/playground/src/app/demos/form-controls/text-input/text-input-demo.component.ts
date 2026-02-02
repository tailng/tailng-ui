import { JsonPipe } from '@angular/common';
import { Component } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { TailngTextInputComponent } from '@tociva/tailng-ui/form-controls';
import { TailngIconComponent } from '@tociva/tailng-icons/icon';

@Component({
  selector: 'playground-text-input-demo',
  standalone: true,
  imports: [ReactiveFormsModule, TailngTextInputComponent, JsonPipe, TailngIconComponent],
  templateUrl: './text-input-demo.component.html',
})
export class TextInputDemoComponent {
  form = new FormGroup({
    text: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    search: new FormControl('', { nonNullable: true, validators: [Validators.required] }),

  });

  get textCtrl() {
    return this.form.controls.text;
  }

  get searchCtrl() {
    return this.form.get('search')!;
  }
}

