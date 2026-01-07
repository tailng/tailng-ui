import { JsonPipe } from '@angular/common';
import { Component } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { TailngInputComponent } from '@tailng/ui';

@Component({
  selector: 'playground-input-demo',
  standalone: true,
  imports: [ReactiveFormsModule, TailngInputComponent, JsonPipe],
  templateUrl: './input-demo.component.html',
})
export class InputDemoComponent {
  form = new FormGroup({
    name: new FormControl('TailNG', { nonNullable: true, validators: [Validators.required] }),
    email: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.email] }),
    password: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.minLength(6)] }),
  });

  get nameCtrl() {
    return this.form.controls.name;
  }
  get emailCtrl() {
    return this.form.controls.email;
  }
  get passwordCtrl() {
    return this.form.controls.password;
  }

  disableEmail() {
    this.emailCtrl.disable();
  }

  enableEmail() {
    this.emailCtrl.enable();
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
