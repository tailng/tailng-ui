import { Component } from '@angular/core';
import { TngIcon } from '@tociva/tailng-icons/icon';

@Component({
  selector: 'playground-icon-demo',
  standalone: true,
  imports: [TngIcon],
  templateUrl: './icon-demo.component.html',
})
export class IconDemoComponent {
  // ONLY icons registered in provideIcons() are valid
  iconNames = {
    alarm: 'bootstrapAlarm',
    bell: 'bootstrapBell',
  };

  dynamicName = this.iconNames.alarm;
  dynamicSize: number | string = 20;
  dynamicKlass = 'text-slate-700';
  decorative = true;
  ariaLabel = 'Alarm';
}
