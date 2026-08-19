import type { RegistryItem } from '../registry.types';

const multiselectPrimitiveTsTemplate = `import { Directive, HostBinding } from '@angular/core';

@Directive({
  selector: '[tngMultiselect]',
  exportAs: 'tngMultiselect',
})
export class TngMultiselectPrimitive {
  @HostBinding('attr.data-slot')
  protected readonly dataSlot = 'multiselect' as const;
}
`;

const multiselectComponentTsTemplate = `import { Component, input } from '@angular/core';
import { TngMultiselectPrimitive } from './tng-multiselect-primitive';

@Component({
  selector: 'tng-multiselect',
  imports: [TngMultiselectPrimitive],
  templateUrl: './tng-multiselect.html',
  styleUrl: './tng-multiselect.css',
})
export class TngMultiselect {
  public readonly ariaLabel = input<string>('Multiselect');
}
`;

const multiselectTemplateHtml = `<section tngMultiselect class="tng-multiselect" [attr.aria-label]="ariaLabel()">
  <ng-content />
</section>
`;

const multiselectTemplateCss = `:host {
  display: block;
}

.tng-multiselect {
  border: 1px solid #cbd5e1;
  border-radius: 0.75rem;
  display: grid;
  gap: 0.5rem;
  padding: 0.9rem 1rem;
}
`;

const multiselectIndexTsTemplate = `export * from './tng-multiselect';
export * from './tng-multiselect-primitive';
`;

export const multiselectRegistryItem = {
  dependencies: [],
  description: 'Shadcn-style source files for multiselect primitive and styled wrapper.',
  install: {
    importPath: './tailng-ui/multiselect',
    importSymbols: ['TngMultiselect', 'TngMultiselectPrimitive'],
  },
  files: [
    {
      content: multiselectPrimitiveTsTemplate,
      path: 'src/app/tailng-ui/multiselect/tng-multiselect-primitive.ts',
    },
    {
      content: multiselectComponentTsTemplate,
      path: 'src/app/tailng-ui/multiselect/tng-multiselect.ts',
    },
    {
      content: multiselectTemplateHtml,
      path: 'src/app/tailng-ui/multiselect/tng-multiselect.html',
    },
    {
      content: multiselectTemplateCss,
      path: 'src/app/tailng-ui/multiselect/tng-multiselect.css',
    },
    {
      content: multiselectIndexTsTemplate,
      path: 'src/app/tailng-ui/multiselect/index.ts',
    },
  ],
  name: 'multiselect',
} satisfies RegistryItem;
