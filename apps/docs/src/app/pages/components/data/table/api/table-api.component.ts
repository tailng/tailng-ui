import { AfterViewInit, Component, inject, signal } from '@angular/core';
import { TngCol, TngTable } from '@tailng-ui/ui/table';
import { TngCodeBlock } from '@tailng-ui/ui/utilities';
import { ShikiHighlighterService } from '../../../../../shared/shiki-highlighter.service';
import { TngShikiAdapter } from '../../../../../shared/tng-shiki.adapter';

type DisplayDetails = {
  property: string;
  type: string;
  default?: string;
  description: string;
};

@Component({
  standalone: true,
  selector: 'docs-table-api',
  templateUrl: './table-api.component.html',
  imports: [TngCodeBlock, TngTable, TngCol],
})
export class TableApiComponent implements AfterViewInit {
  private shiki = inject(ShikiHighlighterService);
  readonly highlighter = new TngShikiAdapter(this.shiki);
  readonly importExample = () =>
    `import { TngTable, TngCol, TngCellDef, TngHeaderDef } from '@tailng-ui/ui/table';`;

  private readonly tableInputSeed: DisplayDetails[] = [
    { property: 'rows', type: 'T[]', default: '[]', description: 'Data array' },
    { property: 'rowKey', type: 'string | null', default: 'null', description: 'Key for trackBy (e.g. id)' },
    { property: 'sortMode', type: "'client' | 'server'", default: "'client'", description: 'Client or server-side sort' },
    { property: 'emptyText', type: 'string', default: "'No data'", description: 'Shown when rows are empty' },
  ];

  private readonly tableKlassSeed: DisplayDetails[] = [
    { property: 'tableKlass', type: 'string', default: "'w-full text-sm'", description: 'Table element' },
    { property: 'theadKlass', type: 'string', default: "'bg-alternate-background'", description: 'thead' },
    { property: 'thKlass', type: 'string', default: "'px-3 py-2 text-left...'", description: 'Header cells' },
    { property: 'tdKlass', type: 'string', default: "'px-3 py-2 border-b...'", description: 'Body cells' },
    { property: 'tbodyKlass', type: 'string', default: "'bg-bg'", description: 'tbody' },
  ];

  private readonly tableOutputSeed: DisplayDetails[] = [
    { property: 'sortChange', type: 'TngSort', default: '', description: 'Emitted when sort changes (active, direction)' },
  ];

  private readonly colInputSeed: DisplayDetails[] = [
    { property: 'id', type: 'string', default: '(required)', description: 'Column id' },
    { property: 'header', type: 'string', default: "''", description: 'Header label' },
    { property: 'value', type: '((row: T) => unknown) | null', default: 'null', description: 'Value accessor' },
    { property: 'width', type: 'string | null', default: 'null', description: 'e.g. 120px, 20%' },
    { property: 'align', type: "'left' | 'right' | 'center'", default: "'left'", description: 'Cell alignment' },
    { property: 'klass', type: 'string | null', default: 'null', description: 'Extra classes for th/td' },
  ];

  readonly tableInputRows = signal<DisplayDetails[]>(this.tableInputSeed);
  readonly tableKlassRows = signal<DisplayDetails[]>(this.tableKlassSeed);
  readonly tableOutputRows = signal<DisplayDetails[]>(this.tableOutputSeed);
  readonly colInputRows = signal<DisplayDetails[]>(this.colInputSeed);

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
