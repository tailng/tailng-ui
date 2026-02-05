import { Component, computed, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { TngNumberInput } from '@tailng-ui/ui/form';
import { TngTag } from '@tailng-ui/ui/primitives';
import { ExampleBlockComponent, TngExampleDemo } from '../../../../../shared/example-block/example-block.component';

@Component({
  standalone: true,
  selector: 'docs-number-input-styling',
  templateUrl: './number-input-styling.component.html',
  imports: [
    TngNumberInput,
    ReactiveFormsModule,
    TngTag,
    ExampleBlockComponent,
    TngExampleDemo,
  ],
})
export class NumberInputStylingComponent {
  form = new FormGroup({
    quantity: new FormControl<number | null>(42, { nonNullable: false }),
    amount: new FormControl<number | null>(null, { nonNullable: false }),
  });

  readonly klassExampleHtml = computed(
    () => `
<form [formGroup]="form">
  <tng-number-input
    formControlName="quantity"
    placeholder="Quantity"
    klass="border-2 border-blue-500 rounded-lg shadow-md w-48"
  />
</form>
`,
  );

  readonly klassExampleTs = computed(
    () => `
import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { TngNumberInput } from '@tailng-ui/ui/form';

@Component({
  selector: 'number-input-demo',
  standalone: true,
  imports: [ReactiveFormsModule, TngNumberInput],
  templateUrl: './number-input.component.html',
})
export class NumberInputDemoComponent {
  form = new FormGroup({
    quantity: new FormControl<number | null>(42, { nonNullable: false }),
  });
}
`,
  );

  readonly klassExampleCss = computed(
    () => `
// Default classes (merged with your klass)
// h-10 w-full rounded-md px-3 text-sm
// border border-border bg-bg text-foreground placeholder:text-muted
// focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2
// disabled:opacity-50 disabled:pointer-events-none read-only:bg-muted/30
`,
  );

  readonly inputKlassExampleHtml = computed(
    () => `
<form [formGroup]="form">
  <tng-number-input
    formControlName="quantity"
    placeholder="Custom text styling"
    klass="text-lg font-semibold text-blue-600 w-48"
  />
</form>
`,
  );

  readonly inputKlassExampleCss = computed(
    () => `
// Use klass for text size, color, font weight, etc.
klass="text-lg font-semibold text-blue-600"
`,
  );

  readonly combinedExampleHtml = computed(
    () => `
<form [formGroup]="form">
  <tng-number-input
    formControlName="amount"
    placeholder="Fully customized"
    [min]="0"
    [max]="1000"
    [step]="0.01"
    klass="border-2 border-purple-500 rounded-xl text-purple-700 placeholder:text-purple-300 w-56"
  />
</form>
`,
  );

  readonly combinedExampleTs = computed(
    () => `
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { TngNumberInput } from '@tailng-ui/ui/form';

@Component({
  selector: 'number-input-demo',
  standalone: true,
  imports: [ReactiveFormsModule, TngNumberInput],
  template: \`<form [formGroup]="form">
    <tng-number-input formControlName="amount" placeholder="Amount"
      [min]="0" [max]="1000" [step]="0.01"
      klass="border-2 border-purple-500 rounded-xl text-purple-700" />
  </form>\`,
})
export class NumberInputDemoComponent {
  form = new FormGroup({
    amount: new FormControl<number | null>(null, { nonNullable: false }),
  });
}
`,
  );

  readonly isCodePanelOpen = signal(false);
  toggleCodePanel(): void {
    this.isCodePanelOpen.set(!this.isCodePanelOpen());
  }
}
