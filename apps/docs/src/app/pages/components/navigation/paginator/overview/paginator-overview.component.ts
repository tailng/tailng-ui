import { Component, computed, signal } from '@angular/core';
import { TngPaginator, TngPaginatorChange } from '@tailng-ui/ui/navigation';
import { ExampleBlockComponent, TngExampleDemo } from '../../../../../shared/example-block/example-block.component';

@Component({
  standalone: true,
  selector: 'docs-paginator-overview',
  templateUrl: './paginator-overview.component.html',
  imports: [TngPaginator, ExampleBlockComponent, TngExampleDemo],
})
export class PaginatorOverviewComponent {
  readonly count = signal(95);
  readonly page = signal(1);
  readonly pageSize = signal(10);
  readonly totalPages = computed(() => Math.max(1, Math.ceil(this.count() / this.pageSize())));

  readonly basicHtml = computed(
    () => `
<tng-paginator
  [count]="count()"
  [page]="page()"
  [pageSize]="pageSize()"
  (change)="onChange($event)"
></tng-paginator>
`,
  );
  readonly basicTs = computed(
    () => `import { TngPaginator, TngPaginatorChange } from '@tailng-ui/ui/navigation';
page = signal(1);
pageSize = signal(10);
onChange(e: TngPaginatorChange) {
  this.page.set(e.page);
  this.pageSize.set(e.pageSize);
}`,
  );

  onChange(e: TngPaginatorChange) {
    this.page.set(e.page);
    this.pageSize.set(e.pageSize);
  }
}
