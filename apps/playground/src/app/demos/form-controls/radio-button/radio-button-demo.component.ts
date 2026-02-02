import { JsonPipe } from '@angular/common';
import { Component } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { TngRadioButton } from '@tociva/tailng-ui/form-controls';

@Component({
  selector: 'playground-radio-button-demo',
  standalone: true,
  imports: [ReactiveFormsModule, TngRadioButton, JsonPipe],
  templateUrl: './radio-button-demo.component.html',
})
export class RadioButtonDemoComponent {
  form = new FormGroup({
    gender: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    size: new FormControl('medium', { nonNullable: true }),
    color: new FormControl('blue', { nonNullable: true }),
  });

  get genderCtrl() {
    return this.form.controls.gender;
  }
  get sizeCtrl() {
    return this.form.controls.size;
  }
  get colorCtrl() {
    return this.form.controls.color;
  }

  disableSize() {
    this.sizeCtrl.disable();
  }

  enableSize() {
    this.sizeCtrl.enable();
  }

  submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    // demo output
    console.log('Form value:', this.form.getRawValue());
  }
}
