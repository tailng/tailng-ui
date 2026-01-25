import { JsonPipe } from '@angular/common';
import { Component } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { TailngNumberInputComponent } from '@tociva/tailng-ui';

@Component({
  selector: 'playground-number-input-demo',
  standalone: true,
  imports: [ReactiveFormsModule, TailngNumberInputComponent, JsonPipe],
  templateUrl: './number-input-demo.component.html',
})
export class NumberInputDemoComponent {
  form = new FormGroup({
    number: new FormControl<number | null>(null, { validators: [Validators.required] }),
  });

  get numberCtrl() {
    return this.form.controls.number;
  }
}

