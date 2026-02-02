import { Component } from '@angular/core';
import { TngTimepicker } from '@tociva/tailng-ui/form-controls';

@Component({
  selector: 'playground-timepicker-demo',
  standalone: true,
  imports: [TngTimepicker],
  templateUrl: './timepicker-demo.component.html',
})
export class TimepickerDemoComponent {}

