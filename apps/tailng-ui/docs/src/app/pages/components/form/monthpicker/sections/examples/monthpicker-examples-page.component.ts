import { Component, computed, signal } from '@angular/core';
import { TngMonthpickerComponent, type TngYearMonthValue } from '@tailng-ui/components';

@Component({
  selector: 'app-monthpicker-examples-page',
  imports: [TngMonthpickerComponent],
  template: `
    <article class="grid gap-6">
      <header class="grid gap-2">
        <h2 class="m-0 text-2xl font-semibold">Monthpicker examples</h2>
        <p class="m-0 max-w-4xl text-tng-fg-secondary">
          Use a half-open interval when turning the selected month into report query bounds.
        </p>
      </header>

      <section class="grid gap-4" aria-labelledby="monthpicker-example-report">
        <h3 id="monthpicker-example-report" class="m-0 text-xl font-semibold">Report month</h3>
        <div class="max-w-sm">
          <tng-monthpicker
            [(value)]="reportMonth"
            [minMonth]="{ year: 2020, month: 1 }"
            [maxMonth]="{ year: 2030, month: 12 }"
          />
        </div>
        <div class="grid max-w-2xl gap-1 rounded-xl border border-tng-border-subtle p-4 text-sm">
          <span
            ><strong>From:</strong> <code>{{ reportBounds().start }}</code> inclusive</span
          >
          <span
            ><strong>To:</strong> <code>{{ reportBounds().end }}</code> exclusive</span
          >
        </div>
      </section>

      <section class="grid gap-3" aria-labelledby="monthpicker-example-query">
        <h3 id="monthpicker-example-query" class="m-0 text-xl font-semibold">Query rule</h3>
        <pre
          class="overflow-auto rounded-xl border border-tng-border-subtle p-4"
        ><code>timestamp &gt;= startOfSelectedMonth
timestamp &lt; startOfNextMonth</code></pre>
        <p class="m-0 max-w-4xl text-tng-fg-secondary">
          Construct these boundaries in the reporting timezone. Avoid a last-day
          <code>23:59:59.999</code> boundary.
        </p>
      </section>
    </article>
  `,
})
export class MonthpickerExamplesPageComponent {
  protected readonly reportMonth = signal<TngYearMonthValue | undefined>({
    month: 11,
    year: 2026,
  });
  protected readonly reportBounds = computed(() => {
    const value = this.reportMonth();
    if (value === undefined) {
      return { end: '—', start: '—' };
    }

    const nextMonth = value.month === 12 ? 1 : value.month + 1;
    const nextYear = value.month === 12 ? value.year + 1 : value.year;
    return {
      start: `${value.year}-${String(value.month).padStart(2, '0')}-01`,
      end: `${nextYear}-${String(nextMonth).padStart(2, '0')}-01`,
    };
  });
}
