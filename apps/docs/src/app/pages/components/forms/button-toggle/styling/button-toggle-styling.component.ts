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

  readonly groupKlassHtml = computed(
    () => `
<form [formGroup]="form">
  <tng-button-toggle formControlName="view" [options]="options"
    groupKlass="inline-flex rounded-lg border border-border overflow-hidden" />
</form>
`,
  );

  readonly activeInactiveHtml = computed(
    () => `
<form [formGroup]="form">
  <tng-button-toggle formControlName="view" [options]="options"
    buttonKlass="px-4 py-2 text-sm font-medium transition"
    activeButtonKlass="bg-primary text-on-primary"
    inactiveButtonKlass="bg-bg text-fg hover:bg-on-primary/10" />
</form>
`,
  );
}
