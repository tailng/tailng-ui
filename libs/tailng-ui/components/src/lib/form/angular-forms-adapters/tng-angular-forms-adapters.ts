import {
  Directive,
  forwardRef,
  inject,
  type OnDestroy,
  type Provider,
} from '@angular/core';
import {
  NG_VALUE_ACCESSOR,
  type ControlValueAccessor,
} from '@angular/forms';
import {
  normalizeRangeValue,
  type TngNumberRangeValue,
} from '@tailng-ui/primitives';

import {
  TngCheckboxComponent,
  coerceTngCheckboxModelValue,
  type TngCheckboxModelValue,
} from '../checkbox/tng-checkbox.component';
import { TngInputComponent } from '../input/tng-input.component';
import { TngInputOtpComponent } from '../input-otp/tng-input-otp.component';
import { TngNumberRangeComponent } from '../number-range/tng-number-range.component';
import { TngToggleComponent } from '../toggle/tng-toggle.component';

type SubscriptionLike = Readonly<{ unsubscribe: () => void }>;

function normalizeStringControlValue(value: unknown): string | null {
  if (value === null || value === undefined) return null;
  if (typeof value === 'string') return value;
  if (typeof value === 'number' || typeof value === 'boolean' || typeof value === 'bigint') {
    return String(value);
  }

  return null;
}

function normalizeOtpControlValue(value: unknown): string {
  return normalizeStringControlValue(value) ?? '';
}

function provideValueAccessor(type: () => unknown): Provider {
  return {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(type),
    multi: true,
  };
}

@Directive({
  selector:
    'tng-input[tngAngularForms][formControlName], tng-input[tngAngularForms][formControl], tng-input[tngAngularForms][ngModel]',
  providers: [provideValueAccessor(() => TngInputAngularFormsAdapter)],
})
export class TngInputAngularFormsAdapter implements ControlValueAccessor, OnDestroy {
  private readonly host = inject(TngInputComponent);
  private readonly subscriptions: SubscriptionLike[] = [
    this.host.value.subscribe((value) => {
      if (this.isWriting) return;
      this.onChange(value ?? '');
    }),
    this.host.touchedChange.subscribe(() => {
      this.onTouched();
    }),
  ];
  private isWriting = false;
  private onChange: (value: string) => void = () => undefined;
  private onTouched: () => void = () => undefined;

  public writeValue(value: unknown): void {
    this.writeModel(normalizeStringControlValue(value));
  }

  public registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  public registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  public setDisabledState(isDisabled: boolean): void {
    this.host.setFormDisabledState(isDisabled);
  }

  public ngOnDestroy(): void {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }

  private writeModel(value: string | null): void {
    this.isWriting = true;
    this.host.value.set(value);
    this.isWriting = false;
  }
}

@Directive({
  selector:
    'tng-checkbox[tngAngularForms][formControlName], tng-checkbox[tngAngularForms][formControl], tng-checkbox[tngAngularForms][ngModel]',
  providers: [provideValueAccessor(() => TngCheckboxAngularFormsAdapter)],
})
export class TngCheckboxAngularFormsAdapter implements ControlValueAccessor, OnDestroy {
  private readonly host = inject(TngCheckboxComponent);
  private readonly subscriptions: SubscriptionLike[] = [
    this.host.checked.subscribe((checked) => {
      if (this.isWriting) return;
      this.onChange(checked);
    }),
    this.host.touchedChange.subscribe(() => {
      this.onTouched();
    }),
  ];
  private isWriting = false;
  private onChange: (value: TngCheckboxModelValue) => void = () => undefined;
  private onTouched: () => void = () => undefined;

  public writeValue(value: unknown): void {
    const normalized = coerceTngCheckboxModelValue(value);
    this.isWriting = true;
    this.host.checked.set(normalized.checked);
    this.host.indeterminate.set(normalized.indeterminate);
    this.isWriting = false;
  }

  public registerOnChange(fn: (value: TngCheckboxModelValue) => void): void {
    this.onChange = fn;
  }

  public registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  public setDisabledState(isDisabled: boolean): void {
    this.host.setFormDisabledState(isDisabled);
  }

  public ngOnDestroy(): void {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }
}

@Directive({
  selector:
    'tng-toggle[tngAngularForms][formControlName], tng-toggle[tngAngularForms][formControl], tng-toggle[tngAngularForms][ngModel]',
  providers: [provideValueAccessor(() => TngToggleAngularFormsAdapter)],
})
export class TngToggleAngularFormsAdapter implements ControlValueAccessor, OnDestroy {
  private readonly host = inject(TngToggleComponent);
  private readonly subscriptions: SubscriptionLike[] = [
    this.host.checked.subscribe((checked) => {
      if (this.isWriting) return;
      this.onChange(checked);
    }),
    this.host.touchedChange.subscribe(() => {
      this.onTouched();
    }),
  ];
  private isWriting = false;
  private onChange: (value: boolean) => void = () => undefined;
  private onTouched: () => void = () => undefined;

  public writeValue(value: unknown): void {
    this.isWriting = true;
    this.host.checked.set(value === true);
    this.isWriting = false;
  }

  public registerOnChange(fn: (value: boolean) => void): void {
    this.onChange = fn;
  }

  public registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  public setDisabledState(isDisabled: boolean): void {
    this.host.setFormDisabledState(isDisabled);
  }

  public ngOnDestroy(): void {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }
}

@Directive({
  selector:
    'tng-input-otp[tngAngularForms][formControlName], tng-input-otp[tngAngularForms][formControl], tng-input-otp[tngAngularForms][ngModel]',
  providers: [provideValueAccessor(() => TngInputOtpAngularFormsAdapter)],
})
export class TngInputOtpAngularFormsAdapter implements ControlValueAccessor, OnDestroy {
  private readonly host = inject(TngInputOtpComponent);
  private readonly subscriptions: SubscriptionLike[] = [
    this.host.value.subscribe((value) => {
      if (this.isWriting) return;
      this.onChange(value);
    }),
    this.host.touchedChange.subscribe(() => {
      this.onTouched();
    }),
  ];
  private isWriting = false;
  private onChange: (value: string) => void = () => undefined;
  private onTouched: () => void = () => undefined;

  public writeValue(value: unknown): void {
    this.isWriting = true;
    this.host.value.set(normalizeOtpControlValue(value));
    this.isWriting = false;
  }

  public registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  public registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  public setDisabledState(isDisabled: boolean): void {
    this.host.setFormDisabledState(isDisabled);
  }

  public ngOnDestroy(): void {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }
}

@Directive({
  selector:
    'tng-number-range[tngAngularForms][formControlName], tng-number-range[tngAngularForms][formControl], tng-number-range[tngAngularForms][ngModel]',
  providers: [provideValueAccessor(() => TngNumberRangeAngularFormsAdapter)],
})
export class TngNumberRangeAngularFormsAdapter implements ControlValueAccessor, OnDestroy {
  private readonly host = inject(TngNumberRangeComponent);
  private readonly subscriptions: SubscriptionLike[] = [
    this.host.value.subscribe((value) => {
      if (this.isWriting) return;
      this.onChange(normalizeRangeValue(value));
    }),
    this.host.touchedChange.subscribe(() => {
      this.onTouched();
    }),
  ];
  private isWriting = false;
  private onChange: (value: TngNumberRangeValue) => void = () => undefined;
  private onTouched: () => void = () => undefined;

  public writeValue(value: unknown): void {
    this.isWriting = true;
    this.host.value.set(normalizeRangeValue(value));
    this.isWriting = false;
  }

  public registerOnChange(fn: (value: TngNumberRangeValue) => void): void {
    this.onChange = fn;
  }

  public registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  public setDisabledState(isDisabled: boolean): void {
    this.host.setFormDisabledState(isDisabled);
  }

  public ngOnDestroy(): void {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }
}
