import type { RegistryItem } from '../registry.types';

const navigationmenuPrimitiveTsTemplate = `import { Directive, HostBinding } from '@angular/core';

@Directive({
  selector: '[tngNavigationMenu]',
  exportAs: 'tngNavigationMenu',
})
export class TngNavigationMenuPrimitive {
  @HostBinding('attr.data-slot')
  protected readonly dataSlot = 'navigation-menu' as const;
}
`;

const navigationmenuComponentTsTemplate = `import { Component, input } from '@angular/core';
import { TngNavigationMenuPrimitive } from './tng-navigation-menu-primitive';

@Component({
  selector: 'tng-navigation-menu',
  imports: [TngNavigationMenuPrimitive],
  templateUrl: './tng-navigation-menu.html',
  styleUrl: './tng-navigation-menu.css',
})
export class TngNavigationMenu {
  public readonly ariaLabel = input<string>('Navigation Menu');
}
`;

const navigationmenuTemplateHtml = `<section tngNavigationMenu class="tng-navigation-menu" [attr.aria-label]="ariaLabel()">
  <ng-content />
</section>
`;

const navigationmenuTemplateCss = `:host {
  display: block;
}

.tng-navigation-menu {
  border: 1px solid #cbd5e1;
  border-radius: 0.75rem;
  display: grid;
  gap: 0.5rem;
  padding: 0.9rem 1rem;
}
`;

const navigationmenuIndexTsTemplate = `export * from './tng-navigation-menu';
export * from './tng-navigation-menu-primitive';
`;

export const navigationmenuRegistryItem = {
  dependencies: [],
  description: 'Shadcn-style source files for navigation-menu primitive and styled wrapper.',
  install: {
    importPath: './tailng-ui/navigation-menu',
    importSymbols: ['TngNavigationMenu', 'TngNavigationMenuPrimitive'],
  },
  files: [
    {
      content: navigationmenuPrimitiveTsTemplate,
      path: 'src/app/tailng-ui/navigation-menu/tng-navigation-menu-primitive.ts',
    },
    {
      content: navigationmenuComponentTsTemplate,
      path: 'src/app/tailng-ui/navigation-menu/tng-navigation-menu.ts',
    },
    {
      content: navigationmenuTemplateHtml,
      path: 'src/app/tailng-ui/navigation-menu/tng-navigation-menu.html',
    },
    {
      content: navigationmenuTemplateCss,
      path: 'src/app/tailng-ui/navigation-menu/tng-navigation-menu.css',
    },
    {
      content: navigationmenuIndexTsTemplate,
      path: 'src/app/tailng-ui/navigation-menu/index.ts',
    },
  ],
  name: 'navigation-menu',
} satisfies RegistryItem;
