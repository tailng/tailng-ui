import { JsonPipe } from '@angular/common';
import { Component, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TngTimepicker } from '@tailng-ui/ui/form';
import { TngIcon } from '@tailng-ui/icons/icon';
import { TngTimePickerHourDownArrowSlot, TngTimePickerHourUpArrowSlot, TngTimePickerIconSlot, TngTimePickerMinuteUpArrowSlot } from 'libs/ui/form/src/lib/timepicker/time-picker.directive';
@Component({
  selector: 'playground-timepicker-demo',
  standalone: true,
  imports: [
    TngTimepicker,
    ReactiveFormsModule,
    JsonPipe,
    TngIcon,
    TngTimePickerHourUpArrowSlot,
    TngTimePickerHourDownArrowSlot,
    TngTimePickerMinuteUpArrowSlot,
    TngTimePickerHourDownArrowSlot,
    TngTimePickerIconSlot
],
  templateUrl: './timepicker-demo.component.html',
})
export class TimepickerDemoComponent {
  form = new FormGroup({
    timeValue: new FormControl<string | null>(null, {
      nonNullable: false,
      validators: [Validators.required],
    }),
  });
  get selectedTimeCrtl() {
    return this.form.get('timeValue')?.value;
  }
  isDisabled = signal(false);
  toggleDisable() {
    this.isDisabled.update((current) => {
      const newState = !current;
      if (newState) {
        this.form.get('timeValue')?.disable({ emitEvent: false });
      } else {
        this.form.get('timeValue')?.enable({ emitEvent: false });
      }

      return newState;
    });
  }
  timeFormatValue = signal(12);
  showSecondsValue = signal(false);

  updateTimeFormat(value: number) {
    this.timeFormatValue.set(value);
    this.showSecondsValue.set(true);
    this.clear();
  }
  updateShowSeconds(value: number) {
    this.timeFormatValue.set(value);
    this.showSecondsValue.set(false);
    this.clear();
  }
  clear(): void {
    this.form.controls.timeValue.setValue(null);
    this.form.controls.timeValue.markAsTouched();
  }
}
