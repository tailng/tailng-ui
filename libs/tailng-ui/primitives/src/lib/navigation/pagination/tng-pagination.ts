import {
  Directive,
  ElementRef,
  HostBinding,
  HostListener,
  booleanAttribute,
  computed,
  inject,
  input,
  output,
  signal,
} from '@angular/core';
import {
  createTngPaginationController,
  type TngTablePaginationController,
  type TngTablePaginationState,
} from '@tailng-ui/cdk';

export type TngPaginationMode = 'client' | 'server';
export type TngPaginationTrigger =
  | 'first'
  | 'last'
  | 'next'
  | 'page'
  | 'previous'
  | 'programmatic'
  | 'size';

export type TngPaginationChangeEvent = Readonly<{
  mode: TngPaginationMode;
  pageCount: number;
  pageIndex: number;
  pageSize: number;
  previousPageIndex: number;
  previousPageSize: number;
  totalItems: number;
  trigger: TngPaginationTrigger;
}>;

function normalizeModeInput(value: unknown): TngPaginationMode {
  return value === 'server' ? 'server' : 'client';
}

function normalizeNumberInput(value: unknown, fallback: number): number {
  if (typeof value === 'number') {
    return Number.isFinite(value) ? value : fallback;
  }

  if (typeof value === 'string') {
    const normalized = value.trim();
    if (normalized.length === 0) {
      return fallback;
    }

    const parsed = Number(normalized);
    return Number.isFinite(parsed) ? parsed : fallback;
  }

  return fallback;
}

function normalizePageIndexInput(value: unknown): number {
  return Math.max(0, Math.trunc(normalizeNumberInput(value, 0)));
}

function normalizeOptionalPageIndexInput(value: unknown): number | undefined {
  if (value === undefined || value === null) {
    return undefined;
  }

  return normalizePageIndexInput(value);
}

function normalizePageSizeInput(value: unknown): number {
  return Math.max(1, Math.trunc(normalizeNumberInput(value, 10)));
}

function normalizeTotalItemsInput(value: unknown): number {
  return Math.max(0, Math.trunc(normalizeNumberInput(value, 0)));
}

function normalizeStringInput(value: unknown): string | null {
  if (value === undefined || value === null) {
    return null;
  }

  if (
    typeof value !== 'string' &&
    typeof value !== 'number' &&
    typeof value !== 'boolean' &&
    typeof value !== 'bigint'
  ) {
    return null;
  }

  const normalized = String(value).trim();
  return normalized.length > 0 ? normalized : null;
}

@Directive({
  selector: '[tngPagination]',
  exportAs: 'tngPagination',
})
export class TngPagination {
  private readonly uncontrolledPageIndex = signal(0);
  private readonly uncontrolledPageSize = signal(10);
  private readonly hasUncontrolledPageIndex = signal(false);
  private readonly hasUncontrolledPageSize = signal(false);

  public readonly pageIndex = input<number | undefined, unknown>(undefined, {
    transform: normalizeOptionalPageIndexInput,
  });
  public readonly defaultPageIndex = input<number, unknown>(0, {
    transform: normalizePageIndexInput,
  });
  public readonly pageSize = input<number | undefined, unknown>(undefined, {
    transform: (value: unknown) => {
      if (value === undefined || value === null) {
        return undefined;
      }

      return normalizePageSizeInput(value);
    },
  });
  public readonly defaultPageSize = input<number, unknown>(10, {
    transform: normalizePageSizeInput,
  });
  public readonly totalItems = input<number, unknown>(0, {
    transform: normalizeTotalItemsInput,
  });
  public readonly mode = input<TngPaginationMode, unknown>('client', {
    transform: normalizeModeInput,
  });
  public readonly disabled = input<boolean, boolean | string>(false, {
    transform: booleanAttribute,
  });
  public readonly ariaLabel = input<string | null, unknown>('Pagination', {
    transform: normalizeStringInput,
  });

  public readonly pageIndexChange = output<number>();
  public readonly pageSizeChange = output<number>();
  public readonly pageChange = output<TngPaginationChangeEvent>();

  public readonly state = computed<TngTablePaginationState>(() => {
    return this.createController().setPageIndex(this.rawPageIndex(), this.totalItems());
  });

  public readonly pageCount = computed(() =>
    this.createController().getPageCount(this.totalItems()),
  );
  public readonly isFirstPage = computed(() => this.state().pageIndex <= 0);
  public readonly isLastPage = computed(() => {
    const pageCount = this.pageCount();
    return pageCount === 0 || this.state().pageIndex >= pageCount - 1;
  });

  @HostBinding('attr.aria-label')
  protected get ariaLabelAttr(): string | null {
    return this.ariaLabel();
  }

  @HostBinding('attr.data-disabled')
  protected get dataDisabledAttr(): '' | null {
    return this.disabled() ? '' : null;
  }

  @HostBinding('attr.data-mode')
  protected get dataModeAttr(): TngPaginationMode {
    return this.mode();
  }

  @HostBinding('attr.data-page-count')
  protected get dataPageCountAttr(): number {
    return this.pageCount();
  }

  @HostBinding('attr.data-page-index')
  protected get dataPageIndexAttr(): number {
    return this.state().pageIndex;
  }

  @HostBinding('attr.data-page-size')
  protected get dataPageSizeAttr(): number {
    return this.state().pageSize;
  }

  @HostBinding('attr.data-slot')
  protected readonly dataSlot = 'pagination' as const;

  public firstPage(): void {
    this.setPageIndex(0, 'first');
  }

  public previousPage(): void {
    this.setPageIndex(this.state().pageIndex - 1, 'previous');
  }

  public nextPage(): void {
    this.setPageIndex(this.state().pageIndex + 1, 'next');
  }

  public lastPage(): void {
    const pageCount = this.pageCount();
    this.setPageIndex(pageCount > 0 ? pageCount - 1 : 0, 'last');
  }

  public setPageIndex(pageIndex: number, trigger: TngPaginationTrigger = 'programmatic'): void {
    this.commit(this.createController().setPageIndex(pageIndex, this.totalItems()), trigger);
  }

  public setPageSize(pageSize: number, trigger: TngPaginationTrigger = 'size'): void {
    const current = this.state();
    const anchorIndex = current.pageIndex * current.pageSize;
    this.commit(
      this.createController().setPageSize(pageSize, this.totalItems(), { anchorIndex }),
      trigger,
    );
  }

  public canGoToPreviousPage(): boolean {
    return !this.disabled() && !this.isFirstPage();
  }

  public canGoToNextPage(): boolean {
    if (this.mode() === 'server') {
      return !this.disabled();
    }

    return !this.disabled() && !this.isLastPage();
  }

  public canGoToPage(pageIndex: number): boolean {
    if (this.disabled() || this.state().pageIndex === pageIndex) {
      return false;
    }

    if (this.mode() === 'server') {
      return pageIndex >= 0;
    }

    const pageCount = this.pageCount();
    return pageIndex >= 0 && pageIndex < pageCount;
  }

  private rawPageIndex(): number {
    return (
      this.pageIndex() ??
      (this.hasUncontrolledPageIndex() ? this.uncontrolledPageIndex() : this.defaultPageIndex())
    );
  }

  private createController(): TngTablePaginationController<unknown> {
    return createTngPaginationController<unknown>({
      mode: this.mode(),
      pageIndex: this.rawPageIndex(),
      pageSize: this.rawPageSize(),
    });
  }

  private rawPageSize(): number {
    return (
      this.pageSize() ??
      (this.hasUncontrolledPageSize() ? this.uncontrolledPageSize() : this.defaultPageSize())
    );
  }

  private commit(nextState: TngTablePaginationState, trigger: TngPaginationTrigger): void {
    if (this.disabled()) {
      return;
    }

    const previousState = this.state();
    if (
      nextState.pageIndex === previousState.pageIndex &&
      nextState.pageSize === previousState.pageSize
    ) {
      return;
    }

    if (this.pageIndex() === undefined) {
      this.hasUncontrolledPageIndex.set(true);
      this.uncontrolledPageIndex.set(nextState.pageIndex);
    }

    if (this.pageSize() === undefined) {
      this.hasUncontrolledPageSize.set(true);
      this.uncontrolledPageSize.set(nextState.pageSize);
    }

    this.pageIndexChange.emit(nextState.pageIndex);
    if (nextState.pageSize !== previousState.pageSize) {
      this.pageSizeChange.emit(nextState.pageSize);
    }

    this.pageChange.emit({
      mode: this.mode(),
      pageCount: this.pageCount(),
      pageIndex: nextState.pageIndex,
      pageSize: nextState.pageSize,
      previousPageIndex: previousState.pageIndex,
      previousPageSize: previousState.pageSize,
      totalItems: this.totalItems(),
      trigger,
    });
  }
}

@Directive()
abstract class TngPaginationButton {
  protected readonly pagination = inject(TngPagination);

  public readonly disabled = input<boolean, boolean | string>(false, {
    transform: booleanAttribute,
  });

  @HostBinding('attr.aria-disabled')
  protected get ariaDisabledAttr(): 'true' | null {
    return this.isDisabled() ? 'true' : null;
  }

  @HostBinding('attr.data-disabled')
  protected get dataDisabledAttr(): '' | null {
    return this.isDisabled() ? '' : null;
  }

  @HostBinding('attr.disabled')
  protected get disabledAttr(): '' | null {
    return this.isDisabled() ? '' : null;
  }

  @HostBinding('attr.type')
  protected readonly typeAttr = 'button' as const;

  protected isDisabled(): boolean {
    return this.disabled() || this.pagination.disabled();
  }
}

@Directive({
  selector: 'button[tngPaginationFirst]',
  exportAs: 'tngPaginationFirst',
})
export class TngPaginationFirst extends TngPaginationButton {
  @HostBinding('attr.data-slot')
  protected readonly dataSlot = 'pagination-first' as const;

  protected override isDisabled(): boolean {
    return super.isDisabled() || this.pagination.isFirstPage();
  }

  @HostListener('click')
  protected onClick(): void {
    if (this.isDisabled()) {
      return;
    }

    this.pagination.firstPage();
  }
}

@Directive({
  selector: 'button[tngPaginationPrevious]',
  exportAs: 'tngPaginationPrevious',
})
export class TngPaginationPrevious extends TngPaginationButton {
  @HostBinding('attr.data-slot')
  protected readonly dataSlot = 'pagination-previous' as const;

  protected override isDisabled(): boolean {
    return super.isDisabled() || !this.pagination.canGoToPreviousPage();
  }

  @HostListener('click')
  protected onClick(): void {
    if (this.isDisabled()) {
      return;
    }

    this.pagination.previousPage();
  }
}

@Directive({
  selector: 'button[tngPaginationNext]',
  exportAs: 'tngPaginationNext',
})
export class TngPaginationNext extends TngPaginationButton {
  @HostBinding('attr.data-slot')
  protected readonly dataSlot = 'pagination-next' as const;

  protected override isDisabled(): boolean {
    return super.isDisabled() || !this.pagination.canGoToNextPage();
  }

  @HostListener('click')
  protected onClick(): void {
    if (this.isDisabled()) {
      return;
    }

    this.pagination.nextPage();
  }
}

@Directive({
  selector: 'button[tngPaginationLast]',
  exportAs: 'tngPaginationLast',
})
export class TngPaginationLast extends TngPaginationButton {
  @HostBinding('attr.data-slot')
  protected readonly dataSlot = 'pagination-last' as const;

  protected override isDisabled(): boolean {
    return super.isDisabled() || this.pagination.isLastPage();
  }

  @HostListener('click')
  protected onClick(): void {
    if (this.isDisabled()) {
      return;
    }

    this.pagination.lastPage();
  }
}

@Directive({
  selector: 'button[tngPaginationPage]',
  exportAs: 'tngPaginationPage',
})
export class TngPaginationPage extends TngPaginationButton {
  public readonly page = input.required<number, unknown>({
    alias: 'tngPaginationPage',
    transform: normalizePageIndexInput,
  });

  @HostBinding('attr.aria-current')
  protected get ariaCurrentAttr(): 'page' | null {
    return this.isCurrentPage() ? 'page' : null;
  }

  @HostBinding('attr.data-current')
  protected get dataCurrentAttr(): '' | null {
    return this.isCurrentPage() ? '' : null;
  }

  @HostBinding('attr.data-slot')
  protected readonly dataSlot = 'pagination-page' as const;

  @HostListener('click')
  protected onClick(): void {
    if (this.isDisabled()) {
      return;
    }

    this.pagination.setPageIndex(this.page(), 'page');
  }

  private isCurrentPage(): boolean {
    return this.pagination.state().pageIndex === this.page();
  }

  protected override isDisabled(): boolean {
    return super.isDisabled() || !this.pagination.canGoToPage(this.page());
  }
}

@Directive({
  selector: 'select[tngPaginationPageSize]',
  exportAs: 'tngPaginationPageSize',
})
export class TngPaginationPageSize {
  private readonly pagination = inject(TngPagination);
  private readonly hostRef = inject<ElementRef<HTMLSelectElement>>(ElementRef);

  @HostBinding('attr.data-slot')
  protected readonly dataSlot = 'pagination-page-size' as const;

  @HostBinding('disabled')
  protected get disabledProp(): boolean {
    return this.pagination.disabled();
  }

  @HostBinding('value')
  protected get valueProp(): string {
    return String(this.pagination.state().pageSize);
  }

  @HostListener('change')
  protected onChange(): void {
    this.pagination.setPageSize(normalizePageSizeInput(this.hostRef.nativeElement.value), 'size');
  }
}
