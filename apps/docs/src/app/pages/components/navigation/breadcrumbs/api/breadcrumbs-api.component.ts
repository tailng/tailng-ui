import { AfterViewInit, Component, inject, signal } from '@angular/core';
import { TngCol, TngTable } from '@tociva/tailng-ui/table';
import { TngCodeBlock } from '@tociva/tailng-ui/utilities';
import { ShikiHighlighterService } from '../../../../../shared/shiki-highlighter.service';
import { TngShikiAdapter } from '../../../../../shared/tng-shiki.adapter';

type DisplayDetails = { property: string; type: string; default?: string; description: string };

@Component({
  standalone: true,
  selector: 'docs-breadcrumbs-api',
  templateUrl: './breadcrumbs-api.component.html',
  imports: [TngCodeBlock, TngTable, TngCol],
})
export class BreadcrumbsApiComponent implements AfterViewInit {
  private shiki = inject(ShikiHighlighterService);
  readonly highlighter = new TngShikiAdapter(this.shiki);
  readonly importExample = () => `import { TngBreadcrumbs, TngBreadcrumbItem } from '@tociva/tailng-ui/navigation';`;

  private readonly inputSeed: DisplayDetails[] = [
    { property: 'items', type: 'TngBreadcrumbItem[]', default: '[]', description: 'Breadcrumb items' },
    { property: 'home', type: 'TngBreadcrumbItem | null', default: 'null', description: 'Optional first (home) item' },
    { property: 'separator', type: 'string', default: "'/'", description: 'Separator between items' },
    { property: 'ariaLabel', type: 'string', default: "'Breadcrumb'", description: 'a11y label' },
  ];
  private readonly klassSeed: DisplayDetails[] = [
    { property: 'rootKlass', type: 'string', default: "'flex items-center text-sm...'", description: 'Root' },
    { property: 'listKlass', type: 'string', default: "'flex items-center flex-wrap gap-1'", description: 'List' },
    { property: 'itemKlass', type: 'string', default: "'inline-flex items-center'", description: 'Item' },
    { property: 'linkKlass', type: 'string', default: "'text-primary hover:underline'", description: 'Link' },
    { property: 'currentKlass', type: 'string', default: "'text-foreground font-medium'", description: 'Current item' },
    { property: 'disabledKlass', type: 'string', default: "'opacity-60 pointer-events-none'", description: 'Disabled item' },
    { property: 'separatorKlass', type: 'string', default: "'mx-2 text-slate-400'", description: 'Separator' },
  ];

  readonly inputRows = signal<DisplayDetails[]>(this.inputSeed);
  readonly klassRows = signal<DisplayDetails[]>(this.klassSeed);
  readonly property = (r: DisplayDetails) => r.property;
  readonly type = (r: DisplayDetails) => r.type;
  readonly default = (r: DisplayDetails) => r.default ?? '—';
  readonly description = (r: DisplayDetails) => r.description;

  ngAfterViewInit() {
    const sections = document.querySelectorAll('section[id], div[id]');
    const links = document.querySelectorAll('.scroll-link');
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const id = entry.target.getAttribute('id');
          const link = document.querySelector(`.scroll-link[href="#${id}"]`);
          if (entry.isIntersecting) {
            links.forEach((l) => l.classList.remove('text-blue-500', 'font-semibold'));
            link?.classList.add('text-blue-500', 'font-semibold');
          }
        });
      },
      { rootMargin: '-50% 0px -50% 0px' }
    );
    sections.forEach((s) => observer.observe(s));
  }
}
