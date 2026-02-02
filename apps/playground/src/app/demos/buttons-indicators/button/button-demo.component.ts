import { Component } from '@angular/core';
import { TailngButtonComponent } from '@tociva/tailng-ui/buttons-indicators';
import { TailngIconComponent } from '@tociva/tailng-icons/icon';

@Component({
  selector: 'playground-button-demo',
  standalone: true,
  imports: [TailngButtonComponent, TailngIconComponent],
  templateUrl: './button-demo.component.html',
})
export class ButtonDemoComponent {}
