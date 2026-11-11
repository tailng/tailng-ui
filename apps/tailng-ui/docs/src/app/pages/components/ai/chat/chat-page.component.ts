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

type AiChatDocSectionId = 'api' | 'examples' | 'overview' | 'styling';

const sectionIds: readonly AiChatDocSectionId[] = ['overview', 'api', 'styling', 'examples'];

function isSectionId(value: string): value is AiChatDocSectionId {
  return sectionIds.includes(value as AiChatDocSectionId);
}

@Component({
  selector: 'app-ai-chat-page',
  imports: [RouterOutlet, DocsComponentSectionTabsComponent, DocsComponentSectionOutlineComponent],
  templateUrl: './chat-page.component.html',
})
export class AiChatPageComponent {
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

  public readonly activeSection = computed<AiChatDocSectionId>(() => {
    const rawUrl = this.currentUrl().split(/[?#]/, 1)[0] ?? '';
    const section = rawUrl.split('/').filter(Boolean)[3];
    return section !== undefined && isSectionId(section) ? section : 'overview';
  });

  private readonly docsItem = this.route.snapshot.data['item'] as
    | { slug?: string; title?: string }
    | undefined;
  private readonly docsItemSlug = this.docsItem?.slug ?? 'chat';
  private readonly docsItemTitle = this.docsItem?.title ?? 'AI Chat';

  public readonly outlineItems = computed(() =>
    getDocsComponentSectionOutlineItems(this.docsItemSlug, this.activeSection()),
  );
  public readonly outlineTitle = computed(() =>
    getDocsComponentSectionOutlineTitle(this.activeSection()),
  );
  public readonly outlineAriaLabel = computed(() =>
    getDocsComponentSectionOutlineAriaLabel(this.docsItemTitle, this.activeSection()),
  );
}
