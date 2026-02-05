import { Component, computed } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { TngButtonToggle } from '@tailng-ui/ui/form';
import { TngTag } from '@tailng-ui/ui/primitives';
import { ExampleBlockComponent, TngExampleDemo } from '../../../../../shared/example-block/example-block.component';

@Component({
  standalone: true,
  selector: 'docs-button-toggle-overview',
  templateUrl: './button-toggle-overview.component.html',
  imports: [
    ReactiveFormsModule,
    TngButtonToggle,
    TngTag,
    ExampleBlockComponent,
    TngExampleDemo,
  ],
})
export class ButtonToggleOverviewComponent {
  /** Exposed for template to avoid unescaped '{' in HTML */
  optionShape = '{ value, label, disabled? }';

  viewOptions = [
    { value: 'list', label: 'List' },
    { value: 'grid', label: 'Grid' },
    { value: 'map', label: 'Map' },
  ];

  form = new FormGroup({
    view: new FormControl<string | null>('list'),
  });

  readonly basicHtml = computed(
    () => `
<form [formGroup]="form">
  <tng-button-toggle formControlName="view" [options]="viewOptions" />
</form>
`,
  );

  readonly basicTs = computed(
    () => `
viewOptions = [
  { value: 'list', label: 'List' },
  { value: 'grid', label: 'Grid' },
  { value: 'map', label: 'Map' },
];
form = new FormGroup({
  view: new FormControl<string | null>('list'),
});
`,
  );
}
