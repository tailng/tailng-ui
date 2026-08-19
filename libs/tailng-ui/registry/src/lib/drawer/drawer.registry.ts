import type { RegistryItem } from '../registry.types';

const drawerPrimitiveTsTemplate = `import { Directive, HostBinding } from '@angular/core';

@Directive({
  selector: '[tngDrawer]',
  exportAs: 'tngDrawer',
})
export class TngDrawerPrimitive {
  @HostBinding('attr.data-slot')
  protected readonly dataSlot = 'drawer' as const;
}
`;

const drawerComponentTsTemplate = `import { Component, input } from '@angular/core';
import { TngDrawerPrimitive } from './tng-drawer-primitive';

@Component({
  selector: 'tng-drawer',
  imports: [TngDrawerPrimitive],
  templateUrl: './tng-drawer.html',
  styleUrl: './tng-drawer.css',
})
export class TngDrawer {
  public readonly ariaLabel = input<string>('Drawer');
}
`;

const drawerTemplateHtml = `<section tngDrawer class="tng-drawer" [attr.aria-label]="ariaLabel()">
  <ng-content />
</section>
`;

const drawerTemplateCss = `:host {
  display: block;
}

.tng-drawer {
  border: 1px solid #cbd5e1;
  border-radius: 0.75rem;
  display: grid;
  gap: 0.5rem;
  padding: 0.9rem 1rem;
}
`;

const drawerIndexTsTemplate = `export * from './tng-drawer';
export * from './tng-drawer-primitive';
`;

export const drawerRegistryItem = {
  dependencies: [],
  description: 'Shadcn-style source files for drawer primitive and styled wrapper.',
  install: {
    importPath: './tailng-ui/drawer',
    importSymbols: ['TngDrawer', 'TngDrawerPrimitive'],
  },
  files: [
    {
      content: drawerPrimitiveTsTemplate,
      path: 'src/app/tailng-ui/drawer/tng-drawer-primitive.ts',
    },
    {
      content: drawerComponentTsTemplate,
      path: 'src/app/tailng-ui/drawer/tng-drawer.ts',
    },
    {
      content: drawerTemplateHtml,
      path: 'src/app/tailng-ui/drawer/tng-drawer.html',
    },
    {
      content: drawerTemplateCss,
      path: 'src/app/tailng-ui/drawer/tng-drawer.css',
    },
    {
      content: drawerIndexTsTemplate,
      path: 'src/app/tailng-ui/drawer/index.ts',
    },
  ],
  name: 'drawer',
} satisfies RegistryItem;
