import { Component } from '@angular/core';
import { TngCodeBlockComponent } from '@tailng-ui/components';

type ApiRow = {
  readonly name: string;
  readonly type: string;
  readonly details: string;
};

const WRAPPER_ATTACHMENT_CODE = String.raw`<tng-slider
  [value]="brightness()"
  (valueChange)="brightness.set($event)"
  [min]="0"
  [max]="100"
  [step]="5"
  aria-label="Brightness"
></tng-slider>`;

const RANGE_WRAPPER_ATTACHMENT_CODE = String.raw`<tng-range-slider
  [value]="priceRange()"
  (valueChange)="priceRange.set($event)"
  [min]="0"
  [max]="100"
  [step]="5"
  [minGap]="10"
  aria-label="Price range"
  minAriaLabel="Minimum price"
  maxAriaLabel="Maximum price"
></tng-range-slider>`;

const PRIMITIVE_ATTACHMENT_CODE = String.raw`<input
  tngSlider
  [value]="brightness()"
  (input)="onBrightnessInput($event)"
  [min]="0"
  [max]="100"
  [step]="5"
  aria-label="Brightness"
/>`;

const SIGNAL_FORMS_CODE = String.raw`import { Component, signal } from '@angular/core';
import { FormField, form } from '@angular/forms/signals';
import {
  TngRangeSliderComponent,
  TngSliderComponent,
  type TngRangeSliderValue,
} from '@tailng-ui/components';

@Component({
  selector: 'app-volume-signal-form',
  standalone: true,
  imports: [FormField, TngRangeSliderComponent, TngSliderComponent],
  template: \`
    <tng-slider
      [formField]="settingsForm.volume"
      [min]="0"
      [max]="100"
      aria-label="Volume"
    ></tng-slider>
    <tng-range-slider
      [formField]="settingsForm.priceRange"
      [min]="0"
      [max]="100"
      minAriaLabel="Minimum price"
      maxAriaLabel="Maximum price"
    ></tng-range-slider>
  \`,
})
export class VolumeSignalFormComponent {
  readonly settingsModel = signal<{
    volume: number;
    priceRange: TngRangeSliderValue;
  }>({
    volume: 25,
    priceRange: { min: 20, max: 80 },
  });
  readonly settingsForm = form(this.settingsModel);
}`;

@Component({
  selector: 'app-slider-api-page',
  imports: [TngCodeBlockComponent],
  templateUrl: './slider-api-page.component.html',
  styleUrl: './slider-api-page.component.css',
})
export class SliderApiPageComponent {
  protected readonly wrapperAttachmentCode = WRAPPER_ATTACHMENT_CODE;
  protected readonly rangeWrapperAttachmentCode = RANGE_WRAPPER_ATTACHMENT_CODE;
  protected readonly primitiveAttachmentCode = PRIMITIVE_ATTACHMENT_CODE;
  protected readonly signalFormsCode = SIGNAL_FORMS_CODE;

  protected readonly wrapperRows: readonly ApiRow[] = Object.freeze([
    {
      name: 'value / valueChange',
      type: 'number / output',
      details: 'Controlled numeric model for the committed slider value.',
    },
    {
      name: 'min',
      type: 'number',
      details: 'Lower bound forwarded to the inner range input. Defaults to 0.',
    },
    {
      name: 'max',
      type: 'number',
      details: 'Upper bound forwarded to the inner range input. Defaults to 100.',
    },
    {
      name: 'step',
      type: 'number',
      details: 'Positive increment forwarded to the inner range input. Defaults to 1.',
    },
    {
      name: 'disabled',
      type: 'boolean',
      details: 'Disables the slider and reflects disabled state for styling.',
    },
    {
      name: 'invalid, required',
      type: 'boolean',
      details: 'Forwarded to form-field integration for validation and labeling state.',
    },
    {
      name: 'aria-label, ariaValueText',
      type: 'string | null',
      details: 'Accessible name and optional human-readable value text for the pointer.',
    },
  ]);

  protected readonly primitiveRows: readonly ApiRow[] = Object.freeze([
    {
      name: 'input[tngSlider]',
      type: 'Directive',
      details:
        'Headless attachment for custom range markup while preserving normalized range inputs.',
    },
    {
      name: 'data-slot="slider"',
      type: 'Attribute',
      details: 'Stable styling hook reflected by the primitive input.',
    },
    {
      name: 'data-disabled',
      type: 'Attribute',
      details: 'Presence attribute reflected when the primitive is disabled.',
    },
  ]);

  protected readonly rangeRows: readonly ApiRow[] = Object.freeze([
    {
      name: 'value / valueChange',
      type: 'TngRangeSliderValue / output',
      details: 'Controlled { min, max } model updated by either pointer.',
    },
    {
      name: 'min, max',
      type: 'number',
      details: 'Outer bounds for both pointers. Defaults to 0 and 100.',
    },
    {
      name: 'step',
      type: 'number',
      details: 'Positive increment used for pointer and keyboard changes. Defaults to 1.',
    },
    {
      name: 'minGap',
      type: 'number',
      details: 'Minimum permitted distance between pointers. Defaults to 0.',
    },
    {
      name: 'minAriaLabel, maxAriaLabel',
      type: 'string',
      details: 'Distinct accessible names for the minimum and maximum pointers.',
    },
    {
      name: 'minValueText, maxValueText',
      type: 'string | null',
      details: 'Optional human-readable aria-valuetext for each pointer.',
    },
    {
      name: 'aria-label, aria-labelledby, aria-describedby',
      type: 'string | null',
      details: 'Group context and descriptions combined with each pointer label.',
    },
    {
      name: 'disabled, invalid, required',
      type: 'boolean',
      details: 'Shared state applied to both pointers and form-field integration.',
    },
  ]);
}
