import { Component, computed } from '@angular/core';
import { TngIcon } from '@tociva/tailng-icons/icon';
import { TngTag } from '@tociva/tailng-ui/buttons-indicators';
import { TngTextInput } from '@tociva/tailng-ui/form-controls';
import { ExampleBlockComponent, TngExampleDemo } from '../../../../../shared/example-block/example-block.component';

@Component({
  standalone: true,
  selector: 'docs-text-input-overview',
  templateUrl: './text-input-overview.component.html',
  imports: [
    TngIcon,
    TngTextInput,
    TngTag,
    ExampleBlockComponent,
    TngExampleDemo

],
})
export class TextInputOverviewComponent {
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
}

