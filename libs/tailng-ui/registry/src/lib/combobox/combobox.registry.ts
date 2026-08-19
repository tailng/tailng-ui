import type { RegistryItem } from '../registry.types';

const comboboxPrimitiveTsTemplate = `import { Directive, HostBinding } from '@angular/core';

@Directive({
  selector: '[tngCombobox]',
  exportAs: 'tngCombobox',
})
export class TngComboboxPrimitive {
  @HostBinding('attr.data-slot')
  protected readonly dataSlot = 'combobox' as const;
}
`;

const comboboxComponentTsTemplate = `import { Component, input } from '@angular/core';
import { TngComboboxPrimitive } from './tng-combobox-primitive';

@Component({
  selector: 'tng-combobox',
  imports: [TngComboboxPrimitive],
  templateUrl: './tng-combobox.html',
  styleUrl: './tng-combobox.css',
})
export class TngCombobox {
  public readonly ariaLabel = input<string>('Combobox');
}
`;

const comboboxTemplateHtml = `<section tngCombobox class="tng-combobox" [attr.aria-label]="ariaLabel()">
  <ng-content />
</section>
`;

const comboboxTemplateCss = `:host {
  display: block;
}

.tng-combobox {
  border: 1px solid #cbd5e1;
  border-radius: 0.75rem;
  display: grid;
  gap: 0.5rem;
  padding: 0.9rem 1rem;
}
`;

const comboboxIndexTsTemplate = `export * from './tng-combobox';
export * from './tng-combobox-primitive';
`;

export const comboboxRegistryItem = {
  dependencies: [],
  description: 'Shadcn-style source files for combobox primitive and styled wrapper.',
  install: {
    importPath: './tailng-ui/combobox',
    importSymbols: ['TngCombobox', 'TngComboboxPrimitive'],
  },
  files: [
    {
      content: comboboxPrimitiveTsTemplate,
      path: 'src/app/tailng-ui/combobox/tng-combobox-primitive.ts',
    },
    {
      content: comboboxComponentTsTemplate,
      path: 'src/app/tailng-ui/combobox/tng-combobox.ts',
    },
    {
      content: comboboxTemplateHtml,
      path: 'src/app/tailng-ui/combobox/tng-combobox.html',
    },
    {
      content: comboboxTemplateCss,
      path: 'src/app/tailng-ui/combobox/tng-combobox.css',
    },
    {
      content: comboboxIndexTsTemplate,
      path: 'src/app/tailng-ui/combobox/index.ts',
    },
  ],
  name: 'combobox',
} satisfies RegistryItem;
