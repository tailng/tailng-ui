import { Component, computed, signal } from '@angular/core';
import {
  TailngStepComponent,
  TailngStepPanelComponent,
  TailngStepperComponent,
  TailngCodeBlockComponent,
} from '@tailng/ui';

@Component({
  standalone: true,
  selector: 'docs-autocomplete',
  templateUrl:'./autocomplete-docs.component.html',
  imports: [
    TailngStepperComponent,
    TailngStepComponent,
    TailngStepPanelComponent,
    TailngCodeBlockComponent,
  ]
})
export class AutocompleteDocsComponent {
  isCodeExpanded = signal(false);

  toggleCode() {
    this.isCodeExpanded.update((v) => !v);
  }

  copyCode() {
    navigator.clipboard.writeText(this.klassSignalSnippet());
  }

  readonly klassSignalSnippet = computed(
    () => `import { Component, computed, input } from '@angular/core';

@Component({
  selector: 'tng-button',
  standalone: true,
  template: '<button type="button" [class]="klass()"><ng-content /></button>',
})
export class ButtonComponent {
  variant = input<'primary' | 'outline'>('primary');

  klass = computed(() => {
    const base = 'rounded-md px-3 py-2 text-sm font-semibold';
    const primary = 'bg-[color:var(--primary)] text-white';
    const outline = 'border border-slate-200 text-slate-800';

    return [base, this.variant() === 'primary' ? primary : outline].join(' ');
  });
}`,
  );

  readonly smallSnippet = computed(
    () => ` 
import { TailngAutocompleteComponent } from '@tailng/ui';
`,
  );
}
