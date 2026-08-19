import type { RegistryItem } from '../registry.types';

const autocompletePrimitiveTsTemplate = `import { Directive, HostBinding } from '@angular/core';

@Directive({
  selector: '[tngAutocomplete]',
  exportAs: 'tngAutocomplete',
})
export class TngAutocompletePrimitive {
  @HostBinding('attr.data-slot')
  protected readonly dataSlot = 'autocomplete' as const;
}
`;

const autocompleteComponentTsTemplate = `import { Component, input } from '@angular/core';
import { TngAutocompletePrimitive } from './tng-autocomplete-primitive';

@Component({
  selector: 'tng-autocomplete',
  imports: [TngAutocompletePrimitive],
  templateUrl: './tng-autocomplete.html',
  styleUrl: './tng-autocomplete.css',
})
export class TngAutocomplete {
  public readonly ariaLabel = input<string>('Autocomplete');
}
`;

const autocompleteTemplateHtml = `<section tngAutocomplete class="tng-autocomplete" [attr.aria-label]="ariaLabel()">
  <ng-content />
</section>
`;

const autocompleteTemplateCss = `:host {
  display: block;
}

.tng-autocomplete {
  border: 1px solid #cbd5e1;
  border-radius: 0.75rem;
  display: grid;
  gap: 0.5rem;
  padding: 0.9rem 1rem;
}
`;

const autocompleteIndexTsTemplate = `export * from './tng-autocomplete';
export * from './tng-autocomplete-primitive';
`;

export const autocompleteRegistryItem = {
  dependencies: [],
  description: 'Shadcn-style source files for autocomplete primitive and styled wrapper.',
  install: {
    importPath: './tailng-ui/autocomplete',
    importSymbols: ['TngAutocomplete', 'TngAutocompletePrimitive'],
  },
  files: [
    {
      content: autocompletePrimitiveTsTemplate,
      path: 'src/app/tailng-ui/autocomplete/tng-autocomplete-primitive.ts',
    },
    {
      content: autocompleteComponentTsTemplate,
      path: 'src/app/tailng-ui/autocomplete/tng-autocomplete.ts',
    },
    {
      content: autocompleteTemplateHtml,
      path: 'src/app/tailng-ui/autocomplete/tng-autocomplete.html',
    },
    {
      content: autocompleteTemplateCss,
      path: 'src/app/tailng-ui/autocomplete/tng-autocomplete.css',
    },
    {
      content: autocompleteIndexTsTemplate,
      path: 'src/app/tailng-ui/autocomplete/index.ts',
    },
  ],
  name: 'autocomplete',
} satisfies RegistryItem;
