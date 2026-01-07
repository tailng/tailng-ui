import { Component } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { TailngButtonComponent, TailngCardComponent, TailngTextInputComponent } from '@tailng/ui';
import { TailngIconComponent } from '@tailng/icons';

@Component({
  selector: 'docs-root',
  standalone: true,
  imports: [ReactiveFormsModule, TailngButtonComponent, TailngTextInputComponent, TailngCardComponent, TailngIconComponent],
  templateUrl: './app.component.html',
})
export class AppComponent {
  name = new FormControl('TailNG', { nonNullable: true });
}
