import { Component, computed } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { TngTextarea } from '@tailng-ui/ui/form';
import { TngTag } from '@tailng-ui/ui/primitives';
import { ExampleBlockComponent, TngExampleDemo } from '../../../../../shared/example-block/example-block.component';

@Component({
  standalone: true,
  selector: 'docs-textarea-overview',
  templateUrl: './textarea-overview.component.html',
  imports: [
    ReactiveFormsModule,
    TngTextarea,
    TngTag,
    ExampleBlockComponent,
    TngExampleDemo,
  ],
})
export class TextareaOverviewComponent {
  form = new FormGroup({
    message: new FormControl('', { nonNullable: true }),
  });

  readonly basicHtml = computed(
    () => `
<form [formGroup]="form">
  <tng-textarea formControlName="message" placeholder="Your message" [rows]="4" />
</form>
`,
  );

  readonly basicTs = computed(
    () => `
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { TngTextarea } from '@tailng-ui/ui/form';

@Component({
  selector: 'textarea-demo',
  standalone: true,
  imports: [ReactiveFormsModule, TngTextarea],
  template: \`<form [formGroup]="form">
    <tng-textarea formControlName="message" placeholder="Your message" [rows]="4" />
  </form>\`,
})
export class TextareaDemoComponent {
  form = new FormGroup({
    message: new FormControl('', { nonNullable: true }),
  });
}
`,
  );
}
