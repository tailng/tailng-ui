import type { RegistryItem } from '../registry.types';

const contextmenuPrimitiveTsTemplate = `import { Directive, HostBinding } from '@angular/core';

@Directive({
  selector: '[tngContextMenu]',
  exportAs: 'tngContextMenu',
})
export class TngContextMenuPrimitive {
  @HostBinding('attr.data-slot')
  protected readonly dataSlot = 'context-menu' as const;
}
`;

const contextmenuComponentTsTemplate = `import { Component, input } from '@angular/core';
import { TngContextMenuPrimitive } from './tng-context-menu-primitive';

@Component({
  selector: 'tng-context-menu',
  imports: [TngContextMenuPrimitive],
  templateUrl: './tng-context-menu.html',
  styleUrl: './tng-context-menu.css',
})
export class TngContextMenu {
  public readonly ariaLabel = input<string>('Context Menu');
}
`;

const contextmenuTemplateHtml = `<section tngContextMenu class="tng-context-menu" [attr.aria-label]="ariaLabel()">
  <ng-content />
</section>
`;

const contextmenuTemplateCss = `:host {
  display: block;
}

.tng-context-menu {
  border: 1px solid #cbd5e1;
  border-radius: 0.75rem;
  display: grid;
  gap: 0.5rem;
  padding: 0.9rem 1rem;
}
`;

const contextmenuIndexTsTemplate = `export * from './tng-context-menu';
export * from './tng-context-menu-primitive';
`;

export const contextmenuRegistryItem = {
  dependencies: [],
  description: 'Shadcn-style source files for context-menu primitive and styled wrapper.',
  install: {
    importPath: './tailng-ui/context-menu',
    importSymbols: ['TngContextMenu', 'TngContextMenuPrimitive'],
  },
  files: [
    {
      content: contextmenuPrimitiveTsTemplate,
      path: 'src/app/tailng-ui/context-menu/tng-context-menu-primitive.ts',
    },
    {
      content: contextmenuComponentTsTemplate,
      path: 'src/app/tailng-ui/context-menu/tng-context-menu.ts',
    },
    {
      content: contextmenuTemplateHtml,
      path: 'src/app/tailng-ui/context-menu/tng-context-menu.html',
    },
    {
      content: contextmenuTemplateCss,
      path: 'src/app/tailng-ui/context-menu/tng-context-menu.css',
    },
    {
      content: contextmenuIndexTsTemplate,
      path: 'src/app/tailng-ui/context-menu/index.ts',
    },
  ],
  name: 'context-menu',
} satisfies RegistryItem;
