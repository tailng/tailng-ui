import { AfterViewInit, Component, inject, signal } from '@angular/core';
import { TngCol, TngTable } from '@tociva/tailng-ui/table';
import { TngCodeBlock } from '@tociva/tailng-ui/utilities';
import { ShikiHighlighterService } from '../../../../../shared/shiki-highlighter.service';
import { TngShikiAdapter } from '../../../../../shared/tng-shiki.adapter';

type DisplayDetails = { property: string; type: string; default?: string; description: string };

@Component({
  standalone: true,
  selector: 'docs-drawer-api',
  templateUrl: './drawer-api.component.html',
  imports: [TngCodeBlock, TngTable, TngCol],
})
export class DrawerApiComponent implements AfterViewInit {
  private shiki = inject(ShikiHighlighterService);
  readonly highlighter = new TngShikiAdapter(this.shiki);
  readonly importExample = () => `import { TngDrawer } from '@tociva/tailng-ui/navigation';`;

  private readonly inputSeed: DisplayDetails[] = [
    { property: 'open', type: 'boolean', default: 'false', description: 'Controlled open state' },
    { property: 'placement', type: 'TngDrawerPlacement', default: "'left'", description: 'left | right | top | bottom' },
    { property: 'closeOnBackdropClick', type: 'boolean', default: 'true', description: 'Close on backdrop click' },
    { property: 'closeOnEscape', type: 'boolean', default: 'true', description: 'Close on Escape' },
    { property: 'trapFocus', type: 'boolean', default: 'true', description: 'Focus trap when open' },
  ];
  private readonly klassSeed: DisplayDetails[] = [
    { property: 'backdropKlass', type: 'string', default: 'fixed inset-0...', description: 'Backdrop' },
    { property: 'panelKlass', type: 'string', default: "'bg-bg shadow-xl outline-none'", description: 'Panel' },
    { property: 'sizeKlass', type: 'string', default: "'w-80'", description: 'Width (left/right)' },
    { property: 'heightKlass', type: 'string', default: "'h-80'", description: 'Height (top/bottom)' },
  ];
  private readonly outputSeed: DisplayDetails[] = [
    { property: 'opened', type: 'void', default: '', description: 'Emitted when drawer opens' },
    { property: 'closed', type: 'DrawerCloseReason', default: '', description: 'Emitted when drawer closes' },
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
