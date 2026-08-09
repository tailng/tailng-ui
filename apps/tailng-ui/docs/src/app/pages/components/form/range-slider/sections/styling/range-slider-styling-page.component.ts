import { Component, signal } from '@angular/core';
import {
  TngCodeBlockComponent,
  TngRangeSliderComponent,
  type TngRangeSliderValue,
} from '@tailng-ui/components';

const TOKEN_CODE = String.raw`tng-range-slider.price-filter {
  --tng-slider-track-color: #d1d5db;
  --tng-slider-range-color: #0f766e;
  --tng-slider-thumb-color: #ffffff;
  --tng-slider-thumb-border-color: #0f766e;
  --tng-slider-track-size: 0.5rem;
  --tng-slider-thumb-size: 1.25rem;
}`;

@Component({
  selector: 'app-range-slider-styling-page',
  imports: [TngCodeBlockComponent, TngRangeSliderComponent],
  templateUrl: './range-slider-styling-page.component.html',
  styleUrl: '../../range-slider-docs.css',
})
export class RangeSliderStylingPageComponent {
  protected readonly tokenCode = TOKEN_CODE;
  protected readonly range = signal<TngRangeSliderValue>({ min: 25, max: 80 });
}
