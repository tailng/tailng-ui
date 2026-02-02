import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import dayjs from 'dayjs';

import { TngDatepicker } from '@tociva/tailng-ui/form-controls';

type DemoForm = {
  period: FormControl<Date | null>;
};

@Component({
  selector: 'playground-datepicker-demo',
  standalone: true,
  imports: [ReactiveFormsModule, DatePipe, TngDatepicker],
  templateUrl: './datepicker-demo.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DatepickerDemoComponent {
  readonly min = dayjs().subtract(1, 'year').startOf('day').toDate();
  readonly max = dayjs().add(10, 'year').endOf('day').toDate();

  readonly disabled = signal(false);

  readonly form = new FormGroup<DemoForm>({
    period: new FormControl<Date | null>(dayjs().startOf('day').toDate(), {
      nonNullable: false,
      validators: [Validators.required],
    }),
  });

  readonly valueLabel = computed(() => {
    const v = this.form.controls.period.value;
    return v ? dayjs(v).format('DD MMM YYYY') : '—';
  });

  readonly debugValue = computed(() => {
    const v = this.form.controls.period.value;
    return v ? dayjs(v).format('YYYY-MM-DD') : 'null';
  });

  toggleDisabled(): void {
    this.disabled.update((v) => !v);

    const ctrl = this.form.controls.period;
    if (this.disabled()) ctrl.disable({ emitEvent: false });
    else ctrl.enable({ emitEvent: false });
  }

  setToday(): void {
    this.form.controls.period.setValue(dayjs().startOf('day').toDate());
    this.form.controls.period.markAsTouched();
  }

  clear(): void {
    this.form.controls.period.setValue(null);
    this.form.controls.period.markAsTouched();
  }

  submit(): void {
    this.form.markAllAsTouched();
    // eslint-disable-next-line no-console
    console.log('submit', this.form.value);
  }

  readonly minLabel = computed(() => dayjs(this.min).format('DD MMM YYYY'));
  readonly maxLabel = computed(() => dayjs(this.max).format('DD MMM YYYY'));
}
