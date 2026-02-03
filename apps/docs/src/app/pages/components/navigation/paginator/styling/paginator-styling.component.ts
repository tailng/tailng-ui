import { Component, computed, signal } from '@angular/core';
import { TngPaginator, TngPaginatorChange } from '@tociva/tailng-ui/navigation';
import { ExampleBlockComponent, TngExampleDemo } from '../../../../../shared/example-block/example-block.component';

@Component({
  standalone: true,
  selector: 'docs-paginator-styling',
  templateUrl: './paginator-styling.component.html',
  imports: [TngPaginator, ExampleBlockComponent, TngExampleDemo],
})
export class PaginatorStylingComponent {
  readonly page = signal(1);
  readonly pageKlassHtml = computed(
    () => `<tng-paginator activePageKlass="bg-primary text-on-primary rounded-full ..." pageKlass="rounded-full ..." ...></tng-paginator>`,
  );
  onChange(e: TngPaginatorChange) {
    this.page.set(e.page);
  }
}
