import { Component, computed, signal } from '@angular/core';
import { TngIcon } from '@tailng-ui/icons/icon';
import { TngTextInput } from '@tailng-ui/ui/form';
import { TngTag } from '@tailng-ui/ui/primitives';
import { ExampleBlockComponent, TngExampleDemo } from '../../../../../shared/example-block/example-block.component';

@Component({
  standalone: true,
  selector: 'docs-text-input-styling',
  templateUrl: './text-input-styling.component.html',
  imports: [
    TngTextInput,
    TngIcon,
    TngTag,
    ExampleBlockComponent,
    TngExampleDemo,

],
})
export class TextInputStylingComponent {
   readonly frameKlassExampleHtml = computed(
    () => `
<form [formGroup]="form">
  <tng-text-input
    formControlName="text"
    placeholder="Custom root styling"
    frameKlass="border-2 border-blue-900 rounded-md shadow-md focus-within:ring-blue-900 max-w-2xl"
  />
</form>
`,
  );
  readonly frameKlassExampleTs = computed(
    () => `
import { Component } from '@angular/core';
import {FormControl,FormGroup,ReactiveFormsModule} from '@angular/forms';
import { TngTextInput } from '@tailng-ui/ui/form';
@Component({
  selector: 'text-input-demo',
  standalone: true,
  imports: [ReactiveFormsModule, TngTextInput],
  templateUrl: './text-input.component.html',
})
export class TextInputDemoComponent {
  form = new FormGroup({
    text: new FormControl('', { nonNullable: true })
});
`,
  );

  readonly frameKlassExampleCss = computed(
    () => `
// Default CSS for frameKlass
frameClass = flex h-10 w-full items-center rounded-md border border-border bg-bg text-foreground
  focus-within:border-transparent focus-within:ring-2 focus-within:ring-primary focus-within:ring-offset-1 
  focus-within:ring-offset-background

`,
  );

  readonly inputKlassExampleHtml = computed(
    () => `
<form [formGroup]="form">
  <tng-text-input
    formControlName="text"
    placeholder="Custom input styling"
    inputKlass="text-lg font-semibold text-blue-600"
  />
</form>
`,
  );

  readonly inputKlassExampleCss = computed(
    () => `
// Default CSS for inputKlass
inputKlass = h-full min-w-0 flex-1 bg-transparent px-3 text-sm outline-none placeholder:text-muted
`,
  );

  readonly prefixKlassExampleHtml = computed(
    () => `
<form [formGroup]="form">
  <tng-text-input placeholder="Search..." formControlName="search">
    <tng-icon
      tngPrefix
      name="bootstrapSearch"
      class="ml-3 text-muted"
    />
  </tng-text-input>
</form>
`,
  );
  readonly prefixKlassSearchExampleHtml = computed(
    () => `
<form [formGroup]="form">
  <tng-text-input
    placeholder="Search..."
    prefixKlass="bg-blue-50 rounded-l-md"
    formControlName="search"
    >
    <tng-icon
      tngPrefix
      name="bootstrapSearch"
      class="ml-3 text-blue-600"
    />
  </tng-text-input>
</form>
`,
  );

  readonly preffixKlassExampleTs = computed(
    () => `
import { Component } from '@angular/core';
import {FormControl,FormGroup,ReactiveFormsModule} from '@angular/forms';
import { TngIcon } from '@tailng-ui/icons/icon';
import { TngTextInput } from '@tailng-ui/ui/form';
@Component({
  selector: 'text-input-demo',
  standalone: true,
  imports: [ReactiveFormsModule, TngTextInput,TngIcon],
  templateUrl: './text-input.component.html',
})
export class TextInputDemoComponent {
  form = new FormGroup({
    search: new FormControl('', { nonNullable: true })
});

`,
  );
  readonly preffixKlassExampleCss = computed(
    () => `
tngPrefix = ml-3`,
  );
  readonly preffixKlassCustomCss = computed(
    () => `
tngPrefix = ml-3
prefixKlass="bg-blue-50 rounded-l-md

`,
  );

  readonly suffixKlassExampleHtml = computed(
    () => `
<form [formGroup]="login">
  <tng-text-input placeholder="Enter email" formControlName="email">
    <tng-icon
      tngSuffix
      name="bootstrapCheck"
      class="mr-3 text-green-600"
    />
  </tng-text-input>
</form>
`,
  );

  readonly suffixKlassExampleCustomHtml = computed(
    () => `
<form [formGroup]="login">
  <tng-text-input
    formControlName="email"
    placeholder="Enter email"
    suffixKlass="bg-green-50 rounded-r-md"
    >
    <tng-icon
      tngSuffix
      name="bootstrapCheck"
      class="mr-3 text-green-600"
    />
  </tng-text-input>
</form>
`,
  );

  readonly suffixKlassExampleCss = computed(
    () => `
tngSuffix = mr-3`,
  );
  readonly suffixKlassCustomCss = computed(
    () => `
tngSuffix = mr-3
suffixKlass="bg-green-50 rounded-r-md
`,
  );
readonly suffixKlassCustomTs = computed(
    () => `
import { Component } from '@angular/core';
import {FormControl,FormGroup,ReactiveFormsModule} from '@angular/forms';
import { TngIcon } from '@tailng-ui/icons/icon';
import { TngTextInput } from '@tailng-ui/ui/form';
@Component({
  selector: 'text-input-demo',
  standalone: true,
  imports: [ReactiveFormsModule, TngTextInput,TngIcon],
  templateUrl: './text-input.component.html',
})
export class TextInputDemoComponent {
  login = new FormGroup({
    email: new FormControl('', { nonNullable: true })
});

`,
  );

  readonly combinedExampleHtml = computed(
    () => `
<form [formGroup]="form">
  <tng-text-input
    formControlName="search"
    placeholder="Fully customized"
    frameKlass="border-2 border-purple-500 rounded-xl"
    inputKlass="text-purple-700 placeholder:text-purple-300"
    prefixKlass="bg-purple-50"
    suffixKlass="bg-purple-50"
    >
    <tng-icon
      tngPrefix
      name="bootstrapSearch"
      class="ml-3 text-purple-600"
    />
    <tng-icon
      tngSuffix
      name="bootstrapCheck"
      class="mr-3 text-purple-600"
    />
  </tng-text-input>
</form>
`,
  );
  readonly combinedExampleTs = computed(
    () => `
import { Component } from '@angular/core';
import {FormControl,FormGroup,ReactiveFormsModule} from '@angular/forms';
import { TngIcon } from '@tailng-ui/icons/icon';
import { TngTextInput } from '@tailng-ui/ui/form';
@Component({
  selector: 'text-input-demo',
  standalone: true,
  imports: [ReactiveFormsModule, TngTextInput,TngIcon],
  templateUrl: './text-input.component.html',
})
export class TextInputDemoComponent {
  form = new FormGroup({
    search: new FormControl('', { nonNullable: true })
});
`,
  );
readonly combinedExampleCss = computed(()=>
  `frameKlass= border-2 border-purple-500 rounded-xl
    inputKlass= text-purple-700
    prefixKlass= bg-purple-50
    suffixKlass= bg-purple-50`
);
  readonly isCodePanelOpen = signal(false);
  toggleCodePanel(): void {
    this.isCodePanelOpen.set(!this.isCodePanelOpen());
  }

}
