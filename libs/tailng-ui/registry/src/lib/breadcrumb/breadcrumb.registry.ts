import type { RegistryItem } from '../registry.types';

const breadcrumbPrimitiveTsTemplate = `import { Directive, HostBinding } from '@angular/core';

@Directive({
  selector: '[tngBreadcrumb]',
  exportAs: 'tngBreadcrumb',
})
export class TngBreadcrumbPrimitive {
  @HostBinding('attr.data-slot')
  protected readonly dataSlot = 'breadcrumb' as const;
}

@Directive({
  selector: '[tngBreadcrumbList]',
  exportAs: 'tngBreadcrumbList',
})
export class TngBreadcrumbListPrimitive {
  @HostBinding('attr.data-slot')
  protected readonly dataSlot = 'breadcrumb-list' as const;
}

@Directive({
  selector: '[tngBreadcrumbItem]',
  exportAs: 'tngBreadcrumbItem',
})
export class TngBreadcrumbItemPrimitive {
  @HostBinding('attr.data-slot')
  protected readonly dataSlot = 'breadcrumb-item' as const;
}

@Directive({
  selector: '[tngBreadcrumbLink]',
  exportAs: 'tngBreadcrumbLink',
})
export class TngBreadcrumbLinkPrimitive {
  @HostBinding('attr.data-slot')
  protected readonly dataSlot = 'breadcrumb-link' as const;
}

@Directive({
  selector: '[tngBreadcrumbSeparator]',
  exportAs: 'tngBreadcrumbSeparator',
})
export class TngBreadcrumbSeparatorPrimitive {
  @HostBinding('attr.aria-hidden')
  protected readonly ariaHiddenAttr = 'true' as const;

  @HostBinding('attr.data-slot')
  protected readonly dataSlot = 'breadcrumb-separator' as const;
}
`;

const breadcrumbComponentTsTemplate = `import { Component, input } from '@angular/core';
import { TngBreadcrumbPrimitive } from './tng-breadcrumb-primitive';

@Component({
  selector: 'tng-breadcrumb',
  imports: [TngBreadcrumbPrimitive],
  templateUrl: './tng-breadcrumb.html',
  styleUrl: './tng-breadcrumb.css',
})
export class TngBreadcrumb {
  public readonly ariaLabel = input<string>('Breadcrumb');
}
`;

const breadcrumbTemplateHtml = `<nav tngBreadcrumb class="tng-breadcrumb" [attr.aria-label]="ariaLabel()">
  <ng-content />
</nav>
`;

const breadcrumbTemplateCss = `:host {
  display: block;
}

.tng-breadcrumb {
  color: var(--tng-semantic-text-secondary, #475569);
}

.tng-breadcrumb :is(ol, ul) {
  align-items: center;
  display: flex;
  flex-wrap: wrap;
  gap: 0.45rem;
  list-style: none;
  margin: 0;
  padding: 0;
}

.tng-breadcrumb a {
  color: var(--tng-semantic-accent-brand, #2563eb);
  text-decoration: none;
}

.tng-breadcrumb [data-slot='breadcrumb-separator'] {
  opacity: 0.7;
}
`;

const breadcrumbIndexTsTemplate = `export * from './tng-breadcrumb';
export * from './tng-breadcrumb-primitive';
`;

export const breadcrumbRegistryItem = {
  dependencies: [],
  description: 'Shadcn-style source files for breadcrumb primitives and styled wrapper.',
  install: {
    importPath: './tailng-ui/breadcrumb',
    importSymbols: [
      'TngBreadcrumb',
      'TngBreadcrumbPrimitive',
      'TngBreadcrumbListPrimitive',
      'TngBreadcrumbItemPrimitive',
      'TngBreadcrumbLinkPrimitive',
      'TngBreadcrumbSeparatorPrimitive',
    ],
  },
  files: [
    {
      content: breadcrumbPrimitiveTsTemplate,
      path: 'src/app/tailng-ui/breadcrumb/tng-breadcrumb-primitive.ts',
    },
    {
      content: breadcrumbComponentTsTemplate,
      path: 'src/app/tailng-ui/breadcrumb/tng-breadcrumb.ts',
    },
    {
      content: breadcrumbTemplateHtml,
      path: 'src/app/tailng-ui/breadcrumb/tng-breadcrumb.html',
    },
    {
      content: breadcrumbTemplateCss,
      path: 'src/app/tailng-ui/breadcrumb/tng-breadcrumb.css',
    },
    {
      content: breadcrumbIndexTsTemplate,
      path: 'src/app/tailng-ui/breadcrumb/index.ts',
    },
  ],
  name: 'breadcrumb',
} satisfies RegistryItem;
