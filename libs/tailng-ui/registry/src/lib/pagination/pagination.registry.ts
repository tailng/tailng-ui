import type { RegistryItem } from '../registry.types';

const paginationPrimitiveTsTemplate = `import { Directive, HostBinding, input } from '@angular/core';

@Directive({
  selector: '[tngPagination]',
  exportAs: 'tngPagination',
})
export class TngPaginationPrimitive {
  public readonly totalItems = input<number>(0);
  public readonly pageIndex = input<number>(0);
  public readonly pageSize = input<number>(10);

  @HostBinding('attr.data-slot')
  protected readonly dataSlot = 'pagination' as const;
}
`;

const paginationComponentTsTemplate = `import { Component, input } from '@angular/core';
import { TngPaginationPrimitive } from './tng-pagination-primitive';

@Component({
  selector: 'tng-paginator',
  imports: [TngPaginationPrimitive],
  templateUrl: './tng-paginator.html',
  styleUrl: './tng-paginator.css',
})
export class TngPaginator {
  public readonly ariaLabel = input<string>('Pagination');
  public readonly totalItems = input<number>(0);
}
`;

const paginationTemplateHtml = `<nav
  tngPagination
  class="tng-paginator"
  [attr.aria-label]="ariaLabel()"
  [totalItems]="totalItems()"
>
  <button type="button" class="tng-paginator__button" aria-label="Previous page">Previous</button>
  <span class="tng-paginator__range">1-10 of {{ totalItems() }}</span>
  <button type="button" class="tng-paginator__button" aria-label="Next page">Next</button>
</nav>
`;

const paginationTemplateCss = `:host {
  display: block;
}

.tng-paginator {
  align-items: center;
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.tng-paginator__button {
  border: 1px solid #cbd5e1;
  border-radius: 0.5rem;
  padding: 0.4rem 0.7rem;
}

.tng-paginator__range {
  color: #475569;
  font-size: 0.875rem;
}
`;

const paginationIndexTsTemplate = `export * from './tng-paginator';
export * from './tng-pagination-primitive';
`;

export const paginationRegistryItem = {
  dependencies: [],
  description: 'Shadcn-style source files for pagination primitive and styled paginator.',
  install: {
    importPath: './tailng-ui/pagination',
    importSymbols: ['TngPaginator', 'TngPaginationPrimitive'],
  },
  files: [
    {
      content: paginationPrimitiveTsTemplate,
      path: 'src/app/tailng-ui/pagination/tng-pagination-primitive.ts',
    },
    {
      content: paginationComponentTsTemplate,
      path: 'src/app/tailng-ui/pagination/tng-paginator.ts',
    },
    {
      content: paginationTemplateHtml,
      path: 'src/app/tailng-ui/pagination/tng-paginator.html',
    },
    {
      content: paginationTemplateCss,
      path: 'src/app/tailng-ui/pagination/tng-paginator.css',
    },
    {
      content: paginationIndexTsTemplate,
      path: 'src/app/tailng-ui/pagination/index.ts',
    },
  ],
  name: 'pagination',
} satisfies RegistryItem;
