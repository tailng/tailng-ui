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

type CodeEditorDocSectionId = 'api' | 'examples' | 'overview' | 'styling';
const sectionIds: readonly CodeEditorDocSectionId[] = ['overview', 'api', 'styling', 'examples'];

@Component({
  selector: 'app-code-editor-page',
  imports: [RouterOutlet, DocsComponentSectionTabsComponent, DocsComponentSectionOutlineComponent],
  templateUrl: './code-editor-page.component.html',
})
export class CodeEditorPageComponent {
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

  public readonly activeSection = computed<CodeEditorDocSectionId>(() => {
    const path = this.currentUrl().split(/[?#]/u, 1)[0] ?? '';
    const section = path.split('/').filter(Boolean)[3];
    return sectionIds.includes(section as CodeEditorDocSectionId)
      ? (section as CodeEditorDocSectionId)
      : 'overview';
  });
  public readonly outlineItems = computed(() =>
    getDocsComponentSectionOutlineItems(this.docsItem?.slug ?? '', this.activeSection()),
  );
  public readonly outlineTitle = computed(() =>
    getDocsComponentSectionOutlineTitle(this.activeSection()),
  );
  public readonly outlineAriaLabel = computed(() =>
    getDocsComponentSectionOutlineAriaLabel(
      this.docsItem?.title ?? 'Code Editor',
      this.activeSection(),
    ),
  );
}
