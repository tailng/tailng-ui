import { Component, signal } from '@angular/core';
import { TailngSliderComponent } from '@tociva/tailng-ui';

@Component({
  selector: 'playground-slider-demo',
  standalone: true,
  imports: [TailngSliderComponent],
  templateUrl: './slider-demo.component.html',
})
export class SliderDemoComponent {
  readonly volume = signal(30);
  readonly brightness = signal(70);
}
