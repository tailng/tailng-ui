import { AfterViewInit, Component, inject, signal } from '@angular/core';
import { TngCol, TngTable } from '@tailng-ui/ui/table';
import { TngCodeBlock } from '@tailng-ui/ui/utilities';
import { ShikiHighlighterService } from '../../../../../shared/shiki-highlighter.service';
import { TngShikiAdapter } from '../../../../../shared/tng-shiki.adapter';

type DisplayDetails = { property: string; type: string; default?: string; description: string };

@Component({
  standalone: true,
  selector: 'docs-sidenav-api',
  templateUrl: './sidenav-api.component.html',
  imports: [TngCodeBlock, TngTable, TngCol],
})
export class SidenavApiComponent implements AfterViewInit {
  private shiki = inject(ShikiHighlighterService);
  readonly highlighter = new TngShikiAdapter(this.shiki);
  readonly importExample = () =>
    `import { TngSidenav, TngSidenavHeaderSlot, TngSidenavFooterSlot } from '@tailng-ui/ui/navigation';`;

  private readonly inputSeed: DisplayDetails[] = [
    { property: 'collapsed', type: 'boolean', default: 'false', description: 'Narrow (icon) vs expanded width' },
  ];
  private readonly klassSeed: DisplayDetails[] = [
    { property: 'rootKlass', type: 'string', default: 'group h-full...', description: 'Root nav element' },
    { property: 'expandedKlass', type: 'string', default: "'w-64'", description: 'Width when expanded' },
    { property: 'collapsedKlass', type: 'string', default: "'w-16'", description: 'Width when collapsed' },
    { property: 'contentKlass', type: 'string', default: "'flex-1 overflow-auto'", description: 'Main content wrapper' },
    { property: 'footerKlass', type: 'string', default: "'border-t border-border'", description: 'Footer wrapper' },
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
