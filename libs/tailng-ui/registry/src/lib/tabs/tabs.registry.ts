import type { RegistryItem } from '../registry.types';

const tabsPrimitiveTsTemplate = `import { Directive, HostBinding } from '@angular/core';

@Directive({
  selector: '[tngTabs]',
  exportAs: 'tngTabs',
})
export class TngTabsPrimitive {
  @HostBinding('attr.data-slot')
  protected readonly dataSlot = 'tabs' as const;
}
`;

const tabsComponentTsTemplate = `import { Component, input } from '@angular/core';
import { TngTabsPrimitive } from './tng-tabs-primitive';

@Component({
  selector: 'tng-tabs',
  imports: [TngTabsPrimitive],
  templateUrl: './tng-tabs.html',
  styleUrl: './tng-tabs.css',
})
export class TngTabs {
  public readonly ariaLabel = input<string>('Tabs');
}
`;

const tabsTemplateHtml = `<section tngTabs class="tng-tabs" [attr.aria-label]="ariaLabel()">
  <ng-content />
</section>
`;

const tabsTemplateCss = `:host {
  display: block;
}

.tng-tabs {
  border: 1px solid #cbd5e1;
  border-radius: 0.75rem;
  display: grid;
  gap: 0.5rem;
  padding: 0.9rem 1rem;
}
`;

const tabsIndexTsTemplate = `export * from './tng-tabs';
export * from './tng-tabs-primitive';
`;

export const tabsRegistryItem = {
  dependencies: [],
  description: 'Shadcn-style source files for tabs primitive and styled wrapper.',
  install: {
    importPath: './tailng-ui/tabs',
    importSymbols: ['TngTabs', 'TngTabsPrimitive'],
  },
  files: [
    {
      content: tabsPrimitiveTsTemplate,
      path: 'src/app/tailng-ui/tabs/tng-tabs-primitive.ts',
    },
    {
      content: tabsComponentTsTemplate,
      path: 'src/app/tailng-ui/tabs/tng-tabs.ts',
    },
    {
      content: tabsTemplateHtml,
      path: 'src/app/tailng-ui/tabs/tng-tabs.html',
    },
    {
      content: tabsTemplateCss,
      path: 'src/app/tailng-ui/tabs/tng-tabs.css',
    },
    {
      content: tabsIndexTsTemplate,
      path: 'src/app/tailng-ui/tabs/index.ts',
    },
  ],
  name: 'tabs',
} satisfies RegistryItem;
