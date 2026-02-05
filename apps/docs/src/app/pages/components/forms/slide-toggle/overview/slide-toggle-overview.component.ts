import { Component, computed } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { TngSlideToggle } from '@tailng-ui/ui/form';
import { TngTag } from '@tailng-ui/ui/primitives';
import { ExampleBlockComponent, TngExampleDemo } from '../../../../../shared/example-block/example-block.component';

@Component({
  standalone: true,
  selector: 'docs-slide-toggle-overview',
  templateUrl: './slide-toggle-overview.component.html',
  imports: [
    ReactiveFormsModule,
    TngSlideToggle,
    TngTag,
    ExampleBlockComponent,
    TngExampleDemo,
  ],
})
export class SlideToggleOverviewComponent {
  form = new FormGroup({
    enabled: new FormControl(false, { nonNullable: true }),
  });

  readonly basicHtml = computed(
    () => `
<form [formGroup]="form">
  <tng-slide-toggle formControlName="enabled" label="Enable feature" />
</form>
`,
  );

  readonly basicTs = computed(
    () => `
form = new FormGroup({
  enabled: new FormControl(false, { nonNullable: true }),
});
`,
  );
}
