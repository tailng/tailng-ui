import { JsonPipe } from '@angular/common';
import { Component } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { TailngTextareaComponent } from '@tailng/ui';

@Component({
  selector: 'playground-textarea-demo',
  standalone: true,
  imports: [ReactiveFormsModule, TailngTextareaComponent, JsonPipe],
  templateUrl: './textarea-demo.component.html',
})
export class TextareaDemoComponent {
  form = new FormGroup({
    message: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
  });

  get messageCtrl() {
    return this.form.controls.message;
  }
}

