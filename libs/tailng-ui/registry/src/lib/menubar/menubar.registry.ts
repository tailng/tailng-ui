import type { RegistryItem } from '../registry.types';

const menubarPrimitiveTsTemplate = `import { Directive, HostBinding } from '@angular/core';

@Directive({
  selector: '[tngMenubar]',
  exportAs: 'tngMenubar',
})
export class TngMenubarPrimitive {
  @HostBinding('attr.data-slot')
  protected readonly dataSlot = 'menubar' as const;
}
`;

const menubarComponentTsTemplate = `import { Component, input } from '@angular/core';
import { TngMenubarPrimitive } from './tng-menubar-primitive';

@Component({
  selector: 'tng-menubar',
  imports: [TngMenubarPrimitive],
  templateUrl: './tng-menubar.html',
  styleUrl: './tng-menubar.css',
})
export class TngMenubar {
  public readonly ariaLabel = input<string>('Menubar');
}
`;

const menubarTemplateHtml = `<section tngMenubar class="tng-menubar" [attr.aria-label]="ariaLabel()">
  <ng-content />
</section>
`;

const menubarTemplateCss = `:host {
  display: block;
}

.tng-menubar {
  border: 1px solid #cbd5e1;
  border-radius: 0.75rem;
  display: grid;
  gap: 0.5rem;
  padding: 0.9rem 1rem;
}
`;

const menubarIndexTsTemplate = `export * from './tng-menubar';
export * from './tng-menubar-primitive';
`;

export const menubarRegistryItem = {
  dependencies: [],
  description: 'Shadcn-style source files for menubar primitive and styled wrapper.',
  install: {
    importPath: './tailng-ui/menubar',
    importSymbols: ['TngMenubar', 'TngMenubarPrimitive'],
  },
  files: [
    {
      content: menubarPrimitiveTsTemplate,
      path: 'src/app/tailng-ui/menubar/tng-menubar-primitive.ts',
    },
    {
      content: menubarComponentTsTemplate,
      path: 'src/app/tailng-ui/menubar/tng-menubar.ts',
    },
    {
      content: menubarTemplateHtml,
      path: 'src/app/tailng-ui/menubar/tng-menubar.html',
    },
    {
      content: menubarTemplateCss,
      path: 'src/app/tailng-ui/menubar/tng-menubar.css',
    },
    {
      content: menubarIndexTsTemplate,
      path: 'src/app/tailng-ui/menubar/index.ts',
    },
  ],
  name: 'menubar',
} satisfies RegistryItem;
