import { Component, computed } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { TngButtonToggle } from '@tailng-ui/ui/form';
import { TngTag } from '@tailng-ui/ui/primitives';
import { ExampleBlockComponent, TngExampleDemo } from '../../../../../shared/example-block/example-block.component';

@Component({
  standalone: true,
  selector: 'docs-button-toggle-styling',
  templateUrl: './button-toggle-styling.component.html',
  imports: [
    ReactiveFormsModule,
    TngButtonToggle,
    TngTag,
    ExampleBlockComponent,
    TngExampleDemo,
  ],
})
export class ButtonToggleStylingComponent {
  options = [
    { value: 'list', label: 'List' },
    { value: 'grid', label: 'Grid' },
    { value: 'map', label: 'Map' },
  ];

  form = new FormGroup({
    view: new FormControl<string | null>('list'),
  });

  readonly containerSlotHtml = computed(
    () => `
<form [formGroup]="form">
  <tng-button-toggle formControlName="view" [options]="options"
    [slot]="{ container: 'inline-flex rounded-lg border-2 border-primary/30 overflow-hidden' }" />
</form>
`,
  );

  readonly buttonSlotHtml = computed(
    () => `
<form [formGroup]="form">
  <tng-button-toggle formControlName="view" [options]="options"
    [slot]="{ button: 'px-4 py-2 text-sm font-medium transition' }" />
</form>
`,
  );

  readonly buttonActiveSlotHtml = computed(
    () => `
<form [formGroup]="form">
  <tng-button-toggle formControlName="view" [options]="options"
    [slot]="{ buttonActive: 'bg-primary text-on-primary' }" />
</form>
`,
  );

  readonly buttonInactiveSlotHtml = computed(
    () => `
<form [formGroup]="form">
  <tng-button-toggle formControlName="view" [options]="options"
    [slot]="{ buttonInactive: 'hover:bg-primary/20' }" />
</form>
`,
  );

  readonly buttonDisabledSlotHtml = computed(
    () => `
<form [formGroup]="form">
  <tng-button-toggle formControlName="view" [options]="options"
    [slot]="{ buttonDisabled: 'bg-slate-100 text-slate-400' }"
    [disabled]="true" />
</form>
`,
  );

  readonly combinedSlotHtml = computed(
    () => `
<form [formGroup]="form">
  <tng-button-toggle formControlName="view" [options]="options"
    [slot]="{
      container: 'inline-flex rounded-xl border border-primary/30 overflow-hidden',
      button: 'px-4 py-2 text-sm font-medium transition',
      buttonActive: 'bg-primary text-on-primary',
      buttonInactive: 'bg-bg text-fg hover:bg-on-primary/10'
    }" />
</form>
`,
  );
}
