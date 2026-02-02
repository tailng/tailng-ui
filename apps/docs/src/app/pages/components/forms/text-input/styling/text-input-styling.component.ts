import { Component, computed, signal } from '@angular/core';
import { TngIcon } from '@tociva/tailng-icons/icon';
import {
  TngTextInput
} from '@tociva/tailng-ui/form-controls';
import { TngTag } from '@tociva/tailng-ui/buttons-indicators';
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
  readonly rootKlassExample = computed(() => `<tng-text-input
  placeholder="Custom root styling"
  rootKlass="border-2 border-blue-500 rounded-lg shadow-md"
/>
`);
 

  readonly inputKlassExample = computed(() => `<tng-text-input
  placeholder="Custom input styling"
  inputKlass="text-lg font-semibold text-blue-600"
/>
`);

  readonly prefixKlassExample = computed(() => `<tng-text-input placeholder="Search...">
  <tng-icon
    tngPrefix
    name="bootstrapSearch"
    class="ml-3 text-muted"
  />
</tng-text-input>

<!-- With custom prefix styling -->
<tng-text-input
  placeholder="Search..."
  prefixKlass="bg-blue-50 rounded-l-md"
>
  <tng-icon
    tngPrefix
    name="bootstrapSearch"
    class="ml-3 text-blue-600"
  />
</tng-text-input>
`);

  readonly suffixKlassExample = computed(() => `<tng-text-input placeholder="Enter email">
  <tng-icon
    tngSuffix
    name="bootstrapCheck"
    class="mr-3 text-green-600"
  />
</tng-text-input>

<!-- With custom suffix styling -->
<tng-text-input
  placeholder="Enter email"
  suffixKlass="bg-green-50 rounded-r-md"
>
  <tng-icon
    tngSuffix
    name="bootstrapCheck"
    class="mr-3 text-green-600"
  />
</tng-text-input>
`);

  readonly combinedExample = computed(() => `<tng-text-input
  placeholder="Fully customized"
  rootKlass="border-2 border-purple-500 rounded-xl"
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
`);

  readonly isCodePanelOpen = signal(false);
  toggleCodePanel(): void {
    this.isCodePanelOpen.set(!this.isCodePanelOpen());
  }

}
