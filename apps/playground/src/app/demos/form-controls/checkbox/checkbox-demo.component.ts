import { JsonPipe } from '@angular/common';
import { Component } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { TngCheckbox } from '@tociva/tailng-ui/form-controls';

@Component({
  selector: 'playground-checkbox-demo',
  standalone: true,
  imports: [ReactiveFormsModule, TngCheckbox, JsonPipe],
  templateUrl: './checkbox-demo.component.html',
})
export class CheckboxDemoComponent {
  form = new FormGroup({
    terms: new FormControl(false, { nonNullable: true, validators: [Validators.requiredTrue] }),
    newsletter: new FormControl(false, { nonNullable: true }),
    notifications: new FormControl(true, { nonNullable: true }),
  });

  get termsCtrl() {
    return this.form.controls.terms;
  }
  get newsletterCtrl() {
    return this.form.controls.newsletter;
  }
  get notificationsCtrl() {
    return this.form.controls.notifications;
  }

  disableNewsletter() {
    this.newsletterCtrl.disable();
  }

  enableNewsletter() {
    this.newsletterCtrl.enable();
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

