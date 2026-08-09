import { Component } from '@angular/core';
import { TngCodeBlockComponent } from '@tailng-ui/components';

type ApiRow = Readonly<{ name: string; type: string; details: string }>;

const SIGNAL_FORMS_CODE = String.raw`<tng-range-slider
  [formField]="filtersForm.priceRange"
  [lowerBound]="0"
  [upperBound]="100"
  [step]="5"
  minAriaLabel="Minimum price"
  maxAriaLabel="Maximum price"
/>`;

@Component({
  selector: 'app-range-slider-api-page',
  imports: [TngCodeBlockComponent],
  templateUrl: './range-slider-api-page.component.html',
  styleUrl: '../../range-slider-docs.css',
})
export class RangeSliderApiPageComponent {
  protected readonly signalFormsCode = SIGNAL_FORMS_CODE;
  protected readonly rows: readonly ApiRow[] = [
    {
      name: 'value / valueChange',
      type: 'TngRangeSliderValue / output',
      details: 'Controlled { min, max } selection updated by either thumb.',
    },
    {
      name: 'lowerBound, upperBound',
      type: 'number | undefined',
      details: 'Form-safe outer bounds for both thumbs. Defaults to 0 and 100.',
    },
    {
      name: 'min, max',
      type: 'number | undefined',
      details: 'Deprecated standalone aliases. Do not combine them with formField.',
    },
    { name: 'step', type: 'number', details: 'Positive increment. Defaults to 1.' },
    {
      name: 'minGap',
      type: 'number',
      details: 'Minimum permitted distance between the selected endpoints.',
    },
    {
      name: 'minAriaLabel, maxAriaLabel',
      type: 'string',
      details: 'Distinct accessible names for the minimum and maximum thumbs.',
    },
    {
      name: 'disabled, invalid, required',
      type: 'boolean',
      details: 'Shared control state integrated with tng-form-field and Signal Forms.',
    },
  ];
}
