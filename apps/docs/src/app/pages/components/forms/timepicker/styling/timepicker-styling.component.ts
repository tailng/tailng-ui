import { Component, computed } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TngSlotMap, TngTimepicker, TngTimepickerSlot } from '@tailng-ui/ui/form';
import { TngTag } from '@tailng-ui/ui/primitives';
import { ExampleBlockComponent } from 'apps/docs/src/app/shared/example-block/example-block.component';

@Component({
  standalone: true,
  selector: 'docs-timepicker-styling',
  templateUrl: './timepicker-styling.component.html',
  imports: [TngTag, ExampleBlockComponent, ReactiveFormsModule, TngTimepicker],
})
export class TimepickerStylingComponent {
  form = new FormGroup({
    timeValue: new FormControl<string | null>(null, {
      nonNullable: false,
      validators: [Validators.required],
    }),
  });

  // Slot examples

  containerSlot: TngSlotMap<TngTimepickerSlot> = {
    container: 'border-2 border-blue-400 p-2',
  };

  disabledSlot: TngSlotMap<TngTimepickerSlot> = {
    disabled: 'bg-gray-100',
  };

  fieldSlot: TngSlotMap<TngTimepickerSlot> = {
    field: 'border-2 border-purple-300',
  };

  inputSlot: TngSlotMap<TngTimepickerSlot> = {
    input: 'border-2 border-blue-500 rounded-lg font-semibold',
  };

  toggleSlot: TngSlotMap<TngTimepickerSlot> = {
    toggle: 'bg-blue-100 hover:bg-blue-200 rounded-r-md',
  };

  toggleIconSlot: TngSlotMap<TngTimepickerSlot> = {
    toggleIcon: 'text-blue-600',
  };

  overlayPanelSlot: TngSlotMap<TngTimepickerSlot> = {
    overlayPanel: 'border-2 border-green-500 max-h-screen',
  };

  panelFrameSlot: TngSlotMap<TngTimepickerSlot> = {
    panelFrame: 'border-4 border-purple-500 shadow-2xl',
  };

  panelLayoutSlot: TngSlotMap<TngTimepickerSlot> = {
    panelLayout: 'bg-gray-50',
  };

  hourRailSlot: TngSlotMap<TngTimepickerSlot> = {
    hourRail: 'bg-blue-50 border-l-2 border-blue-300',
  };

  hourNavPreSlot: TngSlotMap<TngTimepickerSlot> = {
    hourNavPrev: 'bg-blue-200 hover:bg-blue-300',
  };

  hourNavNextSlot: TngSlotMap<TngTimepickerSlot> = {
    hourNavNext: 'bg-blue-200 hover:bg-blue-300',
  };

  hourListSlot: TngSlotMap<TngTimepickerSlot> = {
    hourList: 'gap-1',
  };
  hourItemSlot: TngSlotMap<TngTimepickerSlot> = {
    hourItem: 'hover:bg-blue-100 font-bold',
  };

  secondRailSlot: TngSlotMap<TngTimepickerSlot> = {
    secondRail: 'bg-blue-50 border-l-2 border-blue-300',
  };

  secondNavPrevSlot: TngSlotMap<TngTimepickerSlot> = {
    secondNavPrev: 'bg-blue-200 hover:bg-blue-300',
  };

  secondNavNextSlot: TngSlotMap<TngTimepickerSlot> = {
    secondNavNext: 'bg-blue-200 hover:bg-blue-300',
  };

  secondListSlot: TngSlotMap<TngTimepickerSlot> = {
    secondList: 'gap-1',
  };
  secondItemSlot: TngSlotMap<TngTimepickerSlot> = {
    secondItem: 'hover:bg-blue-100 font-bold',
  };

  minuteRailSlot: TngSlotMap<TngTimepickerSlot> = {
    minuteRail: 'bg-blue-50 border-l-2 border-blue-300',
  };

  minuteNavPrevSlot: TngSlotMap<TngTimepickerSlot> = {
    minuteNavPrev: 'bg-blue-200 hover:bg-blue-300',
  };

  minuteNavNextSlot: TngSlotMap<TngTimepickerSlot> = {
    minuteNavNext: 'bg-blue-200 hover:bg-blue-300',
  };

  minuteListSlot: TngSlotMap<TngTimepickerSlot> = {
    minuteList: 'gap-1',
  };
  minuteItemSlot: TngSlotMap<TngTimepickerSlot> = {
    minuteItem: 'hover:bg-blue-100 font-bold',
  };

  titleSlot: TngSlotMap<TngTimepickerSlot> = {
    title: 'text-lg font-bold text-purple-600',
  };

  timeDisplay: TngSlotMap<TngTimepickerSlot> = {
    timeDisplay: 'bg-blue-50 px-2',
  };

  actionBarSlot: TngSlotMap<TngTimepickerSlot> = {
    actionBar: 'bg-gray-100 p-2',
  };

  cancelSlot: TngSlotMap<TngTimepickerSlot> = {
    cancel: 'bg-red-100 hover:bg-red-200 text-red-800',
  };

  confirmSlot: TngSlotMap<TngTimepickerSlot> = {
    confirm: 'bg-green-600 hover:bg-green-700',
  };

  periodRailSlot: TngSlotMap<TngTimepickerSlot> = {
    periodRail: 'bg-blue-200 hover:bg-red-200 text-red-800',
  };

  periodSlot: TngSlotMap<TngTimepickerSlot> = {
    period: 'bg-green-600 hover:bg-green-700',
  };

  //html and ts code display

  readonly containerSlotHtml = computed(
    () => `
<form [formGroup]="form">
  <tng-timepicker formControlName="timeValue" [slot]="containerSlot" />
</form>
`,
  );

  readonly containerSlotTs = computed(
    () => `
import { TngSlotMap, TngTimepicker, TngTimepickerSlot } from '@tailng-ui/ui/form';

export class MyComponent {
  containerSlot: TngSlotMap<TngTimepickerSlot> = {
    container: 'border-2 border-blue-400 p-2',
  };
}
`,
  );

  readonly disabledSlotHtml = computed(
    () => `
<form [formGroup]="form">
  <tng-timepicker formControlName="timeValue" [slot]="disabledSlot" />
</form>
`,
  );

  readonly disabledSlotTs = computed(
    () => `
import {TngSlotMap, TngTimepicker, TngTimepickerSlot } from '@tailng-ui/ui/form';

export class MyComponent {
  disabledSlot: TngSlotMap<TngTimepickerSlot> = {
    disabled: 'bg-gray-100',
  };
}
`,
  );

  readonly fieldSlotHtml = computed(
    () => `
<form [formGroup]="form">
  <tng-timepicker formControlName="timeValue" [slot]="fieldSlot" />
</form>
`,
  );

  readonly fieldSlotTs = computed(
    () => `
import { TngTimepicker, TngSlotMap, TngTimepickerSlot } from '@tailng-ui/ui/form';

export class MyComponent {
  fieldSlot: TngSlotMap<TngTimepickerSlot> = {
    field: 'border-2 border-purple-300',
  };
}
`,
  );

  readonly inputSlotHtml = computed(
    () => `
<form [formGroup]="form">
  <tng-timepicker formControlName="timeValue" [slot]="inputSlot" />
</form>
`,
  );

  readonly inputSlotTs = computed(
    () => `
import { TngTimepicker, TngSlotMap, TngTimepickerSlot } from '@tailng-ui/ui/form';

export class MyComponent {
  inputSlot: TngSlotMap<TngTimepickerSlot> = {
    input: 'border-2 border-blue-500 rounded-lg font-semibold',
  };
}
`,
  );

  readonly toggleSlotHtml = computed(
    () => `
<form [formGroup]="form">
  <tng-timepicker formControlName="timeValue" [slot]="toggleSlot" />
</form>
`,
  );

  readonly toggleSlotTs = computed(
    () => `
import { TngTimepicker, TngSlotMap, TngTimepickerSlot } from '@tailng-ui/ui/form';

export class MyComponent {
  toggleSlot: TngSlotMap<TngTimepickerSlot> = {
    toggle: 'bg-blue-100 hover:bg-blue-200 rounded-r-md',
  };
}
`,
  );

  readonly toggleIconSlotHtml = computed(
    () => `
<form [formGroup]="form">
  <tng-timepicker formControlName="timeValue" [slot]="toggleIconSlot" />
</form>
`,
  );

  readonly toggleIconSlotTs = computed(
    () => `
import { TngTimepicker, TngSlotMap, TngTimepickerSlot } from '@tailng-ui/ui/form';

export class MyComponent {
  toggleIconSlot: TngSlotMap<TngTimepickerSlot> = {
    toggleIcon: 'text-blue-600',
  };
}
`,
  );

  readonly overlayPanelSlotHtml = computed(
    () => `
<form [formGroup]="form">
  <tng-timepicker formControlName="timeValue" [slot]="overlayPanelSlot" />
</form>
`,
  );

  readonly overlayPanelSlotTs = computed(
    () => `
import { TngTimepicker, TngSlotMap, TngTimepickerSlot } from '@tailng-ui/ui/form';

export class MyComponent {
  overlayPanelSlot: TngSlotMap<TngTimepickerSlot> = {
    overlayPanel: 'border-2 border-green-500',
  };
}
`,
  );

  readonly panelFrameSlotHtml = computed(
    () => `
<form [formGroup]="form">
  <tng-timepicker formControlName="timeValue" [slot]="panelFrameSlot" />
</form>
`,
  );

  readonly panelFrameSlotTs = computed(
    () => `
import { TngTimepicker, TngSlotMap, TngTimepickerSlot } from '@tailng-ui/ui/form';

export class MyComponent {
  panelFrameSlot: TngSlotMap<TngTimepickerSlot> = {
    panelFrame: 'border-4 border-purple-500 shadow-2xl',
  };
}
`,
  );

  readonly panelLayoutSlotHtml = computed(
    () => `
<form [formGroup]="form">
  <tng-timepicker formControlName="timeValue" [slot]="panelLayoutSlot" />
</form>
`,
  );

  readonly panelLayoutSlotTs = computed(
    () => `
import { TngTimepicker, TngSlotMap, TngTimepickerSlot } from '@tailng-ui/ui/form';

export class MyComponent {
  panelLayoutSlot: TngSlotMap<TngTimepickerSlot> = {
    panelLayout: 'bg-gray-50',
  };
}
`,

  );

  readonly hourRailSlotHtml = computed(
    () => `
<form [formGroup]="form">
  <tng-timepicker formControlName="timeValue" [slot]="hourRailSlot" />
</form>
`,
  );

  readonly hourRailSlotTs = computed(
    () => `
import { TngTimepicker, TngSlotMap, TngTimepickerSlot } from '@tailng-ui/ui/form';

export class MyComponent {
 hourRailSlot: TngSlotMap<TngTimepickerSlot> = {
    hourRail: 'bg-blue-50 border-l-2 border-blue-300',
  };
}
`,
  );

readonly hourNavPreSlotHtml = computed(
    () => `
<form [formGroup]="form">
  <tng-timepicker formControlName="timeValue" [slot]="hourNavPreSlot" />
</form>
`,
  );

  readonly hourNavPreSlotTs = computed(
    () => `
import { TngTimepicker, TngSlotMap, TngTimepickerSlot } from '@tailng-ui/ui/form';

export class MyComponent {
  hourNavPreSlot: TngSlotMap<TngTimepickerSlot> = {
    hourNavPrev: 'bg-blue-200 hover:bg-blue-300',
  };
}
`,
  );

readonly hourNavNextSlotHtml = computed(
    () => `
<form [formGroup]="form">
  <tng-timepicker formControlName="timeValue" [slot]="hourNavNextSlot" />
</form>
`,
  );

  readonly hourNavNextSlotTs = computed(
    () => `
import { TngTimepicker, TngSlotMap, TngTimepickerSlot } from '@tailng-ui/ui/form';

export class MyComponent {
   hourNavNextSlot: TngSlotMap<TngTimepickerSlot> = {
    hourNavNext: 'bg-blue-200 hover:bg-blue-300',
  };
}
`,
  );

readonly hourListSlotHtml = computed(
    () => `
<form [formGroup]="form">
  <tng-timepicker formControlName="timeValue" [slot]="hourListSlot" />
</form>
`,
  );

  readonly hourListSlotTs = computed(
    () => `
import { TngTimepicker, TngSlotMap, TngTimepickerSlot } from '@tailng-ui/ui/form';

export class MyComponent {
   hourListSlot: TngSlotMap<TngTimepickerSlot> = {
    hourList: 'gap-1',
  };
}
`,
  );

readonly hourItemSlotHtml = computed(
    () => `
<form [formGroup]="form">
  <tng-timepicker formControlName="timeValue" [slot]="hourItemSlot" />
</form>
`,
  );

  readonly hourItemSlotTs = computed(
    () => `
import { TngTimepicker, TngSlotMap, TngTimepickerSlot } from '@tailng-ui/ui/form';

export class MyComponent {
   hourItemSlot: TngSlotMap<TngTimepickerSlot> = {
    hourItem: 'hover:bg-blue-100 font-bold',
  };
}
`,
  );

//minutes
readonly minuteRailSlotHtml = computed(
    () => `
<form [formGroup]="form">
  <tng-timepicker formControlName="timeValue" [slot]="minuteRailSlot" />
</form>
`,
  );

  readonly minuteRailSlotTs = computed(
    () => `
import { TngTimepicker, TngSlotMap, TngTimepickerSlot } from '@tailng-ui/ui/form';

export class MyComponent {
minuteRailSlot: TngSlotMap<TngTimepickerSlot> = {
    minuteRail: 'bg-blue-50 border-l-2 border-blue-300',
  };
}
`,
  );

readonly minuteNavPrevSlotHtml = computed(
    () => `
<form [formGroup]="form">
  <tng-timepicker formControlName="timeValue" [slot]="minuteNavPrevSlot" />
</form>
`,
  );

  readonly minuteNavPrevSlotTs = computed(
    () => `
import { TngTimepicker, TngSlotMap, TngTimepickerSlot } from '@tailng-ui/ui/form';

export class MyComponent {
   minuteNavPrevSlot: TngSlotMap<TngTimepickerSlot> = {
    minuteNavPrev: 'bg-blue-200 hover:bg-blue-300',
  };
}
`,
  );

readonly minuteNavNextSlotHtml = computed(
    () => `
<form [formGroup]="form">
  <tng-timepicker formControlName="timeValue" [slot]="minuteNavNextSlot" />
</form>
`,
  );

  readonly minuteNavNextSlotTs = computed(
    () => `
import { TngTimepicker, TngSlotMap, TngTimepickerSlot } from '@tailng-ui/ui/form';

export class MyComponent {
  minuteNavNextSlot: TngSlotMap<TngTimepickerSlot> = {
    minuteNavNext: 'bg-blue-200 hover:bg-blue-300',
  };
}
`,
  );


readonly minuteListSlotHtml = computed(
    () => `
<form [formGroup]="form">
  <tng-timepicker formControlName="timeValue" [slot]="minuteListSlot" />
</form>
`,
  );

  readonly minuteListSlotTs = computed(
    () => `
import { TngTimepicker, TngSlotMap, TngTimepickerSlot } from '@tailng-ui/ui/form';

export class MyComponent {
  minuteListSlot: TngSlotMap<TngTimepickerSlot> = {
    minuteList: 'gap-1',
  };
}
`,
  );

readonly minuteItemSlotHtml = computed(
    () => `
<form [formGroup]="form">
  <tng-timepicker formControlName="timeValue" [slot]="minuteItemSlot" />
</form>
`,
  );

  readonly minuteItemSlotTs = computed(
    () => `
import { TngTimepicker, TngSlotMap, TngTimepickerSlot } from '@tailng-ui/ui/form';

export class MyComponent {
    minuteItemSlot: TngSlotMap<TngTimepickerSlot> = {
    minuteItem: 'hover:bg-blue-100 font-bold',
  };
`,
  );
// seconds
readonly secondRailSlotHtml = computed(
    () => `
<form [formGroup]="form">
  <tng-timepicker formControlName="timeValue" [showSeconds]="true" [slot]="secondRailSlot" />
</form>
`,
  );


  readonly secondRailSlotTs = computed(
    () => `
import { TngTimepicker, TngSlotMap, TngTimepickerSlot } from '@tailng-ui/ui/form';

export class MyComponent {
 secondRailSlot: TngSlotMap<TngTimepickerSlot> = {
    secondRail: 'bg-blue-50 border-l-2 border-blue-300',
  };
}
`,
  );

readonly secondNavPrevSlotHtml = computed(
    () => `
<form [formGroup]="form">
  <tng-timepicker formControlName="timeValue" [showSeconds]="true" [slot]="secondNavPrevSlot" />
</form>
`,
  );

  readonly secondNavPrevSlotTs = computed(
    () => `
import { TngTimepicker, TngSlotMap, TngTimepickerSlot } from '@tailng-ui/ui/form';

export class MyComponent {
  secondNavPrevSlot: TngSlotMap<TngTimepickerSlot> = {
    secondNavPrev: 'bg-blue-200 hover:bg-blue-300',
  };
}
`,
  );

readonly secondNavNextSlotHtml = computed(
    () => `
<form [formGroup]="form">
  <tng-timepicker formControlName="timeValue" [showSeconds]="true" [slot]="secondNavNextSlot" />
</form>
`,
  );

  readonly secondNavNextSlotTs = computed(
    () => `
import { TngTimepicker, TngSlotMap, TngTimepickerSlot } from '@tailng-ui/ui/form';

export class MyComponent {
   secondNavNextSlot: TngSlotMap<TngTimepickerSlot> = {
    secondNavNext: 'bg-blue-200 hover:bg-blue-300',
  };
}
`,
  );

readonly secondListSlotHtml = computed(
    () => `
<form [formGroup]="form">
  <tng-timepicker formControlName="timeValue" [showSeconds]="true" [slot]="secondListSlot" />
</form>
`,
  );

  readonly secondListSlotTs = computed(
    () => `
import { TngTimepicker, TngSlotMap, TngTimepickerSlot } from '@tailng-ui/ui/form';

export class MyComponent {
    secondListSlot: TngSlotMap<TngTimepickerSlot> = {
    secondList: 'gap-1',
  };
}
`,
  );

readonly secondItemSlotHtml = computed(
    () => `
<form [formGroup]="form">
  <tng-timepicker formControlName="timeValue" [showSeconds]="true" [slot]="secondItemSlot" />
</form>
`,
  );

  readonly secondItemSlotTs = computed(
    () => `
import { TngTimepicker, TngSlotMap, TngTimepickerSlot } from '@tailng-ui/ui/form';

export class MyComponent {
  secondItemSlot: TngSlotMap<TngTimepickerSlot> = {
    secondItem: 'hover:bg-blue-100 font-bold',
  };
}
`,
  );



readonly titleSlotHtml = computed(
    () => `
<form [formGroup]="form">
  <tng-timepicker formControlName="timeValue" [slot]="titleSlot" />
</form>
`,
  );

  readonly titleSlotTs = computed(
    () => `
import { TngTimepicker, TngSlotMap, TngTimepickerSlot } from '@tailng-ui/ui/form';

export class MyComponent {
  titleSlot: TngSlotMap<TngTimepickerSlot> = {
    title: 'text-lg font-bold text-purple-600',
  };
}
`,
  );

readonly timeDisplayHtml = computed(
    () => `
<form [formGroup]="form">
  <tng-timepicker formControlName="timeValue" [slot]="timeDisplay" />
</form>
`,
  );

  readonly timeDisplayTs = computed(
    () => `
import { TngTimepicker, TngSlotMap, TngTimepickerSlot } from '@tailng-ui/ui/form';

export class MyComponent {
 timeDisplay: TngSlotMap<TngTimepickerSlot> = {
    timeDisplay: 'bg-blue-50 px-2',
  };
}
`,
  );

readonly periodRailSlotHtml = computed(
    () => `
<form [formGroup]="form">
  <tng-timepicker formControlName="timeValue" [timeFormat]="12" [slot]="periodRailSlot" />
</form>
`,
  );

  readonly periodRailSlotTs = computed(
    () => `
import { TngTimepicker, TngSlotMap, TngTimepickerSlot } from '@tailng-ui/ui/form';

export class MyComponent {
  periodRailSlot: TngSlotMap<TngTimepickerSlot> = {
    periodRail: 'bg-blue-200 hover:bg-red-200 text-red-800',
  };
}
`,
  );

readonly periodSlotHtml = computed(
    () => `
<form [formGroup]="form">
  <tng-timepicker formControlName="timeValue" [timeFormat]="12" [slot]="periodSlot" />
</form>
`,
  );

  readonly periodSlotTs = computed(
    () => `
import { TngTimepicker, TngSlotMap, TngTimepickerSlot } from '@tailng-ui/ui/form';

export class MyComponent {
  periodSlot: TngSlotMap<TngTimepickerSlot> = {
    period: 'bg-green-600 hover:bg-green-700',
  };
}
`,
  );

readonly actionBarSlotHtml = computed(
    () => `
<form [formGroup]="form">
  <tng-timepicker formControlName="timeValue" [slot]="actionBarSlot" />
</form>
`,
  );

  readonly actionBarSlotTs = computed(
    () => `
import { TngTimepicker, TngSlotMap, TngTimepickerSlot } from '@tailng-ui/ui/form';

export class MyComponent {
  actionBarSlot: TngSlotMap<TngTimepickerSlot> = {
    actionBar: 'bg-gray-100 p-2',
  };
}
`,
  );

readonly cancelSlotHtml = computed(
    () => `
<form [formGroup]="form">
  <tng-timepicker formControlName="timeValue" [slot]="cancelSlot" />
</form>
`,
  );

  readonly cancelSlotTs = computed(
    () => `
import { TngTimepicker, TngSlotMap, TngTimepickerSlot } from '@tailng-ui/ui/form';

export class MyComponent {
  cancelSlot: TngSlotMap<TngTimepickerSlot> = {
    cancel: 'bg-red-100 hover:bg-red-200 text-red-800',
  };
}
`,
  );

readonly confirmSlotHtml = computed(
    () => `
<form [formGroup]="form">
  <tng-timepicker formControlName="timeValue" [slot]="confirmSlot" />
</form>
`,
  );

  readonly confirmSlotTs = computed(
    () => `
import { TngTimepicker, TngSlotMap, TngTimepickerSlot } from '@tailng-ui/ui/form';

export class MyComponent {
  confirmSlot: TngSlotMap<TngTimepickerSlot> = {
    confirm: 'bg-green-600 hover:bg-green-700',
  };
}
`,
  );
}
