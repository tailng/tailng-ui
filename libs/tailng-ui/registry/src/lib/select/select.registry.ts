import type { RegistryItem } from '../registry.types';

const selectPrimitiveTsTemplate = `import { Directive, HostBinding } from '@angular/core';

@Directive({
  selector: '[tngSelect]',
  exportAs: 'tngSelect',
})
export class TngSelectPrimitive {
  @HostBinding('attr.data-slot')
  protected readonly dataSlot = 'select' as const;
}
`;

const selectComponentTsTemplate = `import { Component, input } from '@angular/core';
import { TngSelectPrimitive } from './tng-select-primitive';

@Component({
  selector: 'tng-select',
  imports: [TngSelectPrimitive],
  templateUrl: './tng-select.html',
  styleUrl: './tng-select.css',
})
export class TngSelect {
  public readonly ariaLabel = input<string>('Select');
}
`;

const selectTemplateHtml = `<section tngSelect class="tng-select" [attr.aria-label]="ariaLabel()">
  <ng-content />
</section>
`;

const selectTemplateCss = `:host {
  display: block;
}

.tng-select {
  border: 1px solid #cbd5e1;
  border-radius: 0.75rem;
  display: grid;
  gap: 0.5rem;
  padding: 0.9rem 1rem;
}
`;

const selectIndexTsTemplate = `export * from './tng-select';
export * from './tng-select-primitive';
`;

export const selectRegistryItem = {
  dependencies: [],
  description: 'Shadcn-style source files for select primitive and styled wrapper.',
  install: {
    importPath: './tailng-ui/select',
    importSymbols: ['TngSelect', 'TngSelectPrimitive'],
  },
  files: [
    {
      content: selectPrimitiveTsTemplate,
      path: 'src/app/tailng-ui/select/tng-select-primitive.ts',
    },
    {
      content: selectComponentTsTemplate,
      path: 'src/app/tailng-ui/select/tng-select.ts',
    },
    {
      content: selectTemplateHtml,
      path: 'src/app/tailng-ui/select/tng-select.html',
    },
    {
      content: selectTemplateCss,
      path: 'src/app/tailng-ui/select/tng-select.css',
    },
    {
      content: selectIndexTsTemplate,
      path: 'src/app/tailng-ui/select/index.ts',
    },
  ],
  name: 'select',
} satisfies RegistryItem;
