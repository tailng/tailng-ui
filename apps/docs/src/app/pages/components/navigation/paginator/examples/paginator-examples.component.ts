import { Component, computed, signal } from '@angular/core';
import { TngPaginator, TngPaginatorChange } from '@tailng-ui/ui/navigation';
import { ExampleBlockComponent, TngExampleDemo } from '../../../../../shared/example-block/example-block.component';

@Component({
  standalone: true,
  selector: 'docs-paginator-examples',
  templateUrl: './paginator-examples.component.html',
  imports: [TngPaginator, ExampleBlockComponent, TngExampleDemo],
})
export class PaginatorExamplesComponent {
  readonly count = signal(100);
  readonly page = signal(1);
  readonly pageSize = signal(10);
  readonly rangeStart = computed(() => (this.page() - 1) * this.pageSize() + 1);
  readonly rangeEnd = computed(() => Math.min(this.count(), this.page() * this.pageSize()));

  readonly page2 = signal(1);
  readonly pageSize2 = signal(5);

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
    () => `onChange(e: TngPaginatorChange) {
  this.page.set(e.page);
  this.pageSize.set(e.pageSize);
}`,
  );
  readonly noSizeHtml = computed(
    () => `<tng-paginator [hidePageSize]="true" ...></tng-paginator>`,
  );

  onChange(e: TngPaginatorChange) {
    this.page.set(e.page);
    this.pageSize.set(e.pageSize);
  }
  onChange2(e: TngPaginatorChange) {
    this.page2.set(e.page);
    this.pageSize2.set(e.pageSize);
  }
}
