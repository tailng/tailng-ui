import { AfterViewInit, Component, inject, signal } from '@angular/core';
import { TngCol, TngTable } from '@tociva/tailng-ui/table';
import { TngCodeBlock } from '@tociva/tailng-ui/utilities';
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
  selector: 'docs-menu-api',
  templateUrl: './menu-api.component.html',
  imports: [TngCodeBlock, TngTable, TngCol],
})
export class MenuApiComponent implements AfterViewInit {
  private shiki = inject(ShikiHighlighterService);
  readonly highlighter = new TngShikiAdapter(this.shiki);
  readonly importExample = () =>
    `import { TngMenu, TngMenuItem, TngMenuTemplate } from '@tociva/tailng-ui/navigation';`;

  private readonly inputSeed: DisplayDetails[] = [
    { property: 'modal', type: 'boolean', default: 'false', description: 'Show backdrop; close on outside click / escape' },
    { property: 'placement', type: 'TngMenuPlacement', default: "'bottom-start'", description: 'bottom-start | bottom-end | top-start | top-end' },
    { property: 'offset', type: 'number', default: '6', description: 'Gap between trigger and panel' },
    { property: 'width', type: "'anchor' | number", default: "'anchor'", description: 'Panel width' },
    { property: 'closeOnOutsideClick', type: 'boolean', default: 'true', description: 'Close when clicking outside' },
    { property: 'closeOnEscape', type: 'boolean', default: 'true', description: 'Close on Escape' },
    { property: 'closeOnItemClick', type: 'boolean', default: 'true', description: 'Close when tngMenuItem is clicked' },
  ];

  private readonly klassSeed: DisplayDetails[] = [
    { property: 'rootKlass', type: 'string', default: "'relative inline-block'", description: 'Root wrapper' },
    { property: 'triggerKlass', type: 'string', default: "'inline-flex'", description: 'Trigger button wrapper' },
    { property: 'panelKlass', type: 'string', default: "'p-1'", description: 'Menu panel' },
    { property: 'backdropKlass', type: 'string', default: "'fixed inset-0 bg-black/40 z-[999]'", description: 'Backdrop when modal' },
  ];

  private readonly outputSeed: DisplayDetails[] = [
    { property: 'opened', type: 'void', default: '', description: 'Emitted when menu opens' },
    { property: 'closed', type: 'MenuCloseReason', default: '', description: 'Emitted when menu closes (selection | outside-click | escape | programmatic)' },
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
