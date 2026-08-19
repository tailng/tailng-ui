import type { RegistryItem } from '../registry.types';

const gridPrimitiveTsTemplate = `import { Directive, HostBinding } from '@angular/core';

@Directive({
  selector: '[tngGrid]',
  exportAs: 'tngGrid',
})
export class TngGridPrimitive {
  @HostBinding('attr.data-slot')
  protected readonly dataSlot = 'grid' as const;
}
`;

const gridComponentTsTemplate = `import { Component, input } from '@angular/core';
import { TngGridPrimitive } from './tng-grid-primitive';

@Component({
  selector: 'tng-grid',
  imports: [TngGridPrimitive],
  templateUrl: './tng-grid.html',
  styleUrl: './tng-grid.css',
})
export class TngGrid {
  public readonly ariaLabel = input<string>('Grid');
}
`;

const gridTemplateHtml = `<section tngGrid class="tng-grid" [attr.aria-label]="ariaLabel()">
  <ng-content />
</section>
`;

const gridTemplateCss = `:host {
  display: block;
}

.tng-grid {
  border: 1px solid #cbd5e1;
  border-radius: 0.75rem;
  display: grid;
  gap: 0.5rem;
  padding: 0.9rem 1rem;
}
`;

const gridIndexTsTemplate = `export * from './tng-grid';
export * from './tng-grid-primitive';
`;

export const gridRegistryItem = {
  dependencies: [],
  description: 'Shadcn-style source files for grid primitive and styled wrapper.',
  install: {
    importPath: './tailng-ui/grid',
    importSymbols: ['TngGrid', 'TngGridPrimitive'],
  },
  files: [
    {
      content: gridPrimitiveTsTemplate,
      path: 'src/app/tailng-ui/grid/tng-grid-primitive.ts',
    },
    {
      content: gridComponentTsTemplate,
      path: 'src/app/tailng-ui/grid/tng-grid.ts',
    },
    {
      content: gridTemplateHtml,
      path: 'src/app/tailng-ui/grid/tng-grid.html',
    },
    {
      content: gridTemplateCss,
      path: 'src/app/tailng-ui/grid/tng-grid.css',
    },
    {
      content: gridIndexTsTemplate,
      path: 'src/app/tailng-ui/grid/index.ts',
    },
  ],
  name: 'grid',
} satisfies RegistryItem;
