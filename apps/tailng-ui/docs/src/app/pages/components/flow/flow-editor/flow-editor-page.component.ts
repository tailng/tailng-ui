import { computed, Component, inject } from '@angular/core';
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

type FlowEditorDocSectionId = 'api' | 'examples' | 'overview' | 'styling';

const flowEditorDocSectionIds: readonly FlowEditorDocSectionId[] = [
  'overview',
  'api',
  'styling',
  'examples',
];

function isFlowEditorDocSectionId(value: string): value is FlowEditorDocSectionId {
  return flowEditorDocSectionIds.includes(value as FlowEditorDocSectionId);
}

@Component({
  selector: 'app-flow-editor-page',
  imports: [RouterOutlet, DocsComponentSectionTabsComponent, DocsComponentSectionOutlineComponent],
  templateUrl: './flow-editor-page.component.html',
})
export class FlowEditorPageComponent {
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

  public readonly activeSection = computed<FlowEditorDocSectionId>(() => {
    const segments = this.normalizeUrl(this.currentUrl())
      .split('/')
      .filter((segment) => segment.length > 0);
    const section = segments[3];
    return section !== undefined && isFlowEditorDocSectionId(section) ? section : 'overview';
  });
  public readonly outlineItems = computed(() =>
    getDocsComponentSectionOutlineItems(this.docsItem?.slug ?? '', this.activeSection()),
  );
  public readonly outlineTitle = computed(() =>
    getDocsComponentSectionOutlineTitle(this.activeSection()),
  );
  public readonly outlineAriaLabel = computed(() =>
    getDocsComponentSectionOutlineAriaLabel(
      this.docsItem?.title ?? 'Flow Editor',
      this.activeSection(),
    ),
  );

  private normalizeUrl(rawUrl: string): string {
    const queryIndex = rawUrl.indexOf('?');
    const hashIndex = rawUrl.indexOf('#');
    const candidates = [rawUrl.length, queryIndex, hashIndex].filter((index) => index >= 0);
    const normalized = rawUrl.slice(0, Math.min(...candidates));
    return normalized.length > 1 && normalized.endsWith('/') ? normalized.slice(0, -1) : normalized;
  }
}
