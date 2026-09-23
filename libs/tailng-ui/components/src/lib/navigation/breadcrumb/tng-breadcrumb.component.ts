import {
  Component,
  ContentChild,
  ContentChildren,
  computed,
  effect,
  input,
  TemplateRef,
  type AfterContentInit,
  type OnDestroy,
  type QueryList,
} from '@angular/core';
import { TngBreadcrumb as TngBreadcrumbPrimitive } from '@tailng-ui/primitives';
import { merge, Subscription } from 'rxjs';
import { TngBreadcrumbItemComponent, type TngBreadcrumbItemDisplayMode } from './tng-breadcrumb-item.component';
import { TngBreadcrumbListComponent } from './tng-breadcrumb-list.component';
import { TngBreadcrumbSeparatorTemplateDirective } from './tng-breadcrumb-separator-template.directive';

@Component({
  selector: 'tng-breadcrumb',
  imports: [TngBreadcrumbPrimitive, TngBreadcrumbListComponent],
  templateUrl: './tng-breadcrumb.component.html',
  styleUrl: './tng-breadcrumb.component.css',
})
export class TngBreadcrumbComponent implements AfterContentInit, OnDestroy {
  @ContentChildren(TngBreadcrumbItemComponent, { descendants: true })
  private readonly breadcrumbItems?: QueryList<TngBreadcrumbItemComponent>;

  @ContentChild(TngBreadcrumbSeparatorTemplateDirective, { read: TemplateRef })
  private readonly separatorTemplate?: TemplateRef<unknown>;

  public readonly ariaLabel = input<string | null>('Breadcrumb');
  public readonly separator = input('/');
  public readonly maxItems = input<number | null>(null);
  public readonly itemsBeforeCollapse = input(1);
  public readonly itemsAfterCollapse = input(2);
  public readonly collapseLabel = input('More');

  protected readonly resolvedAriaLabel = computed(() => {
    const ariaLabel = this.ariaLabel();
    if (ariaLabel === null) {
      return 'Breadcrumb';
    }

    const trimmedAriaLabel = ariaLabel.trim();
    return trimmedAriaLabel.length > 0 ? trimmedAriaLabel : 'Breadcrumb';
  });

  private itemStateSubscriptions = Subscription.EMPTY;
  private readonly queryListSubscriptions = new Subscription();

  public constructor() {
    effect(() => {
      this.separator();
      this.maxItems();
      this.itemsBeforeCollapse();
      this.itemsAfterCollapse();
      this.collapseLabel();
      this.syncItems();
    });
  }

  public ngAfterContentInit(): void {
    this.rebindItemStateSubscriptions();
    if (this.breadcrumbItems === undefined) {
      return;
    }

    this.queryListSubscriptions.add(
      this.breadcrumbItems.changes.subscribe(() => {
        this.rebindItemStateSubscriptions();
      }),
    );
  }

  public ngOnDestroy(): void {
    this.itemStateSubscriptions.unsubscribe();
    this.queryListSubscriptions.unsubscribe();
  }

  private rebindItemStateSubscriptions(): void {
    this.itemStateSubscriptions.unsubscribe();

    const items = this.breadcrumbItems?.toArray() ?? [];
    if (items.length === 0) {
      this.syncItems();
      return;
    }

    this.itemStateSubscriptions = merge(
      ...items.map((item) => item.stateChanges),
    ).subscribe(() => {
      this.syncItems();
    });

    this.syncItems();
  }

  private syncItems(): void {
    const items = this.breadcrumbItems?.toArray() ?? [];
    if (items.length === 0) {
      return;
    }

    const currentIndex = this.resolveCurrentIndex(items);
    const displayModes = this.resolveDisplayModes(items, currentIndex);
    const visibleIndices = this.resolveVisibleIndices(displayModes);

    for (let index = 0; index < items.length; index += 1) {
      const item = items[index];
      const isVisible = displayModes[index] !== 'hidden';
      const isLastVisibleItem = !visibleIndices.some((visibleIndex) => visibleIndex > index);

      item.setResolvedCurrent(index === currentIndex);
      item.setDisplayMode(displayModes[index], this.collapseLabel());
      item.setSeparator(this.separator(), isVisible && !isLastVisibleItem, this.separatorTemplate ?? null);
    }
  }

  private resolveCurrentIndex(items: readonly TngBreadcrumbItemComponent[]): number {
    const explicitlyCurrentIndices = items.reduce<number[]>((accumulator, item, index) => {
      if (item.current()) {
        accumulator.push(index);
      }
      return accumulator;
    }, []);

    if (explicitlyCurrentIndices.length > 0) {
      return explicitlyCurrentIndices[explicitlyCurrentIndices.length - 1];
    }

    if (items.length === 1) {
      return 0;
    }

    return -1;
  }

  private resolveDisplayModes(
    items: readonly TngBreadcrumbItemComponent[],
    currentIndex: number,
  ): readonly TngBreadcrumbItemDisplayMode[] {
    const itemCount = items.length;
    const maxItems = this.maxItems();
  
    if (maxItems === null || maxItems < 1 || itemCount <= maxItems) {
      return Array.from({ length: itemCount }, () => 'visible' as const);
    }
  
    const before = Math.max(1, Math.floor(this.itemsBeforeCollapse()));
    const after = Math.max(1, Math.floor(this.itemsAfterCollapse()));
    const afterStart = Math.max(0, itemCount - after);
  
    let ellipsisPlaced = false;
  
    return Array.from(
      { length: itemCount },
      (_, index): TngBreadcrumbItemDisplayMode => {
        if (index < before || index >= afterStart || index === currentIndex) {
          return 'visible';
        }
  
        if (!ellipsisPlaced) {
          ellipsisPlaced = true;
          return 'ellipsis';
        }
  
        return 'hidden';
      },
    );
  }

  private resolveVisibleIndices(displayModes: readonly TngBreadcrumbItemDisplayMode[]): readonly number[] {
    const visibleIndices: number[] = [];
    for (let index = 0; index < displayModes.length; index += 1) {
      if (displayModes[index] !== 'hidden') {
        visibleIndices.push(index);
      }
    }
    return visibleIndices;
  }
}
export { TngBreadcrumbComponent as TngBreadcrumb };
