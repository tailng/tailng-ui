import { Component } from '@angular/core';

@Component({
  selector: 'app-monthpicker-styling-page',
  template: `
    <article class="grid gap-6">
      <header class="grid gap-2">
        <h2 class="m-0 text-2xl font-semibold">Monthpicker styling</h2>
        <p class="m-0 max-w-4xl text-tng-fg-secondary">
          Monthpicker composes the shared datepicker, so it uses the same slots and
          <code>--tng-datepicker-*</code> theme contract.
        </p>
      </header>

      <section class="grid gap-3" aria-labelledby="monthpicker-styling-slots">
        <h3 id="monthpicker-styling-slots" class="m-0 text-xl font-semibold">Useful slots</h3>
        <p class="m-0 max-w-4xl text-tng-fg-secondary">
          Target <code>datepicker-input-shell</code>, <code>datepicker-trigger</code>,
          <code>datepicker-overlay</code>, <code>datepicker-month</code>, and
          <code>datepicker-year</code> through their <code>data-slot</code> attributes.
        </p>
      </section>

      <section class="grid gap-3" aria-labelledby="monthpicker-styling-tokens">
        <h3 id="monthpicker-styling-tokens" class="m-0 text-xl font-semibold">Compact variant</h3>
        <pre
          class="overflow-auto rounded-xl border border-tng-border-subtle p-4"
        ><code>.compact-monthpicker {{ '{' }}
  --tng-datepicker-field-height: 2.6rem;
  --tng-datepicker-picker-cell-size: 2.1rem;
  --tng-datepicker-overlay-padding: 0.6rem;
  --tng-datepicker-grid-gap: 0.2rem;
{{ '}' }}</code></pre>
      </section>
    </article>
  `,
})
export class MonthpickerStylingPageComponent {}
