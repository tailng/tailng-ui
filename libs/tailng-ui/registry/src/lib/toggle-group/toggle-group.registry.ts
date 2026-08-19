import type { RegistryItem } from '../registry.types';

const togglegroupPrimitiveTsTemplate = `import { Directive, HostBinding } from '@angular/core';

@Directive({
  selector: '[tngToggleGroup]',
  exportAs: 'tngToggleGroup',
})
export class TngToggleGroupPrimitive {
  @HostBinding('attr.data-slot')
  protected readonly dataSlot = 'toggle-group' as const;
}
`;

const togglegroupComponentTsTemplate = `import { Component, input } from '@angular/core';
import { TngToggleGroupPrimitive } from './tng-toggle-group-primitive';

@Component({
  selector: 'tng-toggle-group',
  imports: [TngToggleGroupPrimitive],
  templateUrl: './tng-toggle-group.html',
  styleUrl: './tng-toggle-group.css',
})
export class TngToggleGroup {
  public readonly ariaLabel = input<string>('Toggle Group');
}
`;

const togglegroupTemplateHtml = `<section tngToggleGroup class="tng-toggle-group" [attr.aria-label]="ariaLabel()">
  <ng-content />
</section>
`;

const togglegroupTemplateCss = `:host {
  display: block;
}

.tng-toggle-group {
  border: 1px solid #cbd5e1;
  border-radius: 0.75rem;
  display: grid;
  gap: 0.5rem;
  padding: 0.9rem 1rem;
}
`;

const togglegroupIndexTsTemplate = `export * from './tng-toggle-group';
export * from './tng-toggle-group-primitive';
`;

export const togglegroupRegistryItem = {
  dependencies: [],
  description: 'Shadcn-style source files for toggle-group primitive and styled wrapper.',
  install: {
    importPath: './tailng-ui/toggle-group',
    importSymbols: ['TngToggleGroup', 'TngToggleGroupPrimitive'],
  },
  files: [
    {
      content: togglegroupPrimitiveTsTemplate,
      path: 'src/app/tailng-ui/toggle-group/tng-toggle-group-primitive.ts',
    },
    {
      content: togglegroupComponentTsTemplate,
      path: 'src/app/tailng-ui/toggle-group/tng-toggle-group.ts',
    },
    {
      content: togglegroupTemplateHtml,
      path: 'src/app/tailng-ui/toggle-group/tng-toggle-group.html',
    },
    {
      content: togglegroupTemplateCss,
      path: 'src/app/tailng-ui/toggle-group/tng-toggle-group.css',
    },
    {
      content: togglegroupIndexTsTemplate,
      path: 'src/app/tailng-ui/toggle-group/index.ts',
    },
  ],
  name: 'toggle-group',
} satisfies RegistryItem;
