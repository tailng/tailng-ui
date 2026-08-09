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

type SliderDocSectionId = 'api' | 'examples' | 'overview' | 'styling';

const sliderDocSectionIds: readonly SliderDocSectionId[] = [
  'overview',
  'api',
  'styling',
  'examples',
] as const;

const defaultSliderDocSection: SliderDocSectionId = 'overview';

function isSliderDocSectionId(value: string): value is SliderDocSectionId {
  return sliderDocSectionIds.includes(value as SliderDocSectionId);
}

@Component({
  selector: 'app-slider-page',
  imports: [RouterOutlet, DocsComponentSectionTabsComponent, DocsComponentSectionOutlineComponent],
  templateUrl: './slider-page.component.html',
})
export class SliderPageComponent {
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

  public readonly activeSection = computed<SliderDocSectionId>(() => {
    const section = this.resolveSectionFromUrl(this.currentUrl());
    return section ?? defaultSliderDocSection;
  });
  private readonly docsItem = this.route.snapshot.data['item'] as
    | { slug?: string; title?: string }
    | undefined;
  private readonly docsItemSlug = this.docsItem?.slug ?? '';
  private readonly docsItemTitle = this.docsItem?.title ?? 'Component';
  public readonly outlineItems = computed(() => {
    return getDocsComponentSectionOutlineItems(this.docsItemSlug, this.activeSection());
  });
  public readonly outlineTitle = computed(() => {
    return getDocsComponentSectionOutlineTitle(this.activeSection());
  });
  public readonly outlineAriaLabel = computed(() => {
    return getDocsComponentSectionOutlineAriaLabel(this.docsItemTitle, this.activeSection());
  });

  private resolveSectionFromUrl(rawUrl: string): SliderDocSectionId | null {
    const path = this.normalizeUrl(rawUrl);
    const segments = path.split('/').filter((segment) => segment.length > 0);
    if (segments.length < 4) {
      return null;
    }

    const section = segments[3];
    if (section === undefined || !isSliderDocSectionId(section)) {
      return null;
    }

    return section;
  }

  private normalizeUrl(rawUrl: string): string {
    const queryIndex = rawUrl.indexOf('?');
    const hashIndex = rawUrl.indexOf('#');
    let endIndex = rawUrl.length;

    if (queryIndex >= 0) {
      endIndex = Math.min(endIndex, queryIndex);
    }

    if (hashIndex >= 0) {
      endIndex = Math.min(endIndex, hashIndex);
    }

    const normalized = rawUrl.slice(0, endIndex);
    if (normalized.length > 1 && normalized.endsWith('/')) {
      return normalized.slice(0, -1);
    }

    return normalized;
  }
}
