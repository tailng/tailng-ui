import { Component, computed, input, output } from '@angular/core';

export type TngPaginatorChange = {
  page: number; // 1-based
  pageSize: number;
  skip: number; // 0-based
};

@Component({
  selector: 'tng-paginator',
  standalone: true,
  templateUrl: './paginator.component.html',
})
export class TailngPaginatorComponent {
  /* =====================
   * Inputs
   * ===================== */

  /** Total items count */
  readonly count = input<number>(0);

  /** Current page (1-based) */
  readonly page = input<number>(1);

  /** Items per page */
  readonly pageSize = input<number>(10);

  /** Page size options */
  readonly pageSizeOptions = input<number[]>([10, 20, 50, 100]);

  /** Hide page size selector */
  readonly hidePageSize = input<boolean>(false);

  /** Max visible page buttons (window size) */
  readonly maxPages = input<number>(7);

  /* =====================
   * Klass inputs (Tailng)
   * ===================== */
  readonly rootKlass = input<string>('flex flex-wrap items-center justify-between gap-3 text-sm');
  readonly leftKlass = input<string>('text-muted-foreground');
  readonly rightKlass = input<string>('flex flex-wrap items-center gap-2');

  readonly buttonKlass = input<string>(
    'rounded-md border border-border bg-bg px-2.5 py-1.5 text-sm hover:bg-slate-50 disabled:opacity-50 disabled:pointer-events-none'
  );

  readonly activePageKlass = input<string>(
    'bg-primary text-on-primary border-primary hover:bg-primary'
  );

  readonly pageKlass = input<string>(
    'rounded-md border border-border bg-bg px-2.5 py-1.5 text-sm hover:bg-slate-50'
  );

  readonly selectKlass = input<string>(
    'rounded-md border border-border bg-bg px-2 py-1.5 text-sm'
  );

  readonly separatorKlass = input<string>('mx-2 text-slate-400');

  /* =====================
   * Outputs
   * ===================== */
  readonly pageChange = output<number>();
  readonly pageSizeChange = output<number>();
  readonly change = output<TngPaginatorChange>();

  /* =====================
   * Derived
   * ===================== */
  readonly totalPages = computed(() => {
    const total = Math.max(0, this.count());
    const size = Math.max(1, this.pageSize());
    return Math.max(1, Math.ceil(total / size));
  });

  readonly clampedPage = computed(() => {
    const p = this.page();
    return Math.min(Math.max(1, p), this.totalPages());
  });

  readonly skip = computed(() => (this.clampedPage() - 1) * this.pageSize());

  readonly rangeStart = computed(() => {
    const total = this.count();
    if (total <= 0) return 0;
    return this.skip() + 1;
  });

  readonly rangeEnd = computed(() => {
    const total = this.count();
    if (total <= 0) return 0;
    return Math.min(total, this.skip() + this.pageSize());
  });

  readonly pages = computed<Array<number | '…'>>(() => {
    const total = this.totalPages();
    const max = Math.max(5, this.maxPages()); // keep sane min
    const current = this.clampedPage();

    if (total <= max) {
      return Array.from({ length: total }, (_, i) => i + 1);
    }

    const half = Math.floor(max / 2);
    let start = Math.max(1, current - half);
    let end = Math.min(total, start + max - 1);

    // adjust if we hit end
    start = Math.max(1, end - max + 1);

    const result: Array<number | '…'> = [];

    if (start > 1) {
      result.push(1);
      if (start > 2) result.push('…');
    }

    for (let p = start; p <= end; p++) result.push(p);

    if (end < total) {
      if (end < total - 1) result.push('…');
      result.push(total);
    }

    return result;
  });

  /* =====================
   * Actions
   * ===================== */
  private emitChange(nextPage: number, nextSize: number) {
    this.pageChange.emit(nextPage);
    this.pageSizeChange.emit(nextSize);
    this.change.emit({
      page: nextPage,
      pageSize: nextSize,
      skip: (nextPage - 1) * nextSize,
    });
  }

  goTo(page: number) {
    const next = Math.min(Math.max(1, page), this.totalPages());
    if (next === this.clampedPage()) return;

    // keep size unchanged
    this.pageChange.emit(next);
    this.change.emit({ page: next, pageSize: this.pageSize(), skip: (next - 1) * this.pageSize() });
  }

  prev() {
    this.goTo(this.clampedPage() - 1);
  }

  next() {
    this.goTo(this.clampedPage() + 1);
  }

  first() {
    this.goTo(1);
  }

  last() {
    this.goTo(this.totalPages());
  }

  onPageSizeSelect(value: string) {
    const size = Math.max(1, Number(value) || this.pageSize());
    if (size === this.pageSize()) return;

    // keep user near same position: recompute page from previous skip
    const currentSkip = (this.clampedPage() - 1) * this.pageSize();
    const nextPage = Math.floor(currentSkip / size) + 1;

    this.emitChange(nextPage, size);
  }

  isActive(p: number) {
    return p === this.clampedPage();
  }

  pageBtnClasses(p: number) {
    const base = this.pageKlass();
    const active = this.isActive(p) ? ` ${this.activePageKlass()}` : '';
    return (base + active).trim();
  }
}
