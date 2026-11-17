import { computed, Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import {
  TngCardComponent,
  TngCardContentComponent,
  TngCardDescriptionComponent,
  TngCardHeaderComponent,
  TngCardTitleComponent,
  TngMonthDaypickerComponent,
  TngSliderComponent,
  TngToggleComponent,
  TngToggleGroupComponent,
  TngYearpickerComponent,
} from '@tailng-ui/components';
import { TngIcon } from '@tailng-ui/icons';
import { map } from 'rxjs/operators';
import {
  COMPONENTS_FORM_GROUP,
  toComponentsDocsRouteData,
  type ComponentsDocsRouteData,
} from '../../component-docs.data';

interface SignalFormsReviewRow {
  readonly component: string;
  readonly status: string;
  readonly details: string;
}

const fallbackData: ComponentsDocsRouteData = toComponentsDocsRouteData(
  COMPONENTS_FORM_GROUP,
  COMPONENTS_FORM_GROUP.items[0]!,
);

@Component({
  selector: 'app-form-landing-page',
  imports: [
    TngCardComponent,
    TngCardHeaderComponent,
    TngCardTitleComponent,
    TngCardDescriptionComponent,
    TngCardContentComponent,
    TngMonthDaypickerComponent,
    TngSliderComponent,
    TngToggleComponent,
    TngToggleGroupComponent,
    TngYearpickerComponent,
    TngIcon,
  ],
  templateUrl: './form-landing-page.component.html',
  styleUrl: './form-landing-page.component.css',
})
export class FormLandingPageComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly routeData = toSignal(
    this.route.data.pipe(
      map((data) => (data as ComponentsDocsRouteData | undefined) ?? fallbackData),
    ),
    { initialValue: fallbackData },
  );

  public readonly item = computed(() => this.routeData().item);
  public readonly groupTitle = computed(() => this.routeData().groupTitle);

  public readonly signalFormsReviewRows: readonly SignalFormsReviewRow[] = Object.freeze([
    {
      component: 'tng-input',
      status: 'Ready',
      details: 'Works with Angular Signal Forms through the FormValueControl model contract. Legacy Angular forms use the explicit tngAngularForms adapter.',
    },
    {
      component: 'tng-checkbox',
      status: 'Ready',
      details: 'Works with Angular Signal Forms through the FormCheckboxControl checked model. The legacy adapter maps boolean and mixed values explicitly.',
    },
    {
      component: 'tng-toggle',
      status: 'Ready',
      details: 'Works with Angular Signal Forms through checked. pressed/pressedChange remain compatibility aliases.',
    },
    {
      component: 'tng-input-otp',
      status: 'Ready',
      details: 'Works with Angular Signal Forms through the FormValueControl string model. Legacy Angular forms use the explicit tngAngularForms adapter.',
    },
    {
      component: 'tng-select',
      status: 'Ready',
      details: 'Works directly with [formField] because the host directive exposes a model-backed value signal.',
    },
    {
      component: 'tng-multiselect',
      status: 'Ready',
      details: 'Works directly with [formField] for readonly array values through the host directive model.',
    },
    {
      component: 'tng-multi-autocomplete',
      status: 'Ready',
      details: 'Works directly with [formField] for readonly array values through the host directive model.',
    },
    {
      component: 'tng-autocomplete',
      status: 'Not ready',
      details: 'Do not bind [formField] directly yet. External field updates are currently collapsed back to null in local interop tests.',
    },
    {
      component: 'tng-textarea',
      status: 'Ready',
      details: 'Works with Angular Signal Forms through the FormValueControl text model.',
    },
    {
      component: 'tng-radio',
      status: 'Ready',
      details: 'Works as a standalone checked signal-form control. Use radio groups for coordinated option values.',
    },
    {
      component: 'tng-switch',
      status: 'Ready',
      details: 'Works with Angular Signal Forms through the FormCheckboxControl checked model while keeping hidden native input submission.',
    },
    {
      component: 'tng-datepicker',
      status: 'Ready',
      details: 'Works with Angular Signal Forms through the FormValueControl date model and remains form-field aware.',
    },
    {
      component: 'tng-button-toggle-group',
      status: 'Not ready',
      details: 'Group state is controlled with value/values inputs and outputs, not a direct signal-form field binding.',
    },
    {
      component: 'tng-toggle-group',
      status: 'Not ready',
      details: 'Group state is coordinated by value/values inputs and outputs, not a direct signal-form field binding.',
    },
    {
      component: 'tng-month-daypicker',
      status: 'Ready',
      details: 'Works with Angular Signal Forms through the FormValueControl month-day model.',
    },
    {
      component: 'tng-monthpicker',
      status: 'Ready',
      details: 'Works with Angular Signal Forms through the FormValueControl year-month model.',
    },
    {
      component: 'tng-yearpicker',
      status: 'Ready',
      details: 'Works with Angular Signal Forms through the FormValueControl year model.',
    },
    {
      component: 'tng-chips',
      status: 'Not a field',
      details: 'Treat this as selected-value presentation and removal UI around another field model, not as a standalone form control.',
    },
    {
      component: 'tng-input-field',
      status: 'Not a field',
      details: 'Shell only. Pair it with input[tngInput] or another actual field control.',
    },
    {
      component: 'tng-label',
      status: 'Not a field',
      details: 'Label helper only. Use it with another signal-form-compatible control.',
    },
    {
      component: 'tng-listbox',
      status: 'Not a field',
      details: 'Headless selection primitive, not a direct signal-form field surface.',
    },
    {
      component: 'tng-slider',
      status: 'Ready',
      details: 'Works with Angular Signal Forms through the FormValueControl numeric model.',
    },
  ]);
}
