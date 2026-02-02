import { Component, signal } from '@angular/core';
import { TngSlider } from '@tociva/tailng-ui/form-controls';

@Component({
  selector: 'playground-slider-demo',
  standalone: true,
  imports: [TngSlider],
  templateUrl: './slider-demo.component.html',
})
export class SliderDemoComponent {
  readonly volume = signal(30);
  readonly brightness = signal(70);
}
