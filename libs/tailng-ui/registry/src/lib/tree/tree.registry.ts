import type { RegistryItem } from '../registry.types';

const treePrimitiveTsTemplate = `import { Directive, HostBinding } from '@angular/core';

@Directive({
  selector: '[tngTree]',
  exportAs: 'tngTree',
})
export class TngTreePrimitive {
  @HostBinding('attr.data-slot')
  protected readonly dataSlot = 'tree' as const;
}
`;

const treeComponentTsTemplate = `import { Component, input } from '@angular/core';
import { TngTreePrimitive } from './tng-tree-primitive';

@Component({
  selector: 'tng-tree',
  imports: [TngTreePrimitive],
  templateUrl: './tng-tree.html',
  styleUrl: './tng-tree.css',
})
export class TngTree {
  public readonly ariaLabel = input<string>('Tree');
}
`;

const treeTemplateHtml = `<section tngTree class="tng-tree" [attr.aria-label]="ariaLabel()">
  <ng-content />
</section>
`;

const treeTemplateCss = `:host {
  display: block;
}

.tng-tree {
  border: 1px solid #cbd5e1;
  border-radius: 0.75rem;
  display: grid;
  gap: 0.5rem;
  padding: 0.9rem 1rem;
}
`;

const treeIndexTsTemplate = `export * from './tng-tree';
export * from './tng-tree-primitive';
`;

export const treeRegistryItem = {
  dependencies: [],
  description: 'Shadcn-style source files for tree primitive and styled wrapper.',
  install: {
    importPath: './tailng-ui/tree',
    importSymbols: ['TngTree', 'TngTreePrimitive'],
  },
  files: [
    {
      content: treePrimitiveTsTemplate,
      path: 'src/app/tailng-ui/tree/tng-tree-primitive.ts',
    },
    {
      content: treeComponentTsTemplate,
      path: 'src/app/tailng-ui/tree/tng-tree.ts',
    },
    {
      content: treeTemplateHtml,
      path: 'src/app/tailng-ui/tree/tng-tree.html',
    },
    {
      content: treeTemplateCss,
      path: 'src/app/tailng-ui/tree/tng-tree.css',
    },
    {
      content: treeIndexTsTemplate,
      path: 'src/app/tailng-ui/tree/index.ts',
    },
  ],
  name: 'tree',
} satisfies RegistryItem;
