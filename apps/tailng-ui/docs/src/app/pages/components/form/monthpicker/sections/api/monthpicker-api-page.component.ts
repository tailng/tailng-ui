import { Component } from '@angular/core';

type ApiRow = Readonly<{ default: string; details: string; name: string; type: string }>;

@Component({
  selector: 'app-monthpicker-api-page',
  template: `
    <article class="grid gap-6">
      <header class="grid gap-2">
        <h2 class="m-0 text-2xl font-semibold">Monthpicker API</h2>
        <p class="m-0 max-w-4xl text-tng-fg-secondary">
          Import <code>TngMonthpickerComponent</code> and <code>TngYearMonthValue</code> from
          <code>&#64;tailng-ui/components</code>.
        </p>
      </header>

      <section class="grid gap-3" aria-labelledby="monthpicker-api-inputs">
        <h3 id="monthpicker-api-inputs" class="m-0 text-xl font-semibold">Inputs and models</h3>
        <div class="overflow-x-auto rounded-xl border border-tng-border-subtle">
          <table class="min-w-full border-collapse text-left text-sm">
            <thead>
              <tr>
                <th>Property</th>
                <th>Type</th>
                <th>Default</th>
                <th>Details</th>
              </tr>
            </thead>
            <tbody>
              @for (row of rows; track row.name) {
                <tr>
                  <td>
                    <code>{{ row.name }}</code>
                  </td>
                  <td>
                    <code>{{ row.type }}</code>
                  </td>
                  <td>
                    <code>{{ row.default }}</code>
                  </td>
                  <td>{{ row.details }}</td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      </section>

      <section class="grid gap-3" aria-labelledby="monthpicker-api-outputs">
        <h3 id="monthpicker-api-outputs" class="m-0 text-xl font-semibold">Outputs</h3>
        <p class="m-0 text-tng-fg-secondary">
          <code>valueChange</code> emits <code>TngYearMonthValue | undefined</code> through the
          model, and <code>openChange</code> emits the popup state.
        </p>
      </section>
    </article>
  `,
})
export class MonthpickerApiPageComponent {
  protected readonly rows: readonly ApiRow[] = [
    {
      name: 'value',
      type: 'TngYearMonthValue | undefined',
      default: 'undefined',
      details: 'Two-way model for the committed month.',
    },
    {
      name: 'defaultValue',
      type: 'TngYearMonthValue',
      default: 'current month',
      details: 'Initial uncontrolled month.',
    },
    {
      name: 'minMonth',
      type: 'TngYearMonthValue | undefined',
      default: 'undefined',
      details: 'Earliest selectable month.',
    },
    {
      name: 'maxMonth',
      type: 'TngYearMonthValue | undefined',
      default: 'undefined',
      details: 'Latest selectable month.',
    },
    {
      name: 'allowManualInput',
      type: 'boolean',
      default: 'true',
      details: 'Allows strict YYYY-MM entry.',
    },
    {
      name: 'readonly',
      type: 'boolean',
      default: 'false',
      details: 'Blocks typing while preserving popup selection.',
    },
    {
      name: 'disabled',
      type: 'boolean',
      default: 'false',
      details: 'Disables the field and popup interaction.',
    },
    {
      name: 'placeholder',
      type: 'string',
      default: 'YYYY-MM',
      details: 'Placeholder for the text field.',
    },
    {
      name: 'required / invalid',
      type: 'boolean',
      default: 'false',
      details: 'Form and accessibility state.',
    },
    {
      name: 'yearPageSize',
      type: 'number | string',
      default: '24',
      details: 'Number of years displayed per page.',
    },
    {
      name: 'scrollStrategy',
      type: 'TngOverlayScrollStrategy',
      default: 'reposition',
      details: 'Popup behavior while scrolling.',
    },
  ];
}
