import { Component } from '@angular/core';
import { TngButton } from '@tociva/tailng-ui/buttons-indicators';
import { TngIcon } from '@tociva/tailng-icons/icon';

@Component({
  selector: 'playground-button-demo',
  standalone: true,
  imports: [TngButton, TngIcon],
  templateUrl: './button-demo.component.html',
})
export class ButtonDemoComponent {}
