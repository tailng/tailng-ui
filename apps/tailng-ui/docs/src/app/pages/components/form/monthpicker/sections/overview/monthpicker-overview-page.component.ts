import { Component } from '@angular/core';
import { TngMonthpickerComponent } from '@tailng-ui/components';

@Component({
  selector: 'app-monthpicker-overview-page',
  imports: [TngMonthpickerComponent],
  template: `
    <article class="grid gap-6">
      <header class="grid gap-2">
        <h2 class="m-0 text-2xl font-semibold">Monthpicker overview</h2>
        <p class="m-0 max-w-4xl text-tng-fg-secondary">
          Monthpicker selects one calendar month without inventing a day. It is intended for report
          periods, billing cycles, archive filters, and other workflows whose value is a year and a
          month.
        </p>
      </header>

      <section class="grid gap-3" aria-labelledby="monthpicker-overview-sample">
        <h3 id="monthpicker-overview-sample" class="m-0 text-xl font-semibold">Simple sample</h3>
        <div class="max-w-sm">
          <tng-monthpicker
            [defaultValue]="{ year: 2026, month: 11 }"
            [minMonth]="{ year: 2020, month: 1 }"
            [maxMonth]="{ year: 2030, month: 12 }"
          />
        </div>
      </section>

      <section class="grid gap-3" aria-labelledby="monthpicker-overview-value">
        <h3 id="monthpicker-overview-value" class="m-0 text-xl font-semibold">Value model</h3>
        <p class="m-0 max-w-4xl text-tng-fg-secondary">
          The value is <code>{{ '{' }} year: number, month: number {{ '}' }}</code
          >, where month is one-based. The field uses <code>YYYY-MM</code> for predictable manual
          entry and display.
        </p>
        <pre
          class="overflow-auto rounded-xl border border-tng-border-subtle p-4"
        ><code>&lt;tng-monthpicker [(value)]="reportMonth" /&gt;</code></pre>
      </section>

      <section class="grid gap-3" aria-labelledby="monthpicker-overview-behavior">
        <h3 id="monthpicker-overview-behavior" class="m-0 text-xl font-semibold">Selection flow</h3>
        <ul class="m-0 grid max-w-4xl gap-2 pl-5 text-tng-fg-secondary">
          <li>The popup opens directly on the twelve-month grid.</li>
          <li>The period heading opens year selection; choosing a year does not commit.</li>
          <li>Choosing a month commits the combined year-month value and closes the popup.</li>
          <li>No day grid or timezone-bearing public <code>Date</code> value is exposed.</li>
        </ul>
      </section>
    </article>
  `,
})
export class MonthpickerOverviewPageComponent {}
