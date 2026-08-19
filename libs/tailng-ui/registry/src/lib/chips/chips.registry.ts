import type { RegistryItem } from '../registry.types';

const chipsPrimitiveTsTemplate = `import { Directive, HostBinding } from '@angular/core';

@Directive({
  selector: '[tngChips]',
  exportAs: 'tngChips',
})
export class TngChipsPrimitive {
  @HostBinding('attr.data-slot')
  protected readonly dataSlot = 'chips' as const;
}
`;

const chipsComponentTsTemplate = `import { Component, input } from '@angular/core';
import { TngChipsPrimitive } from './tng-chips-primitive';

@Component({
  selector: 'tng-chips',
  imports: [TngChipsPrimitive],
  templateUrl: './tng-chips.html',
  styleUrl: './tng-chips.css',
})
export class TngChips {
  public readonly ariaLabel = input<string>('Chips');
}
`;

const chipsTemplateHtml = `<section tngChips class="tng-chips" [attr.aria-label]="ariaLabel()">
  <ng-content />
</section>
`;

const chipsTemplateCss = `:host {
  display: block;
}

.tng-chips {
  border: 1px solid #cbd5e1;
  border-radius: 0.75rem;
  display: grid;
  gap: 0.5rem;
  padding: 0.9rem 1rem;
}
`;

const chipsIndexTsTemplate = `export * from './tng-chips';
export * from './tng-chips-primitive';
`;

export const chipsRegistryItem = {
  dependencies: [],
  description: 'Shadcn-style source files for chips primitive and styled wrapper.',
  install: {
    importPath: './tailng-ui/chips',
    importSymbols: ['TngChips', 'TngChipsPrimitive'],
  },
  files: [
    {
      content: chipsPrimitiveTsTemplate,
      path: 'src/app/tailng-ui/chips/tng-chips-primitive.ts',
    },
    {
      content: chipsComponentTsTemplate,
      path: 'src/app/tailng-ui/chips/tng-chips.ts',
    },
    {
      content: chipsTemplateHtml,
      path: 'src/app/tailng-ui/chips/tng-chips.html',
    },
    {
      content: chipsTemplateCss,
      path: 'src/app/tailng-ui/chips/tng-chips.css',
    },
    {
      content: chipsIndexTsTemplate,
      path: 'src/app/tailng-ui/chips/index.ts',
    },
  ],
  name: 'chips',
} satisfies RegistryItem;
