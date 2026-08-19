import type { RegistryItem } from '../registry.types';

const toolbarPrimitiveTsTemplate = `import { Directive, HostBinding } from '@angular/core';

@Directive({
  selector: '[tngToolbar]',
  exportAs: 'tngToolbar',
})
export class TngToolbarPrimitive {
  @HostBinding('attr.data-slot')
  protected readonly dataSlot = 'toolbar' as const;
}
`;

const toolbarComponentTsTemplate = `import { Component, input } from '@angular/core';
import { TngToolbarPrimitive } from './tng-toolbar-primitive';

@Component({
  selector: 'tng-toolbar',
  imports: [TngToolbarPrimitive],
  templateUrl: './tng-toolbar.html',
  styleUrl: './tng-toolbar.css',
})
export class TngToolbar {
  public readonly ariaLabel = input<string>('Toolbar');
}
`;

const toolbarTemplateHtml = `<section tngToolbar class="tng-toolbar" [attr.aria-label]="ariaLabel()">
  <ng-content />
</section>
`;

const toolbarTemplateCss = `:host {
  display: block;
}

.tng-toolbar {
  border: 1px solid #cbd5e1;
  border-radius: 0.75rem;
  display: grid;
  gap: 0.5rem;
  padding: 0.9rem 1rem;
}
`;

const toolbarIndexTsTemplate = `export * from './tng-toolbar';
export * from './tng-toolbar-primitive';
`;

export const toolbarRegistryItem = {
  dependencies: [],
  description: 'Shadcn-style source files for toolbar primitive and styled wrapper.',
  install: {
    importPath: './tailng-ui/toolbar',
    importSymbols: ['TngToolbar', 'TngToolbarPrimitive'],
  },
  files: [
    {
      content: toolbarPrimitiveTsTemplate,
      path: 'src/app/tailng-ui/toolbar/tng-toolbar-primitive.ts',
    },
    {
      content: toolbarComponentTsTemplate,
      path: 'src/app/tailng-ui/toolbar/tng-toolbar.ts',
    },
    {
      content: toolbarTemplateHtml,
      path: 'src/app/tailng-ui/toolbar/tng-toolbar.html',
    },
    {
      content: toolbarTemplateCss,
      path: 'src/app/tailng-ui/toolbar/tng-toolbar.css',
    },
    {
      content: toolbarIndexTsTemplate,
      path: 'src/app/tailng-ui/toolbar/index.ts',
    },
  ],
  name: 'toolbar',
} satisfies RegistryItem;
