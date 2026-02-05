import { Component, computed } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TngIcon } from '@tailng-ui/icons/icon';
import { TngTextInput } from '@tailng-ui/ui/form';
import { TngTag } from '@tailng-ui/ui/primitives';

import {
  ExampleBlockComponent,
  TngExampleDemo,
} from '../../../../../shared/example-block/example-block.component';

@Component({
  standalone: true,
  selector: 'docs-text-input-examples',
  templateUrl: './text-input-examples.component.html',
  imports: [
    TngTextInput,
    TngIcon,
    ReactiveFormsModule,
    ExampleBlockComponent,
    TngExampleDemo,
    TngTag,
  ],
})
export class TextInputExamplesComponent {
  // Form for reactive forms example
  form = new FormGroup({
    email: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.email],
    }),
    password: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(8)],
    }),
    search: new FormControl('', { nonNullable: true }),
    username: new FormControl('', {
      nonNullable: true,
      validators: [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(20),
        Validators.pattern(/^[a-zA-Z0-9_]+$/),
      ],
    }),
    readonlyValue: new FormControl('This value cannot be edited', { nonNullable: true }),
    prefilledValue: new FormControl('Pre-filled value', { nonNullable: true }),
  });
  // myValue=''; 
  get emailCtrl() {
    return this.form.controls.email;
  }

  get passwordCtrl() {
    return this.form.controls.password;
  }

  get searchCtrl() {
    return this.form.controls.search;
  }

  // Convert form control valueChanges to a signal
  private readonly searchValue = toSignal(this.searchCtrl.valueChanges, {
    initialValue: this.searchCtrl.value,
  });

  // Check if search has value to show/hide clear icon
  readonly hasSearchValue = computed(() => (this.searchValue()?.length ?? 0) > 0);

  // Clear search input
  clearSearch(): void {
    this.searchCtrl.setValue('');
  }

  // Code examples
  readonly basicExampleHtml = computed(
    () => `
  <form [formGroup]="login">
    <tng-text-input
      formControlName=userName
      placeholder="Enter Username"
    />
  </form>
`,
  );

  readonly basicExampleTs = computed(
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
  login = new FormGroup({
    userName: new FormControl('', { nonNullable: true })
});
`,
  );
  readonly basicExampleCss = computed(
    () => `
// Default inputKlass CSS
inputKlass  = h-full min-w-0 flex-1 bg-transparent 
              px-3 text-sm outline-none 
              placeholder:text-muted
`,
  );

  readonly reactiveFormsExampleHtml = computed(
    () => `
<form [formGroup]="login">
  <tng-text-input
    formControlName="email"
    placeholder="Enter email"
    type="email"
  />
  <tng-text-input
    formControlName="password"
    placeholder="Enter password"
    type="password"
  />
  <tng-text-input
    formControlName="search"
    placeholder="Search..."
    type="search"
  >
    <tng-icon
      tngPrefix
      name="bootstrapSearch"
      class="ml-3 text-muted"
    />
  </tng-text-input>
</form>
`,
  );

  readonly reactiveFormsExampleTs = computed(
    () => `
import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
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
    email: new FormControl('', { nonNullable: true }),
    password: new FormControl('', { nonNullable: true })
    search: new FormControl('', { nonNullable: true }),
  });
}
`,
  );
  readonly reactiveFormsExampleCss = computed(
    () => `
// Default CSS
inputKlass = h-full min-w-0 flex-1 bg-transparent 
              px-3 text-sm outline-none 
              placeholder:text-muted
tngPrefix = ml-3
`,
  );

  readonly prefixSuffixExampleHtml = computed(
    () => `
<form [formGroup]="login">    
<tng-text-input placeholder="Search..." 
  formControlName="search"
  >
  <tng-icon
    tngPrefix
    name="bootstrapSearch"
    class="ml-3 text-muted"
  />
</tng-text-input>
  <tng-text-input placeholder="Enter email"
    formControlName="email">
    <tng-icon
      tngSuffix
      name="bootstrapCheck"
      class="mr-3 text-green-600"
    />
  </tng-text-input>
  <tng-text-input placeholder="Search users..."
    formControlName="searchUser">
    <tng-icon
      tngPrefix
      name="bootstrapSearch"
      class="ml-3 text-muted"
    />
    <tng-icon
      tngSuffix
      name="bootstrapX"
      class="mr-3 text-red-500 cursor-pointer"
    />
  </tng-text-input>
</form>
`,
  );

  readonly prefixSuffixExampleTs = computed(
    () => `
import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { TngIcon } from '@tailng-ui/icons/icon';
import { TngTextInput } from '@tailng-ui/ui/form';

@Component({
 selector: 'text-input-demo',
  standalone: true,
  imports: [ReactiveFormsModule, TngIcon,TngTextInput],
  templateUrl: './text-input.component.html',
})
export class TextInputDemoComponent {
  login = new FormGroup({
    search: new FormControl('', { nonNullable: true }),
    email: new FormControl('', { nonNullable: true }),
    searchUser: new FormControl('', { nonNullable: true }),
  });
}
`,
  );
  readonly prefixSuffixExampleCss = computed(
    () => `
// Default CSS
inputKlass = h-full min-w-0 flex-1 bg-transparent 
              px-3 text-sm outline-none 
              placeholder:text-muted
tngPrefix = ml-3
tngSuffix = mr-3
`,
  );

  readonly inputTypesExampleHtml = computed(
    () => `
<form [formGroup]="form">  
  <tng-text-input
    formControlName="name"
    placeholder="Enter name"
    type="text"
  />
  <!-- Email input -->
  <tng-text-input
  formControlName="email"
    placeholder="Enter email"
    type="email"
  />
  <!-- Password input -->
  <tng-text-input
  formControlName="password"
    placeholder="Enter password"
    type="password"
  />
  <!-- Search input -->
  <tng-text-input
  formControlName="search"
    placeholder="Search..."
    type="search"
  />
  <!-- URL input -->
  <tng-text-input
  formControlName="url"
    placeholder="Enter URL"
    type="url"
  />
  <!-- Tel input -->
  <tng-text-input
  formControlName="tel"
    placeholder="Enter phone number"
    type="tel"
  />
</form>
`,
  );
  readonly inputTypesExampleTs = computed(
    () => `
import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { TngTextInput } from '@tailng-ui/ui/form';

@Component({
 selector: 'text-input-demo',
  standalone: true,
  imports: [ReactiveFormsModule, TngTextInput],
  templateUrl: './text-input.component.html',
})
export class TextInputDemoComponent {
  form = new FormGroup({
    name: new FormControl('', { nonNullable: true }),
    email: new FormControl('', { nonNullable: true }),
    password: new FormControl('', { nonNullable: true }),
    search: new FormControl('', { nonNullable: true }),
    url: new FormControl('', { nonNullable: true }),
    tel: new FormControl('', { nonNullable: true }),
  });
}
`,
  );
  readonly statesExampleHtml = computed(
    () => `
<form [formGroup]="form">  
  <tng-text-input
    placeholder="Disabled input"
    [disabled]="true"
  />
  <!-- Readonly state with form control -->
  <tng-text-input
    formControlName="readonlyValue"
    placeholder="Readonly input"
    [readonly]="true"
  />

  <!-- Pre-filled value with form control -->
  <tng-text-input
    formControlName="prefilledValue"
    placeholder="Enter text"
  />

  <!-- Or using ngModel for template-driven forms -->
  <tng-text-input
    [(ngModel)]="myValue"
    placeholder="Enter text"
  />
</form>
`,
  );
   readonly statesExampleTs = computed(
    () => `
import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { TngTextInput } from '@tailng-ui/ui/form';

@Component({
 selector: 'text-input-demo',
  standalone: true,
  imports: [ReactiveFormsModule, TngTextInput],
  templateUrl: './text-input.component.html',
})
export class TextInputDemoComponent {
  form = new FormGroup({
    readonlyValue: new FormControl('This value cannot be edited', { nonNullable: true }),
    prefilledValue: new FormControl('Pre-filled value', { nonNullable: true }),
  });
}
`,
  );
  readonly validationExampleHtml = computed(
    () => `
<form [formGroup]="form">  
  <tng-text-input
    formControlName="username"
    placeholder="Username"
    [minlength]="3"
    [maxlength]="20"
    pattern="^[a-zA-Z0-9_]+$"
  />
  @if (form.controls.username.touched && form.controls.username.invalid) {
    @if (form.controls.username.hasError('required')) {
      Username is required
    } @else if (form.controls.username.hasError('minlength')) {
      Username must be at least 3 characters
  @else if (form.controls.username.hasError('maxlength')) {
    Username must be no more than 20 characters
    } @else if (form.controls.username.hasError('pattern')) {
    Username can only contain letters, numbers, and underscores
  }
</form>
`,
  );
  readonly validationExampleTs = computed(
    () => `
import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule,Validators } from '@angular/forms';
import { TngTextInput } from '@tailng-ui/ui/form';

@Component({
 selector: 'text-input-demo',
  standalone: true,
  imports: [ReactiveFormsModule, TngTextInput],
  templateUrl: './text-input.component.html',
})
export class TextInputDemoComponent {   
form = new FormGroup({
  username: new FormControl('', {
    validators: [
      Validators.required,
      Validators.minLength(3),
      Validators.maxLength(20),
      Validators.pattern(/^[a-zA-Z0-9_]+$/),
    ],
  }),
});
`,
  );

  readonly customStylingExampleHtml = computed(
    () => `
<form [formGroup]="form">  
  <tng-text-input
    formControlName=search
    placeholder="Custom styled input"
    frameKlass="border-2 border-purple-500 rounded-xl shadow-lg"
    inputKlass="text-purple-700 placeholder:text-purple-300"
    >
    <tng-icon
      tngPrefix
      name="bootstrapSearch"
      class="ml-3 text-purple-600"
    />
  </tng-text-input>
</form>
`,
  );

  readonly customStylingExampleTs = computed(
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
`);
readonly customStylingExampleCss = computed(()=>
// Default CSS
`rootClass = flex h-10 w-full items-center rounded-md 
            border border-border bg-bg text-foreground
            focus-within:border-transparent 
            focus-within:ring-2 focus-within:ring-primary 
            focus-within:ring-offset-1 
            focus-within:ring-offset-background
inputKlass = h-full min-w-0 flex-1 bg-transparent 
              px-3 text-sm outline-none 
              placeholder:text-muted
tngPrefix = ml-3
`);
}
