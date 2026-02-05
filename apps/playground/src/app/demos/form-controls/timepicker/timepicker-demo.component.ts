import { Component } from '@angular/core';
import { TngTimepicker } from '@tailng-ui/ui/form';

@Component({
  selector: 'playground-timepicker-demo',
  standalone: true,
  imports: [TngTimepicker],
  templateUrl: './timepicker-demo.component.html',
})
export class TimepickerDemoComponent {}

