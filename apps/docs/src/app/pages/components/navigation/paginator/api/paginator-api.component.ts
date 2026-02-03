import { AfterViewInit, Component, inject, signal } from '@angular/core';
import { TngCol, TngTable } from '@tociva/tailng-ui/table';
import { TngCodeBlock } from '@tociva/tailng-ui/utilities';
import { ShikiHighlighterService } from '../../../../../shared/shiki-highlighter.service';
import { TngShikiAdapter } from '../../../../../shared/tng-shiki.adapter';

type DisplayDetails = { property: string; type: string; default?: string; description: string };

@Component({
  standalone: true,
  selector: 'docs-paginator-api',
  templateUrl: './paginator-api.component.html',
  imports: [TngCodeBlock, TngTable, TngCol],
})
export class PaginatorApiComponent implements AfterViewInit {
  private shiki = inject(ShikiHighlighterService);
  readonly highlighter = new TngShikiAdapter(this.shiki);
  readonly importExample = () => `import { TngPaginator, TngPaginatorChange } from '@tociva/tailng-ui/navigation';`;

  private readonly inputSeed: DisplayDetails[] = [
    { property: 'count', type: 'number', default: '0', description: 'Total items' },
    { property: 'page', type: 'number', default: '1', description: 'Current page (1-based)' },
    { property: 'pageSize', type: 'number', default: '10', description: 'Items per page' },
    { property: 'pageSizeOptions', type: 'number[]', default: '[10,20,50,100]', description: 'Page size dropdown options' },
    { property: 'hidePageSize', type: 'boolean', default: 'false', description: 'Hide page size selector' },
    { property: 'maxPages', type: 'number', default: '7', description: 'Max visible page buttons' },
  ];
  private readonly klassSeed: DisplayDetails[] = [
    { property: 'rootKlass', type: 'string', default: "'flex flex-wrap...'", description: 'Root' },
    { property: 'leftKlass', type: 'string', default: "'text-muted-foreground'", description: 'Left (range text)' },
    { property: 'rightKlass', type: 'string', default: "'flex flex-wrap...'", description: 'Right (controls)' },
    { property: 'buttonKlass', type: 'string', default: '...', description: 'First/prev/next/last buttons' },
    { property: 'activePageKlass', type: 'string', default: "'bg-primary...'", description: 'Active page button' },
    { property: 'pageKlass', type: 'string', default: '...', description: 'Page number buttons' },
    { property: 'selectKlass', type: 'string', default: '...', description: 'Page size select' },
  ];
  private readonly outputSeed: DisplayDetails[] = [
    { property: 'pageChange', type: 'number', default: '', description: 'Emitted when page changes' },
    { property: 'pageSizeChange', type: 'number', default: '', description: 'Emitted when page size changes' },
    { property: 'change', type: 'TngPaginatorChange', default: '', description: 'Unified: { page, pageSize, skip }' },
  ];

  readonly inputRows = signal<DisplayDetails[]>(this.inputSeed);
  readonly klassRows = signal<DisplayDetails[]>(this.klassSeed);
  readonly outputRows = signal<DisplayDetails[]>(this.outputSeed);
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
