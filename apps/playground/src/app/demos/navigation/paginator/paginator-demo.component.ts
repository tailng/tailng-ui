import { Component, computed, signal } from '@angular/core';
import { TngPaginator, TngPaginatorChange } from '@tociva/tailng-ui/navigation';

type Item = { id: number; name: string; group: string };

@Component({
  selector: 'playground-paginator-demo',
  standalone: true,
  imports: [TngPaginator],
  templateUrl: './paginator-demo.component.html',
})
export class PaginatorDemoComponent {
  // Fake dataset
  readonly all = signal<Item[]>(
    Array.from({ length: 237 }, (_, i) => ({
      id: i + 1,
      name: `Item ${i + 1}`,
      group: i % 3 === 0 ? 'Alpha' : i % 3 === 1 ? 'Beta' : 'Gamma',
    }))
  );

  // Shared state
  readonly page = signal(1);
  readonly pageSize = signal(10);

  // Debug visibility
  readonly lastChange = signal<TngPaginatorChange | null>(null);

  readonly count = computed(() => this.all().length);
  readonly skip = computed(() => (this.page() - 1) * this.pageSize());

  readonly pageItems = computed(() => {
    const start = this.skip();
    const end = start + this.pageSize();
    return this.all().slice(start, end);
  });

  onChange(e: TngPaginatorChange) {
    this.page.set(e.page);
    this.pageSize.set(e.pageSize);
    this.lastChange.set(e);
  }

  reset() {
    this.page.set(1);
    this.pageSize.set(10);
    this.lastChange.set(null);
  }

  jumpTo(p: number) {
    this.page.set(p);
  }
}
