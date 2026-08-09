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
import { TngSliderComponent } from '@tailng-ui/components';

@Component({
  selector: 'app-volume-signal-form',
  standalone: true,
  imports: [FormField, TngSliderComponent],
  template: \`
    <tng-slider
      [formField]="settingsForm.volume"
      [min]="0"
      [max]="100"
      aria-label="Volume"
    ></tng-slider>
  \`,
})
export class VolumeSignalFormComponent {
  readonly settingsModel = signal({ volume: 25 });
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

  protected readonly rangeGuidanceRows: readonly ApiRow[] = Object.freeze([
    {
      name: 'Single value',
      type: 'tng-slider',
      details:
        'Use the wrapper when one numeric value is enough and the native range track is acceptable.',
    },
    {
      name: 'Min/max range',
      type: 'Two sliders',
      details:
        'Coordinate two slider values in parent state and clamp each thumb against the other.',
    },
    {
      name: 'Custom range visuals',
      type: 'input[tngSlider]',
      details:
        'Use the primitive when the track, fill, or multi-thumb layout needs custom DOM ownership.',
    },
  ]);
}
