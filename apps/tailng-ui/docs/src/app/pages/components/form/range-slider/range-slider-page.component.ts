import { Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { filter, map, startWith } from 'rxjs/operators';
import { DocsComponentSectionTabsComponent } from '../../../../shared/component-section-tabs/docs-component-section-tabs.component';
import {
  getDocsComponentSectionOutlineAriaLabel,
  getDocsComponentSectionOutlineItems,
  getDocsComponentSectionOutlineTitle,
} from '../../../../shared/section-outline/component-section-outline.data';
import { DocsComponentSectionOutlineComponent } from '../../../../shared/section-outline/docs-component-section-outline.component';

type RangeSliderDocSectionId = 'api' | 'examples' | 'overview' | 'styling';

const sectionIds: readonly RangeSliderDocSectionId[] = ['overview', 'api', 'styling', 'examples'];

function isSectionId(value: string): value is RangeSliderDocSectionId {
  return sectionIds.includes(value as RangeSliderDocSectionId);
}

@Component({
  selector: 'app-range-slider-page',
  imports: [RouterOutlet, DocsComponentSectionTabsComponent, DocsComponentSectionOutlineComponent],
  templateUrl: './range-slider-page.component.html',
})
export class RangeSliderPageComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly currentUrl = toSignal(
    this.router.events.pipe(
      filter((event): event is NavigationEnd => event instanceof NavigationEnd),
      map((event) => event.urlAfterRedirects),
      startWith(this.router.url),
    ),
    { initialValue: this.router.url },
  );
  private readonly docsItem = this.route.snapshot.data['item'] as
    | { slug?: string; title?: string }
    | undefined;

  public readonly activeSection = computed<RangeSliderDocSectionId>(() => {
    const path = this.currentUrl().split(/[?#]/u, 1)[0] ?? '';
    const section = path.split('/').filter(Boolean)[3];
    return section !== undefined && isSectionId(section) ? section : 'overview';
  });
  public readonly outlineItems = computed(() =>
    getDocsComponentSectionOutlineItems(this.docsItem?.slug ?? '', this.activeSection()),
  );
  public readonly outlineTitle = computed(() =>
    getDocsComponentSectionOutlineTitle(this.activeSection()),
  );
  public readonly outlineAriaLabel = computed(() =>
    getDocsComponentSectionOutlineAriaLabel(
      this.docsItem?.title ?? 'Range Slider',
      this.activeSection(),
    ),
  );
}
