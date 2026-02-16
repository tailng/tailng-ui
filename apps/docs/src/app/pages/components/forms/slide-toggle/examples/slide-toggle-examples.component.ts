import { Component, computed } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { TngSlideToggle } from '@tailng-ui/ui/form';
import { TngTag } from '@tailng-ui/ui/primitives';
import { ExampleBlockComponent, TngExampleDemo } from '../../../../../shared/example-block/example-block.component';

@Component({
  standalone: true,
  selector: 'docs-slide-toggle-examples',
  templateUrl: './slide-toggle-examples.component.html',
  imports: [
    ReactiveFormsModule,
    TngSlideToggle,
    TngTag,
    ExampleBlockComponent,
    TngExampleDemo,
  ],
})
export class SlideToggleExamplesComponent {
  form = new FormGroup({
    notifications: new FormControl(true, { nonNullable: true }),
    darkMode: new FormControl(false, { nonNullable: true }),
  });

  readonly basicHtml = computed(
    () => `
<form [formGroup]="form" class="flex flex-col gap-3">
  <tng-slide-toggle formControlName="notifications" label="Enable notifications" />
  <tng-slide-toggle formControlName="darkMode" label="Dark mode" />
</form>
`,
  );

  readonly basicTs = computed(
    () => `
form = new FormGroup({
  notifications: new FormControl(true, { nonNullable: true }),
  darkMode: new FormControl(false, { nonNullable: true }),
});
`,
  );

  readonly disabledHtml = computed(
    () => `
<tng-slide-toggle formControlName="notifications" label="Enabled" />
<tng-slide-toggle formControlName="darkMode" label="Disabled" [disabled]="true" />
`,
  );

  readonly noLabelHtml = computed(
    () => `
<form [formGroup]="form">
  <tng-slide-toggle formControlName="notifications" />
</form>
`,
  );

  readonly onOffSlotHtml = computed(
    () => `
<tng-slide-toggle formControlName="notifications" label="Themed by state"
  [slot]="{
    trackChecked: 'bg-primary border-primary',
    trackUnchecked: 'bg-bg border-primary',
    thumbChecked: 'bg-on-primary',
    thumbUnchecked: 'bg-primary'
  }" />
`,
  );
}
